---
fragment_id: 03-enquiry-checkin-call
type: enquiry
x_cena_actor: human
x_cena_actor_role: care-coordinator
x_cena_watches: clinical-lead
x_cena_uncertainty: gap
trigger:
  source: channel selected and contact attempt initiated
  fires_when: CC begins the check-in conversation with the participant
gaps:
  - cap-25 CC do/don't guidance (service-provider-not-friend posture) — added 2026-06-02 but contingent on Dr. Wu script and data-goals draft; content not yet authored
  - cap-26 multi-modal contact protocol — undefined; channels, switch rules, and successful-contact-attempt semantics not authored
  - script-level scope guidance (order support / adherence / barriers) is named in the parent SoP but not yet operationalized per-call
outgoing_edges:
  - to: 04-decision-outcome-classification
    type: default
    label: call concludes (any outcome)
---

# Enquiry: Conduct the 10–15 minute check-in

The Care Coordinator conducts the check-in on the selected channel. The check-in covers three scope areas:

## Scope of the check-in

- **Order support** — confirmation that the participant received their meal delivery, troubleshooting any delivery issues, and capturing satisfaction signals.
- **Adherence** — capturing participant-reported adherence to the meal plan, identifying barriers to following the plan, and noting any deviations.
- **Barriers to participation** — surfacing any wraparound needs, life circumstances, or platform issues that interfere with the participant's engagement in the intervention.

## Time scope

The check-in is scoped to 10–15 minutes. If the participant raises a concern that needs deeper conversation, the CC captures the concern, logs it, and either escalates (yellow flag) or sets a follow-up touch — the routine check-in does not expand to absorb the concern in-line.

## Posture — service provider, not friend

The CC's posture during the call is "service provider, not friend" — the routine surfaces participant state, captures structured fields, and routes concerns to the right next step. This is **cap-25 guidance and is pending Dr. Wu script + data-goals draft**; the posture is named but not yet operationalized.

## Open questions

- **Cap-25 CC do/don't guidance** — pending Dr. Wu script and data-goals draft. The "service-provider-not-friend" posture is named but the operational specifics (what to say, what to avoid, how to redirect a friendly drift) are not yet authored.
- **Cap-26 multi-modal contact protocol** — if the CC begins on one channel and needs to switch mid-call (e.g., text exchange escalates and needs voice), what is the switch protocol? Undefined.
- **Per-scope script depth** — order support, adherence, and barriers are named scopes, but per-scope script content is not yet operationalized.

## Who watches

The clinical lead is the supervisor-of-record. The CC runs the call; the clinical lead reviews aggregate barrier patterns weekly and reviews any case where a yellow flag fires (see fragment 06).

## Authoring note (Cena-internal)

This fragment exercises:

- `type: enquiry` — the load-bearing information-gathering step (the call itself)
- `x_cena_actor: human` — the CC conducts the call (the agent surfaced the trigger; the human runs the conversation)
- `x_cena_uncertainty: gap` — cap-25 and cap-26 are structural gaps in current SoP; this fragment is the most operationally underspecified in the use case despite being the most-run step in Cena's workflow set
