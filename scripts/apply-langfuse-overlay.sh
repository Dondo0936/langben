#!/usr/bin/env bash
# Copy Vết overlay onto a Langfuse tree (default: .build/langfuse).
# Does not dirty vendor/langfuse — run after rsync from the submodule.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VENDOR="$ROOT/vendor/langfuse"
OVERLAY="$ROOT/overlay/langfuse"
DEST="${1:-$ROOT/.build/langfuse}"

if [[ ! -d "$VENDOR/web" ]]; then
  echo "vendor/langfuse is missing. Run: bash scripts/bootstrap-langfuse.sh" >&2
  exit 1
fi

mkdir -p "$DEST"
if command -v rsync >/dev/null 2>&1; then
  rsync -a --checksum --delete --exclude .git "$VENDOR/" "$DEST/"
  rsync -a --checksum "$OVERLAY/" "$DEST/"
else
  rm -rf "$DEST"
  cp -R "$VENDOR" "$DEST"
  rm -rf "$DEST/.git"
  cp -R "$OVERLAY/." "$DEST/"
fi

python3 - "$DEST" <<'PY'
from pathlib import Path
import sys
dest = Path(sys.argv[1])
replacements = {
    "Sign in | Langfuse": "Sign in | Vết",
    "Sign up | Langfuse": "Sign up | Vết",
    "Sign-in Error | Langfuse": "Sign-in Error | Vết",
    "Signing in | Langfuse": "Signing in | Vết",
    "Onboarding | Langfuse": "Onboarding | Vết",
    "Enterprise SSO Required | Langfuse": "Enterprise SSO Required | Vết",
    "Langfuse on Hugging Face": "Vết on Hugging Face",
}
pages = dest / "web/src"
if pages.is_dir():
    for path in pages.rglob("*"):
        if path.suffix not in {".tsx", ".ts"}:
            continue
        rel = str(path).replace("\\", "/")
        if "/ee/" in rel or "clienttest" in path.name or ".test." in path.name:
            continue
        text = path.read_text()
        orig = text
        for a, b in replacements.items():
            text = text.replace(a, b)
        text = text.replace(" | Langfuse", " | Vết")
        if text != orig:
            path.write_text(text)
            print("retitled", path.relative_to(dest))

doc = dest / "web/src/pages/_document.tsx"
if doc.is_file():
    text = doc.read_text()
    needle = "      <Head />"
    inject = '''      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`html,body{font-family:"Be Vietnam Pro",ui-sans-serif,system-ui,sans-serif}`}</style>
      </Head>'''
    if "Be Vietnam Pro" not in text and needle in text:
        doc.write_text(text.replace(needle, inject, 1))
        print("fonts", doc.relative_to(dest))

css = dest / "web/src/styles/globals.css"
if css.is_file():
    extra = """
/* Vết overlay: monochrome + Be Vietnam Pro. */
html {
  font-family: "Be Vietnam Pro", ui-sans-serif, system-ui, sans-serif;
  color-scheme: dark;
}
html, body, #__next {
  background: #000 !important;
}
.dark {
  --background: 0 0% 0%;
  --foreground: 0 0% 88%;
  --card: 0 0% 4%;
  --header: 0 0% 0%;
  --primary-accent: 0 0% 88%;
  --link: 0 0% 88%;
  --link-hover: 0 0% 100%;
  --ring: 0 0% 80%;
  --destructive: 0 0% 72%;
  --chart-1: 0 0% 88%;
  --chart-2: 0 0% 72%;
  --chart-3: 0 0% 54%;
  --chart-4: 0 0% 80%;
  --chart-5: 0 0% 64%;
  --chart-6: 0 0% 48%;
  --chart-7: 0 0% 76%;
  --chart-8: 0 0% 40%;
  --muted-blue: 0 0% 72%;
  --muted-green: 0 0% 72%;
  --muted-magenta: 0 0% 72%;
  --light-red: oklch(28% 0 0 / 0.7);
  --dark-red: oklch(78% 0 0);
  --light-yellow: oklch(32% 0 0 / 0.45);
  --dark-yellow: oklch(82% 0 0);
  --light-green: oklch(30% 0 0 / 0.7);
  --dark-green: oklch(80% 0 0);
  --light-blue: 0 0% 16%;
  --dark-blue: 0 0% 72%;
  --accent-light-green: 0 0% 9%;
  --accent-dark-green: 0 0% 70%;
  --accent-light-blue: 0 0% 12%;
  --accent-dark-blue: 0 0% 78%;
  --light-violet: 0 0% 16%;
  --dark-violet: 0 0% 78%;
  --light-teal: 0 0% 12%;
  --dark-teal: 0 0% 70%;
  --qlang-field: 0 0% 78%;
  --qlang-value: 0 0% 70%;
  --qlang-number: 0 0% 82%;
  --qlang-keyword: 0 0% 74%;
  --preview-banner: 0 0% 12%;
  --preview-banner-border: 0 0% 22%;
  --preview-banner-link: 0 0% 80%;
  --preview-banner-link-hover: 0 0% 92%;
}
"""
    current = css.read_text()
    if "Vết overlay" not in current:
        css.write_text(current + extra)
        print("css", css.relative_to(dest))

app = dest / "web/src/pages/_app.tsx"
if app.is_file():
    text = app.read_text()
    old_theme = """                        <ThemeProvider
                          attribute="class"
                          enableSystem
                          disableTransitionOnChange
                        >"""
    new_theme = """                        <ThemeProvider
                          attribute="class"
                          forcedTheme="dark"
                          enableSystem={false}
                          disableTransitionOnChange
                        >"""
    if "forcedTheme" not in text and old_theme in text:
        app.write_text(text.replace(old_theme, new_theme, 1))
        print("theme", app.relative_to(dest))

