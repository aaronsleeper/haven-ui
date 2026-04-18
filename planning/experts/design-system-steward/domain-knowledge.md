# Domain Knowledge

## Haven token architecture

Three-layer token system in `packages/ui/src/tokens/`:

| Layer | File | Purpose | Example |
|---|---|---|---|
| Palette | `colors.css` | Raw color values | `--color-sand-50: #F5F0EB` |
| Semantic | `haven.css` | Intent-based aliases | `--color-status-error: var(--color-red-600)` |
| Surface | `base.css` | Layout primitives | `--color-surface: var(--color-white)` |

**Naming convention:** semantic > palette > raw. Components must use Haven semantic
aliases. Direct Tailwind color classes (bg-red-500) are violations unless no semantic
token exists yet.

**Font system:** Plus Jakarta Sans (display/headings), Source Sans 3 (body text).
Both loaded via CDN. Weight scale: 400 (body), 500 (labels), 600 (headings), 700 (emphasis).

## Component architecture

React + Tailwind v4. Components in `@ava/ui` use:
- Tailwind classes referencing Haven CSS custom properties
- Props for variant/size, not style overrides
- `class` prop pass-through for layout positioning only (margin, width)

## Current extraction candidates

### StatusBadge (3 copies)
Locations: MorningSummary, QueueItemDetail, PatientHeader (approx).
Each copy maps status strings to color classes. Divergence: color maps differ
slightly (one uses `bg-amber-100` for warning, another `bg-yellow-100`).
**Resolution:** Canonical version uses Haven semantic status tokens
(`--color-status-warning`) so color is token-driven, not hardcoded.

### Metric (3 copies)
Pattern: `{label: string, value: string|number}` rendered as label-above-value
with consistent typography. All 3 copies are identical in structure.
**Resolution:** Straight extraction. Props: `label`, `value`, optional `unit`.

### Section card (1 named + 10 inline)
Pattern: `bg-sand-50 rounded-xl border` container with optional title.
One file has a `<Section>` component; 10+ places repeat the raw classes inline.
**Resolution:** Extract with `title?: string`, `children`, optional `padding` variant.

### QueueItemData (3 divergent interfaces)
| Field | MorningSummary | QueueItemDetail | QueueList |
|---|---|---|---|
| compositeScore | yes | no | yes |
| threadId | no | yes | yes |
| context | no | yes | no |

**Resolution:** Canonical type is the union with optional markers on fields not
present in all copies. Lives in `@ava/shared` (type, not component).

### TYPE_LABELS (2 copies, divergent values)
Copy A: `"Care Plans"` (plural). Copy B: `"Care Plan"` (singular).
**Resolution:** Single source of truth in `@ava/shared/constants`. Use plural
form as canonical (matching list/queue context where labels appear).

### formatTimeRemaining (2 identical copies)
Pure utility function, no divergence.
**Resolution:** Extract to `@ava/shared/utils`.

## Dark mode preparation

~50 hardcoded color values need semantic tokens before dark mode is viable:

| Hardcoded class | Semantic replacement | Count (approx) |
|---|---|---|
| `bg-white` | `bg-surface` | 15 |
| `bg-sand-50` | `bg-surface-raised` | 12 |
| `bg-gray-50`, `bg-gray-100` | `bg-surface-muted` | 8 |
| `text-gray-900` | `text-primary` | 10 |
| `text-gray-500`, `text-gray-600` | `text-secondary` | 8 |

Strategy: add semantic surface tokens first, migrate components during extraction,
then add `.dark {}` overrides in `haven.css` when dark mode ships.

## Reference sources

| Source | Domain | Trust | When to consult |
|---|---|---|---|
| Tailwind v4 docs | Utility class API, CSS config | Authoritative | New component patterns, class questions |
| Haven token files (source) | Current token values | Authoritative | Any token audit or naming decision |
| Admin app codebase | Current component usage | Authoritative | Extraction candidate discovery |
