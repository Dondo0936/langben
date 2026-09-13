#!/usr/bin/env bash
# One-command self-host: overlay → branded console + marketing.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -d "$ROOT/vendor/langfuse/web" ]]; then
  bash "$ROOT/scripts/bootstrap-langfuse.sh"
fi

if [[ ! -f "$ROOT/.env" ]]; then
  cp "$ROOT/.env.console.example" "$ROOT/.env"
  echo "wrote .env from .env.console.example"
fi

bash "$ROOT/scripts/apply-langfuse-overlay.sh" "$ROOT/.build/langfuse"
echo "Starting Compose. Marketing http://localhost:43173  Console http://localhost:3000  Login demo@vet.dev / demodemo"
exec bash "$ROOT/scripts/compose.sh" up --build "$@"
