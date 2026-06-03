---
use_case: monthly-uconn-review-meeting
diagram_type: swimlane-flow
layout_direction: horizontal-left-to-right
viewbox: "0 0 1180 540"
lanes:
  - id: agent
    label: AGENT
    y_center: 100
    actors:
      - cena-reporting-system (agenda-generation pipeline)
  - id: human
    label: HUMAN
    y_center: 220
    actors:
      - meeting-owner (Vanessa current → Marrero post-launch)
      - admin-pm
  - id: partner
    label: PARTNER
    y_center: 340
    actors:
      - uconn-participants (attendee list TBD)
  - id: system
    label: SYSTEM
    y_center: 460
    actors:
      - cena-reporting-system (trigger surface)
node_placement:
  01-trigger-monthly-cadence:
    lane: system
    x_center: 185
    emphasis: default
  02-action-auto-generate-agenda:
    lane: agent
    x_center: 405
    emphasis: default
  03-action-customize-talking-points:
    lane: human
    x_center: 635
    emphasis: default
  04-action-facilitate-meeting:
    lane: human
    x_center: 865
    emphasis: high
    crosses_lane: partner
  05-handoff-protocol-refinement-routing:
    lane: human
    x_center: 1060
    emphasis: high
    note: routing fragment carries two hand-offs (per-meeting refinement + cross-cycle ownership transition)
edges_from_manifest: true
edge_overrides:
  - from: 01-trigger-monthly-cadence
    to: 02-action-auto-generate-agenda
    stroke: default
    label: "reports closed → fire"
  - from: 02-action-auto-generate-agenda
    to: 03-action-customize-talking-points
    stroke: default
    label: "template → customize"
  - from: 03-action-customize-talking-points
    to: 04-action-facilitate-meeting
    stroke: default
    label: "agenda → meeting"
  - from: 04-action-facilitate-meeting
    to: 05-handoff-protocol-refinement-routing
    stroke: emphasis
    label: "notes → routing"
  - from: 04-action-facilitate-meeting
    to: 04-action-facilitate-meeting-partner
    stroke: default
    style: dashed
    label: "UConn participants attend"
    note: rendered as a visible drop-line from HUMAN-lane facilitation node into PARTNER lane to encode partner participation without inventing a separate fragment
uncertainty_visualization:
  - target: 01-trigger-monthly-cadence
    modifier: diagram-box--uncertain-assumption
    callout: "[ASSUMPTION] timing offset + survey integration unspecified"
    callout_position: above
  - target: 02-action-auto-generate-agenda
    modifier: diagram-box--uncertain-gap
    callout: "[GAP] dashboard data-element set pending Marinka/Andrey (Exhibit F)"
    callout_position: above
  - target: 03-action-customize-talking-points
    modifier: diagram-box--uncertain-gap
    callout: "[GAP] customization criteria undefined"
    callout_position: above
  - target: 04-action-facilitate-meeting
    modifier: diagram-box--uncertain-gap
    callout: "[GAP] meeting format + UConn attendee list unspecified"
    callout_position: above
  - target: 05-handoff-protocol-refinement-routing
    modifier: diagram-box--uncertain-gap
    callout: "[GAP CRITICAL] ownership-transition gate UNDEFINED (novel attestation shape)"
    callout_position: above
watcher_annotations:
  - target: 01-trigger-monthly-cadence
    watcher_role: admin-pm
    label: "▲ watches: admin-pm"
  - target: 02-action-auto-generate-agenda
    watcher_role: admin-pm
    label: "▲ watches: admin-pm"
  - target: 03-action-customize-talking-points
    watcher_role: meeting-owner-self
    label: "▲ watches: self"
  - target: 04-action-facilitate-meeting
    watcher_role: meeting-owner-self
    label: "▲ watches: self"
  - target: 05-handoff-protocol-refinement-routing
    watcher_role: vanessa-shadows-marrero
    label: "▲ watches: Vanessa → Marrero (transition)"
emphasis_treatment:
  high:
    modifier: ""
    typography: sans-bold
    border_weight: 2
    color_token: var(--color-border-default)
  default:
    modifier: ""
    typography: sans
    border_weight: 1
    color_token: var(--color-border-default)
  low:
    modifier: diagram-box--ghost
    typography: serif-italic-muted
    border_weight: 1
    color_token: var(--color-border-muted)
