# Task 01: option-row — PL fragment + CSS + COMPONENT-INDEX

## Scope
Pattern library + CSS

## Task class
deterministic

## Model tier
sonnet

## Context

`option-row` is a Tier 1 novel primitive — a selectable option row with a bold title, supporting description, optional inline `(Recommended)` badge slot, and a triple-cued selection state (ring + filled glyph + check icon). It's the option-row used inside the agentic-question pattern's option zone (`option-row-list` slot inside `thread-question-card`). NOT response-option (assessment-only per steward verdict 2026-05-08).

This task copies the spec at `apps/_shared/design/new-components/option-row.md` into:
1. A new PL HTML fragment with `@component-meta` header
2. New semantic classes in `components.css`
3. A new row in `COMPONENT-INDEX.md`

The spec is the source of truth — copy from it, do not regenerate.

## Prerequisites

- None (can run first; option-row has no PL dependencies)

## Files to Read First

- `apps/_shared/design/new-components/option-row.md` — full spec (HTML structure, CSS definition, variants, accessibility, dark-mode)
- `packages/design-system/pattern-library/components/response-option.html` — assessment-context option-row precedent (NOT to reuse, but informs `@component-meta` format and structural conventions)
- `packages/design-system/pattern-library/components/badge.html` — `.badge.badge-sm` precedent for the inline `(Recommended)` slot
- `packages/design-system/src/styles/tokens/components.css` — find the existing `.response-option` block (around line 10418) to anchor the new `.option-row` block; place the new block in a logical neighborhood (Forms section, after Likert/assessment patterns, OR a new "Thread / Agent" patterns section — steward call at authoring)
- `packages/design-system/pattern-library/COMPONENT-INDEX.md` — find an appropriate category for the new row (likely under "Forms" or "Thread / Agent")

## Instructions

### Step 1: Create the PL fragment

Create `packages/design-system/pattern-library/components/option-row.html`. Header format (use `@component-meta` per existing PL fragments):

```html
<!-- @component-meta
name: option-row
category: forms (or thread-agent — steward call)
classes:
  - option-row
  - option-row-glyph
  - option-row-content
  - option-row-title
  - option-row-recommended
  - option-row-description
  - option-row-check
  - option-row.is-other
  - option-row-other-wrapper
  - option-row-other-textarea
  - option-row.is-tablet-dense
  - option-row-list
preline: false
notes: Tier 1 novel primitive for the agentic-question pattern. Single-select role=radio + multi-select role=checkbox variants. NOT response-option (assessment-only per steward verdict 2026-05-08).
-->
```

After the header, render seven exemplar instances inside a `<section class="pl-page">` wrapper (or whichever PL-page wrapper is current — check `response-option.html` for precedent):

1. **Single-select unselected** — `<button role="radio" aria-checked="false">` with title + description
2. **Single-select selected** — `<button role="radio" aria-checked="true">`
3. **Single-select with-recommendation** — title carries inline `<span class="badge badge-sm option-row-recommended">Recommended</span>`
4. **Multi-select unselected and selected** (two examples) — `<button role="checkbox">` with `aria-checked` flip
5. **`.is-other` collapsed** — `<button role="radio" class="option-row is-other" aria-expanded="false">`
6. **`.is-other` expanded with revealed textarea** — `aria-expanded="true"` plus the `<label class="sr-only">` + `<textarea class="option-row-other-textarea">`
7. **`.is-tablet-dense` modifier** — single-select example with the modifier applied; visually 48px tall

Wrap each exemplar in an `option-row-list` container demonstrating the `role="radiogroup"` (single-select) or `role="group"` (multi-select) pattern with `aria-labelledby` referencing a heading ID.

Copy HTML structure verbatim from the spec's "HTML Structure" section. Do not paraphrase ARIA attributes or class names.

Bilingual demo: include a Spanish-labeled `.is-other` example using the wireframe Bilingual Considerations copy:
- `option-row-description` text: "Escribe otra respuesta"
- Textarea placeholder: "Cuéntanos qué se ajusta mejor."

### Step 2: Add semantic classes to components.css

