# pi-droid-provider

Use the models from your [Factory](https://factory.ai) subscription inside the
[pi coding agent](https://pi.dev) — Claude, GPT, Gemini, GLM, Kimi, DeepSeek,
MiniMax and Nemotron, 42 models in all.

## Install

```bash
pi install ./pi-droid          # or: pi install git:github.com/<you>/pi-droid
export FACTORY_API_KEY=fk-...  # from app.factory.ai/settings/api-keys
```

```bash
pi --model droid/claude-opus-5
pi --model droid/glm-5.2 --thinking high
pi --model droid/gpt-5.6-luna -p "explain this repo"
```

`/model` lists everything the provider registers.

## How it works

Factory serves its models as three standard APIs behind one host, and the
provider maps pi onto all three:

| Models | Endpoint | Format |
|---|---|---|
| Claude, MiniMax | `/api/llm/a/v1/messages` | Anthropic Messages |
| GLM, Kimi, Gemini, DeepSeek, Nemotron | `/api/llm/o/v1/chat/completions` | OpenAI Chat Completions |
| GPT-5.x | `/api/llm/o/v1/responses` | OpenAI Responses |

On top of that it handles four Factory-specific quirks:

- **Request gating.** Factory only serves requests whose system prompt opens
  with droid's identity sentence, and rejects prompts carrying pi's. The
  provider prefixes the former and rewords the latter to `You are operating
  inside pi, a coding agent harness.`, which keeps the rest of pi's prompt
  coherent instead of leaving its pi references dangling.
- **Thinking parameters.** Newer Claude models want `thinking: { type:
  "adaptive" }` plus `output_config.effort` and reject the stock Anthropic
  shape; older ones want the stock shape and reject `display`. The per-model
  shape lives in the catalog.
- **Backend selection.** `x-api-provider` picks the upstream. Several models run
  on more than one — `glm-5.2` is served by both Fireworks and Baseten — and the
  catalog prefers Fireworks.
- **Bedrock compatibility.** Claude is served via Bedrock, which rejects the
  newer per-tool `eager_input_streaming` field, so the provider opts into pi's
  legacy tool-streaming fallback.

Streaming, tool calling and reasoning all work. Reasoning renders in the TUI;
`pi -p` print mode omits it.

## Configuration

| Variable | Default | Purpose |
|---|---|---|
| `FACTORY_API_KEY` | — | Required. API key from the Factory dashboard. |
| `FACTORY_API_BASE_URL` | `https://api.factory.ai` | Override the API host. |
| `FACTORY_CLIENT_VERSION` | `0.181.0` | Value sent as `X-Client-Version`. |

## The catalog

`src/catalog.ts` holds 42 models, each verified with a live completion — every
model droid ships was probed, and the 29 that are deprecated, region-locked or
unreleased were dropped. Per model it records the API format, verified backends,
context window, max output, reasoning levels and thinking shape.

It is generated from the droid binary, so regenerate it when droid updates
rather than editing it in place.

## Caveats

This spends your Factory subscription's token allowance from a client other than
droid, which Factory gates against. Your account, your call — but it is not a
sanctioned integration.

Factory's content filter also matches a handful of other coding agents' system
prompts, and it scans the whole request — not just the system prompt. So if the
agent reads a file that happens to contain one of those exact sentences, the
request fails with `Error: 403 status code (no body)`, and keeps failing while
that text stays in context. `/compact` or a fresh session clears it.

Normal projects never contain those strings, so in practice this only comes up
when working on agent tooling — including this repo, whose own source has one of
the blocked sentences in a regex.

## License

MIT
