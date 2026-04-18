# CC-09: Patient List

**Application:** Care Coordinator Admin App (Desktop)
**Use Case(s):** UC-CC-08, UC-CC-09
**User Type:** Care Coordinator
**Device:** Desktop (center panel of three-panel shell)
**Route:** `/care-coordinator/patients` (center panel, loaded when "Patients" nav item is clicked)

## Page Purpose

Browsable, searchable, sortable view of the coordinator's patient caseload. Two primary jobs: (1) find a specific patient by name or ID, and (2) identify patients with no recent activity who might be falling through gaps (the "quiet risk scan" from morning triage step 7).

---

## Layout Structure

### Shell
Center panel of CC-SHELL. When this screen loads:
- Left sidebar: "Patients" nav item is active (not "Queue")
- Right panel: empty — `empty-state` with "Select a patient to see their thread"
- Queue items are still visible in the sidebar (coordinator can click back to queue at any time)

### Header Zone

#### Page Header
- **Component:** `page-header`
- Left: "Patients" — `text-lg font-semibold text-gray-900`
- Right: patient count — `text-sm text-gray-500` "62 patients" (or filtered count: "8 of 62")

### Content Zone

#### Toolbar
- **Component:** `toolbar`
- **Search:** `search-input` with `search-input-icon` — placeholder: "Search by name or ID..."
- **Filters:** `filter-pill` row, inline after search:
  - "All" (default, `.active`)
  - "Active"
  - "Enrollment Pending"
  - "On Hold"
  - "Discharged"
  - "High Risk" (cross-cuts status — filters by risk tier regardless of status)
- **Sort indicator:** `text-xs text-gray-500` on right side of toolbar — "Sorted by: Last Activity ↑" (clickable to change sort)

#### Patient Table
- **Component:** `data-table`
- **Columns:**

| Column | Class | Content | Sortable | Notes |
|---|---|---|---|---|
| Name | `cell-primary` | Patient name (linked) | Yes | Bold, clickable. Default sort: alphabetical. |
| Status | — | `badge-sm badge-pill` | Yes | Colors: `badge-success` Active, `badge-warning` Enrollment Pending, `badge-neutral` On Hold, `badge-secondary` Discharged |
| Risk | — | `severity-badge` + `trend-badge` | Yes | e.g., `severity-high` + `trend-up` "↑" |
| Last Activity | — | Date + type | Yes (default) | e.g., "Mar 29 — AVA call". **Default sort column (oldest first for quiet risk scan).** |
| Coordinator | — | Name or "You" | Yes | "You" highlighted in `text-primary-600 font-medium` |

- **Row behavior:**
  - Hover: `bg-gray-50` (standard table hover)
  - Click: loads CC-07 (patient record) in center panel + patient thread in right panel
  - Active row: `bg-primary-50` when patient is selected

#### Staleness Indicator
- **Component:** `[NEW COMPONENT: staleness-indicator — inline label for patients with no recent activity]`
- Applied to the "Last Activity" column for patients with 7+ days of inactivity
- Layout: `fa-clock text-amber-500` + "X days" in `text-xs text-amber-600 font-medium`
- Appears after the activity date: "Mar 22 — AVA call · `⏰ 8 days`"
- At 14+ days: `text-red-600` instead of amber
- Visible regardless of sort or filter — it's a per-row indicator, not a filter

#### Table Empty State
- **Component:** `empty-state`
- Icon: `fa-users` in `text-gray-300`
- **When no patients match filter/search:**
  - Heading: "No patients match your search"
  - Message: "Try adjusting your filters or search terms."
  - No CTA
- **When coordinator has zero patients (shouldn't happen in practice):**
  - Heading: "No patients assigned"
  - Message: "Patients will appear here as referrals are processed."
  - No CTA

### Footer Zone

#### Pagination (if needed)
- **Component:** `pagination`
- Only shown if patient count exceeds display limit (100+ patients)
- At launch, pagination is not expected (target: < 100 patients per coordinator)
- If rendered: `pagination-info` "Showing 1–50 of 62" + `pagination-controls`

---

## Interaction Specifications

### Search
- **Trigger:** Type in search input
- **Feedback:** Table filters in real-time (debounced, 300ms) as coordinator types. Matches on patient name (first, last) and patient ID.
- **Navigation:** None
- **Error handling:** N/A (client-side filter)

### Click Filter Pill
- **Trigger:** Click a status filter
- **Feedback:** Pill gets `.active` state. Table filters to matching patients. Patient count in header updates ("8 of 62"). Multiple status filters are mutually exclusive (clicking "Active" deselects "All"). "High Risk" can be combined with status filters.
- **Navigation:** None
- **Error handling:** N/A

### Click Sort Column
- **Trigger:** Click a column header
- **Feedback:** Table re-sorts by that column. Sort indicator updates. Click again toggles ascending/descending.
- **Navigation:** None
- **Error handling:** N/A

### Click Patient Row
- **Trigger:** Click anywhere on a patient row
- **Feedback:** Row gets active state (`bg-primary-50`). Center panel transitions to CC-07 (patient record). Right panel loads patient thread.
- **Navigation:** Center panel content swap
- **Error handling:** If patient record fails to load, `toast-error`

### Click "Back to Patients"
- **Trigger:** When viewing CC-07 from patient list context, click "Patients" in sidebar nav or browser back
- **Feedback:** Center panel returns to CC-09. Previous scroll position and filter state preserved.
- **Navigation:** Center panel content swap
- **Error handling:** N/A

---

## States

### Loading State
- Page header: `skeleton-text` for title and count
- Toolbar: `skeleton-text` for search input, 5 `skeleton-text-sm` for filter pills
- Table: 8-10 `skeleton` rows with 5 columns each

### Error State
- **Component:** `alert-error` above the table
- Message: "Couldn't load patient list."
- CTA: `btn-outline` "Retry"

### Filtered to Zero Results
- Table body replaced with `empty-state` (described above)
- Toolbar stays visible so coordinator can adjust filters

---

## Accessibility Notes
- `data-table`: proper `<table>`, `<thead>`, `<th scope="col">` semantics
- Sortable columns: `aria-sort="ascending"` / `aria-sort="descending"` / `aria-sort="none"` on `<th>`
- Sort action: `aria-label="Sort by [column name]"` on column header buttons
- Patient rows: `role="row"` with `aria-label="[patient name], [status], [risk tier]"`
- Search input: `aria-label="Search patients by name or ID"`
- Filter pills: `role="tablist"` with `role="tab"` and `aria-selected` (same pattern as queue filter pills)
- Staleness indicator: `aria-label="No activity for X days"` — not color-only
- Active row: `aria-current="true"`

## Open Questions
- Should "High Risk" filter combine with status filters (AND logic) or be its own independent category? Current spec says it combines — e.g., "Active + High Risk" shows only active patients who are high risk.
- Should the patient list remember sort/filter state when navigating away and back? (Proposed: yes, within session)
- Should there be a "Download CSV" export action for the patient list? Coordinators may need this for reporting.
- Should the list show a column for "Assigned RDN" or is "Coordinator" sufficient?

---

## New Components Flagged
- `[NEW COMPONENT: staleness-indicator — inline label showing days since last activity. Clock icon + "X days" text. Color escalation: amber at 7+ days, red at 14+ days. Applied per-row in the Last Activity column of patient tables.]`
