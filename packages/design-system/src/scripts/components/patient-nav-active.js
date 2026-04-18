/**
 * patient-nav-active.js
 * Sets the active tab on the patient app bottom nav based on the current URL.
 * Must be loaded after the bottom nav partial is injected (i.e., before </body>).
 */
(function () {
  const path = window.location.pathname;

  const tabMap = [
    { tab: 'home',       pattern: /\/apps\/patient\/index\.html/ },
    { tab: 'meals',      pattern: /\/apps\/patient\/meals\// },
    { tab: 'deliveries', pattern: /\/apps\/patient\/deliveries\// },
    { tab: 'care-team',  pattern: /\/apps\/patient\/care-team\// },
    { tab: 'profile',    pattern: /\/apps\/patient\/profile\// },
  ];

  const match = tabMap.find(({ pattern }) => pattern.test(path));
  if (!match) return;

  const tab = document.querySelector(`[data-nav-tab="${match.tab}"]`);
  if (!tab) return;

  tab.classList.add('active');
  tab.setAttribute('aria-current', 'page');
})();