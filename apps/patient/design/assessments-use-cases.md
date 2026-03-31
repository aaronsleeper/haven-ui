# Patient Assessments & Self-Report — Use Cases, Functional Spec, IA

**Date:** 2026-03-31
**Skill:** ux-architect (Phases 1–3)
**Persona:** Patient
**Status:** Gate 1 approved (2026-03-31) — ready for wireframing

---

## Phase 1: Discovery

### Personas Involved

**Primary: Patient**
Chronic conditions, variable tech literacy, elderly population, mobile-first, bilingual (EN/ES). Needs simplicity, warmth, clear next actions. Low health literacy (5th grade reading level target).

**Secondary: Dietitian / RDN**
Consumes self-report data to adjust meal plans and flag concerns. Needs structured, actionable data — not free-text dumps.

**Secondary: Care Coordinator**
Monitors assessment completion rates. Routes escalations when self-report flags a concern.

**Future: Referring Provider / Health System Admin**
Consumes aggregated outcomes data. Not a direct user of the patient-facing screens.

### User Goals

| Persona | Goal |
|---------|------|
| Patient | Complete a health check-in quickly without confusion, on my phone, in my language |
| Patient | See that my answers are being used — my care team responds to what I report |
| Patient | View my own health trends over time (feeling of progress) |
| Dietitian | See structured patient-reported data alongside meal plan context |
| Care Coordinator | Know which patients haven't completed assessments; see flagged responses |

### Use Cases

#### PT-ASSESS-001: Complete a Prompted Assessment

**Precondition:** Care team has assigned an assessment to the patient. Patient receives a push notification or sees an in-app prompt.

**Trigger:** Patient taps notification or sees assessment card on dashboard.

**Flow:**
1. Patient sees assessment intro — what it's about, how long it takes, why it matters.
2. Patient answers questions one at a time (single-question-per-screen pattern for mobile).
3. Progress indicator shows how far along they are.
4. Patient can go back to change a previous answer.
5. Patient submits at the end.
6. Confirmation screen with a warm thank-you message.
7. If any answer triggers a flag (e.g., food insecurity, safety concern), system routes alert to care coordinator — patient sees reassuring message, not a clinical warning.

**Outcome:** Assessment response stored. Care team notified. Patient feels heard.

**Edge cases:**
- Patient abandons mid-assessment → progress saved, resume prompt shown next visit
- Patient has already completed this assessment this period → show "already submitted" state
- Assessment is overdue → visual nudge on dashboard, not a penalty

#### PT-ASSESS-002: Quick Daily/Weekly Self-Report (Check-In)

**Precondition:** Patient is enrolled in a check-in cadence.

**Trigger:** Recurring prompt — push notification, dashboard card, care team message, or system-detected event (e.g., missed meal delivery, adverse trend detected).

**Cadence rules:**
- Smart defaults per assessment type (e.g., weekly for mood, per-delivery for meal satisfaction).
- Cadence is adjustable by coordinators per patient.
- Coordinators and system events can manually trigger an ad-hoc check-in at any time.
- System-detected triggers: missed delivery, flagged response on a previous assessment, wearable anomaly (future), AVA call flag.

**Flow:**
1. Patient sees 1–5 question micro-survey (emoji scale, slider, or single-tap options).
2. One question per screen, large tap targets.
3. Optional free-text "anything else?" at the end.
4. Submit → instant confirmation.

**Outcome:** Data point logged. Trend line updated. Anomalies flagged to care team.

**Design principle:** Under 60 seconds to complete. ePRO research shows 90%+ completion when assessments are ≤5 questions. Completion drops below 60% at 20+ questions done frequently.

#### PT-ASSESS-003: View My Health Trends

**Precondition:** Patient has submitted at least 2 data points for a tracked metric.

**Trigger:** Patient navigates to a "My Health" or "Progress" section.

**Flow:**
1. Patient sees simple trend visualizations — line charts or stat cards showing direction (improving, stable, needs attention).
2. Each metric has a plain-language label and a one-sentence explanation.
3. Tapping a metric shows recent history with context (e.g., "You reported feeling good 4 out of 5 days this week").
4. No raw clinical numbers exposed — translate everything to patient-friendly language.

**Outcome:** Patient feels informed and motivated.

**Scope note:** Trends are required for v1. The design challenge is presenting trends for both multi-question scored assessments (e.g., PHQ-9 total score over time) and individual measurements (e.g., daily mood rating). Any data type the system collects should be viewable over time — this serves both human users and AI agents surfacing patterns.

