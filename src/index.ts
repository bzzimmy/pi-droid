import type { ExtensionAPI, ProviderModelConfig } from "@earendil-works/pi-coding-agent";
import { ENDPOINTS, MODELS, MODELS_BY_ID, type FactoryModel } from "./catalog.ts";

export const PROVIDER_ID = "droid";

const API_HOST = process.env.FACTORY_API_BASE_URL ?? "https://api.factory.ai";

/** Sent as X-Client-Version; Factory rejects requests that omit it. */
const CLIENT_VERSION = process.env.FACTORY_CLIENT_VERSION ?? "0.181.0";

/**
 * Factory's LLM proxy only serves requests whose system prompt *starts with*
 * this exact sentence — 65 characters, case-sensitive, trailing period
 * included. Anything else is rejected with a bare `403 Forbidden` that carries
 * no explanation and looks exactly like an auth failure.
 *
 * The check is a prefix match, so appending is fine and prepending is not:
 * pi's own system prompt goes after this line, never before it.
 */
const MARKER = "You are Droid, an AI software engineering agent built by Factory.";

function baseUrlFor(model: FactoryModel): string {
  // Each api type maps to a different Factory endpoint. pi appends the
  // API-specific suffix (/v1/messages, /chat/completions, /responses), so we
  // hand it the prefix each SDK expects.
  return model.api === "anthropic-messages"
    ? `${API_HOST}/api/llm/a`
    : `${API_HOST}/api/llm/o/v1`;
}

function toPiModel(model: FactoryModel): ProviderModelConfig {
  return {
    id: model.id,
    name: model.name,
    api: model.api,
    baseUrl: baseUrlFor(model),
    reasoning: model.reasoning,
    ...(model.thinkingLevelMap ? { thinkingLevelMap: model.thinkingLevelMap } : {}),
    input: model.input as ("text" | "image")[],
    contextWindow: model.contextWindow,
    maxTokens: model.maxTokens,
    // Usage is drawn from the Factory subscription's token allowance rather
    // than billed per token, so there is no meaningful per-token rate to report.
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    // `x-api-provider` selects the upstream backend and is required by the
    // chat-completions and messages endpoints (the responses endpoint rejects
    // it). `anthropic-beta` unlocks per-model request fields such as
    // `output_config.effort`, which is otherwise refused as an unknown input.
    ...(model.provider || model.betaFlags.length
      ? {
          headers: {
            ...(model.provider ? { "x-api-provider": model.provider } : {}),
            ...(model.betaFlags.length ? { "anthropic-beta": model.betaFlags.join(",") } : {}),
          },
        }
      : {}),
    // Factory serves Claude via Bedrock, which rejects the newer per-tool
    // `eager_input_streaming` field. pi falls back to the legacy
    // fine-grained-tool-streaming beta header, which Bedrock does accept.
    ...(model.api === "anthropic-messages"
      ? { compat: { supportsEagerToolInputStreaming: false } }
      : {}),
  };
}

/** Does this system prompt already satisfy Factory's prefix check? */
function isMarked(text: string): boolean {
  return text.startsWith(MARKER);
}

/**
 * pi opens its system prompt by declaring its own identity, which collides with
 * MARKER: the model would be told it is Droid and then immediately told it is
 * something else. Factory also refuses requests carrying this exact sentence.
 *
 * Reword rather than delete. The rest of pi's prompt refers to pi throughout
 * (there is a whole documentation section about it), so dropping the sentence
 * outright leaves those references dangling with nothing to attach to. Keeping
 * the harness context but not the competing "you are an assistant" claim gives
 * a prompt that reads coherently: Droid, running inside pi.
 */
const PI_IDENTITY =
  /^You are an expert coding assistant operating inside pi, a coding agent harness\./;
const PI_IDENTITY_REWORDED = "You are operating inside pi, a coding agent harness.";

function reconcileIdentity(text: string): string {
  return text.replace(PI_IDENTITY, PI_IDENTITY_REWORDED);
}

/** Apply `reconcileIdentity` to a message content value of any supported shape. */
function reconcileContent(content: unknown): unknown {
  if (typeof content === "string") return reconcileIdentity(content);
  if (Array.isArray(content)) {
    for (const part of content) {
      if (part && typeof part.text === "string") part.text = reconcileIdentity(part.text);
    }
  }
  return content;
}

function prefix(text: string | undefined): string {
  if (!text) return MARKER;
  // Strip an existing marker first so this stays idempotent across retries.
  const rest = isMarked(text) ? text.slice(MARKER.length).replace(/^\s+/, "") : text;
  const body = reconcileIdentity(rest);
  return body ? `${MARKER}\n\n${body}` : MARKER;
}

/**
 * Prepend the marker to whichever field carries the system prompt for `api`.
 * Mutates in place and returns the payload.
 *
 * The API is passed in rather than sniffed from the payload: an Anthropic
 * request and a Chat Completions request with no system prompt are
 * indistinguishable by shape, and guessing wrong puts the marker in a field the
 * endpoint ignores — which reads as a 403 with no explanation.
 */
