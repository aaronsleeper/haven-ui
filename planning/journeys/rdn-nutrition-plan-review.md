# Journey: Review Nutrition Plan for New Care Plan

## Journey Metadata
- **User:** RDN (e.g., Dr. Priya, manages 40-patient clinical caseload)
- **Goal:** Review and approve the nutrition section of an agent-drafted care plan
- **Frequency:** Several times per week (new patients + plan updates)
- **Entry Point:** Nutrition plan review item appears in clinical queue
- **Success Criteria:** Nutrition section approved, care plan advances to coordinator for final approval
- **Duration:** 5-10 minutes (new plan), 3-5 minutes (update)

## Prerequisites
- Patient intake assessment is complete (1.4)
- Agent has drafted the care plan including nutrition section
- Patient's lab values, dietary history, and restrictions are in the record

---

## Happy Path

### Step 1: Open Clinical Queue Item
- **Screen:** Provider App — click nutrition review item in left sidebar
- **User Action:** Clicks "Nutrition plan review — Maria Garcia"
- **System Response:**
  - Center panel loads the patient clinical record, focused on the care plan nutrition section
  - Right panel loads the care plan thread — agent drafting history, assessment data references
  - Nutrition section is in editable review mode

### Step 2: Review Patient Context
- **Screen:** Center panel — patient clinical summary tabs
- **User Action:** Scans the key clinical context the nutrition plan should reflect:

**Assessment summary (collapsible, above the nutrition section):**
| Data Point | Value | Source |
|---|---|---|
| Diagnosis | E11.65 — Type 2 DM w/ hyperglycemia | Referral |
| HbA1c | 9.2% (goal: < 8.0%) | Lab import, Mar 20 |
| Weight | 210 lbs / BMI 33.4 | Self-report, Mar 18 |
| Allergies | Tree nuts (severe) | Patient-reported |
| Dietary preferences | Prefers Latin cuisine, dislikes seafood | AVA intake |
| SDOH flags | Food desert, limited cooking facilities | AVA intake |
| Medications | Metformin 1000mg BID, Lisinopril 10mg | EHR import |

- **Decision Point:** Does the agent's draft account for all of this?

### Step 3: Review Agent-Drafted Nutrition Plan
- **Screen:** Center panel — nutrition section in review mode
- **User Action:** Reads the agent's draft:

```
NUTRITION PLAN — DRAFT
──────────────────────────────────────────────
Caloric target:    1600-1800 cal/day
Carbohydrates:     < 45% total calories (~180-200g)
Protein:           ≥ 20% total calories (~80-90g)
Fat:               ≤ 35% total calories
Sodium:            < 2300mg/day
Potassium:         monitor (Lisinopril interaction)

Allergen exclusions (HARD — never override):
  • Tree nuts

Preference tags (soft match):
  • Latin-inspired cuisine preferred
  • No seafood
  • Limited prep required (no cooking facilities)

Meals per week: 14 (2/day)
Format: Frozen (patient preference, limited refrigeration)

Agent confidence: high
Rationale: Parameters derived from ADA nutrition therapy
guidelines for T2DM with obesity. Caloric target set for
gradual weight loss (1-2 lbs/week). Sodium conservative
per hypertension (Lisinopril). Potassium flagged for
monitoring given ACE inhibitor use.
──────────────────────────────────────────────
```

- **System Response:** Agent's rationale is visible below each parameter — the RDN can see *why* the agent chose each value
- **Decision Point:** Are the parameters clinically appropriate?

### Step 4: Verify ICD-10 Code Mapping
- **Screen:** Center panel — below nutrition plan, code mapping section
- **User Action:** Reviews the agent-generated mapping:

| NCP Terminology | ICD-10 Code | Agent Confidence |
|---|---|---|
| Excessive energy intake (NI-1.3) | E11.65 | High |
| Excessive carbohydrate intake (NI-5.8.2) | E11.65 | High |
| Food and nutrition knowledge deficit (NB-1.1) | Z71.3 | Medium |

- **Decision Point:** Are the NCP terms correct? Do the ICD-10 mappings support billing?

### Step 5: Check Meal Match Availability
- **Screen:** Center panel — meal match preview section
- **User Action:** Reviews the agent's pre-check against the recipe catalog:

```
Recipe catalog check:
  72 recipes match hard constraints (nut-free, diabetic-appropriate)
  38 recipes match soft preferences (Latin-inspired, no seafood)
  Sufficient variety for 4-week rotation ✓
```

- **Decision Point:** Enough meal variety? Any concern about recipe quality for this patient?

### Step 6: Edit or Approve
- **Screen:** Right panel — approval card
- **User Action:** The RDN either:

**Option A — Approve as-is:**
  - Taps **Approve** on the approval card
  - Nutrition section locked with RDN signature
  - Thread logs: "[Dr. Priya M.] Approved nutrition plan · 10:14am"

**Option B — Edit and approve:**
  - Clicks into any parameter field and adjusts (e.g., reduces sodium to < 1800mg)
  - Each edit is tracked: field, old value, new value
  - Adds a note: "Reduced sodium target given elevated BP at intake"
  - Taps **Approve with edits**
  - Thread logs the edit and rationale

