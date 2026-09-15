# Vết overlay for Langfuse OSS

Copied onto a Langfuse tree at image-build time (`scripts/up.sh` / `scripts/apply-langfuse-overlay.sh`).
Do not commit a dirty submodule. MIT UI only — never copy `ee/`.

- `web/public/*.svg` — Vết mark / wordmark
- Overlay CSS: forced dark + grayscale
- `LangfuseLogo` / `LangfuseIcon` — alt text “Vết”
- `routes.tsx` — Vietnamese sidebar
- `vet/copy.ts` + `layouts/page.tsx` + `container-page.tsx` — page titles
- `useLayoutMetadata.ts` — document title `| Vết`
- Onboarding splashes (Cảnh báo, Phiên, Người dùng, Prompt, Scores, Dataset, gán nhãn, tracing setup, bộ đánh giá)
- Playground `NoModelConfiguredAlert`, Prompt list chrome, evals tabs / empty state
- Home chart titles + `NoDataOrLoading` + Home picker
- `IntroSection.tsx` / `SupportDrawer.tsx` — Hỗ trợ → GitHub Dondo0936/langben
- Hide Langfuse v4 “Cần xử lý” / V4 preview / org v4 banner / account “v4 Migration”
- `pages/project/[projectId]/channels.tsx` / `lo-trinh.tsx` — iframe platform web (`:43173`)
- Scores onboarding in console. Brochure-only `/docs/scores` (404 on Docker platform)
- `vet/HoiThoai.tsx` — session replay
- Apply script also retitles `| Langfuse`, Home Filters / Env / time ranges, and drops V4 Book a call
