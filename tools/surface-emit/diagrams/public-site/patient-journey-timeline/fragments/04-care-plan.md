---
fragment_id: 04-care-plan
stage_label: Care plan
type: decision
x_cena_uncertainty: resolved
lane_cells:
  patient:
    label: Patient receives care plan
    detail:
      - reviewed with partner's clinician
  clinical-staff:
    label: Partner's clinician approves recommendation
    detail:
      - retains accountability
  substrate:
    label: Substrate generates recommendation
    detail:
      - with peer-reviewed citations
  provenance:
    label: Recommendation record
    detail:
      - cited literature
      - clinician approval
      - timestamp
gaps: []
outgoing_edges:
  - to: 05-ordering
    within_lane: substrate
    style: muted
---

# Stage 04: Care plan — partner's clinician approves substrate-generated recommendation

## Patient action

The patient receives the care plan in a follow-up touchpoint with the partner's clinician, who walks through the recommendation and answers questions. The patient consents to the plan as part of routine care.

## Clinical staff action

The partner's clinician (in the live program, the partner's HIV-specialist physician; in other indications, the analogous indication-specialist) reviews the substrate-generated recommendation and approves, modifies, or rejects it. **The clinical call belongs to the clinician.** Per HDG row 4 + Cena accountability model: during pilots, partner-institution clinicians retain clinical accountability for every recommendation Cena's substrate generates.

## Substrate action

The substrate generates the recommendation per the IRB-approved protocol with peer-reviewed literature citations attached at the recommendation level. The recommendation is a draft for clinician review; the substrate does not commit any treatment-effecting action until clinician approval is recorded.

## Provenance artifact

`Recommendation record with peer-reviewed literature citations + clinician approval + timestamp` is written to the audit-trail store at clinician approval.
