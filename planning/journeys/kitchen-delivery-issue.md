# Journey: Report a Delivery Issue

## Journey Metadata
- **User:** Kitchen Staff or delivery driver (e.g., Carlos or driver Maria R.)
- **Goal:** Report and resolve a delivery that couldn't be completed
- **Frequency:** Occasional — 1-5% of deliveries
- **Entry Point:** Driver at the delivery location discovers an issue
- **Success Criteria:** Issue documented, coordinator notified, patient contacted, resolution tracked
- **Duration:** 2-3 minutes to report, resolution varies

## Prerequisites
- Order is in `dispatched` status
- Driver is at or near the delivery location

---

## Happy Path

### Step 1: Identify the Issue
- **Screen:** Kitchen App — delivery tracking (or driver's mobile view)
- **User Action:** Driver can't complete delivery. Taps the order and selects **Can't deliver**
- **System Response:** Issue type picker:

```
┌─────────────────────────────────┐
│   What happened?                │
│                                 │
│   ┌───────────────────────┐     │
│   │ No one home            │     │
│   └───────────────────────┘     │
│   ┌───────────────────────┐     │
│   │ Wrong address / can't  │     │
│   │ find location          │     │
│   └───────────────────────┘     │
│   ┌───────────────────────┐     │
│   │ Building access issue  │     │
│   │ (gate, buzzer, locked) │     │
│   └───────────────────────┘     │
│   ┌───────────────────────┐     │
│   │ Patient refused        │     │
│   │ delivery               │     │
│   └───────────────────────┘     │
│   ┌───────────────────────┐     │
│   │ Meal damaged /         │     │
│   │ quality concern        │     │
│   └───────────────────────┘     │
│   ┌───────────────────────┐     │
│   │ Other                  │     │
│   └───────────────────────┘     │
│                                 │
└─────────────────────────────────┘
```

- **Decision Point:** What type of issue?

### Step 2: Add Details
- **Screen:** Issue detail screen
- **User Action:** Adds optional note and/or photo:

```
┌─────────────────────────────────┐
│   No one home                   │
│   Order #2847 — Maria G.        │
│                                 │
│   Add a note (optional):        │
│   [Knocked twice, no answer.   ]│
│   [Left at door per building   ]│
│   [policy.                     ]│
│                                 │
│   📷 Add photo (optional)       │
│                                 │
│   Did you leave the meals?      │
│   ○ Yes, left at door           │
│   ○ No, brought back            │
│                                 │
│   ┌───────────────────────┐     │
│   │       Submit           │     │
│   └───────────────────────┘     │
│                                 │
└─────────────────────────────────┘
```

- **Decision Point:** Leave at door or bring back?

### Step 3: Confirmation and Routing
- **Screen:** Confirmation
- **User Action:** Taps Submit
- **System Response:**
  - Order status: `dispatched` → `delivery_failed` (with reason)
  - Coordinator notified via queue item with full detail
  - Patient contacted via SMS: "We tried to deliver your meals today. Your coordinator will follow up."
  - If meals left at door: delivery marked as "left at door — unconfirmed receipt"
  - Issue logged in the order thread for audit

---

## Alternative Paths

### Alt 1: Wrong Address — Needs Correction
- **Trigger:** Driver selects "Wrong address / can't find location"
- **Modified Steps:**
  - Coordinator receives priority notification (address issue affects all future deliveries)
  - Coordinator contacts patient to verify correct address
  - Address updated in patient record — future orders use corrected address
  - Current delivery either reattempted or rescheduled
- **Outcome:** Systemic fix, not just this delivery

### Alt 2: Patient Refused Delivery
- **Trigger:** Patient at home but declines the meals
- **Modified Steps:**
  - Driver notes reason if given (e.g., "going out of town," "doesn't want meals anymore")
  - Coordinator notified — may indicate dissatisfaction or program withdrawal intent
  - If patient says they want to stop receiving meals: coordinator initiates care plan review
- **Outcome:** Refusal tracked and investigated — not just re-attempted

### Alt 3: Meal Quality Concern
- **Trigger:** Driver or patient notices damaged, leaking, or temperature-compromised meals
- **Modified Steps:**
  - Driver takes photo of the issue
  - Meals NOT left with patient
  - Kitchen and coordinator notified immediately
  - Replacement delivery scheduled if possible
  - Quality incident logged for food safety tracking (Domain 7)
- **Outcome:** Safety event documented, replacement attempted

---

## Critical Moments

| Step | Risk | Mitigation |
|---|---|---|
| 1 | Driver skips reporting and marks as delivered | Coordinator can audit via patient feedback discrepancies |
| 2 | Driver doesn't note important detail | Structured issue types capture the category; free text captures specifics |
| 2 | Meals left outside in unsafe temperature | "Did you leave the meals?" question triggers temperature concern flag if outdoor temp is extreme |

---

## Connected Journeys

**Feeds into:**
- [Coordinator morning triage](coordinator-morning-triage.md) — delivery failures appear in queue
- [Patient meal feedback](patient-meal-feedback.md) — patient may report "didn't receive" independently
- Risk management (Domain 7) — quality concerns feed incident tracking

**Feeds from:**
- [Kitchen daily orders](kitchen-daily-orders.md) — dispatch triggers delivery attempt

---

## Design Implications

1. **Structured issue types, not free text.** Drivers are in the field, often on a phone,
   often in a hurry. Six clear options are faster and more useful than a text box.

2. **Photo capture is one tap.** Camera opens directly from the issue screen. No navigating
   to a separate upload flow. Photos become evidence in the order thread.

3. **"Left at door" is a valid but tracked outcome.** Many deliveries are left at the door.
   This isn't a failure — but it is unconfirmed receipt, which matters for patient feedback
   and adherence tracking.

4. **Address issues fix the root cause.** A wrong-address report doesn't just affect today's
   delivery — it updates the patient record so every future delivery goes to the right place.
