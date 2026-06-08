---
fragment_id: 09-re-assessment
stage_label: Re-assessment
type: decision
x_cena_uncertainty: resolved
lane_cells:
  patient:
    label: Patient returns for re-assessment
    detail:
      - per protocol schedule
  clinical-staff:
    label: Partner's clinician closes the loop
    detail:
      - revises care plan as needed
  substrate:
    label: Substrate flags re-assessment trigger
    detail:
      - per protocol criteria
  provenance:
    label: Re-assessment trigger record
    detail:
      - criteria
      - timestamp
gaps: []
outgoing_edges: []
---

# Stage 09: Re-assessment — substrate flags trigger; partner's clinician closes the loop

## Patient action

The patient returns for the protocol-defined re-assessment visit. The re-assessment may produce a revised care plan (loops back to Stage 04 in operational reality) or confirm continuation of the existing plan.

## Clinical staff action

The partner's clinician (with the partner's RD as appropriate) closes the loop — reviews the outcome trajectory, re-assesses nutrition status, and either revises the care plan or confirms continuation. The clinical call belongs to the clinician.

## Substrate action

The substrate flags the re-assessment trigger when the protocol-defined criteria fire (scheduled milestone OR outcome-trajectory threshold). The flag is a notification; the actual re-assessment is a clinical event the partner's clinician owns.

## Provenance artifact

`Re-assessment trigger record with criteria + timestamp` is written to the audit-trail store at trigger-fire. A subsequent care-plan revision (if any) produces a fresh recommendation record at Stage 04 of the next cycle, with its own clinician-approval + timestamp.
