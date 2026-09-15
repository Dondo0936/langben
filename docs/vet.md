# Vết

**Tiếng Việt** · [English](en/traces.md)

Một **vết** là một lượt agent: cây observation từ tin vào đến tin ra. Không phải log chat. Trên Zalo, một vết hủy đơn điển hình là `zalo.inbound` → `fpt.nlu` → `crm.lookup_order` → `generation` → `zalo.outbound`.

Mở khi bạn cần soi **một** lượt: input/output từng bước, latency, token, lỗi.

## Mở

Sidebar **Vết** (nhóm Quan sát). URL: `/project/{projectId}/traces`.

## Dùng

1. Bảng bên trái là danh sách. Lọc theo tên (`zalo-oa · hủy DH-88421`), session, user, tag, environment.
2. Click một hàng. Cột giữa là **cây**. Click từng node: inbound, NLU, tool, LLM, outbound.
3. Cột phải là Preview: input, output, metadata (`vet_channel`, `routeId`, `oa_id`).
4. Tab **Scores** trên observation hoặc trên root trace — điểm gắn vào bước đó.
5. Metadata `sessionId` đưa bạn sang [Phiên](phien.md) cùng hội thoại.

Seed demo: `node scripts/seed-langfuse-zalo.mjs` rồi mở `tr_ph_huy_2` (DH-88421, có `crm.lookup_order`).

Không thấy cây: ingest chưa tới console, hoặc bạn đang lọc environment khác `default`. Khóa ingest nằm ở [Cài đặt](cai-dat.md).

## Liên quan

- [Phiên](phien.md) — cùng lượt trong hội thoại
- [Lộ trình](lo-trinh.md) — bước kỳ vọng của kênh đó
- [Điểm](diem.md) — chấm lượt sau khi xem cây
