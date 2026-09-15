# Vết

<img src="readme/logo.png" alt="Vết" width="72" align="right" />

**Tiếng Việt** · [English](README.en.md)

LLM observability plus Vietnamese production channels (Zalo, FPT.AI, Viettel, Lark). Self-hosted. Console is Langfuse OSS v4.33.0.

<p align="center">
  <img src="readme/vi/overview.png" alt="Tổng quan Vết: vết, chi phí model, và score của Bot Zalo shop" width="900" />
</p>

<table>
  <tr>
    <td width="50%"><img src="readme/vi/session.png" alt="Phiên Zalo OA: hủy đơn, DH-88421, và score helpful trên một luồng" /></td>
    <td width="50%"><img src="readme/vi/trace.png" alt="Cây vết: zalo.inbound → fpt.nlu → crm.lookup_order → Claude → zalo.outbound" /></td>
  </tr>
  <tr>
    <td width="50%"><img src="readme/vi/channels.png" alt="Kênh: Zalo OA, Zalo Bot, FPT.AI, Viettel, Lark, Google Chat, Teams" /></td>
    <td width="50%"><img src="readme/vi/routes.png" alt="Lộ trình từ webhook inbound tới NLU, generation, và tin trả" /></td>
  </tr>
</table>

<p align="center">
  <img src="readme/vi/scores.png" alt="Scores: helpful = 1 trên cả hai lượt hủy đơn" width="900" />
</p>

## Chạy local

```bash
git clone --recurse-submodules https://github.com/Dondo0936/langben.git
cd langben
cp .env.console.example .env
bash scripts/up.sh
```

| | URL |
|---|---|
| Console | [http://localhost:3000](http://localhost:3000) |
| Kênh, Lộ trình, `/hooks` | [http://localhost:43173](http://localhost:43173) |

Đăng nhập: `demo@vet.dev` / `demodemo`. Org Vết, project Bot Zalo shop (`prj-vet-demo`).

Lần đầu mất vài phút. `docker` cần root thì script dùng `sudo`. Đổi mật khẩu và khóa demo trước khi mở cổng ra ngoài.

Tài liệu: [docs/README.md](docs/README.md).

## Cấu trúc repo

```
apps/web                 Kênh / Lộ trình / webhook
vendor/langfuse          Submodule Langfuse OSS (console :3000)
overlay/langfuse         UI tiếng Việt trên console
docs                     Tài liệu console
readme                   Ảnh GitHub README
```

Xem [NOTICE](NOTICE).
