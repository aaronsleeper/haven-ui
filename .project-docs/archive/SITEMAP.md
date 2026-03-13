# Patients App - Sitemap

## Overview

This sitemap outlines the navigation structure and screen hierarchy for the Cena Health patients application. All screens include the persistent Ava chat pane on the right side.

Detailed specifications for each screen can be found in the [screens](./screens/) folder.

---

## Primary Navigation

### 🏠 Home / Dashboard

[View detailed specifications](./screens/home-dashboard.md)

---

### 📊 My Health

**Navigation Label:** "My Health"

**Sub-Navigation:**

- **Health Data** - [View details](./screens/health-data.md)
- **Assessments** - [View details](./screens/assessments.md)
- **Care Plan** - [View details](./screens/care-plan.md)

---

### 🍽️ Meals & Nutrition

**Navigation Label:** "Meals"

**Sub-Navigation:**

- **Orders** - [View details](./screens/orders.md)
  - **Order Details** - [View details](./screens/order-details.md)
- **Place New Order** - [View details](./screens/place-new-order.md)

---

### 📅 Appointments

[View detailed specifications](./screens/appointments.md)

---

### 💬 Messages

[View detailed specifications](./screens/messages.md)

---

### 📄 Documents

[View detailed specifications](./screens/documents.md)

---

### 💳 Billing & Insurance

**Navigation Label:** "Billing"

**Sub-Navigation:**

- **Payment Management** - [View details](./screens/payment-management.md)
- **Insurance** - [View details](./screens/insurance.md)

---

### Account

**Navigation Label:** {Patient name}

**Sub-Navigation:**

- **Profile** - [View details](./screens/profile.md)
- **Preferences** - [View details](./screens/preferences.md)
- **Device Integration** - [View details](./screens/device-integration.md)
- **Support & Help** - [View details](./screens/support-help.md)
- **History** - [View details](./screens/history.md)
- **Education & Resources** - [View details](./screens/education-resources.md)
- **Feedback** - [View details](./screens/feedback.md)

---

## Global Features (Available Throughout App)

### Ava Chat Interface

**Always Visible:** Persistent right-side pane

- Chat input
- Conversation history
- Collapsed audit trail blocks
- Voice input toggle
- Expand/collapse pane

### Search

**Features:**

**Always Visible:** Persistent icon button
Clicking search will provide a modal dialog for the user's query. upon submission, the query will be submitted to Ava with a tag prefix of `#Search` and Ava will provide relevant results and/or guidance

---

## User Flows & Modal Screens

### Onboarding Flow

A guided workflow where the user can provide all needed information and Ava can respond letting them know the progress, and remaining items, including a link to the next item.

1. Welcome for new patients
2. Create account / Sign in
3. Personal information
4. Emergency contacts
5. Insurance information
6. Dietary preferences & allergies
7. Health goals setup
8. App tutorial
9. Connect devices (optional)
10. Notification preferences

### Authentication Screens

- Sign in
- Sign up
- Forgot password
- Reset password
- Multi-factor authentication
- Biometric setup

---

## Screen Hierarchy Visualization

```
└── App Container (with persistent Ava pane)
    │
    ├── Home / Dashboard
    │
    ├── My Health
    │   ├── Health Data
    │   ├── Assessments
    │   └── Care Plan
    │
    ├── Meals & Nutrition
    │   ├── Orders
    │   └── Place New Order
    │
    ├── Appointments
    │
    ├── Messages
    │
    ├── Documents
    │
    ├── Billing & Insurance
    │   ├── Payment Management
    │   └── Insurance
    │
    └── Account
        ├── Profile
        ├── Preferences
        ├── Device Integration
        ├── Support & Help
        ├── History
        ├── Education & Resources
        └── Feedback
```

---

## Navigation Patterns

### Desktop/Web

- **Primary Navigation:** Fixed left sidebar (collapsible)
- **Secondary Navigation:** Sub-nav within sections
- **Ava Pane:** Fixed right sidebar (collapsible)

### Mobile

- **Primary Navigation:** Bottom tab bar (5 items max)
- **Secondary Navigation:** Hamburger menu or in-screen tabs
- **Ava Pane:** Swipe-in from bottom to focus sheet modal for chat history and prompt entry

### Tablet

- **Hybrid approach:** Bottom navigation + side panels
- **Ava Pane:** Adaptive (sidebar on landscape, modal on portrait)

---

## Notes

- **Search Functionality:** Global search available from top nav to find any feature, document, or data
- **Quick Actions:** Context-sensitive floating action button (FAB) on mobile for common tasks
- **Breadcrumbs:** Used on web/tablet for deep navigation paths
- **Back Navigation:** Standard browser/app back button behavior must return user to previous screen state even if the full url did not change within a flow
- **Deep Linking:** All screens support deep linking for notifications and external links
- **Accessibility:** All navigation follows WCAG 2.1 AA standards with keyboard navigation and screen reader support
