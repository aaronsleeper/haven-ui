---
fragment_id: 03-attestation-rdn-approval
type: attestation-gate
x_cena_actor: human
x_cena_actor_role: registered-dietitian
x_cena_uncertainty: gap
attestation:
  attestor_role: registered-dietitian
  evidence_required:
    - completed combined-care-plan-and-meal-plan draft
    - baseline assessment battery results (snapshot used for authoring)
    - intake data snapshot
    - dietary requirements record (with Dr. Wu attribution if applicable)
    - participant-stated dietary + cultural preferences
  decision_payload_schema:
    decision: enum [approve, revise, defer]
    rationale: text
    signed_at: timestamp
    signed_by: registered-dietitian-id
  sla: TBD — within Month 0 visit window per current draft
  escalation_on_timeout: TBD — pending Marrero (the gate exists in workflow-spec but timeout behavior is not authored)
gaps:
  - The RDN approval gate is hardcoded in `planning/workflows/care-plan-creation/steps.md` but is NOT surfaced in the RD SoP body as a named step for the RD reader — structural gap (catalog open question)
  - SLA for RDN approval within the Month 0 visit window — pending Marrero
  - Whether a second-attestor pattern (e.g., Dr. Wu approves dietary requirements upstream) exists — pending Vanessa
  - Revise / defer decision criteria — pending Marrero
outgoing_edges:
  - to: 04-handoff-to-meal-prescription
    type: attestation-approved
    condition: decision == approve
    label: signed → activates → handoff
  - to: 02-action-author-combined-care-plan-and-meal-plan
    type: attestation-revise
    condition: decision == revise
    label: signed → revise → re-author
  - to: out-of-scope-deferred-care-plan
    type: attestation-deferred
    condition: decision == defer
    label: signed → deferred (case remains open)
---

# Attestation gate: RDN approves the combined artifact

The Registered Dietitian reviews the completed combined-care-plan-and-meal-plan draft against the participant's evidence package and records a structured sign-off. The signed approval activates the artifact and triggers the downstream meal-prescription hand-off (fragment 04).

## Structural gap — this gate exists in the workflow-spec but not in the SoP body

The RDN approval gate is **hardcoded** in the workflow-spec at `planning/workflows/care-plan-creation/steps.md` — the platform enforces it. But the RD SoP body **does not surface it as a named step** for the RD reader. An RD reading the SoP would not know there is an explicit approval action they must take before the combined artifact activates and meal prescription generates downstream.

This is a documentation gap, not a platform gap. The SoP needs a reconciliation pass to surface the approval step as a named action with clear evidence-package framing and decision payload. Until that lands, this fragment renders as `uncertain-gap` (red-dotted) in the diagram and `:::callout-error` in the SoP — the structural gap is the blocker, not the gate's behavior.

## Evidence package presented to the RDN

- Completed combined-care-plan-and-meal-plan draft (the artifact under review)
- Baseline assessment battery results — snapshot used for authoring
- Intake data snapshot
- Dietary requirements record with Dr. Wu attribution (if applicable — pending Vanessa)
- Participant-stated dietary and cultural preferences

## Sign-off decisions available

- **Approve** — the combined artifact is sound; the artifact activates and meal prescription generation triggers automatically (fragment 04 hand-off).
- **Revise** — the artifact requires changes before activation; routes back to authoring (fragment 02).
- **Defer with note** — incomplete information; the case stays open with a clinical note and re-routes after additional data is gathered. (Out of scope for this use case — separate deferred-care-plan path)

## Open questions for Marrero

- **SoP body reconciliation — the structural gap that names this fragment.** What text the RD SoP body should carry to make the RDN approval action visible as a named step. The workflow-spec already enforces it; the SoP just does not describe it.
- **SLA for RDN approval:** must the RDN sign within the Month 0 visit, before the participant leaves the room? Or is asynchronous post-visit approval acceptable?
- **Revise criteria:** what conditions warrant revise vs. defer? Could be authoring quality, missing inputs, or RDN clinical judgment.
- **Second-attestor pattern:** does Dr. Wu's role on dietary requirements (see fragment 02) constitute an upstream approval gate, or is it review-only? If approval, fragment 02 spawns a sibling attestation-gate before this one.

## Audit content captured at this gate

Every sign-off (approve, revise, defer) generates an immutable audit record with:

- Attestor identity (RDN ID)
- Decision selected
- Rationale (free text, required)
- Timestamp
- Evidence package snapshot (combined-artifact draft + inputs — exactly what the RDN saw)

The chain-of-custody hash extends from baseline-collection through artifact-authoring through approval, providing the structural defensibility Cena bets on as the agentic-discoverability proof.

## Authoring note (Cena-internal)

This fragment exercises:

- `type: attestation-gate` — Cena-novel spec primitive (RDN sign-off before artifact activation)
- `attestation.attestor_role` + `evidence_required` + `decision_payload_schema` — the structured contract
- `x_cena_uncertainty: gap` — the gate exists in the workflow-spec but **the SoP body does not describe it** — structural gap labeled with red-dotted modifier in the diagram and `:::callout-error` in the SoP
