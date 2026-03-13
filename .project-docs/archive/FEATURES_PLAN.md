# Patients App - High-Level Features Plan

## Overview

This document outlines the high-level features for the Cena Health patients application. The app serves as the primary interface for patients to manage their health journey, interact with care teams, and access nutritional services.

---

## Design Philosophy: Dual-Interface Approach

### Ava - AI Patient Liaison

A core architectural principle of the patients app is providing **two parallel paths** for every interaction:

1. **Traditional Interface** - Standard forms, buttons, and navigation
2. **Conversational Interface** - Natural language interaction with Ava, our AI patient liaison

**Implementation Model:**
- **Persistent Chat Pane** - A persistent right-side pane is available throughout the app where patients can chat with Ava
- **Context-Aware Greetings** - When patients navigate to a new screen, Ava displays a contextual greeting prompt relevant to that page's purpose and the patient's current state (e.g., outstanding tasks, recent activity, encouragement)
- **Ephemeral Greetings** - If the patient leaves a page without interacting with Ava's greeting prompt, that prompt is removed and not stored in chat history; only actual interactions persist
- **Bidirectional Sync** - Actions taken in the traditional UI update the conversation context; Ava's responses populate and submit forms
- **Audit Trail Integration** - All patient actions (both conversational and traditional UI) are logged in the chat as collapsible audit blocks, creating a natural activity timeline
- **Confirmation-Based** - Ava fills forms based on conversation but always asks for patient confirmation before submission
- **Context-Aware** - Ava understands what screen the patient is on and can proactively assist with that task

**Visual Example:**
```
┌─────────────────────────────────┬──────────────────────────┐
│                                 │                          │
│  Traditional Form/Screen        │    Ava Chat Interface    │
│  (Assessment, Order, etc.)      │                          │
│                                 │  "How can I help you     │
│  [Form fields populate based    │   today?"                │
│   on conversation →]            │                          │
│                                 │  [Patient messages]      │
│                                 │  [Ava responses]         │
│                                 │                          │
│                                 │  ▼ Action: Logged weight │
│                                 │    165 lbs at 9:23am     │
│                                 │                          │
│                                 │  ▼ Action: Ordered meals │
│                                 │    3 meals, Thu-Sat      │
│                                 │                          │
└─────────────────────────────────┴──────────────────────────┘
```

**Key Capabilities Across All Features:**
- Initiate any workflow through conversation ("I need to schedule an appointment")
- Complete forms by chatting instead of typing in fields
- Ask questions about any feature or data ("What's my blood pressure trend?")
- Get guidance on health metrics ("Is my BMI in a healthy range?")
- Receive proactive suggestions based on context
- Natural language data entry with intelligent parsing
- Accessibility benefits for users who prefer voice/chat interaction
- Automatic activity timeline with collapsible audit blocks
- Review past actions: "What did I log yesterday?" or "Show me my recent orders"

**LLM Integration Opportunities:**
- Context-aware greeting generation based on page, patient state, and outstanding tasks
- Smart form auto-fill from natural language
- Health data interpretation and insights
- Personalized meal recommendations
- Assessment question clarification
- Medication and appointment reminders with context
- Symptom checking and triage guidance
- Educational content delivery tailored to patient questions
- Goal setting assistance and motivation
- Pattern recognition in journals (food, activity, mood)
- Translation and simplification of medical terminology
- Natural language querying of activity timeline ("What was my average weight in March?")
- Summarization of patient history for provider handoffs
- Dynamic greeting personalization based on time of day, recent achievements, or care plan progress

---

## Core Features

### 1. Account & Profile Management

**Description:** Manage personal information, preferences, and account settings.

**Navigation Location:** Account > Profile

**Key Capabilities:**

- Personal information (name, DOB, demographics)
- Contact information (phone, email, address)
- Emergency contacts
- Identity verification and documents
- App preferences and settings
- Profile photo management
- Privacy and security settings

---

### 1a. Device Integration

**Description:** Connect and manage health monitoring devices for automatic data sync.

**Navigation Location:** Account > Device Integration

**Key Capabilities:**

- Connect compatible health devices (smart scales, fitness trackers, blood pressure monitors, CGMs, etc.)
- Manage connected devices
- View device sync status
- Disconnect or re-authorize devices
- Configure sync preferences
- Troubleshoot connection issues

