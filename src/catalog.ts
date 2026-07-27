// Factory Droid model catalog.
//
// Extracted from the droid binary (v0.157.1, reporting client version 0.181.0)
// and then verified live against Factory's proxy: every model listed here
// returned 200 for a real completion. Models droid knows about but that the
// API rejects (deprecated, region-locked, or unreleased codenames) are omitted.
//
// Regenerate rather than hand-edit when droid updates.

/** Which Factory endpoint serves a model, keyed by its pi `api` type. */
export const ENDPOINTS = {
  "anthropic-messages": "/api/llm/a/v1/messages",
  "openai-completions": "/api/llm/o/v1/chat/completions",
  "openai-responses": "/api/llm/o/v1/responses",
} as const;

export type FactoryApi = keyof typeof ENDPOINTS;

export interface FactoryModel {
  /** Model id sent in the request body. */
  id: string;
  /** Human-readable label for pi's model picker. */
  name: string;
  /** Request/response format, and so which endpoint to hit. */
  api: FactoryApi;
  /** Value for the `x-api-provider` header; null when the endpoint needs none. */
  provider: string | null;
  /**
   * Every backend verified to serve this model, most preferred first.
   * Same model, different infrastructure — e.g. glm-5.2 is
   * `accounts/fireworks/models/glm-5p2` on fireworks and `zai-org/GLM-5.2`
   * on baseten. Override `provider` with any entry here.
   */
  providers: string[];
  contextWindow: number;
  maxTokens: number;
  reasoning: boolean;
  /** Droid's own default reasoning effort for this model. */
  defaultEffort: string;
  /** pi thinking level -> the effort value this model accepts. */
  thinkingLevelMap?: Record<string, string>;
  input: string[];
  /** Factory bills usage as tokens x this multiplier. */
  tokenMultiplier: number | null;
  /** "core" models draw from the cheaper Droid Core pool. */
  billingPool: string;
  /**
   * Shape of the thinking parameters this model expects on the Anthropic
   * endpoint. Factory diverges from stock Anthropic here:
   *   enabled             -> thinking: { type: "enabled", budget_tokens }
   *   enabled-effort      -> ...plus output_config: { effort }
   *   adaptive            -> thinking: { type: "adaptive" }, output_config: { effort }
   *   adaptive-summarized -> ...plus display: "summarized"
   *   none                -> no thinking params (OpenAI paths use reasoning_effort)
   */
  thinking: "enabled" | "enabled-effort" | "adaptive" | "adaptive-summarized" | "none";
  /** Values for the `anthropic-beta` header this model expects. */
  betaFlags: string[];
}

