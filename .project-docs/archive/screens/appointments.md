# Appointments Screen - Enhanced Requirements

**Navigation Label:** "Appointments"

**Screen Type:** Primary navigation screen

---

## Screen Overview

The Appointments screen serves as the central hub for patients to view, manage, and schedule appointments with their care team members (Registered Dietitian Nutritionists and Behavioral Health Navigators). Patients can view their appointment history, access upcoming appointment details, schedule new appointments, reschedule or cancel existing appointments, and access preparation resources for their visits.

**Primary User Goals:**

- View upcoming and past appointments at a glance
- Schedule new appointments with RDN or BHN providers
- Access appointment details including provider notes and visit links
- Reschedule or cancel appointments when needed
- Prepare for upcoming appointments (technical setup, discussion topics)

---

## Components Used

### Global Components

- **ScreenHeader** - See [ScreenHeader](../components/ScreenHeader.md)

  - **Usage Context:** Page title "Appointments" with primary action button "Schedule Appointment"
  - **Data Passed:**
    - `title`: "Appointments"
    - `primaryAction`: { label: "Schedule Appointment", onClick: openScheduleModal }

- **AvaChatPane** - See [AvaChatPane](../components/AvaChatPane.md)
  - **Usage Context:** Persistent right-side chat pane where Ava displays contextual greeting and assists with appointment scheduling
  - **Data Passed:**
    - `greetingText`: Context-aware greeting based on patient's appointment status
    - `conversationHistory`: Patient's chat history
    - `pageContext`: "appointments"

### Screen-Specific Components

- **AppointmentList** - See [AppointmentList](../components/AppointmentList.md) - NEW COMPONENT

  - **Usage Context:** Container for displaying all appointments in chronological order, with sections for upcoming and past appointments
  - **Data Passed:**
    - `appointments`: Array of appointment objects
    - `onAppointmentClick`: Handler to open appointment details modal

- **AppointmentCard** - See [AppointmentCard](../components/AppointmentCard.md) - NEW COMPONENT

  - **Usage Context:** Individual appointment preview in the list showing key details
  - **Data Passed:**
    - `appointmentId`: Unique identifier
    - `scheduledDateTime`: Date and time of appointment
    - `providerName`: Name of care team member
    - `providerType`: "RDN" or "BHN"
    - `mode`: "Video", "Phone", or "In-Person"
    - `status`: "Scheduled", "Completed", "Cancelled", "No-Show"

- **AppointmentDetailsModal** - See [AppointmentDetailsModal](../components/AppointmentDetailsModal.md) - NEW COMPONENT

  - **Usage Context:** Full-screen or overlay modal showing comprehensive appointment information
  - **Data Passed:**
    - `appointment`: Full appointment object with all details
    - `providerNotes`: Notes from provider (if any)
    - `visitLink`: Link to join video appointment (if applicable)
      - `onCancel`: Handler to cancel appointment
    - `onCheckIn`: Handler to check in for appointment
    - `onClose`: Handler to close modal

- **ScheduleAppointmentModal** - See [ScheduleAppointmentModal](../components/ScheduleAppointmentModal.md) - NEW COMPONENT

  - **Usage Context:** Multi-step modal for scheduling new appointments
  - **Data Passed:**
    - `assignedProviders`: List of patient's assigned RDN and BHN providers
    - `availability`: Available time slots for selected provider
    - `onSchedule`: Handler to confirm and create appointment
    - `onClose`: Handler to close modal

- **PrepChecklistLink** - See [PrepChecklistLink](../components/PrepChecklistLink.md) - NEW COMPONENT
  - **Usage Context:** Link to general appointment preparation resources (not tied to specific appointment)
  - **Data Passed:**
    - `label`: "Appointment Preparation Checklist"
    - `onClick`: Handler to open prep checklist modal or navigate to help page

### Form Components

- **Button** - See [Button](../components/Button.md)

  - **Usage Context:** "Schedule Appointment", "Reschedule", "Cancel", "Join Visit", "Check In"
  - **Data Passed:** Varies by action - label, onClick handler, variant (primary/secondary/danger)

- **DateTimePicker** - See [DateTimePicker](../components/DateTimePicker.md)

  - **Usage Context:** Selecting appointment date and time in scheduling modal
  - **Data Passed:** Available time slots, selected value, onChange handler

