/**
 * havenCopyField
 * Copies the text content of a source element to the clipboard
 * and toggles a temporary "Copied!" feedback state on the button.
 *
 * @param {string} sourceId  - id of the element whose text/value to copy
 * @param {string} btnId     - id of the button to toggle .is-copied on
 */
window.havenCopyField = function havenCopyField(sourceId, btnId) {
  const source = document.getElementById(sourceId);
  const btn = document.getElementById(btnId);
  if (!source || !btn) return;

  const text = source.value ?? source.textContent ?? '';

  navigator.clipboard.writeText(text.trim()).then(() => {
    btn.classList.add('is-copied');

    // Update label text if a .copy-btn-label span exists
    const label = btn.querySelector('.copy-btn-label');
    if (label) {
      const original = label.textContent;
      label.textContent = 'Copied!';
      setTimeout(() => {
        label.textContent = original;
        btn.classList.remove('is-copied');
      }, 2000);
    } else {
      setTimeout(() => btn.classList.remove('is-copied'), 2000);
    }
  }).catch(() => {
    // Fallback for environments where clipboard API is unavailable
    console.warn('Clipboard API unavailable — copy failed silently.');
  });
}
