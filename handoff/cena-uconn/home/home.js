/*
 * home.js — Home "things-to-do" zone controller (Cena patient app, IA v1).
 *
 * Framework-agnostic vanilla ES module. Drop-in for the self-contained handoff
 * bundle (no Preline, no framework); Andrey ports the contract to Angular.
 * Mirrors the per-primitive JS convention used by quantity-stepper.js /
 * cart-panel.js: find instances by data attribute, attach behavior, emit
 * bubbling CustomEvents, expose a programmatic API on the host element.
 *
 * Spec: ~/.claude/plans/patient-app-home-surface.md §4 (Surfacer behavior:
 * one item at a time, "Not now" respected + remembered, completion lands in
 * calm, no nagging). Static markup contract lives in home.one-item.html /
 * home.several.html / home.caught-up.html.
 *
 * ── Markup contract (data attributes) ───────────────────────────────────────
 *   [data-home-zone]              the reserved things-to-do <section>
 *   [data-home-announce]          visually-hidden polite live region inside the
 *                                 zone (JS owns announcements; debounced ≥500ms)
 *   [data-focus-card]             a surfaced due-item card
 *     [data-item-id="<id>"]       stable id — the unit of dismiss-memory
 *     [data-focus-primary]        on the single top-pick card (outside <details>)
 *   [data-dismiss]                the "Not now" control inside a focus card
 *   [data-home-overflow]          the native <details> holding non-primary cards
 *   [data-caught-up]              the calm affirmation block; hidden until empty
 *
 * ── Behavior ─────────────────────────────────────────────────────────────────
 *   • On surface: announce the primary item once, debounced ≥500ms (no chatty
 *     re-announcement on rapid mutation — JS owns the debounce, never raw
 *     aria-live for rapid changes).
 *   • "Not now": recede the card, remember the dismissal (localStorage), and do
 *     NOT re-surface that item on the next open. Focus moves to the next card's
 *     primary action, else the zone heading — never <body>. Never punished.
 *   • One primary focus card at a time; overflow lives in the native <details>.
 *   • When the zone empties, reveal the caught-up affirmation. Completion lands
 *     in calm, stated plainly — no celebration, no "0 tasks".
 *
 * ── Events (bubbling CustomEvent on the zone element) ────────────────────────
 *   home:surfaced   { itemId }   primary item announced
 *   home:dismissed  { itemId }   patient chose "Not now"
 *   home:caught-up  {}           zone emptied; affirmation revealed
 *
 * ── Programmatic API (non-enumerable, on the zone element) ───────────────────
 *   el._home.dismiss(itemId)     dismiss an item programmatically
 *   el._home.reset()             clear dismiss-memory for this zone's items
 *   el._home.visibleItemIds()    -> string[] of still-surfaced item ids
 *
 * Dismiss-memory key: localStorage["cena.home.dismissed"] — a JSON array of
 * item ids. Production replaces this with the Surfacer's server-side
 * dismissal cadence (§4); localStorage is the bundle's stand-in.
 */
