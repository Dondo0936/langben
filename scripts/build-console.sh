#!/usr/bin/env bash
# Apply overlay and build a branded console image: vet-console:local
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
bash "$ROOT/scripts/apply-langfuse-overlay.sh" "$ROOT/.build/langfuse"
docker build \
  --build-arg NEXT_PUBLIC_VET_MARKETING_URL="${NEXT_PUBLIC_VET_MARKETING_URL:-http://localhost:43173}" \
  -f "$ROOT/.build/langfuse/web/Dockerfile" \
  -t vet-console:local \
  "$ROOT/.build/langfuse"
echo "Built vet-console:local"
echo "Run: bash scripts/up.sh"
