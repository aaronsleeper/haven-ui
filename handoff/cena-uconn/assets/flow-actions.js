/*
 * flow-actions.js — framework-agnostic flow-interaction primitive (haven-ui design system).
 *
 * "Vanilla JS per primitive" (see haven-ui CLAUDE.md): non-trivial framework-agnostic behavior
 * ships with the PL so any consumer (vanilla static bundle, Angular, React) uses it unchanged or
 * ports the contract. This primitive lets multi-step flows ADVANCE and COMPLETE without a router,
 * so a no-framework static build "feels like an app." file://-safe (no fetch).
 *
 * Source of truth: this file. The self-contained handoff bundle consumes a copy in its assets/
 * (copied by the handoff rebuild). Do not author a divergent copy in a handoff/output dir.
 *
 * Contract (data-attribute driven — no class coupling):
 *   [data-nav="path.html"]   click → navigate to path. The page-advance / submit-to-confirm link.
 *   [data-action="save"]     click → in-place saved state: disable + swap label to
 *                            data-saved-label || "Saved ✓". For independent-save forms.
 *   [data-reveal-submit]     click → reveal every [data-submit-region] (and any [hidden] wrapper
 *                            directly containing a [data-action="submit"]) and enable the submit.
 *                            The runner's "you've been through the questions → you can submit" moment.
 *
 * Events: none required for v1 (presentation-only affordances). A consumer that needs to intercept
 * navigation can listen for click on [data-nav] and preventDefault before this handler (capture phase).
 *
 * Port note (Angular/React): these are presentation affordances for the static walkthrough; the
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
      document.querySelectorAll('[data-submit-region]').forEach(function (r) { r.hidden = false; });
      document.querySelectorAll('[data-action="submit"]').forEach(function (b) {
        b.disabled = false;
        var wrap = b.closest('[hidden]');
        if (wrap) wrap.hidden = false;
      });
    }
  });
})();
