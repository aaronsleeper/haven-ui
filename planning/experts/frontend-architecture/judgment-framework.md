# Judgment Framework

## Core principle
**CSS-first, progressive enhancement, no layout shift.** Responsive behavior
should be implemented with Tailwind breakpoint classes wherever possible. JS
enters only when CSS genuinely cannot express the behavior.

## Decision trees

### Responsive approach: CSS vs JS

```
New responsive behavior needed
├─ Can it be expressed with Tailwind breakpoint visibility/sizing classes?
│  ├─ Yes → CSS-first (hidden/block, width classes with md:/lg: prefixes)
│  └─ No
│     ├─ Does it require swapping entire component trees? (e.g., bottom nav vs sidebar)
│     │  ├─ Yes → JS conditional render with useMediaQuery
│     │  │  └─ Wrap in Suspense boundary if lazy-loaded
│     │  └─ No → Can container queries handle it?
│     │     ├─ Yes → @container queries in Tailwind
│     │     └─ No → JS with useMediaQuery (justify in PR description)
```

### Component placement: @ava/ui vs app-local

```
New component being created
├─ Would it work unchanged in admin + provider + kitchen apps?
│  ├─ Yes → @ava/ui (packages/ui/)
│  │  └─ Does it exist in a similar form already? → Generalize existing
│  └─ No
│     ├─ Is it domain-specific to one app? → App-local (apps/admin/src/components/)
│     └─ Is it a variant of a @ava/ui component? → Extend via props/slots, keep in @ava/ui
```

### Component vs page

```
New UI logic being written
├─ Is it reused in multiple routes? → Component
├─ Is it independently testable? → Component
├─ Is it route-specific orchestration (data loading, layout assembly)? → Page
├─ Does it mix data fetching with presentation?
│  └─ Split: page handles data, component handles display
```

### Performance: lazy load or not

```
New module being added
├─ Is it a route-level page? → React.lazy + Suspense
├─ Is it a shared layout component (ThreePanelLayout, sidebar, nav)?
│  └─ Never lazy load — always in main bundle
├─ Is it a heavy third-party lib (chart, editor, map)?
│  └─ React.lazy with loading placeholder
├─ Is it a small utility component? → Bundle normally, not worth the waterfall
```

### Thread panel: render vs hide

```
Thread panel render decision
├─ Desktop (>=1280px)
│  ├─ Thread has content → Render full thread panel
│  └─ Thread empty → Render placeholder container (same width, "no thread" state)
│     └─ Rationale: prevents CLS, gives user consistent spatial model
├─ Tablet (768-1279px)
│  ├─ Thread has content → Overlay/drawer from right (user-triggered)
│  └─ Thread empty → No overlay, no space reserved
├─ Mobile (<768px)
│  └─ Thread is a navigation destination, not a panel — stacked full-screen view
```

## Worked example: making ThreePanelLayout responsive

Current state: fixed `w-60` sidebar, `flex-1` center, `w-[380px]` thread panel.
Zero breakpoints. Desktop-only.

Implementation plan:

1. **Mobile-first base classes** — sidebar hidden, thread hidden, center full-width
2. **md: breakpoint (768px)** — sidebar appears as icon rail (w-16), center adjusts,
   thread available as overlay (triggered by button, renders as fixed overlay)
3. **lg: breakpoint (1280px)** — sidebar expands to w-60, thread renders inline
   when threadOpen is true (current behavior)
4. **No JS viewport detection needed** — visibility handled entirely by
   `hidden md:block md:w-16 lg:w-60` pattern on sidebar, similar for thread
5. **Thread overlay on tablet** — only JS needed is click handler to toggle a
   `threadOverlayOpen` state that controls a fixed-position drawer. The drawer
   component uses `md:fixed md:right-0 md:w-[380px] lg:relative lg:w-[380px]`
6. **Mobile bottom nav** — this IS a different component tree (not just
   visibility toggle), so use JS conditional rendering for sidebar vs bottom nav
