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
