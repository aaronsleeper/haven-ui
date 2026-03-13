/**
 * Meals screen — state management, confirm, and swap interactions
 * Used by: apps/patient/meals/index.html
 */

document.addEventListener('DOMContentLoaded', function () {

  // --- State from URL ---
  var params = new URLSearchParams(window.location.search);
  var state = params.get('state'); // 'confirmed' | null
  if (state) document.body.classList.add('state-' + state);

  // --- Confirm button ---
  var btnConfirm = document.getElementById('btn-confirm-meals');
  if (btnConfirm) {
    btnConfirm.addEventListener('click', function () {
      document.body.classList.add('state-confirmed');
      history.replaceState(null, '', '?state=confirmed');
    });
  }

  // --- Swap interaction: track active meal ---
  document.querySelectorAll('.meal-card-swap').forEach(function (btn) {
    btn.addEventListener('click', function () {
      window._activeMealSlug = btn.dataset.meal;
    });
  });

  // --- Swap option selection ---
  document.querySelectorAll('.swap-option').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var slug = window._activeMealSlug;
      if (!slug) return;

      var swapBtn = document.querySelector('.meal-card-swap[data-meal="' + slug + '"]');
      var targetCard = swapBtn ? swapBtn.closest('.meal-card') : null;

      if (targetCard) {
        targetCard.classList.add('is-swapped');
        var nameEl = targetCard.querySelector('.meal-card-name');
        if (nameEl) nameEl.textContent = btn.dataset.mealName;
        var img = targetCard.querySelector('.meal-card-img img');
        if (img) img.src = btn.dataset.mealImg;
      }

      if (window.HSOverlay) HSOverlay.close('#sheet-swap');
    });
  });

});
