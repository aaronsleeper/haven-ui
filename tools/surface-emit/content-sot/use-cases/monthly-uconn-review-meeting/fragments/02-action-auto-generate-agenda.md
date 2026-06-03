---
fragment_id: 02-action-auto-generate-agenda
type: action
x_cena_actor: agent
x_cena_actor_role: cena-reporting-system
x_cena_watches: admin-pm
x_cena_uncertainty: gap
action:
  description: Auto-generate an agenda template populated with current dashboard data
  inputs:
    - cap-44 monthly report
    - cap-45 monthly report
    - cap-46 monthly report
    - cap-47 monthly report
    - cap-9 satisfaction survey results (Months 3, 6, 9 only)
    - live dashboard state (operational metrics, participant feedback themes)
  outputs:
    - agenda template draft (data auto-filled; talking points placeholders for human customization)
gaps:
  - Dashboard data-element set (Exhibit F) pending Marinka + Andrey — what data the agenda template includes is NOT yet specified
  - Agenda template structure (sections, ordering, default talking-point shape) undefined
  - How participant feedback themes are extracted from raw survey data — manual review? auto-clustering? — undefined
  - Whether the agent generates draft talking points or only structured placeholders is undefined (Aaron design intent: data fills automatically; talking-point authoring stays human)
outgoing_edges:
  - to: 03-action-customize-talking-points
    type: default
    label: agenda template → CC/PM customizes
---

# Action: Auto-generate agenda template

The Cena reporting system generates an agenda template populated with current dashboard data — operational metrics, participant feedback themes, protocol-refinement candidates surfaced by upstream monthly reports. The agent fills the data fields automatically; talking-point customization is handed off to the next step.

## What's IN the agenda (gap — pending Marinka + Andrey)

The dashboard data-element set is the Exhibit F deliverable, which is pending Marinka + Andrey per yesterday's UConn workflow mapping. Until that lands, the agenda template's content is undefined. Candidate elements per the catalog:

- Operational metrics from cap-44 through cap-47 monthly reports
- Participant feedback themes from cap-9 satisfaction surveys (Months 3, 6, 9)
- Protocol refinement candidates surfaced by upstream reports
- Open operational challenges flagged during the month

## Design intent (Aaron, per catalog)

Data fills automatically. The agent does NOT draft talking points — that customization is human work in the next fragment. The separation keeps the agent on data assembly and keeps human judgment on framing.

## Who watches

Admin / PM is the supervisor-of-record. They surface the auto-generated agenda to the meeting owner for customization. They do NOT customize the talking points themselves — that's the meeting owner's job.

## Authoring note (Cena-internal — strip before SoP render)

This fragment exercises:

- `type: action` — system-executed task (template generation)
- `x_cena_actor: agent` — the reporting system; not a human-authored agenda
- `x_cena_uncertainty: gap` — the most consequential gap in this use case; without the Exhibit F data-element set, the agenda template's content is undefined
- The fragment's structural shape is correct (agent generates → human customizes), but the operational content awaits Marinka + Andrey
