---
use_case: weekly-checkin-call
diagram_type: swimlane-flow
layout_direction: horizontal-left-to-right
viewbox: "0 0 1400 480"
lanes:
  - id: agent
    label: AGENT
    y_center: 100
    actors:
      - care-coordination-agent (roster sort + channel resolution)
  - id: human
    label: HUMAN
    y_center: 235
    actors:
      - care-coordinator (the routine actor — conducts the call, classifies the outcome, logs, schedules)
  - id: partner
    label: PARTNER
    y_center: 380
    actors:
      - UConn clinical team member (yellow-flag receiver) OR BHN intake coordinator (Cena-staffed?) — same identity gap as escalation-phq9-positive
node_placement:
  01-trigger-roster-top:
    lane: agent
    x_center: 160
    emphasis: default
  02-decision-channel-selection:
    lane: agent
    x_center: 370
    emphasis: default
  03-enquiry-checkin-call:
    lane: human
    x_center: 600
    emphasis: high
  04-decision-outcome-classification:
    lane: human
    x_center: 840
    emphasis: high
  05-action-log-outcome:
    lane: human
    x_center: 1080
    emphasis: default
  06-handoff-yellow-flag-escalation:
    lane: partner
    x_center: 1080
    emphasis: high
    crosses_boundary: organization
  07-action-schedule-followup:
    lane: human
    x_center: 1260
    emphasis: low
edges_from_manifest: true
edge_overrides:
  - from: 04-decision-outcome-classification
    to: 05-action-log-outcome
    stroke: default
    label: "successful"
  - from: 04-decision-outcome-classification
    to: 06-handoff-yellow-flag-escalation
    stroke: emphasis
    label: "yellow flag → escalation"
  - from: 04-decision-outcome-classification
    to: 07-action-schedule-followup
    stroke: muted
    style: dashed
    label: "voicemail / no answer / refused / deferred"
  - from: 06-handoff-yellow-flag-escalation
    to: 05-action-log-outcome
    stroke: default
    label: "ack → CC logs"
  - from: 07-action-schedule-followup
    to: 05-action-log-outcome
    stroke: muted
    style: dashed
    label: "retry logged"
uncertainty_visualization:
  - target: 02-decision-channel-selection
    modifier: diagram-box--uncertain-tbd
    callout: "[TBD] channel-switch protocol pending cap-26"
    callout_position: above
  - target: 03-enquiry-checkin-call
    modifier: diagram-box--uncertain-gap
    callout: "[GAP] cap-25 script + cap-26 protocol unauthored"
    callout_position: above
  - target: 04-decision-outcome-classification
    modifier: diagram-box--uncertain-tbd
    callout: "[TBD] yellow-flag criteria pending Marrero"
    callout_position: above
  - target: 05-action-log-outcome
    modifier: diagram-box--uncertain-tbd
    callout: "[TBD] structured-field schema pending Marrero"
    callout_position: above
  - target: 06-handoff-yellow-flag-escalation
    modifier: diagram-box--uncertain-assumption
    callout: "[ASSUMPTION] BHN/UConn role unresolved + first-action specifics pending"
    callout_position: above
  - target: 07-action-schedule-followup
    modifier: diagram-box--uncertain-gap
    callout: "[GAP] cap-26 multi-modal contact protocol entirely undefined"
    callout_position: above
watcher_annotations:
  - target: 03-enquiry-checkin-call
    watcher_role: clinical-lead
    label: "▲ watches: clinical-lead"
  - target: 04-decision-outcome-classification
    watcher_role: clinical-lead
    label: "▲ watches: clinical-lead"
  - target: 06-handoff-yellow-flag-escalation
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
caption: "Emphasized path: weekly-routine CC call → outcome classification → yellow-flag escalation to UConn clinical team. Three of seven fragments carry GAP-level uncertainty; cap-25 and cap-26 are the structural gaps that block operational deployment."
---

# Diagram intent — Weekly check-in call

## What this diagram emphasizes

The **routine-with-escape-hatch shape** of the use case. The CC runs the call (fragment 03), classifies the outcome (fragment 04), and the routing fans into three terminal paths: routine log (fragment 05), yellow-flag escalation (fragment 06), or follow-up retry (fragment 07). The yellow-flag escalation is the cross-organization escape hatch — the diagram emphasizes the call + classification axis because that is where the CC's per-call judgment happens, and the escalation arrow because that is the load-bearing safety routing.

