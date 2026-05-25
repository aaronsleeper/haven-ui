# Context budget — Cena × UConn Patient App

Per [workflow-spec](../../../../workflows/ui-development/workflow-spec.md) § Context passing. Shared context loads once per step; expert context loads selectively. Budget rule: a single step ≤ ~1,400 lines expert context + shared.

## Shared context (loads once per step)

- This instance README (commander's intent, priority stack, variables)
- The relevant canonical spec slice (slot contract from slot-list + the principles it names)
- `DESIGN.md` brand spec + `COMPONENT-INDEX.md` (ds-binding work)
- The population frame (HIV+/food-insecure, low-tech-literacy, ESL, sensitive — non-negotiable)

## Per-phase loading profiles

| Phase / slot | Primary inputs (minimum viable) | Priors ratified (reference, don't re-derive) |
|---|---|---|
| 0.1 brief | Capability matrix (cap IDs), population frame | `patient-app-readiness.md`, `patient-app-ia-v1.md` |
| 0.2 test-strategy | brief, AI-slop list (principles §9) | prior slice panel-verdicts |
| 0.3–0.5 stack/framework/ds | brief, DESIGN.md, COMPONENT-INDEX, handoff AGENTS.md | `feedback_ownership_bar_over_language`, handoff bundle conventions |
| 0.6 app-scoped IA | all patient cap notes, population frame | `patient-app-ia-v1.md`, `trigger-entry-point-map.md`, `surface-primary-shell-model.md` (validated) |
| 0.7 content-model | IA, cap notes, voice/tone from DESIGN.md | flow docs |
| 0.8 gate-audit | all patient caps, acceptance owners | `ui-workflow-patient-gate-audit.md`, `ui-workflow-meal-ordering-gate-map.md` |
| S.* per-surface | app-scoped IA, the surface's flow doc(s), content-model, states template | `patient-app-home-surface.md` (Home), `flow-*.md` (per surface), `apps/patient/design/*` (Check-ins wireframe started) |

## Anti-contamination (Principle 4)

Verify/review steps (Phase 3 slots 23, 24, 30) load **only deliverable artifacts** — never an implementer's reasoning trace. Fresh-context agent instances fill reviewer roles. Not yet exercised (Phase 0–1 are formative).
