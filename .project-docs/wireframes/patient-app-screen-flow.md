# Patient App MVP - Screen Flow Overview

**Application:** Patient Portal (Mobile)
**Total screens:** 10
**Device:** Mobile-first (smartphone primary)

---

## Screens in This Flow

### Onboarding (one-time, linear)
1. `onb-01-welcome.md` - Welcome + account setup (password/PIN) --> onb-02
2. `onb-02-consent.md` - Stepped consent screens (HIPAA, program, AVA) --> onb-03
3. `onb-03-preferences.md` - Language, food preferences, communication prefs --> meals home

### Meals
4. `meals-01-weekly-meals.md` - Browse and confirm this week's meals --> meals-02 or care-01
5. `meals-02-delivery-status.md` - Delivery day status + issue reporting

### Care Team & Feedback
6. `care-01-messages.md` - Unified care team message thread
7. `care-02-meal-feedback.md` - Post-delivery meal rating + issue prompt

### Profile
8. `profile-01-settings.md` - Contact info, preferences, communication settings

### Shell
9. `shell-bottom-nav.md` - Persistent bottom tab bar spec (applies to all post-onboarding screens)

---

## Flow Diagrams

### Onboarding Flow (one-time)
```
SMS Link
  --> onb-01-welcome (account setup)
        --> onb-02-consent (stepped: HIPAA > Program > AVA)
              --> onb-03-preferences (language, food, contact)
                    --> meals-01-weekly-meals (home screen post-onboard)
```

### Core Navigation (post-onboarding)
```
Bottom Tab Bar
  ├── [Meals tab]      --> meals-01-weekly-meals
  ├── [Deliveries tab] --> meals-02-delivery-status
  ├── [Care Team tab]  --> care-01-messages
  └── [Profile tab]   --> profile-01-settings
```

### Meal Feedback Trigger (system-initiated)
```
Push notification (post-delivery)
  --> care-02-meal-feedback
        ├── [Submit] --> meals screen
        └── [Dismiss] --> no action; prompt may appear again once
```

### Cross-Screen Shortcuts
```
meals-01-weekly-meals
  --> [Message care team] shortcut --> care-01-messages

meals-02-delivery-status
  --> [Report an issue] --> inline issue form (on-screen, not a new route)
  --> [Message care team] --> care-01-messages

profile-01-settings
  --> [Read-only field tap] --> care-01-messages (deep-linked compose)
```

---

## Navigation Notes

- Bottom tab bar is persistent on all post-onboarding screens
- Onboarding screens suppress the bottom nav (linear flow only)
- Active tab is highlighted with primary color + label
- Tab bar: Meals | Deliveries | Care Team | Profile (4 tabs)
- Badge on Care Team tab for unread messages

---

## Routes

| Screen | Route |
|--------|-------|
| Welcome / Account Setup | `/onboarding/welcome` |
| Consent | `/onboarding/consent` |
| Preferences | `/onboarding/preferences` |
| Weekly Meals | `/meals` |
| Delivery Status | `/deliveries` |
| Messages | `/care-team/messages` |
| Meal Feedback | `/care-team/feedback` |
| Profile / Settings | `/profile` |
