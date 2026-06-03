---
fragment_id: 01-trigger-roster-top
type: enquiry
x_cena_actor: agent
x_cena_actor_role: care-coordination-agent
x_cena_watches: clinical-lead
x_cena_uncertainty: resolved
trigger:
  source: Care Coordinator roster view in patient profile surface
  fires_when: participant appears at top of roster by days-since-last-contact AND current week is within the 26-week intervention window
gaps:
  - confirmation that the roster-sort field is days-since-last-contact (vs. days-since-enrollment or a composite) — pending platform spec
outgoing_edges:
  - to: 02-decision-channel-selection
    type: default
    label: roster surfaces next participant
---

# Trigger: Participant surfaces at top of CC roster

The Care Coordinator opens the patient profile surface to begin the weekly check-in routine. The roster view sorts participants by days-since-last-contact, surfacing the participant most overdue for a touch at the top of the list.

## When this fires

- A participant appears at the top of the roster by days-since-last-contact rank
- The participant is within the 26-week intervention window (week 1 through week 26)
- The CC is ready to initiate the routine weekly check-in (10–15 minute scope)

## Cadence

The participant is touched once per intervention week. The roster sort makes the "next to touch" decision deterministic for the CC — there is no manual selection of who to call.

## Who watches

The clinical lead is the supervisor-of-record for the check-in routine overall. The CC is the per-call actor; aggregate adherence and barrier patterns roll up to the clinical lead for weekly review and to monthly reporting.

## Authoring note (Cena-internal — strip before SoP render)

This fragment exercises:

- `type: enquiry` — PROforma enquiry primitive (information-gathering step opening the workflow)
- `x_cena_actor: agent` — the agent surfaces the roster sort; the CC reads and acts
- `x_cena_watches: clinical-lead` — supervisor of record for the routine
- `x_cena_uncertainty: resolved` — trigger semantics are well-defined; the only gap is a platform-spec confirmation
