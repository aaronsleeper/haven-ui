#!/usr/bin/env bash
# build-bundle.sh — assemble a self-contained surface bundle (any surface).
#
# Converged bundler: one parameterized script replacing the two prior copies
# (scripts/handoff-rebuild-bundle.sh + the old per-spike build-bundle.sh). Same
# mechanism: compiled CSS + FA woff2 binaries copied together, url(/assets/) ->
# url(./) relativized, prose layer copied, then MODE=standalone emit.
# Per ~/.claude/plans/surface-emission-convergence.md.
#
# Usage:  bash build-bundle.sh [SURFACE] [--no-build]
#         SURFACE = docs (default) | sot
#         --no-build reuses the existing design-system dist
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "$HERE/../.." && pwd)"

SURFACE="docs"; NOBUILD=""
for a in "$@"; do
  case "$a" in
    --no-build) NOBUILD=1 ;;
    docs|sot|reason) SURFACE="$a" ;;
  esac
done

DIST="$REPO/packages/design-system/dist/assets"
case "$SURFACE" in
  docs)   OUT="$HERE/dist" ;;
  sot)    OUT="$HERE/dist-sot" ;;
  reason) OUT="$HERE/dist-reason" ;;
esac
ASSETS="$OUT/assets"

if [ -z "$NOBUILD" ]; then
  echo "build-bundle[$SURFACE]: [1/4] building @haven/design-system …"
  ( cd "$REPO" && pnpm --filter @haven/design-system build )
else
  echo "build-bundle[$SURFACE]: [1/4] reusing existing $DIST (--no-build)"
fi

echo "build-bundle[$SURFACE]: [2/4] copying FA woff2 + svg + prose layer → assets/ …"
mkdir -p "$ASSETS"
cp "$DIST"/haven-ui*.woff2 "$ASSETS"/
cp "$DIST"/haven-ui*.svg "$ASSETS"/ 2>/dev/null || true
cp "$HERE/surface-prose.css" "$ASSETS"/

echo "build-bundle[$SURFACE]: [3/4] relativizing url(/assets/) → url(./) into assets/haven.css …"
sed -E 's|url\(/assets/|url(./|g' "$DIST/haven-ui.css" > "$ASSETS/haven.css"

echo "build-bundle[$SURFACE]: [4/4] emitting standalone HTML → $(basename "$OUT")/ …"
MODE=standalone SURFACE="$SURFACE" node "$HERE/emit.mjs"

echo "build-bundle[$SURFACE]: ✅ bundle at tools/surface-emit/$(basename "$OUT")/"
echo "build-bundle[$SURFACE]:    serve: cd tools/surface-emit/$(basename "$OUT") && python3 -m http.server 8799"
