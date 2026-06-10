/**
 * pl-nav.js
 *
 * Pattern-library sidebar nav enhancements (PL-doc-site only):
 *  1. Set aria-current="page" on the active sidebar link (WCAG 2.4.8 Location)
 *  2. Tag <main> with id="main" + tabindex="-1" so the skip-link target lands focus
 *  3. Restore sidebar scroll position across the per-click full-page reloads
 *     (sessionStorage; cleared at session end so it doesn't go stale across days)
 *  4. Per-section collapse persistence (<details>) — localStorage so collapse
 *     state survives reboots; current-page's section force-opens on load so
 *     the active link is never hidden
 *  5. Filter input — case-insensitive substring match on link text; hides
 *     non-matching <li> items; forces all sections open while filter is
 *     active so matches surface; filter value persists in sessionStorage
 *
 * Wired in pattern-library/partials/pl-scripts.html. Vanilla, no deps.
 */
(function () {
  const SCROLL_KEY = 'havenPlNavScroll';
  const SECTIONS_KEY = 'havenPlNavSections'; // {[slug]: open<bool>}
  const FILTER_KEY = 'havenPlNavFilter';

  // (2) Tag <main> as the skip-link target. Pages set <main> without id;
  //     setting it here avoids editing 100+ pages by hand.
  const main = document.querySelector('main');
  if (main && !main.id) {
    main.id = 'main';
    main.tabIndex = -1;
  }

  // (1) Mark the active sidebar link. Compare by trailing path segment so this
  //     works with relative hrefs. Also remember which <details> contains it so
  //     the collapse logic below can force-open that section.
  const here = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  let activeSection = null;
  document.querySelectorAll('.app-sidebar a.sidebar-nav-item').forEach((link) => {
    const href = (link.getAttribute('href') || '').split('#')[0];
    const target = (href.split('/').pop() || '').toLowerCase();
    if (target && target === here) {
      link.setAttribute('aria-current', 'page');
      const details = link.closest('details[data-pl-nav-section]');
      if (details) activeSection = details.dataset.plNavSection;
    }
  });

  // (4) Per-section collapse persistence.
  const sections = document.querySelectorAll('.app-sidebar details[data-pl-nav-section]');
  let savedSections = {};
  try {
    savedSections = JSON.parse(localStorage.getItem(SECTIONS_KEY) || '{}') || {};
  } catch (_) { /* corrupt JSON — start fresh */ }

  sections.forEach((d) => {
    const slug = d.dataset.plNavSection;
    if (slug in savedSections) d.open = !!savedSections[slug];
    // Force-open the section containing the current page — never hide the
    // active link behind a collapsed header.
    if (slug === activeSection) d.open = true;
    d.addEventListener('toggle', () => {
      savedSections[slug] = d.open;
      try { localStorage.setItem(SECTIONS_KEY, JSON.stringify(savedSections)); } catch (_) {}
    });
  });

  // (5) Filter input. Hides non-matching <li> items by setting hidden=true so
  //     they drop out of the layout AND are removed from AT trees. While the
  //     filter has any value, force all sections open so matches surface
  //     regardless of saved collapse state; restore prior state on clear.
  const filter = document.getElementById('pl-nav-filter');
  const emptyMsg = document.getElementById('pl-nav-filter-empty');
  if (filter) {
    const applyFilter = (raw) => {
      const q = (raw || '').trim().toLowerCase();
      const items = document.querySelectorAll('.app-sidebar .sidebar-nav-list > li');
      let visibleCount = 0;
      items.forEach((li) => {
        const text = li.textContent.toLowerCase();
        const match = !q || text.includes(q);
        li.hidden = !match;
        if (match) visibleCount++;
      });
      // When filtering, open all sections so matches are visible; sections
      // that have zero matches collapse their summary by hiding the details
      // entirely (the user doesn't want to see empty sections).
      sections.forEach((d) => {
        const anyVisible = d.querySelector('.sidebar-nav-list > li:not([hidden])');
        if (q) {
          d.hidden = !anyVisible;
          d.open = true;
        } else {
          d.hidden = false;
          const slug = d.dataset.plNavSection;
          d.open = slug in savedSections ? !!savedSections[slug] : true;
          if (slug === activeSection) d.open = true;
        }
      });
      if (emptyMsg) emptyMsg.hidden = !(q && visibleCount === 0);
    };

    // Restore filter from sessionStorage (within-session only).
    const savedFilter = sessionStorage.getItem(FILTER_KEY) || '';
    if (savedFilter) {
      filter.value = savedFilter;
      applyFilter(savedFilter);
    }
    filter.addEventListener('input', (e) => {
      const v = e.target.value;
      try { sessionStorage.setItem(FILTER_KEY, v); } catch (_) {}
      applyFilter(v);
    });
    // Escape clears the filter quickly.
    filter.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && filter.value) {
        filter.value = '';
        try { sessionStorage.removeItem(FILTER_KEY); } catch (_) {}
        applyFilter('');
      }
    });
  }

  // (3) Sidebar scroll restoration.
  const sidebar = document.querySelector('.app-sidebar');
  if (sidebar) {
    const saved = sessionStorage.getItem(SCROLL_KEY);
    if (saved !== null) {
      const px = parseInt(saved, 10);
      if (Number.isFinite(px)) sidebar.scrollTop = px;
    }
    sidebar.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        sessionStorage.setItem(SCROLL_KEY, String(sidebar.scrollTop));
      }
    });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        sessionStorage.setItem(SCROLL_KEY, String(sidebar.scrollTop));
      }
    });
  }
})();
