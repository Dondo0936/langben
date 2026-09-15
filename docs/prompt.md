# Prompt

**Tiếng Việt** · [English](en/prompts.md)

Kho prompt có version: tên, nội dung, label (`production`, `latest`). Console không gọi model giùm bot của bạn — bot kéo prompt qua API hoặc copy sang code.

Mở khi soạn / version câu hệ thống, không khi soi một lượt Zalo (dùng [Vết](vet.md)).

## Mở

Sidebar **Prompt** (nhóm Quản lý prompt). URL: `/project/{projectId}/prompts`.

## Dùng

1. Tạo prompt: tên, type (text hoặc chat), nội dung.
2. Mỗi lần lưu là một version. Gắn label khi muốn bot pin bản đó.
3. Mở một version để so sánh diff với bản trước.
4. **Playground** trên prompt (nếu có) đẩy nội dung sang [Playground](playground.md).

Project demo có thể trống. Đó là bình thường — seed hủy đơn không tạo prompt.

## Liên quan

- [Playground](playground.md) — chạy thử
- [Tập dữ liệu](tap-du-lieu.md) — input để regress prompt
