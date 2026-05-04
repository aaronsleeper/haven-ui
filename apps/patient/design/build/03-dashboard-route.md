# Task 03: Dashboard Route (`/`)

## Scope
App only (composing existing PL classes via ui-react; no new semantic classes)

## Task class
deterministic

## Model tier
sonnet

## Context
The Dashboard is Maria's first surface every visit. It surfaces: a warm greeting (3 template variants based on data availability), today's task card, a recent message preview, and next delivery countdown. If nothing is available, it shows a warm empty state. This task creates `apps/patient/src/screens/dashboard/index.tsx` with static demo data. All strings are bilingual EN/ES via the `useLanguage` hook.

## Prerequisites
- Task 01 complete (`BottomNav`, `I18nBar` exist)
- Task 02 complete (`useLanguage` hook exists)

## Files to Read First
- `apps/patient/design/wireframes/pt-01-dashboard.md` — layout spec and copy
- `apps/patient/design/review-notes.md` — confirmed copy strings (Stage 2 pipeline section)
- `apps/patient/src/screens/gad-7/start.tsx` — reference for screen component structure in this app
- `packages/design-system/pattern-library/COMPONENT-INDEX.md` — verify class names for `task-card`, `card`, `delivery-status-card`, `data-empty-state`, `message-new-pill`

## Instructions

**Style rule:** Use Haven semantic classes (`.card`, `.task-card`, `.delivery-status-card`, `.data-empty-state`, etc.) for all styled elements. Only use raw Tailwind utilities for layout-specific adjustments unique to this screen (e.g., `p-4`, `space-y-4`, `mt-2`). When in doubt, use the semantic class.

### Step 1: Create `apps/patient/src/screens/dashboard/` directory and `index.tsx`

Create `apps/patient/src/screens/dashboard/index.tsx` with the following structure:

**Demo data constants (file-top, above the component):**
```tsx
// Demo data drives which variant of the dashboard renders.
// In production these come from the API; for v1 demo, static data shows the
// "loaded with task + message + delivery" state.
const DEMO_TASK = {
  name: { en: "Anxiety check-in", es: "Revisión de ansiedad" },
  meta: { en: "7 questions · about 2 minutes", es: "7 preguntas · unos 2 minutos" },
  icon: "fa-clipboard-list",
  state: "default" as const, // 'default' | 'in-progress' | 'overdue'
  href: "/assessment/gad-7",
};

const DEMO_MESSAGE = {
  sender: { en: "Sarah K., Care Coordinator", es: "Sarah K., Coordinadora de cuidado" },
  preview: {
    en: "Your delivery was rescheduled to Wednesday — let me know if that doesn't work for you.",
    es: "Su entrega se cambió al miércoles — avíseme si no le funciona.",
  },
  isUnread: true,
};
```

**Greeting subline selection helper (pure function):**
```tsx
type GreetingVariant = 'action-recent' | 'action-none' | 'time-of-day';

function getGreetingSubline(variant: GreetingVariant, lang: 'en' | 'es'): string {
  const strings = {
    'action-recent': {
      en: "It's a sunny Tuesday. You logged your weight this morning — great job.",
      es: "Es un martes soleado. Pesó esta mañana — ¡buen trabajo!",
    },
    'action-none': {
      en: "Hope you're having a good morning.",
      es: "Esperamos que esté teniendo un buen día.",
    },
    'time-of-day': {
      en: "Good morning, Maria.",
      es: "Buenos días, María.",
    },
  };
  return strings[variant][lang];
}
```

