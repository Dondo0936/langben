# Sessions

[Tiếng Việt](../phien.md) · **English**

A **session** groups every trace that shares a `sessionId` — one conversation. The Vết overlay adds **Hội thoại**: customer text, NLU, bot reply in time order.

Open it when you need the whole thread, not one tree. Example: customer says «hủy đơn», bot asks for the id, customer sends DH-88421.

## Open

Sidebar **Phiên**. URL: `/project/{projectId}/sessions`.

Demo ids: `zalo_oa:user_ph_demo` after seed; `lark:ou_local` / `gchat:users_local` after Gửi thử.

## Use

1. Click a session id. The header shows user, trace count, cost.
2. Each trace on the session has input/output. Read customer text and bot text first, then jump to the tree.
3. **Hội thoại** (when present) lists inbound / NLU / outbound in time order.
4. Attach a score on the turn: name + value (for example `helpful` = 1). The [Scores](scores.md) table gets a row.
5. Click the trace name to open [Traces](traces.md).

Empty «Chưa có phiên»: nothing ingested a session id. Gửi thử on Kênh (Lark / Google Chat) creates a session immediately, no HTTPS required.

## Related

- [Traces](traces.md) — one turn inside the session
- [Channels](channels.md) — Gửi thử to get a session
- [Users](users.md) — every session for the same `userId`