- **Dropdown** - See [Dropdown](../components/Dropdown.md)
  - **Usage Context:** Selecting provider in scheduling modal
  - **Data Passed:** List of assigned providers, selected value, onChange handler

### Layout Components

- **Modal** - See [Modal](../components/Modal.md)
  - **Usage Context:** Container for appointment details and scheduling flows
  - **Data Passed:** Content, onClose handler, size variant

---

## Interactions

### View Appointment Details

- **Trigger:** Click/tap on AppointmentCard in the list
- **Result:** AppointmentDetailsModal opens showing full appointment information
- **States:**
  - Loading: Fetching appointment details
  - Success: Modal displays with all appointment data
  - Error: Error message if appointment details cannot be loaded
- **Components Involved:** AppointmentCard, AppointmentDetailsModal, Modal

### Schedule New Appointment

- **Trigger:** Click "Schedule Appointment" button in ScreenHeader or via Ava conversation
- **Result:** ScheduleAppointmentModal opens with multi-step flow
- **Flow:**
  1. Select provider type (RDN or BHN) - defaults to assigned provider if only one
  2. Select specific provider - shows assigned providers, defaults if only one
  3. View availability calendar and select date/time
  4. Confirm appointment details
  5. Appointment is created and added to list
- **States:**
  - Loading: Fetching provider availability
  - Success: Appointment created, modal closes, success message shown
  - Error: Validation errors (no time selected) or server error
- **Components Involved:** Button, ScheduleAppointmentModal, DateTimePicker, Dropdown, Modal

### Cancel Appointment

- **Trigger:** Click "Cancel" button in AppointmentDetailsModal
- **Result:** Confirmation dialog, then appointment is cancelled
- **Flow:**
  1. Confirmation dialog appears: "Are you sure you want to cancel this appointment?"
  2. Patient confirms or cancels action
  3. If confirmed, appointment status changes to "Cancelled"
  4. Audit trail logged
- **States:**
  - Confirming: Showing confirmation dialog
  - Success: Appointment cancelled, modal closes
  - Error: Server error prevents cancellation
- **Components Involved:** AppointmentDetailsModal, Button, Modal (for confirmation)

### Join Video Appointment / Check In

- **Trigger:** Click "Join Visit" link or "Check In" button in AppointmentDetailsModal
- **Result:**
  - Video appointments: Opens video call link in new window/tab
  - In-person appointments: Marks patient as checked in
- **States:**
  - Available: Button enabled when within check-in window (e.g., 15 min before to 15 min after)
  - Disabled: Outside check-in window
  - Success: Link opens or check-in recorded
  - Error: Link invalid or check-in fails
- **Components Involved:** AppointmentDetailsModal, Button

### Access Preparation Checklist

- **Trigger:** Click "Appointment Preparation Checklist" link (visible on screen, not per-appointment)
- **Result:** Opens help modal or navigates to preparation resources page
- **Flow:**
  1. Link opens modal or page with general preparation information
  2. Shows technical requirements for video calls
  3. Lists recommended discussion topics preparation
  4. Provides tips for getting the most from appointments
- **States:**
  - Success: Content displays
  - Error: Content cannot be loaded
- **Components Involved:** PrepChecklistLink, Modal or navigation

### Conversational Appointment Scheduling (via Ava)

- **Trigger:** Patient says "I need to schedule an appointment" or similar in Ava chat
- **Result:** Ava guides conversational scheduling flow
- **Flow:**
  1. Ava asks which type of appointment (RDN or BHN)
  2. Ava shows available times and asks for preference
  3. Patient selects time via natural language ("Tuesday afternoon" or "next week")
  4. Ava confirms details and asks for final confirmation
  5. Patient confirms, appointment is created
  6. Traditional UI updates to reflect new appointment
  7. Audit trail logged in chat
- **States:**
  - Conversation in progress: Multi-turn dialogue
  - Confirmation pending: Ava presents summary, awaits confirmation
  - Success: Appointment created, summarized in chat
  - Cancelled: Patient cancels conversation
- **Components Involved:** AvaChatPane, ScheduleAppointmentModal (optionally pre-populated), AppointmentList (updates)

---

## Screen Data Requirements

### Data Displayed on This Screen

**Appointment List Data:**

