/**
 * Panel Splitter — drag-to-resize handles between panels.
 *
 * Usage:
 *   <div class="panel-splitter" data-panel-splitter data-target="previous"
 *        data-min="180" data-max="400"></div>
 *
 * Attributes:
 *   data-target   "previous" (default) or "next" — which sibling panel to resize
 *   data-min      minimum width in px (default: 120)
 *   data-max      maximum width in px (default: 600)
 */
(function () {
  document.querySelectorAll('[data-panel-splitter]').forEach(function (splitter) {
    var target = splitter.getAttribute('data-target') || 'previous';
    var min = parseInt(splitter.getAttribute('data-min'), 10) || 120;
    var max = parseInt(splitter.getAttribute('data-max'), 10) || 600;

    var panel = target === 'next'
      ? splitter.nextElementSibling
      : splitter.previousElementSibling;

    if (!panel) return;

    var startX, startWidth;

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
      var newWidth = Math.min(max, Math.max(min, startWidth + delta));
      panel.style.width = newWidth + 'px';
      panel.style.minWidth = newWidth + 'px';
      panel.style.maxWidth = newWidth + 'px';
    }

    function onMouseUp() {
      splitter.classList.remove('is-dragging');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    splitter.addEventListener('mousedown', onMouseDown);
  });
})();