#### PT-ASSESS-004: Wearable Data Sync (Future Phase)

**Precondition:** Patient has connected a wearable device (Fitbit, Apple Watch, etc.).

**Trigger:** Automatic — data syncs in background. Patient views on demand.

**Flow:**
1. Patient connects device via a guided setup flow (OAuth or Health Connect API).
2. Wearable data (steps, heart rate, sleep, weight) appears alongside self-reported data in the trends view.
3. Patient controls what data is shared — granular toggles per data type.
4. Passive data supplements active self-report; it does not replace it.

**Outcome:** Richer health picture for care team. Lower patient burden for trackable metrics.

**Technical note:** Android apps must use Health Connect (Google Fit APIs deprecated June 2025). iOS uses HealthKit. Both require explicit user permission per data type.

**Scope note:** This use case is deferred to a future phase. The IA and screen structure should accommodate it, but wireframes and build tasks will not cover wearable integration in the first pass.

### Constraints & Considerations

| Constraint | Impact |
|------------|--------|
| Health literacy (5th grade) | All question text, labels, and feedback in plain language. No clinical jargon. |
| Bilingual (EN/ES) | All assessment content must use `data-i18n-en` / `data-i18n-es` pattern. Assessment questions themselves need translation. |
| HIPAA | Self-reported health data is PHI. No data in URL params. No localStorage for health responses. |
| Mobile-first | Single-question-per-screen for assessments. Large tap targets (44px+). Thumb-zone-friendly. |
| Variable connectivity | Save progress locally, sync when online. Graceful offline state. |
| Trust | Explain why each assessment is being asked. Show that data goes to "your care team," not a faceless system. |
| Completion rates | Keep assessments short (≤5 questions for recurring, ≤15 for periodic). Progress indicator always visible. |
| WCAG AA | High contrast, screen reader support, touch targets, focus management between questions. |

### Research Findings

**ePRO completion rates** (Springer, Frontiers in Digital Health): Electronic patient-reported outcome systems achieve 80–90%+ compliance when questionnaires are short and mobile-optimized. Length is the primary driver of drop-off — 5-question daily check-ins maintain 90%+ completion vs. <60% for 20-question surveys done twice daily.

**One-tap answer patterns** (Citrus Labs, ObvioHealth): Best-performing ePRO designs use single-tap responses — emoji scales, visual analog scales, and large touch targets. "Hot flash buttons" and pain-level taps outperform typed responses on mobile.

**NNG survey design** (nngroup.com): Keep surveys short. Mark optional vs. required. Avoid jargon. Treat questionnaires as a UI to be user-tested, not a form to be filled.

**Healthcare gamification** (KoruUX, Diversido): Chronic care apps are adopting progress bars, badges, and daily streaks from fitness/education platforms to maintain engagement. Effective when tied to intrinsic motivation (health progress), counterproductive when they feel like compliance tracking.

**Wearable ecosystem** (Star Global, Medium/AddWeb): Multi-device design requires unified visual language between phone and wearable data. Health Connect (Android) replaces Google Fit. Users need granular control over what biometric data is shared. Data visualization must be understandable by both patients and providers.

---

## Phase 2: Functional Specification

### Functions

| Function | Use Case | Description |
|----------|----------|-------------|
| Display assessment prompt | PT-ASSESS-001, 002 | Show assessment card on dashboard or via notification deep-link |
| Render question | PT-ASSESS-001, 002 | Display a single question with response options (radio, emoji scale, slider, free text) |
| Navigate questions | PT-ASSESS-001 | Back/next between questions with progress indicator |
| Save partial progress | PT-ASSESS-001 | Persist answers as patient moves through questions |
| Submit assessment | PT-ASSESS-001, 002 | Validate and send completed responses |
| Show completion confirmation | PT-ASSESS-001, 002 | Thank-you screen with optional next action |
| Flag critical responses | PT-ASSESS-001, 002 | Route alert to care team when answer crosses threshold |
| Display trends | PT-ASSESS-003 | Render patient-friendly visualizations of tracked metrics |
| Display streak/progress | PT-ASSESS-003 | Show completion history and engagement indicators |
| Connect wearable (future) | PT-ASSESS-004 | OAuth/Health Connect setup flow |
| Display wearable data (future) | PT-ASSESS-004 | Merge passive data into trends view |

### Data Model (Patient-Facing)

