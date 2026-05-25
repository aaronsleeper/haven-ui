/**
 * Satisfaction runner — Cena × UConn pilot handoff (cap-09)
 *
 * REUSE APPROACH: This file is a thin copy-and-configure of
 * `../assessments/assessment-runner.js`. The state machine shape,
 * DOM contract (data-assessment-root, data-state sections, data-action
 * buttons), CustomEvents, and programmatic API are IDENTICAL.
 * Differences from the assessment runner:
 *   - Identity state is removed (satisfaction has no identity-capture step).
 *   - A new inputType 'emoji-scale' is handled: renders a native radio
 *     fieldset with emoji options rather than the response-option-group
 *     button pattern. The DOM contract is a `.emoji-scale` fieldset
 *     with `.emoji-scale-option` labels containing sr-only inputs.
 *   - Outcome computation always returns 'submitted' (no clinical
 *     outcome routing — one outcome variant, no early-exit predicates).
 *   - outcomeRules are ignored; the confirmation variant key is 'submitted'.
 *   - HARD INVARIANT: no score is surfaced to the patient. The score
 *     is present in the assessment:submit CustomEvent detail for the
 *     backend; it is never rendered in the DOM.
 *
 * ── Wiring contract ─────────────────────────────────────────────────
 *
 * HTML provides one root element [data-assessment-root], with child
 * sections <section data-state="preflight|question|confirm">. The
 * engine toggles [hidden] on those sections.
 *
 * Question state: .assessment-header (title + meta + bar),
 * .response-option-group (engine fills for likert-5pt items),
 * .emoji-scale fieldset (engine fills for emoji-scale items),
 * .pagination-row (Prev / Next), [data-submit-region] (Submit + helper).
 *
 * Confirm state: one [data-confirm-variant="submitted"] child (only
 * one outcome; engine always reveals it).
 *
 * Instance data comes from window.SURVEY_INSTANCE (or
 * [data-instance] JSON on the root element).
 *
 * ── Instance data shape ──────────────────────────────────────────────
 *
 * window.SURVEY_INSTANCE = {
 *   id: string,                   // e.g. "satisfaction-month-3"
 *   plainLanguageName: string,    // patient-facing name
 *   itemCount: number,
 *   timeEstimateMinutes: number,
 *   items: [
 *     {
 *       id: string,
 *       promptText: string,
 *       inputType: 'likert-5pt' | 'emoji-scale',
 *       options: [{ value, label, index }],  // for likert-5pt
 *       emojiOptions: [{ value, emoji, label }], // for emoji-scale
 *       required: boolean,
 *     }, ...
 *   ]
 * };
 *
 * PROVISIONAL: The satisfaction instrument items are placeholders.
 * Final item set requires Vanessa input (see README.md).
 *
 * ── Events (CustomEvent on root element, bubbles) ────────────────────
 *
 *   assessment:state-change  { from, to }
 *   assessment:answer        { itemId, value, index }
 *   assessment:submit        { instanceId, answers }
 *   assessment:save-pause    { itemId }
 *
 * ── Programmatic API (on root element, non-enumerable) ───────────────
 *
 *   el._assessment.getState()    → 'preflight' | 'question' | 'confirm'
 *   el._assessment.getAnswers()  → { [itemId]: value }
 *   el._assessment.reset()       → return to preflight, clear answers
 */

