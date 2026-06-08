---
fragment_id: 02-enrollment
stage_label: Enrollment
type: action
x_cena_uncertainty: resolved
lane_cells:
  patient:
    label: Patient consents
    detail:
      - in-person enrollment visit
  clinical-staff:
    label: Partner's program coordinator enrolls
    detail:
      - obtains consent
      - registers participant
  substrate:
    label: Substrate registers enrollment
    detail:
      - captures consent record
  provenance:
    label: Consent record + enrollment artifact
    detail:
      - clinician signature
      - timestamp
gaps: []
outgoing_edges:
  - to: 03-assessment
    within_lane: substrate
    style: muted
---

# Stage 02: Enrollment — partner's program coordinator enrolls + consents the patient

## Patient action

The patient meets with the partner's program coordinator at the in-person enrollment visit and provides informed consent for program participation per the IRB-approved protocol.

## Clinical staff action

The partner's program coordinator (partner-employed, partner-supervised) walks the patient through the consent process, registers them as a participant, and confirms enrollment metadata against the protocol.

## Substrate action

The substrate registers the enrollment in the canonical participant record. The consent artifact (signed by the partner's program coordinator) is captured to the audit-trail store at registration.

## Provenance artifact

`Consent record + enrollment artifact + clinician signature + timestamp` is written to the audit-trail store at enrollment.
