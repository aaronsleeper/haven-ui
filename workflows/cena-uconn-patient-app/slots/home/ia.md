---
slot: 7
slot-name: information-architecture (per-slice — Home)
primary-author: IA Designer
project: cena-uconn-patient-app
surface: home
created: 2026-05-24
status: in-review
consumes:
  - slots/_app/trigger-map.md
  - slots/_app/surface-shell-model.md
inputs-hash: null
friction: []
pre-flight-authority: aaron
---

# Home — Information Architecture (per-surface)

Per-slice IA for the Home surface. **Consumes** the app-scoped trigger-map + shell model (does not re-derive nav). Home's composition, states, Surfacer behavior, and copy are owned by the prior `~/.claude/plans/patient-app-home-surface.md` (ratified — see below); this doc adds only the slot-7 specifics: where/how the surface is reached, its entities, and its nav graph.

## Ratification

Ratifies `patient-app-home-surface.md` (T1.2, 2026-05-24 — built + rendered, caught-up PASS) as the canonical Home design. Current. The build there is **superseded-pending**: visual reference until the fresh run ships a verified replacement.

## Where/how reached

- **Reached as:** the app root + the **Home tab** (first of 3: Home · Order · Activity). Default landing after the consent gate.
- **Not route-as-URL-only:** Home is also the **agent-surfacing position** — the Surfacer pushes cadenced work *into* Home rather than the patient navigating to each job. (surface-shell-model mode 1.)
- **First-run:** before consent (cap-12), Home does not render its steady-state furniture — a focused full-canvas consent moment renders instead (home-surface §3d; consent design owned by `flow-onboarding`).

## Entities surfaced on Home

(Content-level; see `slots/_app/content-model.md`.)
- **Greeting** ← Patient (name, local time).
- **Things-to-do (surfaced layer)** ← agent-pushed due items (assessment / recall / survey / order-reminder / appointment-nudge) admitted per the Surfacer rules (home-surface §4).
- **At-a-glance tiles (standing furniture)** ← Order/status + Budget (state-of-things, never state-of-you).
- **Entry affordances** ← My Health (from-Home door), Appointments (row).
- **Talk to a person** ← persistent human escalation.

## Nav graph (out-edges from Home)

| From Home element | Routes to | Trigger |
|---|---|---|
| Bottom tab: Order | Order surface | patient-pulled |
| Bottom tab: Activity | Activity surface | patient-pulled |
| Things-to-do focus card → primary action | the due job's surface (assessment runner / recall / Order / appointment request) | agent-surfaced |
| Things-to-do "Not now" | dismiss/snooze (stays on Home) | — |
| Order tile | Order surface | glance → pull |
| Budget tile | Order/budget detail | glance → pull |
| My Health door | My Health surface | patient-pulled |
| Appointments row | Appointments surface | patient-pulled |
| Talk to a person | human-escalation handoff | always-on |
| Account corner | settings/profile (EN/ES reserved) | always-on |

## URL contracts

Static-bundle target → states are separate pages (`home.caught-up.html`, `home.one-item.html`, `home.several.html`, + first-run consent). No client router; the bottom nav links across surfaces. (When a production framework binds at T0.1, these become routes; the contract here is the surface↔surface edge set, not URL strings.)

## C5 orientation pre-commit (feeds slot-19 acceptance)

A cold patient landing on Home should: (orientation) understand this is their care-program home and whether anything needs them now; (path) reach the single most-relevant due job in one tap, or feel calmly caught-up; (affordance) find "Talk to a person" without hunting. Pre-committed expected answers live in `acceptance.md`.
