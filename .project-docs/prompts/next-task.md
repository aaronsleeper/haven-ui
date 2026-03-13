# Task 03: Patient-Specific Components — CSS + Pattern Library

## Scope
Pattern library + CSS only. No app page work in this task.

## Context
This task adds the seven patient-app-specific semantic class groups that app screens (Tasks 04–09) will use. All must exist in `components.css` and have a matching pattern library file before any screen references them.

The seven components:
1. `meal-card` — horizontal meal photo + info card (MEALS-01)
2. `delivery-status-card` — large centered status display (MEALS-02)
3. `message-bubble-out` / `message-bubble-in` + related — SMS-style chat bubbles (CARE-01)
4. `feedback-rating-card` + `feedback-rating-fieldset` — large tap-target rating option (CARE-02)
5. `pref-image-card` + related — visual checkbox card for food preferences (ONB-03, PROFILE-01)

Read the spec files in `apps/patient/design/new-components/` before writing any CSS. The specs contain exact `@apply` definitions — use them verbatim. Do not invent variants or add properties not listed.

## Prerequisites
- Task 01 complete (`mobile-app`, `mobile-shell`, `mobile-i18n-bar`, `mobile-i18n-toggle` in `components.css`)
- Task 02 complete (`mobile-bottom-nav`, `mobile-bottom-nav-tab`, `mobile-bottom-nav-badge`, `onb-progress` in `components.css`)

## Files to Read First
- `apps/patient/design/new-components/meal-card.md`
- `apps/patient/design/new-components/delivery-status-card.md`
- `apps/patient/design/new-components/message-bubble.md`
- `apps/patient/design/new-components/feedback-rating.md`
- `apps/patient/design/new-components/pref-image-card.md`
- `src/styles/tokens/components.css` — find the end of the file for insertion point; confirm no conflicts with existing class names
- `pattern-library/COMPONENT-INDEX.md` — confirm no existing entries for these components
- `.project-docs/decisions-log.md` — review active rules before writing any CSS

## Instructions

### Step 1: Add all new semantic classes to components.css

Open `src/styles/tokens/components.css`. Add the following block at the end of the file, after all existing content. Add each section in order. Use exact `@apply` definitions from the spec files.

