---
fragment_id: 07-adherence-check-ins
stage_label: Adherence check-ins
type: enquiry
x_cena_uncertainty: resolved
lane_cells:
  patient:
    label: Patient engages adherence check-ins
    detail:
      - patient-facing interface
  clinical-staff:
    label: Partner's care coordinator intervenes
    detail:
      - per substrate-flagged signal
  substrate:
    label: Substrate captures adherence signal
    detail:
      - flags when threshold crosses
  provenance:
    label: Adherence-signal capture
    detail:
      - intervention record (if triggered)
      - timestamp
gaps:
  - Substrate adherence-capture claim per HDG §8 future watchlist — verify against current Spark + Ava shipped fidelity before launch; hedge to "(designed, building)" or remove if aspirational
outgoing_edges:
  - to: 08-outcome-capture
    within_lane: substrate
    style: muted
---

# Stage 07: Adherence check-ins — substrate captures signal; clinical staff intervene as needed

## Patient action

The patient engages with the patient-facing interface for recurring adherence check-ins per the protocol schedule. The interaction is mediated by the partner's program's patient surface; the substrate captures the response and surfaces signals upstream.

## Clinical staff action

The partner's care coordinator intervenes when the substrate flags an adherence signal crossing the protocol-defined intervention threshold. Intervention decisions are partner-clinical-staff calls; the substrate surfaces signals and proposes intervention shapes, never executes intervention.

## Substrate action

The substrate captures the adherence signal from patient check-in responses and flags the clinical staff when the signal crosses the protocol-defined threshold. The flag is a notification, not an automated action.

## Provenance artifact

`Adherence-signal capture + intervention record (if triggered) + timestamp` is written to the audit-trail store at each check-in cycle.
