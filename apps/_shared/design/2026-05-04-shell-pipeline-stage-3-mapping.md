# Stage 3: Component Mapping — Universal Shell Pipeline

**Date:** 2026-05-04
**Pipeline stage:** Stage 3 (haven-mapper) — complete
**Input:** 17 wireframes (Stage 2 output)
**Output:** 5 component-map files + 2 new-component spec files
**Next stage:** Stage 4 (dev-tasker)

---

## Component Inventory Delta

### Totals across all 5 apps

| Category | Count |
|----------|-------|
| Existing components mapped | 137 (across all 5 maps; some appear in multiple apps) |
| Unique existing components used | ~48 distinct semantic classes |
| New components required | 3 items: 2 primitives/variants + 1 composition |
| Utility-only patterns (no new class) | 13 |
| Unexpected gaps (triggering Gap Gate pause) | 0 |

### Per-app summary

| App | Map file | Existing | New | Utility-only |
|-----|----------|----------|-----|-------------|
| Universal shell | `apps/_shared/design/component-map-universal-shell.md` | 22 | 0 | 4 |
| Care coordinator | `apps/care-coordinator/design/component-map-shell-pipeline.md` | 30 | 0 | 3 |
| Patient | `apps/patient/design/component-map-shell-pipeline.md` | 35 | 0 | 5 |
| Kitchen | `apps/_shared/design/wireframes/kitchen/component-map.md` | 22 | 2 | 3 |
| Provider | `apps/_shared/design/wireframes/provider/component-map.md` | 28 | 1 | 2 |

### New components: confirmed and spec'd

| Component | Tier | App | Spec file |
|-----------|------|-----|-----------|
| `packing-slip` + child classes | Tier 1 novel primitive | Kitchen | `apps/_shared/design/new-components/packing-slip.md` |
| `thread-approval-card.is-clinical` + `thread-approval-ncp` + `thread-approval-icd` | Tier 1 variant on existing primitive | Provider | `apps/_shared/design/new-components/thread-approval-card-is-clinical.md` |
| `[NEW COMPOSITION: status-grouped queue header]` — `is-status-*` modifiers on `queue-section-header` | Tier 1 inline PL extension | Kitchen | No separate spec file — extends existing `queue-section-header` PL fragment |

> Both new-component specs were pre-approved at the Gap Gate before Stage 3 began. No unexpected gaps surfaced during mapping. Gap Gate was NOT re-triggered during Stage 3.

---

## Wireframe Verdicts: All 17

### Universal (1 wireframe)

| Wireframe | Verdict | Notes |
|-----------|---------|-------|
| `shell-universal-agentic.md` | CLEAN MAPPING | 22 existing components; 0 new |

### Care Coordinator (3 wireframes)

| Wireframe | Verdict | Notes |
|-----------|---------|-------|
| `cc-shell-flow.md` | CLEAN MAPPING | Shell flow; uses existing `agentic-shell` + `panel-splitter` |
| `shell-cc-coordinator.md` | CLEAN MAPPING | Full shell; all existing primitives including `thread-approval-card` variants |
| `cc-01-queue-with-care-plan-approval.md` | CLEAN MAPPING | Worked example; uses `thread-approval-card.is-urgent` (ships in existing PL) |

### Patient (7 wireframes)

| Wireframe | Verdict | Notes |
|-----------|---------|-------|
| `pt-shell-flow.md` | CLEAN MAPPING | Mobile shell flow; `mobile-shell` + `mobile-bottom-nav` |
| `shell-pt-mobile.md` | CLEAN MAPPING | Full mobile shell; `mobile-i18n-bar` for dual-language affordance |
| `pt-01-dashboard.md` | CLEAN MAPPING | `delivery-status-card` + `task-card` + `trend-card`; all existing |
| `pt-02-messages.md` | CLEAN MAPPING | `thread-panel` with patient allowlist; allowlist config is data/server concern, not new class |
| `pt-03-settings.md` | CLEAN MAPPING | Settings form; `field-row` + existing form primitives |
| `pt-04-my-health.md` | CLEAN MAPPING | `trend-chart` + `clinical-metric-card`; all existing |
| `pt-05-care.md` | CLEAN MAPPING | `assessment-header` + `task-card`; all existing |

### Kitchen (3 wireframes)

| Wireframe | Verdict | Notes |
|-----------|---------|-------|
| `kt-shell-flow.md` | CLEAN MAPPING | Shell flow; no new components at flow level |
| `shell-kt-kitchen.md` | NEEDS NEW COMPONENT | Status-grouped queue sections require `is-status-*` modifiers on `queue-section-header` |
| `kt-01-orders-with-packing-slip.md` | NEEDS NEW COMPONENT | `packing-slip` primitive required for center pane order view |

