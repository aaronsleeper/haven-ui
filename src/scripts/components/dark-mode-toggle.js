(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.getElementById('dark-mode-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', function () {
      var html = document.documentElement;
      var isDark = html.classList.toggle('dark');
      toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    });
  });
})();
