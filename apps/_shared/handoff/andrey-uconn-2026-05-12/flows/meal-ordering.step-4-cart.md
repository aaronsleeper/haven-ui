# meal-ordering — step-4-cart (cart presentation)

Realized HTML blobs for the agentic-shell template slots, for one state: **cart-presentation, returning-patient, default condition**. Pair with `../agentic-shell-template.html`. Phase-2 test slice — validates whether this artifact shape supplements the markdoc wireframe usefully for implementation.

## Sources (canonical authority — read before implementing)

| Doc | Owns (define-once) |
|---|---|
| `uconn-pilot-docs/wireframes/meal-ordering.step-4-cart.mdoc` | composition tree, copy strings, validators, state transitions |
| `uconn-pilot-docs/flows/flow-meal-ordering.md` §Step 4 | design intent, principles, decisions log |
| `uconn-pilot-docs/Apps/Patients/chat-affordance-principles.md` | cross-cutting affordance rules |
| `haven-ui/packages/design-system/pattern-library/components/` | component HTML + CSS + behavior |

When this blob doc and a canonical source disagree, the canonical source wins. This doc is a realized snapshot, not a fork.

## Bilingual status

- **EN copy:** transcribed from the wireframe's `{% copy %}` block (canonical).
- **ES copy:** provisional, drafted here for the i18n wiring requirement. The wireframe's `{% copy %}` block does not yet author Spanish. Treat the `data-i18n-es` strings below as placeholders pending EN/ES-fluent review. The wireframe is the right place for canonical ES to land per define-once.

## What this doc is NOT

The wireframe's `{% pl-status %}` block flags three composition primitives as not-yet-authored in haven-ui PL: `cart-panel`, `menu-grid`, `meal-option-card`. This doc resolves only the unblocked tags per the wireframe author's protocol; the blocked composition is left as a structured comment pointing at the gap so the implementing agent can ship the resolvable portion and report the gap.

## State — step-4-cart, returning-patient, default

### Conditions
- `patient-state`: returning-patient (default branch shown below; first-time-patient enters here after Step 3 preferences)
- Runtime: cart has 1+ items, `cart.total <= budget.cap`, agent has presented the prepared cart
- No layered-engagement signal active (see Variants for that branch)

### Nav state
- Logo only in nav-header (no notification badge)
- "Quick actions" section: existing nav-items (Schedule a visit / Message coordinator / View care plan)
- "Conversations" section: `Order this week's meals` is `.nav-item.active` (bold + teal-700 text per active-nav rule); other past conversations as `.nav-item`
- No badges. User menu pinned bottom.

### Chat-pane composition

Drops into the shell's chat-pane slots: the persistent affordance goes in `<div class="chat-thread-header">` (shell-template chrome slot for persistent affordances), and the conversation goes in `<div class="chat-thread-inner">` (existing slot).

**Chat-thread-header (drops into the existing `<div class="chat-thread-header">` slot):**

```html
<!-- Persistent talk-to-a-person affordance.
     Tag in wireframe: {% talk-to-person-trigger persistent="true" /%}
     Resolves to: chat-handoff-trigger.is-header (desktop chip register).
     Tap opens handoff-menu (gap-doc R-23). -->
<button type="button" class="chat-handoff-trigger is-header"
        data-i18n-en="Talk to a person"
        data-i18n-es="Hablar con una persona">
  <i class="fa-solid fa-headset" aria-hidden="true"></i>
  Talk to a person
</button>
```

**Chat-thread-inner (drops into the existing `<div class="chat-thread-inner">` slot):**

```html
<!-- Tag: {% agent-message condition="default" key="agent.cart-default" /%}
     Resolves to: patient-chat-message (ava). -->
<div class="patient-chat-message">
  <span class="patient-chat-message-indicator" aria-hidden="true">
    <i class="fa-solid fa-sparkle"></i>
  </span>
  <p class="patient-chat-message-body"
     data-i18n-en="Take a look at your cart on the right. Tap items to change them, or just tell me what you'd swap."
     data-i18n-es="Eche un vistazo a su carrito a la derecha. Toque los artículos para cambiarlos, o dígame qué cambiaría.">
    Take a look at your cart on the right. Tap items to change them, or just tell me what you'd swap.
  </p>
</div>

<!-- Tag: {% courtesy-submit
              when="cart.itemCount > 0 AND cart.total <= budget.cap"
              label-key="copy.courtesy-submit" /%}
     Resolves to: chat-button-row (single) with btn-primary (chat-anchored commit).
     This commits state (send order to kitchen) — primary tier per DESIGN.md §Brand-taste.
     Render only when the `when=` predicate is true; hide otherwise.
     The canonical submit lives in the right-pane cart-panel; this is the courtesy duplicate. -->
<div class="chat-button-row">
  <button type="button" class="btn-primary"
          data-i18n-en="Send order"
          data-i18n-es="Enviar pedido">Send order</button>
</div>
```

