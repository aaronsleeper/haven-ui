import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TaskCard } from '@haven/ui-react';
import { useLanguage } from '../../lib/useLanguage';
import { useAssessmentResponses } from '../../lib/useAssessmentResponses';
import {
  demoCareTeam,
  demoDates,
  demoMessageThread,
  demoPatient,
  MESSAGE_REPLY_KEY,
} from '../../lib/demo-patient';
import { GAD7_QUESTIONS } from '../gad-7/questions';

const DEMO_TASK = {
  name: { en: 'Anxiety check-in', es: 'Revisión de ansiedad' },
  meta: { en: '7 questions · about 2 minutes', es: '7 preguntas · unos 2 minutos' },
  icon: 'assignment',
  state: 'default' as const,
  href: '/assessment/gad-7',
};

export function Dashboard() {
  const [lang] = useLanguage();

  // Demo state — dashboard reflects two interactive moments:
  // 1. Message reply (Sarah → Maria) clears the "New" pill once Maria replies.
  // 2. GAD-7 check-in completion (7/7 answered) flips the task card to a
  //    "Done" state and adapts the greeting subline.
  const [hasReplied, setHasReplied] = useState(false);
  useEffect(() => {
    try {
      setHasReplied(localStorage.getItem(MESSAGE_REPLY_KEY) === 'yes');
    } catch {
      // localStorage unavailable — default to unread
    }
  }, []);

  const { responses } = useAssessmentResponses('gad-7');
  const checkInComplete = Object.keys(responses).length === GAD7_QUESTIONS.length;

  const patientName = demoPatient.firstName[lang];

  const greeting = lang === 'es' ? `Bienvenida, ${patientName}` : `Welcome back, ${patientName}`;
  const subline = checkInComplete
    ? lang === 'es'
      ? 'Su revisión está enviada. Su equipo le contactará si algo necesita atención.'
      : 'Your check-in is in. Your care team will follow up if anything stands out.'
    : lang === 'es'
      ? 'Esperamos que esté teniendo un buen día.'
      : "Hope you're having a good day.";

  return (
    <div className="pb-safe-8">
      {/* Greeting */}
      <div className="p-4">
        <h1 className="page-title">{greeting}</h1>
        <p className="text-sm text-sand-600 mt-1">{subline}</p>
      </div>

      {/* Today's task */}
      <div className="px-4 pb-4">
        <h2 className="text-base font-serif font-medium text-sand-800 mb-3">
          {lang === 'es' ? 'Su revisión de hoy' : "Today's check-in"}
        </h2>
        {checkInComplete ? (
          <div className="card">
            <div className="card-body flex items-start gap-3">
              <span
                className="material-symbols-outlined text-success-600 text-2xl mt-0.5"
                aria-hidden="true"
              >
                check_circle
              </span>
              <div>
                <p className="text-sm font-medium text-sand-800">
                  {DEMO_TASK.name[lang]}
                </p>
                <p className="text-xs text-sand-600 mt-0.5">
                  {lang === 'es'
                    ? 'Listo — su equipo de cuidado tiene sus respuestas.'
                    : 'Done — your care team has your responses.'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <TaskCard
            name={DEMO_TASK.name[lang]}
            meta={DEMO_TASK.meta[lang]}
            iconName={DEMO_TASK.icon}
            asComponent={Link}
            linkProps={{ to: DEMO_TASK.href }}
          />
        )}
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
                <p className="text-xs font-semibold text-sand-600 mb-1">
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
