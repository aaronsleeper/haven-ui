# Journey: View and Confirm Appointment

## Journey Metadata
- **User:** Patient (e.g., Maria)
- **Goal:** See upcoming appointments, confirm attendance, reschedule if needed
- **Frequency:** 1-3 times per month (per visit schedule in care plan)
- **Entry Point:** Appointment reminder (SMS, push notification) or patient opens app
- **Success Criteria:** Appointment confirmed or rescheduled, patient knows when/how to attend
- **Duration:** 1-2 minutes (confirm), 3-5 minutes (reschedule)

## Prerequisites
- Care plan is active with a visit schedule
- Appointments have been scheduled by the agent
- Patient has an active app account

---

## Happy Path

### Step 1: Receive Reminder
- **Screen:** SMS or push notification (24 hours before appointment)
- **User Action:** Reads reminder:

```
SMS from Cena Health:
Hi Maria, you have a nutrition visit tomorrow
(Mar 28) at 10:00am with Dr. Priya.

It's a video call — we'll send the link
in the morning.

Can you make it?
Reply YES to confirm
Reply CHANGE to reschedule
```

- **Decision Point:** Confirm or reschedule?

### Step 2a: Confirm via SMS
- **User Action:** Replies "YES"
- **System Response:**
  - Appointment marked confirmed
  - Provider notified
  - Morning-of: telehealth link sent via SMS
  - Thread logs: "Patient confirmed — SMS · 3:14pm"
- **Next Step:** Patient attends appointment (no further app interaction needed)

### Step 2b: Confirm via App
- **Screen:** Patient app — appointments screen
- **User Action:** Opens app, taps upcoming appointment:

```
┌─────────────────────────────────┐
│   Upcoming Appointment          │
│                                 │
│   📅 Tomorrow, March 28         │
│   🕐 10:00 AM                   │
│   👩‍⚕️ Dr. Priya M. (Dietitian)   │
│   📱 Video call                  │
│                                 │
│   ┌───────────────────────┐     │
│   │   ✓ I'll be there      │     │
│   └───────────────────────┘     │
│   ┌───────────────────────┐     │
│   │   📅 I need to change   │     │
│   │   the time             │     │
│   └───────────────────────┘     │
│   ┌───────────────────────┐     │
│   │   ✗ Cancel this visit  │     │
│   └───────────────────────┘     │
│                                 │
└─────────────────────────────────┘
```

- **User Action:** Taps "I'll be there"
- **System Response:** Same as SMS confirm — appointment confirmed, link sent morning-of

---

## Alternative Paths

### Alt 1: Patient Reschedules
- **Trigger:** Patient replies CHANGE via SMS or taps "I need to change the time" in app
- **Modified Steps:**
  - Agent checks provider availability within the care plan's visit window
  - Offers 3 alternative time slots:

```
┌─────────────────────────────────┐
│   Pick a new time:              │
│                                 │
│   ┌───────────────────────┐     │
│   │ Mon Mar 31, 2:00 PM   │     │
│   └───────────────────────┘     │
│   ┌───────────────────────┐     │
│   │ Wed Apr 2, 10:00 AM   │     │
│   └───────────────────────┘     │
│   ┌───────────────────────┐     │
│   │ Thu Apr 3, 3:30 PM    │     │
│   └───────────────────────┘     │
│                                 │
│   None of these work?           │
│   Call Sarah: (860) 555-0123    │
│                                 │
└─────────────────────────────────┘
```

  - Patient selects a slot → appointment rescheduled, provider calendar updated
  - If no offered slot works: patient calls coordinator for manual scheduling
- **Outcome:** Appointment rescheduled without coordinator involvement

### Alt 2: Patient Cancels
- **Trigger:** Patient taps "Cancel this visit"
- **Modified Steps:**
  - Confirmation: "Are you sure? Your dietitian visit helps us keep your food plan on track."
  - If confirmed: appointment cancelled, coordinator notified
  - Agent attempts to rebook within the care plan window
  - If patient cancels 2+ visits: coordinator alerted for follow-up (potential disengagement signal)
