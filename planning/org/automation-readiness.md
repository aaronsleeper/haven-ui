# Automation Readiness Rubric

> A structured scoring framework for evaluating how ready each sub-function is for
> automation. Replaces qualitative emoji judgments with defensible assessments that
> drive prioritization.

---

## How to score

Rate each sub-function on 5 dimensions (1-5 scale). The composite score determines
the automation tier. Apply this rubric when designing new sub-functions or reviewing
existing automation targets during `/org-review`.

---

## Dimensions

### 1. Data Availability (1-5)

How structured, accessible, and reliable is the input data?

| Score | Description |
|---|---|
| 5 | Fully structured, API-accessible, real-time, high quality |
| 4 | Mostly structured, some manual input needed, reliable |
| 3 | Mix of structured and unstructured, requires parsing/extraction |
| 2 | Mostly unstructured, requires significant interpretation |
| 1 | No existing data source, requires human observation or judgment |

### 2. Decision Complexity (1-5, inverted — higher = simpler = more automatable)

How much judgment, context, or nuance does the decision require?

| Score | Description |
|---|---|
| 5 | Rule-based, deterministic, clear right/wrong answer |
| 4 | Pattern-based, LLM can handle with high confidence |
| 3 | Requires domain knowledge and contextual judgment |
| 2 | Requires weighing competing priorities, ambiguous trade-offs |
| 1 | Requires relationships, politics, ethical judgment, or creativity |

### 3. Error Cost (1-5, inverted — higher = lower cost = more automatable)

What's the consequence of getting it wrong?

| Score | Description |
|---|---|
| 5 | Trivial — easy to catch and fix, no downstream impact |
| 4 | Low — causes rework but no harm, caught in normal review |
| 3 | Moderate — affects patient experience or partner relationship, recoverable |
| 2 | High — clinical impact, compliance violation, or financial loss |
| 1 | Critical — patient safety, legal liability, or irreversible harm |

### 4. Volume & Frequency (1-5)

How often does this task occur? Higher volume = more automation value.

| Score | Description |
|---|---|
| 5 | Continuous or multiple times per day per patient |
| 4 | Daily, predictable cadence |
| 3 | Weekly or per-event (moderate frequency) |
| 2 | Monthly or quarterly |
| 1 | Rare, ad hoc, or one-time |

### 5. Current Tooling & Integration (1-5)

How well does existing infrastructure support automation?

| Score | Description |
|---|---|
| 5 | API available, agent framework already covers this, plug and play |
| 4 | API available, moderate integration work needed |
| 3 | Partial tooling exists, significant custom work needed |
| 2 | No existing tooling, needs to be built from scratch |
| 1 | Requires external partnerships, regulatory approval, or novel tech |

---

## Composite score → automation tier

| Composite (sum of 5 dimensions) | Tier | Recommendation |
|---|---|---|
| 21-25 | **Automate first** | High value, low risk. Build now. |
| 16-20 | **Automate with gates** | Good candidate with human review at key points. |
| 11-15 | **Agent-assisted** | Agent prepares, human decides. Worth building when volume justifies. |
| 6-10 | **Human-primary** | Agent supports with data/drafts but human drives. |
| 5 | **Keep manual** | Automation adds complexity without sufficient value. |

---

## Worked examples

### Example 1: Eligibility Verification (Patient Ops)

| Dimension | Score | Rationale |
|---|---|---|
| Data Availability | 5 | Structured payer API responses |
| Decision Complexity | 5 | Binary covered/not-covered with clear rules |
| Error Cost | 3 | Wrong eligibility = billing issues, but caught before care delivery |
| Volume | 4 | Every new patient, daily during enrollment ramps |
| Current Tooling | 4 | Athena integration planned, EligibilityAgent designed |
| **Total** | **21** | **Automate first** |

### Example 2: Care Plan Creation (Patient Ops)

| Dimension | Score | Rationale |
|---|---|---|
| Data Availability | 4 | Assessment data structured, but clinical nuance in notes |
| Decision Complexity | 2 | Requires clinical judgment, patient-specific goals |
| Error Cost | 2 | Wrong care plan = wrong treatment direction |
| Volume | 3 | Per patient at enrollment + quarterly reviews |
| Current Tooling | 4 | DocumentationAgent designed for drafting |
| **Total** | **15** | **Agent-assisted** — agent drafts, RDN approves |

### Example 3: Partner Relationship Management (Partner & Payer)

| Dimension | Score | Rationale |
|---|---|---|
| Data Availability | 2 | Relationship context is unstructured, in people's heads |
| Decision Complexity | 1 | Political, relationship-driven, high ambiguity |
| Error Cost | 2 | Damaged partnership = lost revenue stream |
| Volume | 2 | Per-partner, monthly-ish touchpoints |
| Current Tooling | 1 | No CRM, no partner management tooling |
| **Total** | **8** | **Human-primary** — agent supports with data prep only |

### Example 4: Meal Prescription Matching (Meal Ops)

| Dimension | Score | Rationale |
|---|---|---|
| Data Availability | 5 | Structured dietary data, recipe catalog with nutrition facts |
| Decision Complexity | 4 | Constraint-based matching, LLM handles variety/preference |
| Error Cost | 3 | Wrong meal = patient dissatisfaction, potential allergy risk (caught by QC) |
| Volume | 5 | Weekly per patient, scales with census |
| Current Tooling | 4 | MealMatchingAgent designed with constraint solver |
| **Total** | **21** | **Automate first** |

---

## How to apply this rubric

1. **New sub-functions:** Score before assigning an automation target in the function file
2. **Existing sub-functions:** Re-score when circumstances change (new tooling, higher volume, better data)
3. **Prioritization:** Sort all sub-functions by composite score to build the automation roadmap
4. **Disagreements:** When the rubric score disagrees with your intuition, investigate — either the scoring is wrong or your intuition is catching something the rubric misses. Document which and why.
5. **During `/org-review`:** The expert panel should challenge automation targets where the rubric score doesn't match the assigned tier

---

## Maintenance

This rubric evolves as Cena Health learns what works. Update scoring criteria when:
- A sub-function that scored high fails in practice (error cost was underestimated)
- A sub-function that scored low succeeds when automated (decision complexity was overestimated)
- New tooling shifts the Current Tooling scores across multiple functions
- LLM capabilities change what's feasible for Decision Complexity scores

Track these updates in [decisions.md](../decisions.md) as architectural decisions.
