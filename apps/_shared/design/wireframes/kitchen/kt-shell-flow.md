# Screen Flow: Kitchen Shell + Per-App Minimums

## Screens in This Feature

| ID | Name | Route | Persona | Shell |
|----|------|-------|---------|-------|
| shell-kt-kitchen | Kitchen-specific shell | `/` (persistent) | Kitchen Staff | shell-kt-kitchen |
| kt-01-orders-with-packing-slip | Orders queue + open order packing slip + status thread (worked example) | `/orders/{orderId}` | Kitchen Staff | shell-kt-kitchen |

Per Gate 2-prep decision 7: kitchen + provider app restoration is at Stage 5 prep, not a separate gate. Wireframes here use `apps/_shared/design/wireframes/kitchen/` as the design home until `git mv archive/inactive-apps/kitchen apps/kitchen` runs.

## Navigation Flows

- App open → shell-kt-kitchen renders → left = today's orders status-grouped + secondary nav, center = daily production summary, right = empty-state thread
- shell-kt-kitchen (click an order) → kt-01-orders-with-packing-slip (order active in left, center loads packing slip, right loads order's status thread)
- kt-01-orders-with-packing-slip (tap "Start prep" in right pane) → status_change logs → left pane regroups order from "Pending" → "Prepping"
- kt-01-orders-with-packing-slip (tap "Mark packed") → status advances to Packed
- kt-01-orders-with-packing-slip (tap "Quality checked") → status advances to Quality Checked
- kt-01-orders-with-packing-slip (tap "Dispatch") → status advances to Dispatched; patient SMS auto-sent
- kt-01-orders-with-packing-slip (tap "Flag issue") → issue dialog → posts to thread + coordinator queue
- shell-kt-kitchen (tap "Start all Chicken & rice bowls (18)" in production summary) → all matching orders advance to Prepping; left pane regroups in bulk
- shell-kt-kitchen (tap "End of day") → end-of-day summary loads in center

## Shared Shell Components

- `shell-kt-kitchen.md` — kitchen-specific shell (this pass) inheriting from `apps/_shared/design/wireframes/shell-universal-agentic.md`
- Right pane is **collapsible-by-default below 1240px** per Gate 2-prep decision 2 — kitchen workflow doesn't always need thread context
- Existing primitives: `agentic-shell`, `panel-splitter`, `queue-sidebar`, `queue-section-header` (extended with `is-status-*` modifiers — `[NEW COMPOSITION]`), `queue-item`, `thread-panel`, `thread-msg-*`, `card`, `data-table`, `alert-warning`
- New primitive flagged: `[NEW COMPONENT: packing-slip]` — Tier 1, brand-fidelity-weighted, allergen prominence safety-critical

## Out of Scope

- Recipe catalog screens (kt-recipes-*) — secondary nav route, not in Gate 1 G1.2 minimum
- Grocery / inventory screens — secondary nav, deferred
- History screen — deferred
- Driver mobile flow — out of scope; delivery confirmation auto-advances from dispatcher
- Bilingual EN/ES — kitchen is EN-only at v1 per kitchen-shell-use-cases.md
- Tablet-specific gloved-hand UX optimizations — desktop primary at v1, tablet supported (≥768px) per Gate 2-prep decision 10
