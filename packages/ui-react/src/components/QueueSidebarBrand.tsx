import type { ReactNode } from 'react';

// Mirror of the <header class="queue-sidebar-brand"> block in
// packages/design-system/pattern-library/components/queue-sidebar.html

export interface QueueSidebarBrandProps {
  /** FontAwesome icon class after "fa-solid", e.g. "fa-circle-nodes". */
  icon?: string;
  children: ReactNode;
  className?: string;
}

export function QueueSidebarBrand({
  icon = 'fa-circle-nodes',
  children,
  className = '',
}: QueueSidebarBrandProps) {
  const classes = ['queue-sidebar-brand', className].filter(Boolean).join(' ');
  return (
    <header className={classes}>
      <i className={`fa-solid ${icon}`} aria-hidden="true"></i>
      <span>{children}</span>
    </header>
  );
}
