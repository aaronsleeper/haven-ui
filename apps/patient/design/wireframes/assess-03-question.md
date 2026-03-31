# ASSESS-03: Assessment Question

**Application:** Patient App (Mobile)
**Use Case(s):** PT-ASSESS-001, PT-ASSESS-002
**User Type:** Patient
**Device:** Mobile-first
**Route:** `/apps/patient/health/assessment.html?id=[assessmentId]` (same page as Intro, JS-driven state)

## Page Purpose

Display one question at a time. The patient reads the question, selects or types an answer, and advances. The single-question-per-screen pattern reduces cognitive load and maintains 90%+ completion rates (per ePRO research). The patient should always know where they are in the assessment and feel free to go back.

This screen handles both full assessments (PT-ASSESS-001) and quick check-ins (PT-ASSESS-002). Check-ins use the same question renderer but with minimal chrome.

---

## Layout Structure

### Shell
- `mobile-shell` with `mobile-app` body class
- `mobile-i18n-bar` fixed at top
- **No bottom nav** — focused flow

### Header Zone
- `<div class="flex items-center justify-between px-4 pt-4 pb-2">`
- Left: back/previous button `<button class="btn-icon">` with `fa-chevron-left`
  - On first question: navigates back to Intro (or Health hub for check-ins)
  - On subsequent questions: goes to previous question
- Center: progress indicator
  - For assessments with 3+ questions: `onb-progress` component adapted — "Question 3 of 9" / "Pregunta 3 de 9" with a progress bar
  - For check-ins with 1–2 questions: no progress indicator (unnecessary chrome)
- Right: close button `<button class="btn-icon">` with `fa-xmark`
  - Saves progress and returns to Health hub
  - `aria-label="Save and exit"` / `aria-label="Guardar y salir"`

### Content Zone

#### Question Text
- `<div class="px-6 pt-6">`
- `<p class="text-lg font-medium leading-relaxed">` — the question text from the assessment definition
- Below (if applicable): `<p class="text-sm text-sand-400 mt-1">` — helper text (e.g., "Over the past 2 weeks" / "En las últimas 2 semanas")

#### Response Area
- `<div class="px-6 pt-6 pb-4">`
- The response component depends on the question `type` field:

**Type: `radio` (standard multiple choice)**
- Stacked radio cards — one per option
- Each option: full-width tappable row using the `pref-row` pattern (`:has(input:checked)` for selected state)
  - `<label class="pref-row">` with `<input type="radio" class="sr-only">`
  - `<span class="pref-row-indicator pref-row-indicator--circle">` + `<span class="pref-row-label">`
  - Selected: teal fill with inset ring (existing `pref-row` behavior)
- Gap between options: `space-y-2`
- Options are minimum 48px tall for tap targets

**Type: `emoji-scale` (1–5 emoji rating)**
- Horizontal row of 5 tappable emoji/icon buttons
- `<div class="flex justify-between gap-2">`
- Each option: `[NEW COMPONENT: emoji-scale-option]`
  - `<label>` wrapping a hidden `<input type="radio" class="sr-only">`
  - Circular button (~56px) with emoji or icon centered
  - Below: short text label (`text-xs text-sand-400`)
  - Selected state: teal background, white icon/emoji, bold label (`:has(input:checked)` pattern)
- Example 5-point mood scale:
  - 😫 "Awful" / "Muy mal"
  - 😔 "Not great" / "No muy bien"
  - 😐 "Okay" / "Más o menos"
  - 🙂 "Good" / "Bien"
  - 😊 "Great" / "Muy bien"
- For accessibility: each option has `aria-label` with the text label, not the emoji

**Type: `slider` (visual analog scale)**
- `[NEW COMPONENT: assess-slider]`
- `<input type="range">` styled to match Haven theme
  - Track: `bg-sand-200`, thumb: `bg-teal-600`, filled track: `bg-teal-300`
  - Min/max labels at ends: `<span class="text-xs text-sand-400">`
  - Current value displayed above the thumb or as a centered `<p class="text-lg font-semibold text-teal-700">`
  - Thumb size: 44px minimum for touch target
- Labels: e.g., "No pain" — "Worst pain" / "Sin dolor" — "Peor dolor"

**Type: `yes-no` (binary)**
- Two large tappable buttons side by side: `<div class="grid grid-cols-2 gap-3">`
- Each: `.card` with centered text, using `:has(input:checked)` for selected state
  - Unselected: `bg-white border-sand-200`
  - Selected: `bg-teal-50 border-teal-600 text-teal-700 font-semibold`
- Buttons are tall (~64px) for comfortable tap targets
- "Yes" / "Sí" and "No" / "No"

**Type: `free-text` (open-ended)**
- `<textarea>` (element default styling)
- Placeholder from assessment definition: e.g., "Tell us more..." / "Cuéntenos más..."
- Character counter: `<p class="text-xs text-sand-400 text-right mt-1">` — "[count] / 500"
- Auto-grows to 4 rows max (same pattern as messages compose: `src/scripts/components/messages-compose.js`)

