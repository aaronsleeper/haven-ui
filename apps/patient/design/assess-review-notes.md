# UX Review: Patient Assessments & Self-Report

**Date:** 2026-03-31
**Mode:** Pre-build
**Inputs:** `wireframes/assess-01-my-health.md` through `assess-05-metric-detail.md`, `assess-screen-flow.md`, `assessments-use-cases.md`
**Research consulted:** NNG wizard design patterns, NNG survey best practices, NNG healthcare customer journeys, W3C WCAG 2.1 touch target guidance, ePRO completion rate research

---

## Summary

The wireframes are well-structured and cover all use cases. The single-question-per-screen pattern is the right call for this population. Three issues warrant attention: (1) the quick check-in flow needs a clearer distinction from full assessments to maintain the "under 60 seconds" promise, (2) the trend chart for scored assessments needs careful handling of clinical severity bands to avoid alarming patients, and (3) the bottom nav expansion to 5 tabs needs to specify icon and label for the new Health tab. No structural changes needed.

---

## Screen: ASSESS-01 My Health (Hub)

### Improvements
- The "To do" section label is functional but clinical. For a patient app with a warm tone, "Your check-ins" / "Sus evaluaciones" feels more personal without being less clear.
- Wearable placeholder card should include a brief explanation of what connecting a device would do, not just "Coming soon." Patients who don't own wearables won't understand the card. Proposed: "Track steps, sleep, and more from your health device." / "Rastree pasos, sueño y más desde su dispositivo de salud." below the main text.
- Trend cards should show the date of the most recent data point (e.g., "Last: Mar 28") so patients know whether the trend is current without tapping into the detail view.

### Copy [REVISED]
- Page title: "My Health" / "Mi Salud"
- Page subtitle: "Your check-ins and progress" / "Sus evaluaciones y progreso"
- Section 1 label: "Your check-ins" / "Sus evaluaciones"
- Overdue badge: "Overdue" / "Atrasado"
- Estimated time: "About [N] min" / "Aprox. [N] min"
- Section 2 label: "Your progress" / "Su progreso"
- Empty state heading: "Your health hub" / "Su centro de salud"
- Empty state message: "When your care team assigns check-ins, they'll show up here. You'll also see your health progress over time." / "Cuando su equipo de atención le asigne evaluaciones, aparecerán aquí. También verá su progreso de salud con el tiempo."
- Encouraging message (no trends yet): "Complete your first check-in to start tracking your progress." / "Complete su primera evaluación para comenzar a seguir su progreso."
- Wearable card: "Connect a health device" / "Conectar un dispositivo de salud"
- Wearable sub: "Track steps, sleep, and more. Coming soon." / "Rastree pasos, sueño y más. Próximamente."
- Error: "We couldn't load your health data. Please try again." / "No pudimos cargar sus datos de salud. Inténtelo de nuevo."
- Retry: "Try again" / "Intentar de nuevo"

---

## Screen: ASSESS-02 Assessment Intro

### Improvements
- The privacy reassurance message ("Your answers are private and shared only with your care team") is placed below the Start button. Per NNG guidance on trust signals, this works well — the user reads it right before committing to start. Keep as-is.
- For PRAPARE domain sections, show a one-line description of the section topic (e.g., "Questions about your housing situation"). The section number alone ("Section 1 of 5") doesn't give enough context. Patients may not know what "Housing" covers.

### Copy [REVISED]
- Start button: "Start" / "Comenzar"
- Continue button (resume): "Continue" / "Continuar"
- Privacy note: "Your answers are private and shared only with your care team." / "Sus respuestas son privadas y se comparten solo con su equipo de atención."
- Resume note: "You're partway through — pick up where you left off." / "Está a medio camino — continúe donde lo dejó."
- Already completed heading: "You already completed this" / "Ya completó esto"
- Already completed sub: "Submitted on [date]" / "Enviado el [fecha]"
- View progress link: "View my progress" / "Ver mi progreso"
- Error: "We couldn't load this check-in. Please try again." / "No pudimos cargar esta evaluación. Inténtelo de nuevo."

---

## Screen: ASSESS-03 Assessment Question

### Critical Issues
- **Auto-advance for single-question check-ins:** The open question asks whether 1-question check-ins should auto-advance on tap. **Recommendation: No.** NNG wizard design guidance recommends explicit confirmation even for simple actions — patients with motor difficulties may accidentally tap an emoji they didn't intend. The "Submit" button adds one tap but prevents errors. For a 1-question check-in, the total flow is: see question → tap answer → tap Submit. Still under 10 seconds. [Source: NNG, "Wizards: Definition and Design Recommendations"]

