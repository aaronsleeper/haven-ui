# Slice 2 — Meals

Weekly meal-ordering composites for the UConn pilot: entry → state-read → preferences → cart → submit → "this week at a glance".

## What this is

The patient-facing weekly meal-ordering flow. A returning patient reviews a prepared cart, edits it (by chat or by direct manipulation), submits, and lands on an idle "this week at a glance" view; a first-time patient is bridged through preferences first. Built on the haven-ui **agentic shell** — chat-primary three-pane (nav rail / agent chat / contextual right pane).

## Pages

### Abstract template pages — one wireframe state each, in the agentic shell

| State | File | Wireframe |
|---|---|---|
| 1 · Entry (returning) | `order-meals.step-1-entry.html` | `meal-ordering.step-1-entry.mdoc` |
| 1 · Entry (first-time) | `order-meals.step-1-entry-first-time.html` | `meal-ordering.step-1-entry.mdoc` — first-time variant |
| 2 · State-read | `order-meals.step-2-state-read.html` | `meal-ordering.step-2-state-read.mdoc` |
| 3 · Preferences | `order-meals.step-3-preferences.html` | `meal-ordering.step-3-preferences.mdoc` |
| 4 · Cart | `order-meals.step-4-cart.html` | `meal-ordering.step-4-cart.mdoc` |
| 6 · Submit confirmation | `order-meals.step-6-submit-confirm.html` | `meal-ordering.step-6-submit-confirm.mdoc` |
| 7 · This week at a glance | `order-meals.step-7-at-a-glance.html` | `meal-ordering.step-7-at-a-glance.mdoc` |

No step 5 — edit-in-place is behavior within step 4, not a discrete state.

### Resolved instance pages — full-flow narrative demos

| File | Walks |
|---|---|
| `order-meals.returning-patient.html` | Returning patient (Maria Rivera): entry → state-read → cart → submit → at-a-glance, with the real 14-meal menu |
| `order-meals.first-time-patient.html` | First-time patient: entry → preferences → cart → submit → at-a-glance |

Instance pages follow the slice-1 pattern — flat stacked sections, no agentic-shell chrome.

## Shell

`layout-agentic-shell` (chat-primary three-pane). The slice-1 `../assessments/SHELL-DECISION.md` panel pre-authorized meals for the agentic shell — cart vs. menu is a genuine two-surface problem.

**Desktop-only.** The agentic shell needs ≥1440px; below that it overflows horizontally. Mobile (right pane collapses to a full-screen sheet) is deferred and tracked as a closure obligation — `~/.claude/plans/closure-obligations/2026-06-15-agentic-shell-responsive.md`. Review these pages at ≥1440px width.

## Notes

- **Zero novel components.** Every primitive — `cart-panel`, `menu-grid`, `meal-option-card`, `budget-meter`, `quantity-stepper`, `chat-tag-group`, `delivery-status-timeline`, `appointment-card`, `patient-week-panel` — already exists in the haven-ui pattern library.
- The flow renders as **static structure** — chat affordances are static markup, no live agent (same as slice 1; the runtime is deterministic).
- Pricing is a **$10/meal placeholder** pending cap-41 (Vanessa).
- The step-7 change-order deadline ("Friday at 5pm") is a **demo placeholder** — runtime binds the kitchen cutoff (Fire by Forge).

## Known DS issue

`meal-option-card`'s `is-non-recommended-warned` modifier is a dead hook — `components.css` has no rule for it. The warning row renders from `.meal-option-card-warning-row` directly. The handoff pages use the warning-row class and omit the unbacked modifier. Fixing the primitive (gate the row on the modifier, or drop the modifier from the primitive's markup) is a haven-ui design-system task.

## Canonical references

- Wireframes: `Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/wireframes/meal-ordering.step-*.mdoc`
- Flow doc (design intent): `.../development/flows/flow-meal-ordering.md`
- Capability: `.../development/cap-17-weekly-meal-ordering.md`
- Plan: `~/.claude/plans/cena-uconn-handoff-slice-2-meals.md`
