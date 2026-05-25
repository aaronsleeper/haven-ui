/**
 * Cart Panel — pre-submit + locked variants for the meal-ordering right pane.
 *
 * Recomputes total + budget remaining from the cart-item-list DOM, toggles the
 * gate helper that matches the current validator failure (empty | over-budget),
 * swaps the budget-row label between "Budget remaining" and "Over budget by"
 * per validator state, and manages the submit button's `disabled` state per
 *   submit-disabled-when: cart.itemCount == 0 OR cart.total > budget.cap
 *
 * Framework-agnostic vanilla ES module. Drop-in usable in vanilla HTML;
 * convertible to Angular/React/etc. by reading the contract below.
 *
 * Usage:
 *   <div class="cart-panel" data-cart-panel data-budget-cap="200">
 *     ... (see cart-panel.html for full markup) ...
 *     <div class="cart-panel-body">
 *       <span class="sr-only" data-cart-announce
 *             aria-live="polite" aria-atomic="true"></span>
 *       <div class="cart-item-list" data-cart-item-list role="list"
 *            aria-label="Cart items">
 *         <div class="cart-item" data-cart-item-id="meal-1"
 *              data-unit-price="12.50" data-qty="2" role="listitem">...</div>
 *       </div>
 *       <span data-cart-total>$25.00</span>
 *       <span data-cart-budget-label>Budget remaining</span>
 *       <span data-cart-budget-remaining>$175.00</span>
 *       <p class="cart-helper is-gate" data-cart-helper="empty">...</p>
 *       <p class="cart-helper is-gate" data-cart-helper="over-budget">...</p>
 *       <button data-cart-submit>Send order to kitchen</button>
 *     </div>
 *     <span class="cart-panel-status" tabindex="-1">Sent to kitchen</span>
 *   </div>
 *
 * Attributes:
 *   data-budget-cap   numeric budget cap (default: Infinity — unbounded)
 *
 * Per cart-item (inside data-cart-item-list):
 *   data-cart-item-id  unique id for the meal
 *   data-unit-price    decimal per-unit price (e.g. "12.50")
 *   data-qty           integer current quantity
 *
 * Events:
 *   Dispatches 'cart-state-change' CustomEvent on the cart-panel element when
 *   state changes:
 *     detail = {
 *       itemCount, total, budgetRemaining, validatorPass,
 *       activeGate: 'empty' | 'over-budget' | null,
 *       source: 'init' | 'set-qty' | 'add' | 'remove' | 'submit'
 *     }
 *
 *   Dispatches 'cart-submit' CustomEvent (bubbling) on the cart-panel element
 *   when the submit button is clicked AND validatorPass is true. Consumers
 *   handle the order submission and call `_cartPanel.lock()` on success.
 *
 * Programmatic API (non-enumerable `_cartPanel` on the panel element):
 *   getState()                    → current state snapshot
 *   setQty(itemId, qty)           updates DOM + re-renders
 *   addItem({ id, name, unitPrice, qty })
 *   removeItem(itemId)
 *   lock()                        → adds .is-locked + moves focus to status pill
 *   unlock()                      → removes .is-locked
 *
 * Stepper integration:
 *   This script does NOT auto-subscribe to `quantity-change` events from
 *   sibling steppers — the cart-panel does not assume one-stepper-equals-one-
 *   cart-item without an explicit mapping. The consumer wires the bridge by
 *   listening for `quantity-change` on the menu-grid (or parent) and calling
 *   `_cartPanel.setQty(itemId, e.detail.value)`. See the wrapper page
 *   `pages/cart-panel.html` for the canonical bridge example.
 *
 * Accessibility (the primitive owns its own AT story):
 *   - aria-describedby auto-wiring: on init, the script assigns unique IDs
 *     to each `.cart-helper` instance inside the panel and sets
 *     `aria-describedby` on `[data-cart-submit]` referencing both. Because
 *     inactive helpers are `display: none` (excluded from the AT tree), the
 *     disabled submit reads only the currently-active helper as its
 *     description ("Send order to kitchen, dimmed, Add at least one meal to
 *     send your order.").
 *   - Debounced (400ms) polite live region: the `[data-cart-announce]` cell
 *     announces only on validator-state transitions (pass↔fail, fail-type
 *     swap empty↔over-budget) and on lock — not on every recompute. Matches
 *     the chatty-announcement-debounce pattern from quantity-stepper.js
 *     (coarse-grained polite live region for rapid programmatic state
 *     changes the user is not directly attending to).
 *   - Focus management on lock: `_cartPanel.lock()` moves focus to
 *     `.cart-panel-status` (which carries `tabindex="-1"` for programmatic
 *     focus only). Keeps keyboard users oriented after submit.
 *   - List semantics handled in HTML: `.cart-item-list` is `role="list"`,
 *     each `.cart-item` is `role="listitem"`. No JS wiring needed.
 *   - Budget-row label is owned by JS via `[data-cart-budget-label]` to keep
 *     the surrounding label and numeric value in sync (avoids a soft-trap
 *     where a consumer pre-renders "Budget remaining" but state transitions
 *     to over-budget, yielding "Budget remaining: $17.00" — wrong sign of
 *     meaning).
 */