- `appointmentId` (String) - Unique identifier for each appointment
- `scheduledDateTime` (DateTime) - When appointment is scheduled
  - Format: Full format for upcoming: "Tue Dec 9 2025 at 1:45 PM Pacific"
  - Format: Date only for past: "Dec 9, 2025"
- `providerName` (String) - Full name of care team member
- `providerType` (Enum: "RDN" | "BHN") - Type of provider
- `providerTitle` (String) - Professional title (e.g., "Registered Dietitian Nutritionist")
- `mode` (Enum: "Video" | "Phone" | "In-Person") - Appointment modality
- `status` (Enum: "Scheduled" | "Completed" | "Cancelled" | "No-Show") - Current status
- `duration` (Number) - Appointment length in minutes
- `location` (String, optional) - Physical location for in-person appointments

**Appointment Details Data (shown in modal):**

- All fields from list above, plus:
- `providerNotes` (String, optional) - Pre-appointment notes or instructions from provider
- `providerPhoto` (URL, optional) - Provider headshot
- `visitLink` (URL, optional) - Link to join video appointment
- `checkInWindow` (Object, optional) - Check-in availability time range
  - `startTime` (DateTime)
  - `endTime` (DateTime)
- `agenda` (String, optional) - Appointment purpose or topics
- `patientNotes` (String, optional) - Notes patient added when scheduling
- `createdAt` (DateTime) - When appointment was created
- `createdBy` (String) - Who created appointment ("Patient" or provider name)
- `lastModified` (DateTime, optional) - When appointment was last changed
- `cancellationReason` (String, optional) - Reason if cancelled

**Provider Availability Data (for scheduling):**

- `providerId` (String) - Provider identifier
- `providerName` (String) - Provider name
- `providerType` (Enum: "RDN" | "BHN")
- `isAssigned` (Boolean) - Whether this provider is assigned to patient
- `availableSlots` (Array) - List of available time slots
  - `startTime` (DateTime)
  - `endTime` (DateTime)
  - `isAvailable` (Boolean)

**Support Resources:**

- `prepChecklistContent` (Object) - Preparation checklist information
  - `technicalRequirements` (Array) - List of tech setup items
  - `discussionTopics` (Array) - Suggested topics to prepare
  - `tips` (Array) - General appointment tips

### Permission Requirements

**Role-Based Access:**

- **Patient:** Can view their own appointments, schedule with assigned providers, reschedule/cancel their appointments
- **Provider (RDN/BHN):** Can view appointments with their patients, add provider notes, view patient notes
- **Care Coordinator:** Can view patient appointments, schedule on behalf of patient, reschedule/cancel with reason
- **Admin:** Full access to all appointment data and actions

**Field-Level Permissions:**

| Field              | Patient View | Patient Edit       | Provider View | Provider Edit | Coordinator View | Coordinator Edit |
| ------------------ | ------------ | ------------------ | ------------- | ------------- | ---------------- | ---------------- |
| scheduledDateTime  | ✓            | ✓ (own appt)       | ✓             | ✓             | ✓                | ✓                |
| providerName       | ✓            | -                  | ✓             | -             | ✓                | -                |
| providerType       | ✓            | -                  | ✓             | -             | ✓                | -                |
| mode               | ✓            | ✓ (own appt)       | ✓             | ✓             | ✓                | ✓                |
| status             | ✓            | ✓ (cancel only)    | ✓             | ✓             | ✓                | ✓                |
| providerNotes      | ✓            | -                  | ✓             | ✓             | ✓                | -                |
| patientNotes       | ✓            | ✓ (own appt)       | ✓             | -             | ✓                | -                |
| visitLink          | ✓            | -                  | ✓             | ✓             | ✓                | ✓                |
| cancellationReason | ✓            | ✓ (when canceling) | ✓             | -             | ✓                | ✓                |

**Conditional Access Rules:**

- Patients can only schedule with providers assigned to their care team
- Visit links only visible within check-in window (configurable, e.g., 15 min before)
- Cancelled appointments cannot be rescheduled (must create new appointment)
- Provider notes only visible to patient if marked as "patient-visible" by provider
- Past appointments (completed status) cannot be modified, only viewed

---

## Ava Integration Details

### Context-Aware Greeting