### Provider (3 wireframes)

| Wireframe | Verdict | Notes |
|-----------|---------|-------|
| `pv-shell-flow.md` | CLEAN MAPPING | Shell flow; no new components at flow level |
| `shell-pv-provider.md` | NEEDS NEW COMPONENT | `thread-approval-card.is-clinical` required in right pane |
| `pv-01-patient-record-with-clinical-decision.md` | NEEDS NEW COMPONENT | `thread-approval-card.is-clinical` (full anatomy) + `thread-approval-ncp` + `thread-approval-icd` |

**Summary:** 13 CLEAN MAPPING / 4 NEEDS NEW COMPONENT / 0 NEEDS CLARIFICATION / 0 UNEXPECTED GAPS

---

## New-Component Spec Summaries

### `packing-slip`

- **Full spec:** `apps/_shared/design/new-components/packing-slip.md`
- **Root element:** `<article class="packing-slip">` — semantic article (self-contained kitchen order unit)
- **Key classes:** `packing-slip-header`, `packing-slip-allergens`, `packing-slip-allergen-flag`, `packing-slip-meals`, `packing-slip-meal`, `packing-slip-instructions`
- **Allergen flag treatment:** rose family (`bg-rose-16` / `text-rose-04` / `border-rose-14`) — safety-critical; 32px+ tall; UPPERCASE label; `fa-triangle-exclamation` leading icon
- **Dark mode:** mandatory; allergen flags use `dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400` — WCAG AAA required (not just AA) for safety-critical surface
- **4-expert panel trigger:** allergen dark mode contrast (accessibility reviewer focus); patient data minimization (IA reviewer focus — never expose MRN or clinical data at kitchen surface)
- **Build prerequisite:** kitchen app restoration (`git mv archive/inactive-apps/kitchen apps/kitchen`)

### `thread-approval-card.is-clinical`

