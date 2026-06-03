---
fragment_id: 01-trigger-screening-milestone
type: enquiry
x_cena_actor: system
x_cena_actor_role: scheduling-system
x_cena_watches: care-coordinator
x_cena_uncertainty: resolved
trigger:
  source: IRB protocol schedule + patient enrollment record
  fires_when: baseline visit reached OR repeat-screening milestone reached
gaps: []
outgoing_edges:
  - to: 02-action-cc-administers-phq9
    type: default
    label: milestone reached → CC notified
---

# Trigger: Screening milestone reached

The Cena scheduling system tracks each enrolled patient's IRB-protocol screening schedule. Two milestone types trigger a PHQ9 administration:

## Trigger types

- **Baseline.** The patient's first in-person visit. PHQ9 is administered alongside the registered dietitian's initial assessments. CC is on-site.
- **Repeat-screening.** Per the IRB-protocol schedule, repeat-screening milestones fire at protocol-defined intervals. Channel (in-person vs. remote) depends on the visit type the patient is scheduled into; remote-channel administration specifics are pending (see fragment 02).

## Trigger payload

The trigger notifies the assigned Care Coordinator that a PHQ9 administration is due for the named patient, with the visit context (baseline vs. repeat, in-person vs. remote channel).

## Who watches

The care coordinator is the supervisor-of-record for the trigger itself — the CC owns ensuring administration happens on schedule. The trigger fires from a deterministic schedule (IRB protocol + enrollment record); no clinical judgment is involved at this step.

## Authoring note (Cena-internal — strip before SoP render)

This fragment exercises:

- `type: enquiry` — the trigger initiates an information-gathering step
- `x_cena_actor: system` — deterministic schedule-driven trigger
- `x_cena_watches: care-coordinator` — the human responsible for the downstream administration
- `x_cena_uncertainty: resolved` — the trigger semantics are well-defined; the downstream administration carries the uncertainty
