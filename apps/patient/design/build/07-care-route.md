# Task 07: Care Route (`/care`)

## Scope
App only (composing existing PL classes; no new semantic classes)

## Task class
deterministic

## Model tier
sonnet

## Context
Care is a read-only stub route surfacing care plan summary, upcoming appointments, and recent deliveries. Patient cannot modify anything — all changes route through "Open Messages". If everything is empty (new patient), a single warm empty state fills the content area. Per stub-wireframe spec, all sections are static at v1; appointment/delivery detail views are v1.1.

## Prerequisites
- Task 01 complete
- Task 02 complete

## Files to Read First
- `apps/patient/design/wireframes/pt-05-care.md` — layout spec, copy, interaction specs
- `apps/patient/design/review-notes.md` — final copy (Stage 2 §pt-05-care)
- `packages/design-system/pattern-library/COMPONENT-INDEX.md` — verify `card`, `list-group`, `list-group-item`, `list-group-item-icon`, `list-group-item-content`, `list-group-item-trailing`, `text-link`, `data-empty-state`, `badge`, `badge-success`

## Instructions

**Style rule:** Use Haven semantic classes for all styled elements.

### Step 1: Create `apps/patient/src/screens/care/index.tsx`

```tsx
import { Link } from 'react-router-dom';
import { useLanguage } from '../../lib/useLanguage';

// Demo data for v1
const DEMO_CARE_PLAN_GOALS = {
  en: [
    "Eat balanced meals to keep your blood sugar steady.",
    "Watch your salt intake.",
    "Check in once a week so your team knows how you're doing.",
  ],
  es: [
    "Comer comidas balanceadas para mantener el azúcar estable.",
    "Cuidar la sal en sus comidas.",
    "Revisar una vez a la semana para que su equipo sepa cómo va.",
  ],
};

const DEMO_APPOINTMENTS = [
  {
    id: 'appt-1',
    title: { en: 'Nutrition check-in with Dr. Soto', es: 'Revisión con Dr. Soto' },
    dateTime: { en: 'Thursday, May 8 · 10:00 AM', es: 'Jueves, 8 de mayo · 10:00 AM' },
  },
];

interface DeliveryItem {
  id: string;
  date: { en: string; es: string };
  status: 'delivered' | 'in-transit';
  statusLabel: { en: string; es: string };
}

const DEMO_DELIVERIES: DeliveryItem[] = [
  {
    id: 'del-1',
    date: { en: 'Wednesday, Apr 30', es: 'Miércoles, 30 de abril' },
    status: 'delivered',
    statusLabel: { en: 'Delivered', es: 'Entregado' },
  },
  {
    id: 'del-2',
    date: { en: 'Wednesday, Apr 23', es: 'Miércoles, 23 de abril' },
    status: 'delivered',
    statusLabel: { en: 'Delivered', es: 'Entregado' },
  },
];

export function Care() {
  const [lang] = useLanguage();

  return (
    <main className="pb-safe-8" aria-label="Care">
      {/* Header */}
      <div className="p-4">
        <h1 className="text-[27.65px] font-serif font-medium text-sand-900">
          {lang === 'es' ? 'Cuidado' : 'Care'}
        </h1>
        <p className="text-sm text-sand-500 mt-1">
          {lang === 'es'
            ? 'Su plan, citas y entregas.'
            : 'Your plan, appointments, and deliveries.'}
        </p>
      </div>

      <div className="px-4 space-y-4">
        {/* Section 1 — Care plan */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              {lang === 'es' ? 'Su plan de cuidado' : 'Your care plan'}
            </h2>
          </div>
          <div className="card-body">
            <ul className="space-y-2">
              {DEMO_CARE_PLAN_GOALS[lang].map((goal, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-sand-800">
                  <i className="fa-solid fa-check text-primary-600 mt-0.5 shrink-0" aria-hidden="true" />
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-sand-400 mt-3">
              {lang === 'es'
                ? 'Su coordinadora actualiza este plan con su equipo.'
                : 'Your care coordinator updates this plan with your team.'}
            </p>
          </div>
        </div>

        {/* Section 2 — Upcoming appointments */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              {lang === 'es' ? 'Próximas citas' : 'Upcoming'}
            </h2>
          </div>
          <div className="card-body">
            {DEMO_APPOINTMENTS.length === 0 ? (
              <p className="text-sm text-sand-500">
                {lang === 'es' ? 'Nada programado en este momento.' : 'Nothing scheduled right now.'}
              </p>
            ) : (
              <ul className="list-group list-group-flush">
                {DEMO_APPOINTMENTS.map((appt) => (
                  <li key={appt.id} className="list-group-item">
                    <span className="list-group-item-icon" aria-hidden="true">
                      <i className="fa-solid fa-calendar-check" />
                    </span>
                    <div className="list-group-item-content">
                      <div className="list-group-item-title">{appt.title[lang]}</div>
                      <div className="list-group-item-description">{appt.dateTime[lang]}</div>
                    </div>
                    {/* Details link deferred to v1.1 */}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Section 3 — Recent deliveries */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              {lang === 'es' ? 'Entregas recientes' : 'Recent deliveries'}
            </h2>
          </div>
          <div className="card-body">
            {DEMO_DELIVERIES.length === 0 ? (
              <p className="text-sm text-sand-500">
                {lang === 'es'
                  ? 'Sus comidas aparecerán aquí cuando vayan en camino.'
                  : "Your meals will show up here once they're on the way."}
              </p>
            ) : (
              <ul className="list-group list-group-flush">
                {DEMO_DELIVERIES.map((del) => (
                  <li key={del.id} className="list-group-item">
                    <div className="list-group-item-content">
                      <div className="list-group-item-title">{del.date[lang]}</div>
                    </div>
                    <span className="list-group-item-trailing">
                      <span className="badge badge-success badge-pill">
                        {del.statusLabel[lang]}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Footer helper */}
        <p className="text-sm text-sand-500 text-center pb-4">
          {lang === 'es'
            ? 'Para cambiar algo, envíe un mensaje a su coordinadora.'
            : 'To change anything, message your care coordinator.'}
          {' '}
          <Link to="/messages" className="text-link">
            {lang === 'es' ? 'Abrir mensajes' : 'Open Messages'}
          </Link>
        </p>
      </div>
    </main>
  );
}
```

