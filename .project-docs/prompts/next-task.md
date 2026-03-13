# Task 04: Onboarding Screens (ONB-01, ONB-02, ONB-03)

## Scope
App pages only. Three files created in `apps/patient/onboarding/`. No new CSS classes — all components were built in Tasks 01–03. No new partials.

## Context
First three screens a patient sees. The flow is linear: Welcome → Consent → Preferences → Meals (MEALS-01). All three screens use the mobile shell pattern, i18n bar, and onboarding progress indicator. No bottom nav on onboarding screens.

## Prerequisites
- Tasks 01, 02, 03 complete — all component classes and partials exist

## Files to Read First
- `src/styles/tokens/components.css` — confirm all classes referenced below exist
- `src/partials/patient-i18n-bar.html` — copy content verbatim into each screen
- `src/styles/tokens/` — confirm `--font-serif` token name (used for Lora headings)
- `src/vendor/fontawesome/` — confirm FA Pro v7.1.0 is present; use the correct `<link>` path
- `src/scripts/components/i18n.js` — confirm file path for script tag
- `src/scripts/components/pref-image-cards.js` — used on ONB-03 only
- `apps/patient/design/review-notes.md` — authoritative copy for all text strings
- `.project-docs/decisions-log.md` — active rules

## Shared HTML Structure (apply to all three files)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Screen Title] — Cena Health</title>
  <!-- Vite will process this in dev mode -->
  <link rel="stylesheet" href="/src/styles/main.css">
  <!-- FontAwesome Pro v7.1.0 -->
  <link rel="stylesheet" href="/src/vendor/fontawesome/css/all.min.css">
</head>
<body class="mobile-app">
  <div class="mobile-shell">

    <!-- i18n bar (copied from partial) -->
    [patient-i18n-bar.html content here]

    <!-- Screen content -->
    [screen-specific content]

  </div><!-- /.mobile-shell -->

  <!-- i18n script (all screens) -->
  <script src="/src/scripts/components/i18n.js"></script>
  <!-- Screen-specific scripts added below per screen -->
</body>
</html>
```

**Directory:** Create `apps/patient/onboarding/` before writing files.

---

## ONB-01: `apps/patient/onboarding/welcome.html`

**Title:** "Welcome — Cena Health"

### Content
```html
<main class="px-4 pt-20 pb-8">

  <!-- Wordmark -->
  <div class="flex justify-center mb-6">
    <img src="/src/assets/cena-wordmark.svg" alt="Cena Health" class="h-8">
  </div>

  <!-- Headline -->
  <h1 class="text-2xl text-center mb-1" style="font-family: var(--font-serif);">
    <span data-i18n-en="Welcome to Cena Health" data-i18n-es="Bienvenido a Cena Health">Welcome to Cena Health</span>
  </h1>
  <p class="text-sm text-gray-500 text-center mb-4">
    <span data-i18n-en="Your meals and care team are ready. Let's set up your account." data-i18n-es="Tus comidas y tu equipo de atención están listos. Configuremos tu cuenta.">Your meals and care team are ready. Let's set up your account.</span>
  </p>

  <!-- Progress -->
  <p class="onb-progress" aria-label="Step 1 of 3">
    <span data-i18n-en="Step" data-i18n-es="Paso">Step</span> 1
    <span data-i18n-en="of" data-i18n-es="de">of</span> 3
  </p>

  <!-- Form card -->
  <div class="card mx-0 mt-6">
    <div class="card-body">

      <!-- Password -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
          <span data-i18n-en="Create a password" data-i18n-es="Crea una contraseña">Create a password</span>
        </label>
        <div class="relative">
          <input
            id="password"
            type="password"
            autocomplete="new-password"
            aria-describedby="password-helper password-error"
            class="w-full pr-10"
          >
          <button
            type="button"
            class="btn-icon absolute right-2 top-1/2 -translate-y-1/2"
            aria-label="Show password"
            onclick="this.closest('div').querySelector('input').type = this.closest('div').querySelector('input').type === 'password' ? 'text' : 'password';"
          >
            <i class="fa-solid fa-eye" aria-hidden="true"></i>
          </button>
        </div>
        <p id="password-helper" class="text-xs text-gray-500 mt-1">
          <span data-i18n-en="Must be at least 8 characters" data-i18n-es="Debe tener al menos 8 caracteres">Must be at least 8 characters</span>
        </p>
        <p id="password-error" class="text-xs text-error-600 mt-1 hidden" aria-live="polite">
          <span data-i18n-en="Password must be at least 8 characters." data-i18n-es="La contraseña debe tener al menos 8 caracteres.">Password must be at least 8 characters.</span>
        </p>
      </div>

      <!-- Confirm password -->
      <div class="mt-4">
        <label for="password-confirm" class="block text-sm font-medium text-gray-700 mb-1">
          <span data-i18n-en="Confirm your password" data-i18n-es="Confirma tu contraseña">Confirm your password</span>
        </label>
        <div class="relative">
          <input
            id="password-confirm"
            type="password"
            autocomplete="new-password"
            aria-describedby="confirm-error"
            class="w-full pr-10"
          >
          <button
            type="button"
            class="btn-icon absolute right-2 top-1/2 -translate-y-1/2"
            aria-label="Show confirm password"
            onclick="this.closest('div').querySelector('input').type = this.closest('div').querySelector('input').type === 'password' ? 'text' : 'password';"
          >
            <i class="fa-solid fa-eye" aria-hidden="true"></i>
          </button>
        </div>
        <p id="confirm-error" class="text-xs text-error-600 mt-1 hidden" aria-live="polite">
          <span data-i18n-en="Passwords don't match. Try again." data-i18n-es="Las contraseñas no coinciden. Inténtalo de nuevo.">Passwords don't match. Try again.</span>
        </p>
      </div>

      <!-- Continue CTA -->
      <a href="/apps/patient/onboarding/consent.html" class="btn-primary w-full mt-6">
        <span data-i18n-en="Continue" data-i18n-es="Continuar">Continue</span>
      </a>

    </div><!-- /.card-body -->
  </div><!-- /.card -->

  <!-- Help text -->
  <p class="text-xs text-center text-gray-400 mt-4">
    <span data-i18n-en="Need help? Call us at" data-i18n-es="¿Necesitas ayuda? Llámanos al">Need help? Call us at</span>
    <a href="tel:+18002462458" class="text-link">1-800-246-2458</a>
  </p>

