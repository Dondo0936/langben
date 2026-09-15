# Kênh

**Tiếng Việt** · [English](en/channels.md)

**Kênh** là chỗ nhận tin production: webhook messenger hoặc SDK/OTLP. Không phải trang Langfuse — console nhúng `:43173/app/channels` (mặc định `http://localhost:43173`). Self-host không chạy trên laptop: build lại console với `NEXT_PUBLIC_VET_MARKETING_URL` trỏ vào origin nền tảng.

Có mặt: Zalo OA, Zalo Bot, FPT.AI Conversation, Viettel ASR/TTS, Lark, Google Chat, .NET/Teams.

Mở khi bật/tắt kênh, dán secret, copy webhook, hoặc **Gửi thử**.

## Mở

Sidebar **Kênh**. URL console: `/project/{projectId}/channels`. Trang thật: `:43173/app/channels?embed=1&project={projectId}`.

## Dùng

1. Dán **Origin công khai** (`https://…`) khi cần URL hook để dán lên Zalo/Lark. Gửi thử **không** cần origin — nó POST loopback `:43173`. Lưu origin chỉ từ UI trên `localhost`, không từ tunnel.
2. Click một thẻ kênh. **Kênh bật** phải bật thì hook nhận tin.
3. Webhook: copy URL đầy đủ (có `https://`). Zalo Bot từ chối path không có scheme.
4. Secret: Zalo OA dùng MAC; Zalo Bot dùng Secret Token (không phải Bot Token). Token demo trong seed (`demo-lark-token`, …) chỉ cho local. Đổi secret trước khi origin `https://` ra ngoài internet.
5. **Gửi thử** (Lark, Google Chat, và một số kênh khác) tạo phiên `lark:ou_local` / `gchat:users_local`. Mở [Phiên](phien.md).
6. Viettel và .NET/Teams không có webhook messenger giống Zalo — ingest bằng SDK/OTLP.

Tin Zalo **thật** không POST được `localhost`. Origin phải `https://` (domain hoặc tunnel), dán trên Kênh khi bạn đang mở `http://localhost:43173`, rồi copy webhook sang admin Zalo. Không publish `:43173` ra internet chỉ để Zalo gọi — tunnel/proxy chỉ `/hooks`.

Fixture không cần app:

```bash
unset VET_PUBLIC_URL
node scripts/zalo-fixture.mjs
node scripts/lark-fixture.mjs
node scripts/gchat-fixture.mjs
```

MAC/token sai → **401**, không có lượt.

## Liên quan

- [Lộ trình](lo-trinh.md) — đường tin sau khi vào kênh
- [Phiên](phien.md) — lượt thật sau Gửi thử
- [Cài đặt](cai-dat.md) — khóa nếu ingest bằng SDK
