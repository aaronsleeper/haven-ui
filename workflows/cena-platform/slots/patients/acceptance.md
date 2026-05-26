---
slot: 19
slot-name: acceptance-criteria (Patients)
primary-author: QA Lead
project: cena-platform
surface: patients
created: 2026-05-26
status: in-review
consumes:
  - slots/patients/states.md
  - slots/patients/ia.md
  - slots/_app/content-model.md
folds-in: [test-plan (20)]
---

# Patients — Acceptance Criteria

Per-screen observable rows (binary pass/fail) + flow-level use-case acceptance + pre-build cognitive walkthrough.

## Per-screen acceptance

| # | Criterion | State | Pass condition |
|---|---|---|---|
| P1 | Roster is a dense table with clinical-signal columns | roster | `data-table-compact`; name + status + diagnosis tags + clinical-flag indicator + referral source + app-access visible per row |
| P2 | Search + filter present and labeled | roster | `toolbar-search` + status `filter-pill`s; filtering empties to "no matches" (not "no patients") |
| P3 | Row click opens the record (keyboard-activable) | roster | `row-clickable` → record; focusable name link, not a bare div onclick |
| P4 | Bulk-select reveals a sticky bulk-action-bar with count | roster-selected | checking ≥1 row shows `sticky-footer` "N selected" + Activate/Archive/Export |
| P5 | Bulk status change is confirm-gated | roster-selected | Archive/Delete → `overlay-confirm-dialog`; delete uses `btn-danger` |
| P6 | Empty state distinguishes no-patients vs no-matches | roster-empty | no-patients → Add-patient CTA; no-matches → clear-filters |
| P7 | Record is read-first | record | clinical signal (alerts/flags/dietary) renders above edit chrome; no wall of always-on inputs |
| P8 | Record header + tabs present | record | `layout-record-header` identity bar + `nav-tabs` (overview/contact/referral/identifiers/dietary/notes/app-access) |
| P9 | App-access shows the correct state + action | record-app-access | connected→Disconnect, disconnected→Connect, needs-fix→warning+Fix; each action confirm-gated |
| P10 | Intake single: sectioned validated form with sticky Save/Cancel | intake-single | field-rows + validation states + `sticky-footer`; referral-convert entry pre-fills + locks referral source |
| P11 | Intake bulk: upload → preview(valid/error) → commit→receipt | intake-bulk | `file-upload` → validation table → `receipt` (N added / M skipped); stepped |
| P12 | Breadcrumb orients every drill-down | record, intake | Patients › {name} / Patients › Add |
| P13 | Renders self-contained under `file://`, render-gate clean | all | `../assets/haven.css` + relative paths; zero undefined classes |
| P14 | No real patient data | all | synthetic identifiers; representative dietary/diagnosis |

## Flow-level use-case acceptance

**Jobs:** J2 find/open/review · J3 intake (single+bulk) · J4 bulk status · J5 app-access.

| Sub-check | Pre-committed expected answer |
|---|---|
| **Orientation** | Roster reads as the patient list with clinical signals at a glance; record reads as this patient's read-first chart. |
| **Affordance** | Add patient, Bulk upload, bulk status, Fix access each read as the obvious control; search is the fastest path to one patient. |
| **Path** | Find+open ≤2 actions; intake single = one form; bulk = upload→preview→commit; status change = select→action→confirm. |
| **Feedback** | Committed intake lands on the new record; bulk status updates the rows + clears selection; app-access action reflects new state. |
| **Legibility** | Dense but scannable; operational labels; clinical urgency color carries triage meaning. |

## Pre-build cognitive walkthrough (slot-19 sub-step) — result

- **Path:** PASS — search + scan→click both reach a record; intake + bulk + status each have a single clear route; referral-convert entry pre-fills.
- **Feedback-existence:** PASS — confirm dialogs, receipt, row updates, selection clear all specified (states.md transitions).
- **Legibility:** PASS — dense-professional copy + clinical-signal columns (ds-binding voice + content-model).
- **Orientation-ingredients:** PASS — page-title + record-header + breadcrumb + tabs orient every zone.
- **Product-rule gate audit:** mutating paths (status change, delete, app-access change, intake commit) are all confirm-gated or validated; no unguarded irreversible action. Delete is `btn-danger` + dialog. No real data crosses into any screen.

**Render-only checks (density-still-scannable, read-first-actually-reads-first, bulk-bar-discoverability):** deferred to slot 30 (human cold render-and-look) — non-waivable.
