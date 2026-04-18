---
name: haven-pl-qa
description: QA a completed haven-ui pattern library component. Run after haven-pl-builder completes. Returns a structured pass/fail report. Do not commit until all required checks pass.
---

# Haven UI — Pattern Library Component QA

## When to invoke

After `haven-pl-builder` completes all files and before any commit:
- `packages/design-system/src/styles/tokens/components.css` updated
- `packages/design-system/pattern-library/components/{name}.html` created
- `packages/design-system/pattern-library/pages/{name}.html` created
- `packages/design-system/pattern-library/partials/pl-nav.html` updated
- `packages/design-system/pattern-library/COMPONENT-INDEX.md` updated
- Dev server running at `http://localhost:5173`

---

## Checks

Work through every check. Record PASS, FAIL, or N/A with a specific note.

### CSS checks

**CSS-01: No new CSS files created**
All new classes must be in `packages/design-system/src/styles/tokens/components.css`. No separate component CSS file.
- PASS: No new CSS file created
- FAIL: Name the file that was incorrectly created

**CSS-02: All new classes use `@apply`**
Every new semantic class must use `@apply`. Raw CSS properties are only allowed alongside `@apply`.
- PASS: All new classes have at least one `@apply` directive
- FAIL: List classes with no `@apply`

**CSS-03: Pure-CSS rules have `@apply block` as first line**
Any class using only raw CSS (no `@apply`) will be silently dropped by Tailwind v4 tree-shaking unless it has at least one `@apply`.
- PASS: All pure-CSS rules have `@apply block;` as first line
- FAIL: List rules missing this

**CSS-04: No `@apply` with semantic class names**
`@apply` can only resolve Tailwind utilities — never custom semantic classes like `@apply card` or `@apply btn-primary`.
- PASS: No semantic class names in any `@apply`
- FAIL: List the offending `@apply` calls

**CSS-05: No hardcoded hex values**
All color values must use `var(--color-*)` or `@apply` with Tailwind color utilities.
- PASS: No hex values in new CSS
- FAIL: List every hex value and line

**CSS-06: Dark mode variants present**
Every new class with `bg-*`, `text-*`, or `border-*` must have dark mode equivalents.
- PASS: Dark mode covered for all color properties
- FAIL: List classes missing dark mode

**CSS-07: No semantic class applied to itself**
Check the `card-body > * + *:not(...)` exclusion list. If the new component is a row pattern (uses `border-b` for separation inside a card), it must be added to the `:not()` exclusion list.
- PASS: Row pattern correctly excluded OR component is not a row pattern
- FAIL: New row pattern class not added to exclusion list

### HTML checks

**HTML-01: `@component-meta` block present and complete**
Must be first. Must include: name, category, file, classes, when-to-use, preline-required, notes.
- PASS: All fields present
- FAIL: List missing fields

**HTML-02: No utility chains on component elements**
Styled elements use semantic classes only. Tailwind utilities are allowed on structural wrapper divs only.
- PASS: Component elements use semantic classes
- FAIL: List elements with utility chains

**HTML-03: No `style=""` attributes**
Exception: data-driven flex values on pipeline segments.
- PASS: No style attributes / only acceptable exceptions
- FAIL: List elements with style attributes

**HTML-04: No inline `<script>` blocks**
All JS in `src/scripts/components/`. Component HTML may reference scripts via `<script src="...">` only. If a script tag is present, it must have `type="module"` and the function must be attached to `window`.
- PASS: No inline scripts / script tags correctly structured
- FAIL: Describe the violation

**HTML-05: FontAwesome Pro icons only**
No emoji as icons. No Material, Heroicons, or other libraries. Syntax: `<i class="fa-solid fa-{name}"></i>`.
- PASS: All icons use FA Pro syntax
- FAIL: List non-FA icons found

**HTML-06: Dummy copy from registry**
No Lorem ipsum. Placeholder names should be Maria Rivera or from `.project-docs/dummy-copy.md`.
- PASS: No Lorem ipsum found
- FAIL: List instances of Lorem ipsum or invented names

**HTML-07: Preline data attributes correct**
If Preline is used, verify `data-hs-*` attributes match the Preline v4 API, not v2/v3 patterns.
- PASS / N/A: No Preline used
- FAIL: Describe the incorrect attributes

### Accessibility checks (WCAG 2.1 AA baseline)