export const MODELS: FactoryModel[] = [
  {
    "id": "claude-fable-5",
    "name": "Fable 5",
    "api": "anthropic-messages",
    "provider": "bedrock_anthropic",
    "providers": [
      "bedrock_anthropic"
    ],
    "contextWindow": 995000,
    "maxTokens": 128000,
    "reasoning": true,
    "defaultEffort": "high",
    "thinkingLevelMap": {
      "minimal": "low",
      "low": "low",
      "medium": "medium",
      "high": "high",
      "max": "max"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 4,
    "billingPool": "standard",
    "thinking": "adaptive-summarized",
    "betaFlags": []
  },
  {
    "id": "claude-haiku-4-5-20251001",
    "name": "Haiku 4.5",
    "api": "anthropic-messages",
    "provider": "bedrock_anthropic",
    "providers": [
      "bedrock_anthropic"
    ],
    "contextWindow": 200000,
    "maxTokens": 32000,
    "reasoning": true,
    "defaultEffort": "off",
    "thinkingLevelMap": {
      "minimal": "low",
      "low": "low",
      "medium": "medium",
      "high": "high",
      "max": "high"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 0.4,
    "billingPool": "standard",
    "thinking": "enabled",
    "betaFlags": [
      "interleaved-thinking-2025-05-14"
    ]
  },
  {
    "id": "claude-opus-4-1-20250805",
    "name": "Opus 4.1",
    "api": "anthropic-messages",
    "provider": "bedrock_anthropic",
    "providers": [
      "bedrock_anthropic"
    ],
    "contextWindow": 200000,
    "maxTokens": 32000,
    "reasoning": true,
    "defaultEffort": "off",
    "thinkingLevelMap": {
      "minimal": "low",
      "low": "low",
      "medium": "medium",
      "high": "high",
      "max": "high"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 6,
    "billingPool": "standard",
    "thinking": "enabled",
    "betaFlags": [
      "interleaved-thinking-2025-05-14"
    ]
  },
  {
    "id": "claude-opus-4-5-20251101",
    "name": "Opus 4.5",
    "api": "anthropic-messages",
    "provider": "bedrock_anthropic",
    "providers": [
      "bedrock_anthropic"
    ],
    "contextWindow": 200000,
    "maxTokens": 64000,
    "reasoning": true,
    "defaultEffort": "off",
    "thinkingLevelMap": {
      "minimal": "low",
      "low": "low",
      "medium": "medium",
      "high": "high",
      "max": "high"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 2,
    "billingPool": "standard",
    "thinking": "enabled-effort",
    "betaFlags": [
      "effort-2025-11-24"
    ]
  },
  {
    "id": "claude-opus-4-6",
    "name": "Opus 4.6",
    "api": "anthropic-messages",
    "provider": "bedrock_anthropic",
    "providers": [
      "bedrock_anthropic"
    ],
    "contextWindow": 995000,
    "maxTokens": 128000,
    "reasoning": true,
    "defaultEffort": "high",
    "thinkingLevelMap": {
      "minimal": "low",
      "low": "low",
      "medium": "medium",
      "high": "high",
      "max": "max"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 2,
    "billingPool": "standard",
    "thinking": "adaptive",
    "betaFlags": []
  },
  {
    "id": "claude-opus-4-7",
    "name": "Opus 4.7",
    "api": "anthropic-messages",
    "provider": "bedrock_anthropic",
    "providers": [
      "bedrock_anthropic"
    ],
    "contextWindow": 995000,
    "maxTokens": 128000,
    "reasoning": true,
    "defaultEffort": "high",
    "thinkingLevelMap": {
      "minimal": "low",
      "low": "low",
      "medium": "medium",
      "high": "high",
      "max": "max"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 2,
    "billingPool": "standard",
    "thinking": "adaptive-summarized",
    "betaFlags": []
  },
  {
    "id": "claude-opus-4-8",
    "name": "Opus 4.8",
    "api": "anthropic-messages",
    "provider": "bedrock_anthropic",
    "providers": [
      "bedrock_anthropic"
    ],
    "contextWindow": 995000,
    "maxTokens": 128000,
    "reasoning": true,
    "defaultEffort": "high",
    "thinkingLevelMap": {
      "minimal": "low",
      "low": "low",
      "medium": "medium",
      "high": "high",
      "max": "max"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 2,
    "billingPool": "standard",
    "thinking": "adaptive-summarized",
    "betaFlags": []
  },
  {
    "id": "claude-opus-5",
    "name": "Opus 5",
    "api": "anthropic-messages",
    "provider": "bedrock_anthropic",
    "providers": [
      "bedrock_anthropic"
    ],
    "contextWindow": 995000,
    "maxTokens": 128000,
    "reasoning": true,
    "defaultEffort": "high",
    "thinkingLevelMap": {
      "minimal": "low",
      "low": "low",
      "medium": "medium",
      "high": "high",
      "max": "max"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 2,
    "billingPool": "standard",
    "thinking": "adaptive-summarized",
    "betaFlags": []
  },
  {
    "id": "claude-sonnet-4-5-20250929",
    "name": "Sonnet 4.5",
    "api": "anthropic-messages",
    "provider": "bedrock_anthropic",
    "providers": [
      "bedrock_anthropic"
    ],
    "contextWindow": 200000,
    "maxTokens": 32000,
    "reasoning": true,
    "defaultEffort": "off",
    "thinkingLevelMap": {
      "minimal": "low",
      "low": "low",
      "medium": "medium",
      "high": "high",
      "max": "high"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 1.2,
    "billingPool": "standard",
    "thinking": "enabled",
    "betaFlags": [
      "interleaved-thinking-2025-05-14"
    ]
  },
  {
    "id": "claude-sonnet-4-6",
    "name": "Sonnet 4.6",
    "api": "anthropic-messages",
    "provider": "bedrock_anthropic",
    "providers": [
      "bedrock_anthropic"
    ],
    "contextWindow": 995000,
    "maxTokens": 64000,
    "reasoning": true,
    "defaultEffort": "high",
    "thinkingLevelMap": {
      "minimal": "low",
      "low": "low",
      "medium": "medium",
      "high": "high",
      "max": "max"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 1.2,
    "billingPool": "standard",
    "thinking": "adaptive",
    "betaFlags": []
  },
  {
    "id": "claude-sonnet-5",
    "name": "Sonnet 5",
    "api": "anthropic-messages",
    "provider": "bedrock_anthropic",
    "providers": [
      "bedrock_anthropic"
    ],
    "contextWindow": 1000000,
    "maxTokens": 128000,
    "reasoning": true,
    "defaultEffort": "high",
    "thinkingLevelMap": {
      "minimal": "low",
      "low": "low",
      "medium": "medium",
      "high": "high",
      "max": "max"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 1.2,
    "billingPool": "standard",
    "thinking": "adaptive-summarized",
    "betaFlags": []
  },
  {
    "id": "minimax-m2.7",
    "name": "MiniMax M2.7 (Droid Core)",
    "api": "anthropic-messages",
    "provider": "fireworks",
    "providers": [
      "fireworks"
    ],
    "contextWindow": 260600,
    "maxTokens": 64000,
    "reasoning": true,
    "defaultEffort": "high",
    "thinkingLevelMap": {
      "medium": "high",
      "high": "high",
      "max": "high"
    },
    "input": [
      "text"
    ],
    "tokenMultiplier": 0.12,
    "billingPool": "core",
    "thinking": "enabled-effort",
    "betaFlags": []
  },
  {
    "id": "minimax-m3",
    "name": "MiniMax M3 (Droid Core)",
    "api": "anthropic-messages",
    "provider": "fireworks",
    "providers": [
      "fireworks"
    ],
    "contextWindow": 512000,
    "maxTokens": 64000,
    "reasoning": true,
    "defaultEffort": "high",
    "thinkingLevelMap": {
      "medium": "high",
      "high": "high",
      "max": "high"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 0.12,
    "billingPool": "core",
    "thinking": "enabled-effort",
    "betaFlags": []
  },
  {
    "id": "deepseek-v4-pro",
    "name": "DeepSeek V4 Pro (Droid Core)",
    "api": "openai-completions",
    "provider": "fireworks",
    "providers": [
      "fireworks",
      "baseten"
    ],
    "contextWindow": 1040000,
    "maxTokens": 65536,
    "reasoning": true,
    "defaultEffort": "high",
    "thinkingLevelMap": {
      "minimal": "low",
      "low": "low",
      "medium": "high",
      "high": "high",
      "max": "max"
    },
    "input": [
      "text"
    ],
    "tokenMultiplier": 0.7,
    "billingPool": "core",
    "thinking": "none",
    "betaFlags": []
  },
  {
    "id": "gemini-2.5-flash",
    "name": "Gemini 2.5 Flash",
    "api": "openai-completions",
    "provider": "google",
    "providers": [
      "google"
    ],
    "contextWindow": 1048576,
    "maxTokens": 8192,
    "reasoning": true,
    "defaultEffort": "dynamic",
    "thinkingLevelMap": {
      "minimal": "low",
      "low": "low",
      "medium": "medium",
      "high": "high",
      "max": "high"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 0.12,
    "billingPool": "standard",
    "thinking": "none",
    "betaFlags": []
  },
  {
    "id": "gemini-2.5-pro",
    "name": "Gemini 2.5 Pro",
    "api": "openai-completions",
    "provider": "google",
    "providers": [
      "google"
    ],
    "contextWindow": 1048576,
    "maxTokens": 8192,
    "reasoning": true,
    "defaultEffort": "high",
    "thinkingLevelMap": {
      "minimal": "low",
      "low": "low",
      "medium": "medium",
      "high": "high",
      "max": "high"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 0.5,
    "billingPool": "standard",
    "thinking": "none",
    "betaFlags": []
  },
  {
    "id": "gemini-3-flash-preview",
    "name": "Gemini 3 Flash",
    "api": "openai-completions",
    "provider": "google",
    "providers": [
      "google"
    ],
    "contextWindow": 1000000,
    "maxTokens": 65536,
    "reasoning": true,
    "defaultEffort": "high",
    "thinkingLevelMap": {
      "minimal": "minimal",
      "low": "low",
      "medium": "medium",
      "high": "high",
      "max": "high"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 0.2,
    "billingPool": "standard",
    "thinking": "none",
    "betaFlags": []
  },
  {
    "id": "gemini-3.1-pro-preview",
    "name": "Gemini 3.1 Pro",
    "api": "openai-completions",
    "provider": "google",
    "providers": [
      "google"
    ],
    "contextWindow": 1000000,
    "maxTokens": 65536,
    "reasoning": true,
    "defaultEffort": "high",
    "thinkingLevelMap": {
      "minimal": "low",
      "low": "low",
      "medium": "medium",
      "high": "high",
      "max": "high"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 0.8,
    "billingPool": "standard",
    "thinking": "none",
    "betaFlags": []
  },
  {
    "id": "gemini-3.5-flash",
    "name": "Gemini 3.5 Flash",
    "api": "openai-completions",
    "provider": "google",
    "providers": [
      "google"
    ],
    "contextWindow": 1000000,
    "maxTokens": 65536,
    "reasoning": true,
    "defaultEffort": "high",
    "thinkingLevelMap": {
      "minimal": "minimal",
      "low": "low",
      "medium": "medium",
      "high": "high",
      "max": "high"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 0.6,
    "billingPool": "standard",
    "thinking": "none",
    "betaFlags": []
  },
  {
    "id": "gemini-3.6-flash",
    "name": "Gemini 3.6 Flash",
    "api": "openai-completions",
    "provider": "google",
    "providers": [
      "google"
    ],
    "contextWindow": 1000000,
    "maxTokens": 65536,
    "reasoning": true,
    "defaultEffort": "high",
    "thinkingLevelMap": {
      "minimal": "minimal",
      "low": "low",
      "medium": "medium",
      "high": "high",
      "max": "high"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 0.6,
    "billingPool": "standard",
    "thinking": "none",
    "betaFlags": []
  },
  {
    "id": "glm-5.2",
    "name": "GLM-5.2 (Droid Core)",
    "api": "openai-completions",
    "provider": "fireworks",
    "providers": [
      "fireworks",
      "baseten"
    ],
    "contextWindow": 1040000,
    "maxTokens": 131072,
    "reasoning": true,
    "defaultEffort": "high",
    "thinkingLevelMap": {
      "medium": "high",
      "high": "high",
      "max": "max"
    },
    "input": [
      "text"
    ],
    "tokenMultiplier": 0.55,
    "billingPool": "core",
    "thinking": "none",
    "betaFlags": []
  },
  {
    "id": "glm-5.2-fast",
    "name": "GLM-5.2 Fast (Droid Core)",
    "api": "openai-completions",
    "provider": "fireworks",
    "providers": [
      "fireworks"
    ],
    "contextWindow": 1040000,
    "maxTokens": 131072,
    "reasoning": true,
    "defaultEffort": "high",
    "thinkingLevelMap": {
      "medium": "high",
      "high": "high",
      "max": "max"
    },
    "input": [
      "text"
    ],
    "tokenMultiplier": 1.1,
    "billingPool": "core",
    "thinking": "none",
    "betaFlags": []
  },
  {
    "id": "kimi-k2.6",
    "name": "Kimi K2.6 (Droid Core)",
    "api": "openai-completions",
    "provider": "fireworks",
    "providers": [
      "fireworks",
      "baseten"
    ],
    "contextWindow": 262144,
    "maxTokens": 65536,
    "reasoning": true,
    "defaultEffort": "high",
    "thinkingLevelMap": {
      "medium": "high",
      "high": "high",
      "max": "high"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 0.4,
    "billingPool": "core",
    "thinking": "none",
    "betaFlags": []
  },
  {
    "id": "kimi-k2.7-code",
    "name": "Kimi K2.7 Code (Droid Core)",
    "api": "openai-completions",
    "provider": "fireworks",
    "providers": [
      "fireworks",
      "baseten"
    ],
    "contextWindow": 262144,
    "maxTokens": 65536,
    "reasoning": true,
    "defaultEffort": "high",
    "thinkingLevelMap": {
      "medium": "high",
      "high": "high",
      "max": "high"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 0.38,
    "billingPool": "core",
    "thinking": "none",
    "betaFlags": []
  },
  {
    "id": "kimi-k3",
    "name": "Kimi K3 (Droid Core)",
    "api": "openai-completions",
    "provider": "fireworks",
    "providers": [
      "fireworks",
      "baseten"
    ],
    "contextWindow": 262144,
    "maxTokens": 65536,
    "reasoning": true,
    "defaultEffort": "high",
    "thinkingLevelMap": {
      "minimal": "low",
      "low": "low",
      "medium": "high",
      "high": "high",
      "max": "max"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 1.2,
    "billingPool": "core",
    "thinking": "none",
    "betaFlags": []
  },
  {
    "id": "nemotron-3-ultra",
    "name": "Nemotron 3 Ultra (Droid Core)",
    "api": "openai-completions",
    "provider": "fireworks",
    "providers": [
      "fireworks",
      "baseten"
    ],
    "contextWindow": 202000,
    "maxTokens": 65536,
    "reasoning": true,
    "defaultEffort": "high",
    "thinkingLevelMap": {
      "medium": "high",
      "high": "high",
      "max": "high"
    },
    "input": [
      "text"
    ],
    "tokenMultiplier": 0.24,
    "billingPool": "core",
    "thinking": "none",
    "betaFlags": []
  },
  {
    "id": "gpt-5-2025-08-07",
    "name": "GPT-5",
    "api": "openai-responses",
    "provider": null,
    "providers": [],
    "contextWindow": 400000,
    "maxTokens": 32768,
    "reasoning": true,
    "defaultEffort": "medium",
    "thinkingLevelMap": {
      "minimal": "low",
      "low": "low",
      "medium": "medium",
      "high": "high",
      "max": "high"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 0.5,
    "billingPool": "standard",
    "thinking": "none",
    "betaFlags": []
  },
  {
    "id": "gpt-5-mini-2025-08-07",
    "name": "GPT-5-mini",
    "api": "openai-responses",
    "provider": null,
    "providers": [],
    "contextWindow": 400000,
    "maxTokens": 32768,
    "reasoning": true,
    "defaultEffort": "medium",
    "thinkingLevelMap": {
      "minimal": "low",
      "low": "low",
      "medium": "medium",
      "high": "high",
      "max": "high"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 0.1,
    "billingPool": "standard",
    "thinking": "none",
    "betaFlags": []
  },
  {
    "id": "gpt-5-nano-2025-08-07",
    "name": "GPT-5-nano",
    "api": "openai-responses",
    "provider": null,
    "providers": [],
    "contextWindow": 400000,
    "maxTokens": 32768,
    "reasoning": true,
    "defaultEffort": "medium",
    "thinkingLevelMap": {
      "minimal": "low",
      "low": "low",
      "medium": "medium",
      "high": "high",
      "max": "high"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 0.02,
    "billingPool": "standard",
    "thinking": "none",
    "betaFlags": []
  },
  {
    "id": "gpt-5.1",
    "name": "GPT-5.1",
    "api": "openai-responses",
    "provider": null,
    "providers": [],
    "contextWindow": 400000,
    "maxTokens": 32768,
    "reasoning": true,
    "defaultEffort": "none",
    "thinkingLevelMap": {
      "minimal": "low",
      "low": "low",
      "medium": "medium",
      "high": "high",
      "max": "high"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 0.5,
    "billingPool": "standard",
    "thinking": "none",
    "betaFlags": []
  },
  {
    "id": "gpt-5.2",
    "name": "GPT-5.2",
    "api": "openai-responses",
    "provider": null,
    "providers": [],
    "contextWindow": 400000,
    "maxTokens": 128000,
    "reasoning": true,
    "defaultEffort": "low",
    "thinkingLevelMap": {
      "minimal": "low",
      "low": "low",
      "medium": "medium",
      "high": "high",
      "max": "xhigh"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 0.7,
    "billingPool": "standard",
    "thinking": "none",
    "betaFlags": []
  },
  {
    "id": "gpt-5.3-codex",
    "name": "GPT-5.3-Codex",
    "api": "openai-responses",
    "provider": null,
    "providers": [],
    "contextWindow": 400000,
    "maxTokens": 128000,
    "reasoning": true,
    "defaultEffort": "medium",
    "thinkingLevelMap": {
      "minimal": "low",
      "low": "low",
      "medium": "medium",
      "high": "high",
      "max": "xhigh"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 0.7,
    "billingPool": "standard",
    "thinking": "none",
    "betaFlags": []
  },
  {
    "id": "gpt-5.3-codex-fast",
    "name": "GPT-5.3-Codex Fast Mode",
    "api": "openai-responses",
    "provider": null,
    "providers": [],
    "contextWindow": 400000,
    "maxTokens": 128000,
    "reasoning": true,
    "defaultEffort": "medium",
    "thinkingLevelMap": {
      "minimal": "low",
      "low": "low",
      "medium": "medium",
      "high": "high",
      "max": "xhigh"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 1.4,
    "billingPool": "standard",
    "thinking": "none",
    "betaFlags": []
  },
  {
    "id": "gpt-5.4",
    "name": "GPT-5.4",
    "api": "openai-responses",
    "provider": null,
    "providers": [],
    "contextWindow": 1050000,
    "maxTokens": 128000,
    "reasoning": true,
    "defaultEffort": "medium",
    "thinkingLevelMap": {
      "minimal": "low",
      "low": "low",
      "medium": "medium",
      "high": "high",
      "max": "xhigh"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 1,
    "billingPool": "standard",
    "thinking": "none",
    "betaFlags": []
  },
  {
    "id": "gpt-5.4-fast",
    "name": "GPT-5.4 Fast Mode",
    "api": "openai-responses",
    "provider": null,
    "providers": [],
    "contextWindow": 1050000,
    "maxTokens": 128000,
    "reasoning": true,
    "defaultEffort": "medium",
    "thinkingLevelMap": {
      "minimal": "low",
      "low": "low",
      "medium": "medium",
      "high": "high",
      "max": "xhigh"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 2,
    "billingPool": "standard",
    "thinking": "none",
    "betaFlags": []
  },
  {
    "id": "gpt-5.4-mini",
    "name": "GPT-5.4 Mini",
    "api": "openai-responses",
    "provider": null,
    "providers": [],
    "contextWindow": 400000,
    "maxTokens": 128000,
    "reasoning": true,
    "defaultEffort": "high",
    "thinkingLevelMap": {
      "minimal": "low",
      "low": "low",
      "medium": "medium",
      "high": "high",
      "max": "xhigh"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 0.3,
    "billingPool": "standard",
    "thinking": "none",
    "betaFlags": []
  },
  {
    "id": "gpt-5.5",
    "name": "GPT-5.5",
    "api": "openai-responses",
    "provider": null,
    "providers": [],
    "contextWindow": 1050000,
    "maxTokens": 128000,
    "reasoning": true,
    "defaultEffort": "medium",
    "thinkingLevelMap": {
      "minimal": "low",
      "low": "low",
      "medium": "medium",
      "high": "high",
      "max": "xhigh"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 2,
    "billingPool": "standard",
    "thinking": "none",
    "betaFlags": []
  },
  {
    "id": "gpt-5.5-fast",
    "name": "GPT-5.5 Fast Mode",
    "api": "openai-responses",
    "provider": null,
    "providers": [],
    "contextWindow": 1050000,
    "maxTokens": 128000,
    "reasoning": true,
    "defaultEffort": "medium",
    "thinkingLevelMap": {
      "minimal": "low",
      "low": "low",
      "medium": "medium",
      "high": "high",
      "max": "xhigh"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 5,
    "billingPool": "standard",
    "thinking": "none",
    "betaFlags": []
  },
  {
    "id": "gpt-5.5-pro",
    "name": "GPT-5.5 Pro",
    "api": "openai-responses",
    "provider": null,
    "providers": [],
    "contextWindow": 1050000,
    "maxTokens": 128000,
    "reasoning": true,
    "defaultEffort": "medium",
    "thinkingLevelMap": {
      "medium": "medium",
      "high": "high",
      "max": "xhigh"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 12,
    "billingPool": "standard",
    "thinking": "none",
    "betaFlags": []
  },
  {
    "id": "gpt-5.6-luna",
    "name": "GPT-5.6 Luna",
    "api": "openai-responses",
    "provider": null,
    "providers": [],
    "contextWindow": 1050000,
    "maxTokens": 128000,
    "reasoning": true,
    "defaultEffort": "medium",
    "thinkingLevelMap": {
      "minimal": "low",
      "low": "low",
      "medium": "medium",
      "high": "high",
      "max": "max"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 0.4,
    "billingPool": "standard",
    "thinking": "none",
    "betaFlags": []
  },
  {
    "id": "gpt-5.6-sol",
    "name": "GPT-5.6 Sol",
    "api": "openai-responses",
    "provider": null,
    "providers": [],
    "contextWindow": 1050000,
    "maxTokens": 128000,
    "reasoning": true,
    "defaultEffort": "medium",
    "thinkingLevelMap": {
      "minimal": "low",
      "low": "low",
      "medium": "medium",
      "high": "high",
      "max": "max"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 2,
    "billingPool": "standard",
    "thinking": "none",
    "betaFlags": []
  },
  {
    "id": "gpt-5.6-terra",
    "name": "GPT-5.6 Terra",
    "api": "openai-responses",
    "provider": null,
    "providers": [],
    "contextWindow": 1050000,
    "maxTokens": 128000,
    "reasoning": true,
    "defaultEffort": "medium",
    "thinkingLevelMap": {
      "minimal": "low",
      "low": "low",
      "medium": "medium",
      "high": "high",
      "max": "max"
    },
    "input": [
      "text",
      "image"
    ],
    "tokenMultiplier": 1,
    "billingPool": "standard",
    "thinking": "none",
    "betaFlags": []
  }
];

export const MODELS_BY_ID: Record<string, FactoryModel> = Object.fromEntries(
  MODELS.map((m) => [m.id, m]),
);
