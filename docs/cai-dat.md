# Cài đặt

**Tiếng Việt** · [English](en/settings.md)

Cài đặt project và tổ chức: khóa ingest, thành viên, cấu hình score, kết nối LLM, host console.

Mở khi lấy `pk`/`sk`, mời người, hoặc gắn model cho Playground / evaluator.

## Mở

Sidebar **Cài đặt** (dưới cùng). Project: `/project/{projectId}/settings`. Org: `/organization/{organizationId}/settings`.

## Dùng

1. **Khóa API** — public/secret để SDK và OTLP gửi vào console `:3000`. Demo local: `pk-lf-vet-demo` / `sk-lf-vet-demo`. Đổi khóa này trước khi mở `:3000` ra ngoài. Không gửi `ANTHROPIC_API_KEY` vào Vết.
2. **Tên host** — base URL ingest của console này (`http://localhost:3000` khi local).
3. **Cấu hình score** — khai báo tên score (`helpful`) trước khi chấm hàng loạt.
4. **LLM connections** — key model cho [Playground](playground.md) và [Bộ đánh giá](bo-danh-gia.md). Không bắt buộc để nhận webhook Zalo.
5. Thành viên / RBAC — quyền `alerts:read`, `prompts:read`, `datasets:read`, …

Webhook messenger **không** nằm ở đây. Origin và secret kênh: [Kênh](kenh.md).

## Liên quan

- [Kênh](kenh.md)
- [Scores](scores.md)
- [Playground](playground.md)
