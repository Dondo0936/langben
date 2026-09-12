#!/usr/bin/env bash
# docker compose with the Vết file merge (vendor + overrides + branded).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
export COMPOSE_FILE="${COMPOSE_FILE:-vendor/langfuse/docker-compose.yml:docker-compose.yml:docker-compose.branded.yml}"
export COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-vet}"
if docker info >/dev/null 2>&1; then
  exec docker compose "$@"
fi
if command -v sudo >/dev/null 2>&1 && sudo docker info >/dev/null 2>&1; then
  exec sudo docker compose "$@"
fi
echo "docker is not available" >&2
exit 1
