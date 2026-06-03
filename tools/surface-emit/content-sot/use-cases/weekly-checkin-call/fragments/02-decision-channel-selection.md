---
fragment_id: 02-decision-channel-selection
type: decision
x_cena_actor: agent
x_cena_actor_role: care-coordination-agent
x_cena_watches: clinical-lead
x_cena_uncertainty: tbd
gaps:
  - data source for saved channel preference — is the field populated at enrollment or set during first contact? Pending compliance + enrollment SoP cross-reference
  - channel-switch logic if first channel fails (phone unanswered → text? wait and retry phone?) — pending cap-26 multi-modal contact protocol
branches:
  - condition: participant preference == phone
    target: 03-enquiry-checkin-call
    label: phone — call participant
  - condition: participant preference == text
    target: 03-enquiry-checkin-call
    label: text — initiate SMS thread
default: 03-enquiry-checkin-call
---

# Decision: Channel selection (phone or text)

The CC reads the participant's saved channel preference from the patient profile and initiates the check-in via that channel. Phone and text are the two supported channels per current SoP.

## Channel options

- **Phone** — voice call to the saved phone number. The CC follows the phone-call script (cap-25 — pending Dr. Wu script).
- **Text** — SMS thread on the platform's outbound messaging. The CC follows the text-thread script (cap-25 — pending Dr. Wu script).

## Open questions

- **Saved-preference data source** — is the channel-preference field already populated at enrollment, or set during first contact? Cross-reference enrollment SoP.
- **Channel-switch rules** — if the preferred channel fails (phone unanswered, text bounces, participant unreachable), what is the switch protocol? Wait a defined interval and retry on the same channel? Switch to the alternate channel? This is the cap-26 multi-modal contact protocol gap and is currently undefined.
- **Multi-modal contact attempts** — what counts as a "successful contact attempt" when one channel is tried and fails? Does a single voicemail count as one attempt against the week's allowance?

## Who watches

The clinical lead is the supervisor-of-record. The channel decision itself is deterministic by participant preference and does not require clinical-lead involvement; channel-switch and multi-modal protocol decisions, once defined, may require clinical-lead policy input.

## Authoring note (Cena-internal)

This fragment exercises:

- `type: decision` — PROforma decision primitive (simple binary branch on saved preference, no severity weighting)
- `x_cena_uncertainty: tbd` — channel-switch protocol pending cap-26
- Two branches on participant preference; no `x_cena_severity` because this is operational channel routing, not clinical severity
