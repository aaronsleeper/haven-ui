---
roles: [Care Coordinator, Registered Dietitian]
type: Standard Operating Procedure
version: "0.1 (draft)"
status: draft
reviewed: 2026-05
accountable: Director of Clinical Operations
slug: enrollment-onboarding
caps: [2, 3, 5, 7, 8, 10, 12]
caps_source: pattern-library/pages/doc-enrollment-onboarding-sop.html header (Ex B.A.b 7-day intake)
caps_note: M3 2026-05-27 refinements absorbed 2026-05-31 (D2 pass) — consent-at-screening flow, in-person first visit, baseline-before-intervention invariant, PHQ9 + 3-item anxiety split between CC/RD. Cap reference pending for the M3-added invariants — flagged for Aaron's later reconciliation against the SOP Coverage Map cap inventory.
---

# Enrolling a UConn Participant

Program Operations · Standard Operating Procedure · Version 0.1 (draft) · Reviewed May 2026 · Roles: Care Coordinator + Registered Dietitian

::: callout-warning
**Draft — example content pending clinical and operational review.** Do not use for training or to enroll participants until approved.
:::

This procedure takes a participant from UConn referral to enrolled and onboarded — the handoff from care coordinator to registered dietitian. The contract sets the pace: **intake happens within 7 days of the referral.**

UConn captures verbal consent at screening, before the referral comes to you. **Written consent is executed at the in-person first visit with the dietitian** — that visit is required to be in person; all subsequent visits may be virtual. **All baseline assessments must complete before the care plan begins** — that's the invariant.

## Scope

A shared procedure across two roles. Each step names who owns it.

| | |
|---|---|
| **For** | Cena care coordinators and registered dietitians enrolling participants into the UConn Health pilot. |
| **Covers** | Receiving a referral, obtaining consent, creating the participant record, completing the intake assessment within 7 days, administering the baseline assessments, and kicking off the care plan. |
| **Does not cover** | Ongoing weekly check-ins (Care Coordinator SOP) or the recurring counseling sessions (Registered Dietitian SOP). UConn owns screening and referral generation upstream. |

## From referral to enrolled

Work the steps in order. The first five are the care coordinator's; the in-person first visit is shared; the care plan is the dietitian's.

1. **Care Coordinator — Receive and acknowledge the referral.** In [Care-coordinator app → Referrals]{.screen-ref} — referrals arrive from UConn's Epic via Athena. Result: the referral is acknowledged and intake is started — the 7-day clock begins at referral. _Note: if the electronic referral hasn't arrived, use the manual/paper referral fallback and enter it yourself._

2. **Care Coordinator — Verify screening consent on the record.** In Athena. UConn obtains verbal consent at the time of screening; that consent should be reflected on the participant record when the referral arrives. Result: consent-at-screening is confirmed on the record before scheduling. _Note: written consent is executed later, at the in-person first visit. If the screening-consent flag is missing, surface it to the dietitian before scheduling._

3. **Care Coordinator — Create or confirm the participant account.** In Athena; the account syncs to the Cena platform. Result: a participant record exists in both systems, ready for intake data.

4. **Care Coordinator — Schedule the in-person first visit (within 7 days).** In [Care-coordinator app → Schedule]{.screen-ref}. **The first visit must be in person** — that's where written consent is executed and the dietitian establishes rapport with the participant. Result: the participant has a confirmed in-person appointment with the dietitian inside the 7-day window. _Note: every visit after this one may be virtual; this one cannot._

5. **Care Coordinator — Complete the intake assessment.** In the intake form on the participant record, before or during the in-person first visit. Result: demographics, medical history, dietary assessment, and cultural food preferences are captured. _Note: some fields import from Athena or the referral; the rest come from talking with the participant._

6. **In-person first visit — written consent and baseline assessments.** At the in-person appointment, with the participant, the dietitian, and the care coordinator. Three things happen here:

   - **Registered Dietitian — Execute written consent.** On the UConn-provided consent form. Scan the signed form to PDF and file it on the participant record in Athena. _Note: written consent is required before any baseline assessment proceeds. Paper-only signatures must be scanned the same day._
   - **Care Coordinator — Administer the PHQ9 and the 3-item anxiety screen.** In the Cena assessment forms. Result: depression and anxiety screening results are recorded on the participant record. _Note: PHQ9 administration is the care coordinator's responsibility — not the dietitian's and not the UConn student researcher's — and requires CITI training, performed under PI oversight._ `[CONFIRM build state — PHQ9 admin UI in Care-coordinator app]` `[NEEDS HEALTHCARE DATA GOVERNANCE REVIEW — CITI vs CT scope-of-practice for PHQ9 administration]`
   - **Registered Dietitian — Administer the remaining baseline assessments.** In the Cena assessment forms. Result: HFIAS, HEI (via 24-hour dietary recall), WHOQOL-HIV BREF, and NKQ are completed and scored. _Note: these are the study's baseline — they repeat at later months, so accuracy now matters for the whole program._

