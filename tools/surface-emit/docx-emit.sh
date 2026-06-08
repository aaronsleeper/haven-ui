#!/usr/bin/env bash
#
# docx-emit.sh — render a markdown source to a Cena-branded .docx via Pandoc.
#
# Usage:
#   docx-emit.sh <input.md> <output.docx>
#
# Applies:
#   - reference-cena.docx           — Cena Color System v2 theme + haven directive styles
#   - strip-bookmarks.lua            — suppresses Google Docs blue flag icons
#   - haven-directives.lua           — maps directive classes to Word custom styles
#                                      (Div → paragraph style; Span → character style)
#
# The reference docx and strip-bookmarks filter live in the vault; the
# directive-mapping filter lives alongside this script in haven-ui.

set -euo pipefail

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <input.md> <output.docx>" >&2
  exit 64
fi

INPUT="$1"
OUTPUT="$2"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
VAULT_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"

REFERENCE_DOCX="$VAULT_ROOT/.claude/config/drive-themes/reference-cena.docx"
STRIP_BOOKMARKS="$VAULT_ROOT/.claude/config/drive-themes/strip-bookmarks.lua"
HAVEN_DIRECTIVES="$SCRIPT_DIR/haven-directives.lua"

for f in "$REFERENCE_DOCX" "$STRIP_BOOKMARKS" "$HAVEN_DIRECTIVES"; do
  if [ ! -f "$f" ]; then
    echo "Missing required asset: $f" >&2
    exit 65
  fi
done

pandoc "$INPUT" \
  --reference-doc="$REFERENCE_DOCX" \
  --lua-filter="$STRIP_BOOKMARKS" \
  --lua-filter="$HAVEN_DIRECTIVES" \
  -o "$OUTPUT"

# Post-process: patch numbering.xml (pandoc regenerates it at emit time using
# its own per-level indents, ignoring reference-docx numbering patches). See
# patch-docx.py header.
python3 "$SCRIPT_DIR/patch-docx.py" "$OUTPUT"

echo "  ✓ $OUTPUT"
