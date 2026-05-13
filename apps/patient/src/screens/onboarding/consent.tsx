import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconButton } from '@haven/ui-react';
import { useLanguage } from '../../lib/useLanguage';
import type { Language } from '../../lib/useLanguage';

// Onboarding step 2 — consent. Mirror of onb-02-consent wireframe.
// Three stages walked one at a time:
//   A — HIPAA Authorization
//   B — Program Participation
//   C — Voice Call Preferences (reframed from AVA opt-out; voice calls are
//        from human care coordinators only at v1)

type Stage = 'A' | 'B' | 'C';
type VoiceCallChoice = 'yes' | 'no';

interface StageCopy {
  label: { en: string; es: string };
  headline: { en: string; es: string };
  summary: { en: string; es: string };
  fullText: { en: string; es: string };
  buttonLabel: { en: string; es: string };
  ariaLabel: { en: string; es: string };
}

const STAGE_COPY: Record<Stage, StageCopy> = {
  A: {
    label: { en: 'HIPAA Authorization', es: 'Autorización HIPAA' },
    headline: { en: 'Your health information', es: 'Su información de salud' },
    summary: {
      en: 'We will share your health information with your care team to help you eat well, feel better, and stay healthy. Your information is private.',
      es: 'Compartiremos su información de salud con su equipo de cuidado para ayudarle a comer bien, sentirse mejor y mantenerse saludable. Su información es privada.',
    },
    fullText: {
      en: '[Full HIPAA authorization text pending legal review. This placeholder will be replaced before any patient-facing use.]',
      es: '[Texto completo de autorización HIPAA pendiente de revisión legal. Este marcador será reemplazado antes de cualquier uso con pacientes.]',
    },
    buttonLabel: { en: 'I agree', es: 'Acepto' },
    ariaLabel: { en: 'I agree to HIPAA Authorization', es: 'Acepto la Autorización HIPAA' },
  },
  B: {
    label: { en: 'Program Participation', es: 'Participación en el programa' },
    headline: { en: 'Joining the program', es: 'Unirse al programa' },
    summary: {
      en: "Joining the program means we'll send you meals, check in on your progress, and stay in touch with your care team. You can stop at any time.",
      es: 'Unirse al programa significa que le enviaremos comidas, revisaremos su progreso y nos mantendremos en contacto con su equipo. Puede detenerse en cualquier momento.',
    },
    fullText: {
      en: '[Full Program Participation Agreement pending legal review.]',
      es: '[Acuerdo completo de Participación en el Programa pendiente de revisión legal.]',
    },
    buttonLabel: { en: 'I agree', es: 'Acepto' },
    ariaLabel: {
      en: 'I agree to Program Participation Agreement',
      es: 'Acepto el Acuerdo de Participación en el Programa',
    },
  },
  C: {
    label: { en: 'Voice Call Preferences', es: 'Preferencias de llamadas' },
    headline: { en: 'Voice calls from your care team', es: 'Llamadas de su equipo de cuidado' },
    summary: {
      en: 'Your care coordinator may call you sometimes — about appointments, deliveries, or check-ins. You can opt out and keep using the app and messages instead.',
      es: 'Su coordinadora puede llamarle a veces — sobre citas, entregas o revisiones. Puede optar por no recibir llamadas y seguir usando la app y los mensajes.',
    },
    fullText: { en: '', es: '' },
    buttonLabel: { en: 'Continue', es: 'Continuar' },
    ariaLabel: { en: 'Save voice call preference and continue', es: 'Guardar preferencia y continuar' },
  },
};

const STAGE_ORDER: Stage[] = ['A', 'B', 'C'];

