# Steps — Cena Care-Coordinator Platform

Slots picked from the canonical [slot-list](../../../../workflows/ui-development/slot-list.md), ordered for this engagement. Step anatomy per [workflow-spec](../../../../workflows/ui-development/workflow-spec.md) § Step anatomy. This run is **formative-first**: Phase 0 is done (brief + app-IA); Phase 1 produces per-surface design docs ×7; Phase 2 composes; Phase 3 builds the whole app as Tier-A static HTML.

## Phase 0 — app foundation (DONE — ratify, do not re-derive)

| step | slot | status | artifact |
|---|---|---|---|
| 0.1 | 1 brief | ✅ done | `Knowledge/Projects/Cena Health/Apps/Platform/Redesign Brief.md` |
| 0.6 | 7 app-scoped IA | ✅ done, reviewed (Aaron L3) + validated (L1 mechanical, L2 cold findability) | `Knowledge/Projects/Cena Health/Apps/Platform/IA Synthesis.md` |
| — | 6 discovery | ✅ satisfied by current-state walk | `Knowledge/Projects/Cena Health/Apps/Platform/Current-State Inventory.md` |

Remaining Phase-0 sub-steps to ratify quickly before Phase 1 (cite the brief's `Bindings + variables`; produce a one-paragraph confirmation each, not a re-derivation):

| step | slot | expert | output |
|---|---|---|---|
| 0.3 | 3 stack-declaration | Tech Lead | `stack.md` — Tier-A static HTML resolved in brief; ratify |
| 0.4 | 4 framework-binding | Tech Lead | `framework-binding.md` — haven-ui PL HTML/CSS; ratify |
| 0.5 | 5 design-system-binding | DS Steward | `ds-binding.md` — bind to COMPONENT-INDEX.md; confirm coverage for coordinator-tool patterns (tables, queues, drill-down) |
| 0.7 | 8 content-model | Content Strategist | `slots/_app/content-model.md` — entities + relationships from the inventory (Org→Partner→Referral→Patient; Provider→Meal→Week→Distribution→Order) |
| 0.8 | 7 (app shell) | IA Designer | `slots/_app/surface-shell-model.md` + `trigger-map.md` — extract from IA Synthesis §3, §6 (ratify; the IA already contains both) |

> **DS coverage flag:** this is a dense internal tool (tables, bulk actions, pipeline/wizard flows, drill-down). Before Phase 1, the DS Steward confirms the PL covers these patterns. Any gap is flagged at slot 5, not improvised mid-build (Guardrail: never invent a class).

## Phase 1 — per-surface formative design (×7 surfaces)

For each surface (priority order: **Today → Patients → Referrals → Diet Operations → Network → Clinical Library → Admin**):

| step | slot | expert | output |
|---|---|---|---|
| S.1 | 7 (per-slice) | IA Designer | `slots/<surface>/ia.md` (consumes app-scoped IA + trigger-map; enumerate states) |
| S.2 | 9 flows | Interaction Designer | `slots/<surface>/flows/*.md` |
| S.3 | 10 state-and-transition-spec | Interaction Designer | `slots/<surface>/states.md` (gated) — the per-state enumeration that becomes the built HTML files |
| S.4 | 11 wireframes | UX Designer | `slots/<surface>/wireframes/*.md` (gated; render-time assertions) |
| S.5 | 13 accessibility-spec | A11y Specialist | `slots/<surface>/a11y.md` |
| S.6 | 14 content-strings | Content Designer | `slots/<surface>/strings.md` (professional coordinator voice, not patient-cohort copy) |
| S.7 | 17 component-plan | Frontend Architect | `slots/<surface>/components.md` (PL-reuse vs gap-flag) |
| S.8 | 19 acceptance-criteria | QA Lead | `slots/<surface>/acceptance.md` (+ cognitive walkthrough) |
| S.9 | 20 test-plan | QA Lead | `slots/<surface>/test-plan.md` |

## Phase 2 — composition (Principle 16)

Orchestration via `../../../../workflows/ui-development/skills/backlog-orchestrator.md` once >1 surface's formative set is complete: dependency analysis (serialize shared-primitive work — the haven shell + table/queue/drill-down primitives; parallelize independent surfaces), then drive the build backlog.

## Phase 3 — build + verify (Tier-A static HTML; NOT gated — see brief)

Build target: self-contained static-HTML handoff bundle into `handoff/cena-platform/<surface>/<surface>.<state>.html`.

Slots 21 build-tasks → 22 build-execute (+ render sub-step) → 23 slice-verify (+ render-verifier) → 24 code-review → 25 design-qa → 26 integration-verify → 27 a11y-audit → 29 responsive → **30 human cold render-and-look (non-waivable)** → 31 release-readiness → 34 retro.

> **Build is not gated on Andrey buy-in.** Per the brief, the Tier-A static-HTML emit is the DS-native artifact and proceeds now; Andrey sees the built UI *after* it exists, and the production-stack (React/Angular) ownership call is downstream of that. The only hard stop is the non-waivable human cold render-and-look (slot 30) before the run is called complete.

## Conditional / optional slots

- 2 risk-and-test-strategy — light; internal tool, no patient-facing clinical copy. Fold into per-surface test-plans (slot 20).
- 6 discovery-research — skip (current-state walk done).
- 12 visual-direction — conditional; fires only where the DS lacks coverage for a coordinator-tool pattern (flagged at slot 5).
- 15 data-contracts — conditional (full-stack); deferred (the static-HTML emit needs none; production data layer is Andrey's).
- 18 prototype-novel-interactions — conditional (e.g. the Today triage-card → entity deep-link; the Diet Operations connected-pipeline cross-links; the meal-distribution wizard).
- 28 performance-audit — conditional; fires at build if a surface (e.g. a large roster table) warrants it.
- 33 post-deploy-canary — prod only; N/A for the static-HTML handoff.
