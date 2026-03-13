# haven-ui — Roadmap

## Current State

Repo scaffolded and build pipeline verified. Token files migrated from haven-tailwind-theme.
`components.css` copied (76KB, full content). FontAwesome Pro v7.1.0 vendor files in place.
`npm install` complete. Dev server confirmed at localhost:5173.

Pattern library scaffold populated with 80+ component files across all categories.
`COMPONENT-INDEX.md` created — ground truth for all existing components and their classes.
Pattern-Library-First workflow established in CLAUDE.md and task-template.md.

App pages migration in progress (see active `next-task.md`).

## Active Work

Patient app MVP build in progress -- onboarding screens complete, main app screens pending.

| Screen | File | Status |
|--------|------|--------|
| ONB-01 Welcome | `apps/patient/onboarding/welcome.html` | ✅ |
| ONB-02 Consent | `apps/patient/onboarding/consent.html` | ✅ |
| ONB-03 Preferences | `apps/patient/onboarding/preferences.html` | ✅ |
| Meals | `apps/patient/meals/index.html` | ✅ |
| Deliveries | `apps/patient/deliveries/index.html` | ✅ |
| Messages | `apps/patient/care-team/messages.html` | ✅ |
| Meal Feedback | `apps/patient/care-team/feedback.html` | ✅ |
| Profile | `apps/patient/profile/index.html` | ⏳ |
| App Index | `apps/patient/index.html` | ⏳ |

## Next Priorities

1. **Task 05** -- Patient Meals screen (`apps/patient/meals/index.html` + `meals.js`)
2. Tasks 06-10 -- remaining patient app screens
3. Kitchen Partner Portal finance page
4. Remaining kitchen pages
5. Provider portal pages

## Backlog

- **Generalize pref-row to shared component** -- the circle/square inset-ring selection pattern is visually strong and worth applying to provider/patient profile settings screens. Currently scoped to patient onboarding only. When a second use case appears, promote to `components.css` and document in COMPONENT-INDEX.md.
- Care coordinator interface (not yet designed)
- Referral form multi-step wizard (meals + RDN, multi-step tab-style wizard)
- Resolve Vanessa billing tool question: kitchen-facing portal vs. internal billing operations tool

## Blockers

_None at this time._
