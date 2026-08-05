# pi-droid-provider

[Factory](https://factory.ai) subscription provider for
[pi-coding-agent](https://pi.dev). Use **all** 42 droid models — Claude, GPT,
Gemini, GLM, Kimi, DeepSeek, MiniMax, Nemotron — inside pi with your Factory
API key.

## Problem

Factory gates its LLM proxy: it only serves requests that look exactly like
the droid CLI — the system prompt must open with droid's identity sentence,
each model family wants a different thinking-parameter shape, backends must be
picked per model, and Claude is served through Bedrock with an older tool
schema. Point pi at Factory raw and every request fails with a bare
`403 Forbidden`.

## What this does

Registers a `droid` provider that maps pi onto Factory's three standard APIs
behind one host:

| Models | Endpoint | Format |
|---|---|---|
| Claude, MiniMax | `/api/llm/a/v1/messages` | Anthropic Messages |
| GLM, Kimi, Gemini, DeepSeek, Nemotron | `/api/llm/o/v1/chat/completions` | OpenAI Chat Completions |
| GPT-5.x | `/api/llm/o/v1/responses` | OpenAI Responses |

- ✅ prefixes the droid identity sentence and rewords pi's own identity so the
  rest of pi's prompt stays coherent
- ✅ per-model thinking shapes, `x-api-provider` backend selection, and
  Bedrock's legacy tool-streaming fallback — all recorded in the catalog
- ✅ streaming, tool calling and reasoning all work (reasoning renders in the
  TUI; `pi -p` print mode omits it)

## Install

```bash
pi install npm:pi-droid-provider
export FACTORY_API_KEY=fk-...   # from app.factory.ai/settings/api-keys
```

Restart Pi (or `/reload`), then:

```bash
pi --model droid/claude-opus-5
pi --model droid/glm-5.2 --thinking high
pi --model droid/gpt-5.6-luna -p "explain this repo"
```

## Verify

```bash
pi --model droid/claude-opus-5 -p "say hi"
```

`/model` inside pi lists everything the provider registers.

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
