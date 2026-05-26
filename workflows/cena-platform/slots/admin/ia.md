---
slot: 7
slot-name: information-architecture (per-surface — Admin)
primary-author: IA Designer
project: cena-platform
surface: admin
created: 2026-05-26
status: in-review
consumes:
  - slots/_app/trigger-map.md
  - slots/_app/surface-shell-model.md
  - slots/_app/content-model.md
  - Knowledge/Projects/Cena Health/Apps/Platform/IA Synthesis.md
---

# Admin — Information Architecture (per-surface)

Per-surface IA for **Admin**, the configuration surface that separates staff/role management, system settings, and EHR integration from the daily operational surfaces. Covers jobs J17, J18, J19. Secondary persona (admins) — lighter frequency, config-oriented vocabulary.

## Admin/ops separation rationale (load-bearing)

IA Synthesis §4 establishes this as a deliberate seam: "config, separated from daily operations." The rationale is structural:

- **Daily ops surfaces** (Today, Patients, Referrals, Diet Operations, Network, Clinical Library) are triage + task shaped — pulled or pushed work a coordinator handles constantly.
- **Admin** is config-shaped — pulled occasionally, almost never in the middle of ops, by a lighter secondary persona (admins, or a coordinator acting in an admin capacity). Interleaving it with ops surfaces creates nav clutter without wayfinding payoff.
- **EHR integrations** moved here from the Patients route (IA Synthesis §4 resolution): EHR config is setup/maintenance work, not per-patient daily ops. It belongs with the other integration-level config, not alongside intake forms.

The Admin nav anchor (7th of 7) reinforces this position: it is always reachable but never competes with the six operational anchors.

## What Admin is (and is not)

- **Is:** a config/administration surface housing staff, roles, settings, and EHR integration management — pulled, low-frequency, secondary persona.
- **Is not:** a daily operations surface. No patient-level data surfaces here; no queue; no Today-style pushed items.
- **EHR integrations cross-link:** EHR connection state has operational implications for the Patients surface (an unconfigured or errored integration may affect data import), so Admin → Patients is a one-way informational cross-link, not a workspace.

## Where/how reached

- **Reached as:** the **Admin nav anchor** (7th of 7, `fa-solid fa-gear`) in the persistent sidebar.
- **Frequency:** low — admins configure staff/roles when onboarding or offboarding staff; settings rarely; EHR integrations at setup and on error.
- **No pushed work:** Admin has no queue card in Today. EHR connection errors may surface as an alert-level notification (topbar or Today) that deep-links into Admin, but the Admin surface itself is always pulled.

## Sub-areas (three, one connected surface)

Admin is **one connected surface** with an in-surface sub-nav (segmented control or nav-tabs) switching between sub-areas — not three separate sidebar anchors. The sub-nav pattern mirrors Diet Operations' within-surface navigation (surface-shell-model §Within-surface wayfinding).

| Sub-area | Job | What it is |
|---|---|---|
| **Staff & Roles** | J17 | Employee list + role assignments + permission management |
| **Settings** | J18 | Config form sections (system-level, org-level settings) |
| **EHR Integrations** | J19 | Integration list + connection states + configure/reconnect flows |

## Entities surfaced on Admin (from content-model)

- **Employee / Role** (J17) — name, role, permissions; active/inactive. Admin action: create/edit employees, assign roles, configure role permissions.
- **Setting** (J18) — key, scope (system/org), value-shape. Admin action: edit config values via form.
- **EHR Integration** (J19) — system name, connection state (connected/error/unconfigured), field mapping. Admin action: configure, reconnect, test, deactivate.

## Nav graph (out-edges from Admin)

| From Admin element | Routes to | Trigger |
|---|---|---|
| Sub-nav: Staff & Roles | Staff & Roles list | pulled |
| Sub-nav: Settings | Settings config form | pulled |
| Sub-nav: EHR Integrations | EHR integration list | pulled |
| Staff row: role assignment | role-permission edit form (in-surface, within Staff & Roles) | pulled |
| EHR Integrations: "Configure" | configure/reconnect flow (in-surface, within EHR Integrations) | pulled |
| EHR connection error alert | Admin → EHR Integrations (errored integration highlighted) | from topbar/Today deep-link |
| Sidebar anchors (7) | their surfaces | coordinator-pulled |

**Cross-surface dependency:** EHR Integrations → Patients is a one-way informational cross-link. EHR integration state affects patient data import (J2, J3), but the admin configures integrations here; the Patients surface consumes the result. No reverse nav needed.

**Roles → ops surfaces:** role/permission configuration here controls what coordinators can do across all surfaces. This is a configuration relationship (admin sets permissions; ops surfaces enforce them), not a navigable cross-link.

## URL / page contract (static-bundle targets)

States are separate pages under `handoff/cena-platform/admin/`:

- `admin.staff-list.html` — staff & roles: populated employee table with role badges
- `admin.staff-empty.html` — staff & roles: no employees yet
- `admin.staff-edit.html` — add/edit employee + role assignment form
- `admin.role-permissions.html` — role detail: permission assignment matrix
- `admin.settings.html` — settings: sectioned config form (the hero)
- `admin.ehr-list.html` — EHR integrations: populated integration list (mixed connection states)
- `admin.ehr-empty.html` — EHR integrations: no integrations configured
- `admin.ehr-configure.html` — configure/reconnect flow for one integration

Exact built page count finalized at build. The contract here is the state set, not URL strings.

## Cognitive-walkthrough pre-commit (feeds acceptance.md)

An admin landing on Admin to:
- **(Staff & Roles)** should immediately see the employee roster and understand how to add a staff member or change a role assignment without hunting.
- **(Settings)** should land on a scannable, sectioned config form with no ambiguity about what a setting controls or where to save.
- **(EHR Integrations)** should see connection state at a glance (connected/error/unconfigured per integration), know which integration needs attention, and reach the configure/reconnect flow in one click.
- **(Cross-cut)** the Admin/ops separation means an admin working here is never confused by patient-level data bleeding in, and a coordinator doing daily ops never lands on Admin accidentally.

Pre-committed expected answers live in `acceptance.md`.
