# CC-05: Care Plan Viewer

**Application:** Care Coordinator Admin App (Desktop)
**Use Case(s):** UC-CC-07
**User Type:** Care Coordinator
**Device:** Desktop (center panel of three-panel shell)
**Route:** `/care-coordinator/` (center panel, loaded when care plan queue item is selected)

## Page Purpose

Show the full care plan organized by section, with per-section approval status. The coordinator scans the section status bar to know what's approved and what still needs them, reviews each section, then approves via the thread panel. Clinical sections are read-only (signed off by RDN/BHN). Coordinator-owned sections (visit schedule, monitoring, meal delivery) are reviewable and editable.

---

## Layout Structure

### Shell
Center panel of CC-SHELL. Left sidebar has the care plan queue item highlighted. Right panel has the care plan thread loaded with the approval card.

### Header Zone

#### Record Header
- **Component:** `[NEW COMPONENT: record-header]` (same as CC-04, different context)
- Left side:
  - "Care Plan v1.0" — `text-lg font-semibold text-gray-900`
  - Patient name below — `text-sm text-gray-500` (e.g., "Maria Garcia")
- Right side:
  - Status badge: `badge-warning` "Coordinator Review" (or `badge-success` "Active" if viewing an active plan)
  - Version label — `text-xs text-gray-500` (e.g., "Created Mar 26, 2026")

#### Section Status Bar
- **Component:** `[NEW COMPONENT: section-status-bar — horizontal checklist showing approval status per care plan section]`
- Layout: full-width bar below record header, `px-6 py-3`, light background `bg-gray-50`, border-bottom
- Each section is a compact inline item:
  - `fa-circle-check text-green-600` + section name — for clinician-approved sections
  - `fa-clock text-amber-500` + section name — for coordinator-pending sections
  - `fa-circle-check text-gray-400` + section name — for auto-populated/imported sections
- Section names are clickable — scroll to that section in the content zone
- Layout: horizontal flex row, wrapping if needed. Gap between items.
- Example:
  ```
  ✅ Goals  ✅ Nutrition  ✅ Behavioral Health  ⏳ Visit Schedule  ⏳ Monitoring  ⏳ Meal Delivery  ✅ Medications  ✅ Risk Flags
  ```
- Typography: `text-xs font-medium`, section name in `text-gray-700` (approved) or `text-amber-700` (pending)

### Content Zone

Scrollable single page with sections. Each section is an `accordion-item` inside an `accordion` container with `data-hs-accordion-always-open` (multi-open). Clinician-approved sections default **collapsed** (coordinator can expand to review). Coordinator-pending sections default **expanded**.

#### Section: Goals
- **Component:** `accordion-item` (collapsed by default — RDN approved)
- **Accordion header:**
  - `fa-circle-check text-green-600` + "Goals" + `badge-sm badge-success` "RDN approved · Mar 26"
  - `[COPY: read-only indicator]` — `text-xs text-gray-400` "Read-only — approved by RDN"
- **Accordion body:** `list-group list-group-flush`
  - Each goal: target metric + timeframe
  - Example items:
    - "HbA1c < 8.0% within 6 months"
    - "Weight loss 5–8% within 6 months"
    - "PHQ-9 score < 10 within 3 months"
  - Typography: `text-sm text-gray-900` for goal text

#### Section: Nutrition Plan
- **Component:** `accordion-item` (collapsed by default — RDN approved)
- **Accordion header:**
  - `fa-circle-check text-green-600` + "Nutrition Plan" + `badge-sm badge-success` "RDN approved · Mar 26"
  - Read-only indicator
- **Accordion body:** `kv-table`
  - Fields: Calories, Sodium, Diet type, Allergens, Special instructions
  - Example: 1600–1800 cal/day · <1800mg sodium · Diabetic-appropriate · Nut-free
  - If RDN made edits from agent draft, show edit note: `text-xs text-gray-500 italic` — "RDN adjusted sodium from 2300mg to 1800mg"

#### Section: Behavioral Health
- **Component:** `accordion-item` (collapsed by default)
- **Accordion header:**
  - If BHN reviewed: `fa-circle-check text-green-600` + "Behavioral Health" + `badge-sm badge-success` "BHN approved · Mar 27"
  - If auto-populated (PHQ-9 < 10): `fa-circle-check text-gray-400` + "Behavioral Health" + `badge-sm badge-neutral` "Auto-populated (PHQ-9: 7)"
- **Accordion body:** `kv-table`
  - Fields: PHQ-9 score, GAD-7 score, BHN session cadence, crisis protocol status
  - If auto-populated, note: `text-xs text-gray-500` — "BHN notified for awareness. Formal review not required."

#### Section: Visit Schedule
- **Component:** `accordion-item` (expanded by default — coordinator-owned)
- **Accordion header:**
  - `fa-clock text-amber-500` + "Visit Schedule" + `badge-sm badge-warning` "Coordinator review"
  - `[NEW COMPONENT: editable-section-indicator]` — `text-xs text-primary-600` "Editable" with `fa-pen-to-square` icon
- **Accordion body:** `data-table`
  - Columns: Visit Type, Cadence, First Visit
  - Example rows:
    | Visit Type | Cadence | First Visit |
    |---|---|---|
    | RDN initial | One-time | Within 7 days |
    | RDN follow-up | Monthly | Apr 30 |
    | BHN initial | One-time | Within 14 days |
    | BHN follow-up | Monthly | May 15 |
    | AVA wellness call | Weekly | After RDN initial |
  - Conflicts or availability gaps: row highlighted with `alert-warning` inline note

