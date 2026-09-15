# Playground

**Tiếng Việt** · [English](en/playground.md)

Chỗ chạy một prompt + message với model đã cấu hình trên instance. Không phải kênh Zalo. Không ingest webhook.

Mở khi bạn muốn thử câu prompt trước khi pin version. **Cần model config** (API key LLM trên Cài đặt / LLM connections). Thiếu config thì trang báo “No Model Configured”.

## Mở

Sidebar **Playground**. URL: `/project/{projectId}/playground`.

## Dùng

1. Trước hết: [Cài đặt](cai-dat.md) → kết nối model (OpenAI, Anthropic, … tùy instance).
2. Dán prompt hoặc kéo từ [Prompt](prompt.md).
3. Gửi một message. Xem output, token, latency.
4. Không thấy Zalo / DH-88421 ở đây. Lượt production nằm ở [Phiên](phien.md).

Bản demo `scripts/up.sh` thường **chưa** có model config. Đừng lấy empty playground làm hỏng demo — bỏ qua mục này cho đến khi bạn tự gắn key.

## Liên quan

- [Prompt](prompt.md) — nơi lưu version
- [Cài đặt](cai-dat.md) — LLM connection
