# Cena Health — Brand Reference

_Last updated: 2026-03-16_

This document is the source of truth for the Cena Health visual identity as implemented in haven-ui. It reflects what is currently in code, not aspirational guidelines. When the code and this doc diverge, update this doc — the code is canonical.

---

## 1. Name & Product Context

**Product name:** Cena Health
**Design system name:** Haven
**Repo:** `haven-ui`

Cena Health is a patient-facing mobile health app focused on therapeutic meal delivery for patients managing chronic conditions (diabetes, CKD, heart disease). The experience spans four persona-specific apps:

| App | Path | Status |
|-----|------|--------|
| Patient | `apps/patient/` | MVP complete |
| Kitchen Partner Portal | `apps/kitchen/` | Roadmap — next |
| Provider Portal | `apps/provider/` | Roadmap |
| Care Coordinator | `apps/care-coordinator/` | Not yet designed |

---

## 2. Voice & Tone

**Adjectives that should describe any Cena Health UI surface:** calm, warm, trustworthy, clear, human.

**Adjectives to avoid:** clinical, cold, alarming, overwhelming, corporate.

Cena is not a hospital interface. Patients are managing serious conditions at home, often alongside anxiety. Every interaction should feel like a capable, reassuring care team — not a billing department.

**Practical tone rules:**
- Use plain language. "Your meals arrive Thursday" not "Delivery estimated ETA 2026-03-19."
- Confirmations are warm, not transactional. "You're all set." not "Request submitted."
- Errors are calm and actionable. Tell the patient what to do, not just what went wrong.
- Empty states explain what will be here, not that nothing exists.

---

## 3. Color

### 3.1 Palette Source

All colors are defined as CSS custom properties in `src/styles/tokens/colors.css` using `hsla()` values. These are custom-tuned scales, not Tailwind's default palette. Do not substitute standard Tailwind colors.

### 3.2 Semantic Color Roles

Semantic aliases are defined in `src/styles/haven.css` under `@theme`. Always use semantic roles in component CSS; use raw scale values only in `colors.css` or `haven.css`.

| Role | Scale | Usage |
|------|-------|-------|
| `primary` | Teal | Actions, links, active states, key data |
| `secondary` | Sand | Backgrounds, muted surfaces, neutral UI |
| `accent` | Violet | Callouts, highlights, secondary CTAs (use sparingly) |
| `success` | Green | Confirmations, positive feedback |
| `warning` | Amber | Soft alerts, time-sensitive prompts |
| `error` | Red | Errors, destructive actions |
| `info` | Cyan | Informational callouts, secondary status |

### 3.3 Representative Color Stops

See `src/styles/tokens/colors.css` for the full scale. These are the most-used stops in component CSS.

**Teal (Primary)**
- `teal-50` — Icon well and chip backgrounds
- `teal-100` — Icon container backgrounds
- `teal-500` — Icon color on light surfaces
- `teal-600` — Primary button fill, active nav, links
- `teal-700` — Primary button hover
- `teal-900` — Dark mode active nav backgrounds

**Sand (Secondary)**
- `sand-50` — App shell background (`#FBFAF8` equivalent)
- `sand-100` — Card backgrounds in some dark-on-light contexts
- `sand-400` — Muted icon color
- `sand-700` — Secondary text

**Amber (Warning)**
- `amber-50/100` — Warning alert background
- `amber-700` — Warning button fill (`.alert-warning-btn`)
- `amber-800` — Warning button hover

**Surface tokens**

| Token | Usage |
|-------|-------|
| `var(--color-sand-50)` | App shell, PL canvas backgrounds |
| White | Card surfaces, modal backgrounds |

### 3.4 Dark Mode

Dark mode is toggled via `.dark` class on `<html>`. Add `dark:` variants to every bg, text, and border color in new component classes.

Standard pattern for most colored variants:
```
dark:bg-{color}-900/20  dark:border-{color}-800  dark:text-{color}-400
```

Exception — neutral/sand: use solid values (`dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-300`). The 900/20 opacity trick is invisible on low-saturation colors.

---

## 4. Typography

