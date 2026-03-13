/**
 * Profile screen interactions
 * - Save button: 2-second "Saved!" confirmation, then restore
 * - Sign out: redirect to onboarding welcome
 */

document.addEventListener('DOMContentLoaded', () => {
  // Save changes
  const saveBtn = document.getElementById('btn-save-profile');
  saveBtn?.addEventListener('click', () => {
    const originalHTML = saveBtn.innerHTML;
    const savedLabel = saveBtn.getAttribute('data-saved-label') || 'Saved!';
    saveBtn.textContent = savedLabel;
    saveBtn.disabled = true;
    setTimeout(() => {
      saveBtn.innerHTML = originalHTML;
      saveBtn.disabled = false;
    }, 2000);
  });

  // Sign out — click and keyboard
  const signOutBtn = document.querySelector('[aria-label="Sign out"]');
  signOutBtn?.addEventListener('click', () => {
    window.location.href = '/apps/patient/onboarding/welcome.html';
  });
  signOutBtn?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.location.href = '/apps/patient/onboarding/welcome.html';
    }
  });
});