```css
/* ===================================
   PATIENT APP — MEAL CARD
   =================================== */

.meal-card {
  @apply flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-3 shadow-2xs;
  @apply dark:bg-neutral-900 dark:border-neutral-700;
}

.meal-card-img {
  @apply size-20 rounded-lg object-cover shrink-0 bg-stone-100;
}

.meal-card-body {
  @apply flex flex-col gap-1 flex-1 min-w-0;
}

.meal-card-name {
  @apply text-sm font-medium text-gray-900 leading-snug;
  @apply dark:text-neutral-100;
}

.meal-card-day {
  @apply text-xs text-gray-500;
  @apply dark:text-neutral-400;
}

.meal-card-tags {
  @apply flex flex-wrap gap-1 mt-0.5;
}

.meal-card-swap {
  @apply text-sm text-primary-600 font-medium text-left mt-1;
  @apply hover:text-primary-700 dark:text-primary-400;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

/* Hide swap button after a meal has been swapped */
.meal-card.is-swapped .meal-card-swap {
  display: none;
}

/* ===================================
   PATIENT APP — DELIVERY STATUS CARD
   =================================== */

.delivery-status-card {
  @apply card mx-4;
}

.delivery-status-top {
  @apply flex flex-col items-center text-center p-6 gap-2;
}

.delivery-status-icon {
  @apply text-5xl mb-1;
}

.delivery-status-label {
  @apply text-xl font-semibold text-gray-900;
  font-family: var(--font-serif);
  @apply dark:text-neutral-100;
}

.delivery-status-timing {
  @apply text-sm text-gray-500;
  @apply dark:text-neutral-400;
}

.delivery-status-divider {
  @apply border-t border-gray-200 mx-4;
  @apply dark:border-neutral-700;
}

.delivery-summary {
  @apply p-4 flex flex-col gap-1;
}

.delivery-summary-label {
  @apply text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1;
  @apply dark:text-neutral-400;
}

.delivery-summary-count {
  @apply text-sm font-medium text-gray-900;
  @apply dark:text-neutral-100;
}

.delivery-summary-list {
  @apply text-sm text-gray-600 space-y-0.5 list-none pl-0;
  @apply dark:text-neutral-400;
}

/* ===================================
   PATIENT APP — MESSAGE BUBBLES
   =================================== */

/* Outgoing (patient) bubble — right-aligned */
.message-bubble-out {
  @apply bg-primary-500 text-white rounded-2xl px-4 py-2 max-w-[80%] text-sm leading-relaxed;
  border-bottom-right-radius: 4px;
  @apply dark:bg-primary-600;
}

/* Incoming (care team) bubble — left-aligned */
.message-bubble-in {
  @apply bg-gray-100 text-gray-900 rounded-2xl px-4 py-2 max-w-[80%] text-sm leading-relaxed;
  border-bottom-left-radius: 4px;
  @apply dark:bg-neutral-800 dark:text-neutral-100;
}

/* Sender label — appears above first bubble in a consecutive group */
.message-sender-label {
  @apply text-xs text-gray-500 mb-1;
  @apply dark:text-neutral-400;
}

/* Date separator between day groups */
.message-date-sep {
  @apply text-xs text-gray-400 text-center py-2;
  @apply dark:text-neutral-500;
}

/* Timestamp below a bubble */
.message-timestamp {
  @apply text-xs text-gray-400 mt-1;
  @apply dark:text-neutral-500;
}

/* Floating "new message" pill — sits above compose bar when new messages arrive */
/* Bottom offset: 64px nav + 64px compose = 128px */
.message-new-pill {
  @apply fixed left-1/2 -translate-x-1/2 z-30;
  @apply bg-primary-500 text-white rounded-full text-sm px-3 flex items-center gap-1.5 shadow-md;
  @apply dark:bg-primary-600;
  bottom: 136px;
  height: 32px;
}

/* ===================================
   PATIENT APP — FEEDBACK RATING CARD
   =================================== */

/* Fieldset wrapper — strips default fieldset border/padding for the rating row */
.feedback-rating-fieldset {
  @apply border-0 p-0 space-y-2;
}

/* Individual rating option card — wraps a sr-only radio input */
.feedback-rating-card {
  @apply flex flex-col items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer;
  @apply hover:border-primary-300 hover:bg-primary-50;
  @apply dark:bg-neutral-900 dark:border-neutral-700;
  min-height: 80px;
}

/* Selected state via :has() — supported in all modern browsers */
.feedback-rating-card:has(input:checked) {
  @apply border-primary-500 bg-primary-50;
  @apply dark:border-primary-600 dark:bg-primary-900/20;
}

.feedback-rating-card span {
  @apply text-xs font-medium text-gray-700;
  @apply dark:text-neutral-300;
}

.feedback-rating-card i {
  @apply text-2xl text-gray-400;
}

.feedback-rating-card:has(input:checked) i {
  @apply text-primary-600;
  @apply dark:text-primary-400;
}

.feedback-rating-card:has(input:checked) span {
  @apply text-primary-700 dark:text-primary-300;
}

/* ===================================
   PATIENT APP — PREFERENCE IMAGE CARD
   =================================== */

/* Outer label wrapper — makes full card tappable */
.pref-image-card {
  @apply flex flex-col items-center gap-2 cursor-pointer;
}

/* Square image container with border that highlights on selection */
.pref-image-card-img-wrap {
  @apply relative w-full aspect-square rounded-lg overflow-hidden bg-stone-100 border-2 border-transparent transition-all;
}

/* Selected: primary border on image wrap */
.pref-image-card:has(input:checked) .pref-image-card-img-wrap {
  @apply border-primary-500;
}

/* Fills image wrap */
.pref-image-card-img {
  @apply w-full h-full object-cover;
}

/* Checkmark overlay — hidden by default, fades in on selection */
.pref-image-card-check {
  @apply absolute inset-0 flex items-center justify-center bg-primary-600/60 opacity-0 transition-opacity;
}

.pref-image-card:has(input:checked) .pref-image-card-check {
  @apply opacity-100;
}

/* Label below the image */
.pref-image-card-label {
  @apply text-xs font-medium text-gray-700 text-center;
  @apply dark:text-neutral-300;
}

.pref-image-card:has(input:checked) .pref-image-card-label {
  @apply text-primary-600 dark:text-primary-400;
}

/* "No preference" plain variant — no photo, centered icon instead */
.pref-image-card-img-wrap-plain {
  @apply flex items-center justify-center;
}
```