**Main component:**
```tsx
import { Link } from 'react-router-dom';
import { TaskCard } from '@haven/ui-react';
import { useLanguage } from '../../lib/useLanguage';

export function Dashboard() {
  const [lang] = useLanguage();

  const greetingVariant: GreetingVariant = 'action-recent'; // demo: pick action-recent

  return (
    <main className="pb-safe-8" aria-label="Dashboard">
      {/* Greeting */}
      <div className="p-4">
        <h1 className="text-[27.65px] font-serif font-medium text-sand-900">
          {lang === 'es' ? 'Bienvenida, María' : 'Welcome back, Maria'}
        </h1>
        <p className="text-sm text-sand-500 mt-1">
          {getGreetingSubline(greetingVariant, lang)}
        </p>
      </div>

      {/* Today's task */}
      <div className="px-4 pb-4">
        <h2 className="text-base font-serif font-medium text-sand-800 mb-3">
          {lang === 'es' ? "Su revisión de hoy" : "Today's check-in"}
        </h2>
        <TaskCard
          name={DEMO_TASK.name[lang]}
          meta={DEMO_TASK.meta[lang]}
          iconClass={`fa-solid ${DEMO_TASK.icon}`}
          asComponent={Link}
          linkProps={{ to: DEMO_TASK.href }}
        />
      </div>

      {/* Recent message preview */}
      <div className="px-4 pb-4">
        <h2 className="text-base font-serif font-medium text-sand-800 mb-3">
          {lang === 'es' ? 'Mensaje reciente' : 'Recent message'}
        </h2>
        <div className="card">
          <div className="card-body">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-sand-500 mb-1">
                  {DEMO_MESSAGE.sender[lang]}
                </p>
                <p className="text-sm text-sand-800 line-clamp-2">
                  {DEMO_MESSAGE.preview[lang]}
                </p>
              </div>
              {DEMO_MESSAGE.isUnread && (
                <span className="message-new-pill shrink-0">
                  {lang === 'es' ? 'Nuevo' : 'New'}
                </span>
              )}
            </div>
            <div className="mt-2">
              <Link to="/messages" className="text-link text-sm">
                {lang === 'es' ? 'Ver' : 'View'}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery status card */}
      <div className="px-4 pb-4">
        <div className="delivery-status-card">
          <div className="delivery-status-top">
            <div className="delivery-status-icon">
              <i className="fa-solid fa-truck" aria-hidden="true" />
            </div>
            <div>
              <div className="delivery-status-label">
                {lang === 'es' ? 'En camino' : 'On the way'}
              </div>
              <div className="delivery-status-timing">
                {lang === 'es' ? 'Llegando entre 2pm y 4pm' : 'Arriving between 2pm and 4pm'}
              </div>
            </div>
          </div>
          <div className="delivery-status-divider" />
          <div className="delivery-summary">
            <span className="delivery-summary-label">
              {lang === 'es' ? '5 comidas' : '5 meals'}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
```

**Known Constraints:**
- `pb-safe-8` on `<main>` provides iOS home indicator clearance at the bottom of scroll — required on every route content container
- `TaskCard` is from `@haven/ui-react`; it already ships with `task-card` semantic classes — do not replicate the class in JSX
- `card`, `card-body`: from `@haven/ui-react` `Card` components OR use the semantic classes directly in HTML — using semantic classes directly in JSX is acceptable for app-only composition (no new PL fragment needed)
- `message-new-pill`, `text-link`, `delivery-status-card` etc. are semantic classes used inline — do NOT add these to `components.css` (they already exist)
- Do NOT use `data-i18n-en` / `data-i18n-es` HTML attributes in React; use `useLanguage()` hook to select string instead (the attributes are for vanilla-JS screens; React controls re-renders)
- Heading font for `<h1>`: Lora serif — use `font-serif` Tailwind class which resolves to `--font-display` (Lora) per `haven.css` mapping; "Heading/01" = 27.65px per DESIGN.md

## Expected Result
- `apps/patient/src/screens/dashboard/index.tsx` exports `Dashboard` component
- Route renders: greeting + task card (links to `/assessment/gad-7`) + message preview (links to `/messages`) + delivery status card
- Both EN and ES strings present and switchable via `useLanguage`
- No broken TypeScript; no `style={{}}` props

## Verification
- [ ] `Dashboard` component exported from `apps/patient/src/screens/dashboard/index.tsx`
- [ ] Uses `useLanguage()` from `../../lib/useLanguage`
- [ ] `TaskCard` imported from `@haven/ui-react`
- [ ] `pb-safe-8` on `<main>` for iOS clearance
- [ ] `<main aria-label="Dashboard">` landmark present
- [ ] Greeting `<h1>` renders with `font-serif` (Lora)
- [ ] No `style={{}}` attributes
- [ ] No hardcoded strings without a language branch (all bilingual)
- [ ] HTML classes are semantic — no utility chains for component styling
- [ ] Dark mode: not applicable (mobile patient shell is light-mode only)
- [ ] `packages/design-system/src/data/_schema-notes.md` updated: not applicable (demo data is hardcoded constants, not Firebase schema)

## Completion Report

After all verification passes and before running the git commit, output this report:

```
## Completion Report — Task 03: Dashboard Route

- New semantic classes added to components.css: none
- Existing classes modified: none
- Pattern library files created or updated: none
- Judgment calls: none
- Dark mode added: not applicable
- Schema delta logged: not applicable
- Items deferred or incomplete: none
```

## If Something Goes Wrong
- **`TaskCard` import error:** confirm `@haven/ui-react` is in `apps/patient/package.json` dependencies; check `packages/ui-react/src/index.ts` for the export
- **`delivery-status-card` subclass names:** read `packages/design-system/src/styles/tokens/components.css` from line 4425 to confirm child class names before committing
- **`line-clamp-2` not available:** use `overflow-hidden` + `display: -webkit-box; -webkit-line-clamp: 2` via a semantic class or inline style as last resort — but prefer checking components.css first
