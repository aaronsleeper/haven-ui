---
slot: 19
slot-name: acceptance-criteria (Clinical Library)
primary-author: QA Lead
project: cena-platform
surface: clinical-library
created: 2026-05-26
status: in-review
consumes:
  - slots/clinical-library/states.md
  - slots/clinical-library/ia.md
  - slots/_app/content-model.md
folds-in: [test-plan (20)]
---

# Clinical Library — Acceptance Criteria

Per-screen observable rows (binary pass/fail) + flow-level use-case acceptance + pre-build cognitive walkthrough. The contract build executes against.

## Per-screen acceptance

### Zone A: Dietary Guidelines

| # | Criterion | State | Pass condition |
|---|---|---|---|
| CL1 | Sub-nav present + correct zone active | guidelines, codes | `nav-segmented-control` with two items (Dietary Guidelines \| Diagnosis Codes); active item has `.active`; `aria-selected="true"` on active tab role |
| CL2 | Guidelines table is dense with correct columns | guidelines | `data-table data-table-compact` with `row-clickable`; columns: guideline name, diagnosis linkage badges, status badge, last-updated monospace date, row actions |
| CL3 | Toolbar: search + filter pills present | guidelines | `toolbar-search` + `nav-filter-pills` (Current / Archived / All); filter changes rendered list |
| CL4 | "Add guideline" CTA present in page header | guidelines | `btn-primary` "Add guideline" in `page-header` actions-right |
| CL5 | Empty state distinguishes no-guidelines from no-filter-match | guidelines-empty | no guidelines → Add-guideline CTA + explanatory copy; no-match → clear-filters affordance |
| CL6 | Guideline detail: record-header + kv-table + actions | guidelines-detail | `record-header` (name + status badge) + `nav-breadcrumb` (Clinical Library › Dietary Guidelines › {name}) + `kv-table` (full guideline text, diagnosis linkage, status, dates) + Edit / Archive actions |
| CL7 | Archive is confirm-gated with correct dialog copy | guidelines-detail | Archive → `overlay-confirm-dialog` (warning variant); dialog body explains historical retention; Cancel is the safe default |
| CL8 | Add-guideline form: required fields + validation + sticky save | guidelines-add | `field-row` set (name, guideline text, diagnosis linkage tags-input, status radio); `forms-validation` on required fields; `sticky-footer` Save / Cancel |
| CL9 | Save lands on new guideline's detail view + toast | guidelines-add → detail | saved → `guidelines-detail` for the new record; `toast-success` "Guideline saved." fires |

### Zone B: Diagnosis Codes

| # | Criterion | State | Pass condition |
|---|---|---|---|
| CL10 | Codes table is dense; ICD-10 code column is monospace | codes | `data-table data-table-compact` with `row-clickable`; code column uses `cell-mono cell-primary`; description column normal type |
| CL11 | Toolbar: search with clinical placeholder + filter pills | codes | `toolbar-search` placeholder "Search by code or description"; `nav-filter-pills` (Active / Deprecated / All) |
| CL12 | "Add code" CTA in page header | codes | `btn-primary` "Add code" in `page-header` actions-right |
| CL13 | Empty state for codes | codes-empty | `data-empty-state` + Add-code CTA + copy explaining tagging/conformance purpose |
| CL14 | Code detail: record-header with monospace code + kv-table | codes-detail | `record-header-title` (ICD-10 code in monospace) + `record-header-subtitle` (description) + status badge; `kv-table` (code, full description, status, dates); `nav-breadcrumb` |
| CL15 | Deprecate is confirm-gated; dialog explains historical retention | codes-detail | Deprecate → `overlay-confirm-dialog`; dialog explicitly states "Existing patient records that use this code will retain it historically"; destructive action is NOT the default focus target |
| CL16 | No delete affordance on either entity | codes-detail, guidelines-detail | No "Delete" button anywhere on Clinical Library; only Archive (guidelines) and Deprecate (codes) + their Restore counterparts |
| CL17 | Add-code form: code field is monospace + has field-help | codes-add | ICD-10 code input uses monospace styling; `field-help` "e.g. E11.9" present; required fields validated on submit |
| CL18 | Save lands on new code's detail view + toast | codes-add → detail | saved → `codes-detail` for new record; `toast-success` "Diagnosis code saved." fires |

### Cross-cutting (all states)

