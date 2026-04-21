#!/usr/bin/env bash
# Extract the committed FontAwesome Pro subset tarball into the gitignored
# vendor location. Idempotent: skips extraction if the vendor CSS is already
# present. Used by CI and by fresh local checkouts.
#
# The full FA Pro v7.1.0 distribution is ~361MB. This script extracts a ~6MB
# subset containing only what Haven's CSS-class-based icon usage needs:
#   - css/ (all.css + per-family stylesheets)
#   - webfonts/ (woff2 files loaded by the CSS)
# svgs/, sprites/, and js/ are intentionally not included — Haven never
# references them (CLAUDE.md §Icons: "HTML: <i class='fa-solid fa-*'>").
#
# Tarball committed at vendor/tarballs/ (private repo — FA Pro license
# permits private distribution within the licensed org).

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARBALL="$REPO_ROOT/vendor/tarballs/fontawesome-pro-v7.1.0-subset.tar.gz"
DEST_DIR="$REPO_ROOT/packages/design-system/src/vendor/fontawesome"
MARKER="$DEST_DIR/css/all.css"

if [ ! -f "$TARBALL" ]; then
    echo "[setup-fontawesome] ERROR: tarball not found at $TARBALL" >&2
    exit 1
fi

if [ -f "$MARKER" ]; then
    echo "[setup-fontawesome] Already extracted — skipping ($MARKER present)"
    exit 0
fi

mkdir -p "$DEST_DIR"
tar -xzf "$TARBALL" -C "$DEST_DIR"

if [ ! -f "$MARKER" ]; then
    echo "[setup-fontawesome] ERROR: extraction completed but marker missing at $MARKER" >&2
    exit 1
fi

echo "[setup-fontawesome] Extracted FA Pro subset → $DEST_DIR"