### Improvements
- The slide transition between questions (noted as an open question) should be included in the prototype. The animation communicates spatial direction — "I'm moving forward" or "I'm going back." Without it, question swaps feel like glitchy page reloads. A simple CSS `translateX` transition is low effort. [Source: NNG, "Wizards: Definition and Design Recommendations" — step transitions reduce disorientation]
- The close button (X) should show a lightweight confirmation for full assessments (3+ questions answered): "Save and exit? You can pick up later." / "¿Guardar y salir? Puede continuar después." This prevents accidental loss of progress. For check-ins (1–2 questions), no confirmation needed.
- Free-text character counter should only appear when the user has typed 400+ characters (80% of limit). Showing "0 / 500" before they start typing is noise.

### Copy [REVISED]
- Progress: "Question [N] of [M]" / "Pregunta [N] de [M]"
- Next: "Next" / "Siguiente"
- Submit (last question): "Submit" / "Enviar"
- Skip: "Skip" / "Omitir"
- Close aria-label: "Save and exit" / "Guardar y salir"
- Close confirmation (3+ questions answered): "Save and exit? You can pick up later." / "¿Guardar y salir? Puede continuar después."
- Submit error: "We couldn't save your answers. Please try again." / "No pudimos guardar sus respuestas. Inténtelo de nuevo."
- Emoji scale labels (5-point mood):
  - 😫 "Awful" / "Muy mal"
  - 😔 "Not great" / "No muy bien"
  - 😐 "Okay" / "Más o menos"
  - 🙂 "Good" / "Bien"
  - 😊 "Great" / "Muy bien"

---

## Screen: ASSESS-04 Assessment Complete

### Improvements
- The reassurance message for flagged responses ("your care team may reach out") is well-worded. One refinement: use "will" instead of "may" — "may reach out" introduces uncertainty that can increase anxiety. "Your care team will follow up with you." is warmer and more definitive.
- PRAPARE section completion state is well-handled with "Next section" / "Take a break" options. The "Take a break" label is good — it normalizes stopping, which reduces assessment fatigue.

### Copy [REVISED]
- Confirmation heading: "Thank you" / "Gracias"
- Behavioral confirmation: "Your care team will review your answers." / "Su equipo de atención revisará sus respuestas."
- SDOH confirmation: "We'll connect you with support if needed." / "Le conectaremos con apoyo si es necesario."
- Dietary confirmation: "This helps us plan better meals for you." / "Esto nos ayuda a planificar mejores comidas para usted."
- Generic check-in confirmation: "Your response has been recorded." / "Su respuesta ha sido registrada."
- Follow-up prompt: "Your care team has one more check-in for you." / "Su equipo de atención tiene otra evaluación para usted."
- Follow-up CTA: "Continue" / "Continuar"
- Reassurance (flagged): "Based on your answers, your care team will follow up with you." / "Según sus respuestas, su equipo de atención se comunicará con usted."
- Done: "Done" / "Listo"
- Done for now: "Done for now" / "Listo por ahora"
- View progress: "View my progress" / "Ver mi progreso"
- PRAPARE section complete: "Section complete" / "Sección completada"
- PRAPARE next: "You've finished the [topic] questions. Ready for the next section?" / "Ha terminado las preguntas sobre [tema]. ¿Listo para la siguiente sección?"
- PRAPARE continue: "Next section" / "Siguiente sección"
- PRAPARE break: "Take a break" / "Tomar un descanso"

---

## Screen: ASSESS-05 Metric Detail

### Critical Issues
- **Severity zone bands on patient-facing charts:** Showing red/yellow/green clinical severity zones directly on the chart could alarm patients. A patient who sees their PHQ-9 dot in a "red zone" labeled "Severe" may panic. **Recommendation:** Use the zone bands but soften the language and colors:
  - Instead of: green "None" / yellow "Moderate" / red "Severe"
  - Use: teal-50 "Doing well" / sand-100 "Something to watch" / warm-100 "Your care team is here to help"
  - Colors should be Haven palette tints (not traffic-light red/green), maintaining the informational value without the alarm. Patient-friendly labels on the bands; clinical labels only in the history list badges.

### Improvements
- The "About this check-in" educational card should be **collapsed by default** (accordion) on return visits. First time a patient views a metric, show it expanded. Use a `localStorage` flag per metric. This saves vertical space for returning patients who understand what they're looking at.
- History list date formatting: use relative dates for recent entries ("Today", "Yesterday", "3 days ago") and absolute dates for older entries (> 7 days). This is consistent with the messages screen pattern.
- For emoji check-in trends, rather than mapping emojis to a 1–5 numeric axis (which can feel reductive), use the emojis themselves as data points on the chart. Chart.js supports image/emoji point styles. The Y-axis can remain unlabeled — the visual pattern (higher = better) is self-evident with emoji.