Ava's greeting appears as text IN the chat conversation when the patient navigates to the Appointments screen. The greeting is ephemeral - if the patient navigates away without interacting, the greeting is removed and not stored in persistent chat history.

**Greeting Examples Based on Patient State:**

1. **Patient has upcoming appointment within 48 hours:**

   ```
   Your appointment with Dr. Sarah Chen (RDN) is coming up on Tue Dec 10 at 2:00 PM Pacific. Would you like me to help you prepare, or do you need to reschedule?
   ```

2. **Patient has no upcoming appointments:**

   ```
   I don't see any appointments scheduled. Would you like me to help you schedule one with your dietitian or behavioral health navigator?
   ```

3. **Patient recently completed an appointment:**

   ```
   I see you just met with Dr. Chen yesterday. How did it go? Let me know if you'd like to schedule a follow-up or if you have any questions about the next steps.
   ```

4. **Patient has multiple upcoming appointments:**

   ```
   You have 2 upcoming appointments this week - one with your dietitian on Tuesday and one with your behavioral health navigator on Thursday. Need help with anything related to these visits?
   ```

5. **Patient has appointment today (within check-in window):**
   ```
   Your appointment with Dr. Chen starts in 20 minutes. Ready to check in? I can help you get set up or we can discuss any last-minute questions.
   ```

### Conversational Shortcuts

Ava enables natural language interactions for appointment management:

**Scheduling:**

- "I need to schedule an appointment"
- "Book me with my dietitian next week"
- "Can I see my nutritionist on Tuesday?"
- "I want to talk to someone about my meal plan"

**Rescheduling:**

- "I need to move my Tuesday appointment" (Ava will guide through cancel + schedule process)
- "Can I reschedule my 2pm on Thursday?" (Ava will guide through cancel + schedule process)
- "I can't make my appointment tomorrow" (Ava will offer to cancel and help schedule new)

**Viewing:**

- "When's my next appointment?"
- "Show me my upcoming appointments"
- "What appointments do I have this month?"
- "Who am I meeting with next week?"

**Cancelling:**

- "I need to cancel my appointment on Friday"
- "Cancel my next appointment"

**Preparation:**

- "What should I prepare for my appointment?"
- "How do I join the video call?"
- "What should I ask my dietitian about?"

### Form Auto-Population

When a patient engages in conversational scheduling with Ava:

1. **Provider Selection:**

   - Patient: "I need to see my dietitian"
   - Ava identifies provider type (RDN) and pre-selects in scheduling form
   - If multiple RDN providers assigned, Ava asks for clarification

2. **Date/Time Selection:**

   - Patient: "Next Tuesday afternoon"
   - Ava interprets as date range, filters availability to afternoon slots
   - Presents options: "I have slots at 2:00 PM, 3:30 PM, and 4:00 PM on Tuesday Dec 10. Which works best?"
   - Patient selects, form auto-populates selected time

3. **Appointment Mode:**

   - Patient: "I prefer video calls"
   - Ava sets mode to "Video" in form
   - If patient doesn't specify, defaults to provider's standard mode

4. **Notes/Agenda:**
   - Patient: "I want to talk about my blood sugar management"
   - Ava populates patient notes field with extracted topic
   - Confirms: "I'll add that to your appointment notes so Dr. Chen knows what you'd like to discuss"

### Confirmation Workflows

Ava always requests confirmation before executing appointment actions:

**Scheduling Confirmation:**

```
Ava: "Let me confirm the details:
- Provider: Dr. Sarah Chen (Registered Dietitian Nutritionist)
- Date & Time: Tue Dec 10 2025 at 2:00 PM Pacific
- Mode: Video call
- Topics to discuss: Blood sugar management

Should I go ahead and book this appointment?"

Patient: "Yes, book it"

Ava: "Done! Your appointment is scheduled. You'll receive a reminder 24 hours before, and I'll be here to help you prepare. The appointment has been added to your calendar."
```

**Reschedule Confirmation (via Cancel + New Appointment):**