**Known Constraints:**
- `list-group`, `list-group-flush`, `list-group-item`: existing semantic classes; `list-group-flush` removes outer borders for in-card use
- `list-group-item-trailing`: right-side slot for badge or action
- `badge-success badge-pill`: compose; do not use `badge-teal` or any invented variant — confirmed in prompts-library anti-pattern
- Appointment row: `list-group-item-trailing` with `text-link` "Details" is deferred to v1.1 per wireframe — do NOT add it at v1
- "Open Messages" `text-link` routes to `/messages` via react-router `<Link>`
- All editorial content (care plan goals) is in EN/ES pairs — patient language pref drives the array key

## Expected Result
- `apps/patient/src/screens/care/index.tsx` exports `Care` component
- Renders 3-section layout: care plan goals + appointments list + deliveries list
- Footer "Open Messages" link routes to `/messages`
- Bilingual EN/ES

## Verification
- [ ] `Care` exported from `apps/patient/src/screens/care/index.tsx`
- [ ] `list-group list-group-flush` on appointment + delivery lists
- [ ] `badge-success badge-pill` on delivery status (not utility chains)
- [ ] "Details" link deferred — NOT present on list rows at v1
- [ ] `<main aria-label="Care">` landmark
- [ ] Section headers are `<h2>`
- [ ] `pb-safe-8` on `<main>`
- [ ] No `style={{}}` attributes
- [ ] Dark mode: not applicable
- [ ] Schema delta: not applicable

## Completion Report

```
## Completion Report — Task 07: Care Route

- New semantic classes added to components.css: none
- Existing classes modified: none
- Pattern library files created or updated: none
- Judgment calls: none
- Dark mode added: not applicable
- Schema delta logged: not applicable
- Items deferred or incomplete: appointment/delivery detail views (v1.1); "Details" text-link on list rows (v1.1)
```

## If Something Goes Wrong
- **`list-group-flush` class not recognized:** confirm in COMPONENT-INDEX entry — the class is defined in `data-list-group.html` PL file; if uncertain, read `components.css` and search for `list-group-flush`
- **`list-group-item` card-body spacing conflict:** if `mt-4` appears between list items (card-body spacing rule), check the exclusion list — `list-group-item` may need to be added. Read decisions-log.md "profile-field-row Added to card-body Spacing Exclusion List" for the pattern. Flag in completion report if this fires.
