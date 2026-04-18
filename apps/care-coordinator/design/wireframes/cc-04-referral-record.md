# CC-04: Referral Record

**Application:** Care Coordinator Admin App (Desktop)
**Use Case(s):** UC-CC-06
**User Type:** Care Coordinator
**Device:** Desktop (center panel of three-panel shell)
**Route:** `/care-coordinator/` (center panel, loaded when referral queue item is selected)

## Page Purpose

Show the coordinator everything they need to know about an inbound referral: who the patient is, where the referral came from, whether eligibility checks passed, and what documents are attached. The coordinator reads this, then acts on the approval card in the thread panel. A clean referral should take under 2 minutes from click to approval.

---

## Layout Structure

### Shell
Center panel of CC-SHELL. Left sidebar has the referral queue item highlighted. Right panel has the referral thread loaded. This screen replaces whatever was previously in the center panel.

### Header Zone

#### Record Header
- **Component:** `[NEW COMPONENT: record-header — patient identity bar with status, contextual to record type]`
- Layout: full-width bar at top of center panel, `px-6 pt-6 pb-4`
- Left side:
  - Patient name — `text-lg font-semibold text-gray-900` (Plus Jakarta Sans display)
  - Below name: age, sex, DOB — `text-sm text-gray-500` (e.g., "62, F · DOB Mar 15, 1964")
- Right side:
  - Status badge:
    - Eligible: `badge-success` — "Eligible"
    - Incomplete: `badge-warning` — "Incomplete"
    - Failed: `badge-error` — "Eligibility Failed"
    - Pending: `badge-neutral` — "Pending"
  - Referral source label — `text-xs text-gray-500` (e.g., "via UConn Health · FHIR")

#### Status Banner
- **Component:** `alert` variant (contextual)
- Shown below the record header, full-width, conditional:
  - **Clean referral:** `alert-success` — "Referral complete — eligible — ready to enroll"
  - **Incomplete:** `alert-warning` — "Referral incomplete — [N] fields missing" with list of missing fields
  - **Eligibility failed:** `alert-error` — "Eligibility failed — [reason in plain language]" with alternative path if available
  - **Unknown source:** `alert-warning` — "Referral from [source name] — not a configured partner"
- Each alert is dismissible (coordinator has read it — context is in the thread too)

### Content Zone

Scrollable single page with sections. No tabs. Section order reflects the coordinator's review priority.

#### Section 1: Patient Demographics
- **Component:** `card` with `card-header` ("Demographics") + `card-body`
- **Layout:** `kv-table` inside card body
- **Fields:**
  | Label | Value | Notes |
  |---|---|---|
  | Name | Maria Garcia | `cell-primary` |
  | Date of Birth | March 15, 1964 (62) | |
  | Sex | Female | |
  | Address | 123 Main St, Hartford, CT 06103 | |
  | Phone | (860) 555-0147 | |
  | Language | English | |
  | Emergency Contact | Carlos Garcia (son) — (860) 555-0234 | |
- **Conditional:** If any field is missing (incomplete referral), show `[COPY: field missing placeholder]` in `text-amber-600` with `fa-triangle-exclamation` icon

#### Section 2: Referring Provider
- **Component:** `card` with `card-header` ("Referring Provider") + `card-body`
- **Layout:** `kv-table`
- **Fields:**
  | Label | Value |
  |---|---|
  | Provider | Dr. James Chen |
  | NPI | 1234567890 |
  | Organization | UConn Health |
  | Referral Source | FHIR API |

#### Section 3: Diagnosis
- **Component:** `card` with `card-header` ("Diagnosis") + `card-body`
- **Layout:** `list-group list-group-flush`
- Each diagnosis: ICD code in `badge badge-sm badge-neutral` + plain language description
- Example: `E11.65` Type 2 diabetes mellitus with hyperglycemia
- Multiple diagnoses listed if present

#### Section 4: Insurance & Eligibility
- **Component:** `card` with `card-header` ("Insurance & Eligibility") + `card-body`
- **Layout:** `kv-table` for insurance, followed by eligibility result
- **Insurance fields:**
  | Label | Value |
  |---|---|
  | Payer | Anthem BCBS |
  | Member ID | XYZ123 |
  | Coverage | Active |
- **Eligibility result** (below insurance, separated by `divider-compact`):
  - **Confirmed:** Three items with `fa-circle-check text-green-600`:
    - "Coverage active"
    - "FAM benefit covered"
    - "Clinical criteria met (E11.65 qualifies)"
  - **Failed:** Failed items with `fa-circle-xmark text-red-600`, passing items with check, alternative path in `alert-info` below
  - **Pending:** `indicator-pulse` + "Eligibility check pending — API processing"
  - Typography: `text-sm text-gray-700` for each line item

#### Section 5: Attached Documents
- **Component:** `card` with `card-header` ("Documents") + `card-body`
- **Layout:** `list-group list-group-flush`
- Each document:
  - `fa-file-pdf text-red-500` (or appropriate file icon) + filename — `text-sm font-medium`
  - Trailing: `text-link text-xs` — "View" (if not viewed) or "Viewed" with `fa-circle-check text-gray-400` (if viewed)
- If no documents: `text-sm text-gray-500` — "No documents attached"

### Footer Zone
No footer — the approval card in the right panel is the action surface.

---

## Interaction Specifications

### Click Document "View"
- **Trigger:** Click "View" link on an attached document
- **Feedback:** Opens document in a new browser tab (external viewer). Document status updates to "Viewed" with check icon.
- **Navigation:** New tab — center panel unchanged
- **Error handling:** If document fails to load, `toast-error`: "Couldn't open document. Try again."

### Click Missing Field
- **Trigger:** None — missing fields are display-only. The action to request missing data is in the approval card (thread panel).
- **Feedback:** N/A
- **Navigation:** N/A

---

## States

### Loading State
- Record header: `skeleton-text` for name, `skeleton-text-sm` for subtitle
- Status banner: hidden during load
- Each card: `card` with `skeleton-text` lines (3-4 per section)

### Error State
- **Component:** `alert-error` at top of center panel
- Message: "Couldn't load referral record."
- CTA: `btn-outline` "Retry"

### Empty State
- N/A — a referral record is always loaded from a queue item or search result. If the queue item exists, the record exists.

---

## Accessibility Notes
- Record header status badge: text label always present (not color-only)
- Eligibility result items: icon + text (not color-only status)
- Document "View" link: `aria-label="View [filename]"`
- kv-table uses `<dl>` / `<dt>` / `<dd>` semantics for label-value pairs
- Alert banners: `role="alert"`

## Open Questions
- Should the record header show a patient avatar/photo or just text? (Current spec: text only)
- Should the document viewer be inline (embedded PDF) or always open in a new tab? (Current spec: new tab)
- Should there be a "Print referral summary" action? (Deferred)

---

## New Components Flagged
- `[NEW COMPONENT: record-header — patient identity bar at top of center panel with name, demographics, status badge, and context label. Reusable across all center panel record types.]`