</main>
```

**Notes:**
- The wordmark asset path is `/src/assets/cena-wordmark.svg`. If the file doesn't exist, use the text fallback: `<span class="text-xl font-semibold text-primary-700" style="font-family: var(--font-serif);">Cena Health</span>`. Do not create the SVG file.
- Show/hide password toggle uses a minimal inline `onclick` — no separate JS file needed for this screen.
- The "Continue" CTA is an `<a>` not a `<button>` — it navigates to the next screen in the prototype.
- No form validation JS needed for this prototype screen.

---

## ONB-02: `apps/patient/onboarding/consent.html`

**Title:** "Your Information — Cena Health"

### Structure
Three sub-steps are rendered as three separate `<section>` elements shown/hidden by a small inline script (step counter). They are NOT separate pages.

### Content

```html
<main class="px-4 pt-20 pb-8">

  <!-- Back button -->
  <button
    type="button"
    class="btn-icon mb-2"
    aria-label="Back"
    id="consent-back"
  >
    <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
  </button>

  <!-- Progress -->
  <p class="onb-progress" aria-label="Step 2 of 3">
    <span data-i18n-en="Step" data-i18n-es="Paso">Step</span> 2
    <span data-i18n-en="of" data-i18n-es="de">of</span> 3
  </p>

  <!-- ===== Consent Step 1: HIPAA ===== -->
  <section id="consent-step-1" aria-labelledby="consent-1-heading">
    <p class="text-xs uppercase tracking-wide text-gray-500 mb-2">
      <span data-i18n-en="Step 1 of 3" data-i18n-es="Paso 1 de 3">Step 1 of 3</span>
    </p>
    <h1 id="consent-1-heading" class="text-2xl mb-2" style="font-family: var(--font-serif);">
      <span data-i18n-en="Your health information" data-i18n-es="Tu información de salud">Your health information</span>
    </h1>
    <p class="text-sm text-gray-700 mb-4">
      <span
        data-i18n-en="We'll share your health records with your care team so they can create the right meal plan for you. We keep your information private and secure."
        data-i18n-es="Compartiremos tu historial de salud con tu equipo de atención para que puedan crear el plan de comidas adecuado para ti. Mantenemos tu información privada y segura."
      >We'll share your health records with your care team so they can create the right meal plan for you. We keep your information private and secure.</span>
    </p>

    <!-- Read aloud button (disabled, prototype) -->
    <div class="relative inline-block mb-4">
      <button
        type="button"
        class="btn-outline w-full"
        disabled
        aria-disabled="true"
        aria-describedby="read-aloud-tip"
      >
        <i class="fa-solid fa-volume-high mr-2" aria-hidden="true"></i>
        <span data-i18n-en="Read aloud" data-i18n-es="Leer en voz alta">Read aloud</span>
      </button>
      <span id="read-aloud-tip" role="tooltip" class="absolute left-0 bottom-full mb-1 text-xs bg-gray-800 text-white rounded px-2 py-1 whitespace-nowrap pointer-events-none opacity-0 transition-opacity" aria-hidden="true">
        <span data-i18n-en="Coming soon" data-i18n-es="Próximamente">Coming soon</span>
      </span>
    </div>

    <!-- Expand full consent text -->
    <div class="hs-accordion mb-6" id="hipaa-accordion">
      <button
        type="button"
        class="hs-accordion-toggle text-sm text-primary-600 underline"
        aria-expanded="false"
        aria-controls="hipaa-accordion-body"
      >
        <span data-i18n-en="Read full text" data-i18n-es="Leer el texto completo">Read full text</span>
      </button>
      <div
        id="hipaa-accordion-body"
        class="hs-accordion-content overflow-hidden transition-[height] duration-300 hidden"
        role="region"
        aria-labelledby="hipaa-accordion"
      >
        <p class="text-sm text-gray-600 mt-3 leading-relaxed">
          This Notice of Privacy Practices describes how Cena Health may use and disclose your protected health information (PHI) to carry out treatment, payment, and health care operations. We are required by law to maintain the privacy of your PHI. Full notice available at <a href="#" class="text-link">cenahealth.com/privacy</a>.
        </p>
      </div>
    </div>

    <button type="button" class="btn-primary w-full" id="consent-1-agree">
      <span data-i18n-en="I agree" data-i18n-es="Acepto">I agree</span>
    </button>
    <p class="text-xs text-gray-400 text-center mt-3">
      <span
        data-i18n-en="By tapping 'I agree', you confirm you have read and understood the above."
        data-i18n-es="Al tocar 'Acepto', confirmas que has leído y comprendido lo anterior."
      >By tapping 'I agree', you confirm you have read and understood the above.</span>
    </p>
  </section>

  <!-- ===== Consent Step 2: Program ===== -->
  <section id="consent-step-2" aria-labelledby="consent-2-heading" class="hidden">
    <p class="text-xs uppercase tracking-wide text-gray-500 mb-2">
      <span data-i18n-en="Step 2 of 3" data-i18n-es="Paso 2 de 3">Step 2 of 3</span>
    </p>
    <h1 id="consent-2-heading" class="text-2xl mb-2" style="font-family: var(--font-serif);">
      <span data-i18n-en="How the program works" data-i18n-es="Cómo funciona el programa">How the program works</span>
    </h1>
    <p class="text-sm text-gray-700 mb-4">
      <span
        data-i18n-en="By joining, you agree to receive meals, care check-ins, and health support through Cena Health. You can leave the program at any time."
        data-i18n-es="Al unirte, aceptas recibir comidas, revisiones de atención y apoyo de salud a través de Cena Health. Puedes salir del programa en cualquier momento."
      >By joining, you agree to receive meals, care check-ins, and health support through Cena Health. You can leave the program at any time.</span>
    </p>

    <!-- Read aloud (same disabled pattern) -->
    <div class="relative inline-block mb-4">
      <button type="button" class="btn-outline w-full" disabled aria-disabled="true">
        <i class="fa-solid fa-volume-high mr-2" aria-hidden="true"></i>
        <span data-i18n-en="Read aloud" data-i18n-es="Leer en voz alta">Read aloud</span>
      </button>
    </div>

    <!-- Expand full program terms -->
    <div class="hs-accordion mb-6" id="program-accordion">
      <button
        type="button"
        class="hs-accordion-toggle text-sm text-primary-600 underline"
        aria-expanded="false"
        aria-controls="program-accordion-body"
      >
        <span data-i18n-en="Read full text" data-i18n-es="Leer el texto completo">Read full text</span>
      </button>
      <div
        id="program-accordion-body"
        class="hs-accordion-content overflow-hidden transition-[height] duration-300 hidden"
        role="region"
      >
        <p class="text-sm text-gray-600 mt-3 leading-relaxed">
          As a Cena Health program participant, you agree to receive prepared meals delivered to your registered address, participate in periodic care check-ins with your assigned care team, and share relevant health data to support your care plan. Participation is voluntary and you may withdraw at any time by contacting your care coordinator.
        </p>
      </div>
    </div>

    <button type="button" class="btn-primary w-full" id="consent-2-agree">
      <span data-i18n-en="I agree" data-i18n-es="Acepto">I agree</span>
    </button>
    <p class="text-xs text-gray-400 text-center mt-3">
      <span
        data-i18n-en="By tapping 'I agree', you confirm you have read and understood the above."
        data-i18n-es="Al tocar 'Acepto', confirmas que has leído y comprendido lo anterior."
      >By tapping 'I agree', you confirm you have read and understood the above.</span>
    </p>
  </section>

  <!-- ===== Consent Step 3: AVA (optional) ===== -->
  <section id="consent-step-3" aria-labelledby="consent-3-heading" class="hidden">
    <p class="text-xs uppercase tracking-wide text-gray-500 mb-2">
      <span data-i18n-en="Step 3 of 3" data-i18n-es="Paso 3 de 3">Step 3 of 3</span>
    </p>
    <h1 id="consent-3-heading" class="text-2xl mb-2" style="font-family: var(--font-serif);">
      <span data-i18n-en="Voice check-ins (optional)" data-i18n-es="Visitas de voz (opcional)">Voice check-ins (optional)</span>
    </h1>
    <p class="text-sm text-gray-700 mb-4">
      <span
        data-i18n-en="AVA is our automated health assistant. It can call you for quick check-ins between visits. This is optional — your meals and care continue either way."
        data-i18n-es="AVA es nuestra asistente de salud automatizada. Puede llamarte para revisiones rápidas entre visitas. Esto es opcional — tus comidas y atención continúan de cualquier manera."
      >AVA is our automated health assistant. It can call you for quick check-ins between visits. This is optional — your meals and care continue either way.</span>
    </p>

    <!-- AVA opt card (neutral bg — not warning) -->
    <div class="card border-stone-200 mb-6" style="background-color: var(--color-stone-50, #fafaf9);">
      <div class="card-body space-y-3">
        <label class="radio-label">
          <input type="radio" name="ava-consent" value="yes">
          <span data-i18n-en="Yes, I'd like AVA calls" data-i18n-es="Sí, quiero llamadas de AVA">Yes, I'd like AVA calls</span>
        </label>
        <label class="radio-label">
          <input type="radio" name="ava-consent" value="no" checked>
          <span data-i18n-en="No thanks" data-i18n-es="No, gracias">No thanks</span>
        </label>
      </div>
    </div>

    <a href="/apps/patient/onboarding/preferences.html" class="btn-primary w-full">
      <span data-i18n-en="Continue" data-i18n-es="Continuar">Continue</span>
    </a>
  </section>

