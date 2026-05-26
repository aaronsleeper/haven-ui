#!/usr/bin/env bash
# handoff-rebuild-bundle.sh — atomic rebuild of the cena-uconn handoff asset bundle.
#
# As of 2026-05-26 this is a THIN WRAPPER over the converged bundler at
# tools/surface-emit/build-bundle.sh — one place owns the "build DS → copy FA
# woff2 + svg → relativize url(/assets/)→url(./)" mechanism for every haven
# static surface. Verified 2026-05-26 to produce byte-identical assets to the
# prior standalone script. Per ~/.claude/plans/surface-emission-convergence.md.
#
# This wrapper passes the HANDOFF-specific extras the converged bundler is told
# to add: the logo (--png) and the CURATED JS-primitive allowlist (--js). The
# allowlist is deliberate, not a blanket copy: the handoff has its own flow
# runners (assessment-runner.js etc.) that supersede the DS prototype engines
# (assessment.js / meals.js have a conflicting DOM contract). Add a primitive
# here when a page starts consuming it.
#
# WHY the copy + relativize stay ONE step: re-running the sed without recopying
# the woff2 binaries scrambles FontAwesome Pro glyphs bundle-wide, and the render
# gate cannot detect it (classes defined, only the font binary stale). Commit
# 77cd7ae. The converged bundler preserves this invariant (copy then relativize,
# one run).
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "$HERE/.." && pwd)"

bash "$REPO/tools/surface-emit/build-bundle.sh" \
  --assets-only --png \
  --js "flow-actions quantity-stepper cart-panel i18n" \
  --out "$REPO/handoff/cena-uconn"

echo "handoff-rebuild-bundle: ✅ bundle rebuilt via converged bundler — CSS + fonts + JS primitives together."
echo "handoff-rebuild-bundle:    required next step → bash scripts/handoff-render-gate.sh"
