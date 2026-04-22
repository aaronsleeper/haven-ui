/**
 * Command Palette — keyboard-driven search/action launcher
 *
 * Open:   Cmd+K (Mac) / Ctrl+K (Windows/Linux), or click a [data-cmd-palette-trigger] button
 * Close:  Escape, click backdrop, or Cmd+K again
 * Nav:    Arrow Up/Down to move, Enter to select
 * Filter: Type to filter items by title text
 */
(function () {
  'use strict';

  /* ── Helpers ─────────────────────────────────────── */

  function getItems(palette) {
    return Array.from(palette.querySelectorAll('[data-cmd-item]'));
  }

  function getGroups(palette) {
    return Array.from(palette.querySelectorAll('[data-cmd-group]'));
  }

  function setActive(items, index) {
    items.forEach(function (item, i) {
      item.classList.toggle('is-active', i === index);
      if (i === index) {
        item.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  /* ── Open / Close ─────────────────────────────────── */

  function openPalette(palette) {
    palette.style.display = '';
    var input = palette.querySelector('[data-cmd-palette-input]');
    if (input) {
      input.value = '';
      input.dispatchEvent(new Event('input'));
      requestAnimationFrame(function () { input.focus(); });
    }
    // Reset active state to first visible item
    var items = getVisibleItems(palette);
    if (items.length) setActive(items, 0);
    document.body.style.overflow = 'hidden';
  }

  function closePalette(palette) {
    palette.style.display = 'none';
    document.body.style.overflow = '';
  }

  function isOpen(palette) {
    return palette.style.display !== 'none';
  }

  /* ── Filtering ────────────────────────────────────── */

  function getVisibleItems(palette) {
    return Array.from(palette.querySelectorAll('[data-cmd-item]'))
      .filter(function (item) { return item.style.display !== 'none'; });
  }

  function filterItems(palette, query) {
    var q = query.toLowerCase().trim();
    var groups = getGroups(palette);
    var emptyEl = palette.querySelector('.cmd-palette-empty');

    var totalVisible = 0;

    groups.forEach(function (group) {
      var items = Array.from(group.querySelectorAll('[data-cmd-item]'));
      var groupVisible = 0;

      items.forEach(function (item) {
        var titleEl = item.querySelector('.cmd-palette-item-title');
        var descEl = item.querySelector('.cmd-palette-item-description');
        var text = (titleEl ? titleEl.textContent : '') + ' ' + (descEl ? descEl.textContent : '');
        var matches = !q || text.toLowerCase().indexOf(q) !== -1;
        item.style.display = matches ? '' : 'none';
        if (matches) groupVisible++;
      });

      // Hide group heading if no items match
      group.style.display = groupVisible ? '' : 'none';
      totalVisible += groupVisible;
    });

    // Show/hide empty state
    if (emptyEl) {
      emptyEl.style.display = totalVisible === 0 ? '' : 'none';
    }

    // Reset active to first visible
    var visible = getVisibleItems(palette);
    if (visible.length) {
      setActive(visible, 0);
    }
  }

  /* ── Init each palette ────────────────────────────── */

  function initPalette(palette) {
    var input = palette.querySelector('[data-cmd-palette-input]');
    var backdrops = palette.querySelectorAll('[data-cmd-palette-close]');

    // Backdrop close
    backdrops.forEach(function (bd) {
      bd.addEventListener('click', function () { closePalette(palette); });
    });

    // Input filtering
    if (input) {
      input.addEventListener('input', function () {
        filterItems(palette, input.value);
      });
    }

    // Keyboard navigation inside palette
    palette.addEventListener('keydown', function (e) {
      var visible = getVisibleItems(palette);
      if (!visible.length) return;

      var currentIndex = visible.findIndex(function (item) { return item.classList.contains('is-active'); });

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        var next = currentIndex < visible.length - 1 ? currentIndex + 1 : 0;
        setActive(visible, next);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        var prev = currentIndex > 0 ? currentIndex - 1 : visible.length - 1;
        setActive(visible, prev);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (currentIndex >= 0 && visible[currentIndex]) {
          visible[currentIndex].click();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closePalette(palette);
      }
    });

    // Click on items
    getItems(palette).forEach(function (item) {
      item.addEventListener('click', function () {
        // In a real app, this would fire the action. For the demo, just close.
        closePalette(palette);
      });
    });

    // Hover sets active
    getItems(palette).forEach(function (item) {
      item.addEventListener('mouseenter', function () {
        var visible = getVisibleItems(palette);
        var idx = visible.indexOf(item);
        if (idx !== -1) setActive(visible, idx);
      });
    });
  }

  /* ── Trigger buttons ──────────────────────────────── */

  document.querySelectorAll('[data-cmd-palette-trigger]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-cmd-palette-trigger');
      var palette = document.getElementById(id);
      if (palette) {
        isOpen(palette) ? closePalette(palette) : openPalette(palette);
      }
    });
  });

  /* ── Global keyboard shortcut: Cmd+K / Ctrl+K ───── */

  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      // Open the first palette on the page (or toggle if already open)
      var palette = document.querySelector('.cmd-palette');
      if (palette) {
        isOpen(palette) ? closePalette(palette) : openPalette(palette);
      }
    }
  });

  /* ── Document-level Escape handler ─────────────────
     Patch 23 (2026-04-22): the palette-scoped keydown handler inside
     initPalette only fires when focus is inside the palette subtree. If focus
     drifts to <body> (user clicks backdrop area, or palette loses focus
     programmatically), Escape keydown bubbles on document, never reaches the
     palette listener, and the palette stays open. Document-level handler
     ensures Escape always closes whichever palette is open.
  ─────────────────────────────────────────────────── */

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var openPaletteEl = Array.from(document.querySelectorAll('.cmd-palette')).find(isOpen);
    if (openPaletteEl) {
      e.preventDefault();
      closePalette(openPaletteEl);
    }
  });

  /* ── Initialize all palettes on page ──────────────── */

  document.querySelectorAll('.cmd-palette').forEach(initPalette);

})();
