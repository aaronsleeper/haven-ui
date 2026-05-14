// Meal-ordering screen — deterministic UI for the UConn pilot patient app.
//
// Composition per `meal-ordering.step-2-state-read.mdoc` + `step-4-cart.mdoc`:
//   cart-panel (top) + menu-grid (below) on a single content column.
// The agentic right-pane composition collapses into one screen in deterministic
// mode — chat-pane affordances are deferred to a future agentic build.
//
// State: pre-selected cart from `PRE_SELECTED_CART` (simulating the Step-2
// state-read "I started a list based on what worked for you last time").
// Patient edits in place via quantity controls on each menu card. Submit
// locks the cart and switches to order-summary mode (`.cart-panel.is-locked`).
//
// Persistence: localStorage at `MEAL_ORDER_STATE_KEY` so the demo state
// survives navigation away and back. Reset by clearing the key.
//
// Mock data canonical at `lib/demo-patient.ts` — 14 meal options per cap-17
// May 6 decision; $200/week budget per cap-18 / cap-40. No food images
// per Aaron's scope deferral (Andrey complexity concern); meals render with
// the `meal-option-card-placeholder` class instead.

import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../../lib/useLanguage';
import type { Language } from '../../lib/useLanguage';
import {
  BUDGET_CAP,
  MEAL_ORDER_STATE_KEY,
  PRE_SELECTED_CART,
  THIS_WEEK_MENU,
  demoDates,
} from '../../lib/demo-patient';
import type { MealOption } from '../../lib/demo-patient';

interface CartItem {
  mealId: string;
  qty: number;
}

interface OrderState {
  items: CartItem[];
  locked: boolean;
}

function loadOrderState(): OrderState {
  try {
    const raw = localStorage.getItem(MEAL_ORDER_STATE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as OrderState;
      if (Array.isArray(parsed.items) && typeof parsed.locked === 'boolean') {
        return parsed;
      }
    }
  } catch {
    // fallthrough to default
  }
  return { items: PRE_SELECTED_CART, locked: false };
}

function fmtPrice(n: number): string {
  return `$${n.toFixed(2)}`;
}

function mealById(id: string): MealOption | undefined {
  return THIS_WEEK_MENU.find((m) => m.id === id);
}

