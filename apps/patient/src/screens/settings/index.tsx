import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../lib/useLanguage';
import type { Language } from '../../lib/useLanguage';
import { demoCareTeam, demoPatient, PENDING, patientFullName } from '../../lib/demo-patient';

// Demo notification prefs (in production: loaded from user profile API)
interface NotifPrefs {
  push: boolean;
  delivery: boolean;
  checkIn: boolean;
}

export function Settings() {
  const [lang, setLang] = useLanguage();
  const [notifPrefs, setNotifPrefs] = useState<NotifPrefs>({
    push: true,
    delivery: true,
    checkIn: true,
  });
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);

  function handleLangChange(next: Language) {
    setLang(next);
  }

  function handleToggle(key: keyof NotifPrefs) {
    setNotifPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    // Production: POST to user profile API; revert + show alert-error on failure
  }

  function handleSignOut() {
    // v1: log to console; production: clear session + navigate to login
    console.info('[Settings] Sign out confirmed');
    setShowSignOutDialog(false);
  }

  return (
    <div className="pb-safe-8">
      {/* Header */}
      <div className="px-4 pt-4 pb-6">
        <h1 className="page-title">
          {lang === 'es' ? 'Ajustes' : 'Settings'}
        </h1>
        <p className="text-sm text-sand-600 mt-0.5">
          {lang === 'es'
            ? 'Actualice su idioma, lo que le enviamos y cómo contactarle.'
            : 'Update your language, what we send you, and how to reach you.'}
        </p>
      </div>

      <div className="px-4 space-y-4">
        {/* Section 1 — Language */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">{lang === 'es' ? 'Idioma' : 'Language'}</h2>
          </div>
          <div className="card-body">
            <div className="field-row">
              <label className="field-label">
                {lang === 'es' ? 'Idioma de la app' : 'App language'}
              </label>
              <div
                className="segmented-control"
                role="group"
                aria-label={lang === 'es' ? 'Idioma' : 'Language'}
              >
                <button
                  type="button"
                  className={`segmented-control-btn${lang === 'en' ? ' active' : ''}`}
                  onClick={() => handleLangChange('en')}
                  aria-pressed={lang === 'en'}
                >
                  English
                </button>
                <button
                  type="button"
                  className={`segmented-control-btn${lang === 'es' ? ' active' : ''}`}
                  onClick={() => handleLangChange('es')}
                  aria-pressed={lang === 'es'}
                >
                  Español
                </button>
              </div>
              <p className="field-help">
                {lang === 'es'
                  ? 'Sus mensajes y revisiones usarán este idioma.'
                  : 'Your messages and check-ins will use this language.'}
              </p>
            </div>
          </div>
        </div>

        {/* Section 2 — Notifications */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              {lang === 'es' ? 'Notificaciones' : 'Notifications'}
            </h2>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {/* Push notifications */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="toggle-label">
                    {lang === 'es' ? 'Notificaciones push' : 'Push notifications'}
                  </div>
                  <div className="toggle-description">
                    {lang === 'es'
                      ? 'Un aviso rápido cuando lleguen sus comidas o su equipo le responda.'
                      : 'A quick alert when your meals arrive or your team writes back.'}
                  </div>
                </div>
                <label className="toggle toggle-success shrink-0">
                  <input
                    type="checkbox"
                    role="switch"
                    checked={notifPrefs.push}
                    onChange={() => handleToggle('push')}
                    aria-checked={notifPrefs.push}
                  />
                  <span className="toggle-track" aria-hidden="true" />
                </label>
              </div>
              {/* Delivery updates */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="toggle-label">
                    {lang === 'es' ? 'Actualizaciones de entrega' : 'Delivery updates'}
                  </div>
                  <div className="toggle-description">
                    {lang === 'es'
                      ? 'Cuando sus comidas salen de la cocina y cuando llegan.'
                      : 'When your meals leave the kitchen and when they arrive.'}
                  </div>
                </div>
                <label className="toggle toggle-success shrink-0">
                  <input
                    type="checkbox"
                    role="switch"
                    checked={notifPrefs.delivery}
                    onChange={() => handleToggle('delivery')}
                    aria-checked={notifPrefs.delivery}
                  />
                  <span className="toggle-track" aria-hidden="true" />
                </label>
              </div>
              {/* Check-in reminders */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="toggle-label">
                    {lang === 'es' ? 'Recordatorios de revisión' : 'Check-in reminders'}
                  </div>
                  <div className="toggle-description">
                    {lang === 'es'
                      ? 'Un recordatorio semanal para contarnos cómo se siente.'
                      : "A weekly reminder to tell us how you're feeling."}
                  </div>
                </div>
                <label className="toggle toggle-success shrink-0">
                  <input
                    type="checkbox"
                    role="switch"
                    checked={notifPrefs.checkIn}
                    onChange={() => handleToggle('checkIn')}
                    aria-checked={notifPrefs.checkIn}
                  />
                  <span className="toggle-track" aria-hidden="true" />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3 — Account */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">{lang === 'es' ? 'Cuenta' : 'Account'}</h2>
          </div>
          <div className="card-body">
            <table className="kv-table w-full text-sm">
              <tbody>
                <tr><th scope="row">{lang === 'es' ? 'Nombre' : 'Name'}</th><td>{patientFullName(lang)}</td></tr>
                <tr><th scope="row">{lang === 'es' ? 'Correo' : 'Email'}</th><td>{demoPatient.email}</td></tr>
                <tr><th scope="row">{lang === 'es' ? 'Teléfono' : 'Phone'}</th><td>{demoPatient.phone}</td></tr>
              </tbody>
            </table>
            <div className="divider" />
            <p className="text-sm text-sand-600 mb-2">
              {lang === 'es'
                ? `Para cambiar su nombre, correo o teléfono, envíele un mensaje a ${demoCareTeam.coordinator.shortName}.`
                : `To change your name, email, or phone, send ${demoCareTeam.coordinator.shortName} a message.`}
              {' '}
              <Link to="/messages" className="text-link">
                {lang === 'es'
                  ? `Enviar mensaje a ${demoCareTeam.coordinator.shortName}`
                  : `Message ${demoCareTeam.coordinator.shortName}`}
              </Link>
            </p>
            <button
              type="button"
              className="btn-outline btn-block"
              onClick={() => setShowSignOutDialog(true)}
            >
              {lang === 'es' ? 'Cerrar sesión' : 'Sign out'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-sand-600 text-center pb-4">
          <a href={PENDING.privacyUrl.value} className="text-link">
            {lang === 'es' ? 'Privacidad' : 'Privacy'}
          </a>
          {' · '}
          <a href={PENDING.termsUrl.value} className="text-link">
            {lang === 'es' ? 'Términos' : 'Terms'}
          </a>
        </p>
      </div>

      {/* Sign-out confirm dialog */}
      {showSignOutDialog && (
        <div
          className="hs-overlay fixed inset-0 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="signout-title"
        >
          <div
            className="hs-overlay-backdrop absolute inset-0"
            onClick={() => setShowSignOutDialog(false)}
          />
          <div className="modal-panel relative z-10">
            <div className="card">
              <div className="card-body">
                <p id="signout-title" className="text-base font-semibold text-sand-900 mb-2">
                  {lang === 'es' ? '¿Cerrar sesión?' : 'Sign out?'}
                </p>
                <p className="text-sm text-sand-600 mb-4">
                  {lang === 'es'
                    ? 'Puede volver a iniciar sesión en cualquier momento con su teléfono o correo.'
                    : 'You can sign back in anytime with your phone or email.'}
                </p>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    className="btn-outline btn-sm"
                    onClick={() => setShowSignOutDialog(false)}
                  >
                    {lang === 'es' ? 'Cancelar' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    className="btn-primary btn-sm"
                    onClick={handleSignOut}
                  >
                    {lang === 'es' ? 'Cerrar sesión' : 'Sign out'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
