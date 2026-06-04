#!/usr/bin/env bash
#
# diagram-emit.sh — render a rendered-diagram.html → PDF via Chrome headless.
#
# Usage:
#   diagram-emit.sh <input.html> <output.pdf>
#
# Sibling to docx-emit.sh. Where docx-emit.sh runs pandoc + reference-docx,
# this script runs Chrome headless --print-to-pdf, with a small HTML pre-process
# that (a) rewrites the source-tree CSS reference (../../../../packages/
# design-system/src/styles/main.css — a broken relative path) to the built
# Cena bundle at handoff/cena-sot/assets/haven.css, and (b) injects a print
# @page sized for wide swim-lane diagrams (15in × 10in landscape).

set -euo pipefail

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <input.html> <output.pdf>" >&2
  exit 64
fi

INPUT="$1"
OUTPUT="$2"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
HAVEN_UI_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

HAVEN_CSS="$HAVEN_UI_ROOT/handoff/cena-sot/assets/haven.css"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

for f in "$INPUT" "$HAVEN_CSS" "$CHROME"; do
  if [ ! -e "$f" ]; then
    echo "Missing required asset: $f" >&2
    exit 65
  fi
done

TEMP_DIR=$(mktemp -d)
trap 'rm -rf "$TEMP_DIR"' EXIT

TEMP_HTML="$TEMP_DIR/render.html"

python3 - "$INPUT" "$TEMP_HTML" "$HAVEN_CSS" <<'PYEOF'
import sys, re, pathlib
src, dst, css = sys.argv[1], sys.argv[2], sys.argv[3]
html = pathlib.Path(src).read_text()
css_url = "file://" + css
# Rewrite the (broken) source-tree main.css link to the built Cena bundle.
html, n = re.subn(
    r'<link[^>]*rel="stylesheet"[^>]*href="[^"]*main\.css"[^>]*>',
    f'<link rel="stylesheet" href="{css_url}">',
    html,
    count=1,
)
if n != 1:
    sys.stderr.write("warn: did not find/rewrite main.css link\n")
# Inject a print @page sized for wide swim-lane diagrams.
page_css = (
    '<style>@media print {'
    '@page { size: 15in 10in; margin: 0.3in; }'
    'body { padding: 16px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }'
    '}</style>'
)
html = html.replace("</head>", page_css + "</head>", 1)
pathlib.Path(dst).write_text(html)
PYEOF

"$CHROME" \
  --headless=new \
  --disable-gpu \
  --no-sandbox \
  --no-pdf-header-footer \
  --virtual-time-budget=5000 \
  --print-to-pdf="$OUTPUT" \
  "file://$TEMP_HTML" \
  > /dev/null 2>&1

if [ ! -f "$OUTPUT" ]; then
  echo "  ✗ Chrome failed to produce $OUTPUT" >&2
  exit 1
fi

echo "  ✓ $OUTPUT"
