# Phiên

**Tiếng Việt** · [English](en/sessions.md)

Một **phiên** gom mọi vết chung `sessionId` — một hội thoại. Overlay Vết thêm **Hội thoại**: tin khách, NLU, tin bot theo thứ tự thời gian.

Mở khi bạn cần cả cuộc, không chỉ một cây. Ví dụ Zalo: khách nói «hủy đơn», bot hỏi mã, khách gửi DH-88421.

## Mở

Sidebar **Phiên**. URL: `/project/{projectId}/sessions`.

Id demo: `zalo_oa:user_ph_demo` sau seed; `lark:ou_local` / `gchat:users_local` sau Gửi thử.

## Dùng

1. Click một session id. Header hiện user, số vết, cost.
2. Từng vết trên phiên có input/output. Đọc text khách và text bot trước, rồi mới nhảy sang cây.
3. Khối **Hội thoại** (nếu có) liệt kê inbound / NLU / outbound theo thời gian.
4. Gắn điểm trên lượt: tên + giá trị (ví dụ `helpful` = 1). Bảng [Điểm](diem.md) sẽ có hàng.
5. Click tên trace để mở [Vết](vet.md).

Empty «Chưa có phiên»: chưa ingest session id. Gửi thử trên Kênh (Lark / Google Chat) tạo phiên ngay, không cần HTTPS.

## Liên quan

- [Vết](vet.md) — một lượt trong phiên
- [Kênh](kenh.md) — Gửi thử để có phiên
- [Người dùng](nguoi-dung.md) — mọi phiên của cùng `userId`
