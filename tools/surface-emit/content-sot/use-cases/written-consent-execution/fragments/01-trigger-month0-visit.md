---
fragment_id: 01-trigger-month0-visit
type: enquiry
x_cena_actor: human
x_cena_actor_role: registered-dietitian
x_cena_uncertainty: resolved
trigger:
  source: Patient Month 0 visit scheduled and confirmed; participant arrives in person at the UConn site
  fires_when: participant physically present at visit AND RD ready to execute consent
gaps:
  - Witness requirement — IRB-compliant written consent in some protocols requires a witness signature; UConn IRB protocol specifics pending Marrero
outgoing_edges:
  - to: 02-attestation-participant-signs-consent
    type: default
    label: visit confirmed → execute consent
---

# Trigger: Month 0 in-person visit confirmed

The participant arrives at the UConn site for their Month 0 in-person visit. The Registered Dietitian (RD) confirms participant identity, reviews the visit purpose, and prepares to execute the IRB written consent form before any other visit activities begin.

## Trigger detail

- **Visit type:** Month 0 in-person (no remote or digital substitute permitted for this consent execution)
- **Location:** UConn site, in person
- **Prerequisite to:** baseline assessment (cannot proceed without signed consent)
- **Document:** IRB-approved paper consent form (current revision per UConn IRB protocol)

## Who executes vs. who attests

The RD is the executor of the consent process — they present the form, walk the participant through it, answer questions, and witness the signing. The attestor of the consent itself is the **participant**, whose signature on the paper form is the consent attestation. The RD's role is procedural execution; the legal weight of the act lives in the participant's signature.

## IRB witness note (TBD pending Marrero)

Some IRB-compliant written-consent protocols require a witness signature in addition to the executor and participant. Whether the UConn IRB protocol for this study requires a separate witness, or treats the executor as the witness, is pending Marrero confirmation. If a witness is required, the trigger may not fire until both RD and a designated witness are present.

## Authoring note (Cena-internal — strip before SoP render)

This fragment exercises:

- `x_cena_actor: human` + `x_cena_actor_role: registered-dietitian` — the executor of the procedural step
- `x_cena_uncertainty: resolved` — the trigger itself is well-defined (visit confirmed, participant present); the downstream witness requirement is the only labeled uncertainty