7. **Registered Dietitian — Build the initial care plan.** In [Cena platform → Care plan]{.screen-ref}, after all baseline assessments above are complete. Result: an individualized nutrition care plan and goals, seeded from intake and the baseline assessments.

8. **Registered Dietitian — Build the personalized meal plan.** In [Cena platform → Meal plan]{.screen-ref}, alongside the care plan. Result: an individualized meal plan informed by dietary preferences, cultural food preferences, and the participant's dietary requirements. The participant is now enrolled. `[NEEDS VANESSA CONFIRMATION — meal plan separation from care plan, and Dr. Woo's role on dietary requirements]`

::: callout-warning
**Baseline-before-intervention invariant.** The care plan does not begin until every baseline assessment in Step 6 is captured on the record — HFIAS, HEI, WHOQOL-HIV BREF, NKQ, PHQ9, and the 3-item anxiety screen. If any are missing at the close of the in-person first visit, schedule a follow-up to complete them before starting the care plan.
:::

## How consent arrives

Consent has two layers. UConn captures verbal consent at screening; Cena captures written consent at the in-person first visit. Confirm both layers are on the record before the care plan begins.

::: decision-branch
**Screening consent (UConn-side)** — verbal consent obtained at the time of screening; flows to Cena with the referral and should be visible on the participant record in Athena. Verify before scheduling.

**Written consent (Cena-side)** — signed at the in-person first visit on the UConn-provided form. Scan the signed form to PDF and file it on the participant record the same day.

**Out-of-process referral** — external / non-CommonWell referrals handled case-by-case with two-way confirmation. The two consent layers still apply.
:::

## Quick reference

The 7-day enrollment, condensed to a tickable list.

::: card-title
For every new referral
:::

- [ ] Acknowledge the referral and start the 7-day clock
- [ ] Verify screening consent (UConn-side) on the participant record
- [ ] Create or confirm the participant account in Athena
- [ ] Schedule the in-person first visit within 7 days
- [ ] Complete the intake assessment before or during the visit
- [ ] At the visit — execute written consent; scan to PDF (RD)
- [ ] At the visit — administer PHQ9 + 3-item anxiety screen (CC)
- [ ] At the visit — administer HFIAS, HEI, WHOQOL-HIV BREF, NKQ (RD)
- [ ] Build the initial care plan only after all baseline assessments are captured (RD)
- [ ] Build the personalized meal plan alongside the care plan (RD)

## Terms used in this SOP

Plain-language definitions, no system jargon.

::: glossary-term
Referral
:::
::: glossary-def
UConn telling us a patient is eligible and should be enrolled. It arrives electronically, or on paper as a backup.
:::

::: glossary-term
Screening consent
:::
::: glossary-def
Verbal agreement to take part in the study, captured by UConn at the time of screening. Flows to Cena with the referral and is reflected on the participant record before scheduling.
:::

::: glossary-term
Written consent
:::
::: glossary-def
The participant's signature on UConn's IRB consent form. Executed at the in-person first visit with the dietitian; the signed form is scanned to PDF and filed on the participant record the same day.
:::

::: glossary-term
In-person first visit
:::
::: glossary-def
The participant's first appointment with the dietitian — required to be in person. Written consent is executed here, the dietitian establishes rapport, and the baseline assessments are completed. Every visit after this one may be virtual.
:::

::: glossary-term
Intake assessment
:::
::: glossary-def
The first deep data capture — who they are, their health history, what they eat, and their food preferences.
:::

::: glossary-term
Baseline assessments
:::
::: glossary-def
Six standard questionnaires given at the in-person first visit (and again at later months) to measure the program's effect over time. HFIAS, HEI, WHOQOL-HIV BREF, and NKQ are administered by the dietitian. The PHQ9 and the 3-item anxiety screen are administered by the care coordinator. All six must complete before the care plan begins.
:::

::: glossary-term
Care plan
:::
::: glossary-def
The participant's individualized nutrition care plan and goals, built from intake and the baseline assessments at the in-person first visit.
:::

::: glossary-term
Meal plan
:::
::: glossary-def
The participant's personalized meal plan, informed by dietary preferences, cultural food preferences, and dietary requirements. Built alongside the care plan at the in-person first visit.
:::

## Sign-off

This procedure clears more than one gate. It is approved for use only when all are signed.

::: attestation
**Sign-off**
:::

::: attestation-gate
⏳ **Clinically accurate** — clinical lead (assessments + care plan)
:::

::: attestation-gate
⏳ **Operationally true** — Vanessa Sena
:::

::: attestation-gate
⏳ **Signed off** — Director of Clinical Ops
:::

::: attestation-gate
_Awaiting all gates — draft, not yet approved for use · Version 0.1_
:::
