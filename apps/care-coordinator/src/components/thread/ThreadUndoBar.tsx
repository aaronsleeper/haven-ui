import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

// Inline composition per cc-02 wireframe + Option-2 decision in slice plan.
// The Toast PL is dismiss-only + global top-right positioning; the wireframe
// specifies a panel-bottom undo affordance with countdown — materially
// simpler shape, single use. Narrow inline carve-out per the new tier rules.
// Promote to a ToastWithAction PL extension when a second consumer needs it.
//
// Document-level portal (Gate 2-review #2): the toast must escape the
// `<aside>` so panel overflow / clip-path doesn't hide it. Rendered into
// document.body via ReactDOM.createPortal.

export interface ThreadUndoBarProps {
  /** Message rendered next to Undo (e.g., "Approved."). */
  message: string;
  /**
   * Action label (e.g., "Undo"). Omit (or empty) to render without an action
   * button — used for non-undoable confirmations like "Rejected." per cc-02
   * wireframe (rejection has no undo).
   */
  actionLabel?: string;
  /** Click handler for the action. Required when actionLabel is set. */
  onAction?: () => void;
  /** Auto-dismiss handler — fires when the countdown reaches zero. */
  onDismiss: () => void;
  /** Countdown duration in ms. Default 5000. */
  durationMs?: number;
}

export function ThreadUndoBar({
  message,
  actionLabel,
  onAction,
  onDismiss,
  durationMs = 5000,
}: ThreadUndoBarProps) {
  const [remaining, setRemaining] = useState(durationMs);

  useEffect(() => {
    const startedAt = Date.now();
    const tick = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const next = Math.max(0, durationMs - elapsed);
      setRemaining(next);
      if (next === 0) {
        window.clearInterval(tick);
        onDismiss();
      }
    }, 100);
    return () => window.clearInterval(tick);
  }, [durationMs, onDismiss]);

  const pct = Math.round((remaining / durationMs) * 100);

  // toast-container = bottom-right viewport positioning (PL canonical).
  // role="status" + aria-live="assertive": SR announces approval immediately
  // without breaking input focus (per Gate 2-review #2 + accessibility).
  // The width-percent inline style is the data-driven countdown progress
  // bar — analogous to the Chart.js inline-style carve-out in CLAUDE.md.
  const bar = (
    <div
      className="toast-container"
      role="status"
      aria-live="assertive"
    >
      <div className="pointer-events-auto border border-sand-200 dark:border-sand-700 bg-white dark:bg-sand-900 rounded-lg shadow-lg px-3 py-2 flex items-center gap-3 relative overflow-hidden min-w-[280px]">
        <span className="text-sm text-sand-900 dark:text-sand-100 flex-1">{message}</span>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="btn-outline btn-sm"
          >
            {actionLabel}
          </button>
        )}
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-[2px] bg-primary-500 transition-[width] duration-100 ease-linear"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );

  return ReactDOM.createPortal(bar, document.body);
}
