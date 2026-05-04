# Task 02: i18n Hook + Language Context

## Scope
App only (logic layer; no new semantic classes; no new PL entries)

## Task class
deterministic

## Model tier
sonnet

## Context
The patient app's bilingual support (EN/ES) requires a small React hook that reads/writes the active language preference to `localStorage` key `cena-lang`. This hook is the single source of truth for the language state; `I18nBar` and all route screens call it. The hook mirrors what `packages/design-system/src/scripts/components/i18n.js` does for vanilla-JS screens, but as a React hook — do NOT import the vanilla module.

## Prerequisites
- Task 01 complete (components directory exists; `I18nBar` + `BottomNav` reference `Language` type)

## Files to Read First
- `apps/patient/src/lib/useAssessmentResponses.ts` — pattern for how existing hooks are structured in this app
- `apps/patient/src/App.tsx` — see how `MobileShell` is used; understand where to lift state

## Instructions

### Step 1: Create `apps/patient/src/lib/useLanguage.ts`

```ts
// apps/patient/src/lib/useLanguage.ts
// Hook for patient app language preference (EN / ES).
// Reads initial value from localStorage key 'cena-lang'.
// On toggle: updates state, writes to localStorage, and sets document.documentElement.lang.
// Re-export the Language type so all components import from one place.

import { useCallback, useEffect, useState } from 'react';

export type Language = 'en' | 'es';

const STORAGE_KEY = 'cena-lang';

function getInitialLang(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'es') return 'es';
  } catch {
    // localStorage unavailable (SSR or private mode) — default to 'en'
  }
  return 'en';
}

export function useLanguage(): [Language, (lang: Language) => void] {
  const [lang, setLang] = useState<Language>(getInitialLang);

  // Keep document.documentElement.lang in sync for screen readers
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = useCallback((next: Language) => {
    setLang(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Silent fail; toggle applies for current session
    }
    document.documentElement.lang = next;
  }, []);

  return [lang, toggleLang];
}
```

### Step 2: Update `apps/patient/src/lib/useAssessmentResponses.ts` — no changes needed

Read the file to confirm the export pattern. Do not modify it.

### Step 3: Update `apps/patient/src/components/I18nBar.tsx` import

Replace the inline `type Language = 'en' | 'es'` (if added as placeholder in Task 01) with:

```tsx
import type { Language } from '../lib/useLanguage';
```

### Step 4: Update `apps/patient/src/components/BottomNav.tsx` import

Same: replace inline `Language` type definition with:

```tsx
import type { Language } from '../lib/useLanguage';
```

**Known Constraints:**
- Do NOT import `i18n.js` from `packages/design-system/src/scripts/components/` — that module writes to DOM attributes (`data-i18n-en`/`data-i18n-es`) on vanilla HTML nodes. React manages its own render; this hook manages language state only.
- Language toggle persistence write failure logs silently — toggle still applies for current session (per wireframe `pt-03-settings.md` §Interaction Specs).
- `document.documentElement.lang` must be updated on every toggle for WCAG `lang` attribute requirement (screen readers).

## Expected Result
- `apps/patient/src/lib/useLanguage.ts` exports `Language` type + `useLanguage` hook
- `I18nBar.tsx` and `BottomNav.tsx` import `Language` from `../lib/useLanguage` (not inline)
- Running `pnpm --filter @haven/app-patient typecheck` passes with no errors on these files

## Verification
- [ ] `useLanguage` returns `[lang, toggleLang]` tuple
- [ ] `getInitialLang()` returns `'en'` when localStorage is empty
- [ ] `getInitialLang()` returns `'es'` when `localStorage.getItem('cena-lang') === 'es'`
- [ ] `document.documentElement.lang` is set on initial render and on every toggle
- [ ] `localStorage.setItem` failure is caught silently (no uncaught exception)
- [ ] No inline `style={{}}` anywhere
- [ ] `packages/design-system/src/data/_schema-notes.md` updated: not applicable

## Completion Report

After all verification passes and before running the git commit, output this report:

```
## Completion Report — Task 02: i18n Hook + Language Context

- New semantic classes added to components.css: none
- Existing classes modified: none
- Pattern library files created or updated: none
- Judgment calls: none
- Dark mode added: not applicable
- Schema delta logged: not applicable
- Items deferred or incomplete: none
```

## If Something Goes Wrong
- **TypeScript strict null error on `localStorage.getItem`:** wrap in try/catch as shown above; `localStorage` can throw in some browser contexts
- **`document.documentElement` undefined (SSR):** guard with `typeof document !== 'undefined'` if needed; Vite + React in CSR mode won't trigger this, but safe to guard
