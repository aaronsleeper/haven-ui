// apps/patient/src/components/I18nBar.tsx
// Persistent fixed-top language toggle bar for the patient app.
// Uses `mobile-i18n-bar` + `mobile-i18n-toggle` semantic classes from the PL.
// Cena Health logo at left (~24px tall); EN/ES button pair at right.
// Lang pref reads from / writes to localStorage key `cena-lang`.

import logoSrc from '../assets/logo-cenahealth-teal.svg';
import type { Language } from '../lib/useLanguage';

interface I18nBarProps {
  lang: Language;
  onToggle: (lang: Language) => void;
}

export function I18nBar({ lang, onToggle }: I18nBarProps) {
  return (
    <div className="mobile-i18n-bar">
      <img
        src={logoSrc}
        alt="Cena Health"
        height="24"
        className="h-6 w-auto"
      />
      <div className="flex gap-1">
        <button
          type="button"
          className="mobile-i18n-toggle"
          aria-pressed={lang === 'en'}
          aria-label="English"
          onClick={() => onToggle('en')}
        >
          EN
        </button>
        <button
          type="button"
          className="mobile-i18n-toggle"
          aria-pressed={lang === 'es'}
          aria-label="Español"
          onClick={() => onToggle('es')}
        >
          ES
        </button>
      </div>
    </div>
  );
}
