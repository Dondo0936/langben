# Thí nghiệm

**Tiếng Việt** · [English](en/experiments.md)

Chạy một [Tập dữ liệu](tap-du-lieu.md) qua prompt/model rồi so output. Trên Vết (Langfuse v4.33.0) mục này **tắt mặc định** (`experimentsV4Enabled`). Sidebar không hiện cho đến khi bật flag.

Mở chỉ khi bạn đang so sánh hai bản prompt trên gold set. Không phải chỗ xem lượt Zalo.

## Mở

Sidebar **Thí nghiệm** — chỉ khi flag bật. URL: `/project/{projectId}/experiments`.

## Dùng

1. Xác nhận flag và dataset đã có item.
2. Tạo experiment: chọn dataset, prompt hoặc model.
3. Chạy, đọc bảng so sánh output / score.
4. Bản `scripts/up.sh` mặc định: bỏ qua mục này.

## Liên quan

- [Tập dữ liệu](tap-du-lieu.md)
- [Prompt](prompt.md)
- [Scores](scores.md)
