---
fragment_id: 05-ordering
stage_label: Ordering
type: action
x_cena_uncertainty: resolved
lane_cells:
  patient:
    label: Patient receives order confirmation
    detail: []
  clinical-staff:
    label: Partner's care coordinator confirms order
    detail:
      - against approved plan
  substrate:
    label: Substrate places order
    detail:
      - to partner's fulfillment contract
  provenance:
    label: Order record
    detail:
      - fulfillment-contract attribution
      - timestamp
gaps: []
outgoing_edges:
  - to: 06-fulfillment
    within_lane: substrate
    style: muted
---

# Stage 05: Ordering — partner's food-supplier / fulfillment contract executes

## Patient action

The patient receives confirmation that their first fulfillment cycle is scheduled, per the patient-facing surface the partner's program uses.

## Clinical staff action

The partner's care coordinator confirms the order matches the clinician-approved care plan and the patient's stated preferences captured during enrollment + assessment. Operational verification belongs to the care coordinator.

## Substrate action

The substrate places the order against the partner's existing fulfillment contract (food supplier, kitchen partner, or whichever fulfillment-pathway the partner has contracted). The substrate does not own the fulfillment relationship — the partner's existing supplier configuration is inherited intact per the brownfield-respecting *"runs underneath what you've built, not instead of it"* posture.

## Provenance artifact

`Order record + fulfillment-contract attribution + timestamp` is written to the audit-trail store at order-placed.
