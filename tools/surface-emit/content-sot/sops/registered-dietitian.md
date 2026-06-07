---
role: Registered Dietitian
type: Standard Operating Procedure
version: "0.1 (draft)"
status: draft
reviewed: 2026-05
accountable: Director of Clinical Operations
slug: registered-dietitian
caps: [14, 15]
caps_source: pattern-library/pages/doc-rd-sop.html header
caps_note: Coverage Map row lists 14/15/06/16; HTML lists 14/15 only; using HTML as canonical artifact source. Drift flagged for Aaron's later reconciliation. M3 2026-05-27 refinements absorbed 2026-05-31 (D2 pass) — in-person first visit framing (consent execution + RDN rapport), baseline assessments at first visit (HFIAS, HEI, WHOQOL-HIV BREF, NKQ; PHQ9 NOT in RD scope), meal plan vs care plan separation, sessions 2-5 modality inverted to virtual-default per M3. Version history — sessions 2-5 virtual-default was reconciled with UConn on 2026-05-27; supersedes Cena's earlier all-in-person commitment (moved here from body 2026-05-31 D3 pass — version history belongs in frontmatter not procedural body).
---

# Delivering UConn Nutrition Counseling Sessions

Registered Dietitian · Standard Operating Procedure · Version 0.1 (draft) · Reviewed May 2026

::: alert-warning
**Draft — example content pending clinical review and sign-off.** Do not use for training or to guide care until approved.
:::

This procedure covers how you, as a registered dietitian, deliver the UConn pilot's nutrition counseling sessions — running each session, capturing encounter notes in Athena, and reviewing the participant's care plan and outcomes in the Cena platform. It also covers what you own at the in-person first visit: written consent execution, the nutrition baseline assessments, and building the initial care plan and meal plan.

## Who this is for and what it covers

What this role covers, and where its boundaries are.

| | |
|---|---|
| **For** | Registered dietitians delivering counseling sessions for the UConn Health food-as-medicine pilot. |
| **Covers** | Executing written consent at the in-person first visit; administering the nutrition baseline assessments (HFIAS, HEI, WHOQOL-HIV BREF, NKQ); building the initial care plan and personalized meal plan; delivering the five counseling sessions (Months 0, 2, 4, 6, 9); capturing encounter notes in Athena; reviewing each participant's care plan and outcomes in Cena. |
| **Does not cover** | Weekly care-coordination check-ins, contact logging, or appointment booking (the care coordinator's role); PHQ9 administration and the 3-item anxiety screen (also the care coordinator's role per IRB protocol). Scheduling is handled in Athena by the care coordinator. |

## The in-person first visit (Month 0)

The first visit is in person — required for written consent execution and to establish rapport with the participant. The full visit flow across roles is in the Enrollment & Onboarding SOP; below is what's yours.

1. **Execute written consent.** On the UConn-provided IRB consent form, in person with the participant. Hand the signed form to the program administrator the same day for digitization and filing on the record. _Note: written consent is required before any baseline assessment proceeds._

2. **Administer the nutrition baseline assessments.** In the Cena assessment forms on the participant record. Result: HFIAS, HEI (via 24-hour dietary recall), WHOQOL-HIV BREF, and NKQ are completed and scored. _Note: do not administer the PHQ9 or the 3-item anxiety screen — those belong to the care coordinator per IRB protocol._

3. **Confirm the full baseline set is captured before building the care plan.** Care coordinator's PHQ9 + 3-item anxiety must also be on the record. _Note: this is the baseline-before-intervention invariant — if any baseline is missing at the close of the visit, schedule a follow-up to complete it before the care plan begins._

4. **Build the initial care plan.** In [Cena platform → Care plan]{.screen-ref}, seeded from intake and the baseline assessments. Result: an individualized nutrition care plan and goals.

