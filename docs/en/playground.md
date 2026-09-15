# Playground

[Tiếng Việt](../playground.md) · **English**

A place to run one prompt + message against a model configured on the instance. Not a Zalo channel. Does not ingest webhooks.

Open it to try prompt wording before you pin a version. **Requires a model config** (LLM API key under Settings / LLM connections). Without it the page says “No Model Configured”.

## Open

Sidebar **Playground**. URL: `/project/{projectId}/playground`.

## Use

1. First: [Settings](settings.md) → connect a model (OpenAI, Anthropic, … depending on the instance).
2. Paste a prompt or pull one from [Prompts](prompts.md).
3. Send a message. Read output, tokens, latency.
4. You will not see Zalo / DH-88421 here. Production turns live in [Sessions](sessions.md).

The `scripts/up.sh` demo usually has **no** model config. Do not treat an empty playground as a broken demo — skip this item until you attach a key.

## Related

- [Prompts](prompts.md) — where versions live
- [Settings](settings.md) — LLM connection
