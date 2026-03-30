# Record Viewer & Patient List — Use Cases, Functional Spec, and IA

**Feature:** Care Coordinator Record Viewer (center panel) + Patient List
**Source:** Project Ava journeys — coordinator-referral-intake.md, coordinator-care-plan-review.md, coordinator-morning-triage.md (step 7)
**Personas:** Care Coordinator (primary), Admin (secondary)
**Device:** Desktop (center panel of existing three-panel shell)

---

## Phase 1: Discovery

### Personas Involved

**Care Coordinator (Sarah)** — Same persona as queue triage. Manages 60-patient panel. When she clicks a queue item, the center panel needs to show the right context for that item type. When she clicks "Patients" in the sidebar nav, she needs a browsable list of her caseload.

**Admin** — May view the same records with broader access (cross-coordinator). Lower frequency, same patterns.

### User Goals

| Goal | Frequency | Priority |
|---|---|---|
| View referral record after clicking a referral queue item | Multiple times daily | Highest |
| Review care plan sections with approval status after clicking a care plan queue item | Several times per week | Highest |
| Browse, search, and filter patient caseload | Daily, during and after triage | High |
| Identify patients with no recent activity (quiet risk scan) | Daily, end of triage | Medium |
| View patient record (demographics, status, care team, risk) | Multiple times daily | Highest |
| Compare new referral against potential duplicate record | Occasional | Medium |
| Review care plan diff for plan updates | Weekly | Medium |

### Research Findings

- **Record viewer layout:** Scrollable single page with section anchors outperforms tabs or accordions when reviewers need to cross-reference fields across sections. Tabs are appropriate only for truly independent content modes (e.g., "Overview" vs "Documents" vs "Activity Log"). [Source: NNG, "Accordions Are Not Always the Answer", 2020; "Tabs, Used Right", 2016]
- **Section approval status:** Enterprise conventions (Salesforce Lightning, Oracle Health/Cerner) use a status icon + label at the section header level — checkmark/green for approved, warning/yellow for pending. Collapse approved sections by default, keep pending sections open. No single NNG article found on this pattern specifically.
- **Patient list columns:** Most decision-relevant columns first: patient name, status/stage, last activity date, risk level, assigned coordinator. Risk indicators should use color + icon + text label (never color alone). [Source: NNG, "Table Design Patterns", 2019-2023]
- **Quiet patient surfacing:** Established care management pattern: a "No Recent Activity" filter/smart list surfacing patients with no logged interaction beyond a configurable threshold. Visual treatment: a staleness indicator (clock icon + days since last contact) rather than hiding inactive patients. [Source: convention from Salesforce Health Cloud, Epic Care Everywhere]
- **Diff views for plan updates:** Non-technical reviewers perform better with inline highlighted diffs (additions in green/underline, deletions in red/strikethrough) than side-by-side views. Show the new version as primary, with changes highlighted in context. Provide a summary of changes at the top ("3 fields updated, 1 section added"). [Source: GOV.UK GDS content publishing tools, 2019-2023]
- **Duplicate comparison:** Side-by-side layout with aligned rows. Highlight differences, mute identical fields. "Show differences only" toggle reduces noise. Lead with high-confidence match fields (name, DOB) at top, divergent fields below. Confidence score at top of comparison. [Source: NNG, "Comparison Tables", 2017; Baymard Institute, "Product Comparison", 2021-2023]

### Use Cases

#### UC-CC-06: View Referral Record
**Precondition:** Coordinator clicked a referral queue item in sidebar.
**Trigger:** Queue item selection (from UC-CC-02).
**Flow:**
1. Center panel loads referral record — patient demographics, referring provider, diagnosis codes, insurance info, referral source
2. Status bar at top: "Referral complete — eligible — ready to enroll" (or variant for incomplete/failed)
3. Thread panel (right) loads referral thread with agent processing history
4. If documents are attached (clinical summary PDF), a documents section shows with view link
5. Coordinator reviews, then acts on the approval card in the thread
**Outcome:** Coordinator has full referral context to decide.
**Variants:**
- Incomplete referral: missing fields highlighted, status bar shows "Referral incomplete — X fields missing"
- Eligibility failed: status bar shows failure reason in plain language, alternative path if available
- Duplicate detected: center panel shows side-by-side comparison (see UC-CC-10)
- Unknown referral source: warning banner at top