| Field | Type | Source | Read/Write | Required | Notes |
|-------|------|--------|------------|----------|-------|
| `assessmentId` | string | System | Read | Yes | Unique identifier |
| `assessmentTitle` | string | Care team config | Read | Yes | Plain-language name |
| `assessmentDescription` | string | Care team config | Read | No | Why this matters |
| `questions[]` | array | Care team config | Read | Yes | Ordered list |
| `questions[].id` | string | System | Read | Yes | |
| `questions[].text` | string | Care team config | Read | Yes | EN/ES |
| `questions[].type` | enum | Care team config | Read | Yes | `emoji-scale`, `radio`, `slider`, `free-text`, `yes-no` |
| `questions[].options[]` | array | Care team config | Read | Conditional | For radio/emoji types |
| `questions[].required` | boolean | Care team config | Read | Yes | |
| `responses[].questionId` | string | Patient | Write | Yes | |
| `responses[].value` | string/number | Patient | Write | Yes | |
| `responses[].timestamp` | datetime | System | Write | Yes | |
| `completedAt` | datetime | System | Write | No | Null if incomplete |
| `status` | enum | System | Read | Yes | `pending`, `in-progress`, `completed`, `overdue` |
| `dueDate` | date | Care team config | Read | No | |
| `estimatedMinutes` | number | Care team config | Read | No | "About 2 minutes" |

### State Transitions

```
pending → in-progress → completed
pending → overdue → in-progress → completed
in-progress → (abandoned, resume later) → in-progress → completed
```

### Business Rules

- Assessments are assigned by the care team, not self-initiated by patients.
- A patient can only have one active instance of a given assessment type per period.
- Quick check-ins (PT-ASSESS-002) bypass the intro screen — go straight to the first question.
- Free-text responses are optional unless the care team marks them required.
- Critical response thresholds are defined by the care team, not hardcoded in the UI.
- Trend data requires ≥2 data points before displaying a chart; show an encouraging message before that ("Keep logging — your trends will appear here soon").

### Validation

- Required questions must be answered before advancing.
- Slider values must be within configured min/max.
- Free-text limited to 500 characters.
- No double-submit — disable button after first tap, show loading state.

---

## Phase 3: Information Architecture

### Screen Inventory

| Screen | Purpose | Primary Actions | Entry Point |
|--------|---------|-----------------|-------------|
| **Assessment Intro** | Explain what this assessment is, estimated time, why it matters | "Start" | Dashboard card, notification, care team message |
| **Assessment Question** | Display one question at a time with response controls | Answer + Next / Back | Sequential from intro |
| **Assessment Complete** | Confirmation + optional next action | "Done" / "View my progress" | After last question |
| **Check-In** (micro) | 1–5 question quick survey, minimal chrome | Answer + Submit | Dashboard card, notification |
| **My Health / Progress** | Trend visualizations, completion streaks, metric history | Browse metrics, tap for detail | Bottom nav or dashboard card |
| **Metric Detail** | Expanded view of one tracked metric with history | Scroll, review | Tap from My Health |
| **Wearable Setup** (future) | Guided device connection | Connect, grant permissions | Settings / My Health |

### Navigation Placement

The patient app currently has 4 bottom nav tabs: **Meals**, **Delivery**, **Care Team**, **Profile**.

**Option A — New tab:** Add a "Health" or "My Health" tab (5th tab). Assessments and trends live here. Dashboard card links to pending assessments.

**Option B — Nested under Care Team:** Assessments are care-team-initiated, so they could live as a sub-section of Care Team alongside Messages and Feedback. Trends could go under Profile.

**Recommendation: Option A.** Assessments and self-report are a distinct activity — they're about the patient's health status, not communication with the care team. A dedicated tab gives the feature room to grow (wearables, more assessment types) without overloading Care Team. Five bottom nav tabs is the iOS/Android standard maximum.

**Proposed bottom nav:** Meals | Delivery | Health | Care Team | Profile

### Screen-to-Screen Flows

```
Dashboard (home)
  ├─ Assessment prompt card → Assessment Intro → Questions → Complete
  ├─ Check-in prompt card → Check-In (micro) → Complete
  └─ "View my health" → My Health

Bottom Nav: Health tab
  └─ My Health (trends overview)
       ├─ Pending assessment card → Assessment Intro → ...
       ├─ Metric card → Metric Detail
       └─ (future) Wearable data section → Wearable Setup

Notification deep-link → Assessment Intro or Check-In directly
```

### Content Priority per Screen