export function Meals() {
  const [lang] = useLanguage();
  const [order, setOrder] = useState<OrderState>(loadOrderState);

  useEffect(() => {
    try {
      localStorage.setItem(MEAL_ORDER_STATE_KEY, JSON.stringify(order));
    } catch {
      // Storage write failure: state still applies for the current session.
    }
  }, [order]);

  // Derived state.
  const { total, mealCount } = useMemo(() => {
    let t = 0;
    let count = 0;
    for (const item of order.items) {
      const meal = mealById(item.mealId);
      if (!meal) continue;
      t += meal.price * item.qty;
      count += item.qty;
    }
    return { total: t, mealCount: count };
  }, [order.items]);

  const isEmpty = order.items.length === 0 || mealCount === 0;
  const isOverBudget = total > BUDGET_CAP;
  const submitDisabled = isEmpty || isOverBudget;
  const budgetRemaining = BUDGET_CAP - total;

  function getQty(mealId: string): number {
    return order.items.find((i) => i.mealId === mealId)?.qty ?? 0;
  }

  function setQty(mealId: string, qty: number): void {
    setOrder((prev) => {
      if (prev.locked) return prev;
      const existing = prev.items.find((i) => i.mealId === mealId);
      if (qty <= 0) {
        return { ...prev, items: prev.items.filter((i) => i.mealId !== mealId) };
      }
      if (existing) {
        return {
          ...prev,
          items: prev.items.map((i) => (i.mealId === mealId ? { ...i, qty } : i)),
        };
      }
      return { ...prev, items: [...prev.items, { mealId, qty }] };
    });
  }

  function handleSubmit(): void {
    if (submitDisabled) return;
    setOrder((prev) => ({ ...prev, locked: true }));
  }

  // Sort: recommended first, then alphabetical.
  const sortedMenu = useMemo(() => {
    return [...THIS_WEEK_MENU].sort((a, b) => {
      if (a.recommended !== b.recommended) return a.recommended ? -1 : 1;
      return a.name.en.localeCompare(b.name.en);
    });
  }, []);

  // Build cart-item list (only items with qty > 0, in menu order).
  const cartItems = useMemo(() => {
    return sortedMenu
      .map((meal) => {
        const qty = getQty(meal.id);
        return qty > 0 ? { meal, qty } : null;
      })
      .filter((x): x is { meal: MealOption; qty: number } => x !== null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedMenu, order.items]);

  const L = (s: { en: string; es: string }) => s[lang as Language];

  // Copy strings (canonical authority: wireframe `{% copy %}` blocks per the
  // define-once rule — keys mirror those in meal-ordering.step-4-cart.mdoc).
  const copy = {
    pageTitle: { en: "This week's meals", es: 'Sus comidas de la semana' },
    pageSubtitle: order.locked
      ? {
          en: `Your order is in. Delivery ${demoDates.mealDeliveryShort.en}.`,
          es: `Su pedido está confirmado. Entrega ${demoDates.mealDeliveryShort.es}.`,
        }
      : {
          en: `Confirm by ${demoDates.mealConfirmBy.en}. You can change anything before then.`,
          es: `Confirme antes del ${demoDates.mealConfirmBy.es}. Puede cambiar lo que quiera antes.`,
        },
    cartTitle: order.locked
      ? { en: 'Your order', es: 'Su pedido' }
      : { en: 'Your cart', es: 'Su carrito' },
    cartStatus: { en: 'Sent to kitchen', es: 'Enviado a la cocina' },
    totalLabel: { en: 'Total', es: 'Total' },
    budgetRemainingLabel: { en: 'Budget remaining', es: 'Presupuesto restante' },
    overBudgetLabel: { en: 'Over budget by', es: 'Excede el presupuesto en' },
    helperEmpty: {
      en: 'Add at least one meal to send your order.',
      es: 'Agregue al menos una comida para enviar su pedido.',
    },
    helperOverBudget: {
      en: 'Remove an item or lower a quantity to send your order.',
      es: 'Quite una comida o baje una cantidad para enviar su pedido.',
    },
    submitLabel: {
      en: 'Send order to kitchen',
      es: 'Enviar pedido a la cocina',
    },
    cap40Disclaimer: {
      en: 'Final amount may vary based on what the kitchen prepares.',
      es: 'El monto final puede variar según lo que prepare la cocina.',
    },
    menuTitle: { en: "This week's menu", es: 'El menú de la semana' },
    pickedForYou: { en: 'Picked for you', es: 'Elegido para usted' },
    addLabel: { en: 'Add', es: 'Agregar' },
    decreaseLabel: { en: 'Decrease quantity', es: 'Disminuir cantidad' },
    increaseLabel: { en: 'Increase quantity', es: 'Aumentar cantidad' },
    removeLabel: { en: 'Remove from cart', es: 'Quitar del carrito' },
    budgetMeterLabel: { en: "This week's meal budget", es: 'Su presupuesto semanal' },
    budgetMeterEmptyMsg: {
      en: 'Your weekly budget resets every Monday.',
      es: 'Su presupuesto se renueva cada lunes.',
    },
    budgetMeterDefaultMsg: (left: string) => ({
      en: `${left} left this week.`,
      es: `${left} disponibles esta semana.`,
    }),
    budgetMeterErrorMsg: (over: string) => ({
      en: `Over budget by ${over}. Adjust your order or reach out for an exception.`,
      es: `Excede el presupuesto en ${over}. Ajuste su pedido o contacte a su equipo.`,
    }),
    budgetMeterLockedMsg: (left: string) => ({
      en: `Order placed. ${left} left this week.`,
      es: `Pedido enviado. ${left} disponibles esta semana.`,
    }),
  };

  return (
    <div className="pb-safe-8">
      {/* Header */}
      <div className="px-4 pt-4 pb-6">
        <h1 className="page-title">{L(copy.pageTitle)}</h1>
        <p className="text-sm text-sand-600 mt-0.5">{L(copy.pageSubtitle)}</p>
      </div>

      {/* Budget meter — visual progress of weekly $200 budget; complements
          the inline cart-budget-remaining row inside cart-panel. */}
      <div className="px-4 mb-4">
        {(() => {
          const fillPct = Math.min(100, Math.max(0, (total / BUDGET_CAP) * 100));
          const meterClasses = [
            'budget-meter',
            mealCount === 0 ? 'is-empty' : '',
            isOverBudget ? 'is-error' : '',
          ]
            .filter(Boolean)
            .join(' ');
          const progressClasses = isOverBudget
            ? 'progress progress-error'
            : 'progress progress-success';
          let message: { en: string; es: string };
          if (isOverBudget) {
            message = copy.budgetMeterErrorMsg(fmtPrice(total - BUDGET_CAP));
          } else if (mealCount === 0) {
            message = copy.budgetMeterEmptyMsg;
          } else if (order.locked) {
            message = copy.budgetMeterLockedMsg(fmtPrice(budgetRemaining));
          } else {
            message = copy.budgetMeterDefaultMsg(fmtPrice(budgetRemaining));
          }
          return (
            <div className={meterClasses}>
              <div className="budget-meter-label">
                <span>{L(copy.budgetMeterLabel)}</span>
                <span className="budget-meter-amount">
                  {fmtPrice(total)} {lang === 'es' ? 'de' : 'of'} {fmtPrice(BUDGET_CAP)}
                </span>
              </div>
              <div className={progressClasses}>
                <div className="progress-bar" style={{ width: `${fillPct}%` }} />
              </div>
              <p className="budget-meter-message">{L(message)}</p>
            </div>
          );
        })()}
      </div>

      {/* Cart panel */}
      <div className="px-4 mb-4">
        <div className={`cart-panel${order.locked ? ' is-locked' : ''}`}>
          <div className="cart-panel-header">
            <p className="cart-panel-title">{L(copy.cartTitle)}</p>
            <span className="cart-panel-status" tabIndex={-1}>
              <span className="material-symbols-outlined" aria-hidden="true">
                check_circle
              </span>
              {L(copy.cartStatus)}
            </span>
          </div>
          <div className="cart-panel-body">
            <span
              className="sr-only"
              aria-live="polite"
              aria-atomic="true"
              data-cart-announce
            />
            {cartItems.length > 0 ? (
              <div
                className="cart-item-list"
                role="list"
                aria-label={lang === 'es' ? 'Comidas en el carrito' : 'Cart items'}
              >
                {cartItems.map(({ meal, qty }) => (
                  <div className="cart-item" role="listitem" key={meal.id}>
                    <p>
                      <span className="cart-item-name">{L(meal.name)}</span>
                      <span className="cart-item-qty">× {qty}</span>
                    </p>
                    <span className="cart-item-price">{fmtPrice(meal.price * qty)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="cart-item-list"
                role="list"
                aria-label={lang === 'es' ? 'Comidas en el carrito' : 'Cart items'}
              />
            )}
            <div className="cart-total">
              <div className="cart-total-row is-primary">
                <span>{L(copy.totalLabel)}</span>
                <span>{fmtPrice(total)}</span>
              </div>
              <div className="cart-budget-remaining">
                <span>
                  {isOverBudget ? L(copy.overBudgetLabel) : L(copy.budgetRemainingLabel)}
                </span>
                <span>{fmtPrice(Math.abs(budgetRemaining))}</span>
              </div>
            </div>
            {/* Cap-40 disclaimer rides on the budget-remaining context line per the
                Step 6 wireframe — surfaced when locked. */}
            {order.locked && (
              <p className="text-xs text-sand-600 mt-2">{L(copy.cap40Disclaimer)}</p>
            )}
            {!order.locked && isEmpty && (
              <p className="cart-helper is-gate is-active">
                <span className="material-symbols-outlined" aria-hidden="true">
                  info
                </span>
                <span>{L(copy.helperEmpty)}</span>
              </p>
            )}
            {!order.locked && !isEmpty && isOverBudget && (
              <p className="cart-helper is-gate is-active">
                <span className="material-symbols-outlined" aria-hidden="true">
                  info
                </span>
                <span>{L(copy.helperOverBudget)}</span>
              </p>
            )}
            {!order.locked && (
              <button
                type="button"
                className="btn btn-primary btn-block cart-submit"
                onClick={handleSubmit}
                disabled={submitDisabled}
              >
                {L(copy.submitLabel)}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Menu grid (hidden when order is locked — post-submit state) */}
      {!order.locked && (
        <div className="px-4 mb-4">
          <div className="menu-grid">
            <div className="menu-grid-header">
              <h2 className="menu-grid-title">{L(copy.menuTitle)}</h2>
            </div>
            {sortedMenu.map((meal) => {
              const qty = getQty(meal.id);
              const cardClasses = [
                'meal-option-card',
                meal.recommended ? 'is-recommended' : '',
                qty > 0 ? 'is-in-cart' : '',
              ]
                .filter(Boolean)
                .join(' ');
              return (
                <article key={meal.id} className={cardClasses}>
                  <div className="meal-option-card-content">
                    <p className="meal-option-card-name-row">
                      <span className="meal-option-card-name">{L(meal.name)}</span>
                    </p>
                    <p className="meal-option-card-description">{L(meal.description)}</p>
                    <div className="meal-option-card-tags">
                      {meal.recommended && (
                        <span className="badge badge-primary">
                          <span className="material-symbols-outlined" aria-hidden="true">
                            auto_awesome
                          </span>
                          {L(copy.pickedForYou)}
                        </span>
                      )}
                      {meal.tags.map((tag, idx) => (
                        <span key={idx} className={`badge badge-${tag.variant}`}>
                          {L(tag.label)}
                        </span>
                      ))}
                    </div>
                    <div className="meal-option-card-footer">
                      <span className="meal-option-card-price">{fmtPrice(meal.price)}</span>
                      {qty === 0 ? (
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => setQty(meal.id, 1)}
                        >
                          <span className="material-symbols-outlined" aria-hidden="true">
                            add
                          </span>
                          {L(copy.addLabel)}
                        </button>
                      ) : (
                        <div
                          className="flex items-center gap-2"
                          role="group"
                          aria-label={`${L(meal.name)} quantity`}
                        >
                          <button
                            type="button"
                            className="btn btn-outline btn-icon btn-sm"
                            onClick={() => setQty(meal.id, qty - 1)}
                            aria-label={L(copy.decreaseLabel)}
                          >
                            <span className="material-symbols-outlined" aria-hidden="true">
                              {qty === 1 ? 'delete' : 'remove'}
                            </span>
                          </button>
                          <span
                            className="text-sm font-semibold tabular-nums min-w-6 text-center"
                            aria-live="polite"
                          >
                            {qty}
                          </span>
                          <button
                            type="button"
                            className="btn btn-outline btn-icon btn-sm"
                            onClick={() => setQty(meal.id, qty + 1)}
                            aria-label={L(copy.increaseLabel)}
                          >
                            <span className="material-symbols-outlined" aria-hidden="true">
                              add
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
