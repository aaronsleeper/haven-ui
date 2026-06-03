---
fragment_id: 05-handoff-to-escalation-or-monitoring
type: hand-off
x_cena_actor: agent
x_cena_actor_role: care-coordination-agent
x_cena_watches: clinical-lead
x_cena_uncertainty: gap
handoff:
  positive_path:
    target_use_case: escalation-phq9-positive
    target_fragment: 01-trigger-phq9-positive (entry of escalation use case)
    package_contents:
      - canonical PHQ9 record from fragment 03 (total score, per-item, admin metadata)
      - patient identity package
      - administration context (in-person baseline vs. remote repeat-screening)
      - prior PHQ9 screenings if any (for trajectory at decision time downstream)
    sla: same-day — no deferral to next check-in (per catalog attestation/escalation point)
    on_sla_miss:
      action: page clinical lead + log SLA-miss event
      target_role: clinical-lead
  monitoring_path:
    target_use_case: out-of-scope-longitudinal-monitoring
    package_contents:
      - canonical PHQ9 record from fragment 03 (available to clinical team for next protocol review)
    sla: not applicable (passive — record sits on participant record for review at next milestone)
gaps:
  - First-action specifics for a positive response captured during a remote check-in (vs. in-person baseline) are not addressed (catalog open question #4); the in-person path benefits from CC + RD being co-located, the remote path needs explicit channel + reach-back protocol
  - First-action specifics for the CC handling a positive response handoff pending Vanessa/Marrero (catalog #2 structural gap — what the CC does in the first 5 minutes of a positive PHQ9 is undefined; this is the same gap that the downstream escalation use case names at its clinical-lead gate)
  - BHN role unresolved — Cena-staffed vs UConn-side clinical-team function (catalog #1 structural gap); inherited via downstream escalation
outgoing_edges:
  - to: out-of-scope-escalation-phq9-positive
    type: escalation-route
    condition: positive (score >= threshold OR Q9 > 0)
    label: same-day → escalation use case entry
  - to: out-of-scope-longitudinal-monitoring
    type: handoff-passive
    condition: sub-threshold AND Q9 == 0
    label: stored → next protocol review
---

# Hand-off: Positive routes to escalation; sub-threshold routes to longitudinal monitoring

The terminal step of this use case routes the case to one of two downstream destinations based on the threshold-check decision. This step is structurally a hand-off — the case leaves the administration use case and enters either the escalation use case or the passive monitoring queue.

## Positive path → escalation-phq9-positive

When the threshold check returns positive, the case routes **same-day** to the `escalation-phq9-positive` use case. No deferral to the next check-in is permitted per the catalog's attestation/escalation point.

The hand-off package consumed by escalation contains the canonical PHQ9 record from fragment 03, the patient identity package, the administration context (in-person vs. remote channel; baseline vs. repeat-screening), and prior PHQ9 screenings if available (for trajectory analysis at the escalation use case's severity-assessment step).

**Escalation content is not duplicated here.** The downstream use case owns the clinical-lead review, BHN handoff, and audit chain. The terminal edge of this fragment is the entry edge of the escalation use case.

## Monitoring path → longitudinal monitoring (passive)

When the threshold check is sub-threshold and Q9 is zero, the result is **stored** to the participant record (already done at fragment 03; the hand-off here is the explicit acknowledgment that the case does not escalate). The clinical team uses the record for longitudinal comparison at the next protocol review point.

This path is passive — there is no synchronous handoff; the canonical record simply remains available on the participant record for review at the next milestone.

## Channel-sensitive first-action (open question)

Catalog open question #4 explicitly flags that **escalation action specifics for a positive PHQ9 during a remote check-in are not addressed.** The in-person baseline path benefits from the CC and RD being co-located; the CC can immediately reach the RD or the PI in the room. The remote-check-in path needs an explicit reach-back protocol — channel selection, who is paged synchronously, and what the CC does in the first 5 minutes before a clinical-lead response arrives.

This is the local instance of the broader **first-action specifics structural gap (catalog #2)** — what the responsible role does in the first 5 minutes of a triggered case is the most operationally load-bearing gap across the SoP set. The escalation use case names the same gap at its clinical-lead gate.

## BHN structural gap (inherited)

The downstream escalation use case carries **BHN role unresolved — Cena-staffed vs UConn-side clinical-team function (catalog #1 structural gap).** That gap is inherited into this use case via the escalation handoff — until BHN role is resolved, the named receiving actor on the positive path is by-assumption rather than by-named-protocol.

## Who watches

The clinical lead is supervisor-of-record for the same-day SLA on the positive path; if the CC's positive-result handoff misses the same-day SLA, the clinical lead is paged.

## Authoring note (Cena-internal — strip before SoP render)

This fragment exercises:

- `type: hand-off` — Cena-novel spec primitive; two typed exit paths from a single hand-off step
- `x_cena_actor: agent` — the routing decision is automated based on fragment 04's outcome
- `x_cena_uncertainty: gap` — channel-sensitive first-action and inherited BHN structural gap; both are explicit catalog-flagged gaps
- The `escalation-route` edge type on the positive path names that this is a typed cross-use-case routing — not just any edge, but the inventive primitive Cena registered for "named hand-off to a sibling use case"
- The `out-of-scope-*` target convention matches the escalation use case's pattern for naming targets outside the current use case's scope
