/*
 * option-row interactive demo handler — PL preview only.
 *
 * The option-row primitive ships as static HTML; selection state is
 * consumer-managed (per spec, "Roving tabindex is consumer-side state,
 * not a primitive concern"). For the PL preview, this script makes
 * the demos respond to clicks so reviewers can see selection-state
 * transitions without running a consumer-app.
 *
 * Behavior:
 * - Single-select (`option-row-list[role="radiogroup"]`): clicking an
 *   option-row sets its `aria-checked="true"` and clears all siblings
 *   to `aria-checked="false"`. `.is-other` button also flips
 *   `aria-expanded` to mirror `aria-checked`.
 * - Multi-select (`option-row-list[role="group"]`): clicking an
 *   option-row toggles its own `aria-checked`. `.is-other` also
 *   toggles `aria-expanded`.
 * - Skip if the clicked option-row has `aria-disabled="true"`.
 * - Skip entirely if the option-row sits inside a `.thread-question-
 *   card.is-historical` ancestor (read-only thread-history rendering).
 *
 * Real consumer apps replace this with React state (or framework
 * equivalent). This script is PL-preview-only and is referenced from
 * `pl-scripts.html`, not from any consuming-app entry script.
 */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var lists = document.querySelectorAll('.option-row-list');
    if (!lists.length) return;

    lists.forEach(function (list) {
      list.addEventListener('click', function (event) {
        var button = event.target.closest('.option-row');
        if (!button || !list.contains(button)) return;
        if (button.getAttribute('aria-disabled') === 'true') return;
        if (button.closest('.thread-question-card.is-historical')) return;

        var role = list.getAttribute('role');
        var isMultiSelect = role === 'group';
        var isSingleSelect = role === 'radiogroup';

        if (isSingleSelect) {
          // Clear all siblings, then set clicked.
          list.querySelectorAll('.option-row').forEach(function (sibling) {
            sibling.setAttribute('aria-checked', 'false');
            if (sibling.classList.contains('is-other')) {
              sibling.setAttribute('aria-expanded', 'false');
            }
          });
          button.setAttribute('aria-checked', 'true');
          if (button.classList.contains('is-other')) {
            button.setAttribute('aria-expanded', 'true');
          }
        } else if (isMultiSelect) {
          // Toggle the clicked option independently.
          var nowChecked = button.getAttribute('aria-checked') !== 'true';
          button.setAttribute('aria-checked', nowChecked ? 'true' : 'false');
          if (button.classList.contains('is-other')) {
            button.setAttribute('aria-expanded', nowChecked ? 'true' : 'false');
          }
        }
      });
    });
  });
})();
