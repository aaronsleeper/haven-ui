import { useEffect } from 'react';
import type { MobileShellProps } from './MobileShell.props';

export type { MobileShellProps } from './MobileShell.props';

// Mirror of packages/design-system/pattern-library/components/layout-mobile-shell.html.
// Inner centering wrapper — constrains content to mobile width (max 430px).
// Also applies the .mobile-app body class as a side effect at mount so the
// PL's two-part contract (body class + inner wrapper) is honored from a single
// React component. Removes the class on unmount so navigating back to a non-
// mobile shell (desktop app composition) cleans up.
//
// Companion utilities `.pb-safe-4` and `.pb-safe-8` (in components.css) provide
// bottom padding that clears the iOS home indicator via
// `max(visual-floor, env(safe-area-inset-bottom))`. Compose them on sticky
// footers and page-end containers inside the shell.

export function MobileShell({ children }: MobileShellProps) {
  useEffect(() => {
    document.body.classList.add('mobile-app');
    return () => {
      document.body.classList.remove('mobile-app');
    };
  }, []);

  return <div className="mobile-shell">{children}</div>;
}
