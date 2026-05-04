# Task 02: Wire Queue Data to QueueSectionHeader + Urgency Sections

## Scope
App only

## Task class
deterministic

## Model tier
haiku

## Context
The queue panel (`panel-nav`) currently renders queue items grouped by urgency via `nav-section` + `nav-section-label`. The wireframe target is `queue-sidebar` → `queue-sidebar-brand` + `queue-sidebar-body`, with three `queue-section-header` rows (`.is-urgent`, `.is-attention`, `.is-info`) each followed by a `queue-list` of `queue-item` components.

The existing code uses `NavSection` grouping and `QueueItem` from `@haven/ui-react`. This task confirms those are wired to the correct semantic shell (`queue-sidebar` / `queue-sidebar-body`) and that `queue-section-header` is rendered with the correct urgency modifier and count badge.

## Prerequisites
- Task 01 must be complete

## Files to Read First
- `apps/care-coordinator/src/App.tsx` — current queue rendering logic (the `sections.map(...)` block inside `panel-nav`)
- `apps/care-coordinator/src/data/queue.ts` — data shape: `urgent`, `attention`, `info` arrays
- `packages/design-system/pattern-library/COMPONENT-INDEX.md` — Queue section rows for `queue-section-header`, `queue-sidebar`, `queue-list`, `queue-item`
- `packages/ui-react/src/components/QueueItem.tsx` — confirm the React component is already ported

## Instructions

### Step 1 — Audit current queue panel markup

Open `apps/care-coordinator/src/App.tsx`. Locate the `<nav className="panel-nav">` block and read it carefully.

Current state uses a `sections.map(...)` loop rendering `div.nav-section` → `div.nav-section-label` → `ul.queue-list` → `QueueItem` rows.

Target state per `shell-cc-coordinator.md`:
```
<aside aria-label="Queue sidebar"> (wraps panel-nav, or panel-nav IS the aside)
  <div class="queue-sidebar">
    <div class="queue-sidebar-brand">
      [nav-header / nav-logo / Cena wordmark]
    </div>
    <div class="queue-sidebar-body">
      <div class="queue-section-header is-urgent">...</div>
      <ul class="queue-list">
        [queue-item rows]
      </ul>
      <div class="queue-section-header is-attention">...</div>
      <ul class="queue-list">...</ul>
      <div class="queue-section-header is-info">...</div>
      <ul class="queue-list">...</ul>
    </div>
  </div>
```

> Note: `panel-nav` is the landmark element; `queue-sidebar` is its interior wrapper per PL. Do not add a second `<aside>` — `panel-nav` is already the `<nav>` element.

### Step 2 — Wrap queue sections in queue-sidebar shell

In `apps/care-coordinator/src/App.tsx`, inside the `<nav className="panel-nav">` block:

1. Wrap the existing `div.nav-header` + sections content in `<div className="queue-sidebar">`.
2. Wrap the brand area in `<div className="queue-sidebar-brand">` (the `div.nav-header` + logo block).
3. Wrap the sections in `<div className="queue-sidebar-body">`.

### Step 3 — Replace nav-section-label with queue-section-header

Replace each `<div className="nav-section">` / `<div className="nav-section-label">` group with the correct `queue-section-header` pattern.

Per `COMPONENT-INDEX.md`, `queue-section-header` renders as an `<h2>`:
```jsx
<h2 className={`queue-section-header ${urgencyClass(s.urgency)}`}>
  <i className={urgencyIcon(s.urgency)} aria-hidden="true" />
  {s.label}
  <span className="badge badge-pill badge-neutral badge-sm ms-auto">{s.items.length}</span>
</h2>
```

Urgency class + icon map (per PL spec):
- `'urgent'` → `.is-urgent` + `fa-solid fa-circle-exclamation`
- `'attention'` → `.is-attention` + `fa-solid fa-triangle-exclamation`
- `'info'` → `.is-info` + `fa-solid fa-circle-info`

Add a helper function (or inline ternary) in `App.tsx`:
```tsx
const urgencyClass = (u: QueueItemUrgency) =>
  u === 'urgent' ? 'is-urgent' : u === 'attention' ? 'is-attention' : 'is-info';

const urgencyIcon = (u: QueueItemUrgency) =>
  u === 'urgent'
    ? 'fa-solid fa-circle-exclamation'
    : u === 'attention'
      ? 'fa-solid fa-triangle-exclamation'
      : 'fa-solid fa-circle-info';
```

### Step 4 — Keep QueueItem rendering unchanged
The `<li key={...}><QueueItem {...item} /></li>` rows inside `<ul className="queue-list">` are already correct — do not change them.

### Known Constraints
- **Never `@apply` a semantic class inside another semantic class** (decisions-log.md) — no CSS changes in this task.
- Do NOT modify `src/data/queue.ts` data values — only wire them differently in JSX.
- Do NOT add inline styles.
- `queue-section-header` must render as `<h2>` per PL spec (landmark heading for accessibility).
- Count badge: use existing `badge badge-pill badge-neutral badge-sm` classes — all confirmed in COMPONENT-INDEX.

## Expected Result
`apps/care-coordinator/src/App.tsx` renders the queue panel with:
- `.queue-sidebar` wrapper containing `.queue-sidebar-brand` and `.queue-sidebar-body`
- Three `<h2 className="queue-section-header is-{urgency}">` elements with correct icons and count badges
- `<ul className="queue-list">` under each section containing `QueueItem` rows

## Verification
- [ ] `queue-sidebar`, `queue-sidebar-brand`, `queue-sidebar-body` classes present in JSX
- [ ] Each section header is an `<h2>` element
- [ ] `queue-section-header.is-urgent` / `.is-attention` / `.is-info` applied correctly
- [ ] Each section has a count badge using `badge badge-pill badge-neutral badge-sm`
- [ ] Icons are FA Pro: `fa-circle-exclamation`, `fa-triangle-exclamation`, `fa-circle-info` with `aria-hidden="true"`
- [ ] `QueueItem` import and usage unchanged
- [ ] No `style={{...}}` added
- [ ] No utility chains added (layout-only utilities OK per CLAUDE.md)
- [ ] TypeScript compiles (`pnpm typecheck`) — no new type errors
- [ ] HTML classes are semantic — no utility chains on new or modified elements
- [ ] Dark mode variants present for all color/background/border/text on any new or modified class — N/A (no CSS changes)
- [ ] `packages/design-system/src/data/_schema-notes.md` updated if any dummy data deviates — not applicable

## Completion Report

```
## Completion Report — Task 02: Wire Queue Data to QueueSectionHeader + Urgency Sections

- New semantic classes added to components.css: none
- Existing classes modified: none
- Pattern library files created or updated: none
- Judgment calls: none
- Dark mode added: not applicable
- Schema delta logged: not applicable
- Items deferred or incomplete: [list any, or "none"]
- Changes made: [describe changes]
```

## If Something Goes Wrong
- If `QueueItemUrgency` type is not imported: add it from `@haven/ui-react`.
- If `urgencyClass`/`urgencyIcon` helpers conflict with existing types: inline the ternaries directly in JSX.
- If `queue-sidebar` classes are not rendering correctly: read `packages/design-system/src/styles/tokens/components.css` lines ~7700 for the canonical class definitions.
