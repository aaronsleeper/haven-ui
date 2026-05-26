#!/usr/bin/env bash
# build-bundle.sh — assemble the self-contained doc-emit bundle (spike).
#
# Mirrors scripts/handoff-rebuild-bundle.sh (the production precedent for shipping
# haven-ui as static HTML without the toolchain): compiled CSS + FA font binaries,
# url(/assets/) -> url(./) relativized, so the output renders from any plain static
# server with no Vite, no Tailwind, no dev server. The CSS + fonts are versioned
# together; copying fonts and rewriting CSS is ONE step on purpose (see the handoff
# script's WHY note — recopying CSS without fonts scrambles FA glyphs).
#
# Usage:  bash build-bundle.sh        # build DS, bundle assets, emit standalone HTML
#         bash build-bundle.sh --no-build   # reuse existing design-system dist
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "$HERE/../.." && pwd)"

DIST="$REPO/packages/design-system/dist/assets"
OUT="$HERE/dist"
ASSETS="$OUT/assets"

if [ "${1:-}" != "--no-build" ]; then
  echo "build-bundle: [1/4] building @haven/design-system …"
  ( cd "$REPO" && pnpm --filter @haven/design-system build )
else
  echo "build-bundle: [1/4] skipping DS build (--no-build); reusing $DIST"
fi

echo "build-bundle: [2/4] copying FA Pro font binaries + svg fallbacks → assets/ …"
mkdir -p "$ASSETS"
cp "$DIST"/haven-ui*.woff2 "$ASSETS"/
cp "$DIST"/haven-ui*.svg "$ASSETS"/ 2>/dev/null || true

echo "build-bundle: [3/4] relativizing url(/assets/) → url(./) into assets/haven.css …"
sed -E 's|url\(/assets/|url(./|g' "$DIST/haven-ui.css" > "$ASSETS/haven.css"

echo "build-bundle: [4/4] emitting standalone HTML → dist/ …"
MODE=standalone node "$HERE/emit.mjs"

echo "build-bundle: ✅ self-contained bundle at spikes/doc-emit/dist/"
echo "build-bundle:    serve with: cd spikes/doc-emit/dist && python3 -m http.server 8799"