**Ava Enhancement:**
- Setup assistance: "Let me help you connect your Withings scale"
- Troubleshooting: "I noticed your device hasn't synced in 3 days. Let's fix that."
- Proactive alerts: "Your scale WiFi connection appears to be down"
- Data verification: "I just received your weight data from your scale (168 lbs)"

**Note:** Data from connected devices automatically appears in My Health > Health Data

---

### 2. Insurance & Eligibility

**Description:** Manage insurance information and verify coverage eligibility.

**Key Capabilities:**

- Enter and store insurance details
- Verify eligibility for pre-paid plans
- View coverage details and benefits
- Upload insurance card images
- Check coverage status for specific services

---

### 3. Nutrition & Menu Customization

**Description:** Configure dietary needs through nutrition prescription forms.

**Key Capabilities:**

- Set dietary preferences and restrictions
- Document food allergies and intolerances
- Specify ingredients to avoid
- Indicate cooking preferences
- Update nutrition prescription details
- View nutrition recommendations

**Ava Enhancement:**
- Conversational dietary preference gathering: "I don't like mushrooms and can't eat dairy"
- Natural language allergy documentation: "I'm allergic to shellfish and tree nuts"
- Recipe suggestions based on restrictions: "What can I make that's low sodium?"
- Meal preference explanations without medical jargon

---

### 4. Meal Management

**Description:** Order, manage, and track meal deliveries.

**Key Capabilities:**

- Create new meal orders
- View active and past orders
- Manage delivery schedule
- Pause meal deliveries
- Cancel orders
- View automatic delivery schedule
- Modify order frequency
- Track delivery status

**Ava Enhancement:**
- Natural order placement: "I need meals for next week, Tuesday through Friday"
- Schedule management via chat: "Pause my deliveries while I'm on vacation"
- Smart recommendations: "Based on your preferences, here are meals you might enjoy"
- Order modification: "Change Thursday's lunch to something with chicken"

---

### 5. Appointment Scheduling

**Description:** Schedule and manage appointments with care team members.

**Key Capabilities:**

- Schedule appointments with RDN (Registered Dietitian Nutritionist)
- Schedule appointments with BHN (Behavioral Health Navigator)
- View upcoming appointments
- Reschedule or cancel appointments
- Receive appointment reminders
- Access virtual visit links
- View appointment history

**Ava Enhancement:**
- Conversational scheduling: "Book me with my dietitian next Tuesday afternoon"
- Smart rescheduling: "I can't make my 2pm appointment, what's available?"
- Preparation assistance: "What should I bring to my appointment with the BHN?"
- Meeting prep reminders: "Your appointment is tomorrow - here are topics you wanted to discuss"

---

### 6. Health Data Tracking

**Description:** Log and monitor personal health metrics over time.

**Navigation Location:** My Health > Health Data

**Key Capabilities:**

- Self-report weight and BMI
- Log blood pressure readings
- Track heart rate
- Record blood sugar levels
- Monitor sleep patterns
- Track energy levels
- View data trends and history
- Generate health reports
- Display data from connected devices (configured in Account > Device Integration)

**Ava Enhancement:**
- Quick logging: "My blood pressure this morning was 120 over 80"
- Trend analysis: "How's my weight trending this month?"
- Data interpretation: "Is my blood sugar level concerning?"
- Contextual insights: "Your energy levels are higher on days you exercise"
- Multi-metric logging: "I weighed 165, BP was 118/76, slept 7 hours"

---

### 7. Health Assessments

**Description:** Complete periodic health assessments and track progress.

**Navigation Location:** My Health > Assessments

**Key Capabilities:**

- Access available assessments
- Complete assessment questionnaires
- View assessment results
- Track assessment history
- Compare results over time
- Receive assessment-based recommendations

**Ava Enhancement:**
- Conversational assessments: Complete entire assessments through natural dialogue
- Question clarification: "What does this assessment question mean?"
- Form auto-population: Ava fills assessment form as patient talks, then confirms
- Progress comparison: "How do my results compare to last time?"
- Personalized insights: "Based on your assessment, here are recommended focus areas"

---

### 9. Food & Activity Journals

