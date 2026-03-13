# Cena Health Information Architecture Map

The structural map of all Cena Health applications. This defines where features live, how navigation works, and how different user types access the system.

## How to Use This File

- Before proposing a new feature's location, check this map for the logical placement
- When adding new sections or pages, update this map
- Navigation depth should rarely exceed 3 levels from the application root
- Each application section should be reachable in 2 clicks from the role-based landing page

---

## Applications Overview

Cena Health operates multiple applications serving different user types:

```
Cena Health Platform
├── Patient Portal (Web/Mobile)
├── Clinical or Provider Portal (Dietitians, RDNs)
├── Coordinator or Admin Portal (Care Coordinators)
├── Kitchen Partner Portal (Kitchen staff)
```

---

## Patient Portal

Target user: Patients
Primary device: Mobile (voice-first via AVA)
Design priority: Simplicity, warmth, clarity

```
Onboarding (one-time, suppresses tab bar)
├── /onboarding/welcome       → Account setup (password/PIN)
├── /onboarding/consent       → Stepped consent (HIPAA, Program, AVA)
└── /onboarding/preferences   → Language, food preferences, communication prefs

Main App (bottom tab bar: Meals | Delivery | Care Team | Profile)
├── /meals                    → Weekly meals: browse, swap, confirm
├── /deliveries               → Delivery status + issue reporting
├── /care-team/messages       → Unified care team message thread
├── /care-team/feedback/:id   → Post-delivery meal feedback (also reachable via push notification)
└── /profile                  → Contact info, meal preferences, communication settings, account
```

**Navigation:** Bottom tab bar (4 tabs). Meals | Delivery | Care Team | Profile.
Onboarding screens suppress the tab bar. Post-onboarding, all main screens are reachable in 1 tap.

**MVP scope note:** Health tracking, appointment scheduling, education content, and AVA check-in UI are deferred to post-MVP. See `patient-app/patient-app-mvp-overview.md`.

---

## Clinical Portal

Target user: Dietitians, RDNs
Primary device: Desktop (tablet secondary)
Design priority: Efficiency, scanning, batch operations

```
Clinical Home (Landing - Patient Panel)
├── Patient Panel (exception-based view)
│   ├── Patient Detail
│   │   ├── Clinical Summary
│   │   ├── Meal Plan
│   │   ├── Adherence & Outcomes
│   │   ├── Care Notes
│   │   └── Communication History
│   ├── Filters & Search
│   └── Batch Actions
├── Meal Planning
│   ├── Plan Templates
│   ├── Menu Library
│   └── Cultural Menus
├── Scheduling
│   ├── My Appointments
│   └── Patient Requests
├── Reports
│   ├── Panel Overview
│   ├── Outcomes Summary
│   └── Documentation Export
└── Settings
```

**Navigation:** Sidebar nav (desktop), collapsible. Patient panel is always accessible.

---

## Coordinator Portal

Target user: Care Coordinators
Primary device: Desktop
Design priority: Status visibility, task management, communication

```
Coordinator Home (Landing - Task Queue)
├── Task Queue
│   ├── Open Tasks
│   ├── Overdue
│   └── Completed
├── Patient Overview
│   ├── Active Patients
│   ├── At-Risk Patients
│   └── Patient Detail (shared with Clinical Portal)
├── Delivery Management
│   ├── Today's Deliveries
│   ├── Issues & Exceptions
│   └── Delivery History
├── Communication
│   ├── Patient Messages
│   ├── Care Team Messages
│   └── Outreach Queue
├── Reports
│   ├── Operations Dashboard
│   ├── Adherence Metrics
│   └── SLA Tracking
└── Settings
```

**Navigation:** Sidebar nav (desktop). Task queue badge count visible globally.

---

## Kitchen Partner Portal

Target user: Kitchen partner staff
Primary device: Desktop (kitchen office), tablet/phone supported
Design priority: Minimal friction, guided workflows, fast task completion

```
Kitchen Home (Landing)
├── Recipes
│   ├── Recipe List (overview of all kitchen recipes)
│   └── Add Recipes (agent-assisted input flow)
├── Orders (future)
└── Settings
```

**Navigation:** Simple top nav or sidebar. Minimal sections; this portal should feel lightweight. Recipe List is the default landing since it's the primary task.

---

## Admin Portal

Target user: Health System Administrators
Primary device: Desktop
Design priority: Data clarity, exportability, proof of value

```
Admin Home (Landing - Executive Dashboard)
├── Dashboard
│   ├── Program Overview
│   ├── Outcome Metrics
│   ├── Financial Summary
│   └── Utilization Trends
├── Reports
│   ├── Clinical Outcomes
│   ├── Cost Analysis
│   ├── Population Health
│   └── Custom Reports
├── Program Management
│   ├── Active Programs
│   ├── Provider Directory
│   └── Payer Contracts
└── Settings
    ├── Organization
    ├── Users & Roles
    └── Integrations
```

**Navigation:** Top nav with dropdown menus. Dashboard is the anchor.

---

## Cross-Application Patterns

### Shared Components

These elements behave consistently across all portals:

- Patient detail view (structure consistent, depth varies by role)
- Meal display cards (same visual treatment everywhere)
- Status indicators (color + icon + label, same meanings)
- Notification system (role-appropriate filtering)

### Shared Data

- Patient records are the same underlying data, filtered by role permissions
- Meal plans are visible to all roles but editable only by clinical users
- Messages thread across roles (patient sees their thread; clinician sees all their patients' threads)
- Recipes are scoped per-kitchen; Kitchen A cannot see Kitchen B's data

---

## Changelog

| Date       | Change                                     | Rationale                                                              |
| ---------- | ------------------------------------------ | ---------------------------------------------------------------------- |
| (initial)  | Created baseline IA map                    | Starting structure for platform MVP planning                           |
| 2025-02-11 | Added Kitchen Partner Portal               | New user type for recipe management feature                            |
| 2025-02-11 | Renamed portals to remove "VozCare" prefix | VozCare is deprecated naming; portals are part of Cena Health Platform |
| 2026-02-18 | Updated Patient Portal IA to MVP route structure | Wireframe specs complete for 8 screens; post-MVP features deferred to patient-app-mvp-overview.md |