### Footer Zone
- `<div class="sticky bottom-0 bg-white border-t border-sand-200 px-6 py-4">`
- For most question types: `.btn-primary` full width — "Next" / "Siguiente"
  - Disabled state until an answer is selected (for required questions)
  - On the last question: label changes to "Submit" / "Enviar"
- For optional questions: secondary link below button — `<a class="text-link text-sm text-sand-400">` — "Skip" / "Omitir"

---

## Interaction Specifications

### Select Answer (radio, emoji-scale, yes-no)
- **Trigger:** Tap an option
- **Feedback:** Option shows selected state immediately (`:has(input:checked)` CSS transition). Next button becomes enabled.
- **Navigation:** None — patient must tap "Next" to advance
- **Error handling:** N/A

### Adjust Slider
- **Trigger:** Drag thumb or tap on track
- **Feedback:** Thumb moves, filled track updates, current value label updates
- **Navigation:** None — patient must tap "Next"
- **Error handling:** N/A

### Tap "Next"
- **Trigger:** Tap primary button (enabled when answer selected)
- **Feedback:** Current question slides left, next question slides in from right (CSS transition: `transform: translateX(-100%)` on out, `translateX(0)` on in, ~200ms ease)
- **Navigation:** Display next question. Update progress indicator.
- **Error handling:** N/A (all local state)

### Tap "Submit" (Last Question)
- **Trigger:** Tap primary button on the final question
- **Feedback:** Button shows loading state (`btn-loading`). Brief pause, then transition to assess-04 (Complete).
- **Navigation:** Transition to completion screen (same page, JS state change)
- **Error handling:** If submission fails, button reverts to enabled. `.alert alert-error` appears above the footer: "We couldn't save your answers. Please try again." / "No pudimos guardar sus respuestas. Inténtelo de nuevo."

### Tap "Back" / Previous
- **Trigger:** Tap back chevron
- **Feedback:** Current question slides right, previous question slides in from left
- **Navigation:** Display previous question with the previously selected answer preserved
- **Error handling:** N/A

### Tap "Close" (X)
- **Trigger:** Tap close button
- **Feedback:** Progress saved silently
- **Navigation:** Return to Health hub. Assessment will show as "in progress" in the pending section.
- **Error handling:** N/A

### Tap "Skip" (Optional Questions)
- **Trigger:** Tap skip link
- **Feedback:** Question advances to next without recording a value
- **Navigation:** Same as "Next" behavior
- **Error handling:** N/A

---

## States

### Empty State
N/A — this screen always has a question to display (the assessment definition guarantees at least one question).

### Loading State
- Before assessment data loads: `spinner-container-vertical` centered in content zone
- Question transition: brief crossfade/slide (no loading state needed for local navigation between questions)

### Error State — Load Failure
- Replaces content zone
- `.alert alert-error` centered
- "We couldn't load this check-in." / "No pudimos cargar esta evaluación."
- `.btn-outline` — "Try again" / "Intentar de nuevo"

### Error State — Submit Failure
- `.alert alert-error` slides in above the sticky footer
- "We couldn't save your answers. Please try again." / "No pudimos guardar sus respuestas. Inténtelo de nuevo."
- Submit button reverts to enabled state

---

## Accessibility Notes
- One question per screen means screen readers announce the new question naturally on each transition
- `aria-live="polite"` on the question container so screen readers announce new questions
- Progress indicator has `aria-label="Question [N] of [total]"` / `aria-label="Pregunta [N] de [total]"`
- All radio/emoji/yes-no options are native `<input>` elements (hidden) with `<label>` wrappers — keyboard and screen reader accessible
- Slider: `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-label` with the question text
- Skip link is a true `<a>` or `<button>` — not a click handler on text
- Touch targets: all options ≥44px, slider thumb ≥44px, buttons full width

## Bilingual Considerations
- Question text and all option labels come from the assessment definition files (already bilingual)
- "Next" / "Siguiente" — similar length
- "Submit" / "Enviar" — similar length
- "Skip" / "Omitir" — similar length
- "Question 3 of 9" / "Pregunta 3 de 9" — fits in header center zone
- Emoji labels may be longer in Spanish (e.g., "Not great" → "No muy bien") — the horizontal emoji row has `gap-2` to accommodate variable label width. At extreme lengths, labels wrap to two lines within the column.

## New Components Flagged
- `[NEW COMPONENT: emoji-scale-option — circular tappable option (~56px) with emoji/icon, text label below. `:has(input:checked)` selected state. Used in horizontal row of 3–5 options.]`
- `[NEW COMPONENT: assess-slider — styled range input with Haven theme colors, min/max labels, current value display, 44px thumb. Wraps native `<input type="range">`.]`
- `[NEW COMPONENT: assess-progress — progress bar with "Question N of M" label. Adapts from onb-progress but with dynamic count. Hidden for 1–2 question check-ins.]`

## Open Questions
- Should answer selection on single-question check-ins auto-advance (submit immediately on tap), or should even 1-question check-ins require a "Submit" tap? Auto-advance is faster but less intentional.
- For the slide transition between questions, should we implement this in the prototype or just do an instant swap? The slide adds polish but requires JS animation.
