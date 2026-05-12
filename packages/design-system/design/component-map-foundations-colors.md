# Component Map: foundations-colors redesign

**Date:** 2026-05-12
**Source wireframe:** `packages/design-system/design/wireframes/foundations-colors-redesign.md`
**Source review-notes:** `packages/design-system/design/review-notes-foundations-colors.md`
**components.css read:** 2026-05-12 (post Phase G Pass 2)
**COMPONENT-INDEX.md read:** 2026-05-12 (post Phase G Pass 2)

## Component Inventory Summary

- **Existing components used:** 8 (`card`, `card-body`, `card-title`, `kv-table`, `section-title`, `pl-description`, `pl-variant-title`, Preline `hs-tooltip`)
- **New components needed:** 1 (`palette-swatch` + size variants + grid wrapper) — spec at `new-components/palette-swatch.md`, Gap Gate approved 2026-05-12
- **Utility-only patterns:** several (flex layouts for role rows, grid layouts for surface cells, etc. — composition only, no new semantic classes)

## New Components Required

| Component | Spec File | Priority | Preline Base |
|-----------|-----------|----------|--------------|
| `palette-swatch` (+ `-sm`, `-lg`, `-tooltip`, `-grid`) | `new-components/palette-swatch.md` | Required | yes — `hs-tooltip` |

## Screen: foundations-colors

**Wireframe source:** `wireframes/foundations-colors-redesign.md`

### Recipe

1. **Shell:** Pattern-library standard (`app-sidebar` left + content area, inherits from `partials/pl-sidebar.html`). Active sidebar item: **Foundations → Colors**. No change vs current.

2. **Zone 1 — Header + meta:**
   - Raw `<h2>Colors</h2>` (section heading; no new class)
   - `.pl-description` paragraph — copy from review-notes lead paragraph
   - `<!-- @component-meta -->` HTML comment header — updated per review-notes notes-field copy
   - `.card .card-body` containing `.kv-table` — Color Role Guide; reuse Phase G Pass 1 table structure, edit role descriptions per review-notes "Color Role Guide" decision (drop the 10× "(v2 — no semantic alias yet)" parenthetical; replace with one footer sentence)

3. **Zone 2 — System Overview Strip (NEW shape):**
   - Wrapper: `<div class="flex gap-0.5 mb-8">` (utility-only composition; no new class)
   - 18× **`palette-swatch.palette-swatch-lg`** instances with `data-hs-tooltip`, each with:
     - Inner button: `palette-swatch-trigger bg-{family}-500` with `aria-label="{family} 500"` + `aria-describedby="strip-{family}-500"`
     - Tooltip content: `<span id="strip-{family}-500" role="tooltip" class="hs-tooltip-content palette-swatch-tooltip">#{hex}</span>`
     - Click handler: `onclick="document.getElementById('family-{family}').scrollIntoView({behavior:'smooth'})"` — anchors target Zone 6 family-row IDs
   - Order per review-notes Open Q #6 resolution: sand, teal, sage, red, amber, green, cyan, orange, yellow, lime, emerald, blue, indigo, violet, purple, fuchsia, pink, rose

4. **Zone 3 — Logo Identity Tokens:**
   - Section: `<div class="mb-8">` + `<h3 class="section-title mb-3">Logo Identity Tokens</h3>`
   - Lead caption: `<p class="text-xs text-sand-600 dark:text-sand-400 mb-3">` — copy from review-notes "Logo Identity Tokens" lead
   - Grid: `<div class="grid grid-cols-2 sm:grid-cols-4 gap-4">` (utility-only)
   - 4× cells per logo token, each:
     - 64px swatch: `<div class="h-16 rounded" style="background-color: var(--logo-X)"></div>` (no new class — these 4 cells are unique enough to stay inline; doesn't fit `.palette-swatch` model because they're not family-stop swatches)
     - Label: `<p class="text-xs font-mono mt-2">--logo-X</p>`
     - Hex always visible: `<p class="text-xs text-sand-600 dark:text-sand-400">#hex</p>`
     - Role caption: `<p class="text-xs text-sand-600 dark:text-sand-400">{role}</p>` — copy from review-notes per-cell descriptors

5. **Zone 4 — Semantic Roles (NEW shape — flex-row layout per role):**
   - Section: `<div class="mb-8">` + `<h3 class="section-title mb-3">Semantic Roles</h3>`
   - 8× role rows per review-notes copy. Per row:
     - Wrapper: `<div class="flex items-center gap-4 py-3 border-b border-sand-200 dark:border-sand-700">` (utility-only composition)
     - Left column (240px): `<div class="w-60 flex flex-col"><h4 class="text-base font-semibold text-sand-900 dark:text-sand-50">{Role name}</h4><p class="text-sm text-sand-600 dark:text-sand-400">{Family parenthetical}</p></div>`
     - Center column (flex): 5× **`palette-swatch.palette-swatch-sm`** for stops 50/100/300/500/700, each with `data-hs-tooltip`, click → smooth-scroll to Zone 6 family row
     - Right column (flex): `<p class="text-sm text-sand-700 dark:text-sand-300">{role description from review-notes}</p>`
   - Rows: Primary (Teal), Secondary (Sand), Sage, Success (Green), Warning (Amber), Error (Red), Info (Cyan), Accent (Violet)

