---
slot: 10
slot-name: state-and-transition-spec (Patients)
primary-author: Interaction Designer
project: cena-platform
surface: patients
created: 2026-05-26
status: in-review
consumes:
  - slots/patients/ia.md
  - slots/_app/content-model.md
  - slots/_app/surface-shell-model.md
folds-in: [flows (9), wireframes (11), a11y (13), strings (14), component-plan (17)]
---

# Patients — State & Transition Spec

State machine per zone + the PL primitives each composes (copy, don't generate). Register: dense professional coordinator. This surface authors the **shared primitives** later surfaces reuse (flagged ★ — feed Phase-2 dependency analysis).

## Roster

| State | Trigger | Content | Built page |
|---|---|---|---|
| **roster** (default) | ≥1 patient | dense `data-table` (`data-table-compact`) of patients | `patients.roster.html` |
| **roster-empty** | no patients OR no filter matches | `data-empty-state` (distinguish "no patients yet" → Add patient CTA, vs "no matches" → clear filters) | `patients.roster-empty.html` |
| **roster-selected** | ≥1 row checked | bulk-action-bar appears (sticky-footer), table rows show checked state | fold into roster (documented variant) |

**Roster composition:**
- `page-header` + `page-title` "Patients" + actions right: `btn-primary` "Add patient", `btn-outline` "Bulk upload".
- ★ **Toolbar** — `toolbar` + `toolbar-search` (`search-input`) + `nav-filter-pills` (status: Active / Archived / All) + optional `nav-stratification-bar` (by partner/program). Shared pattern.
- ★ **Dense table** — `data-table data-table-compact` with `row-clickable`; columns carry **clinical signal**: name (`cell-primary`), status badge, diagnosis tags (`badge-pill badge-sm`), clinical-flag/alert indicator (`severity-badge` or `indicator`), referral source, app-access state (`indicator` connected/disconnected), last-activity. Row checkbox (`form-checkbox`) leads each row.
- ★ **Bulk-action-bar** (the ds-binding promote-candidate) — `layout-sticky-footer`: `sticky-footer-info` "N selected" + `sticky-footer-actions` (Activate / Archive / Export). Appears only when ≥1 row checked. **First authored here; promote to PL composition once Diet Ops / Network confirm the same shape (3-use rule).**
- `data-pagination` below the table.

## Patient record

| State | Trigger | Content | Built page |
|---|---|---|---|
| **record** (default) | open a patient | read-first record, overview tab active | `patients.record.html` |
| **app-access: connected** | patient has working app link | app-access section shows connected + Disconnect | (within record / app-access tab) |
| **app-access: disconnected** | no link | "Not connected" + Connect/Invite | variant |
| **app-access: needs-fix** | link errored | warning + "Fix access" | `patients.record-app-access.html` (carries the variants) |

**Record composition:**
- ★ **`layout-record-header`** — identity bar: name + key identifiers (subtitle), status badge + meta right (reused by Referral / care records). 
- `nav-breadcrumb` (Patients › {name}).
- ★ **`nav-tabs`** — overview / contact / referral / identifiers / dietary / notes / app-access. (Tab vocabulary shared with other entity records.)
- **Overview tab:** `PatientSummary` (at-a-glance flags + stats) + `clinical-alert-summary-row`s (active alerts, wrapped in `.card`) + `clinical-timeline` (recent activity) + `kv-table` for key fields. **Read-first** — values display; edit is a deliberate affordance (`editable-indicator` / per-section edit), not always-on input chrome.
- **Dietary tab:** `clinical-nutrition-list` (always-editable inputs per its contract) + diagnosis-code tags + dietary-guideline links (Clinical Library cross-link).
- **App-access section:** state-driven — connected (`indicator-online` + Disconnect `btn-danger-outline`), disconnected (`indicator-offline` + Connect `btn-secondary`), needs-fix (`alert` warning + "Fix access" `btn-primary`). Each mutating action → `overlay-confirm-dialog`.

## Intake

| State | Trigger | Content | Built page |
|---|---|---|---|
| **intake-single** | Add patient | single form | `patients.intake-single.html` |
| **intake-bulk: upload** | Bulk upload | file dropzone | `patients.intake-bulk.html` (step 1) |
| **intake-bulk: preview** | file parsed | validation table (valid / error rows) | bulk step 2 (fold or separate) |
| **intake-bulk: result** | committed | receipt (N added, M skipped) | bulk step 3 (fold) |

**Intake composition:**
- Single: ★ **`form-layout`** (or sectioned `layout-field-row` set) — identity, contact, referral source, diagnosis codes (`forms-combobox`/`forms-tags-input`), dietary profile; `forms-validation` states; `layout-sticky-footer` Save (`btn-primary`) / Cancel (`btn-outline`). When reached from a converting referral, fields pre-fill (referral source locked).
- Bulk: ★ **`forms-file-upload`** dropzone (CSV) → preview `data-table` flagging valid vs error rows (`forms-validation` row states, `field-row-error`) → commit → `receipt` (composes agentic `receipt`). Stepped via `nav-stepper`.

## Transitions

- `roster → record` (row click) → back via breadcrumb.
- `roster → roster-selected` (check rows) → `→ confirm-dialog → roster` (bulk action applied) or `→ roster` (deselect).
- `roster → intake-single | intake-bulk` (CTAs) → `→ record` (single committed, lands on new record) or `→ roster` (bulk committed).
- `record app-access action → confirm-dialog → record` (state updated).
- Referral-convert entry: `Referral → intake-single (pre-filled) → record`.

## Invariants (carry to acceptance + a11y)

- **Record is read-first** — clinical signal (alerts, flags, dietary) renders before edit chrome; no wall of always-on inputs (except `clinical-nutrition-list` which is always-editable by contract).
- **Bulk actions gated** — every status change (archive/delete) routes through `overlay-confirm-dialog`; delete is `btn-danger`.
- **Furniture stable** — shell + page-header + toolbar persist across roster states; only table body / empty-state swaps.
- **Operational urgency color allowed** — clinical-flag `severity-badge`, app-access needs-fix warning use the real semantic register (not suppressed).
- **A11y:** table has `<th scope>` headers; row checkboxes have labels; `row-clickable` rows are keyboard-activable with a real focus target (the name link), not a div onclick; bulk-action-bar announces selection count via live region; tabs are a real `tablist` (Preline `hs-tab`); confirm-dialogs trap focus.
- **Strings:** "Add patient", "Bulk upload", "N selected", "Archive", "Active / Archived", "Not connected", "Fix access", "Referred by {partner}". Operational, direct.
- **No real patient data** — synthetic names/identifiers; dietary/diagnosis values representative.

## Shared-primitive flags (feed Phase-2 dependency analysis)

★ marks reused across surfaces — **serialize their authoring before parallelizing surfaces:**
- **Toolbar pattern** (search + filter-pills + stratification) — Patients, Referrals, Diet Ops, Network, Clinical Library.
- **Dense table** (`data-table-compact` + clinical-signal columns + `row-clickable` + checkbox) — every list surface.
- **Bulk-action-bar** (sticky-footer composition) — Patients, Diet Ops, Network → PL-promote candidate.
- **`layout-record-header` + `nav-tabs` record pattern** — Patients, Referrals, Network (org/partner records), Diet Ops (provider/week records).
- **Stepped form** (`form-layout`/`nav-stepper` + file-upload + validation + receipt) — Patients bulk intake, Diet Ops AI-import + distribution wizard.
