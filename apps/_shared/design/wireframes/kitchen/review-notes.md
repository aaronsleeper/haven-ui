# UX Review: Kitchen Shell + Per-App Minimums

**Date:** 2026-05-03
**Inputs:**
- `apps/_shared/design/wireframes/kitchen/kt-shell-flow.md`
- `apps/_shared/design/wireframes/kitchen/shell-kt-kitchen.md`
- `apps/_shared/design/wireframes/kitchen/kt-01-orders-with-packing-slip.md`
**Reviewer:** ux-design-review (pre-build mode)
**Research consulted:**
- WCAG 2.1 AA touch targets — 44px minimum; gloved-hand workflows benefit from 48-56px (uncited but established practice)
- W3C WAI Color Independence — multi-channel signal redundancy for safety-critical labels
- Label-design / packing-slip safety-critical visibility — uncited but established practice from food-safety + warehouse-fulfillment domains; the pattern is icon + uppercase label + color combined for redundant signal
- NN/G, "Tabs, Used Right" — chunking with status-grouped sections [Source: NN/G, "Tabs, Used Right"]

## Summary

Kitchen wireframes correctly center on the safety-critical packing-slip primitive and the status-progression workflow. Right pane collapsible-by-default below 1240px (Gate 2 decision 2) is correctly applied; status-progression buttons live in the right pane (consistent with coordinator/provider model). Two issues need attention: (1) the `packing-slip` is correctly flagged as a Tier 1 PL fragment requiring 4-expert panel review at PL-fragment authoring time — but the wireframe should reinforce that the 4-expert panel runs DURING PL fragment authoring, not at this wireframe-review stage; (2) allergen flag wording is locked to "NUT-FREE" / "DAIRY-FREE" / "GLUTEN-FREE" (Gate 2 decision 5 — the constraint, not the contents), but the wireframe still reads "⚠ Contains nuts" alternative in Open Questions — promote and remove the alternative. Additionally, the daily production summary's "Start all Chicken & rice bowls (18)" batch action is the only place a kitchen worker can advance multiple orders at once, and the consequences are large (18 orders all transition to Prepping); the confirm dialog is good but the spec should state explicitly that the batch operation has no undo (consistent with kitchen no-undo decision per Gate 2 decision 1). Otherwise solid.

## Screen: kt-shell-flow

### Critical Issues

None.

### Improvements

- **Flow doc is concise and accurate.** Note on out-of-scope items — explicitly add "Bilingual EN/ES kitchen UI deferred at v1 (Spanish kitchen partners realistic; bilingual is a string update post-v1)" to remove ambiguity.

## Screen: shell-kt-kitchen

### Critical Issues

None. Status-grouped queue is correctly flagged as `[NEW COMPOSITION]` extending `queue-section-header`. Right-pane collapse-by-default is correctly applied.

### Improvements

- **Allergen severity treatment (Open Question 3)** — Recommendation per spec: all allergen flags use `severity-high` (rose family) at v1 for safety simplicity. Promote from Open Questions; revisit only if signal-to-noise becomes a problem.

- **Daily production summary "Start all [recipe] (X)" batch action — undo behavior.** The confirm dialog asks "Start prep on 18 orders?" which is correct, but per Gate 2 decision 1, kitchen status changes have no undo. State this explicitly so the user knows confirmation is the only "safe" before-the-action moment. Recommendation: add to Interaction Specifications — "Batch start has no undo; confirm dialog is the only opportunity to cancel before all matched orders advance to Prepping."

- **End-of-day affordance** is currently a `text-link` in the left pane header. This is small for a daily ritual workflow. Recommendation: keep `text-link` but flag for usability check post-launch — if Carlos misses it, promote to a more visible affordance.

- **Quality Checked as a separate column (Open Question 5)** — Recommendation per spec: separate column. Promote from Open Questions; load-bearing mandatory gate, visibility matters.