#### UC-CC-07: Review Care Plan
**Precondition:** Coordinator clicked a care plan queue item. RDN (and optionally BHN) have signed off.
**Trigger:** Queue item selection.
**Flow:**
1. Center panel loads care plan viewer organized by section
2. Section status bar at top shows approval status per section (checkmark for clinician-approved, pending for coordinator-owned)
3. Coordinator scrolls through sections: goals, nutrition plan, behavioral health, visit schedule, monitoring, meal delivery, medications, risk flags
4. Clinical sections (goals, nutrition, behavioral health) are read-only — approved by clinicians
5. Coordinator-owned sections (visit schedule, monitoring, meal delivery) are reviewable and editable
6. Coordinator checks thread for clinical review context (why did the RDN change something?)
7. Coordinator acts on the approval card
**Outcome:** Care plan reviewed with full section-level context.
**Variants:**
- Care plan update (not new): center panel shows inline diff view — additions highlighted, deletions struck through, unchanged sections collapsed, change summary at top
- Emergency care plan update: emergency indicator, 4h SLA, diff view with triggering event shown
- BHN review skipped (PHQ-9 < 10): behavioral health section shows auto-populated status

#### UC-CC-08: Browse Patient List
**Precondition:** Queue is cleared or coordinator wants to check caseload.
**Trigger:** Coordinator clicks "Patients" in sidebar nav.
**Flow:**
1. Center panel switches from record viewer to patient list
2. List shows all patients in coordinator's panel with columns: name, status, risk tier (with trend arrow), last activity, assigned coordinator
3. Coordinator can sort by any column, filter by status (active, enrollment_pending, discharged, on_hold) or risk tier
4. Search bar for patient lookup by name or ID
5. Clicking a patient row loads patient record in center + thread in right
**Outcome:** Coordinator can browse and access any patient.

#### UC-CC-09: Quiet Risk Scan (from morning triage step 7)
**Precondition:** Coordinator is on patient list view.
**Trigger:** Coordinator sorts by "last activity" or applies "no recent activity" filter.
**Flow:**
1. Patient list sorted by last activity, oldest first
2. Patients with no activity in 7+ days have a staleness indicator: clock icon + "X days" in amber
3. Coordinator reviews each flagged patient, decides whether proactive outreach is needed
4. Clicking a patient loads their record and thread for context
**Outcome:** No patient falls through a gap.

#### UC-CC-10: Duplicate Patient Comparison
**Precondition:** Agent detected a potential duplicate during referral processing.
**Trigger:** Coordinator clicks a referral queue item flagged as potential duplicate.
**Flow:**
1. Center panel shows split comparison: new referral data (left column) vs existing patient record (right column)
2. Match confidence score at top (e.g., "High — name + DOB + address match")
3. Matching fields muted/grayed, divergent fields highlighted
4. Coordinator decides: re-enroll existing patient, create new record, or link records
5. Decision made via the approval card in the thread
**Outcome:** Duplicate resolved with coordinator judgment.

#### UC-CC-11: View Patient Record (General)
**Precondition:** Coordinator clicked a patient (from patient list, queue item, or morning summary).
**Trigger:** Patient selection.
**Flow:**
1. Center panel loads patient record organized in sections:
   - Header: patient name, status badge, risk tier with trend, age, key identifiers
   - Demographics: address, phone, language, emergency contact
   - Insurance: payer, member ID, coverage status
   - Care plan summary: current version, goals snapshot, meal parameters
   - Care team: assigned RDN, BHN, coordinator
   - Activity summary: recent events, upcoming appointments, pending items
2. Thread panel loads patient's general thread
3. Coordinator can navigate to full care plan view from the care plan summary section
**Outcome:** Coordinator has a full patient overview.

### Constraints

