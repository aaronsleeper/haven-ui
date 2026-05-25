/**
 * order.js — stepper→cart bridge for order.browse.html
 *
 * Wires the stepper `quantity-change` CustomEvents bubbling from #menu-grid
 * to the cart-panel.js programmatic API (_cartPanel.setQty / addItem /
 * removeItem), then syncs the budget meter and the mobile sticky-footer
 * from the cart-state-change event emitted by cart-panel.js.
 *
 * Design-system APIs used:
 *
 *   quantity-stepper.js:
 *     Event: 'quantity-change' (bubbling CustomEvent)
 *       detail = { value: number, previousValue: number, source: 'click'|'keyboard'|'set' }
 *
 *   cart-panel.js:
 *     Programmatic API on panel element (non-enumerable _cartPanel):
 *       setQty(itemId: string, qty: number) → boolean
 *       addItem({ id, name, unitPrice, qty }) → void
 *       removeItem(itemId: string) → boolean
 *       getState() → { itemCount, total, budgetRemaining, validatorPass, activeGate }
 *     Event: 'cart-state-change' (bubbling CustomEvent)
 *       detail = { itemCount, total, budgetRemaining, validatorPass,
 *                  activeGate: 'empty'|'over-budget'|null, source }
 *     Attribute: data-budget-cap — numeric cap (60 for this surface)
 *
 * Budget cap: $60/week. Meals $10 each.
 * Over-budget: cart-panel disables submit automatically; this bridge also
 *   adds .is-error to the budget meter and disables the sticky-footer CTA.
 * Submit: the data-cart-submit element is an <a> tag here (file://-safe
 *   navigation); cart-panel.js's click handler guards the disabled state
 *   but we intercept the 'cart-submit' event to force navigation.
 *
 * file://-safe: no fetch, no modules, no import().
 */
