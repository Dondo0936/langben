# Tổng quan

**Tiếng Việt** · [English](en/overview.md)

Trang chủ project: số vết đã ghi, chi phí model, score, và biểu đồ theo thời gian.

Mở khi bạn muốn biết project đang sống — có ingest không, model nào tốn token, score nào đã gắn — trước khi soi một lượt cụ thể.

## Mở

Sidebar **Tổng quan**. URL: `/project/{projectId}`.

## Dùng

1. Đăng nhập, chọn org **Vết**, project **Bot Zalo shop**.
2. Thẻ **Vết** đếm trace. Tên hay gặp: `zalo-oa · hủy đơn`, `zalo-oa · hủy DH-88421`, `lark · im.message.receive_v1`.
3. Thẻ **Chi phí model** là token × giá. Demo local thường $0.00.
4. Thẻ **Scores** đếm score đã ingest (ví dụ `# helpful`).
5. Cuộn xuống biểu đồ thời gian và mức dùng. Click một tên trace trên thẻ để sang [Vết](vet.md).

Trang này không tạo dữ liệu. Hết số 0 thì seed hoặc Gửi thử — xem [bắt đầu](README.md#lộ-trình-mới-dùng).

## Liên quan

- [Bảng điều khiển](bang-dieu-khien.md) — cùng số liệu, layout tùy biến
- [Vết](vet.md) — từng lượt
- [Scores](scores.md) — bảng score
