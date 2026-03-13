# Component Map: Patient App MVP

**Date:** 2026-03-12
**Source wireframes:** `.project-docs/wireframes/` (all 10 screens)
**Review notes:** `apps/patient/design/review-notes.md`
**components.css read:** 2026-03-12 (fresh)
**COMPONENT-INDEX.md read:** 2026-03-12 (fresh)

---

## Component Inventory Summary

**Existing components used:** 24 classes across existing components
**New components needed:** 9
**Utility-only patterns:** 3 (one-off layout adjustments)

---

## New Components Required

| Component | Spec File | Priority | Preline Base | Used In |
|-----------|-----------|----------|--------------|---------|
| `mobile-shell` | `new-components/mobile-shell.md` | Required | None | All screens |
| `mobile-i18n-bar` | `new-components/mobile-i18n-bar.md` | Required | None | All screens |
| `mobile-bottom-nav` | `new-components/mobile-bottom-nav.md` | Required | None | All post-onboarding screens |
| `onb-progress` | `new-components/onb-progress.md` | Required | None | ONB-01, 02, 03 |
| `meal-card` | `new-components/meal-card.md` | Required | None | MEALS-01 |
| `delivery-status-card` | `new-components/delivery-status-card.md` | Required | None | MEALS-02 |
| `message-bubble` | `new-components/message-bubble.md` | Required | None | CARE-01 |
| `feedback-rating` | `new-components/feedback-rating.md` | Required | None | CARE-02 |
| `pref-image-card` | `new-components/pref-image-card.md` | Required | None | ONB-03, PROFILE-01 |

---

## Screen: ONB-01 Welcome

**Wireframe source:** `.project-docs/wireframes/onb-01-welcome.md`

### Recipe

1. **Shell:** `mobile-shell` — max-width 430px, centered, min-height 100dvh, white bg, no ambient blobs
2. **i18n bar:** `mobile-i18n-bar` — fixed top, full width, language toggle
3. **Header zone:**
   - Cena Health wordmark: `<img>` or SVG, centered, `h-8`
   - Headline: `<h1>` with Lora serif — override `h1` default margins for onboarding
   - Subhead: `<p class="text-sm text-gray-500 text-center">`
4. **Progress indicator:** `onb-progress` — "Step 1 of 3", centered
5. **Content zone:**
   - Container: `.card` with `mx-4 mt-6`
   - `.card-body`
   - Password field: `<label>` + `input[type="password"]` (element default styling) + show/hide toggle button (`.btn-icon`)
   - Confirm password field: same
   - Helper text: `<p class="text-xs text-gray-500">`
   - Error messages: `<p class="text-xs text-error-600">` linked via `aria-describedby`
6. **Footer zone:**
   - `.btn-primary` full width: "Continue"
   - Help text: `<p class="text-xs text-center text-gray-400">`

### Data Bindings
None — static form for prototype.

### Preline Interactions
None on this screen.

---

## Screen: ONB-02 Consent

**Wireframe source:** `.project-docs/wireframes/onb-02-consent.md`

### Recipe

1. **Shell:** `mobile-shell`
2. **i18n bar:** `mobile-i18n-bar`
3. **Back nav:** `<button class="btn-icon">` with `fa-chevron-left`, top-left inline
4. **Progress:** `onb-progress` — "Step 2 of 3"
5. **Step label:** `<p class="text-xs uppercase tracking-wide text-gray-500">`
6. **Headline:** `<h1>` Lora
7. **Summary:** `<p class="text-gray-700 text-sm">`
8. **Read aloud button:** `.btn-outline` full width, `fa-volume-high`, disabled state, tooltip "Coming soon"
9. **Expand accordion:** Preline `hs-accordion` single item — existing pattern
   - Toggle: "Read full text" `<button class="hs-accordion-toggle text-sm text-primary-600 underline">`
   - Body: scrollable full consent text, `text-sm text-gray-600`
10. **AVA opt-out card (step 3 only):** `.card` with custom bg (utility: `bg-stone-50 border-stone-200`) — two `.radio-label` options
11. **Footer:** `.btn-primary` full width: "I agree" / "Continue"
    - Below (steps 1-2 only): `<p class="text-xs text-gray-400 text-center">`

### Preline Interactions
- `hs-accordion` for full consent text expand/collapse

---

## Screen: ONB-03 Preferences

**Wireframe source:** `.project-docs/wireframes/onb-03-preferences.md`

### Recipe

1. **Shell:** `mobile-shell`
2. **i18n bar:** `mobile-i18n-bar`
3. **Back nav:** `.btn-icon` `fa-chevron-left`
4. **Progress:** `onb-progress` — "Step 3 of 3"
5. **Header:** `<h1>` Lora + `<p class="text-sm text-gray-500">`
6. **Section 1 — Language:** `<fieldset>` + `<legend>` + two `.radio-label` cards side-by-side (`grid grid-cols-2 gap-3`)
7. **Section 2 — Food:** `<fieldset>` + `<legend>` + sub-label `<p>` + 2×2 grid of `pref-image-card` (checkbox behavior) + "No preference" row below
8. **Section 3 — Contact:** `<fieldset>` + `<legend>` + three `.radio-label` cards (contact method) + three `.checkbox-label` cards (best times)
9. **Footer:** `.btn-primary` full width + skip note `<p class="text-xs text-gray-400 text-center">` + error `.alert-error` (hidden by default)