**Known Constraints (from decisions-log.md):**
- The base `button` element rule must not set size or color. `.meal-card-swap` adds `background: none; border: none; padding: 0;` as raw CSS to suppress button defaults — this is correct; the class owns these overrides.
- `.delivery-status-card` uses `@apply card mx-4` — this is correct composition using an existing semantic class.
- The `border-bottom-right-radius: 4px` and `border-bottom-left-radius: 4px` on message bubbles are raw CSS overriding the Tailwind `rounded-2xl` on specific corners — this is intentional and does not need `@apply block` (those rules are inside classed selectors that already have `@apply`).
- `.feedback-rating-card:has(input:checked)` — `:has()` is supported in all modern browsers as of 2024. Do not add a fallback.
- Nested border radii: `.meal-card` uses `rounded-xl` (parent), `.meal-card-img` uses `rounded-lg` (inner) — follows the nested border radius reduction rule from decisions-log.md. ✓

### Step 2: Create the pref-image-card mutual exclusivity JS

Create `src/scripts/components/pref-image-cards.js`:

```javascript
/**
 * pref-image-cards.js — Food preference image card selection
 * Enforces mutual exclusivity between "No preference" and cuisine options.
 * Include on ONB-03 and PROFILE-01.
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var noPref = document.getElementById('pref-none');
    var otherPrefs = document.querySelectorAll('input[name="food-pref"]:not(#pref-none)');

    if (!noPref) return;

    noPref.addEventListener('change', function () {
      if (this.checked) {
        otherPrefs.forEach(function (cb) { cb.checked = false; });
      }
    });

    otherPrefs.forEach(function (cb) {
      cb.addEventListener('change', function () {
        if (this.checked) { noPref.checked = false; }
      });
    });
  });
})();
```

### Step 3: Create all seven pattern library files

Create each file exactly as specified below.

---

**`pattern-library/components/patient-meal-card.html`:**

```html
<!--
@component-meta
name: Meal Card
category: Patient App
classes: meal-card, meal-card-img, meal-card-body, meal-card-name, meal-card-day, meal-card-tags, meal-card-swap, meal-card.is-swapped
preline: false
description: Horizontal card showing a meal photo, name, day, diet tag badges, and optional swap link. Used in the weekly meals list (MEALS-01) and swap bottom sheet (omit .meal-card-swap in the sheet). Add .is-swapped to hide swap button and show a Swapped badge after substitution. Missing images show bg-stone-100 placeholder via CSS.
-->

<!-- Default state -->
<div class="meal-card">
  <img
    class="meal-card-img"
    src="/src/assets/meals/chicken-verde.jpg"
    alt="Chicken Verde with cilantro rice and black beans"
  >
  <div class="meal-card-body">
    <p class="meal-card-name">Chicken Verde</p>
    <p class="meal-card-day">Monday</p>
    <div class="meal-card-tags">
      <span class="badge badge-info badge-pill">Low sodium</span>
      <span class="badge badge-secondary badge-pill">Diabetic-friendly</span>
    </div>
    <button class="meal-card-swap" aria-label="Swap Chicken Verde">Swap meal</button>
  </div>
</div>

<!-- Swapped state (add .is-swapped; swap button hidden; badge added) -->
<div class="meal-card is-swapped mt-3">
  <img
    class="meal-card-img"
    src="/src/assets/meals/grilled-tilapia.jpg"
    alt="Grilled Tilapia with mango salsa"
  >
  <div class="meal-card-body">
    <p class="meal-card-name">Grilled Tilapia
      <span class="badge badge-success badge-pill ms-1">Swapped</span>
    </p>
    <p class="meal-card-day">Monday</p>
    <div class="meal-card-tags">
      <span class="badge badge-info badge-pill">Heart-healthy</span>
    </div>
    <button class="meal-card-swap" aria-label="Swap Grilled Tilapia">Swap meal</button>
  </div>
</div>
```