(function () {
  var BUDGET_CAP = 60;

  // ── DOM refs ──────────────────────────────────────────────────────────────
  var menuGrid    = document.getElementById('menu-grid');
  var cartPanel   = document.getElementById('cart-panel');
  var stickyFooter = document.getElementById('sticky-footer');
  var stickySummary = document.getElementById('sticky-cart-summary');
  var stickySubmit  = document.getElementById('sticky-submit-btn');

  var budgetMeter   = document.getElementById('budget-meter');
  var budgetAmount  = document.getElementById('budget-meter-amount');
  var budgetBar     = document.getElementById('budget-progress-bar');
  var budgetMessage = document.getElementById('budget-meter-message');

  var submitLink = document.getElementById('cart-submit-link');

  // ── Guard: if essential elements are missing, bail silently ───────────────
  if (!menuGrid || !cartPanel) return;

  // cart-panel.js attaches _cartPanel after its IIFE runs (same page load).
  // Scripts are in order: quantity-stepper.js → cart-panel.js → order.js,
  // so _cartPanel is guaranteed present by the time this runs.
  var api = cartPanel._cartPanel;
  if (!api) return;

  // ── Stepper → cart bridge ─────────────────────────────────────────────────
  // Listen for quantity-change events that bubble up from any stepper inside
  // the menu-grid. Read meal metadata from the closest [data-meal-id] ancestor
  // (the meal-option-card root), then call api.setQty or api.addItem depending
  // on whether the item is already in the cart.

  menuGrid.addEventListener('quantity-change', function (e) {
    // e.target is the stepper element that dispatched the event.
    var stepperEl = e.target;
    var card = stepperEl.closest('[data-meal-id]');
    if (!card) return;

    var itemId    = card.getAttribute('data-meal-id');
    var itemName  = card.getAttribute('data-meal-name') || itemId;
    var unitPrice = parseFloat(card.getAttribute('data-meal-price')) || 10;
    var qty       = e.detail.value;

    if (qty === 0) {
      // qty dropped to zero — remove from cart if present.
      api.removeItem(itemId);
    } else {
      // Try setQty first (updates existing row). If item isn't in the cart
      // yet (setQty returns false), add it fresh.
      var updated = api.setQty(itemId, qty);
      if (!updated) {
        api.addItem({ id: itemId, name: itemName, unitPrice: unitPrice, qty: qty });
      }
    }
    // cart-state-change fires after every setQty / addItem / removeItem call;
    // the renderBudgetMeter + renderStickyFooter handlers below pick it up.
  });

  // ── Cart-state → budget meter + sticky footer ─────────────────────────────
  // cart-panel.js dispatches 'cart-state-change' on the panel element after
  // every recompute (init, set-qty, add, remove, submit).

  cartPanel.addEventListener('cart-state-change', function (e) {
    var state = e.detail;
    renderBudgetMeter(state);
    renderStickyFooter(state);
  });

  function renderBudgetMeter(state) {
    if (!budgetMeter) return;
    var total   = state.total;
    var spent   = Math.min(total, BUDGET_CAP);
    var pct     = Math.round((spent / BUDGET_CAP) * 100);
    var overBy  = total - BUDGET_CAP;
    var isOver  = total > BUDGET_CAP;

    // Amount label
    if (budgetAmount) {
      if (isOver) {
        budgetAmount.textContent = '$' + total.toFixed(0) + ' of $' + BUDGET_CAP + ' (over by $' + overBy.toFixed(0) + ')';
      } else {
        var remaining = BUDGET_CAP - total;
        budgetAmount.textContent = '$' + remaining.toFixed(0) + ' of $' + BUDGET_CAP + ' left';
      }
    }

    // Progress bar — clamped at 100% visually; is-error class on meter when over
    if (budgetBar) {
      budgetBar.style.width = Math.min(pct, 100) + '%';
      // Swap color class: progress-success ↔ progress-error
      budgetBar.classList.toggle('progress-success', !isOver);
      budgetBar.classList.toggle('progress-error', isOver);
    }

    // Budget meter wrapper — .is-error for over-budget state
    budgetMeter.classList.toggle('is-error', isOver);

    // Message line
    if (budgetMessage) {
      if (isOver) {
        budgetMessage.textContent = 'Remove some items to stay within your $' + BUDGET_CAP + ' budget.';
      } else if (total === 0) {
        budgetMessage.textContent = 'Your order can\'t go over $' + BUDGET_CAP + ' total.';
      } else {
        var leftAmt = BUDGET_CAP - total;
        budgetMessage.textContent = '$' + leftAmt.toFixed(0) + ' left in your budget.';
      }
    }
  }

  function renderStickyFooter(state) {
    if (!stickyFooter) return;
    var hasItems = state.itemCount > 0;

    // Show / hide the sticky footer
    if (hasItems) {
      stickyFooter.removeAttribute('hidden');
    } else {
      stickyFooter.setAttribute('hidden', '');
    }

    // Summary line: "N item(s) · $X.XX"
    if (stickySummary) {
      var noun = state.itemCount === 1 ? 'item' : 'items';
      stickySummary.textContent = state.itemCount + ' ' + noun + ' · $' + state.total.toFixed(2);
    }

    // Disable the CTA when over budget — pointer-events off + aria-disabled
    if (stickySubmit) {
      if (!state.validatorPass && state.activeGate === 'over-budget') {
        stickySubmit.setAttribute('aria-disabled', 'true');
        stickySubmit.style.pointerEvents = 'none';
        stickySubmit.style.opacity = '0.5';
      } else {
        stickySubmit.removeAttribute('aria-disabled');
        stickySubmit.style.pointerEvents = '';
        stickySubmit.style.opacity = '';
      }
    }
  }

  // ── Submit navigation ─────────────────────────────────────────────────────
  // cart-panel.js emits 'cart-submit' when the submit button is clicked AND
  // validatorPass is true. For the <a> element used here (file://-safe),
  // the default href navigation fires naturally when not disabled — but we
  // also listen for the event to ensure consistency with the locked state.

  cartPanel.addEventListener('cart-submit', function () {
    window.location.href = '../order-status/order-status.active.html';
  });

  // Guard against clicking the disabled submit link directly when over-budget.
  // cart-panel.js sets submitBtn.disabled = !validatorPass, which blocks native
  // <button> clicks. For <a role="button"> we intercept and check state.
  if (submitLink) {
    submitLink.addEventListener('click', function (e) {
      var state = api.getState();
      if (!state.validatorPass) {
        e.preventDefault();
      }
    });
  }

  // ── Init: sync budget meter from initial cart state ───────────────────────
  // cart-panel.js fires 'cart-state-change' with source='init' on script load,
  // but that fires before order.js adds its listener. Call getState() directly
  // to render the initial meter/footer state.

  var initState = api.getState();
  renderBudgetMeter(initState);
  renderStickyFooter(initState);

})();
