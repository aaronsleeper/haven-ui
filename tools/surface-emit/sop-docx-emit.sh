#!/usr/bin/env bash
#
# sop-docx-emit.sh — render a SoP markdown source to a Cena-branded .docx,
# resolving any :::diagram{workflow="<slug>"} directives along the way.
#
# Wraps two existing tools:
#   1. resolve-diagram-directives.mjs — pre-pandoc runner that resolves slug→PNG
#   2. docx-emit.sh                   — pandoc + reference-docx + Lua filter
#
# The wrapper exists because pandoc resolves relative image paths against its
# own CWD; the runner writes png_path relative to the resolved markdown, so
# this script cd's into the staging dir before invoking docx-emit.sh.
#
# Usage:
#   sop-docx-emit.sh <input.md> <output.docx> [staging-dir]
#
# staging-dir defaults to a sibling of the output. It holds the runner's
# rewritten markdown + _diagram-cache/ (HTML + PNG per slug). Re-runs reuse
# cached diagram outputs; delete the staging-dir to force re-rendering.

set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 <input.md> <output.docx> [staging-dir]" >&2
  exit 64
fi

INPUT="$1"
OUTPUT="$2"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

INPUT_ABS="$(cd "$(dirname "$INPUT")" && pwd)/$(basename "$INPUT")"
OUTPUT_ABS="$(mkdir -p "$(dirname "$OUTPUT")" && cd "$(dirname "$OUTPUT")" && pwd)/$(basename "$OUTPUT")"
STAGING_DIR="${3:-$(dirname "$OUTPUT_ABS")/_sop-staging-$(basename "${INPUT_ABS%.md}")}"

mkdir -p "$STAGING_DIR"
RESOLVED_MD="$STAGING_DIR/$(basename "${INPUT_ABS%.md}")-resolved.md"

# 1. Runner — rewrite :::diagram directives + cache rendered HTML + PNG
node "$SCRIPT_DIR/resolve-diagram-directives.mjs" \
  --input "$INPUT_ABS" \
  --output "$RESOLVED_MD" \
  --cache-dir "$STAGING_DIR/_diagram-cache"

# 2. docx-emit.sh — pandoc resolves png_path relative to its CWD, so cd into
#    the staging dir first so the runner's relative path (cache-dir/slug.png)
#    resolves correctly.
(
  cd "$STAGING_DIR"
  "$SCRIPT_DIR/docx-emit.sh" "$(basename "$RESOLVED_MD")" "$OUTPUT_ABS"
)
