import type { ReactNode } from 'react';

// Mirror of packages/design-system/pattern-library/components/thread-panel.html
// Right rail of the three-panel app shell. Landmark `<aside aria-label>`.
// Slice 2 hosts only the empty-state placeholder; slice 3 adds message
// types and the input field.

export interface ThreadPanelProps {
  children: ReactNode;
  /** Override the default landmark label. */
  label?: string;
  className?: string;
}

export function ThreadPanel({
  children,
  label = 'Activity thread',
  className = '',
}: ThreadPanelProps) {
  const classes = ['thread-panel', className].filter(Boolean).join(' ');
  return (
    <aside className={classes} aria-label={label}>
      {children}
    </aside>
  );
}
