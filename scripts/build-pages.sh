#!/usr/bin/env bash
# Build care-coordinator + patient and assemble a GitHub Pages site at _site/.
# Each app is built under a subpath matching its eventual URL:
#   https://aaronsleeper.github.io/haven-ui/care-coordinator/
#   https://aaronsleeper.github.io/haven-ui/patient/
# The landing page at _site/index.html links to both.
#
# Invoked by .github/workflows/pages.yml. Safe to run locally for dry-runs.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

SITE_BASE="${SITE_BASE:-/haven-ui}"
OUT="$REPO_ROOT/_site"

echo "==> Cleaning _site/"
rm -rf "$OUT"
mkdir -p "$OUT"

echo "==> Building workspace dependencies (design-system, ui-react)"
pnpm turbo run build --filter=@haven/design-system --filter=@haven/ui-react

build_app() {
  local app_name="$1"
  local app_dir="apps/$app_name"
  local base="$SITE_BASE/$app_name/"

  echo "==> Building $app_name with base=$base"
  (cd "$app_dir" && VITE_BASE="$base" pnpm exec vite build)

  mkdir -p "$OUT/$app_name"
  cp -R "$app_dir/dist/." "$OUT/$app_name/"

  # SPA fallback for client-side routing on GH Pages.
  cp "$OUT/$app_name/index.html" "$OUT/$app_name/404.html"
}

build_app care-coordinator
build_app patient

echo "==> Copying landing page"
cp scripts/pages-landing.html "$OUT/index.html"

# Prevent Jekyll on GH Pages from filtering files that start with underscore.
touch "$OUT/.nojekyll"

echo "==> Done. Output at $OUT"
