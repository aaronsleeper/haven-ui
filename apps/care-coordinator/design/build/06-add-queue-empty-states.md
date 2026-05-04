# Task 06: Add Queue Empty States (Full Queue Empty + Per-Tier)

## Scope
App only

## Task class
generative

## Model tier
opus

## Context
Two empty states are needed in the queue panel per `shell-cc-coordinator.md`:

1. **Full queue empty** — when ALL three sections have zero items (after filtering or genuinely empty queue): a `data-empty-state` component fills the queue body. Copy from wireframe: heading "Nothing needs your attention right now", body "We'll surface anything urgent. Until then, you're caught up."

2. **Per-tier empty** — when one section has items but another has none: the empty section renders its `queue-section-header` with count "0" and a one-line per-tier note (no `data-empty-state` component, just an inline note inside the section body).

The copy is locked for the full empty state. Per-tier copy is specified in `review-notes.md` and `shell-cc-coordinator.md`. The generative judgment in this task is: where to render the notes within the React component tree, how to handle the transition between "full empty" and "partial empty" states cleanly, and whether to add a `data-empty-state` icon.

## Prerequisites
- Tasks 04 and 05 must be complete

## Files to Read First
- `apps/care-coordinator/src/App.tsx` — current state after Tasks 02–05
- `packages/design-system/pattern-library/COMPONENT-INDEX.md` — `data-empty-state` row (Data Display section); `data-empty-state` + `empty-state-icon` classes
- `apps/care-coordinator/design/wireframes/shell-cc-coordinator.md` — States section: "Empty State (no queue items at all)" and "Empty State (one tier empty, others populated)"
- `apps/care-coordinator/design/review-notes.md` — copy for empty states (Stage 2 review section)

## Instructions

### Step 1 — Determine full-empty condition

In `App.tsx`, derive whether the queue is completely empty:

```tsx
const isQueueEmpty = filteredSections.length === 0;
```

### Step 2 — Render full empty state

In the queue panel, where sections currently map, wrap with a conditional:

```tsx
{isQueueEmpty ? (
  <div className="data-empty-state px-4 py-8">
    <div className="empty-state-icon">
      <i className="fa-regular fa-circle-check" aria-hidden="true" />
    </div>
    <p className="text-base font-medium text-sand-900 dark:text-sand-100 mt-3">
      Nothing needs your attention right now
    </p>
    <p className="text-sm text-sand-500 dark:text-sand-400 mt-1">
      We'll surface anything urgent. Until then, you're caught up.
    </p>
  </div>
) : (
  filteredSections.map((s) => (
    // ... existing section map
  ))
)}
```

**Judgment guidance:** The full-empty state should feel centered and calm — not alarming. The `fa-circle-check` icon in `text-sand-300` or equivalent light tone signals "all clear." The heading is mid-weight (`font-medium`), not bold, to match the low-urgency intent.

### Step 3 — Per-tier empty notes

When a section has `items.length === 0` but the section itself exists (i.e., when filtering produces empty tiers for some urgency levels, or when the queue is genuinely light in one tier), the section header should still render but show a one-liner below it instead of a `queue-list`.

Per-tier copy (from wireframe + review-notes):
- Urgent (0 items): "Nothing urgent right now."
- Needs Attention (0 items): "Nothing in needs-attention."
- Informational (0 items): "No informational items."

**Note:** Currently, the `filteredSections` filter already excludes sections with `items.length === 0` via `.filter((s) => s.items.length > 0)`. To show per-tier empty notes, change the strategy:

Replace the `.filter` exclusion with a conditional render inside the map:

```tsx
const allSections: NavSection[] = [
  section('urgent', 'Urgent', filterItems(urgent)),
  section('attention', 'Needs Attention', filterItems(attention)),
  section('info', 'Informational', filterItems(info)),
];

// Full-queue-empty uses allSections.every(s => s.items.length === 0)
const isQueueEmpty = allSections.every((s) => s.items.length === 0);
```

Then in the map:
```tsx
{allSections.map((s) => (
  <div key={s.urgency}>
    <h2 className={`queue-section-header ${urgencyClass(s.urgency)}`}>
      ...
    </h2>
    {s.items.length > 0 ? (
      <ul className="queue-list">
        {s.items.map(...)}
      </ul>
    ) : (
      <p className="text-xs text-sand-500 dark:text-sand-400 px-3 py-2">
        {perTierEmptyNote(s.urgency)}
      </p>
    )}
  </div>
))}
```

Add a helper:
```tsx
const perTierEmptyNote = (u: QueueItemUrgency) =>
  u === 'urgent' ? 'Nothing urgent right now.' :
  u === 'attention' ? 'Nothing in needs-attention.' :
  'No informational items.';
```

**Judgment call:** Whether to show all three section headers when the queue is filtering to zero vs. showing only the full-empty state. Recommendation: show full-empty state only when ALL sections are empty after filtering; show per-tier notes when at least one section has items. Log this judgment in the completion report.

### Known Constraints
- Copy is locked: do NOT modify the heading "Nothing needs your attention right now" or the body "We'll surface anything urgent. Until then, you're caught up." — from wireframe spec.
- `data-empty-state` and `empty-state-icon` are PL classes — use them, do NOT invent new classes.
- Do NOT add `style={{...}}`.
- `aria-hidden="true"` on decorative icons.

## Expected Result
- When filter produces zero items across all sections: `data-empty-state` renders with the locked heading + body copy.
- When one tier is empty but others have items: that section shows its header + per-tier one-liner (no `data-empty-state`).
- TypeScript compiles.

## Verification
- [ ] With no data loaded (or all filtered out): `data-empty-state` renders with FA circle-check icon
- [ ] Empty state heading text: "Nothing needs your attention right now"
- [ ] Empty state body text: "We'll surface anything urgent. Until then, you're caught up."
- [ ] Per-tier empty: when attention section has 0 items, shows "Nothing in needs-attention."
- [ ] No `style={{...}}` added
- [ ] `pnpm typecheck` passes
- [ ] HTML classes are semantic — no utility chains on new content-styled elements
- [ ] Dark mode text colors applied (`dark:text-sand-*`)
- [ ] `_schema-notes.md` — not applicable

## Completion Report

```
## Completion Report — Task 06: Add Queue Empty States

- New semantic classes added to components.css: none
- Existing classes modified: none
- Pattern library files created or updated: none
- Judgment calls:
  - [1] Full-empty vs. per-tier: full-empty state shows ONLY when all tiers are zero; otherwise per-tier notes show per section with items=0. Rationale: [explain]
  - [2] Empty-state icon: used fa-regular fa-circle-check in [color class]. Rationale: [explain]
  - [list any additional judgment calls]
- Dark mode added: yes (text-color dark variants on empty state)
- Schema delta logged: not applicable
- Items deferred or incomplete: [list any, or "none"]
```

## If Something Goes Wrong
- If the `data-empty-state` class is not providing expected centering: read `components.css` for `.data-empty-state` — it may need `flex flex-col items-center text-center` layout utilities added to the wrapper (layout-only, acceptable per CLAUDE.md).
- If the per-tier note text is clashing with `queue-section-header` spacing: adjust padding on the note `<p>` element.