- **HIPAA:** All PHI visible in center panel is appropriate for coordinator role (full panel access). No raw SSN displayed — last 4 digits only if needed.
- **Read-only vs editable:** Coordinator can edit coordinator-owned fields (demographics, logistics, schedule). Clinical fields (nutrition plan, behavioral health) are read-only — coordinator must route to clinician.
- **Performance:** Record viewer must load within 1 second. Patient list must handle 100+ patients without pagination at launch (virtual scroll if needed later).
- **Accessibility:** WCAG AA. Section headers are keyboard-navigable landmarks. Status indicators use color + icon + text.
- **Bilingual:** Field labels and status text must work in English and Spanish without breaking layout. Patient-facing content (not this screen) at 5th grade reading level.

---

## Phase 2: Functional Specification

### Data Model

**Patient Record:**
| Field | Type | Source | R/W |
|---|---|---|---|
| id | string | system | R |
| name | {first, last} | intake/referral | R (coordinator can edit demographics) |
| dob | date | intake/referral | R |
| age | computed | derived | R |
| sex | enum | intake/referral | R |
| status | enum: enrollment_pending, active, on_hold, discharged, declined | system | R (coordinator can transition) |
| risk_tier | enum: low, moderate, high, critical | agent-computed | R |
| risk_trend | enum: rising, stable, improving | agent-computed | R |
| address | object | intake/patient | RW |
| phone | string | intake/patient | RW |
| language | enum: en, es | intake/patient | RW |
| emergency_contact | object | intake/patient | RW |
| insurance | {payer, member_id, coverage_status, benefit_status} | eligibility engine | R |
| care_plan_version | string | system | R |
| care_team | {rdn_id, bhn_id, coordinator_id} | system | R (coordinator can reassign) |
| last_activity | {date, type, summary} | system | R |
| created_at | datetime | system | R |
| enrolled_at | datetime | system | R |
| discharged_at | datetime | system | R |

**Referral Record:**
| Field | Type | Source | R/W |
|---|---|---|---|
| id | string | system | R |
| patient_data | object (parsed demographics, dx, insurance) | referral source / agent extraction | R |
| referring_provider | {name, npi, organization} | referral source | R |
| referral_source | {type: fhir|fax|email|phone, organization, partner_configured: boolean} | system | R |
| diagnosis_codes | string[] | referral | R |
| eligibility | {status: confirmed|failed|pending, details, alternative_path} | agent | R |
| completeness | {status: complete|incomplete, missing_fields: string[]} | agent | R |
| duplicate_check | {status: no_match|potential_match, match_confidence, existing_patient_id} | agent | R |
| attached_documents | [{type, filename, viewed: boolean}] | referral source | R |
| status | enum: received, processing, ready, incomplete, failed, enrolled, declined | system | R |

**Care Plan:**
| Field | Type | Source | R/W |
|---|---|---|---|
| id | string | system | R |
| patient_id | string | system | R |
| version | string (v1.0, v1.1, v1.0e) | system | R |
| status | enum: draft, clinical_review, coordinator_review, active, archived | system | R |
| sections | Section[] | see below | varies |
| previous_version_id | string | system | R |
| diff | DiffEntry[] | computed | R |

**Care Plan Section:**
| Field | Type | Owner | R/W by Coordinator |
|---|---|---|---|
| name | string | system | R |
| type | enum: goals, nutrition, behavioral_health, visit_schedule, monitoring, meal_delivery, medications, risk_flags | system | R |
| content | object (varies by type) | agent + clinician | R for clinical, RW for coordinator-owned |
| approval | {status: approved|pending|auto_populated, approved_by, approved_at, notes} | system | R |
| is_coordinator_owned | boolean | system | R |

**Diff Entry (for care plan updates):**
| Field | Type | Source |
|---|---|---|
| section | string | system |
| change_type | enum: added, modified, removed | computed |
| field | string | computed |
| old_value | any | previous version |
| new_value | any | current version |

### State Transitions

**Center panel content modes:**
```
queue_item_click → record_viewer (type varies by queue item)
patients_nav_click → patient_list
patient_row_click → record_viewer (patient record)
logo_click / deselect → morning_summary
```

**Record viewer content types (determined by queue item type or navigation):**
| Source | Center Panel Content |
|---|---|
| Referral queue item | Referral record |
| Care plan queue item | Care plan viewer |
| Eligibility queue item | Referral record (eligibility section expanded) |
| Discharge queue item | Patient record + discharge section |
| Clinical queue item (missed check-ins, etc.) | Patient record |
| Patient list → click patient | Patient record |
| Referral with duplicate flag | Duplicate comparison view |