```
Patient: "I need to reschedule my Tuesday appointment"

Ava: "I can help you with that. First, I'll need to cancel your current appointment with Dr. Chen on Tue Dec 10 at 2:00 PM. Then we can schedule a new one. Should I proceed?"

Patient: "Yes"

Ava: "Appointment cancelled. Now, when would you like to meet with Dr. Chen? I see availability on Thu Dec 12 at 3:30 PM, Fri Dec 13 at 2:00 PM..."

Patient: "Thursday at 3:30 works"

Ava: "Perfect! I'll book your appointment with Dr. Chen for Thu Dec 12 at 3:30 PM. Should I confirm this?"

Patient: "Yes"

Ava: "Done! Your new appointment is scheduled. Dr. Chen has been notified."
```

**Cancellation Confirmation:**

```
Ava: "Are you sure you want to cancel your appointment with Dr. Chen on Tue Dec 10 at 2:00 PM? This cannot be undone, but you can schedule a new appointment anytime."

Patient: "Yes, cancel it"

Ava: "Appointment cancelled. Would you like to schedule a new one now, or is there anything else I can help with?"
```

---

## ASCII Wireframe

### Main Appointments Screen

```
┌─────────────────────────────────────────────────────┬──────────────────────────────┐
│ ScreenHeader                                        │ AvaChatPane                  │
│ ┌─────────────────────────────────────────────────┐ │                              │
│ │ Appointments        [Schedule Appointment CLICK]│ │ Ava greeting appears here:   │
│ └─────────────────────────────────────────────────┘ │ "I don't see any upcoming    │
│                                                     │  appointments. Would you     │
│ PrepChecklistLink [CLICK -> help modal/page]       │  like to schedule one?"      │
│ "Appointment Preparation Checklist"                │                              │
│                                                     │ [Patient can type here...]   │
│ AppointmentList                                     │                              │
│ ┌─────────────────────────────────────────────────┐ │                              │
│ │ UPCOMING APPOINTMENTS                           │ │                              │
│ │                                                 │ │                              │
│ │ AppointmentCard [CLICK -> details modal]       │ │ Chat message history         │
│ │ ┌─────────────────────────────────────────────┐ │ │ appears below...             │
│ │ │ Tue Dec 10 2025 at 2:00 PM Pacific          │ │ │                              │
│ │ │ Dr. Sarah Chen - Registered Dietitian       │ │ │ ▼ Appointment Scheduled      │
│ │ │ Video call • 30 minutes                     │ │ │   Dr. Chen, Tue Dec 10       │
│ │ └─────────────────────────────────────────────┘ │ │   2:00 PM (CLICK -> expand)  │
│ │                                                 │ │                              │
│ │ AppointmentCard [CLICK -> details modal]       │ │                              │
│ │ ┌─────────────────────────────────────────────┐ │ │                              │
│ │ │ Thu Dec 12 2025 at 10:00 AM Pacific         │ │ │                              │
│ │ │ John Martinez - Behavioral Health Navigator│ │ │                              │
│ │ │ Phone call • 45 minutes                     │ │ │                              │
│ │ └─────────────────────────────────────────────┘ │ │                              │
│ │                                                 │ │                              │
│ │ PAST APPOINTMENTS                               │ │                              │
│ │                                                 │ │                              │
│ │ AppointmentCard [CLICK -> details modal]       │ │ │                              │
│ │ ┌─────────────────────────────────────────────┐ │ │                              │
│ │ │ Dec 3, 2025                                 │ │ │                              │
│ │ │ Dr. Sarah Chen - Registered Dietitian       │ │ │                              │
│ │ │ Completed • Video call                      │ │ │                              │
│ │ └─────────────────────────────────────────────┘ │ │                              │
│ └─────────────────────────────────────────────────┘ │                              │
└─────────────────────────────────────────────────────┴──────────────────────────────┘
```

### Appointment Details Modal

