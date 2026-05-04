import { Link } from 'react-router-dom';
import { useLanguage } from '../../lib/useLanguage';

// Demo data for v1
const DEMO_CARE_PLAN_GOALS = {
  en: [
    'Eat balanced meals to keep your blood sugar steady.',
    'Watch your salt intake.',
    "Check in once a week so your team knows how you're doing.",
  ],
  es: [
    'Comer comidas balanceadas para mantener el azúcar estable.',
    'Cuidar la sal en sus comidas.',
    'Revisar una vez a la semana para que su equipo sepa cómo va.',
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
                  <i
                    className="fa-solid fa-check text-primary-600 mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
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
