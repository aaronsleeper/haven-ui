// apps/patient/src/App.tsx
// Patient app root. MobileShell envelope (from @haven/ui-react) applies the
// mobile-app body class and the mobile-shell inner wrapper.
// Shell structure: I18nBar (fixed top) → scrollable route content → BottomNav (fixed bottom).
// Assessment flows (/assessment/*) are pre-existing shipped slices; not touched here.

import { Route, Routes, useLocation } from 'react-router-dom';
import { MobileShell } from '@haven/ui-react';
import { I18nBar } from './components/I18nBar';
import { BottomNav } from './components/BottomNav';
import { OfflineBanner } from './components/OfflineBanner';
import { useLanguage } from './lib/useLanguage';
import { useOnlineStatus } from './lib/useOnlineStatus';
import { Dashboard } from './screens/dashboard';
import { Messages } from './screens/messages';
import { Settings } from './screens/settings';
import { MyHealth } from './screens/health';
import { Care } from './screens/care';
import { Gad7Routes } from './screens/gad-7';
import { Phq9Routes } from './screens/phq-9';

// Helper: hide bottom nav inside assessment flows (full-screen stepper)
const ASSESSMENT_PREFIXES = ['/assessment/'];

function useShowBottomNav(): boolean {
  const { pathname } = useLocation();
  return !ASSESSMENT_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function useShowI18nBar(): boolean {
  const { pathname } = useLocation();
  return !ASSESSMENT_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function App() {
  const [lang, setLang] = useLanguage();
  const showBottomNav = useShowBottomNav();
  const showI18nBar = useShowI18nBar();

  // TODO v1: read unreadCount from messages API
  const unreadCount = 1; // demo: 1 unread message

  const isOnline = useOnlineStatus();

  return (
    <MobileShell>
      {showI18nBar && <I18nBar lang={lang} onToggle={setLang} />}
      {!isOnline && <OfflineBanner lang={lang} />}

      {/* Route content area: padding-top clears i18n bar (+ offline banner if visible);
          padding-bottom clears bottom-nav. */}
      <div
        className="flex flex-col"
        style={{
          paddingTop: showI18nBar ? (isOnline ? '44px' : '84px') : '0',
          paddingBottom: showBottomNav ? '64px' : '0',
        }}
      >
        <Routes>
          {/* Main shell routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/health" element={<MyHealth />} />
          <Route path="/care" element={<Care />} />

          {/* Existing assessment flows — do not modify */}
          <Route path="/assessment/gad-7/*" element={<Gad7Routes />} />
          <Route path="/assessment/phq-9/*" element={<Phq9Routes />} />
        </Routes>
      </div>

      {showBottomNav && <BottomNav lang={lang} unreadCount={unreadCount} />}
    </MobileShell>
  );
}
