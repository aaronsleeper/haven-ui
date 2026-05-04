# Task 06: My Health Route (`/health`)

## Scope
App only (composing existing PL classes; no new semantic classes)

## Task class
deterministic

## Model tier
sonnet

## Context
My Health is a stub route that surfaces the existing `assess-01` composition: 3 trend cards (Mood, Energy, Meal Satisfaction) with Chart.js sparklines and trend badges. The assessments flow (`/assessment/gad-7`, `/assessment/phq-9`) is already shipped. This task creates the `/health` route screen that composes `trend-card` components with demo sparkline data and routes to the existing assessment flows on tap. Per Stage 3, pt-04-my-health "inherits content composition from assess-01-my-health.md".

## Prerequisites
- Task 01 complete
- Task 02 complete

## Files to Read First
- `apps/patient/design/wireframes/pt-04-my-health.md` — stub spec and delegation to assess-01
- `apps/patient/design/review-notes.md` — final copy (Stage 2 §pt-04-my-health)
- `packages/design-system/pattern-library/COMPONENT-INDEX.md` — verify `trend-card`, `trend-card-header`, `trend-card-chart`, `badge-trend`, `trend-improving`, `trend-flat`, `trend-worsening`, `chart-sparkline`

## Instructions

**Style rule:** Use Haven semantic classes for all styled elements.

### Step 1: Create `apps/patient/src/screens/health/index.tsx`

**Note on Chart.js sparklines:** Chart.js is loaded via CDN in vanilla HTML pages. In the React app, Chart.js is not in the package.json. At v1, render the `trend-card` structure with the sparkline container present but use a placeholder approach (colored background div) rather than attempting to initialize Chart.js via a React effect. Add a `// TODO v1.1: initialize Chart.js sparkline` comment. This matches the "stub-level wireframe" intent of pt-04. The trend badge + header still render correctly.

```tsx
import { Link } from 'react-router-dom';
import { useLanguage } from '../../lib/useLanguage';

interface TrendMetric {
  id: string;
  name: { en: string; es: string };
  trend: 'improving' | 'stable' | 'worsening';
  trendLabel: { en: string; es: string };
  lastUpdated: { en: string; es: string };
  assessmentHref: string;
}

const DEMO_METRICS: TrendMetric[] = [
  {
    id: 'mood',
    name: { en: 'Mood', es: 'Estado de ánimo' },
    trend: 'improving',
    trendLabel: { en: 'Improving', es: 'Mejorando' },
    lastUpdated: { en: 'Updated 2 days ago', es: 'Actualizado hace 2 días' },
    assessmentHref: '/assessment/gad-7',
  },
  {
    id: 'energy',
    name: { en: 'Energy', es: 'Energía' },
    trend: 'stable',
    trendLabel: { en: 'Stable', es: 'Estable' },
    lastUpdated: { en: 'Updated 4 days ago', es: 'Actualizado hace 4 días' },
    assessmentHref: '/assessment/gad-7',
  },
  {
    id: 'meal-satisfaction',
    name: { en: 'Meal Satisfaction', es: 'Satisfacción con comidas' },
    trend: 'improving',
    trendLabel: { en: 'Improving', es: 'Mejorando' },
    lastUpdated: { en: 'Updated 2 days ago', es: 'Actualizado hace 2 días' },
    assessmentHref: '/assessment/phq-9',
  },
];

const TREND_CLASS_MAP = {
  improving: 'trend-badge trend-improving',
  stable: 'trend-badge trend-flat',
  worsening: 'trend-badge trend-worsening',
} as const;

const TREND_ICON_MAP = {
  improving: 'fa-arrow-trend-up',
  stable: 'fa-minus',
  worsening: 'fa-arrow-trend-down',
} as const;

export function MyHealth() {
  const [lang] = useLanguage();

  return (
    <main className="pb-safe-8" aria-label="My Health">
      {/* Header */}
      <div className="p-4">
        <h1 className="text-[27.65px] font-serif font-medium text-sand-900">
          {lang === 'es' ? 'Mi Salud' : 'My Health'}
        </h1>
        <p className="text-sm text-sand-500 mt-1">
          {lang === 'es' ? 'Su progreso, su historia.' : 'Your progress, your story.'}
        </p>
      </div>

      <div className="px-4 space-y-4">
        {DEMO_METRICS.map((metric) => (
          <Link
            key={metric.id}
            to={metric.assessmentHref}
            className="block no-underline"
            aria-label={`${metric.name[lang]}: ${metric.trendLabel[lang]}`}
          >
            <div className="trend-card">
              <div className="trend-card-header">
                <span className="text-sm font-semibold text-sand-800">
                  {metric.name[lang]}
                </span>
                <span className={TREND_CLASS_MAP[metric.trend]}>
                  <i className={`fa-solid ${TREND_ICON_MAP[metric.trend]}`} aria-hidden="true" />
                  {metric.trendLabel[lang]}
                </span>
              </div>
              <div
                className="trend-card-chart"
                aria-label={`${metric.name[lang]} sparkline: ${metric.trendLabel[lang]}`}
              >
                {/* TODO v1.1: initialize Chart.js sparkline canvas here */}
                <div className="chart-sparkline bg-sand-100 rounded" />
              </div>
              <p className="text-xs text-sand-400 mt-2">{metric.lastUpdated[lang]}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
```

