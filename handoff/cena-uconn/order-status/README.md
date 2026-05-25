# Slice 4 — Order Status

Post-submit order states for the UConn pilot: pickup confirmation, active fulfillment tracking, optimize/swap, and issue escalation. Covers the IA-v1 Order surface jobs 3 (optimize), 4 (pickup), and 5 (status) that the `meals/` slice does NOT — it begins where meals ends (after order submission).

## What this is

The patient-facing **post-submit** order flow. The patient approved and submitted their order in the meals slice. This slice covers what comes after:

- They get confirmation the order is in flight
- They track it through pickup-ready
- They can swap a meal within budget before the kitchen locks
- Something goes wrong and they need a human

This is **not** a re-build of the order entry flow. Do not port the order-entry steps here. The boundary is: meals slice handles steps 1–6 (entry → cart → submit). This slice handles everything after submit.

## Relationship to the meals slice

| Slice | Scope |
|---|---|
| `meals/` | Entry → preferences → cart → submit → step-7 at-a-glance |
| `order-status/` | Post-submit: confirmation, active fulfillment tracking, optimize/swap, issue escalation |

The step-7 page in meals (`order-meals.step-7-at-a-glance.html`) is the temporal bridge — it shows the idle right-pane state immediately post-submit. This slice's `confirmed.html` extends that beat with the full Order surface and the pickup timeline.

## States

Each state is a standalone HTML page in the `layout-app-shell-responsive` shell with the IA-v1 3-tab nav (Home · Order · Activity), **Order tab active**.

| State | File | What it shows |
|---|---|---|
| Confirmed | `order-status.confirmed.html` | Just after submit. Kitchen not yet confirmed. Reassurance + pickup timeline (step 1 `.is-current`). Budget meter post-order. |
| Active | `order-status.active.html` | Kitchen confirmed, meals being prepared. Pickup timeline step 3 `.is-current`, steps 1–2 `.is-complete`. Pickup window visible. |
| Optimize | `order-status.optimize.html` | Swap a meal within budget. Comparison panel (current vs. suggested) + budget meter reflecting $0 delta. Direct manipulation only — no chat box. |
| Issue | `order-status.issue.html` | Something's wrong. Agent empathy + handoff-menu (3 options) + order detail card stays visible for CC context. |

## Composition — primitives used

All classes are in `../assets/haven.css`. Tier 2 composition — zero new primitives.

| Primitive | Classes | States |
|---|---|---|
| App shell | `app-shell`, `app-shell-frame`, `app-shell-sidebar`, `app-shell-main`, `app-shell-content`, `app-shell-bottom-nav` | all |
| Nav | `nav-header`, `nav-logo`, `nav-section`, `nav-item`, `nav-avatar`, `nav-section--pinned-bottom` | all |
| Mobile bottom nav | `mobile-bottom-nav`, `mobile-bottom-nav-tab` | all |
| Page header | `page-header`, `page-title` | all |
| Agent message | `patient-chat-message`, `patient-chat-message-indicator`, `patient-chat-message-body` | all |
| Delivery status timeline | `delivery-status-timeline`, `delivery-status-timeline-body`, `delivery-status-timeline-list`, `delivery-status-timeline-step` (`.is-complete`, `.is-current`), `delivery-status-timeline-icon`, `delivery-status-timeline-meta`, `delivery-status-timeline-label`, `delivery-status-timeline-when`, `delivery-status-timeline-window` | confirmed, active, issue |
| Card | `card`, `card-header`, `card-title`, `card-subtitle`, `card-body` | confirmed, active, issue |
| Budget meter | `budget-meter`, `budget-meter-label`, `budget-meter-amount`, `budget-meter-message`, `progress`, `progress-success`, `progress-bar` | confirmed, active, optimize |
| List group | `list-group`, `list-group-item`, `list-group-item-action`, `list-group-item-icon`, `list-group-item-content`, `list-group-item-title`, `list-group-item-description`, `list-group-item-trailing` | confirmed, active, issue |
| Comparison panel | `comparison-panel`, `comparison-intro`, `comparison-column`, `comparison-column-header`, `comparison-meal-title`, `comparison-meal-details`, `comparison-meta`, `comparison-row`, `comparison-row-header`, `comparison-row-label`, `comparison-row-value`, `comparison-row-diff`, `comparison-actions` | optimize |
| Handoff menu | `handoff-menu`, `handoff-menu-header`, `handoff-menu-avatar`, `handoff-menu-meta`, `handoff-menu-eyebrow`, `handoff-menu-title`, `handoff-menu-subtitle`, `handoff-menu-body`, `handoff-menu-option`, `handoff-menu-option-icon`, `handoff-menu-option-meta`, `handoff-menu-option-label`, `handoff-menu-option-helper` | issue |
| Avatar | `avatar`, `avatar-primary` | issue |
| Buttons | `btn-primary`, `btn-outline` | optimize |

