# Steps — Meal Prescription

> Each step references business logic in `workflows/01-patient-operations.md`
> section 1.6 (prescription generation) and `workflows/03-meal-operations.md`
> sections 3.2-3.3 (nutritional analysis and meal matching).

---

## Step 1 — Extract prescription parameters

| Field | Value |
|---|---|
| **step_id** | 1.0 |
| **expert** | Clinical Care |
| **coordination** | Sequential (triggered by care plan activation or nutrition update) |
| **input** | Approved care plan (nutrition plan section, allergen profile, dietary preferences, meal delivery logistics) |
| **output** | Meal prescription object (per schema in `workflows/01-patient-operations.md` 1.6): calories_min/max, macros, allergen_exclusions, preference_tags, cultural_preferences, hot_cold, meals_per_week, delivery_days, max_meal_budget |
| **model_tier** | Light (Haiku) — extraction from structured care plan data, minimal judgment |
| **autonomy** | Autonomous — mechanical extraction from an already-approved plan |
| **sla** | 1 minute |
| **error_route** | If care plan nutrition section is incomplete or malformed → halt, escalate to Clinical Care expert with specific missing fields |
| **fallback** | `checklist`: Static extraction template mapping care plan fields to prescription fields. Mechanical — barely needs expert judgment. Confidence capped at `medium`. |

**Notes:** This step translates clinical language into meal operations language.
The care plan says "protein 0.8 g/kg/day" — this step calculates the actual
grams based on patient weight and converts to the prescription format. Allergen
exclusions pass through unchanged — they are already absolute constraints.

**Update trigger variant:** When this workflow fires from a care plan update
(1.9), this step also determines which prescription fields changed and flags
the delta for downstream steps. Unchanged fields don't trigger re-matching.

---

## Step 2 — Validate prescription

| Field | Value |
|---|---|
| **step_id** | 2.0 |
| **expert** | Clinical Care |
| **coordination** | Sequential |
| **input** | Meal prescription object from step 1 |
| **output** | Validation result: pass/fail per field, flagged conflicts (e.g., caloric range too narrow for available meal sizes), confidence signal |
| **model_tier** | Standard (Sonnet) — applying clinical guidelines to validate the translation was correct |
| **autonomy** | Autonomous — validation findings route to step 3, not directly to humans |
| **sla** | 1 minute |
| **error_route** | If validation finds critical errors (allergen list mismatch between care plan and prescription) → halt, return to step 1 with specific errors |
| **fallback** | `checklist`: Static validation checklist (`.checklists/2.0-prescription-validation.md`) — field presence, range checks, allergen list match against patient profile. Catches structural errors, misses clinical judgment. Confidence capped at `medium`. |

**Validation checks:**
- Allergen exclusions match patient's allergen profile (hard — mismatch is a safety error)
- Caloric range is achievable with standard meal sizes (400-700 cal/meal × meals/week)
- Macro targets sum correctly (protein + fat + carb percentages within caloric range)
- Electrolyte limits are consistent with condition-specific guidelines
- Drug-nutrient interaction flags from the care plan carry through to prescription tags
- Delivery logistics are populated (address, days, frequency)

---

## Step 3 — Match recipes