```
┌─────────────────────────────────────────────────────┬──────────────────────────────┐
│ AppointmentDetailsModal                    [X CLOSE]│ AvaChatPane                  │
│ ┌─────────────────────────────────────────────────┐ │                              │
│ │ Appointment Details                             │ │ "Your appointment with       │
│ │                                                 │ │  Dr. Chen is coming up.      │
│ │ [Provider Photo]                                │ │  Need help preparing?"       │
│ │ Dr. Sarah Chen                                  │ │                              │
│ │ Registered Dietitian Nutritionist               │ │                              │
│ │                                                 │ │                              │
│ │ Tue Dec 10 2025 at 2:00 PM Pacific              │ │                              │
│ │ Video call • 30 minutes                         │ │                              │
│ │                                                 │ │                              │
│ │ Status: Scheduled                               │ │                              │
│ │                                                 │ │                              │
│ │ ─────────────────────────────────────────────── │ │                              │
│ │                                                 │ │                              │
│ │ PROVIDER NOTES:                                 │ │                              │
│ │ "We'll review your food journal from the past   │ │                              │
│ │  week and discuss blood sugar management        │ │                              │
│ │  strategies."                                   │ │                              │
│ │                                                 │ │                              │
│ │ YOUR NOTES:                                     │ │                              │
│ │ "Want to ask about portion sizes and meal       │ │                              │
│ │  timing for better blood sugar control"         │ │                              │
│ │                                                 │ │                              │
│ │ ─────────────────────────────────────────────── │ │                              │
│ │                                                 │ │                              │
│ │ [Join Video Call CLICK]  (enabled 15 min before)│ │                              │
│ │                                                 │ │                              │
│ │                        [Cancel Appointment CLICK]│ │                              │
│ │                                                 │ │                              │
│ │ Scheduled by: You on Dec 1, 2025 at 3:45 PM     │ │                              │
│ └─────────────────────────────────────────────────┘ │                              │
└─────────────────────────────────────────────────────┴──────────────────────────────┘
```

### Schedule Appointment Modal (Step 1 - Provider Selection)

```
┌─────────────────────────────────────────────────────┬──────────────────────────────┐
│ ScheduleAppointmentModal               [X CLOSE]    │ AvaChatPane                  │
│ ┌─────────────────────────────────────────────────┐ │                              │
│ │ Schedule New Appointment                        │ │ Patient: "I need to schedule │
│ │                                                 │ │ an appointment"              │
│ │ Step 1 of 3: Select Provider                    │ │                              │
│ │                                                 │ │ Ava: "I can help with that.  │
│ │ Select provider type:                           │ │ Would you like to see your   │
│ │                                                 │ │ dietitian or behavioral      │
│ │ ○ Registered Dietitian Nutritionist (RDN)       │ │ health navigator?"           │
│ │ ○ Behavioral Health Navigator (BHN)             │ │                              │
│ │                                                 │ │                              │
│ │ Select your provider:                           │ │                              │
│ │ (Dropdown shows assigned providers)             │ │                              │
│ │ ┌──────────────────────────────────────────┐    │ │                              │
│ │ │ Dr. Sarah Chen (Assigned) ▼CLICK         │    │ │                              │
│ │ └──────────────────────────────────────────┘    │ │                              │
│ │                                                 │ │                              │
│ │           [Cancel]           [Next CLICK]       │ │                              │
│ └─────────────────────────────────────────────────┘ │                              │
└─────────────────────────────────────────────────────┴──────────────────────────────┘
```

### Schedule Appointment Modal (Step 2 - Date/Time Selection)

```
┌─────────────────────────────────────────────────────┬──────────────────────────────┐
│ ScheduleAppointmentModal               [X CLOSE]    │ AvaChatPane                  │
│ ┌─────────────────────────────────────────────────┐ │                              │
│ │ Schedule New Appointment                        │ │ Ava: "Dr. Chen has           │
│ │                                                 │ │ availability next week on    │
│ │ Step 2 of 3: Select Date & Time                 │ │ Tuesday, Wednesday, and      │
│ │                                                 │ │ Friday afternoons."          │
│ │ Scheduling with: Dr. Sarah Chen (RDN)           │ │                              │
│ │                                                 │ │ Patient: "Tuesday works"     │
│ │ DateTimePicker [INTERACTIVE CALENDAR]           │ │                              │
│ │ ┌──────────────────────────────────────────┐    │ │ Ava: "Great! I see these     │
│ │ │    December 2025             ◄  ►        │    │ │ times available on Tuesday:  │
│ │ │  S  M  T  W  T  F  S                     │    │ │ 2:00 PM, 3:30 PM, 4:00 PM"   │
│ │ │        1  2  3  4  5  6                  │    │ │                              │
│ │ │  7  8 [9][10]11 12 13                    │    │ │                              │
│ │ │ 14 15 16 17 18 19 20                     │    │ │                              │
│ │ └──────────────────────────────────────────┘    │ │                              │
│ │                                                 │ │                              │
│ │ Available times for Tue Dec 10:                 │ │                              │
│ │ ○ 2:00 PM - 2:30 PM                             │ │                              │
│ │ ○ 3:30 PM - 4:00 PM                             │ │                              │
│ │ ○ 4:00 PM - 4:30 PM                             │ │                              │
│ │                                                 │ │                              │
│ │ Mode: ● Video  ○ Phone  ○ In-Person             │ │                              │
│ │                                                 │ │                              │
│ │           [Back]            [Next CLICK]        │ │                              │
│ └─────────────────────────────────────────────────┘ │                              │
└─────────────────────────────────────────────────────┴──────────────────────────────┘
```

