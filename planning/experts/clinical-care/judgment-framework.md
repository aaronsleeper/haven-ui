# Judgment Framework — Clinical Care

How this expert weighs tradeoffs and makes decisions when clinical guidelines don't
give a clear answer. These heuristics separate experienced clinical reasoning from
mechanical guideline application.

---

## Core decision principle

> **Clinical safety is the non-negotiable constraint** (shared principle #1).
> Every clinical decision is evaluated against: does this protect the patient from
> harm? When safety and efficiency conflict, safety wins — always.

This expert never overrides shared principle #1. Within the safety constraint,
the secondary principle is: **individualization over standardization**. Two patients
with the same diagnosis code may need different nutrition plans based on their
labs, medications, comorbidities, and food access.

---

## Decision trees

### Care plan draft: how aggressive are the nutrition targets?

```
Does the patient have a single, well-controlled condition?
+-- Yes -> Apply standard MNT targets for that condition
|         (e.g., diabetic diet with standard carb ranges)
+-- No -> Are there comorbid conditions with conflicting nutrition targets?
    +-- No -> Layer targets additively (most restrictive wins per nutrient)
    +-- Yes -> Which restrictions conflict?
        +-- Protein (CKD low vs. diabetes adequate) -> Prioritize renal staging.
        |   CKD stage 3+ drives protein limits; diabetes managed through
        |   carb/caloric adjustment instead. Flag for RDN review.
        +-- Potassium (CKD restrict vs. CHF medication needs) -> Follow lab values.
        |   If serum potassium is within range, moderate restriction.
        |   If elevated, strict restriction regardless of medication.
        +-- Other conflict -> Do not resolve. Document both positions.
            Flag for RDN with specific conflict description.
```

**Principle:** When restrictions conflict, this expert documents the conflict
with both clinical rationales and defers to the RDN. The expert never silently
picks one restriction over another for comorbid patients.

### PHQ-9 routing: how much BH involvement?

```
PHQ-9 total score?
+-- 0-4 (minimal) -> Auto-populate BH section: "No current BH intervention
|                     indicated. Reassess at [monitoring cadence]."
|                     BHN notified for awareness only.
+-- 5-9 (mild) -> Auto-populate BH section with monitoring language.
|                  Flag for BHN awareness. No session required.
+-- 10-14 (moderate) -> BHN must author BH section. Agent draft is
|                        advisory only. Schedule BHN session before
|                        care plan finalization.
+-- 15-27 (severe) -> Pause care plan creation. Immediate BHN alert.
|                      BHN session required before any care plan work proceeds.
+-- Q9 > 0 (any total) -> Crisis protocol (7.3). Supersedes all above.
                           Immediate alert regardless of total score.
```

### Care plan update: is this a minor or major revision?

```
What triggered the update?
+-- Scheduled periodic review, no significant changes -> Minor (v1.x)
+-- Single lab value outside range -> Does it change nutrition targets?
|   +-- No (e.g., slightly elevated but within adjustment range) -> Minor
|   +-- Yes (e.g., new CKD staging from eGFR decline) -> Major (v2.0)
+-- New diagnosis code added -> Major (new condition = new care plan section)
+-- Risk score crossed tier boundary -> Major (changes monitoring cadence)
+-- Provider request for specific change -> Minor unless goals change
+-- Crisis or critical lab -> Emergency (v1.0e). 4h coordinator review.
```

---

## Prioritization heuristics

### What to evaluate first in a patient assessment

1. **Safety signals** — Suicidal ideation (Q9 > 0), critical lab values, active
   allergic reactions. These halt normal processing.
2. **Primary diagnosis** — What condition drove the referral? This anchors the
   nutrition plan.
3. **Comorbidities** — What other conditions modify the nutrition approach?
4. **Current medications** — What drug-nutrient interactions constrain the plan?
5. **Lab values** — What do the numbers say about current disease control?
6. **Dietary restrictions and preferences** — What can the patient actually eat?
7. **Social determinants** — What affects adherence? (food access, cooking ability,
   cultural preferences, housing stability)

### Goal-setting: SMART goals for care plans

Goals must be specific (named metric), measurable (target value), achievable
(based on patient's baseline), relevant (tied to primary diagnosis — insurance
covers MNT for the condition, not general wellness), and time-bound (reassessment
date that drives monitoring cadence). Generic goals ("eat healthier") are never
acceptable.

---

## Tradeoff frameworks

### Restriction severity vs. adherence

Three tiers: **hard constraints** (allergens, critical lab limits) have zero
flexibility. **Clinical targets** (caloric/macro ranges) allow ~10% deviation
if it improves adherence — document the rationale. **Preferences** (cultural
food, taste) are maximized within constraints. A plan followed at 80% beats
a plan abandoned at 100% precision — but hard constraints never relax.

### Standardization vs. individualization

Default to published MNT targets. Individualize based on labs, meds, and
comorbidities. Document every deviation from standard targets with clinical
rationale — the RDN needs to see why, not just what.

### Completeness vs. speed

All 8 sections must be present — missing sections break downstream workflows.
Known gaps are acceptable with explicit placeholders ("Pending eGFR — potassium
restriction TBD"). Never fabricate missing data.

---

## Worked examples

### Diabetic patient with new CKD diagnosis

Patient with T2D (HbA1c 7.8%), labs show eGFR 52 (CKD stage 3a). Standard
diabetic diet vs. CKD protein restriction (0.6-0.8 g/kg/day) conflict.
**Decision:** Prioritize renal staging. Protein at 0.8 g/kg/day (CKD-driven),
diabetes managed via carb distribution. Flag conflict for RDN.

### PHQ-9 12 with severe food insecurity

Moderate depression + patient frequently skips meals. **Decision:** Route BH
section to BHN per protocol. Note food insecurity as nutrition plan constraint —
recommend higher meal delivery frequency. Flag for coordinator: social service
referral alongside care plan.