**Assessment Intro:** Assessment name > estimated time > why it matters > Start button
**Question Screen:** Question text > response options > progress bar > back/next
**Check-In:** Question > response options > submit (minimal chrome, maximum speed)
**My Health:** Pending assessments (action items first) > trend cards > completion streak
**Metric Detail:** Current value + trend direction > chart > recent history list

### Potential Component Gaps

| Need | Existing Component | Gap? |
|------|-------------------|------|
| Assessment prompt card (dashboard) | `card` + `badge` | Minor — compose from existing |
| Emoji/icon scale input | None | **New component needed** — row of tappable emoji/icon options with `:has(input:checked)` pattern (similar to `feedback-rating-card`) |
| Slider input | None | **New component needed** — styled range input with labels |
| Progress stepper (questions) | `onb-progress` | May be reusable; evaluate during wireframing |
| Trend chart (line) | `chart-line` container exists | Need patient-friendly Chart.js config |
| Streak/completion indicator | `progress-bar` exists | May compose from existing; evaluate |
| Metric summary card | `card-stat` | Likely reusable with trend badge |

---

## Gate 1 Decisions (2026-03-31)

### Assessment Library — Standard Assessments

All standard behavioral, SDOH, and dietary assessments are required. The system must support the following from day one:

**Behavioral Health**

| Assessment | Questions | Scoring | Cadence (default) | Escalation |
|------------|-----------|---------|-------------------|------------|
| PHQ-2 (depression screen) | 2 | 0–6, flag ≥3 → administer PHQ-9 | Quarterly or coordinator-triggered | Auto-route to care team |
| PHQ-9 (depression severity) | 9 | 0–27, severity bands | Triggered by PHQ-2 flag, then monthly if elevated | Score ≥15 → urgent flag |
| GAD-2 (anxiety screen) | 2 | 0–6, flag ≥3 → administer GAD-7 | Quarterly | Auto-route |
| GAD-7 (anxiety severity) | 7 | 0–21, severity bands | Triggered by GAD-2 flag | Score ≥15 → urgent flag |
| PHQ-4 (ultra-brief combined) | 4 | PHQ-2 + GAD-2 combined | Alternative to separate PHQ-2/GAD-2 | Per component thresholds |
| AUDIT-C (alcohol use) | 3 | 0–12, flag ≥4 men / ≥3 women | Annual or intake | Auto-route |

**Social Determinants of Health (SDOH)**

| Assessment | Questions | Focus | Cadence (default) | Notes |
|------------|-----------|-------|-------------------|-------|
| Hunger Vital Sign | 2 | Food insecurity | Quarterly | CMS-recommended, validated 2-item screen |
| PRAPARE (core) | 15 | Housing, food, transportation, safety, stress, social isolation | Intake + annual | Can be administered in sections |
| AHC HRSN (Accountable Health Communities) | 10 core | Housing instability, food insecurity, transportation, utility needs, interpersonal safety | Intake + annual | CMS standard for Medicaid populations |

**Dietary / Nutrition**

| Assessment | Questions | Focus | Cadence (default) | Notes |
|------------|-----------|-------|-------------------|-------|
| MNA-SF (Mini Nutritional Assessment - Short Form) | 6 | Malnutrition risk in elderly | Intake + quarterly | Validated for age 65+, sensitivity 89% |
| Meal satisfaction check-in | 1–3 | How were your meals this week? | Per delivery | Extends existing feedback flow |
| Dietary adherence self-report | 3–5 | Following dietary recommendations? | Weekly | Custom, configurable per patient |

**Quick Check-Ins (Micro-Assessments)**

| Check-In | Questions | Type | Default Cadence |
|----------|-----------|------|-----------------|
| Mood check | 1 | Emoji scale (5-point) | Weekly |
| Symptom check | 2–3 | Radio + optional free-text | Weekly |
| Meal satisfaction | 1–3 | Emoji + optional free-text | Per delivery |
| General wellness | 1 | "How are you feeling today?" emoji | Daily (if enrolled) |

### Assessment Definition Framework

**Decision:** Assessments defined as markdown files with YAML frontmatter in `src/data/patient/assessments/`. A single generic question-stepper component renders any assessment at runtime.

**Why:** 10+ standard assessments would be more total work to hardcode individually. A data-driven renderer means adding a new assessment is a file, not a feature. The markdown format is human-readable, version-controllable, and maps cleanly to FHIR Questionnaire for production.

**Example format:**

