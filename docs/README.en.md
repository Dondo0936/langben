# Vết console

[Tiếng Việt](README.md) · **English**

Two surfaces, one project:

| Surface | Port | Job |
|---|---|---|
| Console | [http://localhost:3000](http://localhost:3000) | Traces, scores, prompts, settings |
| Platform web | [http://localhost:43173](http://localhost:43173) | Kênh, Lộ trình, webhooks. The console embeds those two items in the sidebar |

Kênh and Lộ trình are not Langfuse pages. They run on `:43173` and appear in the console via iframe.

Every page in these docs uses the same frame: **what it is**, **when to open it**, **how to open it**, **how to use it**, **related**.

## Path for a new operator

1. [Run locally](../README.en.md#run-locally) — `bash scripts/up.sh`, sign in `demo@vet.dev` / `demodemo`.
2. Open project **Bot Zalo shop**. The left sidebar is the whole console.
3. Create one demo turn (pick one):
   - `node scripts/seed-langfuse-zalo.mjs` — the DH-88421 cancel-order tree
   - Kênh → Lark or Google Chat → **Gửi thử** — a session immediately, no public HTTPS
4. Read that turn on [Sessions](en/sessions.md), then the same turn on [Traces](en/traces.md).
5. Only then open Channels, Scores, or Prompts when you need them.

Do not start in Playground or Evaluators. Playground needs a model config. Evaluators need existing turns.

## Every module

Same order as the sidebar.

### Into the project

| Item | Job |
|---|---|
| [Overview](en/overview.md) | Trace count, cost, scores for the project |
| [Dashboards](en/dashboards.md) | Custom dashboards (cost, usage, widgets) |

### Observability

| Item | Job |
|---|---|
| [Traces](en/traces.md) | One turn as a tree: inbound → NLU → tool → generation → outbound |
| [Sessions](en/sessions.md) | Several traces in one conversation |
| [Channels](en/channels.md) | Zalo / FPT / Viettel / Lark / Google Chat webhooks, Gửi thử |
| [Routes](en/routes.md) | Map from inbound to reply |
| [Users](en/users.md) | Group turns by `userId` |
| [Alerts](en/alerts.md) | Notify when a metric crosses a threshold |

### Prompt management

| Item | Job |
|---|---|
| [Prompts](en/prompts.md) | Versioned prompts |
| [Playground](en/playground.md) | Run a prompt against a configured model |

### Agent evaluation

| Item | Job |
|---|---|
| [Scores](en/scores.md) | Quality labels on a turn / observation / session |
| [Evaluators](en/evaluators.md) | Automatic scoring (LLM-as-judge) |
| [Annotation](en/annotation.md) | Human labeling queues |
| [Datasets](en/datasets.md) | Expected input/output for comparison |
| [Experiments](en/experiments.md) | Dataset runs (off by default on this pin) |

### System

| Item | Job |
|---|---|
| [Settings](en/settings.md) | API keys, members, score configs, ingest host |
