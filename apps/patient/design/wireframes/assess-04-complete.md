# ASSESS-04: Assessment Complete

**Application:** Patient App (Mobile)
**Use Case(s):** PT-ASSESS-001, PT-ASSESS-002
**User Type:** Patient
**Device:** Mobile-first
**Route:** `/apps/patient/health/assessment.html?id=[assessmentId]` (same page, JS-driven final state)

## Page Purpose

Confirm the patient's assessment was submitted successfully. Provide a warm acknowledgment. Offer clear next steps — return to the Health hub or start a follow-up assessment if one was queued. The patient should feel heard, not dismissed.

---

## Layout Structure

### Shell
- `mobile-shell` with `mobile-app` body class
- `mobile-i18n-bar` fixed at top
- **No bottom nav** — still in focused flow

### Header Zone
- No back button (submission is final)
- No progress indicator (complete)

### Content Zone
- Vertically centered content: `<div class="px-6 py-12 flex flex-col items-center text-center">`

#### Confirmation Icon
- `fa-circle-check` in `text-success-500`, large (text-4xl / ~36px)
- `aria-hidden="true"`

#### Confirmation Heading
- `<h1 class="text-xl font-display font-semibold mt-4">` — "Thank you" / "Gracias"

#### Confirmation Message
- `<p class="text-sm text-sand-500 mt-2 max-w-xs">` — varies by assessment category:
  - Behavioral: "Your care team will review your answers." / "Su equipo de atención revisará sus respuestas."
  - SDOH: "We'll connect you with support if needed." / "Le conectaremos con apoyo si es necesario."
  - Dietary: "This helps us plan better meals for you." / "Esto nos ayuda a planificar mejores comidas para usted."
  - Check-in (generic): "Your response has been recorded." / "Su respuesta ha sido registrada."

#### Follow-Up Prompt (Conditional)
- Shown only when the completed assessment triggered a follow-up (e.g., PHQ-2 score ≥3 → PHQ-9 queued)
- `<div class="card mx-4 mt-6 bg-teal-50 border-teal-200">`
  - `.card-body` — icon `fa-clipboard-list text-teal-500` + text:
  - "Your care team has one more check-in for you." / "Su equipo de atención tiene otra evaluación para usted."
  - `.btn-primary btn-sm mt-3` — "Continue" / "Continuar"
  - Tapping "Continue" navigates to assess-02 (Intro) for the follow-up assessment

#### Reassurance Message (Conditional — Flagged Response)
- Shown only when a response crossed a critical threshold and was flagged to the care team
- `<div class="card mx-4 mt-4 bg-teal-50 border-teal-200">`
  - `.card-body` — icon `fa-hand-holding-heart text-teal-500` + text:
  - "Based on your answers, your care team will follow up with you." / "Según sus respuestas, su equipo de atención se comunicará con usted." [REVISED: "will" not "may" — reduces uncertainty/anxiety]
  - Tone: warm, not alarming. No clinical language. No mention of "flags" or "alerts."

### Footer Zone
- `<div class="px-6 pb-8 mt-auto">`
- If no follow-up: `.btn-primary` full width — "Done" / "Listo" → navigate to Health hub
- If follow-up is queued: `.btn-outline` full width — "Done for now" / "Listo por ahora" → navigate to Health hub (follow-up card is the primary CTA above)
- Below button: `<a class="text-link text-sm text-sand-400 mt-3">` — "View my progress" / "Ver mi progreso" → navigate to Health hub, scrolled to trends section

---

## Interaction Specifications

### Tap "Done" / "Done for now"
- **Trigger:** Tap button
- **Feedback:** Navigate immediately
- **Navigation:** Health hub (`health/index.html`). The just-completed assessment no longer appears in the pending section. Trend data updates.
- **Error handling:** N/A

### Tap "Continue" (Follow-Up)
- **Trigger:** Tap primary button on follow-up card
- **Feedback:** Button loading state briefly
- **Navigation:** assess-02 (Intro) for the follow-up assessment (`assessment.html?id=[followUpId]`)
- **Error handling:** N/A

### Tap "View my progress"
- **Trigger:** Tap link
- **Feedback:** Navigate
- **Navigation:** Health hub, scrolled to the trends section (anchor link or JS scroll)
- **Error handling:** N/A

---

## States

### Standard Completion
Default state described above. Confirmation icon, message, Done button.

### Completion with Follow-Up Queued
Follow-up card shown. "Continue" is the primary visual action. "Done for now" is secondary (outline button).

### Completion with Flagged Response
Reassurance card shown. Does NOT replace the follow-up card — both can appear if applicable (reassurance below follow-up).

### PRAPARE Section Completion
For multi-section assessments (PRAPARE domains), completing one section shows:
- Heading: "Section complete" / "Sección completada"
- Message: "You've finished the housing questions. Ready for the next section?" / "Ha terminado las preguntas sobre vivienda. ¿Listo para la siguiente sección?"
- `.btn-primary` — "Next section" / "Siguiente sección"
- `.btn-outline` — "Take a break" / "Tomar un descanso" → saves progress, returns to Health hub

### Empty State
N/A — this screen only appears after a successful submission.

### Loading State
N/A — content is locally generated, no data fetch.

### Error State
N/A — submission error is handled on assess-03 before reaching this screen.

---

## Accessibility Notes
- Confirmation icon has `aria-hidden="true"` — the heading communicates success
- Screen reader focus lands on `<h1>` on load
- Follow-up card is a clear, labeled action — not just a vague prompt
- Reassurance card uses calm, specific language — no ambiguity about what happens next

## Bilingual Considerations
- All confirmation messages, button labels, and follow-up text need EN/ES
- "Thank you" / "Gracias" — short, clean
- "Done" / "Listo" — compact
- "Done for now" / "Listo por ahora" — slightly longer, fits in full-width button
- Reassurance and follow-up messages are longer in Spanish; `max-w-xs` on the card body text should accommodate

## Open Questions
- Should the completion screen show a brief summary of what the patient answered (e.g., "You rated your mood as Good"), or is the confirmation alone sufficient? Summary adds transparency but also length.
