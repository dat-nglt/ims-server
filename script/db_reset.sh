#!/usr/bin/env bash
set -euo pipefail

# db_reset.sh
# Usage: ./db_reset.sh [-y|--yes] [--no-seed] [--run-server|-r]
#
# Runs:
#   npm run db:drop
#   npm run db:create
#   npm run db:migrate
#   npm run db:seed
#   (optionally) npm run dev
#
# -y / --yes: skip confirmation prompt
# --no-seed: run all steps except seeding
# --run-server, -r: after migrations/seeding, start the server with `npm run dev` (runs in background)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Locate nearest package.json by walking up directories (handles running from repo root or script/)
find_package_root() {
  local dir="$1"
  while [[ "$dir" != "/" && "$dir" != "" ]]; do
    if [[ -f "$dir/package.json" ]]; then
      echo "$dir"
      return 0
    fi
    dir="$(dirname "$dir")"
  done
  return 1
}

PROJECT_ROOT="$(find_package_root "$SCRIPT_DIR" || true)"
if [[ -z "$PROJECT_ROOT" ]]; then
  echo "Error: Could not find package.json in current directory or any parent. Ensure you're inside the project repository." >&2
  exit 2
fi
cd "$PROJECT_ROOT"

YES=0
NO_SEED=0
RUN_SERVER=0

while [[ "$#" -gt 0 ]]; do
  case "$1" in
    -y|--yes) YES=1; shift ;;
    --no-seed) NO_SEED=1; shift ;;
    -r|--run-server) RUN_SERVER=1; shift ;;
    -h|--help) echo "Usage: $0 [-y|--yes] [--no-seed] [--run-server|-r]"; exit 0 ;;
    *) echo "Unknown option: $1"; echo "Usage: $0 [-y|--yes] [--no-seed] [--run-server|-r]"; exit 1 ;;
  esac
done

if ! command -v npm >/dev/null 2>&1; then
  echo "Error: npm not found in PATH. Install Node.js/npm or run inside environment with npm available." >&2
  exit 2
fi

# Quick sanity checks for scripts in package.json
for script in db:drop db:create db:migrate db:seed; do
  if ! grep -q "\"${script}\"\s*:\s*" package.json >/dev/null 2>&1; then
    echo "Warning: package.json does not define script '${script}'. Make sure it exists or edit this script." >&2
  fi
done

if [[ $YES -eq 0 ]]; then
  echo "This will DROP the database and re-create it, then run migrations and seed data."
  read -p "Are you sure you want to continue? (y/N) " confirm
  case "$confirm" in
    [yY]|[yY][eE][sS]) ;;
    *) echo "Aborted by user."; exit 0 ;;
  esac
fi

echo "--- Running: npm run db:drop ---"
npm run db:drop

echo "--- Running: npm run db:create ---"
npm run db:create

echo "--- Running: npm run db:migrate ---"
npm run db:migrate

if [[ $NO_SEED -eq 0 ]]; then
  echo "--- Running: npm run db:seed ---"
  npm run db:seed
else
  echo "--- Skipping seeding (flag --no-seed) ---"
fi

# Optionally start the development server in background
if [[ $RUN_SERVER -eq 1 ]]; then
  echo "--- Starting dev server: npm run dev (background) ---"
  # Start in background; nodemon will watch files and restart as needed
  npm run dev &>/dev/null &
  echo "Dev server started (check logs or use 'ps aux | grep nodemon' to verify)."
fi

echo "--- Database reset completed successfully ---"
