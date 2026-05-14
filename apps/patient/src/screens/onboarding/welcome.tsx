import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../lib/useLanguage';

// Onboarding step 1 — welcome + password setup. Mirror of onb-01-welcome
// wireframe. Stateful: tracks password + confirm; Continue enables only
// when both filled, length ≥ 8, and matching.

const MIN_PASSWORD_LENGTH = 8;

export function Welcome() {
  const [lang] = useLanguage();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState<{ password: boolean; confirm: boolean }>({
    password: false,
    confirm: false,
  });

  const passwordTooShort = touched.password && password.length > 0 && password.length < MIN_PASSWORD_LENGTH;
  const passwordOk = password.length >= MIN_PASSWORD_LENGTH;
  const passwordsMismatch = touched.confirm && confirm.length > 0 && confirm !== password;
  const passwordsMatch = passwordOk && confirm.length > 0 && confirm === password;
  const canContinue = passwordOk && confirm === password;

  function handleContinue() {
    if (!canContinue) return;
    // v1: log; production: POST credentials to auth API
    console.info('[Onboarding/Welcome] Continue with password set');
    navigate('/onboarding/consent');
  }

  return (
    <div className="flex flex-col min-h-dvh">
      <div className="p-4">
        <p
          className="onb-progress text-center text-xs text-sand-500"
          aria-label={lang === 'es' ? 'Paso 1 de 3' : 'Step 1 of 3'}
        >
          {lang === 'es' ? 'Paso 1 de 3' : 'Step 1 of 3'}
        </p>
        <h1 className="page-title mt-3">
          {lang === 'es' ? 'Bienvenida a Cena Health' : 'Welcome to Cena Health'}
        </h1>
        <p className="text-sm text-sand-500 mt-1">
          {lang === 'es'
            ? 'Sus comidas y equipo de cuidado están listos. Vamos a configurar su cuenta.'
            : "Your meals and care team are ready. Let's set up your account."}
        </p>
      </div>

      <div className="flex-1 px-4">
        <div className="card">
          <div className="card-body">
            {/* Password */}
            <div className={`field-row${passwordTooShort ? ' field-row-error' : ''}`}>
              <label className="field-label" htmlFor="onb-password">
                {lang === 'es' ? 'Cree una contraseña' : 'Create a password'}
              </label>
              <div className="field-body">
                <div className="field-input-group">
                  <input
                    id="onb-password"
                    type={showPassword ? 'text' : 'password'}
                    className="w-full rounded-lg border border-sand-200 px-3 py-2 text-base pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                    autoComplete="new-password"
                    aria-describedby="onb-password-help onb-password-error"
                    aria-invalid={passwordTooShort}
                  />
                  <button
                    type="button"
                    className="field-addon absolute right-2 top-1/2 -translate-y-1/2 text-sand-500"
                    aria-label={
                      showPassword
                        ? lang === 'es' ? 'Ocultar contraseña' : 'Hide password'
                        : lang === 'es' ? 'Mostrar contraseña' : 'Show password'
                    }
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    <span className="material-symbols-outlined" aria-hidden="true">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                <p id="onb-password-help" className="field-help">
                  {lang === 'es' ? 'Al menos 8 caracteres' : 'At least 8 characters'}
                </p>
                {passwordTooShort && (
                  <p id="onb-password-error" className="field-error">
                    {lang === 'es'
                      ? 'Muy corta — necesita al menos 8 caracteres'
                      : 'Too short — needs at least 8 characters'}
                  </p>
                )}
                {passwordOk && (
                  <p className="flex items-center gap-1 text-xs text-success-600 mt-1">
                    <span
                      className="material-symbols-outlined text-base"
                      aria-hidden="true"
                    >
                      check
                    </span>
                    {lang === 'es' ? 'Bien' : 'Looks good'}
                  </p>
                )}
              </div>
            </div>

            {/* Confirm */}
            <div className={`field-row mt-4${passwordsMismatch ? ' field-row-error' : ''}`}>
              <label className="field-label" htmlFor="onb-confirm">
                {lang === 'es' ? 'Confirme la contraseña' : 'Confirm password'}
              </label>
              <div className="field-body">
                <div className="field-input-group">
                  <input
                    id="onb-confirm"
                    type={showConfirm ? 'text' : 'password'}
                    className="w-full rounded-lg border border-sand-200 px-3 py-2 text-base pr-10"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
                    autoComplete="new-password"
                    aria-describedby="onb-confirm-error"
                    aria-invalid={passwordsMismatch}
                  />
                  <button
                    type="button"
                    className="field-addon absolute right-2 top-1/2 -translate-y-1/2 text-sand-500"
                    aria-label={
                      showConfirm
                        ? lang === 'es' ? 'Ocultar contraseña' : 'Hide password'
                        : lang === 'es' ? 'Mostrar contraseña' : 'Show password'
                    }
                    aria-pressed={showConfirm}
                    onClick={() => setShowConfirm((s) => !s)}
                  >
                    <span className="material-symbols-outlined" aria-hidden="true">
                      {showConfirm ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {passwordsMismatch && (
                  <p id="onb-confirm-error" className="field-error">
                    {lang === 'es'
                      ? 'Las contraseñas no coinciden'
                      : "Passwords don't match"}
                  </p>
                )}
                {passwordsMatch && (
                  <p className="flex items-center gap-1 text-xs text-success-600 mt-1">
                    <span
                      className="material-symbols-outlined text-base"
                      aria-hidden="true"
                    >
                      check
                    </span>
                    {lang === 'es' ? 'Coinciden' : 'Passwords match'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-safe-4">
        <button
          type="button"
          className="btn-primary btn-block"
          onClick={handleContinue}
          disabled={!canContinue}
          aria-disabled={!canContinue}
        >
          {lang === 'es' ? 'Continuar' : 'Continue'}
        </button>
        <p className="text-xs text-sand-400 text-center mt-3">
          {lang === 'es'
            ? '¿Necesita ayuda? Llámenos: (555) 123-CENA'
            : 'Need help? Call us: (555) 123-CENA'}
        </p>
      </div>
    </div>
  );
}
