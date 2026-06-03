---
title: In-person IRB written consent execution at the Month 0 visit
role: Registered Dietitian
type: Standard Operating Procedure
version: "0.1 (draft)"
status: draft
reviewed: 2026-06
accountable: Director of Clinical Operations
slug: written-consent-execution
---

:::callout-warning
**DRAFT** — clinical content pending Marrero + Healthcare Data Governance review. Do not use operationally. This document is rendered from the use-case spec at `use-cases/written-consent-execution/`; corrections land in the source fragments, not in this rendered output.
:::

## Who this is for and what it covers

| For | Registered Dietitians executing IRB written consent at the Month 0 in-person visit, and Program Administrators digitizing signed forms into Athena. |
|---|---|
| Covers | Visit arrival through participant signature, cross-medium hand-off to administrator, digitization, and Athena PDF storage. |
| Does not cover | Decline-to-sign downstream procedure (no documented path); remote or digital consent (not permitted for Month 0); baseline assessment (separate procedure — gated by signed consent). |

## When the Month 0 visit fires the trigger

1. **The participant arrives at the UConn site for their Month 0 in-person visit.** The Registered Dietitian confirms participant identity, reviews the visit purpose, and prepares the IRB-approved paper consent form before any other visit activities begin.

   No remote or digital substitute is permitted for the Month 0 consent execution. The consent must be written, in person, on paper.

   :::callout-warning
   **Witness requirement pending Marrero.** Some IRB-compliant written-consent protocols require a separate witness signature beyond the executor. Whether the UConn IRB protocol for this study requires a witness, or treats the RD-as-executor as the witness, is unconfirmed. If a witness is required, the visit cannot proceed to signing until both RD and a designated witness are present.
   :::

2. **The participant reviews and signs the IRB consent form.** The RD walks the participant through the form's contents — study purpose, procedures, risks and benefits, voluntariness, confidentiality, contact-for-questions language — and answers any clarifying questions. The participant either signs or declines.

   :::decision-branch
   **Signs.** The participant signs and dates the form by hand. The RD signs as executor (and as witness if IRB protocol permits). The signed paper form proceeds to hand-off (next step).

   **Declines.** The participant declines to sign. The case routes out of scope for this procedure. There is no documented downstream pathway.
   :::

   :::callout-error
   **Decline-to-sign path undocumented — structural gap.** The parent SoP does not specify what happens if the participant declines at the visit. There is no documented re-consent pathway (can the participant change their mind later?), no documented reschedule procedure (can the Month 0 visit be re-attempted?), and no documented termination-of-enrollment procedure (what happens to participant data already collected?). Pending Marrero clarification.
   :::

   :::callout-warning
   **Patient-as-attestor — structural shape worth surfacing.** In every other use case in the current catalog, the attestor is a clinician or named operations role. This is the only one where the attestor is the participant — the participant's handwritten signature on the paper form is the attestation. Audit-chain treatment of a non-staff attestor's identity (participant ID rather than staff role + signature) needs explicit handling and will recur in future patient-facing consent use cases.
   :::

3. **The RD hands the signed paper form to the Program Administrator the same day.** This is the cross-medium transition that defines this procedure's structural shape: the consent attestation lives on paper, but the system-of-record needs a PDF on the participant's Athena chart. The administrator is the human bridge between media.

   The administrator acknowledges receipt before close of business on the visit day. If the administrator is unavailable the same day, the RD retains the paper in chain-of-custody-preserving storage and re-attempts the next business day, flagging a consent-delay note for clinical-lead awareness.

   :::callout-warning
   **Chain-of-custody for the paper between signing and administrator pickup is unspecified.** Whether the paper lives in the RD's locked drawer, in a sealed envelope, or in direct hand-to-hand transfer immediately after the visit is pending Marrero / administrator SoP. Each option carries different chain-of-custody risk.
   :::

