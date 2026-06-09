---
slot: 7
slot-name: information-architecture
primary-author: IA Designer (drafted by Vault on Aaron's behalf 2026-06-09)
project: cena-uconn-cena-staff-meal-flow
created: 2026-06-09
status: draft
consumes:
  - apps/cena-staff/design/brief.md
mode: per-slice (the cena-staff app's app-scoped IA is owned upstream by the providers/platform app; this brief contributes one capability surface within it)
inputs-hash: null
---

# IA — cena-staff meal-flow visibility surface (UConn)

<!-- Slot 7 deliverable. Unlike the kitchens app (where slot 7 was both
     app-scoped AND per-slice because the app was fresh), this brief contributes
     ONE capability surface within the existing providers/platform app. The
     app-scoped IA is owned upstream by the providers/platform app's existing
     architecture. This document defines THE MEAL-FLOW SURFACE within that app. -->

## Use case inventory

Drawn from the brief's success criteria. Three load-bearing jobs:

| ID | Job | User | Trigger | Stage |
|---|---|---|---|---|
| CS-001 | Read meal-flow health for the cohort | Cena staff | Periodic check (morning, after lunch) | Visibility |
| CS-002 | Drill into per-patient meal-flow state | Cena staff | Exception surfaces OR staff checks specific patient | Drill-in |
| CS-003 | Route an exception to the right owner | Cena staff | Exception detected → who handles | Escalation |

CS-001 + CS-002 are the load-bearing pair (visibility + drill-in). CS-003 is the exception-routing concern that earns explicit IA attention because the brief flags escalation routing as a load-bearing decision.

## Trigger taxonomy

Differs from both patient app (patient-pulled) and kitchens app (staff-pulled-at-shift). Cena staff trigger:

- **Periodic scan** (CS-001): staff visits the surface on a cadence — morning, after lunch, end-of-day. Surface must be glanceable enough that a 30-second scan answers "is the meal flow healthy?"
- **Exception-driven** (CS-001 → CS-002): an exception in the cohort view pulls staff attention to a specific patient. Surface design must make exceptions surface visibly without burying them in routine state.
- **Patient-specific** (CS-002): staff already has a patient in focus (from another capability surface in the cena-staff app) and wants to see their meal-flow state. Entry point is patient-record → meals tab, not from the meal-flow surface itself.

## Surface shell model

**Shell paradigm:** integrates into the existing providers/platform app shell — NOT a new shell. The providers/platform app already has a top-level navigation pattern; the meal-flow surface mounts as a new "Meals" tab in that nav (per the brief's default assumption — confirm at discovery-research slot 6).

Persistent chrome (inherited from providers/platform):
- Top nav with capability tabs (existing) — meal-flow surfaces as "Meals"
- Left sidebar with patient roster context if applicable (existing providers/platform pattern)
- User chrome (existing)

This surface contributes:
- A primary cohort view at `/meals` (or equivalent route per providers/platform conventions)
- A per-patient drill-in at `/meals/<patient-id>` (or a modal/drawer overlay — slot 11 decision)

## Nav graph

Within the meal-flow surface:

```
/meals  (cohort view — CS-001)
├── default tab: This week (current ordering window)
├── tab: Exceptions only (filtered view; for CS-001 → CS-002 acceleration)
└── /meals/<patient-id>  (drill-in for one patient — CS-002)
    └── from drill-in: escalation routing affordance (CS-003)
```

One primary route with two tabs (full cohort + filtered-to-exceptions) and a drill-in route. Tabs are the URL query param or hash; drill-in is its own route for shareability (a staff member can share a link to a patient's meal-flow state with a colleague).

## Entities

- **Patient meal-flow state** — derived view across three data sources:
  - From cap-17 patient app: order placement (placed / not-placed / cancelled) + cart contents + timing
  - From kitchens app: prep state (not-started / prepping / done) + packing state (ready-to-pack / packed / out-for-delivery)
  - From delivery party (out-of-scope for our surfaces but landed here as future input): delivery state (in-transit / delivered / failed)
- **Exception** — derived; a patient meal-flow state that needs staff attention. Types: no-order-when-expected, dietary-mismatch-flagged-by-kitchen, delivery-failed, late-order-edit-attempted (G6 cutoff).
- **Cohort** — UConn pilot patients for MVP; one cohort. Future: multi-pilot.

PHI boundary: full patient identity is shown (name, dietary selections, clinical context) — Cena staff are authorized custodians. This is the inverse of the kitchens app's PHI-minimization posture and the design must visually distinguish the two (subtle but real — e.g., the providers/platform shell vs the kitchens app's no-sidebar shell).

## URL contracts

- `/meals` — cohort view, default "This week" tab
- `/meals?tab=exceptions` — exceptions-only filter
- `/meals/<patient-id>` — per-patient drill-in
- Other routes within the providers/platform app remain owned by the app, not by this brief.

## Sort + filter + state behavior

Cohort view default sort:
1. **Exceptions first** (descending by recency / severity)
2. Then **active orders** (placed, in-flight) by delivery window
3. Then **completed orders** (delivered, no exceptions) — visually dimmed; collapsed by default if cohort is large

This pre-sorting IS the signal-vs-noise discipline. The brief's "actionable signal not notification-fatigue" requirement lives here: exceptions surface; routine state recedes.

## Open questions

Routed to slot 9 (flows), slot 11 (wireframes), slot 15 (data-contracts), and Cena-internal conversation:

- **Tab vs filter UI.** Two tabs (This week / Exceptions) vs one view with a filter chip. Slot 11 decides; tabs default.
- **Drill-in: route vs drawer vs modal.** Route gives shareability + back-button; drawer keeps context; modal is the worst of both. Default: route + drawer-on-tablet. Slot 11 confirms.
- **Exception severity model.** Are all exceptions equal-weight, or is there a tiered severity (critical / warning / info)? Affects sort order + visual treatment. Default for MVP: binary (exception vs routine); slot 9 flows confirm.
- **Cross-capability rollup.** Out of scope for this brief, but the IA leaves room: a future top-level "exceptions across all capabilities" view consumes from meal-flow + other capability surfaces. Don't design against it; don't preclude it.
- **Multi-pilot future-proofing.** Cohort entity should accommodate multi-pilot at the data layer; v1 surface scopes to one cohort.
- **Action affordances from drill-in.** Brief defers to next slice. IA leaves room: drill-in has a "Take action" affordance slot at the bottom that's empty at MVP and grows when staff workflow patterns clarify.

## References

- [[brief]] (sibling slot-1)
- [[../../../../Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/cap-17-weekly-meal-ordering]] — patient-side data source
- `Lab/haven-ui/apps/kitchens/design/ia.md` — sibling IA for the upstream data source on the kitchen side
- [[../../../../.claude/plans/uconn-meal-flow-build]] — parent plan