---

**`pattern-library/components/patient-delivery-status-card.html`:**

```html
<!--
@component-meta
name: Delivery Status Card
category: Patient App
classes: delivery-status-card, delivery-status-top, delivery-status-icon, delivery-status-label, delivery-status-timing, delivery-status-divider, delivery-summary, delivery-summary-label, delivery-summary-count, delivery-summary-list
preline: false
description: Large-format card showing current delivery status. Three states driven by JS reading URLSearchParams: preparing (default), delivering, delivered. Change icon class and color token class per state. See MEALS-02 spec for state table.
-->

<!-- Preparing state (default) -->
<div class="delivery-status-card">
  <div class="delivery-status-top">
    <i class="fa-solid fa-kitchen-set delivery-status-icon text-warning-500"></i>
    <p class="delivery-status-label">Getting your meals ready</p>
    <p class="delivery-status-timing">Arriving between 10am – 2pm</p>
  </div>
  <hr class="delivery-status-divider">
  <div class="delivery-summary">
    <p class="delivery-summary-label">What's coming</p>
    <p class="delivery-summary-count">5 meals</p>
    <ul class="delivery-summary-list">
      <li>Chicken Verde</li>
      <li>Black Bean Tacos</li>
      <li>Lemon Herb Salmon</li>
    </ul>
    <a href="/apps/patient/meals/index.html" class="text-link text-sm mt-1">See all meals</a>
  </div>
</div>
```

---

**`pattern-library/components/patient-message-bubble.html`:**

```html
<!--
@component-meta
name: Message Bubble
category: Patient App
classes: message-bubble-out, message-bubble-in, message-sender-label, message-date-sep, message-timestamp, message-new-pill
preline: false
description: SMS-style chat bubbles for the patient messaging screen (CARE-01). Outgoing (patient) is right-aligned; incoming (care team) is left-aligned. Sender label appears above the first bubble in a consecutive group only. Date separator between day groups. New message pill floats above the compose bar.
-->

<!-- Date separator -->
<div class="message-date-sep">Today</div>

<!-- Incoming message (care team) -->
<div class="flex flex-col items-start mb-3">
  <p class="message-sender-label">Your dietitian</p>
  <div class="message-bubble-in">
    Hi Maria! Your meals for next week are all set. Let me know if you have any questions.
  </div>
  <p class="message-timestamp">9:14 AM</p>
</div>

<!-- Outgoing message (patient) -->
<div class="flex flex-col items-end mb-3">
  <div class="message-bubble-out">
    Thanks! Can I swap the salmon for something else?
  </div>
  <p class="message-timestamp">9:16 AM</p>
</div>

<!-- New message pill (shown when patient has scrolled up) -->
<button class="message-new-pill" aria-live="polite">
  <i class="fa-solid fa-arrow-down text-xs"></i>
  New message
</button>
```

---

**`pattern-library/components/patient-feedback-rating.html`:**

