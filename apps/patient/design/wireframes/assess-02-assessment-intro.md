# ASSESS-02: Assessment Intro

**Application:** Patient App (Mobile)
**Use Case(s):** PT-ASSESS-001
**User Type:** Patient
**Device:** Mobile-first
**Route:** `/apps/patient/health/assessment.html?id=[assessmentId]`

## Page Purpose

Prepare the patient for an assessment before they start answering. Explains what it is, why it matters, and how long it takes. Reduces anxiety and increases completion by setting expectations. The patient should feel informed and in control — they can start now or come back later.

Quick check-ins (1–5 questions, `?mode=checkin`) skip this screen entirely and go straight to the first question.

---

## Layout Structure

### Shell
- `mobile-shell` with `mobile-app` body class
- `mobile-i18n-bar` fixed at top
- **No bottom nav** — this is a focused flow. Patient is in assessment mode.

### Header Zone
- Back button: `<button class="btn-icon">` with `fa-chevron-left` — returns to Health hub
- No page title in the header (title is in the content zone)

### Content Zone
- Vertically centered content block: `<div class="px-6 py-8 flex flex-col items-center text-center">`

#### Category Icon
- Large icon in a colored circle: `<div class="avatar avatar-xl [category-color] mb-4">`
  - Behavioral: `fa-brain` in `avatar-primary`
  - SDOH: `fa-people-group` in `avatar-secondary`
  - Dietary: `fa-utensils` in `avatar-neutral`
- Icon is decorative — `aria-hidden="true"`

#### Assessment Title
- `<h1 class="text-xl font-display font-semibold">` — e.g., "How have you been feeling?" / "¿Cómo se ha sentido?"
- Title comes from the assessment definition file's `title` / `title_es` field

#### Assessment Description
- `<p class="text-sm text-sand-500 mt-2 max-w-xs">` — e.g., "Two quick questions about your mood over the past two weeks. Your answers help your care team support you." / "Dos preguntas rápidas sobre su estado de ánimo en las últimas dos semanas. Sus respuestas ayudan a su equipo de atención a apoyarle."

#### Estimated Time
- `<p class="text-xs text-sand-400 mt-3">` with `fa-clock text-sand-300` icon
- "About 2 minutes" / "Aproximadamente 2 minutos"

#### Section Context (for PRAPARE domain sections)
- Only shown for multi-section assessments
- `<p class="text-xs text-sand-400 mt-1">` — "Section 1 of 5: Housing" / "Sección 1 de 5: Vivienda"

### Footer Zone
- `<div class="px-6 pb-8 mt-auto">`
- `.btn-primary` full width — "Start" / "Comenzar"
- Below button: `<p class="text-xs text-sand-400 text-center mt-3">` — "Your answers are private and shared only with your care team." / "Sus respuestas son privadas y se comparten solo con su equipo de atención."

---

## Interaction Specifications

### Tap "Start"
- **Trigger:** Tap primary button
- **Feedback:** Button loading state (`btn-loading`)
- **Navigation:** Transition to assess-03 (first question). For the prototype, this is a JS state change on the same page — swap the intro content for the question content.
- **Error handling:** If assessment data fails to load, show `.alert alert-error` replacing the content zone: "We couldn't load this check-in. Please try again." / "No pudimos cargar esta evaluación. Inténtelo de nuevo." with `.btn-outline` "Try again".

### Tap Back
- **Trigger:** Tap back button (`fa-chevron-left`)
- **Feedback:** Navigate back
- **Navigation:** Return to Health hub (`health/index.html`). If arrived via notification deep-link, go to Health hub (not browser back).
- **Error handling:** N/A

---

## States

### Resume State
When the patient has partially completed this assessment previously:
- Title and description shown as normal
- Additional line below estimated time: `<p class="text-xs text-teal-600">` with `fa-rotate-right` — "You're partway through — pick up where you left off." / "Está a medio camino — continúe donde lo dejó."
- Button label changes: "Continue" / "Continuar" (instead of "Start")

### Already Completed State
When the patient has already completed this assessment for the current period:
- Content zone shows:
  - `fa-circle-check text-success-500` large icon
  - "You already completed this" / "Ya completó esto"
  - `<p class="text-sm text-sand-500">` — "Submitted on [date]" / "Enviado el [fecha]"
  - `.btn-outline` — "View my progress" / "Ver mi progreso" → navigates to Health hub

### Loading State
- Spinner centered in content zone (`spinner-container-vertical`)
- `spinner-label` — "Loading..." / "Cargando..."

### Error State
- `.alert alert-error` centered in content zone
- Message: "We couldn't load this check-in. Please try again." / "No pudimos cargar esta evaluación. Inténtelo de nuevo."
- `.btn-outline` — "Try again" / "Intentar de nuevo"

---

## Accessibility Notes
- Back button: `aria-label="Go back"` / `aria-label="Volver"`
- Large icon is `aria-hidden="true"`
- Focus lands on the page title (`<h1>`) on load for screen readers
- Start/Continue button is the primary action — large touch target, full width
- Privacy message is read by screen readers as part of the natural flow

## Bilingual Considerations
- All text from assessment definition files has EN/ES fields
- "About 2 minutes" → "Aproximadamente 2 minutos" — slightly longer, fits within `max-w-xs`
- "Start" / "Comenzar" — similar button width
- "Continue" / "Continuar" — similar button width
- PRAPARE section labels need translation in the assessment definition files

## Open Questions
- For PRAPARE domain sections, should the intro show a brief description of what this section covers (e.g., "Questions about your housing situation"), or is the section title sufficient?
