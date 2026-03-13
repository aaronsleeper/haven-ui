# Task: Patient Meal Feedback Screen (CARE-02)
_Generated: 2026-03-12_
_App: patient_

---

## Scope Classification

**Work type:** App only — composing existing patterns; no new components.

**Patterns being used (all verified in components.css):**
- `mobile-shell`, `mobile-app` — body/wrapper
- `mobile-i18n-bar`, `mobile-i18n-toggle` — language bar partial
- `mobile-bottom-nav`, `mobile-bottom-nav-tab` — nav partial
- `feedback-rating-fieldset`, `feedback-rating-card` — overall rating row (3 cards)
- `hs-accordion`, `hs-accordion-toggle`, `hs-accordion-content` — per-meal accordion
- `sticky-footer`, `sticky-footer-inner`, `sticky-footer-actions` — submit footer
- `btn-primary`, `btn-outline`, `btn-icon` — buttons
- `text-link` — skip link

**No new semantic classes needed.** Flag any gap found during audit before writing HTML.

---

## Pre-Build Audit

Before writing any HTML:

1. Read `src/styles/tokens/components.css` — confirm all class names above exist. Note the exact `@apply` values for `feedback-rating-card` and `hs-accordion-toggle`.
2. Read `src/partials/patient-i18n-bar.html` and `src/partials/patient-bottom-nav.html` — copy verbatim.
3. Read `apps/patient/meals/index.html` — reference for head, shell, script loading pattern.
4. Read `.project-docs/decisions-log.md` — extract every **"Rule to follow in future prompts"** entry. List and flag applicable ones.

---

## Prompt 1: Build `apps/patient/care-team/feedback.html`

### File to create
`apps/patient/care-team/feedback.html`

### Shell setup
- `<body class="mobile-app">` + `<div class="mobile-shell pb-[128px]">`
- Copy i18n bar verbatim from partial
- Copy bottom nav verbatim from partial, set "Care Team" tab active (third tab)
- Title: `"Meal Feedback — Cena Health"`

### Page structure (top to bottom)

**1. Header zone** — `<div class="px-4 pt-20 pb-2">`
- Back button: `<a href="/apps/patient/care-team/messages.html" class="btn-icon mb-2" aria-label="Back"><i class="fa-solid fa-chevron-left"></i></a>`
- `<h1 style="font-family: var(--font-serif);">` — "How were your meals?"
- `<p class="text-sm text-gray-500 mt-1">` — "Delivery on Thursday, March 19"

**2. Section 1 — Overall rating** — `<div class="px-4 mt-6">`

```html
<fieldset class="feedback-rating-fieldset">
  <legend class="text-sm font-semibold text-gray-900 mb-3">
    <span data-i18n-en="Overall, how were your meals this week?" data-i18n-es="En general, ¿cómo estuvieron tus comidas esta semana?">Overall, how were your meals this week?</span>
  </legend>
  <div class="grid grid-cols-3 gap-2">

    <label class="feedback-rating-card">
      <input type="radio" name="overall-rating" value="good" class="sr-only">
      <i class="fa-solid fa-face-smile" aria-hidden="true"></i>
      <span data-i18n-en="Good" data-i18n-es="Buenas">Good</span>
    </label>

    <label class="feedback-rating-card">
      <input type="radio" name="overall-rating" value="okay" class="sr-only">
      <i class="fa-solid fa-face-meh" aria-hidden="true"></i>
      <span data-i18n-en="Okay" data-i18n-es="Regulares">Okay</span>
    </label>

    <label class="feedback-rating-card">
      <input type="radio" name="overall-rating" value="not-good" class="sr-only" id="rating-not-good">
      <i class="fa-solid fa-face-frown" aria-hidden="true"></i>
      <span data-i18n-en="Not good" data-i18n-es="No tan buenas">Not good</span>
    </label>

  </div>
</fieldset>
```

**3. Section 1b — Issue type** — conditional, hidden by default, shown when "Not good" is selected

