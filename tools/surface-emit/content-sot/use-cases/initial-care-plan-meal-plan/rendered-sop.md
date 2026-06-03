---
title: Initial care plan and meal plan creation at the Month 0 visit
role: Registered Dietitian
type: Standard Operating Procedure
version: "0.1 (draft)"
status: draft
reviewed: 2026-06
accountable: Director of Clinical Operations
slug: initial-care-plan-meal-plan
---

:::callout-warning
**DRAFT** — clinical content pending Marrero + Healthcare Data Governance review. Do not use operationally. This document is rendered from the use-case spec at `use-cases/initial-care-plan-meal-plan/`; corrections land in the source fragments, not in this rendered output.
:::

:::callout-warning
**SoP body reconciliation pending Vanessa.** Per Vanessa's 2026-06-02 decision, care plan and meal plan are **one combined artifact**, not two distinct artifacts as described in the RD SoP body v0.1 (Steps 4 and 5). This rendered SoP carries the combined-artifact framing; the upstream RD SoP body needs a separate reconciliation pass.
:::

## Who this is for and what it covers

| For | Registered Dietitians building the participant's initial nutrition care plan and meal plan at the Month 0 in-person visit. |
|---|---|
| Covers | Trigger detection through combined-artifact authoring, RDN sign-off, and hand-off to the downstream meal-prescription workflow. |
| Does not cover | Routine recurring assessment (separate procedure); meal-prescription generation specifics (separate downstream workflow); RD escalation procedures for participants whose baseline assessment battery surfaces clinical concerns (separate escalation procedure). |

## When the baseline battery clears the trigger

1. **The platform confirms all six baseline instruments are complete on the participant's record.** Four RD-administered instruments (HFIAS, HEI / 24-hour recall, WHOQOL-HIV BREF, NKQ) plus two CC-administered instruments (PHQ9, 3-item anxiety) — all six must be present.

   When the baselines are complete AND the Month 0 in-person visit is in progress, the platform raises a ready-to-author signal that surfaces the combined-artifact authoring surface to the Registered Dietitian.

   :::callout-warning
   **First-action specifics on visit start pending Vanessa + Marrero.** What the RD does in the first 5 minutes of the Month 0 visit before opening the authoring surface — greeting, consent re-confirmation, data sanity-check — is not specified in the current SoP. Analogous to the catalog #2 first-action gap in the Care Coordinator SoP.
   :::

2. **The RD opens the authoring surface in Cena and builds the combined care-plan-and-meal-plan artifact.** The surface is seeded with the baseline assessment results and intake data; the RD layers participant-stated dietary preferences, cultural food preferences, and Dr. Wu–sourced dietary requirements over that base.

   :::callout-warning
   **Dr. Wu role on dietary requirements pending Vanessa.** Whether Dr. Wu **reviews** the dietary requirements before they seed the meal plan, or **approves** them, is open. A review pattern surfaces requirements as input; an approval pattern is a second attestation gate upstream of the RDN approval gate. The RD SoP body v0.1 line 46 carries an explicit `NEEDS VANESSA CONFIRMATION` placeholder on this question.
   :::

3. **The RDN approves the completed combined artifact.** The RDN reviews the draft against the evidence package and records a structured sign-off: approve, revise, or defer. Each decision generates an immutable audit-record entry with attestor identity, rationale, and timestamp.

   :::callout-error
   **The RDN approval gate is enforced by the platform but is NOT surfaced in the RD SoP body — this is the critical structural gap for this use case.** The workflow-spec at `planning/workflows/care-plan-creation/steps.md` hardcodes the approval action; the RD SoP body does not describe it as a named step. An RD reading the current SoP would not know there is an explicit approval action they must take before the combined artifact activates and meal prescription generates downstream. The SoP needs a reconciliation pass to surface the approval step.
   :::

4. **On approval, the combined artifact activates and hands off to the downstream meal-prescription workflow.** The Cena platform raises a synchronous hand-off event; the meal-prescription workflow accepts the activated artifact and generates the participant's meal prescription automatically. This downstream workflow is out of RD SoP scope.

5. **On rejection by the downstream workflow, the RDN is paged.** If the meal-prescription workflow rejects the activated artifact (missing required fields detected late, schema mismatch), the rejection pages the RDN; the combined artifact remains activated but meal-prescription generation is blocked until the RDN resolves the issue via re-authoring and re-approval.

## Combined artifact — what governs the participant

::: card

::: card-title
Combined care-plan-and-meal-plan artifact (resolved 2026-06-02 per Vanessa)
:::

