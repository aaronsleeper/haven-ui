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
- **Patient assessments & self-report** — UX architect complete (Gate 1 approved 2026-03-31). Standard behavioral (PHQ-2/9, GAD-2/7, AUDIT-C), SDOH (Hunger Vital Sign, PRAPARE, AHC HRSN), and dietary (MNA-SF, meal satisfaction, adherence) assessments. Markdown-defined assessment library with generic renderer. New "Health" bottom nav tab. Trends view required. See `apps/patient/design/assessments-use-cases.md`. Next step: wireframing.
- **Wearable data integration** — placeholder "Connect a device" card in Health tab for v1. Future: OAuth/Health Connect/HealthKit setup flow, granular data-sharing toggles, passive data merged into trends view. Android must use Health Connect (Google Fit deprecated June 2025).
- **Gamification / engagement indicators** — explore completion streaks, progress badges, and engagement indicators after core assessment functionality ships. Consider tone for elderly population.
- Care coordinator interface (not yet designed)
- Referral form multi-step wizard (meals + RDN, multi-step tab-style wizard)
- Resolve Vanessa billing tool question: kitchen-facing portal vs. internal billing operations tool

## Blockers

_None at this time._
