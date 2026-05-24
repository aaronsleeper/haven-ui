/**
 * log-outcome.js — runner for the cap-20 self-reported-outcomes log (deterministic MVP).
 *
 * AUDIENCE: Andrey, porting handoff/cena-uconn/log-outcome/ to Angular. This is a vanilla ES module,
 * zero deps, following haven-ui's "Vanilla JS per primitive" convention (data-attribute attachment,
 * bubbling CustomEvents with structured detail, programmatic API on el._logOutcome). Import it unchanged
 * for a quick demo, or port the contract to an Angular service/component — either path beats from-scratch.
 *
 * SCOPE: this is the DETERMINISTIC form's behavior — one card per measure (weight / BP / A1C / note), each
 * independently fillable + savable. There is no batched submit. The agentic chat version (flow-log-outcome.md)
 * is post-launch and NOT this file.
 *
 * ──────────────────────────────────────────────────────────────────────────────────────────
 * WIRING CONTRACT
 *
 *   Container:   <main data-log-outcome> … </main>
 *   Measure card:<article data-measure-card data-measure="weight|bp|a1c|note"> … </article>
 *   Unit toggle: <button data-unit-toggle data-units="lb,kg">lb</button>   (inside a card; cycles units)
 *   Save:        <button data-action="save">…</button>                      (inside a card.card-body)
 *   Edit:        <button data-action="edit">…</button>                      (inside a saved card.card-header)
 *
 * The module attaches on DOMContentLoaded to every [data-log-outcome]. It does NOT auto-import in any
 * bundle entry — the consumer includes <script src="./log-outcome.js"></script> after the page markup.
 *
 * BEHAVIOR
 *   • Unit toggle      — cycles data-units, rewrites the button label + aria-label (defaults to last-used
 *                        per the chat-affordance "remember the unit" principle; here, per-session).
 *   • Gentle out-of-range — on Save, a value outside the plausible band (PLAUSIBLE below) OR far from the
 *                        card's data-last value applies .field-row-warning + a .field-warning message and
 *                        focuses the input. IT DOES NOT BLOCK: pressing Save again with the same value saves
 *                        it (the warning is a typo-catch, not a gate). Clinical alerting on out-of-range
 *                        values is cap-62's job, downstream of capture — never this flow's.
 *   • Save             — validates (gentle), then swaps the card to a read-back "saved" state (value + unit +
 *                        relative time + Edit) and emits `logoutcome:save`.
 *   • Edit             — restores the card's fillable markup (kept in a cloned template) and emits `logoutcome:edit`.
 *
 * EVENTS (bubbling CustomEvent on the card element)
 *   • logoutcome:save  detail: { measure, value, unit, date, outOfRange:boolean }
 *   • logoutcome:edit  detail: { measure }
 *   For `note`, value is the textarea string and unit/date are null.
 *
 * PROGRAMMATIC API (on the container element)
 *   el._logOutcome.save(measure)            — programmatic save of a card by measure key
 *   el._logOutcome.edit(measure)            — return a saved card to fillable
 *   el._logOutcome.getDraft(measure)        — { value, unit, date } current input state (pre-save)
 *
 * A11Y
 *   • The warning message is referenced by the input's aria-describedby; focus moves to the flagged input.
 *   • Unit toggle keeps a descriptive aria-label in sync ("Toggle unit, currently pounds").
 *   • Saved-state read-back is plain text in the same card region — no live-region spam (single discrete action).
 * ──────────────────────────────────────────────────────────────────────────────────────────
 */
