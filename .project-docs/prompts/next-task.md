# PAT-DASHBOARD-02: Patient Dashboard Polish Pass

_Generated: 2026-03-13_
_App: patient_

---

## Scope Classification

**Work type:** Both — pattern library CSS additions first, then app HTML edits

**New semantic classes being added to `components.css`:**
- `.alert-warning-btn` — warning-contextual action button for use inside `.alert-warning`
- `.dashboard-meal-chip-img` — add `::after` inset photo border (mirrors `.meal-card-img::after`)
- `.dashboard-message-preview` — fix alignment: sender+time on one baseline row, add bottom border between rows

**Pattern library components used:**
- `.alert`, `.alert-warning`, `.alert-banner` (existing — being modified/corrected)
- `.card`, `.card-body` (existing)
- `.dashboard-*` classes (existing — selective modifications)

---

## Pre-Build Audit Gate

Before writing any code:
1. Read `src/styles/tokens/components.css` — note current definitions for:
   - `.alert`, `.alert-warning`, `.alert-banner`
   - `.dashboard-meal-chip-img`
   - `.dashboard-message-preview` and its sub-classes
   - `.meal-card-img` and `.meal-card-img::after` (reference for the photo border)
2. Read `apps/patient/index.html` in full
3. Read `.project-docs/decisions-log.md` — extract all "Rule to follow in future prompts" entries and note any that apply here

---

## Prompt 1: CSS — Fix alert semantics and add photo border

Make the following changes to `src/styles/tokens/components.css`. Read the file before editing. Make each change exactly as described.

### 1a. Fix `.alert-banner` — restore rounding when used inside `.mobile-shell`

The existing `.alert-banner` strips all rounding (`rounded-none`) and removes horizontal borders for full-bleed use. This is correct for full-bleed banners but the dashboard callout is a contained card-width element — it should never have been `alert-banner`. No CSS change needed here; the fix is in Prompt 2 (HTML).

**No CSS edit for this item.**

### 1b. Add `.alert-warning-btn` — warning-contextual action button

Add this block **immediately after** the `.alert-info` rule (i.e., after the info dark mode block, before the `.alert-inset` rule):

```css
/* Action button inside .alert-warning — matches warning surface colors.
   Use instead of .btn-primary when the button lives inside a warning alert. */
.alert-warning-btn {
    @apply inline-flex items-center gap-x-1.5 text-sm font-medium rounded-lg;
    @apply py-1.5 px-3 shrink-0;
    @apply bg-warning-700 text-white border border-transparent;
    @apply hover:bg-warning-800;
    @apply focus:outline-none focus:ring-2 focus:ring-warning-500 focus:ring-offset-2;
    @apply disabled:opacity-50 disabled:pointer-events-none;
    @apply dark:bg-warning-600 dark:hover:bg-warning-700;
    cursor: pointer;
    text-decoration: none;
}
```

### 1c. Add `::after` inset photo border to `.dashboard-meal-chip-img`

Find the existing `.dashboard-meal-chip-img` rule:
```css
.dashboard-meal-chip-img {
    @apply w-24 h-24 rounded-xl object-cover bg-stone-100;
}
```

Replace it with:
```css
.dashboard-meal-chip-img {
    @apply w-24 h-24 rounded-xl object-cover bg-stone-100;
    display: block;
    position: relative;
}

.dashboard-meal-chip-img-wrap {
    @apply w-24 h-24 rounded-xl overflow-hidden bg-stone-100 relative shrink-0;
}

.dashboard-meal-chip-img-wrap::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    border: 1px solid rgba(0, 0, 0, 0.10);
    mix-blend-mode: multiply;
    pointer-events: none;
}

.dashboard-meal-chip-img-wrap img {
    @apply w-full h-full object-cover;
}
```

**Note:** This adds a new wrapper class rather than modifying `<img>` directly, because `<img>` cannot contain a pseudo-element. The HTML in Prompt 2 will wrap each chip image in `.dashboard-meal-chip-img-wrap`.

### 1d. Fix `.dashboard-message-preview` alignment