- **Full spec:** `apps/_shared/design/new-components/thread-approval-card-is-clinical.md`
- **Modifier class:** `.is-clinical` on existing `thread-approval-card` — teal-50 surface / teal-600 left border
- **New classes added:** `thread-approval-ncp` (NCP PES + codes `<dl>`), `thread-approval-icd` (ICD-10 `<ul>`)
- **Icon:** `fa-stethoscope` (clinical identity; replaces coordinator's `fa-hand`)
- **Primary action:** "Sign & approve" with `fa-pen-fancy` — clinical commitment framing vs. coordinator's "Approve" (endorsement)
- **Action ordering:** NN/G dangerous-UX separation: primary → secondary → ghost (disabled) → destructive (16px gap before Reject)
- **Undo window:** 10 seconds (vs. coordinator's 5s — Gate 2 decision 1; clinical audit-trail / billing implications)
- **Dark mode:** mandatory; full `.dark` block in CSS definition
- **4-expert panel trigger:** clinical voice ("Sign & approve" framing); ICD code screen-reader cadence; teal as clinical trust signal (not alarm)
- **Build prerequisite:** provider app restoration (`git mv archive/inactive-apps/provider apps/provider`)

---

## 4-Expert Panel Triggers

Two moments where the 4-expert panel is required before a PL fragment ships:

### Moment 1: `packing-slip` PL fragment

**Trigger:** Tier 1 novel primitive, brand-fidelity-weighted.

| Expert | Focus |
|--------|-------|
| Pattern-library steward | Semantic class hierarchy; `<article>` root decision; allergen flag as inline block vs. separate component |
| Information architecture | Patient data minimization discipline at kitchen surface (first name + last initial only; no MRN); allergen flag render order (safety-first, never collapsed) |
| Accessibility | WCAG AAA for allergen flags (safety-critical surface); `role="list"` on allergen container; gloved-hand touch targets (56px+ for kitchen status buttons) |
| Brand fidelity | Rose family for allergen flags (alarm/safety) vs. rose as decorative; sand-100 envelope surface (warm operational vs. clinical cold white); uppercase allergen labels (convention vs. brand voice) |

### Moment 2: `thread-approval-card.is-clinical` PL fragment

**Trigger:** Tier 1 variant on existing primitive, brand-fidelity-weighted.

| Expert | Focus |
|--------|-------|
| Pattern-library steward | Variant modifier pattern (`.is-clinical` class vs. new HTML file); `thread-approval-ncp` + `thread-approval-icd` as PL semantic classes vs. provider-only carve-out |
| Information architecture | NCP block + ICD block scan order; clinical density without overwhelming; "Edit first" center-pane coordination pattern |
| Accessibility | `<dl>` for NCP codes; ICD code pronunciation in `font-mono`; `hidden` attribute on reject note (not CSS); 10s undo toast `aria-live` |
| Brand fidelity | "Sign & approve" vs. "Approve" — clinical commitment framing; teal as trust (not alarm); `fa-stethoscope` brand posture; Ava dot in clinical context (subtle leading, not chrome-level) |

---

## Build Sequencing Recommendation

The Stage 3 mapping confirms the build sequence from Gate 1 / Gate 2 decisions. Recommended order:

1. **Universal shell PL adoption** — `agentic-shell` + `panel-splitter` wired to existing apps
   - No new PL fragments needed
   - Unblocks: care coordinator + patient agentic-shell upgrade

2. **Care coordinator agentic-shell upgrade** (Tier 2 slice composition)
   - All components exist in PL
   - `shell-cc-coordinator` + `cc-01` composable immediately
   - Route via `dev-tasker` → build

3. **Patient routes** (Tier 2 slice composition)
   - All components exist in PL
   - 5 routes (`pt-01` through `pt-05`) + mobile shell
   - Route via `dev-tasker` → build

4. **Kitchen PL work** (Tier 1 before Tier 2)
   - Step 4a: `packing-slip` PL fragment + 4-expert panel + `ui-react-porter`
   - Step 4b: `queue-section-header` `is-status-*` PL extension + `ui-react-porter`
   - Step 4c: `git mv archive/inactive-apps/kitchen apps/kitchen`
   - Step 4d: Compose `shell-kt-kitchen` + `kt-01` via `dev-tasker` → build

5. **Provider PL work** (Tier 1 before Tier 2)
   - Step 5a: `thread-approval-card.is-clinical` PL variant + 4-expert panel + `ui-react-porter`
   - Step 5b: `git mv archive/inactive-apps/provider apps/provider`
   - Step 5c: Compose `shell-pv-provider` + `pv-01` via `dev-tasker` → build

> Kitchen and Provider steps (4 and 5) are independent of each other and can parallelize if two build tracks are available.

---

## Gate 3 Questions for Aaron

Before Stage 4 (dev-tasker) proceeds, confirm:

**Q1 — Build sequencing priority:** Start with coordinator agentic-shell upgrade, or patient routes, or both in parallel? Both apps have 0 new PL fragments needed so either is ready to route to dev-tasker immediately.

**Q2 — Kitchen + Provider PL work timing:** Should the 4-expert panel for `packing-slip` and `thread-approval-card.is-clinical` run now (before dev-tasker for kitchen/provider), or defer until kitchen/provider apps are explicitly scheduled? The specs are complete; the panel can run as soon as Aaron wants to advance those apps.

**Q3 — `queue-section-header.is-status-*` extension scope:** The kitchen shell needs 6 `is-status-*` modifiers on `queue-section-header` (pending / prepping / packed / quality_checked / dispatched / delivered). Should this be a flat list of 6 modifier classes in `components.css`, or a single `is-status` modifier with a CSS custom property for the color family? Flat 6 is simpler to author; custom property is more flexible if additional statuses are anticipated.

**Q4 — Patient thread allowlist:** The `pt-02-messages` wireframe uses `thread-panel` with a strict patient allowlist (no `tool_call`, no `agent_tool_*`). The allowlist is currently a server-first + client-backstop pattern (defense-in-depth). Confirm this configuration lives in the app's data-binding layer (not a new CSS class), and that the server-side filter is the blocking gate at launch.

---

## Files Produced in Stage 3

### Component maps (5)

- `apps/_shared/design/component-map-universal-shell.md` — universal shell
- `apps/care-coordinator/design/component-map-shell-pipeline.md` — coordinator (supersedes 2026-03-27 map for this pipeline pass)
- `apps/patient/design/component-map-shell-pipeline.md` — patient (supersedes 2026-03-12 map for this pipeline pass)
- `apps/_shared/design/wireframes/kitchen/component-map.md` — kitchen
- `apps/_shared/design/wireframes/provider/component-map.md` — provider

### New-component specs (2)

- `apps/_shared/design/new-components/packing-slip.md`
- `apps/_shared/design/new-components/thread-approval-card-is-clinical.md`

### This summary (1)

- `apps/_shared/design/2026-05-04-shell-pipeline-stage-3-mapping.md`

All 7 files live in `_shared/design/` or in their respective app `design/` directories. Kitchen and provider new-component specs live in `_shared/` because both apps are archived at `archive/inactive-apps/`.

---

## Stage 3 Sign-off

Stage 3 mapping is complete. All 17 wireframes are mapped. Two new-component specs are authored. No unexpected gaps. Both specs are ready to feed the 4-expert panel and then Stage 4 (dev-tasker) when Aaron advances kitchen and provider.

The coordinator and patient apps have zero PL gaps and are ready to route to dev-tasker (Stage 4) immediately.
