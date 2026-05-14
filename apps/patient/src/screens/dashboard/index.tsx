import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TaskCard } from '@haven/ui-react';
import { useLanguage } from '../../lib/useLanguage';
import {
  demoCareTeam,
  demoDates,
  demoMessageThread,
  demoPatient,
  MESSAGE_REPLY_KEY,
} from '../../lib/demo-patient';

const DEMO_TASK = {
  name: { en: 'Anxiety check-in', es: 'Revisión de ansiedad' },
  meta: { en: '7 questions · about 2 minutes', es: '7 preguntas · unos 2 minutos' },
  icon: 'assignment',
  state: 'default' as const,
  href: '/assessment/gad-7',
};

type GreetingVariant = 'action-recent' | 'action-none' | 'time-of-day';

function getGreetingSubline(variant: GreetingVariant, lang: 'en' | 'es'): string {
  const strings = {
    'action-recent': {
      en: "It's a sunny Friday. You logged your weekly check-in this morning — great job.",
      es: 'Es un viernes soleado. Envió su revisión semanal esta mañana — ¡buen trabajo!',
    },
    'action-none': {
      en: "Hope you're having a good morning.",
      es: 'Esperamos que esté teniendo un buen día.',
    },
    'time-of-day': {
      en: 'Good morning.',
      es: 'Buenos días.',
    },
  };
  return strings[variant][lang];
}

export function Dashboard() {
  const [lang] = useLanguage();

  // Read message-reply state from localStorage so the dashboard reflects
  // whether the patient has already replied to Sarah in this demo session.
  const [hasReplied, setHasReplied] = useState(false);
  useEffect(() => {
    try {
      setHasReplied(localStorage.getItem(MESSAGE_REPLY_KEY) === 'yes');
    } catch {
      // localStorage unavailable — default to unread
    }
  }, []);

  const greetingVariant: GreetingVariant = 'action-recent';
  const patientName = demoPatient.firstName[lang];

  return (
    <div className="pb-safe-8">
      {/* Greeting */}
      <div className="p-4">
        <h1 className="page-title">
          {lang === 'es' ? `Bienvenida, ${patientName}` : `Welcome back, ${patientName}`}
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
          iconName={DEMO_TASK.icon}
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
                  {lang === 'es'
                    ? `${demoCareTeam.coordinator.shortName}, Coordinadora`
                    : `${demoCareTeam.coordinator.shortName}, Care Coordinator`}
                </p>
                <p className="text-sm text-sand-800 line-clamp-2">
                  {demoMessageThread.coordinatorLatest[lang]}
                </p>
              </div>
              {!hasReplied && (
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
              <span className="material-symbols-outlined" aria-hidden="true">local_shipping</span>
            </div>
            <div>
              <div className="delivery-status-label">
                {lang === 'es' ? 'Próxima entrega' : 'Next delivery'}
              </div>
              <div className="delivery-status-timing">
                {demoDates.mealDeliveryDate[lang]}
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