**A11Y-01: Correct root element for the component's role**
Interactive elements use `<button>` (not `<div role="button">`), `<a>` (with `href`), or form elements. Containers use `<section>`, `<aside>`, `<nav>`, `<article>` when they carry landmark semantics.
- PASS: Root element matches role
- FAIL: Describe the wrong element and what it should be

**A11Y-02: Decorative icons are `aria-hidden="true"`**
Any `<i class="fa-...">` whose meaning is redundant with adjacent text has `aria-hidden="true"`.
- PASS: All decorative icons hidden from AT
- FAIL: List icons missing the attribute

**A11Y-03: State-only indicators have text equivalents**
Icons, dots, or chevrons that encode state without standalone text have `aria-label` (e.g., `aria-label="SLA breached: 2 hours overdue"`) — or use `<span class="sr-only">` inside to provide visible-to-AT text.
- PASS: Every state-only indicator has a text equivalent
- FAIL: List indicators with no text fallback

**A11Y-04: Keyboard walkthrough**
Walk through the rendered component using Tab, Enter, Space, Esc, and arrow keys (where applicable). Every interactive element is reachable and activatable. Focus moves in a sensible order. No focus traps except where intended (modals).
- PASS: Keyboard walkthrough clean
- FAIL: Describe what's unreachable, unactivatable, or trapped

**A11Y-05: Visible focus indicator distinct from hover and active**
`:focus-visible` produces an outline or ring that is visually distinct from both the default state and the `:hover`/`.active` states. Color alone is insufficient — must be a ring, outline, or offset change.
- PASS: Focus indicator distinguishable
- FAIL: Describe what's missing

**A11Y-06: Color-contrast for text (WCAG 1.4.3, 4.5:1 normal / 3:1 large)**
Check every text + background pairing in the component against WCAG AA thresholds:
- Normal text (<18pt or <14pt-bold): ≥4.5:1
- Large text (≥18pt or ≥14pt-bold): ≥3:1
Use a contrast checker or resolve the pair against the token values in `colors.css`. Both light and dark modes must pass.
- PASS: All text pairings ≥4.5:1 (or ≥3:1 for large text)
- FAIL: List each failing pair and the measured ratio

**A11Y-07: Color is not the sole conveyor of state**
Urgency, error, success, disabled — each is communicated by at least one of: icon, text, pattern. Color can reinforce but cannot be the only signal.
- PASS: Every stateful variant has a non-color signal
- FAIL: List variants that rely on color alone

