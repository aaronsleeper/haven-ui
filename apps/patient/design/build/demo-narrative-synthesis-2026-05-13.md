# Demo Narrative Synthesis — May 13, 2026

Synthesis of 5 expert dispatches (brand-fidelity, ux-design-lead, patient-ops, clinical-care, nutrition) on the open demo-narrative questions for Dr. Dieckhaus, May 22.

Individual expert outputs in this directory: `expert-{name}-2026-05-13.md`.

## TL;DR

- **Patient profile (settled, concrete):** Maria Rivera, 52, Latina, Hartford, HIV+ since 2008, virally suppressed on integrase-inhibitor ART. Active nutrition target: **ART-associated metabolic syndrome** (HbA1c 6.3 pre-diabetic, BMI 31, mild dyslipidemia) + marginal food insecurity. Spanish-preferring. 3 weeks into UConn pilot. **The UConn pilot is HIV Nutrition Support — not T2DM.** I had assumed T2DM from the meal-plan signal; patient-ops correctly reframed.
- **Care team:** Sarah Kim, RN, BSN (coordinator, Spanish-conversant); Dr. Soto, RDN (clinical lead).
- **Two open decisions Aaron needs to make:** (Q1) message bubble register flip vs keep — experts disagree on patient-as-protagonist vs care-team-as-institutional-voice; (Q3) interactive moment — check-in flow vs message reply, experts disagree on which best demonstrates Cena.
- **One verification needed from Vanessa:** care-team staff names (Sarah Kim / Dr. Soto) — same open item as IRB sub-investigator listing.

## Persona (concordant — patient-ops + clinical-care)

Concrete enough to thread through every screen.

```
Maria Rivera
  age:              52
  city:             Hartford, CT
  language:         Spanish-preferring (English-functional)
  HIV+ since:       2008
  regimen:          integrase-inhibitor (once-daily ART, virally suppressed)
  metabolic state:  ART-associated metabolic syndrome
                    - HbA1c 6.3 (pre-diabetic, recent improvement from baseline)
                    - BMI 31 (mild obesity)
                    - mild dyslipidemia
  food security:    marginal (income-eligible for UConn pilot)
  enrolled:         3 weeks ago in UConn HIV Nutrition Support pilot
  engagement:       compliant, stabilizing
  care coordinator: Sarah Kim, RN, BSN — Spanish-conversant
  clinical lead:    Dr. Soto, RDN
```

Demo framing rule per patient-ops: **the app supports behavior, not re-disclosure** — HIV doesn't appear on every screen, only where it makes clinical sense (e.g., a note in the care plan, a coordinator's reference to it in messages). Patient sees their nutrition + wellness app; clinician audience can infer the population from context.

## Connective tissue data set

