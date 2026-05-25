# Steps — Cena × UConn Patient App

Slots picked from the canonical [slot-list](../../../../workflows/ui-development/slot-list.md), ordered for this engagement. Step anatomy per [workflow-spec](../../../../workflows/ui-development/workflow-spec.md) § Step anatomy. This run is **formative-first**: Phases 0–2 (below) produce all design/spec docs; Phase 3 (build) is downstream and gated on T0.1/T0.2.

## Phase 0 — app foundation (once per app)

| step | slot | expert | coordination | autonomy | gate-class | output |
|---|---|---|---|---|---|---|
| 0.1 | 1 brief | Product Strategist | human-gate | gate | blocking | `brief.md` |
| 0.2 | 2 risk-and-test-strategy | QA Lead | sequential | gate | blocking | `test-strategy.md` |
| 0.3 | 3 stack-declaration | Tech Lead | sequential | gate | blocking | `stack.md` |
| 0.4 | 4 framework-binding | Tech Lead | sequential | gate | blocking | `framework-binding.md` |
| 0.5 | 5 design-system-binding | DS Steward | sequential | gate | blocking | `ds-binding.md` |
| 0.6 | 7 (app-scoped) | IA Designer | sequential | gate | blocking | `slots/_app/trigger-map.md` + `surface-shell-model.md` |
| 0.7 | 8 content-model | Content Strategist | sequential | notify | blocking | `slots/_app/content-model.md` |
| 0.8 | 19 (gate-audit sub-step, app-wide) | QA Lead + clinical-care | fan-out | gate | blocking | `slots/_app/product-rule-gate-audit.md` |

Phase 0 is the formative spine. **No code may start until 0.1–0.8 pass** (and T0.1/T0.2 resolve).

## Phase 1 — per-surface formative design (×6 surfaces)

For each surface (Home, The Order, Check-ins, My Health, Appointments, Activity), in priority order:

| step | slot | expert | output |
|---|---|---|---|
| S.1 | 7 (per-slice) | IA Designer | `slots/<surface>/ia.md` (consumes app-scoped trigger-map) |
| S.2 | 9 flows | Interaction Designer | `slots/<surface>/flows/*.md` |
| S.3 | 10 state-and-transition-spec | Interaction Designer | `slots/<surface>/states.md` (gated) |
| S.4 | 11 wireframes | UX Designer | `slots/<surface>/wireframes/*.md` (gated; render-time assertions) |
| S.5 | 13 accessibility-spec | A11y Specialist | `slots/<surface>/a11y.md` |
| S.6 | 14 content-strings | Content Designer | `slots/<surface>/strings.md` |
| S.7 | 17 component-plan | Frontend Architect | `slots/<surface>/components.md` (new-vs-reuse vs PL) |
| S.8 | 19 acceptance-criteria | QA Lead | `slots/<surface>/acceptance.md` (+ flow-level C5; pre-build cognitive walkthrough) |
| S.9 | 20 test-plan | QA Lead | `slots/<surface>/test-plan.md` |

## Phase 2 — composition (Principle 16)

Orchestration via `skills/backlog-orchestrator` once >1 surface's formative set is complete: dependency analysis (serialize shared-primitive work — the haven design-system layer; parallelize independent surfaces), then drive the build backlog.

## Phase 3 — build + verify (downstream; gated on T0.1/T0.2)

Slots 21 build-tasks → 22 build-execute (+ render sub-step) → 23 slice-verify (+ render-verifier) → 24 code-review → 25 design-qa → 26 integration-verify → 27 a11y-audit → 29 responsive → **30 human cold render-and-look (non-waivable)** → 31 release-readiness → 34 retro. Target framework: static-HTML handoff bundle.

## Conditional / optional slots (declared in brief)

- 6 discovery-research — skip (population frame + 13 caps already discovered; documented in priors).
- 12 visual-direction — conditional; fires only where DS lacks coverage.
- 15 data-contracts — conditional (full-stack); deferred to T0.2 (Andrey).
- 18 prototype-novel-interactions — conditional (e.g., the Order pre-fill basket, the recall conversational runner).
- 28 performance-audit — conditional; patient app is client-facing → fires at build.
- 33 post-deploy-canary — prod only; deferred to deploy.
