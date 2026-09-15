# Vết

[Tiếng Việt](README.md) · **English**

LLM observability **plus** Vietnamese production channels (Zalo, FPT.AI, Viettel, Lark, Google Chat, .NET). Self-hosted, MIT. Console pins Langfuse OSS v4.33.0.

## Run locally

```bash
git clone --recurse-submodules https://github.com/Dondo0936/langben.git
cd langben
cp .env.console.example .env
bash scripts/up.sh
```

Already cloned: `git submodule update --init --recursive` (or `bash scripts/bootstrap-langfuse.sh`), then the same `.env` and `up.sh` steps.

| Surface | URL |
|---|---|
| Console | [http://localhost:3000](http://localhost:3000) |
| Platform web (Kênh, Lộ trình, `/hooks`) | [http://localhost:43173](http://localhost:43173) |

Login: `demo@vet.dev` / `demodemo`. Org **Vết**, project **Bot Zalo shop** (`prj-vet-demo`).

The first `up.sh` applies the overlay, builds `vet-console:local`, then starts compose. That takes several minutes. If `docker` needs root, the script uses `sudo`.

## Docs

How to use every item in the console: [docs/README.en.md](docs/README.en.md).

## Repo layout

```
apps/web                 Public site (Vercel) + Kênh / Lộ trình / webhooks. Docker strips the brochure.
vendor/langfuse          Langfuse OSS submodule (console :3000)
overlay/langfuse         Logo, Vietnamese nav, hội thoại — applied at image build
packages/schema          Zod: turns, spans, channel enums
packages/sdk-js          observe, wrapAnthropic, wrapFptGetAnswer → Langfuse ingest
docs                     Console documentation
LICENSE · NOTICE
```

MIT. The console is Langfuse OSS; Kênh / Lộ trình and the hooks are original. See [NOTICE](NOTICE).
