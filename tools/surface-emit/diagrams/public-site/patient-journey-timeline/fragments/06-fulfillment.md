---
fragment_id: 06-fulfillment
stage_label: Fulfillment
type: action
x_cena_uncertainty: resolved
lane_cells:
  patient:
    label: Patient receives fulfillment
    detail:
      - per partner's delivery channel
  clinical-staff:
    label: Partner's navigator monitors fulfillment
    detail:
      - exception-driven
  substrate:
    label: Substrate logs delivery confirmation
    detail: []
  provenance:
    label: Fulfillment confirmation
    detail:
      - delivery confirmation
      - timestamp
gaps: []
outgoing_edges:
  - to: 07-adherence-check-ins
    within_lane: substrate
    style: muted
---

# Stage 06: Fulfillment — nutrition supports delivered to patient

## Patient action

The patient receives the fulfillment per the partner's delivery channel — home delivery, partner-site pickup, or whichever channel the partner's existing fulfillment contract supports. The patient's experience here is mediated by the partner's existing patient-facing infrastructure.

## Clinical staff action

The partner's patient navigator monitors fulfillment on an exception-driven basis — routine deliveries proceed without clinical-staff touch; missed deliveries, refused fulfillment, or partner-flagged anomalies trigger navigator outreach.

## Substrate action

The substrate logs the delivery confirmation against the participant record at fulfillment-complete. Where the partner's fulfillment system exposes delivery telemetry, the substrate ingests it via the partner-specified channel.

## Provenance artifact

`Fulfillment confirmation + delivery confirmation + timestamp` is written to the audit-trail store at fulfillment-complete.
