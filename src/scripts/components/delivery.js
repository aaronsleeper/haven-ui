/**
 * Delivery screen — state management and issue card interaction
 */
document.addEventListener('DOMContentLoaded', () => {
  // URL-driven delivery state
  const params = new URLSearchParams(window.location.search);
  const state = params.get('state');
  if (state) document.body.classList.add(`state-${state}`);

  // Issue card three-state toggle
  const issueCard = document.getElementById('issue-card');
  const issueDefault = issueCard?.querySelector('.issue-default');
  const issueExpanded = issueCard?.querySelector('.issue-expanded');
  const issueSubmitted = issueCard?.querySelector('.issue-submitted');

  function showIssueState(state) {
    issueDefault.style.display = state === 'default' ? '' : 'none';
    issueExpanded.style.display = state === 'expanded' ? '' : 'none';
    issueSubmitted.style.display = state === 'submitted' ? '' : 'none';
  }

  document.getElementById('btn-report-issue')?.addEventListener('click', () => {
    showIssueState('expanded');
  });

  document.getElementById('btn-cancel-issue')?.addEventListener('click', () => {
    showIssueState('default');
  });

  document.getElementById('btn-submit-issue')?.addEventListener('click', () => {
    showIssueState('submitted');
  });

  // Issue type buttons — visual selected state
  document.querySelectorAll('.issue-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.issue-type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
});