**Known Constraints:**
- `trend-badge`, `trend-improving`, `trend-flat`, `trend-worsening`: existing semantic classes from `badge-trend.html` PL entry — compose as `"trend-badge trend-improving"` etc.
- `trend-card`, `trend-card-header`, `trend-card-chart`: existing classes from `patient-trend-card.html` PL entry
- `chart-sparkline`: the semantic class that wraps the Chart.js canvas; at v1 the div placeholder preserves the layout slot; Chart.js init is deferred to v1.1
- Do NOT import Chart.js — it is not in the React app's package.json; CDN-loaded in vanilla HTML only
- Assessment hrefs reference the already-shipped flows — do not create new routes

## Expected Result
- `apps/patient/src/screens/health/index.tsx` exports `MyHealth` component
- Renders 3 trend cards with labels, trend badges, and sparkline placeholders
- Each card links to the existing assessment flows
- Bilingual EN/ES via `useLanguage()`

## Verification
- [ ] `MyHealth` exported from `apps/patient/src/screens/health/index.tsx`
- [ ] 3 trend cards rendered
- [ ] `trend-badge trend-improving` / `trend-flat` / `trend-worsening` classes used correctly
- [ ] Sparkline placeholder present; `// TODO v1.1` comment
- [ ] `<main aria-label="My Health">` landmark
- [ ] `pb-safe-8` on `<main>`
- [ ] No Chart.js import
- [ ] No `style={{}}` attributes
- [ ] Dark mode: not applicable
- [ ] Schema delta: not applicable

## Completion Report

```
## Completion Report — Task 06: My Health Route

- New semantic classes added to components.css: none
- Existing classes modified: none
- Pattern library files created or updated: none
- Judgment calls: Chart.js deferred to v1.1 per stub-wireframe intent; trend-badge classes composed correctly
- Dark mode added: not applicable
- Schema delta logged: not applicable
- Items deferred or incomplete: Chart.js sparkline initialization (v1.1)
```

## If Something Goes Wrong
- **`trend-badge` class name:** confirm in COMPONENT-INDEX under "Badges & Status" — `trend-badge` is the base class, modifier is `trend-improving` / `trend-flat` / `trend-worsening`
- **`trend-card-chart` height collapses to 0:** the `chart-sparkline` class in `components.css` sets a fixed `height: 40px; min-height: 40px` via raw CSS (not @apply) — the placeholder div will still be visible
