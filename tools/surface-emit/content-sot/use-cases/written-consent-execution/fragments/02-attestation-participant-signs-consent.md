---
fragment_id: 02-attestation-participant-signs-consent
type: attestation-gate
x_cena_actor: patient
x_cena_actor_role: participant
x_cena_uncertainty: gap
attestation:
  attestor_role: participant
  evidence_required:
    - IRB-approved paper consent form (current revision)
    - participant identity verification (executed by RD before signing)
    - participant comprehension check (RD walks the form; answers questions)
  decision_payload_schema:
    decision: enum [signs, declines]
    signed_at: timestamp (handwritten date on form)
    signed_by: participant handwritten signature
    witnessed_by: RD signature (and witness signature if IRB-required — TBD)
  sla: same-visit (no off-site or follow-up signing for Month 0)
  escalation_on_timeout: not applicable — participant either signs at this visit or routes to decline-or-reschedule (gap; out of scope; no documented re-consent path)
gaps:
  - Decline-to-sign path — no documented procedure for a participant who declines at the visit; no re-consent pathway, no reschedule procedure, no termination-of-enrollment procedure (catalog open question; structural gap)
  - Comprehension threshold — what does "informed consent" require the RD to verify before accepting the signature; how is comprehension documented (pending Marrero)
  - Witness requirement and identity — if a witness is required, who; whether RD doubles as witness (pending UConn IRB protocol)
  - Patient-as-attestor handling in audit chain — this is the only use case in v0.1 where the attestor is the patient; audit-chain identity capture for a non-system, non-staff actor needs explicit treatment (structural shape worth flagging)
outgoing_edges:
  - to: 03-handoff-rd-to-administrator
    type: attestation-approved
    condition: decision == signs
    label: signed → handoff
  - to: out-of-scope-decline-or-reschedule
    type: attestation-declined
    condition: decision == declines
    label: declines → out of scope (no documented path)
---

# Attestation gate: Participant signs IRB written consent

The RD presents the IRB-approved paper consent form, walks the participant through its contents, answers questions, and confirms comprehension. The participant then either signs the form or declines.

## Evidence presented to the participant

- IRB-approved paper consent form (current revision per UConn IRB protocol)
- Study purpose, procedures, risks and benefits, voluntariness, confidentiality, and contact-for-questions language as specified in the consent form
- Opportunity for the participant to ask any clarifying questions before signing

## Signing decisions available

- **Signs** — the participant signs and dates the form by hand. The RD signs as executor (and as witness if IRB protocol permits). The signed paper form proceeds to hand-off (fragment 03).
- **Declines** — the participant declines to sign. The case routes out of scope for this use case. There is no documented procedure for what happens next.

## Decline-to-sign — structural gap

The parent SoP does not specify what happens if the participant declines to sign at the visit. There is:

- No documented re-consent pathway — can the participant change their mind later? Can they sign at a later visit?
- No documented reschedule procedure — can the Month 0 visit be re-attempted?
- No documented termination-of-enrollment procedure — what happens to participant data already collected (e.g., scheduling, contact)?

This is a structural absence flagged for Marrero. The outgoing edge to `out-of-scope-decline-or-reschedule` is rendered as a `diagram-box--uncertain-gap` terminal so the gap is visible on every render until it resolves.

## Patient-as-attestor — structural shape

In every other v0.1 catalog use case, the attestor is a clinician or named operations role. This is the only one where the attestor is the **participant** (`x_cena_actor: patient`, `x_cena_actor_role: participant`). The audit-chain treatment of a non-system, non-staff attestor needs explicit handling:

- Participant signature is captured on paper (the evidence of attestation lives on the physical form, not in a system)
- The digitized PDF (fragment 04) is the system-of-record evidence
- Chain-of-custody for participant attestation spans paper → administrator → PDF → Athena
- Audit-record identity for the participant uses participant ID (MRN equivalent) rather than a staff role + signature

The Friday session should surface this shape as a structural pattern that will recur in other patient-facing attestations (future use cases: medication consent, telehealth consent, data-sharing consent).

## Witness requirement (TBD pending Marrero)

If the UConn IRB protocol requires a separate witness signature beyond the executor, the witness identity and timing are pending. The simplest case is RD-as-witness; some protocols disallow this.

## Open questions for Marrero

- **Decline-to-sign path** — first-action specifics and downstream procedure (re-consent, reschedule, termination) for a participant who declines at the visit
- **Comprehension threshold** — what the RD must verify before accepting the signature; how comprehension is documented for audit
- **Witness requirement** — IRB-required witness identity; whether RD doubles as witness
- **Audit-chain treatment of patient-as-attestor** — how a non-staff attestor's identity is captured in the immutable audit record

## Authoring note (Cena-internal)

This fragment exercises:

- `type: attestation-gate` — Cena-novel spec primitive
- `x_cena_actor: patient` + `x_cena_actor_role: participant` — patient-as-attestor (unique in v0.1 catalog)
- `attestation.attestor_role: participant` — the structured contract; signature is on paper, not in a digital decision payload
- `x_cena_uncertainty: gap` — the decline-to-sign branch is a structural absence in the source SoP
