# Bảng điều khiển

**Tiếng Việt** · [English](en/dashboards.md)

Dashboard widget: đếm trace/observation/score, chi phí theo model, percentile latency. Khác Tổng quan ở chỗ bạn chọn widget và lưu view.

Mở khi Tổng quan không đủ góc nhìn, hoặc khi cần so cost / usage theo model trên một khoảng thời gian.

## Mở

Sidebar **Bảng điều khiển**. URL: `/project/{projectId}/dashboards`.

Bản ghim kèm dashboard sẵn của Langfuse (Cost, Usage). Tên widget có thể còn tiếng Anh.

## Dùng

1. Mở một dashboard có sẵn (Cost hoặc Usage).
2. Đổi khoảng thời gian và environment (`default`) trên thanh trên.
3. Click một widget để xem query; đừng sửa production widget nếu bạn chưa cần.
4. **Tạo bảng điều khiển** khi muốn layout riêng: thêm widget đếm, time series, hoặc bảng.

Empty state nghĩa là chưa có observation trong khoảng lọc — không phải dashboard hỏng. Thu hẹp filter hoặc seed dữ liệu.

## Liên quan

- [Tổng quan](tong-quan.md) — view mặc định, không cần tạo dashboard
- [Cài đặt](cai-dat.md) — environment
