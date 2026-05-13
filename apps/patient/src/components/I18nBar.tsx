// apps/patient/src/components/I18nBar.tsx
// Content for the AppShell topbar — Cena Health logo on left + EN/ES toggle
// pair on right. The shell's `app-shell-topbar` region provides the layout
// (flex justify-between, sticky positioning); this component only owns the
// content within. The brand mark is hidden ≥lg when a sidebar takes over the
// brand surface, leaving the topbar to carry just the language toggle on
// desktop.
//
// Lang pref reads from / writes to localStorage key `cena-lang` via
// useLanguage hook.

import logoSrc from '../assets/logo-cenahealth-teal.svg';
import type { Language } from '../lib/useLanguage';

interface I18nBarProps {
  lang: Language;
  onToggle: (lang: Language) => void;
}

export function I18nBar({ lang, onToggle }: I18nBarProps) {
  return (
    <>
      {/* Brand mark — visible <lg; sidebar carries brand on ≥lg */}
      <img
        src={logoSrc}
        alt="Cena Health"
        height="24"
        className="h-6 w-auto lg:hidden"
      />
      {/* Spacer for ≥lg so toggle stays right-aligned */}
      <span className="hidden lg:inline-block" aria-hidden="true" />
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
    </>
  );
}