### Preline Interactions
None — pure CSS selection states.

---

## Screen: MEALS-01 Weekly Meals

**Wireframe source:** `.project-docs/wireframes/meals-01-weekly-meals.md`

### Recipe

1. **Shell:** `mobile-shell` with `pb-[128px]` (bottom nav + sticky footer clearance)
2. **i18n bar:** `mobile-i18n-bar`
3. **Bottom nav:** `mobile-bottom-nav` — "Meals" tab active
4. **Header zone:** `<div class="px-4 pt-6 pb-2">` — `<h1>` Lora + subtitle `<p class="text-sm text-gray-500">`
5. **Status banner:** `.alert` with variant class — `alert-warning` / `alert-success` / `alert-info` — full width, no `mx-4`
6. **Meal list:** `<div class="space-y-3 px-4">` — stack of `meal-card`
7. **Care team shortcut:** `.card` with utility bg `bg-teal-50 border-teal-200 mx-4 mt-3` — `.text-link` "Message your care team"
8. **Sticky confirm footer:** `.sticky-footer` (existing) — `.btn-primary` full width "Confirm my meals" — visible only when window open and unconfirmed
9. **Empty state:** `.empty-state` + `.empty-state-icon` (existing) — `.btn-outline` CTA
10. **Skeleton loading:** `skeleton` cards (existing)

**Badge pattern for diet tags:** `badge badge-primary badge-pill`, `badge badge-info badge-pill`, `badge badge-secondary badge-pill`, `badge badge-success badge-pill`. Do NOT use `badge-teal` or `badge-stone` — these do not exist.

### Bottom sheet — Meal Detail
- Preline `hs-overlay` drawer anchored to bottom
- Inner: `<div class="p-4">` — large meal image, name `<h2>`, description `<p>`, diet tag badges

### Bottom sheet — Swap Meal
- Same Preline `hs-overlay` drawer
- Inner: stack of `meal-card` without swap link; tap to select

### Prototype State Variants (via `?state=` URL param)
- Default: unconfirmed, window open
- `?state=confirmed`: banner switches to success, sticky footer hidden, care team shortcut hidden
- JS reads `URLSearchParams` on load, adds `body.state-confirmed` class; CSS handles visibility

### Preline Interactions
- `hs-overlay` for meal detail and swap drawers

---

## Screen: MEALS-02 Delivery Status

**Wireframe source:** `.project-docs/wireframes/meals-02-delivery-status.md`

### Recipe

1. **Shell:** `mobile-shell` with `pb-[64px]`
2. **i18n bar:** `mobile-i18n-bar`
3. **Bottom nav:** `mobile-bottom-nav` — "Delivery" tab active
4. **Header zone:** `<div class="px-4 pt-6 pb-2">` — `<h1>` Lora + `<p class="text-sm text-gray-500">`
5. **Delivery status card:** `delivery-status-card` — icon, label, timing, meal summary
6. **Issue report card:** `.card mx-4 mt-3`
   - Default: `.btn-outline` full width "Report an issue"
   - Expanded: inline issue form (issue type buttons + textarea + submit)
   - Confirmed: confirmation text with `fa-circle-check text-success-600`
   - Expansion is CSS class swap: card gets `.is-expanded` class; JS toggles it on button tap
7. **Care team link:** `<p class="text-center text-sm mt-4"><a class="text-link">Questions? Message your care team</a></p>`
8. **Empty state (no delivery):** `.empty-state` (existing)

### Prototype State Variants
- `?state=delivering`: out-for-delivery icon/label
- `?state=delivered`: delivered icon/label + timestamp
- Default: preparing state

### Preline Interactions
None — issue form expansion is vanilla JS class toggle.

---

## Screen: CARE-01 Messages

**Wireframe source:** `.project-docs/wireframes/care-01-messages.md`

### Recipe

1. **Shell:** `mobile-shell` — special layout: `display: flex; flex-direction: column; height: 100dvh`
2. **i18n bar:** `mobile-i18n-bar`
3. **Bottom nav:** `mobile-bottom-nav` — "Care Team" tab active, unread badge shown
4. **Header zone:** `<div class="px-4 pt-6 pb-2 shrink-0">` — `<h1>` Lora + `<p class="text-sm text-gray-500">`
5. **Thread area:** `<div class="flex-1 overflow-y-auto px-4 py-2">` — scrollable, fills available space
   - Date separators: `<div class="text-xs text-gray-400 text-center py-2">`
   - Outgoing bubbles: `.message-bubble-out`
   - Incoming bubbles: `.message-bubble-in` with sender label `<p class="text-xs text-gray-500 mb-1">`
   - Image attachments: `<img class="rounded-lg max-w-full mt-1">` inside bubble
   - Skeleton loading: `skeleton` alternating left/right
