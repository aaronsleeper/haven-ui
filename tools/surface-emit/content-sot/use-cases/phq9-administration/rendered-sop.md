---
title: PHQ9 administration at baseline and repeat screenings
role: Care Coordinator
type: Standard Operating Procedure
version: "0.1 (draft)"
status: draft
reviewed: 2026-06
accountable: Director of Clinical Operations
slug: phq9-administration
---

:::alert-warning
**DRAFT** — clinical content pending Marrero + Healthcare Data Governance review. Do not use operationally. This document is rendered from the use-case spec at `use-cases/phq9-administration/`; corrections land in the source fragments, not in this rendered output.
:::

## Who this is for and what it covers

| For | CITI-trained Care Coordinators administering the PHQ9 depression screening at baseline visits and at IRB-protocol repeat-screening milestones. |
|---|---|
| Covers | Trigger detection from the screening schedule through CC administration, score capture on the Cena platform, threshold check, and routing to either same-day escalation or longitudinal monitoring. |
| Does not cover | Clinical-lead review and BHN handoff on positive results (separate procedure — `escalation-phq9-positive`); RD initial assessments (separate procedure); enrollment and consent (separate procedure — `written-consent-execution`). |

## When the screening milestone fires the trigger

1. **The Cena scheduling system tracks each enrolled patient's IRB-protocol screening schedule.** Two milestone types trigger a PHQ9 administration:

   - **Baseline** — the patient's first in-person visit; PHQ9 is administered alongside the dietitian's initial assessments.
   - **Repeat-screening** — per the IRB-protocol schedule, repeat-screening milestones fire at protocol-defined intervals.

   The trigger notifies the assigned Care Coordinator that a PHQ9 administration is due, with the visit context (baseline vs. repeat, in-person vs. remote channel).

2. **The Care Coordinator administers the PHQ9 to the patient on the Cena assessment-forms platform.** Administration is scoped to the CITI-trained CC by IRB protocol; the registered dietitian and UConn student researchers are not authorized to administer it.

   :::alert-warning
   **Scope of practice pending Healthcare Data Governance.** CT licensure for CC administration under CT scope-of-practice rules is pending HDG confirmation. Until licensure is confirmed, the CC may administer the PHQ9 under PI oversight, and any positive-response handling follows PI guidance rather than autonomous CC action. The UConn PI is supervisor-of-record for the CC's scope on this step.
   :::

   :::alert-warning
   **PHQ9 admin UI build state unconfirmed.** The build state of the PHQ9 admin UI in the Care-coordinator app is unconfirmed per the SoP draft — flagged as `[CONFIRM build state]`.
   :::

   :::decision-branch
   **In-person (baseline).** PHQ9 is administered alongside the dietitian's initial assessments at the first in-person visit. CC is on-site; patient completes the form on paper or tablet; CC captures the saved result on the Cena platform.

   **Remote (repeat-screening).** Channel selection (self-administered via Cena platform vs. CC-administered over video) and the CC-supervision contract for the remote channel are pending Marrero. The administration shape (questionnaire → score capture) holds; what differs is who is in the room and how the CC responds when a result lands as positive on a remote channel.
   :::

