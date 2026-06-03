---
fragment_id: 01-trigger-monthly-cadence
type: enquiry
x_cena_actor: system
x_cena_actor_role: cena-reporting-system
x_cena_watches: admin-pm
x_cena_uncertainty: assumption
trigger:
  source: monthly cadence — fires after cap-44 through cap-47 monthly reports complete
  fires_when: all upstream monthly reports closed AND scheduled review date approaches
gaps:
  - Exact timing offset between report completion and review meeting (T-7 days? T-3 days?) unspecified
  - Whether cap-9 satisfaction survey data at Months 3/6/9 is required-before-trigger or attached-when-available is unspecified
  - Data collection tool for cap-9 surveys not finalized (UConn Qualtrics vs Cena tool open as of 2026-05-27) — affects whether survey data is in the trigger pipeline
outgoing_edges:
  - to: 02-action-auto-generate-agenda
    type: default
    label: reports closed → agenda template fires
---

# Trigger: Monthly cadence + reports closed

The Cena reporting system fires this trigger when the four upstream monthly reports (cap-44 through cap-47) have closed AND the scheduled UConn review meeting date approaches. The trigger is the moment the agenda-generation pipeline kicks off.

## Trigger detail (gaps flagged)

- **Cadence:** monthly, on a scheduled review date negotiated with UConn (date-set process unspecified).
- **Upstream dependency:** cap-44 through cap-47 monthly reports must be closed before the agenda fires. What happens if a report is late (delay the meeting? fire with partial data?) is unspecified.
- **Survey integration:** at Months 3, 6, and 9 of the pilot, participant satisfaction surveys (cap-9) provide CQI inputs. Whether the trigger waits for survey results in those months, or attaches them when available, is unspecified. The data-collection tool itself (UConn Qualtrics vs. a Cena-built tool) is open as of 2026-05-27.

## Who watches

The Admin / PM is the supervisor-of-record for the trigger and the downstream agenda preparation. They surface the trigger event to the meeting owner (Vanessa current, Marrero post-launch) along with the auto-generated agenda draft.

## Authoring note (Cena-internal — strip before SoP render)

This fragment exercises:

- `type: enquiry` — system-detected event (not an agent classification; a scheduled-pipeline fire)
- `x_cena_actor: system` — the reporting system fires the trigger; no human is making a judgment here
- `x_cena_watches: admin-pm` — supervisor-of-record for the prep workflow
- `x_cena_uncertainty: assumption` — the trigger structure is assumed-from-catalog; specifics of timing and survey integration are not yet locked