```html
<!--
@component-meta
name: Feedback Rating Card
category: Patient App
classes: feedback-rating-fieldset, feedback-rating-card
preline: false
description: Large tap-target rating option for the meal feedback screen (CARE-02). Three cards in a grid-cols-3 row. Radio input is sr-only; the label is the tap target. Selected state driven by :has(input:checked). Icon + text label always present.
-->

<fieldset class="feedback-rating-fieldset">
  <legend>Overall, how were your meals this week?</legend>
  <div class="grid grid-cols-3 gap-2">

    <label class="feedback-rating-card">
      <input type="radio" name="overall-rating" value="good" class="sr-only">
      <i class="fa-solid fa-thumbs-up"></i>
      <span>Good</span>
    </label>

    <label class="feedback-rating-card">
      <input type="radio" name="overall-rating" value="okay" class="sr-only">
      <i class="fa-solid fa-face-meh"></i>
      <span>Okay</span>
    </label>

    <label class="feedback-rating-card">
      <input type="radio" name="overall-rating" value="bad" class="sr-only">
      <i class="fa-solid fa-thumbs-down"></i>
      <span>Not good</span>
    </label>

  </div>
</fieldset>
```

---

**`pattern-library/components/patient-pref-image-card.html`:**

```html
<!--
@component-meta
name: Preference Image Card
category: Patient App
classes: pref-image-card, pref-image-card-img-wrap, pref-image-card-img, pref-image-card-check, pref-image-card-label, pref-image-card-img-wrap-plain
preline: false
description: Visual checkbox card for cultural food preference selection. Used in ONB-03 and PROFILE-01. Checkbox is sr-only; label is the full tap target. "No preference" uses pref-image-card-img-wrap-plain (icon instead of photo). Mutual exclusivity JS: src/scripts/components/pref-image-cards.js. Grid layout: grid grid-cols-2 gap-3 on the parent container.
-->

<div class="grid grid-cols-2 gap-3">

  <!-- Cuisine option -->
  <label class="pref-image-card">
    <input type="checkbox" name="food-pref" value="latin-american" class="sr-only">
    <div class="pref-image-card-img-wrap">
      <img
        class="pref-image-card-img"
        src="/src/assets/meals/pref-latin-american.jpg"
        alt="Latin American cuisine"
      >
      <div class="pref-image-card-check">
        <i class="fa-solid fa-check text-white text-sm"></i>
      </div>
    </div>
    <span class="pref-image-card-label">Latin American</span>
  </label>

  <!-- No preference option -->
  <label class="pref-image-card">
    <input type="checkbox" name="food-pref" value="no-preference" class="sr-only" id="pref-none">
    <div class="pref-image-card-img-wrap pref-image-card-img-wrap-plain">
      <i class="fa-regular fa-circle-dot text-gray-300 text-3xl"></i>
      <div class="pref-image-card-check">
        <i class="fa-solid fa-check text-white text-sm"></i>
      </div>
    </div>
    <span class="pref-image-card-label">No preference</span>
  </label>

</div>
```

### Step 4: Update COMPONENT-INDEX.md

Add a new **Patient App** section at the bottom of `pattern-library/COMPONENT-INDEX.md`, before the "Meal Assignment Grid (Kitchen-Specific)" section:

```markdown
---

## Patient App

| Component | File | Classes | Preline | Notes |
|---|---|---|---|---|
| Meal Card | `patient-meal-card.html` | `meal-card`, `meal-card-img`, `meal-card-body`, `meal-card-name`, `meal-card-day`, `meal-card-tags`, `meal-card-swap`, `meal-card.is-swapped` | no | Add `.is-swapped` after swap. Missing images show `bg-stone-100` placeholder. |
| Delivery Status Card | `patient-delivery-status-card.html` | `delivery-status-card`, `delivery-status-top`, `delivery-status-icon`, `delivery-status-label`, `delivery-status-timing`, `delivery-status-divider`, `delivery-summary`, `delivery-summary-label`, `delivery-summary-count`, `delivery-summary-list` | no | Three states (preparing/delivering/delivered) driven by JS URL param. |
| Message Bubble | `patient-message-bubble.html` | `message-bubble-out`, `message-bubble-in`, `message-sender-label`, `message-date-sep`, `message-timestamp`, `message-new-pill` | no | Right-align outgoing with `flex flex-col items-end`; left-align incoming with `items-start`. |
| Feedback Rating Card | `patient-feedback-rating.html` | `feedback-rating-fieldset`, `feedback-rating-card` | no | Uses `:has(input:checked)` for selected state. Three cards in `grid grid-cols-3 gap-2`. |
| Preference Image Card | `patient-pref-image-card.html` | `pref-image-card`, `pref-image-card-img-wrap`, `pref-image-card-img`, `pref-image-card-check`, `pref-image-card-label`, `pref-image-card-img-wrap-plain` | no | Mutual exclusivity JS: `src/scripts/components/pref-image-cards.js`. Grid: `grid grid-cols-2 gap-3`. |
```

