#!/usr/bin/env bash
# build-bundle.sh — the one asset-bundler + surface emitter for haven static surfaces.
#
# Converged: this is the single place the "build DS → copy FA woff2 + svg →
# relativize url(/assets/)→url(./)" mechanism lives. Both consumers call it:
#   - surface emit (docs/sot/reason): assets + MODE=standalone HTML emit
#   - cena-uconn handoff: --assets-only + curated JS primitives + logo (no emit)
# The copy + relativize stay ONE step (the FA-glyph-scramble invariant, commit
# 77cd7ae): never re-run the sed without recopying the woff2 binaries.
# Per ~/.claude/plans/surface-emission-convergence.md.
#
# Usage:  bash build-bundle.sh [SURFACE] [--no-build] [--out <dir>]
#                              [--assets-only] [--js "<names>"] [--png]
#         SURFACE = docs (default) | sot | reason   (ignored with --assets-only)
#         --no-build     reuse the existing design-system dist
#         --out <dir>    output dir; assets land in <dir>/assets
#         --assets-only  bundle assets only, no HTML emit, no prose layer
#         --js "<names>" copy these DS scripts/components/<name>.js into assets/
#         --png          copy haven-ui.png (logo) into assets/
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "$HERE/../.." && pwd)"

SURFACE="docs"; NOBUILD=""; OUT_OVERRIDE=""; ASSETS_ONLY=""; JS_LIST=""; WITH_PNG=""
while [ $# -gt 0 ]; do
  case "$1" in
    --no-build) NOBUILD=1 ;;
    --out) shift; OUT_OVERRIDE="$1" ;;
    --assets-only) ASSETS_ONLY=1 ;;
    --js) shift; JS_LIST="$1" ;;
    --png) WITH_PNG=1 ;;
    docs|sot|reason) SURFACE="$1" ;;
  esac
  shift
done

DIST="$REPO/packages/design-system/dist/assets"
DS_SCRIPTS="$REPO/packages/design-system/src/scripts/components"
if [ -n "$OUT_OVERRIDE" ]; then
  OUT="$OUT_OVERRIDE"
else
  case "$SURFACE" in
    docs)   OUT="$HERE/dist" ;;
    sot)    OUT="$REPO/handoff/cena-sot" ;;
    reason) OUT="$REPO/handoff/cena-reasoning" ;;
  esac
fi
ASSETS="$OUT/assets"
TAG="${ASSETS_ONLY:+assets-only}"; TAG="${TAG:-$SURFACE}"

if [ -z "$NOBUILD" ]; then
  echo "build-bundle[$TAG]: [1/4] building @haven/design-system …"
  ( cd "$REPO" && pnpm --filter @haven/design-system build )
else
  echo "build-bundle[$TAG]: [1/4] reusing existing $DIST (--no-build)"
fi

echo "build-bundle[$TAG]: [2/4] copying FA woff2 + svg (+ extras) → assets/ …"
mkdir -p "$ASSETS"
cp "$DIST"/haven-ui*.woff2 "$ASSETS"/
cp "$DIST"/haven-ui*.svg "$ASSETS"/ 2>/dev/null || true
[ -z "$ASSETS_ONLY" ] && cp "$HERE/surface-prose.css" "$ASSETS"/
[ -n "$WITH_PNG" ] && cp "$DIST"/haven-ui.png "$ASSETS"/
for js in $JS_LIST; do
  if [ -f "$DS_SCRIPTS/$js.js" ]; then cp "$DS_SCRIPTS/$js.js" "$ASSETS"/; else echo "  ! missing $DS_SCRIPTS/$js.js"; fi
done

echo "build-bundle[$TAG]: [3/4] concatenating + relativizing url(/assets/) → url(./) into assets/haven.css …"
# Vite splits the design-system CSS across `haven-ui.css`, `haven-ui2.css`,
# `haven-ui3.css`, etc. — one per entry chunk. The dist's own index.html
# loads ALL of them in order. The bundle must ship the same union; copying
# only `haven-ui.css` drops every class that ended up in a sibling chunk
# (the components-heavy `haven-ui2.css` is the load-bearing one — alert,
# escalation, glossary-*, attestation-block, diagram-figure-*, etc.).
# Source incident: 2026-06-07 directive-canon-alignment slice — new haven
# primitives landed in components.css but never reached the SOT bundle
# because Vite had split them into haven-ui2.css.
: > "$ASSETS/haven.css"
for css in "$DIST"/haven-ui*.css; do
  sed -E 's|url\(/assets/|url(./|g' "$css" >> "$ASSETS/haven.css"
done

if [ -n "$ASSETS_ONLY" ]; then
  echo "build-bundle[$TAG]: [4/4] assets-only — no HTML emit."
else
  echo "build-bundle[$TAG]: [4/4] emitting standalone HTML → $OUT/ …"
  MODE=standalone SURFACE="$SURFACE" OUT_DIR="$OUT" node "$HERE/emit.mjs"
fi

echo "build-bundle[$TAG]: ✅ bundle at $OUT/"
