# Task: Patient Profile Screen (PAT-PROFILE-01)
_Generated: 2026-03-12_
_App: patient_

---

## Scope Classification

**Work type:** App page + CSS additions.

**Patterns being used (all verified in components.css):**
- `mobile-shell`, `mobile-app` — body/wrapper
- `mobile-i18n-bar`, `mobile-i18n-toggle` — language bar
- `mobile-bottom-nav`, `mobile-bottom-nav-tab` — bottom nav
- `pref-row`, `pref-row-indicator`, `pref-row-indicator--circle`, `pref-row-indicator--square`, `pref-row-label` — editable preference controls
- `pref-image-card`, `pref-image-card-img-wrap`, `pref-image-card-check`, `pref-image-card-label` — cuisine image selectors
- `card`, `card-body` — section grouping
- `sticky-footer`, `sticky-footer-inner`, `sticky-footer-actions` — save footer
- `btn-primary` — save button
- `alert`, `alert-error` — error state

**New semantic classes needed:** `profile-section-heading`, `profile-field-row`, `profile-field-label`, `profile-field-value`, `profile-danger-row`

Flag any gap found during audit before writing HTML.

---

## Pre-Build Audit

Before writing any HTML or CSS:

1. Read `src/styles/tokens/components.css` — confirm all class names in Scope Classification exist. If any are missing, stop and report which ones.
2. Read `apps/patient/onboarding/preferences.html` in full — copy pref-row and pref-image-card markup verbatim; do not paraphrase or reconstruct from memory.
3. Read `apps/patient/care-team/messages.html` — copy the bottom nav block verbatim.
4. Read `.project-docs/decisions-log.md` — extract every **"Rule to follow in future prompts"** entry. List which apply to this task.

---

## Prompt 1: Add new semantic classes to `src/styles/tokens/components.css`

Append the following section at the end of the file, after all existing rules. Each class uses `@apply` — no raw-CSS-only rules without a no-op `@apply block;`.

```css
/* ============================================================
   PROFILE SCREEN
   ============================================================ */

/* Section heading rendered above each grouped card */
.profile-section-heading {
    @apply block text-xs font-semibold uppercase tracking-wide text-gray-400 px-1 mb-2 mt-6;
}

/* Read-only display row for personal info fields */
.profile-field-row {
    @apply flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0;
    @apply dark:border-neutral-800;
}

.profile-field-label {
    @apply text-sm text-gray-500;
    @apply dark:text-neutral-400;
}

.profile-field-value {
    @apply text-sm font-medium text-gray-900 text-right;
    @apply dark:text-white;
}

/* Destructive action row (e.g. sign out) */
.profile-danger-row {
    @apply flex items-center justify-between py-3 cursor-pointer;
    @apply hover:bg-red-50 dark:hover:bg-red-950/30;
    @apply rounded-lg px-2 -mx-2;
}
```

Do NOT modify any existing rules. Only append this section.

---

## Prompt 2: Create `apps/patient/profile/index.html`

Create the `profile/` directory if it does not exist.

### Shell setup
- `<body class="mobile-app">` with `<div class="mobile-shell pb-32">`
- i18n bar: copy verbatim from `messages.html`
- Bottom nav: copy verbatim from `messages.html`, set Profile tab active (fourth tab, `fa-circle-user`). Remove active class and aria-current from Care Team tab.
- Title: `"Profile — Cena Health"`

### Head block
Match `messages.html` exactly — same stylesheet and FontAwesome links, no other changes.

### Page structure

All content inside `<main class="px-4 pt-20 pb-8">`.

**Header**
```html
<div class="flex items-center gap-4 mb-2">
  <div class="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
    <i class="fa-solid fa-circle-user text-primary-500 text-3xl" aria-hidden="true"></i>
  </div>
  <div>
    <h1 class="text-lg font-semibold text-gray-900" style="font-family: var(--font-serif);">
      <span data-i18n-en="Maria Gonzalez" data-i18n-es="Maria Gonzalez">Maria Gonzalez</span>
    </h1>
    <p class="text-sm text-gray-500">
      <span data-i18n-en="Patient since January 2026" data-i18n-es="Paciente desde enero de 2026">Patient since January 2026</span>
    </p>
  </div>
</div>
```

