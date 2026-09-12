# Vết

Langfuse-class LLM observability **plus** Vietnamese production channels (Zalo, FPT.AI, Viettel, Lark, Google Chat, .NET). Built-in generation layers for Amazon Bedrock, Google Cloud Vertex AI, and Microsoft Foundry.

**Working name.** Vietnamese for “trace / mark.” MIT licensed.

The **console** is Langfuse OSS (MIT, ClickHouse, Inc.) rebranded as Vết. Marketing, Kênh / Lộ trình, and Zalo–FPT hooks are original. We do not ship `ee/` or `LANGFUSE_EE_LICENSE_KEY`. See [NOTICE](NOTICE).

Pinned runtime: **Langfuse v4.33.0** (`81bbfd169b72ea2ed53639699cc6632e8f908ce8`) in `vendor/langfuse`.

---

## How we package it

| | **Open Source (self-host)** | **Vết Cloud** |
|---|---|---|
| Status | **Live** | **Coming soon** |
| Who runs it | You | We will host it |
| License | MIT | MIT codebase + hosted service |
| Units | Unlimited | Planned: Hobby 50k · paid 100k + overage |
| Start | `bash scripts/up.sh` | Pending — no signup yet |

A **đơn vị / unit** is not an LLM token. When Cloud opens, one unit = one trace, observation, or score. Interactive explainer: `/docs/units`.

Cloud plan names (Hobby / Core / Pro / Enterprise) are listed as pending on `/pricing`. Self-host pricing: `/pricing/self-host`.

Same git repo. `VET_DEPLOYMENT=self-host` is the live product. Cloud self-serve stays off unless `VET_CLOUD_SELF_SERVE=1`.

---

## Run locally

```bash
git submodule update --init --recursive   # or: bash scripts/bootstrap-langfuse.sh
cp .env.console.example .env
bash scripts/up.sh
```

`scripts/up.sh` applies the Vết overlay, builds `vet-console:local`, and starts marketing + Langfuse. Equivalent: `COMPOSE_FILE` from `.env` + `docker compose up --build` after `bash scripts/apply-langfuse-overlay.sh`.

| Surface | URL |
|---|---|
| Marketing / hooks / Kênh | [http://localhost:43173](http://localhost:43173) |
| Console (Vết overlay on Langfuse OSS) | [http://localhost:3000](http://localhost:3000) |

Console login: `demo@vet.dev` / `demodemo` (≥ 8 characters). Org **Vết**, project **Bot Zalo shop** (`prj-vet-demo`).

Ingest keys (Langfuse public API): `pk-lf-vet-demo` / `sk-lf-vet-demo`.

Seed the Zalo «hủy đơn» tree into the console (filters / waterfall):

```bash
node scripts/seed-langfuse-zalo.mjs
```

### Zalo OA fixture (signature verify → Langfuse traces)

```bash
node scripts/zalo-fixture.mjs
```

Invalid MAC → **401** and no turn. Valid MAC → session `zalo_oa:user_fixture` on **Sessions** in the console.

Marketing-only (no console):

```bash
npm install
npm run dev   # :43173 only
```

---

## Repo layout

```
apps/web                 Marketing, webhooks, Kênh / Lộ trình (port 43173)
vendor/langfuse          Langfuse OSS submodule (console :3000)
overlay/langfuse         Vết logo, nav, hội thoại — applied at image build
packages/schema          Zod: turns, spans, channel enums
packages/sdk-js          observe, wrapAnthropic, wrapFptGetAnswer → Langfuse ingest
docs/plans               Product plan (HTML)
LICENSE · NOTICE
```

---

## SDKs

```ts
import Anthropic from "@anthropic-ai/sdk"
import { wrapAnthropic, observe } from "@vet/sdk"

const client = wrapAnthropic(new Anthropic(), {
  publicKey: "pk-lf-vet-demo",
  secretKey: "sk-lf-vet-demo",
  baseUrl: "http://localhost:3000",
})

await observe("hỗ-trợ-khách", () =>
  client.messages.create({ model, max_tokens, messages }),
{ publicKey, secretKey, baseUrl, sessionId, userId, tags: ["zalo"] })
```

Never send `ANTHROPIC_API_KEY` (or AWS/GCP/Azure secrets) to Vết — only traces.

OTLP: Langfuse public OTLP on the console. Homemade `POST /otlp/v1/traces` on :43173 still dual-writes when `LANGFUSE_*` keys are set.

---

## Parked (not this build)

| Idea | Doc |
|------|-----|
| Excel pipeline-point eval kit | [docs/ideas/01-excel-pipeline-eval.md](docs/ideas/01-excel-pipeline-eval.md) |
| Standalone usage-report SaaS | [docs/ideas/02-agent-trace-usage-saas.md](docs/ideas/02-agent-trace-usage-saas.md) (absorbed as turn receipts) |

Implementation source of truth: [docs/plans/vet-full-plan.html](docs/plans/vet-full-plan.html).
