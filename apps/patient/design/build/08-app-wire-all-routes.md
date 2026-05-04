# Task 08: App.tsx — Wire All 5 Routes + Shell

## Scope
App only (composing; no new semantic classes)

## Task class
deterministic

## Model tier
sonnet

## Context
The existing `App.tsx` has a minimal landing page and routes only to `/assessment/gad-7/*` and `/assessment/phq-9/*`. This task rewires it to include all 5 new route screens (Dashboard, Messages, Settings, MyHealth, Care) plus the persistent shell components (I18nBar, BottomNav) wrapping every route. The assessment flows remain intact — do not touch them.

## Prerequisites
- Task 01 complete (I18nBar, BottomNav components)
- Task 02 complete (useLanguage hook)
- Tasks 03–07 complete (all 5 route screens)

## Files to Read First
- `apps/patient/src/App.tsx` — MUST read current state before editing
- `apps/patient/src/main.tsx` — understand BrowserRouter hoisting
- `apps/patient/src/screens/gad-7/index.tsx` — confirm existing route import pattern
- `apps/patient/design/wireframes/shell-pt-mobile.md` — shell layout structure for reference

## Instructions

**Read `apps/patient/src/App.tsx` fully before making any changes.**

Replace the file contents with the following. Preserve the existing `Gad7Routes` and `Phq9Routes` imports and routes — they are the shipped assessment flows and must not be removed.

```tsx
// apps/patient/src/App.tsx
// Patient app root. MobileShell envelope (from @haven/ui-react) applies the
// mobile-app body class and the mobile-shell inner wrapper.
// Shell structure: I18nBar (fixed top) → scrollable route content → BottomNav (fixed bottom).
// Assessment flows (/assessment/*) are pre-existing shipped slices; not touched here.

import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { MobileShell } from '@haven/ui-react';
import { I18nBar } from './components/I18nBar';
import { BottomNav } from './components/BottomNav';
import { useLanguage } from './lib/useLanguage';
import { Dashboard } from './screens/dashboard';
import { Messages } from './screens/messages';
import { Settings } from './screens/settings';
import { MyHealth } from './screens/health';
import { Care } from './screens/care';
import { Gad7Routes } from './screens/gad-7';
import { Phq9Routes } from './screens/phq-9';

// Helper: hide bottom nav inside assessment flows (full-screen stepper)
const ASSESSMENT_PREFIXES = ['/assessment/'];

function useShowBottomNav(): boolean {
  const { pathname } = useLocation();
  return !ASSESSMENT_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function useShowI18nBar(): boolean {
  const { pathname } = useLocation();
  return !ASSESSMENT_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function App() {
  const [lang, setLang] = useLanguage();
  const showBottomNav = useShowBottomNav();
  const showI18nBar = useShowI18nBar();

  // TODO v1: read unreadCount from messages API
  const unreadCount = 1; // demo: 1 unread message

  return (
    <MobileShell>
      {showI18nBar && <I18nBar lang={lang} onToggle={setLang} />}

      {/* Route content area: padding-top clears i18n bar; padding-bottom clears bottom-nav */}
      <div
        className="flex flex-col"
        style={{
          paddingTop: showI18nBar ? '44px' : '0',
          paddingBottom: showBottomNav ? '64px' : '0',
        }}
      >
        <Routes>
          {/* Main shell routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/health" element={<MyHealth />} />
          <Route path="/care" element={<Care />} />

          {/* Existing assessment flows — do not modify */}
          <Route path="/assessment/gad-7/*" element={<Gad7Routes />} />
          <Route path="/assessment/phq-9/*" element={<Phq9Routes />} />
        </Routes>
      </div>

      {showBottomNav && <BottomNav lang={lang} unreadCount={unreadCount} />}
    </MobileShell>
  );
}
```

**Known Constraints:**
- The old `Landing` function in `App.tsx` is REPLACED by `Dashboard` (which is the `/` route). The old `Landing` is a leftover stub — removing it is correct.
- `useLocation()` must be called inside the `BrowserRouter` context. It IS inside context here because `BrowserRouter` is hoisted in `main.tsx`. Do not add another `BrowserRouter`.
- `paddingTop: '44px'` and `paddingBottom: '64px'` are the only inline styles permitted here — they are data-driven layout clearances for the fixed bars, not component styling. This matches the `mobile-shell` spec for `padding-top` / `padding-bottom` accounting.
- Assessment flows (`/assessment/*`) hide I18nBar and BottomNav — the existing assessment screens are full-screen and manage their own headers via `AssessmentHeader` from `@haven/ui-react`.
- `useShowBottomNav` and `useShowI18nBar` use the same logic; they are two named hooks for future differentiation (e.g., assessment screens may want the i18n bar but not bottom nav — separate hooks make this easy to change).

## Expected Result
- `apps/patient/src/App.tsx` exports `App` with all 5 new routes + assessment flows
- Navigating to `/` shows Dashboard; `/messages` shows Messages; etc.
- Assessment flows (`/assessment/gad-7/*`, `/assessment/phq-9/*`) still work; they hide I18nBar and BottomNav
- TypeScript compiles with no errors

## Verification
- [ ] `Dashboard`, `Messages`, `Settings`, `MyHealth`, `Care` all imported and routed
- [ ] `Gad7Routes`, `Phq9Routes` still present and routed — not removed
- [ ] `useLocation` imported from `react-router-dom`
- [ ] `useLanguage` called at `App` level so lang state is shared with `I18nBar` and `BottomNav`
- [ ] No second `BrowserRouter` added
- [ ] `I18nBar` hidden on `/assessment/*` routes
- [ ] `BottomNav` hidden on `/assessment/*` routes
- [ ] TypeScript: no `style={{}}` complaints on the `paddingTop`/`paddingBottom` (object notation is valid for inline style in React)
- [ ] Dark mode: not applicable
- [ ] Schema delta: not applicable

## Completion Report

```
## Completion Report — Task 08: App.tsx Route Wiring

- New semantic classes added to components.css: none
- Existing classes modified: none
- Pattern library files created or updated: none
- Judgment calls: inline paddingTop/paddingBottom for i18n bar + bottom nav clearance; assessed as permissible layout-only inline styles per CLAUDE.md (data-driven; not component styling)
- Dark mode added: not applicable
- Schema delta logged: not applicable
- Items deferred or incomplete: unreadCount hardcoded as 1 (production: from messages API)
```

## If Something Goes Wrong
- **`useLocation` called outside Router context:** confirm `BrowserRouter` is in `main.tsx`, not removed. If it was accidentally removed, re-add it there — do not add it in `App.tsx`.
- **`Dashboard` import error:** confirm `apps/patient/src/screens/dashboard/index.tsx` exists and exports `Dashboard`; the index.tsx file must have a named export (not default export)
- **Build warning about `Landing` function:** the old `Landing` function is removed; if any tests import it, update those tests to point to `Dashboard`