| # | Criterion | State | Pass condition |
|---|---|---|---|
| CL19 | Clinical Library has no sidebar badge / urgency indicator | all | Sidebar nav-item "Clinical Library" has no badge, no urgency color — this is a low-frequency reference surface, not a triage surface |
| CL20 | Shell furniture stable across zones and states | all | Sidebar (7 anchors, Clinical Library active) + topbar (search + user/role) never appear/disappear; only content region changes |
| CL21 | Breadcrumb present on all detail and add states | detail, add | `nav-breadcrumb` with correct Clinical Library › {zone} › {item or "Add"} trail |
| CL22 | A11y: table rows keyboard-activable via link, not bare div | guidelines, codes | `row-clickable` rows navigate to detail via the name/code link (keyboard-activable); `<th scope="col">` headers present |
| CL23 | A11y: confirm dialogs trap focus | detail (archive/deprecate) | focus trapped inside `overlay-confirm-dialog`; Cancel is the first or most-prominent button; destructive action not default-focused |
| CL24 | Professional clinical voice; no plain-language softening | all | "Diagnosis Code", "ICD-10", "Deprecated", "Archived", "Diagnosis linkage", "Dietary conformance" — direct operational terms; no simplification |
| CL25 | Renders self-contained under `file://`; render-gate clean | all | `../assets/haven.css` + relative paths; zero undefined PL classes; no dev server required |
| CL26 | No real clinical or patient data | all | Representative/synthetic data only (e.g. "E11.9 — Type 2 diabetes mellitus, unspecified"); no Cena patient records |

## Flow-level use-case acceptance

**Jobs:** J15 maintain dietary guidelines · J16 maintain diagnosis-code set.

| Sub-check | Pre-committed expected answer |
|---|---|
| **Orientation** | Coordinator lands on Clinical Library and sees two zones labeled Dietary Guidelines and Diagnosis Codes; the active zone's reference table is visible immediately. |
| **Affordance** | Add-guideline / Add-code CTAs are visible at a glance in the page header; row actions (Edit, Archive/Deprecate) are present per row but not visually dominant (lean reference surface, not action surface). |
| **Path** | Add a new code: click Clinical Library → switch to Diagnosis Codes → "Add code" → fill form → Save → land on detail. Total: ≤4 actions from nav anchor. Edit an existing guideline: click row → detail view → Edit → form in-place or page → Save. |
| **Feedback** | Save actions land on the saved record's detail view + `toast-success`; Archive/Deprecate update the status badge in place and are confirm-gated (no silent destructive action). |
| **Legibility** | ICD-10 codes read distinctly from descriptions (monospace vs. normal type); status badges (Active/Deprecated, Current/Archived) carry clear meaning without relying on color alone. |
| **Cross-surface dependability** | Diagnosis-code data entered here is the set that tags patients and appears in Patients dietary tab; dietary-guideline data entered here is what Diet Operations references for meal conformance. Both cross-links function when the target surfaces are built. |

## Pre-build cognitive walkthrough (slot-19 sub-step) — result

Fresh-context walk of the spec against the jobs (spec-checkable subset):

- **Path:** PASS — both jobs (add / edit a reference entry) are ≤4 actions from the nav anchor; zone switching is one click; detail → back is one breadcrumb click. No hidden states.
- **Feedback-existence:** PASS — Save → detail + toast; Archive/Deprecate → confirm dialog → updated status badge. No silent mutations. All destructive actions are confirm-gated (states.md transitions + invariants).
- **Legibility:** PASS — monospace code column + separate description column is the load-bearing readability decision for ICD-10 codes; clinical vocabulary used directly; status badges plain-language-free.
- **Orientation-ingredients:** PASS — page-title "Clinical Library" + sub-nav zone label + breadcrumb on detail/add provide full orientation at every state.
- **Product-rule gate audit:**
  - No delete affordance (invariant enforced in states.md) — Archive/Deprecate-not-delete prevents record corruption. ✅
  - Archive/Deprecate are confirm-gated with explanatory copy. ✅
  - No urgency color on a non-triage surface. ✅
  - No bulk-action-bar (this surface has no multi-select pattern — correct by design; if a bulk-deprecate need arises later, it is an additive scope item, not an omission). ✅
  - Cross-surface cross-links (codes → Patients, guidelines → Diet Operations) deferred to build — depends on those surfaces' pages existing. Flagged explicitly; not a blocking gap for this surface's spec. ✅
- **PL gap gate:** No blocking gaps. All components sourced from confirmed COMPONENT-INDEX entries. `toast-success` initialization in static-bundle context flagged as a build-verify item (non-blocking).

**Render-only checks (code-vs-description readability, sub-nav-zone-switching clarity, confirm-dialog-default-focus):** deferred to slot 30 (human cold render-and-look) — non-waivable.

## Cross-surface dependency register

| Dependency | Direction | Status | Note |
|---|---|---|---|
| Diagnosis Codes → Patients (dietary tab) | Clinical Library is the origin; Patients links to CL code detail | Deferred to build | Patients dietary tab `badge-pill` diagnosis tags need `href` to `clinical-library.codes-detail.html?code={id}` once both are built |
| Dietary Guidelines → Diet Operations (meal conformance) | Clinical Library is the origin; Diet Ops links to CL guideline detail | Deferred to build | Diet Operations meal conformance context needs `href` to `clinical-library.guidelines-detail.html?id={id}` |
| Patients → Clinical Library (filter by code) | Patients roster filtered to a code; triggered from CL code detail "Used by N patients" | Deferred to build | Requires Patients roster to support `?code={id}` filter param in the static bundle; implement when both surfaces are built |
