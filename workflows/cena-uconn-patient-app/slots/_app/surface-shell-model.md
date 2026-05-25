---
slot: 7
slot-name: information-architecture (app-scoped)
primary-author: IA Designer
project: cena-uconn-patient-app
created: 2026-05-24
status: in-review
consumes:
  - slots/_app/trigger-map.md
  - brief.md#scope-fences
inputs-hash: null
friction: []
pre-flight-authority: aaron
---

# App-scoped IA — Surface + Shell Model

The shell layer of the app-scoped IA. Owns: the shell paradigm, persistent chrome / wayfinding set, the agent's modes, and per-surface shell-fit. Consumes `trigger-map.md`. Per-surface `ia.md`/`flows`/`wireframes` **reference** this for shell-fit; they own per-surface interaction design (define-once).

## Ratification + reconciliation (fresh-process)

Ratifies the validated priors `surface-primary-shell-model.md` (2026-05-23) and `patient-app-ia-v1.md` (Aaron-anchored 2026-05-24). Where they differ on nav vocabulary, the newer Aaron-anchored ia-v1 wins (see trigger-map § Reconciliation). Confirmed current 2026-05-24.

## The paradigm in one breath

**Surface-primary, agent-assisted.** The app is a small set of full-canvas **surfaces** (a menu grid, a form, a status view, a structured interview). A persistent **agent** works *around* them — surfaces cadenced work, assists on demand, and conducts one structured interview. Chat is primary **only inside** program-pushed clinical moments; everywhere else, direct manipulation. The whole screen is never a chat window. (Agents-first is the org thesis — agents do the work — NOT a UI claim. See `project_cena_patient_surface_primary`.)

## Navigation — 3-tab bottom bar (Aaron-anchored)

**Home · Order · Activity** (mobile-first; 3 = the right ceiling for low-tech-literacy). A tab is earned only by a patient-pulled, recurring job.

- **My Health** — promoted *from Home* with full dignity (a real patient-owned surface), **not a tab** (dark most weeks; mostly agent-prompted). Watch usage; promote to a tab only if it proves patient-pulled-recurring.
- **Appointments** — a *row* reachable from Home/Activity, **not a tab**, until the Athena boundary (B7) resolves.
- **Global affordances (every surface, outside tabs):** "Talk to a person" (always, never agent-gated, visibly human); minimal **Account** corner (header; EN-only v1 → ES slot reserved, no toggle yet).
- **Possible further collapse (watch):** Activity may fold into Home (one place for "what now"); left a tab v1, revisit.

## The agent's three modes

1. **Surfacer (load-bearing).** Cadenced/event jobs are not nav destinations — the agent surfaces them into Home's **"things for you to do"** region when due. This is agents-first on the patient surface. (Home-surface design owns the admission/ordering/throttle behavior, slot S.* for Home.)
2. **Assistant (dockable).** On any surface the agent is **summonable, not omnipresent** — a collapsible dock, not the canvas. Edits surface state from natural language ("swap the chicken"), answers questions. Two paths always available (talk to the agent OR direct controls); the surface is the working record (`chat-affordance-principles.md`).
3. **Interviewer (one surface only).** Dietary recall — the agent drives a paced turn-by-turn structured interview over the canonical food-list record. Most agent-led surface, still structured-over-a-record, never a free-text chat box.

## Persistent chrome / wayfinding set

| Chrome element | What it is | Why chrome |
|---|---|---|
| **Home** (tab) | greeting + "things for you to do" (agent-surfaced) + at-a-glance tiles (order/status, budget) | front door + agent-surfacing region |
| **Order** (tab) | menu grid + cart + budget meter; status reachable inside | the one core patient-pulled job |
| **Activity** (tab) | notifications + messages list that routes into source surfaces | F4: patients go-look for "what did I miss" |
| **Talk to a person** | persistent, visibly-human escalation | reachable anywhere; must NOT read as a chatbot doorway (F3) |
| **Account corner** | settings incl. language EN/ES (reserved), profile | always-on cross-cutting; corner, not nav |
| **Agent summon** | the dockable assistant affordance | every surface; collapses to free the canvas |

