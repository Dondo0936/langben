#!/bin/sh
# Drop the public brochure from a Docker build. Vercel still ships the full site.
set -eu
ROOT="$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)"
WEB="$ROOT/apps/web/src"

if [ "${VET_SURFACE:-platform}" != "platform" ]; then
  echo "skip brochure strip (VET_SURFACE=${VET_SURFACE:-})"
  exit 0
fi

rm -rf \
  "$WEB/app/self-host" \
  "$WEB/app/signup" \
  "$WEB/app/open-source" \
  "$WEB/app/pricing" \
  "$WEB/app/security" \
  "$WEB/app/changelog" \
  "$WEB/app/enterprise" \
  "$WEB/app/docs" \
  "$WEB/app/login" \
  "$WEB/app/demo" \
  "$WEB/app/install.sh" \
  "$WEB/components/marketing"

rm -rf \
  "$WEB/app/app/traces" \
  "$WEB/app/app/sessions" \
  "$WEB/app/app/observations" \
  "$WEB/app/app/settings" \
  "$WEB/app/app/studio"
rm -f "$WEB/app/app/page.tsx" "$WEB/app/page.tsx"
rm -f "$WEB/lib/platform-surface.test.ts"

echo "stripped brochure routes for VET_SURFACE=platform"
