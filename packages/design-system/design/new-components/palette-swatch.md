# New Component: palette-swatch

## Purpose

Rectangular palette swatch with hover/focus hex tooltip. Encapsulates color-cell + Preline `hs-tooltip` composition + WAI-ARIA accessibility wiring so palette documentation surfaces don't reinvent the pattern per swatch. Three size variants (default, sm, lg) cover the wireframe's overview-strip / role-row-preview / family-grid use cases.

## Used In

- **foundations-colors-redesign** (Zone 2 — System Overview Strip): 18 swatches at default size, rectangular ~5.5% width × 64px height
- **foundations-colors-redesign** (Zone 4 — Semantic Roles): 5-stop preview per role × 8 roles = 40 swatches at `-sm` size
- **foundations-colors-redesign** (Zone 6 — Family Reference Grid): 11 stops per family × 18 families = 198 swatches at default size

Total: 256 instances on the foundations-colors page. Reusable for any future palette / color-system documentation surface.

## Preline Base

Composes [Preline `hs-tooltip`](https://preline.co/docs/tooltip.html). Pattern already proven in `meal-warning-tooltip` and `badge-sdoh`. No new JS — Preline's autoInit handles initialization.

## Proposed Semantic Classes

- `.palette-swatch` — rectangular color cell, default 32px tall (h-8), `rounded-sm` (2px), with hex tooltip on hover/focus
- `.palette-swatch-sm` — 24px tall variant for compact role-row previews
- `.palette-swatch-lg` — 64px tall variant for overview strips
- `.palette-swatch-tooltip` — the tooltip content element (Preline `hs-tooltip-content`)
- `.palette-swatch-grid` — wrapper for the 11-column ladder layout used in Zone 6

## Implementation Notes

### HTML Structure

```html
<!-- Single swatch (rectangular, default size) -->
<span class="palette-swatch" data-hs-tooltip>
  <button
    type="button"
    class="palette-swatch-trigger bg-teal-500"
    aria-label="teal 500"
    aria-describedby="palette-swatch-tooltip-teal-500"
  ></button>
  <span
    id="palette-swatch-tooltip-teal-500"
    role="tooltip"
    class="hs-tooltip-content palette-swatch-tooltip"
  >#3a8478</span>
</span>

<!-- 11-stop family ladder -->
<div class="palette-swatch-grid">
  <span class="palette-swatch" data-hs-tooltip>
    <button class="palette-swatch-trigger bg-teal-50" aria-label="teal 50" aria-describedby="..."></button>
    <span class="hs-tooltip-content palette-swatch-tooltip">#e9f5f2</span>
  </span>
  <!-- ... 10 more stops ... -->
</div>
```

The `palette-swatch-trigger` inner button carries the `bg-{family}-{stop}` Tailwind class — that's what makes each swatch a different color. The wrapper `.palette-swatch` carries the tooltip wiring and size; the trigger carries the color + accessibility name.

### @apply Definition

```css
/* Base swatch wrapper — relative positioning for tooltip + Preline hs-tooltip wiring */
.palette-swatch {
  @apply relative inline-block;
}

/* Trigger button — the visible color cell */
.palette-swatch-trigger {
  @apply block w-full h-8 rounded-sm border-0 outline-none cursor-pointer transition-transform;
}
.palette-swatch-trigger:hover {
  @apply scale-105;
}
.palette-swatch-trigger:focus-visible {
  box-shadow: 0 0 0 2px var(--color-sand-50), 0 0 0 4px var(--color-primary-500);
}
.dark .palette-swatch-trigger:focus-visible {
  box-shadow: 0 0 0 2px var(--color-sand-900), 0 0 0 4px var(--color-primary-400);
}

/* Size variants */
.palette-swatch-sm .palette-swatch-trigger {
  @apply h-6;
}
.palette-swatch-lg .palette-swatch-trigger {
  @apply h-16 rounded;
}

/* Tooltip content — hidden by default; Preline shows on hover/focus */
.palette-swatch-tooltip {
  @apply absolute z-50 px-2 py-1 text-xs font-mono rounded shadow-lg;
  @apply bg-sand-900 text-sand-50;
  @apply dark:bg-sand-100 dark:text-sand-900;
  /* Preline handles display: none / opacity transitions via hs-tooltip-content;
     no extra CSS needed for show/hide. */
}

/* Grid wrapper for the 11-column ladder */
.palette-swatch-grid {
  @apply grid grid-cols-11 gap-1.5;
}
@media (max-width: 640px) {
  .palette-swatch-grid {
    @apply grid-cols-1;
  }
}
```

### Variants

- `.palette-swatch-sm` — 24px tall; use in Zone 4 (Semantic Roles 5-stop preview rows)
- `.palette-swatch-lg` — 64px tall, `rounded` (4px instead of `rounded-sm`); use in Zone 2 (Overview Strip)
- Default (`.palette-swatch`) — 32px tall, `rounded-sm` (2px); use in Zone 6 (Family Reference Grid)

### Preline JS

Standard `hs-tooltip` autoInit handles initialization. No custom JS required.

### States

- **Default:** color cell at full opacity, no border, transition-transform ready for hover
- **Hover:** trigger scales to 105% (`scale-105`); tooltip appears via Preline (positioned by FloatingUI)
- **Focus-visible:** trigger gets a 2-step box-shadow ring (inner sand-50 / outer primary-500, swap for dark mode); tooltip appears
- **Disabled:** N/A — palette swatches are read-only references; no disabled state

### Dark Mode

Mandatory per haven-mapper's "every new component must define its dark mode treatment" rule.

- **Trigger background:** unchanged — `bg-{family}-{stop}` Tailwind utility carries through both modes (palette is theme-invariant; only semantic surfaces flip)
- **Focus ring:** `box-shadow: 0 0 0 2px var(--color-sand-50), 0 0 0 4px var(--color-primary-500)` light → `box-shadow: 0 0 0 2px var(--color-sand-900), 0 0 0 4px var(--color-primary-400)` dark
- **Tooltip background:** `bg-sand-900` light → `dark:bg-sand-100` dark (inverted)
- **Tooltip text:** `text-sand-50` light → `dark:text-sand-900` dark (inverted)

The neutral 900-900/100-100 inversion is the canonical pattern for tooltips on Cena (per existing meal-warning-tooltip implementation).

### Responsive Behavior

- At `sm` and above (≥640px): `.palette-swatch-grid` renders 11 columns
- Below `sm`: `.palette-swatch-grid` collapses to 1 column (each swatch stacks vertically). This preserves all 11 stops at usable size on mobile rather than compressing to 3px-wide cells. Per Open Q #2 resolution in `review-notes-foundations-colors.md`.

### Accessibility

- **ARIA:**
  - Trigger: `aria-label="{family} {stop}"` (e.g., `aria-label="teal 500"`) — accessible name
  - Trigger: `aria-describedby` points to tooltip ID — supplements accessible name with hex value
  - Tooltip: `role="tooltip"` (via `hs-tooltip-content` class which Preline wires)
- **Keyboard:**
  - Trigger is a `<button>` element — natively focusable, no `tabindex` needed
  - Focus shows the tooltip (Preline default + `:focus-visible` ring styling)
  - Esc dismisses tooltip (Preline default)
- **Screen reader:** announces "{family} {stop}, {hex value}" — accessible name from `aria-label` + supplementary description from `aria-describedby`
- **Color independence:** swatch identity communicated via `aria-label` text (not color alone)
- **Contrast:** tooltip text on tooltip background tested at WCAG AA (sand-50 on sand-900 ≈ 16:1; passes). `conform:contrast-pairs` validates.
- **Tab-trap concern:** with 198 swatches in Zone 6, keyboard-only users hit many sequential focus stops. Per `review-notes-foundations-colors.md` "Critical: Tab-trap fatigue" — Zone 6 swatches may opt OUT of keyboard navigation (use `aria-hidden="true"` on trigger + skip-link to next family heading). Decision deferred to dev-tasker build prompt; flag for accessibility expert review.

## Pattern Library

- [x] Component file needed: `packages/design-system/pattern-library/components/foundations-palette-swatch.html`
- [x] `COMPONENT-INDEX.md` row needed
- [x] components.css class definitions needed
- [x] Single PL fragment, demonstrating: default size, -sm, -lg, single swatch, swatch-grid (11-stop ladder), tooltip behavior screenshot/note

## Priority

**Required for launch.** The foundations-colors redesign cannot proceed without this primitive — 256 swatch instances on the page need it.

## Open questions for ux-design-review post-build

1. **Tab-trap mitigation in Zone 6.** Should Zone 6 swatches be keyboard-skipped (`aria-hidden` on trigger), keep full keyboard nav, or use arrow-key navigation within a family with Tab jumping between families? Defer to accessibility expert in 4-panel review.
2. **Tooltip vertical position.** Default Preline floats above; with stacked-mobile layout, vertical positioning may need override. Validate on mobile build.
3. **`palette-swatch-trigger` reuse outside palette context.** If a future feature wants a square focus-ring color chip without the tooltip, should `palette-swatch-trigger` be promoted to standalone (e.g., as `.swatch-trigger`)? Defer; only if a second consumer appears.
