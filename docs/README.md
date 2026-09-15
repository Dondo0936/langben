# Console Vết

**Tiếng Việt** · [English](README.en.md)

Hai bề mặt, một project:

| Bề mặt | Cổng | Việc |
|---|---|---|
| Console | [http://localhost:3000](http://localhost:3000) | Xem lượt, score, prompt, cài đặt |
| Web nền tảng | [http://localhost:43173](http://localhost:43173) | Kênh, Lộ trình, webhook. Console nhúng hai mục này vào sidebar |

Kênh và Lộ trình không phải trang Langfuse. Chúng chạy trên `:43173` và hiện trong console qua iframe.

Mỗi trang tài liệu cùng một khung: **là gì**, **khi nào mở**, **cách mở**, **cách dùng**, **mục liên quan**.

## Lộ trình mới dùng

1. [Chạy local](../README.md#chạy-local) — `bash scripts/up.sh`, đăng nhập `demo@vet.dev` / `demodemo`.
2. Mở project **Bot Zalo shop**. Sidebar trái là toàn bộ console.
3. Tạo một lượt demo (chọn một):
   - `node scripts/seed-langfuse-zalo.mjs` — cây hủy đơn (`tr_zalo_huy_don`)
   - Kênh → Lark hoặc Google Chat → **Gửi thử** — phiên ngay, không cần HTTPS công khai
4. Đọc lượt đó trên [Phiên](phien.md), rồi cùng lượt trên [Vết](vet.md).
5. Sau đó mới sang Kênh, Scores, Prompt khi bạn cần chúng.

Đừng bắt đầu từ Playground hay Bộ đánh giá. Playground cần model config. Bộ đánh giá cần lượt đã có.

## Mọi module

Thứ tự giống sidebar.

### Vào project

| Mục | Việc |
|---|---|
| [Tổng quan](tong-quan.md) | Số vết, chi phí, score của project |
| [Bảng điều khiển](bang-dieu-khien.md) | Dashboard tùy biến (cost, usage, widget) |

### Quan sát

| Mục | Việc |
|---|---|
| [Vết](vet.md) | Một lượt dạng cây: inbound → NLU → tool → generation → outbound |
| [Phiên](phien.md) | Nhiều vết cùng một hội thoại |
| [Kênh](kenh.md) | Webhook Zalo / FPT / Viettel / Lark / Google Chat, Gửi thử |
| [Lộ trình](lo-trinh.md) | Sơ đồ inbound → trả lời |
| [Người dùng](nguoi-dung.md) | Gom lượt theo `userId` |
| [Cảnh báo](canh-bao.md) | Thông báo khi metric vượt ngưỡng |

### Quản lý prompt

| Mục | Việc |
|---|---|
| [Prompt](prompt.md) | Prompt có version |
| [Playground](playground.md) | Chạy thử prompt với model đã cấu hình |

### Đánh giá agent

| Mục | Việc |
|---|---|
| [Scores](scores.md) | Nhãn chất lượng trên lượt / observation / phiên |
| [Bộ đánh giá](bo-danh-gia.md) | Chấm tự động (LLM-as-judge) |
| [Gán nhãn](gan-nhan.md) | Hàng đợi người chấm |
| [Tập dữ liệu](tap-du-lieu.md) | Input/output kỳ vọng để so sánh |
| [Thí nghiệm](thi-nghiem.md) | Chạy dataset (tắt mặc định trên bản ghim này) |

### Hệ thống

| Mục | Việc |
|---|---|
| [Cài đặt](cai-dat.md) | Khóa API, thành viên, cấu hình score, host ingest |