**Section 1 — Personal info** (read-only)
```html
<p class="profile-section-heading">
  <span data-i18n-en="Personal Info" data-i18n-es="Información personal">Personal Info</span>
</p>
<div class="card">
  <div class="card-body">
    <div class="profile-field-row">
      <span class="profile-field-label" data-i18n-en="Name" data-i18n-es="Nombre">Name</span>
      <span class="profile-field-value">Maria Gonzalez</span>
    </div>
    <div class="profile-field-row">
      <span class="profile-field-label" data-i18n-en="Date of birth" data-i18n-es="Fecha de nacimiento">Date of birth</span>
      <span class="profile-field-value">March 4, 1968</span>
    </div>
    <div class="profile-field-row">
      <span class="profile-field-label" data-i18n-en="Phone" data-i18n-es="Teléfono">Phone</span>
      <span class="profile-field-value">(619) 555-0142</span>
    </div>
    <div class="profile-field-row">
      <span class="profile-field-label" data-i18n-en="Address" data-i18n-es="Dirección">Address</span>
      <span class="profile-field-value">1847 Euclid Ave, San Diego, CA</span>
    </div>
  </div>
</div>
```

**Section 2 — Dietary preferences** (editable)

Copy the food flavor `<fieldset>` verbatim from `apps/patient/onboarding/preferences.html` (the one with 4 `pref-image-card` labels + "No preference" pref-row). Pre-check `latin-american` and `mediterranean` inputs.

Wrap in:
```html
<p class="profile-section-heading">
  <span data-i18n-en="Dietary Preferences" data-i18n-es="Preferencias alimentarias">Dietary Preferences</span>
</p>
<div class="card">
  <div class="card-body">
    <!-- verbatim food flavor fieldset from preferences.html -->
  </div>
</div>
```

**Section 3 — Communication** (editable)

Copy the language, contact method, and best times `<fieldset>` blocks verbatim from `preferences.html`. Pre-set:
- Language: Spanish (`es`) selected
- Contact method: Text message (`text`) selected
- Best times: Afternoon (`afternoon`) selected

Wrap in:
```html
<p class="profile-section-heading">
  <span data-i18n-en="Communication" data-i18n-es="Comunicación">Communication</span>
</p>
<div class="card">
  <div class="card-body">
    <!-- verbatim language fieldset -->
    <!-- verbatim contact method fieldset -->
    <!-- verbatim best times fieldset -->
  </div>
</div>
```

**Section 4 — Notifications** (editable)
```html
<p class="profile-section-heading">
  <span data-i18n-en="Notifications" data-i18n-es="Notificaciones">Notifications</span>
</p>
<div class="card">
  <div class="card-body">
    <fieldset class="border-0 p-0">
      <legend class="sr-only" data-i18n-en="Notification preferences" data-i18n-es="Preferencias de notificación">Notification preferences</legend>
      <div class="space-y-2">
        <label class="pref-row">
          <input type="checkbox" name="notif" value="delivery" checked class="sr-only">
          <div class="pref-row-indicator pref-row-indicator--square" aria-hidden="true"></div>
          <span class="pref-row-label" data-i18n-en="Delivery reminders" data-i18n-es="Recordatorios de entrega">Delivery reminders</span>
        </label>
        <label class="pref-row">
          <input type="checkbox" name="notif" value="messages" checked class="sr-only">
          <div class="pref-row-indicator pref-row-indicator--square" aria-hidden="true"></div>
          <span class="pref-row-label" data-i18n-en="New messages from care team" data-i18n-es="Nuevos mensajes de tu equipo">New messages from care team</span>
        </label>
        <label class="pref-row">
          <input type="checkbox" name="notif" value="feedback" class="sr-only">
          <div class="pref-row-indicator pref-row-indicator--square" aria-hidden="true"></div>
          <span class="pref-row-label" data-i18n-en="Meal feedback reminders" data-i18n-es="Recordatorios de comentarios">Meal feedback reminders</span>
        </label>
        <label class="pref-row">
          <input type="checkbox" name="notif" value="plan-updates" checked class="sr-only">
          <div class="pref-row-indicator pref-row-indicator--square" aria-hidden="true"></div>
          <span class="pref-row-label" data-i18n-en="Meal plan updates" data-i18n-es="Actualizaciones del plan de comidas">Meal plan updates</span>
        </label>
      </div>
    </fieldset>
  </div>
</div>
```

**Section 5 — Account**
```html
<p class="profile-section-heading">
  <span data-i18n-en="Account" data-i18n-es="Cuenta">Account</span>
</p>
<div class="card">
  <div class="card-body">
    <div class="profile-danger-row" role="button" tabindex="0" aria-label="Sign out">
      <span class="text-sm font-medium text-red-600" data-i18n-en="Sign out" data-i18n-es="Cerrar sesión">Sign out</span>
      <i class="fa-solid fa-right-from-bracket text-red-400" aria-hidden="true"></i>
    </div>
  </div>
</div>
```

