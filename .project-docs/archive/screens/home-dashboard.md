# Home / Dashboard

**Navigation Label:** "Home" or "Dashboard"

---

## Screen Overview

The Home Dashboard serves as the patient's primary landing page after login. It provides an at-a-glance overview of their health progress, recent activities, upcoming actions, and personalized content. The screen is designed to orient patients quickly and facilitate common actions through both traditional UI and conversational interaction with Ava.

**Primary User Goals:**

- View current health progress aligned with their care plan
- Access quick actions (log data, order meals, schedule appointments)
- Review recent activity and messages
- Discover relevant health content
- Interact with Ava for assistance and check-ins

---

## Components Used

### Global Components

- **ScreenHeader** - See [ScreenHeader](../components/ScreenHeader.md)

  - **Usage Context:** Displays "Home" or "Dashboard" as page title
  <!-- @agent let's just call this "Dashboard" please update in all relevant files. -->
  - **Data Passed:** `title: "Home"`, optional `contextActions: []` (likely empty for dashboard)

- **AvaChatPane** - See [AvaChatPane](../components/AvaChatPane.md)
  - **Usage Context:** Persistent right-side chat interface for Ava interactions
  - **Data Passed:** Patient ID, session context, current screen identifier for contextual greeting

### New Components Needed

The following components are needed for this screen but don't exist in the registry yet:

- **ProgressOverviewCard** (NEW)

  - **Usage Context:** Displays individual health metrics (weight, A1C, blood pressure, etc.) specific to patient's program
  - **Data Passed:** Metric name, current value, target value, trend direction, last update timestamp, unit of measure

- **QuickActionsPanel** (NEW)

  - **Usage Context:** Provides 3 primary action buttons for common tasks
  - **Data Passed:** Action labels and navigation targets: "Log Health Data", "Order Meals", "Schedule Appointment"

- **ActivityTimelinePreview** (NEW)

  - **Usage Context:** Shows recent chronological interactions with the system
  - **Data Passed:** List of recent activities (type, timestamp, description, link to detail)

- **MealDeliveryCard** (NEW)

  - **Usage Context:** Displays summary of a meal delivery order in chronological list
  - **Data Passed:** Order date, meal count, produce count, order ID, click target for full order details

- **MessagePreviewCard** (NEW)

  - **Usage Context:** Shows unread message summaries in inbox-style list
  - **Data Passed:** Sender name, subject, preview text, timestamp, read/unread status, message ID

- **ContentSuggestionCard** (NEW)

  - **Usage Context:** Displays personalized content recommendations (recipes, activities, learnings)
  - **Data Passed:** Content type, title, preview/thumbnail, source link, relevance tags

- **ContentSuggestionsPanel** (NEW)
  - **Usage Context:** Container for content suggestion cards with Ava prompt action
  - **Data Passed:** List of content suggestions, current filter parameters

### Existing Layout Components

- **Card** - See [Card](../components/Card.md)

  - **Usage Context:** Wrapper for progress cards, meal deliveries, messages sections
  - **Data Passed:** Varies by section

- **EmptyState** - See [EmptyState](../components/EmptyState.md)
  - **Usage Context:** Shown in Messages section when all messages are read
  - **Data Passed:** `message: "You're all caught up!"` or similar friendly text

---

## Interactions

### View Progress Metrics

- **Trigger:** Screen loads
- **Result:** Display progress overview cards based on patient's program
- **States:** Loading, Data loaded, No data (show appropriate empty state)
- **Components involved:** ProgressOverviewCard

### Quick Action - Log Health Data

- **Trigger:** Click "Log Health Data" button in QuickActionsPanel
- **Result:** Navigate to health data logging screen/modal
- **States:** Default, Hover, Active
- **Components involved:** QuickActionsPanel, Button

### Quick Action - Order Meals

- **Trigger:** Click "Order Meals" button in QuickActionsPanel
- **Result:** Navigate to meal ordering screen
- **States:** Default, Hover, Active
- **Components involved:** QuickActionsPanel, Button

### Quick Action - Schedule Appointment

