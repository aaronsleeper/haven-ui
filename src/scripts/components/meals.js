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

  // --- Custom bottom sheet for swap ---
  var sheet = document.getElementById('sheet-swap');
  var backdrop = document.getElementById('swap-backdrop');

  function openSwap() {
    sheet.classList.remove('translate-y-full');
    sheet.classList.add('translate-y-0');
    backdrop.classList.remove('opacity-0', 'pointer-events-none');
    backdrop.classList.add('opacity-100', 'pointer-events-auto');
  }

  function closeSwap() {
    sheet.classList.remove('translate-y-0');
    sheet.classList.add('translate-y-full');
    backdrop.classList.remove('opacity-100', 'pointer-events-auto');
    backdrop.classList.add('opacity-0', 'pointer-events-none');
  }

  // Open swap: buttons with [data-open-swap]
  document.querySelectorAll('[data-open-swap]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      window._activeMealSlug = btn.dataset.meal;
      openSwap();
    });
  });

  // Close swap: X button [data-close-swap] and backdrop tap
  document.querySelectorAll('[data-close-swap]').forEach(function (btn) {
    btn.addEventListener('click', closeSwap);
  });
  if (backdrop) {
    backdrop.addEventListener('click', closeSwap);
  }

  // --- Swap option selection ---
  document.querySelectorAll('.swap-option').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var slug = window._activeMealSlug;
      if (!slug) return;

      var swapBtn = document.querySelector('[data-open-swap][data-meal="' + slug + '"]');
      var targetCard = swapBtn ? swapBtn.closest('.meal-card') : null;

      if (targetCard) {
        targetCard.classList.add('is-swapped');
        var nameEl = targetCard.querySelector('.meal-card-name');
        if (nameEl) nameEl.textContent = btn.dataset.mealName;
        var img = targetCard.querySelector('.meal-card-img img');
        if (img) img.src = btn.dataset.mealImg;
      }

      closeSwap();
    });
  });

});