caption: "Linear monthly cadence. The load-bearing missing piece is the ownership-transition attestation gate (Vanessa → Marrero) — a novel attestation shape with no defined criterion."
---

# Diagram intent — monthly UConn review meeting

## What this diagram emphasizes

The **labeled uncertainty itself** is what this diagram emphasizes. Unlike the escalation use case (where a single attestation moment is the load-bearing event), this workflow's load-bearing fact is that almost every step carries an open gap. The diagram surfaces the gaps loudly so reviewers (Vanessa, Marrero) cannot miss them.

The single emphasized element is the routing fragment (05) — both because it carries the ownership-transition attestation arc (the catalog's explicitly flagged "no defined attestation step yet") and because it carries TWO hand-offs in one node.

## Lane choice

Four lanes (AGENT / HUMAN / PARTNER / SYSTEM) — same actor-type axis as the escalation use case for cross-use-case consistency.

- **AGENT** — the agenda-generation pipeline (one node)
- **HUMAN** — the meeting owner's customization, facilitation, and routing work (three nodes — most of the workflow's substance lives here)
- **PARTNER** — UConn participants, attending facilitation; rendered as a dashed drop-line from the HUMAN-lane facilitation node into the PARTNER lane to encode partner presence without inventing a separate fragment
- **SYSTEM** — the trigger surface (the reporting system fires when reports close)

Distinction from escalation: this workflow has its center-of-mass in the HUMAN lane (three consecutive nodes), whereas escalation alternated lanes by step.

## Layout direction

Left-to-right because the temporal sequence is strictly linear — monthly cadence with no branching or back-edges within a cycle. The cross-cycle ownership-transition arc is annotated on the routing fragment rather than rendered as a back-edge (it spans cycles, not steps within a cycle).

## Visualization rules

- **Uncertainty tier maps to modifier class.** Most fragments carry `--uncertain-gap` (red-dotted) because operational content is absent. Fragment 01 is `--uncertain-assumption` (sand-dashed) because the trigger structure is reasonably assumable from catalog.
- **Watcher annotation** renders as a small monospace label inside the box (`▲ watches: <role>`). Fragment 05's watcher label is the distinctive one — `Vanessa → Marrero (transition)` encodes the moving target.
- **No attestation gate** rendered with primary-teal border, because this use case has NO defined attestation gate. The ownership-transition gate is flagged as a callout on fragment 05 but NOT drawn as a gate — that would falsely suggest one exists. Labeled absence, not labeled presence.
- **Partner attendance** rendered as a dashed drop-line from the HUMAN-lane facilitation node into the PARTNER lane (no separate node) — partner role is "attends" not "performs a step." The dashed line communicates participation-without-handoff.

## Instructions to the rendering agent

Use the same SVG primitives + inline-style modifier classes as the escalation worked example. Copy the inline `<style>` block verbatim from `escalation-phq9-positive/rendered-diagram.html` — same candidate modifier classes, same CANDIDATE FOR PROMOTION comment header, same callout typography support.

Render five nodes on a left-to-right linear path:

- 01 in SYSTEM lane (uncertain-assumption)
- 02 in AGENT lane (uncertain-gap)
- 03 in HUMAN lane (uncertain-gap)
- 04 in HUMAN lane (uncertain-gap, emphasis=high with partner drop-line)
- 05 in HUMAN lane (uncertain-gap, emphasis=high — the routing fragment)

No back-edges, no cross-lane braiding apart from the partner drop-line. The visual story is "linear cadence, gaps everywhere, ownership transition unaddressed."

For candidate modifier classes that don't yet exist in `components.css`: inline-define in the `<style>` block at the top of the rendered HTML. Reuse the same block from the escalation worked example verbatim — do not redefine; do not add new modifier classes; if you would add one, leave a TODO comment in the style block instead.

Surface every uncertainty annotation as a small monospace callout above the affected node. Fragment 05's callout (`[GAP CRITICAL] ownership-transition gate UNDEFINED (novel attestation shape)`) should use `.diagram-tbd-callout--critical` for the higher-weight visual treatment.