Open `packages/design-system/src/styles/tokens/components.css`. Find the appropriate insertion point — recommended: after the existing `.response-option-group` block (around line 10510) so option-row sits in the same neighborhood as its sibling assessment primitive (despite the steward verdict that they remain separate primitives — they're conceptually adjacent for navigation/maintenance).

Add the full CSS block exactly as specified in `option-row.md` § "CSS Definition (`components.css` additions)". This includes:

- Comment header naming the spec source + Tier
- `.option-row` base + custom property `--option-row-min-height`
- `:hover`, `:focus-visible`, `[aria-checked="true"]`, `[aria-disabled="true"]` / `:disabled` rules
- `(prefers-reduced-motion: reduce)` block on `.option-row`
- `.option-row.is-tablet-dense` modifier
- `.option-row-glyph` base + `[role="radio"]` circle / `[role="checkbox"]` square variants + `[aria-checked="true"]` filled state + reduced-motion suppression
- `.option-row-content`, `.option-row-title`, `.option-row-recommended`, `.option-row-description`
- `.option-row-check` + reduced-motion suppression
- `.option-row-other-wrapper`, `.option-row-other-textarea` + `:focus-visible`
- `.option-row-list`
- Dark-mode block redeclaring all color properties

Copy CSS verbatim from the spec — do not paraphrase or "improve" `@apply` chains.

### Step 3: Add COMPONENT-INDEX row

Open `packages/design-system/pattern-library/COMPONENT-INDEX.md`. Add a new row in the appropriate category table. Recommended category: **Forms** (alongside `response-option` and `response-option-group`) OR **Thread / Agent** (alongside `thread-approval-card`). Steward call — match the category to where the consuming primitive lives. Default: **Thread / Agent** since option-row is exclusively consumed by `thread-question-card`.

Row format (mirror existing rows for column structure):

```markdown
| Option Row | `option-row.html` | `option-row`, `option-row-glyph`, `option-row-content`, `option-row-title`, `option-row-recommended`, `option-row-description`, `option-row-check`, `option-row.is-other`, `option-row-other-wrapper`, `option-row-other-textarea`, `option-row.is-tablet-dense`, `option-row-list` | no | Tier 1 primitive for the agentic-question pattern. `<button role="radio">` (single-select) or `<button role="checkbox">` (multi-select) + `aria-checked`. Title + description + (Recommended) badge slot + check icon. `.is-other` reveals textarea on select. `.is-tablet-dense` raises `--option-row-min-height` to 48px. NOT response-option (assessment-only per steward verdict 2026-05-08). |
```

Update the `_Last updated:` line at the bottom of the file to today's date.

### Step 4: Verify the fragment renders

Run `pnpm --filter @haven/design-system dev` and visit http://localhost:5173. Navigate to the option-row PL page. Confirm:

- All 7 exemplar instances render
- Hover state shows sand-50 fill + sand-500 border
- Selected state shows accent-interactive border + filled glyph + visible check icon (triple-cued)
- `.is-other` collapsed renders the title "Other" / "Otro" with description "Type a different answer" / "Escribe otra respuesta"
- `.is-other` expanded shows the textarea with placeholder
- `.is-tablet-dense` example is visibly 48px tall vs default 44px
- Dark mode (toggle via dark-mode toggle button) renders all colors with adequate contrast

## Known Constraints

- **No utility soup.** All option-row styling lives in semantic classes inside `components.css`. The PL HTML uses `option-row`, `option-row-glyph`, etc. — never raw Tailwind utilities for option-row styling.
- **No inline `<style>` blocks** in the PL HTML.
- **Dark mode is mandatory.** Every color property in the new component class must have a `.dark` counterpart per the dark-mode block in the spec.
- **`@apply block;` rule (per CLAUDE.md):** any new class in `components.css` that uses only raw CSS properties (no Tailwind utilities) gets `@apply block;` as its first line. Most option-row classes use `@apply` chains with Tailwind utilities and won't trigger this rule; double-check `.option-row-glyph`, `.option-row-other-textarea`, and the dark-mode rules.
- **Do NOT modify `.response-option` or `.response-option-group`** — steward verdict locks those assessment-only.

## Anti-patterns

- Do NOT paraphrase the spec's HTML or CSS. Copy verbatim.
- Do NOT add `tabindex="0"` to multiple option-rows in the same `option-row-list`. Roving tabindex is consumer-side state — primitive examples can show one-zero, rest-minus-one as illustrative, but the actual roving behavior is documented in the spec's Accessibility Notes.
- Do NOT add an `aria-label` on the option-row `<button>` — the accessible name comes from the title text in the DOM. Adding `aria-label` would override the title (SC 4.1.2 violation).
- Do NOT use `aria-pressed` for multi-select. Use `role="checkbox"` + `aria-checked` per the spec's locked ARIA verdict.

## Expected Result

After this task:
- `packages/design-system/pattern-library/components/option-row.html` exists with `@component-meta` header + 7 exemplar instances rendered
- `packages/design-system/src/styles/tokens/components.css` contains the new `.option-row` class set + dark-mode block
- `packages/design-system/pattern-library/COMPONENT-INDEX.md` has a new row for `option-row`
- The PL page renders at http://localhost:5173 without console errors
- All variants visually distinct + accessible

## Verification

- [ ] `option-row.html` exists with `@component-meta` header
- [ ] All semantic classes from the spec exist in `components.css` (grep: `^\.option-row` returns 12+ matches)
- [ ] `--option-row-min-height` custom property is defined
- [ ] Dark-mode block redeclares every color property used in the light-mode block
- [ ] `COMPONENT-INDEX.md` has the new row
- [ ] PL page renders at http://localhost:5173 without errors
- [ ] HTML classes in `option-row.html` are semantic — no utility chains for option-row styling
- [ ] No inline `<style>` blocks in `option-row.html`
- [ ] `prefers-reduced-motion: reduce` blocks present for transition properties
- [ ] `pnpm --filter @haven/design-system dev` runs cleanly (no Vite errors)
- [ ] `_Last updated:` line in `COMPONENT-INDEX.md` updated to today's date
- [ ] `packages/design-system/src/data/_schema-notes.md` updated if any dummy data deviates from Firebase schema (yes / no / **not applicable**)

## Completion Report

After all verification passes and before running the git commit, output this report:

```
## Completion Report — Task 01: option-row PL fragment

- New semantic classes added to components.css: .option-row, .option-row-glyph, .option-row-content, .option-row-title, .option-row-recommended, .option-row-description, .option-row-check, .option-row.is-other, .option-row-other-wrapper, .option-row-other-textarea, .option-row.is-tablet-dense, .option-row-list (12 classes + 1 custom property + dark-mode block)
- Existing classes modified: none
- Pattern library files created or updated:
  - packages/design-system/pattern-library/components/option-row.html (new)
  - packages/design-system/pattern-library/COMPONENT-INDEX.md (new row)
- Judgment calls (anything not explicitly specified in the prompt): none
- Dark mode added: yes
- Schema delta logged: not applicable
- Items deferred or incomplete: none
```

**Deterministic task — "Judgment calls" must be `none`.** If the report shows any judgment call, the task was misclassified — STOP, do not commit, and route back to haven-mapper or the option-row spec for the missing detail.

## Commit scope

Stage explicitly:
```
git -C /Users/aaronsleeper/Vaults/Lab/haven-ui add \
  packages/design-system/pattern-library/components/option-row.html \
  packages/design-system/src/styles/tokens/components.css \
  packages/design-system/pattern-library/COMPONENT-INDEX.md
```

Pre-existing dirty files (`DESIGN.md`, `packages/ui-react/schema/*.markdoc.js`) are from another task — do NOT stage them.

Commit message format (per Lab/haven-ui git rules):
```
feat(haven-pl): option-row Tier 1 primitive — PL fragment + CSS + index

Tier 1 novel primitive for the agentic-question pattern. Single-select
role=radio + multi-select role=checkbox + .is-other reveal-on-select +
.is-tablet-dense modifier. Dark mode + reduced-motion handled.
Spec: apps/_shared/design/new-components/option-row.md
```

## Next step

After verification + commit:
1. Update `apps/_shared/design/build/slice-manifest.md` Round 1 section as the 4-expert panel runs (ux-design-lead, design-system-steward, accessibility, brand-fidelity)
2. Resolve any iterate-then-ship feedback from the panel
3. Then proceed to Task 02 (`02-thread-question-card-pl-fragment.md`)

## If Something Goes Wrong

- **`@apply` errors at Vite build:** check that the Tailwind utilities you're applying actually exist in the haven-ui Tailwind theme; raw `@theme` color names (e.g., `text-sand-900`) require the `colors.css` token to be defined.
- **Dark mode doesn't render:** confirm the `.dark` block is OUTSIDE the light-mode rule (sibling, not nested). The haven-ui dark-mode strategy is class-based (`.dark` on `<html>`), not media-query based.
- **`role="checkbox"` not announcing as checkbox:** confirm `aria-checked="false"` (not `false` boolean attribute; ARIA attributes are string-valued).
- **Reduced motion not suppressing transitions:** confirm `transition: none` (not `transition-property: none` — the latter only stops the property list, not the transition behavior).
