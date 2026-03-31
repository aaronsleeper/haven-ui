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
- **Patient assessments & self-report** — Wireframes and UX review complete (Gate 2 ready 2026-03-31). Tasks system on dashboard (top 3 tasks + "See all" link to full task list). "Health" bottom nav tab for trends. Markdown-defined assessment library with generic renderer. Prototype set: PHQ-2, mood check-in, Hunger Vital Sign. See `apps/patient/design/`. Next step: haven-mapper + dev-tasker (Gate 3).
  - **Remaining assessments to build** (post-prototype):
    - PHQ-9 (depression severity, triggered by PHQ-2)
    - GAD-2 (anxiety screen)
    - GAD-7 (anxiety severity, triggered by GAD-2)
    - PHQ-4 (ultra-brief depression + anxiety combined)
    - AUDIT-C (alcohol use)
    - PRAPARE core — 5 domain sections (housing, food, transportation, safety, stress/social)
    - AHC HRSN (Accountable Health Communities — housing, food, transportation, utilities, safety)
    - MNA-SF (Mini Nutritional Assessment, elderly malnutrition risk)
    - Meal satisfaction check-in (per-delivery)
    - Dietary adherence self-report (weekly, configurable)
    - General wellness check-in (daily, if enrolled)
    - Symptom check (weekly)
  - **Future task types** (Tasks system is extensible): measurements/vitals reporting, journal entries, appointment scheduling, documentation submission, meal ordering
- **Wearable data integration** — placeholder "Connect a device" card in Health tab for v1. Future: OAuth/Health Connect/HealthKit setup flow, granular data-sharing toggles, passive data merged into trends view. Android must use Health Connect (Google Fit deprecated June 2025).
- **Gamification / engagement indicators** — explore completion streaks, progress badges, and engagement indicators after core assessment functionality ships. Consider tone for elderly population.
- Care coordinator interface (not yet designed)
- Referral form multi-step wizard (meals + RDN, multi-step tab-style wizard)
- Resolve Vanessa billing tool question: kitchen-facing portal vs. internal billing operations tool

## Blockers

_None at this time._
