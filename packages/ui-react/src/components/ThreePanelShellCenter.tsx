import type { ReactNode } from 'react';

// Mirror of the center <main> slot in
// packages/design-system/pattern-library/components/three-panel-shell.html
//
// Renders as <main> with an aria-label so it's a named landmark region.

export interface ThreePanelShellCenterProps {
  children: ReactNode;
  /** Override the default landmark label. */
  label?: string;
  className?: string;
}

export function ThreePanelShellCenter({
  children,
  label = 'Main content',
  className = '',
}: ThreePanelShellCenterProps) {
  const classes = ['three-panel-shell-center', className].filter(Boolean).join(' ');
  return (
    <main className={classes} aria-label={label}>
      {children}
    </main>
  );
}
