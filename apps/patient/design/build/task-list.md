# Build Tasks: Patient App MVP

**Date:** 2026-03-12
**Source:** `apps/patient/design/component-map.md`, `apps/patient/design/new-components/`, `apps/patient/design/review-notes.md`
**Target:** haven-ui patient app (`apps/patient/`)

---

## Task Summary

**Total tasks:** 10
**New components:** 9 new semantic class groups (Tasks 01–02)
**New partials:** 3 (Tasks 01–02)
**Screen builds:** 7 (Tasks 03–09)
**Wiring + index:** 1 (Task 10)
**Estimated complexity:** Moderate-Complex

---

## Execution Order

| # | Task | Scope | Files Modified | Depends On | Status |
|---|------|-------|----------------|------------|--------|
| 01 | Mobile shell + i18n system | Pattern + CSS + Partial + JS | `components.css`, `pattern-library/`, `src/partials/patient-i18n-bar.html`, `src/scripts/components/i18n.js` | — | ✅ |
| 02 | Bottom nav + onboarding progress | Pattern + CSS + Partial | `components.css`, `pattern-library/`, `src/partials/patient-bottom-nav.html` | 01 | ✅ |
| 03 | Patient-specific components in CSS + pattern library | Pattern + CSS | `components.css`, `pattern-library/` (×7 new files) | 01 | ✅ |
| 04 | Onboarding screens (ONB-01, 02, 03) | App | `apps/patient/onboarding/` (3 files) | 01, 02, 03 | ☐ |
| 05 | Meals-01: Weekly Meals | App | `apps/patient/meals/index.html`, `src/scripts/components/meals.js` | 01, 02, 03 | ☐ |
| 06 | Meals-02: Delivery Status | App | `apps/patient/deliveries/index.html`, `src/scripts/components/delivery.js` | 01, 02, 03 | ☐ |
| 07 | Care-01: Messages | App | `apps/patient/care-team/messages.html`, `src/scripts/components/messages-compose.js` | 01, 02, 03 | ☐ |
| 08 | Care-02: Meal Feedback | App | `apps/patient/care-team/feedback.html`, `src/scripts/components/feedback.js` | 01, 02, 03 | ☐ |
| 09 | Profile-01: Settings | App | `apps/patient/profile/index.html`, `src/scripts/components/profile-save.js` | 01, 02, 03 | ☐ |
| 10 | App index + cross-screen wiring | App | `apps/patient/index.html`, all screen files (link audit) | 04–09 | ☐ |

---

## Image Assets Required Before Task 04

Before the agent builds the screens, create these placeholder image files (or the final generated images) at:

**Preference images** (used in ONB-03 and PROFILE-01):
- `src/assets/meals/pref-latin-american.jpg`
- `src/assets/meals/pref-soul-food.jpg`
- `src/assets/meals/pref-mediterranean.jpg`
- `src/assets/meals/pref-asian.jpg`

**Meal images** (used in MEALS-01 — 5 meals for Mon–Fri demo):
- `src/assets/meals/chicken-verde.jpg`
- `src/assets/meals/black-bean-tacos.jpg`
- `src/assets/meals/lemon-herb-salmon.jpg`
- `src/assets/meals/turkey-sofrito-bowl.jpg`
- `src/assets/meals/veggie-stir-fry.jpg`

**Swap substitute images** (2 per meal slot for demo — suggest 3 extras):
- `src/assets/meals/grilled-tilapia.jpg`
- `src/assets/meals/chicken-mole.jpg`
- `src/assets/meals/beef-picadillo.jpg`

If images are not yet available, the agent uses `bg-stone-100` placeholder styling on `.meal-card-img` and `.pref-image-card-img-wrap`. The CSS handles this gracefully — no broken images.

**Image generation spec (for when Gemini API is available):**
Prompt template: `"[Meal name], plated on a white dish, overhead shot, warm natural lighting, food photography style, clean and appetizing, no text or labels"`
Aspect ratio: `1:1` (square, for card thumbnails)
Model: `gemini-2.5-flash-image` via the recipe-image-gen-demo backend pattern.

---

## Dummy Data (used across screens)

**Care team:**
- Dietitian: Maria Chen, RD — sender label "Your dietitian"
- Coordinator: James Rivera — sender label "Your coordinator"

**Weekly meals (Mon–Fri):**
| Day | Meal | Slug | Tags |
|-----|------|------|------|
| Monday | Chicken Verde | `chicken-verde` | Low sodium, Diabetic-friendly |
| Tuesday | Black Bean Tacos | `black-bean-tacos` | High fiber, Vegetarian |
| Wednesday | Lemon Herb Salmon | `lemon-herb-salmon` | Heart-healthy, Low sodium |
| Thursday | Turkey Sofrito Bowl | `turkey-sofrito-bowl` | High protein, Diabetic-friendly |
| Friday | Veggie Stir Fry | `veggie-stir-fry` | Vegetarian, Low sodium |

**Swap substitutes (for Monday slot demo):**
- Grilled Tilapia with Mango Salsa (`grilled-tilapia`)
- Chicken Mole with Brown Rice (`chicken-mole`)

**Delivery:**
- Expected: Thursday, March 19, 2026
- Window: 10:00am – 2:00pm
- Delivered timestamp (delivered state): 11:43am

**Contact:**
- Care team phone: 1-800-246-2458

---

## Post-Build
- [ ] Run `npm run dev`; verify all 10 screens at `localhost:5173/apps/patient/`
- [ ] Test language toggle on each screen (English → Spanish → English)
- [ ] Test `?state=` URL params on MEALS-01, MEALS-02, CARE-02
- [ ] Test bottom sheet open/close on MEALS-01 (meal detail + swap)
- [ ] Test issue report form expand/collapse on MEALS-02
- [ ] Test feedback thumbs-down → issue type reveal on CARE-02
- [ ] Test profile dirty-state save button appearance on PROFILE-01
- [ ] Run ux-design-review (post-build mode) → `apps/patient/design/validation.md`

## Notes
- All screens use the `mobile-app` class on `<body>` and `mobile-shell` wrapper — no desktop header partial
- Preline is already loaded via `src/scripts/main.js` — no CDN script needed
- FontAwesome Pro v7.1.0 is the local copy — no CDN
- The `sticky-footer` component already exists in Haven — reuse it for MEALS-01 confirm footer and CARE-02 submit footer
- Bottom nav is copy-and-modify per screen for the prototype (active tab set per page)
- Decisions log rules in effect: button base element must not set size/color; sidebar hidden pattern does not apply (no sidebar in patient app); `@apply block` required on any CSS-only rule; dropdown rules apply if any dropdowns are added
