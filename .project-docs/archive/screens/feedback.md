# Feedback

**Parent Navigation:** Account

## Screen Overview

Patients provide feedback through a conversational interface with Ava. They can rate providers, review meals, report issues with service, or give general feedback. Ava guides them through structured feedback flows and shows their feedback history with responses from the care team.

## Features on Screen

- **Feedback Prompt** - Ava asks "What would you like to provide feedback on today?" with quick action buttons: Rate Provider, Review Meal, Report Issue, General Feedback.
- **Conversational Flow** - Ava guides through questions based on feedback type (e.g., for provider ratings: which provider, rating 1-5, what went well/needs improvement).
- **Feedback History** - Scrollable list of past feedback with date, type, status (Submitted, Under Review, Resolved), and any responses from care team. Click to expand details.
- **Quick Templates** - Common feedback topics as one-click options: "Meal was cold", "Great appointment", "Need help with...", etc.

**Key data:** feedbackType, targetEntity (provider/meal/service), rating, feedbackText, submittedDate, status, responseText, respondedBy

## Ava Integration

**Landing:** "What would you like to provide feedback on today? I can help you rate a provider, review a meal, report an issue, or share general feedback."

**After appointment:** "How was your appointment with Dr. Chen today? I'd love to hear your thoughts."

**After meal delivery:** "Your meals arrived today. How's everything looking? Any feedback on quality or variety?"

## Wireframe

```
┌──────────────────────────────────────┬─────────────────┐
│ Feedback                             │ Ava Chat        │
├──────────────────────────────────────┤                 │
│                                      │ Ava: "What would│
│                                      │ you like to     │
│ GIVE FEEDBACK                        │ provide feedback│
│ ┌──────────────────────────────────┐ │ on today?"      │
│ │ What would you like feedback on? │ │                 │
│ │                                  │ │ [Rate Provider] │
│ │ [Rate Provider CLICK]            │ │ [Review Meal]   │
│ │ [Review Meal CLICK]              │ │ [Report Issue]  │
│ │ [Report Issue CLICK]             │ │ [General]       │
│ │ [General Feedback CLICK]         │ │                 │
│ └──────────────────────────────────┘ │                 │
│                                      │ [Chat input]    │
│ FEEDBACK HISTORY                     │                 │
│ ┌──────────────────────────────────┐ │                 │
│ │ Dec 10 - Provider Rating         │ │                 │
│ │ Dr. Chen (RDN) - ⭐⭐⭐⭐⭐       │ │                 │
│ │ [✓ Response received]            │ │ [Audit log]     │
│ │ [CLICK TO VIEW]                  │ │                 │
│ └──────────────────────────────────┘ │                 │
│                                      │                 │
│ ┌──────────────────────────────────┐ │                 │
│ │ Dec 8 - Meal Review              │ │                 │
│ │ Lunch delivery - Issue reported  │ │                 │
│ │ [⏱ Under Review]                 │ │                 │
│ │ [CLICK TO VIEW]                  │ │                 │
│ └──────────────────────────────────┘ │                 │
│                                      │                 │
│ ┌──────────────────────────────────┐ │                 │
│ │ Dec 5 - General Feedback         │ │                 │
│ │ App suggestion                   │ │                 │
│ │ [✓ Resolved]                     │ │                 │
│ │ [CLICK TO VIEW]                  │ │                 │
│ └──────────────────────────────────┘ │                 │
└──────────────────────────────────────┴─────────────────┘
```

## Critical Questions

- **Anonymous feedback:** Allow patients to submit anonymously? → **A) No, always attributed (enables follow-up and accountability)**
- **Provider visibility:** Do providers see ratings immediately or after review? → **A) After care team review (allows filtering of inappropriate content)**
- **Rating scale:** 1-5 stars or different system? → **A) 1-5 stars for providers/meals, free text for general feedback**