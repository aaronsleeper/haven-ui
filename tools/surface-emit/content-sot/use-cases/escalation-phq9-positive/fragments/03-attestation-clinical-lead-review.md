---
fragment_id: 03-attestation-clinical-lead-review
type: attestation-gate
x_cena_actor: human
x_cena_actor_role: clinical-lead
x_cena_uncertainty: tbd
attestation:
  attestor_role: clinical-lead
  evidence_required:
    - patient context summary
    - PHQ9 result + answer pattern
    - prior screenings (if any)
    - current care plan + meds
  decision_payload_schema:
    decision: enum [escalate-to-bhn, escalate-to-emergency, downgrade-to-rd, defer-with-note]
    rationale: text
    signed_at: timestamp
    signed_by: clinical-lead-id
  sla: TBD — pending Marrero
  escalation_on_timeout: 04-handoff-to-bhn (defaulted with system-noted "clinical-lead-timeout" rationale)
gaps:
  - clinical-lead role identity — pending Cena hire (Dr. Soto / Dr. Morales TBD; confirm with Vanessa)
  - SLA values per severity tier (red minutes vs. yellow hours)
  - downgrade-to-RD criteria
  - defer-with-note allowed conditions
outgoing_edges:
  - to: 04-handoff-to-bhn
    type: attestation-approved
    condition: decision == escalate-to-bhn
    label: signed → handoff
  - to: out-of-scope-emergency-services
    type: attestation-approved
    condition: decision == escalate-to-emergency
    label: signed → 911 / crisis line
  - to: out-of-scope-rd-followup
    type: attestation-approved
    condition: decision == downgrade-to-rd
    label: signed → RD follow-up
  - to: 05-attestation-audit-record
    type: attestation-deferred
    condition: decision == defer-with-note
    label: signed → audit (case remains open)
---

# Attestation gate: Clinical lead review

The case enters the clinical-lead review queue. The clinical lead reviews the evidence package and makes a sign-off decision.

## Evidence package presented to clinical lead

- Patient context summary (demographics, enrollment date, care plan status)
- PHQ9 result and answer pattern (raw scores, severity tier, any Q9 flag)
- Prior PHQ9 screenings if any (trend over time)
- Current care plan and medications

## Sign-off decisions available

- **Escalate to BHN** — confirmed clinical concern; case routes to hand-off to BHN partner.
- **Escalate to emergency** — acute safety risk; case routes to 911 or local crisis line per partner protocol. (Out of scope for this use case — separate emergency-escalation use case)
- **Downgrade to RD follow-up** — clinical judgment that the agent's tier classification was conservative; case routes to RD next-business-day follow-up. (Out of scope for this use case)
- **Defer with note** — incomplete information; case stays open with a clinical note; re-routes after additional data.

## Open questions for Marrero

- **First-action specifics — THE single critical Friday blocker.** What the clinical lead does in the first 5 minutes of a red-tier case. The catalog flagged this as the most operationally load-bearing gap blocking full diagramming of this use case; explicit `[NEEDS VANESSA / MARRERO]` placeholder in the Care Coordinator SoP draft (line 51). Required for operational deployment.
- **Clinical-lead identity:** which role/person signs these? Pending Cena hire (per memory: Soto / Morales are TBD; Vanessa to confirm).
- **SLA per severity tier:** how fast must the clinical lead sign? Red likely measured in minutes, yellow in hours.
- **Downgrade criteria:** what conditions allow the clinical lead to override the agent's classification downward without re-running the assessment?
- **Defer conditions:** what counts as "incomplete information" warranting deferral vs. proceeding with caution?
- **Clinical-team vs. BHN distinction:** Cena's planning workflows distinguish between a general clinical-team escalation (RD/clinical-lead scope) and a BHN-specific handoff (Q9 > 0 / C-SSRS-elevated). Whether these are two paths or one is pending Marrero's call.

## Audit content captured at this gate

Every sign-off (escalate-to-bhn, escalate-to-emergency, downgrade-to-rd, defer-with-note) generates an immutable audit record with:

- Attestor identity (clinical-lead ID)
- Decision selected
- Rationale (free text, required)
- Timestamp
- Evidence package snapshot (PHQ9 result, prior context — exactly what the clinical lead saw)

## Authoring note (Cena-internal)

This fragment exercises:

- `type: attestation-gate` — Cena-novel spec primitive
- `attestation.attestor_role` + `evidence_required` + `decision_payload_schema` — the structured contract Temporal/FHIR lack
- `escalation_on_timeout` — typed fallback path if the SLA is missed
- `x_cena_uncertainty: tbd` — identity of the attestor is pending