**Description:** Log daily eating patterns and physical activity.

**Food Journal:**

- Log meals with timestamps
- Upload meal photos
- Add notes about meals
- Track adherence to meal plan
- Review eating patterns

**Activity Journal:**

- Record exercise and physical activity
- Log activity type, duration, and intensity
- Track steps and movement
- Add activity notes
- View activity trends

**Ava Enhancement:**
- Voice-based logging: "I had oatmeal with blueberries for breakfast"
- Photo analysis: Upload meal photo and Ava helps identify and log foods
- Activity shorthand: "30 min walk" or "I went to the gym for an hour"
- Pattern insights: "You tend to snack more on stressful days"
- Meal adherence feedback: "Great job sticking to your meal plan this week!"

---

### 10. Mood Tracking

**Description:** Monitor emotional well-being with simple daily check-ins.

**Key Capabilities:**

- Log daily mood (great, normal, meh, not good)
- Add mood notes or context
- View mood trends over time
- Identify mood patterns
- Share mood data with care team

---

### 11. Care Plan & Goals

**Description:** View personalized care plan, treatment recommendations, and track health goals.

**Navigation Location:** My Health > Care Plan

**Key Capabilities:**

- Access current care plan
- View treatment recommendations
- Review nutrition guidelines
- See care team notes
- Track care plan updates
- Download care plan documents
- List of goals added by providers and patient (freeform text by default)
- Automatic measure association: If Ava detects a tracked measure referenced in a goal, the goal is associated with that measure(s) and relevant data displays alongside the goal text
- Track progress toward goals
- Mark goals as completed
- View goal history
- Receive goal-based encouragement

**Ava Enhancement:**
- Context-aware greeting: Motivational messages related to care plan, goals, or progress to encourage and empower the patient
- Greeting examples:
  - "You're making great progress on [specific goal]. Keep it up!"
  - "I see your care team updated your plan on [date]. Would you like me to summarize what changed?"
  - "You're [X]% of the way toward your [measurable goal]. That's [encouraging descriptor]!"
  - "Your next care plan review is scheduled for [date]. Is there anything you'd like to discuss with your provider?"
- Goal setting dialogue: "I want to lose 10 pounds in 3 months"
- SMART goal refinement: Ava helps make goals specific, measurable, achievable
- Progress updates: "You're 60% of the way to your step goal today!"
- Motivation and accountability: "You've logged meals 6 days in a row - keep it up!"
- Adaptive suggestions: "Based on your progress, consider adjusting your goal to..."
- Intelligent measure detection: Recognizes when goal text references tracked metrics and auto-associates them

---

### 12. Recipe Library

**Description:** Access curated recipes that align with dietary needs.

**Key Capabilities:**

- Browse approved recipes
- Filter by dietary restrictions
- Search recipes by ingredient or name
- Save favorite recipes
- View nutritional information
- Access cooking instructions
- Share recipes

---

### 13. Payment Management

**Description:** Handle financial transactions and view billing history.

**Key Capabilities:**

- Process self-pay transactions
- View payment history
- Update payment methods
- View invoices and receipts
- Set up payment plans (if applicable)
- Download financial documents

---

### 14. Prescription Management

**Description:** Request refills through integrated Athena system.

**Key Capabilities:**

- View active prescriptions
- Request prescription refills
- Track refill request status
- View prescription history
- Receive refill notifications

---

### 15. Messaging & Communication

**Description:** Secure communication with care team members.

**Key Capabilities:**

- Message healthcare providers
- Contact care coordinator
- Message kitchen coordinator
- View message history
- Receive message notifications
- Attach photos or documents to messages
- Mark messages as read/unread

**Ava Enhancement:**
- Message drafting: "Help me write a message to my dietitian about my concerns"
- Smart routing: "I have a billing question" → routes to appropriate coordinator
- Message summarization: Summarize long message threads
- Follow-up tracking: "Did my provider respond to my question about...?"
- Urgent triage: Identifies urgent concerns and escalates appropriately

---

### 16. Feedback & Reviews

**Description:** Provide feedback on services and care quality.

**Key Capabilities:**

- Rate and review providers
- Provide kitchen quality feedback
- Review individual meals
- Submit general Cena services feedback
- Track feedback submissions
- View response to feedback (if applicable)