Unlike escalation-phq9-positive (whose central event is the human attestation gate), this use case has **no mid-flow attestation gate** — the routine check-in does not require a signed sign-off. Yellow-flag escalations route to the receiving clinical team who run their own attestation-gated procedures. The HIGH emphasis on fragments 03 and 04 marks them as the "where judgment happens" steps in the same visual register as the escalation-phq9-positive attestation gate (the candidate `diagram-box--attestation-gate` modifier reads as "this is the gravity center" beyond its literal name).

Fragment 06 is also HIGH emphasis because the yellow-flag handoff is the cross-org event a reviewer should see at a glance.

## Lane choice

Three lanes (AGENT / HUMAN / PARTNER) stratified by actor type. **No SYSTEM lane** in this use case — unlike escalation-phq9-positive, this workflow has no terminal audit-system gate; the routine concludes when the CC logs the outcome and the roster re-sorts. A future PIPELINE-REGISTRY add (case-level audit aggregation across check-ins) could introduce a SYSTEM lane, but it is not part of this use case's spec today.

The decision to omit the SYSTEM lane is workflow-shaped (lanes are workflow-shaped, not contract-shaped). Adding an empty lane would be misleading visual scaffolding for "we have an actor type here" when we don't.

The PARTNER lane carries a single node (fragment 06) reflecting the conditional cross-org handoff. This visualization makes "most of the time the case stays in the HUMAN lane; rarely it crosses to PARTNER" legible at a glance — which is the routine-with-escape-hatch shape.

## Layout direction

Left-to-right because the temporal sequence is linear: trigger → channel → call → classify → terminal action. Three outgoing edges from fragment 04 produce a fan-out at the classification step; the yellow-flag escalation arrow drops down to the PARTNER lane and returns up to fragment 05 once acknowledged. Follow-up retry (fragment 07) sits to the right of fragment 05 with a muted-dashed back-edge to fragment 05 (retries log their outcome the same way).

## Visualization rules

- **Uncertainty tier maps to modifier class** — same convention as escalation-phq9-positive. TBD → `diagram-box--uncertain-tbd` (amber-dashed). Gap → `diagram-box--uncertain-gap` (red-dotted). Assumption → `diagram-box--uncertain-assumption` (sand-dashed). All five candidate modifier classes are inline-defined in the rendered HTML's `<style>` block; promotion to `components.css` is Tier 1 PL work pending 4-expert review panel.
- **Watcher annotation** renders as a small monospace label inside the box (`▲ watches: <role>`). Candidate `diagram-box--has-watcher` modifier.
- **Emphasis treatment** — fragments 03 (the call) and 04 (the classification) get the candidate `diagram-box--attestation-gate` HIGH treatment because those are the "where judgment happens" steps even though they are not literal attestation gates. The visual register marks them as gravity centers. Fragment 06 (the handoff) also gets HIGH treatment because cross-org events deserve visual emphasis.
- **Cross-boundary edge** (fragment 04 → fragment 06) uses the `arrow-end-emphasis` marker — the visual equivalent of "this crosses an organizational line."

## Instructions to the rendering agent (diagram-mapper)

Use the same inline `<style>` block from escalation-phq9-positive's rendered-diagram.html verbatim — the 5 candidate modifier classes are the same vocabulary. Do not redefine; do not add new modifier classes. If a new modifier class would help (e.g., a `diagram-box--routine` muted treatment for fragment 07), leave a TODO comment in the style block + an @Claude annotation here naming what would be added and why — but do not promote inline.

<!-- @Claude: Considered a `diagram-box--routine` muted modifier for fragment 07's "default-no-judgment" path, but decided against because the existing `low` emphasis treatment (`diagram-box--ghost`) already carries the same semantic register. Keeping the modifier vocabulary closed to the 5 candidates from escalation-phq9-positive. -->

Surface every uncertainty annotation as a small monospace callout above the affected node — six callouts here, more dense than escalation-phq9-positive's four because this use case's structural-gap distribution is heavier (cap-25 and cap-26 are catalog-level gaps that touch four of seven fragments). The visual density IS the spec's communication: "this is the most operationally load-bearing use case AND has the most unresolved structural specification."
