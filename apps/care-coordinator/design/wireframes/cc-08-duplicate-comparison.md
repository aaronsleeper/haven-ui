# CC-08: Duplicate Comparison

**Application:** Care Coordinator Admin App (Desktop)
**Use Case(s):** UC-CC-10
**User Type:** Care Coordinator
**Device:** Desktop (center panel of three-panel shell)
**Route:** `/care-coordinator/` (center panel, loaded when a referral queue item with duplicate flag is selected)

## Page Purpose

Show the coordinator a side-by-side comparison of the new referral data against an existing patient record so they can determine: same person (re-enroll), different person (create new), or same person with different episode (link records). The comparison must make differences obvious and matching fields quiet.

---

## Layout Structure

### Shell
Center panel of CC-SHELL. Right panel has the referral thread with duplicate-specific approval card.

### Header Zone

#### Record Header
- **Component:** `[NEW COMPONENT: record-header]` (comparison context)
- Left side:
  - "Possible Duplicate" — `text-lg font-semibold text-gray-900`
  - Patient name from referral — `text-sm text-gray-500`
- Right side:
  - Match confidence: `badge-warning` "High Match" or `badge-neutral` "Moderate Match"
  - Match reason — `text-xs text-gray-500` (e.g., "Name + DOB + address match")

### Content Zone

#### Comparison Panel
- **Component:** `comparison-panel` (existing Haven component)
- **Layout:** Two `comparison-column` side by side
- **Left column header:** `comparison-column-header`
  - `comparison-title` "New Referral"
  - `comparison-subtitle` "From UConn Health · Received today"
- **Right column header:** `comparison-column-header`
  - `comparison-title` "Existing Record"
  - `comparison-subtitle` "PAT-2847 · Discharged Nov 20, 2025"
  - Status: `badge-secondary badge-sm` "Discharged"

#### Row-Based Comparison
- **Component:** `comparison-row` entries
- Each field is a row with label, left value, right value
- **Matching fields:** muted — `text-gray-400` on values, no highlight
- **Divergent fields:** highlighted — `.comparison-row-diff` on the row

| Field | New Referral | Existing Record | Match? |
|---|---|---|---|
| Name | Maria Garcia | Maria Garcia | ✓ Match (muted) |
| DOB | Mar 15, 1964 | Mar 15, 1964 | ✓ Match (muted) |
| Sex | Female | Female | ✓ Match (muted) |
| Address | 123 Main St, Hartford | 456 Oak Ave, Hartford | ✗ Different (highlighted) |
| Phone | (860) 555-0147 | (860) 555-0147 | ✓ Match (muted) |
| Insurance | Anthem BCBS, XYZ123 | UnitedHealth, ABC789 | ✗ Different (highlighted) |
| Diagnosis | E11.65 (T2DM) | E11.65 (T2DM) | ✓ Match (muted) |
| Referring Provider | Dr. Chen, UConn | Dr. Patel, Hartford Hosp | ✗ Different (highlighted) |

- **Row labels:** `comparison-row-label` — `text-sm font-medium text-gray-700`
- **Row values:** `comparison-row-value` — `text-sm text-gray-900` (or `text-gray-400` when muted)
- **Diff highlight:** `.comparison-row-diff` adds subtle background to the row

#### "Show Differences Only" Toggle
- **Component:** `toggle` (existing Haven component)
- Position: top-right of comparison panel, inline with the column headers
- Label: "Show differences only" — `text-xs text-gray-600`
- **When on:** Matching rows are hidden. Only divergent rows shown.
- **When off:** All rows visible (default), matching rows muted.

### Footer Zone
No footer — action is in the approval card (thread panel).

---

## Interaction Specifications

### Toggle "Show Differences Only"
- **Trigger:** Click toggle switch
- **Feedback:** Matching rows animate out (200ms fade) or back in
- **Navigation:** None
- **Error handling:** N/A

### Click Existing Record Link
- **Trigger:** Click the "PAT-2847" link in the right column header
- **Feedback:** Opens the existing patient record (CC-07) in a new context. Coordinator can review the full record and return.
- **Navigation:** Could open in a modal or replace center panel with back navigation. TBD — see Open Questions.
- **Error handling:** If record fails to load, `toast-error`

---

## States

### Loading State
- Record header: `skeleton-text` for title
- Comparison panel: two `skeleton` columns with 8-10 `skeleton-text` rows each

### Error State
- `alert-error`: "Couldn't load comparison data."
- CTA: `btn-outline` "Retry"

### No Duplicate State
- N/A — this screen only renders when a duplicate flag exists. If no duplicate, the referral loads as CC-04.

---

## Accessibility Notes
- Comparison panel: `role="table"` with appropriate headers for screen readers
- Matching vs divergent: indicated by both visual style (muted/highlighted) and `aria-label` ("Matching" / "Different") on each row
- Toggle: `aria-label="Show differences only"`
- Column headers: `aria-label="New referral data"` and `aria-label="Existing patient record"`

## Open Questions
- Should clicking the existing record link open a modal (preserves comparison context) or navigate to the full record (loses comparison context)? Modal seems better for this workflow — coordinator wants to peek at the full record, then return to decide.
- Should there be a "View history" for the existing record that shows why they were discharged? This context could influence the re-enroll decision.
- If the existing record was discharged recently, should the system suggest re-enrollment by default?

---

## New Components Flagged
- None — uses existing `comparison-panel`, `comparison-column`, `comparison-row`, `comparison-row-diff` from Haven component library.
