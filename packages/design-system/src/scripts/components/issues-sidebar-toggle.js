/**
 * Issues Sidebar Toggle
 * Handles mobile show/hide for .issues-layout-aside
 */
(function () {
  const toggle = document.querySelector('[data-issues-toggle]');
  const aside = document.querySelector('.issues-layout-aside');
  const backdrop = document.querySelector('.issues-layout-backdrop');

  if (!toggle || !aside) return;

  function open() {
    aside.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
  }

  function close() {
    aside.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', function () {
    var isOpen = aside.classList.contains('open');
    isOpen ? close() : open();
  });

  if (backdrop) {
    backdrop.addEventListener('click', close);
  }

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && aside.classList.contains('open')) {
      close();
    }
  });
})();