Find the existing `.dashboard-message-preview` block and its sub-classes:
```css
/* Care team message preview row */
.dashboard-message-preview {
    @apply flex items-start gap-3 py-1;
}

.dashboard-message-preview-avatar {
    @apply w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0 text-primary-600 text-xs font-bold;
}

.dashboard-message-preview-body {
    @apply flex-1 min-w-0;
}

.dashboard-message-preview-sender {
    @apply text-sm font-semibold text-gray-900;
}

.dashboard-message-preview-text {
    @apply text-sm text-gray-500 truncate;
}

.dashboard-message-preview-time {
    @apply text-xs text-gray-400 shrink-0 mt-0.5;
}
```

Replace the entire block with:
```css
/* Care team message preview row */
.dashboard-message-preview {
    @apply flex items-start gap-3 py-3;
    @apply border-b border-gray-100 last:border-b-0;
    @apply dark:border-neutral-800;
}

.dashboard-message-preview-avatar {
    @apply w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0 text-primary-600 text-xs font-bold;
    margin-top: 1px; /* optical alignment with first line of text */
}

.dashboard-message-preview-body {
    @apply flex-1 min-w-0;
}

.dashboard-message-preview-header {
    @apply flex items-baseline justify-between gap-2 mb-0.5;
}

.dashboard-message-preview-sender {
    @apply text-sm font-semibold text-gray-900 truncate;
    @apply dark:text-neutral-100;
}

.dashboard-message-preview-time {
    @apply text-xs text-gray-400 shrink-0;
    @apply dark:text-neutral-500;
}

.dashboard-message-preview-text {
    @apply text-sm text-gray-500 truncate;
    @apply dark:text-neutral-400;
}
```

### Known Constraints
- All color values must use `var(--color-*)` tokens or `@apply` with Tailwind semantic aliases — no hardcoded hex.
- Dark mode variants required for any new bg, text, or border colors.
- `@apply` must use valid Tailwind v4 utility names present in the project.

---

## Prompt 2: HTML — `apps/patient/index.html` edits

Read `apps/patient/index.html` in full before making any edits. Apply the following changes exactly.

### 2a. Fix the warning callout: remove `alert-banner`, add correct rounding and button class

Find:
```html
      <!-- Confirm meals callout -->
      <div class="alert alert-warning alert-banner mt-4 dashboard-confirm-callout" role="alert">
        <div class="flex items-center justify-between w-full gap-3">
          <div class="flex items-center gap-2 min-w-0">
            <i class="fa-solid fa-clock-rotate-left shrink-0" aria-hidden="true"></i>
            <span class="text-sm" data-i18n-en="Confirm your meals by Thursday at 5pm" data-i18n-es="Confirma tus comidas antes del jueves a las 5pm">Confirm your meals by Thursday at 5pm</span>
          </div>
          <a href="/apps/patient/meals/index.html" class="btn-primary shrink-0 text-xs py-1.5 px-3">
            <span data-i18n-en="Confirm" data-i18n-es="Confirmar">Confirm</span>
          </a>
        </div>
      </div>
```

Replace with:
```html
      <!-- Confirm meals callout -->
      <div class="alert alert-warning rounded-xl mt-4 dashboard-confirm-callout" role="alert">
        <div class="flex items-center justify-between w-full gap-3">
          <div class="flex items-center gap-2 min-w-0">
            <i class="fa-solid fa-clock-rotate-left shrink-0" aria-hidden="true"></i>
            <span class="text-sm" data-i18n-en="Confirm your meals by Thursday at 5pm" data-i18n-es="Confirma tus comidas antes del jueves a las 5pm">Confirm your meals by Thursday at 5pm</span>
          </div>
          <a href="/apps/patient/meals/index.html" class="alert-warning-btn shrink-0">
            <span data-i18n-en="Confirm" data-i18n-es="Confirmar">Confirm</span>
          </a>
        </div>
      </div>
```

**What changed:**
- Removed `alert-banner` (was causing `rounded-none` and bleeding to edges)
- Added `rounded-xl` explicitly (alert base has `rounded-lg`; `rounded-xl` matches card rounding in this context)
- Changed `btn-primary` + inline size overrides to `alert-warning-btn` (new semantic class from Prompt 1)

### 2b. Fix delivery card: improve icon alignment and spacing