**Chat input area (drops into the existing `<div class="chat-input-area">` slot):**

Use the `prompt-input-container` pattern from `packages/design-system/pattern-library/pages/layout-agentic-shell.html` lines 169–195 — textarea + up-arrow send button. No changes for this state.

### Right-pane composition

Drops into the shell's `<div class="content-body">` slot. Two of three composition blocks are build-blocked.

```html
<!-- ============================================================
     BLOCKED — cart-panel composition
     Tag in wireframe:
       {% cart-panel
            submit-label-key="copy.primary-submit"
            submit-disabled-when="cart.itemCount == 0 OR cart.total > budget.cap" %}
         {% cart-item-list source="cart" /%}
         {% cart-total /%}
         {% cart-helper when="cart.itemCount == 0"     variant="gate" key="copy.helper-empty" /%}
         {% cart-helper when="cart.total > budget.cap" variant="gate" key="copy.helper-over-budget" /%}
       {% /cart-panel %}
     Build-blocked on: cart-panel (Tier 1 primitive, gap-doc R-7).
     cart-item-list, cart-total, cart-helper are internals of cart-panel; not standalone primitives.
     Surface this gap in your feedback report under "Missing primitives."
     Canonical submit label: "Send order to kitchen" / "Enviar pedido a la cocina"
     Gate-helper-empty: "Add at least one meal to send your order." / "Agregue al menos una comida para enviar su pedido."
     Gate-helper-over-budget: "Remove an item or lower a quantity to send your order." / "Quite un artículo o reduzca la cantidad para enviar su pedido."
============================================================ -->

<!-- ============================================================
     BLOCKED — menu-grid composition
     Tag in wireframe:
       {% menu-grid source="thisWeekMenu" %}
         {% meal-option-card variant="recommended" when="item.recommended"
                              badge-key="copy.recommended-badge" /%}
         {% meal-option-card variant="non-recommended-warned"
                              when="item.added AND NOT item.recommended"
                              warning-icon="info"
                              warning-tooltip-key="copy.non-recommended-warning" /%}
         {% meal-option-card variant="default" /%}
         {% quantity-stepper /%}
       {% /menu-grid %}
     Build-blocked on: menu-grid (Tier 1 primitive, gap-doc R-5), meal-option-card (Tier 1, gap-doc R-3).
     quantity-stepper EXISTS in haven-ui PL (packages/design-system/pattern-library/components/quantity-stepper.html)
     but is consumed inside meal-option-card per the wireframe; its use here is blocked transitively.
     Surface this gap in your feedback report under "Missing primitives."
     Canonical copy:
       recommended-badge: "Picked for you" / "Elegido para usted"
       non-recommended-warning: "this isn't a typical match for your care plan — feel free to ask if you have questions" /
                                "esto no es lo habitual para su plan de cuidado — pregunte si tiene dudas"
============================================================ -->

<!-- Tag: {% budget-meter
              variant-when-default="normal"
              variant-when="cart.total > budget.cap → error"
              label-key-default="copy.budget-default"
              label-key-error="copy.budget-error" /%}
     Resolves to: budget-meter (default).
     Default branch shown below — Maria mid-flow, $120 of $200, under budget.
     Over-budget branch shown in Variants. -->
<div class="budget-meter">
  <div class="budget-meter-label">
    <span data-i18n-en="This week's meal budget"
          data-i18n-es="Presupuesto de comidas de esta semana">This week's meal budget</span>
    <span class="budget-meter-amount"
          data-i18n-en="$120 of $200 used"
          data-i18n-es="$120 de $200 usados">$120 of $200 used</span>
  </div>
  <div class="progress progress-success">
    <div class="progress-bar" style="width: 60%"></div>
  </div>
  <p class="budget-meter-message"
     data-i18n-en="$80 left this week."
     data-i18n-es="$80 restantes esta semana.">$80 left this week.</p>
</div>
```

