# Domain Knowledge — Clinical Care

What this expert must know to do the job. Organized by sub-domain, with source
and shelf life for each knowledge area.

---

## Medical nutrition therapy (MNT)

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| MNT process model | Nutrition Care Process: assessment → diagnosis → intervention → monitoring/evaluation. Care plans follow this cycle. | Academy of Nutrition and Dietetics (AND) | ~5 years (framework stable, details update) |
| Condition-specific nutrition targets | Caloric, macro, and micronutrient targets for common chronic conditions: diabetes (HbA1c-driven carb limits), CKD (protein/potassium/phosphorus restrictions), CHF (sodium/fluid limits), obesity (caloric deficit ranges) | AND Evidence Analysis Library, ADA Standards of Care | ~2 years (guideline updates) |
| Drug-nutrient interactions | Medications that alter nutrient requirements or food contraindications: warfarin/vitamin K, metformin/B12, ACE inhibitors/potassium, statins/grapefruit | Clinical pharmacology references | ~2 years |
| Allergen classification | FDA Top 9 allergens as hard exclusions. Distinction between allergy (anaphylaxis risk — absolute constraint) and intolerance (discomfort — preference-level). Cross-reactivity patterns (e.g., tree nut species). | FDA FALCPA, FASTER Act | Regulatory — updates with legislation |
| Dietary restriction layering | How to combine multiple restrictions for comorbid patients (e.g., diabetic + CKD requires balancing carb limits against protein restrictions). Restriction conflicts require RDN judgment — no automated resolution. | Clinical practice, AND position papers | Stable principle, specifics update ~3 years |
| `[ASSUMPTION]` Cena-specific MNT protocols | Diabetes: 1500-1800 kcal/day (BMI > 30), 1800-2200 (BMI <= 30); carb 45-60% with consistent carb distribution across meals. CKD: protein 0.6-0.8 g/kg/day (stage 3+), potassium < 2000mg/day (stage 3b+), phosphorus < 800mg/day. CHF: sodium < 2000mg/day, fluid per cardiology. Obesity: 500-750 kcal/day deficit from estimated needs. Targets may vary by study cohort or partner contract. | ADA Standards of Care 2026, KDOQI, AHA guidelines. Validates by: Clinical Operations Director or study protocol | ~2 years (guideline-driven until institutional override) |

## Behavioral health integration

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| PHQ-9 scoring and routing | 9-item depression screening. Scoring: 0-4 minimal, 5-9 mild, 10-14 moderate, 15-27 severe. Q9 > 0 (suicidal ideation) triggers immediate crisis protocol regardless of total score. | Kroenke et al., validated instrument | Stable instrument |
| GAD-7 scoring | 7-item anxiety screening. Scoring: 0-4 minimal, 5-9 mild, 10-14 moderate, 15-21 severe. Informs care plan BH section but does not trigger independent gates like PHQ-9. | Spitzer et al., validated instrument | Stable instrument |
| BH section authorship rules | PHQ-9 < 10: BH section auto-populated from assessment, BHN notified for awareness. PHQ-9 >= 10: BHN must author BH section directly — agent drafts are advisory only. | `workflows/01-patient-operations.md` 1.5 | Internal policy — review annually |
| BH escalation thresholds | PHQ-9 10-14: BHN session before care plan finalized. PHQ-9 15-27: immediate BHN alert, care plan creation paused. Q9 > 0: crisis protocol (7.3). | `workflows/01-patient-operations.md` 1.4 | Internal policy — review annually |

## Care plan lifecycle

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| Care plan structure | 8 sections: goals (3-5 SMART), nutrition plan, BH plan, visit schedule, monitoring schedule, meal delivery, medications, risk flags. | `workflows/01-patient-operations.md` 1.5 | Internal — stable |
| Version semantics | Minor (v1.0→v1.1): single section, no structural change. Major (v1.0→v2.0): goals changed, new condition. Emergency (v1.0e): critical lab or crisis trigger, coordinator review within 4h. | `workflows/01-patient-operations.md` 1.9 | Internal — stable |
| Update triggers | Lab result outside range, risk score tier change, provider request, scheduled periodic review (default quarterly), significant life event. | `workflows/01-patient-operations.md` 1.9 | Internal — stable |
| Approval chain | RDN approves nutrition section (hardcoded gate). BHN approves BH section if PHQ-9 >= 10 (hardcoded gate). Coordinator approves integrated plan (hardcoded gate). No meals or visits until all gates pass. | `workflows/care-plan-creation/steps.md` steps 4-6 | Internal — hardcoded |

