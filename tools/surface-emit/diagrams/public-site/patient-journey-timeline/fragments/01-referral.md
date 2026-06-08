---
fragment_id: 01-referral
stage_label: Referral
type: enquiry
x_cena_uncertainty: resolved
lane_cells:
  patient:
    label: Patient enters
    detail:
      - via partner's referral pathway
  clinical-staff:
    label: Partner intake reviews referral
    detail:
      - eligibility against IRB protocol
  substrate:
    label: Substrate ingests referral
    detail:
      - normalizes intake record
  provenance:
    label: Referral receipt
    detail:
      - source attribution
      - timestamp
gaps: []
outgoing_edges:
  - to: 02-enrollment
    within_lane: substrate
    style: muted
---

# Stage 01: Referral — patient enters via partner's referral pathway

## Patient action

The patient enters the program through the partner-institution's existing referral pathway (HIV clinic referral, community-org introduction, or partner-identified eligible-patient outreach). The substrate does not own the referral source — the partner's existing intake mechanisms are inherited intact.

## Clinical staff action

The partner's intake coordinator (or RD, depending on the partner's intake configuration) reviews the referral against IRB protocol eligibility criteria. This is partner-side clinical judgment; the substrate observes the referral arrival but does not pre-screen.

## Substrate action

The substrate ingests the referral record into the canonical patient record. Source, referral-pathway metadata, and timestamp are captured automatically.

## Provenance artifact

`Referral receipt + source attribution + timestamp` is written to the audit-trail store at ingest.