6. **Zone 5 — Semantic Surfaces:**
   - Section: `<div class="mb-8">` + `<h3 class="section-title mb-3">Semantic Surfaces</h3>`
   - Lead caption: `<p class="text-xs text-sand-600 dark:text-sand-400 mb-3">` — copy from review-notes "Semantic Surfaces" lead
   - Grid: `<div class="grid grid-cols-2 sm:grid-cols-5 gap-4">` (utility-only)
   - 5× surface cells per Phase G Pass 1 (no shape change; just update swatch element's `rounded-lg` → `rounded` per new system-wide radius decision):
     - 64px swatch: `<div class="h-16 rounded bg-{token} border border-sand-200"></div>`
     - Label, hex (always visible per review-notes), role caption
   - Hex labels: ensure they match current v2 sand values (sand-50 #FBFAF8 / sand-100 #E6E4E0 / sand-200 #D1CEC8) — already corrected in Phase G Pass 1

7. **Zone 6 — Family Reference Grid (NEW composition — uses palette-swatch primitive):**
   - Section: `<div class="mb-8">` + `<h3 class="section-title mb-3">Family Reference</h3>`
   - Lead caption: `<p class="text-xs text-sand-600 dark:text-sand-400 mb-3">` — copy from review-notes "Family Reference Grid" lead
   - 18× family rows. Per family:
     - Wrapper: `<div id="family-{family}" class="mb-6">` (anchor target for click-to-scroll from Zones 2 & 4)
     - Header: `<h4 class="section-title mb-2">{Family name} <span class="text-sm font-normal text-sand-600">— {role hint from review-notes}</span></h4>`
     - Grid: `<div class="palette-swatch-grid">` — 11 **`palette-swatch`** instances (default size; rectangular, h-8, rounded-sm)
     - Each swatch: trigger with `bg-{family}-{stop}` + `aria-label="{family} {stop}"` + Preline `hs-tooltip` wiring per primitive spec
     - Per swatch label: `<p class="text-xs text-center mt-1 text-sand-600 dark:text-sand-400">{stop}</p>` (stop number 50/100/.../950)
   - Family order matches Zone 2 strip ordering (sand → teal → sage → red → ... → rose)
   - Mobile: `.palette-swatch-grid` collapses to single column per Open Q #2 resolution (handled inside primitive's responsive CSS)

8. **Zone 7 — Rules & Discipline:**
   - Section: `<div class="card card-body mb-8">` + `<h3 class="card-title text-base mb-3">System Rules</h3>`
   - Bulleted list `<ul class="space-y-2 text-sm">` with 6 rules from review-notes "Rules & Discipline" copy
   - Each rule includes a `*Enforced by {gate}*` pointer where applicable (italic; uses raw `<em>` or `text-xs italic` class)

### Data Bindings

N/A — static documentation page. All swatch colors come from `palette.css` Tailwind utility classes; all hex values are baked into the HTML at author time (computed once from `palette.css` and pasted as `aria-describedby` tooltip content).

### Preline Interactions

- **`hs-tooltip`** — 256 swatch tooltips. Preline `autoInit()` initializes all on page load. No custom JS.

### Anchor scroll behavior

Zones 2 & 4 swatches use plain `onclick="document.getElementById('family-{family}').scrollIntoView({behavior:'smooth'})"` — vanilla JS inline handler. No new shared script needed. Alternative: refactor to delegated handler on a parent if 56 inline handlers feels heavy; dev-tasker can decide.

### Files touched / created in build

**Created:**
- `packages/design-system/pattern-library/components/foundations-palette-swatch.html` (new PL fragment for the primitive)

**Modified:**
- `packages/design-system/src/styles/tokens/components.css` (add `.palette-swatch` + size variants + tooltip + grid)
- `packages/design-system/pattern-library/components/foundations-colors.html` (rewrite to new layout)
- `packages/design-system/pattern-library/COMPONENT-INDEX.md` (add palette-swatch row; update Color Tokens row if classes list changes)

**Untouched (don't drift):**
- `packages/design-system/pattern-library/pages/foundations.html` (parent page; foundations-colors.html is loaded into it via `<load src>`)
- `packages/design-system/src/styles/tokens/palette.css` (palette content unchanged — Phase D/G integration already landed)
- `packages/design-system/src/styles/tokens/semantic.css` (no new semantic categories — palette-swatch is utility, not semantic)