6. **New message pill:** `.message-new-pill` (part of `message-bubble` component) — floating, `aria-live="polite"` — static/visible for prototype
7. **Compose area:** `<div class="shrink-0 border-t border-gray-200 p-3 bg-white" style="padding-bottom: env(safe-area-inset-bottom);">`
   - Layout: `<div class="flex items-end gap-2">`
   - Attach: `.btn-icon` `fa-image`
   - Textarea: `<textarea>` element default, 1-row, auto-grows to 4 rows via JS in `src/scripts/components/messages-compose.js`
   - Send: `.btn-icon-primary` `fa-paper-plane` — disabled when empty
8. **Empty state:** `.empty-state` (existing) centered in thread area

### Data Bindings
Dummy thread data hardcoded in HTML — no JS data loading for prototype.

### Preline Interactions
None — compose auto-grow is vanilla JS.

---

## Screen: CARE-02 Meal Feedback

**Wireframe source:** `.project-docs/wireframes/care-02-meal-feedback.md`

### Recipe

1. **Shell:** `mobile-shell` with `pb-[128px]`
2. **i18n bar:** `mobile-i18n-bar`
3. **Bottom nav:** `mobile-bottom-nav` — "Care Team" tab active
4. **Back nav:** `.btn-icon` `fa-chevron-left`
5. **Header zone:** `<div class="px-4 pt-6 pb-2">` — `<h1>` Lora + `<p class="text-sm text-gray-500">`
6. **Section 1 — Overall rating:** `<fieldset>` without border (utility: `border-0 p-0`) + `<legend>` + three `feedback-rating` cards in a row (`grid grid-cols-3 gap-2`)
7. **Section 1b — Issue type (conditional):** `<fieldset>` — stacked `.btn-outline` buttons with icon left — hidden by default, animates in when thumbs-down selected. CSS: `.feedback-issue-type { display: none; } .feedback-issue-type.visible { display: block; }`; JS in `src/scripts/components/feedback.js`
8. **Section 2 — Per-meal accordion:** `hs-accordion` — list of meals with three icon buttons per row (`fa-thumbs-up`, `fa-face-meh`, `fa-thumbs-down`)
9. **Section 3 — Free text:** `<fieldset>` + `<legend>` + `<textarea>` (element default) + helper `<p class="text-xs text-gray-400">`
10. **Sticky footer:** `.sticky-footer` — `.btn-primary` "Submit feedback" + skip `<a class="text-link text-gray-400">`
11. **Confirmation state:** replaces form when submitted — `fa-circle-check text-success-500` centered, heading, body, `.btn-outline` "Done"

### Prototype State Variant
- `?state=submitted`: shows confirmation state on load instead of form

### Preline Interactions
- `hs-accordion` for per-meal ratings section

---

## Screen: PROFILE-01 Settings

**Wireframe source:** `.project-docs/wireframes/profile-01-settings.md`

### Recipe

1. **Shell:** `mobile-shell` with `pb-[80px]`
2. **i18n bar:** `mobile-i18n-bar`
3. **Bottom nav:** `mobile-bottom-nav` — "Profile" tab active
4. **Header zone:** `<div class="px-4 pt-6 pb-4">` — `<h1>` Lora
5. **Card 1 — Contact & Delivery:** `.card mx-4`
   - Card section header: `<div class="px-4 pt-4 pb-2"><p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">`
   - Editable fields: `<label>` + `input[type="tel/email/text"]` (element defaults)
   - Read-only field: `<p class="text-sm text-gray-500 italic">` + read-only label + `.text-link` "Contact us to update"
   - Save zone: `<div class="card-footer is-dirty-target">` — `.btn-sm.btn-primary` hidden by default; CSS `.card.is-dirty .is-dirty-target { display: flex; }`; JS in `src/scripts/components/profile-save.js`
6. **Card 2 — Meal Preferences:** same structure
   - `pref-image-card` grid (reuse from ONB-03)
   - Clinical restrictions: `.badge-warning` pills in `tag-container` (existing) + read-only note + `.text-link`
7. **Card 3 — Communication:** same structure
   - Language: two `.radio-label` cards
   - Contact method: three `.radio-label` cards
   - Best times: three `.checkbox-label` cards
8. **Card 4 — Account:** `.card mx-4` — minimal style
   - Two tappable rows: `<button class="flex w-full items-center justify-between px-4 py-3 text-sm">` with icon left + `fa-chevron-right` right
   - Logout row: `text-error-600`
9. **Logout modal:** Preline `hs-overlay` modal — "Are you sure?" + `.btn-danger` + `.btn-outline`

### Preline Interactions
- `hs-overlay` for logout confirmation modal

---

## Shared: Mobile Shell

Applied to every screen. Overrides the desktop `body` defaults.

### Recipe
- `<body class="mobile-app">` — class disables ambient blobs, sets white bg, constrains max-width
- `<div class="mobile-shell">` — inner centering wrapper
- i18n bar fixed at top
- Screen content scrolls within `mobile-shell` below i18n bar

