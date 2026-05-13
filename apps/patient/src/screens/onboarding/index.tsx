import { Navigate, Route, Routes } from 'react-router-dom';
import { Welcome } from './welcome';
import { Consent } from './consent';
import { Preferences } from './preferences';

// Onboarding flow router — mounted at /onboarding/* by the app root.
// Linear stepper: welcome → consent → preferences → / (Dashboard).
// Bare /onboarding bounces to /onboarding/welcome.

export function OnboardingRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="welcome" replace />} />
      <Route path="welcome" element={<Welcome />} />
      <Route path="consent" element={<Consent />} />
      <Route path="preferences" element={<Preferences />} />
    </Routes>
  );
}