</main>
```

### Inline consent navigation script (add before `</body>`)
```html
<script>
(function () {
  var step = 1;
  var steps = [
    document.getElementById('consent-step-1'),
    document.getElementById('consent-step-2'),
    document.getElementById('consent-step-3')
  ];

  function showStep(n) {
    steps.forEach(function (s, i) {
      s.classList.toggle('hidden', i !== n - 1);
    });
    step = n;
  }

  document.getElementById('consent-1-agree').addEventListener('click', function () { showStep(2); });
  document.getElementById('consent-2-agree').addEventListener('click', function () { showStep(3); });
  document.getElementById('consent-back').addEventListener('click', function () {
    if (step > 1) {
      showStep(step - 1);
    } else {
      window.location.href = '/apps/patient/onboarding/welcome.html';
    }
  });
})();
</script>
```

**Notes:**
- Preline `hs-accordion` is used for expand/collapse. Confirm Preline JS is imported. If not available, use a simple inline `onclick` to toggle the `hidden` class on the accordion body — do not leave a broken accordion.
- The tooltip on "Read aloud" is CSS-only (opacity: 0, shown on `:focus-within` on parent) — no JS needed. Add `:focus-within .tooltip-class { opacity: 1; }` as an inline `<style>` block if the `.relative` parent trick is used.
- AVA option: "No thanks" is pre-checked (default). This is intentional per review-notes — opt-in, not opt-out.
- The "Continue" CTA on step 3 navigates to ONB-03 as an `<a>` tag.

### Preline dependency
Consent accordion requires Preline JS. Add to `<head>` or before `</body>`:
```html
<script src="/node_modules/preline/dist/preline.js"></script>
```
Check if this path is correct by looking at `package.json` and existing pattern library files to see how other pages load Preline.

---

## ONB-03: `apps/patient/onboarding/preferences.html`

**Title:** "Your Preferences — Cena Health"

### Content

```html
<main class="px-4 pt-20 pb-8">

  <!-- Back button -->
  <a href="/apps/patient/onboarding/consent.html" class="btn-icon mb-2" aria-label="Back">
    <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
  </a>

  <!-- Progress -->
  <p class="onb-progress" aria-label="Step 3 of 3">
    <span data-i18n-en="Step" data-i18n-es="Paso">Step</span> 3
    <span data-i18n-en="of" data-i18n-es="de">of</span> 3
  </p>

  <!-- Heading -->
  <h1 class="text-2xl mb-1" style="font-family: var(--font-serif);">
    <span data-i18n-en="Let's personalize your experience" data-i18n-es="Personalicemos tu experiencia">Let's personalize your experience</span>
  </h1>
  <p class="text-sm text-gray-500 mb-6">
    <span data-i18n-en="You can always update these in your profile." data-i18n-es="Siempre puedes actualizarlos en tu perfil.">You can always update these in your profile.</span>
  </p>

  <!-- Section 1: Language preference -->
  <fieldset class="border-0 p-0 mb-6">
    <legend class="text-sm font-semibold text-gray-900 mb-3">
      <span data-i18n-en="What language do you prefer?" data-i18n-es="¿Qué idioma prefieres?">What language do you prefer?</span>
    </legend>
    <div class="grid grid-cols-2 gap-3">
      <label class="radio-label">
        <input type="radio" name="language" value="en" checked>
        <span>English</span>
      </label>
      <label class="radio-label">
        <input type="radio" name="language" value="es">
        <span>Español</span>
      </label>
    </div>
  </fieldset>

  <!-- Section 2: Food preferences -->
  <fieldset class="border-0 p-0 mb-6">
    <legend class="text-sm font-semibold text-gray-900 mb-1">
      <span data-i18n-en="What flavors do you enjoy?" data-i18n-es="¿Qué sabores te gustan?">What flavors do you enjoy?</span>
    </legend>
    <p class="text-xs text-gray-500 mb-3">
      <span data-i18n-en="Pick as many as you like. We'll rotate your meals to match." data-i18n-es="Elige los que quieras. Rotaremos tus comidas según tus preferencias.">Pick as many as you like. We'll rotate your meals to match.</span>
    </p>
    <div class="grid grid-cols-2 gap-3">
      <label class="pref-image-card">
        <input type="checkbox" name="food-pref" value="latin-american" class="sr-only">
        <div class="pref-image-card-img-wrap">
          <img class="pref-image-card-img" src="/src/assets/meals/pref-latin-american.jpg" alt="Latin American cuisine">
          <div class="pref-image-card-check"><i class="fa-solid fa-check text-white text-sm" aria-hidden="true"></i></div>
        </div>
        <span class="pref-image-card-label">
          <span data-i18n-en="Latin American" data-i18n-es="Latinoamericana">Latin American</span>
        </span>
      </label>
      <label class="pref-image-card">
        <input type="checkbox" name="food-pref" value="soul-food" class="sr-only">
        <div class="pref-image-card-img-wrap">
          <img class="pref-image-card-img" src="/src/assets/meals/pref-soul-food.jpg" alt="Soul food cuisine">
          <div class="pref-image-card-check"><i class="fa-solid fa-check text-white text-sm" aria-hidden="true"></i></div>
        </div>
        <span class="pref-image-card-label">
          <span data-i18n-en="Soul Food" data-i18n-es="Comida Sureña">Soul Food</span>
        </span>
      </label>
      <label class="pref-image-card">
        <input type="checkbox" name="food-pref" value="mediterranean" class="sr-only">
        <div class="pref-image-card-img-wrap">
          <img class="pref-image-card-img" src="/src/assets/meals/pref-mediterranean.jpg" alt="Mediterranean cuisine">
          <div class="pref-image-card-check"><i class="fa-solid fa-check text-white text-sm" aria-hidden="true"></i></div>
        </div>
        <span class="pref-image-card-label">
          <span data-i18n-en="Mediterranean" data-i18n-es="Mediterránea">Mediterranean</span>
        </span>
      </label>
      <label class="pref-image-card">
        <input type="checkbox" name="food-pref" value="asian" class="sr-only">
        <div class="pref-image-card-img-wrap">
          <img class="pref-image-card-img" src="/src/assets/meals/pref-asian.jpg" alt="Asian cuisine">
          <div class="pref-image-card-check"><i class="fa-solid fa-check text-white text-sm" aria-hidden="true"></i></div>
        </div>
        <span class="pref-image-card-label">
          <span data-i18n-en="Asian" data-i18n-es="Asiática">Asian</span>
        </span>
      </label>
    </div>
    <!-- No preference — below the grid, visually distinct -->
    <div class="mt-3">
      <label class="pref-image-card flex-row items-center gap-3">
        <input type="checkbox" name="food-pref" value="no-preference" id="pref-none" class="sr-only">
        <div class="pref-image-card-img-wrap pref-image-card-img-wrap-plain" style="width: 48px; height: 48px; flex-shrink: 0;">
          <i class="fa-regular fa-circle-dot text-gray-300 text-2xl" aria-hidden="true"></i>
          <div class="pref-image-card-check"><i class="fa-solid fa-check text-white text-xs" aria-hidden="true"></i></div>
        </div>
        <span class="pref-image-card-label text-left">
          <span data-i18n-en="No preference" data-i18n-es="Sin preferencia">No preference</span>
        </span>
      </label>
    </div>
  </fieldset>

  <!-- Section 3: Contact method -->
  <fieldset class="border-0 p-0 mb-6">
    <legend class="text-sm font-semibold text-gray-900 mb-1">
      <span data-i18n-en="How should we reach you?" data-i18n-es="¿Cómo debemos comunicarnos contigo?">How should we reach you?</span>
    </legend>
    <p class="text-xs text-gray-500 mb-3">
      <span data-i18n-en="Preferred contact method" data-i18n-es="Método de contacto preferido">Preferred contact method</span>
    </p>
    <div class="space-y-2">
      <label class="radio-label">
        <input type="radio" name="contact-method" value="phone">
        <span data-i18n-en="Phone call" data-i18n-es="Llamada telefónica">Phone call</span>
      </label>
      <label class="radio-label">
        <input type="radio" name="contact-method" value="text" checked>
        <span data-i18n-en="Text message" data-i18n-es="Mensaje de texto">Text message</span>
      </label>
      <label class="radio-label">
        <input type="radio" name="contact-method" value="app">
        <span data-i18n-en="App notifications only" data-i18n-es="Solo notificaciones de la app">App notifications only</span>
      </label>
    </div>
  </fieldset>

  <!-- Section 4: Best times -->
  <fieldset class="border-0 p-0 mb-8">
    <legend class="text-sm font-semibold text-gray-900 mb-3">
      <span data-i18n-en="Best times to reach you" data-i18n-es="Mejores horarios para contactarte">Best times to reach you</span>
    </legend>
    <div class="space-y-2">
      <label class="checkbox-label">
        <input type="checkbox" name="best-times" value="morning">
        <span data-i18n-en="Morning (8am–12pm)" data-i18n-es="Mañana (8am–12pm)">Morning (8am–12pm)</span>
      </label>
      <label class="checkbox-label">
        <input type="checkbox" name="best-times" value="afternoon" checked>
        <span data-i18n-en="Afternoon (12pm–5pm)" data-i18n-es="Tarde (12pm–5pm)">Afternoon (12pm–5pm)</span>
      </label>
      <label class="checkbox-label">
        <input type="checkbox" name="best-times" value="evening">
        <span data-i18n-en="Evening (5pm–8pm)" data-i18n-es="Noche (5pm–8pm)">Evening (5pm–8pm)</span>
      </label>
    </div>
  </fieldset>

  <!-- Error (hidden by default) -->
  <div class="alert alert-error mb-4 hidden" role="alert" aria-live="assertive">
    <span data-i18n-en="We couldn't save your preferences. Try again?" data-i18n-es="No pudimos guardar tus preferencias. ¿Intentar de nuevo?">We couldn't save your preferences. Try again?</span>
  </div>

  <!-- CTA -->
  <a href="/apps/patient/meals/index.html" class="btn-primary w-full">
    <span data-i18n-en="All done" data-i18n-es="Listo">All done</span>
  </a>
  <p class="text-xs text-center text-gray-400 mt-3">
    <a href="/apps/patient/meals/index.html" class="text-link text-gray-400">
      <span data-i18n-en="Skip for now" data-i18n-es="Omitir por ahora">Skip for now</span>
    </a>
    —
    <span data-i18n-en="we'll use your defaults and you can update anytime." data-i18n-es="usaremos tus valores predeterminados y puedes actualizarlos en cualquier momento.">we'll use your defaults and you can update anytime.</span>
  </p>

