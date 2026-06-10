/**
 * pl-nav.js
 *
 * Pattern-library sidebar nav enhancements (PL-doc-site only):
 *  1. Set aria-current="page" on the active sidebar link (WCAG 2.4.8 Location)
 *  2. Tag <main> with id="main" + tabindex="-1" so the skip-link target lands focus
 *  3. Restore sidebar scroll position across the per-click full-page reloads
 *     (sessionStorage; cleared at session end so it doesn't go stale across days)
 *
 * Wired in pattern-library/partials/pl-scripts.html. Vanilla, no deps.
 */
(function () {
  const STORAGE_KEY = 'havenPlNavScroll';

  // (2) Tag <main> as the skip-link target. Pages set <main> without id;
  //     setting it here avoids editing 100+ pages by hand.
  const main = document.querySelector('main');
  if (main && !main.id) {
    main.id = 'main';
    main.tabIndex = -1;
  }

  // (1) Mark the active sidebar link. Compare by basename so this works
  //     whether the href is relative ("../pages/buttons.html") or absolute.
  const here = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.app-sidebar a.sidebar-nav-item').forEach((link) => {
    const href = (link.getAttribute('href') || '').split('#')[0];
    const target = (href.split('/').pop() || '').toLowerCase();
    if (target && target === here) {
      link.setAttribute('aria-current', 'page');
    }
  });

  // (3) Sidebar scroll restoration.
  const sidebar = document.querySelector('.app-sidebar');
  if (sidebar) {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const px = parseInt(saved, 10);
      if (Number.isFinite(px)) sidebar.scrollTop = px;
    }
    // Save on link click (fires before navigation) AND on visibility-hidden
    // as a belt-and-suspenders for browsers that skip beforeunload.
    sidebar.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        sessionStorage.setItem(STORAGE_KEY, String(sidebar.scrollTop));
      }
    });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        sessionStorage.setItem(STORAGE_KEY, String(sidebar.scrollTop));
      }
    });
  }
})();
