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
pages = dest / "web/src/pages"
if pages.is_dir():
    for path in pages.rglob("*.tsx"):
        if "/ee/" in str(path).replace("\\", "/"):
            continue
        text = path.read_text()
        orig = text
        for a, b in replacements.items():
            text = text.replace(a, b)
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
/* Vết overlay: keep Langfuse zinc shell; Be Vietnam Pro for Vietnamese chrome. */
html {
  font-family: "Be Vietnam Pro", ui-sans-serif, system-ui, sans-serif;
}
"""
    current = css.read_text()
    if "Vết overlay" not in current:
        css.write_text(current + extra)
        print("css", css.relative_to(dest))

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
PY

echo "Overlay applied → $DEST"