### Schedule Appointment Modal (Step 3 - Confirmation)

```
┌─────────────────────────────────────────────────────┬──────────────────────────────┐
│ ScheduleAppointmentModal               [X CLOSE]    │ AvaChatPane                  │
│ ┌─────────────────────────────────────────────────┐ │                              │
│ │ Schedule New Appointment                        │ │ Ava: "Perfect! Let me        │
│ │                                                 │ │ confirm the details:         │
│ │ Step 3 of 3: Confirm Details                    │ │ - Dr. Sarah Chen (RDN)       │
│ │                                                 │ │ - Tue Dec 10 at 2:00 PM      │
│ │ Review your appointment:                        │ │ - Video call                 │
│ │                                                 │ │ Should I book this?"         │
│ │ Provider: Dr. Sarah Chen                        │ │                              │
│ │          Registered Dietitian Nutritionist      │ │ Patient: "Yes, book it"      │
│ │                                                 │ │                              │
│ │ Date & Time: Tue Dec 10 2025 at 2:00 PM Pacific │ │ Ava: "Done! Your appointment │
│ │                                                 │ │ is scheduled. I'll send you  │
│ │ Mode: Video call                                │ │ a reminder the day before."  │
│ │                                                 │ │                              │
│ │ Duration: 30 minutes                            │ │ ▼ Appointment Scheduled      │
│ │                                                 │ │   Dr. Chen, Tue Dec 10       │
│ │ Add notes (optional):                           │ │   2:00 PM                    │
│ │ ┌──────────────────────────────────────────┐    │ │                              │
│ │ │ Topics or questions you'd like to discuss│    │ │                              │
│ │ │                                          │    │ │                              │
│ │ └──────────────────────────────────────────┘    │ │                              │
│ │                                                 │ │                              │
│ │           [Back]      [Confirm & Schedule CLICK]│ │                              │
│ └─────────────────────────────────────────────────┘ │                              │
└─────────────────────────────────────────────────────┴──────────────────────────────┘
```

---

## Clarifying Questions

### Ambiguous Requirements

1. **Appointment Preparation Checklist:**

   - **Resolution:** This is a general resource link visible on the appointments screen that helps users check their video, audio, and network connection if they need help setting up for video calls. It is not contextual per-appointment.

2. **Provider Notes Visibility:**

   - **Resolution:** There is a distinction between two types of notes:
     - **Pre-appointment notes** (shown in appointment details): Extra details about the appointment that providers enter (e.g., "please bring your x-rays"). These are always visible to patients.
     - **Clinical visit notes** (not shown here): Notes that providers enter during or after an appointment. These are separate and not displayed in the appointments interface.

3. **Reschedule Workflow:**
   - **Resolution:** There is no separate "Reschedule" action. Patients must cancel their existing appointment first, then schedule a new appointment. Ava can guide patients through this two-step process conversationally to make it feel seamless.

### Edge Cases

1. **No Available Appointments:**

   - **Resolution:** If no time slots are available for the selected provider in the next 6 months, the system should:
     1. Suggest an alternative provider (if available)
     2. Offer the patient the option to contact the care team
   - Example message: "Dr. Chen doesn't have any availability in the next 6 months. Would you like to see Dr. Martinez instead, or would you prefer to contact your care team for assistance?"

2. **Last-Minute Cancellations:**

   - **Resolution:** When a provider cancels an appointment:
     1. Patients are notified according to their contact preferences (email, SMS, push notification, etc.)
     2. The system automatically suggests rebooking and provides available time slot options
     3. Ava can proactively assist with rescheduling when the patient next logs in

