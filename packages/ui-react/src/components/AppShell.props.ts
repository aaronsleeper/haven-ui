import type { ReactNode } from 'react';

// Props for AppShell. Mirror of
// packages/design-system/pattern-library/components/layout-app-shell-responsive.html.
//
// Five regions, each addressed by a top-level prop:
//   - topBar    : always-on top bar (i18n, brand). Pass `null` to suppress (full-screen
//                 stepper experiences like assessment).
//   - sidebar   : desktop nav (≥lg). Pass `undefined` / `null` to suppress (onboarding,
//                 assessment).
//   - bottomNav : mobile nav (<lg). Same conditions as sidebar — typically paired.
//   - children  : route content. The only mandatory child.
//   - banner    : optional banner rendered between topbar and content (offline, error).
//
// The shell handles breakpoint switching via CSS — sidebar shows ≥lg, bottom-nav shows
// <lg. Consumers don't need viewport awareness.

export interface AppShellProps {
  /** Top bar content. Persists across breakpoints. Pass null to suppress. */
  topBar: ReactNode | null;
  /** Desktop sidebar nav (≥lg). Optional — omit for full-screen pages. */
  sidebar?: ReactNode;
  /** Mobile bottom nav (<lg). Optional — typically paired with sidebar. */
  bottomNav?: ReactNode;
  /** Optional banner rendered between topbar and content (e.g., OfflineBanner). */
  banner?: ReactNode;
  /** Route content. Renders inside the scrollable content area. */
  children: ReactNode;
}
