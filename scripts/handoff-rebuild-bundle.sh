#!/usr/bin/env bash
# handoff-rebuild-bundle.sh — atomic rebuild of the cena-uconn handoff asset bundle.
#
# Runs the rebuild as ONE inseparable command:
#   1. build the design system   → packages/design-system/dist/assets/
#   2. copy the binary assets     (FA Pro fonts, SVG fallbacks, logo) into the bundle
#   3. rewrite the built CSS's absolute url(/assets/) → relative url(./) and
#      write it to handoff/cena-uconn/assets/haven.css
#
# WHY this must be one command:
#   Doing the CSS step alone — re-running the sed without recopying the woff2
#   font binaries — scrambles FontAwesome Pro glyphs bundle-wide. Every slice's
#   icons mis-map to the wrong glyph, and the render gate CANNOT detect it: the
#   classes are all defined, only the font binary is stale, so it passes a gate
#   that only checks for undefined classes. Commit 77cd7ae. The CSS + fonts are
#   versioned together; this script makes them one operation so they can never
#   drift apart again.
#
# Idempotent + safe to re-run: the build is deterministic, cp overwrites in
# place, and the sed regenerates haven.css from dist each time. No partial
# state — either the whole bundle rebuilds or set -e halts.
#
# Run from anywhere; resolves the haven-ui repo root from its own location.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "$HERE/.." && pwd)"
cd "$REPO"

DIST="packages/design-system/dist/assets"
BUNDLE="handoff/cena-uconn/assets"

echo "handoff-rebuild-bundle: [1/3] building @haven/design-system …"
pnpm --filter @haven/design-system build

echo "handoff-rebuild-bundle: [2/3] copying binary assets (fonts + svg + logo) → $BUNDLE/ …"
mkdir -p "$BUNDLE"
cp "$DIST"/haven-ui*.woff2 "$BUNDLE"/   # ← the inseparable step (see WHY above)
cp "$DIST"/haven-ui*.svg "$BUNDLE"/
cp "$DIST"/haven-ui.png "$BUNDLE"/

echo "handoff-rebuild-bundle: [3/4] rewriting url(/assets/) → url(./) into haven.css …"
sed -E 's|url\(/assets/|url(./|g' "$DIST/haven-ui.css" > "$BUNDLE/haven.css"

# [4/4] Bundle the design-system's framework-agnostic JS primitives so flows ship
# interactive (not just navigable). CURATED ALLOWLIST — not a blanket copy: the
# handoff has its own flow runners (assessment-runner.js etc.) that deliberately
# supersede the DS prototype engines (assessment.js / meals.js have a conflicting
# DOM contract — see assessment-runner.js header). Copying those would collide.
# Add a primitive here when a page starts consuming it.
echo "handoff-rebuild-bundle: [4/4] copying DS JS component primitives (curated) → $BUNDLE/ …"
DS_SCRIPTS="packages/design-system/src/scripts/components"
for js in flow-actions quantity-stepper cart-panel i18n; do
  if [ -f "$DS_SCRIPTS/$js.js" ]; then cp "$DS_SCRIPTS/$js.js" "$BUNDLE/$js.js"; else echo "  ! missing $DS_SCRIPTS/$js.js"; fi
done

echo "handoff-rebuild-bundle: ✅ bundle rebuilt — CSS + fonts + JS primitives together."
echo "handoff-rebuild-bundle:    required next step → bash scripts/handoff-render-gate.sh"