- **Trigger:** Click "Schedule Appointment" button in QuickActionsPanel
- **Result:** Navigate to appointment scheduling screen or open ScheduleAppointmentModal
- **States:** Default, Hover, Active
- **Components involved:** QuickActionsPanel, Button, possibly ScheduleAppointmentModal

### View Activity Details

- **Trigger:** Click on activity item in ActivityTimelinePreview
- **Result:** Navigate to detailed view of that activity (varies by activity type)
- **States:** Default, Hover
- **Components involved:** ActivityTimelinePreview

### View Full Meal Order

- **Trigger:** Click on MealDeliveryCard
- **Result:** Navigate to meal order details screen showing complete order
- **States:** Default, Hover
- **Components involved:** MealDeliveryCard

### View Message

- **Trigger:** Click on MessagePreviewCard
- **Result:** Navigate to full message view in messages screen
- **States:** Default, Hover, Read/Unread
- **Components involved:** MessagePreviewCard

### View All Messages

- **Trigger:** Click "View All" or similar link in Messages section
- **Result:** Navigate to full messages screen/inbox
- **States:** Default, Hover
- **Components involved:** Messages section header link

### View Content Suggestion

- **Trigger:** Click on ContentSuggestionCard
- **Result:** Navigate to full content page (recipe, article, video, etc.)
- **States:** Default, Hover
- **Components involved:** ContentSuggestionCard

### Request Different Content from Ava

- **Trigger:** Click "Ask Ava for more" button/link in ContentSuggestionsPanel
- **Result:** Opens Ava chat input with pre-populated prompt or focuses chat for patient to type custom request
- **States:** Default, Hover, Active
- **Components involved:** ContentSuggestionsPanel, AvaChatPane, AvaChatInput

### Conversational Interaction with Ava

- **Trigger:** Patient types message to Ava
- **Result:** Ava responds with contextual information, executes actions (with confirmation), or navigates patient to appropriate screen
- **States:** Typing, Sending, Ava responding (loading), Response received
- **Components involved:** AvaChatPane, AvaChatMessages, AvaChatInput, AvaActionLog

---

## Screen Data Requirements

### Data Displayed on This Screen

#### Progress Overview Section

- `metricName` (String) - Name of health metric (e.g., "Weight", "A1C", "Blood Pressure")
  - Source: Patient's care plan configuration
- `currentValue` (Number) - Current/most recent measured value
  - Source: Latest health data entry for this metric
- `targetValue` (Number) - Goal value per care plan
  - Source: Care plan targets
- `trendDirection` (Enum: up, down, stable) - Direction of recent trend
  - Computation: Compare recent values over time period
- `lastUpdated` (DateTime) - When this metric was last recorded
  - Source: Timestamp of most recent health data entry
- `unitOfMeasure` (String) - Display unit (e.g., "lbs", "%", "mmHg")
  - Source: Metric configuration
- **Note:** Which metrics display varies by patient's enrolled program

#### Quick Actions Section

- Action labels and navigation targets (static configuration)

#### Activity Timeline Section

- `activityType` (String) - Type of activity (e.g., "Appointment", "Message", "Health Data Log")
  - Source: Activity log
- `timestamp` (DateTime) - When activity occurred
  - Source: Activity log
- `description` (String) - Brief description of activity
  - Source: Activity log
- `detailLink` (String) - URL to detailed view
  - Computation: Based on activity type and ID

#### Meal Deliveries Section

- `orderDate` (Date) - Date of order/delivery
  - Source: Meal order record
- `mealCount` (Number) - Number of meals in order
  - Source: Meal order record
- `produceCount` (Number) - Number of produce items
  - Source: Meal order record
- `orderId` (String) - Unique order identifier
  - Source: Meal order record

#### Messages Section

- `senderName` (String) - Name of message sender
  - Source: Message record, user profile of sender
- `subject` (String) - Message subject line
  - Source: Message record
- `previewText` (String) - First ~100 characters of message body
  - Source: Message record (truncated)
- `timestamp` (DateTime) - When message was sent
  - Source: Message record
