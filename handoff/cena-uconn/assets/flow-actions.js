/*
 * flow-actions.js — CONSUMED COPY (build artifact). Source of truth:
 * packages/design-system/src/scripts/components/flow-actions.js (haven-ui DS primitive).
 * Do not edit here — edit the DS source and re-copy. Kept in assets/ so the bundle is
 * self-contained / file://-openable, the same way assets/haven.css is the consumed CSS build.
 *
 * No framework, file://-safe (no fetch). Makes multi-step flows advance and complete so the
 * bundle "feels like an app" without a router. Data-attribute driven (no class coupling) — the
 * receiving dev ports the same contract to Angular handlers, or uses this file unchanged.
 *
 * Contract:
 *   [data-nav="path.html"]        click → navigate to path (the page-advance / submit-to-confirm).
 *   [data-action="save"]          click → in-place "saved" state (disable + swap label to
 *                                 data-saved-label || "Saved ✓"). For independent-save forms.
 *   [data-reveal-submit]          click → reveal every [data-submit-region]/hidden submit wrapper
 *                                 and enable [data-action="submit"] (the runner's "you've gone
 *                                 through the questions → you can submit now" moment).
 *
 * Andrey's port note: these are presentation-only affordances for the static walkthrough; the
 * production runner owns real validation + submission. The data-* names are the stable contract.
 */
(function () {
  document.addEventListener('click', function (e) {
    var nav = e.target.closest('[data-nav]');
    if (nav) { e.preventDefault(); window.location.href = nav.getAttribute('data-nav'); return; }

    var save = e.target.closest('[data-action="save"]');
    if (save && !save.disabled) {
      save.disabled = true;
      save.textContent = save.getAttribute('data-saved-label') || 'Saved ✓';
      return;
    }

    var reveal = e.target.closest('[data-reveal-submit]');
    if (reveal) {
      document.querySelectorAll('[data-submit-region], [data-submit-hidden]').forEach(function (r) { r.hidden = false; });
      // also reveal a bare hidden wrapper that directly contains a submit button
      document.querySelectorAll('[data-action="submit"]').forEach(function (b) {
        b.disabled = false;
        var wrap = b.closest('[hidden]');
        if (wrap) wrap.hidden = false;
      });
    }
  });
})();
