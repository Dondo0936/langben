# Vết overlay for Langfuse OSS

Copied onto `vendor/langfuse` at image-build time (`scripts/apply-langfuse-overlay.sh`).
Do not commit a dirty submodule. MIT UI only — never copy `ee/`.

- `web/public/*.svg` — Vết mark / wordmark
- `LangfuseLogo` / `LangfuseIcon` — alt text “Vết”
- `routes.tsx` — **Kênh** and **Lộ trình**
- `pages/project/[projectId]/channels.tsx` — iframe marketing ChannelForm
- `pages/project/[projectId]/lo-trinh.tsx` — iframe Lộ trình
- `vet/HoiThoai.tsx` — session replay pane
