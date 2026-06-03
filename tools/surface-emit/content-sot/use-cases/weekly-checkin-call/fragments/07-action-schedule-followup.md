---
fragment_id: 07-action-schedule-followup
type: action
x_cena_actor: human
x_cena_actor_role: care-coordinator
x_cena_watches: clinical-lead
x_cena_uncertainty: gap
gaps:
  - cap-26 multi-modal contact protocol — undefined; retry cadence, channel-switch rules, and what counts as a successful contact attempt across modalities are not authored
  - retry-attempt allowance per week — how many voicemails / no-answers / refused before the case escalates to clinical-lead review — pending Marrero
  - refused-outcome routing — does a refused contact route to clinical-lead review immediately, or accumulate (e.g., 2 consecutive refusals) before review fires — pending Marrero
  - deferred-outcome semantics — when the participant reschedules, is the next-touch the new requested time (and counts as the week's touch), or is the week's contact still considered un-completed? Pending Marrero
outgoing_edges:
  - to: 05-action-log-outcome
    type: default
    label: log outcome → roster re-sorts for retry
  - to: out-of-scope-clinical-lead-review
    type: pattern-trigger
    condition: refused outcome OR retry-attempt allowance exceeded
    label: clinical-lead review queue
---

# Action: Schedule follow-up retry

When the contact outcome is voicemail, no answer, refused, or deferred, the CC schedules a follow-up retry per the cap-26 multi-modal contact protocol. The case does not close to the routine "next-week touch" — the unsuccessful contact still owes a successful touch for this week.

## Per-outcome handling

- **Voicemail** — CC scheduled a retry attempt on the same or alternate channel per cap-26 protocol; voicemail script content is captured in the call log (pending cap-25 script).
- **No answer** — CC scheduled a retry attempt; the no-answer event counts against the week's contact-attempt allowance (allowance TBD).
- **Refused** — CC logs the refusal with free-text rationale and flags the case for clinical-lead review (immediate flag vs. accumulated pattern is pending Marrero).
- **Deferred** — CC schedules the next contact at the participant's requested time. Whether this counts as the week's touch is pending Marrero.

## Follow-up retry scheduling

The retry is scheduled on the patient profile with:

- **Next attempt date/time** — per cap-26 protocol (currently undefined; placeholder: +24 hours for voicemail/no-answer, +participant-requested for deferred)
- **Channel for retry** — same as original or switched per cap-26 (currently undefined)
- **Attempt counter** — incremented; case escalates to clinical-lead review when the allowance is exceeded (allowance TBD)

## Open questions

- **Cap-26 multi-modal contact protocol** — entire protocol is undefined: retry cadence, channel-switch rules, what counts as a successful contact attempt across modalities. This is the same structural gap surfaced in fragment 02.
- **Retry-attempt allowance per week** — how many attempts before clinical-lead review fires? Pending Marrero.
- **Refused routing** — immediate flag or accumulated pattern? Pending Marrero.
- **Deferred week-touch semantics** — does a participant-requested reschedule count as this week's touch, or does the week stay open? Pending Marrero.

## Who watches

The clinical lead is the supervisor-of-record. Refused outcomes and exceeded-allowance retries route to the clinical-lead review queue per the pattern-trigger edge.

## Authoring note (Cena-internal)

This fragment exercises:

- `type: action` — PROforma action primitive (state-change step closing the unsuccessful-contact path with a scheduled retry)
- `x_cena_uncertainty: gap` — cap-26 multi-modal contact protocol is the primary structural gap; this fragment is heavily marked as gap-pending because cap-26 governs the routing rules
- Two outgoing edges: routine retry (loops back through fragment 05 for outcome logging) and pattern-trigger to clinical-lead review for refused / exceeded-allowance cases
- This fragment's `x_cena_uncertainty: gap` complements the use case's two-tbd, two-resolved, two-assumption distribution — labeled-uncertainty is the deliverable, not a polished SoP draft
