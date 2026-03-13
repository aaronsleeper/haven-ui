# Task: Patient Delivery Status Screen (MEALS-02)
_Generated: 2026-03-12_
_App: patient_

---

## Scope Classification

**Work type:** App only — composing existing patterns; no new components.

**Patterns being used (all verified in components.css):**
- `mobile-shell`, `mobile-app` — body/wrapper
- `mobile-i18n-bar`, `mobile-i18n-toggle` — language bar partial
- `mobile-bottom-nav`, `mobile-bottom-nav-tab` — nav partial
- `delivery-status-card`, `delivery-status-top`, `delivery-status-icon`, `delivery-status-label`, `delivery-status-timing`, `delivery-status-divider`, `delivery-summary`, `delivery-summary-label`, `delivery-summary-count`, `delivery-summary-list` — main status card
- `card`, `card-body` — issue report card
- `alert-banner` — full-bleed banner (established in MEALS-01 QA)
- `btn-outline`, `btn-primary`, `btn-icon` — buttons
- `empty-state`, `empty-state-icon` — fallback state
- `text-link` — care team link

**No new semantic classes needed.** If a gap is found during audit, stop and flag it.

---

## Pre-Build Audit

Before writing any HTML:

1. Read `src/styles/tokens/components.css` — confirm all class names above exist exactly as written. Note the `@apply` values for `delivery-status-card` and `card`.
2. Read `src/partials/patient-i18n-bar.html` and `src/partials/patient-bottom-nav.html` — copy verbatim into the new page.
3. Read `apps/patient/meals/index.html` — use as structural reference for mobile shell, head, script loading, and bottom nav active tab pattern.
4. Read `.project-docs/decisions-log.md` — extract every **"Rule to follow in future prompts"** entry. List them before proceeding and flag which apply here.

---

## Prompt 1: Build `apps/patient/deliveries/index.html`

Build the delivery status screen for the Cena Health patient app.

### File to create
`apps/patient/deliveries/index.html`

### Shell setup
- `<body class="mobile-app">` + `<div class="mobile-shell pb-[64px]">`
- Copy i18n bar verbatim from `src/partials/patient-i18n-bar.html`
- Copy bottom nav verbatim from `src/partials/patient-bottom-nav.html`, set "Delivery" tab as active (second tab)
- Title: `"Delivery — Cena Health"`

### Page structure (top to bottom)

**1. Header zone** — `<div class="px-4 pt-20 pb-4">`
- `<h1>` with `style="font-family: var(--font-serif);"` — "Delivery"
- `<p class="text-sm text-gray-500 mt-1">` — "Expected Thursday, March 19"

**2. Delivery status card** — three prototype state variants driven by body class

The card structure is the same for all states; only the icon, label, and timing text change. Use three sibling versions of the card, one per state, toggled by JS state class (same pattern as MEALS-01 banners).

Add classes `status-preparing`, `status-delivering`, `status-delivered` to each card div respectively.

**Preparing state** (default — no URL param):
```html
<div class="delivery-status-card status-preparing">
  <div class="delivery-status-top">
    <div class="delivery-status-icon">
      <i class="fa-solid fa-bowl-food text-primary-500" aria-hidden="true"></i>
    </div>
    <p class="delivery-status-label">
      <span data-i18n-en="Getting your meals ready" data-i18n-es="Preparando tus comidas">Getting your meals ready</span>
    </p>
    <p class="delivery-status-timing">
      <span data-i18n-en="Arriving between 11am and 1pm" data-i18n-es="Llegando entre las 11am y 1pm">Arriving between 11am and 1pm</span>
    </p>
  </div>
  <div class="delivery-status-divider"></div>
  <div class="delivery-summary">
    <p class="delivery-summary-label">
      <span data-i18n-en="What's coming" data-i18n-es="Lo que viene">What's coming</span>
    </p>
    <p class="delivery-summary-count">
      <span data-i18n-en="5 meals · Mon – Fri" data-i18n-es="5 comidas · Lun – Vie">5 meals · Mon – Fri</span>
    </p>
    <ul class="delivery-summary-list mt-2">
      <li>Chicken Verde Rice Bowl</li>
      <li>Black Bean Tacos</li>
      <li>Lemon Herb Salmon</li>
      <li>Turkey Sofrito Bowl</li>
      <li>Veggie Stir-Fry</li>
    </ul>
    <a href="/apps/patient/meals/index.html?state=confirmed" class="text-link text-sm mt-2 block">
      <span data-i18n-en="See all meals" data-i18n-es="Ver todas las comidas">See all meals</span>
    </a>
  </div>
</div>
```

