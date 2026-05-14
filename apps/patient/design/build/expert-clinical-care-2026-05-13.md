# Expert Review: Clinical Care — Patient App Demo Prep

**Date:** 2026-05-13
**Expert:** Clinical Care (haven-ui)
**Demo target:** Dr. Dieckhaus, on or around 2026-05-22
**Patient persona:** Maria Rivera (implied T2DM / metabolic profile on a medical-meal program)
**Scope:** Clinical plausibility of the demo persona and care content, plus a clinical-overstatement audit of what the current app implicitly claims about Cena's care role.
**Inputs reviewed:**
- `apps/patient/design/build/validation-2026-05-13.md`
- `apps/patient/src/screens/{care,health,meals}/index.tsx`
- `apps/patient/src/screens/{gad-7,phq-9}/*.tsx` (per validation doc, behavior confirmed there)
- Clinical Care expert brief: `planning/experts/clinical-care/{README,domain-knowledge,judgment-framework,escalation-thresholds,quality-criteria,output-contract,risk-register}.md`
- Reference standards consulted (per `domain-knowledge.md`): ADA Standards of Care 2026 (HbA1c targets, MNT carb distribution), Kroenke et al. PHQ-9 / Spitzer et al. GAD-7 scoring conventions, AHRQ PHQ-9 patient-facing reference. Cena institutional protocols carry `[ASSUMPTION]` flags (A1, A3) in domain-knowledge.md and would override published guidelines once validated by Vanessa / Clinical Ops.

---

## Framing

Two clinical-safety lenses drive the read:

1. **Coherence** — does Maria's implied profile hang together as a real Cena patient, or does the demo encode contradictions a clinician will catch in seconds?
2. **Overstatement** — does the app imply Cena is doing clinical work (lab interpretation, care planning, authoritative monitoring) that exceeds what Cena is currently licensed and staffed to do for the UConn pilot?

These map to the two highest-stakes risks in this expert's risk register: missed clinical detail and clinical overreach. Dr. Dieckhaus is a referring clinician; he will read the app as either "this is a coaching/MNT supplement to my care" or "this is trying to be a parallel clinical system." The framing matters because the first is defensible and the second is not — Cena pilots retain clinician accountability with the referring institution (memory: `project_cena_accountability_model`).

A note on premises before the audits: the brief asks about A1C 7.2 → 6.3 sparkline data and Blood Pressure / Weight trends. The current build (`apps/patient/src/screens/health/index.tsx`) only shows three sparklines — Mood, Energy, Meal Satisfaction — with arbitrary 0–7 scale values, not clinical biomarkers. Either the brief's persona is ahead of the code (likely — patient-ops is producing the fuller persona in parallel) or the demo plan is to add A1C/BP/Weight sparklines before May 22. I answer Q1's A1C question against the brief's stated trajectory because that's what will reach the demo; I flag the gap so it doesn't ship as a clinical claim without code review.

---

## Q1 — Plausibility audit

### Type 2 diabetes + GAD-7 + PHQ-9 screening cadence

