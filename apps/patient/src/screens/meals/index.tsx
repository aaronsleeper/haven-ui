import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MealDeliveryCard, type MealDeliveryTag } from '@haven/ui-react';
import { useLanguage } from '../../lib/useLanguage';
import type { Language } from '../../lib/useLanguage';

// MEALS-01 view + confirm + swap weekly meals.
// Per Lab/haven-ui/.project-docs/wireframes/meals-01-weekly-meals.md.
// Demo state: starts unconfirmed; Confirm flips banner to success and hides
// the sticky CTA. Swap buttons log to console for v1 (bottom-sheet substitute
// picker deferred to v1.1).

type OrderState = 'unconfirmed' | 'confirmed' | 'auto-confirmed';

interface DemoMeal {
  id: string;
  imgSrc: string;
  imgAlt: { en: string; es: string };
  name: { en: string; es: string };
  day: { en: string; es: string };
  tags: { variant: MealDeliveryTag['variant']; label: { en: string; es: string } }[];
}

const DEMO_MEALS: DemoMeal[] = [
  {
    id: 'mon',
    imgSrc: 'https://picsum.photos/seed/cena-chicken-verde/240/240',
    imgAlt: { en: 'Chicken Verde with rice and beans', es: 'Pollo verde con arroz y frijoles' },
    name: { en: 'Chicken Verde', es: 'Pollo Verde' },
    day: { en: 'Monday', es: 'Lunes' },
    tags: [
      { variant: 'info', label: { en: 'Low sodium', es: 'Bajo en sodio' } },
      { variant: 'secondary', label: { en: 'Diabetic-friendly', es: 'Para diabetes' } },
    ],
  },
  {
    id: 'tue',
    imgSrc: 'https://picsum.photos/seed/cena-lemon-salmon/240/240',
    imgAlt: { en: 'Lemon salmon with quinoa', es: 'Salmón al limón con quinoa' },
    name: { en: 'Lemon Salmon', es: 'Salmón al limón' },
    day: { en: 'Tuesday', es: 'Martes' },
    tags: [
      { variant: 'info', label: { en: 'Heart-healthy', es: 'Saludable para el corazón' } },
    ],
  },
  {
    id: 'wed',
    imgSrc: 'https://picsum.photos/seed/cena-tofu-noodles/240/240',
    imgAlt: { en: 'Tofu noodle bowl with broccoli', es: 'Tazón de fideos con tofu y brócoli' },
    name: { en: 'Tofu Noodle Bowl', es: 'Tazón de fideos con tofu' },
    day: { en: 'Wednesday', es: 'Miércoles' },
    tags: [
      { variant: 'info', label: { en: 'Low sodium', es: 'Bajo en sodio' } },
      { variant: 'neutral', label: { en: 'Vegetarian', es: 'Vegetariano' } },
    ],
  },
  {
    id: 'thu',
    imgSrc: 'https://picsum.photos/seed/cena-beef-stirfry/240/240',
    imgAlt: { en: 'Beef stir-fry with vegetables', es: 'Salteado de res con verduras' },
    name: { en: 'Beef Stir-fry', es: 'Salteado de res' },
    day: { en: 'Thursday', es: 'Jueves' },
    tags: [
      { variant: 'secondary', label: { en: 'Diabetic-friendly', es: 'Para diabetes' } },
    ],
  },
  {
    id: 'fri',
    imgSrc: 'https://picsum.photos/seed/cena-turkey-chili/240/240',
    imgAlt: { en: 'Turkey chili with side salad', es: 'Chili de pavo con ensalada' },
    name: { en: 'Turkey Chili', es: 'Chili de pavo' },
    day: { en: 'Friday', es: 'Viernes' },
    tags: [
      { variant: 'info', label: { en: 'High protein', es: 'Alto en proteína' } },
      { variant: 'info', label: { en: 'Low sodium', es: 'Bajo en sodio' } },
    ],
  },
];