## Clinical data and interoperability

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| FHIR resource mapping | Patient, Condition, Observation (labs/vitals), MedicationStatement, CarePlan, Goal — how Cena's data model maps to FHIR R4 resources for EHR integration and PCP communication. | HL7 FHIR R4 specification | ~3 years (standard evolves slowly) |
| Lab value interpretation | Which biomarkers drive care plan decisions: HbA1c (diabetes control), eGFR/creatinine (kidney function), lipid panel (cardiovascular), albumin (nutritional status), potassium/phosphorus (CKD). Normal ranges and clinical significance of deviations. | Clinical laboratory references | Stable ranges, guideline thresholds update ~3 years |
| ICD-10 coding for conditions | Primary diagnosis codes that map to MNT eligibility and care plan parameters. Used for referral validation and care plan grounding, not for billing (Revenue Cycle owns billing codes). | CMS ICD-10-CM | Annual updates (October) |
| `[ASSUMPTION]` EHR integration specifics | Assume FHIR R4 API available for lab results (Observation), medication lists (MedicationStatement), and condition codes (Condition). Structured data available at intake for patients whose providers use connected EHRs; manual entry fallback for others. Expect ~60-70% of patients to have structured lab data at intake. | Workflow 1.4 design + FHIR R4 as industry standard for health data exchange. Validates by: Engineering (Andrey) for actual integrations | ~1 year (changes with each EHR partner onboarded) |

## Risk stratification

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| Risk scoring model | How patient risk tiers are calculated from assessment data (clinical, behavioral, social determinants). Feeds monitoring cadence and escalation thresholds. | `workflows/01-patient-operations.md` 7.1 (referenced) | Internal — needs definition |
| Disengagement indicators | Consecutive missed check-ins (3+ = disengagement alert), missed appointments, meal delivery refusals. Pattern recognition across engagement signals. | `workflows/01-patient-operations.md` 1.7 | Internal — stable |
| `[ASSUMPTION]` Clinical risk thresholds | HbA1c > 9.0%: urgent nutrition plan revision. HbA1c > 7.5% (if target was < 7.0%): scheduled revision at next review. eGFR decline > 5 mL/min/year or eGFR < 30: re-stage CKD, revise protein/electrolyte targets. Potassium > 5.5 mEq/L: immediate restriction tightening. LDL > 190 or triglycerides > 500: flag for provider. Albumin < 3.0 g/dL: nutritional risk flag, increase monitoring. Thresholds may vary by study cohort. | ADA Standards of Care 2026, KDOQI, clinical practice norms. Validates by: Clinical Operations Director or study protocol | ~2 years (guideline-driven until institutional override) |

## Reference sources

| Source | Domain | Trust level | When to consult |
|---|---|---|---|
| Academy of Nutrition and Dietetics Evidence Analysis Library | MNT guidelines, nutrition care process | Authoritative | MNT protocol questions, condition-specific nutrition targets |
| ADA Standards of Care (annual) | Diabetes management guidelines | Authoritative | Any diabetes-related care plan decision |
| KDOQI Clinical Practice Guidelines | CKD nutrition management | Authoritative | Renal diet restrictions, CKD staging implications |
| PHQ-9 / GAD-7 instrument documentation | Behavioral health screening | Authoritative | Scoring questions, threshold validation |
| HL7 FHIR R4 specification | Healthcare data interoperability | Authoritative | Data model mapping, resource structure questions |
| FDA allergen guidance (FALCPA/FASTER Act) | Food allergen classification | Authoritative | Allergen exclusion list updates, classification questions |
| Cena Health internal protocols (Vanessa/RDN team) | Institution-specific clinical standards | Authoritative | Any gap between published guidelines and Cena's actual practice |
| CMS ICD-10-CM code sets | Diagnosis coding | Authoritative | Referral validation, condition mapping |

---

## Assumptions index

| # | Assumption | Basis | Validates by | Status |
|---|---|---|---|---|
| A1 | Cena MNT targets follow published ADA/KDOQI/AHA guidelines per condition | ADA 2026, KDOQI, AHA | Clinical Ops Director or study protocol | Unvalidated |
| A2 | EHR integration provides FHIR R4 structured data; ~60-70% of patients have structured labs at intake | Workflow 1.4 design, FHIR as industry standard | Engineering (Andrey) | Unvalidated |
| A3 | Clinical risk thresholds follow published guideline values (HbA1c > 9% urgent, eGFR decline > 5/yr, K+ > 5.5, albumin < 3.0) | ADA 2026, KDOQI, clinical norms | Clinical Ops Director or study protocol | Unvalidated |