- **`thread-msg-tool` events default state** — same fix as coordinator/provider: default collapsed for kitchen too. State explicitly.

- **Right-pane manual expand persistence (Open Question 1)** — Recommendation per spec: persist user pref. Promote.

### Copy

- **Empty queue heading EN:** "No orders today"
- **Empty queue body EN:** "We'll surface tomorrow's load when it's ready."
- **Right pane empty (no order selected) EN:** "Pick an order to see its activity."
- **Section headers EN:** "Pending" / "Prepping" / "Packed" / "Quality Checked" / "Dispatched" / "Delivered"
- **Daily production card heading EN:** "Daily production · Tuesday, May 3"
- **Allergen alert callout EN (multi-restriction):** "6 orders are nut-free, 3 are dairy-free"
- **Grocery status all-available EN:** "All ingredients available"
- **Grocery status shortfall EN:** "Some ingredients short — see kitchen lead"
- **Queue load failed EN:** "We couldn't load today's orders. Retrying…" + "Try again"

## Screen: kt-01-orders-with-packing-slip

### Critical Issues

None — but the `[NEW COMPONENT: packing-slip]` flagging is correct and the 4-expert panel requirement is clear. Per the parent task, the panel review runs during PL fragment authoring (not at this wireframe-review stage). The wireframe properly defers to that gate.

### Improvements

- **Allergen flag wording promoted from Open Question to canonical.** Per Gate 2 decision 5: "NUT-FREE" / "DAIRY-FREE" / "GLUTEN-FREE" (the constraint). Multi-restriction stack as e.g., "GLUTEN-FREE + DAIRY-FREE". Recommendation: remove the "Contains nuts" alternative from Open Questions; state canonical wording in the §New Components Flagged anatomy block.

- **Dispatch SMS auto-send templating (Open Question 3)** — Recommendation per spec: agent-templated by Ava with patient-language pref. Promote: "Your meal is on the way! Expect delivery 11:00-1:00." in patient's language.

- **Quality-check button verification (Open Question 4)** — Recommendation per spec: tap-as-verification at v1; checklist deferred to v1.1.

- **Print packing slip (Open Question 5)** — deferred to v1.1. Promote to Out-of-Scope.

- **"Allergen hold" release flow (Open Question 6)** — Coordinator approval → status_change event in thread → Dispatch button re-enables. Promote.

- **Patient first-name + last-initial format (Open Question 1)** — confirmed sufficient for picker accuracy. Order # is primary identifier; "Maria R." is the disambiguator. Promote.

- **No-undo for kitchen status progression** — Gate 2 decision 1 confirms no-undo. State in §Interaction Specifications for each status-progression button: "No undo on status change; tap-to-advance is the commit." Carlos's workflow is physical and immediate; reverting a "packed" state would create real-world inconsistency.

- **Allergen flag visual hierarchy** — wireframe states "32px+ tall pill … 24-32px height" — pick one. Recommendation: 32px tall (matching the upper bound; emphasizes safety-critical visibility from across the kitchen).

- **`<main aria-label="Order #4287 packing slip">` is correct but dynamic** — confirm dev-tasker uses the order number variable, not literal "#4287" placeholder.

- **Thread input is rendered "even though low-frequency at v1"** — fine, but the placeholder copy isn't specified. Recommend: "Add a note for the order…" — kitchen doesn't talk to Ava the way coordinator does.

### Copy

- **Order header title:** "Order #4287 · Maria R."
- **Order header meta:** "Generated 6:00 AM by Ava · Patient: Maria R. · 3 meals · Window 11:00-1:00"
- **Allergen flag (single):** "⚠ NUT-FREE" / "⚠ DAIRY-FREE" / "⚠ GLUTEN-FREE"
- **Allergen flag (multi):** "⚠ GLUTEN-FREE + DAIRY-FREE"
- **Status-progression button labels:**
  - From Pending → "Start prep" + `fa-utensils`
  - From Prepping → "Mark packed" + `fa-box`
  - From Packed → "Quality checked" + `fa-circle-check`
  - From Quality Checked → "Dispatch" + `fa-truck`
