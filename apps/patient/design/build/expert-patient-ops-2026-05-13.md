# Patient Ops Expert — Maria Rivera Profile + Demo Data Consistency

**Author:** Patient Ops expert (haven-ui)
**Date:** 2026-05-13
**Demo target:** Dr. Kevin Dieckhaus (UConn Health, Infectious Diseases — IRB PI on HIV Nutrition Support pilot), ~2026-05-22
**Scope:** Recommendation only — no code changes. Aaron applies to demo data files.

---

## Cross-cutting flag before the profile (read first)

The current app demo data leans **diabetic / metabolic** (meal tags: "Diabetic-friendly", "Low sodium", goals about blood sugar). The UConn pilot is the **HIV Nutrition Support Program** with Dr. Dieckhaus's Infectious Diseases service (per `Knowledge/Projects/Cena Health/Partners/UCONN Health/`). Source primary instruments locked for the pilot include PHQ-9 (mood); GAD-7 is already in the app and clinically appropriate; food-security + WHOQOL-HIV BREF are pending licensing decisions with Dieckhaus.

The structural mismatch: demoing a "diabetic patient with low-sodium meal goals" to the PI of an HIV nutrition trial will read as off-thesis on first glance. Two viable paths:

1. **Re-anchor Maria as an HIV+ patient with metabolic co-morbidity** — this is *highly plausible*. PLWH (people living with HIV) on antiretrovirals (especially older regimens, integrase inhibitors) experience weight gain, dyslipidemia, insulin resistance, and metabolic syndrome at elevated rates. A 52-year-old Latina woman on ART with pre-diabetes and food insecurity is on-thesis for the pilot AND keeps the existing diabetic-friendly meal tagging coherent. Recommended path.
2. **Strip HIV cues entirely**, pitch as "the pilot-agnostic patient surface" — leaves the structural mismatch unaddressed and forces Dieckhaus to do the imaginative work himself.

Option 1 below. The profile is calibrated so a clinical-care expert wouldn't push back and Dieckhaus sees his population reflected back at him.

`[VERIFY before demo]` — Vanessa should confirm the staff names (Soto, Morales, Director of Clinical Ops) per the open `1.8 — Sub-investigator listing prep` item in the May 4 MVP Roadmap. If those names aren't yet finalized for IRB submission, use the generic-role-only version in the vocabulary rules below.

---

## 1. Maria Rivera profile

