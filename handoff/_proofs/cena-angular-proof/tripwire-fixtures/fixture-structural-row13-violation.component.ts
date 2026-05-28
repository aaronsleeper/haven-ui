// FIXTURE — planted violation for tripwire `cena-angular-dc-tier-row13`.
// This file deliberately imports DataConnectService from a component (tier-2 instead of tier-3).
// Real emitted components MUST inject the domain service (PatientDataService), NOT the raw DataConnectService.
// See data-connect-binding pattern + README.md in this directory.

import { Component, inject } from '@angular/core';
import { DataConnectService } from '../../../../../cena-health-spark/patients/src/app/services/dataconnect.service';

@Component({
  selector: 'fixture-violation',
  standalone: true,
  template: `<p>Structural-tier violation: component imports DataConnectService directly</p>`,
})
export class FixtureViolationComponent {
  // BAD: tier-2 import in a component file. Should be PatientDataService (tier-3).
  private readonly dc = inject(DataConnectService);
}
