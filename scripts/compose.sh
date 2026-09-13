#!/usr/bin/env bash
# docker compose with the Vết file merge (vendor + overrides + branded).
# Use explicit -f flags: sudo resets COMPOSE_FILE, and --project-directory keeps
# relative build contexts (e.g. .build/langfuse) at the repo root even though
# the first file lives under vendor/langfuse/.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

export COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-vet}"
export COMPOSE_BAKE="${COMPOSE_BAKE:-false}"
export DOCKER_BUILDKIT="${DOCKER_BUILDKIT:-1}"
# Do not let a leftover COMPOSE_FILE (or one in .env) fight the -f list.
unset COMPOSE_FILE || true

ARGS=(
  --project-directory "$ROOT"
)
if [[ -f "$ROOT/.env" ]]; then
  ARGS+=(--env-file "$ROOT/.env")
fi
ARGS+=(
  -f "$ROOT/vendor/langfuse/docker-compose.yml"
  -f "$ROOT/docker-compose.yml"
  -f "$ROOT/docker-compose.branded.yml"
)

if docker info >/dev/null 2>&1; then
  exec docker compose "${ARGS[@]}" "$@"
fi
if command -v sudo >/dev/null 2>&1 && sudo docker info >/dev/null 2>&1; then
  # Do not preserve a leftover VET_PUBLIC_URL from the shell. sudo + interpolation
  # would override .env and point hooks at a dead tunnel. Put the URL in .env.
  exec sudo --preserve-env=COMPOSE_PROJECT_NAME,COMPOSE_BAKE,DOCKER_BUILDKIT \
    env -u COMPOSE_FILE -u VET_PUBLIC_URL \
    docker compose "${ARGS[@]}" "$@"
fi
echo "docker is not available" >&2
exit 1
