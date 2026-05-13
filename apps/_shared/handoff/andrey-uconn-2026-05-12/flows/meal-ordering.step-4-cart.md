# meal-ordering — step-4-cart (cart presentation)

Realized HTML blobs for the agentic-shell template slots, for one state: **cart-presentation, returning-patient, default condition**. Pair with `../agentic-shell-template.html`. Phase-2 test slice — validates whether this artifact shape supplements the markdoc wireframe usefully for implementation.

**2026-05-12 refresh:** all three previously-blocked PL primitives (cart-panel, menu-grid, meal-option-card) shipped via haven-ui commit `23f2710`. The structured-comment gaps in this doc are now resolved with realized HTML. Sample state: Maria, returning patient, cart of 10 servings totaling $120 of her $200 weekly cap.

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

## What this doc is

A complete state realization for Step 4 (cart-presentation, returning-patient, default condition). Every tag in the wireframe resolves to a realized HTML blob below. The three Tier-1 primitives that were build-blocked at the original 2026-05-12 authoring (cart-panel, menu-grid, meal-option-card) shipped to PL the same day; the gap-noted structured comments have been replaced with the realized compositions.

Two consumer-side responsibilities remain:
- Wire the stepper → cart bridge: cart-panel.js does NOT auto-subscribe to `quantity-change` events from sibling steppers. The consumer listens for them on the menu-grid (or parent) and calls `cartEl._cartPanel.setQty(mealId, qty)`. See `haven-ui/packages/design-system/pattern-library/pages/cart-panel.html` for the canonical bridge example.
- Load the supporting JS modules: `quantity-stepper.js` and `cart-panel.js` from `haven-ui/packages/design-system/src/scripts/components/`. Both are framework-agnostic vanilla ES modules; drop in with `<script src=...>` or port the contract per the docblocks.

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

Drops into the shell's `<div class="content-body">` slot. Three composition blocks: cart-panel (top), menu-grid wrapping meal-option-cards (middle), budget-meter (bottom). The trailing inline `<script>` is the canonical stepper → cart bridge.