The delivery snapshot card has an icon floated left with text beside it. The current structure is fine but the icon size and vertical alignment need a small fix.

Find:
```html
      <div class="card">
        <div class="card-body">
          <div class="flex items-center gap-3">
            <i class="fa-solid fa-bowl-food text-primary-500 text-xl" aria-hidden="true"></i>
            <div>
              <p class="text-sm font-semibold text-gray-900" data-i18n-en="Getting your meals ready" data-i18n-es="Preparando tus comidas">Getting your meals ready</p>
              <p class="text-xs text-gray-500" data-i18n-en="Arriving Thursday, March 19 · 11am–1pm" data-i18n-es="Llegando el jueves 19 de marzo · 11am–1pm">Arriving Thursday, March 19 · 11am–1pm</p>
            </div>
          </div>
        </div>
      </div>
```

Replace with:
```html
      <div class="card">
        <div class="card-body">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-10 h-10 rounded-full bg-primary-50 shrink-0">
              <i class="fa-solid fa-bowl-food text-primary-500 text-base" aria-hidden="true"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-900" data-i18n-en="Getting your meals ready" data-i18n-es="Preparando tus comidas">Getting your meals ready</p>
              <p class="text-xs text-gray-400 mt-0.5" data-i18n-en="Arriving Thursday, March 19 · 11am–1pm" data-i18n-es="Llegando el jueves 19 de marzo · 11am–1pm">Arriving Thursday, March 19 · 11am–1pm</p>
            </div>
          </div>
        </div>
      </div>
```

**What changed:**
- Icon wrapped in a soft pill container (`w-10 h-10 rounded-full bg-primary-50`) — grounds the icon visually and improves proportions
- Date text changed from `text-gray-500` to `text-gray-400 mt-0.5` — clearer hierarchy between status label and timing detail
- Added `flex-1 min-w-0` to text div for proper truncation safety

### 2c. Wrap meal chip images in `.dashboard-meal-chip-img-wrap`

For each of the 5 `.dashboard-meal-chip` blocks, wrap the `<img>` in a div. The `<img>` currently has `class="dashboard-meal-chip-img"` applied directly — move that class to the wrapper and use a plain img tag inside.

Find (Mon chip — do the same pattern for all 5):
```html
        <div class="dashboard-meal-chip">
          <img class="dashboard-meal-chip-img"
               src="https://images.unsplash.com/photo-1512058454903-4d8b520e7e8b?w=200&h=200&fit=crop&q=80"
               alt="Chicken Verde Rice Bowl" loading="lazy">
          <span class="dashboard-meal-chip-day" data-i18n-en="Mon" data-i18n-es="Lun">Mon</span>
          <span class="dashboard-meal-chip-name">Chicken Verde Rice Bowl</span>
        </div>
```

Replace with:
```html
        <div class="dashboard-meal-chip">
          <div class="dashboard-meal-chip-img-wrap">
            <img src="https://images.unsplash.com/photo-1512058454903-4d8b520e7e8b?w=200&h=200&fit=crop&q=80"
                 alt="Chicken Verde Rice Bowl" loading="lazy">
          </div>
          <span class="dashboard-meal-chip-day" data-i18n-en="Mon" data-i18n-es="Lun">Mon</span>
          <span class="dashboard-meal-chip-name">Chicken Verde Rice Bowl</span>
        </div>
```

Apply the same wrapper pattern to all remaining chips (Tue, Wed, Thu, Fri), preserving each chip's `src`, `alt`, `data-i18n-*`, and name text exactly.

### 2d. Fix care team message preview structure

The new `.dashboard-message-preview-header` wrapper (from Prompt 1) puts sender name and timestamp on one baseline row. Update both message preview rows to use the new structure.