```html
<div class="px-4 mt-4 feedback-issue-section" style="display:none;">
  <fieldset class="border-0 p-0">
    <legend class="text-sm font-semibold text-gray-900 mb-3">
      <span data-i18n-en="What went wrong?" data-i18n-es="¿Qué salió mal?">What went wrong?</span>
    </legend>
    <div class="space-y-2">
      <button type="button" class="btn-outline w-full issue-type-btn" data-issue="not-delivered">
        <span data-i18n-en="Meals didn't arrive" data-i18n-es="Las comidas no llegaron">Meals didn't arrive</span>
      </button>
      <button type="button" class="btn-outline w-full issue-type-btn" data-issue="wrong-meals">
        <span data-i18n-en="Wrong meals" data-i18n-es="Comidas incorrectas">Wrong meals</span>
      </button>
      <button type="button" class="btn-outline w-full issue-type-btn" data-issue="poor-quality">
        <span data-i18n-en="Poor quality or damaged" data-i18n-es="Mala calidad o dañadas">Poor quality or damaged</span>
      </button>
      <button type="button" class="btn-outline w-full issue-type-btn" data-issue="wrong-amount">
        <span data-i18n-en="Too much or too little food" data-i18n-es="Demasiada o poca comida">Too much or too little food</span>
      </button>
      <button type="button" class="btn-outline w-full issue-type-btn" data-issue="other">
        <span data-i18n-en="Something else" data-i18n-es="Otra cosa">Something else</span>
      </button>
    </div>
  </fieldset>
</div>
```

**4. Section 2 — Per-meal ratings** — `<div class="px-4 mt-6">`

Use Preline accordion. The toggle label is "Rate individual meals". Each accordion item contains a meal name and three icon buttons (thumbs up, neutral, thumbs down). Only one accordion item open at a time is not required — default is all collapsed.

```html
<div class="hs-accordion-group">
  <div class="hs-accordion border border-gray-200 rounded-xl overflow-hidden" id="accordion-meals">
    <button class="hs-accordion-toggle w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-900" aria-expanded="false" aria-controls="accordion-meals-content">
      <span data-i18n-en="Rate individual meals" data-i18n-es="Calificar comidas individuales">Rate individual meals</span>
      <i class="fa-solid fa-chevron-down accordion-chevron-down text-gray-400 text-xs" aria-hidden="true"></i>
      <i class="fa-solid fa-chevron-up accordion-chevron-up text-gray-400 text-xs" aria-hidden="true"></i>
    </button>
    <div id="accordion-meals-content" class="hs-accordion-content hidden" role="region">
      <div class="divide-y divide-gray-100">

        <!-- One row per meal -->
        <div class="flex items-center justify-between px-4 py-3 gap-3">
          <span class="text-sm text-gray-700 flex-1">Chicken Verde Rice Bowl</span>
          <div class="flex gap-2 shrink-0">
            <button type="button" class="btn-icon meal-rating-btn" data-rating="good" aria-label="Good"><i class="fa-solid fa-thumbs-up"></i></button>
            <button type="button" class="btn-icon meal-rating-btn" data-rating="okay" aria-label="Okay"><i class="fa-solid fa-face-meh"></i></button>
            <button type="button" class="btn-icon meal-rating-btn" data-rating="bad" aria-label="Not good"><i class="fa-solid fa-thumbs-down"></i></button>
          </div>
        </div>

        <div class="flex items-center justify-between px-4 py-3 gap-3">
          <span class="text-sm text-gray-700 flex-1">Black Bean Tacos</span>
          <div class="flex gap-2 shrink-0">
            <button type="button" class="btn-icon meal-rating-btn" data-rating="good" aria-label="Good"><i class="fa-solid fa-thumbs-up"></i></button>
            <button type="button" class="btn-icon meal-rating-btn" data-rating="okay" aria-label="Okay"><i class="fa-solid fa-face-meh"></i></button>
            <button type="button" class="btn-icon meal-rating-btn" data-rating="bad" aria-label="Not good"><i class="fa-solid fa-thumbs-down"></i></button>
          </div>
        </div>

        <div class="flex items-center justify-between px-4 py-3 gap-3">
          <span class="text-sm text-gray-700 flex-1">Lemon Herb Salmon</span>
          <div class="flex gap-2 shrink-0">
            <button type="button" class="btn-icon meal-rating-btn" data-rating="good" aria-label="Good"><i class="fa-solid fa-thumbs-up"></i></button>
            <button type="button" class="btn-icon meal-rating-btn" data-rating="okay" aria-label="Okay"><i class="fa-solid fa-face-meh"></i></button>
            <button type="button" class="btn-icon meal-rating-btn" data-rating="bad" aria-label="Not good"><i class="fa-solid fa-thumbs-down"></i></button>
          </div>
        </div>

        <div class="flex items-center justify-between px-4 py-3 gap-3">
          <span class="text-sm text-gray-700 flex-1">Turkey Sofrito Bowl</span>
          <div class="flex gap-2 shrink-0">
            <button type="button" class="btn-icon meal-rating-btn" data-rating="good" aria-label="Good"><i class="fa-solid fa-thumbs-up"></i></button>
            <button type="button" class="btn-icon meal-rating-btn" data-rating="okay" aria-label="Okay"><i class="fa-solid fa-face-meh"></i></button>
            <button type="button" class="btn-icon meal-rating-btn" data-rating="bad" aria-label="Not good"><i class="fa-solid fa-thumbs-down"></i></button>
          </div>
        </div>

        <div class="flex items-center justify-between px-4 py-3 gap-3">
          <span class="text-sm text-gray-700 flex-1">Veggie Stir-Fry</span>
          <div class="flex gap-2 shrink-0">
            <button type="button" class="btn-icon meal-rating-btn" data-rating="good" aria-label="Good"><i class="fa-solid fa-thumbs-up"></i></button>
            <button type="button" class="btn-icon meal-rating-btn" data-rating="okay" aria-label="Okay"><i class="fa-solid fa-face-meh"></i></button>
            <button type="button" class="btn-icon meal-rating-btn" data-rating="bad" aria-label="Not good"><i class="fa-solid fa-thumbs-down"></i></button>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>
```

