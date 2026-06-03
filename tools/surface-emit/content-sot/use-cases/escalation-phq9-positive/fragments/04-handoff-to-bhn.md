---
fragment_id: 04-handoff-to-bhn
type: hand-off
x_cena_actor: agent
x_cena_actor_role: care-coordination-agent
x_cena_watches: clinical-lead
receiving_actor:
  role: TBD — BHN intake coordinator OR UConn clinical team member
  organization: TBD — BHN (Cena-staffed?) OR UConn clinical team (UConn-staffed?)
  identity_resolution: catalog #1 structural gap — BHN entirely absent from UConn SoP family; defined in Cena planning workflows (02-clinical-care, 07-risk-management) as a Cena platform capability; whether Cena-staffed or UConn-side function is unresolved
x_cena_uncertainty: assumption
handoff:
  package_contents:
    - patient identity package (name, DOB, contact, MRN if applicable)
    - PHQ9 result + answer pattern
    - C-SSRS results if administered (referenced in planning workflows as the secondary instrument tied to BHN handoff; adoption pending)
    - clinical-lead attestation record (decision, rationale, signed_at, signed_by)
    - care plan summary (current diet, recent vitals, meds)
    - preferred contact method + window
  transport: TBD — secure messaging API vs. Athena CommonWell vs. fax fallback (pending partner protocol)
  acknowledgment_required: yes
  ack_sla: TBD — pending partner protocol
  on_ack_timeout:
    action: escalate to clinical-lead via paging
    target_role: clinical-lead
gaps:
  - BHN partner protocol for receiving handoffs (technical channel + workflow) — pending UConn partner agreement
  - Identity resolution for the receiving actor (named BHN coordinator vs. role-based queue) — pending UConn
  - Ack SLA expected from BHN side — pending UConn
  - Patient consent verification before handoff (already covered in enrollment? re-verify?) — pending Marrero + compliance
outgoing_edges:
  - to: 05-attestation-audit-record
    type: handoff-acknowledged
    condition: ack received within SLA
    label: BHN ack → audit
  - to: 05-attestation-audit-record
    type: handoff-timeout
    condition: ack not received within SLA
    label: timeout → escalation re-fired
---

# Hand-off: Care Coordinator → BHN partner

The Cena care-coordination agent packages the case and transmits it to the BHN partner for follow-up. This is a cross-organization hand-off — the receiving actor sits in a different organization with its own protocols.

## Package contents

- **Patient identity package** — name, DOB, contact information, MRN if applicable
- **Clinical context** — PHQ9 result and answer pattern, prior screenings if available
- **Clinical-lead attestation record** — the signed sign-off from gate 03 with decision, rationale, timestamp, and attestor identity
- **Care plan summary** — current diet, recent vitals, current medications
- **Patient preferences** — preferred contact method (phone / SMS / portal), preferred contact window

## Transport (TBD pending UConn partner protocol)

Three candidate transports per yesterday's UConn workflow mapping:

- **Secure messaging API** — direct integration with BHN's intake system (preferred when available)
- **Athena CommonWell** — leverage existing referral channel; BHN consumes via their EHR connector
- **Fax fallback** — paper-trail path for when digital channels fail

## Acknowledgment contract

- BHN intake coordinator acknowledges receipt within SLA [TBD pending UConn]
- If no acknowledgment within SLA, the agent escalates back to the Cena clinical lead via paging (paging mechanism TBD)
- Acknowledgment generates an audit-trail event captured in fragment 05

## Open questions

- **Partner protocol gaps** — BHN side of the hand-off contract is not yet defined (UConn partner agreement still being scoped)
- **Identity resolution** — does Cena route to a named BHN coordinator or a role-based queue? Yesterday's mapping flagged this as pending
- **Consent verification** — is the patient's consent for BHN sharing covered in enrollment, or re-verified here? Compliance question for Marrero + clinical-lead

## Who watches

The clinical lead remains supervisor-of-record for the handoff. If the hand-off times out, the clinical lead receives the timeout escalation.

## Authoring note (Cena-internal)

This fragment exercises:

- `type: hand-off` — Cena-novel spec primitive
- `receiving_actor` block — names the receiving role + organization explicitly (BPMN's Message Flow shape, but with typed receiver)
- `x_cena_uncertainty: assumption` — we're proceeding with assumptions about the partner protocol that need verification
- `on_ack_timeout` — typed fallback path different from the normal "ack received" edge
