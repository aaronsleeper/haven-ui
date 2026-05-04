# Task 01: Shell Wiring — I18n Bar + Bottom Nav Components

## Scope
App only (composing existing PL classes; no new semantic classes)

## Task class
deterministic

## Model tier
sonnet

## Context
The patient app currently has `MobileShell` from `@haven/ui-react` but no i18n bar or bottom nav. These two persistent shell components — `mobile-i18n-bar` + `mobile-bottom-nav` — wrap every route screen. This task creates two inline React components (`I18nBar` and `BottomNav`) in `apps/patient/src/components/`. These are app-scoped (not promoted to `@haven/ui-react`) because the bottom nav carries patient-specific routing labels and the i18n bar is patient-only. Both components use existing semantic classes verbatim from the pattern library.

## Prerequisites
- None (first task in sequence)
- Confirm: `packages/design-system/pattern-library/COMPONENT-INDEX.md` has `mobile-i18n-bar`, `mobile-i18n-toggle`, `mobile-bottom-nav`, `mobile-bottom-nav-tab`, `mobile-bottom-nav-badge` (all confirmed at Stage 3)

## Files to Read First
- `packages/design-system/pattern-library/components/layout-mobile-i18n-bar.html` — exact HTML structure to port
- `packages/design-system/pattern-library/components/layout-mobile-bottom-nav.html` — exact HTML structure to port
- `apps/patient/src/App.tsx` — current app root; understand what already exists
- `apps/patient/design/wireframes/shell-pt-mobile.md` — interaction spec for both components

## Instructions

### Step 1: Create `apps/patient/src/components/` directory

Create the directory if it does not exist.

### Step 2: Create `apps/patient/src/components/I18nBar.tsx`

Read `layout-mobile-i18n-bar.html` first. Port its HTML structure to React JSX with these specifics:

```tsx
// apps/patient/src/components/I18nBar.tsx
// Persistent fixed-top language toggle bar for the patient app.
// Uses `mobile-i18n-bar` + `mobile-i18n-toggle` semantic classes from the PL.
// Cena Health logo at left (~24px tall); EN/ES radio pair at right.
// Lang pref reads from / writes to localStorage key `cena-lang`.

import type { Language } from '../lib/useLanguage';

interface I18nBarProps {
  lang: Language;
  onToggle: (lang: Language) => void;
}

export function I18nBar({ lang, onToggle }: I18nBarProps) {
  return (
    <div className="mobile-i18n-bar">
      <img
        src="/src/assets/logo-cenahealth-teal.svg"
        alt="Cena Health"
        height="24"
        className="h-6 w-auto"
      />
      <div className="flex gap-1">
        <button
          type="button"
          className="mobile-i18n-toggle"
          aria-pressed={lang === 'en'}
          aria-label="English"
          onClick={() => onToggle('en')}
        >
          EN
        </button>
        <button
          type="button"
          className="mobile-i18n-toggle"
          aria-pressed={lang === 'es'}
          aria-label="Español"
          onClick={() => onToggle('es')}
        >
          ES
        </button>
      </div>
    </div>
  );
}
```

**Do NOT:**
- Add inline `style={{}}` attributes
- Add Tailwind utility chains for layout (the `mobile-i18n-bar` class handles positioning/surface)
- Import the vanilla `i18n.js` module — React state handles language here

### Step 3: Create `apps/patient/src/components/BottomNav.tsx`

Read `layout-mobile-bottom-nav.html` first. Port its HTML structure with these specifics:

5 tabs: Dashboard (`fa-house`) → `/`, My Health (`fa-heart-pulse`) → `/health`, Messages (`fa-message`) → `/messages`, Care (`fa-stethoscope`) → `/care`, Settings (`fa-gear`) → `/settings`.

EN labels: Dashboard / My Health / Messages / Care / Settings
ES labels: Inicio / Mi Salud / Mensajes / Cuidado / Ajustes