```yaml
---
id: phq-2
title: "How have you been feeling?"
title_es: "¿Cómo se ha sentido?"
description: "Two quick questions about your mood over the past two weeks."
description_es: "Dos preguntas rápidas sobre su estado de ánimo en las últimas dos semanas."
category: behavioral
estimated_minutes: 1
scoring:
  method: sum
  ranges:
    - { min: 0, max: 2, label: "Low risk", action: none }
    - { min: 3, max: 6, label: "Elevated", action: escalate, follow_up: phq-9 }
---

## q1
type: radio
text: "Over the past 2 weeks, how often have you had little interest or pleasure in doing things?"
text_es: "En las últimas 2 semanas, ¿con qué frecuencia ha tenido poco interés o placer en hacer cosas?"
options:
  - { value: 0, label: "Not at all", label_es: "Nunca" }
  - { value: 1, label: "Several days", label_es: "Varios días" }
  - { value: 2, label: "More than half the days", label_es: "Más de la mitad de los días" }
  - { value: 3, label: "Nearly every day", label_es: "Casi todos los días" }

## q2
type: radio
text: "Over the past 2 weeks, how often have you felt down, depressed, or hopeless?"
text_es: "En las últimas 2 semanas, ¿con qué frecuencia se ha sentido desanimado/a, deprimido/a, o sin esperanza?"
options:
  - { value: 0, label: "Not at all", label_es: "Nunca" }
  - { value: 1, label: "Several days", label_es: "Varios días" }
  - { value: 2, label: "More than half the days", label_es: "Más de la mitad de los días" }
  - { value: 3, label: "Nearly every day", label_es: "Casi todos los días" }
```

**Migration path:** This format maps directly to FHIR Questionnaire fields. When Andrey builds the backend, each markdown file becomes a Questionnaire resource. The patient-facing renderer stays the same — it just reads from an API instead of a file.

**Complexity note:** The renderer is moderately complex — it needs to handle 5 question types (radio, emoji-scale, slider, yes-no, free-text), progress tracking, conditional follow-up (PHQ-2 → PHQ-9), and scoring. This is a meaningful build task, but it's a one-time investment that makes every subsequent assessment free.

### Check-In Cadence

**Decision:** Smart defaults per assessment type + coordinator-adjustable + manually triggerable.

**Trigger sources:**
- Scheduled (cadence-based, per assessment type defaults above)
- Coordinator-initiated (manual push for a specific patient)
- System-detected events (missed delivery, flagged response, wearable anomaly, AVA call flag)

### Navigation

**Decision:** New "Health" bottom nav tab confirmed.

**Bottom nav order:** Meals | Delivery | Health | Care Team | Profile

### Trends

**Decision:** Required for v1. Design challenge acknowledged — may scope the build for a later pass, but the design and data model must support it from the start.

**Two trend types to support:**

1. **Scored assessments** (PHQ-9, GAD-7, MNA-SF, etc.) — total score plotted over time as a line chart. Severity bands shown as colored zones behind the line (e.g., green/yellow/red). Patient sees plain-language labels ("Mild", "Moderate") rather than numbers.

2. **Individual measurements** (mood, meal satisfaction, symptom severity, weight, steps) — individual data points over time. Emoji-scale responses map to a numeric axis but display as their emoji/icon. Stat cards show current value + trend direction (improving/stable/declining).

**Design principle:** Any data type the system collects should be viewable as a trend. This serves both patients (progress visibility) and AI agents (pattern detection for care team alerts).

### Wearables

**Decision:** Disabled "Connect a device" card in the Health tab. Placeholder only for v1.

**Roadmap items (added to haven-ui roadmap):**
- Wearable setup flow (OAuth / Health Connect / HealthKit)
- Granular data-sharing permission toggles
- Passive data merged into trends view
- Android Health Connect integration (required — Google Fit deprecated)
- iOS HealthKit integration

### Gamification

**Decision:** Skip for v1. Leave in roadmap as a design exploration after core assessment functionality ships.

**Roadmap note:** Explore completion streaks, progress badges, and engagement indicators after v1. Consider tone carefully for elderly population — motivation vs. patronizing.

---

## Remaining Open Questions

1. **PHQ-2 → PHQ-9 conditional flow:** When PHQ-2 scores ≥3, should the patient immediately see PHQ-9 in the same session, or should the system schedule it as a separate follow-up assessment? Immediate is better clinically but longer for the patient.

2. **PRAPARE sectioning:** The full PRAPARE is 15 questions across 5 domains. Should it be administered as one assessment or broken into domain-specific sections that can be completed across multiple sessions?

3. **Trend time ranges:** What default time window for trend charts? 30 days, 90 days, 6 months? Should the patient be able to toggle between ranges?
