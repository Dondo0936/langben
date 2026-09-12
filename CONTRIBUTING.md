# Contributing to Vết

Vết is MIT. Issues and PRs are welcome.

## Dev

```bash
git submodule update --init --recursive
cp .env.console.example .env
docker compose up --build
# marketing :43173 · console :3000
```

Marketing-only: `npm install && npm run dev`.

Vietnamese UI copy is native — do not paste browser-translate English. Keep channel screens (Kênh, Lộ trình, hội thoại) distinct from the Langfuse traces table.

Do not add Langfuse `ee/` code or the Langfuse wordmark. Overlay diffs live in `overlay/langfuse/`; do not rewrite half of `vendor/langfuse` in place.

## Packaging

Product features stay in this MIT tree. Cloud is a hosted deployment of the same app (`VET_DEPLOYMENT=cloud`), not a closed-source fork.
