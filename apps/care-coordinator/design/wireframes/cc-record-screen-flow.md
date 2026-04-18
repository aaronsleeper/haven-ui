# Screen Flow: Record Viewer & Patient List

## Screens in This Feature

| ID | Name | Route | Persona | Shell |
|----|------|-------|---------|-------|
| CC-04 | Referral Record | `/care-coordinator/` (center panel) | Care Coordinator | CC-SHELL |
| CC-05 | Care Plan Viewer | `/care-coordinator/` (center panel) | Care Coordinator | CC-SHELL |
| CC-06 | Care Plan Diff | `/care-coordinator/` (center panel) | Care Coordinator | CC-SHELL |
| CC-07 | Patient Record | `/care-coordinator/` (center panel) | Care Coordinator | CC-SHELL |
| CC-08 | Duplicate Comparison | `/care-coordinator/` (center panel) | Care Coordinator | CC-SHELL |
| CC-09 | Patient List | `/care-coordinator/patients` (center panel) | Care Coordinator | CC-SHELL |

## Navigation Flows

All screens render in the center panel of the existing CC-SHELL. The left (queue sidebar) and right (thread panel) are unchanged from the queue triage sprint.

- CC-SUMMARY (default) → (click referral queue item) → CC-04
- CC-SUMMARY (default) → (click referral queue item with duplicate flag) → CC-08
- CC-SUMMARY (default) → (click care plan queue item, new plan) → CC-05
- CC-SUMMARY (default) → (click care plan queue item, plan update) → CC-06
- CC-SUMMARY (default) → (click clinical/discharge queue item) → CC-07
- CC-04 → (approve referral → enrollment) → CC-07 (patient record created)
- CC-05 → (approve care plan) → queue item removed, center stays on CC-05
- CC-06 → (approve update) → queue item removed, center stays on CC-06
- CC-07 → (click "View care plan" link) → CC-05
- CC-SHELL sidebar nav → (click "Patients") → CC-09
- CC-09 → (click patient row) → CC-07 + thread loads in right panel
- CC-09 → (click Cena logo or "Queue" nav) → CC-SUMMARY

## Shared Shell Components

- CC-SHELL (built — apps/care-coordinator/index.html)
- CC-QUEUE (built — left sidebar)
- CC-THREAD (built — right panel, unchanged)

## Out of Scope

- CC-PATIENTS sort/filter persistence across sessions (future)
- Inline editing of coordinator-owned care plan sections (interaction spec only — requires JS)
- Document/PDF viewer for attached clinical summaries (future — link to external viewer)
- Patient communication center (Feature 1.5, separate sprint)
- Scheduling dashboard (Feature 1.4, separate sprint)
