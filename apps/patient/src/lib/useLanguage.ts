// apps/patient/src/lib/useLanguage.ts
// Hook for patient app language preference (EN / ES).
// Reads initial value from localStorage key 'cena-lang'.
// On toggle: updates state, writes to localStorage, and sets document.documentElement.lang.
// Re-export the Language type so all components import from one place.

import { useCallback, useEffect, useState } from 'react';

export type Language = 'en' | 'es';

const STORAGE_KEY = 'cena-lang';

function getInitialLang(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'es') return 'es';
  } catch {
    // localStorage unavailable (SSR or private mode) — default to 'en'
  }
  return 'en';
}

export function useLanguage(): [Language, (lang: Language) => void] {
  const [lang, setLang] = useState<Language>(getInitialLang);

  // Keep document.documentElement.lang in sync for screen readers
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = useCallback((next: Language) => {
    setLang(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Silent fail; toggle applies for current session
    }
    document.documentElement.lang = next;
  }, []);

  return [lang, toggleLang];
}
