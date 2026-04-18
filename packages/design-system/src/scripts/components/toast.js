/**
 * Haven Toast — transient notification system
 *
 * API:
 *   HavenToast.show({ variant, title, description, duration, progress })
 *   HavenToast.dismiss(toastEl)
 *
 * Parameters:
 *   variant     — 'success' | 'warning' | 'error' | 'info' (default: none / neutral)
 *   title       — required string
 *   description — optional string
 *   duration    — auto-dismiss in ms (0 = manual dismiss only, default: 0)
 *   progress    — show countdown bar (default: true when duration > 0)
 */
(function () {
  'use strict';

  var ICONS = {
    success: 'fa-circle-check',
    warning: 'fa-triangle-exclamation',
    error: 'fa-circle-xmark',
    info: 'fa-circle-info'
  };

  function getContainer() {
    var container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'false');
      document.body.appendChild(container);
    }
    return container;
  }

  function dismiss(toastEl) {
    if (!toastEl || toastEl.classList.contains('toast-exiting')) return;
    toastEl.classList.add('toast-exiting');
    toastEl.addEventListener('animationend', function () {
      toastEl.remove();
    }, { once: true });
  }

  function show(opts) {
    opts = opts || {};
    var variant = opts.variant || '';
    var title = opts.title || 'Notification';
    var description = opts.description || '';
    var duration = typeof opts.duration === 'number' ? opts.duration : 0;
    var showProgress = typeof opts.progress === 'boolean' ? opts.progress : duration > 0;

    var toast = document.createElement('div');
    toast.className = 'toast' + (variant ? ' toast-' + variant : '');
    toast.setAttribute('role', 'status');

    // Icon
    if (variant && ICONS[variant]) {
      var iconWrap = document.createElement('div');
      iconWrap.className = 'toast-icon';
      var icon = document.createElement('i');
      icon.className = 'fa-solid ' + ICONS[variant];
      iconWrap.appendChild(icon);
      toast.appendChild(iconWrap);
    }

    // Content
    var content = document.createElement('div');
    content.className = 'toast-content';

    var titleEl = document.createElement('div');
    titleEl.className = 'toast-title';
    titleEl.textContent = title;
    content.appendChild(titleEl);

    if (description) {
      var descEl = document.createElement('div');
      descEl.className = 'toast-description';
      descEl.textContent = description;
      content.appendChild(descEl);
    }

    toast.appendChild(content);

    // Dismiss button
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'toast-dismiss';
    btn.setAttribute('aria-label', 'Dismiss');
    btn.innerHTML = '<i class="fa-solid fa-xmark text-xs"></i>';
    btn.addEventListener('click', function () {
      clearTimeout(timer);
      dismiss(toast);
    });
    toast.appendChild(btn);

    // Progress bar
    if (showProgress && duration > 0) {
      var progress = document.createElement('div');
      progress.className = 'toast-progress';
      progress.style.setProperty('--toast-duration', duration + 'ms');
      toast.appendChild(progress);
    }

    // Insert into container
    getContainer().appendChild(toast);

    // Auto-dismiss
    var timer = null;
    if (duration > 0) {
      timer = setTimeout(function () {
        dismiss(toast);
      }, duration);
    }

    return toast;
  }

  // Static dismiss on click for pre-rendered toasts
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.toast-dismiss');
    if (btn) {
      var toast = btn.closest('.toast');
      if (toast) dismiss(toast);
    }
  });

  // Export
  window.HavenToast = {
    show: show,
    dismiss: dismiss
  };
})();
