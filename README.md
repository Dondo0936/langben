# Vết

Langfuse-class LLM observability **plus** Vietnamese production channels (Zalo, FPT.AI, Viettel, Lark, Google Chat, .NET). Built-in generation layers for Amazon Bedrock, Google Cloud Vertex AI, and Microsoft Foundry.

**Working name.** Vietnamese for “trace / mark.” MIT licensed.

The **console** is Langfuse OSS (MIT, ClickHouse, Inc.) rebranded as Vết. Marketing, Kênh / Lộ trình, and Zalo–FPT hooks are original. We do not ship `ee/` or `LANGFUSE_EE_LICENSE_KEY`. See [NOTICE](NOTICE).

Pinned runtime: **Langfuse v4.33.0** (`81bbfd169b72ea2ed53639699cc6632e8f908ce8`) in `vendor/langfuse`.

---

## How we package it

Vết is **open source self-host** (MIT). You run it. Units are unlimited. Start with `bash scripts/up.sh`.

A **đơn vị / unit** is not an LLM token. One unit = one trace, observation, or score. Self-host does not meter them. Explainer: `/docs/units`. Pricing: `/pricing`.

---

## Run locally

```bash
git submodule update --init --recursive   # or: bash scripts/bootstrap-langfuse.sh
cp .env.console.example .env
bash scripts/up.sh
```

`scripts/up.sh` applies the Vết overlay, builds `vet-console:local`, and starts marketing + Langfuse. The first build compiles the console overlay and takes several minutes. Later runs are faster if the images still exist. Equivalent after overlay: `bash scripts/compose.sh up --build`. Do not rely on `COMPOSE_FILE` in `.env`; the script passes `-f` flags and unsets `COMPOSE_FILE`. If `docker` needs root, the script uses `sudo`.

Put a public tunnel in `.env` as `VET_PUBLIC_URL`. Do not export it in the shell. `compose.sh` drops a leftover shell value so `.env` wins. A dead tunnel breaks live OA webhooks and the fixture scripts. **Gửi thử** on Kênh posts to loopback `:43173` and does not use the tunnel.

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
# Uses VET_PUBLIC_URL if set, else http://localhost:43173
unset VET_PUBLIC_URL
node scripts/zalo-fixture.mjs
```

Invalid MAC → **401** and no turn. Valid MAC → session `zalo_oa:user_fixture` on **Sessions** in the console.

### Lark / Google Chat fixtures (no developer app)

You do not need a Lark or Google Chat app to test those webhooks locally. Demo tokens are already on Kênh.

```bash
unset VET_PUBLIC_URL
node scripts/lark-fixture.mjs    # url_verification + inbound → session lark:ou_fixture
node scripts/gchat-fixture.mjs   # Bearer token + inbound → session gchat:users_fixture
```

Invalid token → **401**. In the console, Kênh → Lark or Google Chat → **Gửi thử** does the same ingest into sessions `lark:ou_local` / `gchat:users_local`.

A real Lark/Google bot still needs their developer console and a public HTTPS URL. Do that when you have the app; the local fixtures cover ingest + overlay first.

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

`@vet/sdk` is `packages/sdk-js` in this repo. It is not published to npm yet. After clone, import the workspace package.

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

Never send `ANTHROPIC_API_KEY` (or AWS/GCP/Azure secrets) to Vết. Send traces only.

OTLP: Langfuse public OTLP on the console. Homemade `POST /otlp/v1/traces` on :43173 still dual-writes when `LANGFUSE_*` keys are set.

---

## Parked (not this build)

| Idea | Doc |
|------|-----|
| Excel pipeline-point eval kit | [docs/ideas/01-excel-pipeline-eval.md](docs/ideas/01-excel-pipeline-eval.md) |
| Standalone usage-report SaaS | [docs/ideas/02-agent-trace-usage-saas.md](docs/ideas/02-agent-trace-usage-saas.md) (absorbed as turn receipts) |

Implementation source of truth: [docs/plans/vet-full-plan.html](docs/plans/vet-full-plan.html).
