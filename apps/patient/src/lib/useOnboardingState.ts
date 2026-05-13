// Onboarding-completion state, persisted to localStorage.
//
// `cena-onboarded` flag is set when the patient finishes the onboarding flow
// (preferences → handleAllDone). App.tsx checks the flag at every render and
// redirects first-time visitors to /onboarding/welcome.
//
// To simulate a first-time visit during demo or testing, clear the key in
// devtools: `localStorage.removeItem('cena-onboarded')`.

import { useState } from 'react';

const STORAGE_KEY = 'cena-onboarded';

export function useOnboardingState() {
  const [isOnboarded, setIsOnboardedState] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  });

  function setOnboarded(value: boolean) {
    if (value) {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setIsOnboardedState(value);
  }

  return [isOnboarded, setOnboarded] as const;
}