(function () {
  var ANNOUNCE_DEBOUNCE_MS = 400;
  var LABEL_BUDGET_REMAINING = 'Budget remaining';
  var LABEL_OVER_BUDGET = 'Over budget by';
  var panelCounter = 0;

  document.querySelectorAll('[data-cart-panel]').forEach(function (panel) {
    panelCounter += 1;
    var panelId = panel.getAttribute('data-cart-panel-id') || ('cart-panel-' + panelCounter);

    var budgetCapAttr = panel.getAttribute('data-budget-cap');
    var budgetCap = budgetCapAttr !== null ? parseFloat(budgetCapAttr) : Infinity;

    var itemList = panel.querySelector('[data-cart-item-list]');
    var totalCell = panel.querySelector('[data-cart-total]');
    var budgetCell = panel.querySelector('[data-cart-budget-remaining]');
    var budgetLabelCell = panel.querySelector('[data-cart-budget-label]');
    var submitBtn = panel.querySelector('[data-cart-submit]');
    var helperEmpty = panel.querySelector('[data-cart-helper="empty"]');
    var helperOverBudget = panel.querySelector('[data-cart-helper="over-budget"]');
    var statusPill = panel.querySelector('.cart-panel-status');
    var announceCell = panel.querySelector('[data-cart-announce]');

    if (!itemList) return;

    // Wire aria-describedby: unique helper IDs scoped to this panel, then
    // point the submit's aria-describedby at both. Inactive helpers are
    // display:none so the AT tree only includes the active one.
    if (helperEmpty && !helperEmpty.id) helperEmpty.id = panelId + '-helper-empty';
    if (helperOverBudget && !helperOverBudget.id) helperOverBudget.id = panelId + '-helper-over-budget';
    if (submitBtn) {
      var describedBy = [];
      if (helperEmpty) describedBy.push(helperEmpty.id);
      if (helperOverBudget) describedBy.push(helperOverBudget.id);
      if (describedBy.length) submitBtn.setAttribute('aria-describedby', describedBy.join(' '));
    }

    function readItems() {
      var rows = itemList.querySelectorAll('.cart-item');
      var items = [];
      rows.forEach(function (row) {
        var id = row.getAttribute('data-cart-item-id') || '';
        var unitPrice = parseFloat(row.getAttribute('data-unit-price')) || 0;
        var qty = parseInt(row.getAttribute('data-qty'), 10);
        if (isNaN(qty) || qty < 0) qty = 0;
        items.push({ row: row, id: id, unitPrice: unitPrice, qty: qty });
      });
      return items;
    }

    function format(n) {
      // Two-decimal currency; negative budget remaining displays as positive
      // dollars (the surrounding label switches to "Over budget by …").
      return '$' + Math.abs(n).toFixed(2);
    }

    function computeState() {
      var items = readItems();
      var total = 0;
      var itemCount = 0;
      items.forEach(function (it) {
        total += it.unitPrice * it.qty;
        itemCount += it.qty;
      });
      var budgetRemaining = budgetCap - total;
      var overBudget = total > budgetCap;
      var empty = itemCount === 0;
      var validatorPass = !empty && !overBudget;
      var activeGate = empty ? 'empty' : (overBudget ? 'over-budget' : null);
      return {
        itemCount: itemCount,
        total: total,
        budgetRemaining: budgetRemaining,
        validatorPass: validatorPass,
        activeGate: activeGate
      };
    }

    function render(state) {
      if (totalCell) totalCell.textContent = format(state.total);
      if (budgetCell) budgetCell.textContent = format(state.budgetRemaining);
      if (budgetLabelCell) {
        budgetLabelCell.textContent = state.activeGate === 'over-budget'
          ? LABEL_OVER_BUDGET
          : LABEL_BUDGET_REMAINING;
      }
      if (helperEmpty) helperEmpty.classList.toggle('is-active', state.activeGate === 'empty');
      if (helperOverBudget) helperOverBudget.classList.toggle('is-active', state.activeGate === 'over-budget');
      if (submitBtn) submitBtn.disabled = !state.validatorPass;
    }

    var lastState = null;
    var announceTimer = null;

    function announce(text) {
      if (!announceCell || !text) return;
      if (announceTimer) clearTimeout(announceTimer);
      announceTimer = setTimeout(function () {
        // Clear then set so AT registers a change (some AT skip equal updates).
        announceCell.textContent = '';
        setTimeout(function () { announceCell.textContent = text; }, 10);
      }, ANNOUNCE_DEBOUNCE_MS);
    }

    function announceTransition(prev, next, source) {
      // Only announce on init if the cart starts in a fail state — silence
      // is the right outcome for a valid cart loading; the patient already
      // knows what's there.
      if (source === 'init') {
        if (next.validatorPass) return;
        if (next.activeGate === 'empty') {
          announce('Cart is empty. Add a meal to send your order.');
        } else if (next.activeGate === 'over-budget') {
          announce('Over budget. Total ' + format(next.total) + ' of '
                   + format(budgetCap) + '. Remove an item to send your order.');
        }
        return;
      }

      // Non-init: announce only on validator-state transitions.
      if (!prev) return;
      var prevPass = prev.validatorPass;
      var nextPass = next.validatorPass;
      var prevGate = prev.activeGate;
      var nextGate = next.activeGate;

      if (prevPass && !nextPass) {
        // Pass → fail. Name the new gate.
        if (nextGate === 'empty') {
          announce('Cart is empty. Add a meal to send your order.');
        } else if (nextGate === 'over-budget') {
          announce('Over budget. Total ' + format(next.total) + ' of '
                   + format(budgetCap) + '. Remove an item to send your order.');
        }
      } else if (!prevPass && nextPass) {
        // Fail → pass.
        announce('Cart is ready to send. Total ' + format(next.total)
                 + ', ' + format(next.budgetRemaining) + ' remaining.');
      } else if (!prevPass && !nextPass && prevGate !== nextGate) {
        // Fail-type swap (empty ↔ over-budget).
        if (nextGate === 'empty') {
          announce('Cart is empty. Add a meal to send your order.');
        } else if (nextGate === 'over-budget') {
          announce('Over budget. Total ' + format(next.total) + ' of '
                   + format(budgetCap) + '. Remove an item to send your order.');
        }
      }
    }

    function recompute(source) {
      var state = computeState();
      var prev = lastState;
      render(state);
      announceTransition(prev, state, source || 'init');
      lastState = state;
      panel.dispatchEvent(new CustomEvent('cart-state-change', {
        bubbles: true,
        detail: {
          itemCount: state.itemCount,
          total: state.total,
          budgetRemaining: state.budgetRemaining,
          validatorPass: state.validatorPass,
          activeGate: state.activeGate,
          source: source || 'init'
        }
      }));
    }

    function setQty(itemId, qty) {
      var rows = itemList.querySelectorAll('.cart-item');
      var found = null;
      rows.forEach(function (row) {
        if (row.getAttribute('data-cart-item-id') === itemId) found = row;
      });
      if (!found) return false;
      var nextQty = Math.max(0, parseInt(qty, 10) || 0);
      found.setAttribute('data-qty', String(nextQty));
      var qtyCell = found.querySelector('.cart-item-qty');
      var unitPrice = parseFloat(found.getAttribute('data-unit-price')) || 0;
      var priceCell = found.querySelector('.cart-item-price');
      if (qtyCell) qtyCell.textContent = '× ' + nextQty;
      if (priceCell) priceCell.textContent = format(unitPrice * nextQty);
      if (nextQty === 0) found.parentNode.removeChild(found);
      recompute('set-qty');
      return true;
    }

    function addItem(item) {
      if (!item || !item.id) return;
      var existing = itemList.querySelector('[data-cart-item-id="' + item.id + '"]');
      if (existing) {
        var existingQty = parseInt(existing.getAttribute('data-qty'), 10) || 0;
        setQty(item.id, existingQty + (item.qty || 1));
        return;
      }
      var row = document.createElement('div');
      row.className = 'cart-item';
      row.setAttribute('data-cart-item-id', item.id);
      row.setAttribute('data-unit-price', String(item.unitPrice || 0));
      row.setAttribute('data-qty', String(item.qty || 1));
      row.setAttribute('role', 'listitem');
      row.innerHTML =
        '<p>' +
          '<span class="cart-item-name"></span>' +
          '<span class="cart-item-qty"></span>' +
        '</p>' +
        '<span class="cart-item-price"></span>';
      row.querySelector('.cart-item-name').textContent = item.name || item.id;
      row.querySelector('.cart-item-qty').textContent = '× ' + (item.qty || 1);
      row.querySelector('.cart-item-price').textContent = format((item.unitPrice || 0) * (item.qty || 1));
      itemList.appendChild(row);
      recompute('add');
    }

    function removeItem(itemId) {
      var row = itemList.querySelector('[data-cart-item-id="' + itemId + '"]');
      if (!row) return false;
      row.parentNode.removeChild(row);
      recompute('remove');
      return true;
    }

    function lock() {
      panel.classList.add('is-locked');
      var state = lastState || computeState();
      announce('Order sent to kitchen. Total ' + format(state.total) + '.');
      if (statusPill && typeof statusPill.focus === 'function') {
        // setTimeout 0 lets the CSS .is-locked reveal commit before focus
        // moves, so AT sees the pill as visible when announcing it.
        setTimeout(function () { statusPill.focus(); }, 0);
      }
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', function () {
        var state = lastState || computeState();
        if (!state.validatorPass) return;
        panel.dispatchEvent(new CustomEvent('cart-submit', {
          bubbles: true,
          detail: {
            itemCount: state.itemCount,
            total: state.total,
            budgetRemaining: state.budgetRemaining
          }
        }));
      });
    }

    Object.defineProperty(panel, '_cartPanel', {
      value: {
        getState: function () { return lastState || computeState(); },
        setQty: setQty,
        addItem: addItem,
        removeItem: removeItem,
        lock: lock,
        unlock: function () { panel.classList.remove('is-locked'); }
      },
      enumerable: false,
      writable: false
    });

    recompute('init');
  });
})();
