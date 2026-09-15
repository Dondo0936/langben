# Gán nhãn

**Tiếng Việt** · [English](en/annotation.md)

Hàng đợi annotation: người xem lượt và gắn nhãn theo form. Dùng khi LLM-as-judge không đủ, hoặc khi bạn đang định nghĩa rubric.

## Mở

Sidebar **Gán nhãn**. URL: `/project/{projectId}/annotation-queues`.

Cần quyền `annotationQueues:read`.

## Dùng

1. Tạo queue: tên, form (các trường nhãn).
2. Đưa trace/observation vào queue (từ Vết hoặc rule).
3. Mở queue, chấm lần lượt. Kết quả thành score / annotation trên object đó.
4. Demo trống cho đến khi bạn tạo queue.

## Liên quan

- [Điểm](diem.md)
- [Bộ đánh giá](bo-danh-gia.md)
- [Vết](vet.md)
