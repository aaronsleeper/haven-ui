# Screen Flow: Patient Assessments & Self-Report

## Screens in This Feature

| ID | Name | Route | Persona | Shell |
|----|------|-------|---------|-------|
| assess-01 | My Health (Hub) | `/apps/patient/health/index.html` | Patient | mobile-shell + bottom-nav (Health active) |
| assess-02 | Assessment Intro | `/apps/patient/health/assessment.html` | Patient | mobile-shell (no bottom nav — focused flow) |
| assess-03 | Assessment Question | (same page, JS-driven step) | Patient | mobile-shell (no bottom nav) |
| assess-04 | Assessment Complete | (same page, JS-driven final state) | Patient | mobile-shell (no bottom nav) |
| assess-05 | Metric Detail | `/apps/patient/health/metric.html` | Patient | mobile-shell + bottom-nav (Health active) |

## Navigation Flows

- Dashboard (home) → assessment prompt card → assess-02 (Intro)
- Dashboard (home) → "View my health" link → assess-01 (Hub)
- Bottom nav: Health tab → assess-01 (Hub)
- assess-01 → pending assessment card → assess-02 (Intro)
- assess-01 → metric card → assess-05 (Metric Detail)
- assess-02 → "Start" → assess-03 (first question)
- assess-03 → "Next" → assess-03 (next question, same page)
- assess-03 → "Back" → assess-03 (previous question)
- assess-03 → "Submit" (last question) → assess-04 (Complete)
- assess-04 → "Done" → assess-01 (Hub)
- assess-04 → "View my progress" → assess-01 (Hub, scrolled to trends)
- assess-04 → follow-up queued (e.g., PHQ-2 → PHQ-9) → assess-02 (next assessment Intro)
- assess-05 → back → assess-01 (Hub)
- Notification deep-link → assess-02 (specific assessment)

## Quick Check-In Flow (Micro-Assessment)

Quick check-ins (1–5 questions) use the same assess-02/03/04 flow but:
- Skip the intro screen (go straight to first question)
- Minimal chrome — no progress bar for 1-question check-ins
- Route param `?mode=checkin` controls the streamlined experience

## Shared Shell Components

- `mobile-shell` — existing, used by all patient screens
- `mobile-bottom-nav` — existing, needs "Health" tab added (5th tab)
- `mobile-i18n-bar` — existing, no changes

## Dashboard Integration

The existing patient dashboard (`apps/patient/index.html`) will gain:
- An assessment prompt card when assessments are pending
- A "My Health" shortcut link

These are modifications to an existing screen, not a new wireframe.

## Out of Scope

- Wearable setup flow (future phase — placeholder card only in assess-01)
- Provider/coordinator views of assessment responses (separate persona)
- Assessment configuration/authoring (backend concern)
- Gamification / streaks (deferred)
