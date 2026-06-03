---
fragment_id: 05-handoff-protocol-refinement-routing
type: hand-off
x_cena_actor: human
x_cena_actor_role: meeting-owner (Vanessa current → Marrero post-launch)
x_cena_watches: ownership-transition-shadow (Vanessa watches Marrero during transition cycles; Marrero watches self post-handoff)
receiving_actor:
  role:
    - Dr. Marrero — for clinical-classified refinements
    - Vanessa Sena — for operational-classified refinements
  organization: Cena
  identity_resolution: catalog records the routing rule (clinical → Marrero; operational → Vanessa) but does NOT define the classification criteria — what makes a refinement "clinical" vs "operational" is undefined
x_cena_uncertainty: gap
handoff:
  package_contents:
    - protocol refinement proposal text (description, motivating signal from meeting discussion)
    - classification (clinical vs operational) — currently meeting-owner judgment, no defined criteria
    - meeting notes excerpt (relevant context from facilitation)
    - target owner (Marrero or Vanessa)
  transport: TBD — informal handoff (Slack? email?) assumed; no formal transport specified
  acknowledgment_required: not specified
  ack_sla: not specified
  on_ack_timeout: not defined
ownership_transition_arc:
  description: |
    This fragment surfaces a second, larger hand-off the catalog flagged but did not specify — the ownership transition from Vanessa to Marrero across multiple meeting cycles. This is a NOVEL attestation-gate shape: Vanessa attests that Marrero is ready to assume ownership. No attestation step currently defined.
  current_attestor: Vanessa Sena
  future_attestor: Dr. Marrero
  attestation_gate: NOT DEFINED — see gap below
gaps:
  - Classification criteria (clinical vs operational) undefined — without it, routing is meeting-owner judgment with no checkable criterion
  - Transport mechanism (Slack, email, structured queue) undefined
  - Acknowledgment contract from receiving owner undefined (no SLA, no timeout fallback)
  - Whether a refinement can be both clinical AND operational (and route to both) undefined
  - Ownership transition cadence — how many cycles Vanessa walks Marrero through before formal handoff — undefined
  - Ownership transition attestation gate — what does it mean for Marrero to be "ready"? — undefined; this is a NOVEL attestation shape (Vanessa attesting that Marrero is ready) with no defined criterion, evidence requirement, or sign-off mechanism
  - Whether any routed refinement reaches BHN (Behavioral Health Network) — if a clinical refinement touches BHN-relevant care, the BHN role unresolved gap (catalog #1 structural gap — Cena-staffed vs UConn-side clinical-team function) applies here too
outgoing_edges:
  - to: out-of-scope-clinical-refinement-pipeline
    type: classification-routing
    condition: classification == clinical
    label: → Marrero
  - to: out-of-scope-operational-refinement-pipeline
    type: classification-routing
    condition: classification == operational
    label: → Vanessa
  - to: out-of-scope-ownership-transition-arc
    type: deferred-attestation
    condition: meeting cycle counts toward ownership transition
    label: cycle-counter → ownership transition (NO GATE DEFINED)
---

# Hand-off: Protocol refinement routing + ownership-transition arc

This fragment carries TWO hand-offs the catalog flagged but did not fully specify:

1. **Per-meeting refinement routing** — refinement proposals surfaced in facilitation route to Marrero (if clinical) or Vanessa (if operational).
2. **Cross-cycle ownership transition** — meeting ownership migrates from Vanessa to Marrero over multiple cycles. The catalog flagged this as having no defined attestation step.

## Per-meeting refinement routing

The meeting owner classifies each protocol refinement proposal as clinical or operational and routes accordingly:

- **Clinical** → Dr. Marrero
- **Operational** → Vanessa Sena

Classification criteria are undefined. Currently the meeting owner uses judgment; there is no checkable rule. Whether a refinement can be both (route to both) is also undefined.

Transport is informal (Slack / email assumed). No acknowledgment contract or SLA is defined for the receiving owner.

If a clinical refinement touches care that would route to BHN, the catalog #1 structural gap (BHN role unresolved — Cena-staffed vs UConn-side clinical-team function) applies. This use case does NOT itself route to BHN, but a downstream clinical refinement might.

## Ownership-transition arc (NOVEL attestation shape — NO GATE DEFINED)

The catalog records that Vanessa must walk Marrero through several cycles before formal ownership handoff, but does NOT define:

- How many cycles
- What "walked through" looks like (shadowing? co-facilitating? Vanessa-present-but-silent?)
- What "ready" means
- Who attests to readiness, with what evidence, and through what sign-off mechanism

This is a NOVEL attestation-gate shape — the attestor is Vanessa, and the thing being attested is that Marrero is ready to assume ownership. No analogous gate exists elsewhere in the surveyed catalog. The structural shape is present and load-bearing; the operational content is entirely absent.

## Who watches

During transition cycles, Vanessa is supervisor-of-record (she's watching Marrero perform the role). Post-handoff, Marrero watches own work. The transition itself has NO supervisor-of-record gate — Vanessa's attestation that Marrero is ready is undefined.

## Authoring note (Cena-internal — strip before SoP render)

This fragment exercises:

- `type: hand-off` — Cena-novel spec primitive (TWO hand-offs in one fragment — per-meeting refinement routing + cross-cycle ownership transition)
- `receiving_actor` block with conditional routing (clinical / operational)
- `x_cena_uncertainty: gap` — most operational content absent
- Novel attestation shape (ownership transition) surfaced as an ungated arc — a candidate gate the coherence-synthesis pass could flag as worth authoring
- Cross-reference to catalog #1 structural gap (BHN role) — applies conditionally if downstream clinical refinements touch BHN-relevant care
