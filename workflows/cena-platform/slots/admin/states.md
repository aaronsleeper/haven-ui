---
slot: 10
slot-name: state-and-transition-spec (Admin)
primary-author: Interaction Designer
project: cena-platform
surface: admin
created: 2026-05-26
status: in-review
consumes:
  - slots/admin/ia.md
  - slots/_app/content-model.md
  - slots/_app/surface-shell-model.md
folds-in: [flows (9), wireframes (11), a11y (13), strings (14), component-plan (17)]
---

# Admin — State & Transition Spec

Per-screen state machine + the PL primitives each state composes (copy, don't generate). Register: **professional internal admin** — dense, config-vocabulary, operational urgency color used where it carries meaning (EHR connection errors are real failures, not decoration). This is not the patient-app calm/plain-language frame.

## In-surface sub-nav

Admin renders a single `nav-tabs` (or `nav-segmented-control`) at the top of the content region switching between **Staff & Roles / Settings / EHR Integrations**. The sub-nav is persistent across all Admin states — it is the within-surface wayfinding contract. Not three sidebar anchors. See surface-shell-model §Within-surface wayfinding.

---

## Staff & Roles

| State | Trigger | Content | Built page |
|---|---|---|---|
| **staff-list** (default) | ≥1 employee | dense `data-table-compact` of employees + role badges | `admin.staff-list.html` |
| **staff-empty** | no employees | `data-empty-state` + Add employee CTA | `admin.staff-empty.html` |
| **staff-edit** | "Add employee" or row edit | add/edit form + role assignment | `admin.staff-edit.html` |
| **role-permissions** | role row → "Edit permissions" | role detail: permission assignment matrix | `admin.role-permissions.html` |

### `admin.staff-list.html` composition

- **Shell:** `layout-app-shell-responsive` per surface-shell-model — sidebar (Admin active), topbar (patient search + work-queue badge + user/role).
- **Page head:** `page-header` + `page-title` "Admin" + `nav-tabs` sub-nav (Staff & Roles active) + `page-header` actions right: `btn-primary` "Add employee".
- ★ **Toolbar** — `toolbar` + `toolbar-search` (`search-input`) + optional `nav-filter-pills` (status: Active / Inactive / All). Shared pattern (reuses the same toolbar primitive authored on Patients).
- ★ **Dense table** — `data-table data-table-compact` with `row-clickable`; columns: name (`cell-primary`), email, role (`badge-pill badge-sm`), status (Active/Inactive `badge-success` / `badge-neutral`), last-active, actions (`btn-ghost btn-xs` "Edit"). Row click → staff-edit.
- `data-pagination` below the table.

**No bulk-action-bar here.** Staff management actions (activate/deactivate) operate per-row via the actions column + confirm dialog. The bulk-action-bar promote-candidate is not warranted for Admin's infrequent one-at-a-time staff changes.

### `admin.staff-empty.html` composition

- Same shell. `page-header` + `page-title` "Admin" + sub-nav.
- `data-empty-state` (`empty-state` + `empty-state-icon` — `fa-solid fa-users`) — "No staff added yet. Add the first employee to get started." + `btn-primary` "Add employee".

### `admin.staff-edit.html` composition (add + edit)

- Same shell. `nav-breadcrumb` (Admin › Staff & Roles › {name or "Add employee"}).
- ★ **Form** — `form-layout` (or `layout-field-row` set); sections: Identity (first/last name, email), Role (role assignment via `select` or `forms-combobox` from role list), Status (Active/Inactive `toggle`). `forms-validation` states on fields.
- `layout-sticky-footer` — Save (`btn-primary`) / Cancel (`btn-outline`).
- **Destructive:** Deactivate / Delete employee → `overlay-confirm-dialog` (deactivate uses `confirm-dialog-icon-warning`; delete uses `confirm-dialog-icon-danger` + `btn-danger`). Delete is irreversible.

### `admin.role-permissions.html` composition

- Same shell. `nav-breadcrumb` (Admin › Staff & Roles › Roles › {role name}).
- `record-header` (role name title + employee count subtitle + status badge).
- **Permission matrix** — `data-table` or `kv-table` listing permissions (rows) × access levels (Read / Write / None) (columns); `input[type="radio"]` or `toggle` per cell. Sectioned by domain (Patients, Diet Operations, Network, Admin). `forms-validation` on save.
- `layout-sticky-footer` — Save permissions (`btn-primary`) / Cancel (`btn-outline`).
- **PL gap flag:** a permission-matrix table (radio-per-cell grid) has no direct PL precedent. **Compose from:** `data-table` (table chrome), `input[type="radio"]` + `radio-label` (per-cell control), `fieldset`/`legend` per section. This is a Tier-2 app composition of existing primitives — no new PL primitive needed. If the pattern recurs beyond Admin it promotes. **Flagged as a composition decision; do not invent new classes.**

---

## Settings

| State | Trigger | Content | Built page |
|---|---|---|---|
| **settings** (default) | Settings sub-nav | sectioned config form, all sections visible | `admin.settings.html` |

### `admin.settings.html` composition

- Same shell. `page-header` + `page-title` "Admin" + sub-nav (Settings active).
- **Sectioned form** — no stepper; all settings on one scrollable page, sectioned by `section-title` headings (e.g. Organization, Notifications, Meal Operations Defaults, Referral Pipeline). Each section: `layout-field-row` set with appropriate input types (text, select, toggle, number). `field-help` for non-obvious settings.
- `forms-validation` states inline. No modal confirm for most settings — just form validation + save feedback.
- `layout-sticky-footer` — Save changes (`btn-primary`) / Reset to defaults (`btn-outline`, with `overlay-confirm-dialog` confirming destructive reset).
- **Feedback on save:** `toast` (success) — "Settings saved." Inline `alert-success` as fallback if toast unavailable.

**Strings examples (professional config register):** "Referral expiration window (days)", "Default meal cutoff time", "EHR sync cadence", "Org display name", "Allow bulk CSV intake". No plain-language simplification.

---

## EHR Integrations

| State | Trigger | Content | Built page |
|---|---|---|---|
| **ehr-list** (default) | ≥1 integration configured | integration list with connection state per item | `admin.ehr-list.html` |
| **ehr-empty** | no integrations configured | `data-empty-state` + Add integration CTA | `admin.ehr-empty.html` |
| **ehr-configure** | "Configure" / "Reconnect" / "Add integration" | configure flow for one integration | `admin.ehr-configure.html` |

### `admin.ehr-list.html` composition

- Same shell. `page-header` + `page-title` "Admin" + sub-nav (EHR Integrations active) + `page-header` actions right: `btn-primary` "Add integration".
- **Integration list** — `data-list-group` (`list-group-flush` inside a `.card`); each `list-group-item` carries:
  - `list-group-item-icon` — system logo or FA icon.
  - `list-group-item-content` — `list-group-item-title` (system name) + `list-group-item-description` (scope: "Patient demographics, referral data").
  - `list-group-item-trailing` — **connection state badge** + action button.
    - **Connected:** `badge-success badge-pill` "Connected" + last-sync timestamp + `btn-ghost btn-xs` "Configure".
    - **Error:** `badge-error badge-pill` "Connection error" + error summary + `btn-primary btn-sm` "Reconnect". The error register (`badge-error`, `alert-error`) is **correct and wanted here** — an EHR connection failure is a real operational failure affecting patient data import (cross-link to Patients surface). Not decoration.
    - **Unconfigured:** `badge-neutral badge-pill` "Not configured" + `btn-outline btn-sm` "Configure".
- A `alert-error` banner at the top of the list when ≥1 integration is in error state: "1 EHR integration has a connection error — patient data may not be current." Links to the errored integration.

### `admin.ehr-empty.html` composition

- Same shell. `page-header` + `page-title` "Admin" + sub-nav.
- `data-empty-state` (`empty-state` + `empty-state-icon` — `fa-solid fa-network-wired`) — "No EHR integrations configured. Connect your first EHR system to enable automated patient data sync." + `btn-primary` "Add integration".

### `admin.ehr-configure.html` composition (configure + reconnect)

- Same shell. `nav-breadcrumb` (Admin › EHR Integrations › {system name}).
- `record-header` (system name + connection state badge + last-sync meta).
- **Configure form** — `layout-field-row` set: System (read-only on edit, select on add), Endpoint URL, Auth type (select: OAuth2/API key), Credentials (password-type inputs, masked), Field mapping (key→field mapping rows — `data-list-group` editable rows or `data-table` with inline inputs). `forms-validation` states.
- **Test connection** — `btn-outline` "Test connection" → inline `alert` feedback (success: `alert-success` "Connection successful"; failure: `alert-error` "Connection failed: {reason}"). Test is non-destructive; result is transient.
- `layout-sticky-footer` — Save (`btn-primary`) / Cancel (`btn-outline`) / Deactivate (`btn-danger-outline`, with `overlay-confirm-dialog`).
- **PL gap flag:** no existing PL pattern for a masked-credential field with show/hide toggle. **Compose from:** `input[type="password"]` + `btn-icon btn-xs` toggle (show/hide, `fa-solid fa-eye` / `fa-solid fa-eye-slash`). This is a Tier-2 inline composition — semantically, a `field-input-group` with a trailing action button. No new PL primitive needed; flag for promotion if it appears on a second surface.

---

## Transitions

- `staff-list → staff-edit` (add or row-edit) → `→ staff-list` (save) or `→ staff-list` (cancel).
- `staff-list → staff-edit → confirm-dialog → staff-list` (deactivate/delete).
- `staff-list → role-permissions` (role row "Edit permissions") → `→ staff-list` (save/cancel).
- `ehr-list → ehr-configure` (Configure / Reconnect / Add integration) → `→ ehr-list` (save/cancel/deactivate).
- `ehr-configure: Test connection → inline alert (transient) → same form` (non-navigating feedback).
- Sub-nav transitions: `staff-list ↔ settings ↔ ehr-list` (in-surface, shell furniture stable).

---

## Invariants (carry to acceptance + a11y)

- **Sub-nav stable across sub-areas** — `nav-tabs` (Staff & Roles / Settings / EHR Integrations) persists; only the content region below it changes.
- **Shell furniture stable across all Admin states** — sidebar (7 anchors, Admin active) + topbar (search + badge + user) never appear/disappear.
- **EHR error color is earned** — `badge-error`, `alert-error` for EHR connection failure is operationally correct (patient data import affected); not decoration. Follows the coordinator-tool register (ds-binding §Register calibration).
- **Destructive actions are confirm-gated** — deactivate employee, delete employee, deactivate integration, reset-to-defaults all route through `overlay-confirm-dialog`. Delete uses `confirm-dialog-icon-danger` + `btn-danger`.
- **No patient-level data on Admin** — Admin surfaces Employee/Role/Setting/EHR Integration entities only. No patient names, PHI, clinical data. The EHR Integration entity carries config/state, not patient records.
- **Admin/ops separation enforced at the surface** — no queue cards, no Today-style pushed content, no clinical-signal columns. Config vocabulary throughout.
- **A11y:** table has `<th scope>` headers; sub-nav is a real `tablist` (`nav-tabs` Preline `hs-tab`); confirm dialogs trap focus; form labels are associated (`<label for>`); credential show/hide toggle has `aria-pressed` + descriptive `aria-label` ("Show password"); permission matrix checkboxes/radios have `<label>` and are grouped in `<fieldset>`/`<legend>` per permission domain; EHR error alert has `role="alert"` or is an `alert-error` (live region).
- **Strings (voice):** professional config register — "Assign role", "Permission level", "Connection error — patient data may not be current", "Test connection", "Reconnect", "Deactivate integration", "Reset to defaults". No plain-language softening; no gamification.

---

## Shared-primitive reuse (feeds Phase-2 dependency analysis)

★ marks primitives authored on earlier surfaces that Admin reuses — serialize their authoring before Admin build:

- **★ Toolbar** (`toolbar` + `toolbar-search` + `nav-filter-pills`) — authored on Patients; Admin Staff & Roles reuses it.
- **★ Dense table** (`data-table-compact` + `row-clickable`) — authored on Patients; Staff & Roles list reuses it.
- **★ Form patterns** (`layout-field-row`, `forms-validation`, `layout-sticky-footer`) — authored on Patients intake; Settings + staff-edit + ehr-configure reuse them.
- **★ Confirm dialog** (`overlay-confirm-dialog`) — authored on Patients; destructive admin actions reuse it.
- **★ Nav-tabs** (`nav-tabs`) — authored on Patients record tabs; Admin sub-nav reuses it as the within-surface wayfinding primitive.
- **★ Record header** (`record-header`) — authored on Patients record; role-permissions + ehr-configure reuse it for entity identity bars.

## PL gap flags (summary)

1. **Permission matrix table** (role-permissions) — Tier-2 composition from `data-table` + `input[type="radio"]`/`toggle` + `fieldset`/`legend`. No new PL primitive. Promote if pattern recurs.
2. **Masked credential field with show/hide toggle** (ehr-configure) — Tier-2 composition from `input[type="password"]` + `btn-icon btn-xs` + `field-input-group`. No new PL primitive. Promote if pattern recurs on a second surface.

Both gaps are compositions of existing PL components — zero blocking gaps for Admin build.

## Open / watch

- **EHR Integrations → Patients cross-link:** decide at build whether an EHR error state in Admin surfaces a dismissible banner in the Patients roster or only in the topbar/Today flow. Default: topbar notification with deep-link to Admin; Patients roster is not Admin's responsibility to annotate.
- **Sub-nav control type:** `nav-segmented-control` (three items, compact) vs `nav-tabs` (same three). `nav-segmented-control` is correct if the sub-areas are genuinely parallel views of the same "Admin" page; `nav-tabs` if they feel more like sections of a record. Default: `nav-tabs` (matches the established within-surface pattern); revisit at render-verify if the three feel too different in weight to treat as tabs.
- **Role permission granularity:** the permission matrix shape (rows = permissions × columns = access levels) is a placeholder. Final permission set to be confirmed with Vanessa/Andrey before build. The composition decision (data-table + radio per cell) is stable regardless of granularity.
