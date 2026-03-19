# haven-ui — Roadmap

## Current State

Repo scaffolded and build pipeline verified. Dev server confirmed at localhost:5173.

Pattern library scaffold populated with 80+ component files across all categories.
`COMPONENT-INDEX.md` created — ground truth for all existing components and their classes.
Pattern-Library-First workflow established in CLAUDE.md and task-template.md.

**Brand theme merged (March 2026):** Cena Health warm neutral palette and brand teal applied.
Fonts: Plus Jakarta Sans (headings), Source Sans 3 (body), Source Code Pro (mono).
`cena-health-brand` repo is archived — haven-ui is the single source of truth.
See decisions-log.md → "Cena Health Brand Theme Merge" for the Tailwind cascade trap rule.

## Active Work

Patient app MVP complete. All onboarding and main app screens built and committed.

| Screen | File | Status |
|--------|------|--------|
| ONB-01 Welcome | `apps/patient/onboarding/welcome.html` | ✅ |
| ONB-02 Consent | `apps/patient/onboarding/consent.html` | ✅ |
| ONB-03 Preferences | `apps/patient/onboarding/preferences.html` | ✅ |
| Meals | `apps/patient/meals/index.html` | ✅ |
| Deliveries | `apps/patient/deliveries/index.html` | ✅ |
| Messages | `apps/patient/care-team/messages.html` | ✅ |
| Meal Feedback | `apps/patient/care-team/feedback.html` | ✅ |
| Profile | `apps/patient/profile/index.html` | ✅ |
| App Index / Dashboard | `apps/patient/index.html` | ✅ |

## Next Priorities

1. Kitchen Partner Portal finance page
2. Remaining kitchen pages
3. Provider portal pages

## Backlog

- **Generalize pref-row to shared component** -- the circle/square inset-ring selection pattern is visually strong and worth applying to provider/patient profile settings screens. Currently scoped to patient onboarding only. When a second use case appears, promote to `components.css` and document in COMPONENT-INDEX.md.
- Care coordinator interface (not yet designed)
- Referral form multi-step wizard (meals + RDN, multi-step tab-style wizard)
- Resolve Vanessa billing tool question: kitchen-facing portal vs. internal billing operations tool

## Blockers

_None at this time._
