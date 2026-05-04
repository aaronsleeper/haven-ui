# Task 09: Offline Banner + Shell States

## Scope
App only (composing existing PL classes; no new semantic classes)

## Task class
deterministic

## Model tier
sonnet

## Context
The patient shell has three shell-level states beyond the default: loading (skeleton placeholders from the i18n bar down), error (alert-error at top of content), and offline (sticky alert-warning banner just below i18n bar). The offline state uses the `navigator.onLine` API + `window` event listeners. This task adds the `OfflineBanner` component and wires the offline state into `App.tsx`. Loading + error states are per-route (each route screen shows its own loading skeletons and error alerts) — this task only adds the shell-level offline indicator.

## Prerequisites
- Task 08 complete (App.tsx fully wired)

## Files to Read First
- `apps/patient/src/App.tsx` — MUST read current state before editing
- `apps/patient/design/wireframes/shell-pt-mobile.md` — §States: Offline section for exact copy
- `apps/patient/design/review-notes.md` — offline banner copy (Stage 2 §shell-pt-mobile §Copy)
- `packages/design-system/pattern-library/COMPONENT-INDEX.md` — verify `alert`, `alert-warning`

## Instructions

**Read `apps/patient/src/App.tsx` fully before making any changes.**

### Step 1: Create `apps/patient/src/components/OfflineBanner.tsx`

```tsx
// apps/patient/src/components/OfflineBanner.tsx
// Offline state banner: renders as a sticky warning alert just below the i18n bar
// when navigator.onLine is false. Disappears when connectivity returns.
// Uses `alert` + `alert-warning` semantic classes.

import type { Language } from '../lib/useLanguage';

interface OfflineBannerProps {
  lang: Language;
}

export function OfflineBanner({ lang }: OfflineBannerProps) {
  return (
    <div
      className="alert alert-warning rounded-none sticky top-[44px] z-40"
      role="alert"
      aria-live="assertive"
    >
      <span className="alert-icon" aria-hidden="true">
        <i className="fa-solid fa-wifi-slash" />
      </span>
      <span className="text-sm">
        {lang === 'es'
          ? 'Sin conexión. Algunas funciones están limitadas ahora.'
          : "You're offline. Some things may not work right now."}
      </span>
    </div>
  );
}
```

### Step 2: Create `apps/patient/src/lib/useOnlineStatus.ts`

```ts
// apps/patient/src/lib/useOnlineStatus.ts
// Returns current navigator.onLine value; re-renders on change.

import { useEffect, useState } from 'react';

export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    function handleOnline() { setIsOnline(true); }
    function handleOffline() { setIsOnline(false); }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
```

### Step 3: Update `apps/patient/src/App.tsx`

Add the following to the existing `App.tsx` (do not remove anything from Task 08):

**New imports at top:**
```tsx
import { OfflineBanner } from './components/OfflineBanner';
import { useOnlineStatus } from './lib/useOnlineStatus';
```

**In `App()` function body, after `const unreadCount = 1;`:**
```tsx
const isOnline = useOnlineStatus();
```

**In JSX, add `OfflineBanner` just below `I18nBar`:**
```tsx
{showI18nBar && <I18nBar lang={lang} onToggle={setLang} />}
{!isOnline && <OfflineBanner lang={lang} />}
```

**Update `paddingTop` to account for offline banner height when visible:**
```tsx
paddingTop: showI18nBar ? (isOnline ? '44px' : '84px') : '0',
```
(Offline banner adds ~40px; 44 + 40 = 84px total clearance when offline banner is visible.)

### Step 4: Update `apps/patient/src/components/index.ts` barrel

Add `OfflineBanner` export:
```ts
export { OfflineBanner } from './OfflineBanner';
```

**Known Constraints:**
- `alert alert-warning`: compose; `rounded-none` overrides the default `rounded-xl` because this is a shell-level sticky banner, not a card-contained alert. Per decisions-log "alert-banner vs contained alerts": `alert-banner` on alerts that span full viewport; for this sticky pattern, `alert alert-warning rounded-none` is the correct approach since `alert-banner` removes horizontal borders which we may want to keep.
- `sticky top-[44px]` positions the banner just below the i18n bar. This is a layout-specific utility value (not covered by a semantic class) — permitted per CLAUDE.md architecture rules.
- `aria-live="assertive"` on the offline banner is intentional — connectivity loss is urgent and should interrupt screen reader flow.
- `z-40` keeps the banner above scrolling content but below any modals (z-50).
- The `paddingTop` adjustment is a data-driven layout value — acceptable inline style per the existing pattern in App.tsx from Task 08.

## Expected Result
- `apps/patient/src/components/OfflineBanner.tsx` exists
- `apps/patient/src/lib/useOnlineStatus.ts` exists
- `App.tsx` renders `OfflineBanner` below `I18nBar` when `!isOnline`
- `paddingTop` adjusts for banner height when offline

## Verification
- [ ] `OfflineBanner` renders `alert alert-warning` with bilingual copy
- [ ] `useOnlineStatus` listens to `window.online` / `window.offline` events and cleans up on unmount
- [ ] `App.tsx` imports `OfflineBanner` + `useOnlineStatus`
- [ ] `OfflineBanner` appears below i18n bar (sticky) when offline
- [ ] Banner disappears when `isOnline` returns to true
- [ ] `aria-live="assertive"` on banner
- [ ] No `style={{}}` on `OfflineBanner` component (layout is via className utilities)
- [ ] Dark mode: not applicable
- [ ] Schema delta: not applicable

## Completion Report

```
## Completion Report — Task 09: Offline Banner + Shell States

- New semantic classes added to components.css: none
- Existing classes modified: none
- Pattern library files created or updated: none
- Judgment calls: paddingTop 84px when offline (44px bar + 40px banner; measured from wireframe ~36px bar + ~40px banner); alert-warning + rounded-none for shell-level banner vs alert-banner (decisions-log anti-pattern applied)
- Dark mode added: not applicable
- Schema delta logged: not applicable
- Items deferred or incomplete: per-route loading skeletons deferred (each route screen implements its own)
```

## If Something Goes Wrong
- **Banner overlaps content at wrong breakpoint:** `sticky top-[44px]` is relative to the nearest scroll container — if the `mobile-shell` div establishes a scroll container, the sticky positioning is contained to it (correct behavior)
- **`fa-wifi-slash` icon not found:** check `packages/design-system/src/vendor/fontawesome/` — if the icon name is different, substitute `fa-signal-slash` or `fa-triangle-exclamation` as fallback; confirm in `.project-docs/icon-reference.md`
