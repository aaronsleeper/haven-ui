---
slot: 7
slot-name: information-architecture
primary-author: IA Designer (drafted by Vault on Aaron's behalf 2026-06-09)
project: cena-uconn-kitchens-app
created: 2026-06-09
status: draft
consumes:
  - apps/kitchens/design/brief.md
mode: app-scoped + per-slice (kitchens MVP is small enough to collapse both into one doc)
inputs-hash: null
---

# IA — kitchens app (UConn MVP)

<!-- Slot 7 deliverable. Combines app-scoped IA (trigger-map + surface-shell-model)
     with per-slice IA (route + entities + nav graph) because the kitchens MVP scope
     is small enough that splitting them is ceremony. If the app grows past 3-4
     surfaces, refactor into separate trigger-map.md + surface-shell-model.md per
     the canonical pipeline pattern (see ~/.claude/plans/ui-workflow-ia-synthesis/
     for the patient-app precedent). -->

## Use case inventory

Drawn from the brief's success criteria + scope fences. Three load-bearing jobs:

| ID | Job | User | Trigger | Stage |
|---|---|---|---|---|
| KIT-001 | See what we need to prep | Kitchen staff | Walk-up at start of shift / between orders | Prep |
| KIT-002 | Mark prep progress (only where it gates downstream) | Kitchen staff | Item completed → reach for status toggle | Prep |
| KIT-003 | Assemble per-patient boxes for handoff | Kitchen staff | Prep complete → packing stage starts | Packing/Handoff |

Out of scope (per brief): patient-name on prep view (PHI), food images (cap-17 G12), delivery driver coordination, kitchen menu authoring, historical reporting.

## Trigger taxonomy

The patient-app's IA used a trigger taxonomy of agent-pushed vs patient-pulled. The kitchens app inverts this — the staff member is the operator, not the receiver. Every job is **staff-pulled at the start of a work block**: they walk up to the station, see the surface, act on what's there.

This collapses to a single decision: **there is one canonical surface they look at**, and it must answer all three jobs in one view OR a tightly-related view set. Multi-tab "find your view" navigation is the wrong shape for a kitchen — they don't have time to wayfind.

## Surface shell model

**Shell paradigm:** operational dashboard. Non-agentic (no Ava avatar, no chat, no approval cards — this is operator territory, see brief). Single content region with internal stage-switching, NOT multi-route navigation.

**Persistent chrome:**

- Top bar: Cena brand mark + current-period label (e.g., "Orders due Wednesday delivery" — cadence TBD; brief Open Questions) + kitchen identity (one kitchen for MVP)
- No left sidebar at MVP (single primary surface; sidebar earns its place when there's a real second surface to navigate to)
- No bottom nav

**Content region:** stage-switched view of today's work. Two stages exposed to the staff member:

- **Prep stage** — aggregate totals (KIT-001) + progress toggles where they gate handoff (KIT-002)
- **Packing/handoff stage** — per-patient boxes (KIT-003)

Stage-switch is a **header tab pattern** inside the content region, NOT separate routes — the staff member's mental model is "two halves of the same job," not "two different pages."

**Why this is the right shell shape:**

- The agentic shell (used by the patient app) is wrong here — the staff member is doing a task, not collaborating with an agent.
- A traditional multi-route app (sidebar + many pages) implies a wayfinding burden the kitchen environment can't absorb (wet hands, busy shift, glance-and-go).
- A single-route stage-switched surface keeps the mental model collapsed: "this is the work surface."

## Nav graph

```
/  (root → defaults to prep stage)
├── ?stage=prep   (default; KIT-001 + KIT-002)
└── ?stage=pack   (KIT-003)
```

One route. Stage is a URL query param so the staff member can bookmark or share the packing view if shift-handoff demands it. No deep linking beyond the two stages at MVP.

## Entities (data shape, for slot 15 to formalize)

- **Order** — comes from cap-17 patient-side; identified by an opaque ID (not by patient identity); carries: list of items, special-request annotations (e.g., "no onions"), packing destination (last name + delivery address, redacted at prep stage), delivery-window timestamp, status.
- **Item** — a meal selection; carries name, quantity, modifier annotations (special requests), order linkage.
- **Aggregate** — derived view; for the prep stage, groups items across all orders by name + modifier so the staff member sees "8× Meal A, 7× Meal B, 2× Meal A (no onions)" rather than per-order rows.

PHI boundary: at the prep stage, no order is shown by patient identity; items collapse to aggregates. At the packing stage, orders re-resolve to per-patient packing slips with last name + delivery address; the meal-content of each slip is still operationally necessary (the packer needs to know what to put in the box) and is bounded by "what the patient ordered for delivery" — same shape as a restaurant ticket.

## URL contracts

- `/?stage=prep` — prep stage (default)
- `/?stage=pack` — packing/handoff stage
- No other routes at MVP. Future-proofing: settings, history, multi-kitchen all live behind routes that don't exist today.

## Open questions

Routed to slot 9 (flows) + slot 15 (data contracts) + partner conversation:

- **Stage-switch UX.** Tabs at top of content region (header pattern) vs segmented control vs split-view (both visible simultaneously). Defer to slot 11 wireframes with a flagged assumption that tabs are the v1 pick.
- **Special-request grouping.** Should "8× Meal A" and "2× Meal A (no onions)" be visually nested (one Meal A entry with a sub-row for the modifier) or sibling rows (two distinct Meal A entries)? Slot 11 decision.
- **"Done" state for the prep view.** When all aggregates are 0-remaining, does the surface auto-switch to packing? Show a "ready to pack" affordance? Stay manual?
- **What about an order that arrives mid-prep?** The aggregates need to update. UI cue for "new since you started" without becoming a notification trap.
- **Permanence of pack-stage data.** After delivery, does the packing view stay accessible for the day (audit trail)? Or clear at end-of-shift?

## References

- [[brief]] (sibling slot-1 brief — owns problem, users, success criteria, scope, constraints)
- [[../../../../Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/cap-17-weekly-meal-ordering]] — patient-side meal flow this IA receives orders from
- [[~/.claude/plans/ui-workflow-ia-synthesis]] — patient-app precedent for app-scoped IA work (more elaborate; kitchens collapses it because scope is smaller)
- [[~/.claude/plans/uconn-meal-flow-build]] — parent plan
