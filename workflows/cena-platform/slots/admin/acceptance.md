---
slot: 19
slot-name: acceptance-criteria (Admin)
primary-author: QA Lead
project: cena-platform
surface: admin
created: 2026-05-26
status: in-review
consumes:
  - slots/admin/states.md
  - slots/admin/ia.md
  - slots/_app/content-model.md
folds-in: [test-plan (20)]
---

# Admin — Acceptance Criteria

The contract build executes against. Per-screen observable rows (binary pass/fail) + flow-level use-case acceptance. Pre-build cognitive walkthrough result at the bottom.

## Per-screen acceptance

### Staff & Roles

| # | Criterion | State | Pass condition |
|---|---|---|---|
| A1 | Staff list is a dense table with role and status visible per row | staff-list | `data-table-compact`; name + email + role badge + status badge + last-active + edit action visible per row |
| A2 | Search present and labeled | staff-list | `toolbar-search` present; filtering yields no-match state, not zero-staff state |
| A3 | Row click opens staff edit form | staff-list | `row-clickable` → staff-edit; keyboard-activable |
| A4 | "Add employee" opens the add form | staff-list | `btn-primary` "Add employee" in page-header actions → staff-edit (blank) |
| A5 | Empty state shows Add CTA, not a sad nothing | staff-empty | `empty-state` plain professional copy + `btn-primary` "Add employee" |
| A6 | Staff edit form has identity, role, status sections with validation | staff-edit | `layout-field-row` sections; `forms-validation` on required fields; role field is `select` or `combobox` |
| A7 | Deactivate and delete are confirm-gated | staff-edit | deactivate → `overlay-confirm-dialog` (warning); delete → `overlay-confirm-dialog` (danger) + `btn-danger` |
| A8 | Save/Cancel in sticky footer | staff-edit, role-permissions | `layout-sticky-footer` with `btn-primary` Save + `btn-outline` Cancel |
| A9 | Role permissions page shows identity bar + permission matrix | role-permissions | `record-header` with role name + `data-table` permission grid; inputs grouped by domain in `fieldset`/`legend` |

### Settings

| # | Criterion | State | Pass condition |
|---|---|---|---|
| A10 | Settings renders as a sectioned config form, no stepper | settings | `section-title` headings per domain; all sections visible without tab navigation; `layout-field-row` inputs |
| A11 | Field help text present for non-obvious settings | settings | `field-help` visible on at least one setting per section |
| A12 | Save is in sticky footer; Reset-to-defaults is confirm-gated | settings | `layout-sticky-footer` Save + Reset; Reset → `overlay-confirm-dialog` |
| A13 | Save shows feedback | settings | `toast` (success) on save; inline `alert-success` as fallback |
| A14 | Professional config vocabulary, no plain-language softening | settings | Label strings are config-register ("Referral expiration window (days)", not "How long referrals stay active") |

### EHR Integrations

| # | Criterion | State | Pass condition |
|---|---|---|---|
| A15 | EHR list shows connection state per integration at a glance | ehr-list | each `list-group-item` carries a state badge: `badge-success` "Connected" / `badge-error` "Connection error" / `badge-neutral` "Not configured" |
| A16 | Error state uses error register and is not suppressed | ehr-list, ehr-configure | `badge-error` + `alert-error` banner on ehr-list when ≥1 error; error register is operational signal, not decoration |
| A17 | Error banner on ehr-list names the impact | ehr-list | "1 EHR integration has a connection error — patient data may not be current" (or equivalent); links to errored integration |
| A18 | "Reconnect" is the primary CTA for errored integrations | ehr-list | errored item carries `btn-primary btn-sm` "Reconnect"; connected carries `btn-ghost btn-xs` "Configure" |
| A19 | Empty state shows Add CTA | ehr-empty | `empty-state` + `btn-primary` "Add integration" |
| A20 | Configure form has credential fields + test-connection affordance | ehr-configure | masked `input[type="password"]` fields with show/hide toggle; `btn-outline` "Test connection" |
| A21 | Test connection gives inline non-navigating feedback | ehr-configure | Test → `alert-success` "Connection successful" or `alert-error` "Connection failed: {reason}" inline; form stays; no navigation |
| A22 | Deactivate integration is confirm-gated | ehr-configure | `btn-danger-outline` "Deactivate" → `overlay-confirm-dialog` (danger) |
| A23 | Record header shows system name + current state on configure page | ehr-configure | `record-header` identity bar with system name + connection state badge + last-sync meta |

### Cross-cutting

