import type { ReactNode } from 'react';

// Mirror of the empty-state body block in
// packages/design-system/pattern-library/components/thread-panel.html

export interface ThreadPanelEmptyProps {
  children: ReactNode;
  className?: string;
}

export function ThreadPanelEmpty({ children, className = '' }: ThreadPanelEmptyProps) {
  const bodyClasses = ['thread-panel-body', 'thread-panel-empty', className]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={bodyClasses}>
      <p>{children}</p>
    </div>
  );
}
