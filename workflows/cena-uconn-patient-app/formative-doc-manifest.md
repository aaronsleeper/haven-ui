---
slot: meta
project: cena-uconn-patient-app
created: 2026-05-24
status: in-progress
consumes: []
---

# Formative-doc manifest — Cena × UConn Patient App

The complete set of documents that must exist **before any code is written** for the whole patient app, in dependency order, with status. This is what the pipeline means by "design is distributed and upstream of build" (slots 1–20 are formative; 21–22 are code). It exists so the **scope is legible** — there are ~60 formative docs across the app, not one homepage.

## How to read

- **Status:** `done` (authored this run) · `ratify` (a validated prior exists; this run confirms it still holds + records the ratification, cheap) · `draft` (started, needs finishing) · `pending` (not started) · `blocked` (waits on an external decision).
- **Prior:** the reference-only evidence a slot ratifies or supersedes. Priors are **never** authoritative `consumes:` — every slot produces its own gated deliverable.
- **Gate:** `blocking` slots hard-fail release-readiness if unrun (Principle 14).

## Phase 0 — app foundation (once per app) · 8 docs

| # | Slot | Doc | Status | Prior to ratify | Gate |
|---|---|---|---|---|---|
| 0.1 | 1 brief | `brief.md` | done | `patient-app-readiness.md` | blocking |
| 0.2 | 2 risk-and-test-strategy | `test-strategy.md` | done | prior slice panel-verdicts | blocking |
| 0.3 | 3 stack-declaration | `stack.md` | done | `feedback_ownership_bar_over_language`; handoff README | blocking |
| 0.4 | 4 framework-binding | `framework-binding.md` | done | handoff `AGENTS.md` (closed-vocab, render gate, no-Preline) | blocking |
| 0.5 | 5 design-system-binding | `ds-binding.md` | done | `DESIGN.md`, `COMPONENT-INDEX.md` | blocking |
| 0.6 | 7 app-scoped IA | `slots/_app/trigger-map.md` | done | `trigger-entry-point-map.md` (validated) | blocking |
| 0.6 | 7 app-scoped IA | `slots/_app/surface-shell-model.md` | done | `surface-primary-shell-model.md`, `patient-app-ia-v1.md` (validated) | blocking |
| 0.7 | 8 content-model | `slots/_app/content-model.md` | done | flow docs; `DESIGN.md` voice | blocking |
| 0.8 | 19 gate-audit (app-wide) | `slots/_app/product-rule-gate-audit.md` | done | `ui-workflow-patient-gate-audit.md`, `ui-workflow-meal-ordering-gate-map.md` | blocking |

## Phase 1 — per-surface formative design · 6 surfaces × 9 slots = 54 docs

Surfaces (from the validated IA), in build-priority order. Per surface: ia · flows · states · wireframes · a11y · strings · components · acceptance · test-plan.

### Surface priority + rationale

1. **Home** — linchpin; every patient's entry; agent Surfacer lives here. Design furthest along (`patient-app-home-surface.md`).
2. **The Order** — core recurring job (cap-17/18); highest patient value; backend pre-fill model.
3. **Check-ins** — clinical moments (cap-07/08/09); chat-primary inside the moment; clinical-accuracy gated; partly built (assessments slice).
4. **Onboarding/consent** — cap-12 gate; blocks the app; treat as a Home first-run state + its own flow.
5. **My Health** — outcomes logging (cap-20); promoted-from-Home; partly built (log-outcome slice).
6. **Appointments** — request-only v1 (cap-21); row not tab; lightest.
7. **Activity** — reminders/messages (cap-22); read-list-that-routes; lightest.

(Escalation / Talk-to-a-person (cap-27) + budget reconciliation (cap-39/40/41) + bilingual (cap-19, EN-only v1) + ordering-channels (cap-23, off-app) are cross-cutting — handled inside the surfaces they touch, per the IA, not as standalone surfaces.)

### Per-surface doc grid (status)

| Surface | 7 ia | 9 flows | 10 states | 11 wireframes | 13 a11y | 14 strings | 17 components | 19 acceptance | 20 test-plan |
|---|---|---|---|---|---|---|---|---|---|
| Home | done | ratify | done | draft | pending | draft | pending | pending | pending |
| The Order | pending | ratify | pending | pending | pending | pending | pending | pending | pending |
| Check-ins | pending | ratify | pending | draft(prior) | pending | pending | pending | pending | pending |
| Onboarding | pending | ratify | pending | pending | pending | pending | pending | pending | pending |
| My Health | pending | ratify | pending | pending | pending | pending | pending | pending | pending |
| Appointments | pending | ratify | pending | pending | pending | pending | pending | pending | pending |
| Activity | pending | ratify | pending | pending | pending | pending | pending | pending | pending |

Flow priors (slot 9, ratify — recompose against the surface-primary shell model since their "shell context" sections are stale):
`flow-greeting` (Home) · `flow-onboarding` (Onboarding) · `flow-meal-ordering` + `flow-order-status` (Order) · `flow-take-assessment` + `flow-dietary-recall` (Check-ins) · `flow-log-outcome` (My Health) · `flow-request-appointment` (Appointments) · `flow-notifications` + `flow-respond-to-cc` (Activity) · `flow-talk-to-person` (cross-cutting).

## Phase 2 — composition (Principle 16) · orchestration capability, not a doc

`skills/backlog-orchestrator` consumes the surface backlog, serializes shared-primitive (design-system) work, parallelizes independent surfaces. Runs when ≥2 surfaces' formative sets are complete.

## Phase 3 — build + verify (downstream; NOT formative) · gated

Per surface: build-tasks (21) · build-execute + render sub-step (22) · slice-verify + render-verifier (23) · code-review (24) · design-qa (25) · integration-verify (26) · a11y-audit (27) · perf-audit (28) · responsive (29) · **human cold render-and-look (30, non-waivable)** · release-readiness (31). **Blocked on T0.1 (stack/ownership) + T0.2 (data layer)** — Andrey/Vanessa.

## Tally

- **~62 formative docs before any patient-app code.** Phase 0 (8) is authored this run; Phase 1 (54) is the per-surface fan-out, partially landed this run (see review-queue-AM).
- The point Aaron made, made concrete: the homepage is **1 of 54** per-surface docs, downstream of **8** app-foundation docs. Code is Phase 3.
