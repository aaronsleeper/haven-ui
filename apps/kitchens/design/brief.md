---
slot: 1
slot-name: brief
primary-author: Product Strategist (drafted by Vault on Aaron's behalf 2026-06-09)
project: cena-uconn-kitchens-app
created: 2026-06-09
status: draft
consumes: []
inputs-hash: null
friction: []
pre-flight-authority: aaron
---

# Brief — Cena × UConn kitchens app

<!-- Owner: Aaron (Cena product). Slot 1 entry artifact for the kitchens-app track of the UConn meal-flow build.
     This brief was authored after a 2026-06-09 process-realignment that retired an expert-direct wireframe
     attempt (UCONN-KITCHENS-01.md) which had skipped the canonical pipeline. The kitchens app has no upstream
     artifacts yet — this brief is the foundation for slots 2–11 (risk strategy, stack, IA, content model,
     flows, states, wireframes). -->

## Problem statement

The kitchens-app surface does not exist today. When patient meal orders arrive (cap-17 patient-side meal-ordering flow, ~9 rendered pages shipped 2026-05-16), there is no operational surface for the kitchen partner to see those orders, prep them in aggregate, and hand them off for packing + delivery. Today's coordination is implicit and would not survive contact with a real kitchen running real shifts.

The 2026-06-09 working session with Andrey reframed the constraint: build the **minimum operational surface that lets the kitchen do its job without becoming the data-entry choke point that killed our previous kitchen-partner integration** (Fire by Forge declined the contract 2026-05-27; among the symptoms across that engagement: kitchen staff barely entered data, didn't toggle statuses, renamed records instead of creating new ones). The kitchens app must require interactions only when those interactions gate downstream action.

## Target users

- **Primary:** Kitchen staff at Greens 'n' Things (Sarah is the contact; in conversation with Vanessa as of 2026-06-09, contract not finalized). Treat as one role for MVP — likely a working prep cook / packer / shift lead composite — unless evidence demands separation. The staff member's job is running the kitchen, not data entry to Cena software.
- **Secondary:** Cena staff (visibility into kitchen state via the providers/platform surface — out of scope for this brief; separate cena-staff brief follows).
- **Not the target:** Patients (their flow is patient-app cap-17, separate surface); delivery drivers (delivery party is TBD — DoorDash or similar; out of scope for this surface).

## Success criteria

- [ ] Kitchen staff can see all current orders without any data entry to find them (no logins-to-poll, no manual refresh discipline; the surface is the work surface).
- [ ] Prep-stage view shows **totals across all orders** — e.g., "8× Meal A, 7× Meal B, 2× Meal A (no onions)" — NOT a list of per-patient identity. PHI minimization principle: share only what's required and nothing more; patient name + low-sugar selections could derive PHI even with last name only.
- [ ] Packing/delivery-handoff view shows **per-patient packing slips** with patient last name + delivery address per box. This is a DIFFERENT use case from the prep view — separated by stage, not collapsed into one screen.
- [ ] No staff data-entry burden on fields that don't drive product behavior. Status interactions are required only when status change gates a downstream action (e.g., "packed" gates the delivery handoff). Decorative status toggles are forbidden.
- [ ] Pages contain **no food images** — name + description + quantity only. (Andrey constraint 2026-06-09 — see cap-17 Decisions log + gate-map G12.)
- [ ] Surface is operable from a counter laptop or tablet propped near the prep station (desktop-primary, tablet-supported; not mobile-first like the patient app).
- [ ] Andrey accepts the shipped chrome as **canon** he can build on top of, NOT a redesign candidate at next slice. Same lock-in constraint as the parent meal-flow plan.

## Scope fences

### In scope

- Kitchen sees incoming patient orders for the current ordering period (cadence TBD — see Open questions)
- Kitchen prep workflow: aggregate totals view; mark prep-stage progress (only where progress gates downstream action)
- Kitchen packing workflow: per-patient packing slips with last name + delivery address (no first name; no full identity; no patient-specific menu details that could derive PHI)
- Handoff from kitchen to delivery party — the surface that signals "ready for pickup / delivery driver" (delivery party itself out of scope)

### Out of scope

- Delivery handler integration (DoorDash, in-house drivers, etc.) — that's a separate party + a separate surface
- Patient-name display on prep view (PHI minimization)
- Patient-side menu management (Andrey adds meals manually per cap-17 — that's a cena-staff or Andrey-only surface, not kitchens)
- Food images on meal cards (cap-17 G12)
- Kitchen menu authoring (kitchen partner may suggest meals upstream but they don't author in our software)
- Mobile-primary layout (the kitchen runs on a counter laptop / tablet; mobile is not the design center)
- Multi-kitchen tenancy (one kitchen for MVP)
- Historical reporting / analytics / past-order browsing (operational surface only at MVP)
- Inventory management

### Deferred (next slice)

- Real-time order arrival notifications (push, sound, etc.) — defer until staff usage patterns clarify what works in kitchen acoustics
- Patient-specific dietary alerts visible to kitchen staff — defer until product-rule decisions land on what is required vs PHI-leaking
- Multi-shift handoff (morning prep → afternoon packing) — defer until staffing model from Greens 'n' Things is clear
- Cancellations / order edits flowing through to kitchen surface — depends on cap-17 G6 cutoff resolution

## Constraints

### Technical

- Patient-side meal flow ships in the agentic shell at ≥1440px (cap-17 slice-2). Kitchens app uses a non-agentic operational shell (no Ava avatar, no chat, no approval cards — staff are operators).
- Production target stack is Angular (per Cena platform — `Lab/cena-health-spark/`). Haven-ui spec ships HTML; Andrey ports.
- Pages must produce inter-page navigation (the patient-side handoff bundle does this — kitchens follows that pattern; see [[flow-view-andrey-legible-artifact]] context on inter-page-linking).

### Brand

- Haven design system (per Cena brand canon v2 — teal / sand / amber palette; Lora display + Source Sans 3 body; FA Pro icons; no Material Icons / emoji icons).
- No food images (Andrey constraint).
- Tone: operational, calm, no decorative chrome; the surface should "look more like a paper prep sheet than a CRM" (Aaron, 2026-06-09).

### Regulatory / compliance

- **PHI minimization is load-bearing.** Patient name + dietary selections together could derive PHI even at first-name level; surface only what the operational use case requires.
- Kitchen staff are not direct PHI custodians under our control — the surface design assumes any patient identifier shown could be observed by a non-Cena staff member (kitchen back-of-house is a porous environment).
- WCAG 2.2 AA floor (haven default); kitchen ergonomics may need higher target-size minimums (cooks may have wet hands, work fast, use a touch screen at distance — surface-area sizing should reflect this).

### Time

- UConn pilot is the parent goal; Andrey requested "fully done" meal flow as the next slice. No hard external deadline named at the time of this brief; pacing is "ship one well-built persona-flow at a time" not "ship by date X."
- Greens 'n' Things contract is the gating dependency for real-stakeholder validation. Brief can proceed in parallel with contract; final acceptance criteria for staff workflows wait on Sarah's input.

### Budget

- Internal build; no external budget. Aaron + agents primary author; Andrey reviews + Angular-ports.

## Conditional + optional slot declarations

- `discovery-research` (slot 6): **conditional-required** — at minimum a structured conversation with Sarah at Greens 'n' Things before slot 11 (wireframes) fires. The FBF lessons are an input; they are not a substitute for talking to the partner who will actually use the surface.
- `visual-direction` (slot 12): **skip** — Haven design system covers the operational-surface needs; no new visual direction work.
- `prototype-novel-interactions` (slot 18): **conditional** — may apply if the prep-totals view surfaces a novel-enough interaction (e.g., the special-request grouping pattern); evaluate after wireframes.
- `data-contracts` (slot 15): **required** — full-stack work; order data flowing from cap-17 patient orders → kitchens app needs a contract.
- `performance-audit` (slot 28): **skip** — internal operational tool; not public-facing.
- `responsive-cross-browser` (slot 29): **conditional** — desktop-primary; if tablet is named as a real use case in slot 7 IA, this flips to required.
- `human-exploratory` (slot 30): **required** — even though the staff are not patients, they're the real users and the friction surface is high; a structured task-based walkthrough with Sarah (or equivalent staff member) before release is non-waivable.

## Open questions

Routed to slot 2 (risk-and-test-strategy), slot 6 (discovery-research), or partner conversation. Aaron + Andrey + Vanessa + Sarah inputs needed:

- **Order cadence.** Is the kitchen taking orders daily, weekly batched, or some other rhythm? Affects whether the "current orders" view is "today's list" vs "this week" vs "next delivery batch." (Currently flagged in the spike as "current" not "today's.")
- **Order ingestion mechanism.** Push notification, polling refresh, manual refresh button? Tied to acoustic + workflow reality at Greens 'n' Things.
- **Roles.** One staff role for MVP, or shift lead / prep / packer split? Default to one role unless evidence demands separation; revisit at slot 7 IA.
- **Multi-kitchen support.** One kitchen for MVP confirmed in scope fence above. Future-proofing the data model is separate from surfacing multi-kitchen in v1 IA.
- **Order-change post-submission.** When a patient cancels or edits an order (cap-17 G6 cutoff resolution), how does the kitchen surface reflect that — silent backend update, visible notification, manual reconcile?
- **Delivery handoff signal.** When orders are packed and ready for delivery driver, what's the signal — print a manifest, mark each order, both?
- **Special-request handling.** "2× Meal A (no onions)" needs to flow from patient-side selections through to a prep-aggregated view AND to per-patient packing slips. Data shape needs slot 15 (data-contracts) attention.
- **Visibility for Cena staff.** Out of scope for THIS brief; lives in the parallel cena-staff brief (TBD).

## References

- [[cena-uconn-handoff-slice-2-meals]] — patient-side meal flow (shipped 2026-05-16, agentic shell, 9 HTML pages)
- [[cap-17-weekly-meal-ordering]] — the parent capability spec; meal-ordering patient-side decisions log + acceptance criteria the kitchens app integrates with; Decisions log entry 2026-06-09 carries the no-food-images rule
- [[ui-workflow-meal-ordering-gate-map]] — G1–G12 product-rule status; G6 (kitchen cutoff) + G12 (no images) directly relevant to kitchens
- [[uconn-meal-flow-build]] — parent plan; this brief is the kitchens-side of the 3-persona meal flow
- [[flow-view-andrey-legible-artifact]] — sibling plan; kitchens screens, once they exist, become a second flow in the flow-view tool
- `/tmp/uconn-wireframes-deleted-2026-06-09/UCONN-KITCHENS-01.md` — the retired wireframe Aaron annotated; the annotations on it are the *inputs* to this brief, not the brief itself. The brief absorbs the annotations and discards the artifact.
- 2026-06-09 working session with Andrey — the conversation that surfaced the "kitchen staff's job is running the kitchen, not data entry" framing and the simplicity-analogy ("grocery shopping in a store that only has healthy food for this program") that pins MVP scope discipline.