**5. Section 3 — Free text** — `<div class="px-4 mt-6">`

```html
<fieldset class="border-0 p-0">
  <legend class="text-sm font-semibold text-gray-900 mb-2">
    <span data-i18n-en="Anything else? (optional)" data-i18n-es="¿Algo más? (opcional)">Anything else? (optional)</span>
  </legend>
  <textarea
    rows="3"
    class="w-full"
    placeholder="Tell us more..."
    aria-label="Additional feedback"
  ></textarea>
  <p class="text-xs text-gray-400 mt-1">
    <span data-i18n-en="Your care team will read this." data-i18n-es="Tu equipo de cuidado leerá esto.">Your care team will read this.</span>
  </p>
</fieldset>
```

**6. Error message** — hidden by default, `<div class="px-4 mt-4">`
```html
<div class="alert alert-error hidden" id="feedback-error" role="alert">
  <span data-i18n-en="Couldn't send your feedback. Try again?" data-i18n-es="No pudimos enviar tus comentarios. ¿Intentar de nuevo?">Couldn't send your feedback. Try again?</span>
</div>
```

**7. Confirmation state** — hidden by default, shown on submit or `?state=submitted`

Place this as a sibling to `<main>`, hidden by default:
```html
<div class="feedback-confirmation hidden px-4 pt-32 flex flex-col items-center text-center">
  <i class="fa-solid fa-circle-check text-success-500 text-5xl mb-4" aria-hidden="true"></i>
  <h2 class="text-xl font-semibold mb-2" style="font-family: var(--font-serif);">
    <span data-i18n-en="Thanks for your feedback." data-i18n-es="Gracias por tus comentarios.">Thanks for your feedback.</span>
  </h2>
  <p class="text-sm text-gray-500 mb-6">
    <span data-i18n-en="We shared this with your care team." data-i18n-es="Lo compartimos con tu equipo de cuidado.">We shared this with your care team.</span>
  </p>
  <a href="/apps/patient/meals/index.html" class="btn-outline">
    <span data-i18n-en="Done" data-i18n-es="Listo">Done</span>
  </a>
</div>
```

**8. Sticky footer** — place before `</div><!-- /.mobile-shell -->`
```html
<div class="sticky-footer" id="feedback-footer">
  <div class="sticky-footer-inner">
    <div class="sticky-footer-actions">
      <a href="/apps/patient/meals/index.html" class="text-link text-sm text-gray-400 mr-auto">
        <span data-i18n-en="Skip for now" data-i18n-es="Omitir por ahora">Skip for now</span>
      </a>
      <button class="btn-primary" id="btn-submit-feedback">
        <span data-i18n-en="Submit feedback" data-i18n-es="Enviar comentarios">Submit feedback</span>
      </button>
    </div>
  </div>
</div>
```

### State variant CSS

Add under `/* Feedback screen state variants */` in `components.css`:

```css
/* Feedback screen state variants */
.state-submitted main { @apply block; display: none; }
.state-submitted #feedback-footer { @apply block; display: none; }
.state-submitted .feedback-confirmation { @apply flex; }
```