## Expected Result
After this task:
- `components.css` has five new sections covering all patient-specific component classes with dark mode
- `src/scripts/components/pref-image-cards.js` exists
- Five pattern library files exist with `@component-meta` headers
- `COMPONENT-INDEX.md` has a new "Patient App" section with five rows
- No app pages exist yet — Tasks 04–09 build those

## Verification
- [ ] All five CSS sections present in `components.css` — confirm by searching for `.meal-card`, `.delivery-status-card`, `.message-bubble-out`, `.feedback-rating-card`, `.pref-image-card`
- [ ] `.delivery-status-card` uses `@apply card mx-4` (composition with existing `.card`) — not a duplicate card definition
- [ ] `.meal-card-swap` has `background: none; border: none; padding: 0;` (suppresses base button defaults)
- [ ] `.feedback-rating-card:has(input:checked)` is present (not a JS class-toggle fallback)
- [ ] `.message-new-pill` has `bottom: 136px` (not `bottom-[128px]` utility — raw CSS here)
- [ ] `.feedback-rating-fieldset` has `@apply border-0 p-0` to suppress default fieldset styling
- [ ] Dark mode variants present on all classes that use color, background, or border
- [ ] `src/scripts/components/pref-image-cards.js` exists
- [ ] All five pattern library files exist with `@component-meta` headers
- [ ] `COMPONENT-INDEX.md` has a new "Patient App" section with five component rows
- [ ] HTML in pattern library files uses semantic classes — no utility chains for component styling
- [ ] Nested border radii follow the decisions-log rule: `.meal-card` (`rounded-xl`) > `.meal-card-img` (`rounded-lg`) ✓
- [ ] `ANDREY-README.md` updated with new patient component classes (yes — Andrey needs the full class list for Angular templates)
- [ ] `src/data/_schema-notes.md` not affected

## Completion Report

After all verification passes, output:

```
## Completion Report — Task 03: Patient-Specific Components

- New semantic classes added to components.css: [full list]
- Existing classes modified: none
- Pattern library files created: [list of 5 files]
- Scripts created: src/scripts/components/pref-image-cards.js
- Judgment calls: [any]
- Dark mode added: yes
- ANDREY-README.md updated: yes
- Schema delta logged: not applicable
- Items deferred or incomplete: none
```

Then run:
```
git add -A
git commit -m "task 03: patient app component classes and pattern library entries"
```

## If Something Goes Wrong
- If `.delivery-status-card { @apply card mx-4; }` causes a build error because `card` is not resolved: confirm `components.css` is being processed after the `.card` class definition. Both live in the same file, so order matters — the `.card` definition must appear before `.delivery-status-card`. If needed, move the new patient sections to the very end of the file (after `.card` is defined).
- If `:has()` selector causes a CSS parse warning: it is valid in all modern browsers. Ignore warnings from older linters. Do not replace with a JS fallback.
- If `@apply border-0` inside `.feedback-rating-fieldset` conflicts with the global `fieldset` rule (which applies `border border-gray-200`): the class selector `.feedback-rating-fieldset` has higher specificity than the element selector `fieldset` and will win. No workaround needed.