```html
<!-- Tag: {% cart-panel
              title-key="copy.cart-panel-title"
              submit-label-key="copy.primary-submit"
              submit-disabled-when="cart.itemCount == 0 OR cart.total > budget.cap" %}
            {% cart-item-list source="cart" /%}
            {% cart-total /%}
            {% cart-helper when="cart.itemCount == 0"     variant="gate" key="copy.helper-empty" /%}
            {% cart-helper when="cart.total > budget.cap" variant="gate" key="copy.helper-over-budget" /%}
          {% /cart-panel %}
     Resolves to: cart-panel (gap-doc R-7). Default (pre-submit, valid) variant; .is-locked
     modifier on the container converts to post-submit summary (see Variants).

     Both .cart-helper instances are present in the DOM but neither is .is-active here
     (validator passes). cart-panel.js auto-wires aria-describedby on [data-cart-submit]
     to reference both helper IDs; only the active helper (display: flex) is in the AT tree,
     so the disabled submit reads only its matching gate copy when fail-state surfaces. -->
<div class="cart-panel" data-cart-panel data-cart-panel-id="cart-maria-step4" data-budget-cap="200">
  <div class="cart-panel-header">
    <p class="cart-panel-title"
       data-i18n-en="Your cart"
       data-i18n-es="Su carrito">Your cart</p>
    <!-- Status pill: hidden in pre-submit; reveals when .is-locked is applied. tabindex="-1"
         lets cart-panel.js's lock() move focus here on submit-success. -->
    <span class="cart-panel-status" tabindex="-1">
      <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
      <span data-i18n-en="Sent to kitchen"
            data-i18n-es="Enviado a la cocina">Sent to kitchen</span>
    </span>
  </div>
  <div class="cart-panel-body">
    <!-- Debounced (400ms) polite live region; cart-panel.js announces only on validator-state
         transitions (pass↔fail, fail-type swap) and on lock — not on every recompute. -->
    <span class="sr-only" data-cart-announce aria-live="polite" aria-atomic="true"></span>
    <div class="cart-item-list" data-cart-item-list role="list" aria-label="Cart items">
      <div class="cart-item" data-cart-item-id="meal-pollo" data-unit-price="12.50" data-qty="4" role="listitem">
        <p>
          <span class="cart-item-name"
                data-i18n-en="Pollo guisado"
                data-i18n-es="Pollo guisado">Pollo guisado</span>
          <span class="cart-item-qty">× 4</span>
        </p>
        <span class="cart-item-price">$50.00</span>
      </div>
      <div class="cart-item" data-cart-item-id="meal-lemon" data-unit-price="11.50" data-qty="5" role="listitem">
        <p>
          <span class="cart-item-name"
                data-i18n-en="Lemon chicken"
                data-i18n-es="Pollo al limón">Lemon chicken</span>
          <span class="cart-item-qty">× 5</span>
        </p>
        <span class="cart-item-price">$57.50</span>
      </div>
      <div class="cart-item" data-cart-item-id="meal-tofu" data-unit-price="12.50" data-qty="1" role="listitem">
        <p>
          <span class="cart-item-name"
                data-i18n-en="Tofu noodle bowl"
                data-i18n-es="Tazón de fideos con tofu">Tofu noodle bowl</span>
          <span class="cart-item-qty">× 1</span>
        </p>
        <span class="cart-item-price">$12.50</span>
      </div>
    </div>
    <div class="cart-total">
      <div class="cart-total-row is-primary">
        <span data-i18n-en="Total" data-i18n-es="Total">Total</span>
        <span data-cart-total>$120.00</span>
      </div>
      <div class="cart-budget-remaining">
        <!-- cart-panel.js swaps this label between "Budget remaining" and "Over budget by"
             based on validator state. Provide the i18n strings on the static element;
             the JS rewrites textContent only. -->
        <span data-cart-budget-label
              data-i18n-en="Budget remaining"
              data-i18n-es="Presupuesto restante">Budget remaining</span>
        <span data-cart-budget-remaining>$80.00</span>
      </div>
    </div>
    <p class="cart-helper is-gate" data-cart-helper="empty">
      <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
      <span data-i18n-en="Add at least one meal to send your order."
            data-i18n-es="Agregue al menos una comida para enviar su pedido.">Add at least one meal to send your order.</span>
    </p>
    <p class="cart-helper is-gate" data-cart-helper="over-budget">
      <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
      <span data-i18n-en="Remove an item or lower a quantity to send your order."
            data-i18n-es="Quite un artículo o reduzca la cantidad para enviar su pedido.">Remove an item or lower a quantity to send your order.</span>
    </p>
    <button type="button" class="btn btn-primary btn-block cart-submit" data-cart-submit
            data-i18n-en="Send order to kitchen"
            data-i18n-es="Enviar pedido a la cocina">
      Send order to kitchen
    </button>
  </div>
</div>

<!-- Tag: {% menu-grid source="thisWeekMenu" %}
              {% meal-option-card variant="recommended" when="item.recommended"
                                  badge-key="copy.recommended-badge" /%}
              {% meal-option-card variant="non-recommended-warned"
                                  when="item.added AND NOT item.recommended"
                                  warning-icon="info"
                                  warning-tooltip-key="copy.non-recommended-warning" /%}
              {% meal-option-card variant="default" /%}
              {% quantity-stepper /%}
            {% /menu-grid %}
     Resolves to: menu-grid (gap-doc R-5) wrapping meal-option-cards (gap-doc R-3),
     each carrying an inline quantity-stepper. Five representative cards shown below
     (production has all 14 weekly meals); covers recommended + default + placeholder
     variants. Non-recommended-warned variant lives in the Variants section.

     Each meal-option-card carries data-meal-id / data-meal-name / data-meal-price
     for the stepper→cart bridge wiring. The bridge listens for `quantity-change`
     CustomEvents bubbling from any stepper inside #menu-step4 and calls
     cartEl._cartPanel.setQty(mealId, qty) (or addItem on first-add). See the bridge
     script at the bottom of this state for the canonical wiring; see haven-ui's
     pages/cart-panel.html source for the full pattern. -->
<div class="menu-grid" id="menu-step4">
  <div class="menu-grid-header">
    <div>
      <p class="menu-grid-title"
         data-i18n-en="This week's menu"
         data-i18n-es="Menú de esta semana">This week's menu</p>
      <p class="menu-grid-subtitle"
         data-i18n-en="14 dishes available"
         data-i18n-es="14 platos disponibles">14 dishes available</p>
    </div>
  </div>

  <!-- Recommended variant — Ava's pick. Leading .badge-primary with fa-sparkles is
       pinned to position 0 via CSS order on .is-recommended. Soft-teal register
       (primary-50 bg + primary-200 border + primary-600 text) — Ava-attribution
       feedback, distinct from primary-teal commit fill. -->
  <div class="meal-option-card is-recommended" data-meal-id="meal-pollo" data-meal-name="Pollo guisado" data-meal-price="12.50">
    <div class="meal-option-card-image">
      <img src="https://loremflickr.com/160/160/healthy,mexican,food?lock=11"
           data-i18n-en-alt="Pollo guisado with rice and black beans"
           data-i18n-es-alt="Pollo guisado con arroz y frijoles negros"
           alt="Pollo guisado with rice and black beans">
    </div>
    <div class="meal-option-card-content">
      <p class="meal-option-card-name-row">
        <span class="meal-option-card-name"
              data-i18n-en="Pollo guisado"
              data-i18n-es="Pollo guisado">Pollo guisado</span>
      </p>
      <p class="meal-option-card-description"
         data-i18n-en="Stewed chicken, rice, black beans."
         data-i18n-es="Pollo guisado, arroz, frijoles negros.">Stewed chicken, rice, black beans.</p>
      <div class="meal-option-card-tags">
        <span class="badge badge-primary">
          <i class="fa-solid fa-sparkles" aria-hidden="true"></i>
          <span data-i18n-en="Picked for you"
                data-i18n-es="Elegido para usted">Picked for you</span>
        </span>
        <span class="badge badge-info"
              data-i18n-en="Low sodium"
              data-i18n-es="Bajo en sodio">Low sodium</span>
      </div>
      <div class="meal-option-card-footer">
        <span class="meal-option-card-price">$12.50</span>
        <div class="quantity-stepper" data-quantity-stepper data-value="4" data-min="0" data-max="10">
          <button type="button" class="quantity-stepper-btn" data-action="decrement"
                  aria-label="Decrease quantity of Pollo guisado">
            <i class="fa-solid fa-minus" aria-hidden="true"></i>
          </button>
          <span class="quantity-stepper-value" aria-hidden="true">4</span>
          <span class="sr-only" data-quantity-stepper-announce aria-live="polite" aria-atomic="true"></span>
          <button type="button" class="quantity-stepper-btn" data-action="increment"
                  aria-label="Increase quantity of Pollo guisado">
            <i class="fa-solid fa-plus" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Recommended variant — second Ava pick. -->
  <div class="meal-option-card is-recommended" data-meal-id="meal-lemon" data-meal-name="Lemon chicken" data-meal-price="11.50">
    <div class="meal-option-card-image">
      <img src="https://loremflickr.com/160/160/healthy,mediterranean,food?lock=12"
           alt="Lemon chicken with herbed rice">
    </div>
    <div class="meal-option-card-content">
      <p class="meal-option-card-name-row">
        <span class="meal-option-card-name"
              data-i18n-en="Lemon chicken"
              data-i18n-es="Pollo al limón">Lemon chicken</span>
      </p>
      <p class="meal-option-card-description"
         data-i18n-en="Roasted lemon chicken, herbed rice, green beans."
         data-i18n-es="Pollo al limón asado, arroz con hierbas, judías verdes.">Roasted lemon chicken, herbed rice, green beans.</p>
      <div class="meal-option-card-tags">
        <span class="badge badge-primary">
          <i class="fa-solid fa-sparkles" aria-hidden="true"></i>
          <span data-i18n-en="Picked for you"
                data-i18n-es="Elegido para usted">Picked for you</span>
        </span>
        <span class="badge badge-info"
              data-i18n-en="Low sodium"
              data-i18n-es="Bajo en sodio">Low sodium</span>
      </div>
      <div class="meal-option-card-footer">
        <span class="meal-option-card-price">$11.50</span>
        <div class="quantity-stepper" data-quantity-stepper data-value="5" data-min="0" data-max="10">
          <button type="button" class="quantity-stepper-btn" data-action="decrement"
                  aria-label="Decrease quantity of Lemon chicken">
            <i class="fa-solid fa-minus" aria-hidden="true"></i>
          </button>
          <span class="quantity-stepper-value" aria-hidden="true">5</span>
          <span class="sr-only" data-quantity-stepper-announce aria-live="polite" aria-atomic="true"></span>
          <button type="button" class="quantity-stepper-btn" data-action="increment"
                  aria-label="Increase quantity of Lemon chicken">
            <i class="fa-solid fa-plus" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Default variant — in cart, not flagged. -->
  <div class="meal-option-card" data-meal-id="meal-tofu" data-meal-name="Tofu noodle bowl" data-meal-price="12.50">
    <div class="meal-option-card-image">
      <img src="https://loremflickr.com/160/160/healthy,asian,food?lock=13"
           alt="Tofu noodle bowl with broccoli and sesame">
    </div>
    <div class="meal-option-card-content">
      <p class="meal-option-card-name-row">
        <span class="meal-option-card-name"
              data-i18n-en="Tofu noodle bowl"
              data-i18n-es="Tazón de fideos con tofu">Tofu noodle bowl</span>
      </p>
      <p class="meal-option-card-description"
         data-i18n-en="Soft tofu, soba, broccoli, sesame."
         data-i18n-es="Tofu suave, soba, brócoli, sésamo.">Soft tofu, soba, broccoli, sesame.</p>
      <div class="meal-option-card-tags">
        <span class="badge badge-info"
              data-i18n-en="Low sodium"
              data-i18n-es="Bajo en sodio">Low sodium</span>
        <span class="badge badge-neutral"
              data-i18n-en="Vegetarian"
              data-i18n-es="Vegetariano">Vegetarian</span>
      </div>
      <div class="meal-option-card-footer">
        <span class="meal-option-card-price">$12.50</span>
        <div class="quantity-stepper" data-quantity-stepper data-value="1" data-min="0" data-max="10">
          <button type="button" class="quantity-stepper-btn" data-action="decrement"
                  aria-label="Decrease quantity of Tofu noodle bowl">
            <i class="fa-solid fa-minus" aria-hidden="true"></i>
          </button>
          <span class="quantity-stepper-value" aria-hidden="true">1</span>
          <span class="sr-only" data-quantity-stepper-announce aria-live="polite" aria-atomic="true"></span>
          <button type="button" class="quantity-stepper-btn" data-action="increment"
                  aria-label="Increase quantity of Tofu noodle bowl">
            <i class="fa-solid fa-plus" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Default variant — not yet in cart (qty 0). -->
  <div class="meal-option-card" data-meal-id="meal-salmon" data-meal-name="Salmon teriyaki" data-meal-price="13.00">
    <div class="meal-option-card-image">
      <img src="https://loremflickr.com/160/160/healthy,japanese,food?lock=14"
           alt="Salmon teriyaki with brown rice and bok choy">
    </div>
    <div class="meal-option-card-content">
      <p class="meal-option-card-name-row">
        <span class="meal-option-card-name"
              data-i18n-en="Salmon teriyaki"
              data-i18n-es="Salmón teriyaki">Salmon teriyaki</span>
      </p>
      <p class="meal-option-card-description"
         data-i18n-en="Glazed salmon, brown rice, bok choy."
         data-i18n-es="Salmón glaseado, arroz integral, bok choy.">Glazed salmon, brown rice, bok choy.</p>
      <div class="meal-option-card-tags">
        <span class="badge badge-info"
              data-i18n-en="Low sodium"
              data-i18n-es="Bajo en sodio">Low sodium</span>
      </div>
      <div class="meal-option-card-footer">
        <span class="meal-option-card-price">$13.00</span>
        <div class="quantity-stepper" data-quantity-stepper data-value="0" data-min="0" data-max="10">
          <button type="button" class="quantity-stepper-btn" data-action="decrement"
                  aria-label="Decrease quantity of Salmon teriyaki">
            <i class="fa-solid fa-minus" aria-hidden="true"></i>
          </button>
          <span class="quantity-stepper-value" aria-hidden="true">0</span>
          <span class="sr-only" data-quantity-stepper-announce aria-live="polite" aria-atomic="true"></span>
          <button type="button" class="quantity-stepper-btn" data-action="increment"
                  aria-label="Increase quantity of Salmon teriyaki">
            <i class="fa-solid fa-plus" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Placeholder variant — image missing; .meal-option-card-placeholder shows a
       utensils glyph on sand-100 ground. Use when image_url is null. -->
  <div class="meal-option-card" data-meal-id="meal-pollo-asado" data-meal-name="Pollo asado" data-meal-price="12.00">
    <div class="meal-option-card-image">
      <div class="meal-option-card-placeholder" aria-hidden="true">
        <i class="fa-regular fa-utensils"></i>
      </div>
    </div>
    <div class="meal-option-card-content">
      <p class="meal-option-card-name-row">
        <span class="meal-option-card-name"
              data-i18n-en="Pollo asado"
              data-i18n-es="Pollo asado">Pollo asado</span>
      </p>
      <p class="meal-option-card-description"
         data-i18n-en="Image coming soon."
         data-i18n-es="Imagen próximamente.">Image coming soon.</p>
      <div class="meal-option-card-tags">
        <span class="badge badge-info"
              data-i18n-en="Low sodium"
              data-i18n-es="Bajo en sodio">Low sodium</span>
      </div>
      <div class="meal-option-card-footer">
        <span class="meal-option-card-price">$12.00</span>
        <div class="quantity-stepper" data-quantity-stepper data-value="0" data-min="0" data-max="10">
          <button type="button" class="quantity-stepper-btn" data-action="decrement"
                  aria-label="Decrease quantity of Pollo asado">
            <i class="fa-solid fa-minus" aria-hidden="true"></i>
          </button>
          <span class="quantity-stepper-value" aria-hidden="true">0</span>
          <span class="sr-only" data-quantity-stepper-announce aria-live="polite" aria-atomic="true"></span>
          <button type="button" class="quantity-stepper-btn" data-action="increment"
                  aria-label="Increase quantity of Pollo asado">
            <i class="fa-solid fa-plus" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Canonical stepper → cart bridge. Lives at the consumer (this state's right-pane
     composition), not inside cart-panel.js. Drop this script after the menu-grid +
     cart-panel HTML; both modules (quantity-stepper.js, cart-panel.js) must be
     loaded first. -->
<script>
  (function () {
    var menuGrid = document.getElementById('menu-step4');
    var cartEl = document.querySelector('[data-cart-panel-id="cart-maria-step4"]');
    if (!menuGrid || !cartEl || !cartEl._cartPanel) return;
    menuGrid.addEventListener('quantity-change', function (e) {
      var stepper = e.target.closest('[data-quantity-stepper]');
      if (!stepper) return;
      var card = stepper.closest('[data-meal-id]');
      if (!card) return;
      var mealId = card.getAttribute('data-meal-id');
      var nextQty = e.detail.value;
      var updated = cartEl._cartPanel.setQty(mealId, nextQty);
      if (!updated && nextQty > 0) {
        cartEl._cartPanel.addItem({
          id: mealId,
          name: card.getAttribute('data-meal-name'),
          unitPrice: parseFloat(card.getAttribute('data-meal-price')),
          qty: nextQty
        });
      }
    });
  })();
</script>

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

### Meal-option-card — non-recommended-warned (`item.added AND NOT item.recommended`)

Activates on the meal-option-card when the patient adds an item flagged as off-care-plan. `.is-non-recommended-warned` reveals an always-visible inline `.meal-option-card-warning-row` below the tags row. Per chat-affordance-principles "warning over hiding," the card stays at full opacity and the stepper stays active — the patient is informed, not blocked. Help happens via the chat surface (the copy names Ava explicitly).

Replace one default-variant card in the menu-grid above when its corresponding cart line item is added by the patient (e.g., Fried plantains platter in this example, qty 1, $10.00 added to the cart):

```html
<div class="meal-option-card is-non-recommended-warned" data-meal-id="meal-plantains" data-meal-name="Fried plantains platter" data-meal-price="10.00">
  <div class="meal-option-card-image">
    <img src="https://loremflickr.com/160/160/caribbean,food,plantains?lock=15"
         alt="Fried plantains platter with garlic dipping sauce">
  </div>
  <div class="meal-option-card-content">
    <p class="meal-option-card-name-row">
      <span class="meal-option-card-name"
            data-i18n-en="Fried plantains platter"
            data-i18n-es="Plato de plátanos fritos">Fried plantains platter</span>
    </p>
    <p class="meal-option-card-description"
       data-i18n-en="Sweet plantains, garlic mojo, side of rice."
       data-i18n-es="Plátanos dulces, mojo de ajo, arroz.">Sweet plantains, garlic mojo, side of rice.</p>
    <div class="meal-option-card-tags">
      <span class="badge badge-neutral"
            data-i18n-en="Vegetarian"
            data-i18n-es="Vegetariano">Vegetarian</span>
    </div>
    <p class="meal-option-card-warning-row">
      <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
      <span data-i18n-en="This isn't a usual pick for your care plan — ask Ava if you want to talk it through."
            data-i18n-es="Esto no es una opción habitual para su plan de cuidado — pregúntele a Ava si quiere hablarlo.">This isn't a usual pick for your care plan — ask Ava if you want to talk it through.</span>
    </p>
    <div class="meal-option-card-footer">
      <span class="meal-option-card-price">$10.00</span>
      <div class="quantity-stepper" data-quantity-stepper data-value="1" data-min="0" data-max="10">
        <button type="button" class="quantity-stepper-btn" data-action="decrement"
                aria-label="Decrease quantity of Fried plantains platter">
          <i class="fa-solid fa-minus" aria-hidden="true"></i>
        </button>
        <span class="quantity-stepper-value" aria-hidden="true">1</span>
        <span class="sr-only" data-quantity-stepper-announce aria-live="polite" aria-atomic="true"></span>
        <button type="button" class="quantity-stepper-btn" data-action="increment"
                aria-label="Increase quantity of Fried plantains platter">
          <i class="fa-solid fa-plus" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  </div>
