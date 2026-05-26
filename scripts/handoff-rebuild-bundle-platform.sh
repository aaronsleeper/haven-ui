#!/usr/bin/env bash
# handoff-rebuild-bundle-platform.sh — atomic rebuild of the cena-platform handoff bundle.
#
# Sibling of handoff-rebuild-bundle.sh (which is hardcoded to cena-uconn). Both are
# thin wrappers over the converged bundler at tools/surface-emit/build-bundle.sh —
# one place owns "build DS → copy FA woff2 + svg → relativize url(/assets/)→url(./)".
# Per ~/.claude/plans/cena-platform-pipeline-build.md Phase-3 SETUP.
#
# This wrapper passes the cena-platform extras: the logo (--png) and the CURATED
# JS-primitive allowlist (--js). The allowlist is deliberate, not a blanket copy —
# the care-coordinator platform is operational/dense, not the patient-app register,
# so NO cart-panel / i18n (patient-app-only). Add a primitive here when a platform
# page starts consuming it.
#
#   flow-actions     — nav/save without a router (every surface)
#   context-menu     — row/entity actions on dense tables
#   command-palette  — global patient search (topbar)
#   file-upload      — bulk patient intake (CSV) + Diet-Ops AI import
#   quantity-stepper — weekly-plan / order quantity controls (Diet Operations)
#   bulk-action-bar  — selection-count + visibility + focus mgmt for the bulk bar (S2)
#
# WHY the copy + relativize stay ONE step: re-running the sed without recopying the
# woff2 binaries scrambles FontAwesome Pro glyphs bundle-wide and the render gate
# cannot detect it (classes defined, only the font binary stale). Commit 77cd7ae.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "$HERE/.." && pwd)"

bash "$REPO/tools/surface-emit/build-bundle.sh" \
  --assets-only --png \
  --js "flow-actions context-menu command-palette file-upload quantity-stepper bulk-action-bar" \
  --out "$REPO/handoff/cena-platform"

echo "handoff-rebuild-bundle-platform: ✅ bundle rebuilt via converged bundler — CSS + fonts + JS primitives together."
echo "handoff-rebuild-bundle-platform:    required next step → bash scripts/handoff-render-gate-platform.sh"