- `isRead` (Boolean) - Read/unread status
  - Source: Message read status for this patient
- `messageId` (String) - Unique message identifier
  - Source: Message record
- **Display Logic:** Show only 3 most recent unread messages; if none, show EmptyState

#### Content Suggestions Section

- `contentType` (String) - Type of content (e.g., "Recipe", "Exercise", "Article")
  - Source: Content metadata
- `title` (String) - Content title
  - Source: Content metadata
- `preview` (String/Image) - Preview text or thumbnail
  - Source: Content metadata
- `sourceLink` (String) - URL to full content
  - Source: Content metadata
- `relevanceTags` (Array<String>) - Why this content is suggested
  - Computation: Based on patient's diagnosis, care plan, preferences

### Permission Requirements

#### Role-Based Access

- **Patients:** Can access their own Home Dashboard
- **Providers/Care Team:** Cannot access patient's Home Dashboard directly (providers have separate interfaces)
- **Coordinators:** May have read-only access to patient dashboards for support purposes (organization-specific)

#### Field-Level Permissions

**Patient (viewing own dashboard):**

- ✅ Read: All progress metrics assigned to their program
- ✅ Read: All personal activity timeline entries
- ✅ Read: All their meal orders
- ✅ Read: All messages sent to them
- ✅ Read: Content suggestions
- ✅ Write: Can log new health data, order meals, schedule appointments (navigates to respective screens where write permissions apply)

**Care Coordinator (if granted access for support):**

- ✅ Read: Progress overview (may exclude sensitive clinical metrics)
- ✅ Read: Activity timeline (may exclude sensitive entries)
- ✅ Read: Meal deliveries
- ❌ Read: Messages (privacy restriction)
- ✅ Read: Content suggestions
- ❌ Write: No write permissions on patient dashboard

**Provider (if granted access for care review):**

- ✅ Read: All progress metrics
- ✅ Read: Activity timeline
- ✅ Read: Meal deliveries
- ✅ Read: Messages (only if participating in conversation thread)
- ❌ Write: Providers cannot act on behalf of patient from this screen

#### Conditional Access Rules

- Patient must be enrolled in a program to see progress metrics
- Progress metrics displayed are filtered by patient's specific program enrollment
- Content suggestions are personalized based on patient's care plan and preferences
- Activity timeline may filter certain system events that aren't relevant to patient view

---

## Ava Integration Details

### Context-Aware Greeting

The greeting appears as text IN the chat conversation when the patient navigates to the Home screen. It is ephemeral and removed if the patient navigates away without interacting.

**Greeting Examples (based on patient state):**

1. **New patient, just enrolled:**

   > "Welcome to Cena Health! I'm Ava, your care assistant. I'm here to help you track your progress, answer questions, and make managing your health easier. Would you like to start with a quick check-in to set your first goals?"

2. **Patient with positive progress:**

   > "Great to see you! You've logged your weight 5 days in a row—nice consistency! You're on track to hit your goal this week. Need help with anything today, or ready to log today's data?"

3. **Patient with upcoming appointment:**

   > "Hi there! Just a reminder: you have an appointment with Dr. Martinez tomorrow at 2:00 PM. Would you like to review your prep checklist or add any questions for your visit?"

4. **Patient with unread messages:**

   > "Welcome back! You have 3 new messages from your care team. Would you like me to summarize them, or you can check them in the Messages section below."

5. **Patient who hasn't logged data recently:**
   > "Hey! I noticed you haven't logged your blood pressure in a few days. How are you feeling? I can help you record your vitals now if you'd like."

### Conversational Shortcuts

Natural language interactions Ava enables on this screen:

- **Start check-in/assessment:**

  - "I'm ready for my check-in"
  - "Let's do my daily assessment"

- **Log health data:**

  - "I need to log my weight"
  - "My blood pressure was 120/80 this morning"
  - "Record my blood sugar"

- **Schedule appointment:**

  - "I need to schedule an appointment"
  - "Book a follow-up with my doctor"

- **Order meals:**

  - "I want to order meals for next week"
  - "Reorder my usual meal plan"

