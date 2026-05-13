import type { AppShellProps } from './AppShell.props';

export type { AppShellProps } from './AppShell.props';

// Mirror of packages/design-system/pattern-library/components/layout-app-shell-responsive.html.
// Non-agentic counterpart to AgenticShell. Generalizes the patient / clinical app
// layout across mobile and desktop.
//
// Layout:
//   <lg viewport:
//     ┌──────────────────────────┐
//     │ topbar (sticky)          │
//     ├──────────────────────────┤
//     │ banner (optional)        │
//     ├──────────────────────────┤
//     │ content (scrolls)        │
//     │                          │
//     ├──────────────────────────┤
//     │ bottom-nav (sticky)      │
//     └──────────────────────────┘
//
//   ≥lg viewport:
//     ┌──────────┬───────────────────────────┐
//     │ sidebar  │ topbar (sticky)           │
//     │ (fixed   ├───────────────────────────┤
//     │  width)  │ banner (optional)         │
//     │          ├───────────────────────────┤
//     │          │ content (scrolls)         │
//     │          │                           │
//     └──────────┴───────────────────────────┘
//
// Breakpoint switching is pure CSS via Tailwind lg: variants on the shell classes.
// Consumers don't need viewport awareness — pass both `sidebar` and `bottomNav`
// when nav is desired; the shell shows the correct one per viewport.

export function AppShell({
  topBar,
  sidebar,
  bottomNav,
  banner,
  children,
}: AppShellProps) {
  return (
    <div className="app-shell">
      {sidebar && (
        <aside className="app-shell-sidebar" aria-label="Main navigation">
          {sidebar}
        </aside>
      )}
      <div className="app-shell-main">
        {topBar !== null && <header className="app-shell-topbar">{topBar}</header>}
        {banner}
        <div className="app-shell-content">{children}</div>
        {bottomNav && <div className="app-shell-bottom-nav">{bottomNav}</div>}
      </div>
    </div>
  );
}
