# OQ-25: Medicare MNT Visit Caps and Care Plan Cadence

**question_id:** OQ-25
**domain:** revenue_cycle

---

## Recommendation

Design two care plan cadence tracks: one for FFS Medicare patients (constrained by visit caps) and one for VBC/PMPM patients (unconstrained by Medicare caps because services are covered under the capitated rate).

For FFS Medicare patients, the annual MNT benefit is 3 hours in the initial year and 2 hours in subsequent years. At 15-minute increments (the standard unit for 97802/97803/97804), this translates to 12 units initial year and 8 units subsequent years. A typical care plan might use: 3 initial assessment visits (45 min each = 9 units) + 3 follow-up visits (15 min each = 3 units) = 12 units in year one. Year two: 4 follow-up visits (15 min each = 4 units) + 2 reassessment visits (30 min each = 4 units) = 8 units. The care plan cadence must be designed to fit within these limits.

For VBC/PMPM patients, the visit cap is irrelevant — all services are covered under the PMPM rate. The care plan cadence should be driven by clinical need, not billing constraints. However, the scheduling system must track which billing model each patient is under and enforce the correct cadence track. The eligibility verification workflow (Domain 5.1) already checks visit count remaining — this proposal adds the logic to route patients to the correct cadence track based on their billing model.

Build a cap consumption tracker into the scheduling system: for each FFS Medicare patient, track units consumed year-to-date, display remaining units when scheduling, and alert the care coordinator when a patient reaches 75% of their annual cap. When the cap is reached, the coordinator should know: (a) no more FFS-billable visits this year, (b) any additional visits must be justified under a different billing mechanism or absorbed as uncompensated care.

## Basis

- **Medicare Benefit Policy Manual, Chapter 15, Section 190:** MNT coverage is limited to 3 hours in the initial year (year of referral) and 2 hours in each subsequent year. Additional hours may be authorized if the treating physician determines a change in diagnosis, medical condition, or treatment regimen requires additional MNT and documents the order.
- **CPT codes 97802, 97803, 97804:** Each billed in 15-minute increments. 97802 is initial assessment (first 15 min), 97803 is initial assessment (each additional 15 min), 97804 is reassessment/follow-up (each 15 min). Rendering provider must be an RDN or nutrition professional.
- **42 CFR 410.132:** Specifies that MNT services must be furnished by a registered dietitian or nutrition professional pursuant to a referral by the treating physician.
- **Domain 5.1 (Eligibility Verification):** Already includes visit count checking. This proposal extends that logic to drive care plan cadence selection.
- **Domain 2.1 (Care Plan Creation):** Care plan cadence is set during plan creation. The RDN needs to know the patient's billing model and remaining visit capacity at plan creation time.

## Alternatives considered

| Alternative | Description | Why not | When it would be preferred |
|---|---|---|---|
| Single cadence for all patients | Design one care plan cadence optimized for clinical outcomes, bill what you can, absorb the rest | Uncompensated care for FFS patients who exceed the cap creates unpredictable revenue loss. With a dual-track system, the RDN knows upfront how many visits are billable and can design the plan accordingly. | If Cena's patient mix is overwhelmingly VBC/PMPM (>90%) and the FFS volume is negligible — then a single clinical-driven cadence with occasional unbillable visits is simpler. |
| Always request additional hours | For every FFS Medicare patient, request additional MNT hours beyond the cap via physician order | Adds administrative burden (physician must document medical necessity for each extension), delays care (waiting for authorization), and is not guaranteed to be approved. Should be the exception, not the default workflow. | For specific high-acuity patients where 3 hours/year is clinically insufficient — the system should support this as an escalation path, not a standard workflow. |
| Bill under alternative codes | Use G0270/G0271 (DSMT — Diabetes Self-Management Training) to extend visits beyond MNT caps | DSMT has its own separate benefit (10 hours initial, 2 hours subsequent) but requires a different curriculum, certified DSMT program accreditation, and a separate referral. Cannot be used interchangeably with MNT. However, for diabetic patients, a DSMT program running in parallel could effectively double available visit hours. | If Cena pursues AADE/ADCES accreditation for a DSMT program — this becomes a significant revenue expansion strategy for diabetic patients specifically. Worth exploring as a Phase 2 initiative. |

## Uncertainty flags

- **Patient mix by billing model:** The ratio of FFS Medicare to VBC/PMPM patients determines how much the cap actually constrains operations. If UConn patients are primarily VBC, the cap may affect very few patients initially.
- **Additional hours authorization rate:** Medicare allows additional MNT hours with physician documentation of medical necessity change. We don't know the approval rate or typical turnaround time for Cena's target payers.
- **Medicare Advantage plans:** MA plans may have different MNT limits than traditional Medicare. Each MA contract must be checked individually — some are more generous, some more restrictive.
- **DSMT accreditation feasibility:** If Cena pursues DSMT accreditation, the visit cap constraint loosens significantly for diabetic patients. This is a strategic decision beyond this proposal's scope.

## Assumption dependencies

- **A4** (Medicare MNT visit caps apply as published, no VBC waiver) — if a VBC contract with a Medicare Advantage plan waives or modifies the MNT cap, the dual-track system still works but the FFS track becomes less restrictive
- **A5** (PMPM model includes meals in the rate) — if meals are in the PMPM rate, VBC patients' entire care experience (visits + meals) is covered under capitation, making the unconstrained cadence track straightforward

## What we need from you

1. **Confirm or correct:** What is the expected FFS Medicare vs. VBC/PMPM patient mix for the UConn pilot? This determines how urgent the cap-tracking system is.
2. **Confirm:** Has the clinical team designed a target care plan cadence (number and frequency of visits per year)? If so, does it fit within the 3-hour initial / 2-hour subsequent limits?
3. **Flag if known:** Is DSMT accreditation on Cena's roadmap? If so, the visit cap constraint has a known workaround for diabetic patients.
