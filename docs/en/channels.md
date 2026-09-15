# Channels

[Tiếng Việt](../kenh.md) · **English**

**Kênh** is where production messages land: messenger webhooks or SDK/OTLP. Not a Langfuse page — the console embeds `http://localhost:43173/app/channels`.

Present: Zalo OA, Zalo Bot, FPT.AI Conversation, Viettel ASR/TTS, Lark, Google Chat, .NET/Teams.

Open it to enable a channel, paste secrets, copy the webhook, or **Gửi thử**.

## Open

Sidebar **Kênh**. Console URL: `/project/{projectId}/channels`. Real page: `:43173/app/channels?embed=1&project={projectId}`.

## Use

1. Paste **Origin công khai** when you need an `https://…/hooks/…` URL for Zalo/Lark. **Gửi thử** does **not** need an origin — it POSTs loopback `:43173`.
2. Open a channel card. **Kênh bật** must be on or the hook ignores traffic.
3. Webhook: copy the full URL (including `https://`). Zalo Bot rejects a path with no scheme.
4. Secrets: Zalo OA uses MAC; Zalo Bot uses Secret Token (not Bot Token); Lark / Google Chat ship a demo token.
5. **Gửi thử** (Lark, Google Chat, and some other channels) creates session `lark:ou_local` / `gchat:users_local`. Open [Sessions](sessions.md).
6. Viettel and .NET/Teams have no Zalo-style messenger webhook — ingest with SDK/OTLP.

A **live** Zalo message cannot POST to `localhost`. Origin must be `https://` (your domain or a tunnel), pasted on Kênh, then copy the webhook into Zalo admin.

Fixtures, no vendor app required:

```bash
unset VET_PUBLIC_URL
node scripts/zalo-fixture.mjs
node scripts/lark-fixture.mjs
node scripts/gchat-fixture.mjs
```

Bad MAC/token → **401**, no turn.

## Related

- [Routes](routes.md) — path after the channel accepts the message
- [Sessions](sessions.md) — the turn after Gửi thử
- [Settings](settings.md) — keys if you ingest with the SDK
