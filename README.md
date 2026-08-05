# pi-droid-provider

Use the models from your [Factory](https://factory.ai) subscription inside
[pi-coding-agent](https://pi.dev) — Claude, GPT, Gemini, GLM, Kimi, DeepSeek,
MiniMax and Nemotron, 42 models in all.

## What this does

Registers a `droid` provider that maps pi onto Factory's three standard APIs
behind one host:

| Models | Endpoint | Format |
|---|---|---|
| Claude, MiniMax | `/api/llm/a/v1/messages` | Anthropic Messages |
| GLM, Kimi, Gemini, DeepSeek, Nemotron | `/api/llm/o/v1/chat/completions` | OpenAI Chat Completions |
| GPT-5.x | `/api/llm/o/v1/responses` | OpenAI Responses |

plus the Factory-specific quirks needed to make it work:

- **Request gating** — Factory only serves requests whose system prompt opens
  with droid's identity sentence, so the provider prefixes it and rewords pi's
  identity to keep the rest of the prompt coherent.
- **Thinking parameters** — each model family wants a different thinking shape
  (`thinking: {type: "adaptive"}` + `output_config.effort` for newer Claude,
  the stock Anthropic shape for older ones); the catalog records which.
- **Backend selection** — `x-api-provider` picks the upstream for models
  served by more than one (e.g. Fireworks vs Baseten for `glm-5.2`).
- **Bedrock compatibility** — Claude is served via Bedrock, which rejects the
  newer `eager_input_streaming` field, so the provider opts into pi's legacy
  tool-streaming fallback.

Streaming, tool calling and reasoning all work. Reasoning renders in the TUI;
`pi -p` print mode omits it.

## Install

```bash
pi install npm:pi-droid-provider
export FACTORY_API_KEY=fk-...   # from app.factory.ai/settings/api-keys
```

```bash
pi --model droid/claude-opus-5
pi --model droid/glm-5.2 --thinking high
pi --model droid/gpt-5.6-luna -p "explain this repo"
```

`/model` lists everything the provider registers.

## The catalog

`src/catalog.ts` holds 42 models, each verified with a live completion (the 29
deprecated, region-locked or unreleased models droid ships were dropped). Per
model it records the API format, verified backends, context window, max output,
reasoning levels and thinking shape.

It is generated from the droid binary — regenerate it when droid updates
rather than editing it in place.

## Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `FACTORY_API_KEY` | — | Required. API key from the Factory dashboard. |
| `FACTORY_API_BASE_URL` | `https://api.factory.ai` | Override the API host. |
| `FACTORY_CLIENT_VERSION` | `0.181.0` | Value sent as `X-Client-Version`. |

## Caveats

This spends your Factory subscription's token allowance from a client other
than droid, which Factory gates against. It is not a sanctioned integration —
your account, your call.

Factory's content filter also regex-matches other coding agents' system prompts
across the whole request, not just the system prompt. If a file in context
contains one of those exact sentences, the request fails with
`Error: 403 status code (no body)` and keeps failing while that text stays in
context — `/compact` or a fresh session clears it.

## License

MIT
