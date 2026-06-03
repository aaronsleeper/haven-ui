---
fragment_id: 04-decision-threshold-check
type: decision
x_cena_actor: agent
x_cena_watches: clinical-lead
x_cena_uncertainty: tbd
gaps:
  - PHQ9 positive-response score threshold under CT scope-of-practice is explicitly pending Healthcare Data Governance review (catalog open question #2)
  - Q9 (suicidal ideation) any-positive override semantics — pending Marrero; consistency with escalation-phq9-positive trigger logic required
  - Whether the threshold differs between baseline and repeat-screening contexts — pending Marrero
branches:
  - condition: score >= threshold OR Q9 > 0
    target: 05-handoff-to-escalation-or-monitoring
    label: positive → same-day escalation
    x_cena_severity: red-yellow
  - condition: score < threshold AND Q9 == 0
    target: 05-handoff-to-escalation-or-monitoring
    label: sub-threshold → monitoring
    x_cena_severity: green
default: 05-handoff-to-escalation-or-monitoring
---

# Decision: Result meets escalation threshold?

The agent reads the captured PHQ9 result and checks it against the protocol-defined positive-response threshold. The decision is **threshold-based** — a single numeric comparison plus the Q9 override — and routes the case to one of two downstream destinations.

## Threshold check (TBD pending Healthcare Data Governance)

- **Positive — escalate same-day.** Total score ≥ [TBD: threshold pending HDG; standard clinical practice ranges from 10 to 15] OR Q9 (suicidal ideation) any-positive (score > 0).
- **Sub-threshold — monitoring.** Total score below threshold AND Q9 == 0. The result is stored on the participant record; no escalation fires. The clinical team uses the result for longitudinal comparison at the next protocol review point.

The specific threshold value is **explicitly pending Healthcare Data Governance review** per the catalog. Until set, follow PI guidance on positive-response handling (see fragment 02 scope-of-practice block).

## Q9 (suicidal ideation) override

Question 9 of the PHQ9 asks about suicidal ideation. Standard clinical practice treats any positive response on Q9 as an immediate escalation trigger regardless of total score. The Q9 override semantics need to be confirmed with Marrero; the trigger logic must align with the entry-condition of `escalation-phq9-positive` so a Q9-only positive flows the same escalation path as a high-total-score result.

## Context-sensitive thresholds (open question)

Whether the threshold differs between baseline and repeat-screening contexts (e.g., a sharper threshold at baseline to catch initial cases; a delta-aware threshold at repeat to catch trajectory changes) is **pending Marrero**.

## Who watches

The clinical lead is supervisor-of-record for the threshold check. Threshold-derived classification is policy, not clinical judgment per-case, so the agent applies the threshold; the clinical lead owns the policy (and any case where the agent flags an edge condition surfaces in the clinical-lead queue).

## Authoring note (Cena-internal — strip before SoP render)

This fragment exercises:

- `type: decision` — PROforma decision primitive
- `x_cena_actor: agent` — automated threshold comparison
- `x_cena_watches: clinical-lead` — supervisor-of-record for the threshold policy
- `x_cena_uncertainty: tbd` — threshold value pending HDG; the consistency-with-escalation-phq9-positive logic is the load-bearing structural property
- Branches with `x_cena_severity` — typed routing carries severity metadata; downstream escalation use case consumes the same severity vocabulary
