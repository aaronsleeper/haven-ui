# Screen Flow: Patient Mobile Shell + v1 Routes

## Screens in This Feature

| ID | Name | Route | Persona | Shell |
|----|------|-------|---------|-------|
| shell-pt-mobile | Patient mobile shell (persistent) | persistent across all routes | Patient | shell-pt-mobile |
| pt-01-dashboard | Dashboard (Tasks tab) | `/` | Patient | shell-pt-mobile |
| pt-02-messages | Messages (the patient "thread" surface — notifications-only) | `/messages` | Patient | shell-pt-mobile |
| pt-03-settings | Settings | `/settings` | Patient | shell-pt-mobile |
| pt-04-my-health | My Health (lighter stub at v1 — points to existing assess-01) | `/health` | Patient | shell-pt-mobile |
| pt-05-care | Care (lighter stub at v1) | `/care` | Patient | shell-pt-mobile |

The earlier `patient-mobile-shell.md` is preserved for context; `shell-pt-mobile.md` (this pass) is the canonical wireframe-format version.

Existing assessment wireframes (assess-01 through assess-05, dashboard-tasks-section, tasks-01-task-list) cover the assessment + task list flows. This pass adds the missing routes (Messages, Settings) and adds Dashboard / My Health / Care as proper wireframes inside the universal shell pipeline.

## Navigation Flows

- App open / push notification → pt-01-dashboard (with today's task surfaced if any)
- pt-01-dashboard (tap task card) → assess-02-assessment-intro → assess-03-question (per-question stepper) → assess-04-complete → return to pt-01-dashboard
- pt-01-dashboard (tap My Health bottom-nav tab) → pt-04-my-health → tap trend card → assess-05-metric-detail → back to pt-04-my-health
- pt-01-dashboard (tap Messages bottom-nav tab) → pt-02-messages → tap a message → expanded message + reply composer → send → back to pt-02-messages
- pt-01-dashboard (tap Care bottom-nav tab) → pt-05-care
- pt-01-dashboard (tap Settings bottom-nav tab) → pt-03-settings → tap language toggle → all visible strings re-render in target language → user pref persisted
- pt-02-messages → reply → reply appears as `message-bubble-out` at the right of the thread
- Any route → tap EN/ES toggle in `mobile-i18n-bar` → language switches in place

## Shared Shell Components

- `shell-pt-mobile.md` — patient mobile shell (this pass), built on `mobile-shell` + `mobile-i18n-bar` + `mobile-bottom-nav`
- The same shell wraps every patient route; routes plug into the route content area

## Out of Scope

- Mobile swipe-nav between routes — deferred to v1.1 per Gate 2-prep decision 9 (bottom-nav only at v1)
- Desktop variant of the patient app — patient is mobile-first; desktop renders the mobile shell centered at 430px max-width
- Full Care plan and Appointments details — pt-05-care is a lighter stub at v1 that lists a high-level summary; deeper care-plan / appointment screens come in a later pass
- Push-notification deep-link to a specific task — v1 lands on pt-01-dashboard with task surfaced; direct-to-task is v1.1 (per shell-use-cases.md open question 2)
- Full bilingual deep dive on My Health / Care content — those are bilingual-ready in source docs; this pass authors the shell + Messages + Dashboard + Settings as primary EN/ES surfaces (per Gate 2-prep decision 4)
