# Vết

**Tiếng Việt** · [English](README.en.md)

Quan sát LLM **kèm** kênh production Việt Nam (Zalo, FPT.AI, Viettel, Lark, Google Chat, .NET). Tự host, MIT. Console ghim Langfuse OSS v4.33.0.

## Chạy local

```bash
git clone --recurse-submodules https://github.com/Dondo0936/langben.git
cd langben
cp .env.console.example .env
bash scripts/up.sh
```

Đã clone: `git submodule update --init --recursive` (hoặc `bash scripts/bootstrap-langfuse.sh`), rồi cùng bước `.env` và `up.sh`.

| Mặt | URL |
|---|---|
| Console | [http://localhost:3000](http://localhost:3000) |
| Web nền tảng (Kênh, Lộ trình, `/hooks`) | [http://localhost:43173](http://localhost:43173) |

Đăng nhập: `demo@vet.dev` / `demodemo`. Org **Vết**, project **Bot Zalo shop** (`prj-vet-demo`).

Lần đầu `up.sh` gắn overlay, build `vet-console:local`, rồi chạy compose. Mất vài phút. `docker` cần root thì script dùng `sudo`.

## Tài liệu

Cách dùng từng mục trên console: [docs/README.md](docs/README.md).

## Cấu trúc repo

```
apps/web                 Site public (Vercel) + Kênh / Lộ trình / webhook. Docker gỡ brochure.
vendor/langfuse          Submodule Langfuse OSS (console :3000)
overlay/langfuse         Logo, nav tiếng Việt, hội thoại — gắn lúc build image
packages/schema          Zod: lượt, span, enum kênh
packages/sdk-js          observe, wrapAnthropic, wrapFptGetAnswer → ingest Langfuse
docs                     Tài liệu console
LICENSE · NOTICE
```

MIT. Console là Langfuse OSS; phần gốc là Kênh / Lộ trình và hook. Xem [NOTICE](NOTICE).
