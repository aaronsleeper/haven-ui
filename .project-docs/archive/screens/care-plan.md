# Care Plan

**Parent Navigation:** My Health

## Screen Overview

Patients view their personalized care plan including treatment goals, nutrition guidelines, behavioral health recommendations, and recent provider notes. They track progress on goals (both provider-set and self-set), review care plan updates over time, and get Ava's insights on achievements and next steps.

## Features on Screen

- **Care Plan Summary** - Overview of current treatment phase, primary goals, assigned providers. Shows last updated date.
- **Active Goals** - List of goals with progress indicators. Each goal shows who set it (provider/patient), target date, associated health metrics (if any), and current status. Click to view details/update progress.
- **Treatment Recommendations** - Current clinical recommendations from RDN and BHN. Organized by category (nutrition, behavioral health, medications, etc.).
- **Nutrition Guidelines** - Active dietary recommendations, meal timing, macros, restrictions. Links to related education resources.
- **Recent Care Team Notes** - Latest notes from providers (patient-visible notes only). Shows date, provider name, and note preview. Click to expand.
- **Care Plan Timeline** - Chronological view of care plan changes, goal additions/completions, recommendation updates. Filter by type or date range.

**Key data:** goalText, goalOwner, targetDate, progressPercent, associatedMetrics, recommendationText, providerName, noteDate, updateTimestamp

## Ava Integration

**New patient:** "Welcome! Your care team has created an initial care plan for you. Want me to walk you through your goals?"

**Progress made:** "Great work! You've completed 3 of 5 goals this month. Your nutrition adherence is up 25%."

**Goal due soon:** "Your weight goal target date is in 5 days. You're 80% there. Want to discuss strategies to finish strong?"

**Plan updated:** "Dr. Chen updated your care plan yesterday with new nutrition guidelines. I can explain what changed."

## Wireframe

```
┌──────────────────────────────────────┬─────────────────┐
│ Care Plan                            │ Ava Chat        │
├──────────────────────────────────────┤                 │
│ SUMMARY                              │ "Great work!    │
│ Phase: Active Treatment (Week 8/12)  │ You've completed│
│ Providers: Dr. Chen (RDN), Martinez  │ 3 of 5 goals... │
│ Last Updated: Dec 10 by Dr. Chen     │                 │
│                                      │ [Chat input]    │
│ ACTIVE GOALS (3/5 Complete)          │                 │
│ [Progress: 60% ████████░░░░░]        │                 │
│                                      │                 │
│ ┌──────────────────────────────────┐ │                 │
│ │ ✓ Reduce A1C to below 7%         │ │                 │
│ │ Set by: Dr. Chen | Due: Dec 15   │ │                 │
│ │ Current: 6.8% (Target: <7%)      │ │                 │
│ │ [CLICK TO VIEW]                  │ │                 │
│ └──────────────────────────────────┘ │                 │
│                                      │                 │
│ ┌──────────────────────────────────┐ │                 │
│ │ Log meals 5x/week                │ │ [Audit log]     │
│ │ Set by: You | Due: Dec 31        │ │                 │
│ │ Progress: 4/5 this week ████░    │ │                 │
│ │ [CLICK TO UPDATE]                │ │                 │
│ └──────────────────────────────────┘ │                 │
│                                      │                 │
│ TREATMENT RECOMMENDATIONS            │                 │
│ ┌──────────────────────────────────┐ │                 │
│ │ 🍎 Nutrition (Dr. Chen, RDN)     │ │                 │
│ │ • 45-60g carbs per meal          │ │                 │
│ │ • Mediterranean diet pattern     │ │                 │
│ │ • Limit added sugars <25g/day    │ │                 │
│ │ [CLICK TO EXPAND]                │ │                 │
│ └──────────────────────────────────┘ │                 │
│                                      │                 │
│ ┌──────────────────────────────────┐ │                 │
│ │ 🧠 Behavioral Health (Martinez)  │ │                 │
│ │ • Practice mindful eating        │ │                 │
│ │ • Stress management techniques   │ │                 │
│ │ [CLICK TO EXPAND]                │ │                 │
│ └──────────────────────────────────┘ │                 │
│                                      │                 │
│ RECENT CARE TEAM NOTES               │                 │
│ ┌──────────────────────────────────┐ │                 │
│ │ Dec 10 - Dr. Chen                │ │                 │
│ │ "Patient showing excellent       │ │                 │
│ │ progress with carb counting..."  │ │                 │
│ │ [CLICK TO READ MORE]             │ │                 │
│ └──────────────────────────────────┘ │                 │
│                                      │                 │
│ [View Care Plan Timeline]            │                 │
└──────────────────────────────────────┴─────────────────┘
```

## Critical Questions

- **Goal progress tracking:** Manual update by patient or auto-track from health data? → **A) Auto-track when linked to metrics (e.g., A1C goal), manual for others (e.g., "log meals")**
- **Care team notes visibility:** All notes or only flagged as patient-visible? → **A) Only patient-visible notes (providers control visibility)**
- **Timeline depth:** Show all history or last 90 days with "load more"? → **A) Last 90 days, expandable**