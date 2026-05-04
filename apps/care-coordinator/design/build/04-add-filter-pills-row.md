# Task 04: Add Filter Pills Row with Per-User Persistence Stub

## Scope
App only

## Task class
deterministic

## Model tier
haiku

## Context
The coordinator queue panel needs a filter pills row above the urgency sections — per `shell-cc-coordinator.md`. The pills let Sarah filter queue items by type: All / Referrals / Care plans / Discharges / Insurance (confirmed set from review-notes.md Gate 2).

The active filter state must persist per-user. At v1 the real persistence layer is not yet wired, so use `localStorage` with key `user_prefs.queue_filter`. The pill set is 5 items, which fit within the 260px sidebar using the existing `.filter-pill` class (confirmed in COMPONENT-INDEX + components.css line ~1780).

## Prerequisites
- Task 02 must be complete (queue-sidebar shell in place)

## Files to Read First
- `apps/care-coordinator/src/App.tsx` — current state after Task 02; will add filter pills to `queue-sidebar-body`
- `packages/design-system/src/styles/tokens/components.css` lines ~1780–1795 — `.filter-pill` and `.filter-pill.active` definitions

## Instructions

### Step 1 — Add filter state to App.tsx

In `apps/care-coordinator/src/App.tsx`, near the top of the `App()` function body (after existing `useState` declarations), add:

```tsx
// Filter pills — per-user persistence via localStorage (stub until real API)
const [activeFilter, setActiveFilter] = useState<string>(() => {
  try {
    return localStorage.getItem('user_prefs.queue_filter') ?? 'all';
  } catch {
    return 'all';
  }
});

const handleFilterChange = (filter: string) => {
  setActiveFilter(filter);
  try {
    localStorage.setItem('user_prefs.queue_filter', filter);
  } catch {
    // localStorage unavailable — filter works for session only
  }
};
```

### Step 2 — Add filtered sections computation

Below the `const sections` declaration in `App.tsx`, add a filtered-sections computation:

```tsx
const FILTER_TYPES: Record<string, string[]> = {
  all: [],
  referrals: ['Referral'],
  'care-plans': ['Care plan'],
  discharges: ['Discharge'],
  insurance: ['Insurance'],
};

const filterItems = (entries: QueueEntry[]) => {
  if (activeFilter === 'all') return entries;
  const allowed = FILTER_TYPES[activeFilter] ?? [];
  return entries.filter((e) => allowed.includes(e.category));
};

const filteredSections: NavSection[] = [
  section('urgent', 'Urgent', filterItems(urgent)),
  section('attention', 'Needs Attention', filterItems(attention)),
  section('info', 'Informational', filterItems(info)),
].filter((s) => s.items.length > 0);
```

Update the `sections.map(...)` in the JSX to use `filteredSections` instead of `sections`.

### Step 3 — Add filter pills markup to queue-sidebar-body

At the top of `<div className="queue-sidebar-body">`, before the section map, add:

```tsx
{/* Filter pills */}
<div className="flex flex-wrap gap-1.5 px-3 pb-3 pt-1">
  {(['all', 'referrals', 'care-plans', 'discharges', 'insurance'] as const).map((f) => (
    <button
      key={f}
      type="button"
      className={`filter-pill${activeFilter === f ? ' active' : ''}`}
      aria-pressed={activeFilter === f}
      onClick={() => handleFilterChange(f)}
    >
      {f === 'all' ? 'All' : f === 'care-plans' ? 'Care plans' : f.charAt(0).toUpperCase() + f.slice(1)}
    </button>
  ))}
</div>
```

**Layout note:** `flex flex-wrap gap-1.5 px-3 pb-3 pt-1` is a layout-only utility block — acceptable per CLAUDE.md "layout-only classes that apply only to the current template may appear inline."

### Known Constraints
- `filter-pill` and `filter-pill.active` are existing PL classes — do NOT modify them in `components.css`.
- Per-user filter persistence uses `localStorage` key `user_prefs.queue_filter` — locked decision from review-notes.md (Stage 2-review).
- Reassign scope is team-only at v1 — unrelated to this task but note it if you encounter the reassign flow.
- Do NOT add `style={{...}}` or inline styles.
- `filterItems` must handle the case where `e.category` does not match any `FILTER_TYPES` entry (returns empty for that filter, which is correct).

## Expected Result
- Five filter pills render in the queue sidebar body
- Clicking a pill sets it `.active` and filters queue sections to matching items
- Active filter survives page reload (reads from `localStorage` on mount)
- TypeScript compiles without errors

## Verification
- [ ] Five `filter-pill` buttons render: All, Referrals, Care plans, Discharges, Insurance
- [ ] Active pill has `filter-pill active` class and `aria-pressed="true"`
- [ ] Clicking "Referrals" hides non-referral queue items
- [ ] Clicking "All" restores all items
- [ ] `localStorage.getItem('user_prefs.queue_filter')` returns the last-clicked filter after reload
- [ ] No `style={{...}}` added
- [ ] No new utility chains added to non-layout elements
- [ ] `pnpm typecheck` passes (no new type errors)
- [ ] HTML classes are semantic on non-layout elements
- [ ] Dark mode variants — N/A (no CSS changes)
- [ ] `_schema-notes.md` — not applicable

## Completion Report

```
## Completion Report — Task 04: Add Filter Pills Row with Per-User Persistence Stub

- New semantic classes added to components.css: none
- Existing classes modified: none
- Pattern library files created or updated: none
- Judgment calls: none
- Dark mode added: not applicable
- Schema delta logged: not applicable
- Items deferred or incomplete: [list any, or "none"]
```

## If Something Goes Wrong
- If `QueueEntry.category` uses different casing than expected: read `src/data/queue.ts` and adjust `FILTER_TYPES` values to match exact category strings.
- If the filter pill row overflows the 260px sidebar: `flex-wrap` handles this correctly. If pills still overflow, check `components.css` `.filter-pill` for `white-space: nowrap` — if present, the pills will wrap at word boundaries, which is correct.
