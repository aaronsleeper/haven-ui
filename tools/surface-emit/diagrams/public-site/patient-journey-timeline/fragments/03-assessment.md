---
fragment_id: 03-assessment
stage_label: Assessment
type: enquiry
x_cena_uncertainty: resolved
lane_cells:
  patient:
    label: Patient completes intake assessment
    detail:
      - with partner's RD
  clinical-staff:
    label: Partner's RD assesses
    detail:
      - nutrition history
      - clinical indicators
  substrate:
    label: Substrate captures assessment
    detail:
      - structures clinical data
  provenance:
    label: Assessment record
    detail:
      - clinical-staff attribution
      - timestamp
gaps: []
outgoing_edges:
  - to: 04-care-plan
    within_lane: substrate
    style: muted
---

# Stage 03: Assessment — partner's RD conducts initial nutrition assessment

## Patient action

The patient meets with the partner's registered dietitian and completes the initial nutrition assessment in person (or via the partner's existing tele-nutrition channel where in-person is impractical).

## Clinical staff action

The partner's RD (partner-employed, partner-supervised) conducts the nutrition assessment per their existing standards of care, captures nutrition history and relevant clinical indicators, and produces the assessment record. The clinical call belongs to the RD; the substrate captures the artifact.

## Substrate action

The substrate captures the assessment record to the canonical participant record and structures the clinical data per the protocol's downstream-recommendation requirements.

## Provenance artifact

`Assessment record + clinical-staff attribution + timestamp` is written to the audit-trail store at assessment-complete.
