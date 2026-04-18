# Domain Knowledge

## Responsive architecture — ThreePanelLayout

| Knowledge area | Value | Source | Shelf life |
|---|---|---|---|
| Desktop (>=1280px) | All 3 panels visible. Sidebar w-60, center flex-1, thread w-[380px]. Thread toggleable via threadOpen state | ThreePanelLayout.tsx | Until layout redesign |
| Tablet (768-1279px) | Sidebar collapses to icon-only rail (w-16) or hidden behind hamburger. Thread panel renders as overlay/drawer from right. Center panel gets full remaining width | `[ASSUMPTION]` UX Design Lead approval needed. Validates by: UX Design Lead review | Until validated |
| Mobile (<768px) | Single panel view. Bottom nav replaces sidebar. Queue list > detail > thread as stacked views with back navigation. No simultaneous panels | `[ASSUMPTION]` UX Design Lead approval needed. Validates by: UX Design Lead review | Until validated |
| Thread panel (desktop) | Always render container even when empty — show placeholder. Prevents layout shift when thread opens | Current: conditional render. Recommendation based on layout stability | Until UX review |
| Thread panel (tablet/mobile) | Collapse to overlay on tablet, full-screen stacked view on mobile. Dismiss via swipe or back button | `[ASSUMPTION]` Validates by: UX Design Lead review | Until validated |

## Tailwind v4 responsive implementation

| Knowledge area | Value | Source | Shelf life |
|---|---|---|---|
| Breakpoint classes | `md:` (768px), `lg:` (1280px) — use for layout shifts. Apply as `hidden lg:block` pattern | Tailwind v4 docs | Until Tailwind major version change |
| Container queries | `@container` for component-level responsive behavior independent of viewport. Use for components that appear in different layout contexts | Tailwind v4 docs | Until Tailwind major version change |
| CSS-first principle | Use Tailwind breakpoint classes (md:, lg:) for layout visibility. Avoid JS-based viewport detection (useMediaQuery) except for conditional rendering CSS cannot handle | Best practice | Permanent |
| Class ordering | Responsive: mobile-first base classes, then `md:` overrides, then `lg:` overrides. e.g., `hidden md:block lg:flex` | Tailwind convention | Permanent |

## State management patterns

| Knowledge area | Value | Source | Shelf life |
|---|---|---|---|
| Server state | tRPC queries — handles caching, invalidation, optimistic updates | Current codebase | Until data layer change |
| UI state (panel visibility) | React context for sidebar collapsed/expanded, thread open/closed | Current codebase pattern | Until state lib adoption |
| URL state | searchParams for filters, queue position, active item — enables deep linking and back button | Current codebase (already implemented) | Permanent pattern |
| Thread context | useThreadContext provides thread content + push mechanism. QueueItemDetail pushes messages. Thread panel reads | Current codebase | Until thread refactor |

## Build pipeline

| Knowledge area | Value | Source | Shelf life |
|---|---|---|---|
| @ava/ui change workflow | 1. Edit source in packages/ui/ 2. Run `npm run build` in packages/ui/ 3. Clear apps/admin/node_modules/.vite 4. Restart dev server | DX observation | Until Turborepo watch mode |
| Turborepo watch mode | Potential fix for @ava/ui DX pain: `turbo watch` auto-rebuilds dependent packages. Not yet configured | Turborepo docs | Until implemented |
| Vite cache | apps/admin uses Vite. Cache at node_modules/.vite must be cleared when @ava/ui build output changes | DX observation | Until Vite config change |

## Component architecture

| Knowledge area | Value | Source | Shelf life |
|---|---|---|---|
| @ava/ui scope | Components that work across admin + provider + kitchen apps. Layout primitives, form elements, data display | Package purpose | Permanent |
| App-local scope | Components specific to one app's domain. Queue-specific views, admin-only controls | Architecture pattern | Permanent |
| Route-level pages | Use React.lazy for code splitting. Pages are orchestration, not reusable | Performance pattern | Permanent |
| Layout components | Never lazy load. ThreePanelLayout, sidebar, nav — always in main bundle | Performance pattern | Permanent |

## Reference sources

| Source | Domain | Trust level | When to consult |
|---|---|---|---|
| Tailwind v4 docs | Utility classes, responsive, container queries | Authoritative | New responsive patterns |
| React Router docs | Routing, loaders, URL state | Authoritative | Navigation architecture |
| tRPC docs | Client setup, query patterns, subscriptions | Authoritative | Data fetching patterns |
| Turborepo docs | Monorepo orchestration, watch mode, caching | Authoritative | Build pipeline changes |
| web.dev Core Web Vitals | Performance budgets, LCP/FID/CLS targets | Authoritative | Performance optimization |

## Assumptions index

| # | Assumption | Basis | Validates by | Status |
|---|---|---|---|---|
| A1 | Tablet layout: sidebar collapses to icon rail | Common 3-panel responsive pattern | UX Design Lead review | unvalidated |
| A2 | Mobile layout: single panel with bottom nav | Queue-check-only use case implies minimal mobile UI | UX Design Lead review | unvalidated |
| A3 | Thread panel always renders container on desktop | Layout stability principle (no CLS) | UX Design Lead review | unvalidated |
| A4 | Turborepo watch mode resolves @ava/ui DX pain | Turborepo docs indicate watch support | Implementation test | unvalidated |