3. **Concurrent Scheduling:**

   - **Resolution:** Race condition resolution is out of scope for UX specification and will be handled by architects at the API level.
   - **UX requirement:** If a scheduling conflict occurs, display a friendly error message: "This time slot was just booked by another patient. Please select a different time."

4. **Missed Appointments:**

   - **Resolution:**
     - "No-Show" status is automatically applied 15 minutes after the scheduled start time has passed
     - Patients can still access full details of missed appointments
     - Consequences for multiple no-shows are not yet defined (future consideration)

5. **Appointment Mode Changes:**

   - **Resolution:** Appointment mode cannot be changed after scheduling. To change from video to phone (or vice versa), patients must cancel the appointment and schedule a new one with the desired mode.

6. **Time Zone Handling:**
   - If a patient travels to a different time zone, how are appointments displayed?
   - Should appointments always show in the patient's current time zone or the facility's time zone?
   - How are time zones handled when scheduling?
   <!-- @agent Time zone displayed should match the client system's time. Appointment data will be stored in an agnostic format and this logic will be handled by architects. out of scope for ux. -->

### Design Decisions Needing Stakeholder Input

1. **Default Provider Selection in Scheduling Flow:**

   - **Decision:** If patient has only one assigned provider of the selected type, auto-select that provider by default.
   - **Implementation:** Provider selection and date/time selection should be on the same screen (not separate steps). When the provider dropdown selection changes, the available dates/times should dynamically update to reflect the newly selected provider's availability. This eliminates the need for "previous" and "next" buttons between these two selections.

2. **Appointment List Organization:**

   - **Decision:** Use simple chronological list with "Upcoming" and "Past" sections.
   - No grouping by month/week, no filter/sort options in initial implementation.

3. **Video Link Availability:**

   - **Decision:** Show "Join Video Call" button only within the check-in window (15 minutes before to 1 hour after scheduled start time).
   - The button should not appear at all before the check-in window opens.

4. **Ava Scheduling Auto-Confirmation:**

   - **Decision:** Ava always requires explicit confirmation before booking any appointment, cancelling, or making changes.
   - No auto-execution, even for simple changes.

5. **Preparation Checklist Placement:**

   - **Decision:** Persistent link on appointments screen (visible at the top of the appointment list area).
   - Not contextual per-appointment, and not proactively surfaced by Ava in greetings.

6. **Mobile vs Desktop Layout:**
   - **Decision:** Hide Ava chat pane by default on mobile devices. Users can tap to expand the chat as an overlay.
   - Desktop maintains side-by-side layout with persistent Ava chat pane.

---

## Implementation Notes

### Accessibility Considerations

- All appointment times must use semantic HTML `<time>` elements with machine-readable datetime attributes
- Appointment cards must be keyboard navigable and have proper ARIA labels
- Modals must trap focus and have clear close mechanisms
- Form validation errors must be clearly announced to screen readers
- Color cannot be the only indicator of appointment status (use icons and text)
- Time zone information must be clearly visible for all appointment times

### Performance Considerations

- Appointment list should be paginated or use virtual scrolling for patients with many appointments
- Provider availability should be fetched on-demand (when scheduling modal opens) not pre-loaded
- Consider caching provider availability for short periods to reduce API calls during scheduling flow

### Audit Trail Requirements

All appointment actions must be logged per CORE_PRINCIPLES.md:

- **Appointment Created:** Log who created (patient or coordinator), when, and all appointment details
- **Appointment Rescheduled:** Log previous date/time, new date/time, who made change, timestamp
- **Appointment Cancelled:** Log who cancelled, when, and cancellation reason (if provided)
- **Appointment Completed:** Log completion timestamp and any outcome notes
- **No-Show:** Log automatic status change with timestamp

These audit entries should appear as collapsible blocks in the AvaChatPane activity timeline.

---

## Future Enhancements (Out of Scope for Initial Implementation)

- Recurring appointments
- Group appointments or classes
- Waitlist for fully booked providers
- Patient-selected appointment duration (if provider allows flexibility)
- Integration with calendar apps (Google Calendar, Outlook, iCal)
- SMS/email appointment reminders
- Post-appointment feedback survey
- Video call technical check before appointment
- Appointment preparation task checklist per appointment (not just general resources)
