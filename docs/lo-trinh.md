# Lộ trình

**Tiếng Việt** · [English](en/routes.md)

**Lộ trình** là sơ đồ bước từ tin vào đến tin trả: ví dụ `zalo.inbound → fpt.nlu → generation → zalo.outbound`. Không chạy bot. Bật/tắt và Gửi thử nằm ở [Kênh](kenh.md). Lượt thật nằm ở [Phiên](phien.md).

Mở khi bạn muốn xem kênh nào đi NLU nào, hoặc đếm lượt local theo từng map.

## Mở

Sidebar **Lộ trình**. URL console: `/project/{projectId}/lo-trinh`. Trang thật: `:43173/app/routes`.

## Dùng

1. Mỗi thẻ là một map đã seed (Zalo→FPT→Claude, Zalo→Viettel ASR, Lark→Claude, …).
2. Các viên `zalo.inbound`, `fpt.nlu`, `generation`, `zalo.outbound` là tên bước, cùng tên observation trên [Vết](vet.md).
3. Dòng đếm: số lượt local và số lỗi gắn `routeId` đó.
4. **Mở kênh** — sang form kênh tương ứng.
5. **Xem phiên** — sang console Phiên.

Không sửa map trên UI này. Đổi secret, forward URL, bật kênh: sang Kênh.

## Liên quan

- [Kênh](kenh.md) — origin, webhook, Gửi thử
- [Vết](vet.md) — bước thật trên cây
