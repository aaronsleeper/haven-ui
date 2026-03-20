/**
 * Context Menu — haven-ui
 *
 * Usage:
 *   Trigger element:  data-ctx-menu="<menu-id>"
 *   Menu element:     id="<menu-id>" class="ctx-menu"
 *   Backdrop element: id="<menu-id>-backdrop" class="ctx-menu-backdrop"
 *
 * Opens on right-click (contextmenu) or long-press (400 ms) on the trigger.
 * Closes on click outside, Escape, or selecting an item.
 * Arrow keys navigate items; Enter activates.
 */

(function () {
  'use strict';

  const LONG_PRESS_MS = 400;
  let activeMenu = null;
  let activeBackdrop = null;
  let focusedIndex = -1;
  let longPressTimer = null;

  /* ---- helpers ---- */

  function getItems(menu) {
    return Array.from(menu.querySelectorAll('.ctx-menu-item:not(.disabled)'));
  }

  function open(menu, backdrop, x, y) {
    close(); // close any open menu first

    // Position at cursor
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    menu.classList.add('open');
    if (backdrop) backdrop.classList.add('open');

    activeMenu = menu;
    activeBackdrop = backdrop;
    focusedIndex = -1;

    // Reposition if overflowing viewport
    requestAnimationFrame(function () {
      var rect = menu.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        menu.style.left = Math.max(0, x - rect.width) + 'px';
      }
      if (rect.bottom > window.innerHeight) {
        menu.style.top = Math.max(0, y - rect.height) + 'px';
      }
    });
  }

  function close() {
    if (activeMenu) {
      activeMenu.classList.remove('open');
      activeMenu = null;
    }
    if (activeBackdrop) {
      activeBackdrop.classList.remove('open');
      activeBackdrop = null;
    }
    focusedIndex = -1;
  }

  function focusItem(menu, index) {
    var items = getItems(menu);
    if (!items.length) return;
    // Remove previous focus
    items.forEach(function (el) { el.classList.remove('bg-gray-100', 'dark:bg-neutral-800'); });
    focusedIndex = ((index % items.length) + items.length) % items.length;
    items[focusedIndex].focus();
  }

  /* ---- event handlers ---- */

  // Right-click on trigger
  document.addEventListener('contextmenu', function (e) {
    var trigger = e.target.closest('[data-ctx-menu]');
    if (!trigger) return;
    e.preventDefault();
    var menuId = trigger.getAttribute('data-ctx-menu');
    var menu = document.getElementById(menuId);
    var backdrop = document.getElementById(menuId + '-backdrop');
    if (menu) open(menu, backdrop, e.clientX, e.clientY);
  });

  // Long-press start (touch)
  document.addEventListener('touchstart', function (e) {
    var trigger = e.target.closest('[data-ctx-menu]');
    if (!trigger) return;
    var touch = e.touches[0];
    longPressTimer = setTimeout(function () {
      e.preventDefault();
      var menuId = trigger.getAttribute('data-ctx-menu');
      var menu = document.getElementById(menuId);
      var backdrop = document.getElementById(menuId + '-backdrop');
      if (menu) open(menu, backdrop, touch.clientX, touch.clientY);
    }, LONG_PRESS_MS);
  }, { passive: false });

  // Cancel long-press on move or end
  document.addEventListener('touchmove', function () { clearTimeout(longPressTimer); });
  document.addEventListener('touchend', function () { clearTimeout(longPressTimer); });

  // Close on backdrop click
  document.addEventListener('click', function (e) {
    if (e.target.closest('.ctx-menu-backdrop')) {
      close();
      return;
    }
    // Close if clicking an enabled item
    if (activeMenu && e.target.closest('.ctx-menu-item:not(.disabled)')) {
      close();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (!activeMenu) return;

    if (e.key === 'Escape') {
      close();
      e.preventDefault();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusItem(activeMenu, focusedIndex + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusItem(activeMenu, focusedIndex - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      var items = getItems(activeMenu);
      if (focusedIndex >= 0 && focusedIndex < items.length) {
        items[focusedIndex].click();
      }
    }
  });
})();
