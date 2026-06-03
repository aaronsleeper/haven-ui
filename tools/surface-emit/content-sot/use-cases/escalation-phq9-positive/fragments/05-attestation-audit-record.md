---
fragment_id: 05-attestation-audit-record
type: attestation-gate
x_cena_actor: system
x_cena_actor_role: audit-system
x_cena_uncertainty: resolved
attestation:
  attestor_role: audit-system
  evidence_required:
    - all upstream fragment audit records (trigger, decision, clinical-lead attestation, hand-off + ack)
  decision_payload_schema:
    case_id: uuid
    sealed_at: timestamp
    chain_of_custody: immutable hash of upstream audit records
    final_state: enum [escalation-completed, escalation-timeout-recovered, escalation-redirected]
  sla: immediate (synchronous on hand-off resolution)
  escalation_on_timeout: not applicable (audit system is synchronous)
gaps: []
outgoing_edges:
  - to: out-of-scope-monthly-reporting
    type: aggregated
    label: rolls into monthly metric set
---

# Attestation gate: Audit record sealed

The audit system seals the case's chain of custody. This is the terminal attestation — every upstream action (trigger, agent classification, clinical-lead sign-off, hand-off, acknowledgment) is hashed into an immutable record.

## Audit record contents

- **Case identifier** — UUID for cross-referencing in monthly reporting + any future inquiries
- **Chain of custody** — immutable hash chain of every upstream audit event, including:
  - Trigger event (PHQ9 result + threshold check)
  - Agent classification (severity tier assigned)
  - Clinical-lead attestation (full evidence package + decision + rationale)
  - Hand-off transmission (package contents + transport channel)
  - Acknowledgment (or timeout event with recovery action)
- **Final state** — terminal outcome of this case:
  - `escalation-completed` — happy path: BHN acknowledged within SLA
  - `escalation-timeout-recovered` — BHN missed SLA; clinical-lead paged; case recovered via paging path
  - `escalation-redirected` — case rerouted at clinical-lead attestation (downgraded, deferred, or routed to emergency)

## Why this gate exists

The synthesis identified that NO surveyed tradition encodes "named human in named role signs off with timestamp + payload before next step" as a typed spec step. The audit gate is the structural mechanism that makes Cena's clinical work demonstrably defensible — the chain of custody is provable on demand, not reconstructed from logs.

This is one half of the agentic-discoverability bet: agents do the throughput; humans hold accountability; the audit trail is the structural proof.

## Downstream

Sealed audit records aggregate into monthly reporting (separate use case — `monthly-reporting`). Per yesterday's UConn workflow mapping, the exact metric set is pending Marinka + Andrey (Exhibit F data-elements list).

## Authoring note (Cena-internal)

This fragment exercises:

- `type: attestation-gate` — closing-gate variant (terminal audit, no further routing)
- `x_cena_actor: system` — automated attestor (the audit system itself), distinct from human attestor in gate 03
- `x_cena_uncertainty: resolved` — this gate's behavior is well-defined; no clinical TBDs
- `chain_of_custody` — explicit cross-fragment integrity contract (the kind of thing that needs an invariant tripwire at the spec layer)
