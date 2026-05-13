# Design Panel Verdict — Responsive AppShell

**Date:** 2026-05-13
**Triggered by:** Aaron's `/care` screenshot flagging "layout weirdness"; Claude shipped AppShell as Tier 1 PL primitive without running the 4-expert panel that haven-ui discipline requires.
**Panel:** design-system-steward, ux-design-lead, accessibility, brand-fidelity (all 4 via Agent dispatch)

---

## Cross-panel verdict

**ITERATE** across all 4 reviewers. AppShell's *structural* decomposition (5 regions, breakpoint-gated, framework-agnostic CSS) is sound. What's wrong is **discipline gaps and consumer-side defaults that should have been shell-side defaults.** Every expert independently flagged the panel-skip as the meta-issue.

**Demo-survivable with the must-fix list below; not ship-clean.**

---

## Must-fix before Dieckhaus demo (~May 22)

All four experts converge on these. Priority order:

### 1. Invert the surface palette — *(Brand + DSS, load-bearing)*

`components.css`:
- **`.app-shell-content`** — remove `bg-white`; let shell sand-50 show through (or set `bg-sand-50` explicitly)
- **`.card`** — change `bg-sand-50` → `bg-white` (or `bg-sand-100`)

Today: page is white, cards are sand-50, ambient bleeds through. DESIGN.md prescribes the opposite — sand ambient with white cards. This is the single largest visual fix.

### 2. Content max-width on the shell — *(UX + Brand + DSS)*

`.app-shell-content` needs a max-width contract or every screen will re-litigate it.

Recommended: add `--app-shell-content-max-w` CSS variable with default `64rem` (1024px), `margin-inline: auto`, plus a `.app-shell-content--full-bleed` escape hatch.

Brand-fidelity calls for `max-w-3xl` (~768px / 75ch) per DESIGN.md right-pane sizing. Lean conservative — `max-w-3xl` for patient app, override for dashboard-density screens.

### 3. `.card-header` becomes flex — *(DSS + UX)*

`components.css` line ~1103: `.card-header` add `flex items-center justify-between gap-3`. Fixes "View my meals" wrap on `/care`; documents trailing-action slot for every card-header consumer.

### 4. Sidebar badge composition — *(DSS + UX + A11y)*

`mobile-bottom-nav-badge` assumes icon-column-stack layout. In Sidebar's row layout the positioning anchor is wrong, badge floats off-icon.

Fix: promote `.mobile-bottom-nav-badge` → `.nav-badge` (rename); Sidebar's badge wrapper needs a fixed-width icon column (`fa-fw` + relative anchor) so absolute positioning has a stable reference. Or render badge inline-after-label for sidebar context (different composition for the row layout).

### 5. Sidebar active state — bold weight, NOT background — *(Brand)*

`components.css` line ~2815 `.sidebar-nav-item.active` currently `bg-sand-300 text-sand-900 font-medium`. **DESIGN.md §Voice brand rule:** *"Active nav state = Source Sans 3 Bold, not background color. Weight change carries the signal."*

Replace background-driven highlight with weight-only emphasis.

### 6. Brand mark — topbar at ALL viewports — *(Brand)*

Current: logo in sidebar header (≥lg), in topbar (<lg only). Inverted from canonical.

Fix:
- Remove logo from `Sidebar.tsx` header
- Show logo in `I18nBar` at all viewports (drop the `lg:hidden`)
- Sidebar header becomes thin section or empty
- Resolves "topbar desktop emptiness" simultaneously

### 7. Landmark structure — `<main>` belongs in shell — *(A11y)*

`AppShell.tsx`: promote `app-shell-content` div → `<main>`. Add optional `contentAriaLabel` prop. Remove `<main aria-label="...">` from each screen (replace with `<section>` or div).

Also: unify nav landmark labels. Sidebar `<aside aria-label="Main navigation">` + `<nav aria-label="Primary">` doubles up. Replace `<aside>` with `<nav aria-label="Primary">` in the shell; remove inner `<nav>` from Sidebar.tsx. Rename BottomNav `aria-label="Main navigation"` → `"Primary"` for cross-breakpoint consistency.

