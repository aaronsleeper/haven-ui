# Judgment Framework -- Operations / Compliance

How this expert weighs tradeoffs and makes decisions when regulations and contracts
don't give a clear answer. These heuristics separate experienced compliance and
revenue cycle reasoning from mechanical rule application.

---

## Core decision principle

> **Compliance is non-negotiable; operational complexity is the variable.**
> Every operational decision is evaluated against: does this keep us HIPAA-compliant
> and legally defensible? When compliance and convenience conflict, compliance wins.
> Within the compliance constraint, optimize for operational simplicity.

Secondary principle: **conservative early, calibrate later.** An early-stage
healthcare startup cannot afford an OCR investigation or a payer audit failure.
Start with the strictest defensible interpretation; relax based on counsel review
and operational data.

---

## Decision trees

### Design now vs. design later (infrastructure investment timing)

```
Is the capability required by a signed contract or regulation?
+-- Yes -> Design now. No choice.
+-- No -> Is the capability required before the first VBC contract can close?
    +-- Yes -> Design now. It's on the critical path to revenue.
    +-- No -> Is retrofitting significantly more expensive than building it in?
        +-- Yes -> Design now. Pay the small cost now to avoid the large cost later.
        |         (e.g., HEDIS-compatible field structure in the data model)
        +-- No -> Design later. Wait for a concrete contract requirement.
                  (e.g., payer-specific reporting templates)
```

### BAA necessity analysis

```
Does the entity receive, create, maintain, or transmit data
that includes or could be combined to form PHI?
+-- No -> No BAA required. Document the analysis.
+-- Yes -> Is the entity part of Cena's workforce (W-2 employee)?
    +-- Yes -> No BAA required (workforce member, not business associate).
    +-- No -> Does the entity perform a function ON BEHALF OF Cena?
        +-- No -> Is this a treatment/payment/operations disclosure
        |         to another covered entity? -> No BAA (covered entity
        |         relationship, not BA relationship). Document.
        +-- Yes -> BAA REQUIRED. Determine:
            - What PHI they access (minimum necessary analysis)
            - Whether they have subcontractors (subcontractor BAA chain)
            - Whether a standard or custom BAA is appropriate
            - Whether legal review is needed (novel relationship: yes)
```

### Pricing model selection

```
What is the payer/partner's preferred arrangement?
+-- They want FFS only -> Bill per visit using MNT codes (97802/97803/97804).
|   Simple. Low upside. Good for establishing relationship.
+-- They want PMPM -> Negotiate rate based on:
|   - Population acuity (higher acuity = higher PMPM)
|   - Service scope (meals included or carved out?)
|   - Volume guarantee (minimum enrolled members)
|   PMPM is preferred for Cena: predictable revenue, lower admin burden.
+-- They want shared savings -> Acceptable IF:
|   - Baseline data exists (at least 12 months of claims history)
|   - Cena has upside-only (no downside risk in first 2-3 contracts)
|   - Reconciliation process and dispute path are defined in contract
|   - Quality measures are agreed upon upfront (use HEDIS where possible)
+-- They want hybrid -> PMPM base + shared savings bonus is the ideal model.
    Provides revenue floor with upside for demonstrated value.
```

### Compliance vs. operational burden

```
Does the compliance requirement add significant operational cost?
+-- No -> Implement. No tradeoff to analyze.
+-- Yes -> Is the requirement legally mandated (HIPAA, state law)?
    +-- Yes -> Implement regardless of cost. Flag for process optimization.
    +-- No -> Is it a best practice that reduces audit/enforcement risk?
        +-- Yes -> Implement. The cost of non-compliance exceeds the
        |         operational cost. (e.g., formal risk assessment even if
        |         not yet required by a specific contract)
        +-- No -> Evaluate case-by-case. Document the decision and rationale.
                  Flag for periodic reassessment.
```

### Research vs. clinical data boundaries

```
Is the primary purpose of the data use to generate generalizable knowledge?
+-- No -> Operational / QI use. No IRB required. Standard PHI protections apply.
+-- Yes -> Research use. Requires:
    1. IRB approval at PI's institution (UConn if UConn is PI)
    2. Informed consent for research (separate from clinical consent)
    3. Data use agreement between Cena and research institution
    4. De-identification or limited data set per HIPAA
    5. Physical separation: research data in analytics tier (BigQuery),
       not in clinical database (Postgres)
```

---

## Worked example: OQ-07 (HEDIS data model timing)

**Question:** Design the HEDIS data model now or when the first VBC contract requires it?

**Applying the "design now vs. design later" tree:**

1. *Is it required by a signed contract?* No. No VBC contract is signed yet.
2. *Is it required before the first VBC contract can close?* Not strictly --
   a VBC contract can be signed with HEDIS reporting as a future deliverable.
   But payers will ask about reporting capability during negotiations.
3. *Is retrofitting significantly more expensive than building it in?*
   **Yes.** HEDIS compliance is primarily a data model decision -- capturing
   the right fields at the right granularity at the point of care. The fields:
   - Date of service (already captured)
   - Ordering/rendering provider NPI (needs to be in visit record)
   - Lab result value in queryable format with LOINC codes (needs structure)
   - Denominator eligibility flags (continuous enrollment, age, diagnosis)
   - Numerator compliance evidence (was the measure met, with date)

   Adding these fields after launch means backfilling historical data --
   which is often impossible for HEDIS (you can't retroactively capture a
   provider NPI that wasn't recorded). Starting without them means the first
   12 months of patient data are potentially unusable for HEDIS reporting.

**Recommendation:** Design for HEDIS from day one at the data model level.
This is a field-level decision (add 5-6 fields to existing entities), not a
separate system. The cost is low. The cost of retrofitting is high because
missing data is unrecoverable.

**Uncertainty:** Which specific HEDIS measures the first contract requires
is unknown. Start with the measures most relevant to food-as-medicine:
CDC (Comprehensive Diabetes Care), CBP (Controlling Blood Pressure), BMI
screening. Add measures when contracts specify them.

**What we need from Vanessa:** Confirm this approach. Flag if any pending
partner has indicated they don't want HEDIS reporting (unlikely for VBC).

---

## Tradeoff frameworks

### Regulatory floor vs. competitive advantage

The regulatory floor is non-negotiable (HIPAA, state licensing, CMS billing rules).
Above the floor, compliance capability becomes a competitive advantage in partner
negotiations. Payers prefer providers who can report HEDIS, track outcomes, and
demonstrate quality. Invest in compliance capabilities that serve double duty:
regulatory requirement + sales differentiator.

### Speed vs. thoroughness in compliance assessment

For known regulatory requirements (HIPAA, Medicare billing rules): be thorough.
These are well-documented and the cost of getting them wrong is high. For novel
questions (AI compliance, food-as-medicine regulatory classification): be fast
with a conservative interim position, then refine. Flag for counsel on novel
interpretations.