**Care plan status lifecycle:**
```
draft → clinical_review → coordinator_review → active
active → (trigger: new data) → draft (new version) → clinical_review → coordinator_review → active
active → (emergency) → coordinator_review (v1.0e) → active
```

### Business Rules

- Coordinator cannot approve a care plan with unapproved clinical sections (hard gate)
- Coordinator can edit visit_schedule, monitoring, meal_delivery sections but not goals, nutrition, behavioral_health
- Care plan approval triggers: status → active, meal matching, scheduling, monitoring, patient notification
- Referral record is read-only for the coordinator — editing happens via the thread (request missing data, pursue alternative path)
- Patient list defaults to coordinator's own panel unless Admin role (sees all)
- "Quiet risk" threshold: 7+ days with no activity from patient, agent, or clinician
- Risk tier is agent-computed, not coordinator-editable. Coordinator can flag for review.

---

## Phase 3: Information Architecture

### Screen Inventory

The CC-SHELL, CC-QUEUE, CC-SUMMARY, and CC-THREAD screens are already built. This sprint adds the center panel content types and the patient list.

| Screen ID | Name | Purpose | Primary Actions |
|---|---|---|---|
| CC-RECORD-REF | Referral Record | View parsed referral data, eligibility, documents | Read, view attachments |
| CC-RECORD-CP | Care Plan Viewer | Review care plan sections with approval status | Read, inline edit coordinator-owned sections |
| CC-RECORD-CP-DIFF | Care Plan Diff | Review changes between care plan versions | Read, toggle "show changes only" |
| CC-RECORD-PAT | Patient Record | View patient demographics, status, care team, activity | Read, edit demographics |
| CC-RECORD-DUP | Duplicate Comparison | Side-by-side referral vs existing patient | Compare, decide |
| CC-PATIENTS | Patient List | Browse, search, filter patient caseload | Sort, filter, search, click to open |

### Navigation Placement

All screens render in the **center panel** of the existing CC-SHELL. No new navigation — the center panel content is determined by:
- Which queue item is selected (→ CC-RECORD-*)
- Which sidebar nav item is active (→ CC-PATIENTS or CC-SUMMARY)
- Which patient is clicked in the patient list (→ CC-RECORD-PAT)

### Screen-to-Screen Flows

```
CC-SUMMARY (default)
  ↓ click referral queue item
CC-RECORD-REF + CC-THREAD
  ↓ (if duplicate flagged)
CC-RECORD-DUP + CC-THREAD

CC-SUMMARY (default)
  ↓ click care plan queue item
CC-RECORD-CP + CC-THREAD
  ↓ (if plan update, not new)
CC-RECORD-CP-DIFF + CC-THREAD

CC-SUMMARY (default)
  ↓ click "Patients" in sidebar nav
CC-PATIENTS (thread empty)
  ↓ click patient row
CC-RECORD-PAT + CC-THREAD
  ↓ click "View care plan" link in record
CC-RECORD-CP + CC-THREAD

CC-RECORD-PAT
  ↓ click clinical queue item (missed check-ins, etc.)
CC-RECORD-PAT + CC-THREAD (scrolled to relevant event)
```

### Content Priority per Screen

**CC-RECORD-REF (Referral Record):**
1. Status bar — eligibility result, completeness status
2. Patient demographics (name, DOB, sex, address, phone)
3. Referring provider and source
4. Diagnosis codes (plain language + ICD)
5. Insurance and coverage status
6. Attached documents with view/not-viewed indicator
7. Agent processing summary (also visible in thread)

