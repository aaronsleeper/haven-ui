# Patient App: Care Team & Feedback Use Cases

**Module:** Care Team & Feedback
**Application:** Patient Portal (Mobile)

---

## Design Note: Messaging vs. Meal Feedback

These two use cases serve different emotional contexts but may share UI infrastructure. The key distinction:

- **PT-CARE-001 (Messaging):** Async, open-ended communication with the care team. Patient-initiated or care-team-initiated. General questions, concerns, life events.
- **PT-CARE-002 (Meal Feedback):** Structured, prompted feedback about a specific meal or delivery. Tied to a specific order. Feeds kitchen partner and dietitian workflows directly.

**MVP recommendation:** Build these as two distinct entry points (a "Contact care team" action and a "How were your meals?" prompt), but use the same underlying messaging/thread infrastructure. The meal feedback form is a structured message with a pre-populated subject and a few tap-to-answer fields before the free text box.

This avoids building two separate systems while keeping the patient experience contextually appropriate. Revisit whether to merge or separate after pilot feedback.

---

## PT-CARE-001: Message My Care Team

**User type:** Patient
**Frequency:** Weekly to monthly (patient-initiated); daily (care team-initiated)
**Criticality:** High — primary async support channel; missed messages affect adherence and patient safety
**Platform:** Mobile

### Context

A patient has a question, concern, or update for their care team. This might be: "I'm having trouble with a meal ingredient," "I have a doctor's appointment this week, can I skip delivery?", "I'm not feeling well," or simply a response to an outreach message from their dietitian or coordinator. The messaging UI needs to feel like a familiar texting experience, not a clinical portal form.

### Goal

"I want to get a message to my care team without having to call."

### Preconditions

- Patient is logged in
- Patient has an assigned care team (dietitian + care coordinator at minimum)

### Primary Flow

1. Patient navigates to the Care Team tab or taps "Message my care team" from any contextual shortcut (e.g., from the meals screen)
2. System displays the patient's message thread(s) — for MVP, a single unified thread with their care team (not separate threads per care team member)
3. Patient sees prior messages with timestamps, read receipts, and sender labels ("Your dietitian," "Your care coordinator")
4. Patient types a new message and sends
5. System confirms send; message appears in thread
6. Care team member responds; patient receives push notification
7. Patient opens notification, reads response, can reply

### Alternate Flows

- **2a.** No prior messages: Show empty state with a prompt — "Have a question about your meals or your health? Send us a message." — and a compose button
- **4a.** Patient wants to attach a photo (e.g., damaged meal packaging): Allow single image attachment from camera roll; this is important for meal issue documentation
- **6a.** Patient has not opened a care team message within 48 hours: Escalate to care coordinator as an unresponded outreach (system flag, not visible to patient)

### Error Conditions

- **E1.** Message fails to send (network issue): Show unsent indicator; retry automatically when connectivity restores; do not silently drop the message
- **E2.** Patient sends a message that suggests a clinical emergency (detection out of scope for MVP): Care team handles triage; system does not attempt automated detection in MVP

### Success Criteria

- Patient can send a message and receive a response without a phone call
- Care team receives the message in their coordinator/clinical portal
- Message history is visible to both patient and care team

### Data Requirements

- Read: Message thread (messages, timestamps, sender labels, read status), care team member names
- Write: New messages, read receipts, image attachments

### Accessibility Notes

- Text input must support voice-to-text (native mobile keyboard behavior is sufficient)
- Sender labels ("Your dietitian") should accompany names — patients may not know staff names
- Bilingual: all system-generated messages and prompts in English and Spanish; patient and care team write in their own language

### Related Use Cases

- PT-CARE-002: Meal Feedback (uses same thread infrastructure; different entry point)
- PT-MEALS-001: Browse & Confirm (shortcut to messaging from meal screen)
- PT-MEALS-002: Delivery Status (shortcut to messaging from issue report)

### Open Questions