**Sticky footer — Save changes**
```html
<div class="sticky-footer">
  <div class="sticky-footer-inner">
    <div class="sticky-footer-actions">
      <button class="btn-primary w-full" id="btn-save-profile"
        data-saved-label="Saved!"
        data-i18n-data-saved-label-en="Saved!"
        data-i18n-data-saved-label-es="¡Guardado!">
        <span data-i18n-en="Save changes" data-i18n-es="Guardar cambios">Save changes</span>
      </button>
    </div>
  </div>
</div>
```

Place the sticky footer inside `.mobile-shell`, after the closing `</main>` tag.

### Scripts (in order)
```html
<script src="/src/scripts/components/i18n.js"></script>
<script src="/src/scripts/components/pref-image-cards.js"></script>
<script src="/src/scripts/components/profile.js"></script>
<script src="/src/scripts/main.js" type="module"></script>
```

### Known Constraints
- No `<script>` blocks in HTML.
- Never `@apply` a semantic class inside another semantic class.
- Any raw-CSS-only rule in `components.css` must begin with `@apply block;`.
- `card-body > * + *` has a spacing rule — `profile-field-row` elements are separated by `border-b`, not margin. If unexpected vertical gaps appear between field rows, add `profile-field-row` to the `:not()` exclusion list in the `card-body > * + *` rule.

---

## Prompt 3: Create `src/scripts/components/profile.js`

```js
/**
 * Profile screen interactions
 * - Save button: 2-second "Saved!" confirmation, then restore
 * - Sign out: redirect to onboarding welcome
 */

document.addEventListener('DOMContentLoaded', () => {
  // Save changes
  const saveBtn = document.getElementById('btn-save-profile');
  saveBtn?.addEventListener('click', () => {
    const originalHTML = saveBtn.innerHTML;
    const savedLabel = saveBtn.getAttribute('data-saved-label') || 'Saved!';
    saveBtn.textContent = savedLabel;
    saveBtn.disabled = true;
    setTimeout(() => {
      saveBtn.innerHTML = originalHTML;
      saveBtn.disabled = false;
    }, 2000);
  });

  // Sign out — click and keyboard
  const signOutBtn = document.querySelector('[aria-label="Sign out"]');
  signOutBtn?.addEventListener('click', () => {
    window.location.href = '/apps/patient/onboarding/welcome.html';
  });
  signOutBtn?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.location.href = '/apps/patient/onboarding/welcome.html';
    }
  });
});
```

---

## Verification

Verify at `http://localhost:5173/apps/patient/profile/index.html`:

- [ ] Page loads without console errors
- [ ] Header: avatar circle + name + "Patient since" subtitle render correctly
- [ ] Personal info section: 4 field rows (Name, DOB, Phone, Address) with label/value layout
- [ ] Dietary preferences: 4 cuisine image cards; Latin American and Mediterranean pre-checked (teal overlay visible)
- [ ] "No preference" pref-row present below image cards
- [ ] Communication section: Language (Spanish pre-selected), Contact method (Text pre-selected), Best times (Afternoon pre-selected)
- [ ] Notifications section: Delivery, Messages, Plan updates pre-checked; Feedback reminder unchecked
- [ ] Account section: Sign out row renders in red with right-bracket icon
- [ ] Clicking Sign out navigates to `/apps/patient/onboarding/welcome.html`
- [ ] Save button: clicking shows "Saved!" for ~2 seconds, then restores original label
- [ ] Sticky footer visible and does not overlap bottom nav
- [ ] Bottom nav: Profile tab active; no other tab marked active
- [ ] i18n toggle switches all `data-i18n-en/es` strings
- [ ] pref-image-cards mutual exclusivity works (checking "No preference" unchecks images and vice versa)
- [ ] No utility class chains on component elements (only semantic classes + layout utilities)
- [ ] No `<script>` blocks in HTML
- [ ] `src/scripts/components/profile.js` exists

---

## Completion Report

After verification passes, output:

```
## Completion Report — Patient Profile Screen (PAT-PROFILE-01)

- New semantic classes added to components.css: [list]
- Existing classes modified: [list, or "none"]
- Pattern library files created or updated: [list, or "none"]
- Judgment calls: [list, or "none"]
- Dark mode added: yes — profile-field-row, profile-field-label, profile-field-value, profile-danger-row
- ANDREY-README.md updated: not applicable
- Schema delta logged: not applicable
- Items deferred or incomplete: [list, or "none"]
```

---

## Final Step

```bash
git add -A
git commit -m "feat(patient): add profile screen (PAT-PROFILE-01) with editable preferences and save flow"
```

Then output:

---
**View your result:**
- http://localhost:5173/apps/patient/profile/index.html
---