---

## Additional Features

### 17. Ava AI Assistant (Core Infrastructure)

**Description:** Persistent conversational AI interface integrated throughout the application.

**Key Capabilities:**

**Interface:**
- Persistent right-side chat pane available on all screens
- Collapsible/expandable for screen real estate management
- Context-aware of current screen and patient state
- Voice input option for accessibility
- Dynamic greeting system: Displays contextual greeting prompts when patient arrives on each page
- Ephemeral greeting behavior: Un-interacted greetings are removed when leaving the page and not stored in history

**Core Functions:**
- Context-aware greeting generation tailored to each screen and patient's current state
- Natural language command execution ("Schedule an appointment")
- Form auto-population with confirmation workflow
- Data interpretation and insights
- Question answering about health data, features, or medical info
- Proactive suggestions and reminders based on outstanding tasks, recent activity, and care plan
- Multi-turn conversations with context retention
- Automatic activity logging and timeline generation

**Intelligence:**
- Screen context awareness (knows what page user is viewing and generates appropriate greetings)
- Patient history awareness (health data, preferences, past interactions)
- Care plan awareness (current goals, restrictions, recommendations)
- Temporal awareness (appointment schedules, meal deliveries, medication timing)
- Task awareness (outstanding assessments, documents needed, appointments to schedule)
- Progress awareness (recent achievements, milestones reached, positive trends to celebrate)
- Greeting personalization (time of day, recent activity, patient preferences)

**Safety & Compliance:**
- HIPAA-compliant conversation logging
- Clear disclaimers for medical advice boundaries
- Escalation to human providers when appropriate
- Audit trail for AI-assisted actions
- User confirmation required before submitting forms or actions

**Activity Timeline & Audit Trail:**
- **Automatic Logging:** All patient actions (conversational or UI-based) generate audit log entries in chat
- **Collapsible Blocks:** Audit entries appear as collapsed blocks by default to reduce visual clutter
- **Action Types:** Weight logs, meal orders, appointments scheduled, assessments completed, medications logged, etc.
- **Timestamped:** Each action includes precise timestamp for clinical accuracy
- **Searchable History:** "What did I eat on Tuesday?" or "Show my last 5 weight entries"
- **Export Capability:** Generate reports from timeline data for providers or personal records
- **Privacy Controls:** Configure which actions appear in timeline vs. background logging only
- **Interactive Entries:** Expand audit blocks to see full details, edit if needed, or ask questions about past actions

**Technical Integration:**
- Bidirectional sync with traditional UI elements
- Real-time form population as conversation progresses
- Ability to trigger any app workflow via natural language
- Integration with all backend systems (EHR, scheduling, ordering, etc.)
- Event streaming architecture to capture all patient actions for timeline
- Efficient storage and retrieval of timeline data with pagination

---

### 18. Activity History & Audit Trail

**Description:** Comprehensive chronological view of all patient data changes and activity.

**Navigation Location:** Account > History

**Key Capabilities:**

- Chronological list of all data changes and activity
- Line items summarize chronologically related activity
- Click to expand for details (e.g., appointment details showing notes, care plan updates, new appointments created, address changes all in one session)
- Field-level change tracking with updated values, editor, and timestamp
- Immutable change logs with previous and new values
- Filter and search capabilities
- Export activity history for personal records
- Privacy controls for audit trail visibility

**Ava Enhancement:**
- Natural language queries: "What changed during my last appointment?"
- Activity summarization: "Show me everything that happened this week"
- Pattern identification: "I notice you tend to log weight on Monday mornings"
- Timeline navigation: "What was my blood pressure on March 15th?"

---

### 19. Notifications & Alerts

**Description:** Stay informed about important updates and reminders.

**Key Capabilities:**

- Appointment reminders
- Meal delivery notifications
- Medication reminders
- Assessment due dates
- Message alerts
- Goal milestone notifications
- Configure notification preferences

---

### 20. Education & Resources

**Description:** Access health education materials and resources.

**Key Capabilities:**

- View educational articles
- Access nutrition guides
- Watch educational videos
- Download resource materials
- Bookmark helpful content
- Receive personalized content recommendations

---

### 21. Progress Dashboard

**Description:** Visualize health journey and achievements.

