# CC-07: Patient Record

**Application:** Care Coordinator Admin App (Desktop)
**Use Case(s):** UC-CC-11
**User Type:** Care Coordinator
**Device:** Desktop (center panel of three-panel shell)
**Route:** `/care-coordinator/` (center panel, loaded when a patient is selected from queue, patient list, or morning summary)

## Page Purpose

The coordinator's complete view of a patient. Demographics, insurance, care plan summary, care team, and recent activity — everything needed to understand this patient's current state. This is the view that loads for clinical queue items (missed check-ins, discharge reviews), and for patients clicked from the patient list.

---

## Layout Structure

### Shell
Center panel of CC-SHELL. Right panel loads patient's general thread.

### Header Zone

#### Record Header
- **Component:** `[NEW COMPONENT: record-header]` (same component, patient context)
- Layout: full-width, `px-6 pt-6 pb-4`
- Left side:
  - Patient name — `text-lg font-semibold text-gray-900`
  - Demographics line — `text-sm text-gray-500` (e.g., "62, F · Hartford, CT · English")
- Center:
  - Risk tier: `severity-badge` with `trend-badge` arrow
    - Example: `severity-high` "High Risk" + `trend-up` "↑ Rising"
    - Or: `severity-medium` "Moderate" + `trend-flat` "→ Stable"
- Right side:
  - Status badge: `badge-success` "Active" / `badge-warning` "Enrollment Pending" / `badge-neutral` "On Hold" / `badge-secondary` "Discharged"
  - Enrolled date — `text-xs text-gray-500` (e.g., "Enrolled Mar 15, 2026")

### Content Zone

Scrollable single page with section cards. No accordion needed — sections are short enough to scan in a single scroll.

#### Section 1: Demographics
- **Component:** `card` with `section-title` "Demographics"
- **Layout:** `kv-table`
- **Fields:**
  | Label | Value |
  |---|---|
  | Address | 123 Main St, Hartford, CT 06103 |
  | Phone | (860) 555-0147 |
  | Language | English |
  | Emergency Contact | Carlos Garcia (son) — (860) 555-0234 |
- **Edit:** `btn-outline btn-sm` "Edit" in card header, right-aligned. Opens inline editing for coordinator-owned fields.

#### Section 2: Insurance
- **Component:** `card` with `section-title` "Insurance"
- **Layout:** `kv-table`
- **Fields:**
  | Label | Value |
  |---|---|
  | Payer | Anthem BCBS |
  | Member ID | XYZ123 |
  | Coverage | `badge-sm badge-success` "Active" |
  | FAM Benefit | `badge-sm badge-success` "Covered" |
- Read-only — insurance data is from eligibility engine

#### Section 3: Care Plan Summary
- **Component:** `card` with `section-title` "Care Plan"
- **Layout:** Compact summary, not full plan
- **Content:**
  - Version + status: "v1.0 — Active since Mar 27" — `text-sm`
  - Goals snapshot (2-3 lines): "HbA1c < 8.0% · Weight loss 5-8% · PHQ-9 < 10" — `text-sm text-gray-600`
  - Meal parameters: "14 meals/wk · Frozen · Low-sodium, diabetic, nut-free" — `text-sm text-gray-600`
  - `text-link` "View full care plan →" — navigates to CC-05
- If no care plan: `text-sm text-gray-500` "No care plan — enrollment pending"

#### Section 4: Care Team
- **Component:** `card` with `section-title` "Care Team"
- **Layout:** `list-group list-group-flush`
- Each team member:
  - `avatar-sm` (initials) + name — `text-sm font-medium` + role — `text-xs text-gray-500`
  - Example:
    - `avatar-sm avatar-primary` PM → "Dr. Priya M." + "RDN"
    - `avatar-sm avatar-secondary` JK → "Janet K." + "BHN"
    - `avatar-sm avatar-neutral` SK → "Sarah K." + "Coordinator (you)"

