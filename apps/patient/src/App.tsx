// apps/patient/src/App.tsx
// Patient app root. Composes the @haven/ui-react AppShell — responsive
// non-agentic shell that switches between sidebar nav (≥lg) and bottom-nav
// (<lg) with a persistent topbar across both.
//
// Region content:
//   topBar    — I18nBar (brand + EN/ES toggle)
//   sidebar   — Sidebar (vertical nav, ≥lg)
//   bottomNav — BottomNav (horizontal nav, <lg)
//   banner    — OfflineBanner (when offline)
//   children  — Routes
//
// Nav-suppression rules:
//   /assessment/* — full-screen stepper. Suppress topBar + sidebar + bottomNav.
//   /onboarding/* — linear stepper. Keep topBar (so patient can toggle language
//                    on welcome screen). Suppress sidebar + bottomNav.

import { Route, Routes, useLocation } from 'react-router-dom';
import { AppShell } from '@haven/ui-react';
import { I18nBar } from './components/I18nBar';
import { BottomNav } from './components/BottomNav';
import { Sidebar } from './components/Sidebar';
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
import { OnboardingRoutes } from './screens/onboarding';
import { Meals } from './screens/meals';

const ASSESSMENT_PREFIXES = ['/assessment/'];
const ONBOARDING_PREFIXES = ['/onboarding/'];

function useShowNav(): boolean {
  const { pathname } = useLocation();
  return (
    !ASSESSMENT_PREFIXES.some((prefix) => pathname.startsWith(prefix)) &&
    !ONBOARDING_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  );
}

function useShowTopBar(): boolean {
  const { pathname } = useLocation();
  return !ASSESSMENT_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function App() {
  const [lang, setLang] = useLanguage();
  const showNav = useShowNav();
  const showTopBar = useShowTopBar();
  const isOnline = useOnlineStatus();

  // TODO v1: read unreadCount from messages API
  const unreadCount = 1;

  return (
    <AppShell
      topBar={showTopBar ? <I18nBar lang={lang} onToggle={setLang} /> : null}
      sidebar={showNav ? <Sidebar lang={lang} unreadCount={unreadCount} /> : undefined}
      bottomNav={showNav ? <BottomNav lang={lang} unreadCount={unreadCount} /> : undefined}
      banner={!isOnline ? <OfflineBanner lang={lang} /> : undefined}
    >
      <Routes>
        {/* Main shell routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/health" element={<MyHealth />} />
        <Route path="/care" element={<Care />} />
        <Route path="/meals" element={<Meals />} />

        {/* Existing assessment flows — full-screen stepper, all chrome suppressed */}
        <Route path="/assessment/gad-7/*" element={<Gad7Routes />} />
        <Route path="/assessment/phq-9/*" element={<Phq9Routes />} />

        {/* Onboarding flow — linear stepper, topBar kept for language toggle */}
        <Route path="/onboarding/*" element={<OnboardingRoutes />} />
      </Routes>
    </AppShell>
  );
}
