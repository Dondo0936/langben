# Contributing to Vết

Vết is MIT. Open issues and PRs at [github.com/Dondo0936/langben](https://github.com/Dondo0936/langben/issues).

## Dev

```bash
git submodule update --init --recursive
cp .env.console.example .env
bash scripts/up.sh
# platform :43173 (Kênh / hooks) · console :3000
```

Public site only: `npm install && npm run dev`. Do not set `VET_SURFACE=platform` for that process, or the brochure will be gated.

Vietnamese UI copy is native. Do not paste browser-translate English. Keep channel screens (Kênh, Lộ trình, hội thoại) distinct from the Langfuse traces table.

Do not add Langfuse `ee/` code or the Langfuse wordmark. Overlay diffs live in `overlay/langfuse/`; do not rewrite half of `vendor/langfuse` in place.

## Packaging

Product features stay in this MIT tree. The public product is self-host (`VET_DEPLOYMENT=self-host`). Docker sets `VET_SURFACE=platform` so operators get Kênh, Lộ trình, and webhooks, not the landing page.
