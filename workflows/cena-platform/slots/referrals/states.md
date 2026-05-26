---
slot: 10
slot-name: state-and-transition-spec (Referrals)
primary-author: Interaction Designer
project: cena-platform
surface: referrals
created: 2026-05-26
status: in-review
consumes:
  - slots/referrals/ia.md
  - slots/_app/content-model.md
  - slots/_app/surface-shell-model.md
folds-in: [flows (9), wireframes (11), a11y (13), strings (14), component-plan (17)]
---

# Referrals — State & Transition Spec

State machine per zone + the PL primitives each composes (PL-only; copy, don't generate). Register: **professional coordinator** — dense, operational, SLA/overdue urgency color allowed and wanted (NOT the patient-app calm/no-alarm frame). Reuses shared ★ primitives authored in Patients.

## Pipeline list

| State | Trigger | Content | Built page |
|---|---|---|---|
| **pipeline** (default/hero) | ≥1 referral in any status | partner-grouped dense table + pipeline-bar summary per partner + toolbar | `referrals.pipeline.html` |
| **pipeline-empty** | no referrals from any partner, OR no matches for active filter | `data-empty-state` — diagnostic: explains WHY (partners exist but have sent none, OR no partners yet), NOT a silent blank | `referrals.pipeline-empty.html` |
| **loading** | before data resolves | `data-skeleton` rows; shell + toolbar render immediately | spec-only |
| **error** | fetch fails | `alert` (error) "Couldn't load referrals." + retry | spec-only |

**Pipeline composition:**

- **Shell:** `layout-app-shell-responsive` per surface-shell-model — sidebar (Referrals active), topbar (patient search + work-queue badge + user/role).
- **Page head:** `page-header` + `page-title` "Referrals" + actions right: `btn-outline` "Filter by partner" (or `nav-filter-pills`).
- ★ **Toolbar** — `toolbar` + `toolbar-search` (`search-input`) + `nav-filter-pills` (status: All / Pending / In review / Converted / Declined) + optional partner filter (`forms-combobox` or `nav-stratification-bar`). Same shared toolbar pattern as Patients.
- **Partner group blocks** — one block per referring partner with ≥1 referral; each block:
  - **Group header:** `queue-section-header` (`.is-urgent` if the partner has pending SLA-approaching referrals; `.is-attention` if in-review; `.is-info` otherwise) — partner name + count. Rendered as `<h2>`.
  - **Pipeline summary bar:** `pipeline-bar` (`complex-pipeline-bar.html`) — proportional stacked bar showing pending / in-review / converted / declined counts per segment. Each `pipeline-segment` carries `style="flex: N"` (data-driven, per PL contract).
  - ★ **Dense table:** `data-table data-table-compact` with `row-clickable`; columns: candidate name (`cell-primary`), status badge (`badge-pill`), received date, age (`cell-mono` — days since received, `.is-urgent` if SLA-approaching or breached), referring partner (link → Network), notes snippet. Row click → referral detail.
- **Status badges:** `badge-warning` (pending), `badge-info` (in-review), `badge-success` (converted), `badge-neutral` (declined).
- **SLA signal on rows:** days-since-received column uses `.is-urgent`/`severity-high` when SLA is approaching or breached. This is real operational signal — not decoration.
- `data-pagination` below each group or below a flattened view if the coordinator switches to "All partners" flat mode.

**Pipeline-empty composition:**

- Same shell + page-head + toolbar.
- `data-empty-state` (`empty-state` + `empty-state-icon` — `fa-solid fa-arrow-right-arrow-left`).
- **Diagnostic copy (critical — fixes the mystery-blank-screen):** two sub-cases:
  - *Partners configured, no referrals sent:* "No referrals yet from your partners. Configured partners: [list]. When a partner sends a referral, it appears here."
  - *No partners configured:* "No program partners are configured. Add partners in Network to begin receiving referrals."
- CTA: `btn-primary` "Go to Network" (if no partners) or no CTA (if partners exist but haven't sent referrals — this is a waiting state, not a broken one).

## Referral detail

| State | Trigger | Content | Built page |
|---|---|---|---|
| **detail** (default — in-review) | open a referral that has been reviewed/is ready to act on | read-first detail; convert + decline actions both enabled | `referrals.detail.html` |
| **detail-pending** | open a referral not yet opened/reviewed | read-first detail; convert gated (`.btn-primary` disabled or absent); "Mark as in review" prominent | `referrals.detail-pending.html` *(may fold into detail as variant)* |
| **detail-converted** | referral already converted | read-only + "View patient record" link; no convert/decline | variant within detail |
| **detail-declined** | referral already declined | read-only + reason shown; "Reopen" if business allows | variant within detail |

**Detail composition:**

- `nav-breadcrumb` (Referrals › {candidate name / ID}).
- ★ **`layout-record-header`** — candidate name (`record-header-title`) + referring partner + received date (`record-header-subtitle`); status badge + "Received N days ago" meta right (`record-header-trailing`, `record-header-meta`). Same shared record-header pattern as Patients.
- ★ **`nav-tabs`** — Overview / Notes / History. (Tab vocabulary shared with other entity records — same Preline `hs-tab` pattern as Patients record.)
- **Overview tab:**
  - `kv-table` — candidate identifiers (name, DOB, contact), referring partner (link → Network Partner record), referral date, program/cohort, any clinical notes from the referral source.
  - Status pipeline indicator: `progress-tracker` (or `ProgressTracker`) — Pending → In review → Converted/Declined steps; `.is-complete` / `.is-active` per current status. Gives the coordinator clear orientation on where this referral stands.
  - **Convert action zone** (sticky footer for in-review state): `layout-sticky-footer` — `sticky-footer-actions` with `btn-primary` "Convert to patient" (enabled when in-review + required fields present) + `btn-danger-outline` "Decline" + `btn-outline` "Cancel" (returns to pipeline). For pending state: `sticky-footer-actions` with `btn-secondary` "Mark as in review" (primary action) + `btn-danger-outline` "Decline".
  - **Convert-to-patient gate:** "Convert" is `disabled` (and carries `aria-disabled="true"`) when the referral is in pending status. Copy on the disabled state: "Review the referral before converting." A `btn-loading` variant activates during the convert submission.
- **Notes tab:** `card` wrapping free-text notes from the coordinator + from the referring partner; `btn-outline` "Add note" → inline `textarea` (or a minimal modal).
- **History tab:** `timeline-list` of status changes (pending → in-review, referral received timestamp, convert/decline event). Operational, not clinical.
- **Decline action:** → `overlay-confirm-dialog` (`.confirm-dialog-icon-danger`) — "Decline this referral?" + reason `textarea` (`field-row`) before confirm. Decline is irreversible without a reopen flow; dialog is the gate.
- **Convert action:** → `patients.intake-single.html` (Patients intake, fields pre-filled: candidate name, DOB, contact, referral source locked to this partner + referral ID). The coordinator lands in Patients intake with referral context already populated — they complete the intake form and commit. See Patients states.md "referral-convert entry."

## Transitions

- `pipeline → detail` (row click) → back via breadcrumb.
- `detail-pending → detail` ("Mark as in review" action → status update → same record, detail state).
- `detail → confirm-dialog (decline) → detail-declined` (or back to detail on cancel).
- `detail → patients.intake-single (pre-filled)` (convert action) → Patients intake → Patient record (new patient, committed).
- `loading → {pipeline | pipeline-empty}` once data resolves.
- `* → error` on fetch failure; recover on retry.

## Invariants (carry to acceptance + a11y)

- **Pipeline is partner-scoped** — referrals are always grouped by referring partner. A flat "all referrals" view is a filter state, not the default. The scoping fixes the mystery-blank-screen.
- **Empty state is diagnostic, not silent** — the empty state names why there are no referrals (partners exist but haven't sent; or no partners configured). A silent blank is the failure mode being fixed; this is the fix.
- **Convert is gated on in-review status** — "Convert to patient" is disabled until the coordinator has opened and reviewed the referral (moved it to in-review). Gating is semantic (status-based), not arbitrary ceremony.
- **Decline is confirm-gated** — `overlay-confirm-dialog` with reason field before any decline. Decline is operationally significant; the gate is warranted.
- **Furniture stable across states** — shell + page-header + toolbar persist; only the table body / detail content / empty-state swaps.
- **Operational urgency color** — SLA-approaching / breached referrals use `.is-urgent`/`severity-high`. Days-since-received is a real operational signal; urgency color is correct and wanted here.
- **Referring partner links to Network** — the partner name in the detail header and table rows is a `text-link` → Network Partner record. The relationship is navigable (content-model: Referral → from Partner → in Network).
- **Convert hands off fully pre-filled** — the Patients intake form receives all available candidate fields from the referral. Referral source is locked (coordinator cannot change it). This is the integration point between surfaces.
- **A11y:**
  - `queue-section-header` renders as `<h2>` (per PL contract); partner group blocks are `<section>` with `aria-labelledby` the group header.
  - `row-clickable` rows are keyboard-activable; the candidate name link is the real focus target.
  - Pipeline-bar segments carry `aria-label="{status}: N referrals"`.
  - `progress-tracker` steps carry accessible labels for current/complete state.
  - Confirm-dialogs trap focus per PL overlay contract.
  - `nav-tabs` is a real `tablist` (Preline `hs-tab`).
  - Skip-link to main; visible focus throughout.
- **Strings (voice):** professional/operational — "Pending review · 3 referrals", "In review · Hartford Community Health", "Received 8 days ago", "Convert to patient", "Decline", "Mark as in review". No plain-language simplification.
- **No real patient / business data** — synthetic candidate names, partner names representative.

## Shared-primitive reuse (★ flags from Patients states.md)

★ marks primitives authored in Patients that Referrals consumes without re-authoring:
- **Toolbar pattern** (`toolbar` + `toolbar-search` + `nav-filter-pills` + `nav-stratification-bar`) — same pattern as Patients roster toolbar. Consume, don't re-derive.
- **Dense table** (`data-table-compact` + `row-clickable`) — same pattern as Patients roster. Status badges, SLA signal columns are referrals-specific content but use the same table container.
- **`layout-record-header` + `nav-tabs` record pattern** — same pattern as Patients record. Referral detail is a record (same IA shape: header + tabs + content).

## New compositions / PL notes (not gaps — all compose from existing PL)

- **`pipeline-bar` per partner group** — `complex-pipeline-bar.html` (`pipeline-bar` + `pipeline-segment`) used inside each partner group header block. Gives the coordinator a proportional at-a-glance view of each partner's referral funnel. Not a new component — direct PL reuse.
- **`progress-tracker` for referral status** — `nav-stepper.html` / `ProgressTracker` (agentic) — used on the referral detail overview tab to show Pending → In review → Converted/Declined. Compose from existing PL.
- **Convert-gated sticky footer** — `layout-sticky-footer` (`sticky-footer` + `sticky-footer-actions`) with a conditionally-disabled `btn-primary`. Not a new component — direct PL composition. The disabled state is a PL-standard `disabled`/`aria-disabled` attribute, not a custom pattern.

## PL gaps

**None.** All state compositions are achievable from existing COMPONENT-INDEX entries. No class generation required.

- `pipeline-bar` / `pipeline-segment` — `complex-pipeline-bar.html` ✅
- `queue-section-header` — `queue-section-header.html` ✅
- `data-table-compact` / `row-clickable` — `data-table.html` + extensions ✅
- `layout-record-header` — `layout-record-header.html` ✅
- `nav-tabs` — `nav-tabs.html` ✅
- `progress-tracker` — `ProgressTracker` (agentic) / `nav-stepper.html` ✅
- `layout-sticky-footer` — `layout-sticky-footer.html` ✅
- `overlay-confirm-dialog` — `overlay-confirm-dialog.html` ✅
- `data-empty-state` — `data-empty-state.html` ✅
- `toolbar` / `toolbar-search` / `nav-filter-pills` — `toolbar.html` + `nav-filter-pills.html` ✅
- `badge-pill` status variants — `badge.html` ✅

## Open / watch

- **Referral-source lock in Patients intake** — the convert-to-patient handoff pre-fills and locks the referral source field. Confirm the Patients intake form has the locking affordance spec'd (it is noted in Patients states.md "intake-single: when reached from a converting referral, fields pre-fill (referral source locked)") — verify implementation at build.
- **Pipeline-bar placement** — one pipeline-bar per partner group adds visual density. At build/render-verify, confirm it reads as a summary aid rather than clutter. If it overwhelms, consider moving it to the group header trailing position only (collapsible) — decision at slot 30 human cold render.
- **Detail-pending fold decision** — whether `detail-pending` is a separate page or a variant of `referrals.detail.html` with a different sticky-footer composition. Default: fold into one page with state-driven sticky-footer (cleaner, reduces build overhead). Finalize at build.