**Out for delivery state** (`?state=delivering` — `body.state-delivering`):
Same structure, different icon/label/timing:
- Icon: `fa-solid fa-truck-fast text-warning-500`
- Label: "On the way"
- Timing: "Arriving between 11am and 1pm"

**Delivered state** (`?state=delivered` — `body.state-delivered`):
- Icon: `fa-solid fa-circle-check text-success-500`
- Label: "Delivered"
- Timing: "Delivered at 12:34pm"

**3. Issue report card** — `<div class="px-4 mt-4">`

Three internal states managed by JS class toggling on the card itself (`.is-expanded`, `.is-submitted`). Default shows only the report button; expanded shows the form; submitted shows confirmation.

```html
<div class="card" id="issue-card">

  <!-- Default: report button -->
  <div class="card-body issue-default">
    <p class="text-sm font-semibold text-gray-700 mb-2">
      <span data-i18n-en="Something wrong?" data-i18n-es="¿Algo salió mal?">Something wrong?</span>
    </p>
    <button class="btn-outline w-full" id="btn-report-issue">
      <span data-i18n-en="Report an issue" data-i18n-es="Reportar un problema">Report an issue</span>
    </button>
  </div>

  <!-- Expanded: issue form (hidden by default) -->
  <div class="card-body issue-expanded" style="display:none;">
    <p class="text-sm font-semibold text-gray-700 mb-3">
      <span data-i18n-en="What went wrong?" data-i18n-es="¿Qué salió mal?">What went wrong?</span>
    </p>
    <div class="space-y-2 mb-3">
      <button class="btn-outline w-full issue-type-btn" data-issue="not-delivered">
        <span data-i18n-en="Meals not delivered" data-i18n-es="Comidas no entregadas">Meals not delivered</span>
      </button>
      <button class="btn-outline w-full issue-type-btn" data-issue="wrong-meals">
        <span data-i18n-en="Wrong meals" data-i18n-es="Comidas incorrectas">Wrong meals</span>
      </button>
      <button class="btn-outline w-full issue-type-btn" data-issue="damaged">
        <span data-i18n-en="Damaged packaging" data-i18n-es="Empaque dañado">Damaged packaging</span>
      </button>
      <button class="btn-outline w-full issue-type-btn" data-issue="other">
        <span data-i18n-en="Something else" data-i18n-es="Otra cosa">Something else</span>
      </button>
    </div>
    <textarea rows="3" placeholder="Tell us more (optional)" class="w-full mb-3" aria-label="Additional details"></textarea>
    <div class="flex gap-2">
      <button class="btn-outline flex-1" id="btn-cancel-issue">
        <span data-i18n-en="Cancel" data-i18n-es="Cancelar">Cancel</span>
      </button>
      <button class="btn-primary flex-1" id="btn-submit-issue">
        <span data-i18n-en="Submit report" data-i18n-es="Enviar reporte">Submit report</span>
      </button>
    </div>
  </div>

  <!-- Submitted: confirmation (hidden by default) -->
  <div class="card-body issue-submitted" style="display:none;">
    <div class="flex items-center gap-3">
      <i class="fa-solid fa-circle-check text-success-500 text-xl" aria-hidden="true"></i>
      <p class="text-sm text-gray-700">
        <span data-i18n-en="Issue reported. Your care team will follow up." data-i18n-es="Problema reportado. Tu equipo de cuidado te contactará.">Issue reported. Your care team will follow up.</span>
      </p>
    </div>
  </div>

</div>
```

**4. Care team link** — `<p class="text-center text-sm mt-4 mb-6">`
```html
<a href="/apps/patient/care-team/messages.html" class="text-link">
  <span data-i18n-en="Questions? Message your care team" data-i18n-es="¿Preguntas? Escribe a tu equipo de cuidado">Questions? Message your care team</span>
</a>
```

### State-driven CSS

Add the following under a `/* Delivery screen state variants */` comment in `src/styles/tokens/components.css`. Follow the `@apply block; display: none;` tree-shaking pattern from MEALS-01:

```css
/* Delivery screen state variants */
.status-preparing { @apply block; }
.status-delivering { @apply block; display: none; }
.status-delivered { @apply block; display: none; }

.state-delivering .status-preparing { @apply block; display: none; }
.state-delivering .status-delivering { @apply block; display: block; }

.state-delivered .status-preparing { @apply block; display: none; }
.state-delivered .status-delivered { @apply block; display: block; }
```

### Scripts
- `<script src="/src/scripts/components/i18n.js"></script>`
- `<script src="/src/scripts/components/delivery.js"></script>`
- `<script src="/src/scripts/main.js" type="module"></script>` — last

### Known Constraints
- **Never `@apply` a semantic class inside another semantic class.**
- **No `<script>` blocks in HTML.** All JS in `src/scripts/`.
- **Raw CSS rules in `components.css` must start with `@apply block;`** if they contain no other `@apply` directive (tree-shaking prevention).
- **Semantic classes only in HTML** — layout utilities (`px-4`, `mt-4`, `flex`, `gap-2`, `w-full`) are fine in the page template.

---

## Prompt 2: Build `src/scripts/components/delivery.js`

Create `src/scripts/components/delivery.js`.

### State management

```js
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const state = params.get('state');
  if (state) document.body.classList.add(`state-${state}`);
});
```

### Issue card interaction

Three-state toggle on `#issue-card`: default → expanded → submitted.

```js
const issueCard = document.getElementById('issue-card');
const issueDefault = issueCard?.querySelector('.issue-default');
const issueExpanded = issueCard?.querySelector('.issue-expanded');
const issueSubmitted = issueCard?.querySelector('.issue-submitted');

function showIssueState(state) {
  issueDefault.style.display = state === 'default' ? '' : 'none';
  issueExpanded.style.display = state === 'expanded' ? '' : 'none';
  issueSubmitted.style.display = state === 'submitted' ? '' : 'none';
}

document.getElementById('btn-report-issue')?.addEventListener('click', () => {
  showIssueState('expanded');
});

document.getElementById('btn-cancel-issue')?.addEventListener('click', () => {
  showIssueState('default');
});

document.getElementById('btn-submit-issue')?.addEventListener('click', () => {
  showIssueState('submitted');
});

// Issue type buttons — visual selected state
document.querySelectorAll('.issue-type-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.issue-type-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});
```

The `.active` class on `.btn-outline` should show a selected state. Add this to `components.css` under the delivery state variants comment:

```css
.btn-outline.active {
  @apply bg-primary-50 border-primary-500 text-primary-700;
  @apply dark:bg-primary-900/20 dark:border-primary-600 dark:text-primary-400;
}
```

### Known Constraints
- No inline scripts in HTML.
- `delivery.js` loads before `main.js` — no Preline dependencies needed on this screen.

---

## Verification

After both prompts complete, verify at `http://localhost:5173/apps/patient/deliveries/index.html`:

- [ ] Default state: "Getting your meals ready" card visible, delivering/delivered cards hidden
- [ ] `?state=delivering`: truck icon and "On the way" label visible, other states hidden
- [ ] `?state=delivered`: check icon and "Delivered" label visible, other states hidden
- [ ] Meal summary list shows all 5 meals
- [ ] "See all meals" link points to meals screen with `?state=confirmed`
- [ ] Issue card: default shows report button only
- [ ] Clicking "Report an issue" reveals the form, hides the button section
- [ ] Selecting an issue type highlights it with `.active` style
- [ ] Clicking "Submit report" shows confirmation, hides form
- [ ] Clicking "Cancel" returns to default state
- [ ] Care team link renders at bottom
- [ ] Bottom nav renders with Delivery tab active
- [ ] i18n toggle works on all strings
- [ ] No utility class chains on component elements
- [ ] No `<script>` blocks in HTML
- [ ] `src/scripts/components/delivery.js` exists
- [ ] New CSS rules added under `/* Delivery screen state variants */` in `components.css`
- [ ] Dark mode: not applicable
- [ ] No new pattern library files needed
- [ ] ANDREY-README.md: not applicable

---

## Completion Report

After verification passes, output:

```
## Completion Report — Patient Delivery Status Screen (MEALS-02)

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
git commit -m "feat(patient): add delivery status screen (MEALS-02) with issue reporting"
```

Then output:

---
**View your result:**
- Default: http://localhost:5173/apps/patient/deliveries/index.html
- Out for delivery: http://localhost:5173/apps/patient/deliveries/index.html?state=delivering
- Delivered: http://localhost:5173/apps/patient/deliveries/index.html?state=delivered
---