5. **Build the personalized meal plan.** In [Cena platform → Meal plan]{.screen-ref}, alongside the care plan. Informed by dietary preferences, cultural food preferences, and the participant's dietary requirements. `[NEEDS VANESSA CONFIRMATION — meal plan separation from care plan, and Dr. Wu's role on dietary requirements]`

## Each counseling session (Months 2, 4, 6, 9)

The same flow for the follow-up sessions. Notes live in Athena; the care plan lives in Cena.

1. **Deliver the counseling session.** Per the participant's chosen modality (see "Session modality" below). Result: a completed counseling encounter for the participant.

2. **Capture your encounter notes in Athena.** On the participant's encounter — use the quick-snippet pick-lists for fluid note-taking. Result: notes saved to the billable encounter in Athena. _Note: Athena is the system of record for billable encounters — do not re-enter notes into Cena. Cena pulls them from Athena and files them on the patient record for you._

3. **Review the care plan and outcomes in Cena.** In [Cena platform → Participant detail]{.screen-ref}. Result: the care plan reflects the latest session and the participant's current outcomes. _Note: patient-experience data — food preferences and care-plan changes — lives in Cena, not Athena._

## Two routing decisions — modality and where data lives

Two decisions that come up every session — session modality, and which system holds which data.

### Session modality

::: decision-branch
**The first session (Month 0)** — Always in person; required for written consent execution and to establish rapport.

**Sessions 2–5 (Months 2, 4, 6, 9)** — Virtual permitted by default.

**Tech-limited fallback** — If the participant cannot complete the session virtually — no internet, a phone without video, or any other access limit — they come in for a guided in-person session. Cena's phone- and transcription-supported workflow handles ongoing support.
:::

### Which system holds the data

::: decision-branch
**Billable encounter content** — Athena. The system of record for anything coded for reimbursement.

**Patient-experience data** — Cena. Food preferences, care-plan iteration, and custom outcomes.
:::

## Every counseling session — the checklist

The session flow, condensed to a tickable list.

- [ ] Confirm the session modality (session 1 in person; later sessions virtual-permitted by default; in-person fallback for tech-limited)
- [ ] At the in-person first visit — execute written consent; administer HFIAS, HEI, WHOQOL-HIV BREF, NKQ; confirm CC's PHQ9 + 3-item anxiety are captured; build the care plan and meal plan
- [ ] Deliver the counseling session
- [ ] Capture encounter notes in Athena (not Cena)
- [ ] Review the care plan and outcomes in Cena

## Terms used here

Plain-language definitions, no system jargon.

::: glossary-term
Encounter
:::
::: glossary-def
A single counseling session with a participant, recorded for billing.
:::

::: glossary-term
Athena
:::
::: glossary-def
The system where encounters are recorded and coded for reimbursement. It is the official record for billable visit content.
:::

::: glossary-term
Care plan
:::
::: glossary-def
The participant's individualized nutrition care plan and goals — built at the in-person first visit and updated across sessions.
:::

::: glossary-term
Meal plan
:::
::: glossary-def
The participant's personalized meal plan — informed by dietary preferences, cultural food preferences, and dietary requirements. Built alongside the care plan at the in-person first visit.
:::

::: glossary-term
Baseline assessments
:::
::: glossary-def
Six standard questionnaires given at the in-person first visit (and again at later months). The dietitian administers HFIAS, HEI, WHOQOL-HIV BREF, and NKQ. The care coordinator administers the PHQ9 and the 3-item anxiety screen. All six must complete before the care plan begins.
:::

::: glossary-term
Quick snippets
:::
::: glossary-def
Athena's pick-list shortcuts for common note text, so you can capture notes during the session.
:::

::: glossary-term
Patient-experience data
:::
::: glossary-def
What lives in Cena rather than Athena — food preferences, care-plan changes, and custom outcomes.
:::

## Approval status

An RD SOP clears more than one gate. It is approved for training only when all of them are signed.

::: attestation-block
**Sign-off**
:::

::: attestation-gate
⏳ **Clinically accurate** — clinical lead
:::

::: attestation-gate
⏳ **Operationally true** — Vanessa Sena
:::

::: attestation-gate
⏳ **Signed off** — Director of Clinical Ops
:::

::: attestation-gate
_Awaiting all gates — draft, not yet approved for training · Version 0.1_
:::
