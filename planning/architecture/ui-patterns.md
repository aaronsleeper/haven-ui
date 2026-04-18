# UI Patterns

> The universal layout and interaction model that applies across all Ava app surfaces.
> One pattern, six surfaces. Consistency here means users who work across surfaces
> (a coordinator who also uses the admin app) don't have to re-learn anything.

---

## The three-panel layout

Every Ava screen is composed of three panels. The panels scale, hide, or collapse based on
screen size and context — but the underlying model never changes.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  ┌──────────────┐  ┌───────────────────────────────┐  ┌─────────────┐  │
│  │              │  │                               │  │             │  │
│  │   LEFT       │  │         CENTER                │  │   RIGHT     │  │
│  │   SIDEBAR    │  │         CONTENT               │  │   THREAD    │  │
│  │              │  │                               │  │             │  │
│  │  Navigation  │  │  Forms, lists, records,       │  │  Agent chat │  │
│  │  Queue items │  │  documents, dashboards        │  │  Audit log  │  │
│  │  Pinned      │  │                               │  │  Approvals  │  │
│  │              │  │                               │  │             │  │
│  └──────────────┘  └───────────────────────────────┘  └─────────────┘  │
│   ~240px fixed       flex-grow                          ~380px fixed    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Left sidebar** — navigation, queue, and quick actions. What does this user need to do
today? Queue items sorted by urgency. Navigation to major sections. Pinned patients or
records for quick access.

**Center panel** — the content being worked on. A patient record, a care plan, an order
list, a report. This is the main workspace. Forms, data tables, documents — all center.

**Right panel** — the thread. The agent's activity log for whatever is open in the center.
Approval requests surface here. The human types responses and decisions here. The full
history of what happened with this record lives here.

The thread in the right panel is contextual — it shows the thread for the specific record
open in the center. Open a patient record → see the patient's workflow thread. Open an
order → see the order's thread. The right panel is never generic.

---

## Left sidebar in detail

```
┌──────────────┐
│  [Logo]      │
│  ──────────  │
│  ▲ URGENT    │  ← items with SLA breach imminent
│  • Patient A │
│  • Claim #12 │
│  ──────────  │
│  QUEUE  (14) │  ← total pending items
│  • Care plan │
│  • RDN note  │
│  • Report    │
│  ──────────  │
│  PINNED      │
│  • Maria G.  │
│  • Clinic    │
│  ──────────  │
│  Navigation  │
│  Patients    │
│  Orders      │
│  Reports     │
│  Settings    │
└──────────────┘
```

Queue items in the sidebar are the primary driver of a coordinator's or clinician's workday.
Each queue item shows:
- Patient name (or subject)
- What's needed (one line)
- Which agent is waiting (or urgency level)
- Time in queue

Clicking a queue item opens the relevant record in the center panel and loads the relevant
thread in the right panel. One tap to context.

---

## Right panel (thread) in detail

The thread panel renders messages in chronological order, newest at the bottom. Message types
are visually distinct.

```
┌─────────────────────────────┐
│  Thread: Care Plan · Maria G│
│  ─────────────────────────  │
│                             │
│  [system]          9:02am   │
│  Assessment complete.       │
│  Initiating care plan.      │
│                             │
│  [agent]           9:02am   │
│  ◎ read_patient_assessment  │
│    → { phq9: 7, sdoh: 3 }  │
│                             │
│  [agent]           9:03am   │
│  ◎ generate_care_plan_draft │
│    → draft ready            │
│                             │
│  ┌─────────────────────┐    │
│  │ ✋ APPROVAL NEEDED   │    │  ← approval request
│  │                     │    │
│  │ Care plan draft for │    │
│  │ Maria G. ready.     │    │
│  │                     │    │
│  │ [View draft]        │    │
│  │                     │    │
│  │ [Approve] [Edit]    │    │
│  │ [Reject + note]     │    │
│  └─────────────────────┘    │
│                             │
│  ─────────────────────────  │
│  [                        ] │  ← human input
│  [Send ↵]                   │
└─────────────────────────────┘
```

