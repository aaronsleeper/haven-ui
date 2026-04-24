#!/usr/bin/env bash
# Build care-coordinator, patient, and the design-system pattern library, and
# assemble a GitHub Pages site at _site/. Each target lives under a subpath
# matching its eventual URL:
#   https://aaronsleeper.github.io/haven-ui/care-coordinator/
#   https://aaronsleeper.github.io/haven-ui/patient/
# https://aaronsleeper.github.io/haven-ui/pattern-library/
# The landing page at _site/index.html links to all three.
#
# Invoked by .github/workflows/pages.yml. Safe to run locally for dry-runs.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

SITE_BASE="${SITE_BASE:-/haven-ui}"
OUT="$REPO_ROOT/_site"

echo "==> Cleaning _site/"
rm -rf "$OUT"
mkdir -p "$OUT"

echo "==> Building workspace dependencies (design-system, ui-react)"
pnpm turbo run build --filter=@haven/design-system --filter=@haven/ui-react

build_app() {
  local app_name="$1"
  local app_dir="apps/$app_name"
  local base="$SITE_BASE/$app_name/"

  echo "==> Building $app_name with base=$base"
  (cd "$app_dir" && VITE_BASE="$base" pnpm exec vite build)

  mkdir -p "$OUT/$app_name"
  cp -R "$app_dir/dist/." "$OUT/$app_name/"

  # SPA fallback for client-side routing on GH Pages.
  cp "$OUT/$app_name/index.html" "$OUT/$app_name/404.html"
}

build_app care-coordinator
build_app patient

echo "==> Building design-system (pattern library)"
pl_base="$SITE_BASE/pattern-library/"
(cd packages/design-system && VITE_BASE="$pl_base" pnpm exec vite build)

mkdir -p "$OUT/pattern-library"
cp -R packages/design-system/dist/. "$OUT/pattern-library/"

# Two redirects in the design-system dist are authored with absolute paths that
# only work on localhost:5173 — rewrite both to relative URLs for Pages.
#
# 1. dist/index.html links to `/apps/patient/` etc. (dead on Pages). Replace
#    with a trampoline that sends visitors straight to pattern-library/pages/.
# 2. dist/pattern-library/index.html meta-refreshes to `/pattern-library/pages/`
#    (wrong host path on Pages). Rewrite to `./pages/`.
cat > "$OUT/pattern-library/index.html" <<'HTML'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Redirecting to Haven pattern library…</title>
    <meta http-equiv="refresh" content="0; url=./pattern-library/pages/" />
    <link rel="canonical" href="./pattern-library/pages/" />
  </head>
  <body>
    <p>Redirecting to <a href="./pattern-library/pages/">./pattern-library/pages/</a>…</p>
  </body>
</html>
HTML

# Rewrite the nested redirect so it also stops hardcoding the dev-server path.
sed -i.bak 's|url=/pattern-library/pages/|url=./pages/|' "$OUT/pattern-library/pattern-library/index.html"
rm -f "$OUT/pattern-library/pattern-library/index.html.bak"

# Pattern-library HTML references plain-script assets via absolute paths
# (`/src/scripts/...`, `/src/assets/...`) that Vite leaves untouched during
# the HTML transform — only <link> and <script type="module"> get bundled.
# Copy the referenced source trees into _site/pattern-library/src/ and rewrite
# the absolute URLs to match the Pages base prefix.
mkdir -p "$OUT/pattern-library/src"
cp -R packages/design-system/src/scripts "$OUT/pattern-library/src/"
cp -R packages/design-system/src/assets "$OUT/pattern-library/src/"

find "$OUT/pattern-library" -type f -name '*.html' -exec \
  sed -i.bak "s|\"/src/|\"${SITE_BASE}/pattern-library/src/|g" {} +
find "$OUT/pattern-library" -type f -name '*.html.bak' -delete

echo "==> Copying landing page"
cp scripts/pages-landing.html "$OUT/index.html"

# Prevent Jekyll on GH Pages from filtering files that start with underscore.
touch "$OUT/.nojekyll"

echo "==> Done. Output at $OUT"
