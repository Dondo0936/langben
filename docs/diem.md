# Điểm

**Tiếng Việt** · [English](en/scores.md)

**Điểm** là nhãn chất lượng trên một lượt, observation, hoặc phiên — ví dụ `helpful = 1`. Không phải token. Không phải đơn vị billing.

Mở khi đã có lượt trên [Phiên](phien.md) và bạn muốn ghi «lượt này ổn / không ổn».

## Mở

Sidebar **Điểm** (nhóm Đánh giá agent). URL: `/project/{projectId}/scores`.

## Dùng

1. Bảng: timestamp, tên (`helpful`), giá trị, comment, trace. Seed demo có hai hàng hủy đơn.
2. Gắn điểm mới: mở [Phiên](phien.md) hoặc [Vết](vet.md) → thêm score (tên + giá trị). Gửi thử **không** tự tạo điểm.
3. Tab **Phân tích** cần chọn tên score trên dropdown. Để trống thì empty state «Select a Score» — không phải lỗi.
4. Đặt tên score chuẩn ở Cài đặt → Cấu hình điểm, rồi mới chấm hàng loạt.
5. Production: SDK gửi score cùng trace (khóa pk/sk ở [Cài đặt](cai-dat.md)).

Đừng dùng tab Phân tích khi chưa có hàng trong bảng Điểm.

## Liên quan

- [Phiên](phien.md) — chỗ chấm tay một lượt
- [Bộ đánh giá](bo-danh-gia.md) — chấm tự động
- [Tổng quan](tong-quan.md) — đếm score
