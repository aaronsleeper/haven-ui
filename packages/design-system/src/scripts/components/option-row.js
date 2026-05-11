/*
 * option-row interactive behavior — primitive-level click-to-toggle.
 *
 * The option-row primitive's universal contract: clicking an unchecked
 * option-row checks it. In single-select context (option-row-list
 * carries role="radiogroup") siblings clear; in multi-select context
 * (role="group") the clicked option toggles independently.
 *
 * This script is part of the haven-ui PL primitive, NOT a preview
 * affordance. Consumers in any framework (vanilla, future Angular,
 * etc.) inherit this behavior by referencing this script alongside
 * the option-row HTML. The React port manages selection via React
 * state and does not load this script — but the behavioral contract
 * (clicked option becomes checked; siblings clear in single-select)
 * is the same.
 *
 * Consumer-side concerns NOT handled here (per option-row spec):
 *   - Initial selection state (mounted aria-checked values)
 *   - Persistence / Submit handling
 *   - Roving tabindex policy customization
 *   - Custom keyboard handlers (arrow keys, type-ahead, etc.)
 *   - Focus return after sheet close
 *
 * `.is-other` reveal: this script flips `aria-expanded` to mirror
 * `aria-checked`. Rendering / removal of the textarea below remains
 * consumer-managed (the static PL fragment doesn't mount/unmount
 * the textarea; React port maps aria-expanded to conditional render).
 *
 * Skip conditions:
 *   - aria-disabled="true" on the button → no toggle
 *   - Ancestor `.thread-question-card.is-historical` → primitive is
 *     in read-only thread-history rendering; ignore all clicks
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
