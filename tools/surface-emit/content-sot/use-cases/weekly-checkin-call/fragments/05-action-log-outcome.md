---
fragment_id: 05-action-log-outcome
type: action
x_cena_actor: human
x_cena_actor_role: care-coordinator
x_cena_watches: clinical-lead
x_cena_uncertainty: tbd
gaps:
  - structured outcome-field schema (adherence rating, barrier categories, satisfaction signal) — pending Marrero + platform spec
  - next-touch cadence rules — fixed weekly vs. tier-by-barrier-severity vs. clinical-lead-set — pending Marrero
  - which fields the agent can pre-populate from the call vs. require explicit CC entry — pending platform spec
outgoing_edges:
  - to: out-of-scope-roster-refresh
    type: terminal
    label: case closed → roster re-sorts for next contact
---

# Action: Log outcome + set next-touch plan

The CC captures the structured contact outcome on the patient profile and sets the next-touch plan. This closes the case for the current week; the roster re-sorts and the next participant surfaces for the CC's next routine touch.

## Outcome fields captured

The structured outcome fields surfaced by the patient profile include:

- **Contact outcome enum** — successful / voicemail / no answer / refused / deferred (per fragment 04 classification)
- **Adherence rating** — participant-reported adherence to the meal plan (rating + free-text barrier notes)
- **Barriers surfaced** — categorized barriers (delivery, dietary, life-circumstance, platform, other) with free-text detail
- **Wraparound needs** — any non-clinical participant needs identified during the call (transportation, food security beyond Cena meals, social services)
- **Satisfaction signal** — participant-reported satisfaction with meals and program
- **Free-text note** — narrative summary of the call for clinical-lead review

## Next-touch plan

The next-touch plan is set on the patient profile with:

- **Next contact date** — default is next week per the 26-week routine cadence
- **Channel preference confirmation** — if participant requested a channel change, update the saved preference
- **Any open follow-up actions** — items the CC committed to during the call (e.g., research a delivery option, escalate a non-clinical concern to the program coordinator)

## Open questions

- **Structured field schema** — what specific fields does the patient profile surface for the CC to fill? Pending Marrero + platform spec.
- **Next-touch cadence rules** — is the next touch always +7 days from this contact, or does it adjust based on barrier severity (e.g., a participant reporting delivery issues gets a +3-day mid-week touch)? Pending Marrero.
- **Agent pre-population** — which fields can the agent pre-populate from call transcript / SMS thread vs. require explicit CC entry? Pending platform spec.

## Who watches

The clinical lead reviews aggregate adherence and barrier patterns in weekly review. Per-call log outcomes are routine and do not require per-case clinical-lead review.

## Authoring note (Cena-internal)

This fragment exercises:

- `type: action` — PROforma action primitive (state-change step closing the routine path)
- `x_cena_uncertainty: tbd` — structured-field schema and next-touch cadence pending Marrero + platform spec
- Terminal outgoing edge (`out-of-scope-roster-refresh`) — the case closes; the next participant surfaces via fragment 01's roster-top trigger in the next iteration
