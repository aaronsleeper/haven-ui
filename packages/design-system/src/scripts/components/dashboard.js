/**
 * Dashboard screen
 * - Time-of-day greeting
 * - Hide confirm callout if meals already confirmed
 *   (reads localStorage key 'mealsConfirmed' set by meals.js)
 *
 * NOTE: localStorage usage is prototype-only. Production will use
 * server-side state via the Angular app.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Time-of-day greeting
  const greetingEl = document.getElementById('dashboard-time-greeting');
  if (greetingEl) {
    const hour = new Date().getHours();
    const isSpanish = document.documentElement.lang === 'es' ||
      document.querySelector('[data-i18n-es]');

    let en, es;
    if (hour < 12) {
      en = 'Good morning'; es = 'Buenos días';
    } else if (hour < 18) {
      en = 'Good afternoon'; es = 'Buenas tardes';
    } else {
      en = 'Good evening'; es = 'Buenas noches';
    }

    const span = greetingEl.querySelector('span[data-i18n-en]');
    if (span) {
      span.setAttribute('data-i18n-en', en);
      span.setAttribute('data-i18n-es', es);
      span.textContent = en;
    }
  }

  // Hide confirm callout if meals are confirmed
  const confirmed = localStorage.getItem('mealsConfirmed') === 'true';
  if (confirmed) {
    const callout = document.querySelector('.dashboard-confirm-callout');
    if (callout) callout.style.display = 'none';
  }
});
