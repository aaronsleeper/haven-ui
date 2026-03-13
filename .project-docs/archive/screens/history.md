# History

**Parent Navigation:** Account

## Screen Overview

Patients view a complete chronological audit log of all their health data, account changes, appointments, orders, and interactions with the care team. Activities are grouped by session or date, and clicking reveals detailed breakdowns of what changed during that time period.

## Features on Screen

- **Activity Timeline** - Reverse chronological list of all patient activities. Shows date/time, activity type icon, summary description. Grouped by session or day.
- **Activity Groups** - Related activities grouped together (e.g., "Appointment with Dr. Chen" includes: notes added, care plan updated, new appointment scheduled, address updated). Click to expand.
- **Filter Options** - Filter by activity type: All, Appointments, Health Data, Orders, Messages, Account Changes, Care Plan Updates.
- **Date Range Picker** - Filter to specific date ranges (Last 7 days, Last 30 days, Last 90 days, Custom range).
- **Activity Details** - Expanded view shows specific changes made, who made them, timestamps, and related audit information.
- **Search** - Search activity log by keyword or activity type.

**Key data:** activityType, timestamp, activitySummary, relatedActivities, changedBy, changeDetails

## Ava Integration

**First visit:** "This is your activity history. Every change to your health data, appointments, and account is logged here for your records."

**After searching:** "I found 12 activities related to 'blood pressure' in the last 30 days. Want me to summarize the trend?"

**After filter:** "You've had 4 appointments in the last 90 days. All notes and follow-ups are documented here."

## Wireframe

```
┌──────────────────────────────────────┬─────────────────┐
│ History              [🔍 Search]     │ Ava Chat        │
├──────────────────────────────────────┤                 │
│ [Filter: All ▼] [Date: Last 30d ▼]  │ "This is your   │
│                                      │ activity history│
│ ACTIVITY TIMELINE                    │ Every change is │
│ ┌──────────────────────────────────┐ │ logged here..." │
│ │ Dec 10, 2025                     │ │                 │
│ │ ┌──────────────────────────────┐ │ │ [Chat input]    │
│ │ │ 📅 Appointment with Dr. Chen │ │ │                 │
│ │ │ 3 related activities         │ │ │                 │
│ │ │ [CLICK TO EXPAND]            │ │ │                 │
│ │ └──────────────────────────────┘ │ │                 │
│ │   └─ (Expanded details below)    │ │                 │
│ │      • Care plan updated         │ │                 │
│ │      • Provider notes added      │ │                 │
│ │      • Follow-up scheduled       │ │ [Audit log]     │
│ │                                  │ │                 │
│ │ ┌──────────────────────────────┐ │ │                 │
│ │ │ 📊 Health Data Logged        │ │ │                 │
│ │ │ Weight: 183 lbs              │ │ │                 │
│ │ │ Logged by: You (8:30 AM)     │ │ │                 │
│ │ └──────────────────────────────┘ │ │                 │
│ │                                  │ │                 │
│ │ Dec 9, 2025                      │ │                 │
│ │ ┌──────────────────────────────┐ │ │                 │
│ │ │ 🍽️ Meal Order Placed         │ │ │                 │
│ │ │ Order #12345 - 12 meals      │ │ │                 │
│ │ │ [CLICK TO VIEW ORDER]        │ │ │                 │
│ │ └──────────────────────────────┘ │ │                 │
│ │                                  │ │                 │
│ │ ┌──────────────────────────────┐ │ │                 │
│ │ │ 📧 Message Received          │ │ │                 │
│ │ │ From: Dr. Chen               │ │ │                 │
│ │ │ "Lab results ready"          │ │ │                 │
│ │ │ [CLICK TO VIEW MESSAGE]      │ │ │                 │
│ │ └──────────────────────────────┘ │ │                 │
│ │                                  │ │                 │
│ │ Dec 8, 2025                      │ │                 │
│ │ ┌──────────────────────────────┐ │ │                 │
│ │ │ ⚙️ Account Updated           │ │ │                 │
│ │ │ Phone number changed         │ │ │                 │
│ │ │ By: You (2:15 PM)            │ │ │                 │
│ │ └──────────────────────────────┘ │ │                 │
│ └──────────────────────────────────┘ │                 │
└──────────────────────────────────────┴─────────────────┘
```

## Critical Questions

- **Activity granularity:** Show every data change or group minor changes? → **A) Group related changes (e.g., all edits in one session), show major activities individually**
- **Retention period:** Keep all history forever or archive old data? → **A) Keep all for compliance, paginate UI to load recent first**
- **Export:** Allow patients to export their full history? → **A) Yes, PDF or CSV export of filtered/date-ranged history**