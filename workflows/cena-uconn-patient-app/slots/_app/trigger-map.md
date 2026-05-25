---
slot: 7
slot-name: information-architecture (app-scoped)
primary-author: IA Designer
project: cena-uconn-patient-app
created: 2026-05-24
status: in-review
consumes:
  - brief.md#target-users
  - brief.md#scope-fences
inputs-hash: null
friction: []
pre-flight-authority: aaron
---

# App-scoped IA — Trigger Map

The load-bearing, stable layer of the app-scoped IA (slot-7 app-mode, runs once per app, upstream of per-slice IA). Commits to **triggers + interaction-types** — what initiates each job — not nav placement, which stays volatile while Athena/telehealth/ordering boundaries settle. Per-surface `ia.md` and `flows/*.md` **consume** this; they do not re-derive it.

## Ratification (fresh-process)

This deliverable **ratifies** the validated prior `~/.claude/plans/ui-workflow-ia-synthesis/trigger-entry-point-map.md` (findability-validated 2026-05-23; pre-committed falsification did not fire — the trigger taxonomy held). Confirmed still current as of 2026-05-24. It is reproduced here as the engagement's canonical slot-7 artifact, with cap IDs reconciled against `Capability matrix.md`. No trigger reclassified.

## Trigger taxonomy (the load-bearing column)

- **agent-pushed** (cadenced/event) — the agent surfaces it when due; the patient does not navigate to it. No nav anchor; needs a "things for you to do" surfacing on Home.
- **patient-pulled** (on-demand) — the patient reaches for it cold; needs a wayfinding anchor.
- **one-time** — first-run/onboarding; out of steady-state nav.
- **always-on / cross-cutting** — persistent or settings; lives in chrome / account corner.

## The map

| Job (cap) | Trigger | Interaction-type | Needs wayfinding anchor? |
|---|---|---|---|
| Weekly meal ordering (17/18/40) | patient-pulled + agent-surfaced when menu opens | browse / transact | **YES — primary anchor (Order tab)** |
| Budget visibility (18/39/40/41) | always-on (reflected in Order + Home tile) | glance | reflected, not its own anchor |
| Delivery/pickup status (37/38) | patient-pulled ("where's my order") + agent-pushed updates | read / status | light — inside Order + a Home glance tile (F5: go-look primary) |
| Ordering channels / off-app (23) | off-app (phone/assisted) | — | reconciled into the budget meter so it balances |
| Food preferences (16) | patient-pulled (set once / edit) + onboarding | form | light — reachable from Order/Account |
| Assessments (07) | agent-pushed (M0/3/6/9) | form | no (surfaced in "to do") |
| Dietary recall (08) | agent-pushed (M0/6/9) | agent-led **structured interview** over a record (never an empty chat field) | no |
| Satisfaction surveys (09) | agent-pushed (M3/6/9) | form | no |
| Self-reported outcomes (20) | patient-pulled (ad-hoc) + agent-prompted | form | light — on-demand (My Health from-Home door) |
| Appointment request (21) | agent-surfaced when session due + patient-pulled | form / request | light — on-demand (Appointments row) |
| Notifications / messages (22/11) | always-on | read / list | **YES — Activity tab** (F4: cold reviewers go-look for an inbox) |
| IRB consent (12) | one-time (onboarding) | form | no (first-run gate) |
| Bilingual / language (19) | always-on cross-cutting | setting | account corner (EN-only v1; ES slot reserved) |
| Greeting / routing (Home) | app root | converse + glance | **IS Home** |
| Talk to a person (27 patient-initiated path) | always-on escalation | — | **persistent chrome affordance, visibly human** |

## What the map commits

- **Patient-pulled jobs that earn an anchor:** Home, **Order** (core self-directed; status reachable inside — F5), **Activity** (the F4-validated inbox/messages destination, named "Activity" per the Aaron-anchored ia-v1), an **Account** corner, and a **persistent "Talk to a person"** (F3: visibly human). My Health + Appointments are **on-demand doors promoted from Home**, not standing nav slots (F6 guard — do not re-inflate to a 5–6 item destination nav).
- **Agent-pushed jobs** (assessments, recall, surveys, scheduling-when-due) surface into Home's "things to do" — this is where agents-first manifests on the patient surface without the screen being a chat window.
- **The one converse surface** (dietary recall) is an agent-led structured interview over a record — surface-primary even at its most conversational.

## Reconciliation note (define-once)

The 2026-05-23 prior used "Inbox" for the cap-22 destination and described a "~4-anchor" set; the 2026-05-24 Aaron-anchored `patient-app-ia-v1.md` names it **"Activity"** and commits a **3-tab bottom nav (Home · Order · Activity)**. These are the same structure at different resolution: **Activity = the F4 inbox anchor**; My Health + Appointments are the F6 on-demand doors (not tabs). The newer, Aaron-anchored naming **wins** (nav labels + tab count); the shell-model's agent-mode + shell-fit detail is consumed in `surface-shell-model.md`. One canonical answer; no parallel nav vocabularies.

## Maintenance contract

Update a row only when a job's **trigger** changes (agent-pushed ↔ patient-pulled — the load-bearing column) or a boundary resolves (Athena scheduling read/write, telehealth remote, Angular-ordering shipping, B3 push categories). Placement/labels settle post-pilot. Honest limit: same-model findability agreement is weak corroboration; F1/F2/F3 survive it, F6 does not — revisit F6 on a cross-model or human-proxy signal.
