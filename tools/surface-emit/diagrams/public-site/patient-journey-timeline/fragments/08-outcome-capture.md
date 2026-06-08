---
fragment_id: 08-outcome-capture
stage_label: Outcome capture
type: enquiry
x_cena_uncertainty: resolved
lane_cells:
  patient:
    label: Patient completes outcome measures
    detail:
      - per protocol cadence
  clinical-staff:
    label: Partner's clinician reviews outcome record
    detail: []
  substrate:
    label: Substrate logs outcome record
    detail:
      - with measurement methodology
  provenance:
    label: Outcome record
    detail:
      - measurement methodology
      - timestamp
gaps:
  - Substrate outcome-attribution claim per HDG §8 future watchlist — verify against current Spark + Ava shipped fidelity before launch; hedge or remove if aspirational. Outcome VALUES are deferred to /proof; this stage's claim is that the outcome ARTIFACT is produced, not what the outcome value is
outgoing_edges:
  - to: 09-re-assessment
    within_lane: substrate
    style: muted
---

# Stage 08: Outcome capture — substrate logs clinical and program outcomes

## Patient action

The patient completes the outcome-measurement protocol per the IRB-defined cadence — repeat clinical screenings, patient-reported outcome measures, or partner-protocol-specific outcome instruments.

## Clinical staff action

The partner's clinician reviews the outcome record at the cadence the protocol defines. Clinical interpretation belongs to the clinician; the substrate captures the artifact and surfaces it for review.

## Substrate action

The substrate logs the outcome record to the canonical participant record, with the measurement methodology captured alongside. This stage's substrate claim is the **artifact existence**, not the outcome value — outcome values themselves are deferred to `/proof` when partner comms clearance lands. Per voice.md §2 Reference program Do exemplar: *"The program produces this report at this cadence"* — the artifact is the claim.

## Provenance artifact

`Outcome record with measurement methodology + timestamp` is written to the audit-trail store at each protocol-defined outcome milestone.