**A11Y-08: `aria-current` on active selectable items**
If the component supports an `.active` class representing the selected item in a list, the HTML uses `aria-current="true"` on the active root (or the pattern-library component's `<li>`/`<button>` parent).
- PASS / N/A: Not a selectable item, or `aria-current` is correct
- FAIL: Active variant missing `aria-current`

**A11Y-09: List and heading semantics**
If the component represents a list, the markup uses `<ul>`/`<ol>` + `<li>` (or `role="list"`/`"listitem"` where needed). If it represents a section header, it uses `<h2>`/`<h3>` (or `role="heading"` with `aria-level`).
- PASS / N/A: Correct semantics, or component is not a list/heading
- FAIL: Describe what's missing

**A11Y-10: Touch target size (WCAG 2.5.5 reference; 44×44 CSS px)**
Interactive elements (buttons, taps, toggles) are at least 44×44 CSS px, or the surrounding padded target is.
- PASS: All interactive targets ≥44×44
- FAIL: List targets smaller than 44×44

**A11Y-11: Respects `prefers-reduced-motion`**
Any transition, fade, or animation is wrapped in `@media (prefers-reduced-motion: reduce) { animation: none; transition: none; }` or equivalent.
- PASS / N/A: No animation, or motion is gated
- FAIL: List unconditional animations

**A11Y-12: `aria-live` for components with dynamic state updates (WCAG 4.1.3)**
If the component's content or state is expected to change without a page navigation (toast, queue-item status transition, progress indicator, notification badge), the container carries `aria-live="polite"` (or `"assertive"` for high-urgency alerts) and `aria-atomic` where appropriate. Purely static components (badges, icons, typography samples) skip this check.
- PASS / N/A: Dynamic region has live region, or component is static
- FAIL: Dynamic content has no live-region scaffolding

**A11Y-13: Landmark regions are named and unique (WCAG 1.3.1, 2.4.1)**
If the component contains or is a landmark element (`<main>`, `<nav>`, `<aside>`, `<section>`, `<form>`, `<header>`, `<footer>`), each one that shares a page with a sibling of the same tag carries an `aria-label` so screen-reader landmark navigation can distinguish them. A single-landmark-of-its-kind page can omit. Components that don't contain any landmarks skip.
- PASS / N/A: All landmarks named, or no landmarks in this component
- FAIL: Two landmarks of the same role with no distinguishing label

**A11Y-14: DOM order matches visual reading order (WCAG 1.3.2)**
Tab order and screen-reader reading order follow DOM order. If visual CSS (flex/grid) reorders children (`flex-direction: row-reverse`, `order:`, grid placement), DOM order still matches intended reading order — or the visual reorder is wrong. For layout shells specifically: left panel DOM-first, center DOM-second, right DOM-third.
- PASS: DOM order matches visual/intended reading order
- FAIL: Describe the DOM/visual mismatch

### Integration checks

**INT-01: `COMPONENT-INDEX.md` row added**
New row present in the correct section with all columns filled.
- PASS: Row present
- FAIL: Row missing or incomplete

**INT-02: `COMPONENT-REGISTRY.md` status updated**
Row marked `built` (not `missing` or `in-progress`).
- PASS: Status updated
- FAIL: Status not updated

**INT-03: Nav link in `pl-nav.html`**
Link present in the correct section.
- PASS: Link present
- FAIL: Link missing or in wrong section

**INT-04: Page uses `<load>` tag**
Component loaded via `<load src="../components/{name}.html" />` — not inlined.
- PASS: Correct
- FAIL: Component markup inlined directly

**INT-05: Dev server renders without error**
Visit `http://localhost:5173/packages/design-system/pattern-library/pages/{name}.html`. Page loads, no JS console errors, Preline components initialize correctly.
- PASS: Page renders
- FAIL: Describe the error

---

## QA Report format

```
## QA Report — {Component Name}

### CSS
- CSS-01 No new CSS file:        PASS / FAIL
- CSS-02 @apply present:         PASS / FAIL
- CSS-03 Pure-CSS safety:        PASS / FAIL / N/A
- CSS-04 No semantic @apply:     PASS / FAIL
- CSS-05 No hex values:          PASS / FAIL
- CSS-06 Dark mode:              PASS / FAIL
- CSS-07 Row exclusion list:     PASS / FAIL / N/A

### HTML
- HTML-01 @component-meta:       PASS / FAIL
- HTML-02 No utility chains:     PASS / FAIL
- HTML-03 No style attrs:        PASS / FAIL
- HTML-04 No inline scripts:     PASS / FAIL
- HTML-05 FA Pro icons:          PASS / FAIL
- HTML-06 Dummy copy:            PASS / FAIL
- HTML-07 Preline attrs:         PASS / FAIL / N/A

### Accessibility
- A11Y-01 Root element:          PASS / FAIL
- A11Y-02 Icons aria-hidden:     PASS / FAIL / N/A
- A11Y-03 State indicators:      PASS / FAIL / N/A
- A11Y-04 Keyboard walkthrough:  PASS / FAIL
- A11Y-05 Focus indicator:       PASS / FAIL
- A11Y-06 Contrast:              PASS / FAIL
- A11Y-07 Color independence:    PASS / FAIL / N/A
- A11Y-08 aria-current active:   PASS / FAIL / N/A
- A11Y-09 List/heading:          PASS / FAIL / N/A
- A11Y-10 Touch target size:     PASS / FAIL
- A11Y-11 Reduced motion:        PASS / FAIL / N/A
- A11Y-12 Live region:           PASS / FAIL / N/A
- A11Y-13 Landmarks named:       PASS / FAIL / N/A
- A11Y-14 DOM reading order:     PASS / FAIL

### Integration
- INT-01 COMPONENT-INDEX row:    PASS / FAIL
- INT-02 REGISTRY status:        PASS / FAIL
- INT-03 Nav link:               PASS / FAIL
- INT-04 Page load tag:          PASS / FAIL
- INT-05 Dev server renders:     PASS / FAIL

### Verdict
PASS — ready to commit
FAIL — fix required: [list]

### For Aaron's visual review
[2–4 specific things that need eyes-on: hover states, animations, dark mode, etc.]
```

---

## On FAIL

Fix the failing check, then re-run only the failed checks (not the full suite).
Do not commit until the verdict is PASS.
