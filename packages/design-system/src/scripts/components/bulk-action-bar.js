/**
 * Bulk Action Bar — contextual selection-mode action bar for dense tables.
 *
 * Wires a .bulk-action-bar to a set of row checkboxes: maintains the selection
 * count, toggles the bar's visibility (hidden at zero selection), debounces the
 * screen-reader count announcement, and manages focus when the bar disappears
 * (the WCAG 2.4.3 gap the 4-expert panel flagged — when "Clear" removes the bar,
 * focus must land somewhere deterministic, not drop to <body>).
 *
 * Framework-agnostic vanilla ES module. Drop-in usable in vanilla HTML;
 * convertible to Angular/React by reading the contract below.
 *
 * Usage:
 *   <table>
 *     <thead><tr><th><input type="checkbox" data-bulk-select-all aria-label="Select all"></th>…</tr></thead>
 *     <tbody>
 *       <tr><td><input type="checkbox" data-bulk-row aria-label="Select Maria Santos"></td>…</tr>
 *       …
 *     </tbody>
 *   </table>
 *
 *   <div class="bulk-action-bar" role="region" aria-label="Bulk actions"
 *        data-bulk-action-bar data-bulk-scope="patients-roster" hidden>
 *     <div class="bulk-action-bar-info">
 *       <span><span class="bulk-action-bar-count" data-bulk-action-bar-count>0</span> selected</span>
 *       <span class="sr-only" data-bulk-action-bar-announce aria-live="polite" aria-atomic="true"></span>
 *       <button type="button" class="btn-ghost btn-sm" data-bulk-action-bar-clear>Clear</button>
 *     </div>
 *     <div class="bulk-action-bar-actions">…bulk action buttons (a SLOT — verbs vary per surface)…</div>
 *   </div>
 *
 * Wiring:
 *   data-bulk-scope on the bar + a matching data-bulk-scope on the table (or
 *   wrapping container) pairs them. If omitted, the bar binds to the nearest
 *   ancestor that contains [data-bulk-row] checkboxes, falling back to document.
 *   Row checkboxes carry [data-bulk-row]; the optional header "select all"
 *   carries [data-bulk-select-all].
 *
 * Events:
 *   The bar dispatches a 'bulk-selection-change' CustomEvent (bubbles) whenever
 *   the selection count changes:
 *     barEl.addEventListener('bulk-selection-change', (e) => {
 *       e.detail.count;        // number selected
 *       e.detail.total;        // number of row checkboxes
 *       e.detail.checkboxes;   // array of the checked row checkbox elements
 *     });
 *
 * Programmatic control:
 *   barEl._bulkActionBar.clear()       — deselect all rows, hide the bar
 *   barEl._bulkActionBar.getCount()    — current selection count
 *
 * Accessibility:
 *   - Bar visibility is the native `hidden` attribute (components.css defines
 *     .bulk-action-bar[hidden]{display:none} so it beats the @apply flex).
 *   - [data-bulk-action-bar-announce] is an sr-only polite atomic live region;
 *     the count announcement is debounced 400ms so a select-all that toggles
 *     hundreds of rows announces the settled count once, not per row (the
 *     chatty-announcement rule).
 *   - On Clear (which removes the bar from the tab flow), focus is moved to the
 *     select-all checkbox if present, else the first row checkbox, else the
 *     table — never dropped to <body>.
 *   - select-all reflects indeterminate state when some-but-not-all rows are
 *     checked.
 */
(function () {
  var ANNOUNCE_DEBOUNCE_MS = 400;

  document.querySelectorAll('[data-bulk-action-bar]').forEach(function (bar) {
    var scope = bar.getAttribute('data-bulk-scope');
    var root;
    if (scope) {
      root = document.querySelector('[data-bulk-scope="' + scope + '"]:not([data-bulk-action-bar])');
    }
    if (!root) {
      // nearest ancestor holding row checkboxes, else document
      var anc = bar.parentElement;
      while (anc && !anc.querySelector('[data-bulk-row]')) anc = anc.parentElement;
      root = anc || document;
    }

    var rows = function () { return Array.prototype.slice.call(root.querySelectorAll('[data-bulk-row]')); };
    var selectAll = root.querySelector('[data-bulk-select-all]');
    var countCell = bar.querySelector('[data-bulk-action-bar-count]');
    var announceCell = bar.querySelector('[data-bulk-action-bar-announce]');
    var clearBtn = bar.querySelector('[data-bulk-action-bar-clear]');

    var announceTimer = null;

    function checked() { return rows().filter(function (cb) { return cb.checked; }); }

    function announce(count) {
      if (!announceCell) return;
      if (announceTimer) clearTimeout(announceTimer);
      announceTimer = setTimeout(function () {
        announceCell.textContent = '';
        setTimeout(function () {
          announceCell.textContent = count + ' selected';
        }, 10);
      }, ANNOUNCE_DEBOUNCE_MS);
    }

    function render(opts) {
      var all = rows();
      var sel = checked();
      var count = sel.length;

      if (countCell) countCell.textContent = String(count);
      bar.hidden = count === 0;

      if (selectAll) {
        selectAll.checked = count > 0 && count === all.length;
        selectAll.indeterminate = count > 0 && count < all.length;
      }

      announce(count);
      bar.dispatchEvent(new CustomEvent('bulk-selection-change', {
        bubbles: true,
        detail: { count: count, total: all.length, checkboxes: sel }
      }));
    }

    function clear(moveFocus) {
      rows().forEach(function (cb) { cb.checked = false; });
      render();
      if (moveFocus) {
        var target = selectAll || rows()[0] || root;
        if (target && typeof target.focus === 'function') target.focus();
      }
    }

    rows().forEach(function (cb) {
      cb.addEventListener('change', function () { render(); });
    });

    if (selectAll) {
      selectAll.addEventListener('change', function () {
        var on = selectAll.checked;
        rows().forEach(function (cb) { cb.checked = on; });
        render();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', function () { clear(true); });
    }

    Object.defineProperty(bar, '_bulkActionBar', {
      value: { clear: function () { clear(false); }, getCount: function () { return checked().length; } },
      enumerable: false,
      writable: false
    });

    render();
  });
})();
