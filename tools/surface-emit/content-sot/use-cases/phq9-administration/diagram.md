---
use_case: phq9-administration
diagram_type: swimlane-flow
layout_direction: horizontal-left-to-right
viewbox: "0 0 1180 540"
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
      - care-coordinator (CITI-trained)
  - id: partner
    label: PARTNER
    y_center: 340
    actors:
      - uconn-pi (watcher only — scope-of-practice oversight)
  - id: system
    label: SYSTEM
    y_center: 460
    actors:
      - scheduling-system
      - cena-platform-assessment-forms
node_placement:
  01-trigger-screening-milestone:
    lane: system
    x_center: 185
    emphasis: default
  02-action-cc-administers-phq9:
    lane: human
    x_center: 420
    emphasis: high
  03-enquiry-score-captured:
    lane: system
    x_center: 660
    emphasis: default
  04-decision-threshold-check:
    lane: agent
    x_center: 880
    emphasis: default
  05-handoff-to-escalation-or-monitoring:
    lane: agent
    x_center: 1080
    emphasis: high
edges_from_manifest: true
edge_overrides:
  - from: 01-trigger-screening-milestone
    to: 02-action-cc-administers-phq9
    stroke: default
    label: "milestone → CC"
  - from: 02-action-cc-administers-phq9
    to: 03-enquiry-score-captured
    stroke: default
    label: "complete → save"
  - from: 03-enquiry-score-captured
    to: 04-decision-threshold-check
    stroke: default
    label: "score → check"
  - from: 04-decision-threshold-check
    to: 05-handoff-to-escalation-or-monitoring
    stroke: default
    label: ""
  - from: 05-handoff-to-escalation-or-monitoring
    to: out-of-scope-escalation-phq9-positive
    stroke: emphasis
    label: "positive → escalation use case"
  - from: 05-handoff-to-escalation-or-monitoring
    to: out-of-scope-longitudinal-monitoring
    stroke: muted
    style: dashed
    label: "sub-threshold → monitoring"
uncertainty_visualization:
  - target: 02-action-cc-administers-phq9
    modifier: diagram-box--uncertain-tbd
    callout: "[TBD] CT scope-of-practice pending HDG · UI build state unconfirmed"
    callout_position: above
  - target: 04-decision-threshold-check
    modifier: diagram-box--uncertain-tbd
    callout: "[TBD] threshold pending HDG (same gap as escalation 01)"
    callout_position: above
  - target: 05-handoff-to-escalation-or-monitoring
    modifier: diagram-box--uncertain-gap
    callout: "[GAP] remote-channel first-action specifics pending Marrero (catalog #4)"
    callout_position: above
watcher_annotations:
  - target: 01-trigger-screening-milestone
    watcher_role: care-coordinator
    label: "▲ watches: care-coordinator"
  - target: 02-action-cc-administers-phq9
    watcher_role: uconn-pi
    label: "▲ watches: UConn PI (partner)"
  - target: 04-decision-threshold-check
    watcher_role: clinical-lead
    label: "▲ watches: clinical-lead"
  - target: 05-handoff-to-escalation-or-monitoring
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
caption: "Administration trigger → CC administers (UConn PI watches CT scope) → score captured → threshold check → routes to escalation (same-day, no deferral) or longitudinal monitoring. Partner-as-watcher is the load-bearing structural feature."
---

# Diagram intent — PHQ9 administration

## What this diagram emphasizes

The **partner-as-watcher annotation on fragment 02** is the structural feature this use case shows for the first time. Vanessa and Marrero should see at a glance: the UConn PI sits in the PARTNER lane but does not produce a step — the PI is watching the CC's scope-of-practice on PHQ9 administration until CT licensure is confirmed. The watcher-link from fragment 02 down into the PARTNER lane is what makes this visible.

The secondary emphasis is the **terminal hand-off** (fragment 05): same-day routing to the escalation use case on a positive result, passive routing to longitudinal monitoring on sub-threshold. The downstream escalation use case is referenced, not duplicated — the edge crosses out-of-frame to the sibling use case.

## Lane choice

Four lanes (AGENT / HUMAN / PARTNER / SYSTEM) stratified by **actor type**, matching the escalation worked example's axis. Same lane vocabulary; the actors are different per use case.