| Field | Value |
|---|---|
| **step_id** | 3.0 |
| **expert** | Meal Ops (planned) |
| **coordination** | Sequential |
| **input** | Validated meal prescription from step 2, recipe catalog (active recipes from the patient's assigned kitchen) |
| **output** | Match result: list of eligible recipes per meal slot, match quality classification (sufficient / limited / none), preference match scores |
| **model_tier** | Standard (Sonnet) — constraint satisfaction with preference optimization |
| **autonomy** | Autonomous if match quality is sufficient; Notify if limited; Gate if none |
| **sla** | 2 minutes |
| **error_route** | If recipe catalog is empty or unavailable → halt, escalate to coordinator |
| **fallback** | `checklist`: Static matching algorithm — filter by allergen exclusions (hard), filter by caloric range (hard), rank by preference tags (soft). No variety optimization or repetition tracking. Confidence capped at `medium`. |

**Matching algorithm:**
1. **Hard filter:** Remove all recipes containing any ingredient in the patient's allergen exclusion list. This is absolute — no exceptions, no manual override at this step.
2. **Clinical filter:** Remove recipes that exceed any hard clinical restriction (sodium, potassium, phosphorus, caloric bounds).
3. **Soft rank:** Score remaining recipes by: preference tag match, cultural preference match, hot/cold match, variety (penalize recipes served in last 2 weeks), per-recipe patient satisfaction score (from 3.9 feedback if available).
4. **Classify result:** sufficient (5+ eligible recipes per meal slot), limited (1-4), none (0).

**Multi-kitchen awareness:** If the patient's primary kitchen has insufficient matches, the system checks alternative kitchens before declaring "no valid matches." Kitchen reroute requires coordinator approval (hardcoded gate — see step 4b).

---

## Step 4 — Select meals (branches by match quality)

### Step 4 — Sufficient matches (default path)

| Field | Value |
|---|---|
| **step_id** | 4.0 |
| **expert** | Meal Ops (planned) |
| **coordination** | Sequential |
| **input** | Eligible recipes and preference scores from step 3 |
| **output** | Weekly meal selection: specific recipe + variation per meal slot, linked to prescription version |
| **model_tier** | Light (Haiku) — selecting top-scoring recipes from a ranked list |
| **autonomy** | Autonomous — selection follows the scoring, no ambiguity |
| **sla** | 1 minute |
| **error_route** | N/A — sufficient matches means selection always succeeds |
| **fallback** | `checklist`: Select highest-scoring recipe per slot. No variety optimization. Confidence capped at `medium`. |

### Step 4a — Limited variety (coordinator confirm)

| Field | Value |
|---|---|
| **step_id** | 4.a |
| **expert** | Meal Ops (planned) |
| **coordination** | Human gate |
| **input** | Limited recipe list from step 3, best available selection |
| **output** | Coordinator-confirmed meal selection or adjusted constraints |
| **model_tier** | Light (Haiku) — presenting options for human decision |
| **autonomy** | Notify — coordinator sees the limitation and can override |
| **sla** | 4 hours |
| **error_route** | If coordinator doesn't respond within SLA → proceed with best available selection, flag in prescription record |

### Step 4b — No valid matches (RDN gate)

| Field | Value |
|---|---|
| **step_id** | 4.b |
| **expert** | Clinical Care |
| **coordination** | Human gate |
| **input** | Zero-match report: which constraints eliminated which recipes, patient's full restriction profile |
| **output** | RDN decision: relax a soft constraint, request new recipe from kitchen, or modify the care plan's nutrition parameters |
| **model_tier** | Standard (Sonnet) — presenting the constraint analysis for clinical judgment |
| **autonomy** | Gate — only an RDN can decide to relax clinical restrictions |
| **sla** | 24 hours |
| **error_route** | SLA breach → escalate to RDN supervisor. If unresolved after 48h → coordinator notified, care plan may need revision. |

**Notes:** This is the safety valve. When the recipe catalog can't satisfy the
prescription, the solution is either: expand the catalog (kitchen adds a recipe),
relax a soft constraint (preference, not allergen), or revise the clinical
targets (RDN adjusts the care plan — triggers workflow 1.9). The expert
presents the analysis; the human decides the path.

---

## Step 5 — Compliance check

| Field | Value |
|---|---|
| **step_id** | 5.0 |
| **expert** | Compliance (planned) |
| **coordination** | Sequential |
| **input** | Meal selection from step 4, prescription record, patient consent scope |
| **output** | Compliance result: PHI handling validation for prescription artifacts (packing slips, kitchen orders), consent scope coverage for meal delivery data sharing |
| **model_tier** | Light (Haiku) — applying known PHI rules to structured prescription data |
| **autonomy** | Autonomous if pass; Gate if PHI violation detected |
| **sla** | 1 minute |
| **error_route** | PHI violation → halt, gate on compliance resolution before any data leaves the system |
| **fallback** | `checklist`: PHI field inventory for prescription artifacts — verify packing slip fields stay within minimum-necessary boundary, verify kitchen receives only approved data fields per BAA status. Confidence capped at `medium`. |

**PHI boundary check (per `workflows/03-meal-operations.md` 3.6):**
- Packing slip: first name + last initial, delivery address, meal contents, allergen flags, delivery window. No diagnosis, insurance, clinical notes, phone.
- Kitchen order summary: aggregated quantities, no patient-identifying info beyond packing slip scope.
- Third-party delivery (no BAA): allergen flags use generic tags, no diagnosis-linked language.

---

## Step 6 — Lock prescription

| Field | Value |
|---|---|
| **step_id** | 6.0 |
| **expert** | Patient Ops (planned) |
| **coordination** | Sequential — triggered by compliance pass |
| **input** | Compliant meal selection, validated prescription |
| **output** | Locked meal prescription record linked to care plan version, downstream triggers fired |
| **model_tier** | Light (Haiku) — mechanical state transition |
| **autonomy** | Autonomous — all review gates have passed upstream |
| **sla** | 1 minute |
| **error_route** | If state transition fails → halt, alert coordinator |
| **fallback** | `checklist`: State transition checklist — verify all upstream steps passed, lock record, fire triggers. Confidence capped at `medium`. |

**Downstream triggers:**
- Order generation (workflow 3.5) — meals enter the kitchen production pipeline
- Patient notification — "Your meal delivery schedule is set"
- Monitoring setup — meal feedback collection cadence activated
- If update trigger: notify patient of menu changes effective next delivery cycle

**Version control:** Prescription is immutable once locked. Care plan updates
that change nutrition parameters trigger a new prescription version through
this workflow's update path. The new prescription takes effect on the next
delivery cycle, not retroactively.