- **Dispatch confirm dialog title:** "Dispatch order?"
- **Dispatch confirm dialog body:** "Patient SMS will send automatically. There's no undo."
- **Dispatch confirm buttons:** "Cancel" (outline) + "Dispatch" (primary teal — kitchen commitment)
- **Dispatched status summary:** "Dispatched 11:08 AM · Awaiting delivery confirmation"
- **SMS-failed secondary toast:** "Patient SMS failed — please call patient at (555) 123-4567"
- **Allergen-hold callout (center):** "ALLERGEN HOLD — Coordinator review pending"
- **Allergen-hold tooltip on disabled Dispatch:** "Hold until coordinator + RDN sign off"
- **Flag issue modal title:** "Flag an issue with this order"
- **Flag issue type options:** "Ingredient shortfall" / "Recipe ambiguity" / "Allergen concern" / "Other"
- **Flag issue note label (sr-only):** "Describe the issue (required, at least 10 characters)"
- **Flag issue submit button:** "Submit issue"
- **Flag issue submit confirmation toast:** "Issue flagged for coordinator review."
- **Status-change failure inline:** "We couldn't update the status. Tap to try again."
- **Status-change retry button:** "Try again"
- **Thread input placeholder:** "Add a note for the order…"

## Cross-Screen Issues

- **No-undo for status changes** — apply to `shell-kt-kitchen` interaction spec AND `kt-01` per-button. State once at shell level; reference from kt-01.
- **Allergen wording** — locked to constraint format ("NUT-FREE"). Apply consistently in `shell-kt-kitchen` summary card AND `kt-01` packing slip.
- **`thread-msg-tool` default-collapsed** — kitchen agent activity is rare (allergen check, substitution suggestion); when it does fire, default collapsed.

## Use Case Walk-Through

- **KT-SHELL-01 (Open app):** Walks. Status-grouped queue + production summary + collapsed right pane (below 1240px) renders correctly.
- **KT-SHELL-02 (Click an order):** Walks. Right pane auto-expands when order opens; packing slip loads in center.
- **KT-SHELL-03 (Status progression):** Walks. Each tap advances; left pane regroups; thread logs event. No-undo is the rule.
- **KT-SHELL-04 (Batch start):** Walks. Confirm dialog → batch transition → left regroups in bulk. The single-confirm gate is the safety net.
- **KT-SHELL-05 (Flag issue):** Walks. Modal → issue type + note → posts to thread + coordinator queue.
- **KT-SHELL-06 (End of day):** Walks. End-of-day summary loads in center (deferred wireframe).

## Open Questions for Aaron at Gate 2-review

1. **Allergen severity uniformity** — all allergen flags use `severity-high` (rose) at v1? Recommend yes.
2. **Right-pane manual-expand persistence** — persist per-user? Recommend yes.
3. **End-of-day affordance prominence** — keep as `text-link` and reassess post-launch?
4. **Thread input placeholder** — "Add a note for the order…" vs alternative? Recommend as proposed.

## 4-Expert Panel — Downstream Prerequisite

The `[NEW COMPONENT: packing-slip]` is brand-fidelity-weighted and safety-critical. The 4-expert panel review (pattern-library steward / IA / accessibility / brand fidelity) runs **at PL fragment authoring time** per CLAUDE.md slice authoring rules — NOT at this wireframe-review stage. Flag the panel as a Stage 5-prep prerequisite for the kitchen app restoration + packing-slip PL fragment authoring slice.

## Verdict

**ITERATE-THEN-SHIP.** All copy resolved inline; allergen wording promoted from Open Question; no-undo behavior documented. Wireframes are ready for haven-mapper after Aaron's Gate 2-review on the four open questions above. The packing-slip 4-expert panel review fires at PL fragment authoring time (Stage 5 prep), not now.