**On-demand, NOT standing nav (F6 guard):** outcomes-logging (20) and appointment-request (21) reach via agent surfacing, a Home quick-action, or agent summon — promoted-from-Home doors, no nav cost. Do not re-inflate to a 5–6 item destination nav.

## Per-surface shell-fit

Shell-fit verdict only; per-surface interaction design is canonical in the linked flow (define-once).

| Surface (cap) | Interaction-type | Shell-fit | Agent mode | Flow doc |
|---|---|---|---|---|
| Home / greeting | converse + glance | greeting + "things to do" + at-a-glance tiles | Surfacer | flow-greeting |
| Meal ordering (17/18/40) | browse / transact | **full-canvas** menu grid + cart + budget meter | Assistant (dockable) | flow-meal-ordering |
| Order status (37/38) | read / status | status card/timeline inside the Order area | Assistant (can push) | flow-order-status |
| Assessments (07) | form | full-canvas form runner; save-and-resume | Surfacer | flow-take-assessment |
| Dietary recall (08) | agent-led structured interview | agent drives; canonical food-list is the working surface; chips/voice/pick-from-list — never an empty chat field | Interviewer | flow-dietary-recall |
| Satisfaction survey (09) | form | full-canvas form | Surfacer | flow-take-assessment (survey variant) |
| Outcomes logging (20) | form | light logging form; on-demand (My Health door) | Surfacer + Assistant | flow-log-outcome |
| Appointment request (21) | form / request | request form → Athena; on-demand (Appointments row) | Surfacer (when due) | flow-request-appointment |
| Activity / notifications (22/11) | read / list | inbox list surface that routes | Surfacer feeds it | flow-notifications, flow-respond-to-cc |
| IRB consent (12) | form | full-canvas consent ack; one-time first-run | — | flow-onboarding |
| Language (19) | setting | account-corner toggle (EN-only v1) | — | (cross-cutting) |
| Talk to a person (27) | escalation | persistent chrome affordance, visibly human | hands off to human | flow-talk-to-person |

## Desktop vs mobile

- **Mobile (primary):** surface-first viewport; agent summonable as a sheet; Home's "things to do" is the launch point. Recall: agent-led interview takes the viewport with the food-list as a full-screen sheet.
- **Desktop (reflow):** surface canvas + **dockable** agent (collapsible side panel, not a fixed center pane) + slim persistent chrome. The pre-pivot three-pane agent-chat-center is retired. (`layout-app-shell-responsive` is the DS realization.)

## Escalation — agent-behavior requirement, NOT nav (anchored 2026-05-24)

Distress signals inside agent-driven flows (sensitive assessment answers, alarming free-form notes — cap-27) are a **detection-and-active-routing** requirement: the agent conducting the flow must escalate; a passive "Talk to a person" button does **not** cover the agent-detected case. The global button stays as the *patient-initiated* path; the *agent-detected* path is an open **agent-behavior spec** — **highest-stakes gap → Vanessa.** Not a UI nav element.

## The one assumption to validate with pilot users

The organizing seam — "patients self-initiate the commerce jobs" — is load-bearing. If this population *waits to be pushed* even for ordering, the seam softens and the agent drives more. **Pilot question:** do patients open the app to order, or wait for the nudge? Doesn't block build (the backend-pre-filled basket already hedges toward "push"); tells us if the rationale needs rewriting.

## Maintenance contract

Update when a surface's interaction-type changes, a new surface appears, or a boundary resolves (Athena scheduling, telehealth join — cap-15 latent, not modeled until the remote-vs-in-person contract resolves; Angular-ordering shipping). Wireframes/build reference this for shell-fit; flows own per-surface interaction design.
