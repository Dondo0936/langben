# Traces

[Tiếng Việt](../vet.md) · **English**

A **trace** is one agent turn: a tree of observations from inbound to outbound. It is not a chat log. On Zalo, a typical cancel-order trace is `zalo.inbound` → `fpt.nlu` → `crm.lookup_order` → `generation` → `zalo.outbound`.

Open it when you need **one** turn: per-step input/output, latency, tokens, errors.

## Open

Sidebar **Vết** (Quan sát). URL: `/project/{projectId}/traces`.

## Use

1. The left table is the list. Filter by name (`zalo-oa · hủy DH-88421`), session, user, tag, environment.
2. Click a row. The middle column is the **tree**. Click each node: inbound, NLU, tool, LLM, outbound.
3. The right column is Preview: input, output, metadata (`vet_channel`, `routeId`, `oa_id`).
4. **Scores** on an observation or on the root trace — the score attached to that step.
5. Metadata `sessionId` takes you to [Sessions](sessions.md) for the same conversation.

Demo seed: `node scripts/seed-langfuse-zalo.mjs`, then open `tr_ph_huy_2` (DH-88421, includes `crm.lookup_order`).

No tree: ingest never reached the console, or you filtered an environment other than `default`. Ingest keys live in [Settings](settings.md).

## Related

- [Sessions](sessions.md) — the same turn inside a conversation
- [Routes](routes.md) — expected steps for that channel
- [Scores](scores.md) — label the turn after you read the tree
