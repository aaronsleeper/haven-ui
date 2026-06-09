---
slot: 1
slot-name: brief
primary-author: Product Strategist (drafted by Vault on Aaron's behalf 2026-06-09)
project: cena-uconn-cena-staff-meal-flow
created: 2026-06-09
status: draft
consumes: []
inputs-hash: null
friction: []
pre-flight-authority: aaron
---

# Brief — Cena-staff meal-flow visibility surface (UConn)

<!-- Owner: Aaron (Cena product). Slot 1 entry artifact for the cena-staff-side of the 3-persona meal-flow build.
     The cena-staff app (providers/platform) has many capabilities; this brief scopes ONLY the meal-flow
     visibility surface. Sibling to the kitchens-app brief authored the same day (haven-ui 8253024) and the
     patient-side cap-17 meal flow (shipped 2026-05-16). Together these three briefs complete the operational
     side of the UConn meal-flow build. -->

## Problem statement

When patient orders + kitchen prep + delivery are in flight, no Cena-staff surface exists today that shows the meal flow holistically. Cena clinical-coordinator / clinical-ops staff need visibility across the whole flow to catch patients-in-trouble (didn't order when one was expected), missed handoffs (kitchen flagged an issue, delivery failed), and the small number of cases where staff intervention is the right move. Today this state lives across patient-app records, kitchen partner correspondence, and ad-hoc check-ins — there is no surface that resolves "is the meal flow healthy this week?" in a single read.

The constraint is the same one shaping the kitchens app: build the **minimum operational surface that produces actionable signal**, not a dashboard that becomes a notification-fatigue trap. Cena staff are operating across multiple patients and multiple capabilities; the meal-flow surface earns attention only when it surfaces something that wants staff intervention.

## Target users

- **Primary:** Cena clinical-coordinator / clinical-ops staff (composite role for MVP; differentiation between clinical coordinator, RD, and ops staff is an open question — see Open questions). These are operators who manage panels of patients across capabilities — meal flow is one of ~13 capabilities on the UConn pilot — so the surface must respect that meal flow is one tab/view among many.
- **Secondary:** Cena leadership reading state across multiple pilots (multi-pilot view is future scope; not designed for here).
- **Not the target:** Patients (their flow is cap-17 patient app); kitchen staff (their flow is the kitchens app); UConn-side clinicians (they are partner clinicians, not Cena operators — accountability model TBD; surfacing to them is a separate question).

## Success criteria

- [ ] Cena staff can read meal-flow health for the active UConn cohort in **one screen** — not "click through 20 patients to assemble it in your head."
- [ ] The surface differentiates **actionable signal** from **routine state**: a patient who hasn't ordered when one was expected surfaces; a patient who ordered on time does not pull attention.
- [ ] Staff see the **full meal-flow context per patient** when they drill in — order placed, kitchen prep state, delivery state, any flags raised by kitchen — without traversing three separate apps.
- [ ] PHI handling is **load-bearing and visible**: this surface DOES show patient names + dietary selections + clinical context (Cena staff are authorized custodians, unlike kitchen staff who are not). The surface's PHI posture is the inverse of the kitchens app's PHI-minimization posture, and the design must make that boundary legible.
- [ ] Escalation routing is named: when an exception surfaces (no order placed + kitchen starting prep, delivery failed, kitchen flagged dietary mismatch), the surface tells staff **who handles it** (not "here's a problem, figure out who owns it").
- [ ] Surface is **operable from a desktop** (Cena staff are primarily desk-based; mobile parity is not required at MVP).
- [ ] Andrey accepts the chrome as **canon** he can build on top of, NOT a redesign candidate at the next slice. Same lock-in constraint as the parent meal-flow plan and the kitchens-app brief.
- [ ] The surface integrates **into the existing providers/platform app** (cena-staff is the providers/platform app — this is not a new application). How it integrates — new tab, roster column, overlay — is an open question (see Open questions).

## Scope fences

### In scope

- The meal-flow visibility surface within the cena-staff (providers/platform) app
- Per-cohort meal-flow health view (UConn cohort for MVP — one pilot's worth of patients)
- Per-patient meal-flow drill-in: order placed (or not), kitchen prep state, delivery state, exceptions raised
- Exception surfacing: patient-no-order-when-expected, kitchen-flagged-issue, delivery-failed, dietary-mismatch
- Integration boundary with cap-17 patient app data + kitchens-app data (the staff surface CONSUMES from both; data contracts in slot 15)
- PHI-authorized presentation: patient name (full), dietary selections, clinical context where relevant to the exception

### Out of scope

- Patient-facing chat (that's cap-17 patient app)
- Kitchen operational workflow (that's the kitchens app)
- Patient management / care planning generally — the cena-staff app has many capabilities; this brief scopes ONLY the meal-flow-visibility surface within it
- Billing / reconciliation (separate capability surface)
- Multi-pilot rollup view (UConn is the only pilot now; multi-pilot view is future scope)
- UConn-side clinician surfacing (partner clinicians are not the target user for THIS surface; if they need visibility, that's a separate brief)
- Authoring meals / menu management (Andrey adds meals manually per cap-17; this is not a meal-authoring surface)
- Order placement on behalf of patient (CC-assisted ordering is cap-23; that's a different surface inside cena-staff app, not this visibility one)

### Deferred (next slice)

- Push notifications for exceptions (defer until exception-volume patterns clarify what wants real-time vs polling)
- Multi-pilot rollup (defer until a second pilot is real)
- Trend analytics / week-over-week patterns (operational surface only at MVP; analytics is a separate concern)
- Direct-action affordances from the visibility surface (e.g., "call patient" button, "message kitchen" button) — MVP surfaces state and routes; action paths land in the next slice once routing is clear
- Audit / historical browse (current state only at MVP)
- Cross-capability rollup (does this patient have other capabilities flagging too?) — defer until staff workflow patterns show the need

## Constraints

### Technical

- **Surface is non-agentic.** Like the kitchens app, this is an operator surface — no Ava avatar, no chat, no approval cards. Staff are reading state and deciding when to intervene; the agentic shell is wrong shape here.
- **Production target stack is Angular** (Cena providers/platform app, per `Lab/cena-health-spark/`). Haven-ui spec ships HTML; Andrey ports.
- **Integration into existing providers/platform app, not a new app.** The cena-staff providers/platform app already exists; this brief defines a NEW surface within it. How that surface mounts — tab, panel, overlay on existing roster — is an open question. Default assumption pending validation: a "Meals" tab in the providers/platform top-level navigation, mirroring the way capabilities are typically surfaced.
- **Inter-page navigation is required.** Like the patient-side handoff bundle and the kitchens app, the spec must produce clickable navigable multi-page output (per the parent plan's HTML linking requirement).
- **Data contracts with patient app + kitchens app are load-bearing.** This surface consumes from both — order state from cap-17 patient app, prep/packing state from kitchens app. Slot 15 (data-contracts) is required and must define the read shape across all three surfaces.

### Brand

- Haven design system per Cena brand canon v2 (teal / sand / amber palette; Lora display + Source Sans 3 body; FA Pro icons; no Material Icons / emoji icons).
- Tone: operational, calm, no decorative chrome. Aaron's framing: should help staff **SEE what's happening across the flow** without becoming a notification-fatigue trap. Closer to a flight-status board than a CRM dashboard — surfaces what wants attention and nothing more.
- Visual hierarchy: routine state is calm and recedes; exceptions surface visibly. The amber/teal palette already encodes this hierarchy — use it; don't invent new state colors.

### Regulatory / compliance

- **PHI authorization boundary is the load-bearing distinction from the kitchens app.** Cena clinical staff ARE authorized custodians; they see patient names, dietary selections, and clinical context. The surface design must make that boundary explicit — both because it's correct, and because a future staff member with a different authorization (e.g., a Cena ops staff member who is NOT clinical) might need a reduced-PHI view. MVP assumes uniform clinical-staff authorization; tiered authorization within Cena staff is future scope.
- HIPAA: standard audit-trail expectations apply; the surface itself is a read surface, but any action taken from it (drill-in, drill-through to patient record, escalation routing) generates audit events per existing Cena platform conventions.
- WCAG 2.2 AA floor (haven default). Desktop-primary; staff work at desks, not in kitchens — no special target-size requirements like the kitchens app may need.

### Time

- UConn pilot is the parent goal; this surface ships as part of the third leg of the 3-persona meal flow (patient + kitchen + cena-staff).
- No hard external deadline; pacing is "ship one well-built persona-flow at a time" per the parent plan.
- Dependency: the kitchens-app data shape (what fields the kitchens app emits when prep / packing / delivery state changes) is the critical input. The kitchens brief is currently slot-1; data contracts (slot 15 in both engagements) need to be authored in coordination across the two briefs to avoid mismatched contracts.

### Budget

- Internal build; no external budget. Aaron + agents primary author; Andrey reviews + Angular-ports.

## Conditional + optional slot declarations

- `discovery-research` (slot 6): **conditional-required** — at minimum a structured conversation with Vanessa (and any current Cena ops staff doing this work manually today) before slot 11 (wireframes) fires. The cena-staff role composite for MVP is a strong assumption that wants validation — if differentiation between clinical coordinator / RD / ops staff is real, IA at slot 7 needs to reflect it.
- `visual-direction` (slot 12): **skip** — Haven design system covers the operational-surface needs; no new visual direction work.
- `prototype-novel-interactions` (slot 18): **conditional** — may apply if the exception-surfacing pattern (signal vs noise) introduces a novel-enough interaction; evaluate after wireframes.
- `data-contracts` (slot 15): **required** — full-stack work; this surface CONSUMES from cap-17 patient app + the kitchens app, so the contract is three-sided. This is the most load-bearing slot for this engagement; the kitchens-app slot-15 should be co-authored to avoid mismatched contracts.
- `performance-audit` (slot 28): **skip** — internal operational tool; not public-facing.
- `responsive-cross-browser` (slot 29): **conditional** — desktop-primary; if tablet emerges as a real staff use case in slot 6 discovery, this flips to required.
- `human-exploratory` (slot 30): **required** — Cena staff are the real users; a structured task-based walkthrough with Vanessa (or whoever does this work manually today) before release is non-waivable. Same bar as the kitchens app's Sarah-at-Greens'n'Things walkthrough.

## Open questions

Routed to slot 2 (risk-and-test-strategy), slot 6 (discovery-research), or Cena-internal conversation. Aaron + Vanessa + Andrey inputs needed:

- **Role split for MVP.** One composite cena-staff role, or differentiated clinical coordinator / RD / ops staff with different views? Default to one role unless slot 6 discovery surfaces evidence of differentiation. If differentiated, IA at slot 7 needs to reflect role-scoped views.
- **Notification model.** Push notifications (real-time alerts), polling refresh (auto-update on cadence), or dashboard-only (staff actively visit the surface)? Tied to how time-sensitive exceptions actually are. Default pending validation: dashboard-only at MVP, with the surface designed to be glanceable enough that "check it in the morning + after lunch" is sufficient.
- **Escalation routing.** When the surface detects a patient hasn't ordered + the kitchen is starting prep — who gets pinged? Is there a primary owner (clinical coordinator?) or is it role-defined (whoever is on shift)? This is partly a Cena operational decision, not just a UX one.
- **Integration shape with existing providers/platform views.** Is the meal-flow visibility a NEW "Meals" tab in the providers/platform top-level nav? A new column in the existing patient-roster view? An overlay / drill-in from existing patient cards? This is the most consequential IA decision for slot 7. Default pending validation: a new "Meals" tab, mirroring the way capabilities are typically surfaced.
- **Cross-capability cohabitation.** The cena-staff app has ~13 capabilities on the UConn pilot; meal flow is one. How does this surface coexist with the others without becoming a notification-fatigue source? Is there a top-level "exceptions across all capabilities" view that meal-flow feeds into, or is each capability surfaced separately? Likely future scope, but the meal-flow surface's IA needs to leave room for the integration shape.
- **Data contracts between patient-app + kitchens-app + this surface.** Slot 15; the three-sided contract is the load-bearing decision. Suggested next move: co-author slot 15 across the cena-staff and kitchens engagements with Andrey before either engagement fires slot 11 (wireframes).
- **Multi-pilot scaling.** UConn is the only pilot now. Future-proofing the data model + IA for multi-pilot is separate from surfacing multi-pilot in v1 IA. MVP scopes to single-cohort (UConn); the data model should not preclude multi-pilot, but the surface does not show it.
- **Action affordances from the visibility surface.** When staff sees an exception, what actions can they take from here? "Call patient" button? "Message kitchen" button? "Mark as handled" affordance? Or does the visibility surface route them out to other surfaces where action lives? Deferred to next slice per scope fence — but the IA at slot 7 needs to leave room.
- **Time-zone / batch handling.** UConn cohort patients may span time zones; kitchen prep runs on the kitchen's clock. The surface needs to reconcile what "today's orders" means across timezones. Partly a data-contract question, partly an IA presentation question.

## References

- [[cap-17-weekly-meal-ordering]] — patient-side meal-ordering capability (canonical source for patient-side decisions; data shape the cena-staff surface consumes)
- [[ui-workflow-meal-ordering-gate-map]] — G1–G12 product-rule status; relevant for exception detection (G6 kitchen cutoff, G10 multi-channel ordering all hit this surface)
- [[uconn-meal-flow-build]] — parent plan; this brief is the cena-staff-side of the 3-persona meal flow
- `Lab/haven-ui/apps/kitchens/design/brief.md` — sibling brief; the kitchens-app slot-1 entry. Co-design slot 15 (data contracts) across both engagements.
- `Lab/haven-ui/apps/care-coordinator/design/shell-use-cases.md` — shape precedent for operator-surface use cases at this altitude (different persona, but the use-case-by-use-case structure carries over).
- [[cena-uconn-handoff-slice-2-meals]] — patient-side meal flow (shipped 2026-05-16); the data shape this surface consumes on the patient-app side is grounded here.
- [[flow-view-andrey-legible-artifact]] — sibling plan; once cena-staff screens exist, they become a third flow in the flow-view tool alongside patient and kitchens.
- 2026-06-09 working session with Andrey — the conversation that framed the 3-persona / 3-app meal flow as the next slice, including the "ship one well-built persona-flow at a time" pacing constraint.