- Is the care team thread unified (all care team members in one thread) or per-member for MVP? Unified is simpler to build; per-member is clearer for the patient.
- What is the expected response time SLA, and does the system surface this to patients ("We typically respond within [X] hours")?
- Does care team messaging need to be HIPAA-compliant encrypted messaging, or does the existing platform authentication + transport encryption suffice? Andrey should confirm.
- Can care team members initiate a new thread with a patient (outbound), or do patients always start the thread?

---

## PT-CARE-002: Meal Feedback

**User type:** Patient
**Frequency:** Weekly (prompted after each delivery)
**Criticality:** Medium — affects meal plan quality and kitchen partner accountability; low risk of harm from errors
**Platform:** Mobile

### Context

A patient has received their weekly delivery. The system prompts them to share feedback: did the meals arrive? Were they good? Was anything off? This feedback serves two purposes: it helps the dietitian understand adherence and preferences, and it gives the kitchen partner actionable quality signals. The prompt should feel like a quick check-in, not a survey.

### Goal

"I want to tell someone if my meals were good or if something was wrong."

### Preconditions

- Patient has a confirmed delivery for the current week
- Delivery status has been updated to "Delivered" (or window has closed)

### Primary Flow

1. System sends a push notification: "How were your meals this week?" (sent 2-4 hours after scheduled delivery window closes)
2. Patient taps notification and is taken to the meal feedback screen
3. Screen shows: a simple overall rating (3 options: thumbs up / neutral / thumbs down — not a 5-star scale), a list of this week's meals with individual tap-to-rate options (optional), and a free text field: "Anything else to tell us?" (optional)
4. Patient submits feedback
5. System confirms: "Thanks — we shared this with your care team." Routes back to home screen.

### Alternate Flows

- **2a.** Patient opens feedback from the Meals screen instead of the notification: Same flow; the feedback prompt is surfaced as a card on the Meals screen until submitted or dismissed
- **3a.** Patient rates overall experience as thumbs down: System adds a required follow-up tap: "What went wrong?" with options (Meals didn't arrive / Wrong meals / Poor quality / Too much / Something else); this ensures actionable data reaches the coordinator queue
- **3b.** Patient dismisses the prompt: Feedback is skipped; a second prompt is sent 24 hours later; after two dismissals, the prompt is suppressed for that week

### Error Conditions

- **E1.** Patient submits feedback but delivery was never confirmed as received: Flag for care coordinator review — possible missed delivery
- **E2.** Network unavailable: Store feedback locally and submit when connectivity restores; show "We'll send this when you're back online"

### Success Criteria

- Feedback is submitted and linked to the specific delivery/order
- Negative feedback (thumbs down + issue type) routes to the care coordinator queue
- Per-meal ratings are visible to the dietitian for plan adjustments
- Kitchen partner receives aggregate quality signals (anonymized per HIPAA)

### Data Requirements

- Read: Current week's confirmed meal list, delivery status
- Write: Overall rating, per-meal ratings (optional), issue type (if thumbs down), free text, submission timestamp

### Accessibility Notes

- Thumbs up/neutral/thumbs down icons must have text labels, not icons alone
- The feedback flow must be completable in under 60 seconds for patients with limited time or attention
- Voice input for free text field is important for this population

### Related Use Cases

- PT-CARE-001: Messaging (care team can follow up on negative feedback via the message thread)
- PT-MEALS-002: Delivery Status (issue report from delivery status feeds the same coordinator queue)

### Open Questions

- Should per-meal ratings be shown in the kitchen partner portal? If so, how do we attribute feedback to a specific kitchen without exposing PHI?
- Is the 2-4 hour post-delivery notification delay configurable per patient/program, or fixed?
- Does negative feedback auto-trigger a care coordinator task, or is it surfaced passively in a dashboard?
- Should meal feedback be visible to patients in their history (so they can reference past ratings), or is it write-only from the patient's perspective?
