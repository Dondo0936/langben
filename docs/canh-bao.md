# Cảnh báo

**Tiếng Việt** · [English](en/alerts.md)

Cảnh báo theo dõi metric (số vết lỗi, latency, cost) và gửi thông báo khi vượt ngưỡng. Có trên Langfuse v4 khi project không ở chế độ ghi legacy.

Mở khi production đã có traffic và bạn cần biết lúc kênh im hoặc error rate tăng — không dùng để xem một lượt.

## Mở

Sidebar **Cảnh báo**. URL: `/project/{projectId}/alerts`.

Nếu mục không hiện: tài khoản thiếu quyền `alerts:read`, hoặc write mode đang `legacy`.

## Dùng

1. Tạo cảnh báo: chọn metric, ngưỡng, khoảng đánh giá.
2. Gắn kênh thông báo (email / webhook tùy cấu hình instance).
3. Để im lặng theo environment nếu staging không cần pager.

Cảnh báo không thay [Vết](vet.md). Khi pager kêu, mở Vết lọc status error.

## Liên quan

- [Tổng quan](tong-quan.md) — nhìn số trước khi đặt ngưỡng
- [Cài đặt](cai-dat.md) — quyền thành viên