(function () {
  'use strict';

  var STORE_KEY = 'cena.home.dismissed';
  var ANNOUNCE_DEBOUNCE_MS = 500;

  function loadDismissed() {
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function saveDismissed(ids) {
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(ids));
    } catch (e) {
      /* storage unavailable (private mode) — dismissal is session-only */
    }
  }

  function initZone(zone) {
    if (zone._home) return; // already initialized

    var announceEl = zone.querySelector('[data-home-announce]');
    var caughtUp = zone.querySelector('[data-caught-up]');
    var overflow = zone.querySelector('[data-home-overflow]');
    var announceTimer = null;

    // Progressive enhancement: with JS present, the dedicated [data-home-announce]
    // region owns announcements. Silence the visible zone's own aria-live so a
    // dismissal doesn't double-announce. (No-JS users keep the zone live.)
    if (announceEl) zone.setAttribute('aria-live', 'off');

    function announce(msg) {
      if (!announceEl || !msg) return;
      window.clearTimeout(announceTimer);
      announceTimer = window.setTimeout(function () {
        announceEl.textContent = '';
        // next frame so AT registers the change as a fresh insertion
        window.requestAnimationFrame(function () {
          announceEl.textContent = msg;
        });
      }, ANNOUNCE_DEBOUNCE_MS);
    }

    function cards() {
      return Array.prototype.slice.call(zone.querySelectorAll('[data-focus-card]'));
    }

    function visibleCards() {
      return cards().filter(function (c) {
        return c.getAttribute('data-dismissed') !== 'true' && !c.hasAttribute('hidden');
      });
    }

    function titleOf(card) {
      var t = card.querySelector('.patient-focus-card-title');
      return t ? t.textContent.trim() : 'A new item';
    }

    function hideCard(card) {
      card.setAttribute('data-dismissed', 'true');
      card.setAttribute('hidden', '');
    }

    function revealCaughtUp(announceCompletion) {
      if (caughtUp) caughtUp.removeAttribute('hidden');
      if (overflow) overflow.setAttribute('hidden', '');
      // Only announce completion when a dismissal emptied the zone — never on a
      // fresh load that was already caught-up (the patient completed nothing).
      if (announceCompletion) {
        announce('That’s taken care of. Nothing needs your attention right now.');
      }
      zone.dispatchEvent(new CustomEvent('home:caught-up', { bubbles: true, detail: {} }));
    }

    function focusAfterDismiss() {
      var next = visibleCards()[0];
      if (next) {
        var action = next.querySelector('.btn-primary, a[href], button:not([data-dismiss])');
        if (action && typeof action.focus === 'function') {
          action.focus();
          return;
        }
      }
      // No card left to take focus — move it to the zone, never <body>.
      if (!zone.hasAttribute('tabindex')) zone.setAttribute('tabindex', '-1');
      zone.focus();
    }

    function dismiss(itemId, opts) {
      var card = cards().filter(function (c) {
        return c.getAttribute('data-item-id') === itemId;
      })[0];
      if (!card || card.getAttribute('data-dismissed') === 'true') return;

      hideCard(card);

      if (!opts || opts.remember !== false) {
        var ids = loadDismissed();
        if (ids.indexOf(itemId) === -1) {
          ids.push(itemId);
          saveDismissed(ids);
        }
      }

      zone.dispatchEvent(new CustomEvent('home:dismissed', {
        bubbles: true,
        detail: { itemId: itemId }
      }));

      var remaining = visibleCards();
      if (remaining.length === 0) {
        revealCaughtUp(true);
      } else {
        focusAfterDismiss();
      }
    }

    // Apply remembered dismissals from a prior open (don't re-surface them).
    var remembered = loadDismissed();
    cards().forEach(function (card) {
      var id = card.getAttribute('data-item-id');
      if (id && remembered.indexOf(id) !== -1) hideCard(card);
    });

    // Wire each "Not now".
    zone.querySelectorAll('[data-dismiss]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var card = btn.closest('[data-focus-card]');
        var id = card && card.getAttribute('data-item-id');
        if (id) dismiss(id);
      });
    });

    // Announce on surface, or fall into caught-up if everything was pre-dismissed.
    var visible = visibleCards();
    if (visible.length === 0 && (caughtUp || overflow)) {
      revealCaughtUp(false);
    } else if (visible.length > 0) {
      var primary = visible.filter(function (c) {
        return c.hasAttribute('data-focus-primary');
      })[0] || visible[0];
      var id = primary.getAttribute('data-item-id');
      announce(titleOf(primary));
      zone.dispatchEvent(new CustomEvent('home:surfaced', {
        bubbles: true,
        detail: { itemId: id }
      }));
    }

    Object.defineProperty(zone, '_home', {
      value: {
        dismiss: function (itemId) { dismiss(itemId); },
        reset: function () {
          var ids = cards().map(function (c) { return c.getAttribute('data-item-id'); });
          var kept = loadDismissed().filter(function (id) { return ids.indexOf(id) === -1; });
          saveDismissed(kept);
        },
        visibleItemIds: function () {
          return visibleCards().map(function (c) { return c.getAttribute('data-item-id'); });
        }
      },
      enumerable: false,
      configurable: true
    });
  }

  function init() {
    document.querySelectorAll('[data-home-zone]').forEach(initZone);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
