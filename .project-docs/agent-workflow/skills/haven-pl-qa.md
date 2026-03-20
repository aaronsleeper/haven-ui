---
name: haven-pl-qa
description: QA a completed haven-ui pattern library component. Run after haven-pl-builder completes. Returns a structured pass/fail report. Do not commit until all required checks pass.
---

# Haven UI — Pattern Library Component QA

## When to invoke

After `haven-pl-builder` completes all files and before any commit:
- `src/styles/tokens/components.css` updated
- `pattern-library/components/{name}.html` created
- `pattern-library/pages/{name}.html` created
- `pattern-library/partials/pl-nav.html` updated
- `pattern-library/COMPONENT-INDEX.md` updated
- Dev server running at `http://localhost:5173`

---

## Checks

Work through every check. Record PASS, FAIL, or N/A with a specific note.

### CSS checks

**CSS-01: No new CSS files created**
All new classes must be in `src/styles/tokens/components.css`. No separate component CSS file.
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
Visit `http://localhost:5173/pattern-library/pages/{name}.html`. Page loads, no JS console errors, Preline components initialize correctly.
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
