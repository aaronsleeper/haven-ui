import { Link } from 'react-router-dom';
import { Sparkline } from '@haven/ui-react';
import { useLanguage } from '../../lib/useLanguage';

interface TrendMetric {
  id: string;
  name: { en: string; es: string };
  trend: 'improving' | 'stable' | 'worsening';
  trendLabel: { en: string; es: string };
  lastUpdated: { en: string; es: string };
  assessmentHref: string;
  /** 6 weeks of mocked values for v1 demo. Scale arbitrary — sparkline axes hidden. */
  data: number[];
}

const DEMO_METRICS: TrendMetric[] = [
  {
    id: 'mood',
    name: { en: 'Mood', es: 'Estado de ánimo' },
    trend: 'improving',
    trendLabel: { en: 'Improving', es: 'Mejorando' },
    lastUpdated: { en: 'Updated 2 days ago', es: 'Actualizado hace 2 días' },
    assessmentHref: '/assessment/gad-7',
    data: [3, 3, 4, 5, 5, 6],
  },
  {
    id: 'energy',
    name: { en: 'Energy', es: 'Energía' },
    trend: 'stable',
    trendLabel: { en: 'Stable', es: 'Estable' },
    lastUpdated: { en: 'Updated 4 days ago', es: 'Actualizado hace 4 días' },
    assessmentHref: '/assessment/gad-7',
    data: [5, 4, 5, 5, 4, 5],
  },
  {
    id: 'meal-satisfaction',
    name: { en: 'Meal Satisfaction', es: 'Satisfacción con comidas' },
    trend: 'improving',
    trendLabel: { en: 'Improving', es: 'Mejorando' },
    lastUpdated: { en: 'Updated 2 days ago', es: 'Actualizado hace 2 días' },
    assessmentHref: '/assessment/phq-9',
    data: [4, 4, 5, 6, 7, 7],
  },
];

const TREND_CLASS_MAP = {
  improving: 'trend-badge trend-improving',
  stable: 'trend-badge trend-flat',
  worsening: 'trend-badge trend-worsening',
} as const;

const TREND_ICON_MAP = {
  improving: 'trending_up',
  stable: 'remove',
  worsening: 'trending_down',
} as const;

// Sparkline accent colors per trend direction. HSLA values mirror
// haven-chart-config.js HAVEN palette so the React port matches PL.
const TREND_COLOR_MAP = {
  improving: 'hsla(173, 38.5%, 35.1%, 1)', // HAVEN.primary[600] teal
  stable: 'hsla(26, 14.3%, 56.1%, 1)',     // HAVEN.sand[400] neutral
  worsening: 'hsla(2, 26%, 51.8%, 1)',     // HAVEN.danger[600]
} as const;

export function MyHealth() {
  const [lang] = useLanguage();

  return (
    <div className="pb-safe-8">
      {/* Header */}
      <div className="p-4">
        <h1 className="page-title">
          {lang === 'es' ? 'Mi Salud' : 'My Health'}
        </h1>
        <p className="text-sm text-sand-600 mt-1">
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
                  <span className="material-symbols-outlined" aria-hidden="true">{TREND_ICON_MAP[metric.trend]}</span>
                  {metric.trendLabel[lang]}
                </span>
              </div>
              <div className="trend-card-chart">
                <Sparkline
                  data={metric.data}
                  color={TREND_COLOR_MAP[metric.trend]}
                  ariaLabel={`${metric.name[lang]} sparkline: ${metric.trendLabel[lang]}`}
                />
              </div>
              <p className="text-xs text-sand-600 mt-2">{metric.lastUpdated[lang]}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