::: card-body
- One combined artifact (supersedes the two-distinct-artifacts framing in SoP body v0.1)
- Built in Cena (system of record for patient-experience data), not Athena
- Versioned (every approved revision creates a new version with chain-of-custody)
- Governs participant nutrition goals, counseling structure, and meal prescription for the duration of the pilot
:::

:::

## Evidence package — what the RDN sees at approval

::: card

::: card-title
Evidence package presented to the RDN at the approval gate
:::

::: card-body
- Completed combined-care-plan-and-meal-plan draft (the artifact under review)
- Baseline assessment battery results — snapshot used for authoring
- Intake data snapshot
- Dietary requirements record with Dr. Wu attribution (if applicable — pending Vanessa)
- Participant-stated dietary and cultural preferences
:::

:::

## Escalation — when this routes elsewhere

::: escalation
**If the RDN selects revise** — the combined artifact routes back to authoring with the RDN's rationale attached. The RD addresses the revision points and re-submits for approval.

**If the RDN selects defer with note** — the case stays open with a clinical note pending additional information; the combined artifact does not activate. Out of scope for this procedure (separate deferred-care-plan path).

**If the downstream meal-prescription workflow rejects the activated artifact** — the rejection pages the RDN; the combined artifact remains activated but meal-prescription generation is blocked. The RDN resolves the issue via the revise → re-author → re-approve loop.

**If the baseline assessment battery surfaces a clinical concern during this procedure (e.g., positive PHQ9)** — the escalation procedure begins (separate SoP: `escalation-phq9-positive`). This procedure pauses until the escalation resolves and the participant is cleared to continue with care-plan authoring.
:::

## Each visit — the checklist

::: card

::: card-title
Per-visit checklist
:::

::: card-body
- [ ] All 6 baseline instruments confirmed complete on participant record
- [ ] First-action specifics on visit start completed (pending SoP authoring — Vanessa/Marrero)
- [ ] Dietary requirements sourced from Dr. Wu (review vs approve role pending Vanessa)
- [ ] Combined care-plan-and-meal-plan artifact authored in Cena
- [ ] RDN approval gate executed — decision recorded with rationale and timestamp (gate not yet documented in SoP body — pending reconciliation)
- [ ] On approval — hand-off to downstream meal-prescription workflow acknowledged
- [ ] On revise — re-author and re-submit for approval
- [ ] Audit record sealed with chain-of-custody hash
:::

:::

## Terms used here

:::glossary-term
HFIAS
:::

:::glossary-def
Household Food Insecurity Access Scale — a validated instrument measuring household-level food access insecurity over the prior four weeks. One of the four RD-administered baseline instruments in the UConn pilot.
:::

:::glossary-term
HEI / 24-hour recall
:::

:::glossary-def
Healthy Eating Index, calculated from a 24-hour dietary recall — measures alignment of the participant's recent eating with U.S. dietary guidelines. RD-administered baseline instrument.
:::

:::glossary-term
WHOQOL-HIV BREF
:::

:::glossary-def
World Health Organization Quality of Life — HIV brief version. Quality-of-life instrument adapted for participants with HIV-related health considerations. RD-administered baseline instrument in the UConn pilot.
:::

:::glossary-term
NKQ
:::

:::glossary-def
Nutrition Knowledge Questionnaire — measures the participant's baseline understanding of nutrition concepts relevant to their care. RD-administered baseline instrument.
:::

:::glossary-term
PHQ9
:::

:::glossary-def
Patient Health Questionnaire 9-item — a validated depression screening instrument scoring 0–27. Clinical thresholds for "positive" vary by guideline source; Cena's pilot threshold is pending Healthcare Data Governance review.
:::

:::glossary-term
Combined care-plan-and-meal-plan artifact
:::

:::glossary-def
Per Vanessa's 2026-06-02 decision, the participant's nutrition care plan and meal plan are one combined artifact built in Cena, not two distinct artifacts. The combined artifact governs nutrition goals, counseling structure, and meal prescription for the duration of the pilot. Supersedes the two-artifacts framing in the RD SoP body v0.1.
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

This procedure is a DRAFT. Three approval gates remain before operational use, plus an explicit SoP reconciliation pass to surface the RDN approval gate as a named step in the body.

::: attestation-gate
**Clinically accurate** — pending Dr. Marrero (clinical accountability)
:::

::: attestation-gate
**Operationally true** — pending Vanessa Sena (including combined-artifact reconciliation and Dr. Wu role confirmation)
:::

::: attestation-gate
**Signed off** — pending Director of Clinical Operations
:::

_Awaiting all gates — draft, not yet approved for use • Version 0.1_

:::