Layout utilities used inline: `p-6`, `lg:p-10`, `space-y-8`, `space-y-2`, `mt-4`, `text-xs`, `uppercase`, `tracking-wider`, `text-sand-500`, `text-sand-300`.

## Pickup vs. delivery decision

**This slice uses the pickup variant throughout.**

`flow-order-status.md` Step 2 explicitly names the pickup location as "The Grocery on Broad, 585 Broad St, Hartford" and the fulfillment-detail copy for pickup. The UConn pilot is pickup-oriented (food-insecure, food-secure-delivery is a future cap). Pickup variant = `fa-bag-shopping` on the final step; "Ready for pickup" label; no truck icon; no delivery address.

If a future pilot cohort or pilot config uses delivery, swap:
- Final step icon: `fa-bag-shopping` → `fa-house`
- Final step label: "Ready for pickup" → "Delivered"
- Step 4: "Packed for pickup" → "Out for delivery" (with `fa-truck`)
- `delivery-status-timeline-window` copy: pickup location + window → delivery address + window

The pickup/delivery fork is purely copy + one icon — the timeline primitive supports both shapes with the same classes.

## Known reconciliation item — meals slice 5-tab nav drift

**FLAG (do not fix here — tracked as a separate cleanup item):**

The sibling `meals/` slice uses a **5-tab nav** (`Home · Health check · Meals · Care · Messages`) in all its agentic shell pages. This is demo-era drift — it predates the IA-v1 3-tab nav canonical (`~/.claude/plans/patient-app-ia-v1.md`). The `meals/` slice nav was not reconciled during that slice's build.

This slice (order-status) correctly uses the **3-tab nav (Home · Order · Activity)** throughout. The meals slice will need a reconciliation pass to align its nav — that is **out of scope here** and tracked as a known cleanup item in `AGENTS.md`. Do not copy the meals 5-tab nav into this slice or any future slices.

## Behavior to implement on port

These are behavioral contracts the porting framework must honor. Not modeled in the static HTML.

- **Confirmed state:** polling or push subscription for kitchen confirmation status. When the kitchen confirms, transition to Active state. Agent chat surfaces the status update as a push: "Kitchen just confirmed your order. Pickup window is Wednesday by noon." Right pane reflects the new timeline state live.
- **Active state:** same polling/push for "ready for pickup" transition. Agent message: "Your meals are ready — swing by The Grocery on Broad by 7 PM."
- **Optimize state:** visible only while the change-order window is open (pre-kitchen-lock). Swap action writes the new meal to the cart and updates the budget meter live. "Keep what I have" dismisses the suggestion. No chat box — all interaction is direct manipulation.
- **Issue state:** the three handoff buttons carry pre-filled context (order ID, current status, patient ID) to the CC intake. Phone = `tel:` link to the CC number. In-chat = routes the open chat session to a CC queue. Email = pre-filled `mailto:` draft with order context in the body. The agent does NOT attempt to resolve the issue in-channel per `flow-order-status.md` Step 4 hard invariant.
- **Talk to a person:** present in confirmed, active, and issue states (as a list-group row below the card, and in the nav sidebar). This is the patient-initiated path. The agent-detected escalation path (agent detects distress signal) is an open spec item per `patient-app-ia-v1.md §Escalation`.

## Canonical references

- Flow doc (design intent): `Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/flows/flow-order-status.md`
- Meal-ordering flow (boundary): same path, `flow-meal-ordering.md` Steps 5–7
- IA-v1 Order surface spec: `~/.claude/plans/patient-app-ia-v1.md` — Order = TRANSACT, jobs 1–5
- Pattern library: `Lab/haven-ui/packages/design-system/pattern-library/COMPONENT-INDEX.md`
- handoff-menu order-status-escalation variant: `packages/design-system/pattern-library/components/handoff-menu.html` — variant named in `@component-meta` but not yet rendered as a demo in the PL HTML (see AGENTS.md gap note)
