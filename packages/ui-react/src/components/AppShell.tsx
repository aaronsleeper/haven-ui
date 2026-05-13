import type { AppShellProps } from './AppShell.props';

export type { AppShellProps } from './AppShell.props';

// Mirror of packages/design-system/pattern-library/components/layout-app-shell-responsive.html.
// Non-agentic counterpart to AgenticShell. Generalizes the patient / clinical app
// layout across mobile and desktop with the same floating-shell envelope as the
// agentic shell.
//
// Structure:
//   .app-shell           — outer envelope (sand-200 ground, p-4)
//     .app-shell-frame   — inner floating shell (rounded-md, overflow-hidden, sand-50)
//       sidebar (≥lg)    — .app-shell-sidebar (sand-100 chrome, panel-nav-like)
//       .app-shell-main  — flex column: topbar | banner | content | bottomNav
//
// Landmarks: sidebar + bottom-nav both use <nav aria-label="Primary"> — same label
// across breakpoints because only one is in the AT tree at a time (CSS-gated).
// The content region is <main>; screens supply an <h1 class="page-title"> as the label.

export function AppShell({
  topBar,
  sidebar,
  bottomNav,
  banner,
  children,
}: AppShellProps) {
  return (
    <div className="app-shell">
      <div className="app-shell-frame">
        {sidebar && (
          <nav className="app-shell-sidebar" aria-label="Primary">
            {sidebar}
          </nav>
        )}
        <div className="app-shell-main">
          {topBar !== null && topBar !== undefined && (
            <header className="app-shell-topbar">{topBar}</header>
          )}
          {banner}
          <main className="app-shell-content">{children}</main>
          {bottomNav && <div className="app-shell-bottom-nav">{bottomNav}</div>}
        </div>
      </div>
    </div>
  );
}
