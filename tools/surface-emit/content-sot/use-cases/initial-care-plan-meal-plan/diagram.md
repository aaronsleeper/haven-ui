---
use_case: initial-care-plan-meal-plan
diagram_type: swimlane-flow
layout_direction: horizontal-left-to-right
viewbox: "0 0 1100 420"
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
      - registered-dietitian
      - dr-wu (watcher on dietary requirements)
  - id: system
    label: SYSTEM
    y_center: 340
    actors:
      - cena-platform (artifact storage + handoff event raiser)
node_placement:
  01-trigger-baselines-complete:
    lane: agent
    x_center: 185
    emphasis: default
  02-action-author-combined-care-plan-and-meal-plan:
    lane: human
    x_center: 430
    emphasis: default
  03-attestation-rdn-approval:
    lane: human
    x_center: 680
    emphasis: high
  04-handoff-to-meal-prescription:
    lane: system
    x_center: 930
    emphasis: default
    crosses_boundary: workflow
edges_from_manifest: true
edge_overrides:
  - from: 01-trigger-baselines-complete
    to: 02-action-author-combined-care-plan-and-meal-plan
    stroke: default
    label: "ready-to-author signal"
  - from: 02-action-author-combined-care-plan-and-meal-plan
    to: 03-attestation-rdn-approval
    stroke: emphasis
    label: "draft → approve"
  - from: 03-attestation-rdn-approval
    to: 04-handoff-to-meal-prescription
    stroke: emphasis
    label: "signed → activates"
  - from: 03-attestation-rdn-approval
    to: 02-action-author-combined-care-plan-and-meal-plan
    stroke: muted
    style: dashed
    label: "revise → re-author"
  - from: 04-handoff-to-meal-prescription
    to: 03-attestation-rdn-approval
    stroke: muted
    style: dashed
    label: "rejection → RDN paged"
uncertainty_visualization:
  - target: 01-trigger-baselines-complete
    modifier: diagram-box--uncertain-tbd
    callout: "[TBD] first-action specifics pending Vanessa/Marrero"
    callout_position: above
  - target: 02-action-author-combined-care-plan-and-meal-plan
    modifier: diagram-box--uncertain-tbd
    callout: "[TBD] Dr. Wu role on dietary reqs — review vs approve (Vanessa)"
    callout_position: above
  - target: 03-attestation-rdn-approval
    modifier: diagram-box--uncertain-gap
    callout: "[GAP] approval gate hardcoded in workflow-spec, NOT in SoP body"
    callout_position: above
  - target: 04-handoff-to-meal-prescription
    modifier: diagram-box--uncertain-assumption
    callout: "[DEFERRED] downstream meal-prescription workflow contract out of RD SoP scope"
    callout_position: above
watcher_annotations:
  - target: 01-trigger-baselines-complete
    watcher_role: clinical-lead
    label: "▲ watches: clinical-lead"
  - target: 02-action-author-combined-care-plan-and-meal-plan
    watcher_role: dr-wu
    label: "▲ watches: dr-wu (dietary reqs)"
  - target: 04-handoff-to-meal-prescription
    watcher_role: registered-dietitian
    label: "▲ watches: RDN"
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
caption: "Emphasized path: draft → RDN approval → activation → meal prescription hand-off. RDN approval gate is the load-bearing structural-gap moment."
---

# Diagram intent — Initial care plan + meal plan creation

## What this diagram emphasizes

The **RDN approval attestation gate (fragment 03)** as the load-bearing event in the use case — and specifically the *structural gap* that the gate exists in the workflow-spec but is **not** surfaced in the RD SoP body. Vanessa and Marrero should see at a glance: this gate is enforced by the platform; the SoP needs reconciliation to surface it; this is what changes when the combined-artifact decision lands in the SoP body.

## Lane choice

Three lanes (AGENT / HUMAN / SYSTEM) stratified by **actor type**, following the escalation use case's actor-type axis.

**No PARTNER lane.** This use case is fully internal — the hand-off (fragment 04) is to a downstream Cena workflow (meal-prescription), not to a partner organization. Omitting the PARTNER lane keeps the diagram honest: showing an empty PARTNER lane would imply a cross-organization handoff that does not exist. If a future variant of this workflow crosses to UConn (e.g., partner-clinical-team review of dietary requirements via Dr. Wu), the PARTNER lane reappears.

The HUMAN lane carries two actors — the Registered Dietitian (primary author + approver) and Dr. Wu (supervisor-of-record on dietary requirements, annotated as watcher on fragment 02). Two actors in one lane is consistent with the lane-as-actor-type axis.

## Layout direction

Left-to-right because the temporal sequence is linear (trigger → author → approve → hand off). The revise loop (gate 03 → action 02) and the rejection page (handoff 04 → gate 03) produce small back-edges; they don't dominate the layout.

## Visualization rules

- **Uncertainty tier maps to modifier class.** TBD → `diagram-box--uncertain-tbd` (amber-dashed). Gap → `diagram-box--uncertain-gap` (red-dotted). Assumption / Deferred → `diagram-box--uncertain-assumption` (sand-dashed). All four modifier classes reused inline from the escalation worked example — pending promotion to `components.css` after the worked example is approved.
- **Watcher annotation** renders as a small monospace label inside the box (`▲ watches: <role>`). Dr. Wu's watcher annotation on fragment 02 carries the dietary-requirements scope (uncertain-tbd because the review-vs-approve role is pending Vanessa).
- **Attestation gates** use the candidate `diagram-box--attestation-gate` modifier — primary-teal border at 2.5px, Lora italic for the label register. Fragment 03 combines this with `uncertain-gap` modifier (red-dotted border) to surface that the gate exists in the workflow-spec but not in the SoP body — both modifier classes are inline-defined in the escalation worked example's `<style>` block; the diagram-mapper layers the gap modifier over the attestation-gate modifier (CSS cascade resolves to red-dotted stroke + primary-teal stroke-width).
- **Cross-boundary edges** — fragment 04 crosses a workflow boundary (RD-SoP scope to meal-prescription-workflow scope) but not an organization boundary. The `arrow-end-emphasis` marker is reserved for organization-boundary crossings (per escalation precedent); this use case uses the default arrow marker for the workflow-boundary crossing and surfaces the boundary in the caption + callout instead.

## Instructions to the rendering agent (diagram-mapper)

Use the same Layer 1 manual-coordinate approach as the escalation worked example — a 4-node diagram does not justify Layer 2 helper overhead.

**Reuse the candidate modifier classes inline** — copy the entire `<style>` block from `escalation-phq9-positive/rendered-diagram.html` verbatim, including the comment header marking them as `CANDIDATE FOR PROMOTION TO components.css`. Do not redefine them; do not add new modifier classes.

Surface every uncertainty annotation as a small monospace callout above the affected node — visible from across the room, deliberately disruptive. The TBD/GAP/DEFERRED content is the spec's iteration mode; making it noisy makes the resolution work visible. The fragment 03 GAP callout — the RDN approval gate that exists in workflow-spec but not in SoP body — is the single largest authoring-debt signal for this use case and should read as visually loud as the fragment 03 first-action TBD CRITICAL callout reads in the escalation diagram.
