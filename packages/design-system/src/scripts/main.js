import 'preline';

// Font-features gate: add html.fonts-loaded once Source Sans 3 has actually
// arrived. Pairs with `:where(html.fonts-loaded) body { font-feature-settings ... }`
// in base/font-features.css. Prevents the superscript/small-caps flash that
// OpenType feature codes produce when applied to the system fallback font
// (Times/Helvetica) during the Google Fonts swap window. See font-features.css
// comment block + /investigate report 2026-05-11.
if ('fonts' in document) {
  document.fonts.ready.then(() => {
    document.documentElement.classList.add('fonts-loaded');
  });
}

// Preline v4 ESM does not auto-call autoInit -- we must trigger it manually.
document.addEventListener('DOMContentLoaded', () => {
  window.HSStaticMethods.autoInit();
});
