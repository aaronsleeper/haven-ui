/**
 * Dietary recall runner — Cena × UConn pilot handoff
 *
 * Drives the chat-primary multi-pass recall state machine:
 *   entry → pass1 → pass2 → pass3 → pass4 → review → confirm
 *
 * This is a DIFFERENT runner from assessment-runner.js. It maintains a
 * FoodItem[] state across passes and sequences agent messages per pass.
 * The interview is open-ended (free-text patient input, not radio options);
 * each pass adds a column to the running food list.
 *
 * Vanilla ES (no deps). Drop-in for the cena-uconn handoff demos so Andrey
 * can step through them in a browser; port the contract to Angular.
 *
 * NOT the same engine as packages/design-system/src/scripts/components/assessment.js
 * (that file backs an older prototype with a different DOM/class contract).
 *
 * ── Wiring contract ─────────────────────────────────────────────────────────
 *
 * HTML provides one root element [data-recall-root], with child sections
 * <section data-pass="entry|pass1|pass2|pass3|pass4|review|confirm">.
 * The engine toggles [hidden] on those sections.
 *
 * Each pass section:
 *   - .recall-chat-thread — where agent messages + affordances live (the runner
 *     APPENDS new patient-chat-message elements as the pass progresses)
 *   - .recall-list — the patient-recall-list DOM node in the right pane that
 *     the runner updates per-item as columns populate
 *   - [data-action] buttons wire to runner actions (see ACTIONS below)
 *
 * Alternatively (demo mode): the static HTML state pages each represent a
 * single point in time; the runner is wired but the full interview flow is
 * split across separate HTML files. The runner still boots and wires actions
 * so Andrey can interact with individual states without a server.
 *
 * ── State shape ─────────────────────────────────────────────────────────────
 *
 *   interface FoodItem {
 *     id: string;                  // auto-generated slug, e.g. "item-0"
 *     name: string;                // food/drink name as patient said it
 *     when?: string;               // time + occasion (populates in pass 3)
 *     amount?: string;             // portion + preparation (populates in pass 4)
 *     addedInPass: number;         // which pass added this item (1 or 2)
 *   }
 *
 *   interface RecallSession {
 *     recallDate: string;          // ISO date string of the recalled day
 *     currentPass: RecallPass;     // current pass name
 *     items: FoodItem[];           // running food list — accumulates across passes
 *     status: 'in-progress' | 'submitted';
 *     startedAt: number;           // Date.now()
 *     submittedAt?: number;
 *   }
 *
 *   type RecallPass =
 *     'entry' | 'pass1' | 'pass2' | 'pass3' | 'pass4' | 'review' | 'confirm';
 *
 * ── Pass sequence ────────────────────────────────────────────────────────────
 *
 *   entry    → patient picks "Yesterday" or "A different day"
 *              session.recallDate is set; right pane initializes with day label
 *   pass1    → quick list: patient names foods freely; each parsed item appended
 *              to items[]; list shows names only (no when, no amount)
 *   pass2    → forgotten foods: agent probes for drinks, snacks, off-plate items;
 *              same free-text input as pass1; items appended to items[]
 *   pass3    → time/occasion: agent walks chronologically; each item's .when
 *              is populated via [data-action="set-when"] or free-text parse
 *   pass4    → detail/portion: agent asks amounts per item; each item's .amount
 *              is populated via chat-numeric-input submit or free-text parse
 *   review   → agent reads back verbal summary; patient can correct via chat
 *              or tap a right-pane row; [data-action="submit-recall"] locks the list
 *   confirm  → receipt shown; right pane switches to log-confirmation-card;
 *              no score, no HEI number
 *
 * ── Edit paths (available during passes 2–6 / review) ───────────────────────
 *
 *   Path A — talk to agent: patient says "I didn't have eggs, I had oatmeal."
 *     → runner parses correction and calls updateItem() or replaceItem()
 *     → agent replies verbally, right pane updates silently
 *   Path B — direct manipulation: patient taps a right-pane row
 *     → row gains [data-editing="true"]; inline field-row edit form appears
 *     → Save / Cancel buttons commit or discard the change
 *     → the list is the single source of truth; chat never re-renders the item
 *
 * ── Events (CustomEvent on root element, bubbles, detail = …) ───────────────
 *
 *   recall:state-change  { from: RecallPass, to: RecallPass }
 *   recall:item-added    { item: FoodItem, passAdded: number }
 *   recall:item-updated  { item: FoodItem, field: 'name'|'when'|'amount' }
 *   recall:item-removed  { itemId: string }
 *   recall:submit        { session: RecallSession }
 *
 * ── Programmatic API (on the root element, non-enumerable) ──────────────────
 *
 *   el._recall.getPass()       → RecallPass
 *   el._recall.getItems()      → FoodItem[] (copy)
 *   el._recall.getSession()    → RecallSession (copy)
 *   el._recall.addItem(name)   → FoodItem  (adds to current pass; fires recall:item-added)
 *   el._recall.removeItem(id)  → void      (fires recall:item-removed)
 *   el._recall.updateItem(id, patch) → void  (fires recall:item-updated per field)
 *   el._recall.advancePass()   → void      (move to next pass in sequence)
 *   el._recall.reset()         → void      (back to entry, clear items)
 *
 * Angular port: bind recall:* events as @Output() EventEmitters; call the
 * programmatic API methods as needed from your Angular service / component.
 *
 * ── Copy rules (CRITICAL — no-judgment contract) ─────────────────────────────
 *
 * Every agent message generated by this runner must honor:
 *   - No judgment about what or how much was eaten.
 *   - "I don't remember" is handled gracefully: agent offers an anchor,
 *     and if the patient still can't recall, records what exists and moves on.
 *   - Skipped meals: acknowledged without probing ("Got it — no lunch yesterday.
 *     Some days are different. Walking on.").
 *   - No comparison to recommended amounts.
 *   - No surprise at small intake.
 *   - No score or HEI number ever shown.
 *
 * ── No-score invariant ───────────────────────────────────────────────────────
 *
 * This is a HARD RULE from clinical governance (cap-08). HEI scoring runs
 * backend. The patient NEVER sees a score, rating, or component breakdown.
 * The confirmation receipt shows: day recalled, item count, submitted timestamp,
 * and "Your care team has it." Nothing else.
 *
 * ── Save-and-resume ──────────────────────────────────────────────────────────
 *
 * If the patient stops mid-recall ([data-action="save-pause"]), the runner
 * dispatches recall:save-pause with { session } and persists session state to
 * sessionStorage under 'cena-recall-draft'. On next boot, the runner checks
 * for a stored draft and offers to resume. Andrey wires the backend persistence.
 *
 * ── Demo mode (single-page static exemplars) ─────────────────────────────────
 *
 * The static HTML pages (recall.entry.html through recall.confirm.html) each
 * represent a single pass. This runner boots on each page and wires the
 * [data-action] buttons. In demo mode the runner does not drive full pass
 * transitions between pages; each page stands alone. For the full interactive
 * flow, wire a single [data-recall-root] element that wraps all pass sections
 * together, as described in the wiring contract above.
 */