4. **The Program Administrator digitizes the signed paper and uploads the PDF to the participant's Athena record.** The administrator scans or photographs the full form (both sides if double-sided), assembles a single PDF, locates the participant record in Athena by MRN or name + DOB match, and uploads the PDF under the IRB-consent document category. The paper original is filed or destroyed per UConn IRB retention policy.

   :::callout-error
   **PDF-landed verification missing — structural gap.** No explicit audit step confirms the digitized PDF reached the Athena participant record before downstream care-plan work proceeds. A failed upload (Athena unavailable, wrong patient match, miscategorized document) could allow baseline assessment to proceed against a participant whose consent is not actually on record. Pending Marrero.
   :::

## Hand-off package — what the RD hands the administrator

::: card

::: card-title
Hand-off package contents
:::

::: card-body
- Signed paper consent form (the physical artifact, signed and dated by participant; signed by RD as executor)
- Participant identifier — name + MRN handwritten on form during signing (so administrator can route the digitized PDF to the correct Athena participant record)
- Visit date — handwritten on form by participant; serves as the official consent-execution date for IRB audit
:::

:::

## Escalation — when this routes elsewhere

::: escalation
**If the participant declines to sign** — this procedure ends and routes to an undocumented out-of-scope pathway. No re-consent, reschedule, or termination procedure exists in the current SoP. Pending Marrero.

**If the administrator is unavailable on the visit day** — the RD retains the signed paper in chain-of-custody-preserving storage and re-attempts hand-off the next business day. A consent-delay note is flagged for clinical-lead awareness.

**If Athena upload fails** — administrator recovery procedure is undocumented. Pending administrator SoP.

**If consent is not on the Athena record before baseline assessment is attempted** — the baseline assessment must not proceed. The PDF-landed verification gap means this check is currently a manual/trust step rather than a system-enforced gate.
:::

## Each visit — the checklist

::: card

::: card-title
Per-visit checklist
:::

::: card-body
- [ ] Participant identity confirmed at site arrival
- [ ] IRB-approved paper consent form (current revision) prepared
- [ ] RD walks the participant through the consent form contents
- [ ] Participant questions answered before signing
- [ ] Participant signs and dates the form by hand
- [ ] RD signs as executor (and witness if IRB-required)
- [ ] Signed paper hand-delivered to Program Administrator the same day
- [ ] Administrator acknowledges receipt before close of business
- [ ] Administrator digitizes paper into single PDF
- [ ] PDF uploaded to participant Athena record under IRB-consent document category
- [ ] Paper original filed or destroyed per UConn IRB retention policy
- [ ] Consent record verified present on participant Athena chart before baseline assessment proceeds (currently manual; PDF-landed verification gap)
:::

:::

## Terms used here

:::glossary-term
IRB
:::

:::glossary-def
Institutional Review Board — the human-subjects research oversight body that approves study protocols (including consent forms) and audits study conduct. UConn IRB governs this study; consent form revisions must match the current IRB-approved version.
:::

:::glossary-term
Attestation gate
:::

:::glossary-def
A point in a procedure where a named human in a named role must record an explicit sign-off — with rationale and timestamp — before the case can proceed. Every sign-off generates an immutable audit-trail entry. In this procedure, the attestor is the participant; the attestation is the participant's handwritten signature on the paper consent form.
:::

:::glossary-term
Chain of custody
:::

:::glossary-def
The sequenced, hashed record of every action taken on a case — from the trigger event through every attestation gate, hand-off, and acknowledgment. Allows the case history to be reconstructed deterministically for audit or regulatory review. In this procedure, chain of custody spans paper (signature) → administrator hand-off → digitized PDF → Athena record.
:::

:::glossary-term
Athena
:::

:::glossary-def
The electronic health record (EHR) system Cena uses to store participant records. PDFs uploaded to a participant's Athena chart serve as the system-of-record for documents like signed IRB consent forms.
:::

:::glossary-term
MRN
:::

:::glossary-def
Medical Record Number — the unique identifier for a participant in the EHR (Athena). Used to route digitized documents to the correct participant record.
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
