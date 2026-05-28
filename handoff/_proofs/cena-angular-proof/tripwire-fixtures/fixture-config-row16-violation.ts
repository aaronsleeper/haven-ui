// FIXTURE — planted violation for tripwire `cena-angular-zoneless-config-row16`.
// This file deliberately uses the zoneful provider to prove the tripwire can catch it.
// Real emitted code MUST use provideZonelessChangeDetection() instead.
// See README.md in this directory + .claude/config/invariant-patterns.json.

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';

export const fixtureAppConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true })],
};