| # | Criterion | State | Pass condition |
|---|---|---|---|
| A24 | Sub-nav present and stable across all Admin states | all | `nav-tabs` (Staff & Roles / Settings / EHR Integrations) persists; active tab marked |
| A25 | Shell furniture stable across all Admin states | all | sidebar (7 anchors, Admin active) + topbar (search + badge + user) never appear/disappear |
| A26 | No patient-level data on Admin | all | Employee/Role/Setting/EHR Integration entities only; no patient names, diagnosis codes, clinical flags |
| A27 | Admin/ops separation enforced | all | No queue cards, no pushed items, no clinical-signal columns; config vocabulary throughout |
| A28 | A11y: nav-tabs is a real tablist; form labels associated; dialogs trap focus | all | `nav-tabs` Preline `hs-tab` tablist; `<label for>` on all inputs; `overlay-confirm-dialog` traps focus; credential show/hide has `aria-pressed`; permission matrix uses `<fieldset>`/`<legend>` |
| A29 | Renders self-contained under `file://` | all | `../assets/haven.css` + relative paths; no dev server; render-gate clean (zero undefined classes) |
| A30 | No real staff/business data | all | synthetic names, emails, role names; representative settings values |

---

## Flow-level use-case acceptance

**Jobs:** J17 manage staff + roles · J18 configure settings · J19 configure EHR integrations.

| Sub-check | Pre-committed expected answer |
|---|---|
| **Orientation (J17)** | Staff list reads as the employee roster with role and status at a glance; role-permissions page reads as this role's configuration (identity bar + domain-grouped matrix). |
| **Orientation (J18)** | Settings reads as a single-scroll config form with section headings making each domain scannable without guessing where a setting lives. |
| **Orientation (J19)** | EHR list reads as the integration status board: connected/error/unconfigured visible without drilling in; error state is immediately actionable. |
| **Affordance (J17)** | Add employee, edit employee, assign role, configure permissions each read as the obvious control; deactivate/delete are present but visually secondary to avoid accidental trigger. |
| **Affordance (J18)** | Each setting has a clear input type and help text where needed; Save is always visible (sticky footer). |
| **Affordance (J19)** | Reconnect is the primary CTA for errored integrations (not buried); Test connection gives instant non-navigating feedback. |
| **Path (J17)** | Add employee = one form + save; edit = row click + form + save; role permissions = role row → permissions page + save. |
| **Path (J18)** | Settings = one scroll + save; reset = confirm dialog + save. |
| **Path (J19)** | Configure = integration item → configure page + test + save; reconnect = same path; add = "Add integration" → configure page. |
| **Feedback (J17)** | Deactivated employee updates status badge on list; delete removes row; save returns to list. |
| **Feedback (J18)** | Toast on save; inline alert on settings validation error. |
| **Feedback (J19)** | Test connection → inline alert (transient); save → toast; error badge updates on list when connection state changes. |
| **Legibility** | Config vocabulary throughout; no plain-language softening; EHR error register communicates operational impact, not alarm. |

---

## Pre-build cognitive walkthrough (slot-19 sub-step) — result

Fresh-context walk of the spec against the jobs (spec-checkable subset):

- **Path (J17 Staff & Roles):** PASS — staff list → add/edit (one form); list → role permissions (one click). Breadcrumb orients every drill-down. Save/cancel always available in sticky footer.
- **Path (J18 Settings):** PASS — single-scroll sectioned form; Save in sticky footer; Reset confirm-gated. No ambiguity about where to find a setting (section-title headings).
- **Path (J19 EHR Integrations):** PASS — list → configure (one click per integration); test connection → inline feedback (no navigation); reconnect = same path as configure. Error state is immediately actionable (primary CTA "Reconnect" on errored item).
- **Feedback-existence:** PASS — form saves toast; test connection inline alert; confirm dialogs for destructive actions; deactivation updates badge. All specified in states.md transitions.
- **Legibility:** PASS — professional config register (ds-binding voice contract); EHR error register (`badge-error`, `alert-error`) is operationally warranted and correct.
- **Orientation-ingredients:** PASS — page-title "Admin" + `nav-tabs` sub-nav + breadcrumb on drill-downs + `record-header` on entity pages orient every Admin state.
- **Product-rule gate audit:** all mutating paths are confirm-gated or validated (deactivate/delete employee, deactivate integration, reset-to-defaults). Test connection is non-destructive (no gate needed). Credential fields are masked with show/hide toggle. No patient PHI surfaces on Admin.
- **Admin/ops separation check:** PASS — no clinical-signal columns, no queue, no pushed work arrives on Admin. EHR error impact (patient data) is named in the banner but the fix lives here, not on Patients. Cross-link is informational only.

**Cross-surface dependency check:**
- Admin Staff & Roles **must build after** the shared Patients primitives are authored (toolbar, dense table, form patterns, confirm dialog, nav-tabs) — these are the ★ shared primitives Admin reuses. Do not build Admin in parallel with Patients until those primitives are stable.
- EHR Integrations → Patients is an informational cross-link only (error state may surface a topbar notification deep-linking here). No reverse nav; no blocking build dependency on Patients being complete.

**PL gaps — verdict:** Both flagged compositions (permission matrix, masked credential field) are Tier-2 app compositions of existing PL components. Zero blocking PL gaps. Both are promote-candidates if they recur on a second surface.

**Render-only checks (EHR-error-reads-urgent-not-alarming, sub-nav-weight-appropriate, settings-sections-scannable):** deferred to slot 30 (human cold render-and-look) — non-waivable.
