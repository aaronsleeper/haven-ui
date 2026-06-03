---
fragment_id: 03-action-customize-talking-points
type: action
x_cena_actor: human
x_cena_actor_role: meeting-owner (Vanessa current → Marrero post-launch)
x_cena_watches: meeting-owner-self
x_cena_uncertainty: gap
action:
  description: Customize talking points on the auto-generated agenda; identify operational challenges and protocol refinement opportunities to surface in the meeting
  inputs:
    - auto-generated agenda template from fragment 02
    - meeting owner's contextual knowledge of recent operational issues
    - prior meeting notes (if relevant)
  outputs:
    - facilitation-ready agenda with talking points authored
    - list of CQI items the meeting owner wants to anchor discussion on
gaps:
  - Customization criteria undefined — what makes a dashboard draft "ready" for facilitation
  - Whether the CC or PM (admin role) co-authors talking points, or only the meeting owner, is unspecified
  - Review/approval step before meeting (does anyone sight-check the customized agenda?) undefined
  - During ownership-transition cycles, whether Vanessa customizes alone, Marrero customizes with Vanessa shadowing, or Marrero customizes alone with Vanessa reviewing is undefined (see fragment 05 — this is part of the transition cadence gap)
outgoing_edges:
  - to: 04-action-facilitate-meeting
    type: default
    label: customized agenda → meeting
---

# Action: Customize talking points

The meeting owner reviews the auto-generated agenda, customizes the talking points, and identifies the operational challenges and protocol-refinement opportunities to anchor discussion. The meeting is CQI-oriented, so the talking points lean toward "what went sideways this month, and what should we change about the protocol" rather than outcome review (research-blind constraint).

## Customization scope (gap — pending operational definition)

- **Who customizes:** the meeting owner. Currently Vanessa Sena; post-launch Dr. Marrero. During transition cycles, the customization arrangement is undefined (see fragment 05).
- **Criteria for "ready":** undefined. No defined sign-off step; the customized agenda goes straight to facilitation.
- **CC / PM role:** the Admin / PM may surface candidate talking points based on operational signals, but the catalog records only that "CC or PM customizes talking points." Whether this is co-authorship or PM-surfaces-then-owner-decides is unspecified.

## Who watches

The meeting owner is supervisor-of-record for their own customization — no separate gate. This is one of the steps where labeled uncertainty is structurally honest: there is no defined gate because no gate has been authored, not because none belongs there.

## Authoring note (Cena-internal — strip before SoP render)

This fragment exercises:

- `type: action` — human-executed task (talking-point customization)
- `x_cena_actor: human` with `x_cena_actor_role` naming the role under ownership transition
- `x_cena_uncertainty: gap` — operational criteria are absent from source material
- `x_cena_watches: meeting-owner-self` — no separate supervisor; the meeting owner watches their own work (which is itself a candidate gap — should there be a sight-check before facilitation?)
