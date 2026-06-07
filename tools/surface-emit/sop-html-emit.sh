#!/usr/bin/env bash
#
# sop-html-emit.sh — render a SoP markdown source to a haven-styled HTML page.
#
# Wraps three steps:
#   1. resolve-diagram-directives.mjs — pre-pandoc runner (slug → PNG + rewrite)
#   2. pandoc -t html5                — body fragment via the haven Lua filter
#   3. wrap in .document-shell        — link the haven.css bundle + Google Fonts
#
# Why pandoc (not surface-emit/handlers.mjs): the SoP corpus is authored in
# pandoc directive syntax (`::: callout-warning`, `::: escalation`, etc.) and
# remark-directive does not parse that form. Pandoc + the haven Lua filter
# render every directive natively as `<div class="..."> </div>` which the
# haven CSS bundle styles. Symmetric with the docx pipeline (same source, same
# Lua filter, FORMAT-aware diagram branch emits <figure>+<img> on HTML).
#
# Usage:
#   sop-html-emit.sh <input.md> <output.html> [staging-dir]
#
# staging-dir defaults to a sibling of the output. Holds the runner's
# rewritten markdown + _diagram-cache/ (PNG per slug). Re-runs reuse cached
# diagram outputs; delete the staging-dir to force regenerate.
#
# After emission, the PNG referenced in the resolved markdown is copied into
# <output-dir>/assets/ and the <img src=> is rewritten to point at the
# colocated copy, so the HTML is self-contained per
# feedback_self_contained_handoff_format.

set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 <input.md> <output.html> [staging-dir]" >&2
  exit 64
fi

INPUT="$1"
OUTPUT="$2"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
HAVEN_UI_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

HAVEN_CSS_SRC="$SCRIPT_DIR/dist-sot/assets/haven.css"

INPUT_ABS="$(cd "$(dirname "$INPUT")" && pwd)/$(basename "$INPUT")"
OUTPUT_ABS="$(mkdir -p "$(dirname "$OUTPUT")" && cd "$(dirname "$OUTPUT")" && pwd)/$(basename "$OUTPUT")"
OUTPUT_DIR="$(dirname "$OUTPUT_ABS")"
STAGING_DIR="${3:-$OUTPUT_DIR/_sop-staging-$(basename "${INPUT_ABS%.md}")}"

mkdir -p "$STAGING_DIR"
mkdir -p "$OUTPUT_DIR/assets"

RESOLVED_MD="$STAGING_DIR/$(basename "${INPUT_ABS%.md}")-resolved.md"

# 1. Runner — rewrite :::diagram directives + cache rendered HTML + PNG
node "$SCRIPT_DIR/resolve-diagram-directives.mjs" \
  --input "$INPUT_ABS" \
  --output "$RESOLVED_MD" \
  --cache-dir "$STAGING_DIR/_diagram-cache"

# 2. pandoc → HTML body fragment with the haven Lua filter
BODY_HTML="$STAGING_DIR/body.html"
(
  cd "$STAGING_DIR"
  pandoc "$(basename "$RESOLVED_MD")" \
    --from=markdown+fenced_divs+bracketed_spans \
    --to=html5 \
    --lua-filter="$SCRIPT_DIR/haven-directives.lua" \
    -o "$BODY_HTML"
)

# 3. Copy cached PNGs into <output-dir>/assets/ and rewrite img src paths so
#    the HTML is self-contained (no _diagram-cache/ dependency at view-time)
if compgen -G "$STAGING_DIR/_diagram-cache/*.png" > /dev/null; then
  cp "$STAGING_DIR/_diagram-cache/"*.png "$OUTPUT_DIR/assets/"
  # Rewrite "_diagram-cache/<slug>.png" -> "assets/<slug>.png"
  python3 - "$BODY_HTML" <<'PY'
import sys, re, pathlib
p = pathlib.Path(sys.argv[1])
html = p.read_text()
html = re.sub(r'src="_diagram-cache/', 'src="assets/', html)
p.write_text(html)
PY
fi

# 4. Copy haven.css bundle alongside the output
cp "$HAVEN_CSS_SRC" "$OUTPUT_DIR/assets/haven.css"

# 5. Wrap body in .document-shell with Google Fonts + haven.css link
BODY_CONTENTS=$(cat "$BODY_HTML")

cat > "$OUTPUT_ABS" <<HTML
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>$(basename "${INPUT_ABS%.md}")</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Source+Sans+3:ital,wght@0,300..900;1,300..900&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap" />
<link rel="stylesheet" href="./assets/haven.css" />
<style>
  body { margin: 0; background: var(--color-surface-page, #fbfaf8); }
</style>
</head>
<body>
<main class="document-shell">
${BODY_CONTENTS}
</main>
</body>
</html>
HTML

echo "  ✓ $OUTPUT_ABS"
