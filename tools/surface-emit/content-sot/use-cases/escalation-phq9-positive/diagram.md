---
use_case: escalation-phq9-positive
diagram_type: swimlane-flow
layout_direction: horizontal-left-to-right
viewbox: "0 0 1100 520"
lanes:
  - id: agent
    label: AGENT
    y_center: 100
    actors:
      - care-coordination-agent
  - id: human
    label: HUMAN
    y_center: 220
    actors:
      - clinical-lead
  - id: partner
    label: PARTNER
    y_center: 340
    actors:
      - bhn-intake-coordinator (Cena-staffed?) OR UConn clinical team member
  - id: system
    label: SYSTEM
    y_center: 460
    actors:
      - audit-system
node_placement:
  01-trigger-phq9-positive:
    lane: agent
    x_center: 185
    emphasis: default
  02-decision-severity-assessment:
    lane: agent
    x_center: 405
    emphasis: default
  03-attestation-clinical-lead-review:
    lane: human
    x_center: 635
    emphasis: high
  04-handoff-to-bhn:
    lane: partner
    x_center: 865
    emphasis: default
    crosses_boundary: organization
  05-attestation-audit-record:
    lane: system
    x_center: 635
    emphasis: low
edges_from_manifest: true
edge_overrides:
  - from: 02-decision-severity-assessment
    to: 03-attestation-clinical-lead-review
    stroke: emphasis
    label: "red / yellow"
  - from: 03-attestation-clinical-lead-review
    to: 04-handoff-to-bhn
    stroke: emphasis
    label: "signed → handoff"
  - from: 04-handoff-to-bhn
    to: 05-attestation-audit-record
    stroke: default
    label: "ack → audit"
  - from: 03-attestation-clinical-lead-review
    to: 05-attestation-audit-record
    stroke: muted
    style: dashed
    label: "deferred / decline → audit"
  - from: 04-handoff-to-bhn
    to: 03-attestation-clinical-lead-review
    stroke: muted
    style: dashed
    label: "timeout → paged"
uncertainty_visualization:
  - target: 01-trigger-phq9-positive
    modifier: diagram-box--uncertain-tbd
    callout: "[TBD] threshold pending HDG"
    callout_position: above
  - target: 02-decision-severity-assessment
    modifier: diagram-box--uncertain-gap
    callout: "[GAP] tier boundaries pending Marrero"
    callout_position: above
  - target: 03-attestation-clinical-lead-review
    modifier: diagram-box--uncertain-tbd
    callout: "[TBD CRITICAL] first-action specifics — Vanessa/Marrero"
    callout_position: above
  - target: 04-handoff-to-bhn
    modifier: diagram-box--uncertain-assumption
    callout: "[ASSUMPTION] BHN role unresolved (Cena vs UConn)"
    callout_position: above
watcher_annotations:
  - target: 01-trigger-phq9-positive
    watcher_role: clinical-lead
    label: "▲ watches: clinical-lead"
  - target: 02-decision-severity-assessment
    watcher_role: clinical-lead
    label: "▲ watches: clinical-lead"
  - target: 04-handoff-to-bhn
    watcher_role: clinical-lead
    label: "▲ watches: clinical-lead"
emphasis_treatment:
  high:
    modifier: diagram-box--attestation-gate
    typography: serif-italic
    border_weight: 2.5
    color_token: var(--color-primary-700)
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
caption: "Emphasized path: red/yellow severity → clinical-lead attestation → BHN/UConn handoff. Audit sealed at every terminal state."
---

# Diagram intent — PHQ9 escalation

## What this diagram emphasizes

The **human-attestation moment (gate 03)** as the load-bearing event in the use case. Vanessa and Marrero should see at a glance: this is where the clinical lead intervenes; this is what's TBD; this is where it routes after.

## Lane choice

Four lanes (AGENT / HUMAN / PARTNER / SYSTEM) stratified by **actor type**, not by system location.

Yesterday's UConn workflow-mapping artifact used four lanes by system location (Cena / Athena / Paper / Partner). That stratification fits a system-architecture conversation. For a clinical-workflow conversation, actor-type is the more useful axis — clinicians read "who does what" faster than they read "where does what happen."

Same number of lanes; orthogonal axis. We'd keep the system-location stratification available for other diagrams where that's the load-bearing question (e.g., Daryl-vs-Ryan workflow).

## Layout direction

Left-to-right because the temporal sequence is linear. Deferral and timeout paths produce small back-edges; they don't dominate the layout.

## Visualization rules

- **Uncertainty tier maps to modifier class.** TBD → `diagram-box--uncertain-tbd` (amber-dashed). Gap → `diagram-box--uncertain-gap` (red-dotted). Assumption → `diagram-box--uncertain-assumption` (sand-dashed). All four modifier classes are candidates for promotion to `components.css` after the worked example is approved.
- **Watcher annotation** renders as a small monospace label inside the box (`▲ watches: <role>`). Candidate `diagram-box--has-watcher` modifier.
- **Attestation gates** use the candidate `diagram-box--attestation-gate` modifier — primary-teal border at 2.5px, Lora italic for the label register (matches haven attestation-block in the Document District).
- **Cross-boundary edges** (organizational hand-offs) use the `arrow-end-emphasis` marker — the visual equivalent of "this crosses a line."

## Instructions to the rendering agent (diagram-mapper)

Use haven-ui Layer 2 `diagram-graph` helper IF the {nodes, edges} data shape is amenable — for this 5-node diagram, Layer 1 with manual coordinates is fine. Hand-author the SVG following the conventions in `~/.claude/plans/haven-ui-diagram-research.md` §D3.

For candidate modifier classes that don't yet exist in `components.css`: inline-define in a `<style>` block at the top of the rendered HTML, with a comment marking them as `CANDIDATE FOR PROMOTION TO components.css`. Yesterday's UConn workflow-mapping artifact established this pattern; diagram-mapper inherits it.

Surface every uncertainty annotation as a small monospace callout above the affected node — visible from across the room, deliberately disruptive. The TBD content is the spec's iteration mode; making it noisy makes the resolution work visible.
