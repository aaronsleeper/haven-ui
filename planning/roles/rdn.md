# Role: RDN (Registered Dietitian Nutritionist)

> Clinical lead for nutrition. Owns the nutrition section of every care plan, signs MNT
> visit documentation, and is the last clinical gate before a nutrition plan takes effect.
> The RDN's approval is a hard requirement — agents draft, RDNs decide.

---

## Primary app surface

**Provider app** — patient records, clinical notes, care plan nutrition sections, lab trends,
and the clinical queue.

---

## Responsibilities

- Review and approve the nutrition section of every new and updated care plan
- Conduct MNT visits (initial and follow-up) and sign visit documentation
- Review agent-drafted SOAP notes before signing
- Monitor biomarker trends (HbA1c, lipids, weight, nutritional labs) across caseload
- Flag recipe catalog issues that affect clinical appropriateness
- Consult on patients with no valid meal matches (Domain 3 exception)

---

## What the RDN sees

**Clinical queue:**
- Care plan nutrition sections awaiting review
- SOAP note drafts awaiting signature
- Lab results flagged as out of range for their caseload
- Care plan update requests triggered by nutrition-relevant lab changes
- Patients with no valid meal match (requires recipe addition or constraint modification)

**Patient record view (center panel):**
- Demographic summary (name, DOB, contact — no billing detail)
- Current care plan nutrition section
- Biomarker trends over time (HbA1c, weight, BP, lipid panel, nutritional labs)
- Dietary restrictions and preferences
- Meal delivery history and satisfaction ratings (relevant to adherence)
- Clinical note history (full access)

**Thread view (right panel):**
- Workflow thread for the patient's care plan (creation and updates)
- Agent actions related to nutrition (meal matching exceptions, lab flags)
- BHN and coordinator notes visible as summaries

---

## Approval gates owned by RDN

| Gate | Condition | SLA |
|---|---|---|
| Nutrition plan approval | Every new care plan | 24h (7 days from patient activation) |
| Nutrition plan update approval | Every care plan revision affecting nutrition | 24h |
| SOAP note signature | Every completed MNT visit | 48h post-visit |
| Recipe nutritional validation | New recipes added to catalog | 72h |
| Meal match exception | Patient with no valid recipe match | 8h |

---

## Billing prerequisites the RDN must ensure

- Every MNT visit requires a physician referral order on file before the claim is generated.
  The agent surfaces a warning if no referral order is linked to the visit. The RDN must
  not sign a note for an unbilled visit without confirming this is addressed.
- Medicare MNT: 3 initial sessions (97802) + 2 follow-up sessions (97803/G0271) per year.
  Agent tracks the visit count and warns when approaching the cap.
- RDN must be enrolled with the patient's payer at the time of service. Scheduling system
  blocks booking if RDN payer enrollment is not active.

---

## What the RDN cannot do

- Approve the behavioral health section of a care plan (BHN owns that)
- Override a PHQ-9 crisis flag (BHN and crisis protocol required)
- Access patient billing or insurance detail
- Approve a full care plan (coordinator completes final approval after RDN signs nutrition section)

---

## Clinical documentation note

RDNs document using **NCP (Nutrition Care Process)** terminology — not ICD-10. The platform
maintains both:
- NCP diagnosis terminology in the clinical note (what the RDN writes)
- ICD-10 codes linked to the visit record (what goes on the claim)

These are separate fields. The agent populates both from context; the RDN reviews the NCP
terminology and confirms the ICD-10 code mapping is correct before signing.