## Variants

### Layered-engagement chat-pane (renders at most once per session)

Inserts a second `patient-chat-message` between the cart-default message and the courtesy-submit, only when the system has a genuine social/feedback signal to surface (per chat-affordance-principles). The wireframe gates this on `condition="layered-engagement"` — implementing agent supplies the predicate.

```html
<!-- Tag: {% agent-message condition="layered-engagement" key="agent.engagement-prompt" /%} -->
<div class="patient-chat-message">
  <span class="patient-chat-message-indicator" aria-hidden="true">
    <i class="fa-solid fa-sparkle"></i>
  </span>
  <p class="patient-chat-message-body"
     data-i18n-en="How was that curry from last week?"
     data-i18n-es="¿Qué tal le pareció el curry de la semana pasada?">
    How was that curry from last week?
  </p>
</div>
```

### Budget-meter — over-budget (`cart.total > budget.cap`)

Replaces the default budget-meter block when over-budget. Surfaces error register; courtesy-submit hides (its `when=` predicate is false); right-pane cart-panel submit disables; cart retains items.

```html
<div class="budget-meter is-error">
  <div class="budget-meter-label">
    <span data-i18n-en="This week's meal budget"
          data-i18n-es="Presupuesto de comidas de esta semana">This week's meal budget</span>
    <span class="budget-meter-amount"
          data-i18n-en="$215 of $200 used"
          data-i18n-es="$215 de $200 usados">$215 of $200 used</span>
  </div>
  <div class="progress progress-error">
    <div class="progress-bar" style="width: 100%"></div>
  </div>
  <p class="budget-meter-message"
     data-i18n-en="Over budget by $15."
     data-i18n-es="$15 sobre el presupuesto.">Over budget by $15.</p>
</div>
```

## Behavior (summary — wireframe `{% behavior %}` is canonical)

- Two interaction paths are always live; both edit the same cart.
  - Chat: patient says ("swap the chicken") → agent edits cart → agent reply summarizes ("Swapped lemon chicken for tofu noodle bowl. Cart's at $187 now."); no meal cards in chat.
  - Direct: tap quantity-stepper or add/remove in menu-grid → cart updates instantly, no chat round-trip.
- On submit (cart-panel or courtesy): validator runs (`cart.itemCount > 0 AND cart.total <= budget.cap`). Pass → transition to `step-6-submit-confirm`. Fail → cart-helper surfaces gate copy; no transition.
- Over-budget: budget-meter → error variant; cart-panel submit disables; courtesy-submit hides; no auto-eviction.
- Non-recommended add: meal-option-card → non-recommended-warned variant with supportive tooltip; never dimmed, never blocked.
- Layered-engagement message renders at most once per session, only with a genuine signal.
- Mobile: right-pane opens as full-screen sheet via `{% mobile-sheet-link %}`; closing returns to chat with state preserved (out of scope for the desktop bundle, but noted).

## Build-blocked primitives — implementing-agent action

The right-pane composition is partial because three primitives are not yet authored in haven-ui PL:

| Tag | Status | Gap-doc reference |
|---|---|---|
| `cart-panel` | Tier-1 primitive, missing | gap-doc R-7 |
| `menu-grid` | Tier-1 primitive, missing | gap-doc R-5 |
| `meal-option-card` | Tier-1 primitive, missing | gap-doc R-3 |

Ship the resolvable portion (chat-pane + budget-meter); surface the blocked block under "Missing primitives" in your feedback report.

## Feedback target — required after implementing

Per `wireframes/feedback/_template.md`, append a report to:

`uconn-pilot-docs/wireframes/feedback/meal-ordering.step-4-cart.{YYYY-MM-DD}.md`

Cover at minimum: tag resolution (did every unblocked tag map cleanly?), missing primitives (the three above + anything else), copy gaps, behavior gaps, cross-doc lookups required, time estimate vs actual, and one sentence on what would have helped most. Recurring frictions across multiple reports drive schema iteration.