### 4.1 Typefaces

| Role | Family | Weights |
|------|--------|---------|
| Body / UI | Inter | 100–900 (variable) |
| Display / editorial | Lora | 400–700, italic |
| Code / data | JetBrains Mono | 100–800 (variable) |

The `--font-sans` token in `haven.css` resolves to Inter. This is the default for all UI text.

### 4.2 Usage Rules

- **Inter** — all UI: labels, body copy, buttons, nav, data.
- **Lora** — display headings on welcome screens, editorial empty states. Not for data-dense UI.
- **JetBrains Mono** — code samples, nutrition facts tables, lab values, PL developer content.

### 4.3 Type Ramp

| Context | Classes | Approx |
|---------|---------|--------|
| Page title | `text-2xl font-semibold` | 24px |
| Section heading | `text-lg font-semibold` | 18px |
| Card title | `text-base font-semibold` | 16px |
| Body / default | `text-sm` | 14px |
| Supporting text | `text-sm text-gray-500` | 14px muted |
| Label / caption | `text-xs` | 12px |
| Timestamp / micro | `text-xs text-gray-400` | 12px faint |

---

## 5. Iconography

**Library:** FontAwesome Pro v7.1.0, local copy at `src/vendor/fontawesome/`

**Always link:** `/src/vendor/fontawesome/css/all.css` — not `all.min.css` (does not exist).

**Style preference:**
- `fa-solid` — functional UI icons
- `fa-regular` — secondary or inactive states
- `fa-light` — decorative / empty state icons

**Sizing convention:**
- Nav icons: `text-base` (16px)
- Inline action icons: `text-sm` (14px)
- Card header / section icons: `text-lg` (18px)
- Empty state illustration icons: `text-4xl` or `text-5xl`

**Icon well pattern** (delivery cards, empty states):
```html
<div class="flex items-center justify-center w-10 h-10 rounded-full bg-primary-50 shrink-0">
  <i class="fa-solid fa-bowl-food text-primary-500 text-base" aria-hidden="true"></i>
</div>
```

Always `aria-hidden="true"` on decorative icons. `aria-label` required on icon-only buttons.

---

## 6. Spacing & Layout

### 6.1 Mobile Shell

Patient app screens use a centered mobile shell (~390px max-width) simulating a phone viewport on desktop.

- Shell background: `var(--color-sand-50)`
- Bottom nav: fixed, `h-16`, `z-50`
- Page content: `pb-20` minimum to clear the nav
- `.mobile-shell` is the content root — target it for show/hide states, not `<main>`

### 6.2 Card Anatomy

```
.card                     rounded-xl, shadow, bg-white
  .card-header            px-4 pt-4 pb-0
  .card-body              px-4 py-3 — children spaced via > * + * { mt-4 }
  .card-footer            px-4 pb-4 pt-0
```

**Nested border radius rule:** Step down one size per nesting level. `.card` = `rounded-xl` (12px), direct children = `rounded-lg` (8px), deeper nesting = `rounded-md` (6px), `rounded` (4px). Pill shapes (`rounded-full`) are exempt.

### 6.3 card-body Spacing Exclusion List

Row-pattern classes that use `border-b` for separation are excluded from the `mt-4` rule via `:not()`. Current exclusions:

- `.activity-feed-row`
- `.medication-row`
- `.partner-list-item`
- `.alert-summary-row`
- `.profile-field-row`
- `.dashboard-message-preview`

Add new row-pattern classes to this list at creation time.

---

## 7. Component Patterns

### 7.1 Buttons

Base `<button>` carries structural defaults only (no color, no size). Visual intent requires a variant class.

| Class | Usage |
|-------|-------|
| `.btn-primary` | Default CTA — teal fill |
| `.btn-secondary` | Secondary action — sand fill |
| `.btn-outline` | Bordered, no fill |
| `.btn-ghost` | No border, no fill — tertiary |
| `.btn-icon` | Icon-only square button |
| `.btn-sm` / `.btn-lg` | Size modifiers |
| `.alert-warning-btn` | CTA inside `.alert-warning` — amber fill |

