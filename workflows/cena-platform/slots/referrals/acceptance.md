---
slot: 19
slot-name: acceptance-criteria (Referrals)
primary-author: QA Lead
project: cena-platform
surface: referrals
created: 2026-05-26
status: in-review
consumes:
  - slots/referrals/states.md
  - slots/referrals/ia.md
  - slots/_app/content-model.md
folds-in: [test-plan (20)]
---

# Referrals — Acceptance Criteria

Per-screen observable rows (binary pass/fail) + flow-level use-case acceptance + pre-build cognitive walkthrough. The contract build executes against.

## Per-screen acceptance

| # | Criterion | State | Pass condition |
|---|---|---|---|
| R1 | Pipeline is partner-scoped: referrals grouped by referring partner | pipeline | each partner with referrals has a labeled `queue-section-header` group; no un-grouped flat list as the default |
| R2 | Pipeline-bar per partner group shows proportional status breakdown | pipeline | `pipeline-bar` + `pipeline-segment`s present per group; segment labels or `aria-label`s name status + count |
| R3 | Dense table with correct columns + status badges | pipeline | `data-table-compact`: candidate name (`cell-primary`), status badge (`badge-pill`), received date, age/days-since-received (`cell-mono`), referring partner link; `row-clickable` rows |
| R4 | SLA/age urgency is visually flagged, not silent | pipeline | days-since-received column carries `.is-urgent`/`severity-high` for SLA-approaching or breached rows; not decorative; reserved for genuine urgency |
| R5 | Toolbar: search + status filter-pills + partner filter present | pipeline | `toolbar-search` + status `filter-pills` (All / Pending / In review / Converted / Declined) + partner filter; filtering empties to pipeline-empty state, not a silent blank |
| R6 | Empty state is diagnostic, NOT a silent blank | pipeline-empty | `data-empty-state` with diagnostic copy naming the reason (no partners configured → Network CTA; partners exist but no referrals → names partners + waiting message); no unexplained blank screen |
| R7 | Empty state distinguishes no-partners vs. no-referrals-yet | pipeline-empty | "No partners configured" → `btn-primary` "Go to Network" CTA present; "Partners exist, no referrals" → no false-alarm CTA, informational copy only |
| R8 | Referral detail: record header + breadcrumb + tabs present | detail | `layout-record-header` (candidate name + referring partner + received date + status badge + "Received N days ago" meta) + `nav-breadcrumb` (Referrals › {name}) + `nav-tabs` (Overview / Notes / History) |
| R9 | Detail: referral status pipeline rendered via progress-tracker | detail | `progress-tracker` steps (Pending → In review → Converted/Declined) with `.is-complete` / `.is-active` per current status; coordinator can orient at a glance |
| R10 | Convert is gated on in-review status | detail-pending | `btn-primary` "Convert to patient" is `disabled` + `aria-disabled="true"` when status is pending; copy explains the gate; "Mark as in review" is the primary action in pending state |
| R11 | Convert is enabled and functional in in-review state | detail | `btn-primary` "Convert to patient" enabled; activating it navigates to `patients.intake-single.html` with candidate fields pre-filled and referral source locked |
| R12 | Decline is confirm-gated | detail | "Decline" → `overlay-confirm-dialog` (danger icon) with reason `textarea` before commit; dismiss/cancel returns to detail unchanged |
| R13 | Referring partner name links to Network | detail, pipeline | partner name in record-header and table rows is a `text-link` → Network partner record; cross-surface navigation contract satisfied |
| R14 | Shell furniture stable across all states | all | sidebar (7 anchors, Referrals active) + topbar (search + work-queue badge + user) never appear/disappear |
| R15 | Professional voice, operational copy, no plain-language simplification | all | "Pending review · 3 referrals", "Received 8 days ago", "Convert to patient", "Decline"; no calm/affirmation register |
| R16 | A11y: partner group headers are `<h2>`; row focus correct; tabs are tablist; dialogs trap focus | all | `queue-section-header` renders as `<h2>` + `<section aria-labelledby=...>`; `row-clickable` keyboard-activable via name link; `nav-tabs` is real `tablist`; confirm-dialog traps focus; skip-link to main; visible focus indicators |
| R17 | Renders self-contained under `file://`, render-gate clean | all | `../assets/haven.css` + relative paths; no dev server; zero undefined classes |
| R18 | No real patient / business data | all | synthetic candidate names, representative partner names; no real PHI |

## Flow-level use-case acceptance

**Job (from brief):** J6 — "A coordinator processes an incoming referral from a partner and converts it to a patient."

The coordinator reaches Referrals either via Today's pushed "Pending referrals" card (one click → that referral's detail) or via the Referrals nav anchor (→ pipeline list → row click → detail).

| Sub-check | Pre-committed expected answer |
|---|---|
| **Orientation** | Lands knowing which partners have sent referrals and how many are at each status; the pipeline-bar gives an at-a-glance funnel shape per partner. |
| **Empty-state orientation** | If no referrals exist, lands knowing WHY — partners are named, or a prompt to configure Network is surfaced. No mystery blank screen. |
| **Affordance** | Convert is the obvious terminal action in in-review state; decline is present but visually secondary (danger-outline vs. primary); the gate on pending state is explained, not silent. |
| **Path** | Today push → detail (1 click, convert-ready). Nav anchor → pipeline → row → detail (2 clicks); convert from detail → Patients intake (pre-filled) → Patient record (1 form submit). |
| **Feedback** | Declining → confirm dialog → detail updates to declined state. Converting → Patients intake → new Patient record (the conversion is complete when the intake commits). |
| **Cross-surface** | Referring partner name is a live link to Network. Converted referral hands off to Patients intake with source locked — no re-entry of known fields. |
| **Legibility** | Dense but scannable; operational copy; SLA urgency color signals real risk; pipeline-bar reads the funnel shape without a chart. |

## Pre-build cognitive walkthrough (slot-19 sub-step) — result

Fresh-context walk of the spec against J6 (spec-checkable subset):

- **Path:** PASS — two valid paths (Today push → detail; nav anchor → pipeline → detail); convert path reaches Patients intake with pre-fill; both paths resolve within ≤3 actions to the conversion point.
- **Feedback-existence:** PASS — decline confirm-dialog specified; convert navigates to Patients intake (visual confirmation of handoff); pipeline shows updated status after action (states.md transitions).
- **Legibility:** PASS — operational copy patterns (ds-binding voice contract); urgency color + severity-badge for SLA signal; pipeline-bar adds funnel-shape without a chart.
- **Orientation-ingredients:** PASS — page-title + partner group headers + pipeline-bar + record-header + breadcrumb + status progress-tracker orient every zone; empty state is diagnostic.
- **Empty-state fix:** PASS — the diagnostic empty state is spec'd in states.md with two sub-cases (no partners; partners but no referrals); the mystery-blank-screen failure mode is explicitly addressed and cannot recur if the spec is followed at build.
- **Product-rule gate audit:** mutating paths (convert, decline) are both confirm-gated or lead to a separate form (Patients intake). No unguarded irreversible action. Convert gate (disabled until in-review) is a PL-standard disabled attribute. No real data crosses into any screen.

**Render-only checks (pipeline-bar-reads-as-summary-not-clutter, urgency-color-reads-right, partner-grouping-orientation, convert-gate-legibility):** deferred to slot 30 (human cold render-and-look) — non-waivable.
