import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@haven/ui-react';
import { useLanguage } from '../../lib/useLanguage';
import type { Language } from '../../lib/useLanguage';

// Onboarding step 3 — preferences. Mirror of onb-03-preferences wireframe.
// Single scrollable page: Language → Food → Communication. All sections
// optional; All done proceeds with defaults applied for any unselected.
// Food category images skipped at v1 per 2026-05-13 decision — icons only.

type CuisineId = 'latin' | 'soul' | 'mediterranean' | 'asian' | 'no-preference';
type ContactMethod = 'phone' | 'text' | 'app';
type TimeWindow = 'morning' | 'afternoon' | 'evening';

interface CuisineCopy {
  id: CuisineId;
  label: { en: string; es: string };
  icon: string;
}

// `icon` is a Material Symbols Outlined glyph name.
const CUISINES: CuisineCopy[] = [
  { id: 'latin', label: { en: 'Latin American', es: 'Latinoamericana' }, icon: 'local_fire_department' },
  { id: 'soul', label: { en: 'Soul Food', es: 'Comida del sur' }, icon: 'kebab_dining' },
  { id: 'mediterranean', label: { en: 'Mediterranean', es: 'Mediterránea' }, icon: 'eco' },
  { id: 'asian', label: { en: 'Asian', es: 'Asiática' }, icon: 'lunch_dining' },
  { id: 'no-preference', label: { en: 'No preference', es: 'Sin preferencia' }, icon: 'done_all' },
];

const CONTACT_METHODS: { id: ContactMethod; label: { en: string; es: string }; icon: string }[] = [
  { id: 'phone', label: { en: 'Phone', es: 'Llamada' }, icon: 'call' },
  { id: 'text', label: { en: 'Text', es: 'Mensaje' }, icon: 'sms' },
  { id: 'app', label: { en: 'App only', es: 'Solo app' }, icon: 'notifications' },
];

const TIME_WINDOWS: { id: TimeWindow; label: { en: string; es: string } }[] = [
  { id: 'morning', label: { en: 'Morning (8am–12pm)', es: 'Mañana (8am–12pm)' } },
  { id: 'afternoon', label: { en: 'Afternoon (12pm–5pm)', es: 'Tarde (12pm–5pm)' } },
  { id: 'evening', label: { en: 'Evening (5pm–8pm)', es: 'Noche (5pm–8pm)' } },
];

