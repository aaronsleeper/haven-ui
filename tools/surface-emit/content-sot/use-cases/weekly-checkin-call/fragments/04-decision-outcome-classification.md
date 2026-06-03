---
fragment_id: 04-decision-outcome-classification
type: decision
x_cena_actor: human
x_cena_actor_role: care-coordinator
x_cena_watches: clinical-lead
x_cena_uncertainty: tbd
gaps:
  - boundary semantics for the 5-way enum — pending Marrero (e.g., "deferred" vs. "no answer" when participant reschedules mid-call vs. doesn't pick up)
  - yellow-flag criteria — pending Marrero; which barriers or concerns surfaced during the call warrant escalation vs. log-and-monitor is the primary clinical-policy question for this fragment
  - whether "successful" outcome can co-occur with "yellow flag" (i.e., contact was completed AND a concern surfaced) — pending Marrero; current SoP language implies yes (the catalog notes yellow-flag escalation is "no deferral to next scheduled check-in")
branches:
  - condition: contact completed AND no yellow flag
    target: 05-action-log-outcome
    x_cena_severity: green
    label: successful — log + next-touch
  - condition: contact completed AND yellow flag (concern surfaced)
    target: 06-handoff-yellow-flag-escalation
    x_cena_severity: yellow
    label: yellow flag — escalation route
  - condition: contact NOT completed — voicemail left
    target: 07-action-schedule-followup
    x_cena_severity: green
    label: voicemail — schedule retry
  - condition: contact NOT completed — no answer
    target: 07-action-schedule-followup
    x_cena_severity: green
    label: no answer — schedule retry
  - condition: contact attempted but participant declined
    target: 07-action-schedule-followup
    x_cena_severity: green
    label: refused — log + flag for clinical-lead review
  - condition: contact rescheduled by participant mid-call
    target: 07-action-schedule-followup
    x_cena_severity: green
    label: deferred — log + schedule per participant request
default: 05-action-log-outcome
---

# Decision: Outcome classification (5-way)

The CC classifies the contact outcome at the end of the call. The classification determines the next routing — log-and-next-touch, yellow-flag escalation, or follow-up retry scheduling.

## Outcome classifications (5-way enum)

- **Successful** — contact completed; participant engaged across the three scope areas. Routes to log-outcome + next-touch (fragment 05).
- **Voicemail** — call reached voicemail; CC left a structured message. Routes to follow-up scheduling (fragment 07).
- **No answer** — call did not connect; no voicemail option (or text thread received no reply within window). Routes to follow-up scheduling (fragment 07).
- **Refused** — participant declined to engage. Routes to follow-up scheduling (fragment 07) with a flag for clinical-lead review.
- **Deferred** — participant requested to reschedule the check-in to a different time. Routes to follow-up scheduling (fragment 07) per participant's stated preference.

## Yellow-flag overlay

In parallel with the contact-outcome classification, the CC evaluates whether any concern surfaced during the call meets yellow-flag criteria. A yellow flag fires when a barrier or concern surfaces that warrants same-day escalation rather than deferral to next week's routine touch. **Yellow flags route to escalation (fragment 06) regardless of contact-outcome classification — there is no deferral to the next scheduled check-in.**

Per current SoP language, a "successful" contact-outcome and a "yellow flag" can co-occur — completing the contact AND surfacing an escalation-worthy concern. The routing precedence is: yellow flag wins over contact-outcome for the next-step routing.

## Open questions for Marrero

- **5-way enum boundary semantics** — when does a participant who answers but reschedules mid-call count as "deferred" vs. "successful" (with a next-touch set to the rescheduled time)? When does an unanswered call count as "voicemail" vs. "no answer" if the line allows leaving a message but the CC chooses not to?
- **Yellow-flag criteria** — which barriers or concerns trigger a yellow flag vs. routine log-and-monitor? This is the primary clinical-policy question for the outcome decision and is undefined in the current SoP.
- **Co-occurrence** — confirm that "successful AND yellow flag" is a valid combination and that the yellow-flag escalation routing takes precedence.

## Who watches

The clinical lead is the supervisor-of-record. Yellow-flag classifications route directly to the UConn clinical team via fragment 06; the clinical lead reviews refused-outcome and pattern-of-no-contact cases in weekly review.

## Authoring note (Cena-internal)

This fragment exercises:

- `type: decision` — PROforma decision primitive (5-way enum branching)
- `x_cena_severity` — marks yellow flag explicitly; other outcomes are routine (green) and do not carry severity weight even when routing to follow-up
- `x_cena_uncertainty: tbd` — boundary semantics and yellow-flag criteria are pending Marrero confirmation
- Routing-precedence rule (yellow flag wins over contact-outcome) is encoded in the branch ordering but should be made explicit in the rendered SoP for the CC
