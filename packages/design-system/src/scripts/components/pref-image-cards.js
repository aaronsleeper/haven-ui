/**
 * pref-image-cards.js — Food preference image card selection
 * Enforces mutual exclusivity between "No preference" and cuisine options.
 * Include on ONB-03 and PROFILE-01.
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var noPref = document.getElementById('pref-none');
    var otherPrefs = document.querySelectorAll('input[name="food-pref"]:not(#pref-none)');

    if (!noPref) return;

    noPref.addEventListener('change', function () {
      if (this.checked) {
        otherPrefs.forEach(function (cb) { cb.checked = false; });
      }
    });

    otherPrefs.forEach(function (cb) {
      cb.addEventListener('change', function () {
        if (this.checked) { noPref.checked = false; }
      });
    });
  });
})();
