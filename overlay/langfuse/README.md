# Vết overlay for Langfuse OSS

Copied onto a Langfuse tree at image-build time (`scripts/up.sh` / `scripts/apply-langfuse-overlay.sh`).
Do not commit a dirty submodule. MIT UI only — never copy `ee/`.

- `web/public/*.svg` — Vết mark / wordmark
- Overlay CSS: forced dark + grayscale
- `LangfuseLogo` / `LangfuseIcon` — alt text “Vết”
- `routes.tsx` — Vietnamese sidebar
- `vet/copy.ts` + `layouts/page.tsx` + `container-page.tsx` — page titles
- `useLayoutMetadata.ts` — document title `| Vết`
- Onboarding splashes (Cảnh báo, Phiên, Người dùng, Prompt, Điểm, Dataset, gán nhãn, tracing setup)
- Home chart titles + `NoDataOrLoading` + Home picker
- `IntroSection.tsx` / `SupportDrawer.tsx` — Hỗ trợ drawer; Issues at github.com/Dondo0936/langben
- `pages/project/[projectId]/channels.tsx` / `lo-trinh.tsx` — iframe marketing
- `vet/HoiThoai.tsx` — session replay
- Apply script also retitles `| Langfuse`, Home Filters / Env / time ranges, and drops V4 Book a call
