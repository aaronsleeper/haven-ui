# CC-03: Morning Summary Card

**Application:** Care Coordinator Admin App (Desktop)
**Use Case(s):** UC-CC-01
**User Type:** Care Coordinator
**Device:** Desktop (center panel content)
**Route:** `/care-coordinator/` (default view when no queue item is selected)

## Page Purpose

Lightweight orientation card that tells the coordinator how their day looks in 2-3 seconds.
Not a dashboard — just a summary of overnight queue activity and today's scheduled items.
This is what the coordinator sees before clicking into any queue item.

---

## Layout Structure

### Shell
Rendered in the center panel of CC-SHELL. Right panel (thread) is empty when this is showing.

### Header Zone
- No page header — the summary card IS the content

### Content Zone

#### Overnight Summary Card
- **Component:** `card`
- **Card header:**
  - Title: "Good morning, Sarah" — `text-lg font-semibold text-gray-900` (uses Plus Jakarta Sans display)
  - Subtitle: "Thursday, March 27" — `text-sm text-gray-500`

- **Card body:**

  **Queue counts section:**
  - **Component:** Three `card-stat` components in a `grid grid-cols-3 gap-4` row
  - Stat 1: count in `text-2xl font-bold text-red-600` + label "Urgent" — `stat-label`
  - Stat 2: count in `text-2xl font-bold text-amber-600` + label "Needs attention" — `stat-label`
  - Stat 3: count in `text-2xl font-bold text-gray-400` + label "Informational" — `stat-label`

  **Urgent items preview:**
  - **Component:** `list-group list-group-flush` inside the card
  - Only shown if urgent count > 0
  - Section label: "Urgent items" — `text-xs font-semibold uppercase tracking-wide text-red-700`
  - List of urgent items (max 5):
    - Each item: patient name + one-line summary + SLA status
    - Clickable — clicking opens the item (same as clicking in sidebar)
    - **Typography:** Name in `text-sm font-medium`, summary in `text-sm text-gray-600`, SLA in `text-xs` with urgency color
  - If more than 5 urgent items: "and N more..." link at bottom

  **Divider:** `divider-compact`

  **Today's scheduled items section:**
  - Section label: "Today" — `section-title`
  - List of scheduled items (appointments, follow-ups, reports due):
    - Each: time + type + patient name
    - **Typography:** Time in `text-sm font-medium text-gray-500`, type+name in `text-sm text-gray-900`
  - If no scheduled items: "No scheduled items today." — `text-sm text-gray-500`

- **Card footer:** None — the card ends after the scheduled items

#### Nothing-Urgent Variant
- When urgent count is 0:
  - Stat 1 (urgent): Shows "0" in `text-2xl font-bold text-gray-300` (muted, not red)
  - Urgent items preview section: hidden entirely
  - Instead, show a single line: "Nothing urgent overnight." — `text-sm text-green-600` with `fa-circle-check` icon
  - This should feel like a reward, not an empty state

---

## Interaction Specifications

### Click Urgent Item Preview
- **Trigger:** Click on an urgent item in the preview list
- **Feedback:** Same as clicking the item in the queue sidebar — center panel loads record, right panel loads thread, sidebar highlights the item
- **Navigation:** Summary card is replaced by the record view
- **Error handling:** Same as queue item click

### Return to Summary
- **Trigger:** Click Cena Health logo in sidebar, or deselect the active queue item
- **Feedback:** Center panel returns to morning summary. Right panel empties.
- **Navigation:** Back to default view
- **Error handling:** N/A

---

## States

### Loading State
- Single `skeleton` card in center panel with:
  - `skeleton-text` for greeting
  - 3 `skeleton` stat blocks in a row
  - 3-4 `skeleton-text` lines for item previews

### Error State
- **Component:** `alert-error` in center panel
- Message: "Couldn't load your summary."
- CTA: `.btn-outline` "Retry"

### Empty Queue State
- Summary card still renders but with zero counts
- "Nothing needs your attention right now. Check your patients or start scheduled work."
- Queue stat cards all show "0" in muted style
- Today's scheduled items section still shows (if any)

---

## Accessibility Notes
- Summary card: standard `card` semantics, no special ARIA
- Stat cards: `aria-label` on each (e.g., "2 urgent items")
- Urgent item list: `role="list"` for screen reader
- Greeting uses coordinator's name — pulled from auth context

## Open Questions
- Should the greeting change by time of day? ("Good morning" / "Good afternoon") — nice touch but low priority
- Should the summary show a comparison to yesterday? ("12 items overnight, up from 5 yesterday") — could be noisy

---

## New Components Flagged
- None — composed entirely from existing `card`, `card-stat`, `list-group`, `section-title`, and `divider` components