</main>
```

**Notes:**
- The "No preference" card uses a `flex-row` utility to override the default `flex-col` of `.pref-image-card` for the inline layout. This is a one-off layout tweak on a single element — acceptable as a layout utility in HTML per architecture rules.
- `pref-image-cards.js` handles mutual exclusivity between "No preference" and the cuisine options. Must be included before `</body>`.

---

## Verification
- [ ] `apps/patient/onboarding/` directory created with three files: `welcome.html`, `consent.html`, `preferences.html`
- [ ] All three use `<body class="mobile-app">` and `<div class="mobile-shell">`
- [ ] i18n bar partial is included on all three screens (content copied from `src/partials/patient-i18n-bar.html`)
- [ ] `i18n.js` script tag present on all three screens
- [ ] No bottom nav on any of the three screens (onboarding only)
- [ ] `onb-progress` used correctly on all three screens with correct step numbers and `aria-label`
- [ ] ONB-01: password show/hide toggle works; "Continue" links to `consent.html`
- [ ] ONB-02: three sub-steps shown/hidden by inline JS; back button on step 1 goes to `welcome.html`; AVA "No thanks" is pre-checked; "Continue" on step 3 goes to `preferences.html`
- [ ] ONB-02: "Read aloud" button is disabled with `disabled` + `aria-disabled="true"` on both steps 1 and 2
- [ ] ONB-02: AVA opt card uses stone background (not warning yellow)
- [ ] ONB-03: "No preference" is below the 2×2 grid, not inside it
- [ ] ONB-03: `pref-image-cards.js` script included
- [ ] ONB-03: "All done" CTA and "Skip for now" link both navigate to `/apps/patient/meals/index.html`
- [ ] All `data-i18n-en` / `data-i18n-es` attributes present on every text node
- [ ] All images use correct asset paths (`/src/assets/meals/pref-*.jpg`); if files are missing, `bg-stone-100` on wrapper is visible instead of broken image icon
- [ ] No new semantic classes created — only existing classes used
- [ ] No utility chains used for component styling (layout utilities in HTML are acceptable)
- [ ] Preline loaded on ONB-02 (accordion); check how other HTML pages in the project load it

## Completion Report

After all verification passes, output:

```
## Completion Report — Task 04: Onboarding Screens

- Files created: apps/patient/onboarding/welcome.html, consent.html, preferences.html
- New CSS classes added: none
- Deviations from spec: [any judgment calls]
- Preline loaded via: [path used]
- Wordmark: [SVG found at path / text fallback used]
- Items deferred or incomplete: none
```

Then run:
```
git add -A
git commit -m "task 04: patient app onboarding screens (ONB-01, 02, 03)"
```

## If Something Goes Wrong
- If Preline accordion on ONB-02 doesn't initialize: check how other HTML pages in the project import Preline JS (look at `pattern-library/components/` files that use Preline). Mirror that exact import pattern.
- If `pref-image-card:has(input:checked)` doesn't apply in the browser: `:has()` requires a modern browser. For the prototype, this is acceptable. Do not add a JS fallback.
- If the `mobile-shell` max-width isn't constraining: confirm `<body class="mobile-app">` is set (not just the inner div).
- If preference images are all broken: add `style="background-color: var(--color-stone-100, #f5f5f4);"` to the `.pref-image-card-img-wrap` elements as an inline fallback.
