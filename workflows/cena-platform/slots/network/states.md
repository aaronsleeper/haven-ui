---
slot: 10
slot-name: state-and-transition-spec (Network)
primary-author: Interaction Designer
project: cena-platform
surface: network
created: 2026-05-26
status: in-review
consumes:
  - slots/network/ia.md
  - slots/_app/content-model.md
  - slots/_app/surface-shell-model.md
folds-in: [flows (9), wireframes (11), a11y (13), strings (14), component-plan (17)]
---

# Network — State & Transition Spec

State machine per zone + PL primitives each state composes (copy, don't generate). Register: **dense professional coordinator** — operational vocabulary, pipeline counts, relationship graph. NOT admin configuration; NOT patient-app calm frame. Reuses ★-marked shared primitives authored in `slots/patients/states.md`.

## Organizations list

| State | Trigger | Content | Built page |
|---|---|---|---|
| **orgs-list** (default) | ≥1 org exists | dense `data-table data-table-compact` of orgs | `network.orgs-list.html` |
| **orgs-list-empty** | no orgs yet | `data-empty-state` → Add organization CTA | `network.orgs-list-empty.html` |

**Composition — `network.orgs-list.html`:**
- **Shell:** `layout-app-shell-responsive` per surface-shell-model — sidebar (Network active, `fa-solid fa-sitemap`), topbar (patient search + work-queue badge + user/role).
- `page-header` + `page-title` "Network" + actions right: `btn-primary` "Add organization".
- `nav-breadcrumb`: Network (current, no crumb — single level; crumb appears on drill-down).
- ★ **Toolbar** — `toolbar` + `toolbar-search` (`search-input`) + `nav-filter-pills` (status: Active / Inactive / All). Shared primitive (patients, referrals, diet ops, clinical library all use the same toolbar shape — see patients/states.md ★ flags).
- ★ **Dense table** — `data-table data-table-compact` with `row-clickable`; columns:
  - Org name (`cell-primary`) — the drill-down click target.
  - Type (badge-pill badge-sm) — e.g. "Health System", "Community Org".
  - Partners (`cell-numeric`) — count of child program partners.
  - Referrals pending (`cell-numeric`) — rollup of pending referrals across all child partners; `badge-warning` when >0.
  - Active patients (`cell-numeric`) — rollup via referred patients.
  - Status — `badge-success` "Active" / `badge-neutral` "Inactive".
  - Row trailing: `btn-ghost btn-xs` "Edit" (opens org-edit form).
- `data-pagination` below the table.

**Composition — `network.orgs-list-empty.html`:**
- Same shell + page-header + toolbar (search/filter present even when empty, for navigability).
- `data-empty-state` (`empty-state` + `empty-state-icon`) — "No organizations yet. Add your first partner organization to begin tracking referral pipelines." + `btn-primary` "Add organization". Professional/operational copy; no affirmation tone.

## Organization record

| State | Trigger | Content | Built page |
|---|---|---|---|
| **org-record** (default) | row click from orgs-list | org detail + child partner sub-list (populated) | `network.org-record.html` |
| **org-record partner-empty** | org exists but no partners | same record; partner sub-list shows empty state | (fold into org-record as documented variant) |

**Composition — `network.org-record.html`:**
- Shell. `nav-breadcrumb`: Network › {Org Name} — two crumbs; Network is a `text-link` back to orgs-list.
- ★ **`layout-record-header`** (`record-header`) — org name as `record-header-title`, type as `record-header-subtitle`, status badge (`badge-success`/`badge-neutral`) + partner count + active-patient count in `record-header-meta` right. Shared pattern with patients, referrals, partner record.
- `page-header` actions right: `btn-outline btn-sm` "Edit organization".
- **Org detail section** — `kv-table`: primary contact name, phone/email, address, type, program, created date. `editable-indicator` beside editable fields.
- **Program Partners sub-list** (`section-title` "Program Partners" + `btn-primary btn-sm` "Add partner" right):
  - When populated: `data-list-group` (`list-group`) of partner rows — each is a `list-group-item-action`:
    - `list-group-item-icon`: `fa-solid fa-handshake` (partner icon).
    - `list-group-item-content`: `list-group-item-title` = partner name; `list-group-item-description` = org name (redundant here but consistent with all-partners view), referral pipeline summary string (e.g. "4 pending · 12 active patients").
    - `list-group-item-trailing`: pipeline count badges (`badge-warning badge-sm` for pending count > 0) + `btn-ghost btn-xs` "View".
    - Row is `row-clickable`; click → partner record.
  - When empty: `data-empty-state` (`empty-state` inline / compact) — "No program partners yet. Add a partner to start tracking referrals." + `btn-primary btn-sm` "Add partner".
- **PL note:** `data-list-group` with `list-group-item-action` + `list-group-item-icon/-content/-title/-description/-trailing` is the existing PL primitive (COMPONENT-INDEX "List Group"). `complex-partner-list-item` (ds-binding.md "Drill-down / relationship nav" coverage note) — confirm at build whether `complex-partner-list-item` is this exact composition or a distinct entry. If distinct, copy from PL; if it resolves to the list-group pattern, use the existing classes. **FLAG:** verify `complex-partner-list-item` presence and class set in COMPONENT-INDEX before build; not currently indexed by name (see PL gaps section).

## Partners list (all-orgs view)

| State | Trigger | Content | Built page |
|---|---|---|---|
| **partners-list** (all) | Network nav → Partners tab OR direct | all partners, filterable by org | `network.partners-list.html` |
| **partners-list-empty** | no partners match filter / none yet | `data-empty-state` | `network.partners-list-empty.html` |

**Composition — `network.partners-list.html`:**
- Shell. `nav-breadcrumb`: Network (active surface; Partners is a view within Network, not a separate anchor — breadcrumb reflects this: no separate Partners crumb at top level, just "Network" current).
- `page-header` + `page-title` "Network" + view toggle right (`nav-segmented-control` / `view-toggle`): **Organizations | Partners** — the two top-level views within Network. Organizations is the default; Partners is the secondary view. Actions right: `btn-primary` "Add partner".
- ★ **Toolbar** — `toolbar` + `toolbar-search` + `nav-filter-pills` (status: Active / Inactive / All) + `nav-stratification-bar` (by organization — stratify partner list by parent org).
- ★ **Dense table** — `data-table data-table-compact` with `row-clickable`; columns:
  - Partner name (`cell-primary`).
  - Organization — parent org name (text-link → org record).
  - Referrals pending (`cell-numeric`) — `badge-warning badge-sm` when >0.
  - Referrals in review (`cell-numeric`).
  - Converted (`cell-numeric`).
  - Active patients (`cell-numeric`).
  - Status — `badge-success`/`badge-neutral`.
  - Row trailing: `btn-ghost btn-xs` "View".
- `data-pagination`.

**Composition — `network.partners-list-empty.html`:**
- Same shell + page-header (with Organizations/Partners segmented control) + toolbar.
- `data-empty-state` — "No partners match the current filter." (filter-empty case) or "No program partners yet." (no data case); distinguish with copy and CTA: filter-empty → clear filters; no data → Add partner.

## Partner record

| State | Trigger | Content | Built page |
|---|---|---|---|
| **partner-record** (default) | row click from org-record or partners-list | partner detail + referral-pipeline counts + cross-links | `network.partner-record.html` |

**Composition — `network.partner-record.html`:**
- Shell. `nav-breadcrumb`: Network › {Org Name} › {Partner Name} — three crumbs. Network = `text-link` → orgs-list; {Org Name} = `text-link` → org record; {Partner Name} = `breadcrumb-current`.
  - **Breadcrumb is the primary discoverability mitigation in practice** — three crumbs make the org→partner hierarchy legible at every entry point, including cross-links from Referrals and Patients where the coordinator arrived without traversing the nav graph. See ia.md §Discoverability risk.
- ★ **`layout-record-header`** — partner name as `record-header-title`, org name as `record-header-subtitle` (text-link → org record), status badge + primary-contact summary in `record-header-meta` right.
- `page-header` actions right: `btn-outline btn-sm` "Edit partner".
- **Partner detail section** — `kv-table`: contact name/phone/email, program type, address, referral method, created date. `editable-indicator` beside editable fields.
- **Referral pipeline section** (`section-title` "Referral Pipeline"):
  - `stat-group` — four `stat-group-item`s: Pending · In Review · Converted · Declined. Numeric counts; `.trend-up`/`.trend-down` deltas on Converted where trend is meaningful.
  - `btn-outline btn-sm` "View all referrals" (cross-link → Referrals filtered to this partner). **This cross-link is a discoverability mitigation edge** — operational coordinators who live in Referrals surface discover Network via this partner.
- **Referred patients section** (`section-title` "Referred Patients"):
  - `stat-group-item` "Active patients" count.
  - `btn-outline btn-sm` "View patients" (cross-link → Patients roster filtered to referred-by this partner). **Second cross-link mitigation edge.**
  - Optional: a `data-list-group` of the 3–5 most recently referred patients (name + referral date + status), each `list-group-item-action` → that patient's record. Show only when count > 0 and ≤ a reasonable display threshold; "View patients" link leads the full list.
- **IA integrity note:** the pipeline counts and "View" cross-links are the core value of this record. Without them this is just a contact card, indistinguishable from Admin config. They must render prominently above the fold.

## Transitions

- `orgs-list → org-record` (row click) → back via breadcrumb ("Network" crumb or browser back).
- `org-record partner sub-list → partner-record` (row click) → back via breadcrumb ("{Org Name}" crumb).
- `partners-list → partner-record` (row click) → back via breadcrumb.
- `org-record / partner-record → add/edit form` (CTA) → confirm/save → return to record with updated state.
- `partner-record "View all referrals" → Referrals (partner-filtered)` — cross-surface, no Network state change.
- `partner-record "View patients" → Patients roster (partner-filtered)` — cross-surface.
- `Referrals (source partner link) → partner-record` — inbound cross-link (Network entry via Referrals).
- `Patients record referral tab (source partner link) → partner-record` — inbound cross-link (Network entry via Patients).
- `Today pending-referral card (partner name link) → partner-record` — inbound cross-link (Network entry via Today).
- `Network orgs-list ↔ partners-list` via `view-toggle` (Organizations | Partners segmented control) — in-surface view switch, no shell reload.

## Invariants (carry to acceptance + a11y)

- **Breadcrumb always present on drill-down pages** — `nav-breadcrumb` rooted at "Network" on org-record and partner-record; never omit for "clean" aesthetics. This is the primary orientation mechanism and a discoverability requirement.
- **Pipeline counts are operational, not decorative** — `badge-warning` on pending-referral counts > 0 uses the real warning semantic (coordinator needs to act); not a visual flourish. Restraint applies: badge-error only for a defined operational urgency threshold (e.g. referrals overdue > N days); plain count otherwise.
- **Network is never Admin** — no settings vocabulary, no configuration register in copy. "Program partner", "referral pipeline", "active patients" — always operational language.
- **Cross-links are the relationship graph made navigable** — "View all referrals" and "View patients" on partner-record are required, not optional. They are what turns a contact-card into a connecting view. Do not omit for space.
- **Furniture stable** — shell (sidebar + topbar) never redraws; only the content region changes.
- **Add/edit paths are confirm-gated** — org edit and partner edit route through `overlay-confirm-dialog` for destructive actions (deactivate); save/cancel for edits. No unguarded destructive path.
- **A11y:**
  - `data-table` has `<th scope="col">` headers; `row-clickable` rows have a focusable name link (not a div onclick); checkboxes labeled.
  - `nav-breadcrumb` is a `<nav aria-label="Breadcrumb">` with `<ol>`; `breadcrumb-current` carries `aria-current="page"`.
  - `layout-record-header` title renders as `<h1>` (single per page); section titles (`section-title`) render as `<h2>`; sub-list heading as `<h3>` if nested inside a section.
  - `list-group-item-action` partner rows are keyboard-activable (native `<a>` or `<button>`).
  - `stat-group` counts: each `stat-group-item` has a visible `stat-group-label`; numeric values are not meaning-bearing by color alone.
  - Skip-link to main content.
- **Strings (operational register):**
  - "Add organization" / "Add partner" (not "Create new" or "New record").
  - "Referral pipeline" not "Referrals" at section title level (distinguishes the pipeline-count summary from the Referrals surface itself).
  - Counts: "4 pending" / "12 active patients" / "View all referrals" / "View patients".
  - Status pills: "Active" / "Inactive" (not "Enabled" / "Disabled" — admin vocabulary).
  - Empty states: operational/direct ("No program partners yet. Add a partner to start tracking referrals."); no plain-language softening.

## Shared-primitive flags (feed Phase-2 dependency analysis)

★ marks reused across surfaces — confirmed authored in `slots/patients/states.md`; Network is a downstream consumer:
- **Toolbar pattern** (search + filter-pills + stratification-bar) — Patients ✓, Referrals, Diet Ops, Network, Clinical Library.
- **Dense table** (`data-table-compact` + `row-clickable`) — every list surface. Network orgs-list and partners-list are instances.
- **`layout-record-header` + `kv-table`** — Patients ✓, Referrals, Network org-record and partner-record.
- **`stat-group`** — Diet Operations pipeline glance, Network referral-pipeline summary. Network is a second consumer; promotes `stat-group` use on records (not only dashboards).
- **`data-list-group` action pattern** — partner sub-list within org-record. Confirm this is the correct primitive vs `complex-partner-list-item` (see PL gaps below).

## PL gaps / flags (for Phase-2 build, not blocking design)

1. **`complex-partner-list-item`** — mentioned in `ds-binding.md` drill-down coverage as a covered pattern, but not found by name in COMPONENT-INDEX. Before build: confirm whether this is a distinct PL entry with its own class set, or whether it resolves to `data-list-group` + `list-group-item-action/-icon/-content/-title/-description/-trailing`. If a distinct class set exists in `components.css`, use it verbatim. If it is the list-group composition, use the indexed classes. **Do not invent a new class until confirmed.**
2. **Segmented view-toggle for Organizations | Partners** — `nav-segmented-control` / `view-toggle` are indexed in COMPONENT-INDEX. Verify the "Organizations | Partners" two-item toggle seats cleanly in the `page-header` actions row (alongside `btn-primary "Add partner"`) without layout conflict — confirm at render-verify.
3. **`nav-stratification-bar` with org as the stratification dimension** — indexed. Network's use stratifies partners by parent org; confirm the bar works with a dynamic (data-driven) org list at build. No PL gap; confirm behavior.
4. **Bulk-action-bar (promote candidate)** — Network's partners-list may need bulk deactivation (consistent with Patients + Diet Ops). If added, confirm the `sticky-footer` composition promoted per `ds-binding.md` gap #1 (3-use rule). Not in-scope for v1 state set; flagged as a build-time addition if needed.

## Open / watch

- **Add/edit form scope** — org and partner add/edit forms may be overlay panels (`overlay-modal` / confirm-dialog sized) or dedicated pages (`network.org-form.html`, `network.partner-form.html`). Finalize at wireframe/build. If partner data is simple (name, contact, org affiliation), overlay is appropriate; if it includes complex field sets (multiple contacts, integration config), a dedicated page is warranted. Default: overlay.
- **`complex-partner-list-item` class resolution** — see PL gaps #1. Must resolve before first Network page build.
- **Referral-pipeline date-window context** — pipeline counts on the partner record are point-in-time snapshots. If a date filter (e.g. "last 30 days") would be operationally meaningful, add a `nav-filter-pills` or date-range control above the pipeline stat-group. Decide at wireframe. Default: lifetime counts with a rendered-at date/time label.