export function Preferences() {
  const [lang, setLang] = useLanguage();
  const navigate = useNavigate();

  const [cuisines, setCuisines] = useState<Set<CuisineId>>(new Set());
  const [contactMethod, setContactMethod] = useState<ContactMethod | null>(null);
  const [timeWindows, setTimeWindows] = useState<Set<TimeWindow>>(new Set());

  function toggleCuisine(id: CuisineId) {
    setCuisines((prev) => {
      const next = new Set(prev);
      if (id === 'no-preference') {
        // Exclusive: tapping "No preference" clears all cuisines
        return next.has('no-preference') ? new Set() : new Set(['no-preference']);
      }
      // Tapping any cuisine deselects "No preference"
      next.delete('no-preference');
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleTimeWindow(id: TimeWindow) {
    setTimeWindows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleAllDone() {
    // v1: log; production: POST to preferences API + auto-apply defaults for unset
    console.info('[Onboarding/Preferences] Submit', {
      lang,
      cuisines: Array.from(cuisines),
      contactMethod,
      timeWindows: Array.from(timeWindows),
    });
    navigate('/');
  }

  return (
    <div className="flex flex-col min-h-dvh">
      <div className="flex items-center px-4 pt-4 pb-2">
        <IconButton
          icon="chevron_left"
          ariaLabel={lang === 'es' ? 'Volver' : 'Go back'}
          asComponent="button"
          linkProps={{ type: 'button', onClick: () => navigate('/onboarding/consent') }}
        />
      </div>

      <div className="px-4 pb-2">
        <p
          className="onb-progress text-center text-xs text-sand-500"
          aria-label={lang === 'es' ? 'Paso 3 de 3' : 'Step 3 of 3'}
        >
          {lang === 'es' ? 'Paso 3 de 3' : 'Step 3 of 3'}
        </p>
        <h1 className="page-title mt-3">
          {lang === 'es' ? 'Personalicemos su experiencia' : "Let's personalize your experience"}
        </h1>
        <p className="text-sm text-sand-500 mt-1">
          {lang === 'es'
            ? 'Siempre puede actualizarlos después.'
            : 'You can always update these later.'}
        </p>
      </div>

      <div className="flex-1 px-4 pt-2 space-y-6">
        {/* Section 1 — Language */}
        <fieldset>
          <legend className="text-sm font-semibold text-sand-800 mb-2">
            {lang === 'es' ? 'Su idioma preferido' : 'Your preferred language'}
          </legend>
          <div className="grid grid-cols-2 gap-3">
            {(['en', 'es'] as const).map((opt) => (
              <label
                key={opt}
                className={`radio-label cursor-pointer flex items-center justify-center p-4 rounded-lg border text-sm ${
                  lang === opt ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-sand-200 text-sand-700'
                }`}
              >
                <input
                  type="radio"
                  name="lang"
                  value={opt}
                  checked={lang === opt}
                  onChange={() => setLang(opt)}
                  className="sr-only"
                />
                {opt === 'en' ? 'English' : 'Español'}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="divider" />

        {/* Section 2 — Food preferences (icons only at v1) */}
        <fieldset>
          <legend className="text-sm font-semibold text-sand-800">
            {lang === 'es' ? '¿Qué tipo de comida le hace sentir en casa?' : 'What kind of food feels like home?'}
          </legend>
          <p className="text-xs text-sand-500 mt-1 mb-3">
            {lang === 'es'
              ? 'Usaremos esto para personalizar sus comidas. Puede elegir más de una.'
              : "We'll use this to personalize your meals. You can pick more than one."}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {CUISINES.map((c) => {
              const selected = cuisines.has(c.id);
              return (
                <label
                  key={c.id}
                  className={`cursor-pointer flex flex-col items-center justify-center gap-2 p-4 rounded-lg border text-sm text-center ${
                    selected ? 'border-primary-600 bg-primary-50' : 'border-sand-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    name="cuisine"
                    value={c.id}
                    checked={selected}
                    onChange={() => toggleCuisine(c.id)}
                    className="sr-only"
                  />
                  <span
                    className={`material-symbols-outlined text-2xl ${selected ? 'text-primary-700' : 'text-sand-500'}`}
                    aria-hidden="true"
                  >
                    {c.icon}
                  </span>
                  <span className={selected ? 'text-primary-700 font-medium' : 'text-sand-700'}>
                    {c.label[lang as Language]}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="divider" />

        {/* Section 3 — Communication */}
        <fieldset>
          <legend className="text-sm font-semibold text-sand-800 mb-2">
            {lang === 'es' ? '¿Cómo nos contactamos con usted?' : 'How should we reach you?'}
          </legend>

          <p className="text-xs text-sand-500 mb-2">
            {lang === 'es' ? 'Método de contacto preferido' : 'Preferred contact method'}
          </p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {CONTACT_METHODS.map((m) => {
              const selected = contactMethod === m.id;
              return (
                <label
                  key={m.id}
                  className={`cursor-pointer flex flex-col items-center justify-center gap-1 p-3 rounded-lg border text-xs text-center ${
                    selected ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-sand-200 text-sand-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="contact-method"
                    value={m.id}
                    checked={selected}
                    onChange={() => setContactMethod(m.id)}
                    className="sr-only"
                  />
                  <span className="material-symbols-outlined text-lg" aria-hidden="true">{m.icon}</span>
                  <span>{m.label[lang as Language]}</span>
                </label>
              );
            })}
          </div>

          <p className="text-xs text-sand-500 mb-2">
            {lang === 'es' ? 'Mejores horarios para contactarle' : 'Best times to reach you'}
          </p>
          <div className="space-y-2">
            {TIME_WINDOWS.map((t) => {
              const selected = timeWindows.has(t.id);
              return (
                <label
                  key={t.id}
                  className={`cursor-pointer flex items-center gap-3 p-3 rounded-lg border text-sm ${
                    selected ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-sand-200 text-sand-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    name="time-window"
                    value={t.id}
                    checked={selected}
                    onChange={() => toggleTimeWindow(t.id)}
                    className="sr-only"
                  />
                  <span
                    className="material-symbols-outlined text-base"
                    aria-hidden="true"
                  >
                    {selected ? 'check_box' : 'crop_square'}
                  </span>
                  <span>{t.label[lang as Language]}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div className="px-4 pt-4 pb-safe-4">
        <button type="button" className="btn-primary btn-block" onClick={handleAllDone}>
          {lang === 'es' ? 'Listo' : 'All done'}
        </button>
        <p className="text-xs text-sand-400 text-center mt-3">
          {lang === 'es'
            ? 'Está bien saltar — usaremos predeterminados y puede actualizar cuando quiera.'
            : "Skipping is okay — we'll use defaults and you can update anytime."}
        </p>
      </div>
    </div>
  );
}