### Copy [REVISED]
- History section label: "History" / "Historial"
- Show more: "Show more" / "Mostrar más"
- Educational card label: "About this check-in" / "Sobre esta evaluación"
- PHQ-9 explanation: "This measures how often you've felt down or lost interest in things. Lower scores mean you're doing well." / "Esto mide con qué frecuencia se ha sentido desanimado/a o ha perdido interés en las cosas. Puntuaciones más bajas significan que está bien."
- Mood explanation: "This tracks how you've been feeling day to day." / "Esto rastrea cómo se ha sentido día a día."
- Minimal data encouragement: "Keep checking in — your trends become clearer over time." / "Siga registrando — sus tendencias se aclaran con el tiempo."
- Single data point message: "Complete one more check-in to see your trend." / "Complete una evaluación más para ver su tendencia."
- Error: "We couldn't load your progress data." / "No pudimos cargar sus datos de progreso."
- Retry: "Try again" / "Intentar de nuevo"
- Zone band labels (patient-friendly):
  - Low range: "Doing well" / "Va bien"
  - Mid range: "Something to watch" / "Algo para observar"
  - High range: "Your care team is here to help" / "Su equipo de atención está aquí para ayudarle"

---

## Cross-Screen Issues

### Bottom Nav — Health Tab
The wireframes specify a new 5th tab: **Health** with `fa-heart-pulse`. This needs to be added to the `mobile-bottom-nav` partial (`src/partials/patient-bottom-nav.html`). The tab order Meals | Delivery | Health | Care Team | Profile puts Health in the center position — the thumb-zone sweet spot on mobile. Good placement for encouraging check-in completion.

### Dashboard Integration — Tasks Section
The patient dashboard (`apps/patient/index.html`) gains a **Tasks** section at the top of the page. Shows the 3 most urgent outstanding tasks with a "See all" link when >3 exist. Tasks section is hidden when no tasks are pending (no empty state on the dashboard). Full task list lives at `tasks/index.html`. The Tasks pattern is extensible to future task types (measurements, appointments, documentation, meal orders). See `wireframes/dashboard-tasks-section.md` and `wireframes/tasks-01-task-list.md`.

### Assessment Definition Files
The markdown assessment format defined in the use cases document is the data contract for the prototype. The wireframes assume this format for all bilingual text, question types, and scoring. These files need to exist in `src/data/patient/assessments/` before the build phase — at minimum: `phq-2.md`, `phq-9.md`, `hunger-vital-sign.md`, and `mood-checkin.md` for the prototype.

### Consistent i18n Pattern
All copy in this review uses `data-i18n-en` / `data-i18n-es` attributes, consistent with the existing patient app screens. Assessment question text and option labels come from the definition files — the renderer reads the appropriate language field.

---

## Use Case Walk-Through

**PT-ASSESS-001 (Complete a Prompted Assessment):** Patient sees pending card on Health hub or dashboard → taps → sees intro with context and time estimate → starts → answers one question at a time with clear progress → can go back → submits → sees confirmation with optional follow-up. Progress saved if abandoned. ✅

**PT-ASSESS-002 (Quick Check-In):** Patient taps check-in card → goes directly to first question (skips intro) → answers 1–5 questions → submits → confirmation. Under 60 seconds for a 1-3 question check-in. ✅

**PT-ASSESS-003 (View Health Trends):** Patient opens Health tab → sees trend cards with sparklines and direction badges → taps one → sees detailed chart with all historical data, patient-friendly severity labels, history list, and educational context. ✅

**PT-ASSESS-004 (Wearable Data — Future):** Placeholder card visible in Health hub. Not tappable. "Coming soon" label. IA accommodates future expansion. ✅

**PRAPARE Multi-Section Flow:** Patient starts PRAPARE → sees "Section 1 of 5: Housing" → completes housing questions → section complete screen with "Next section" / "Take a break" → can resume later, progress saved per section. ✅

**PHQ-2 → PHQ-9 Follow-Up:** Patient completes PHQ-2 → score ≥3 → completion screen shows follow-up card "Your care team has one more check-in for you" → patient taps Continue → PHQ-9 intro → completes. Or taps "Done for now" → PHQ-9 appears as next pending assessment on Health hub. ✅

---

## Resolved Questions

1. ~~**Dashboard assessment card**~~ → [RESOLVED: Tasks section on dashboard showing top 3 outstanding tasks with "See all" link. Extensible to future task types.]
2. **Prototype assessment set:** PHQ-2, mood check-in, and Hunger Vital Sign confirmed. Full remaining assessment list tracked in roadmap.
