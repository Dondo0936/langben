# Vết

Langfuse-class LLM observability **plus** Vietnamese production channels (Zalo, FPT.AI, Viettel, Lark, Google Chat, .NET). Built-in generation layers for Amazon Bedrock, Google Cloud Vertex AI, and Microsoft Foundry.

**Working name.** Vietnamese for “trace / mark.” MIT licensed.

This is **not** a Langfuse fork. Console IA follows the Langfuse MIT shell (sidebar, traces table, waterfall). Brand, Vietnamese chrome, and channel screens are original. See [NOTICE](NOTICE).

---

## How we package it (same motion as Langfuse)

| | **Open Source (self-host)** | **Vết Cloud** | **Enterprise self-host** |
|---|---|---|---|
| Who runs it | You | **We host it for you** | You |
| License | MIT | MIT codebase + hosted service | MIT + commercial add-ons |
| Units | Unlimited | Hobby 50k · paid plans 100k + overage | Unlimited |
| Support | GitHub | In-app (paid) | SLA / named engineer |
| Start | `docker compose up` | [Hobby signup](http://localhost:43173/signup) (no credit card) | Talk to sales |

Cloud plans: **Hobby ($0)** · **Core ($29/mo)** · **Pro ($199/mo)** · **Enterprise ($2,499/mo)**, plus a **Teams** add-on on Pro — usage-based units (traces + observations + scores), graduated overage. Details: `/pricing` and `/pricing/self-host`.

Same git repo. `VET_DEPLOYMENT=cloud` shows billing UI. `VET_DEPLOYMENT=self-host` hides it.

---

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:43173](http://localhost:43173) (uncommon port **43173**).

- Landing (Vietnamese, EN toggle)
- **Xem demo** → console with seeded Zalo / FPT / Viettel traces  
  Login: `demo@vet.dev` / `demo`
- Ingest keys (demo): `pk-vet-demo` / `sk-vet-demo`

Self-host image:

```bash
docker compose up --build
```

### Zalo OA fixture (signature verify)

```bash
node scripts/zalo-fixture.mjs
```

Invalid MAC → **401** and no turn. Valid MAC → session on **Phiên**.

---

## Repo layout

```
apps/web              Next.js App Router — marketing + VI console + ingest/hooks
packages/schema       Zod: turns, spans, channel enums
packages/sdk-js       observe, wrapAnthropic, wrapFptGetAnswer
docs/plans            Product plan (HTML)
LICENSE · NOTICE
```

---

## SDKs

```ts
import Anthropic from "@anthropic-ai/sdk"
import { wrapAnthropic, observe } from "@vet/sdk"

const client = wrapAnthropic(new Anthropic(), {
  publicKey: "pk-vet-demo",
  secretKey: "sk-vet-demo",
  baseUrl: "http://localhost:43173",
})

await observe("hỗ-trợ-khách", () =>
  client.messages.create({ model, max_tokens, messages }),
{ publicKey, secretKey, baseUrl, sessionId, userId, tags: ["zalo"] })
```

Never send `ANTHROPIC_API_KEY` (or AWS/GCP/Azure secrets) to Vết — only traces.

OTLP: `POST /otlp/v1/traces` with Basic `pk:sk`.

---

## Parked (not this build)

| Idea | Doc |
|------|-----|
| Excel pipeline-point eval kit | [docs/ideas/01-excel-pipeline-eval.md](docs/ideas/01-excel-pipeline-eval.md) |
| Standalone usage-report SaaS | [docs/ideas/02-agent-trace-usage-saas.md](docs/ideas/02-agent-trace-usage-saas.md) (absorbed as turn receipts) |

Implementation source of truth: [docs/plans/vet-full-plan.html](docs/plans/vet-full-plan.html).
