/**
 * Assessment runner — Cena × UConn pilot handoff
 *
 * Drives the 4-state runner: entry → preflight → question → confirm
 * Vanilla ES (no deps). Drop-in for the cena-uconn handoff demos so Andrey
 * can step through them in a browser; port the contract to Angular.
 *
 * NOT the same engine as packages/design-system/src/scripts/components/assessment.js
 * (that file backs an older prototype with a different DOM/class contract).
 *
 * ── Wiring contract ─────────────────────────────────────────────────────────
 *
 * HTML provides one root element [data-assessment-root], with four child
 * <section data-state="entry|preflight|question|confirm"> blocks. The engine
 * toggles the [hidden] attribute on those sections to swap state.
 *
 * The question section provides one .assessment-header (with title + meta + bar),
 * one .response-option-group (an empty slot the engine fills per item), a
 * .pagination-row (Previous + Next buttons), and a .submit-region (Submit
 * button + helper). The confirm section provides one [data-confirm-variant]
 * child per possible outcome; the engine reveals the matching one.
 *
 * Question item data comes from window.ASSESSMENT_INSTANCE (or from the
 * `data-instance` JSON attribute on the root) and follows the AssessmentInstance
 * shape documented in handoff/cena-uconn/assessments/AGENTS.md.
 *
 * ── Events (CustomEvent on root element, bubbles, detail = …) ───────────────
 *
 *   assessment:state-change  { from, to }
 *   assessment:answer        { itemId, value, index }
 *   assessment:submit        { instanceId, answers, outcome }
 *
 * Angular port: bind to these as @Output() EventEmitters; the same detail
 * shape moves over verbatim.
 *
 * ── Programmatic API (on the root element, non-enumerable) ──────────────────
 *
 *   el._assessment.getState()        → 'entry' | 'preflight' | 'question' | 'confirm'
 *   el._assessment.getAnswers()      → { [itemId]: value }
 *   el._assessment.getOutcome()      → outcome class | undefined
 *   el._assessment.reset()           → return to entry, clear answers
 */

