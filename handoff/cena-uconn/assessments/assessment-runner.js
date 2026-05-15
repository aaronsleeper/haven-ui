/**
 * Assessment runner — Cena × UConn pilot handoff
 *
 * Drives the runner state machine: preflight → question → [identity] → confirm.
 * The `identity` state is conditional — present in the items array as an item
 * with inputType: 'identity-form'. The screener uses it after Q1=Yes; other
 * instruments (HFIAS / WHOQOL / GNKQ-R) don't include the identity item, so
 * the state is never entered.
 *
 * Note: home-view "Entry" surfacing (agent greets, due-assessment chip) is a
 * separate pre-runner component, not a runner state. The runner opens at
 * Preflight because the home-view surfacing already happened (for enrolled
 * patients) or doesn't apply (for the screener, which arrives via referral
 * link with no home view).
 *
 * Vanilla ES (no deps). Drop-in for the cena-uconn handoff demos so Andrey
 * can step through them in a browser; port the contract to Angular.
 *
 * NOT the same engine as packages/design-system/src/scripts/components/assessment.js
 * (that file backs an older prototype with a different DOM/class contract).
 *
 * ── Wiring contract ─────────────────────────────────────────────────────────
 *
 * HTML provides one root element [data-assessment-root], with child sections
 * <section data-state="preflight|question|identity|confirm">. The engine
 * toggles [hidden] on those sections.
 *
 * Question state: .assessment-header (title + meta + bar), .response-option-group
 * (engine fills options per item), .pagination-row (Prev / Next), .submit-region
 * (Submit + helper). Visible when the current item's inputType is a radio variant.
 *
 * Identity state: .assessment-header, .card with <fieldset> blocks of <input> /
 * <textarea> elements. Each input has name="identity-<fieldId>" matching a
 * field in items[i].fields. Error paragraph per field has id="error-identity-<fieldId>".
 * Engine wires input + blur listeners; validates; toggles aria-invalid + error
 * visibility; gates the Continue button on allRequiredFieldsValid.
 *
 * Confirm state: one [data-confirm-variant] child per outcome; engine reveals
 * the matching one.
 *
 * Item data comes from window.ASSESSMENT_INSTANCE (or [data-instance] JSON
 * on the root). Items are typed via inputType — see AGENTS.md for the shape.
 *
 * ── Referral-link pre-fill ─────────────────────────────────────────────────
 *
 * On entry to an identity state, the engine reads URL query params and pre-fills
 * any field whose `prefillFrom` matches a present param key. Fields remain editable.
 * Expected param names per screener wireframe: firstName, lastName, email, phone.
 *
 * ── Events (CustomEvent on root element, bubbles, detail = …) ───────────────
 *
 *   assessment:state-change  { from, to }
 *   assessment:answer        { itemId, value, index }
 *   assessment:submit        { instanceId, answers, outcome }
 *   assessment:save-pause    { itemId }
 *
 * Angular port: bind to these as @Output() EventEmitters; the same detail
 * shape moves over verbatim.
 *
 * ── Programmatic API (on the root element, non-enumerable) ──────────────────
 *
 *   el._assessment.getState()    → 'preflight' | 'question' | 'identity' | 'confirm'
 *   el._assessment.getAnswers()  → { [itemId]: value | object }
 *   el._assessment.getOutcome()  → outcome class | undefined
 *   el._assessment.reset()       → return to entry, clear answers
 */

