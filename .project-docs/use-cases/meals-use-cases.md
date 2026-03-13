# Patient App: Meals Use Cases

**Module:** Meals
**Application:** Patient Portal (Mobile)

---

## PT-MEALS-001: Browse & Confirm Weekly Meals

**User type:** Patient
**Frequency:** Weekly
**Criticality:** High — drives kitchen orders; errors affect what a patient receives
**Platform:** Mobile

### Context

Each week, the patient's care plan generates a default meal selection based on their clinical needs and food preferences. The patient receives a notification ("Your meals for next week are ready to review") and opens the app to see what's coming. They can confirm as-is or make limited substitutions within their approved meal plan. This is not free ordering — it is confirmation within a clinically constrained menu.

### Goal

"I want to see what meals are coming and make sure they work for me."

### Preconditions

- Patient is enrolled and has an active care plan with meal prescriptions
- Weekly meal selection has been generated (by dietitian or automated system)
- Patient is within the ordering window (e.g., by Wednesday for the following week's delivery)

### Primary Flow

1. Patient opens the app or taps a push notification: "Your meals for next week are ready"
2. System displays the weekly meal view: a list of upcoming meals grouped by day, with meal name, photo, brief description (plain language), and key diet tags (e.g., "Low sodium," "Diabetic-friendly")
3. Patient reviews the selections
4. If satisfied, patient taps "Confirm my meals"
5. System confirms: "Your meals are confirmed. Delivery is [date]." Kitchen partner system is updated.

### Alternate Flows

- **3a.** Patient wants to swap a meal: Patient taps a meal card; system shows available substitutes within their approved meal plan; patient selects a substitute and returns to the list
- **3b.** Patient needs to note a one-time issue (e.g., "I'll be away Thursday"): Patient taps "Message my care team" shortcut; routed to PT-CARE-001
- **5a.** Patient does not confirm by the ordering window close: System auto-confirms the default selection; patient receives a notification that their meals were confirmed automatically

### Error Conditions

- **E1.** No meal plan is active: Show a message with care team contact information — "Your meal plan isn't ready yet. Contact your care team." Do not show an empty meals screen without explanation.
- **E2.** Ordering window has closed: Show confirmed meals as read-only with delivery date; remove confirm/swap actions
- **E3.** Network unavailable: Show last-confirmed meal plan with a "last updated" timestamp; disable confirm action until connectivity is restored

### Success Criteria

- Patient's meal selection is confirmed (or auto-confirmed) before the ordering window closes
- Kitchen partner system reflects the confirmed selection
- Patient has visibility into what is coming and when

### Data Requirements

- Read: Weekly meal selections (from dietitian/care plan), meal details (name, photo, description, diet tags), ordering window open/close times, delivery date
- Write: Meal substitutions, confirmation status

### Accessibility Notes

- Meal photos are required, not decorative — they are the primary way low-literacy patients understand what they're getting; alt text must describe the dish
- Diet tags should use icons + text, not color alone
- Bilingual: all meal names and descriptions in English and Spanish

### Related Use Cases

- PT-MEALS-002: Delivery Status (follows confirmation)
- PT-CARE-001: Messaging (linked from meal swap alternate flow)
- PT-ONB-002: Preferences Setup (drives which meals are shown)

### Open Questions

- How many substitutes are available per meal? Does the dietitian curate this or is it system-generated?
- Is the ordering window a fixed weekly cutoff (e.g., Wednesday 5pm) or variable per patient?
- Can a patient skip a week (e.g., hospitalized, traveling)? What's the cancellation flow?
- Does auto-confirm apply to all patients or is it opt-in per care plan?

---

## PT-MEALS-002: Delivery Status

**User type:** Patient
**Frequency:** Weekly (on delivery days)
**Criticality:** Medium — affects patient experience and support volume; errors cause friction, not harm
**Platform:** Mobile

### Context

On delivery day, the patient wants to know when their meals are arriving. They may be at home waiting, or they may have stepped out and want to know if they missed the delivery. Delivery issues (missed deliveries, wrong items) are the highest-volume patient support request — this screen's goal is to reduce inbound calls by giving patients self-serve visibility.

### Goal

"I want to know when my meals are coming and whether they've been delivered."

### Preconditions

- Patient has confirmed meals for the current delivery window
- Delivery is scheduled for today or within the next 48 hours

### Primary Flow

1. Patient opens the app on delivery day (or taps a "Your delivery is on its way" push notification)
2. System displays delivery status screen: expected delivery window, current status (Preparing / Out for delivery / Delivered), and a summary of what is being delivered (meal count, brief list)
3. Patient sees status update in real time (or as of last sync if offline)
4. Once delivered, status updates to "Delivered" with timestamp

### Alternate Flows

- **3a.** Patient reports a problem (meals not received, wrong items, damaged packaging): Patient taps "Report an issue"; a simple form appears with a few tap options (Not delivered / Wrong meals / Damaged / Other) plus an optional text field; submission routes to care coordinator queue
- **3b.** Patient wants to know about next week's delivery: Link to PT-MEALS-001 meal confirmation screen

### Error Conditions

- **E1.** Delivery status data is unavailable (kitchen partner has not updated): Show last known status with "Last updated: [time]" note; do not show a broken state
- **E2.** Delivery is significantly late (past window close): Proactively push a notification; surface "Report an issue" prominently on the screen

### Success Criteria

- Patient can determine delivery status without calling the care team
- Issues are reported through a structured channel (not ad-hoc calls/texts) and reach the coordinator queue
- Support call volume related to delivery status decreases

### Data Requirements

- Read: Delivery date/window, kitchen partner status updates (packed, handed to driver, delivered), meal summary for current order
- Write: Issue reports (issue type, optional notes, timestamp)

### Accessibility Notes

- Status should be communicated with icon + text + color (not color alone)
- Issue report form must be usable with one hand on a small phone screen

### Related Use Cases

- PT-MEALS-001: Browse & Confirm (precedes delivery)
- PT-CARE-001: Messaging (alternate channel for delivery issues)

### Open Questions

- Does the kitchen partner app update delivery status directly (via the QR/delivery flow Andrey built), or is there a separate driver/delivery system?
- Should patients receive push notifications at each status change, or only at key milestones (out for delivery, delivered)?
- Is "delivered" status set by the driver or confirmed by GPS/signature?
