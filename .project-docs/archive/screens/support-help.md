# Support & Help

**Parent Navigation:** Account

## Screen Overview

Patients access help resources, contact support, report issues, review app tutorials, and read legal documents (Terms of Service, Privacy Policy). Ava provides immediate assistance and can escalate to human support when needed.

## Features on Screen

- **FAQ Search** - Searchable knowledge base with common questions organized by category (Account, Appointments, Orders, Health Data, Billing, Technical).
- **Contact Support** - Button to message support team. Form includes issue category, description, optional screenshot. Shows support hours and expected response time.
- **Report Technical Issue** - Dedicated form for bugs/technical problems. Auto-captures device info, app version, error logs (with consent).
- **App Tutorial** - Interactive walkthrough of key features. Replayable sections: Dashboard, Ordering Meals, Logging Health Data, Messaging Team, Using Ava.
- **Getting Started Guide** - PDF or in-app guide for new patients covering program overview, first steps, and tips.
- **Legal Documents** - Links to Terms of Service, Privacy Policy, HIPAA Notice. Version history and last updated dates shown.
- **System Status** - Current status of app services (All Systems Operational, or notices about outages/maintenance).

**Key data:** faqCategory, supportTicketId, issueDescription, tutorialProgress, documentVersion

## Ava Integration

**Landing:** "Need help with something? I can answer questions, walk you through features, or connect you with our support team."

**FAQ assistance:** "I found 5 articles about scheduling appointments. Want me to summarize the most relevant one?"

**Issue escalation:** "I can help troubleshoot this. If we can't resolve it, I'll create a support ticket for you to get human help."

## Wireframe

```
┌──────────────────────────────────────┬─────────────────┐
│ Support & Help                       │ Ava Chat        │
├──────────────────────────────────────┤                 │
│ [🔍 Search help articles...]         │ "Need help with │
│                                      │ something? I can│
│ QUICK ACTIONS                        │ answer          │
│ [Contact Support CLICK]              │ questions..."   │
│ [Report Technical Issue CLICK]       │                 │
│ [Take App Tutorial CLICK]            │ [Chat input]    │
│                                      │                 │
│ FAQ CATEGORIES                       │                 │
│ ┌──────────────────────────────────┐ │                 │
│ │ 📅 Appointments (12 articles)    │ │                 │
│ │ [CLICK TO BROWSE]                │ │                 │
│ └──────────────────────────────────┘ │ [Audit log]     │
│ ┌──────────────────────────────────┐ │                 │
│ │ 🍽️ Ordering Meals (18 articles) │ │                 │
│ │ [CLICK TO BROWSE]                │ │                 │
│ └──────────────────────────────────┘ │                 │
│ ┌──────────────────────────────────┐ │                 │
│ │ 💳 Billing & Insurance (9)       │ │                 │
│ │ [CLICK TO BROWSE]                │ │                 │
│ └──────────────────────────────────┘ │                 │
│                                      │                 │
│ TUTORIALS                            │                 │
│ • Getting Started Guide              │                 │
│ • How to Log Health Data             │                 │
│ • Ordering Your First Meals          │                 │
│ • Using Ava Effectively              │                 │
│                                      │                 │
│ LEGAL & POLICIES                     │                 │
│ [Terms of Service]                   │                 │
│ [Privacy Policy]                     │                 │
│ [HIPAA Notice]                       │                 │
│                                      │                 │
│ System Status: ✓ All Systems Operational              │
└──────────────────────────────────────┴─────────────────┘
```

## Critical Questions

- **Support hours:** 24/7 or business hours only? → **A) Business hours (M-F 8am-6pm PT) for human support, Ava always available**
- **Ticket priority:** Support different priority levels? → **A) Yes: Urgent (clinical/safety), High (service impacting), Normal**
- **Tutorial completion:** Track and reward tutorial completion? → **A) Track progress, no rewards for v1**