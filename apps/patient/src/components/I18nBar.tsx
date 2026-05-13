// apps/patient/src/components/I18nBar.tsx
// Content for the AppShell topbar — Cena Health logo on left (mobile only) +
// EN/ES toggle pair on right. The shell's `app-shell-topbar` region provides
// the layout (flex justify-between, sticky positioning); this component only
// owns the content within. At ≥lg the sidebar's .nav-header carries the brand
// mark (canonical pattern, mirrors agentic-shell .panel-nav); the topbar logo
// hides via `lg:hidden`.
//
// Language toggle uses the radiogroup APG pattern: single-select between EN
// and ES is semantically a radio group, not a pair of independent toggles.
// Arrow keys navigate; Space / Enter / click selects.
//
// Lang pref reads from / writes to localStorage key `cena-lang` via
// useLanguage hook.

import type { KeyboardEvent } from 'react';
import logoSrc from '../assets/logo-cenahealth-teal.svg';
import type { Language } from '../lib/useLanguage';

interface I18nBarProps {
  lang: Language;
  onToggle: (lang: Language) => void;
}

export function I18nBar({ lang, onToggle }: I18nBarProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      onToggle(lang === 'en' ? 'es' : 'en');
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      onToggle(lang === 'en' ? 'es' : 'en');
    }
  };

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
      <div role="radiogroup" aria-label="Language" className="flex gap-1">
        <button
          type="button"
          role="radio"
          className="mobile-i18n-toggle"
          aria-checked={lang === 'en'}
          aria-label="English"
          tabIndex={lang === 'en' ? 0 : -1}
          onClick={() => onToggle('en')}
          onKeyDown={handleKeyDown}
        >
          EN
        </button>
        <button
          type="button"
          role="radio"
          className="mobile-i18n-toggle"
          aria-checked={lang === 'es'}
          aria-label="Español"
          tabIndex={lang === 'es' ? 0 : -1}
          onClick={() => onToggle('es')}
          onKeyDown={handleKeyDown}
        >
          ES
        </button>
      </div>
    </>
  );
}