- **The clinical convention** — USPSTF and ADA both recommend depression screening for adults with diabetes annually at minimum, with more frequent screening when depression has been previously identified or when symptoms emerge. The American Diabetes Association's *Standards of Care 2026* (Section 5: Facilitating Behavior Change and Well-being) explicitly recommends routine screening for depression and diabetes distress as part of comprehensive diabetes care.
- **GAD-7 and PHQ-9 cadence in MNT-integrated programs** — common practice is monthly or every-other-month during active behavioral intervention, dropping to quarterly once stable. Weekly is uncommon and clinically questionable for stable patients (instrument validation assumes a 2-week recall window; weekly readings produce noisy data that can't be meaningfully tracked).
- **Verdict** — **monthly PHQ-9 + GAD-7 is clinically appropriate** for a T2DM patient on an integrated meal + behavioral support program. **Weekly cadence is not defensible** without a clinical rationale (e.g., active depressive episode, treatment titration). The current app shows assessment availability on the dashboard as "Today's check-in" — this implies frequent (weekly or daily) availability without specifying the underlying instrument cadence. Tighten the framing: "Your monthly check-in" or "Your weekly mood log" (if it's a brief informal mood log, not a full GAD-7/PHQ-9) would be clinically honest. **Do not show the patient that they're completing the full GAD-7/PHQ-9 weekly** — that's a clinically incorrect protocol.

### Meal program clinical appropriateness

- **The five meals against published MNT guidance** — Chicken Verde, Lemon Salmon, Tofu Noodle Bowl, Beef Stir-fry, Turkey Chili with low sodium / heart-healthy / diabetic-friendly / vegetarian / high-protein tags read as a credible diabetes-and-cardiometabolic MNT menu. The ADA's nutrition recommendations (2026 Standards, Section 5) emphasize a Mediterranean or DASH-style pattern, lean protein, lower-sodium preparations, and consistent carb distribution. The meal mix fits.
- **Specific clinical checks**
  - **Carb-load distribution** — for T2DM, consistent carbohydrate at each meal matters more than total daily carbs. The menu shows no carb gram counts. For Dieckhaus, the absence is fine — patient-facing UI doesn't need carb-gram detail — but the underlying meal-ops record needs it. **Don't have a clinician ask "what's the carb count on Tofu Noodle Bowl?" with no answer ready.**
  - **Low-sodium tag** — ADA/AHA target for hypertensive/cardiometabolic patients is < 2300 mg/day, ideally < 1500 mg for high-risk. "Low sodium" tag is fine as a patient-facing label; verify the actual meal sodium content with meal-ops (this expert can't validate the underlying recipe data).
  - **"Diabetic-friendly" labeling** — this term is loose. The American Diabetes Association moved away from "diabetic diet" / "diabetic-friendly" language because it implies a categorical food restriction rather than the actual recommendation (consistent carb distribution + Mediterranean/DASH pattern). **Recommend changing the tag** to "Balanced carbs" or "Blood sugar friendly" — preserves the patient-facing intent without invoking the discredited "diabetic foods" frame.
  - **Heart-healthy** — fine as a patient-facing tag. Maps to AHA "heart-healthy eating" guidance.
  - **Vegetarian** — accurate descriptor, no clinical issue.
  - **High protein** — clinically reasonable for a metabolic patient (preserves lean mass, satiety). One caveat: if Maria has any kidney involvement (which patient-ops should confirm), high-protein flagging needs to be reconsidered — CKD stage 3+ would push protein to 0.6–0.8 g/kg/day, not high.
- **Verdict** — **menu is clinically appropriate for an uncomplicated T2DM patient.** Three discrete fixes: change "diabetic-friendly" tag to something more current; confirm sodium/carb content with meal-ops before demo; confirm no CKD comorbidity (which would invalidate "high protein" framing).

### A1C trajectory 7.2 → 6.3 over 6 weeks

- **The clinical math** — HbA1c reflects ~3-month average glucose, with the most recent 30 days contributing the largest weight. A change of 0.9 percentage points over 6 weeks is at the upper end of what's clinically plausible for an MNT + behavioral intervention, but it's not impossible. The DiRECT trial and similar intensive lifestyle programs have shown 1.0+ point HbA1c reductions in 12 weeks; 6-week reductions are typically 0.3–0.6 points for highly engaged patients on intensive intervention.
- **What 7.2 → 6.3 implies** — for the trajectory to be real:
  - Maria would need to be early in her diagnosis (recent T2DM, beta-cell function preserved)
  - High adherence to the meal program (~80%+ of meals consumed as delivered)
  - Likely paired with a medication intervention (metformin titration, GLP-1 start) — pure-MNT producing 0.9 points in 6 weeks is rare
  - Baseline 7.2 is "above target but not severely uncontrolled" — plausible starting point
- **Verdict** — **at the edge of plausible, not implausible.** If Dieckhaus pushes on it, the defensible answer is "This is the high-engagement, early-T2DM scenario — combined nutrition + medication + behavioral support. We model the trajectory as illustrative of the program's intended outcome, not as typical." Two clinical-honesty options:
  - **Option A** — soften the trajectory to 7.2 → 6.7 over 6 weeks (0.5 points). More typical, harder to challenge.
  - **Option B** — keep 7.2 → 6.3 but add a clinical context line: "Reflects nutrition + medication adjustment + weekly behavioral check-ins." Acknowledges this isn't pure-MNT magic.
- The bigger problem (see Q2): **showing the patient her A1C trend at all** is a separate question from whether the trend is plausible. Even if the trajectory is right, the app implying Cena is interpreting lab data for the patient is the clinical-overreach risk.

### Care plan goals — appropriate framing or too generic?

Current goals (from `apps/patient/src/screens/care/index.tsx`):
1. "Eat balanced meals to keep your blood sugar steady."
2. "Watch your salt intake."
3. "Check in once a week so your team knows how you're doing."

- **SMART-criterion check** (per `judgment-framework.md`):
  - **Specific** — partial. "Balanced meals" and "watch salt" are not specific. "Check in once a week" is specific.
  - **Measurable** — none. No target metrics, no measurement method.
  - **Achievable** — implied but not anchored to baseline.
  - **Relevant** — tied loosely to T2DM but not explicitly so.
  - **Time-bound** — none. No reassessment date.
- **Against expert's quality criteria** — these goals fail the "SMART goal quality" criterion in `quality-criteria.md`. Generic wellness language ("eat healthier") is explicitly named as never acceptable in `judgment-framework.md`. These three goals are one step above "eat healthier."
- **What MNT-grade goals look like**
  - "Keep HbA1c below 7.0% by the next blood test in 8 weeks" (specific, measurable, time-bound, tied to T2DM)
  - "Eat each of your 5 weekly Cena meals to support consistent carbohydrate distribution" (specific, measurable via delivery completion, achievable, tied to T2DM)
  - "Complete your weekly mood and energy check-in so your care team can adjust your plan" (specific, measurable, time-bound, tied to BH integration)
- **Verdict** — **too generic as drafted.** Acceptable in a coaching-tone consumer wellness app; below the bar for an MNT care plan that a referring clinician would defend. The framing tradeoff is real (patient-friendly vs. clinically defensible), and a middle path exists: keep patient-friendly language at the top of each goal, add the measurable target underneath in muted type. Example:
  > **Eat balanced meals to keep your blood sugar steady.**
  > Goal: Eat 5 of 5 Cena meals each week. Track: meal confirmation. Reassess: every 4 weeks.

  This preserves the warm patient-facing tone while making the clinician-facing care-plan content defensible. The expert's `output-contract.md` defines the underlying care-plan-section structure — the patient-facing UI is a presentation layer over that structure; the demo currently exposes only the warm copy without the clinical scaffold underneath.

### Plausibility verdict (Q1)

- **Menu** — appropriate, three tag/copy fixes.
- **Screening cadence** — monthly is right; weekly is wrong; current UI is ambiguous.
- **A1C trajectory** — at the edge of plausible; soften OR contextualize.
- **Care plan goals** — coaching-toned but not SMART; add measurable scaffold beneath warm copy.

**Confidence: medium-high.** The clinical content fits the implied persona with the named adjustments. The remaining uncertainty is around patient-ops' fuller persona (does Maria have CKD, what's her medication list, what's her actual baseline) — once that lands, this audit should be re-run against the specifics.

---

## Q2 — Overstatement audit + fixes

The structural risk: the app currently presents content that, if read by a referring clinician (Dieckhaus), implies Cena is interpreting clinical data and authoritatively managing care. Cena's UConn pilot model (per memory `project_cena_accountability_model`) is partner-institution clinicians retain accountability; Cena provides supplemental MNT + behavioral support coaching. The app needs to render that division of labor clearly.

### Overstatements identified

1. **"Your care plan" framing**
   - **What it implies** — Cena owns and authors an authoritative care plan covering Maria's diabetes management.
   - **What's clinically defensible** — Cena owns a **nutrition + behavioral support plan** that supplements the referring clinician's diabetes care plan.
   - **Fix** — rename to "Your nutrition & wellness plan" or "Your Cena plan." Keep "care plan" terminology for the partner-institution clinician's plan, which Cena does not display in the patient app.
   - **Cost** — copy change in `apps/patient/src/screens/care/index.tsx` line 70 ("Your care plan") and the sidebar tab label ("Care" → "My Plan" or similar). Cross-screen: the footer "To change anything, message your care coordinator" framing is fine; the route name `/care` is internal and unaffected.

2. **A1C / clinical biomarker trends (premise-dependent — see Framing note above)**
   - **What it implies if added per the brief's persona** — Cena is interpreting Maria's lab data and presenting clinical biomarkers to her with trend analysis.
   - **What's clinically defensible** — Cena receives lab data from the referring institution (per `domain-knowledge.md` assumption A2 — FHIR R4 integration) and uses it to adjust meal plans and behavioral support. Cena is NOT clinically interpreting the lab data for the patient — that's the PCP/endocrinologist's role.
   - **Fix options** (in increasing order of clinical caution):
     - **A** — show A1C as a data point with explicit attribution: "From your PCP, May 5: HbA1c 6.8. Talk with your doctor about what this means for you." Cena is the messenger, not the interpreter.
     - **B** — don't show A1C as a patient-facing trend at all for the demo. Show it in a clinician-facing view (which would be a different app — care-coordinator) where Dieckhaus can see what Cena sees.
     - **C** — show A1C trend with a "What your care team is doing about this" sidebar tied to specific nutrition/behavioral interventions, with clinician-facing copy ("Your nutrition plan was updated on May 10 in response to your latest A1C — your PCP is informed.").
   - **Recommendation** — **option B for the demo.** A1C is the headline biomarker in T2DM; Cena interpreting it directly to the patient is the single most overreach-prone surface in the app. If the demo wants to show biomarker integration, show it in the care-coordinator app to Dieckhaus, not in Maria's view. Hold A1C-in-patient-app for a future cycle when Cena has explicit data-sharing agreements with the patient's PCP and the legal/clinical model is reviewed.
   - **Note on the current build** — the existing /health screen shows Mood, Energy, Meal Satisfaction (patient self-report). Those are **defensible patient-facing trends** — Cena is showing the patient back her own reported data, not interpreting clinical lab values. Keep this. Don't add A1C/BP/Weight sparklines for the demo unless option A or C is implemented thoughtfully — and even then, B is safer.

3. **Care plan goals as authoritative directives**
   - **What it implies** — these are clinical orders Maria should follow.
   - **What's clinically defensible** — these are coaching goals collaboratively set between Maria and her Cena care coordinator (RDN/BHN involvement per `escalation-thresholds.md` gates).
   - **Fix** — preface the goals card with attribution: "Goals you and your Cena coordinator set together" or "Working on these with your care team." Removes the "Cena dictates" frame.

4. **"Care coordinator" as the operative role**
   - **What it implies** — Cena has a clinical role for Maria; the coordinator is making care decisions.
   - **What's clinically defensible** — the Cena care coordinator is a non-clinical role coordinating MNT delivery, behavioral check-ins, and communication with the patient. Clinical decisions are made by the partner-institution clinician (UConn pilot) or by RDN/BHN at the gates defined in `escalation-thresholds.md`.
   - **Fix** — keep "care coordinator" terminology but pair with an explicit role disclosure somewhere visible: "Sarah K., your Cena care coordinator. She coordinates your meal plan and check-ins. For medical questions, contact your PCP." This belongs in the Messages thread header or the Settings → Account section. Doesn't have to be loud; has to be present.

5. **Assessment results presentation**
   - **Current state** (per validation doc) — Assessment Complete renders `[prototype] score 5 of 21 — mild` as visible patient-facing copy.
   - **Clinical convention** — patient-facing PHQ-9/GAD-7 UX does NOT show raw scores or clinical bands. The score is for the clinician; the patient sees a reassurance frame.
   - **Fix** — remove the score band display before demo (already named as a critical fix in the validation doc, item #7). Replace with: "Thanks for sharing. Your care team will look at your answers and reach out if anything needs attention." No raw score. No "mild" / "moderate" / "severe" labels.
   - **Cross-reference** — `risk-register.md` flags this exact pattern as a critical safety risk (PHQ-9 routing). The current build's prototype score display is also a clinical-overstatement risk: showing a "mild" band to a patient implies Cena is doing clinical scoring on PHQ-9/GAD-7, which is a licensed activity. Hide it.

6. **"Upcoming appointment with Dr. Soto"**
   - **What it implies** — Dr. Soto is the patient's clinician.
   - **What's clinically defensible** — depends on who Dr. Soto actually is. Memory (`project_cena_accountability_model`) flags that Soto / Morales / Director of Clinical Ops are Cena's evolving clinical roles, and that the names should be confirmed with Vanessa before external citation. For the demo:
   - **Fix** — confirm with Vanessa that Dr. Soto can be named publicly. If not yet — change to a generic role label ("Nutrition check-in with your Cena RDN") for the demo. Don't name a real clinician until the org has signed off.

### What to soften vs. what to remove

- **Remove for demo:** A1C/BP/Weight clinical biomarker trends if they're being added per the brief's persona (or implement option A/C explicitly); raw PHQ-9/GAD-7 scores from patient view; named "Dr. Soto" unless confirmed.
- **Soften copy:** "Your care plan" → "Your Cena plan" or "Your nutrition & wellness plan"; care plan goals → add measurable scaffold + collaborative attribution; care coordinator → add role disclosure somewhere visible.
- **Keep:** Mood/Energy/Meal-Satisfaction self-report trends (patient's own data, not lab interpretation); meal plan content (with three tag fixes from Q1); messaging with care team; assessment instruments themselves (just fix the results view).

### Overstatement verdict (Q2)

The app currently overstates in five places, two of them load-bearing (the "care plan" framing and the prototype score display). The other three (named clinician, role disclosure, goal attribution) are softer fixes that move the app from "Cena is your doctor" framing to "Cena coordinates your meal plan and behavioral support, working alongside your doctor" framing. The latter is what Dieckhaus needs to see — it's accurate, it's defensible, and it positions Cena correctly relative to UConn's clinical role.

**Confidence: high** — these are well-established clinical-positioning patterns in MNT-integrated care models, and the fixes are mechanical (copy + remove the prototype score line + don't add A1C-as-clinical-trend).

---

## Confidence summary

| Question | Confidence | Why |
|---|---|---|
| Q1 — Clinical plausibility | medium-high | Menu + cadence + A1C trajectory + goals all read against published guidance with named fixes. Remaining uncertainty is patient-ops' fuller persona (CKD comorbidity, medication list, baseline) — re-audit once that lands. |
| Q2 — Demo-safe clinical framing | high | Clinical-positioning patterns for MNT-integrated care are well-established. The five overstatements map to known patterns and the fixes are mechanical. |

## Top items to tighten before May 22

1. **Remove the prototype PHQ-9/GAD-7 score band from the patient view** (already named as critical in validation doc; clinical-positioning reason added here).
2. **Rename "Your care plan" → "Your Cena plan" or "Your nutrition & wellness plan"** and add collaborative attribution to the goals.
3. **Do NOT add A1C-as-patient-facing-trend for the demo** (or implement option B — show it in a clinician-facing view, not Maria's app).
4. **Replace "diabetic-friendly" tag** with "Balanced carbs" or "Blood sugar friendly."
5. **Confirm with Vanessa** that "Dr. Soto" can be publicly named, or swap to a generic role label.
6. **Tighten screening cadence framing** — call it "weekly mood log" if it's informal, or "monthly check-in" if it's the full GAD-7/PHQ-9. Don't imply weekly full-instrument completion.
