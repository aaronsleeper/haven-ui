---
title: Escalation when a PHQ9 screening flags a clinical concern
role: Care Coordinator
type: Standard Operating Procedure
version: "0.1 (draft)"
status: draft
reviewed: 2026-06
accountable: Director of Clinical Operations
slug: escalation-phq9-positive
---

:::callout-warning
**DRAFT** — clinical content pending Marrero + Healthcare Data Governance review. Do not use operationally. This document is rendered from the use-case spec at `use-cases/escalation-phq9-positive/`; corrections land in the source fragments, not in this rendered output.
:::

## Who this is for and what it covers

| For | Care coordinators handling participants whose PHQ9 screening returns a positive response. |
|---|---|
| Covers | Trigger detection through clinical-lead sign-off, partner hand-off, and audit. |
| Does not cover | Routine PHQ9 administration (separate procedure); emergency 911 routing (separate procedure); RD next-business-day follow-up for green-tier results. |

## When the screening fires the trigger

1. **The patient completes a PHQ9 screening.** The platform calculates the total score immediately and checks against the configured threshold.

   The specific score threshold for "positive" is pending Healthcare Data Governance review. Standard clinical practice ranges from 10 to 15 depending on guideline source. Question 9 (suicidal ideation) any-positive result triggers immediate escalation regardless of total — to confirm with Marrero.

   If C-SSRS (Columbia Suicide Severity Rating Scale) is administered as a secondary instrument, its results join the case context for downstream review. C-SSRS adoption into the UConn pilot is pending Marrero.

2. **The agent classifies the response into a severity tier.** Three tiers determine the path forward.

   :::decision-branch
   **Red — Critical.** Suicidal ideation present or score in severe range → routes to same-hour clinical-lead review.

   **Yellow — High.** Moderate-severe range or rapid score change → routes to same-day clinical-lead review.

   **Green — Moderate.** Mild-moderate range, stable trajectory → routes to RD next-business-day follow-up (separate procedure, not this SoP).
   :::

   :::callout-warning
   **Tier boundary specifics pending Marrero.** What scores constitute red / yellow / green; what answer-pattern combinations override a case to a higher tier.
   :::

3. **The clinical lead reviews the case.** Red and yellow cases route to the clinical-lead review queue with a structured evidence package: patient context summary, PHQ9 result and answer pattern, prior screenings if any, current care plan and medications.

   The clinical lead chooses one of four sign-off decisions: escalate to BHN partner; escalate to emergency services; downgrade to RD follow-up; or defer with note. Each decision generates an immutable audit-record entry with attestor identity, rationale, and timestamp.

   :::callout-error
   **First-action specifics pending Vanessa + Marrero — this is the critical blocker for the Friday session and operational deployment.** What the clinical lead does in the first 5 minutes of a red-tier case is undefined; the catalog flagged this as the most operationally load-bearing gap. The Care Coordinator SoP carries an explicit `[NEEDS VANESSA / MARRERO]` placeholder for this content.
   :::

4. **For escalate-to-BHN decisions, the agent packages the case and transmits to the partner clinical team.** The package includes patient identity, the PHQ9 result with answer pattern, any C-SSRS results, the clinical-lead attestation record, the current care plan summary, and patient contact preferences.

5. **The partner acknowledges receipt within their SLA.** Acknowledgment closes the case to audit; the chain-of-custody hash seals every upstream event.

## Hand-off package — what ships

::: card

::: card-title
Hand-off package contents
:::

::: card-body
- Patient identity (name, DOB, contact information, MRN if applicable)
- PHQ9 result + answer pattern; prior screenings if available
- C-SSRS results if administered (UConn protocol adoption pending Marrero)
- Clinical-lead attestation record (decision, rationale, timestamp, attestor identity)
- Current care plan summary (diet, recent vitals, medications)
- Patient contact preferences (channel, window)
:::

:::

:::callout-warning
**Hand-off receiver identity unresolved.** Whether the receiving team is a Cena-staffed BHN role or a UConn-side clinical-team function is pending UConn partner protocol. The hand-off transport (secure messaging API via Athena CommonWell, fax fallback) is also pending.
:::

## Escalation — when this routes elsewhere

::: escalation
**If the clinical lead cannot reach a decision within SLA** — the case auto-escalates to the partner clinical team via paging with a system-noted "clinical-lead-timeout" rationale. SLA values are pending Marrero (red likely in minutes, yellow likely in hours).

**If the partner clinical team does not acknowledge within their SLA** — the case re-routes back to the clinical lead via paging. Partner-side SLA is pending UConn protocol.

**If the clinical lead returns "escalate to emergency"** — this SoP ends and the emergency-escalation procedure begins (separate SoP, not yet authored).
:::

## Each case — the checklist

::: card

::: card-title
Per-case checklist
:::

::: card-body
- [ ] PHQ9 score calculated against current threshold
- [ ] Q9 (suicidal ideation) any-positive override evaluated
- [ ] Severity tier assigned by agent classification
- [ ] Evidence package assembled for clinical-lead review
- [ ] Clinical-lead decision recorded with rationale and timestamp
- [ ] On escalate-to-BHN — hand-off package transmitted via configured transport
- [ ] On escalate-to-BHN — acknowledgment received within SLA (or timeout escalation fired)
- [ ] Audit record sealed with chain-of-custody hash
:::

:::

## Terms used here

:::glossary-term
PHQ9
:::

:::glossary-def
Patient Health Questionnaire 9-item — a validated depression screening instrument scoring 0–27. Clinical thresholds for "positive" vary by guideline source; Cena's pilot threshold is pending Healthcare Data Governance review.
:::

:::glossary-term
C-SSRS
:::

:::glossary-def
Columbia Suicide Severity Rating Scale — a clinical instrument for assessing severity and risk of suicidal ideation. Referenced in Cena's planning workflows as the secondary instrument tied to BHN handoff; UConn pilot adoption pending Marrero.
:::

:::glossary-term
BHN
:::

:::glossary-def
Behavioral Health Network — the partner clinical team that receives escalated cases for behavioral health follow-up. Whether BHN is a Cena-staffed role or a UConn-side function is unresolved as of this draft.
:::

:::glossary-term
Attestation gate
:::

:::glossary-def
A point in a procedure where a named human in a named role must record an explicit sign-off — with rationale and timestamp — before the case can proceed. Every sign-off generates an immutable audit-trail entry.
:::

:::glossary-term
Chain of custody
:::

:::glossary-def
The sequenced, hashed record of every action taken on a case — from the trigger event through every attestation gate, hand-off, and acknowledgment. Allows the case history to be reconstructed deterministically for audit or regulatory review.
:::

## Not yet approved — gates remaining

::: attestation

This procedure is a DRAFT. Three approval gates remain before operational use.

::: attestation-gate
**Clinically accurate** — pending clinical lead (Cena hire TBD; coordinate with Vanessa)
:::

::: attestation-gate
**Operationally true** — pending Vanessa Sena
:::

::: attestation-gate
**Signed off** — pending Director of Clinical Operations
:::

_Awaiting all gates — draft, not yet approved for use • Version 0.1_

:::
