# Patient App: MVP Feature Scope

**Document version:** 1.0
**Date:** February 2026
**Prepared by:** Aaron Cordova, CXO

---

## Scope Decision

The MVP patient app is scoped to the minimum features required to support the 800-patient Q1 2026 pilot. Features that require clinical decision logic, content management workflows, or significant backend complexity are deferred to post-MVP.

---

## MVP Modules

| Module | Use Cases | Priority |
|--------|-----------|----------|
| Onboarding | PT-ONB-001, PT-ONB-002 | P0 - required for enrollment |
| Meals | PT-MEALS-001, PT-MEALS-002 | P0 - core program value |
| Care Team & Feedback | PT-CARE-001, PT-CARE-002 | P0 - support + adherence |
| Profile | PT-PROFILE-001 | P1 - operational necessity |

---

## Deferred (Post-MVP)

- **Health tracking** (self-reported vitals, assessments): Requires clinical alert logic and stakeholder validation before implementation
- **Appointment scheduling**: Care coordinators manage this manually at pilot scale
- **Education/content library**: No operational dependency for pilot; own content workstream
- **AVA check-in UI**: AVA operates out-of-band via voice; no in-app UI needed for MVP
- **Meal history**: Useful but not blocking pilot success

---

## Design Constraints (All Screens)

- Mobile-first (smartphone primary)
- WCAG AA minimum contrast
- Bilingual: English and Spanish throughout
- Health literacy: plain language, no medical jargon
- Cognitive load: single primary action per screen where possible
- Cultural sensitivity: diverse representation, no "clean eating" aesthetics

---

## Files in This Directory

- `patient-app-mvp-overview.md` — this file
- `onboarding-use-cases.md` — PT-ONB-001, PT-ONB-002
- `meals-use-cases.md` — PT-MEALS-001, PT-MEALS-002
- `care-team-use-cases.md` — PT-CARE-001, PT-CARE-002
- `profile-use-cases.md` — PT-PROFILE-001
