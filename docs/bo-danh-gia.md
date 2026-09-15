# Bộ đánh giá

**Tiếng Việt** · [English](en/evaluators.md)

Evaluator (LLM-as-judge hoặc heuristic) chạy trên trace/dataset và ghi [Điểm](diem.md). Không thay Gửi thử. Không thay người đọc cây.

Mở khi đã có lượt (hoặc [Tập dữ liệu](tap-du-lieu.md)) và muốn chấm lặp lại — ví dụ «câu trả lời có nêu mã đơn không».

## Mở

Sidebar **Bộ đánh giá**. URL: `/project/{projectId}/evals`.

Cần quyền `evaluator:read` hoặc `evaluationRule:read`.

## Dùng

1. Tạo evaluator: model chấm, prompt chấm, tên score output.
2. Gắn rule: chạy trên trace mới, hoặc trên một dataset.
3. Xem job/result; điểm rơi vào bảng Điểm.
4. Empty onboarding là bình thường trên demo — seed hủy đơn không tạo evaluator.

Cần LLM connection giống [Playground](playground.md). Thiếu model thì job fail.

## Liên quan

- [Điểm](diem.md) — nơi kết quả hiện
- [Tập dữ liệu](tap-du-lieu.md) — input để chạy hàng loạt
- [Gán nhãn](gan-nhan.md) — khi cần người chấm, không phải LLM
