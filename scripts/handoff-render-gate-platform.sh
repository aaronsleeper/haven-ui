#!/usr/bin/env bash
# handoff-render-gate-platform.sh — build gate for the cena-platform handoff bundle.
#
# Sibling of handoff-render-gate.sh (cena-uconn). Renders every page in the
# cena-platform bundle with render-check.mjs and fails if any page references a
# class the bundle cannot realize (undefined-class drift). The closed-vocabulary
# contract (DS component classes + the @source inline(...) safelist in
# packages/design-system/src/styles/main.css) only has teeth if this gate runs
# and the build is blocked on its result.
#
# Unlike the cena-uconn gate's explicit page array, this gate DISCOVERS pages via
# find — the platform bundle's ~55 pages land incrementally across 7 surfaces, so
# enumerating them by hand would rot. Every .html under the bundle except assets/
# is rendered. Pass a surface name to scope: handoff-render-gate-platform.sh patients
#
#   Exit 0 — every page's undefined-class check passed (or no pages yet).
#   Exit 1 — one or more pages drifted, or a check degraded.
#   Exit 2 — tool error (render-check.mjs not found / failed to run).
set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUNDLE="$HERE/../handoff/cena-platform"
RENDER_CHECK="${RENDER_CHECK:-$HERE/../../../workflows/ui-development/tools/render-check.mjs}"
SCOPE="${1:-}"

if [[ ! -f "$RENDER_CHECK" ]]; then
  echo "handoff-render-gate-platform: render-check.mjs not found at $RENDER_CHECK" >&2
  echo "  set RENDER_CHECK=/abs/path/to/render-check.mjs to override" >&2
  exit 2
fi

if [[ ! -d "$BUNDLE" ]]; then
  echo "handoff-render-gate-platform: bundle dir not found at $BUNDLE" >&2
  echo "  run scripts/handoff-rebuild-bundle-platform.sh first" >&2
  exit 2
fi

OUT="$(mktemp -d)"
trap 'rm -rf "$OUT"' EXIT

cd "$BUNDLE"
# Discover pages: all .html except the assets dir. Scope to a surface if given.
# (macOS ships bash 3.2 — no mapfile; use a portable while-read loop.)
pages=()
if [[ -n "$SCOPE" ]]; then
  while IFS= read -r p; do pages+=("$p"); done < <(find "$SCOPE" -name '*.html' -type f 2>/dev/null | sort)
else
  while IFS= read -r p; do pages+=("$p"); done < <(find . -name '*.html' -type f -not -path './assets/*' 2>/dev/null | sed 's|^\./||' | sort)
fi

if [[ "${#pages[@]}" -eq 0 ]]; then
  echo "handoff-render-gate-platform: no pages found${SCOPE:+ under $SCOPE/} — nothing to gate."
  exit 0
fi

fail=0
for page in "${pages[@]}"; do
  name="$(echo "$page" | tr '/' '_' | sed 's/\.html$//')"
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
  echo "handoff-render-gate-platform: FAIL — bundle has undefined-class drift."
  echo "  Fix: add the utility to the @source inline(...) safelist in"
  echo "  packages/design-system/src/styles/main.css, or correct the page to"
  echo "  real DS vocabulary, then rebuild haven.css. See handoff/cena-platform/AGENTS.md."
  exit 1
fi
echo "handoff-render-gate-platform: PASS — all ${#pages[@]} pages render with zero undefined classes."
