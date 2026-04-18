# OQ-07: HEDIS Data Model Timing

**question_id:** OQ-07
**domain:** revenue_cycle

---

## Recommendation

Design HEDIS-ready fields into the data model now, before the first patient encounter. This is not a reporting build — it is adding 5-6 fields to existing clinical and encounter entities so the data is captured at the point of care.

The fields needed are: rendering provider NPI (already in the Claim object), ordering provider NPI, lab result values with LOINC codes, denominator eligibility flags (e.g., "patient has diabetes diagnosis" for CDC measure inclusion), numerator compliance evidence (e.g., "HbA1c test performed in measurement year"), and date of service with encounter type. Most of these overlap with fields already needed for billing (Domain 5) and clinical documentation (Domain 2) — the incremental cost is adding the LOINC codes to lab results and the eligibility/compliance flags to the patient record.

Start with three measures most relevant to food-as-medicine outcomes: CDC (Comprehensive Diabetes Care — HbA1c testing and control), CBP (Controlling Blood Pressure), and Adult BMI Assessment. These are already identified in the Domain 6 regulatory reporting workflow (6.6). The data model changes enable reporting; they do not require building the reporting pipeline itself until a VBC contract demands it.

## Basis

- **NCQA HEDIS Volume 2 (Technical Specifications):** Each measure specifies required data elements. Retroactive capture of provider NPIs, LOINC-coded lab values, and eligibility flags is either impossible (the data was never recorded) or requires expensive chart review.
- **CMS Quality Payment Program (QPP):** Value-based contracts increasingly tie shared savings to quality measure performance. Cena's shared savings contracts (Domain 4.6) will require HEDIS or HEDIS-equivalent reporting.
- **Domain 5 workflow (5.2, 5.7):** Claims generation already captures most fields. The gap is on the clinical side — lab results stored without LOINC codes, and no eligibility flag on the patient record.
- **Domain 10 (10.3):** VBC Reporting workflow assumes HEDIS data availability. If the data model lacks these fields, 10.3 cannot function.

## Alternatives considered

| Alternative | Description | Why not | When it would be preferred |
|---|---|---|---|
| Wait for first VBC contract | Build HEDIS fields only when a contract requires them | First 12 months of clinical data would be unusable for HEDIS reporting — can't retroactively capture LOINC codes or eligibility flags that were never recorded. Backfill cost is high and accuracy is low. | If Cena were certain its first 2-3 contracts would be pure PMPM with no quality gates — but OQ-41 analysis suggests shared savings (which requires quality reporting) is likely in early contracts. |
| Full HEDIS reporting build now | Build the complete reporting pipeline (measure calculation, submission formatting, dashboards) in addition to the data model | Premature — no contract requires submission yet, and the reporting logic is measure-specific and payer-specific. Building it now means building to assumptions. | If a signed VBC contract with quality gates were in hand today. |
| Rely on Athena's built-in HEDIS | Use Athena Health's native quality measure tracking | Athena captures billing data well but may not capture all HEDIS-required clinical data elements (especially food-as-medicine-specific outcomes like dietary adherence). Needs verification. | If Athena's HEDIS module covers all three target measures and Cena's clinical data flows entirely through Athena — but behavioral health (BHN) and meal operations data live outside Athena. |

## Uncertainty flags

- **Athena's HEDIS capabilities:** Athena may already capture some of these fields natively. If so, the incremental work is smaller than estimated. Need Andrey to assess.
- **Payer-specific measure variations:** Some payers use HEDIS; others use proprietary quality measures. The three target measures (CDC, CBP, BMI) are near-universal, but additional measures may be needed per contract.
- **Lab data flow:** If lab results arrive via HL7/FHIR from partner EHRs, LOINC codes may already be present. If labs are manually entered, LOINC mapping must be built into the data entry workflow.

## Assumption dependencies

- **A3** (PMPM rates are contract-specific) — each contract will define its own quality measure requirements, but the three target measures are common across nearly all VBC contracts
- **A6** (shared savings is upside-only for first 2-3 contracts) — upside-only shared savings still requires quality gate reporting to unlock the savings share

## What we need from you

1. **Confirm or correct:** Is HEDIS reporting expected in the first 1-2 VBC contracts, or are early contracts pure PMPM without quality gates?
2. **Flag if known:** Does Athena already track HEDIS-eligible data fields for MNT encounters? (If yes, the scope of this work shrinks significantly.)
3. **Confirm priority:** Are CDC, CBP, and BMI Assessment the right starting measures, or are there others Cena's partners have specifically requested?