**Demographic:** 52-year-old Latina woman, lives in Hartford, CT (within UConn Health's catchment for ID outpatient services). First language Spanish; bilingual but prefers Spanish for health conversations. Lives alone; one adult daughter local. SNAP-enrolled. Public transit + occasional rides from daughter for clinic visits.

**Primary condition + comorbidity:** HIV+, diagnosed 2008, currently virologically suppressed on a once-daily integrase-inhibitor regimen. Pre-diabetic (most recent HbA1c 6.3%), BMI 31, mild dyslipidemia. ART-associated metabolic syndrome is the active nutrition target — not the HIV itself. Mild-to-moderate anxiety (GAD-7 around 8–10 at intake) tied to financial stress and food access. PHQ-9 around 6 (subclinical / mild).

**Food security:** Marginally food-insecure on the USDA 6-item screener — skipping meals near month-end before SNAP refresh. This is *the* driver of the pilot enrollment and the reason meal delivery is load-bearing for her care plan.

**Enrollment state:** **Week 3 of pilot.** Recent enough that onboarding screens still make narrative sense if shown ("this is what Maria saw when she signed up"), late enough that the dashboard + meals + care + assessment loops have real data behind them. Past the assessment-baseline window; into the steady-state weekly check-in cadence. Two delivery cycles completed; third in flight (matches the existing "5 meals this week" pattern).

**Engagement state:** **Compliant and stabilizing.** Completed both baseline assessments (PHQ-9, GAD-7). Logged her weekly check-in last week. Read most messages from care team within 24h. Trend lines in My Health show "Mood: Improving" and "Meal Satisfaction: Improving" — credible for week 3 of supported nutrition intervention. This is the easiest demo arc to land (no crisis state to explain, no lapsed state that raises "how would the system have caught this" follow-ups).

---

## 2. Care coordinator profile

**Name:** Sarah Kim, RN, BSN
**Role:** Care Coordinator — the patient-facing single point of contact for Maria. Sarah is a Cena employee (not UConn staff) coordinating with the UConn HIV clinic team for clinical decisions.
**Professional shape:** Mid-30s, 8 years bedside + ambulatory nursing background, last 2 years in care-coordination roles. Spanish-conversant (important for Maria). Sits in Cena's care-coordination team alongside Dr. Soto (RDN — Registered Dietitian Nutritionist, owns nutrition plan), and the Director of Clinical Operations.

**Why a nurse-coordinator, not an RDN, is the patient's primary contact:** the RDN owns nutrition planning (gated; signs the meal prescription). The coordinator owns *continuity, scheduling, messaging, escalation, and queue triage* — the operational glue. This matches Patient Ops domain knowledge: the coordinator is "the expert coordinators interact with most" and the patient interacts with the coordinator most. RDN appears in the appointment card; coordinator appears in messages and as the persistent contact.

**Appearance in app:**
- Messages screen: `Sarah K., Care Coordinator` as sender label (already current; keep)
- Dashboard message preview: `Sarah K., Care Coordinator`
- Care plan footer: "To change anything, message your care team" (vocabulary rule below)
- Appointments: Dr. Soto, RDN — appears for the nutrition check-in (this is the *clinical* expert; coordinator is the *operational* contact)

---

## 3. Connective-tissue data set (specific values)

Demo day target: **2026-05-22 (Friday)**. All dates anchor to that day plus or minus reasonable offsets so nothing reads as stale.

### Maria's profile data (Settings screen + Welcome greeting)

| Field | Value |
|---|---|
| Name | Maria Rivera |
| Email | mrivera.demo@cena.health |
| Phone | (860) 555-0142 |
| Preferred language | Español (with EN toggle available) |
| Pronouns (if shown) | she/her |
| ZIP | 06106 (Hartford) |

### Care plan goals (replacing current 3 generic items)

Replace `DEMO_CARE_PLAN_GOALS` in `apps/patient/src/screens/care/index.tsx`. These are written at patient-facing 6th-grade reading level (matches existing copy register), in plain language, action-anchored:

**English:**
1. Eat meals that keep your blood sugar steady — your kitchen is sending five a week.
2. Move your body for 20 minutes most days — a walk counts.
3. Check in with your team once a week so we can adjust if something isn't working.

**Spanish:**
1. Comer comidas que mantengan su azúcar estable — su cocina le envía cinco por semana.
2. Mover su cuerpo 20 minutos casi todos los días — una caminata cuenta.
3. Hacer su revisión semanal para que su equipo pueda ajustar si algo no funciona.

Notes for clinical-care expert review:
- Goal 1 is the nutrition target wrapped in concrete delivery context. RDN-aligned.
- Goal 2 is a low-bar movement goal — appropriate for a sedentary 52F starting an intervention; not over-prescriptive.
- Goal 3 is the engagement contract. Closes the loop with the weekly check-in already in the app.
- These goals deliberately do NOT name HIV. The patient-facing copy assumes Maria knows her diagnosis; the app's role is to support behavior, not re-disclose status on every screen. (Clinical-care: flag if you disagree.)

### Appointments (replacing the May 8 stale date)

Replace `DEMO_APPOINTMENTS`:

| Field | Value (EN) | Value (ES) |
|---|---|---|
| Title | Nutrition check-in with Dr. Soto, RDN | Revisión nutricional con Dra. Soto, RDN |
| DateTime | Wed, May 27 · 10:00 AM | Mié, 27 de mayo · 10:00 AM |
| Method | Video visit | Visita por video |

May 27 is a Wednesday five days post-demo — comfortably in the future, plausible for a weekly cadence, and lines up with the Wednesday meal-confirmation deadline already shifting (see below).

### Recent deliveries (replacing Apr 23 / Apr 30)

| ID | Date (EN) | Date (ES) | Status |
|---|---|---|---|
| del-1 | Mon, May 18 | Lun, 18 de mayo | Delivered |
| del-2 | Mon, May 11 | Lun, 11 de mayo | Delivered |

Both in the past relative to demo day (May 22). Tells the "two cycles completed, third in flight" story that lines up with the week-3 enrollment narrative.

### Delivery status (Dashboard "On the way" card)

| Field | Value |
|---|---|
| Status | On the way |
| Timing | Arriving Monday, May 25, between 2pm and 4pm |
| Summary | 5 meals |

Monday May 25 is 3 days post-demo — keeps the "delivery in flight, confirmation just happened" loop alive. Same Monday referenced in meal-confirmation messaging.

### Meals — confirm-by deadline + delivery (replacing May 27 string-collision with the appointment)

Conflict-avoidance: the meal confirm-by deadline can't be the same day as the Dr. Soto appointment. Adjust meals copy:

| State | Banner copy (EN) | Banner copy (ES) |
|---|---|---|
| unconfirmed | Please confirm your meals by Friday, May 22 at 5pm. | Por favor confirme sus comidas antes del viernes 22 de mayo a las 5pm. |
| confirmed | Your meals are confirmed. Delivery on Monday, May 25. | Sus comidas están confirmadas. Entrega el lunes 25 de mayo. |
| auto-confirmed | Your meals were automatically confirmed. Delivery on Monday, May 25. | Sus comidas fueron confirmadas automáticamente. Entrega el lunes 25 de mayo. |

Demo-day-of (May 22) deadline at 5pm is a feature, not a bug: lets the demo audience watch the live confirm-CTA flow as if the patient is making the call *now*. If demo runs after 5pm, downgrade copy to "today by 5pm" → "today by midnight" or roll the date forward one cycle to May 29.

### Meals — meal selection (keep current 5 dishes; one tag-register change)

The 5 dishes (Chicken Verde, Lemon Salmon, Tofu Noodle Bowl, Beef Stir-fry, Turkey Chili) are fine. Cuisine bias slightly Latin-leaning — appropriate for Maria's stated preference. Two small adjustments:

- "Diabetic-friendly" tag stays — coherent with pre-diabetic clinical state, doesn't surface the HIV context unnecessarily
- Consider adding one "Heart-healthy" tag to the Chicken Verde card (currently only "Low sodium" + "Diabetic-friendly") to round out the ART-metabolic-syndrome framing

### Messages (Sarah K. thread + system notification)

Adjust dates to land near demo day:

| msg-id | Type | Sender | Body (EN) | Timestamp |
|---|---|---|---|---|
| msg-1 | human_message in | Sarah K., Care Coordinator | Your delivery is confirmed for Monday, May 25 between 2 and 4pm — let me know if that doesn't work for you. | 2026-05-20T10:15:00Z |
| msg-2 | human_message out | (Maria) | Monday is fine. Thank you! | 2026-05-20T10:22:00Z |
| notif-1 | notification | (system) | Your weekly check-in is ready. It takes about 2 minutes. | 2026-05-21T08:00:00Z |

May 20 message + May 21 notification frame the demo as "yesterday + this morning" — gives the most plausible "this is a live patient surface" feel.

### My Health trend metrics (mood, energy, meal satisfaction)

Current data shape is fine; refresh the "Updated N days ago" copy so it lands close to demo:

- Mood — Updated 1 day ago (matches the weekly check-in on May 21 / the GAD-7 prompt on dashboard)
- Energy — Updated 3 days ago
- Meal Satisfaction — Updated 1 day ago

Trend directions stay (Mood: improving, Energy: stable, Meal Satisfaction: improving). Matches the "stabilizing in week 3" engagement state.

### GAD-7 / PHQ-9 assessment intro screens

The GAD-7 already has clinically appropriate framing. For Maria:
- Dashboard "Today's check-in" → "Anxiety check-in" → routes to `/assessment/gad-7` (already wired)
- After completion, the prototype-score line `[prototype] score 5 of 21 — mild` is a known critical issue in the May 13 validation. Punch-list item #7 fixes it. Patient Ops view: score must not be patient-visible per clinical convention.

---

## 4. Vocabulary rules

The validation flagged "Care / Care team / Care coordinator" coexisting inconsistently. Settle on:

| Term | When to use | Examples |
|---|---|---|
| **your care team** | The primary noun in patient-facing copy. Describes the collective unit Maria interacts with (coordinator + RDN + clinic). Use anywhere we currently say "Care" generically. | "From your care team." (Messages subheader) · "Message your care team" (Meals footer) · "Your care team will review your answers." (Assessment Complete) |
| **your care coordinator** | Only when naming the *specific role* responsible for the operational/messaging relationship. Use when copy points the patient toward a single contact. | "Write to your coordinator…" (Messages composer placeholder — keep current Spanish "su coordinadora" form) · "To change anything, message your care coordinator." (Care screen footer — could read as "your care team" too; coordinator is more precise) |
| **Sarah K., Care Coordinator** | The role label that follows a named person. Title-case. | Messages sender label · Dashboard message preview |
| **Dr. Soto, RDN** | Clinical role label, named. Use "RDN" abbreviation in the label since the surrounding context is the nutrition check-in. Spell out "Registered Dietitian Nutritionist" only in About / Help screens (out of scope for demo). | Care screen Upcoming appointment |
| **Care** (one word, naked) | Use only as a screen *title* (page H1) and bottom-nav tab label. Anywhere it appears in copy as a noun, expand to "your care team" or "your care plan" or "your care coordinator" per context. | Care screen H1: "Care" (Spanish: "Cuidado") |
| **the kitchen** (or "your kitchen") | When referring to the meal-prep operation as an entity. Current copy uses this lightly; reinforce. | "your kitchen is sending five a week" (care plan goal 1) |

### Replacements to apply

- Care screen H1 stays "Care" / "Cuidado" (don't expand a screen title)
- Care screen subline: keep "Your plan, appointments, and deliveries." — these are concrete; no rewrite needed
- Care plan footer: "To change anything, **message your care coordinator**." → keep coordinator here (specific contact point)
- Care plan helper line ("Your care coordinator updates this plan with your team."): change to "**Your care team** updates this plan together." Subtle, but the coordinator doesn't unilaterally update the care plan — the RDN and clinician do.
- Messages screen subheader: "From your care team." — keep
- Messages composer placeholder: "Write to your coordinator…" — keep (composer points at specific contact)
- Bottom-nav tab: "Care" — keep (label)
- Dashboard message section heading: "Recent message" — keep (no team/coordinator collision)
- Assessment Complete: "Your care team will review your answers." — keep (collective unit reviews; correct)

### Spanish equivalents

- "your care team" → "su equipo de cuidado"
- "your care coordinator" → "su coordinadora" (current usage matches because Sarah is feminine; if coordinator changes to a male, switch to "su coordinador")
- "Dr. Soto, RDN" → "Dra. Soto, RDN" (feminine title for Soto if Soto is a woman — Vanessa confirms gender on staff-name finalization)

---

## Files to update (Aaron applies)

- `apps/patient/src/screens/care/index.tsx` — `DEMO_CARE_PLAN_GOALS`, `DEMO_APPOINTMENTS`, `DEMO_DELIVERIES`, footer copy
- `apps/patient/src/screens/meals/index.tsx` — `STATUS_COPY` (banner dates), `SUBTITLE_COPY`, optionally Chicken Verde tag set
- `apps/patient/src/screens/messages/index.tsx` — `DEMO_MESSAGES` (3 timestamps + body of msg-1)
- `apps/patient/src/screens/dashboard/index.tsx` — `DEMO_MESSAGE.preview` (match msg-1 body), delivery card timing copy
- `apps/patient/src/screens/health/index.tsx` — `DEMO_METRICS[*].lastUpdated`
- `apps/patient/src/screens/settings/index.tsx` — Maria's profile field values

---

## Open items for other experts

Flag these for clinical-care, nutrition, and brand-fidelity review before lock:

- **[clinical-care]** Care plan goals — are they clinically defensible for a 52F PLWH-with-metabolic-syndrome patient at week 3? Goal 2 (movement) is the most likely pushback; could be downgraded to "Move when you can — even a short walk helps" if 20m feels prescriptive.
- **[clinical-care]** Patient name on care plan goals omits HIV explicitly — is this the right pitch for a Dieckhaus demo, or does the demo audience need the connection made more visible?
- **[nutrition]** Meal tagging coherence — does "Diabetic-friendly" + "Low sodium" + one "Heart-healthy" read as on-thesis for ART-metabolic-syndrome, or should we add "Mediterranean" or "DASH-aligned" tags? Existing variant set may already accommodate.
- **[nutrition]** Are the 5 dishes (Chicken Verde, Lemon Salmon, Tofu Noodle Bowl, Beef Stir-fry, Turkey Chili) reasonable for the population — particularly the Latin-leaning bias matching Maria's stated preference?
- **[brand-fidelity]** "Your care team updates this plan together" — does this read in Cena voice, or is "your care team" too institutional? Alternative: "Sarah and your team update this plan together" (warmer, but couples the relationship to a single named person).
- **[Vanessa-direct]** Staff name confirmation per the open Sub-investigator listing prep item. Specifically: does "Sarah Kim, RN, BSN" align with actual Cena hires, or should the coordinator be one of the already-mentioned-internally names? Same question for Dr. Soto, RDN.
