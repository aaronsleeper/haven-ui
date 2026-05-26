---
slot: 5
slot-name: design-system-binding
primary-author: DS Steward
project: cena-platform
created: 2026-05-26
status: ratified
consumes:
  - framework-binding.md
  - stack.md
mode: ratify + coverage-confirmation
---

# Design-System Binding — Cena Care-Coordinator Platform

Declares the DS + the coverage confirmation steps.md flags as a hard gate: **this is a dense internal coordinator tool (tables, bulk actions, pipeline/wizard flows, drill-down). Before Phase 1, confirm the PL covers these patterns. Any gap is flagged here, not improvised mid-build** (Guardrail: never invent a class).

Canonical DS spec: `Lab/haven-ui/DESIGN.md` + `packages/design-system/pattern-library/COMPONENT-INDEX.md` (ground truth — copy, don't generate).

## Declared DS + version

- **Haven Design System**, haven-ui repo. Pattern library `packages/design-system/pattern-library/`; tokens `packages/design-system/src/styles/tokens/`; compiled to `handoff/cena-platform/assets/haven.css`.

## Register calibration — internal coordinator, NOT patient

The single most important binding difference from the patient app: **persona register.** The patient app bound to calm / low-stimulation / large-tap-target / ~5th-grade / no-alarm-red. This app is the **opposite end** of the same DS:

- **Density:** the **compact clinician/coordinator density** (the patient app explicitly bound *away* from this). `data-table-compact`, dense rows, multi-column tables, information-rich screens a professional scans fast. Comfort-mode tap targets are not required.
- **Color:** full semantic palette **including** alarm/error register where it carries operational meaning — SLA breaches, order exceptions, overdue cutoffs legitimately use error/warning tone (the patient app's "no alarm-red" rule does NOT transfer; it was population-specific). Brand restraint still holds (teal reserved for commitments, sand surfaces).
- **Voice:** professional coordinator vocabulary — clinical/operational terms used directly (referral, distribution, cutoff, SLA, diagnosis code). NOT plain-language-simplified. Per-surface strings (slot 14) calibrate from the Platform brief, never the patient cohort.
- **Motion / icons / typography:** unchanged from the DS canon — restraint motion register, FA Pro v7.1.0 local (never CDN/MDI), Lora / Source Sans 3 / Source Code Pro.

## Coverage confirmation — coordinator-tool patterns (the gate)

Each flagged pattern → the PL components that satisfy it (all present in COMPONENT-INDEX). Verdict per pattern.

| Coordinator-tool pattern | PL coverage | Verdict |
|---|---|---|
| **Dense tables** | `data-table` + extensions (`data-table-striped`, `data-table-compact`, `cell-mono`, `row-clickable`, `data-table-sticky-cols`); `cell-primary`, `cell-numeric`, `section-header`, `detail-row`, `table-row-muted`, `table-section-divider`; `data-pagination`, `data-skeleton`, `data-empty-state` | ✅ covered |
| **Drill-down / relationship nav** | `nav-breadcrumb`, `layout-record-header`, `data-list-group` (action + trailing), `row-clickable`, `nav-tabs`, sidebar sub-nav (`sidebar-subnav-list/-item`), `complex-partner-list-item` | ✅ covered |
| **Pipeline / wizard flows** | `nav-stepper` (Preline HsStepper), `form-layout` (Stepped Form, vertical tab nav), `ProgressTracker` (agentic), `complex-pipeline-bar` (proportional viz) | ✅ covered |
| **Work queue / triage (Today)** | `queue-item` (`.is-urgent/.is-attention/.is-info`, SLA `.is-warning/.is-breached`; root `<button>` in `<li>` = the deep-link-into-entity card the IA needs), `queue-section-header`, `agentic-queue`, `clinical-alert-summary-row`, `clinical-alert-category`, `complex-notification-center` | ✅ covered |
| **Patient record (read-first, tabs)** | `layout-record-header`, `PatientSummary`, `clinical-patient-card/-row`, `clinical-timeline`, `kv-table`, `nav-tabs`, `clinical-metric-card`, `clinical-nutrition-list`, `clinical-ai-field`, `clinical-medication-row` | ✅ covered |
| **Intake / forms (single + bulk)** | full form suite: input/textarea/select, `forms-combobox`, `forms-datepicker`, `forms-tags-input`, `forms-file-upload` (bulk CSV), `forms-validation`, `form-layout` (stepped), `layout-field-row` | ✅ covered |
| **Reference tables (Clinical Library)** | `data-table`, `kv-table`, `data-accordion`, `data-list-group` | ✅ covered |
| **Toolbars / filter / search** | `toolbar` (`toolbar-search`), `toolbar-search` (`search-input`/`-icon`), `nav-filter-pills`, `nav-segmented-control`/`view-toggle`, `nav-stratification-bar` | ✅ covered |
| **Stat / dashboard glance** | `layout-stat-card`, `StatGroup`, `TrendChart`, `ComparisonBar`, `chart-containers` (no pie/donut — Tufte) | ✅ covered |
| **Overlays / confirm / context actions** | `overlay-modal`, `overlay-confirm-dialog`, `overlay-context-menu`, `overlay-dropdown`, `complex-command-palette` (Cmd-K global search/action) | ✅ covered |

## Gaps + decisions flagged at slot 5 (resolve before/at build, never improvise)

1. **Bulk-selection action bar** — *flagged composition, not a missing primitive.* The pattern "N selected · Archive · Export · Assign" (Patients roster J4, Diet Operations catalog, Network) is **composable from existing primitives**: row checkboxes (`form-checkbox`) + `layout-sticky-footer` (`sticky-footer-info` for the count, `sticky-footer-actions` for the verbs). **Decision:** build as a Tier-2 app composition for the first surface (Patients). It recurs across ≥2 surfaces, so it is a **promote-to-PL candidate** under the 3-use rule — promote to a PL composition entry (`bulk-action-bar`) once the second consumer confirms the same shape, via Tier-1 ceremony. Tracked, not improvised.
2. **App shell for a 7-anchor desktop-first tool** — *binding decision, not a gap.* The patient app composed `layout-app-shell-responsive` (sidebar ≥lg + bottom-nav <lg). The coordinator tool is desktop-first with a **persistent 7-anchor left nav + topbar** (global patient search + work-queue badge + user/role). **Decision:** resolve the concrete shell composition in `slots/_app/surface-shell-model.md` (step 0.8) — it is the referenced DS shell component, authored once, composed by every surface. Not hand-rolled (forbidden).
3. **`queue-item` urgency vs. patient-app calm register** — the `queue-item.is-urgent` red-left-border + SLA `.is-breached` register is **correct and wanted here** (operational urgency is real coordinator signal), unlike the patient app where it was suppressed. No change needed; noted so the register difference is intentional, not drift.

## Forbidden ad-hoc patterns (inherited)

- Hand-rolled nav/shell; inline styles; arbitrary-value utilities (promote to a named pattern); phantom classes with no backing token; regenerating equivalents of existing PL components.
- **Patient-app-only components** must NOT leak in: `layout-mobile-shell`, `mobile-bottom-nav`, `patient-*` cards, the calm/no-alarm register. This is a different persona on the same DS.

## Escape-hatch policy (inherited)

A genuinely-new pattern logs a follow-up to canonize it into the PL (no escape hatch without a return path). The 3-use rule governs promotion. Every escape hatch used in a surface is recorded in that surface's `components.md` (slot 17) and surfaced at retro.

**Verdict: PL coverage is sufficient to enter Phase 1. Zero blocking gaps. One promote-candidate composition (bulk-action-bar) and one shell-composition decision (step 0.8), both tracked above.**

Resolves: steps.md step 0.5 + the DS-coverage gate.