(function () {
  'use strict';

  const STATES = ['preflight', 'question', 'identity', 'confirm'];

  // ─── Validators (named, referenced by field.validator) ────────────────────

  const VALIDATORS = {
    nonEmpty: (v) => v.trim().length > 0,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    usPhone: (v) => {
      const digits = v.replace(/\D/g, '');
      return digits.length === 10 || (digits.length === 11 && digits[0] === '1');
    },
    plausibleDob: (v) => {
      if (!v) return true;
      const d = new Date(v);
      if (isNaN(d.getTime())) return false;
      const year = d.getFullYear();
      const maxYear = new Date().getFullYear() - 13;
      return year >= 1900 && year <= maxYear;
    },
  };

  function validateField(field, value) {
    const v = value || '';
    const trimmed = v.trim();
    if (field.required && trimmed.length === 0) return false;
    if (!field.required && trimmed.length === 0) return true;
    if (field.validator && VALIDATORS[field.validator]) {
      return VALIDATORS[field.validator](trimmed);
    }
    return true;
  }

  // Display formatters — applied to the input on blur when the field is valid.
  // The engine displays the formatted value but stores the normalized form
  // (e.g., digits-only phone) in state.answers per the wireframe behavior spec.
  const FORMATTERS = {
    usPhone: (v) => {
      const digits = v.replace(/\D/g, '');
      if (digits.length === 10) {
        return { display: `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`, stored: digits };
      }
      if (digits.length === 11 && digits[0] === '1') {
        return { display: `1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`, stored: digits };
      }
      return { display: v, stored: digits };
    },
  };

  // ─── Data loading ─────────────────────────────────────────────────────────

  function loadInstance(rootEl) {
    const attr = rootEl.getAttribute('data-instance');
    if (attr) {
      try { return JSON.parse(attr); } catch (e) {
        console.warn('[assessment-runner] data-instance parse failed:', e);
      }
    }
    if (window.ASSESSMENT_INSTANCE) return window.ASSESSMENT_INSTANCE;
    console.error('[assessment-runner] no instance data — set window.ASSESSMENT_INSTANCE or data-instance.');
    return null;
  }

  function isIdentityItem(item) {
    return item && item.inputType === 'identity-form';
  }

  // ─── Engine factory (one per root element) ────────────────────────────────

  function createEngine(rootEl, instance) {
    const state = {
      currentState: 'preflight',
      currentItemIndex: 0,
      answers: {},
      outcome: undefined,
      identityTouched: false,
    };

    // Section refs
    const sections = {};
    STATES.forEach((s) => {
      sections[s] = rootEl.querySelector(`[data-state="${s}"]`);
    });

    // Question-state refs
    const qSection = sections.question;
    const qHeaderTitle = qSection && qSection.querySelector('.assessment-header-title');
    const qHeaderMeta = qSection && qSection.querySelector('.assessment-header-meta');
    const qProgressBar = qSection && qSection.querySelector('.progress-bar-pagination');
    const qCardCounter = qSection && qSection.querySelector('[data-bind="item.counter"]');
    const qOptionGroup = qSection && qSection.querySelector('.response-option-group');
    const qOptionLegend = qOptionGroup && qOptionGroup.querySelector('.response-option-group-prompt');
    const qOptionList = qOptionGroup && qOptionGroup.querySelector('.response-option-group-list');
    const qPaginationRow = qSection && qSection.querySelector('.pagination-row');
    const qBtnPrev = qPaginationRow && qPaginationRow.querySelector('[data-action="prev"]');
    const qBtnNext = qPaginationRow && qPaginationRow.querySelector('[data-action="next"]');
    const qSubmitRegion = qSection && qSection.querySelector('.submit-region');
    const qBtnSubmit = qSubmitRegion && qSubmitRegion.querySelector('[data-action="submit"]');

    // Identity-state refs
    const iSection = sections.identity;
    const iHeaderTitle = iSection && iSection.querySelector('.assessment-header-title');
    const iHeaderMeta = iSection && iSection.querySelector('.assessment-header-meta');
    const iProgressBar = iSection && iSection.querySelector('.progress-bar-pagination');
    const iCardCounter = iSection && iSection.querySelector('[data-bind="item.counter"]');
    const iBtnContinue = iSection && iSection.querySelector('[data-action="identity-continue"]');
    const iHelperText = iSection && iSection.querySelector('[data-bind="identity.helper"]');

    // ─── State machine ─────────────────────────────────────────────────────

    function showState(next) {
      const prev = state.currentState;
      if (prev === next) return;
      STATES.forEach((s) => {
        if (sections[s]) sections[s].hidden = (s !== next);
      });
      state.currentState = next;
      dispatch('assessment:state-change', { from: prev, to: next });
      if (next === 'question') renderQuestionItem();
      if (next === 'identity') renderIdentityItem();
      if (next === 'confirm') renderConfirmation();
    }

    function showCurrentItemState() {
      const item = instance.items[state.currentItemIndex];
      if (isIdentityItem(item)) {
        // If we're already in identity, force re-render
        if (state.currentState === 'identity') renderIdentityItem();
        else showState('identity');
      } else {
        if (state.currentState === 'question') renderQuestionItem();
        else showState('question');
      }
    }

    // ─── Progress bar (shared between question + identity states) ──────────

    function renderProgressBar(barEl, index, total) {
      barEl.innerHTML = '';
      for (let i = 0; i < total; i++) {
        const seg = document.createElement('span');
        seg.className = 'progress-bar-pagination-segment';
        if (i < index) seg.classList.add('is-filled');
        barEl.appendChild(seg);
      }
      barEl.setAttribute('aria-valuemin', '0');
      barEl.setAttribute('aria-valuemax', String(total));
      barEl.setAttribute('aria-valuenow', String(index));
      barEl.setAttribute('aria-valuetext', `Step ${index + 1} of ${total}`);
    }

    // ─── Question rendering ────────────────────────────────────────────────

    function renderQuestionItem() {
      const item = instance.items[state.currentItemIndex];
      const total = instance.items.length;
      const index = state.currentItemIndex;
      const isLast = index === total - 1;
      const counterText = `Question ${index + 1} of ${total}`;

      if (qHeaderTitle) qHeaderTitle.textContent = instance.plainLanguageName;
      if (qHeaderMeta) qHeaderMeta.textContent = counterText;
      if (qCardCounter) qCardCounter.textContent = counterText;
      if (qProgressBar) renderProgressBar(qProgressBar, index, total);
      if (qOptionLegend) qOptionLegend.textContent = item.promptText;

      if (qOptionList) {
        qOptionList.innerHTML = '';
        item.options.forEach((opt, i) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'response-option';
          btn.setAttribute('role', 'radio');
          btn.setAttribute('aria-checked', String(state.answers[item.id] === opt.value));
          btn.setAttribute('data-value', opt.value);

          const indexSpan = document.createElement('span');
          indexSpan.className = 'response-option-index';
          const indexNum = document.createElement('span');
          indexNum.className = 'response-option-index-num';
          indexNum.textContent = String.fromCharCode(65 + i);
          indexSpan.appendChild(indexNum);

          const labelSpan = document.createElement('span');
          labelSpan.className = 'response-option-label';
          labelSpan.textContent = opt.label;

          const checkSpan = document.createElement('span');
          checkSpan.className = 'response-option-check';

          btn.appendChild(indexSpan);
          btn.appendChild(labelSpan);
          btn.appendChild(checkSpan);

          btn.addEventListener('click', () => selectOption(item, opt));
          btn.addEventListener('keydown', (e) => handleOptionKey(e, item, opt, i));

          qOptionList.appendChild(btn);
        });
      }

      if (qBtnPrev) qBtnPrev.disabled = (index === 0);
      if (qPaginationRow) qPaginationRow.hidden = isLast;
      if (qSubmitRegion) qSubmitRegion.hidden = !isLast;
      updateQuestionAdvanceState(item, isLast);
    }

    function selectOption(item, opt) {
      state.answers[item.id] = opt.value;
      if (qOptionList) {
        qOptionList.querySelectorAll('.response-option').forEach((b) => {
          b.setAttribute('aria-checked', b.getAttribute('data-value') === opt.value ? 'true' : 'false');
        });
      }
      dispatch('assessment:answer', { itemId: item.id, value: opt.value, index: state.currentItemIndex });
      const isLast = state.currentItemIndex === instance.items.length - 1;
      updateQuestionAdvanceState(item, isLast);
    }

    function handleOptionKey(e, item, opt, i) {
      const total = item.options.length;
      let nextIndex = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') nextIndex = (i + 1) % total;
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') nextIndex = (i - 1 + total) % total;
      else if (e.key === ' ' || e.key === 'Enter') { selectOption(item, opt); e.preventDefault(); return; }
      if (nextIndex !== null) {
        const buttons = qOptionList.querySelectorAll('.response-option');
        if (buttons[nextIndex]) buttons[nextIndex].focus();
        e.preventDefault();
      }
    }

    function updateQuestionAdvanceState(item, isLast) {
      const answered = state.answers[item.id] !== undefined;
      const required = item.required !== false;
      const canAdvance = answered || !required;
      if (isLast) {
        if (qBtnSubmit) qBtnSubmit.disabled = !canAdvance;
      } else {
        if (qBtnNext) qBtnNext.disabled = !canAdvance;
      }
    }

    // ─── Identity rendering ────────────────────────────────────────────────

    function renderIdentityItem() {
      const item = instance.items[state.currentItemIndex];
      const total = instance.items.length;
      const index = state.currentItemIndex;
      const counterText = `Step ${index + 1} of ${total}`;

      if (iHeaderTitle) iHeaderTitle.textContent = instance.plainLanguageName;
      if (iHeaderMeta) iHeaderMeta.textContent = counterText;
      if (iCardCounter) iCardCounter.textContent = counterText;
      if (iProgressBar) renderProgressBar(iProgressBar, index, total);

      // Pre-fill from referral on first render of this item
      if (!state.answers[item.id]) {
        state.answers[item.id] = prefillFromReferral(item.fields);
      }

      // Reflect current values into form inputs
      const values = state.answers[item.id];
      item.fields.forEach((field) => {
        const input = iSection.querySelector(`[name="identity-${field.id}"]`);
        if (input && values[field.id] !== undefined) input.value = values[field.id];
      });

      updateIdentityAdvanceState(item);
    }

    function prefillFromReferral(fields) {
      const params = new URLSearchParams(window.location.search);
      const out = {};
      fields.forEach((field) => {
        if (field.prefillFrom && params.has(field.prefillFrom)) {
          out[field.id] = params.get(field.prefillFrom);
        }
      });
      return out;
    }

    function updateIdentityAdvanceState(item) {
      const values = state.answers[item.id] || {};
      let invalidCount = 0;
      item.fields.forEach((field) => {
        if (!field.required) return;
        const v = values[field.id] || '';
        if (!validateField(field, v)) invalidCount++;
      });
      if (iBtnContinue) iBtnContinue.disabled = invalidCount > 0;
      if (iHelperText) {
        if (invalidCount > 0 && state.identityTouched) {
          iHelperText.textContent =
            `${invalidCount} required field${invalidCount === 1 ? '' : 's'} still ${invalidCount === 1 ? 'needs' : 'need'} an answer.`;
          iHelperText.hidden = false;
        } else {
          iHelperText.hidden = true;
        }
      }
    }

    function getIdentityItem() {
      return instance.items.find(isIdentityItem) || null;
    }

    function showFieldError(field, inputEl, isValid, hasValue) {
      const errorEl = iSection.querySelector(`#error-identity-${field.id}`);
      const requiredButEmpty = field.required && !hasValue && state.identityTouched;
      const invalid = hasValue && !isValid;
      if (invalid || requiredButEmpty) {
        inputEl.setAttribute('aria-invalid', 'true');
        if (errorEl) errorEl.hidden = false;
      } else {
        inputEl.setAttribute('aria-invalid', 'false');
        if (errorEl) errorEl.hidden = true;
      }
    }

    function wireIdentityForm() {
      const identityItem = getIdentityItem();
      if (!iSection || !identityItem) return;

      identityItem.fields.forEach((field) => {
        const input = iSection.querySelector(`[name="identity-${field.id}"]`);
        if (!input) return;

        input.addEventListener('input', () => {
          state.identityTouched = true;
          if (!state.answers[identityItem.id]) state.answers[identityItem.id] = {};
          state.answers[identityItem.id][field.id] = input.value;
          // Clear error on input (errors only show after blur, per behavior spec)
          input.setAttribute('aria-invalid', 'false');
          const errorEl = iSection.querySelector(`#error-identity-${field.id}`);
          if (errorEl) errorEl.hidden = true;
          updateIdentityAdvanceState(identityItem);
        });

        input.addEventListener('blur', () => {
          const v = input.value;
          const isValid = validateField(field, v);
          // Apply display formatter on valid blur; persist normalized value in state.
          if (isValid && field.displayFormatter && FORMATTERS[field.displayFormatter] && v.trim().length > 0) {
            const formatted = FORMATTERS[field.displayFormatter](v);
            input.value = formatted.display;
            if (!state.answers[identityItem.id]) state.answers[identityItem.id] = {};
            state.answers[identityItem.id][field.id] = formatted.stored;
          }
          showFieldError(field, input, isValid, v.trim().length > 0);
          updateIdentityAdvanceState(identityItem);
        });
      });

      if (iBtnContinue) {
        iBtnContinue.addEventListener('click', () => {
          const item = instance.items[state.currentItemIndex];
          if (!isIdentityItem(item)) return;
          state.identityTouched = true;

          let firstInvalid = null;
          item.fields.forEach((field) => {
            const input = iSection.querySelector(`[name="identity-${field.id}"]`);
            if (!input) return;
            const v = input.value;
            const isValid = validateField(field, v);
            showFieldError(field, input, isValid, v.trim().length > 0);
            if (field.required && !isValid && !firstInvalid) firstInvalid = input;
          });

          if (firstInvalid) {
            firstInvalid.focus();
            updateIdentityAdvanceState(item);
            return;
          }

          dispatch('assessment:answer', {
            itemId: item.id,
            value: { ...state.answers[item.id] },
            index: state.currentItemIndex,
          });
          goNext();
        });
      }
    }

    // ─── Navigation ────────────────────────────────────────────────────────

    function goNext() {
      const item = instance.items[state.currentItemIndex];
      const answer = state.answers[item.id];

      // Per-item early-exit applies to radio answers only
      if (item.earlyExitWhen && typeof answer === 'string') {
        const match = item.earlyExitWhen.find((p) => p.answer === answer);
        if (match) {
          state.outcome = match.outcome;
          submit();
          return;
        }
      }

      if (state.currentItemIndex < instance.items.length - 1) {
        state.currentItemIndex += 1;
        showCurrentItemState();
      }
    }

    function goPrev() {
      if (state.currentItemIndex > 0) {
        state.currentItemIndex -= 1;
        showCurrentItemState();
      }
    }

    function submit() {
      if (state.outcome === undefined) {
        state.outcome = computeOutcome();
      }
      dispatch('assessment:submit', {
        instanceId: instance.id,
        answers: { ...state.answers },
        outcome: state.outcome,
      });
      showState('confirm');
    }

    // ─── Outcome computation ───────────────────────────────────────────────

    function computeOutcome() {
      const rules = instance.outcomeRules || [];
      for (const rule of rules) {
        if (rule.default) continue;
        if (rule.all && matchesAll(rule.all)) return rule.outcome;
      }
      const fallback = rules.find((r) => r.default);
      return fallback ? fallback.default : 'submitted';
    }

    function matchesAll(predicates) {
      return Object.keys(predicates).every((itemId) => {
        const expected = predicates[itemId];
        const actual = state.answers[itemId];
        if (Array.isArray(expected)) return expected.includes(actual);
        return actual === expected;
      });
    }

    // ─── Confirmation rendering ────────────────────────────────────────────

    function renderConfirmation() {
      const confirmSection = sections.confirm;
      if (!confirmSection) return;
      const variants = confirmSection.querySelectorAll('[data-confirm-variant]');
      let revealed = false;
      variants.forEach((v) => {
        const match = v.getAttribute('data-confirm-variant') === state.outcome;
        v.hidden = !match;
        if (match) revealed = true;
      });
      if (!revealed && variants[0]) variants[0].hidden = false;
    }

    // ─── Event dispatch ────────────────────────────────────────────────────

    function dispatch(name, detail) {
      rootEl.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
    }

    // ─── Wiring ────────────────────────────────────────────────────────────

    function wireActions() {
      rootEl.querySelectorAll('[data-action="ready"]').forEach((b) => {
        b.addEventListener('click', () => showCurrentItemState());
      });
      if (qBtnNext) qBtnNext.addEventListener('click', goNext);
      if (qBtnPrev) qBtnPrev.addEventListener('click', goPrev);
      if (qBtnSubmit) qBtnSubmit.addEventListener('click', submit);
      rootEl.querySelectorAll('[data-action="save-pause"]').forEach((b) => {
        b.addEventListener('click', () => {
          const itemId = instance.items[state.currentItemIndex].id;
          dispatch('assessment:save-pause', { itemId });
        });
      });
      rootEl.querySelectorAll('[data-action="reset"]').forEach((b) => {
        b.addEventListener('click', api.reset);
      });
      wireIdentityForm();
    }

    // ─── Public API ────────────────────────────────────────────────────────

    const api = {
      getState: () => state.currentState,
      getAnswers: () => ({ ...state.answers }),
      getOutcome: () => state.outcome,
      reset: () => {
        state.currentState = 'preflight';
        state.currentItemIndex = 0;
        state.answers = {};
        state.outcome = undefined;
        state.identityTouched = false;
        STATES.forEach((s) => { if (sections[s]) sections[s].hidden = (s !== 'preflight'); });
        // Clear identity-form inputs in DOM
        if (iSection) {
          iSection.querySelectorAll('input, textarea').forEach((el) => {
            el.value = '';
            el.setAttribute('aria-invalid', 'false');
          });
          iSection.querySelectorAll('[id^="error-identity-"]').forEach((el) => { el.hidden = true; });
        }
        if (iHelperText) iHelperText.hidden = true;
        dispatch('assessment:state-change', { from: null, to: 'preflight' });
      },
    };

    Object.defineProperty(rootEl, '_assessment', { value: api, configurable: true });

    // Init: ensure only the preflight section is visible at boot.
    STATES.forEach((s) => { if (sections[s]) sections[s].hidden = (s !== 'preflight'); });
    wireActions();

    return api;
  }

  // ─── Bootstrap ─────────────────────────────────────────────────────────────

  function init() {
    document.querySelectorAll('[data-assessment-root]').forEach((rootEl) => {
      const instance = loadInstance(rootEl);
      if (!instance) return;
      createEngine(rootEl, instance);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
