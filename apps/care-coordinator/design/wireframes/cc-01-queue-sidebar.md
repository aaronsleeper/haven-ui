# CC-01: Queue Sidebar

**Application:** Care Coordinator Admin App (Desktop)
**Use Case(s):** UC-CC-01, UC-CC-02, UC-CC-03
**User Type:** Care Coordinator
**Device:** Desktop (part of three-panel shell)
**Route:** *(persistent left panel — no independent route)*

## Page Purpose

The coordinator's command center. Shows everything that needs their attention, organized
by urgency. Clicking an item loads context in the center and thread in the right. The queue
getting shorter is the reward loop.

---

## Layout Structure

### Shell
Persistent left panel of CC-SHELL. ~240px fixed width, full viewport height, border-right.
Background: `bg-white`. Independent vertical scroll.

### Header Zone
- **Component:** Custom sidebar header
- Logo: Cena Health logo, small — `size-6` (same as `app-sidebar-brand`)
- App name: "Ava" — `text-sm font-semibold`
- No close button on desktop (sidebar is always visible)

### Content Zone

#### Queue Summary Bar
- **Component:** Compact stat row below header
- Three counts in a horizontal row, each with urgency color:
  - 🔴 `2` — `text-red-600` — urgent count
  - 🟡 `7` — `text-amber-600` — needs attention count
  - 🟢 `3` — `text-gray-400` — informational count
- Each count is tappable — scrolls to that section
- **Typography:** `text-xs font-medium` for counts

#### Filter Controls
- **Component:** `filter-pill` row
- Horizontal scrollable row of pills:
  - "All" (default, `.active`)
  - "Referrals"
  - "Care Plans"
  - "Eligibility"
  - "Clinical"
  - "Other"
- Selecting a filter shows only that item type. "All" returns to urgency-sorted view.
- **Typography:** `text-xs`

#### Urgent Section
- **Component:** `[NEW COMPONENT: queue-section-header]`
- Section header: `fa-circle-exclamation` icon + "Urgent" + count badge
- Background: very subtle red tint — `bg-red-50` on section header only
- **Typography:** `text-xs font-semibold uppercase tracking-wide text-red-700`

- **Component:** `[NEW COMPONENT: queue-item]` (repeated per item)
- Each queue item card:
  - **Left edge:** 3px left border colored by urgency (`border-red-500` urgent, `border-amber-400` attention, `border-gray-200` informational)
  - **Top line:** Patient name — `text-sm font-medium text-gray-900` + item type badge — `badge-sm`
  - **Middle line:** One-line summary from agent — `text-xs text-gray-600`, truncated with ellipsis
  - **Bottom line:** Time in queue — `text-xs text-gray-400` + SLA indicator
  - **SLA indicator:**
    - Within SLA: `text-xs text-gray-400` showing time (e.g., "2h ago")
    - Warning (75% elapsed): `text-xs text-amber-600 font-medium` + `fa-clock` icon
    - Breached: `text-xs text-red-600 font-medium` + `fa-circle-exclamation` icon
  - **Hover:** `bg-gray-50`
  - **Selected/Active:** `bg-primary-50 border-l-primary-600` (left border changes to brand color)
  - **Click:** Loads record in center, thread in right
- **Spacing:** `py-2.5 px-3` per item, `gap-0.5` between items
- **Height:** Approximately 64-72px per item

#### Needs Attention Section
- **Component:** `queue-section-header`
- Section header: `fa-bell` icon + "Needs Attention" + count badge
- **Typography:** `text-xs font-semibold uppercase tracking-wide text-amber-700`
- Same `queue-item` component, with `border-amber-400` left edge

#### Informational Section
- **Component:** `queue-section-header`
- Section header: `fa-circle-info` icon + "Informational" + count badge
- **Typography:** `text-xs font-semibold uppercase tracking-wide text-gray-500`
- Same `queue-item` component, with `border-gray-200` left edge
- Items have a subtle muted appearance: `opacity-75` or lighter text

#### Divider
- **Component:** `divider-compact`
- Separates queue from navigation

#### Navigation
- **Component:** Extends `sidebar-nav-list`
- Nav items below the queue:
  - `fa-inbox` Queue (active — count badge with total)
  - `fa-users` Patients
  - `fa-chart-line` Reports
  - `fa-gear` Settings
- **Typography:** `text-sm`
- Active item: `text-primary-600 font-medium`

### Footer Zone
- No footer — sidebar scrolls to bottom of queue + nav

---

## Interaction Specifications

### Click Queue Item
- **Trigger:** Click on any queue item
- **Feedback:** Item gets `.active` state (bg-primary-50, left border primary). Previously active item deactivates.
- **Navigation:** Center panel loads record. Right panel loads thread.
- **Error handling:** If record fails to load, center panel shows `alert-error` with retry.

### Click Filter Pill
- **Trigger:** Click a filter pill
- **Feedback:** Pill gets `.active` state. Queue re-filters to show only matching items. Section headers update counts.
- **Navigation:** None — stays in sidebar
- **Error handling:** N/A — client-side filter

### Click Summary Count
- **Trigger:** Click an urgency count in the summary bar
- **Feedback:** Sidebar scrolls to that urgency section
- **Navigation:** None
- **Error handling:** N/A

### Queue Item Removed (After Approval)
- **Trigger:** Coordinator approves/rejects an item in the thread panel
- **Feedback:**
  - Item fades out (200ms)
  - Queue compacts (items below slide up, 150ms)
  - Counts update immediately
  - Next item in the same section gets a subtle highlight (not auto-selected)
- **Navigation:** Center and right panels stay showing the just-resolved record (coordinator may want to review)
- **Error handling:** If the approval action fails, item stays in queue, `toast-error` shows

---

## States

### Empty State (Zero Items)
- Queue section replaced with centered content:
  - **Component:** `empty-state`
  - Icon: `fa-inbox` in `text-gray-300`
  - Heading: "Nothing needs your attention right now."
  - Message: "When agents need your input, items will appear here."
  - No CTA button — this is a good state, not an error

### Loading State
- 5 `skeleton` rows in queue area, each approximately queue-item height
- Filter pills: 4 `skeleton-text` pills
- Summary counts: 3 `skeleton-text-sm` blocks

### Error State
- **Component:** `alert-error` inside sidebar
- Message: "Couldn't load queue"
- CTA: `.btn-outline` "Retry"

### Queue With Many Items (50+)
- Virtual scroll or pagination is not needed at launch (performance target: 100 items)
- If queue exceeds screen height, sidebar scrolls independently

---

## Accessibility Notes
- `role="complementary"` with `aria-label="Queue sidebar"`
- Queue items are `role="listitem"` inside a `role="list"` container
- Each urgency section is a `role="group"` with `aria-label` (e.g., "Urgent items, 2")
- Active/selected item has `aria-current="true"`
- Filter pills: `role="tablist"` with `role="tab"` per pill, `aria-selected` on active
- SLA indicators: include `aria-label` (e.g., "SLA breached, 4 hours overdue") — not color-only
- Keyboard: arrow keys navigate queue items, Enter to select

## Open Questions
- Should queue items show a patient avatar/initials or just text?
- Should the informational section be collapsed by default to reduce visual weight?
- Should there be a "Mark all informational as read" bulk action?

---

## New Components Flagged
- `[NEW COMPONENT: queue-item — sidebar queue item with urgency border, summary, SLA indicator]`
- `[NEW COMPONENT: queue-section-header — urgency tier label with icon and count]`
- `[NEW COMPONENT: queue-summary-bar — compact three-count urgency overview]`