When a button lives inside a colored alert surface, use `alert-{variant}-btn`, not `.btn-primary`.

### 7.2 Alerts

```html
<div class="alert alert-{variant}" role="alert">
  <i class="fa-solid fa-... alert-icon"></i>
  <div><span class="font-medium">Label.</span> Supporting message.</div>
</div>
```

Variants: `alert-success`, `alert-warning`, `alert-error`, `alert-info`

Modifiers:
- `.alert-inset` — reduces `px` to `px-3` for card-width contexts
- `.alert-banner` — full-bleed, `rounded-none`, no horizontal borders. Page-level only. Do not use inside cards or mobile shells.

### 7.3 Badges

```html
<span class="badge badge-{variant} badge-pill">Label</span>
```

Valid variants: `badge-primary`, `badge-success`, `badge-warning`, `badge-error`, `badge-info`, `badge-neutral`

`badge-teal` and `badge-stone` do not exist — use `badge-primary` and `badge-neutral`.

### 7.4 Selection Controls (pref-row)

Full-width tap-target selection rows for patient preferences and intake forms:

- `.pref-row` + `.pref-row-indicator--circle` = single-select (radio)
- `.pref-row` + `.pref-row-indicator--square` = multi-select (checkbox)

Native inputs are `sr-only`; visual state driven by `:has(input:checked)`. Currently patient app only. Do not modify `.radio-label` / `.checkbox-label` to support this pattern — those classes serve all apps.

### 7.5 Image Inset Border

For food/product photos where light backgrounds bleed into card surfaces:

```css
.image-wrapper {
    position: relative;
    overflow: hidden;
}
.image-wrapper::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    border: 1px solid rgba(0, 0, 0, 0.10);
    mix-blend-mode: multiply;
    pointer-events: none;
}
```

`mix-blend-mode: multiply` is invisible on dark pixels, visible on light ones. Never use a real `border` on `<img>` elements for this purpose.

### 7.6 Row Actions

For list-row actions that affect the entire row (swap, edit, delete): place the affordance in the right gutter as a trailing icon button, not inside the row's content body. Icon-only with `aria-label`. Full labeled button is acceptable as a secondary confirmation inside a sheet or modal.

---

## 8. Preline Integration

**Version:** Preline UI v4.1.2, local at `node_modules/preline/`

**CSS import order in `main.css` (must be preserved):**
1. `preline/css/themes/theme.css` — sets Preline `--primary-*` defaults to blue
2. `haven.css` — overrides `--primary-*` to teal
3. `tokens/components.css`

If Preline's theme comes after haven.css, all primary colors render blue.

**Dropdown visibility (Preline v4):**

Preline v4 adds `block` class on open — never `hs-dropdown-open`. Drive visibility from CSS:

```css
.hs-dropdown-menu { opacity: 0; transition: opacity 0.15s ease, margin 0.15s ease; }
.hs-dropdown-menu.block { opacity: 1; }
```

Do not use `hs-dropdown-open:opacity-100` — that variant never fires in Preline v4.

**Sidebar mobile visibility:** Never use `hidden lg:block`. Use `translate-x` with a media query override. Full pattern in `decisions-log.md`.

---

## 9. Accessibility Baselines

- Visible focus states on all interactive elements (`focus:ring-2` pattern).
- `aria-label` required on icon-only buttons.
- `aria-hidden="true"` required on decorative icons.
- `role="alert"` for error/warning alerts. `role="status"` for success/info.
- Color alone must not convey state — icons or text required alongside color.
- Touch targets: minimum 44x44px on all patient-facing interactive elements.
- `data-i18n-en` / `data-i18n-es` attributes required on all visible strings in patient app screens.

---

## 10. Angular Handoff (Andrey)

See `ANDREY-README.md` in the repo root for integration notes.

- HTML in `apps/patient/` is the source of truth — Andrey copies it into Angular.
- Update `ANDREY-README.md` when component HTML structure or class names change.
- `npm run build` (not `npm run dev`) is the handoff artifact.
- Semantic class names only in HTML — no utility chains. Andrey reads class names directly.
