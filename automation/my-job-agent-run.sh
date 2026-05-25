#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$ROOT/logs"
LOCK_DIR="$ROOT/.my-job-agent.lock"
PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
DASHBOARD_REPO_PATH="${DASHBOARD_REPO_PATH:-/Users/bhuvanchamp/Documents/Projects/Job Search/job-search-dashboard}"
export DASHBOARD_REPO_PATH

timestamp() {
  date '+%Y-%m-%dT%H:%M:%S%z'
}

mkdir -p "$LOG_DIR"

if ! mkdir "$LOCK_DIR" 2>/dev/null; then
  echo "$(timestamp) My Job Agent already running; skipping overlap" >> "$LOG_DIR/my-job-agent.log"
  exit 0
fi

cleanup() {
  rmdir "$LOCK_DIR"
}
trap cleanup EXIT

cd "$ROOT"

{
  echo "==== $(timestamp) My Job Agent scan start ===="
  if [ ! -d node_modules ]; then
    echo "node_modules missing; run npm install before scheduled scans can execute."
    exit 2
  fi
  npm run scan
  npm run dedup -- --dry-run || true
  npm run dashboard:export -- --publish || true
  echo "==== $(timestamp) My Job Agent scan end ===="
} >> "$LOG_DIR/my-job-agent.log" 2>&1
