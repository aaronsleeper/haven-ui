---
slot: 7
slot-name: information-architecture (per-surface — Patients)
primary-author: IA Designer
project: cena-platform
surface: patients
created: 2026-05-26
status: in-review
consumes:
  - slots/_app/trigger-map.md
  - slots/_app/surface-shell-model.md
  - slots/_app/content-model.md
---

# Patients — Information Architecture (per-surface)

Per-surface IA for **Patients** — the highest-frequency pulled surface (J2 is the most-frequent pulled job). Absorbs J2 (find/open/review), J3 (intake single + bulk), J4 (status change), J5 (companion-app access). Establishes the **shared dense-table, record-tabs, intake-stepper, and bulk-action-bar** patterns reused across Referrals / Diet Operations / Network.

## Sub-surfaces (one connected surface, three zones)

| Zone | Job | What it is |
|---|---|---|
| **Roster** | J2 (find), J4 (bulk status) | dense patient table with clinical-signal columns, search/filter toolbar, row-click → record, multi-select → bulk-action-bar |
| **Patient record** | J2 (review), J5 (app access) | read-first record with tabs (overview / contact / referral / identifiers / dietary / notes / app-access) + task affordances |
| **Intake** | J3 | single-patient form + bulk CSV upload (stepped: upload → validate/preview → commit) |

## Where/how reached

- **Reached as:** the **Patients nav anchor** (2nd of 7) + the global **topbar patient search** (always reachable — J2 highest frequency).
- **Pushed-into:** when a Referral converts (J6→J3), intake is reached from the referral flow with fields pre-filled; and Today's patient-alert cards deep-link straight to a **record** (not the roster).
- **Drill-down:** roster row → record; record's referral tab → the source Referral (Network/Referrals cross-link).

## Entities (see content-model)

Patient (identifiers, contact, referral source, status, dietary profile, diagnosis codes, clinical flags/alerts, companion-app-access state); Companion App Access (connected / disconnected / needs-fix); Clinical Alert (surfaced on record + Today).

## Nav graph (out-edges)

| From element | Routes to | Trigger |
|---|---|---|
| Roster row | Patient record (overview tab) | pulled |
| Roster bulk-select → action | in-place status change (archive/activate) + confirm dialog | pulled |
| Roster "Add patient" | Intake (single) | pulled |
| Roster "Bulk upload" | Intake (bulk) | pulled |
| Record tab: referral | the source Referral | drill-down |
| Record app-access "Fix"/"Disconnect" | confirm dialog → access state change | pulled |
| Record clinical alert | (already here — the alert's patient is this record) | from Today deep-link |
| Topbar search result | matched Patient record | pulled |

## URL / page contract (static-bundle targets, under `handoff/cena-platform/patients/`)

- `patients.roster.html` — populated dense roster (default)
- `patients.roster-empty.html` — no patients / no filter matches (empty-state)
- `patients.roster-selected.html` — bulk-select active (sticky bulk-action-bar) *(may fold into roster as a documented variant at build)*
- `patients.record.html` — read-first record, overview tab (app-access shown connected)
- `patients.record-app-access.html` — app-access tab variants (connected / disconnected / needs-fix) *(may fold tab states into one page at build)*
- `patients.intake-single.html` — single-patient intake form
- `patients.intake-bulk.html` — bulk CSV upload + preview/validation + commit (stepped)

Exact built page count is finalized at build (some tab/selection variants may fold). The contract here is the state set, not URL strings.

## Cognitive-walkthrough pre-commit (feeds acceptance.md)

A coordinator needing a patient should: (orientation) recognize the roster as the patient list with clinical signals visible at a glance; (path) find + open a specific patient in ≤2 actions (search or scan→click); (affordance) intake (single + bulk), bulk status change, and app-access fix each read as obvious; (record) land on a read-first record that surfaces clinical signal before edit chrome.
