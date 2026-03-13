document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('compose-input');
  const btnSend = document.getElementById('btn-send');

  if (!textarea || !btnSend) return;

  function updateSendButton() {
    btnSend.disabled = textarea.value.trim().length === 0;
  }

  function autoGrow() {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 96) + 'px';
    updateSendButton();
  }

  textarea.addEventListener('input', autoGrow);

  // Send: append bubble to thread, clear compose
  btnSend.addEventListener('click', () => {
    const text = textarea.value.trim();
    if (!text) return;

    const threadArea = document.getElementById('thread-area');
    const bubble = document.createElement('div');
    bubble.className = 'mb-4 flex flex-col items-end';
    bubble.innerHTML = `
      <div class="flex flex-col items-end gap-1">
        <div class="message-bubble-out">${text}</div>
        <span class="message-timestamp text-right">Just now</span>
      </div>
    `;

    // Insert before the new-message pill if it exists, otherwise append
    const pill = threadArea.querySelector('.message-new-pill');
    if (pill) {
      threadArea.insertBefore(bubble, pill);
    } else {
      threadArea.appendChild(bubble);
    }

    textarea.value = '';
    textarea.style.height = 'auto';
    updateSendButton();
    threadArea.scrollTop = threadArea.scrollHeight;
  });

  // Also send on Enter (not Shift+Enter)
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!btnSend.disabled) btnSend.click();
    }
  });
});
