// apps/patient/src/App.tsx
// Patient app root. Composes the @haven/ui-react AppShell — responsive
// non-agentic shell that switches between sidebar nav (≥lg) and bottom-nav
// (<lg). Topbar suppressed at launch (English-only, no language toggle).
//
// Region content:
//   topBar    — null (no topbar at launch; revisit when i18n returns)
//   sidebar   — Sidebar (vertical nav + brand mark, ≥lg)
//   bottomNav — BottomNav (horizontal nav, <lg)
//   banner    — OfflineBanner (when offline)
//   children  — Routes
//
// Nav-suppression rules:
//   /assessment/* — full-screen stepper. Suppress sidebar + bottomNav.
//   /onboarding/* — linear stepper. Suppress sidebar + bottomNav.
//
// First-visit gate: patients without the `cena-onboarded` localStorage flag
// are redirected to /onboarding/welcome from any non-assessment, non-
// onboarding route. /assessment/* is exempt so demo deep-links into an
// assessment still work even if onboarding hasn't been completed.

import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppShell } from '@haven/ui-react';
import { BottomNav } from './components/BottomNav';
import { Sidebar } from './components/Sidebar';
import { OfflineBanner } from './components/OfflineBanner';
import { useLanguage } from './lib/useLanguage';
import { useOnboardingState } from './lib/useOnboardingState';
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

function useFirstVisitRedirect(): string | null {
  const { pathname } = useLocation();
  const [isOnboarded] = useOnboardingState();
  if (isOnboarded) return null;
  const isInOnboarding = ONBOARDING_PREFIXES.some((p) => pathname.startsWith(p));
  const isInAssessment = ASSESSMENT_PREFIXES.some((p) => pathname.startsWith(p));
  if (isInOnboarding || isInAssessment) return null;
  return '/onboarding/welcome';
}

export function App() {
  const [lang] = useLanguage();
  const showNav = useShowNav();
  const isOnline = useOnlineStatus();
  const redirectTo = useFirstVisitRedirect();

  // TODO v1: read unreadCount from messages API
  const unreadCount = 1;

  if (redirectTo) return <Navigate to={redirectTo} replace />;

  return (
    <AppShell
      topBar={null}
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
