# Task 01: Audit AgenticShell Import and Panel Landmarks

## Scope
App only

## Task class
deterministic

## Model tier
haiku

## Context
The coordinator app currently renders inside `AgenticShell` from `@haven/ui-react`. Before upgrading any panel content, confirm that the three landmark elements (`panel-nav`, `panel-chat`, `panel-content`) are present with correct semantic HTML, that `aria-label` attributes match the wireframe spec, and that `AgenticShell` itself is imported correctly from the right package. This is a read-and-patch task — if all attributes are correct, no code change is needed. If any are wrong, patch them.

## Prerequisites
None — this is the first task.

## Files to Read First
- `apps/care-coordinator/src/App.tsx` — current shell implementation
- `packages/design-system/pattern-library/COMPONENT-INDEX.md` — Agentic Shell row (confirms `panel-nav`, `panel-chat`, `panel-content` class names)
- `packages/design-system/pattern-library/layout-agentic-shell.html` — reference markup if it exists; otherwise check COMPONENT-INDEX notes

## Instructions

### Step 1 — Read App.tsx
Open `apps/care-coordinator/src/App.tsx`. Find the `return (...)` block.

Confirm the following are present and correct:

1. `<AgenticShell>` is the outermost wrapper — imported from `@haven/ui-react`
2. `<nav className="panel-nav" aria-label="Queue">` — left pane landmark
3. `<main className="panel-chat" aria-label="Activity">` — center pane landmark (note: wireframe calls this the "Record viewer" but `Activity` is the existing label; keep existing label unless it's blank)
4. `<aside className="panel-content" aria-label="Care plan">` — right pane landmark
5. Two `<div className="panel-splitter" ... />` elements — one between nav and main, one between main and aside

Verify `data-panel-splitter`, `data-target`, `data-min`, `data-max` attributes are present on both splitter divs:
- Left splitter (between `panel-nav` and `panel-chat`): `data-target="previous"`, `data-min="180"`, `data-max="360"`
- Right splitter (between `panel-chat` and `panel-content`): `data-target="next"`, `data-min="320"`, `data-max="640"`

Per `shell-cc-coordinator.md`: left pane default 260px (220–320 range); right pane default 640px (480–800 range). Update `data-min`/`data-max` if they differ from spec:
- Left splitter: `data-min="220"` `data-max="320"`
- Right splitter: `data-min="480"` `data-max="800"`

### Step 2 — Patch if needed
If any attribute is wrong or missing, edit `apps/care-coordinator/src/App.tsx` to fix only those specific attributes. Do NOT refactor or reorganize other parts of the file.

### Known Constraints
- Do NOT add `style="..."` attributes — per CLAUDE.md no inline styles.
- Do NOT change any semantic class names (`.panel-nav`, `.panel-chat`, `.panel-content`) — they are canonical PL names from `COMPONENT-INDEX.md`.
- Do NOT use `@apply` in a React file — semantic classes only in `className`.
- The existing `aria-label="Activity"` on `panel-chat` is acceptable; do not change without explicit instruction.

## Expected Result
`apps/care-coordinator/src/App.tsx` renders `AgenticShell` with three landmark elements using correct classes, correct `aria-label` attributes, and both `panel-splitter` divs with correct min/max ranges. If all were already correct, no file changes.

## Verification
- [ ] `AgenticShell` import is `from '@haven/ui-react'`
- [ ] `panel-nav` has `aria-label` set
- [ ] `panel-chat` is a `<main>` element with `aria-label` set
- [ ] `panel-content` is an `<aside>` element with `aria-label` set
- [ ] Left splitter has `data-min="220"` `data-max="320"`
- [ ] Right splitter has `data-min="480"` `data-max="800"`
- [ ] No `style={{...}}` added
- [ ] No utility chains added to JSX (layout-only utilities OK per CLAUDE.md)
- [ ] HTML classes are semantic — no utility chains on new or modified elements
- [ ] Any new class in `components.css` that uses only raw CSS properties has `@apply block;` as its first line — N/A (no CSS changes in this task)
- [ ] Dark mode variants present — N/A (no CSS changes)
- [ ] `packages/design-system/src/data/_schema-notes.md` updated if any dummy data deviates from Firebase schema — not applicable

## Completion Report

After verification passes, output:

```
## Completion Report — Task 01: Audit AgenticShell Import and Panel Landmarks

- New semantic classes added to components.css: none
- Existing classes modified: none
- Pattern library files created or updated: none
- Judgment calls: none
- Dark mode added: not applicable
- Schema delta logged: not applicable
- Items deferred or incomplete: [list any, or "none"]
- Changes made: [describe exactly what was patched, or "no changes needed — all attributes correct"]
```

## If Something Goes Wrong
- If `AgenticShell` is not found in `@haven/ui-react`: run `pnpm --filter @haven/app-care-coordinator` to check the package.json; it should depend on `@haven/ui-react`. If not, stop and report.
- If `panel-splitter` divs are missing entirely: add them per the spec above; the markup is deterministic (no judgment needed).
- If `App.tsx` is dramatically different from what's described: read `packages/ui-react/src/components/AgenticShell.tsx` to confirm the component API, then proceed.