Anchored to demo day Friday May 22, 2026 (Dieckhaus's session). Each screen consumes from this:

| Field | Value |
|---|---|
| `patient.firstName` | Maria |
| `patient.lastName` | Rivera |
| `patient.preferredLang` | es |
| `coordinator.name` | Sarah Kim |
| `coordinator.role` | Care Coordinator (RN) |
| `clinicalLead.name` | Dr. Soto |
| `clinicalLead.role` | Registered Dietitian Nutritionist |
| `mealWeek.confirmBy` | Wednesday, May 21 at 5pm (1 day before demo) |
| `mealWeek.deliveryDate` | Monday, May 25 |
| `nextAppointment.title` | Nutrition check-in with Dr. Soto |
| `nextAppointment.dateTime` | Tuesday, May 27 · 10:00 AM |
| `weeklyCheckIn.status` | ready (GAD-7 + PHQ-9 due this week) |
| `messageThread.lastFromCoordinator` | May 21, evening |
| `messageThread.lastFromPatient` | May 20, morning |
| `trends.mood` | improving (6-week sparkline) |
| `trends.energy` | stable |
| `trends.mealSatisfaction` | improving |

**Vocabulary rules (patient-ops):**
- "your care team" — primary noun, default reference
- "your care coordinator" — only when naming the specific contact (e.g., "message your care coordinator")
- "Care" — keep as nav label (short); the destination screen uses "your care team" + "your care coordinator" prose

## Care plan goals — rewrite for SMART criterion

Current generic 3 (per clinical-care, fail SMART):
- ~~Eat balanced meals to keep your blood sugar steady.~~
- ~~Watch your salt intake.~~
- ~~Check in once a week so your team knows how you're doing.~~

Proposed MNT-aligned (patient-facing copy, not clinical instrument language):
- **Eat your weekly Cena meals on schedule** — supports steady blood sugar and lipid management
- **Walk 20 minutes most days** *(clinical-care flagged this needs verification for a sedentary 52F; conservative version: "Add 10 minutes of walking after dinner three times a week")*
- **Send your weekly check-in so your team knows how you're feeling**

Plus: rename the section header from "Your care plan" → **"Your nutrition & wellness plan"** (clinical-care: stops the demo from implying Cena is running parallel clinical care). The /care nav stays "Care" — short.

## Meal plan revision (nutrition + clinical-care)

Current 5 demo meals are defensible-generic but fail the "respects Maria's Latin preference" test and have tag-coherence issues.

| # | Current | Recommended |
|---|---|---|
| Mon | Chicken Verde | **Chicken Verde** (keep — on-cuisine, on-clinical) — tags: Low sodium, Diabetic-friendly |
| Tue | Lemon Salmon | **Lemon Salmon** (keep — clinical fit for dyslipidemia) — tags: Heart-healthy, **add** Diabetic-friendly |
| Wed | Tofu Noodle Bowl | **→ Sopa de Lentejas con Verduras** (nutrition's biggest single change) — tags: Low sodium, Vegetarian, Diabetic-friendly. Cuisine-on-profile + clinical lentil > tofu+noodles for ART-metabolic |
| Thu | Beef Stir-fry | **→ Pollo al Horno con Calabaza** (or similar Latin baked protein + roasted vegetable) — beef stir-fry sauce loads sodium+sugar despite "Diabetic-friendly" tag; replacement is on-cuisine + clinically clean |
| Fri | Turkey Chili | **Turkey Chili** (keep — Latin-flavor-token, clinically clean) — tags: High protein, Low sodium, **add** Diabetic-friendly |

**Tag taxonomy refinement (nutrition):** current tags conflate 3 layers. For ART-metabolic-syndrome positioning, the load-bearing tags are: Low sodium, Heart-healthy, Diabetic-friendly. "High protein" is fine *unless* Maria has CKD comorbidity (patient-ops did not flag CKD — safe). "Vegetarian" stays as cuisine-pattern. Drop or de-emphasize raw single-nutrient claims that aren't clinically load-bearing.

## Open decisions (Aaron's call)

### Q1 — Message bubble register

Experts disagree.

| Expert | Verdict | Reasoning |
|---|---|---|
| **brand-fidelity** | **FLIP** — care team teal, patient sand | DESIGN.md §Brand-expression-Logo, §Button brand-taste rule, §Voice all attach brand color to institutional voice. iMessage convention is "generic-app drift." Confidence 8/10. |
| **ux-design-lead** | **KEEP** — patient teal, care team sand | Patient-as-protagonist is the right power dynamic for an agent-augmented care model. iMessage convention valid as anchor. *Flips if Vanessa's positioning explicitly makes care team the protagonist of patient surfaces.* |

The disagreement exposes the real strategic question: **is the patient the protagonist of their own care app, or is the care team the institutional voice that defines the brand surface?** Not a UX-vs-brand bikeshed — a positioning call about what kind of product Cena is presenting to Dieckhaus.

My read: ux-design-lead's framing is stronger for the agent-augmented-care thesis Cena is selling. But brand-fidelity's DESIGN.md citations are concrete, and Aaron should resolve the §Voice question directly. **Recommend: ask Vanessa OR settle the §Voice framing in DESIGN.md before the swap is made.**

### Q3 — Interactive demo moment

Experts disagree.

| Expert | Recommendation | Reasoning |
|---|---|---|
| **brand-fidelity** | **Message reply** | Sarah K.'s institutional voice reaches the patient with §Voice's observational warmth; the teal Send fires at its reserved-use moment per §Button brand-taste. Confidence 7/10 — depends on Sarah's message copy being specific not generic. |
| **ux-design-lead** | **Check-in flow** end-to-end | Only flow that demonstrates Cena's actual thesis on one screen, defends under "what if X" poking, ends with the strongest beat — "an empty dashboard the agent earned." |

My read for the clinician audience (Dieckhaus): check-in flow has more clinical-workflow signal — patient receives a nudge, completes a standardized instrument, data flows to care team. That's the loop Dieckhaus needs to evaluate. Message reply is a chat moment — emotionally warm but less clinically novel.

**Recommend: check-in flow.** But the message reply is much cheaper to wire (no stepper, no localStorage, no completion routing) — a hybrid path is "wire BOTH but make check-in the headline."

## What needs Aaron / Vanessa

- **Q1 bubble register** — pick the framing
- **Q3 interactive moment** — pick the flow (or both)
- **Staff names** — confirm Sarah Kim, Dr. Soto with Vanessa (also open in IRB sub-investigator prep per May 4 roadmap)
- **HIV visibility in patient copy** — clinical-care flag: does Dieckhaus need to see HIV-explicit framing somewhere in the demo, or is the ART-metabolic-syndrome framing enough to signal his population?
- **Movement target (20-minute walk)** — clinical-care wants conservative version (10 min × 3) verified

## Implementation order if Aaron approves

1. **Demo-patient data module** — `apps/patient/src/lib/demo-patient.ts` consolidating the connective tissue fields. ~30 min
2. **Wire screens to demo-patient** — update care, meals, messages, dashboard, health, settings to read from the module. ~1 hr
3. **Rename care plan section** + rewrite 3 goals to MNT-aligned. ~15 min
4. **Meal plan swaps** — Wed (Sopa de Lentejas) + Thu (Pollo al Horno), tag refinement. ~30 min
5. **Interactive moment wiring** — check-in flow end-to-end (Dashboard task → GAD-7 → Thank You → cleared task). ~2 hr
6. **(If approved)** Message bubble register flip OR keep. ~5 min CSS swap.

Total: ~4 hours focused work. Fits within the May 22 timeline comfortably.

## Deferred verifications (post-synthesis dispatches if needed)

- **accessibility** — WCAG check on whichever bubble register Aaron picks (brand-fidelity's flip-to-teal needs verifying for WCAG body-text density)
- **pattern-library steward** — PL spec sibling-parity check after the bubble token swap
- **frontend / dev-tasker** — confirm the dashboard-task-clears-after-completion wiring is explicit in the punch list

## Confidence

Synthesis confidence: high on persona + connective tissue (patient-ops + clinical-care concordance), high on meal revision (nutrition specifics), medium on Q1/Q3 (experts disagree — Aaron's call). The HIV-vs-T2DM reframing was the most consequential individual finding.