(function () {
  'use strict';

  const STATES = ['entry', 'preflight', 'question', 'confirm'];

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

  // ─── Engine factory (one per root element) ────────────────────────────────

  function createEngine(rootEl, instance) {
    const state = {
      currentState: 'entry',
      currentItemIndex: 0,
      answers: {},
      outcome: undefined,
    };

    // Section refs
    const sections = {};
    STATES.forEach((s) => {
      sections[s] = rootEl.querySelector(`[data-state="${s}"]`);
    });

    // Question-state refs
    const qSection = sections.question;
    const headerTitle = qSection && qSection.querySelector('.assessment-header-title');
    const headerMeta = qSection && qSection.querySelector('.assessment-header-meta');
    const progressBar = qSection && qSection.querySelector('.progress-bar-pagination');
    const cardCounter = qSection && qSection.querySelector('[data-bind="item.counter"]');
    const optionGroup = qSection && qSection.querySelector('.response-option-group');
    const optionLegend = optionGroup && optionGroup.querySelector('.response-option-group-prompt');
    const optionList = optionGroup && optionGroup.querySelector('.response-option-group-list');
    const paginationRow = qSection && qSection.querySelector('.pagination-row');
    const btnPrev = paginationRow && paginationRow.querySelector('[data-action="prev"]');
    const btnNext = paginationRow && paginationRow.querySelector('[data-action="next"]');
    const submitRegion = qSection && qSection.querySelector('.submit-region');
    const btnSubmit = submitRegion && submitRegion.querySelector('[data-action="submit"]');

    // ─── State machine ─────────────────────────────────────────────────────

    function showState(next) {
      const prev = state.currentState;
      if (prev === next) return;
      STATES.forEach((s) => {
        if (sections[s]) sections[s].hidden = (s !== next);
      });
      state.currentState = next;
      dispatch('assessment:state-change', { from: prev, to: next });
      if (next === 'question') renderItem();
      if (next === 'confirm') renderConfirmation();
    }

    // ─── Question rendering ────────────────────────────────────────────────

    function renderItem() {
      const item = instance.items[state.currentItemIndex];
      const total = instance.items.length;
      const index = state.currentItemIndex;
      const isLast = index === total - 1;

      // Header text
      if (headerTitle) headerTitle.textContent = instance.plainLanguageName;
      const counterText = `Question ${index + 1} of ${total}`;
      if (headerMeta) headerMeta.textContent = counterText;
      if (cardCounter) cardCounter.textContent = counterText;

      // Progress bar segments + ARIA
      if (progressBar) {
        renderProgressBar(progressBar, index, total);
      }

      // Prompt
      if (optionLegend) optionLegend.textContent = item.promptText;

      // Options
      if (optionList) {
        optionList.innerHTML = '';
        item.options.forEach((opt, i) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'response-option';
          btn.setAttribute('role', 'radio');
          const isSelected = state.answers[item.id] === opt.value;
          btn.setAttribute('aria-checked', String(isSelected));
          btn.setAttribute('data-value', opt.value);

          const indexSpan = document.createElement('span');
          indexSpan.className = 'response-option-index';
          const indexNum = document.createElement('span');
          indexNum.className = 'response-option-index-num';
          indexNum.textContent = String.fromCharCode(65 + i); // A, B, C…
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

          optionList.appendChild(btn);
        });
      }

      // Pagination + submit visibility
      if (btnPrev) btnPrev.disabled = (index === 0);
      if (paginationRow) paginationRow.hidden = isLast;
      if (submitRegion) submitRegion.hidden = !isLast;
      updateAdvanceState(item, isLast);
    }

    function renderProgressBar(barEl, index, total) {
      // Rebuild segments so demos with different item counts render correctly.
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
      barEl.setAttribute('aria-valuetext', `Question ${index + 1} of ${total}`);
    }

    function selectOption(item, opt) {
      state.answers[item.id] = opt.value;
      // Reflect aria-checked across the radiogroup
      if (optionList) {
        optionList.querySelectorAll('.response-option').forEach((b) => {
          b.setAttribute('aria-checked', b.getAttribute('data-value') === opt.value ? 'true' : 'false');
        });
      }
      dispatch('assessment:answer', { itemId: item.id, value: opt.value, index: state.currentItemIndex });
      const isLast = state.currentItemIndex === instance.items.length - 1;
      updateAdvanceState(item, isLast);
    }

    function handleOptionKey(e, item, opt, i) {
      const total = item.options.length;
      let nextIndex = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') nextIndex = (i + 1) % total;
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') nextIndex = (i - 1 + total) % total;
      else if (e.key === ' ' || e.key === 'Enter') { selectOption(item, opt); e.preventDefault(); return; }
      if (nextIndex !== null) {
        const buttons = optionList.querySelectorAll('.response-option');
        if (buttons[nextIndex]) buttons[nextIndex].focus();
        e.preventDefault();
      }
    }

    function updateAdvanceState(item, isLast) {
      const answered = state.answers[item.id] !== undefined;
      const required = item.required !== false;
      const canAdvance = answered || !required;
      if (isLast) {
        if (btnSubmit) btnSubmit.disabled = !canAdvance;
      } else {
        if (btnNext) btnNext.disabled = !canAdvance;
      }
    }

    // ─── Navigation ────────────────────────────────────────────────────────

    function goNext() {
      const item = instance.items[state.currentItemIndex];
      const answer = state.answers[item.id];

      // Per-item early-exit predicate
      if (item.earlyExitWhen && answer !== undefined) {
        const match = item.earlyExitWhen.find((p) => p.answer === answer);
        if (match) {
          state.outcome = match.outcome;
          submit();
          return;
        }
      }

      if (state.currentItemIndex < instance.items.length - 1) {
        state.currentItemIndex += 1;
        renderItem();
      }
    }

    function goPrev() {
      if (state.currentItemIndex > 0) {
        state.currentItemIndex -= 1;
        renderItem();
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

    // ─── Outcome computation (rule-based; see screener-pre-enrollment-content-draft.md) ──

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
      if (!revealed) {
        // Fall back to the first variant if outcome doesn't match any declared variant.
        if (variants[0]) variants[0].hidden = false;
      }
    }

    // ─── Event dispatch ────────────────────────────────────────────────────

    function dispatch(name, detail) {
      rootEl.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
    }

    // ─── Wiring ────────────────────────────────────────────────────────────

    function wireActions() {
      rootEl.querySelectorAll('[data-action="start"]').forEach((b) => {
        b.addEventListener('click', () => showState('preflight'));
      });
      rootEl.querySelectorAll('[data-action="ready"]').forEach((b) => {
        b.addEventListener('click', () => showState('question'));
      });
      if (btnNext) btnNext.addEventListener('click', goNext);
      if (btnPrev) btnPrev.addEventListener('click', goPrev);
      if (btnSubmit) btnSubmit.addEventListener('click', submit);
      rootEl.querySelectorAll('[data-action="save-pause"]').forEach((b) => {
        b.addEventListener('click', () => {
          // Slice 1: visual no-op for the demo. Production wires to session persistence.
          dispatch('assessment:save-pause', { itemId: instance.items[state.currentItemIndex].id });
        });
      });
      rootEl.querySelectorAll('[data-action="reset"]').forEach((b) => {
        b.addEventListener('click', api.reset);
      });
    }

    // ─── Public API ────────────────────────────────────────────────────────

    const api = {
      getState: () => state.currentState,
      getAnswers: () => ({ ...state.answers }),
      getOutcome: () => state.outcome,
      reset: () => {
        state.currentState = 'entry';
        state.currentItemIndex = 0;
        state.answers = {};
        state.outcome = undefined;
        STATES.forEach((s) => { if (sections[s]) sections[s].hidden = (s !== 'entry'); });
        dispatch('assessment:state-change', { from: null, to: 'entry' });
      },
    };

    Object.defineProperty(rootEl, '_assessment', { value: api, configurable: true });

    // Init: ensure only the entry section is visible at boot.
    STATES.forEach((s) => { if (sections[s]) sections[s].hidden = (s !== 'entry'); });
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
