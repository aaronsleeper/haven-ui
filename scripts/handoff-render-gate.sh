#!/usr/bin/env bash
# handoff-render-gate.sh — build gate for the cena-uconn handoff bundle.
#
# Renders all 9 handoff pages with render-check.mjs and fails if any page
# references a class the bundle cannot realize (undefined-class drift).
# Run after rebuilding handoff/cena-uconn/assets/haven.css — the closed-
# vocabulary contract (DS component classes + the @source inline(...)
# safelist in packages/design-system/src/styles/main.css) only has teeth
# if this gate runs and the build is blocked on its result.
#
#   Exit 0 — every page's undefined-class check passed.
#   Exit 1 — one or more pages drifted, or a check degraded.
#   Exit 2 — tool error (render-check.mjs not found / failed to run).
#
# render-check.mjs is a vault workflow tool (workflows/ui-development/tools/).
# Override its location with RENDER_CHECK=/abs/path if the layout differs.
set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUNDLE="$HERE/../handoff/cena-uconn"
RENDER_CHECK="${RENDER_CHECK:-$HERE/../../../workflows/ui-development/tools/render-check.mjs}"

if [[ ! -f "$RENDER_CHECK" ]]; then
  echo "handoff-render-gate: render-check.mjs not found at $RENDER_CHECK" >&2
  echo "  set RENDER_CHECK=/abs/path/to/render-check.mjs to override" >&2
  exit 2
fi

OUT="$(mktemp -d)"
trap 'rm -rf "$OUT"' EXIT

cd "$BUNDLE"
pages=( index.html assessments/take-*.html meals/order-meals.*.html )
fail=0

for page in "${pages[@]}"; do
  name="$(basename "$page" .html)"
  if ! node "$RENDER_CHECK" "$page" --out "$OUT/$name" >/dev/null 2>&1; then
    echo "ERROR  $page — render-check failed to run" >&2
    fail=1
    continue
  fi
  md="$OUT/$name/render-check.md"
  row="$(grep -E '^\| Undefined classes \|' "$md" 2>/dev/null || true)"
  case "$row" in
    *"| pass |"*)     echo "ok     $page" ;;
    *"| FLAG |"*)     echo "DRIFT  $page — undefined classes (see $md)"; fail=1 ;;
    *"| degraded |"*) echo "DRIFT  $page — undefined-class check degraded"; fail=1 ;;
    *)                echo "ERROR  $page — no undefined-class result" >&2; fail=1 ;;
  esac
done

echo ""
if [[ "$fail" -ne 0 ]]; then
  echo "handoff-render-gate: FAIL — handoff bundle has undefined-class drift."
  echo "  Fix: add the utility to the @source inline(...) safelist in"
  echo "  packages/design-system/src/styles/main.css, or correct the page to"
  echo "  real DS vocabulary, then rebuild haven.css. See handoff/cena-uconn/AGENTS.md."
  exit 1
fi
echo "handoff-render-gate: PASS — all ${#pages[@]} pages render with zero undefined classes."
