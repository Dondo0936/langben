# Users

[Tiếng Việt](../nguoi-dung.md) · **English**

A table of every trace grouped by `userId` (for example `user_ph_demo`). Not a Zalo address book.

Open it when you want how many turns a person ran, cost, and which sessions.

## Open

Sidebar **Người dùng**. URL: `/project/{projectId}/users`.

## Use

1. Search `userId`. Demo seed: `user_ph_demo`.
2. Click the row: traces and sessions for that user.
3. Jump to [Sessions](sessions.md) or [Traces](traces.md) from the ids on the user page.

Empty: ingest did not send `userId`. Gửi thử and the demo seed both set a user.

## Related

- [Sessions](sessions.md) — that user’s conversations
- [Traces](traces.md) — each turn