export function Consent() {
  const [lang] = useLanguage();
  const navigate = useNavigate();

  const [stage, setStage] = useState<Stage>('A');
  const [voiceCallChoice, setVoiceCallChoice] = useState<VoiceCallChoice>('yes');
  const [accordionOpen, setAccordionOpen] = useState(false);

  const copy = STAGE_COPY[stage];
  const idx = STAGE_ORDER.indexOf(stage);

  function handleAgree() {
    // v1: log decision; production: POST to consents API
    if (stage === 'A' || stage === 'B') {
      console.info(`[Onboarding/Consent] Stage ${stage}: agreed`);
    } else {
      console.info(`[Onboarding/Consent] Voice call preference: ${voiceCallChoice}`);
    }

    if (stage === 'C') {
      navigate('/onboarding/preferences');
      return;
    }
    setAccordionOpen(false);
    setStage(STAGE_ORDER[idx + 1]!);
  }

  function handleBack() {
    setAccordionOpen(false);
    if (idx === 0) {
      navigate('/onboarding/welcome');
      return;
    }
    setStage(STAGE_ORDER[idx - 1]!);
  }

  return (
    <main className="flex flex-col min-h-dvh" aria-label="Onboarding — consent">
      <div className="flex items-center px-4 pt-4 pb-2">
        <IconButton
          icon="fa-solid fa-chevron-left"
          ariaLabel={lang === 'es' ? 'Volver' : 'Go back'}
          asComponent="button"
          linkProps={{ type: 'button', onClick: handleBack }}
        />
      </div>

      <div className="px-4 pb-2">
        <p
          className="onb-progress text-center text-xs text-sand-500"
          aria-label={lang === 'es' ? 'Paso 2 de 3' : 'Step 2 of 3'}
        >
          {lang === 'es' ? 'Paso 2 de 3' : 'Step 2 of 3'}
        </p>
        <p className="text-xs uppercase tracking-wide text-sand-500 mt-3">
          {copy.label[lang as Language]}
        </p>
        <h1 className="page-title mt-1">{copy.headline[lang as Language]}</h1>
        <p className="text-base text-sand-700 mt-2">{copy.summary[lang as Language]}</p>
      </div>

      <div className="flex-1 px-4 pt-2">
        {stage === 'C' ? (
          // Voice call radio options
          <fieldset className="card">
            <legend className="sr-only">
              {lang === 'es' ? 'Preferencia de llamadas' : 'Voice call preference'}
            </legend>
            <div className="card-body space-y-3">
              <label
                className={`radio-label cursor-pointer flex items-start gap-3 p-3 rounded-lg border ${
                  voiceCallChoice === 'yes' ? 'border-primary-600 bg-primary-50' : 'border-sand-200'
                }`}
              >
                <input
                  type="radio"
                  name="voice-call"
                  value="yes"
                  checked={voiceCallChoice === 'yes'}
                  onChange={() => setVoiceCallChoice('yes')}
                  className="mt-0.5"
                />
                <span className="text-sm text-sand-800">
                  {lang === 'es'
                    ? 'Sí, está bien que mi equipo me llame'
                    : 'Yes, calls from my care team are okay'}
                </span>
              </label>
              <label
                className={`radio-label cursor-pointer flex items-start gap-3 p-3 rounded-lg border ${
                  voiceCallChoice === 'no' ? 'border-primary-600 bg-primary-50' : 'border-sand-200'
                }`}
              >
                <input
                  type="radio"
                  name="voice-call"
                  value="no"
                  checked={voiceCallChoice === 'no'}
                  onChange={() => setVoiceCallChoice('no')}
                  className="mt-0.5"
                />
                <span className="text-sm text-sand-800">
                  {lang === 'es'
                    ? 'No, por favor no me llamen — usaré la app y los mensajes'
                    : "No, please don't call me — I'll use the app and messages"}
                </span>
              </label>
            </div>
            <p className="px-4 pb-4 text-xs text-sand-500">
              {lang === 'es'
                ? 'Cualquier opción está bien. Puede cambiarlo en cualquier momento en Ajustes.'
                : 'Either choice is fine. You can change this anytime in Settings.'}
            </p>
          </fieldset>
        ) : (
          // Accordion for full text (stages A and B)
          <div className="hs-accordion">
            <button
              type="button"
              className="hs-accordion-toggle flex items-center gap-2 text-sm text-primary-600 underline"
              aria-expanded={accordionOpen}
              onClick={() => setAccordionOpen((o) => !o)}
            >
              {lang === 'es' ? 'Leer el texto completo' : 'Read the full text'}
              <i
                className={`fa-solid fa-chevron-${accordionOpen ? 'up' : 'down'} text-xs`}
                aria-hidden="true"
              />
            </button>
            {accordionOpen && (
              <div className="mt-3 p-4 bg-sand-50 rounded-lg text-sm text-sand-600 max-h-64 overflow-y-auto">
                {copy.fullText[lang as Language]}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="px-4 pb-safe-4">
        <button
          type="button"
          className="btn-primary btn-block"
          onClick={handleAgree}
          aria-label={copy.ariaLabel[lang as Language]}
        >
          {copy.buttonLabel[lang as Language]}
        </button>
        {(stage === 'A' || stage === 'B') && (
          <p className="text-xs text-sand-400 text-center mt-3">
            {lang === 'es'
              ? "Al tocar 'Acepto', confirma que ha leído y entendido lo anterior."
              : "By tapping 'I agree', you confirm you have read and understood the above."}
          </p>
        )}
      </div>
    </main>
  );
}

// Suppress unused-import warning until other utilities arrive.
void Link;