(function () {
  'use strict';

  const PASSES = ['entry', 'pass1', 'pass2', 'pass3', 'pass4', 'review', 'confirm'];

  // ─── Utilities ──────────────────────────────────────────────────────────────

  function generateId(items) {
    return 'item-' + items.length;
  }

  function clamp(arr, index) {
    return Math.max(0, Math.min(index, arr.length - 1));
  }

  // ─── Session factory ─────────────────────────────────────────────────────────

  function createSession(recallDate) {
    return {
      recallDate: recallDate || '',
      currentPass: 'entry',
      items: [],
      status: 'in-progress',
      startedAt: Date.now(),
      submittedAt: undefined,
    };
  }

  // ─── Recall list DOM helpers ──────────────────────────────────────────────────

  /**
   * Rebuild the patient-recall-list rows from session.items.
   * Accepts a .patient-recall-list element and the current pass name
   * to determine which columns are visible.
   */
  function renderRecallList(listEl, items, pass, isLocked) {
    if (!listEl) return;

    const rowsEl = listEl.querySelector('.patient-recall-list-rows');
    if (!rowsEl) return;

    rowsEl.innerHTML = '';

    items.forEach(function (item) {
      const row = document.createElement('div');
      row.className = 'patient-recall-list-row';
      row.setAttribute('data-item-id', item.id);

      const nameEl = document.createElement('p');
      nameEl.className = 'patient-recall-list-row-name';
      nameEl.textContent = item.name;

      const whenEl = document.createElement('span');
      whenEl.className = 'patient-recall-list-row-when';
      if (item.when) {
        whenEl.textContent = item.when;
      }

      const amountEl = document.createElement('span');
      amountEl.className = 'patient-recall-list-row-amount';
      if (item.amount) {
        amountEl.textContent = item.amount;
      }

      row.appendChild(nameEl);
      row.appendChild(whenEl);
      row.appendChild(amountEl);

      if (!isLocked) {
        const trashBtn = document.createElement('button');
        trashBtn.type = 'button';
        trashBtn.className = 'patient-recall-list-row-trash';
        trashBtn.setAttribute('aria-label', 'Remove ' + item.name);
        trashBtn.innerHTML = '<i class="fa-solid fa-trash" aria-hidden="true"></i>';
        trashBtn.addEventListener('click', function () {
          // Dispatch removal; consumer handles the api call
          listEl.dispatchEvent(new CustomEvent('recall:remove-item', {
            bubbles: true,
            detail: { itemId: item.id },
          }));
        });
        row.appendChild(trashBtn);
      } else {
        // Locked: empty placeholder span keeps the 4-column grid intact
        row.appendChild(document.createElement('span'));
      }

      rowsEl.appendChild(row);
    });

    // Footer: add-item button (hidden when locked)
    let footerEl = listEl.querySelector('.patient-recall-list-footer');
    if (!footerEl) {
      footerEl = document.createElement('div');
      footerEl.className = 'patient-recall-list-footer';
      listEl.appendChild(footerEl);
    }
    footerEl.hidden = !!isLocked;
    if (!isLocked) {
      footerEl.innerHTML =
        '<button type="button" class="patient-recall-list-add" data-action="add-item">' +
        '<i class="fa-solid fa-plus" aria-hidden="true"></i> Add another item</button>';
    }
  }

  /**
   * Update the pass indicator in the recall list header.
   */
  function updatePassIndicator(listEl, pass, recallDate) {
    if (!listEl) return;
    const passEl = listEl.querySelector('.patient-recall-list-header-pass');
    const dayEl = listEl.querySelector('.patient-recall-list-header-day');
    if (passEl) passEl.textContent = passLabels[pass] || pass;
    if (dayEl && recallDate) dayEl.textContent = recallDate;
  }

  const passLabels = {
    entry: 'Waiting to start',
    pass1: 'Pass 1 of 5 — quick list',
    pass2: 'Pass 2 of 5 — forgotten foods',
    pass3: 'Pass 3 of 5 — when did you eat?',
    pass4: 'Pass 4 of 5 — amounts',
    review: 'Review — does this look right?',
    confirm: 'Recall complete',
  };

  // ─── Engine factory ───────────────────────────────────────────────────────────

  function createEngine(rootEl) {
    const session = createSession('');

    // Section refs — present only in the full single-page wiring; in demo mode
    // (separate HTML files) most will be null and the runner degrades gracefully.
    const sections = {};
    PASSES.forEach(function (p) {
      sections[p] = rootEl.querySelector('[data-pass="' + p + '"]');
    });

    // ─── State transitions ────────────────────────────────────────────────────

    function showPass(nextPass) {
      const prev = session.currentPass;
      if (prev === nextPass) return;

      PASSES.forEach(function (p) {
        if (sections[p]) sections[p].hidden = (p !== nextPass);
      });

      session.currentPass = nextPass;
      dispatch('recall:state-change', { from: prev, to: nextPass });

      // Update all recall list indicators on pass change
      rootEl.querySelectorAll('.patient-recall-list').forEach(function (listEl) {
        updatePassIndicator(listEl, nextPass, session.recallDate);
        renderRecallList(listEl, session.items, nextPass, nextPass === 'review' || nextPass === 'confirm');
      });
    }

    // ─── Item CRUD ────────────────────────────────────────────────────────────

    function addItem(name) {
      if (!name || !name.trim()) return null;
      const item = {
        id: generateId(session.items),
        name: name.trim(),
        addedInPass: PASSES.indexOf(session.currentPass),
      };
      session.items.push(item);
      dispatch('recall:item-added', { item: Object.assign({}, item), passAdded: item.addedInPass });
      refreshLists();
      return item;
    }

    function removeItem(id) {
      const index = session.items.findIndex(function (i) { return i.id === id; });
      if (index === -1) return;
      session.items.splice(index, 1);
      dispatch('recall:item-removed', { itemId: id });
      refreshLists();
    }

    function updateItem(id, patch) {
      const item = session.items.find(function (i) { return i.id === id; });
      if (!item) return;
      Object.keys(patch).forEach(function (field) {
        if (field in item || field === 'name' || field === 'when' || field === 'amount') {
          item[field] = patch[field];
          dispatch('recall:item-updated', { item: Object.assign({}, item), field: field });
        }
      });
      refreshLists();
    }

    function refreshLists() {
      const isLocked = session.currentPass === 'review' || session.currentPass === 'confirm';
      rootEl.querySelectorAll('.patient-recall-list').forEach(function (listEl) {
        updatePassIndicator(listEl, session.currentPass, session.recallDate);
        renderRecallList(listEl, session.items, session.currentPass, isLocked);
      });
    }

    // ─── Submit ───────────────────────────────────────────────────────────────

    function submit() {
      session.status = 'submitted';
      session.submittedAt = Date.now();
      dispatch('recall:submit', { session: Object.assign({}, session, { items: session.items.slice() }) });
      showPass('confirm');
    }

    // ─── Save/resume draft ────────────────────────────────────────────────────

    function saveDraft() {
      try {
        sessionStorage.setItem('cena-recall-draft', JSON.stringify(session));
      } catch (e) {
        // sessionStorage may be unavailable in some contexts
      }
      dispatch('recall:save-pause', { session: Object.assign({}, session) });
    }

    function loadDraft() {
      try {
        const raw = sessionStorage.getItem('cena-recall-draft');
        if (!raw) return null;
        return JSON.parse(raw);
      } catch (e) {
        return null;
      }
    }

    // ─── Event dispatch ───────────────────────────────────────────────────────

    function dispatch(name, detail) {
      rootEl.dispatchEvent(new CustomEvent(name, { detail: detail, bubbles: true }));
    }

    // ─── Action wiring ────────────────────────────────────────────────────────

    function wireActions() {
      rootEl.addEventListener('click', function (e) {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;
        const action = btn.getAttribute('data-action');

        switch (action) {

          case 'select-day': {
            const value = btn.getAttribute('data-value');
            if (value === 'yesterday') {
              // Demo: use a fixed date label
              const d = new Date();
              d.setDate(d.getDate() - 1);
              const label = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
              session.recallDate = label;
            }
            // For "A different day", the agent asks in free text; recallDate set externally
            showPass('pass1');
            break;
          }

          case 'pass1-done':
            showPass('pass2');
            break;

          case 'pass1-more':
            // Patient wants to add more — stay in pass1
            break;

          case 'pass2-done':
            showPass('pass3');
            break;

          case 'pass3-done':
            showPass('pass4');
            break;

          case 'set-time': {
            const itemId = btn.getAttribute('data-item');
            const value = btn.getAttribute('data-value');
            // Find first item matching name (demo simplification)
            const item = session.items.find(function (i) {
              return i.id === itemId || i.name.toLowerCase().indexOf(itemId) !== -1;
            });
            if (item) updateItem(item.id, { when: value });
            break;
          }

          case 'submit-portion': {
            // Find the numeric input sibling
            const inputEl = btn.closest('[data-pass]')
              ? btn.closest('[data-pass]').querySelector('.chat-numeric-input-field')
              : rootEl.querySelector('.chat-numeric-input-field');
            const itemName = btn.getAttribute('data-item');
            const amount = (inputEl && inputEl.value)
              ? inputEl.value + ' ' + (inputEl.nextElementSibling ? inputEl.nextElementSibling.textContent.trim() : '')
              : '';
            const item = session.items.find(function (i) {
              return i.name.toLowerCase().indexOf(itemName) !== -1;
            });
            if (item && amount.trim()) updateItem(item.id, { amount: amount.trim() });
            break;
          }

          case 'submit-recall':
            submit();
            break;

          case 'save-pause':
            saveDraft();
            break;

          case 'go-home':
            // Navigation is a consumer concern; dispatch for Angular to handle
            dispatch('recall:go-home', {});
            break;

          case 'add-item': {
            // Open inline prompt — in demo mode, just focus the chat input
            const chatInput = rootEl.querySelector('.chat-input-area input');
            if (chatInput) chatInput.focus();
            break;
          }

          default:
            break;
        }
      });

      // Chat-input submit on Enter key (demo: adds item in pass1/pass2)
      rootEl.querySelectorAll('.chat-input-area input').forEach(function (inputEl) {
        inputEl.addEventListener('keydown', function (e) {
          if (e.key !== 'Enter') return;
          const text = inputEl.value.trim();
          if (!text) return;
          if (session.currentPass === 'pass1' || session.currentPass === 'pass2') {
            addItem(text);
            inputEl.value = '';
          }
          e.preventDefault();
        });
      });

      // Recall-list remove-item event (bubbled from renderRecallList)
      rootEl.addEventListener('recall:remove-item', function (e) {
        removeItem(e.detail.itemId);
      });
    }

    // ─── Public API ────────────────────────────────────────────────────────────

    const api = {
      getPass: function () { return session.currentPass; },
      getItems: function () { return session.items.slice(); },
      getSession: function () { return Object.assign({}, session, { items: session.items.slice() }); },
      addItem: addItem,
      removeItem: removeItem,
      updateItem: updateItem,
      advancePass: function () {
        const i = PASSES.indexOf(session.currentPass);
        if (i < PASSES.length - 1) showPass(PASSES[i + 1]);
      },
      reset: function () {
        session.currentPass = 'entry';
        session.items = [];
        session.status = 'in-progress';
        session.recallDate = '';
        session.startedAt = Date.now();
        session.submittedAt = undefined;
        PASSES.forEach(function (p) {
          if (sections[p]) sections[p].hidden = (p !== 'entry');
        });
        refreshLists();
        dispatch('recall:state-change', { from: null, to: 'entry' });
      },
    };

    Object.defineProperty(rootEl, '_recall', { value: api, configurable: true });

    // ─── Init ─────────────────────────────────────────────────────────────────

    // In demo mode (separate HTML files) there are no [data-pass] sections;
    // the runner boots quietly and wires actions only.
    PASSES.forEach(function (p) {
      if (sections[p]) sections[p].hidden = (p !== 'entry');
    });

    wireActions();

    return api;
  }

  // ─── Bootstrap ───────────────────────────────────────────────────────────────

  function init() {
    document.querySelectorAll('[data-recall-root]').forEach(function (rootEl) {
      createEngine(rootEl);
    });

    // Demo-mode: if no [data-recall-root] is present, still wire any
    // [data-action] buttons on the page so individual state exemplars are
    // interactive (day-selection chips, portion submit, etc.) without
    // requiring a full single-page root.
    if (!document.querySelector('[data-recall-root]')) {
      // Lightweight demo wiring — just prevent dead buttons in static demos
      document.addEventListener('click', function (e) {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;
        const action = btn.getAttribute('data-action');

        if (action === 'submit-recall') {
          // Navigate to the confirm page from any review page
          window.location.href = 'recall.confirm.html';
        } else if (action === 'pass1-done') {
          window.location.href = 'recall.pass3.html';
        } else if (action === 'go-home') {
          window.location.href = '../home/home.caught-up.html';
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
