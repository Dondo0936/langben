#!/usr/bin/env bash
# Clone Langfuse OSS at the pinned tag into vendor/langfuse.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TAG="${LANGFUSE_TAG:-v4.33.0}"
DEST="$ROOT/vendor/langfuse"
if [[ -d "$DEST/web" ]]; then
  echo "vendor/langfuse already present"
  git -C "$DEST" describe --tags --always
  exit 0
fi
git clone --depth 1 --branch "$TAG" https://github.com/langfuse/langfuse.git "$DEST"
echo "cloned $TAG → $DEST"
