/**
 * Feedback screen interactions
 * - Overall rating selection → issue section toggle
 * - Issue type button selection
 * - Per-meal rating selection
 * - Submit → confirmation state
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check for submitted state via URL param
  const params = new URLSearchParams(window.location.search);
  if (params.get('state') === 'submitted') {
    document.body.classList.add('state-submitted');
  }

  // Issue section toggle: show when "Not good" is selected
  document.querySelectorAll('input[name="overall-rating"]').forEach(input => {
    input.addEventListener('change', () => {
      const issueSection = document.querySelector('.feedback-issue-section');
      if (!issueSection) return;
      issueSection.style.display = input.value === 'not-good' ? '' : 'none';
    });
  });

  // Issue type button selection (single-select)
  document.querySelectorAll('.issue-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.issue-type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Per-meal rating selection (one per row)
  document.querySelectorAll('.meal-rating-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('.flex');
      row.querySelectorAll('.meal-rating-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Submit feedback
  document.getElementById('btn-submit-feedback')?.addEventListener('click', () => {
    document.body.classList.add('state-submitted');
    history.replaceState(null, '', '?state=submitted');
    window.scrollTo(0, 0);
  });
});