Find the entire care team card body:
```html
      <div class="card">
        <div class="card-body">

          <div class="dashboard-message-preview">
            <div class="dashboard-message-preview-avatar" aria-hidden="true">MC</div>
            <div class="dashboard-message-preview-body">
              <p class="dashboard-message-preview-sender">Maria Chen, RD</p>
              <p class="dashboard-message-preview-text" data-i18n-en="I've set up your meal plan for next week." data-i18n-es="He preparado tu plan de comidas para la semana.">I've set up your meal plan for next week.</p>
            </div>
            <span class="dashboard-message-preview-time">2:14 PM</span>
          </div>

          <div class="dashboard-message-preview mt-2">
            <div class="dashboard-message-preview-avatar" aria-hidden="true">JR</div>
            <div class="dashboard-message-preview-body">
              <p class="dashboard-message-preview-sender">James Rivera</p>
              <p class="dashboard-message-preview-text" data-i18n-en="Your delivery window is Thursday 11am–1pm." data-i18n-es="Tu ventana de entrega es el jueves 11am–1pm.">Your delivery window is Thursday 11am–1pm.</p>
            </div>
            <span class="dashboard-message-preview-time">8:02 AM</span>
          </div>

        </div>
      </div>
```

Replace with:
```html
      <div class="card">
        <div class="card-body">

          <div class="dashboard-message-preview">
            <div class="dashboard-message-preview-avatar" aria-hidden="true">MC</div>
            <div class="dashboard-message-preview-body">
              <div class="dashboard-message-preview-header">
                <p class="dashboard-message-preview-sender">Maria Chen, RD</p>
                <span class="dashboard-message-preview-time">2:14 PM</span>
              </div>
              <p class="dashboard-message-preview-text" data-i18n-en="I've set up your meal plan for next week." data-i18n-es="He preparado tu plan de comidas para la semana.">I've set up your meal plan for next week.</p>
            </div>
          </div>

          <div class="dashboard-message-preview">
            <div class="dashboard-message-preview-avatar" aria-hidden="true">JR</div>
            <div class="dashboard-message-preview-body">
              <div class="dashboard-message-preview-header">
                <p class="dashboard-message-preview-sender">James Rivera</p>
                <span class="dashboard-message-preview-time">8:02 AM</span>
              </div>
              <p class="dashboard-message-preview-text" data-i18n-en="Your delivery window is Thursday 11am–1pm." data-i18n-es="Tu ventana de entrega es el jueves 11am–1pm.">Your delivery window is Thursday 11am–1pm.</p>
            </div>
          </div>

        </div>
      </div>
```

**What changed:**
- Removed `mt-2` from second row (spacing now handled by `py-3` + border in CSS)
- Timestamp moved inside `.dashboard-message-preview-body` and wrapped with sender in `.dashboard-message-preview-header` (name and time on one baseline row)
- `.card-body > * + *` spacing rule won't add `mt-4` to `.dashboard-message-preview` because these are not direct `.card-body` children — no exclusion needed

### Known Constraints
- No utility chains in HTML (layout utilities like `flex items-center gap-3` on one-off wrappers are OK)
- No inline `style=""` attributes except where already present in the existing file
- No `<script>` blocks in HTML
- Verify `rounded-xl` on the alert is correct — `.alert` base has `rounded-lg`; the callout should visually match card rounding in this context (`rounded-xl`)

---

## Verification

After both prompts complete:

- [ ] Verified at `http://localhost:5173/apps/patient/index.html`
- [ ] Warning callout has rounded corners matching the card below it
- [ ] Confirm button inside warning callout is amber/brown (warning-700), not teal
- [ ] Meal chip photos have a subtle inset border (visible on light photos; not a stark outline)
- [ ] Delivery card icon is inside a soft circular container
- [ ] Care team rows: sender name and timestamp are on the same line
- [ ] Care team rows: separated by a bottom border, not by `mt-2`
- [ ] No utility chains in HTML
- [ ] Dark mode variants present for all new CSS rules
- [ ] `ANDREY-README.md` updated if `.dashboard-message-preview` HTML structure changed (yes)

---

## Completion Report

After verification passes:

```
## Completion Report — PAT-DASHBOARD-02

- New semantic classes added to components.css: [list]
- Existing classes modified: [list]
- Pattern library files created or updated: [list, or "none"]
- Judgment calls: [list]
- Dark mode added: yes / no
- ANDREY-README.md updated: yes / no
- Items deferred or incomplete: [list, or "none"]
```

Then:
```bash
git add -A
git commit -m "patient dashboard: polish pass — alert rounding, warning btn, photo borders, delivery icon, care team alignment"
```

---
**View your result:** http://localhost:5173/apps/patient/index.html
