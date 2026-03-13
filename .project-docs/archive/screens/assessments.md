# Assessments

**Parent Navigation:** My Health

## Screen Overview

Patients view and complete clinical assessments (like PHQ-9, GAD-7) required by their care plan. They see which are overdue/available, track scores over time via simple charts, and get Ava's insights on trends.

## Features on Screen

- **Status Summary** - Shows progress bar (4/7 complete), counts by status (overdue, in progress, available), and next due assessment
- **Assessment List** - Scrollable list with assessment name, status badge, due date, completion %. Click to open form. Filter by status (All/Overdue/Complete). Sort by due date.
- **Trends Chart** - Simple line chart showing scores over time for one assessment type. Dropdown to switch between assessment types. Time range buttons (3mo/6mo/1yr).
- **Ava Recommendations** - Cards showing concerning trends or positive progress with "Discuss with Ava" button

**Key data:** assessmentName, status, dueDate, score, trendData (date/score pairs), recommendationText

## Ava Integration

**Overdue:** "You have an overdue PHQ-9 from Dec 10. Want to complete it now? I can help."

**Caught up:** "Great job! All caught up. Next PHQ-9 due Dec 16."

## Wireframe

```
┌──────────────────────────────────────┬─────────────────┐
│ Assessments                          │ Ava Chat        │
├──────────────────────────────────────┤                 │
│ STATUS: 4/7 Complete ████░░░         │ "You have an    │
│ 2 Overdue | 1 In Progress            │ overdue PHQ-9..." │
│                                      │                 │
│ [Filter: All ▼] [Sort: Due Date ▼]  │ [Chat input]    │
│                                      │                 │
│ ┌──────────────────────────────────┐ │                 │
│ │ [!] PHQ-9 - Depression Screening │ │                 │
│ │ OVERDUE | Due Dec 10             │ │                 │
│ │ [CLICK TO COMPLETE]              │ │                 │
│ └──────────────────────────────────┘ │                 │
│                                      │                 │
│ ┌──────────────────────────────────┐ │                 │
│ │ GAD-7 - Anxiety                  │ │ [Audit log]     │
│ │ IN PROGRESS (5/7) | Due Dec 14   │ │                 │
│ │ [CLICK TO CONTINUE]              │ │                 │
│ └──────────────────────────────────┘ │                 │
│                                      │                 │
│ ┌──────────────────────────────────┐ │                 │
│ │ ✓ PHQ-9 - Depression             │ │                 │
│ │ Completed Dec 7 | Score: 12      │ │                 │
│ │ [CLICK TO VIEW]                  │ │                 │
│ └──────────────────────────────────┘ │                 │
│                                      │                 │
│ TRENDS: PHQ-9 [Switch ▼]            │                 │
│ [3mo] [6mo] [1yr]                    │                 │
│ ┌──────────────────────────────────┐ │                 │
│ │  20┤                             │ │                 │
│ │  15┤  ●─●                         │ │                 │
│ │  10┤      ●─●                     │ │                 │
│ │   5┤                              │ │                 │
│ │    └──Oct──Nov──Dec──            │ │                 │
│ │ "Scores improved 35% in 3 mo"    │ │                 │
│ └──────────────────────────────────┘ │                 │
│                                      │                 │
│ RECOMMENDATIONS                      │                 │
│ ┌──────────────────────────────────┐ │                 │
│ │ ⚠ GAD-7 scores increased         │ │                 │
│ │ Consider discussing with team    │ │                 │
│ │ [Discuss with Ava] [Acknowledge] │ │                 │
│ └──────────────────────────────────┘ │                 │
└──────────────────────────────────────┴─────────────────┘
```

## Critical Questions

- **Trends chart:** One assessment at a time or multi-assessment overlay? → **A) One at a time (simpler)**
- **Assessment form:** Modal or full page? → **A) Modal (keeps context)**
- **In-progress save:** Auto-save or manual? → **A) Auto-save**