A PATIENT lane was considered (the patient completes the questionnaire) but rejected. The patient's involvement is encapsulated in the CC's action step — the patient is a participant in the CC's action, not a workflow actor with their own routing decisions. The administration step (fragment 02) reads as "CC administers the PHQ9 with the patient"; promoting the patient to a lane would scatter the administration moment across two boxes without adding clarity. Reserve PATIENT-lane for use cases where the patient takes a step that routes independently (e.g., patient-driven check-ins, patient-portal self-service flows).

The PARTNER lane is occupied **by a watcher only**, not by a step actor. The UConn PI provides scope-of-practice oversight on fragment 02 but does not produce a workflow step. This is the partner-as-watcher case; the watcher annotation crosses lane lines visually, which is the intended read.

## Layout direction

Left-to-right because the temporal sequence is strictly linear (trigger → administer → capture → check → route). No back-edges or deferrals on the happy path; the only branching is at the terminal hand-off.

## Visualization rules

- **Uncertainty tier maps to modifier class** — same convention as escalation. Three uncertainty annotations:
  - Fragment 02 → `diagram-box--uncertain-tbd` (amber-dashed) — CT scope-of-practice + UI build state are TBD pending HDG/Marrero
  - Fragment 04 → `diagram-box--uncertain-tbd` (amber-dashed) — threshold value pending HDG; **explicitly the same gap shape as escalation fragment 01**, deliberately rendered with the same modifier for consistency (coherence-synthesis pass will check)
  - Fragment 05 → `diagram-box--uncertain-gap` (red-dotted) — remote-channel first-action specifics are a structural absence per catalog open question #4
- **Watcher annotation** renders as a small monospace label inside the box (`▲ watches: <role>`). Fragment 02's watcher (`uconn-pi`) is the partner-as-watcher case — a visual variant could render the watcher-link as a short line down into the PARTNER lane, but for this draft the watcher-label inside the HUMAN-lane box names the partner role explicitly. Candidate `diagram-box--watcher-cross-lane` modifier is a future-self note (do **not** add to the inline style block; promotion path is the same Tier 1 PL review).
- **Emphasis on fragment 02 (administration)** uses the `--attestation-gate` modifier even though the step is type `action`, not `attestation-gate`. Rationale: the brand-fidelity register (primary-teal border 2.5px, Lora italic) signals "load-bearing human moment" — the CC administering the screening is the load-bearing human moment of this use case, parallel to the clinical-lead attestation moment in the escalation worked example. The modifier choice is a render decision, not a type-shape change.
- **Emphasis on fragment 05 (handoff)** also uses `--attestation-gate` to draw the eye to the terminal routing decision. Two emphasized boxes is a deliberate choice for this use case — the administration moment and the routing-to-escalation moment are the two operationally load-bearing events.
- **Cross-boundary edge** on the positive path uses `arrow-end-emphasis` — the case crosses out of this use case's frame into the escalation use case's frame.

## Instructions to the rendering agent (diagram-mapper)

Hand-author the SVG following the conventions in `~/.claude/plans/haven-ui-diagram-research.md` §D3.

**Reuse the inline style block from the escalation worked example verbatim.** All 5 candidate modifier classes (`--attestation-gate`, `--uncertain-tbd`, `--uncertain-assumption`, `--uncertain-gap`, `.diagram-box-watcher-label` + `.diagram-tbd-callout` family) are inline-defined in escalation's `rendered-diagram.html`; copy the entire style block into this use case's rendered output with the same `CANDIDATE FOR PROMOTION` comment. Do not redefine; do not add new modifier classes.

**Future-self note (do not add now):** the partner-as-watcher annotation could be visualized as a short line from the watcher-label down into the PARTNER lane label, with a candidate modifier `diagram-box--watcher-cross-lane`. For this draft, the watcher-label text inside the HUMAN-lane box names the partner role (`▲ watches: UConn PI (partner)`) and the PARTNER lane is empty of step boxes — the visual read is "this lane carries the supervisor-of-record, even though no step lives there." Promoting the cross-lane watcher modifier is a Tier 1 PL change pending 4-expert review; the draft uses the text annotation only.

Surface every uncertainty annotation as a small monospace callout above the affected node — same convention as escalation.
