import type { ReactNode } from 'react';

// Mirror of packages/design-system/pattern-library/components/queue-sidebar.html
// The <aside> landmark that holds the coordinator's queue.

export interface QueueSidebarProps {
  children: ReactNode;
  /** Override the default aria-label if multiple queue sidebars may appear. */
  label?: string;
  className?: string;
}

export function QueueSidebar({
  children,
  label = 'Queue sidebar',
  className = '',
}: QueueSidebarProps) {
  const classes = ['queue-sidebar', className].filter(Boolean).join(' ');
  return (
    <aside className={classes} aria-label={label}>
      {children}
    </aside>
  );
}