(function () {
  'use strict';

  // Plausible bands — typo-catch only, deliberately wide. Tune per cohort with clinical input; these are
  // NOT clinical thresholds (those live in cap-62 alerting, server-side, post-capture).
  var PLAUSIBLE = {
    weight: { lb: [50, 600], kg: [25, 300] },
    a1c: { '%': [3, 20] },
    bp: { sys: [70, 250], dia: [40, 150] }
  };

  var UNIT_WORDS = { lb: 'pounds', kg: 'kilograms', '%': 'percent' };

  function relTimeNow() { return 'saved just now'; }

  function clearWarning(card) {
    var row = card.querySelector('.field-row-warning');
    if (row) row.classList.remove('field-row-warning');
    card.querySelectorAll('.field-warning').forEach(function (w) { w.remove(); });
    card.removeAttribute('data-warned');
  }

  function warn(card, input, message) {
    var row = input.closest('.field-row') || input.closest('.field-input-group') || input.parentElement;
    var fieldRow = input.closest('.field-row');
    if (fieldRow) fieldRow.classList.add('field-row-warning');
    var existing = (fieldRow || row).querySelector('.field-warning');
    var id = (input.id || 'log') + '-warn';
    if (!existing) {
      var p = document.createElement('p');
      p.className = 'field-warning';
      p.id = id;
      // role="status" (polite, NOT alert/assertive) announces the gentle confirm to AT without alarming —
      // matches the "gentle, not a clinical alert" tone. Pairs with the focus move below.
      p.setAttribute('role', 'status');
      p.innerHTML = '<i class="fa-solid fa-triangle-exclamation text-xs"></i> ';
      p.appendChild(document.createTextNode(message));
      (fieldRow || row).appendChild(p);
      // APPEND the warning id — never overwrite an existing field-help association (e.g. weight-help).
      var prior = (input.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
      if (prior.indexOf(id) === -1) prior.push(id);
      input.setAttribute('aria-describedby', prior.join(' '));
    }
    card.setAttribute('data-warned', '1');
    input.focus();
  }

  function outOfBand(measure, key, n, unit) {
    var band = measure === 'bp' ? PLAUSIBLE.bp[key] : (PLAUSIBLE[measure] && PLAUSIBLE[measure][unit]);
    if (!band) return false;
    return n < band[0] || n > band[1];
  }

  function activeUnit(card) {
    var t = card.querySelector('[data-unit-toggle]');
    if (t) return t.textContent.trim();
    var addon = card.querySelector('.field-addon');
    return addon ? addon.textContent.trim() : null;
  }

  function getDraft(card) {
    var measure = card.getAttribute('data-measure');
    if (measure === 'note') {
      var ta = card.querySelector('textarea');
      return { value: ta ? ta.value.trim() : '', unit: null, date: null };
    }
    if (measure === 'bp') {
      var sys = card.querySelector('[aria-label^="Systolic"]');
      var dia = card.querySelector('[aria-label^="Diastolic"]');
      var date = card.querySelector('input[type="date"]');
      return {
        value: { sys: sys ? sys.value : '', dia: dia ? dia.value : '' },
        unit: 'mmHg',
        date: date ? date.value : null
      };
    }
    var num = card.querySelector('input[type="number"]');
    var d = card.querySelector('input[type="date"]');
    return { value: num ? num.value : '', unit: activeUnit(card), date: d ? d.value : null };
  }

  function validateGentle(card, draft) {
    var measure = card.getAttribute('data-measure');
    if (measure === 'note') return { ok: true, outOfRange: false };
    if (measure === 'bp') {
      var sys = parseFloat(draft.value.sys), dia = parseFloat(draft.value.dia);
      if (draft.value.sys === '' && draft.value.dia === '') return { ok: false, empty: true };
      var bad = (!isNaN(sys) && outOfBand('bp', 'sys', sys)) || (!isNaN(dia) && outOfBand('bp', 'dia', dia));
      if (bad) {
        var input = card.querySelector('[aria-label^="Systolic"]');
        return { ok: true, outOfRange: true, input: input, msg: 'That reading looks unusual — want to double-check the numbers, or is that right?' };
      }
      return { ok: true, outOfRange: false };
    }
    var n = parseFloat(draft.value);
    if (draft.value === '' || isNaN(n)) return { ok: false, empty: true };
    var input2 = card.querySelector('input[type="number"]');
    var last = card.getAttribute('data-last');
    if (outOfBand(measure, null, n, draft.unit)) {
      return { ok: true, outOfRange: true, input: input2, msg: "That's outside the usual range — want to double-check, or is that right?" };
    }
    if (last != null && last !== '') {
      var prev = parseFloat(last);
      if (!isNaN(prev) && prev !== 0 && Math.abs(n - prev) / prev > 0.15) {
        return { ok: true, outOfRange: true, input: input2,
          msg: "That's a fair bit different from your last reading (" + last + (draft.unit ? ' ' + draft.unit : '') + "). Want to double-check, or is that right?" };
      }
    }
    return { ok: true, outOfRange: false };
  }

  function renderSaved(card, draft) {
    var measure = card.getAttribute('data-measure');
    if (!card.__fillable) card.__fillable = card.innerHTML; // stash for Edit
    var title = card.querySelector('.card-header h2');
    var titleText = title ? title.textContent : '';
    var body;
    if (measure === 'note') {
      body = '<p class="text-base">“' + escapeHtml(draft.value) + '”</p>' +
             '<p class="text-sm text-sand-600">' + relTimeNow() + '</p>';
    } else if (measure === 'bp') {
      body = '<div class="flex items-baseline gap-2"><span class="text-2xl font-semibold">' +
             escapeHtml(draft.value.sys) + '/' + escapeHtml(draft.value.dia) +
             '</span><span class="text-base text-sand-600">mmHg</span></div>' +
             '<p class="text-sm text-sand-600">' + relTimeNow() + '</p>';
    } else {
      body = '<div class="flex items-baseline gap-2"><span class="text-2xl font-semibold">' +
             escapeHtml(draft.value) + '</span><span class="text-base text-sand-600">' +
             escapeHtml(draft.unit || '') + '</span></div>' +
             '<p class="text-sm text-sand-600">' + relTimeNow() + '</p>';
    }
    card.setAttribute('data-state', 'saved');
    card.innerHTML =
      '<div class="card-header flex items-center justify-between">' +
        '<h2 class="font-serif text-base font-semibold">' + escapeHtml(titleText) + '</h2>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-action="edit">Edit</button>' +
      '</div>' +
      '<div class="card-body space-y-3">' + body + '</div>';
  }

  function restoreFillable(card) {
    if (card.__fillable) {
      card.innerHTML = card.__fillable;
      card.removeAttribute('data-state');
    }
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function attach(container) {
    if (container.__logOutcome) return;

    function cardFor(measure) {
      return container.querySelector('[data-measure-card][data-measure="' + measure + '"]');
    }

    function doSave(card) {
      var measure = card.getAttribute('data-measure');
      var draft = getDraft(card);
      var v = validateGentle(card, draft);
      if (!v.ok) return; // empty — nothing to save, no error chrome (everything is optional)
      if (v.outOfRange && card.getAttribute('data-warned') !== '1') {
        warn(card, v.input, v.msg);
        return; // first press warns; second press (warning present) saves
      }
      clearWarning(card);
      renderSaved(card, draft);
      // The Save button just got replaced by innerHTML swap — move focus to the new Edit button
      // so keyboard/SR users aren't dropped to <body> mid-task.
      var editBtn = card.querySelector('[data-action="edit"]');
      if (editBtn) editBtn.focus();
      card.dispatchEvent(new CustomEvent('logoutcome:save', {
        bubbles: true,
        detail: { measure: measure, value: draft.value, unit: draft.unit, date: draft.date, outOfRange: !!v.outOfRange }
      }));
    }

    function doEdit(card) {
      restoreFillable(card);
      // Restore focus to the first input of the now-fillable card (it was on the Edit button, now gone).
      var firstField = card.querySelector('input, textarea');
      if (firstField) firstField.focus();
      card.dispatchEvent(new CustomEvent('logoutcome:edit', { bubbles: true, detail: { measure: card.getAttribute('data-measure') } }));
    }

    container.addEventListener('click', function (e) {
      var toggle = e.target.closest('[data-unit-toggle]');
      if (toggle && container.contains(toggle)) {
        var units = (toggle.getAttribute('data-units') || '').split(',').map(function (u) { return u.trim(); }).filter(Boolean);
        if (units.length > 1) {
          var cur = toggle.textContent.trim();
          var next = units[(units.indexOf(cur) + 1) % units.length];
          toggle.textContent = next;
          toggle.setAttribute('aria-label', 'Toggle unit, currently ' + (UNIT_WORDS[next] || next));
        }
        return;
      }
      var saveBtn = e.target.closest('[data-action="save"]');
      if (saveBtn && container.contains(saveBtn)) { doSave(saveBtn.closest('[data-measure-card]')); return; }
      var editBtn = e.target.closest('[data-action="edit"]');
      if (editBtn && container.contains(editBtn)) { doEdit(editBtn.closest('[data-measure-card]')); return; }
    });

    // Clear a warning as soon as the patient edits the flagged value (so re-typing is friction-free).
    container.addEventListener('input', function (e) {
      var card = e.target.closest('[data-measure-card][data-warned="1"]');
      if (card) clearWarning(card);
    });

    container._logOutcome = {
      save: function (measure) { var c = cardFor(measure); if (c) doSave(c); },
      edit: function (measure) { var c = cardFor(measure); if (c) doEdit(c); },
      getDraft: function (measure) { var c = cardFor(measure); return c ? getDraft(c) : null; }
    };
    container.__logOutcome = true;
  }

  function init() {
    document.querySelectorAll('[data-log-outcome]').forEach(attach);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