const STATUS_COPY = {
  unconfirmed: {
    icon: 'schedule',
    classes: 'bg-warning-50 border border-warning-200 text-warning-700',
    text: {
      en: 'Please confirm your meals by Wednesday at 5pm.',
      es: 'Por favor confirme sus comidas antes del miércoles a las 5pm.',
    },
  },
  confirmed: {
    icon: 'check_circle',
    classes: 'bg-success-50 border border-success-200 text-success-700',
    text: {
      en: 'Your meals are confirmed. Delivery on Monday.',
      es: 'Sus comidas están confirmadas. Entrega el lunes.',
    },
  },
  'auto-confirmed': {
    icon: 'info',
    classes: 'bg-info-50 border border-info-200 text-info-700',
    text: {
      en: 'Your meals were automatically confirmed. Delivery on Monday.',
      es: 'Sus comidas fueron confirmadas automáticamente. Entrega el lunes.',
    },
  },
} as const;

const SUBTITLE_COPY: Record<OrderState, { en: string; es: string }> = {
  unconfirmed: {
    en: 'Confirm by Wednesday at 5pm',
    es: 'Confirme antes del miércoles a las 5pm',
  },
  confirmed: {
    en: 'Confirmed for delivery Monday',
    es: 'Confirmado para entrega el lunes',
  },
  'auto-confirmed': {
    en: 'Auto-confirmed for delivery Monday',
    es: 'Confirmado automáticamente para el lunes',
  },
};

export function Meals() {
  const [lang] = useLanguage();
  const [orderState, setOrderState] = useState<OrderState>('unconfirmed');

  function handleSwap(mealId: string, mealName: string) {
    // v1: log to console; production: open substitute bottom sheet
    console.info(`[Meals] Swap requested for ${mealName} (id: ${mealId})`);
  }

  function handleConfirm() {
    setOrderState('confirmed');
    console.info('[Meals] Order confirmed');
  }

  const status = STATUS_COPY[orderState];
  const subtitle = SUBTITLE_COPY[orderState];
  const showConfirmCta = orderState === 'unconfirmed';

  return (
    <div className="pb-safe-8">
      <div className="p-4">
        <h1 className="page-title">{lang === 'es' ? 'Sus Comidas' : 'Your Meals'}</h1>
        <p className="text-sm text-sand-500 mt-1">{subtitle[lang as Language]}</p>
      </div>

      {/* Status banner */}
      <div className="px-4 pb-4">
        <div className={`flex items-start gap-3 p-3 rounded-lg text-sm ${status.classes}`} role="status">
          <span className="material-symbols-outlined mt-0.5" aria-hidden="true">{status.icon}</span>
          <span>{status.text[lang as Language]}</span>
        </div>
      </div>

      {/* Meal list */}
      <div className="px-4 space-y-3">
        {DEMO_MEALS.map((meal) => (
          <MealDeliveryCard
            key={meal.id}
            imgSrc={meal.imgSrc}
            imgAlt={meal.imgAlt[lang as Language]}
            name={meal.name[lang as Language]}
            day={meal.day[lang as Language]}
            tags={meal.tags.map((t) => ({
              variant: t.variant,
              label: t.label[lang as Language],
            }))}
            onSwap={
              orderState === 'unconfirmed'
                ? () => handleSwap(meal.id, meal.name[lang as Language])
                : undefined
            }
            swapLabel={lang === 'es' ? 'Cambiar comida' : 'Swap meal'}
            swappedLabel={lang === 'es' ? 'Cambiada' : 'Swapped'}
          />
        ))}
      </div>

      {/* Care team contact shortcut */}
      <div className="px-4 pt-4">
        <div className="card bg-primary-50 border border-primary-100">
          <div className="card-body flex items-start gap-3">
            <span className="material-symbols-outlined text-primary-600 text-lg mt-0.5" aria-hidden="true">chat_bubble</span>
            <div>
              <p className="text-sm text-sand-800 mb-1">
                {lang === 'es'
                  ? '¿Tiene una pregunta sobre sus comidas?'
                  : 'Have a question about your meals?'}
              </p>
              <Link to="/messages" className="text-sm text-primary-700 font-medium">
                {lang === 'es' ? 'Envíe un mensaje a su equipo' : 'Message your care team'}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Confirm CTA */}
      {showConfirmCta && (
        <div className="sticky bottom-0 bg-white border-t border-sand-200 px-4 pt-3 pb-safe-4 mt-4">
          <button type="button" className="btn-primary btn-block" onClick={handleConfirm}>
            {lang === 'es' ? 'Confirmar mis comidas' : 'Confirm my meals'}
          </button>
        </div>
      )}
    </div>
  );
}