### 8. I18nBar — radiogroup pattern, not aria-pressed — *(A11y)*

EN/ES is single-select, not independent toggle. Convert:
```tsx
<div role="radiogroup" aria-label="Language">
  <button role="radio" aria-checked={lang === 'en'} ...>EN</button>
  <button role="radio" aria-checked={lang === 'es'} ...>ES</button>
</div>
```
Add arrow-key navigation per radiogroup APG.

### 9. AppShell registered in registry.json — *(DSS, conform gate)*

`packages/ui-react/registry.json` needs a new entry: `name: "app-shell"`, `isAppShell: true`, files, patternLibraryHtml, slotModel `"named-slots"`. Without this, `pnpm conform:fast` fails — blocking-on-patch gate.

### 10. Card-title typography — Lora Medium — *(Brand)*

`components.css` line ~1115: `.card-title { @apply text-2xl font-semibold ... }` → should be Lora Medium per DESIGN.md Heading/02. Add `font-serif font-medium`. Sans-semibold reads as bootstrap-generic, not Haven.

### 11. Attribute-tag class for sentence-case badges — *(Brand + DSS)*

Two badge registers:
- **Status pills** (uppercase, current `.badge`): *Delivered*, *In Transit*, *New*, *Swapped*
- **Attribute pills** (sentence-case): *Low sodium*, *Vegetarian*, *Diabetic-friendly*, *Picked for you*, *Heart-healthy*

Fix: extract the existing `.meal-option-card-tags .badge` typography reset into a `.attribute-tag` modifier class. Apply to `.meal-delivery-card-tags .badge`, food-preference cards, anywhere descriptive metadata reads in restaurant-menu register. Status pills keep current uppercase.

### 12. mobile-bottom-nav fixed positioning conflict — *(Brand + DSS)*

`.mobile-bottom-nav` is `position: fixed; max-width: 430px` (legacy mobile-only-shell). When wrapped in `app-shell-bottom-nav` (sticky, full-width), the inner fixed positioning conflicts.

Fix: refactor BottomNav React component to drop its outer positioning when inside `app-shell-bottom-nav`; let the wrapper own positioning. Or rename to `.nav-tab-row` (positioning-agnostic) and let consumers decide outer positioning.

---

## Post-demo polish (track, do next cycle)

- **AppShell.stories.tsx + conform:visual baselines** — Storybook coverage of breakpoint switch
- **Banner region PL/port alignment** — React port has `banner` slot; PL HTML doesn't show it. Add `app-shell-banner` to PL or drop from port.
- **Sparkline trend description in aria-label** — currently labels chart existence, not the trend. Consider visually-hidden table fallback for Chart.js opacity to AT.
- **Consent stage walker URL routing** — `/onboarding/consent` stages A/B/C are in component state; browser back skips the walker. Move to `/consent/hipaa`, `/consent/program`, `/consent/voice`.
- **Sidebar `.sidebar-nav-item` metric tuning** — class was authored for PL-server nav (high density, narrow column). Patient sidebar reads heavy.
- **Active-highlight reset across all nav contexts** — apply the bold-weight-not-bg rule broadly, not just sidebar.

---

## Discipline takeaway

All 4 experts converge: **panel-skip was wrong for AppShell.** Mechanical-port carve-out doesn't apply (no upstream PL fragment being ported; this was new).

**Proposed policy:** any Tier 1 PL primitive with `shell` or `layout` in the name auto-routes to the panel before merge. Make `registry.json` entry the gate — `isAppShell: true` requires panel verdicts attached (`brandReviewed: true`, `a11yReviewed: true`, etc.) to ship. The closed-loop primitive (`closure-obligations.md`) is the natural enforcement mechanism for this if needed.

---

## Source agent IDs (for follow-up clarification via SendMessage)

- design-system-steward: `a5fccc690d6fb647c`
- ux-design-lead: `aded506b67dae2964`
- accessibility: `ac53040c0793f63eb`
- brand-fidelity: `a8855a3b16d6dc7df`
