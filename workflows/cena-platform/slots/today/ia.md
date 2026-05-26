---
slot: 7
slot-name: information-architecture (per-surface — Today)
primary-author: IA Designer
project: cena-platform
surface: today
created: 2026-05-26
status: in-review
consumes:
  - slots/_app/trigger-map.md
  - slots/_app/surface-shell-model.md
  - slots/_app/content-model.md
---

# Today — Information Architecture (per-surface)

Per-surface IA for **Today**, the triage launchpad + landing surface. Consumes the app-scoped trigger-map + shell model (does not re-derive nav). Today is the single biggest IA move: it gives the four **pushed** job-classes (trigger-map) a home, replacing the current app's vanity-count dashboard.

## What Today is (and is not)

- **Is:** a prioritized **triage launchpad** — pushed work as actionable cards grouped by type + urgency, each **deep-linking into the entity where the work is done**.
- **Is not:** where work completes. Today is discovery + routing (Layer-2 refinement: launchpad, not workspace). The coordinator acts *in* the entity (patient record, that order, that distribution).
- **Replaces:** the four-tile vanity-count dashboard. Counts become a secondary glance, subordinate to actionable items.

## Where/how reached

- **Reached as:** app root + the **Today nav anchor** (first of 7). Default landing.
- **Work-queue badge:** the Today nav-item carries a count of pending pushed items; mirrored in the topbar.
- **Pushed-into, not navigated-per-job:** the system surfaces cadenced work *into* Today rather than the coordinator visiting four separate tables to discover it.

## Entities surfaced on Today (the four queue groups)

(Content-level; see `slots/_app/content-model.md` + `trigger-map.md`.)

| Queue group | Source entity | Deep-links into | Job |
|---|---|---|---|
| **Patient alerts** | Clinical Alert (fires on Patient) | Patient record | J1 |
| **Pending referrals** | Referral (partner sent) | Referral → convert flow | J6 |
| **Order exceptions** | Kitchen Order (fulfillment exception) | that Kitchen Order (Diet Operations) | J11 |
| **Due: cutoffs / distributions** | Weekly Plan / Distribution (date-driven) | that Weekly Plan / Distribution (Diet Operations) | J8/J10 |

## Nav graph (out-edges from Today)

| From Today element | Routes to | Trigger |
|---|---|---|
| Patient-alert card | Patient record (the flagged patient) | agent-pushed → act in entity |
| Pending-referral card | Referrals (that referral, convert-ready) | agent-pushed |
| Order-exception card | Diet Operations (that Kitchen Order) | agent-pushed |
| Due cutoff/distribution card | Diet Operations (that Weekly Plan / Distribution) | agent-pushed |
| Sidebar anchors (7) | their surfaces | coordinator-pulled |
| Topbar patient search | Patients (matched patient record) | pulled |

## URL / page contract (static-bundle targets)

States are separate pages under `handoff/cena-platform/today/`:
- `today.queue.html` — populated triage launchpad (the hero; all four groups, urgency-sorted)
- `today.caught-up.html` — all queues clear

System states (loading / error) specified in `states.md`; built as pages only if warranted at build (lean default: the two content pages). No client router; cards + sidebar link across surfaces (the surface↔surface edge set is the contract, not URL strings — when a production framework binds, these become routes).

## Cognitive-walkthrough pre-commit (feeds acceptance.md)

A coordinator landing on Today at start-of-day should: (orientation) see in one glance whether anything needs them and what's most urgent; (path) reach the single most-urgent item's entity in one click; (affordance) tell pushed work apart from standing navigation without hunting. Pre-committed expected answers live in `acceptance.md`.
