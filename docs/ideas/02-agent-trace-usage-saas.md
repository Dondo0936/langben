# Idea 2 — Agent tracer + post-run usage report (SaaS)

**Status:** research / saved (2026-09-09)  
**Type:** developer SaaS — route agent traffic in, inspect what it did, get a usage-report dashboard after the run  
**Analogy:** Claude `/usage` + Claude Code analytics, but for *any* agent, as a product

Related parked idea: [`01-excel-pipeline-eval.md`](./01-excel-pipeline-eval.md) (eval scorers). This idea is **observability + reporting**, not scoring workbooks.

---

## The idea in one paragraph

Developers point their agent (coding agent, Excel agent, custom tool loop) at **one tracer endpoint**. Every model call, tool call, and MCP hop is received. After the run they get a **receipt-style usage report** and a dashboard: what it did, which tools, tokens, cost, retries, files/cells touched — not a raw OpenTelemetry waterfall as the primary UX.

Route in → capture → summarize → dashboard.

---

## What “like Claude usage report” actually means

Anthropic already ships pieces of this **only for Claude**:

| Surface | What you get | Limit |
|---------|----------------|--------|
| Claude Code `/usage` | Per-session tokens, $ estimate, % attributed to skills / subagents / MCP | Local, Claude-only |
| [Claude Code analytics](https://code.claude.com/docs/en/analytics) | Org view: accepted lines, accept rate, DAU/sessions, spend, GitHub contribution | Claude Code only; no repo dimension on Console; Bedrock/Foundry traffic invisible |
| [Usage & Cost Admin API](https://platform.claude.com/docs/en/manage-claude/usage-cost-api.md) | Token/cost buckets by model, workspace, cache, web search | Org finance, not “this agent run” |
| [Agent SDK OTel](https://code.claude.com/docs/en/agent-sdk/observability) | Spans for interaction, LLM, tool, hooks | You still need a backend (Langfuse, Datadog, …) |

The product gap is **Claude-report UX + Helicone-simple ingest + agent-level narrative**, for every stack.

A post-run report should look more like a **session receipt** than a trace viewer:

```
Run 8f3a · 4m 12s · $0.84 · claude-sonnet + 2 MCP servers

What it did
  1. Searched repo (rg) 6 times — 2 queries were too broad, then found auth.ts:42
  2. Edited 3 files (accepted 2, reverted 1)
  3. Called github.create_pr once
  4. 38% of tokens were retries after a malformed tool arg

Tools     grep 6 · read 11 · edit 4 · bash 3
MCP       github 2 calls · 1 error
Failures  tool_schema_retry ×2 · empty_search ×1
```

Then roll those receipts into an org dashboard (Claude Code analytics analog): cost, accept rate, tool mix, failure taxonomy over time.

---

## Landscape (2026) — this category is crowded

### Layer A — LLM proxies (route traffic, lowest friction)

| Product | Job | Weakness vs this idea |
|---------|-----|------------------------|
| **Helicone** | Change base URL, get cost/latency logs | LLM-call grain, not agent narrative |
| **LiteLLM** | OSS unified proxy, keys, budgets | Infra, not a usage-report product |
| **Portkey** | Gateway + guardrails + dashboards | Governance/control plane, engineer UI |
| **OpenRouter** | Marketplace + light usage | Billing, not “what the agent did” |
| **agentgateway** (LF) | LLM + MCP + A2A proxy, OTel | Platform infra; Jaeger/Langfuse for viewing |

Routing-in is a **solved ingest pattern**. Do not compete on “we are a better LiteLLM.” Compete on **what you show after the run**.

### Layer B — Trace workbenches (see every span)

| Product | Job | Weakness vs this idea |
|---------|-----|------------------------|
| **LangSmith** | Deepest LangChain/LangGraph traces + evals | SDK-centric; dashboard you interpret |
| **Langfuse** | OSS workbench, prompts, datasets, cost | Trace UI first; analysis DIY |
| **Arize Phoenix** | OTel-native, clustering, evals | Toolkit, not a receipt |
| **Braintrust** | Eval-gated CI | Lab, not post-run usage report |
| **Sentry AI agent tracing** | Session replay as conversation + APM | Tied to Sentry; error-first |
| **Cloudflare Agents tracing** | Session replay + waterfall | Cloudflare runtime lock-in |
| **Riptides Activity Monitor** | Session list: models, tools, MCP, blocked | Security/policy angle |
| **AgentTrace / failproof** | Record/replay, fork at a step | Debugger, not SaaS usage report |

TwoTail’s own 2026 roundup: **trace capture and per-trace inspection are mature; aggregate analysis is where tools split.** Most expect you to read dashboards yourself.

### Layer C — “Tell me why” analytics

| Product | Job |
|---------|-----|
| **TwoTail** | Analyst agent over traces (failure clustering, “why is it behaving this way?”) |
| Claude Code analytics | Org productivity metrics for one vendor |

Closest cousins to the *report* UX, still not “route any agent → per-run receipt → org usage SaaS.”

---

## Honest crowding assessment

**Do not build “Langfuse but nicer traces.”** You will lose.

**Maybe build** if the product is a **usage report for agent runs**, with proxy ingest as the on-ramp:

1. **Ingest:** OpenAI-compatible proxy *and/or* OTLP (Claude Agent SDK already emits this)
2. **Normalize:** model calls + tool/MCP + (optional) file/cell edits into one run object
3. **Summarize:** deterministic stats first; LLM narrative second (cheap model)
4. **Dashboard:** run list → receipt → org rollup (cost, tools, failure tags)
5. **Share:** linkable run report (the “SaaS Claude /usage”)

Helicone gets you (1) for LLM calls. Langfuse gets you (2) as spans. **Nobody owns (3)+(4) as the primary product** for generic agents the way Anthropic owns it for Claude Code.

---

## Differentiation that could still be real

| Differentiator | Why it matters | Who almost has it |
|----------------|----------------|-------------------|
| **Receipt UX, not waterfall UX** | Devs want “what did it do / what did it cost” in 10 seconds | Claude `/usage` (vendor-locked) |
| **Zero-SDK route-in** | Coding agents and Excel add-ins are painful to wrap | Helicone, agentgateway, Portkey |
| **Agent grain, not LLM-call grain** | Tool loops, retries, MCP, subagents | LangSmith/Langfuse if you instrument well |
| **Failure taxonomy on the report** | `empty_search`, `schema_retry`, `over_edit` | Eval tools, not usage dashboards |
| **Cross-product** | Cursor + Claude Code + custom Excel agent in one bill/report | Nobody; vendor analytics are siloed |
| **Post-run push** | Slack/email “your run finished” with the receipt | Rare; most are pull-UIs |

Optional later join with Idea 1: same tracer feeds **excel-target** scorers when the payload is a workbook agent.

---

## Where value is weak (avoid)

- Prompt playground, dataset hub, CI eval gates → Braintrust/Langfuse/LangSmith
- Semantic cache, fallback routing, guardrails → Portkey/LiteLLM
- Autonomous “why is prod failing?” → TwoTail
- Full session debugger / time-travel replay → Sentry, failproof, AgentTrace

Those are adjacent. A thin usage-report SaaS should **emit OTel** so power users still open Langfuse, and **not** try to replace it.

---

## MVP (if built)

**Persona:** solo/small team shipping a tool-using agent who today pastes Langfuse URLs into Slack.

**Loop:**

1. Set `OPENAI_BASE_URL` / Anthropic proxy / `OTEL_EXPORTER_OTLP_ENDPOINT` to the service
2. Run the agent once
3. Open `/runs/{id}` — receipt page (what it did, tools, tokens, cost, errors)
4. `/dashboard` — last 7 days: spend, run count, top tools, retry rate
5. Optional webhook when a run ends

**Non-goals for v1:** prompt versioning, LLM-as-judge evals, multi-tenant enterprise SSO, being an LLM marketplace.

**Technical sketch:**

- Ingest: LiteLLM-compatible proxy + OTLP HTTP
- Store: run → spans → normalized events
- Summarizer: rules (tool histogram, retry detection, token rollup) + optional 1-shot narrative
- UI: run receipt + org dashboard (Next.js)

**Kill criteria:** if the receipt is just Helicone’s request log with a paragraph of LLM fluff, stop. The report must reconstruct **agent-level actions** (tools, retries, artifacts), which means capturing tool/MCP spans, not only `/v1/messages`.

---

## Recommended stance

| Question | Answer |
|----------|--------|
| Is the idea real? | Yes — developers want Claude-style usage reports for *their* agents |
| Is ingest novel? | No — proxy + OTel is table stakes |
| Is the category empty? | No — observability is mature in 2026 |
| Is there a wedge? | **Post-run agent receipt + org usage SaaS**, vendor-agnostic, report-first |
| Risk | Looks like Helicone/Langfuse until the receipt is clearly better |
| Fit with Idea 1 | Tracer can later attach Excel pipeline scorers to matching runs |

**Build this only if** the first screenshot is a **run receipt**, not a span tree. If the first artifact is a generic trace viewer, the idea has already collapsed into the crowded layer.
