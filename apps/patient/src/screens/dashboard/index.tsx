import { Link } from 'react-router-dom';
import { TaskCard } from '@haven/ui-react';
import { useLanguage } from '../../lib/useLanguage';

// Demo data drives which variant of the dashboard renders.
// In production these come from the API; for v1 demo, static data shows the
// "loaded with task + message + delivery" state.
const DEMO_TASK = {
  name: { en: 'Anxiety check-in', es: 'Revisión de ansiedad' },
  meta: { en: '7 questions · about 2 minutes', es: '7 preguntas · unos 2 minutos' },
  icon: 'fa-clipboard-list',
  state: 'default' as const, // 'default' | 'in-progress' | 'overdue'
  href: '/assessment/gad-7',
};

const DEMO_MESSAGE = {
  sender: { en: 'Sarah K., Care Coordinator', es: 'Sarah K., Coordinadora de cuidado' },
  preview: {
    en: "Your delivery was rescheduled to Wednesday — let me know if that doesn't work for you.",
    es: 'Su entrega se cambió al miércoles — avíseme si no le funciona.',
  },
  isUnread: true,
};

type GreetingVariant = 'action-recent' | 'action-none' | 'time-of-day';

function getGreetingSubline(variant: GreetingVariant, lang: 'en' | 'es'): string {
  const strings = {
    'action-recent': {
      en: "It's a sunny Tuesday. You logged your weight this morning — great job.",
      es: 'Es un martes soleado. Pesó esta mañana — ¡buen trabajo!',
    },
    'action-none': {
      en: "Hope you're having a good morning.",
      es: 'Esperamos que esté teniendo un buen día.',
    },
    'time-of-day': {
      en: 'Good morning, Maria.',
      es: 'Buenos días, María.',
    },
  };
  return strings[variant][lang];
}

export function Dashboard() {
  const [lang] = useLanguage();

  const greetingVariant: GreetingVariant = 'action-recent'; // demo: pick action-recent

  return (
    <div className="pb-safe-8">
      {/* Greeting */}
      <div className="p-4">
        <h1 className="page-title">
          {lang === 'es' ? 'Bienvenida, María' : 'Welcome back, Maria'}
        </h1>
        <p className="text-sm text-sand-500 mt-1">
          {getGreetingSubline(greetingVariant, lang)}
        </p>
      </div>

      {/* Today's task */}
      <div className="px-4 pb-4">
        <h2 className="text-base font-serif font-medium text-sand-800 mb-3">
          {lang === 'es' ? 'Su revisión de hoy' : "Today's check-in"}
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
    </div>
  );
}