- **View/summarize messages:**

  - "What are my new messages about?"
  - "Summarize my unread messages"

- **Request content:**

  - "Show me recipes for the holidays"
  - "I need low-carb dinner ideas"
  - "Find me some exercises I can do at home"

- **Progress inquiry:**
  - "How am I doing on my goals?"
  - "What's my weight trend this month?"
  - "Am I on track?"

### Form Auto-Population

When patients converse with Ava about logging data or taking actions:

1. **Health Data Logging:**

   - Patient says: "My weight this morning was 185 pounds"
   - Ava extracts: metric (weight), value (185), unit (lbs), timestamp (this morning)
   - Ava pre-fills the health data log form and asks for confirmation before saving

2. **Appointment Scheduling:**

   - Patient says: "I need to see my doctor next Tuesday afternoon"
   - Ava extracts: provider preference (their assigned doctor), date (next Tuesday), time preference (afternoon)
   - Ava pre-populates ScheduleAppointmentModal with these preferences and shows available slots

3. **Meal Ordering:**
   - Patient says: "Order my usual meals"
   - Ava retrieves their previous order preferences
   - Ava pre-fills meal order form with previous selections and asks for confirmation

### Confirmation Workflows

Ava follows explicit confirmation before executing any write operations:

1. **Data Logging Example:**

   - **Patient:** "My A1C test result was 6.8%"
   - **Ava:** "I'll log your A1C as 6.8% for today. Should I save this?"
   - **Patient:** "Yes" / "Confirm" / "Go ahead"
   - **Ava:** ✅ Saves data, displays confirmation: "Done! Your A1C of 6.8% has been logged. That's a 0.3% improvement from last month—great work!"
   - **Audit log:** Entry created with context "Ava-assisted edit"

2. **Appointment Scheduling Example:**

   - **Patient:** "Schedule an appointment with Dr. Martinez for next week"
   - **Ava:** "I found these available times with Dr. Martinez next week: Tuesday at 2:00 PM, Thursday at 10:30 AM, Friday at 3:00 PM. Which works best for you?"
   - **Patient:** "Tuesday at 2"
   - **Ava:** "Perfect! I'll book you for Tuesday, Dec 16 at 2:00 PM Pacific with Dr. Martinez (30-minute appointment). Confirm?"
   - **Patient:** "Yes"
   - **Ava:** ✅ Books appointment, displays confirmation: "All set! Your appointment is confirmed. I've added it to your calendar and you'll get a reminder the day before."
   - **Audit log:** Entry created with context "Ava-assisted appointment booking"

3. **Cancellation/Modification:**
   - At any point before confirmation, patient can say "cancel", "never mind", or "change that"
   - Ava abandons the workflow and does not execute the action

---

## ASCII Wireframe

