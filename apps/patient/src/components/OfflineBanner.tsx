// apps/patient/src/components/OfflineBanner.tsx
// Offline state banner: renders as a sticky warning alert just below the i18n bar
// when navigator.onLine is false. Disappears when connectivity returns.
// Uses `alert` + `alert-warning` semantic classes.

import type { Language } from '../lib/useLanguage';

interface OfflineBannerProps {
  lang: Language;
}

export function OfflineBanner({ lang }: OfflineBannerProps) {
  return (
    <div
      className="alert alert-warning rounded-none sticky top-[44px] z-40"
      role="alert"
      aria-live="assertive"
    >
      <span className="alert-icon" aria-hidden="true">
        <i className="fa-solid fa-wifi-slash" />
      </span>
      <span className="text-sm">
        {lang === 'es'
          ? 'Sin conexión. Algunas funciones están limitadas ahora.'
          : "You're offline. Some things may not work right now."}
      </span>
    </div>
  );
}
