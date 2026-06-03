---
fragment_id: 01-trigger-phq9-positive
type: enquiry
x_cena_actor: agent
x_cena_watches: clinical-lead
x_cena_uncertainty: tbd
trigger:
  source: PHQ9 screening assessment completion (onboarding or recurring check-in)
  fires_when: result >= threshold OR Q9 > 0
gaps:
  - threshold value for total score (10 or 15 per standard clinical guidance — pending HDG)
  - Q9 (suicidal ideation) override semantics — pending Marrero
outgoing_edges:
  - to: 02-decision-severity-assessment
    type: default
    label: positive response detected
---

# Trigger: PHQ9 positive response detected

After the patient completes their PHQ9 screening (either during onboarding or a recurring check-in), the agent calculates the total score and checks against the configured positive-response threshold.

## Trigger detail (TBD pending HDG)

- **Total score threshold for "positive":** ≥ [TBD: 10 or 15 per standard clinical guidance]
- **Question 9 (suicidal ideation):** any score > 0 triggers immediate escalation regardless of total — to confirm with Marrero
- **Optional secondary instrument:** C-SSRS (Columbia Suicide Severity Rating Scale) — referenced in Cena planning workflows as the secondary screen tied to BHN handoff; UConn protocol adoption pending Marrero decision

## Who watches

The clinical lead is the supervisor-of-record for this trigger. The agent does not make the clinical judgment that defines "positive" — that threshold is set by clinical policy. Any case flagged by this trigger surfaces in the clinical lead's review queue.

## Authoring note (Cena-internal — strip before SoP render)

This fragment exercises:

- `x_cena_actor: agent` — automated detection
- `x_cena_watches: clinical-lead` — human supervisor of record
- `x_cena_uncertainty: tbd` — threshold value pending