**Key Capabilities:**

- View overall health progress
- See key metrics at a glance
- Track program milestones
- View achievement badges or rewards
- Generate progress reports
- Share progress with care team

---

### 19. Onboarding & Support

**Description:** Smooth onboarding experience and ongoing help.

**Key Capabilities:**

- Guided initial setup
- App tutorial and walkthrough
- FAQ and help center
- Contact support
- Report technical issues
- Access terms and privacy policy

---

### 20. Document Management

**Description:** Store and access important health documents.

**Key Capabilities:**

- Upload health documents
- View document library
- Download or share documents
- Organize documents by type
- Access lab results
- View imaging reports (if applicable)

---

## Technical Considerations

### Authentication & Security

- Secure login (password, biometric)
- Multi-factor authentication
- Session management
- Data encryption
- HIPAA compliance

### AI/LLM Infrastructure

**Model Selection:**
- Primary LLM for Ava interactions (Claude, GPT-4, or similar)
- Specialized models for specific tasks (image analysis for food photos, etc.)
- On-device vs. cloud-based processing decisions
- Fallback strategies for API downtime

**Context Management:**
- Patient context injection (health data, care plan, preferences)
- Conversation history management and summarization
- Screen context detection and injection for dynamic greeting generation
- Page-specific greeting prompt system with ephemeral behavior
- Token optimization strategies for long conversations
- Separation of persistent interactions vs. ephemeral greetings

**Tool/Function Calling:**
- Define structured functions for all app workflows
- Form field mapping for auto-population
- API integration for scheduling, ordering, data logging
- Transaction safety and rollback mechanisms

**Prompt Engineering:**
- System prompts for Ava personality and boundaries
- Page-specific greeting templates with dynamic personalization
- Task-specific prompts for different features
- Safety prompts for medical advice boundaries
- Versioning and A/B testing infrastructure for greeting effectiveness
- Greeting generation logic based on patient state, outstanding tasks, and recent activity

**Privacy & Compliance:**
- HIPAA-compliant LLM vendor agreements
- Conversation audit logging (separate from patient-facing timeline)
- Data retention policies for chat history and activity timeline
- PHI handling in prompts and responses
- User consent for AI interactions
- Timeline data encryption and secure storage
- Patient access controls for viewing/exporting their own timeline
- Provider access permissions for clinical timeline review

### Data Synchronization

- Integration with Athena EHR
- Real-time vs. batch sync strategy
- Offline mode capabilities
- Conflict resolution
- AI-initiated actions sync and validation

### Platform Support

- iOS and Android native apps
- Web application (if applicable)
- Responsive design with persistent chat pane
- Accessibility compliance (WCAG)
- Voice input support across platforms

---

## Next Steps

1. **Prioritize features for MVP vs. future releases**
   - Determine which features can launch without Ava vs. require it
   - Identify minimum viable Ava capabilities for MVP

2. **Define Ava's conversational design**
   - Design page-specific greeting system with dynamic personalization
   - Create conversation flows for key use cases (see FLOWS.md for examples)
   - Define Ava's personality, tone, and boundaries
   - Establish medical advice guardrails and escalation protocols
   - Document greeting generation logic and templates for each page

3. **Design dual-interface wireframes**
   - Show traditional UI + persistent chat pane layout
   - Demonstrate form auto-population workflows
   - Design confirmation dialogs for AI-suggested actions

4. **Define detailed user stories for each feature**
   - Include both traditional and conversational paths
   - Specify Ava enhancement requirements

5. **Define API requirements and data models**
   - Design function/tool calling schema for Ava
   - Plan context injection architecture
   - Define AI action logging structure

6. **Establish integration points with existing systems**
   - Map Athena EHR integration touchpoints
   - Define LLM provider requirements and contracts
   - Plan AI analytics and monitoring infrastructure

7. **Define success metrics for each feature**
   - Track traditional vs. conversational usage rates
   - Measure task completion rates by interface type
   - Monitor user satisfaction with Ava interactions
   - Track clinical outcomes correlation with engagement

---

## Notes

- This is a living document and will evolve as requirements are refined
- Features should be validated with patient user research
- Compliance with healthcare regulations (HIPAA, etc.) is mandatory
- Consider cultural competency and language localization needs