```tsx
// apps/patient/src/components/BottomNav.tsx
// Persistent fixed-bottom 5-tab nav for the patient app.
// Uses `mobile-bottom-nav`, `mobile-bottom-nav-tab`, `mobile-bottom-nav-badge` classes.
// Active tab determined by current route path. Language-aware tab labels.

import { NavLink } from 'react-router-dom';
import type { Language } from '../lib/useLanguage';

interface BottomNavProps {
  lang: Language;
  unreadCount?: number;
}

const tabs = [
  { to: '/', icon: 'fa-house',        labelEn: 'Dashboard', labelEs: 'Inicio',    end: true },
  { to: '/health',   icon: 'fa-heart-pulse', labelEn: 'My Health', labelEs: 'Mi Salud', end: false },
  { to: '/messages', icon: 'fa-message',     labelEn: 'Messages',  labelEs: 'Mensajes', end: false },
  { to: '/care',     icon: 'fa-stethoscope', labelEn: 'Care',      labelEs: 'Cuidado',  end: false },
  { to: '/settings', icon: 'fa-gear',        labelEn: 'Settings',  labelEs: 'Ajustes',  end: false },
] as const;

export function BottomNav({ lang, unreadCount = 0 }: BottomNavProps) {
  return (
    <nav className="mobile-bottom-nav" aria-label="Main navigation">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            isActive ? 'mobile-bottom-nav-tab active' : 'mobile-bottom-nav-tab'
          }
          aria-current={undefined}  // NavLink handles aria-current via className; skip duplicate
        >
          <span className="relative">
            <i className={`fa-solid ${tab.icon}`} aria-hidden="true" />
            {tab.to === '/messages' && unreadCount > 0 && (
              <span className="mobile-bottom-nav-badge" aria-label={`${unreadCount} unread messages`}>
                {unreadCount}
              </span>
            )}
          </span>
          <span>{lang === 'es' ? tab.labelEs : tab.labelEn}</span>
        </NavLink>
      ))}
    </nav>
  );
}
```

**Known Constraints:**
- Active tab uses `.active` CSS class — the `mobile-bottom-nav-tab.active` rule applies teal + weight bump (per decisions-log). Do not add inline color or font-weight.
- `pb-safe-4` / `pb-safe-8` belong on the page-end containers of each route, NOT on BottomNav itself. The `mobile-bottom-nav` CSS class handles its own safe-area via `env(safe-area-inset-bottom)`.
- Ava avatar: **never appears in patient app**. Cena logo is the only brand identity in `I18nBar`.

### Step 4: Create `apps/patient/src/components/index.ts` barrel

```ts
export { I18nBar } from './I18nBar';
export { BottomNav } from './BottomNav';
```

## Expected Result
- `apps/patient/src/components/I18nBar.tsx` exists and renders a fixed-top bar with Cena logo + EN/ES toggle buttons
- `apps/patient/src/components/BottomNav.tsx` exists and renders a fixed-bottom 5-tab nav; Messages tab shows badge when `unreadCount > 0`; active tab determined by react-router `<NavLink>`
- `apps/patient/src/components/index.ts` barrel exports both

## Verification
- [ ] `I18nBar.tsx` imports `Language` type from `../lib/useLanguage` (not yet created — TypeScript import compiles once Task 02 is done; for now, use `type Language = 'en' | 'es'` inline if build fails before 02 is complete)
- [ ] `mobile-i18n-bar` class exists in `components.css` (verified at Stage 3)
- [ ] `mobile-bottom-nav` class exists in `components.css` (verified at Stage 3)
- [ ] No `style={{}}` in either component
- [ ] No Tailwind utility chains for layout-critical properties already covered by semantic classes
- [ ] No `<img>` for Ava avatar anywhere in either component
- [ ] HTML classes are semantic — no utility soup
- [ ] Dark mode: not applicable to these components at v1 (mobile-app forces light surface per DESIGN.md patient app direction)
- [ ] `packages/design-system/src/data/_schema-notes.md` updated if any dummy data deviates from Firebase schema: not applicable

## Completion Report

After all verification passes and before running the git commit, output this report:

```
## Completion Report — Task 01: Shell Wiring — I18n Bar + Bottom Nav

- New semantic classes added to components.css: none
- Existing classes modified: none
- Pattern library files created or updated: none
- Judgment calls (anything not explicitly specified in the prompt): none
- Dark mode added: not applicable (patient mobile app; light-mode-only surface)
- Schema delta logged: not applicable
- Items deferred or incomplete: none
```

## If Something Goes Wrong
- **TypeScript error on `Language` import:** add `type Language = 'en' | 'es'` inline in each file; the proper import resolves after Task 02
- **NavLink `aria-current` warning:** NavLink manages `aria-current` internally — pass `aria-current={undefined}` to suppress React duplicate-prop warning
- **Logo path not found:** placeholder `<span>Cena Health</span>` is acceptable for Task 01; real SVG path resolves at build verification
