/**
 * Notification Center — dismiss + mark-all-read interactions
 *
 * Usage:
 *   data-notif-dismiss   on the dismiss button inside a .notif-item
 *   data-notif-mark-all  on the "Mark all read" button
 *   data-notif-tab       on tab buttons ("all" | "unread") for filtering
 */
(function () {
  document.addEventListener('click', function (e) {
    // --- Dismiss single notification ---
    const dismissBtn = e.target.closest('[data-notif-dismiss]');
    if (dismissBtn) {
      const item = dismissBtn.closest('.notif-item');
      if (!item) return;
      item.style.transition = 'opacity 0.2s ease, max-height 0.25s ease';
      item.style.opacity = '0';
      item.style.maxHeight = item.scrollHeight + 'px';
      requestAnimationFrame(function () {
        item.style.maxHeight = '0';
        item.style.overflow = 'hidden';
        item.style.paddingTop = '0';
        item.style.paddingBottom = '0';
      });
      item.addEventListener('transitionend', function handler(ev) {
        if (ev.propertyName === 'max-height' || ev.propertyName === 'opacity') {
          item.removeEventListener('transitionend', handler);
          item.remove();
          updateCounts(item.closest('.notif-center') || document);
        }
      });
      // Fallback removal
      setTimeout(function () { if (item.parentNode) item.remove(); }, 500);
      e.stopPropagation();
      return;
    }

    // --- Mark all read ---
    const markAllBtn = e.target.closest('[data-notif-mark-all]');
    if (markAllBtn) {
      const center = markAllBtn.closest('.notif-center');
      if (!center) return;
      center.querySelectorAll('.notif-item-unread').forEach(function (item) {
        item.classList.remove('notif-item-unread');
      });
      updateCounts(center);
      e.stopPropagation();
      return;
    }

    // --- Tab switching ---
    const tabBtn = e.target.closest('[data-notif-tab]');
    if (tabBtn) {
      var center = tabBtn.closest('.notif-center');
      if (!center) return;
      var tabVal = tabBtn.getAttribute('data-notif-tab');

      // Update active tab
      center.querySelectorAll('.notif-center-tab').forEach(function (t) {
        t.classList.toggle('active', t === tabBtn);
      });

      // Filter items
      var items = center.querySelectorAll('.notif-item');
      items.forEach(function (item) {
        if (tabVal === 'unread') {
          item.style.display = item.classList.contains('notif-item-unread') ? '' : 'none';
        } else {
          item.style.display = '';
        }
      });

      // Hide/show group labels if all items in that group are hidden
      center.querySelectorAll('.notif-group-label').forEach(function (label) {
        var next = label.nextElementSibling;
        var hasVisible = false;
        while (next && !next.classList.contains('notif-group-label')) {
          if (next.classList.contains('notif-item') && next.style.display !== 'none') {
            hasVisible = true;
          }
          next = next.nextElementSibling;
        }
        label.style.display = hasVisible ? '' : 'none';
      });

      e.stopPropagation();
      return;
    }
  });

  function updateCounts(scope) {
    var unreadCount = scope.querySelectorAll('.notif-item-unread').length;
    scope.querySelectorAll('.notif-center-count').forEach(function (el) {
      if (unreadCount > 0) {
        el.textContent = unreadCount;
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
    });
  }
})();