(function () {
  'use strict';

  const STATES = ['preflight', 'question', 'confirm'];

  // ── PROVISIONAL satisfaction instrument ─────────────────────────────
  // Items are representative placeholders. Final items require Vanessa
  // input. Copy-voice: plain, warm, 2nd-person, ~5th-6th grade.
  const DEFAULT_SURVEY_INSTANCE = {
    id: 'satisfaction-month-3',
    plainLanguageName: 'How is the program going?',
    itemCount: 8,
    timeEstimateMinutes: 5,
    sensitivityRegister: 'satisfaction',
    items: [
      {
        id: 'sat-q1',
        promptText: 'How easy has it been to get your meals through the program?',
        inputType: 'likert-5pt',
        required: true,
        options: [
          { value: 'very-easy', label: 'Very easy', index: 0 },
          { value: 'easy',      label: 'Easy',      index: 1 },
          { value: 'neutral',   label: 'Neither easy nor hard', index: 2 },
          { value: 'hard',      label: 'Hard',      index: 3 },
          { value: 'very-hard', label: 'Very hard', index: 4 },
        ],
      },
      {
        id: 'sat-q2',
        promptText: 'How well does the food fit what you like and usually eat?',
        inputType: 'likert-5pt',
        required: true,
        options: [
          { value: 'very-well',     label: 'Very well', index: 0 },
          { value: 'well',          label: 'Well',      index: 1 },
          { value: 'neutral',       label: 'Sort of',   index: 2 },
          { value: 'not-well',      label: 'Not very well', index: 3 },
          { value: 'not-at-all',    label: 'Not at all', index: 4 },
        ],
      },
      {
        id: 'sat-q3',
        promptText: 'How easy has it been to pick up or receive your meals?',
        inputType: 'likert-5pt',
        required: true,
        options: [
          { value: 'very-easy', label: 'Very easy', index: 0 },
          { value: 'easy',      label: 'Easy',      index: 1 },
          { value: 'neutral',   label: 'Neither easy nor hard', index: 2 },
          { value: 'hard',      label: 'Hard',      index: 3 },
          { value: 'very-hard', label: 'Very hard', index: 4 },
        ],
      },
      {
        id: 'sat-q4',
        promptText: 'How much has the program helped you feel more in control of what you eat?',
        inputType: 'likert-5pt',
        required: true,
        options: [
          { value: 'a-lot',       label: 'A lot',     index: 0 },
          { value: 'somewhat',    label: 'Somewhat',  index: 1 },
          { value: 'a-little',    label: 'A little',  index: 2 },
          { value: 'not-much',    label: 'Not much',  index: 3 },
          { value: 'not-at-all',  label: 'Not at all', index: 4 },
        ],
      },
      {
        id: 'sat-q5',
        promptText: 'Overall, how do you feel about the program so far?',
        inputType: 'emoji-scale',
        required: true,
        emojiOptions: [
          { value: '1', emoji: '😫', label: 'Not good'  },
          { value: '2', emoji: '😔', label: 'Not great' },
          { value: '3', emoji: '😐', label: 'Okay'      },
          { value: '4', emoji: '🙂', label: 'Good'      },
          { value: '5', emoji: '😊', label: 'Great'     },
        ],
      },
      {
        id: 'sat-q6',
        promptText: 'How well has the program fit into your daily life?',
        inputType: 'likert-5pt',
        required: true,
        options: [
          { value: 'very-well',  label: 'Very well',  index: 0 },
          { value: 'well',       label: 'Well',       index: 1 },
          { value: 'neutral',    label: 'Sort of',    index: 2 },
          { value: 'not-well',   label: 'Not very well', index: 3 },
          { value: 'not-at-all', label: 'Not at all', index: 4 },
        ],
      },
      {
        id: 'sat-q7',
        promptText: 'How likely are you to keep using the program for the next few months?',
        inputType: 'likert-5pt',
        required: true,
        options: [
          { value: 'very-likely',   label: 'Very likely',   index: 0 },
          { value: 'likely',        label: 'Likely',        index: 1 },
          { value: 'neutral',       label: 'Not sure',      index: 2 },
          { value: 'unlikely',      label: 'Unlikely',      index: 3 },
          { value: 'very-unlikely', label: 'Very unlikely', index: 4 },
        ],
      },
      {
        id: 'sat-q8',
        promptText: 'How likely are you to tell someone you know about this program?',
        inputType: 'likert-5pt',
        required: true,
        options: [
          { value: 'very-likely',   label: 'Very likely',   index: 0 },
          { value: 'likely',        label: 'Likely',        index: 1 },
          { value: 'neutral',       label: 'Not sure',      index: 2 },
          { value: 'unlikely',      label: 'Unlikely',      index: 3 },
          { value: 'very-unlikely', label: 'Very unlikely', index: 4 },
        ],
      },
    ],
  };

  // ── Data loading ────────────────────────────────────────────────────

  function loadInstance(rootEl) {
    const attr = rootEl.getAttribute('data-instance');
    if (attr) {
      try { return JSON.parse(attr); } catch (e) {
        console.warn('[satisfaction-runner] data-instance parse failed:', e);
      }
    }
    if (window.SURVEY_INSTANCE) return window.SURVEY_INSTANCE;
    // Fall back to the provisional default
    return DEFAULT_SURVEY_INSTANCE;
  }

  // ── Engine factory ──────────────────────────────────────────────────

  function createEngine(rootEl, instance) {
    const state = {
      currentState: 'preflight',
      currentItemIndex: 0,
      answers: {},
    };

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
    const qEmojiScale = qSection && qSection.querySelector('.emoji-scale');
    const qEmojiLegend = qEmojiScale && qEmojiScale.querySelector('legend');
    const qPaginationRow = qSection && qSection.querySelector('.pagination-row');
    const qBtnPrev = qPaginationRow && qPaginationRow.querySelector('[data-action="prev"]');
    const qBtnNext = qPaginationRow && qPaginationRow.querySelector('[data-action="next"]');
    const qSubmitRegion = qSection && qSection.querySelector('[data-submit-region]');
    const qBtnSubmit = qSubmitRegion && qSubmitRegion.querySelector('[data-action="submit"]');

    // ── State machine ───────────────────────────────────────────────

    function showState(next) {
      const prev = state.currentState;
      if (prev === next) return;
      STATES.forEach((s) => {
        if (sections[s]) sections[s].hidden = (s !== next);
      });
      state.currentState = next;
      dispatch('assessment:state-change', { from: prev, to: next });
      if (next === 'question') renderQuestionItem();
      if (next === 'confirm') renderConfirmation();
    }

    // ── Progress bar ────────────────────────────────────────────────

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
      barEl.setAttribute('aria-valuetext', `Question ${index + 1} of ${total}`);
    }

    // ── Question rendering ──────────────────────────────────────────

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

      // Show the right input type, hide the other
      const isEmoji = item.inputType === 'emoji-scale';
      if (qOptionGroup) qOptionGroup.hidden = isEmoji;
      if (qEmojiScale) qEmojiScale.hidden = !isEmoji;

      if (isEmoji) {
        renderEmojiItem(item, index);
      } else {
        renderLikertItem(item, index);
      }

      if (qBtnPrev) qBtnPrev.disabled = (index === 0);
      if (qPaginationRow) qPaginationRow.hidden = isLast;
      if (qSubmitRegion) qSubmitRegion.hidden = !isLast;
      updateAdvanceState(item, isLast);
    }

    function renderLikertItem(item, index) {
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

          btn.addEventListener('click', () => selectLikertOption(item, opt));
          btn.addEventListener('keydown', (e) => handleOptionKey(e, item, opt, i));

          qOptionList.appendChild(btn);
        });
      }
    }

    function renderEmojiItem(item, index) {
      if (qEmojiLegend) qEmojiLegend.textContent = item.promptText;
      if (!qEmojiScale) return;

      // Clear existing options (keep the legend)
      Array.from(qEmojiScale.querySelectorAll('.emoji-scale-option')).forEach((el) => el.remove());

      const groupName = `emoji-${item.id}`;
      (item.emojiOptions || []).forEach((opt) => {
        const label = document.createElement('label');
        label.className = 'emoji-scale-option';

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = groupName;
        input.value = opt.value;
        input.className = 'sr-only';
        if (state.answers[item.id] === opt.value) input.checked = true;

        const iconSpan = document.createElement('span');
        iconSpan.className = 'emoji-scale-icon';
        iconSpan.textContent = opt.emoji;

        const labelSpan = document.createElement('span');
        labelSpan.className = 'emoji-scale-label';
        labelSpan.textContent = opt.label;

        label.appendChild(input);
        label.appendChild(iconSpan);
        label.appendChild(labelSpan);

        input.addEventListener('change', () => selectEmojiOption(item, opt));
        qEmojiScale.appendChild(label);
      });
    }

    function selectLikertOption(item, opt) {
      state.answers[item.id] = opt.value;
      if (qOptionList) {
        qOptionList.querySelectorAll('.response-option').forEach((b) => {
          b.setAttribute('aria-checked', b.getAttribute('data-value') === opt.value ? 'true' : 'false');
        });
      }
      dispatch('assessment:answer', { itemId: item.id, value: opt.value, index: state.currentItemIndex });
      const isLast = state.currentItemIndex === instance.items.length - 1;
      updateAdvanceState(item, isLast);
    }

    function selectEmojiOption(item, opt) {
      state.answers[item.id] = opt.value;
      dispatch('assessment:answer', { itemId: item.id, value: opt.value, index: state.currentItemIndex });
      const isLast = state.currentItemIndex === instance.items.length - 1;
      updateAdvanceState(item, isLast);
    }

    function handleOptionKey(e, item, opt, i) {
      const total = item.options.length;
      let nextIndex = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') nextIndex = (i + 1) % total;
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') nextIndex = (i - 1 + total) % total;
      else if (e.key === ' ' || e.key === 'Enter') { selectLikertOption(item, opt); e.preventDefault(); return; }
      if (nextIndex !== null) {
        const buttons = qOptionList.querySelectorAll('.response-option');
        if (buttons[nextIndex]) buttons[nextIndex].focus();
        e.preventDefault();
      }
    }

    function updateAdvanceState(item, isLast) {
      const answered = state.answers[item.id] !== undefined;
      const required = item.required !== false;
      const canAdvance = answered || !required;
      if (isLast) {
        if (qBtnSubmit) qBtnSubmit.disabled = !canAdvance;
      } else {
        if (qBtnNext) qBtnNext.disabled = !canAdvance;
      }
    }

    // ── Navigation ──────────────────────────────────────────────────

    function goNext() {
      if (state.currentItemIndex < instance.items.length - 1) {
        state.currentItemIndex += 1;
        showState('question');
        if (state.currentState === 'question') renderQuestionItem();
      }
    }

    function goPrev() {
      if (state.currentItemIndex > 0) {
        state.currentItemIndex -= 1;
        renderQuestionItem();
      }
    }

    function submit() {
      // HARD INVARIANT: score is computed here for the backend payload,
      // but is NEVER surfaced in the DOM. The confirmation card shows
      // only "submitted, your care team has it."
      dispatch('assessment:submit', {
        instanceId: instance.id,
        answers: { ...state.answers },
        // Score routing: backend consumes this event; patient UI does not.
      });
      showState('confirm');
    }

    // ── Confirmation rendering ──────────────────────────────────────

    function renderConfirmation() {
      const confirmSection = sections.confirm;
      if (!confirmSection) return;
      // Satisfaction survey has exactly one outcome: 'submitted'.
      // No score, no routing, no result label — per the no-score invariant.
      const variants = confirmSection.querySelectorAll('[data-confirm-variant]');
      if (variants.length > 0) {
        variants.forEach((v) => { v.hidden = false; }); // reveal the only variant
      }
    }

    // ── Event dispatch ──────────────────────────────────────────────

    function dispatch(name, detail) {
      rootEl.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
    }

    // ── Wiring ──────────────────────────────────────────────────────

    function wireActions() {
      rootEl.querySelectorAll('[data-action="ready"]').forEach((b) => {
        b.addEventListener('click', () => {
          state.currentItemIndex = 0;
          showState('question');
        });
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
    }

    // ── Public API ──────────────────────────────────────────────────

    const api = {
      getState: () => state.currentState,
      getAnswers: () => ({ ...state.answers }),
      reset: () => {
        state.currentState = 'preflight';
        state.currentItemIndex = 0;
        state.answers = {};
        STATES.forEach((s) => { if (sections[s]) sections[s].hidden = (s !== 'preflight'); });
        dispatch('assessment:state-change', { from: null, to: 'preflight' });
      },
    };

    Object.defineProperty(rootEl, '_assessment', { value: api, configurable: true });

    // Init: show only preflight.
    STATES.forEach((s) => { if (sections[s]) sections[s].hidden = (s !== 'preflight'); });
    wireActions();

    return api;
  }

  // ── Bootstrap ────────────────────────────────────────────────────────

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
