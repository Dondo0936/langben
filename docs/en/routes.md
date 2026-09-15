# Routes

[Tiếng Việt](../lo-trinh.md) · **English**

**Lộ trình** is the step map from inbound to reply: for example `zalo.inbound → fpt.nlu → generation → zalo.outbound`. It does not run the bot. Enable and Gửi thử live on [Channels](channels.md). Live turns live in [Sessions](sessions.md).

Open it to see which channel uses which NLU, or to count local turns per map.

## Open

Sidebar **Lộ trình**. Console URL: `/project/{projectId}/lo-trinh`. Real page: `:43173/app/routes`.

## Use

1. Each card is a seeded map (Zalo→FPT→Claude, Zalo→Viettel ASR, Lark→Claude, …).
2. Chips like `zalo.inbound`, `fpt.nlu`, `generation`, `zalo.outbound` are step names, the same observation names on [Traces](traces.md).
3. The count line: local turns and errors tagged with that `routeId`.
4. **Mở kênh** — the matching channel form.
5. **Xem phiên** — console Sessions.

You do not edit the map on this UI. Secrets, forward URL, enable: go to Channels.

## Related

- [Channels](channels.md) — origin, webhook, Gửi thử
- [Traces](traces.md) — the real steps on the tree
