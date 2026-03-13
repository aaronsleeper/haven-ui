/**
 * i18n.js — Patient App language toggle
 * Swaps data-i18n-en / data-i18n-es attributes on all text nodes.
 * Persists language choice in localStorage.
 * Include on all patient app screens.
 */
(function () {
  'use strict';

  var LANG_KEY = 'cena-lang';
  var DEFAULT_LANG = 'en';

  function applyLanguage(lang) {
    // Update html lang attribute
    document.documentElement.lang = lang;

    // Swap all bilingual text nodes
    document.querySelectorAll('[data-i18n-en]').forEach(function (el) {
      var text = lang === 'en' ? el.dataset.i18nEn : el.dataset.i18nEs;
      if (text !== undefined) el.textContent = text;
    });

    // Update toggle aria-label to name the language you WILL switch to
    var toggle = document.getElementById('lang-toggle');
    if (toggle) {
      toggle.setAttribute(
        'aria-label',
        lang === 'en' ? 'Switch to Spanish' : 'Switch to English'
      );
    }

    // Persist choice
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  }

  function init() {
    var saved;
    try { saved = localStorage.getItem(LANG_KEY); } catch (e) {}
    applyLanguage(saved || DEFAULT_LANG);

    var toggle = document.getElementById('lang-toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var current;
        try { current = localStorage.getItem(LANG_KEY); } catch (e) {}
        applyLanguage((current || DEFAULT_LANG) === 'en' ? 'es' : 'en');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