**CC-RECORD-CP (Care Plan Viewer):**
1. Section status bar — per-section approval status (the coordinator's checklist)
2. Goals section (RDN-approved, read-only)
3. Nutrition plan (RDN-approved, read-only)
4. Behavioral health (BHN-approved or auto-populated, read-only)
5. Visit schedule (coordinator-owned, editable)
6. Monitoring schedule (coordinator-owned, editable)
7. Meal delivery parameters (coordinator-owned, editable)
8. Medications (imported, read-only)
9. Risk flags (auto-populated, read-only)

**CC-RECORD-CP-DIFF (Care Plan Diff):**
1. Change summary header ("3 fields updated in 2 sections")
2. Changed sections expanded with inline diff (additions green, deletions struck through)
3. Unchanged sections collapsed (expandable)
4. Version label: "v1.0 → v1.1"

**CC-RECORD-PAT (Patient Record):**
1. Header: name, status badge, risk tier + trend arrow, age
2. Demographics
3. Insurance
4. Care plan summary (link to full viewer)
5. Care team
6. Activity summary (recent events, upcoming, pending)

**CC-RECORD-DUP (Duplicate Comparison):**
1. Match confidence score + match reason
2. Side-by-side: new referral (left) vs existing record (right)
3. Matching fields muted, divergent fields highlighted
4. Decision via approval card in thread

**CC-PATIENTS (Patient List):**
1. Search bar
2. Filter controls: status, risk tier
3. Patient table: name, status badge, risk tier + trend, last activity, last activity type
4. Staleness indicator on 7+ day inactive patients (clock icon + "X days")
5. Sort by any column (default: last activity, oldest first for quiet risk scan)

### Potential Component Gaps

| Component | Purpose | Closest Existing |
|---|---|---|
| Record header | Patient identity bar (name, status, risk, age) at top of center panel | `card-header` (partial — needs status + risk inline) |
| Section status bar | Per-section approval checklist at top of care plan viewer | None — new component |
| Record section | Collapsible section with header, approval status, and content | Preline `hs-accordion` + custom header |
| Inline diff | Addition/deletion highlighting within text content | None — CSS-only (`.diff-added`, `.diff-removed`) |
| Change summary | "3 fields updated in 2 sections" header for diff view | None — simple, composable from existing typography |
| Duplicate comparison | Side-by-side two-column layout with field alignment | `grid grid-cols-2` layout — no new component, just composition |
| Patient list table | Sortable, filterable table with risk badges and staleness indicators | `table` (exists) + `badge` variants + new staleness indicator |
| Staleness indicator | Clock icon + "X days" for quiet patients | `badge` variant or inline label — minor addition |
| Document viewer link | Attachment indicator with viewed/not-viewed status | Reuse `thread-approval-attachment` pattern |
| Editable section indicator | Visual cue that a section is coordinator-editable | Icon or label added to section header |

Most screens are composed from existing Haven components (cards, tables, badges, section titles, list groups). New components are limited to the section status bar and inline diff styles.

---

## Gate 1 Summary

**Scope:** Center panel content for the care coordinator Admin App — the views that load when the coordinator clicks a queue item or navigates to the patient list. Completes the three-panel shell built in the queue triage sprint.

**What we're building:**
- **Referral record view** — structured referral data with status bar, eligibility result, attached documents
- **Care plan viewer** — section-by-section with approval status, read-only clinical sections, editable coordinator sections
- **Care plan diff view** — inline highlighted changes for plan updates
- **Patient record view** — demographics, status, care team, activity summary
- **Duplicate comparison view** — side-by-side with match confidence and field highlighting
- **Patient list** — sortable/filterable table with risk badges and quiet-patient detection

**6 use cases defined:** View referral, review care plan, browse patient list, quiet risk scan, duplicate comparison, view patient record.

**~10 potential new components identified.** Most are compositions of existing Haven primitives. The section status bar and inline diff styles are the only meaningfully new patterns.

**Key design decisions proposed:**
- Scrollable single page with section anchors (not tabs) for record viewer — NNG research supports this for cross-referencing
- Inline diff (not side-by-side) for care plan updates — GOV.UK testing shows better performance with non-technical reviewers
- Clinical sections read-only, coordinator sections editable — enforces sign-off boundaries per role definition
- Staleness indicator (clock + days) for quiet patients — surfacing, not hiding, inactivity
- Status bar at top of care plan is the coordinator's checklist — instant "what still needs me" answer

**Reuse from queue triage sprint:**
- Thread panel (right) — identical behavior, same components
- Queue sidebar (left) — unchanged
- Shell layout — unchanged
- Approval card — same hero component, different context content per item type

Ready for your go/no-go on Gate 1 before proceeding to wireframes.
