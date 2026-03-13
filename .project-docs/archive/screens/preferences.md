# Preferences

**Parent Navigation:** Account

## Screen Overview

Patients customize their app experience including theme, notifications, nutrition preferences, delivery settings, privacy controls, and how they interact with Ava. Changes are saved automatically with audit trail logging.

## Features on Screen

- **App Settings** - Theme (Light, Dark, Auto), Language selection, Accessibility options (font size, contrast).
- **Nutrition Preferences** - Dietary restrictions (from care plan + personal additions), food allergies, dislikes, favorite cuisines. Used to filter meal recommendations.
- **Notification Settings** - Toggle notifications by type: Appointments, Messages, Health Reminders, Order Updates, Ava Check-ins. Choose delivery method: Push, Email, SMS, or combinations.
- **Delivery Preferences** - Default delivery address, special instructions (gate code, leave at door, etc.), preferred delivery time window.
- **Privacy Settings** - Control who can see your data, audit trail visibility preferences, data sharing consent for research.
- **Ava Interaction** - Greeting style (Friendly, Professional, Minimal), check-in frequency, proactive suggestion preferences.
- **Audit Trail Display** - Choose audit log detail level: Full, Summary, Hidden (compliance may require minimum visibility).

**Key data:** theme, language, dietaryRestrictions, notificationPreferences, deliveryAddress, privacySettings, avaPreferences

## Ava Integration

**Updating preferences:** "I can help you update your preferences. What would you like to change?"

**Notification recommendation:** "I notice you have all notifications enabled. Want to customize which updates you receive?"

**Dietary update:** "You added 'shellfish allergy' to your preferences. I'll make sure none of your meal recommendations include seafood."

## Wireframe

```
┌──────────────────────────────────────┬─────────────────┐
│ Preferences                          │ Ava Chat        │
├──────────────────────────────────────┤                 │
│ APP SETTINGS                         │ "I can help you │
│ Theme: [Light ▼] [Dark] [Auto]       │ update your     │
│ Language: [English ▼]                │ preferences..." │
│ Font Size: [Medium ▼]                │                 │
│                                      │ [Chat input]    │
│ NUTRITION PREFERENCES                │                 │
│ Dietary Restrictions:                │                 │
│ ☑ Gluten-free (Care plan)            │                 │
│ ☑ Low-carb (Care plan)               │                 │
│ ☑ Shellfish allergy (You)            │                 │
│ [Add Preference CLICK]               │                 │
│                                      │                 │
│ NOTIFICATIONS                        │ [Audit log]     │
│ ☑ Appointments (Push, Email)         │                 │
│ ☑ Messages (Push)                    │                 │
│ ☐ Health Reminders (None)            │                 │
│ ☑ Order Updates (Email)              │                 │
│ ☑ Ava Check-ins (Push)               │                 │
│                                      │                 │
│ DELIVERY PREFERENCES                 │                 │
│ Default Address:                     │                 │
│ 123 Main St, Apt 4B                  │                 │
│ [Change Address CLICK]               │                 │
│ Special Instructions:                │                 │
│ "Leave at door, ring doorbell"       │                 │
│ [Edit CLICK]                         │                 │
│                                      │                 │
│ AVA INTERACTION                      │                 │
│ Greeting Style: [Friendly ▼]         │                 │
│ Check-in Frequency: [Daily ▼]        │                 │
│ ☑ Allow proactive suggestions        │                 │
└──────────────────────────────────────┴─────────────────┘
```

## Critical Questions

- **Default preferences:** What are sensible defaults for new patients? → **A) All notifications on, friendly Ava, daily check-ins, light theme**
- **Privacy defaults:** Opt-in or opt-out for data sharing? → **A) Opt-in (patient must consent)**
- **Care plan override:** Can patients disable care-plan dietary restrictions? → **A) No, care plan restrictions locked (patient can add more, not remove)**