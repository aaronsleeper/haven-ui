/**
 * Panel Splitter — drag-to-resize handles between panels.
 *
 * Usage:
 *   <div class="panel-splitter" data-panel-splitter data-target="previous"
 *        data-min="180" data-max="400" role="separator" aria-orientation="vertical"
 *        tabindex="0"></div>
 *
 * Attributes:
 *   data-target   "previous" (default) or "next" — which sibling panel to resize
 *   data-min      minimum width in px (default: 120)
 *   data-max      maximum width in px (default: 600)
 *   data-step     keyboard increment in px (default: 16)
 */
(function () {
  var STEP_DEFAULT = 16;

  document.querySelectorAll('[data-panel-splitter]').forEach(function (splitter) {
    var target = splitter.getAttribute('data-target') || 'previous';
    var min = parseInt(splitter.getAttribute('data-min'), 10) || 120;
    var max = parseInt(splitter.getAttribute('data-max'), 10) || 600;
    var step = parseInt(splitter.getAttribute('data-step'), 10) || STEP_DEFAULT;

    var panel = target === 'next'
      ? splitter.nextElementSibling
      : splitter.previousElementSibling;

    if (!panel) return;

    var startX, startWidth;

    function applyWidth(newWidth) {
      var clamped = Math.min(max, Math.max(min, newWidth));
      panel.style.width = clamped + 'px';
      panel.style.minWidth = clamped + 'px';
      panel.style.maxWidth = clamped + 'px';
    }

    function onMouseDown(e) {
      e.preventDefault();
      startX = e.clientX;
      startWidth = panel.getBoundingClientRect().width;
      splitter.classList.add('is-dragging');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    function onMouseMove(e) {
      var delta = target === 'next'
        ? startX - e.clientX
        : e.clientX - startX;
      applyWidth(startWidth + delta);
    }

    function onMouseUp() {
      splitter.classList.remove('is-dragging');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    function onKeyDown(e) {
      // Arrow keys: ArrowLeft / ArrowRight resize by `step` (default 16px).
      // For target="next" the convention is reversed so right-arrow always
      // grows the controlled panel.
      var delta = 0;
      if (e.key === 'ArrowLeft') delta = target === 'next' ? step : -step;
      else if (e.key === 'ArrowRight') delta = target === 'next' ? -step : step;
      else return;
      e.preventDefault();
      var current = panel.getBoundingClientRect().width;
      applyWidth(current + delta);
    }

    splitter.addEventListener('mousedown', onMouseDown);
    splitter.addEventListener('keydown', onKeyDown);
  });
})();