</div>
```

### Cart-panel — locked (post-submit, `step-6-submit-confirm`)

Same DOM as the default cart-panel above, with `.is-locked` added to the container. Hides `.cart-submit` and `.cart-helper`, reveals `.cart-panel-status` pill in the header. The cart-item-list reads as a static order summary; the cart-budget-remaining label stays the same. `cartEl._cartPanel.lock()` moves focus to the status pill (tabindex="-1") and writes a one-shot announcement into the `[data-cart-announce]` live region. Used by the implementing agent when state transitions to `step-6-submit-confirm` — flip the class, no re-render needed.

```html
<!-- Apply .is-locked to the cart-panel above; example diff: -->
<div class="cart-panel is-locked" data-cart-panel data-cart-panel-id="cart-maria-step4" data-budget-cap="200">
  <div class="cart-panel-header">
    <p class="cart-panel-title"
       data-i18n-en="Your order"
       data-i18n-es="Su pedido">Your order</p>
    <!-- Reveals automatically via .cart-panel.is-locked .cart-panel-status { display: inline-flex }. -->
    <span class="cart-panel-status" tabindex="-1">
      <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
      <span data-i18n-en="Sent to kitchen"
            data-i18n-es="Enviado a la cocina">Sent to kitchen</span>
    </span>
  </div>
  <!-- cart-panel-body unchanged; .cart-submit + .cart-helper are hidden by .is-locked rules in components.css. -->
  ...