```
┌─────────────────────────────────────────────────────────┬───────────────────────────────┐
│ ScreenHeader                                            │ AvaChatPane                   │
│ ┌─────────────────────────────────────────────────────┐ │                               │
│ │ Title: "Home"                                       │ │ AvaChatMessages               │
│ └─────────────────────────────────────────────────────┘ │ ┌───────────────────────────┐ │
│                                                         │ │ [Greeting text appears    │ │
│ [Progress Overview Section]                             │ │  here based on patient    │ │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │ │  state...]                │ │
│ │ProgressOver- │ │ProgressOver- │ │ProgressOver- │      │ │                           │ │
│ │viewCard      │ │viewCard      │ │viewCard      │      │ │ [Patient messages]        │ │
│ │ Weight       │ │ A1C          │ │ Blood        │      │ │                           │ │
│ │ [CLICK]      │ │ [CLICK]      │ │ Pressure     │      │ │ [Ava responses]           │ │
│ └──────────────┘ └──────────────┘ │ [CLICK]      │      │ │                           │ │
│                                   └──────────────┘      │ │ [AvaActionLog blocks]     │ │
│                                                         │ │                           │ │
│ [QuickActionsPanel]                                     │ └───────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │                               │
│ │ [Button: Log Health Data] [Button: Order Meals]     │ │ AvaChatInput                  │
│ │ [Button: Schedule Appointment]                      │ │ ┌───────────────────────────┐ │
│ └─────────────────────────────────────────────────────┘ │ │ Type message to Ava...    │ │
│                                                         │ └───────────────────────────┘ │
│ [Recent Activity]                                       │                               │
│ ┌─────────────────────────────────────────────────────┐ │                               │
│ │ ActivityTimelinePreview                             │ │                               │
│ │  - Dec 9: Logged weight [CLICK]                     │ │                               │
│ │  - Dec 8: Message from Care Team [CLICK]            │ │                               │
│ │  - Dec 7: Completed appointment [CLICK]             │ │                               │
│ └─────────────────────────────────────────────────────┘ │                               │
│                                                         │                               │
│ [Meal Deliveries]                                       │                               │
│ ┌─────────────────────────────────────────────────────┐ │                               │
│ │ MealDeliveryCard [CLICK]                            │ │                               │
│ │  Dec 15 - 12 meals, 1 bag of produce                │ │                               │
│ │                                                     │ │                               │
│ │ MealDeliveryCard [CLICK]                            │ │                               │
│ │  Dec 8 - 12 meals, 1 bag of produce                 │ │                               │
│ └─────────────────────────────────────────────────────┘ │                               │
│                                                         │                               │
│ [Messages]                                              │                               │
│ ┌─────────────────────────────────────────────────────┐ │                               │
│ │ MessagePreviewCard [CLICK]                          │ │                               │
│ │  From: Dr. Martinez - "Lab results ready"           │ │                               │
│ │                                                     │ │                               │
│ │ MessagePreviewCard [CLICK]                          │ │                               │
│ │  From: Care Team - "Weekly check-in"                │ │                               │
│ │                                                     │ │                               │
│ │ [Link: View All Messages]                           │ │                               │
│ └─────────────────────────────────────────────────────┘ │                               │
│   OR (if no unread messages)                            │                               │
│ ┌─────────────────────────────────────────────────────┐ │                               │
│ │ EmptyState: "You're all caught up!"                 │ │                               │
│ └─────────────────────────────────────────────────────┘ │                               │
│                                                         │                               │
│ [Relevant Content]                                      │                               │
│ ┌─────────────────────────────────────────────────────┐ │                               │
│ │ ContentSuggestionsPanel                             │ │                               │
│ │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │ │                               │
│ │  │ContentSugges-│ │ContentSugges-│ │ContentSugges-│ │ │                               │
│ │  │tionCard      │ │tionCard      │ │tionCard      │ │ │                               │
│ │  │Recipe [CLICK]│ │Exercise      │ │Article       │ │ │                               │
│ │  └──────────────┘ │[CLICK]       │ │[CLICK]       │ │ │                               │
│ │                   └──────────────┘ └──────────────┘ │ │                               │
│ │                                                     │ │                               │
│ │  [Button/Link: Ask Ava for different content]       │ │                               │
│ └─────────────────────────────────────────────────────┘ │                               │
└─────────────────────────────────────────────────────────┴───────────────────────────────┘
```

---

## Clarifying Questions

### Missing Information

1. **Progress Overview Cards:**

   - What is the maximum number of metrics that could display for a single program?
   - Should there be a "View All Metrics" link if there are more than 3-4?
   - What are the specific programs patients can be enrolled in? (e.g., Diabetes Management, Weight Management, Cardiac Care)
   - What metrics map to which programs?

2. **Activity Timeline Preview:**

   - How many recent activities should be shown?
   - Is there a "View Full Timeline" link to see complete activity history?
   - What types of activities should/shouldn't appear? (e.g., system events vs. patient-initiated actions)

3. **Meal Deliveries:**

   - How many recent orders should be shown?
   - Are there different types of meal programs? (weekly, bi-weekly, etc.)
   - Should future scheduled deliveries also be shown, or only past orders?

4. **Messages:**

   - Are messages threaded or individual?
   - Who can send messages to patients? (providers, coordinators, automated system notifications)
   - Is there a priority/urgency indicator for messages?

