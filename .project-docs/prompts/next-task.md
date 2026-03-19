# Task: PL-FIX-01 — CSS Alignment: Vertical Centering + Line-Height
_Generated: 2025-03-19_
_App: pattern-library_

---

## Scope Classification

- [x] Pattern library only — CSS fixes to `components.css`; no new components, no app work

**New semantic classes being added:** none — all fixes modify existing class definitions

---

## Pre-Build Audit

Before writing any CSS, the agent must:

1. `grep -n "alert-icon\|\.badge\|\.timeline-icon-circle\|\.stepper-circle\|\.sidebar-nav-item\|\.btn\b\|\.checkbox-label\|\.radio-label\|input-field\|input-group-addon\|input-number-input" src/styles/tokens/components.css` — confirm current definitions
2. Read the current `.alert` block, `.badge` block, `.timeline-*` block, `.sidebar-nav-item` block, and button block in `components.css`
3. Read `.project-docs/decisions-log.md` and extract any rules that apply to this task
4. Do NOT touch any HTML files — this task is CSS only

---

## Prompt 1: Vertical centering — alerts

**File:** `src/styles/tokens/components.css`

The `.alert` flex container uses `items-start`. This causes the icon, content, and dismiss button to align to the top. Fix:

- `.alert` — change `items-start` to `items-center`
- `.alert-icon` — remove `mt-0.5` (the manual nudge is no longer needed with centered flex)
- If a dismiss button (`.alert-dismiss`) class exists, ensure it also aligns correctly via flex centering

**Constraint:** Only the first line of adjacent text content should align with the icon, per the original design intent. After changing to `items-center`, verify this still looks correct for multi-line alert body content. If `items-start` is required for multi-line, add `self-center` to `.alert-icon` instead of changing the container.

### Known Constraints
- Systemic fixes only — do not add per-instance overrides or inline styles
- `@apply block` must be the first line of any pure-CSS class
- Never `@apply` a semantic class inside another semantic class

---

## Prompt 2: Vertical centering — badges

**File:** `src/styles/tokens/components.css`

The `.badge` class uses `inline-flex items-center`. Confirm `line-height` is not causing extra vertical space. Apply:

- `.badge` — add `line-height: 1` explicitly (not via `@apply leading-none`) to prevent font metrics from adding hidden vertical space above/below the text
- Ensure icon + text inside badge are vertically centered — if a `::before` pseudo-element is used anywhere in badge variants, add `vertical-align: middle`

---

## Prompt 3: Vertical centering — timeline

**File:** `src/styles/tokens/components.css`

`.timeline-event-header` uses `flex items-center`. The issue is that `.timeline-icon-circle` is positioned in a separate `.timeline-left` flex column and the header content in `.timeline-event-body` — these two columns are siblings in a `flex gap-4` row (`.timeline-event`).

Fix:
- `.timeline-event` — confirm it has `items-start`. This is correct — the icon circle and body should align to the top of the event row. Do not change this.
- `.timeline-event-header` — ensure `items-center` is set and that `flex-wrap` does not cause misalignment on narrow viewports
- `.timeline-icon-circle` — confirm it has explicit `w-8 h-8` dimensions and `flex items-center justify-center`. If any of these are missing, add them.

This is a verification + correction prompt. Only change what is actually wrong.

---

## Prompt 4: Vertical centering — checkbox and radio labels

**File:** `src/styles/tokens/components.css`

`.checkbox-label` and `.radio-label` are flex row wrappers. The native `input[type='checkbox']` and `input[type='radio']` inputs have `mt-0.5` for manual nudging.

Fix:
- `.checkbox-label` and `.radio-label` — add `items-center` to the `@apply` chain (replace any `items-start` if present)
- Remove `mt-0.5` from the `input[type='checkbox']` and `input[type='radio']` global rules — the nudge is only needed when parent is `items-start`
- **Exception:** Do not remove `shrink-0` from those inputs

---

## Prompt 5: Line-height and text-overflow on single-line elements

**File:** `src/styles/tokens/components.css`

Several components are taking up more vertical space than their content requires because the browser's default line-height (typically 1.5) is applied. These elements should only ever render as a single line. Apply the following to each class listed:

**Classes to fix:** `.sidebar-nav-item`, `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-danger`, `.btn-sm`, `.btn-xs`, `.badge`

For each:
1. Add `line-height: 1` (raw CSS, not `@apply`) to the class definition
2. Add `overflow: hidden; text-overflow: ellipsis; white-space: nowrap;` — but ONLY to `.sidebar-nav-item` (nav links are the only ones with a fixed-width container where overflow is a real risk). Do not add text-overflow to buttons or badges — they should wrap or grow.

**`.sidebar-nav-item` specific:**
- `line-height: 1`
- `overflow: hidden`
- `text-overflow: ellipsis`
- `white-space: nowrap`

**`.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-danger`, `.btn-sm`, `.btn-xs`, `.badge`:**
- `line-height: 1` only

**Note:** The global `button` rule in `components.css` also applies to all buttons. Check if `line-height` is already set there. If it is, the individual `.btn-*` overrides are still needed because specificity may vary.

---

## Verification

After all prompts complete, confirm:

- [ ] Verified at `http://localhost:5173/pattern-library/pages/alerts.html`
- [ ] Verified at `http://localhost:5173/pattern-library/pages/badges.html`
- [ ] Verified at `http://localhost:5173/pattern-library/pages/navigation.html`
- [ ] Verified at `http://localhost:5173/pattern-library/pages/healthcare.html` (timeline)
- [ ] Verified at `http://localhost:5173/pattern-library/pages/forms.html` (checkbox/radio)
- [ ] All changes are in `components.css` with `@apply` or raw CSS — no inline styles, no HTML changes
- [ ] No utility chains added to HTML files
- [ ] Dark mode variants present for any color changes (yes / no / not applicable — not applicable, these are layout-only fixes)
- [ ] Pattern library component file created with `@component-meta` header — not applicable
- [ ] `COMPONENT-INDEX.md` updated — not applicable
- [ ] `ANDREY-README.md` updated if class behavior changed — check if checkbox/radio/btn classes are referenced and note the `items-center` change
- [ ] Committed

---

## Completion Report

After verification passes and before running the git commit, output this report:

```
## Completion Report — PL-FIX-01

- Classes modified in components.css: [list every class touched]
- Specific property changes made: [list each property + old → new value]
- Any class where the fix was not applied and why: [list, or "none"]
- Dark mode added: not applicable
- ANDREY-README.md updated: [yes / no / not applicable]
- Schema delta logged: not applicable
- Items deferred or incomplete: [list, or "none"]
```

---

## Final Step: View the Result

```bash
git add -A
git commit -m "PL-FIX-01: vertical centering + line-height fixes on alert, badge, timeline, checkbox, radio, nav, btn"
```

Then output:

---
**View your result:**
- If `npm run dev` is already running: http://localhost:5173/pattern-library/pages/alerts.html
- If not running: open a terminal in the repo root, run `npm run dev`, then visit the URL above
---