**Option C — Reject:**
  - Taps **Reject** and types reason: "Caloric target too aggressive for patient's activity level"
  - Agent receives feedback, re-drafts with adjusted parameters
  - Item re-enters RDN queue after re-draft

- **System Response (on approve):**
  - Nutrition section status: ✅ RDN approved
  - Care plan advances — if BHN review is needed (PHQ-9 >= 10), goes to BHN queue; otherwise goes to coordinator queue
  - Queue item removed from RDN's list

---

## Alternative Paths

### Alt 1: Nutrition Plan Update (Not New Plan)
- **Trigger:** Lab result or risk score change triggered a care plan revision affecting nutrition
- **Modified Steps:**
  - Center panel shows diff view: what changed and why
  - Triggering event highlighted: "HbA1c increased from 8.1 to 9.2 — agent recommends reducing carb target"
  - RDN reviews only the changed parameters, not the full plan
- **Outcome:** Faster review cycle for updates

### Alt 2: No Valid Meal Matches
- **Trigger:** Recipe catalog check returns 0 or very few matches
- **Modified Steps:**
  - Warning in meal match section: "3 recipes match — insufficient for rotation"
  - RDN can: relax a soft constraint, request a new recipe from kitchen, or approve with a note that meal delivery will be delayed
  - If RDN relaxes a constraint, agent re-runs the match immediately
- **Outcome:** RDN balances clinical ideal with practical availability

### Alt 3: Missing Lab Data
- **Trigger:** Key labs (HbA1c, lipids) not available — EHR import failed or labs not yet drawn
- **Modified Steps:**
  - Assessment summary shows gaps: "HbA1c: not available — lab not yet drawn"
  - Agent drafted nutrition plan using available data with lower confidence
  - RDN can: approve with known gaps (monitoring schedule will capture labs later), or defer until labs are available
- **Outcome:** RDN decides whether to proceed or wait

### Alt 4: Physician Referral Order Missing
- **Trigger:** Medicare MNT billing requires a physician referral order — agent can't find one linked to this patient
- **Modified Steps:**
  - Warning banner at top of nutrition section: "⚠ No physician referral order on file — MNT visits cannot be billed"
  - RDN can still approve the nutrition plan (clinical care proceeds)
  - Agent alerts the coordinator to obtain the referral order
  - Billing is blocked until the order is on file
- **Outcome:** Clinical care isn't delayed, but billing gap is tracked

---

## Exception Handling

### Exception 1: Agent Draft is Clinically Inappropriate
- **Cause:** Agent used outdated guidelines, misinterpreted lab values, or made a parameter error
- **Frequency:** Occasional — this is why the RDN review exists
- **Severity:** Graceful (caught before patient impact)
- **Recovery:** RDN edits inline or rejects with explanation. Agent learns from the feedback for future drafts (long-term).
- **Prevention:** Agent cites the guideline source for each parameter so the RDN can spot misapplications

### Exception 2: Medication-Nutrition Interaction Not Flagged
- **Cause:** Agent didn't flag a relevant drug-nutrient interaction
- **Frequency:** Rare but clinically important
- **Recovery:** RDN adds the interaction flag manually, adjusts parameters. Reports the miss so the interaction database can be updated.
- **Prevention:** Agent cross-references medication list against nutrition interaction database for every draft

---

## Critical Moments

| Step | Risk | Mitigation |
|---|---|---|
| 2 | Key clinical data not visible — RDN has to hunt for it | Assessment summary is always visible above the nutrition section |
| 3 | RDN rubber-stamps without reading rationale | Agent confidence indicator draws attention; "medium" confidence is visually distinct |
| 4 | ICD-10 mapping error leads to claim denial | Medium-confidence mappings highlighted for closer review |
| 5 | Approving a plan with no valid meals | Meal match check is shown before the approval card, not after |
| 6 | Accidental approve | 5-second undo window |

---

## Connected Journeys

**Feeds into:**
- [Coordinator care plan review](coordinator-care-plan-review.md) — RDN approval is a prerequisite
- Meal prescription matching (1.6) — nutrition parameters drive meal selection

**Feeds from:**
- Intake assessment (1.4) — assessment data feeds the agent's draft
- Lab results — trigger plan updates

**Intersects with:**
- BHN behavioral health review — parallel clinical review for the same care plan
- Kitchen recipe catalog — RDN validates recipes, availability affects plan feasibility

---

## Design Implications

1. **Clinical context must be immediately visible.** The RDN should never have to navigate away
   from the nutrition plan to find the patient's labs, medications, or allergies. Assessment
   summary stays pinned above the plan.

2. **Agent rationale builds clinical trust.** Showing *why* each parameter was chosen (guideline
   citation, data source) is the difference between a clinician who trusts the drafts and one
   who rewrites everything. This is not optional UI — it's the core of the agent-clinician
   relationship.

3. **Inline editing, not a separate form.** The RDN should edit the nutrition plan in place —
   click a value, change it, add a note. No modal, no separate edit screen. The review and
   edit are the same interaction.

4. **ICD-10 mapping is a billing concern, not a clinical one.** Show it, but don't make it the
   hero. The RDN confirms the mapping is reasonable — the billing team handles exceptions
   downstream.

5. **Meal match preview prevents downstream failure.** If the RDN approves parameters that have
   zero recipe matches, the kitchen can't fulfill. Showing the match count *before* approval
   catches this at the right moment.