#### Section 5: Activity Summary
- **Component:** `card` with `section-title` "Recent Activity"
- **Layout:** `list-group list-group-flush`
- Shows last 5-7 events in reverse chronological order:
  - Each: `text-xs text-gray-400` timestamp + `text-sm text-gray-700` event description
  - Example:
    - "Mar 29, 2:30pm — AVA wellness call completed. Mood: 7/10, Energy: 6/10"
    - "Mar 28, 10:00am — RDN visit completed. Notes filed."
    - "Mar 27, 8:22am — Care plan approved by Sarah K."
    - "Mar 26, 3:15pm — Delivery confirmed — 14 meals"
    - "Mar 25, 9:00am — Enrolled by Sarah K."
- `text-link` "View full timeline →" — expands or navigates to full activity log
- **Upcoming items** (below recent, separated by `divider-compact`):
  - `section-title` "Upcoming"
  - Same list format, future events:
    - "Apr 2, 10:00am — RDN follow-up (scheduled)"
    - "Apr 3 — AVA wellness call (weekly)"
    - "Apr 3 — Delivery (14 meals, frozen)"

#### Section 6: Pending Items
- **Component:** `card` with `section-title` "Pending"
- **Layout:** `list-group list-group-flush`
- Shows items in progress for this patient:
  - Each: `badge-sm badge-warning` type + description + `text-xs text-gray-400` time
  - Example: `badge-sm badge-warning` "Lab" — "HbA1c lab draw due (overdue 3 days)"
- If no pending items: `text-sm text-gray-500` "Nothing pending"
- Conditional: only shown if there are pending items

### Footer Zone
No footer.

---

## Interaction Specifications

### Click "View Full Care Plan"
- **Trigger:** Click text-link in care plan summary section
- **Feedback:** Center panel transitions to CC-05 (care plan viewer). Thread panel loads care plan thread.
- **Navigation:** Center panel content swap (no page navigation)
- **Error handling:** If care plan fails to load, `alert-error` in center panel

### Edit Demographics
- **Trigger:** Click "Edit" button in demographics card header
- **Feedback:** Address, phone, language, emergency contact fields become editable inline. "Edit" → "Save" + "Cancel" buttons.
- **Navigation:** None
- **Error handling:** `toast-error` if save fails

### Click Activity "View Full Timeline"
- **Trigger:** Click text-link below activity list
- **Feedback:** Activity section expands to show full timeline (or navigate to a timeline view — TBD)
- **Navigation:** In-page expansion or view swap
- **Error handling:** N/A

---

## States

### Loading State
- Record header: `skeleton-text` for name, `skeleton-text-sm` for demographics
- Each section card: `skeleton-text` lines (2-3 per section)

### Error State
- `alert-error`: "Couldn't load patient record."
- CTA: `btn-outline` "Retry"

### Discharged Patient
- Record header status badge: `badge-secondary` "Discharged"
- All sections still visible but muted (`opacity-80`)
- Discharge info appended to header: "Discharged Mar 15, 2026 — Program complete"
- Care plan section: "v1.2 — Archived" instead of "Active"
- No pending items section

---

## Accessibility Notes
- Risk tier: `severity-badge` includes text label, not color-only
- `trend-badge`: text description in `aria-label` (e.g., "Risk trend: rising")
- Status badge: text label always present
- Edit button: `aria-label="Edit demographics"`
- Activity items: timestamps use `<time>` element with `datetime` attribute
- Care team avatars: `aria-label` with full name and role

## Open Questions
- Should the activity summary show agent actions (tool calls) or only human-visible events? (Current spec: human-visible events only — agent detail is in the thread)
- Should there be a "Contact patient" action in the header? (e.g., initiate a call or message) — probably future
- Full timeline view: expand in-place or navigate to a separate view?

---

## New Components Flagged
- None — this screen is composed entirely from existing Haven components (card, kv-table, list-group, severity-badge, trend-badge, avatar, section-title, text-link) plus the shared record-header from CC-04.