export function injectMarker(payload: unknown, api: FactoryModel["api"]): unknown {
  if (!payload || typeof payload !== "object") return payload;
  const body = payload as Record<string, any>;

  if (api === "openai-responses") {
    // Factory reads the marker from `instructions` only — a `developer` item
    // carrying it is not enough — but pi puts its prompt in the input array, so
    // that copy still has to be reconciled.
    body.instructions = prefix(
      typeof body.instructions === "string" ? body.instructions : undefined,
    );
    if (Array.isArray(body.input)) {
      for (const item of body.input) {
        if (item?.role !== "developer" && item?.role !== "system") continue;
        item.content = reconcileContent(item.content);
      }
    }
    return body;
  }

  if (api === "anthropic-messages") {
    if (Array.isArray(body.system)) {
      reconcileContent(body.system);
      const first = body.system[0];
      if (first && typeof first.text === "string") first.text = prefix(first.text);
      else body.system.unshift({ type: "text", text: MARKER });
      return body;
    }
    body.system = prefix(typeof body.system === "string" ? body.system : undefined);
    return body;
  }

  // openai-completions. pi puts its instructions in a `developer` message
  // rather than a `system` one, so reconcile identity across both roles, then
  // guarantee a leading `system` message carrying the marker — Factory only
  // accepts the marker in a `system` message, not a `developer` one.
  if (!Array.isArray(body.messages)) body.messages = [];

  for (const message of body.messages) {
    if (message?.role !== "system" && message?.role !== "developer") continue;
    message.content = reconcileContent(message.content);
  }

  const systemMessage = body.messages.find((m: any) => m?.role === "system");
  if (!systemMessage) {
    body.messages.unshift({ role: "system", content: MARKER });
    return body;
  }
  if (typeof systemMessage.content === "string") {
    systemMessage.content = prefix(systemMessage.content);
  } else if (Array.isArray(systemMessage.content)) {
    const part = systemMessage.content[0];
    if (part && typeof part.text === "string") part.text = prefix(part.text);
    else systemMessage.content.unshift({ type: "text", text: MARKER });
  }
  return body;
}

/**
 * Rewrite pi's thinking parameters into the shape Factory expects.
 *
 * pi emits stock Anthropic `thinking: { type: "enabled", budget_tokens }`, but
 * Factory's newer Claude models require `type: "adaptive"` plus an
 * `output_config.effort`, and reject the stock form outright. Which shape a
 * model wants is recorded per model in the catalog.
 */
export function applyThinking(
  payload: unknown,
  model: FactoryModel,
  level: string | undefined,
): void {
  if (model.api !== "anthropic-messages") return; // OpenAI paths use reasoning_effort
  if (!payload || typeof payload !== "object") return;
  const body = payload as Record<string, any>;

  if (model.thinking === "none" || !body.thinking) return;

  // Effort name this model accepts, via the catalog's level map.
  const effort =
    (level && model.thinkingLevelMap?.[level]) ?? model.defaultEffort ?? "high";
  const budget = body.thinking?.budget_tokens;

  switch (model.thinking) {
    // Stock Anthropic shape. pi may attach `display` for summarised thinking,
    // which these older Bedrock models reject, so normalise to the two fields
    // they accept. `enabled-effort` is the same plus an effort hint.
    case "enabled":
    case "enabled-effort":
      body.thinking = { type: "enabled", ...(budget ? { budget_tokens: budget } : {}) };
      if (model.thinking === "enabled-effort") body.output_config = { effort };
      break;
    // Newer models take an adaptive budget and reject the stock shape outright.
    case "adaptive":
    case "adaptive-summarized":
      body.thinking = {
        type: "adaptive",
        ...(model.thinking === "adaptive-summarized" ? { display: "summarized" } : {}),
      };
      body.output_config = { effort };
      break;
  }
}

export default function droidProvider(pi: ExtensionAPI): void {
  pi.registerProvider(PROVIDER_ID, {
    name: "Factory Droid",
    baseUrl: `${API_HOST}/api/llm/o/v1`, // overridden per model
    apiKey: "$FACTORY_API_KEY",
    authHeader: true,
    headers: {
      "X-Client-Version": CLIENT_VERSION,
      "User-Agent": `factory-cli/${CLIENT_VERSION}`,
    },
    models: MODELS.map(toPiModel),
  });

  // Fires for every provider, so guard on the active model actually being ours
  // — model ids like `claude-opus-5` are valid upstream too, and we must not
  // leak the Droid marker into a direct Anthropic call.
  pi.on("before_provider_request", (event, ctx) => {
    const active = ctx.model;
    if (active?.provider !== PROVIDER_ID) return undefined;

    // Trust the payload's own model id when we know it — a subagent may be on a
    // different Droid model than the session's — and fall back to the active one.
    const payloadId = (event.payload as { model?: unknown } | null)?.model;
    const known = typeof payloadId === "string" ? MODELS_BY_ID[payloadId] : undefined;
    const model = known ?? MODELS_BY_ID[active.id];
    const api = model?.api ?? (active.api as FactoryModel["api"]);
    if (model) applyThinking(event.payload, model, ctx.thinkingLevel);
    return injectMarker(event.payload, api);
  });
}

export { ENDPOINTS, MARKER, MODELS, MODELS_BY_ID };
