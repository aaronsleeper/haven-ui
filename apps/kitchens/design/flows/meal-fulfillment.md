---
slot: 9
slot-name: flows
primary-author: Interaction Designer (drafted by Vault on Aaron's behalf 2026-06-09)
project: cena-uconn-kitchens-app
created: 2026-06-09
status: draft
consumes:
  - apps/kitchens/design/brief.md
  - apps/kitchens/design/ia.md
inputs-hash: null
---

# Flow — meal fulfillment (kitchens app, UConn MVP)

<!-- One flow document covering both stages (prep + packing/handoff) of the kitchens
     app. The two stages are sequential within a single shift / fulfillment cycle.
     Mirrors the precedent set by patient-side `flow-meal-ordering.md` in
     Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/flows/. -->

## Context

This flow picks up where the patient-side meal-ordering flow ends. When patients submit orders against the cap-17 weekly window, those orders accumulate as input to the kitchen. At a defined point (cadence TBD — see brief Open Questions), the kitchen begins prep. After prep, items are repackaged into per-patient boxes for the delivery party (TBD — DoorDash or similar).

The kitchen surface supports two stages of this fulfillment work:

1. **Prep stage** — produce the meals in aggregate (one bulk run for each item across all orders)
2. **Packing/handoff stage** — disassemble the bulk run into per-patient boxes and mark each ready for delivery pickup

## Happy path — task-beat level

Stable across UI revisions:

1. **Prep stage opens** (system event: kitchen window opens; cadence TBD)
2. **Staff sees aggregate prep list** — totals across all orders, grouped by item + modifier
3. **Staff prepares items**, working through the aggregate list
4. **Staff marks prep complete** for an item (or all items in a batch — see decision points)
5. **All items prepped → prep stage closes** (or staff explicitly advances)
6. **Packing stage opens** — per-patient boxes appear
7. **Staff assembles a box** for one patient (consulting that patient's packing slip)
8. **Staff marks box ready for handoff**
9. **All boxes ready → handoff event** (delivery party picks up; outside this surface)

The flow is linear at the macro level (prep → pack → handoff) but inside each stage, item-level / box-level work is parallel — staff can work multiple items or boxes concurrently as the kitchen physically produces them.

## Stage 1 — Prep

### Entry
The surface defaults to the prep stage when the kitchen's order window opens. URL: `/?stage=prep` (the default).

### State
Surface shows:
- **Period label** — what window these orders belong to ("orders due Wednesday delivery" — exact text dependent on cadence decision)
- **Aggregate item list** — each row: item name, total quantity needed, modifier groupings (e.g., "Meal A — 8 total · 6 standard · 2 no onions")
- **Per-item progress** — staff can mark each item "prepped" once that item's full quantity is produced

### Decision points
- **Whole-item-at-once vs per-portion progress?** Default: whole-item ("Meal A is done") — finer granularity is busy work. (Slot 11 wireframe confirms.)
- **Auto-advance to packing or explicit?** Default: explicit ("Move to packing" button when all items are 0-remaining). Reasoning: in a real kitchen, "all items prepped" may have edge cases (a re-do, a missed modifier) and the staff member should make the call.
- **What if a new order arrives mid-prep?** The aggregate updates. The surface shows a non-intrusive cue ("+2 orders added" badge or similar — slot 11 wireframe decision). The staff continues; the next pass picks up the new totals.

### Empty state
"No orders in prep yet." — should be rare during active shifts; mostly a between-shift state.

### Loading state
Surface should not block on data loading; show a skeleton of the expected layout. Real kitchen reality: staff glance at the surface mid-task; a spinner blocking content is wrong.

### Error states
- **Order ingestion failed** (no orders showing when there should be) — staff sees a calm message naming the issue + how to reach Cena ops (slack-or-call breadcrumb). Do not show a blank surface.
- **Update conflict** (two staff members marked the same item) — last write wins; non-intrusive toast.

### Transitions
- Prep stage → packing stage: triggered by staff "Move to packing" button OR auto-trigger when all items are 0-remaining (decision point above).
- Prep stage ↔ packing stage: staff can swap views during overlap (some items prepped, some not yet) — the URL query param `?stage=pack` is the navigation.

## Stage 2 — Packing / handoff

### Entry
From prep stage (above) OR direct URL load (`/?stage=pack` — staff member shift-handoff, etc.).

### State
Surface shows:
- **Per-patient packing slips** — one card per order; each card shows:
  - Patient last name only (PHI minimization — no first name)
  - Delivery address
  - List of items in this box (name + quantity; the items the patient ordered)
  - Delivery window
- **Pack progress** — staff marks each box "packed" as they assemble it
- **Handoff state** — once all boxes are packed, the surface shows "Ready for delivery pickup" + handoff signal (manifest print, mark-all-handed-off button — slot 11 decision)

### Decision points
- **Sort order for packing slips?** Default: by delivery window (earliest first); secondary sort by zone/route if multiple kitchens or delivery clusters exist (deferred for MVP — one kitchen, one route).
- **Print or screen-only?** Slot 11 wireframe decides; default assumption is screen-primary with a print-CSS pass for paper packing slips if staff wants them.
- **Re-pack flow if something is missing?** Defer to risk-strategy (slot 2) — what failure modes does the kitchen need recovery affordances for?

### Empty state
"No orders to pack yet." — appears when prep is in progress and no items are complete enough to pack.

### Error states
- **Order edited mid-prep** (patient cancellation, see cap-17 G6) — the order's card surfaces a calm "this changed" indicator and the new content; staff acks before continuing. Or — if the cutoff has passed — the order is locked from the patient's side and the card just shows the final content.
- **Packing slip data inconsistent** with prep totals (e.g., patient ordered 3 of Meal A but only 2 Meal A were prepped) — surface flags the discrepancy non-destructively.

### Transitions
- Packing stage → handoff complete: all boxes marked packed → staff confirms ready for pickup → surface shows post-handoff state (delivery party takes physical custody outside this surface).
- Post-handoff state → next-cycle prep: deferred until next ordering window opens.

## Branch points (Andrey's "what happens if X?" surface)

- **What happens if the kitchen partner doesn't have an item in stock?** The aggregate row needs an out-of-stock affordance OR the patient-app cap-17 surface needs upstream signaling. Out of MVP scope; cap-17 dependency.
- **What happens if a patient cancels mid-prep?** See packing-stage error state above; depends on G6 cutoff resolution.
- **What happens if a delivery driver is late and the boxes sit?** Out of this surface; cena-staff visibility surface should monitor.
- **What happens if the kitchen needs to substitute one item for another?** Out of MVP; would require patient-side approval flow.
- **What happens if the staff member loses connection mid-shift?** Last known state persists; surface restores on reconnect. Slot 16 (state-architecture) formalizes.

## Cross-app references

- **Upstream (input to this flow):** patient-side `flow-meal-ordering.md` (cap-17) — patient submits orders that arrive in this kitchen surface
- **Downstream (consumer of this flow's output):** delivery party (out of scope for haven-ui surfaces); cena-staff visibility surface (sibling brief — sees flow state for intervention)

## Open questions

Routed to slot 2 (risk-and-test-strategy), slot 11 (wireframes), and partner conversation:

- Cadence (daily / weekly / per-delivery-window) — affects period labeling + auto-advance behavior
- Order-ingestion mechanism (push, polling, manual refresh) — slot 16 state-arch
- Whether the packing-stage data should persist post-handoff for audit (today vs end-of-shift clear)
- Multi-shift handoff (morning prep team vs afternoon pack team) — deferred per brief
- Notification model for new orders arriving mid-prep — slot 11 + slot 13 (a11y for sound cues)

## References

- [[../brief]] — owns problem + scope + success criteria
- [[../ia]] — owns surface model + nav graph + entities + URL contracts
- [[../../../../../Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/flows/flow-meal-ordering]] — upstream patient-side flow
- [[../../../../../Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/cap-17-weekly-meal-ordering]] — capability spec with patient-side decisions