5. **Content Suggestions:**
   - How many suggestions should be displayed?
   - How often do suggestions refresh/update?
   - Can patients dismiss/hide suggestions they're not interested in?
   - What's the algorithm/logic for determining relevance?

### Ambiguous Requirements

1. **Navigation from Dashboard:**

   - When clicking ProgressOverviewCard, where does it navigate? (detailed metric history, data logging screen, or nowhere?)
   - Does "Log Health Data" quick action open a modal or navigate to a separate screen?
   - Does "Schedule Appointment" open ScheduleAppointmentModal on the dashboard or navigate to appointments screen?

2. **Ava Greeting Behavior:**

   - Should the greeting change throughout the day if the patient returns to Home multiple times?
   - What happens to the greeting if the patient starts typing without interacting with it?
   - Can patients dismiss the greeting manually?

3. **Data Freshness:**

   - How real-time should progress metrics be? (refresh on page load, poll periodically, websocket updates)
   - Should there be visual indicators when data is outdated?

4. **Empty States:**
   - What should display in Progress Overview if patient isn't enrolled in a program or has no metrics configured?
   - What should display in Activity Timeline if there's no recent activity?
   - What should display in Meal Deliveries if patient doesn't have meal delivery service?
   - What should display in Content Suggestions if there are no relevant suggestions?

### Edge Cases

1. **No Program Enrollment:**

   - What does a patient see if they're newly registered but not yet enrolled in a care program?
   - Should the dashboard encourage/guide them to enroll?

2. **Data Anomalies:**

   - How should ProgressOverviewCard handle missing data points in trend calculation?
   - What if a metric has never been logged? (show "No data yet" or hide the card?)

3. **Long Lists:**

   - What if a patient has 20+ unread messages? (only show 3 with count indicator?)
   - What if activity timeline has hundreds of entries? (pagination, lazy loading?)

4. **Permission Failures:**

   - What should display if backend returns 403 for a particular section due to permission issues?
   - Should entire sections gracefully hide or show error states?

5. **Ava Unavailable:**
   - What happens if Ava service is down or unavailable?
   - Should there be a fallback message in AvaChatPane?

### Design Decisions Needing Stakeholder Input

1. **Dashboard Personalization:**

   - **Option A:** Fixed layout with all sections visible (some may be empty states)
   - **Option B:** Dynamic layout that only shows sections relevant to patient's program/services
   - **Option C:** Patient-customizable dashboard where they can hide/reorder sections
   - **Trade-offs:** A is simplest but may feel cluttered; B is cleaner but less predictable; C is most flexible but more complex to build

2. **Mobile Responsiveness:**

   - **Option A:** Stack all sections vertically with AvaChatPane at bottom (full width)
   - **Option B:** AvaChatPane becomes a floating/overlay chat button on mobile
   - **Option C:** Separate mobile navigation to Ava as a dedicated tab
   - **Trade-offs:** How should the dual-interface philosophy adapt to small screens?

3. **Content Suggestions Interaction:**

   - **Option A:** "Ask Ava for different content" opens AvaChatInput with pre-filled prompt
   - **Option B:** Opens a modal with filter options (content type, topic) that then prompts Ava
   - **Option C:** Opens a modal with filter UI that directly queries content API (bypassing Ava)
   - **Trade-offs:** A reinforces conversational UI; B provides structure; C is more traditional but goes against Ava-first philosophy

4. **Quick Actions Placement:**

   - **Option A:** Prominent horizontal button panel near top (current wireframe)
   - **Option B:** Floating action button (FAB) pattern for mobile-friendly access
   - **Option C:** Integrated into Ava greeting as suggested actions
   - **Trade-offs:** Visual hierarchy and mobile/desktop consistency

5. **Progress Metrics Click Behavior:**
   - **Option A:** Non-clickable (display only)
   - **Option B:** Click navigates to detailed metric history/trend view
   - **Option C:** Click opens data logging modal pre-filled for that metric
   - **Trade-offs:** What's the most useful action when patient wants to engage with a metric?