**Message rendering rules:**
- `system` events — small, muted, timestamp only
- `tool_call` — shows tool name and condensed input; expandable to full payload
- `tool_result` — shows condensed output; expandable
- `approval_request` — card with full context, primary action buttons
- `human message` — full width, distinct background, user avatar
- `approval_response` — shows decision + any edits or notes

**PHI in tool calls:** Raw PHI values (SSN, full medical history) are never rendered in
the thread UI. Tool calls show field names and value summaries only. Full values are
accessible via the center panel record, not the thread.

---

## Approval requests

Approval requests are the primary interaction moment between agent and human. They should:
1. Give enough context to make the decision without requiring navigation away
2. Show the agent's recommendation clearly (not a neutral list of options)
3. Make approval the path of least resistance (primary button)
4. Allow edit before approval (secondary action)
5. Allow rejection with a note (always available)

```
┌────────────────────────────────────┐
│ ✋ RDN Review Required              │
│                                    │
│ Care plan draft · Maria Garcia     │
│ Prepared by agent · 3 min ago      │
│                                    │
│ Goals (2)                          │
│ • HbA1c < 8.0% within 6 months    │
│ • Weight loss 5–8% within 6 months │
│                                    │
│ Nutrition plan                     │
│ 1800 cal/day · <1800mg sodium      │
│ Diabetic-appropriate · No nuts     │
│                                    │
│ ─────────────────────────────────  │
│ [✓ Approve]  [✎ Edit first]        │
│ [✗ Reject]   [→ Reassign]          │
│                                    │
│ Add a note (optional)              │
│ [                                ] │
└────────────────────────────────────┘
```

After a decision, the approval card collapses to a summary line in the thread:
`[RDN Sarah K.] Approved with edits — sodium target reduced to 1800mg · 9:47am`

---

## How the layout adapts per surface

The three-panel model is the same across all surfaces. What changes is the content domain
and which panels are active by default.

| Surface | Left sidebar shows | Center panel shows | Right thread shows |
|---|---|---|---|
| **Provider app** | Clinical queue (RDN/BHN/coordinator items) | Patient record, care plan, clinical notes | Patient workflow thread |
| **Admin app** | Operational queue (all item types) | Patient list, partner config, reports, billing | Relevant workflow thread |
| **Kitchen app** | Today's orders, delivery status | Order list, packing slips, grocery list | Order thread (status updates, flags) |
| **Patient app** | Upcoming appointments, deliveries | Profile, meal history, feedback | AVA call summary, coordinator messages |
| **Partner portal** | Referral queue, report notifications | Referral list, reports, patient summary | Referral/report thread |
| **AVA** | N/A — voice interface, no screen | N/A | Call transcript → thread after call |

---

## Mobile behavior

Mobile collapses to single-panel with gesture navigation between panels:

- **Default view:** Center panel (content)
- **Swipe right:** Left sidebar
- **Swipe left:** Right thread
- **Queue badge:** Persistent notification on left sidebar tab

Approval requests on mobile render as full-screen cards with large tap targets.
The most common mobile workflow is coordinator reviewing and approving queue items
while away from desk — the approval card is the primary mobile interaction.

---

## Loading and empty states

**Empty queue:** "Nothing needs your attention right now." — not "No items found."
The phrasing matters. An empty queue is a good state, not an error state.

**Agent working:** When an agent is actively executing (tool calls in progress), the thread
shows a live indicator. The human can see the agent working in real time.

**Awaiting human:** When execution is suspended pending approval, the approval card is
persistent and the thread status indicator shows "Waiting for your review."

**Error state:** If a workflow fails and lands in the queue, the queue item shows what
failed, what the agent tried, and what the human needs to decide. Never "An error occurred."

---

## Design system reference

UI components are built on the Haven design system. See `Lab/haven-ui/` for component
library, tokens, and usage guidelines. Cena Health brand guidelines at
`Stack Overflowed/Projects/Cena Health/Brand/guidelines/`.
