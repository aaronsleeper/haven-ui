import type { ReactNode } from 'react';

// Mirror of the <div class="queue-sidebar-body"> block in
// packages/design-system/pattern-library/components/queue-sidebar.html

export interface QueueSidebarBodyProps {
  children: ReactNode;
  className?: string;
}

export function QueueSidebarBody({ children, className = '' }: QueueSidebarBodyProps) {
  const classes = ['queue-sidebar-body', className].filter(Boolean).join(' ');
  return <div className={classes}>{children}</div>;
}
