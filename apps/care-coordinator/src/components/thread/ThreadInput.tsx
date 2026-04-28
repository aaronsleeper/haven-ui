import { useState } from 'react';

// Inline composition per cc-02 wireframe — narrow carve-out per the new tier
// rules in Lab/haven-ui/CLAUDE.md. The wireframe spec is materially simpler
// than the existing complex-prompt-input PL primitive (textarea + send only,
// no toolbar, no category chips). Promote to a PL fragment when a second app
// needs the same shape.
//
// 2026-04-28 (Patch E): outer wrapper styling moved to the parent (the
// agentic-shell `chat-input-area` now owns border-top + padding + bg).
// This component renders only the textarea + send controls.

export interface ThreadInputProps {
  onSend: (text: string) => void;
  /** Optional placeholder. */
  placeholder?: string;
  /** Disable input + send (e.g., during agent processing). */
  disabled?: boolean;
}

export function ThreadInput({
  onSend,
  placeholder = 'Type a message or ask the agent...',
  disabled = false,
}: ThreadInputProps) {
  const [value, setValue] = useState('');

  const send = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue('');
  };

  return (
    <div className="flex items-end gap-2">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            send();
          }
        }}
        rows={1}
        placeholder={placeholder}
        disabled={disabled}
        aria-label="Message to agent or care team"
        className="flex-1 text-sm resize-none border border-sand-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      />
      <button
        type="button"
        aria-label="Send message"
        className="btn-icon-primary"
        onClick={send}
        disabled={disabled || !value.trim()}
      >
        <i className="fa-solid fa-paper-plane" aria-hidden="true" />
      </button>
    </div>
  );
}
