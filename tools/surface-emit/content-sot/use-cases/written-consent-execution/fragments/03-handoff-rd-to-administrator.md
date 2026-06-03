---
fragment_id: 03-handoff-rd-to-administrator
type: hand-off
x_cena_actor: human
x_cena_actor_role: registered-dietitian
x_cena_uncertainty: resolved
receiving_actor:
  role: program-administrator
  organization: Cena (UConn site administration)
  identity_resolution: defined in parent SoP — Program Administrator role; specific human pending Cena hire / UConn site assignment
handoff:
  package_contents:
    - signed paper IRB consent form (the physical artifact)
    - participant identifier (patient name + MRN for Athena routing)
    - visit date (handwritten on form by participant during signing)
  transport: physical paper hand-delivered same day
  acknowledgment_required: yes
  ack_sla: same-day (paper must reach administrator before end of business; verbal or written confirmation)
  on_ack_timeout:
    action: RD retains paper and re-attempts hand-off next business day; flags consent-delay note for Marrero / clinical lead
    target_role: registered-dietitian
gaps:
  - Same-day chain-of-custody for the paper itself — where the paper lives between signing and administrator pickup (RD's locked drawer? sealed envelope? direct hand-to-hand?) — pending Marrero / administrator SoP
  - Acknowledgment medium — verbal "got it" vs. signed transfer log vs. administrator countersignature on the form — pending Marrero
  - End-of-business cutoff time — what counts as "same day" if the visit ends at 4:55pm — pending Marrero
outgoing_edges:
  - to: 04-action-digitize-and-upload-to-athena
    type: handoff-acknowledged
    condition: administrator acknowledges receipt same day
    label: paper received → digitize
---

# Hand-off: RD → Program Administrator (paper, same day)

The RD hands the signed paper consent form to the Program Administrator the same day as the visit. This is the cross-medium transition that defines the use case's structural interest: the consent attestation lives on paper (fragment 02), but the system-of-record needs a PDF in Athena (fragment 04). The administrator is the human bridge between media.

## Package contents

- **Signed paper consent form** — the physical artifact, signed and dated by the participant; signed by the RD as executor (and witness if IRB-required)
- **Participant identifier** — name + MRN (handwritten on the form during signing) so the administrator can route the digitized PDF to the correct Athena participant record
- **Visit date** — handwritten on the form by participant; serves as the official consent-execution date for IRB audit

## Transport

The paper is hand-delivered. There is no digital transport for this hand-off — the paper is the source-of-truth attestation, and the next step requires the administrator to physically scan or photograph it. Cross-medium hand-offs are the structural distinctive of this use case.

## Acknowledgment

The administrator acknowledges receipt the same day, before close of business. The acknowledgment medium is pending Marrero clarification (verbal "got it" vs. signed transfer log vs. countersignature on the form).

If the administrator is unavailable the same day, the RD retains the paper in a chain-of-custody-preserving location (TBD pending Marrero) and re-attempts the next business day. A consent-delay note is flagged for clinical lead awareness.

## Chain-of-custody for the paper

The paper consent form is the legal attestation until it is digitized and uploaded. Where it lives between signing and administrator pickup is not currently specified:

- RD's locked drawer at the UConn site?
- Sealed envelope handed directly RD-to-administrator?
- Same-room hand-off immediately following the visit?

Each option has different chain-of-custody risk. Pending Marrero / Program Administrator SoP.

## Open questions

- Same-day chain-of-custody location and procedure
- Acknowledgment medium (verbal / log / countersignature)
- End-of-business cutoff time for "same day"
- Lost-paper recovery procedure (re-execute consent? IRB notification?)

## Authoring note (Cena-internal)

This fragment exercises:

- `type: hand-off` — Cena-novel spec primitive
- `receiving_actor` block — names the receiving role + organization (Program Administrator, Cena-side UConn site staff)
- Cross-medium hand-off structural shape — paper-to-administrator is not the typical Cena agent-to-system hand-off; this is the human-paper-human leg of a longer chain
- `x_cena_uncertainty: resolved` for the hand-off itself; specific same-day chain-of-custody gaps are flagged but the structural shape of "RD hands paper to administrator same day" is defined
