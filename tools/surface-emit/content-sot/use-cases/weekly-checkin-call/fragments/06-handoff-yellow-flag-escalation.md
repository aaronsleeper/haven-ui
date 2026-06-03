---
fragment_id: 06-handoff-yellow-flag-escalation
type: hand-off
x_cena_actor: human
x_cena_actor_role: care-coordinator
x_cena_watches: clinical-lead
receiving_actor:
  role: TBD — UConn clinical team member OR BHN intake coordinator (Cena-staffed?)
  organization: TBD — UConn clinical team (UConn-staffed?) OR BHN (Cena-staffed?)
  identity_resolution: catalog #1 structural gap — same as escalation-phq9-positive fragment 04; whether the receiving function is a UConn-side clinical team member or a Cena-staffed BHN coordinator is unresolved. The Care Coordinator SoP language for this use case currently says "UConn clinical team" but the BHN-vs-clinical-team distinction is not specified.
x_cena_uncertainty: assumption
handoff:
  package_contents:
    - patient identity package (name, DOB, contact, MRN if applicable)
    - check-in call summary (date, channel, duration, scope areas covered)
    - structured outcome (yellow flag classification, barrier categories, adherence rating)
    - concern detail (free-text narrative of what surfaced and why CC classified as yellow flag)
    - current care plan summary (diet, recent vitals, meds)
    - prior check-in history (trend across recent weeks)
    - preferred contact method + window
  transport: TBD — secure messaging API vs. Athena CommonWell vs. fax fallback (pending UConn partner protocol; same transport options as escalation-phq9-positive)
  acknowledgment_required: yes
  ack_sla: TBD — pending UConn partner protocol
  on_ack_timeout:
    action: escalate to clinical-lead via paging
    target_role: clinical-lead
gaps:
  - first-action specifics — what the CC does in the first 5 minutes after firing a yellow flag (e.g., stay on the line with the participant? hand off mid-call? schedule a same-day callback?) — pending Vanessa/Marrero (catalog #2 critical structural gap, same gap as escalation-phq9-positive fragment 03)
  - yellow-flag criteria definitions — which barriers/concerns warrant escalation (pending Marrero) — inherited from fragment 04 decision
  - receiving-actor identity resolution — UConn clinical team vs. Cena BHN coordinator unresolved (catalog #1 carry-forward)
  - whether yellow-flag escalation requires CC follow-up after handoff (e.g., log outcome of the escalated case in the patient profile, or does that flow back from UConn?) — pending Marrero
  - SLA expected from UConn side — pending partner protocol
outgoing_edges:
  - to: 05-action-log-outcome
    type: handoff-acknowledged
    condition: UConn ack received within SLA
    label: ack → CC logs escalation + sets next-touch
  - to: 05-action-log-outcome
    type: handoff-timeout
    condition: ack not received within SLA AND clinical-lead paging completes
    label: timeout-recovered → CC logs + sets next-touch
---

# Hand-off: Care Coordinator → UConn clinical team (yellow flag)

When a concern surfaces during the check-in call that meets yellow-flag criteria, the CC routes the case to the UConn clinical team for follow-up. This is a cross-organization hand-off — the receiving actor sits in a different organization with its own protocols. **There is no deferral to next week's routine touch — yellow flags route to the clinical team in the same operational window.**

This hand-off shares the receiving-actor edge with `escalation-phq9-positive` (fragment 04). The BHN-vs-UConn-clinical-team identity question is the same structural gap and resolves once for both use cases.

## Package contents

- **Patient identity package** — name, DOB, contact information, MRN if applicable
- **Check-in call summary** — date, channel (phone or text), call duration, which scope areas were covered (order support / adherence / barriers)
- **Structured outcome** — yellow-flag classification, barrier categories surfaced, adherence rating
- **Concern detail** — free-text narrative of what surfaced during the call and the CC's rationale for the yellow flag
- **Current care plan summary** — diet, recent vitals, current medications
- **Prior check-in history** — recent-weeks trend (adherence, barriers, prior flags) for clinical context
- **Patient preferences** — preferred contact method and window for any follow-up from the clinical team

## Transport (TBD pending UConn partner protocol)

Same three candidate transports as escalation-phq9-positive — resolved once for both use cases:

- **Secure messaging API** — direct integration with the receiving team's intake system
- **Athena CommonWell** — leverage existing referral channel
- **Fax fallback** — paper-trail path for digital-channel failure

## Acknowledgment contract

- The UConn clinical team acknowledges receipt within SLA [TBD pending UConn]
- If no acknowledgment within SLA, the case escalates to the Cena clinical lead via paging (paging mechanism TBD)
- Acknowledgment generates an audit-trail event captured against the case

## First-action specifics — critical Friday blocker

**What the CC does in the first 5 minutes after firing a yellow flag is undefined.** Open questions:

- Does the CC stay on the line with the participant while the handoff is in flight, or end the call and transmit asynchronously?
- If the call ends, does the CC commit to a same-day callback from the clinical team, or is the participant informed that "the clinical team will reach out"?
- If the participant is still engaged on the channel (text thread mid-conversation), does the CC bridge in the clinical team or hand the thread off?

The Care Coordinator SoP carries an explicit `[NEEDS VANESSA / MARRERO]` placeholder for this content; resolution is the catalog #2 critical structural gap and is the same gap surfaced in escalation-phq9-positive fragment 03.

## Open questions

- **Partner protocol gaps** — UConn-side hand-off contract not yet defined (UConn partner agreement still being scoped)
- **Receiving-actor identity** — UConn clinical team vs. Cena BHN coordinator unresolved (catalog #1 carry-forward, same gap as escalation-phq9-positive)
- **CC follow-up obligation** — after handoff, does the CC log the escalated-case outcome in the patient profile (e.g., when the clinical team's follow-up completes), or does that flow back via the platform automatically?

## Who watches

The clinical lead is the supervisor-of-record for the yellow-flag escalation route. If the hand-off times out, the clinical lead receives the timeout paging.

## Authoring note (Cena-internal)

This fragment exercises:

- `type: hand-off` — Cena-novel spec primitive
- `receiving_actor` block — same shape as escalation-phq9-positive fragment 04; identity resolution shares the catalog #1 gap
- `x_cena_uncertainty: assumption` — proceeding with assumptions about partner protocol pending UConn agreement
- `on_ack_timeout` — typed fallback path (paging to clinical lead)
- This is the cross-use-case shared edge with escalation-phq9-positive and phq9-administration — three use cases route into "UConn clinical team" today; the receiving identity is one structural gap blocking all three
