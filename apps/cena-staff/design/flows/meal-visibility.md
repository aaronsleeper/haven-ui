---
slot: 9
slot-name: flows
project: cena-uconn-cena-staff-meal-flow
created: 2026-06-09
status: draft
consumes:
  - apps/cena-staff/design/brief.md
  - apps/cena-staff/design/ia.md
inputs-hash: null
---

# Flow — meal-flow visibility (cena-staff)

## Context

The cena-staff meal-flow visibility surface is a periodic-scan + drill-in pattern. Staff visits on a cadence (morning, after lunch, end-of-day), reads cohort meal-flow health at a glance, drills into per-patient state when an exception surfaces or when a specific patient needs attention.

The flow is intentionally simple — read state, drill in, return — because the load-bearing complexity lives in the **signal-vs-noise discipline** of the view itself (which patients surface visibly; which recede), not in multi-step interaction sequences.

## Happy path

1. **Staff visits `/meals`** (clicks Meals tab in providers/platform top nav)
2. **Cohort view loads** with default "This week" tab active
3. **Staff scans the cohort** — exceptions at top, active orders mid, completed orders dimmed/collapsed at bottom
4. **Routine state confirms healthy** → staff closes the tab, returns later
5. **OR — exception surfaces** → staff clicks the affected patient row
6. **Per-patient drill-in opens** at `/meals/<patient-id>` — full meal-flow state visible (order placed/not, kitchen prep state, packing state, delivery state, exception detail)
7. **Staff takes context-appropriate action** (calls patient, messages kitchen, routes to colleague — action affordances are deferred to next slice; MVP drill-in surfaces state + routes-to-owner only)
8. **Staff returns to cohort view** (back nav)

## Decision points

- **Exception surfacing threshold.** When does a patient surface as an "exception" vs stay in routine state? Defaults for MVP:
  - **No order placed when one was expected** (patient is in active cohort + ordering window has opened + no order recorded) — surface as exception
  - **Kitchen flagged dietary mismatch** (kitchen-app surfaces an item flag) — surface as exception
  - **Delivery failed** (delivery party reports failed delivery) — surface as exception
  - **Late order edit attempted** (patient tried to edit after G6 cutoff) — surface as exception (lower priority — patient saw the cutoff message; staff visibility for awareness)
- **Order edits during ordering window** (within G6 cutoff) — do NOT surface; staff doesn't need to see every edit, just the exceptional state.
- **Routine completions** — orders that placed, prepped, packed, delivered without exception — visible in cohort view but dimmed; not pulling attention.

## States

### Default (cohort view)
- Exception rows at top (amber/coral accent)
- Active-order rows middle (neutral)
- Completed rows at bottom (sand-300 dimmed; collapsed-by-default if >10 completions to reduce scroll)

### Empty (no patients in cohort)
"No patients in the UConn cohort yet." — should be rare; mostly a setup state.

### Loading
Skeleton rows mirroring the cohort layout; no spinner.

### Error — data source unavailable
Banner: "Meal-flow data isn't fully loading. Patient data may be stale. {detail}. Reach engineering on Slack #{channel}." Shows last-known-good state below; staff isn't blocked from drilling into known records.

### Filtered (Exceptions tab)
Same layout but only exception rows; routine + completed are hidden. Tab is visually distinct (count badge: "Exceptions (3)").

### Drill-in default
Per-patient meal-flow timeline view:
- Order (placed at / placed by / cart contents / total / cutoff status)
- Prep state (timestamped from kitchen-app data)
- Packing state (timestamped)
- Delivery state (timestamped if available)
- Exception detail at top if applicable (what was detected, when)
- "Owner" / escalation route label (who handles this — clinical coordinator? RD? ops? — placeholder for MVP, real routing in next slice)

### Drill-in — no exceptions
Same layout, no exception detail card; staff can verify state-as-expected.

## Branch points (what-happens-if)

- **What if a patient is in multiple cohorts (future multi-pilot)?** Out of MVP scope.
- **What if a kitchen flags an item AFTER it's been packed?** Late-flag handling — surface in drill-in with a "flagged after pack" note; staff judges intervention.
- **What if the staff is offline / network blip mid-drill-in?** Last-known-good state shows; refresh affordance prominent.
- **What if two staff members are looking at the same exception?** No conflict (read surface); both can drill in independently. When action affordances land (next slice), this becomes a real concern.

## Cross-app references

- **Upstream:** patient-app cap-17 (order placement data); kitchens-app (prep + packing data); delivery party (delivery state — outside our surfaces)
- **Downstream:** action affordances from drill-in (next slice; route to call, message, escalate)

## Open questions

Routed to slot 11 + slot 15 + Cena-internal:

- **Order edit (within cutoff) visibility:** show all edits in drill-in timeline, or only the final state? Default: only final state; edit history is in audit trail, not the visibility surface.
- **Exception age:** does an exception "age out" after some time? E.g., a 3-day-old missed order — does it still surface? Default: yes, until resolved or manually dismissed; surfaces stay visible until staff acts.
- **Escalation route data source.** Where does "owner" / "handles this" come from — patient record? Capability metadata? Hardcoded? Slot 15.

## References

- [[../brief]]
- [[../ia]]
- [[../../kitchens/design/flows/meal-fulfillment]] — sibling kitchens flow; data source
- [[../../../../../Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/cap-17-weekly-meal-ordering]] — patient-side
