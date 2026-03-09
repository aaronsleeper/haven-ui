import 'preline';

// Preline v4 ESM does not auto-call autoInit -- we must trigger it manually.
document.addEventListener('DOMContentLoaded', () => {
  window.HSStaticMethods.autoInit();
});