### Scripts
- `<script src="/src/scripts/components/i18n.js"></script>`
- `<script src="/src/scripts/components/feedback.js"></script>`
- `<script src="/src/scripts/main.js" type="module"></script>` — last

### Known Constraints
- **Never `@apply` a semantic class inside another semantic class.**
- **No `<script>` blocks in HTML.**
- **Raw CSS rules in `components.css` must start with `@apply block;`** if they contain no other `@apply`.
- **`hs-accordion` open state:** Preline v4 adds the `.block` class to `.hs-accordion-content` when open — do not use `hs-dropdown-open:*` variants. Drive chevron visibility via `.hs-accordion.active` class (confirmed in decisions-log).

---

## Prompt 2: Build `src/scripts/components/feedback.js`

### State management

```js
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('state') === 'submitted') {
    document.body.classList.add('state-submitted');
  }
});
```

### Issue section toggle

Show `.feedback-issue-section` when "Not good" radio is selected; hide it otherwise:

```js
document.querySelectorAll('input[name="overall-rating"]').forEach(input => {
  input.addEventListener('change', () => {
    const issueSection = document.querySelector('.feedback-issue-section');
    if (!issueSection) return;
    issueSection.style.display = input.value === 'not-good' ? '' : 'none';
  });
});
```

### Issue type button selection

```js
document.querySelectorAll('.issue-type-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.issue-type-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});
```

### Per-meal rating selection

Each meal row has three `.meal-rating-btn` buttons. Selecting one highlights it; the others in the same row deselect.

```js
document.querySelectorAll('.meal-rating-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const row = btn.closest('.flex');
    row.querySelectorAll('.meal-rating-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});
```

Add to `components.css` under the feedback state variants comment:

```css
.meal-rating-btn.active {
  @apply text-primary-600 bg-primary-50;
}
```

### Submit

```js
document.getElementById('btn-submit-feedback')?.addEventListener('click', () => {
  document.body.classList.add('state-submitted');
  history.replaceState(null, '', '?state=submitted');
  window.scrollTo(0, 0);
});
```

### Known Constraints
- No Preline dependencies needed in this file -- accordion is handled by `main.js`.
- `btn-outline.active` class already exists in `components.css` (added in MEALS-02). Use it for issue type buttons.

---

## Verification

After both prompts complete, verify at `http://localhost:5173/apps/patient/care-team/feedback.html`:

- [ ] Default state: form visible, confirmation hidden, footer visible
- [ ] `?state=submitted`: form hidden, footer hidden, confirmation state visible
- [ ] Three rating cards render in a row with icons and labels
- [ ] Selecting "Not good" reveals the issue type section
- [ ] Selecting "Good" or "Okay" hides the issue type section
- [ ] Issue type buttons highlight on selection with `.active` state
- [ ] Per-meal accordion is collapsed by default
- [ ] Expanding accordion reveals 5 meal rows
- [ ] Tapping a meal rating button highlights it; siblings in the row deselect
- [ ] Free text textarea renders with placeholder and helper text
- [ ] "Submit feedback" button transitions to confirmed state and updates URL
- [ ] Bottom nav renders with Care Team tab active
- [ ] i18n toggle works on all strings
- [ ] No utility class chains on component elements
- [ ] No `<script>` blocks in HTML
- [ ] `src/scripts/components/feedback.js` exists
- [ ] New CSS rules under `/* Feedback screen state variants */` in `components.css`
- [ ] Dark mode: not applicable
- [ ] ANDREY-README.md: not applicable

---

## Completion Report

After verification passes, output:

```
## Completion Report — Patient Meal Feedback Screen (CARE-02)

- New semantic classes added to components.css: [list, or "none"]
- Existing classes modified: [list, or "none"]
- Pattern library files created or updated: [list, or "none"]
- Judgment calls: [list, or "none"]
- Dark mode added: not applicable
- ANDREY-README.md updated: not applicable
- Schema delta logged: not applicable
- Items deferred or incomplete: [list, or "none"]
```

---

## Final Step

```bash
git add -A
git commit -m "feat(patient): add meal feedback screen (CARE-02) with accordion and submit flow"
```

Then output:

---
**View your result:**
- Default: http://localhost:5173/apps/patient/care-team/feedback.html
- Submitted: http://localhost:5173/apps/patient/care-team/feedback.html?state=submitted
---