- **Outcome:** Visit cancelled, rebooking attempted, disengagement tracking updated

### Alt 3: Patient No-Shows
- **Trigger:** Patient doesn't join the telehealth call or doesn't appear for in-person visit
- **Modified Steps:**
  - After 10-minute grace period: visit marked as no-show
  - Agent sends reschedule link via SMS: "We missed you today. Tap to reschedule: [link]"
  - If patient reschedules within 5 days: normal flow
  - If no response: coordinator alerted
  - 2+ no-shows: disengagement flag
- **Outcome:** Rebooking attempted, pattern tracked

### Alt 4: Audio-Only Visit
- **Trigger:** Patient can't do video (no camera, limited data, discomfort)
- **Modified Steps:**
  - Appointment detail shows a phone number instead of video link
  - Reminder SMS: "Call this number at 10:00am: (860) 555-0150"
  - Or: provider calls the patient at the scheduled time
  - Billing adjusted — audio-only telehealth codes (supported per OQ-15 decision)
- **Outcome:** Same visit, different modality

---

## Exception Handling

### Exception 1: Telehealth Link Doesn't Work
- **Cause:** Technical issue — link expired, browser incompatible, patient's phone too old
- **Frequency:** Occasional
- **Severity:** Graceful — visit can fall back to phone
- **Recovery:**
  - Troubleshooting screen: "Having trouble? Try these steps: [1, 2, 3]"
  - Fallback: "Call this number instead: (860) 555-0150"
  - Provider is notified that patient is having technical difficulty
- **Prevention:** Pre-visit tech check link sent with reminder (optional, not required)

### Exception 2: Patient Confused About Visit Type or Time
- **Cause:** Didn't read reminder carefully, timezone confusion, forgot
- **Frequency:** Occasional
- **Severity:** Graceful
- **Recovery:** Phone number always available. Coordinator can clarify.
- **Prevention:** Reminders use plain language with explicit date, time, and what to expect

---

## Critical Moments

| Step | Risk | Mitigation |
|---|---|---|
| 1 | Patient ignores reminder | SMS reply option (YES/CHANGE) reduces friction to zero — no app needed |
| Alt 1 | No available slots within care plan window | Coordinator fallback — patient calls, human schedules |
| Alt 3 | Repeated no-shows signal disengagement | Pattern tracked, coordinator proactively reaches out |
| Alt 4 | Audio-only visit treated as lesser | Same confirmation flow, same preparation — just different link |

---

## Connected Journeys

**Feeds into:**
- [RDN post-visit documentation](rdn-post-visit-documentation.md) — completed visit triggers SOAP note draft
- [Coordinator morning triage](coordinator-morning-triage.md) — no-shows and cancellations appear in queue

**Feeds from:**
- Care plan creation (1.5) — visit schedule drives appointment generation
- [Patient enrollment](patient-enrollment.md) — first appointments scheduled after enrollment

---

## Design Implications

1. **SMS is the primary channel, not the app.** Most appointment interactions happen via SMS
   reply — YES or CHANGE. The app is a secondary channel for patients who prefer it. Design
   the SMS flow first.

2. **Three offered time slots, not a calendar picker.** A calendar interface is complex for
   this population. Three concrete options with a "none of these? call us" fallback is
   simpler and faster.

3. **Audio-only is a first-class option.** Many patients lack video capability. The appointment
   flow should handle phone-only visits with the same design care as video — not as a
   degraded fallback.

4. **Reschedule, don't just cancel.** The default when a patient can't make it should be
   "pick a new time," not "cancel." Cancellation is available but shouldn't be the
   prominent option. The goal is to keep patients in care.

5. **No-show patterns are data, not punishment.** The system tracks no-shows to detect
   disengagement — not to penalize the patient. The coordinator's response to repeated
   no-shows is outreach, not restriction.