#### Section: Monitoring
- **Component:** `accordion-item` (expanded by default — coordinator-owned)
- **Accordion header:**
  - `fa-clock text-amber-500` + "Monitoring" + `badge-sm badge-warning` "Coordinator review"
  - Editable indicator
- **Accordion body:** `list-group list-group-flush`
  - Each monitoring item: type + frequency + method
  - Examples:
    - "AVA weekly wellness calls" — `badge-sm badge-neutral` "Voice"
    - "PHQ-9 monthly" — `badge-sm badge-neutral` "AVA"
    - "Weight self-report weekly" — `badge-sm badge-neutral` "Patient app"
    - "HbA1c every 3 months" — `badge-sm badge-neutral` "Lab"
    - "Lipid panel every 6 months" — `badge-sm badge-neutral` "Lab"

#### Section: Meal Delivery
- **Component:** `accordion-item` (expanded by default — coordinator-owned)
- **Accordion header:**
  - `fa-clock text-amber-500` + "Meal Delivery" + `badge-sm badge-warning` "Coordinator review"
  - Editable indicator
- **Accordion body:** `kv-table`
  - Fields:
    | Label | Value |
    |---|---|
    | Meals per week | 14 (2/day) |
    | Delivery days | Monday, Thursday |
    | Delivery address | 123 Main St, Hartford, CT 06103 |
    | Format | Frozen (patient preference) |
    | Dietary tags | Low-sodium, diabetic-appropriate, nut-free |
  - If address hasn't been verified in 30+ days: `alert-warning` inline — "Address not verified in 30+ days. Confirm with patient."
  - If no valid recipe matches: `alert-warning` inline — "0 valid recipes match current parameters. RDN alerted."

#### Section: Medications
- **Component:** `accordion-item` (collapsed by default — imported)
- **Accordion header:**
  - `fa-circle-check text-gray-400` + "Medications" + `badge-sm badge-neutral` "Imported from EHR"
- **Accordion body:** medication list using `medication-row` component
  - Each medication: name, dose, frequency
  - Read-only — imported data

#### Section: Risk Flags
- **Component:** `accordion-item` (collapsed by default — auto-populated)
- **Accordion header:**
  - `fa-circle-check text-gray-400` + "Risk Flags" + `badge-sm badge-neutral` "Auto-populated"
- **Accordion body:** `list-group list-group-flush`
  - Each flag: `severity-badge` (high/medium/low) + description
  - Example: `severity-high` "SDOH risk: 3 — food insecurity, transportation barriers"

### Footer Zone
No footer — action is in the thread panel (approval card).

---

## Interaction Specifications

### Click Section Status Bar Item
- **Trigger:** Click a section name in the status bar
- **Feedback:** Smooth scroll to that section in the content zone. If section is collapsed, expand it.
- **Navigation:** In-page scroll
- **Error handling:** N/A

### Edit Coordinator-Owned Section
- **Trigger:** Click "Edit" button (appears on hover/focus for coordinator-owned sections)
- **Feedback:** Section fields become editable inline. "Edit" button changes to "Save" + "Cancel".
- **Navigation:** None — stays in same view
- **Error handling:** If save fails, `toast-error`: "Couldn't save changes. Try again." Fields revert to previous values.

### Expand/Collapse Section
- **Trigger:** Click accordion header
- **Feedback:** Standard Preline HSAccordion expand/collapse animation
- **Navigation:** None
- **Error handling:** N/A

---

## States

### Loading State
- Record header: `skeleton-text` for title, `skeleton-text-sm` for subtitle
- Section status bar: 8 `skeleton-text-sm` inline blocks
- Content: 4-5 `skeleton` accordion items

### Error State
- **Component:** `alert-error` at top of center panel
- Message: "Couldn't load care plan."
- CTA: `btn-outline` "Retry"

### Disabled Approval State
- If a clinical section is not actually approved (system error):
  - Section status bar shows `fa-circle-exclamation text-red-600` for that section
  - `alert-error` at top: "Cannot approve — awaiting [RDN/BHN] review"
  - Approval card in thread panel has primary button disabled

---

## Accessibility Notes
- Section status bar items: `role="navigation"` with `aria-label="Care plan sections"`
- Each status item is a link (`<a>`) with `aria-label="[section name], [status]"` (e.g., "Goals, approved by RDN")
- Accordion headers: standard Preline ARIA (`aria-expanded`, `aria-controls`)
- Read-only sections: `aria-label` includes "read-only" for screen readers
- Editable sections: "Edit" button has `aria-label="Edit [section name]"`

## Open Questions
- Should the section status bar be sticky (fixed below record header) as the coordinator scrolls through sections? This would keep the checklist visible. Tradeoff: takes vertical space.
- For the "Edit and approve" flow — should inline editing highlight what was changed in the thread? (Spec says yes — "edits logged in thread with before/after")
- Should there be a "View as PDF" or "Print care plan" action?

---

## New Components Flagged
- `[NEW COMPONENT: section-status-bar — horizontal checklist of section names with approval status icons. Clickable to scroll. Reusable for any multi-section document with approval workflow.]`
- `[NEW COMPONENT: editable-section-indicator — small inline label "Editable" with pen icon, shown on coordinator-owned sections to distinguish from read-only clinical sections.]`