envp = dest / "web/src/env.mjs"
if envp.is_file():
    env = envp.read_text()
    if "NEXT_PUBLIC_VET_MARKETING_URL" not in env:
        env = env.replace(
            "    NEXT_PUBLIC_BASE_PATH: z.string().optional(),\n",
            "    NEXT_PUBLIC_BASE_PATH: z.string().optional(),\n    NEXT_PUBLIC_VET_MARKETING_URL: z.string().url().optional(),\n",
            1,
        )
        env = env.replace(
            "    NEXT_PUBLIC_BUILD_ID: process.env.NEXT_PUBLIC_BUILD_ID,\n",
            "    NEXT_PUBLIC_BUILD_ID: process.env.NEXT_PUBLIC_BUILD_ID,\n    NEXT_PUBLIC_VET_MARKETING_URL: process.env.NEXT_PUBLIC_VET_MARKETING_URL,\n",
            1,
        )
        envp.write_text(env)
        print("env", envp.relative_to(dest))

df = dest / "web/Dockerfile"
if df.is_file():
    text = df.read_text()
    needle = "ARG NEXT_PUBLIC_BASE_PATH\nENV NEXT_PUBLIC_BASE_PATH=$NEXT_PUBLIC_BASE_PATH\n"
    inject = needle + "ARG NEXT_PUBLIC_VET_MARKETING_URL\nENV NEXT_PUBLIC_VET_MARKETING_URL=$NEXT_PUBLIC_VET_MARKETING_URL\n"
    if "NEXT_PUBLIC_VET_MARKETING_URL" not in text and needle in text:
        df.write_text(text.replace(needle, inject, 1))
        print("dockerfile", df.relative_to(dest))

ncfg = dest / "web/next.config.mjs"
if ncfg.is_file():
    text = ncfg.read_text()
    old_frame = "  frame-src 'self' https://challenges.cloudflare.com"
    new_frame = (
        "  frame-src 'self' http://localhost:43173 http://127.0.0.1:43173 "
        "http://localhost:* http://127.0.0.1:* https://challenges.cloudflare.com"
    )
    old_font = "  font-src ${assetPrefixSrc}'self';"
    new_font = "  font-src ${assetPrefixSrc}'self' https://fonts.gstatic.com https://fonts.googleapis.com;"
    orig = text
    if "http://localhost:43173" not in text:
        text = text.replace(old_frame, new_frame, 1)
        text = text.replace(
            "  frame-src 'self' http://localhost:* http://127.0.0.1:* https://challenges.cloudflare.com",
            new_frame,
            1,
        )
    if "https://fonts.gstatic.com" not in text:
        text = text.replace(old_font, new_font, 1)
    if text != orig:
        ncfg.write_text(text)
        print("csp", ncfg.relative_to(dest))

def patch(rel, replacements):
    path = dest / rel
    if not path.is_file():
        return
    text = path.read_text()
    orig = text
    for a, b in replacements:
        text = text.replace(a, b)
    if text != orig:
        path.write_text(text)
        print("chrome", path.relative_to(dest))

patch("web/src/features/filters/components/filter-builder.tsx", [
    ('label = "Filters"', 'label = "Bộ lọc"'),
])
patch("packages/shared/src/utils/dateRanges.ts", [
    ('label: "Past 5 min"', 'label: "5 phút qua"'),
    ('label: "Past 30 min"', 'label: "30 phút qua"'),
    ('label: "Past 1 hour"', 'label: "1 giờ qua"'),
    ('label: "Past 3 hours"', 'label: "3 giờ qua"'),
    ('label: "Past 6 hours"', 'label: "6 giờ qua"'),
    ('label: "Past 1 day"', 'label: "1 ngày qua"'),
    ('label: "Past 3 days"', 'label: "3 ngày qua"'),
    ('label: "Past 7 days"', 'label: "7 ngày qua"'),
    ('label: "Past 14 days"', 'label: "14 ngày qua"'),
    ('label: "Past 30 days"', 'label: "30 ngày qua"'),
    ('label: "Past 90 days"', 'label: "90 ngày qua"'),
    ('label: "Past 1 year"', 'label: "1 năm qua"'),
    ('label: "All time"', 'label: "Mọi lúc"'),
    ('label: "Custom"', 'label: "Tùy chọn"'),
])
patch("web/src/pages/project/[projectId]/index.tsx", [
    ('?? "Langfuse Home"', '?? "Trang chủ Vết"'),
    ('title="Environment"', 'title="Môi trường"'),
    ('label="Env"', 'label="Môi trường"'),
    (
        'title="Show this dashboard on Home for everyone in this project"',
        'title="Hiện bảng này trên Tổng quan cho mọi người trong dự án"',
    ),
    ("Set default", "Đặt mặc định"),
    (
        'title="Edit this dashboard in Dashboards"',
        'title="Sửa bảng này trong Bảng điều khiển"',
    ),
    (
        "Edit this dashboard in Dashboards",
        "Sửa bảng này trong Bảng điều khiển",
    ),
    ("Configure Tracing", "Cấu hình truy vết"),
])
patch("web/src/features/v4-migration/V4MigrationContent.tsx", [
    (
        '''          <span>·</span>
          <a
            href="https://cal.com/team/langfuse/v4-upgrade"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => capture("v4_migration:contact_book_call_clicked")}
            className="underline"
          >
            Book a call
          </a>''',
        "",
    ),
])
PY

echo "Overlay applied → $DEST"
