---
use_case: written-consent-execution
diagram_type: swimlane-flow
layout_direction: horizontal-left-to-right
viewbox: "0 0 1180 540"
lanes:
  - id: human
    label: HUMAN
    y_center: 130
    actors:
      - registered-dietitian
      - program-administrator
  - id: patient
    label: PATIENT
    y_center: 260
    actors:
      - participant
  - id: system
    label: SYSTEM
    y_center: 410
    actors:
      - athena
node_placement:
  01-trigger-month0-visit:
    lane: human
    x_center: 180
    emphasis: default
  02-attestation-participant-signs-consent:
    lane: patient
    x_center: 430
    emphasis: high
  03-handoff-rd-to-administrator:
    lane: human
    x_center: 680
    emphasis: default
    crosses_boundary: medium
  04-action-digitize-and-upload-to-athena:
    lane: system
    x_center: 940
    emphasis: default
    crosses_boundary: medium
edges_from_manifest: true
edge_overrides:
  - from: 01-trigger-month0-visit
    to: 02-attestation-participant-signs-consent
    stroke: emphasis
    label: "visit confirmed → execute consent"
  - from: 02-attestation-participant-signs-consent
    to: 03-handoff-rd-to-administrator
    stroke: emphasis
    label: "signed → handoff"
  - from: 03-handoff-rd-to-administrator
    to: 04-action-digitize-and-upload-to-athena
    stroke: emphasis
    label: "paper received → digitize"
  - from: 02-attestation-participant-signs-consent
    to: out-of-scope-decline-or-reschedule
    stroke: muted
    style: dashed
    label: "declines → out of scope (gap)"
uncertainty_visualization:
  - target: 02-attestation-participant-signs-consent
    modifier: diagram-box--uncertain-gap
    callout: "[GAP] decline-to-sign path undocumented"
    callout_position: above
  - target: 04-action-digitize-and-upload-to-athena
    modifier: diagram-box--uncertain-gap
    callout: "[GAP] PDF-landed verification missing"
    callout_position: above
watcher_annotations: []
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
caption: "Linear cross-medium path: in-person visit → participant attestation (paper signature) → RD-to-administrator hand-off → administrator digitizes + uploads to Athena. Two structural gaps surfaced: decline-to-sign branch and PDF-landed verification."
---

# Diagram intent — Written consent execution

## What this diagram emphasizes

The **cross-medium chain** as the structural distinctive: paper (participant signature) → human carrier (RD → administrator hand-off) → system (Athena PDF). Three media in four steps. Vanessa and Marrero should see at a glance that this is a linear path through media boundaries, that the participant is the attestor (unique among v0.1 use cases), and that two structural gaps live on the path.

The **participant-as-attestor** signature on the paper form is the load-bearing event. The attestation gate sits in the PATIENT lane — the only v0.1 use case where the attestation actor is the patient rather than a clinician.

## Lane choice

Three lanes (HUMAN / PATIENT / SYSTEM) stratified by **actor type**, matching the convention established by escalation-phq9-positive.

The AGENT lane is **omitted** from this diagram. This use case has no agent-mediated steps — every step is performed by a named human (RD or administrator) or by the participant, with Athena as the system endpoint. Documenting the omission rather than rendering an empty lane keeps the diagram honest: the absence of an AGENT lane is itself a structural fact about this use case (an in-person, paper-based workflow does not yet have agent automation).

The PARTNER lane is also omitted — this use case is fully internal to Cena + UConn site administration; there is no cross-organization partner hand-off.

Adding a PATIENT lane is a new structural move (not present in the escalation use case). It is justified here because the participant performs a visible workflow action (signing the form), not just receiving the workflow's output. The lane vocabulary stays workflow-shaped, not contract-shaped: lanes appear when an actor actively executes a step.

## Layout direction

Left-to-right because the temporal sequence is strictly linear. The single back-edge (decline-to-sign → out of scope) is a small terminal off the attestation gate; it does not dominate the layout.

## Visualization rules

- **Uncertainty tier maps to modifier class** (same vocabulary as escalation-phq9-positive). GAP → `diagram-box--uncertain-gap` (red-dotted). The two GAP-flagged nodes (attestation gate, digitize-and-upload action) carry the red-dotted treatment.
- **Attestation gate** uses the candidate `diagram-box--attestation-gate` modifier — primary-teal border at 2.5px, Lora italic for the label register. Even though the attestor here is the participant (not a clinician), the structural shape is the same.
- **Cross-boundary edges** are marked with the `arrow-end-emphasis` marker on the primary path — every step of this workflow crosses a medium boundary (face-to-face conversation → paper signature → hand-delivered paper → digital PDF).
- **Decline-to-sign terminal** is rendered as a separate `diagram-box--uncertain-gap` ghost terminal off the attestation gate, with a muted-dashed edge — the structural absence is the visible point.

## No watcher annotations

The escalation use case carries `▲ watches: clinical-lead` annotations on three of its five nodes. This use case carries **none**. The reason:

- The RD is both executor and effective supervisor of the consent execution at the visit; there is no separate observer role
- The program administrator's digitization step has no documented supervisor — pending Marrero clarification (this is itself a flag-able gap but is not currently rendered as such because no supervisor role is even named)
- Surfacing "no watcher" as an explicit absence is more honest than inventing a supervisor for diagram-completeness

This is a structural difference from the escalation use case worth surfacing in the coherence-synthesis pass.

## Instructions to the rendering agent (diagram-mapper)

Hand-author the SVG following the conventions established by escalation-phq9-positive (Layer 1 with manual coordinates is appropriate for a 4-node diagram). Reuse the inline `<style>` block of candidate modifier classes verbatim from the escalation rendered-diagram.html — do not redefine them, do not add new modifier classes.

Surface every uncertainty annotation as a small monospace callout above the affected node. The two GAP annotations are deliberately disruptive — the structural absences in the source SoP are the iteration mode of this spec.

Render the decline-to-sign terminal as a small ghost box in the PATIENT lane, off-path from the main flow, connected by a muted-dashed edge. The terminal label is "out of scope: decline-or-reschedule (gap)" — the visible record of the structural absence.
