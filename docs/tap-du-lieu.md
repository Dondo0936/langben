# Tập dữ liệu

**Tiếng Việt** · [English](en/datasets.md)

Dataset là bộ item input (/ expected output) để so prompt, chạy experiment, hoặc làm gold set. Không phải phiên Zalo live.

Mở khi bạn muốn regress một câu bot trên nhiều case, không khi đang soi DH-88421 production.

## Mở

Sidebar **Tập dữ liệu**. URL: `/project/{projectId}/datasets`.

Cần quyền `datasets:read`.

## Dùng

1. Tạo dataset, thêm item (input, expected output tùy chọn).
2. Add from trace: trên [Vết](vet.md) có **Add to datasets**.
3. Chạy với [Bộ đánh giá](bo-danh-gia.md) hoặc [Thí nghiệm](thi-nghiem.md) nếu bật.
4. Demo seed không điền dataset.

## Liên quan

- [Vết](vet.md) — nguồn item thật
- [Thí nghiệm](thi-nghiem.md)
- [Prompt](prompt.md)
