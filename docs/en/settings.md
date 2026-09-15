# Settings

[Tiếng Việt](../cai-dat.md) · **English**

Project and organization settings: ingest keys, members, score configs, LLM connections, console host.

Open it to grab `pk`/`sk`, invite people, or attach a model for Playground / evaluators.

## Open

Sidebar **Cài đặt** (bottom). Project: `/project/{projectId}/settings`. Org: `/organization/{organizationId}/settings`.

## Use

1. **API keys** — public/secret so the SDK and OTLP can send into console `:3000`. Demo: `pk-lf-vet-demo` / `sk-lf-vet-demo`. Do not send `ANTHROPIC_API_KEY` to Vết.
2. **Host name** — ingest base URL of this console (`http://localhost:3000` locally).
3. **Score configs** — declare score names (`helpful`) before you score in bulk.
4. **LLM connections** — model keys for [Playground](playground.md) and [Evaluators](evaluators.md). Not required to receive Zalo webhooks.
5. Members / RBAC — `alerts:read`, `prompts:read`, `datasets:read`, …

Messenger webhooks are **not** here. Channel origin and secrets: [Channels](channels.md).

## Related

- [Channels](channels.md)
- [Scores](scores.md)
- [Playground](playground.md)