</div>
```

Note: the wireframe Step 6 supplies a different `title-key` for the locked variant (`copy.cart-panel-title-locked` → "Your order" / "Su pedido"). The implementing agent swaps the title text when applying `.is-locked`. The menu-grid is intentionally NOT rendered at step-6-submit-confirm (per flow doc: "order summary card replaces the menu") — the right-pane composition is `cart-panel.is-locked + budget-meter` only at that state.

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

## Primitives consumed by this state

All Tier-1 PL primitives this composition depends on shipped to haven-ui main 2026-05-12. Source-of-truth implementations live in haven-ui at the paths below. The realized HTML in this doc mirrors those primitives' canonical anatomy; if they drift, regenerate from source — do not drift forward in this folder.

| Primitive | PL HTML | Vanilla JS module | Notes |
|---|---|---|---|
| `cart-panel` | `packages/design-system/pattern-library/components/cart-panel.html` | `packages/design-system/src/scripts/components/cart-panel.js` | Owns validator, helper switching, label swap, focus-on-lock, debounced live-region announcements, aria-describedby auto-wiring. |
| `menu-grid` | `packages/design-system/pattern-library/components/menu-grid.html` | — (layout-only) | Wraps the meal-option-card collection. |
| `meal-option-card` | `packages/design-system/pattern-library/components/meal-option-card.html` | — (composes quantity-stepper) | Variants: default, recommended, non-recommended-warned, placeholder. |
| `quantity-stepper` | `packages/design-system/pattern-library/components/quantity-stepper.html` | `packages/design-system/src/scripts/components/quantity-stepper.js` | Debounced (400ms) polite announcement; tap target 44px (WCAG 2.5.5). |
| `budget-meter` | (existing pre-2026-05-12) | — | Default + `.is-error` variants. |
| `patient-chat-message`, `chat-button-row`, `chat-handoff-trigger` | (existing) | — | Chat-pane composition primitives. |

Consumer-side wiring (required for runtime behavior):

1. Load both vanilla ES modules in the page: `<script src=".../quantity-stepper.js"></script>` and `<script src=".../cart-panel.js"></script>`.
2. After both load, wire the stepper → cart bridge (the inline `<script>` at the end of the Right-pane composition above). cart-panel.js does NOT auto-subscribe to `quantity-change` events; the bridge is the consumer's responsibility to keep the primitive framework-agnostic.

If any feedback emerges while implementing — primitive ergonomics, contract gaps, missing variants — surface it in the report below.

## Feedback target — required after implementing

Per `wireframes/feedback/_template.md`, append a report to:

`uconn-pilot-docs/wireframes/feedback/meal-ordering.step-4-cart.{YYYY-MM-DD}.md`

Cover at minimum: tag resolution (did every unblocked tag map cleanly?), missing primitives (the three above + anything else), copy gaps, behavior gaps, cross-doc lookups required, time estimate vs actual, and one sentence on what would have helped most. Recurring frictions across multiple reports drive schema iteration.
