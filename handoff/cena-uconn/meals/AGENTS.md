# AGENTS.md — Slice 2: Meals

Read the bundle [`../AGENTS.md`](../AGENTS.md) first — it carries the artifact vocabulary, the closed-vocabulary contract, and the conventions every page honors. This file is slice-specific.

## Shell

This slice uses `layout-agentic-shell` — chat-primary three-pane (`panel-nav` / `panel-chat` / `panel-content`). Slice 1 used `layout-app-shell-responsive`; the divergence is intentional and documented in [`../assessments/SHELL-DECISION.md`](../assessments/SHELL-DECISION.md).

The agentic shell is **desktop-only and needs ≥1440px** — below that it overflows horizontally. Mobile (right pane → full-screen sheet) is a deferred, separately-tracked obligation. Do **not** add responsive/mobile markup to these pages; that work is out of slice scope.

## Page taxonomy

- **Template pages** (`order-meals.step-*.html`) — one wireframe state each, wrapped in the agentic shell. `order-meals.step-7-at-a-glance.html` is the reference template — match its `<head>`, shell structure, and conventions.
- **Instance pages** (`order-meals.returning-patient.html`, `order-meals.first-time-patient.html`) — full-flow narrative demos; flat stacked sections (`layout-two-pane` / `layout-two-pane-grid`), **not** the agentic shell — the same pattern as slice 1's instance pages.

## Slice invariants

- Static structure only — chat affordances render as static markup; no live agent, no JS runtime (the runtime is deterministic).
- Every page's structure traces to a `meal-ordering.step-*` wireframe; copy traces to the wireframe `{% copy %}` block.
- Desktop-first. Render-check and review at ≥1440px.

## Known DS issue

`meal-option-card`'s `is-non-recommended-warned` modifier has no rule in `components.css` — a dead hook. Pages use `.meal-option-card-warning-row` directly and omit the modifier. Do not reintroduce the modifier until the design-system primitive is fixed.