3. **The platform records the result on the participant record.** The Cena assessment-forms system writes the total score, per-item responses, and administration metadata to the participant's assessment-results subcollection. The record is immediately:

   - Available to the agent for the downstream threshold check
   - Available to the clinical team for longitudinal review (comparing scores across the patient's screening history)
   - Visible to the CC who administered it

   The platform-stored value is the canonical score-of-record; any downstream reasoning references the platform record, not the source artifact (paper or tablet).

4. **The agent checks the captured score against the protocol threshold.** Two outcomes:

   :::decision-branch
   **Positive — escalate same-day.** Total score ≥ threshold OR Q9 (suicidal ideation) any-positive. Same-day escalation, no deferral to next check-in.

   **Sub-threshold — monitoring.** Total score below threshold AND Q9 == 0. Record stays on the participant record; no escalation fires; the clinical team uses the result for longitudinal comparison at the next protocol review point.
   :::

   :::alert-warning
   **Threshold value pending Healthcare Data Governance.** The specific PHQ9 score that constitutes "positive" under CT scope-of-practice is pending HDG review. Standard clinical practice ranges from 10 to 15. Q9 any-positive (suicidal ideation) override semantics are pending Marrero. Whether the threshold differs between baseline and repeat-screening contexts is pending Marrero.
   :::

5. **The case routes to its downstream destination.** Positive routes same-day to the escalation use case (`escalation-phq9-positive`); sub-threshold remains on the participant record for the next clinical-team review point.

   :::alert-error
   **First-action specifics for a positive PHQ9 on a remote check-in are not addressed (catalog open question #4).** The in-person baseline path benefits from the CC and RD being co-located; the remote path needs an explicit reach-back protocol — channel selection, who is paged synchronously, and what the CC does in the first 5 minutes before a clinical-lead response arrives. This is the local instance of the broader first-action structural gap (catalog #2) that the escalation use case also names at its clinical-lead gate.
   :::

## Hand-off package — what ships to the escalation use case on a positive result

::: card

::: card-title
Hand-off package contents (positive path)
:::

::: card-body
- Canonical PHQ9 record (total score, per-item responses, administration metadata)
- Patient identity package (name, DOB, contact information, MRN if applicable)
- Administration context (in-person baseline vs. remote repeat-screening)
- Prior PHQ9 screenings if available (for trajectory analysis at the escalation use case's severity-assessment step)
:::

:::

The escalation use case owns clinical-lead review, BHN handoff, and audit. This SoP terminates at the hand-off; downstream content is not duplicated here.

## Escalation — when this routes elsewhere

::: escalation
**If the CC misses the same-day escalation SLA on a positive result** — the clinical lead is paged with a system-noted "CC handoff SLA miss" rationale. Same-day handoff is required per catalog attestation/escalation point; no deferral to the next check-in is permitted.

**If the patient cannot complete the PHQ9 during the scheduled visit** — the CC records the missed administration on the participant record; the scheduling system re-triggers at the next protocol milestone. (Detailed missed-administration handling pending Marrero.)
:::

## Each administration — the checklist

::: card

::: card-title
Per-administration checklist
:::

::: card-body
- [ ] Trigger received from scheduling system (baseline or repeat-screening)
- [ ] CC confirms CITI-training current; PI scope-of-practice oversight available if needed
- [ ] Channel verified (in-person vs. remote); remote-channel reach-back protocol confirmed if applicable
- [ ] PHQ9 administered to patient on Cena assessment-forms platform
- [ ] Result captured to participant record (total + per-item + administration metadata)
- [ ] Threshold check completed; classification recorded
- [ ] On positive — hand-off package transmitted same-day to escalation use case
- [ ] On sub-threshold — record left on participant record for next protocol review
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
CITI training
:::

:::glossary-def
Collaborative Institutional Training Initiative — the human-subjects research training that authorizes a Care Coordinator to administer protocol-specified assessments under the IRB-approved Cena/UConn pilot. PHQ9 administration is scoped to CITI-trained CCs by IRB protocol.
:::

:::glossary-term
IRB protocol
:::

:::glossary-def
The Institutional Review Board approved protocol governing the Cena/UConn pilot. The IRB protocol defines who may administer which assessments, the schedule for baseline and repeat-screening milestones, and the consent framework.
:::

:::glossary-term
Scope of practice
:::

:::glossary-def
The clinical activities a role is licensed and authorized to perform. CC administration of the PHQ9 under CT licensure rules is pending Healthcare Data Governance confirmation; until confirmed, the UConn PI provides scope-of-practice oversight.
:::

:::glossary-term
Q9 override
:::

:::glossary-def
Question 9 of the PHQ9 asks about suicidal ideation. Standard clinical practice treats any positive response on Q9 as an immediate escalation trigger regardless of total score; Cena's Q9 override semantics are pending Marrero.
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

::: attestation-block

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
