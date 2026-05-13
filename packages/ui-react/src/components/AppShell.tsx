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
// Landmarks: sidebar + bottom-nav both use <nav aria-label="Primary"> — same label
// across breakpoints because only one is in the AT tree at a time (CSS-gated). The
// content region is <main>; screens supply an <h1 class="page-title"> as the label.
// Breakpoint switching is pure CSS via Tailwind lg: variants.

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
        <nav className="app-shell-sidebar" aria-label="Primary">
          {sidebar}
        </nav>
      )}
      <div className="app-shell-main">
        {topBar !== null && <header className="app-shell-topbar">{topBar}</header>}
        {banner}
        <main className="app-shell-content">{children}</main>
        {bottomNav && <div className="app-shell-bottom-nav">{bottomNav}</div>}
      </div>
    </div>
  );
}
