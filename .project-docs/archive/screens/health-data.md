# Health Data Screen - Enhanced Requirements

**Navigation Label:** "Health Data"

**Screen Type:** Secondary navigation screen (My Health > Health Data)

---

## Screen Overview

The Health Data screen serves as the comprehensive hub for viewing and managing all health metrics tracked as part of the patient's care program. Patients can view time-series charts of their health data, log new measurements manually, understand what each metric means and why it matters, and see data automatically synced from connected devices. The screen provides both a high-level overview and detailed drill-down capabilities for each metric.

**Primary User Goals:**

- View current values and historical trends for all tracked health metrics
- Log new health data manually (weight, blood pressure, blood sugar, etc.)
- Understand what each metric means and why it's important to their care plan
- See which data came from connected devices vs. manual entry
- Export health data for sharing with providers or personal records
- Identify patterns and correlations between different health metrics

---

## Components Used

### Global Components

- **ScreenHeader** - See [ScreenHeader](../components/ScreenHeader.md)

  - **Usage Context:** Page title "Health Data" with primary action button "Log Data"
  - **Data Passed:**
    - `title`: "Health Data"
    - `primaryAction`: { label: "Log Data", onClick: openLogDataModal }

- **AvaChatPane** - See [AvaChatPane](../components/AvaChatPane.md)
  - **Usage Context:** Persistent right-side chat pane where Ava displays contextual greeting and assists with data logging and interpretation
  - **Data Passed:**
    - `greetingText`: Context-aware greeting based on recent logging activity
    - `conversationHistory`: Patient's chat history
    - `pageContext`: "health-data"

### Screen-Specific Components (NEW)

The following components are needed for this screen but don't exist in the registry yet:

- **HealthMetricsList** (NEW)

  - **Usage Context:** Container for displaying all tracked health metrics in organized sections
  - **Data Passed:**
    - `metrics`: Array of metric objects grouped by category
    - `onMetricClick`: Handler to expand/navigate to detailed metric view

- **HealthMetricCard** (NEW)

  - **Usage Context:** Summary card showing current value, trend, and mini chart for a single metric
  - **Data Passed:**
    - `metricId`: Unique identifier
    - `metricName`: Display name (e.g., "Weight", "Blood Pressure", "Blood Sugar")
    - `currentValue`: Most recent measurement
    - `unit`: Unit of measure (e.g., "lbs", "mmHg", "mg/dL")
    - `targetValue`: Goal/target per care plan (optional)
    - `trendDirection`: "improving", "stable", "worsening" (optional)
    - `lastLoggedDate`: When last measurement was taken
    - `dataSource`: "manual", "device", or "both"
    - `miniChartData`: Last 7-30 days of values for sparkline

- **MetricDetailView** (NEW)

  - **Usage Context:** Expanded view showing full chart, detailed history, and actions for a single metric
  - **Data Passed:**
    - `metric`: Full metric object
    - `timeSeriesData`: Complete historical data for charting
    - `dateRangeFilter`: Currently selected time range (7d, 30d, 90d, 1y, all)
    - `onLogData`: Handler to open log data modal pre-filled for this metric
    - `onLearnMore`: Handler to open educational content about this metric

- **LogDataModal** (NEW)

  - **Usage Context:** Form modal for manually entering health measurements
  - **Data Passed:**
    - `availableMetrics`: List of metrics patient can log
    - `preselectedMetric`: If opened from specific metric (optional)
    - `onSubmit`: Handler to save new measurement
    - `onClose`: Handler to close modal

- **HealthDataChart** (NEW)

  - **Usage Context:** Interactive time-series chart showing metric values over time
  - **Data Passed:**
    - `data`: Time-series data points
    - `metricName`: Metric being charted
    - `unit`: Unit of measure
    - `targetValue`: Goal line to display (optional)
    - `dateRange`: Time range being displayed
    - `showDeviceVsManual`: Whether to differentiate data sources visually

- **DataSourceBadge** (NEW)

  - **Usage Context:** Small indicator showing if data came from device or manual entry
  - **Data Passed:**
    - `source`: "device", "manual", or "both"
    - `deviceName`: If from device, which device (optional)

- **MetricEducationCard** (NEW)
  - **Usage Context:** Educational content explaining what a metric is and why it matters
  - **Data Passed:**
    - `metricName`: Which metric this explains
    - `description`: What this metric measures
    - `whyItMatters`: Why this is tracked for patient's condition
    - `idealRange`: Normal/target ranges
    - `tips`: How to improve this metric

### Existing Layout Components

- **Card** - See [Card](../components/Card.md)

  - **Usage Context:** Container for metric cards, educational content
  - **Data Passed:** Varies by content

- **Button** - See [Button](../components/Button.md)

  - **Usage Context:** "Log Data", "Export", "Learn More", "View Details"
  - **Data Passed:** Label, onClick handler, variant

- **Modal** - See [Modal](../components/Modal.md)

  - **Usage Context:** Container for data logging form and educational content
  - **Data Passed:** Content, onClose handler, size variant

- **EmptyState** - See [EmptyState](../components/EmptyState.md)
  - **Usage Context:** Shown when no data has been logged for a metric yet
  - **Data Passed:** Message encouraging first data entry

---

## Interactions

### View Metric Details

- **Trigger:** Click/tap on HealthMetricCard
- **Result:** Expands to MetricDetailView or navigates to detailed metric page
- **States:**
  - Loading: Fetching complete historical data
  - Success: Full chart and history displayed
  - No Data: Empty state encouraging first log
- **Components Involved:** HealthMetricCard, MetricDetailView, HealthDataChart

### Log New Health Data

- **Trigger:** Click "Log Data" button in ScreenHeader or specific metric card
- **Result:** LogDataModal opens with data entry form
- **Flow:**
  1. Select which metric to log (pre-selected if opened from specific metric)
  2. Enter measurement value
  3. Select date/time (defaults to current)
  4. Add optional notes
  5. Submit and save
  6. Data appears in chart and current value updates
  7. Audit trail logged
- **States:**
  - Entering: Form open, patient filling in data
  - Validating: Checking for valid input (e.g., reasonable values)
  - Success: Data saved, modal closes, success message
  - Error: Validation error or server error
- **Components Involved:** Button, LogDataModal, Modal

### Change Time Range for Chart

- **Trigger:** Select different time range filter (7 days, 30 days, 90 days, 1 year, All)
- **Result:** Chart updates to show selected time period
- **States:**
  - Loading: Fetching data for new time range
  - Success: Chart re-renders with new data
- **Components Involved:** MetricDetailView, HealthDataChart

### Learn About a Metric

- **Trigger:** Click "Learn More" or info icon on metric card
- **Result:** MetricEducationCard expands or modal opens with educational content
- **Flow:**
  1. Educational content displays explaining the metric
  2. Shows why it's important for patient's condition
  3. Provides ideal ranges and improvement tips
  4. Links to additional resources if available
- **States:**
  - Success: Content displays
  - Error: Content unavailable
- **Components Involved:** HealthMetricCard, MetricEducationCard, Modal

### Export Health Data

- **Trigger:** Click "Export" button
- **Result:** Generates downloadable report of health data
- **Flow:**
  1. Patient selects which metrics to include
  2. Patient selects date range
  3. Patient selects format (PDF, CSV, etc.)
  4. Report is generated and downloaded
- **States:**
  - Configuring: Selecting export options
  - Generating: Creating report file
  - Success: File downloads
  - Error: Export fails
- **Components Involved:** Button, Modal (for export options)

### Conversational Data Logging (via Ava)

- **Trigger:** Patient says "I want to log my weight" or provides measurement in conversation
- **Result:** Ava extracts data and logs it with confirmation
- **Flow:**
  1. Patient mentions metric and value: "My weight this morning was 185 pounds"
  2. Ava extracts: metric (weight), value (185), unit (lbs), time (this morning)
  3. Ava confirms: "I'll log your weight as 185 lbs for this morning. Should I save this?"
  4. Patient confirms
  5. Ava saves data and provides feedback: "Done! Your weight has been logged. That's down 2 lbs from last week—great progress!"
  6. Chart updates in real-time
  7. Audit trail logged
- **States:**
  - Extracting: Ava parsing patient's message
  - Confirming: Awaiting patient confirmation
  - Success: Data logged
  - Error: Couldn't parse or save data
- **Components Involved:** AvaChatPane, HealthMetricCard (updates), HealthDataChart (updates)

### Conversational Data Interpretation (via Ava)

- **Trigger:** Patient asks "How am I doing with my blood sugar?" or "What's my weight trend?"
- **Result:** Ava analyzes data and provides interpretation
- **Flow:**
  1. Patient asks about metric or trend
  2. Ava retrieves relevant data
  3. Ava provides summary and insights
  4. Ava may suggest actions or highlight concerns
- **States:**
  - Analyzing: Ava processing data
  - Responding: Ava providing interpretation
- **Components Involved:** AvaChatPane, MetricDetailView (may be opened by Ava)

---

## Screen Data Requirements

### Data Displayed on This Screen

#### Health Metrics List Data

- `metricId` (String) - Unique identifier for each metric type
- `metricName` (String) - Display name (e.g., "Weight", "Blood Pressure", "A1C")
- `metricCategory` (Enum: "Vitals" | "Lab Results" | "Lifestyle" | "Symptoms") - Grouping category
- `currentValue` (Number or String) - Most recent measurement
  - Source: Latest data entry for this metric
- `unit` (String) - Unit of measure (e.g., "lbs", "mmHg", "mg/dL", "bpm")
  - Source: Metric configuration
- `targetValue` (Number, optional) - Goal/target from care plan
  - Source: Patient's care plan
- `targetRange` (Object, optional) - Acceptable range
  - `min` (Number)
  - `max` (Number)
  - Source: Care plan or clinical guidelines
- `trendDirection` (Enum: "improving" | "stable" | "worsening" | null) - Direction of recent trend
  - Computation: Compare recent average to previous period
- `lastLoggedDate` (DateTime) - When last measurement was taken
  - Source: Most recent data entry timestamp
- `dataSource` (Enum: "manual" | "device" | "both") - How data is collected
  - Source: Origin of most recent data
- `isTracked` (Boolean) - Whether this metric is active for patient's program
  - Source: Patient's care plan configuration

#### Time-Series Data (for charts)

- `timestamp` (DateTime) - When measurement was taken
- `value` (Number) - Measured value
- `source` (Enum: "manual" | "device") - How this data point was collected
- `deviceId` (String, optional) - If from device, which device
- `notes` (String, optional) - Any patient or provider notes
- `enteredBy` (String) - Patient ID or "system" for device data
- `loggedAt` (DateTime) - When this was entered into system (may differ from timestamp)

#### Metric Education Content

- `metricName` (String) - Which metric this explains
- `shortDescription` (String) - Brief explanation (1-2 sentences)
- `fullDescription` (String) - Detailed explanation
- `whyItMatters` (String) - Relevance to patient's condition
- `idealRange` (String) - Normal/target ranges with context
- `improvementTips` (Array<String>) - Actionable advice for improving this metric
- `learnMoreLinks` (Array) - External educational resources
  - `title` (String)
  - `url` (URL)

### Permission Requirements

#### Role-Based Access

- **Patient:** Can view their own health data, log new measurements, export their data
- **Provider (RDN/BHN):** Can view patient's health data (read-only), add provider notes/annotations
- **Care Coordinator:** Can view patient's health data (read-only), assist with data entry
- **Admin:** Full access to all health data and configuration

#### Field-Level Permissions

| Field                | Patient View | Patient Edit | Provider View | Provider Edit | Coordinator View | Coordinator Edit |
| -------------------- | ------------ | ------------ | ------------- | ------------- | ---------------- | ---------------- |
| All metric values    | ✓            | ✓ (own data) | ✓             | -             | ✓                | -                |
| Timestamps           | ✓            | ✓ (own data) | ✓             | -             | ✓                | -                |
| Patient notes        | ✓            | ✓            | ✓             | -             | ✓                | -                |
| Provider annotations | ✓            | -            | ✓             | ✓             | ✓                | -                |
| Data source          | ✓            | -            | ✓             | -             | ✓                | -                |
| Target values        | ✓            | -            | ✓             | ✓             | ✓                | -                |
| Export data          | ✓            | ✓            | ✓             | ✓             | ✓                | -                |

#### Conditional Access Rules

- Patients can only view and edit their own health data
- Metrics displayed are filtered by patient's enrolled program
- Some lab result metrics may have delayed visibility (e.g., provider reviews before patient sees)
- Historical data cannot be deleted, only corrected with new entries and audit trail
- Provider annotations on data points only visible if marked as "patient-visible"

---

## Ava Integration Details

### Context-Aware Greeting

Ava's greeting appears as text IN the chat conversation when the patient navigates to the Health Data screen. The greeting is ephemeral and removed if the patient navigates away without interacting.

**Greeting Examples Based on Patient State:**

1. **Patient hasn't logged data recently:**

   > "I noticed you haven't logged your blood pressure in 4 days. How are you feeling today? I can help you record your vitals now if you'd like."

2. **Patient has been logging consistently:**

   > "Great job staying on top of your health tracking! You've logged your weight 7 days in a row. Your trend is looking good—down 3 pounds this week. Keep it up!"

3. **Patient has concerning trend:**

   > "I see your blood sugar has been running higher than usual the past few days. How are you feeling? Would you like to talk about what might be affecting it, or should we flag this for Dr. Chen?"

4. **Patient just synced device data:**

   > "Your Withings scale just synced—I've updated your weight chart with this morning's measurement. You're now 2 pounds away from your goal!"

5. **Patient viewing specific metric with educational opportunity:**
   > "I see you're looking at your A1C results. This measures your average blood sugar over the past 3 months. Want to learn more about what this number means and how to improve it?"

### Conversational Shortcuts

Ava enables natural language interactions for health data management:

**Logging Data:**

- "I want to log my weight"
- "My blood pressure was 120/80 this morning"
- "Record my blood sugar at 95"
- "I weighed 185 pounds today"

**Viewing Data:**

- "Show me my weight trend"
- "How's my blood pressure doing?"
- "What was my A1C last time?"
- "When did I last log my blood sugar?"

**Interpreting Data:**

- "Am I on track with my goals?"
- "Why is my blood sugar higher today?"
- "What does my blood pressure reading mean?"
- "Is my weight trend good?"

**Learning:**

- "Why do I need to track A1C?"
- "What's a healthy blood pressure?"
- "How can I improve my blood sugar?"
- "Tell me more about BMI"

**Exporting:**

- "I need a report of my weight data"
- "Export my blood pressure logs"
- "Can I download my health data?"

### Form Auto-Population

When patients converse with Ava about logging data:

1. **Single Value Entry:**

   - Patient: "My weight this morning was 185 pounds"
   - Ava extracts: metric (weight), value (185), unit (lbs), timestamp (this morning)
   - Ava pre-fills log data form and asks for confirmation
   - If patient confirms, data is saved directly without opening modal

2. **Multi-Component Entry (e.g., Blood Pressure):**

   - Patient: "My blood pressure was 120 over 80"
   - Ava extracts: metric (blood pressure), systolic (120), diastolic (80)
   - Ava confirms: "I'll log your blood pressure as 120/80 mmHg for now. Should I save this?"

3. **Conversational Context:**

   - Patient in ongoing conversation: "I've been feeling good. My weight was down to 182 this morning."
   - Ava: "That's great to hear! I'll log your weight as 182 lbs for this morning. Confirm?"
   - Patient: "Yes"
   - Ava: "Done! You're just 7 pounds from your goal weight now—excellent progress!"

4. **Ambiguity Resolution:**
   - Patient: "My sugar was 110"
   - Ava: "I'll log your blood sugar as 110 mg/dL. Was this a fasting measurement or after a meal?"
   - Patient: "After breakfast"
   - Ava: "Got it. Logging 110 mg/dL (post-meal). Saved!"

### Confirmation Workflows

Ava follows explicit confirmation before logging any health data:

**Standard Data Logging:**

```
Patient: "My weight this morning was 185 pounds"

Ava: "I'll log your weight as 185 lbs for this morning. Should I save this?"

Patient: "Yes"

Ava: "Done! Your weight has been logged. That's down 2 lbs from last week—great progress! You're now 10 lbs from your goal."

Audit log: Entry created with context "Ava-assisted data entry"
```

**Data with Concerns:**

```
Patient: "My blood pressure was 160 over 95"

Ava: "I'll log your blood pressure as 160/95 mmHg. This is higher than your target range (120/80). Should I save this and flag it for your care team to review?"

Patient: "Yes, please"

Ava: "Logged. I've also notified your care team about this elevated reading. They may reach out to you. How are you feeling right now? Any symptoms like headache or dizziness?"
```

**Correction Request:**

```
Patient: "Actually, I meant 175, not 185"

Ava: "No problem! I'll update it to 175 lbs instead. Should I save 175 lbs for this morning?"

Patient: "Yes"

Ava: "Updated! Your weight is now logged as 175 lbs."
```

---

## ASCII Wireframe

### Main Health Data Screen

```
┌─────────────────────────────────────────────────────────┬──────────────────────────────┐
│ ScreenHeader                                            │ AvaChatPane                  │
│ ┌─────────────────────────────────────────────────────┐ │                              │
│ │ Health Data                    [Log Data CLICK]     │ │ Ava greeting appears here:   │
│ └─────────────────────────────────────────────────────┘ │ "Great job staying on top    │
│                                                         │  of your tracking! You've    │
│ [Export Data CLICK]                                    │  logged weight 7 days in     │
│                                                         │  a row."                     │
│ HealthMetricsList                                       │                              │
│ ┌─────────────────────────────────────────────────────┐ │ [Patient can type here...]   │
│ │ VITALS                                              │ │                              │
│ │                                                     │ │                              │
│ │ HealthMetricCard [CLICK -> detail view]            │ │                              │
│ │ ┌─────────────────────────────────────────────────┐ │ │                              │
│ │ │ Weight                      [DataSourceBadge]   │ │ │ Chat message history         │
│ │ │ 183 lbs (Target: 175 lbs)                       │ │ │ appears below...             │
│ │ │ ↓ Down 2 lbs from last week                     │ │ │                              │
│ │ │ Last logged: Today at 8:30 AM                   │ │ │ ▼ Weight Logged              │
│ │ │ [Mini sparkline chart ⎺⎻⎺⎻⎼⎽]                    │ │ │   185 lbs → 183 lbs          │
│ │ │                                 [Log] [Details] │ │ │   (CLICK -> expand)          │
│ │ └─────────────────────────────────────────────────┘ │ │                              │
│ │                                                     │ │                              │
│ │ HealthMetricCard [CLICK -> detail view]            │ │                              │
│ │ ┌─────────────────────────────────────────────────┐ │ │                              │
│ │ │ Blood Pressure              [DataSourceBadge]   │ │ │                              │
│ │ │ 122/78 mmHg (Target: <120/80)                   │ │ │                              │
│ │ │ ≈ Stable                                        │ │ │                              │
│ │ │ Last logged: Yesterday at 7:15 AM               │ │ │                              │
│ │ │ [Mini sparkline chart ⎺⎼⎺⎼⎺⎼]                    │ │ │                              │
│ │ │                                 [Log] [Details] │ │ │                              │
│ │ └─────────────────────────────────────────────────┘ │ │                              │
│ │                                                     │ │                              │
│ │ HealthMetricCard [CLICK -> detail view]            │ │                              │
│ │ ┌─────────────────────────────────────────────────┐ │ │                              │
│ │ │ Blood Sugar                 [DataSourceBadge]   │ │ │                              │
│ │ │ 98 mg/dL (Target: 80-130)                       │ │ │                              │
│ │ │ ✓ Within target range                           │ │ │                              │
│ │ │ Last logged: 4 days ago                         │ │ │                              │
│ │ │ [Mini sparkline chart ⎼⎺⎽⎼⎺⎼]                    │ │ │                              │
│ │ │                                 [Log] [Details] │ │ │                              │
│ │ └─────────────────────────────────────────────────┘ │ │                              │
│ │                                                     │ │                              │
│ │ LAB RESULTS                                         │ │                              │
│ │                                                     │ │                              │
│ │ HealthMetricCard [CLICK -> detail view]            │ │                              │
│ │ ┌─────────────────────────────────────────────────┐ │ │                              │
│ │ │ A1C                         [i Learn More]      │ │ │                              │
│ │ │ 6.8% (Target: <7.0%)                            │ │ │                              │
│ │ │ ↓ Improved from 7.1%                            │ │ │                              │
│ │ │ Last tested: Nov 15, 2025                       │ │ │                              │
│ │ │ [Mini sparkline chart ⎺⎻⎼⎽]                      │ │ │                              │
│ │ │                                      [Details]  │ │ │                              │
│ │ └─────────────────────────────────────────────────┘ │ │                              │
│ │                                                     │ │                              │
│ │ LIFESTYLE                                           │ │                              │
│ │                                                     │ │                              │
│ │ HealthMetricCard [CLICK -> detail view]            │ │                              │
│ │ ┌─────────────────────────────────────────────────┐ │ │                              │
│ │ │ Sleep                       [DataSourceBadge]   │ │ │                              │
│ │ │ 7.2 hours (Target: 7-9 hours)                   │ │ │                              │
│ │ │ ≈ Stable                                        │ │ │                              │
│ │ │ Last logged: Today at 7:00 AM                   │ │ │                              │
│ │ │ [Mini sparkline chart ⎺⎻⎺⎻⎺⎻]                    │ │ │                              │
│ │ │                                 [Log] [Details] │ │ │                              │
│ │ └─────────────────────────────────────────────────┘ │ │                              │
│ └─────────────────────────────────────────────────────┘ │                              │
└─────────────────────────────────────────────────────────┴──────────────────────────────┘
```

### Metric Detail View (Expanded)

```
┌─────────────────────────────────────────────────────────┬──────────────────────────────┐
│ MetricDetailView                               [← Back] │ AvaChatPane                  │
│ ┌─────────────────────────────────────────────────────┐ │                              │
│ │ Weight Tracking                                     │ │ "You're down 2 lbs from      │
│ │                                                     │ │  last week—great progress!   │
│ │ Current: 183 lbs    Target: 175 lbs                │ │  You're 8 lbs from goal."    │
│ │ [DataSourceBadge: Device + Manual]                 │ │                              │
│ │                                                     │ │                              │
│ │ Time Range: [7d] [30d] [90d] [1y] [All]            │ │                              │
│ │                                                     │ │                              │
│ │ HealthDataChart                                     │ │                              │
│ │ ┌─────────────────────────────────────────────────┐ │ │                              │
│ │ │ 190 ┤                                           │ │ │                              │
│ │ │ 188 ┤  ●                                        │ │ │                              │
│ │ │ 186 ┤    ●                                      │ │ │                              │
│ │ │ 184 ┤      ●   ●                                │ │ │                              │
│ │ │ 182 ┤          ●  ●   ●                         │ │ │                              │
│ │ │ 180 ┤                 ●  ●                      │ │ │                              │
│ │ │ 178 ┤                       ●                   │ │ │                              │
│ │ │ 176 ┤                                           │ │ │                              │
│ │ │ 174 ┤- - - - - - - - - - (Target: 175 lbs) - - │ │ │                              │
│ │ │     └───────────────────────────────────────────│ │ │                              │
│ │ │      Dec 1    Dec 5    Dec 9    Dec 13         │ │ │                              │
│ │ └─────────────────────────────────────────────────┘ │ │                              │
│ │                                                     │ │                              │
│ │ RECENT ENTRIES                                      │ │                              │
│ │ ┌─────────────────────────────────────────────────┐ │ │                              │
│ │ │ Today 8:30 AM     183 lbs   [Device: Withings] │ │ │                              │
│ │ │ Yesterday 8:15 AM 185 lbs   [Device: Withings] │ │ │                              │
│ │ │ Dec 9 8:00 AM     186 lbs   [Manual Entry]     │ │ │                              │
│ │ │ Dec 8 8:30 AM     187 lbs   [Device: Withings] │ │ │                              │
│ │ │ Dec 7 8:15 AM     188 lbs   [Device: Withings] │ │ │                              │
│ │ └─────────────────────────────────────────────────┘ │ │                              │
│ │                                                     │ │                              │
│ │ [Log New Weight CLICK]  [Learn More CLICK]         │ │                              │
│ └─────────────────────────────────────────────────────┘ │                              │
└─────────────────────────────────────────────────────────┴──────────────────────────────┘
```

### Log Data Modal

```
┌─────────────────────────────────────────────────────────┬──────────────────────────────┐
│ LogDataModal                               [X CLOSE]    │ AvaChatPane                  │
│ ┌─────────────────────────────────────────────────────┐ │                              │
│ │ Log Health Data                                     │ │ Patient: "My weight was      │
│ │                                                     │ │ 183 this morning"            │
│ │ Select Metric:                                      │ │                              │
│ │ ┌──────────────────────────────────────────┐        │ │ Ava: "I'll log your weight   │
│ │ │ Weight ▼CLICK                            │        │ │ as 183 lbs for this morning. │
│ │ └──────────────────────────────────────────┘        │ │ Should I save this?"         │
│ │                                                     │ │                              │
│ │ Value:                                              │ │ Patient: "Yes"               │
│ │ ┌──────────────────┐  ┌──────────┐                │ │                              │
│ │ │ 183              │  │ lbs ▼    │                │ │ Ava: "Done! Your weight has  │
│ │ └──────────────────┘  └──────────┘                │ │ been logged. That's down 2   │
│ │                                                     │ │ lbs from last week!"         │
│ │ Date & Time:                                        │ │                              │
│ │ ┌──────────────────┐  ┌──────────┐                │ │ ▼ Weight Logged              │
│ │ │ Today ▼          │  │ 8:30 AM▼ │                │ │   183 lbs, Dec 11 8:30 AM    │
│ │ └──────────────────┘  └──────────┘                │ │                              │
│ │                                                     │ │                              │
│ │ Notes (optional):                                   │ │                              │
│ │ ┌──────────────────────────────────────────┐        │ │                              │
│ │ │ Add any notes about this measurement...  │        │ │                              │
│ │ │                                          │        │ │                              │
│ │ └──────────────────────────────────────────┘        │ │                              │
│ │                                                     │ │                              │
│ │              [Cancel]           [Save CLICK]        │ │                              │
│ └─────────────────────────────────────────────────────┘ │                              │
└─────────────────────────────────────────────────────────┴──────────────────────────────┘
```

### Metric Education Modal

```
┌─────────────────────────────────────────────────────────┬──────────────────────────────┐
│ MetricEducationCard                        [X CLOSE]    │ AvaChatPane                  │
│ ┌─────────────────────────────────────────────────────┐ │                              │
│ │ Understanding A1C                                   │ │ "A1C measures your average   │
│ │                                                     │ │  blood sugar over the past   │
│ │ What is A1C?                                        │ │  3 months. It's one of the   │
│ │ A1C is a blood test that measures your average     │ │  most important metrics for  │
│ │ blood glucose levels over the past 2-3 months.     │ │  managing diabetes."         │
│ │ It shows how well your diabetes management plan    │ │                              │
│ │ is working over time.                               │ │                              │
│ │                                                     │ │                              │
│ │ Why It Matters for You:                             │ │                              │
│ │ For people with diabetes, keeping A1C in your      │ │                              │
│ │ target range reduces risk of complications like    │ │                              │
│ │ vision problems, kidney disease, and nerve damage. │ │                              │
│ │                                                     │ │                              │
│ │ Target Ranges:                                      │ │                              │
│ │ • Non-diabetic: Below 5.7%                          │ │                              │
│ │ • Pre-diabetic: 5.7% - 6.4%                         │ │                              │
│ │ • Diabetic (target): Below 7.0%                     │ │                              │
│ │ • Your target: Below 7.0%                           │ │                              │
│ │                                                     │ │                              │
│ │ How to Improve Your A1C:                            │ │                              │
│ │ • Monitor and manage daily blood sugar levels      │ │                              │
│ │ • Follow your meal plan and eat regular meals      │ │                              │
│ │ • Stay physically active                            │ │                              │
│ │ • Take medications as prescribed                    │ │                              │
│ │ • Work with your dietitian on carb management      │ │                              │
│ │                                                     │ │                              │
│ │ Learn More:                                         │ │                              │
│ │ [Link: ADA Guide to A1C Testing]                   │ │                              │
│ │ [Link: Managing Your A1C - Video]                  │ │                              │
│ └─────────────────────────────────────────────────────┘ │                              │
└─────────────────────────────────────────────────────────┴──────────────────────────────┘
```

---

## Clarifying Questions

### Missing Information

1. **Metric Configuration:**

   - What are ALL the health metrics that could potentially be tracked across different care programs?
   - Which metrics are common to all programs vs. program-specific?
   - Are metrics ever added/removed from a patient's tracking list dynamically?

2. **Data Entry Validation:**

   - What are acceptable ranges for each metric (to flag unrealistic entries)?
   - Should the system warn about concerning values or auto-flag for provider review?
   - Can patients enter retroactive data (e.g., log yesterday's weight today)?

3. **Chart Configuration:**

   - What chart types are appropriate for different metrics (line chart, bar chart, scatter plot)?
   - Should charts show statistical elements like trend lines, averages, or ranges?
   - Can patients compare multiple metrics on one chart (e.g., weight vs. blood sugar)?

4. **Export Functionality:**

   - What export formats are needed (PDF, CSV, JSON)?
   - Should exports include charts/visualizations or just raw data?
   - Can providers request/generate exports on behalf of patients?

5. **Device Integration:**
   - How is device-synced data differentiated from manual entries in the UI?
   - If device and manual entry happen same day, which is displayed as "current value"?
   - Can patients edit or delete device-synced data?

### Ambiguous Requirements

1. **"Data visualization/charts":**

   - Does this mean one chart per metric (shown in detail view)?
   - Or an overview dashboard with all metrics on one screen?
   - Or the ability to create custom chart combinations?
   - **Proposed resolution:** One chart per metric in detail view + mini sparklines in cards on overview

2. **"Export health report":**

   - Is this a formatted report with interpretations and insights?
   - Or raw data export for personal records?
   - Or a provider-facing clinical report?
   - **Proposed resolution:** Start with simple data export (CSV/PDF of raw values), add formatted reports later

3. **Time Range Defaults:**

   - What time range should charts default to (7 days, 30 days, 90 days)?
   - Should default vary by metric type (daily vitals vs. quarterly labs)?
   - Can patients save preferred time range settings?

4. **Educational Content Trigger:**
   - Should "Learn More" always be visible or only for certain metrics?
   - When should Ava proactively explain metrics vs. wait for patient to ask?
   - Is educational content standardized or personalized to patient's condition?

### Edge Cases

1. **No Data Yet:**

   - What should display for a metric that's configured but never logged?
   - Should empty metrics show encouragement to log first entry?
   - Or hide until first data point exists?

2. **Data Gaps:**

   - How should charts handle missing data (gaps in logging)?
   - Connect data points across gaps or show discontinuous line?
   - Flag long gaps as noteworthy?

3. **Outlier Values:**

   - How should system handle extreme outliers (likely errors)?
   - Auto-flag for patient confirmation ("Did you mean 18.3 not 183?")?
   - Allow entry but mark as needing verification?

4. **Device Sync Conflicts:**

   - If patient manually logs weight at 8am, then device syncs weight from 8:05am, what happens?
   - Keep both as separate entries or replace manual with device?
   - How to handle patient preference?

5. **Metric Target Changes:**

   - If provider updates target value mid-program, how is this reflected?
   - Should old data be re-evaluated against new target?
   - Show target change history on chart?

6. **Deleted/Corrected Entries:**
   - Can patients delete incorrect entries or only add corrections?
   - If deletion allowed, is it hard delete or soft delete with audit trail?
   - How are corrections displayed in history?

### Design Decisions Needing Stakeholder Input

1. **Overview vs. Detail Layout:**

   - **Option A:** All metrics on one scrolling page with expandable detail sections
   - **Option B:** Summary cards with navigation to separate detail pages per metric
   - **Option C:** Tabbed interface switching between metrics
   - **Trade-offs:** A is simple but potentially long; B is organized but more clicks; C limits multimetric comparison

2. **Data Logging Flow:**

   - **Option A:** Always use modal for data entry (consistent UI)
   - **Option B:** Quick inline entry on metric cards + full modal for multiple metrics
   - **Option C:** Ava-first approach—encourage conversational logging over UI forms
   - **Trade-offs:** Consistency vs. efficiency vs. innovation

3. **Chart Interactivity:**

   - **Option A:** Static charts (simple, fast)
   - **Option B:** Interactive charts with hover tooltips and data point details
   - **Option C:** Full interaction: zoom, pan, select ranges, annotate
   - **Trade-offs:** Simplicity vs. user engagement vs. development complexity

4. **Educational Content Placement:**

   - **Option A:** Dedicated "Learn More" modal per metric
   - **Option B:** Inline expandable sections on metric cards
   - **Option C:** Ava-provided explanations in chat (no separate UI component)
   - **Option D:** Separate "Education" tab with all metric explanations
   - **Trade-offs:** Discoverability vs. distraction vs. centralization

5. **Data Source Visualization:**

   - **Option A:** Show device vs. manual in chart (different colors/markers)
   - **Option B:** Only show in data table/list, not in chart
   - **Option C:** Filter to show device-only or manual-only
   - **Trade-offs:** Data richness vs. visual complexity

6. **Mobile Layout:**
   - **Option A:** Same layout as desktop, just responsive
   - **Option B:** Simplified mobile view with fewer chart features
   - **Option C:** Hide Ava chat by default, focus on data entry ease
   - **Trade-offs:** Consistency vs. mobile-optimized UX

---

## Implementation Notes

### Accessibility Considerations

- All charts must have text alternatives describing trends and key data points
- Form inputs need clear labels and validation error messages
- Time-series data should be available in table format for screen readers
- Color cannot be sole indicator of trends (use icons, text, patterns)
- Keyboard navigation for all interactive chart elements
- Proper ARIA labels for data points and chart regions

### Performance Considerations

- Lazy load metric detail views and charts (don't load all data upfront)
- Consider pagination or virtual scrolling for long data history lists
- Cache chart data to avoid re-fetching on time range changes
- Optimize chart rendering for large datasets (>1000 data points)
- Debounce conversational data logging to avoid excessive API calls

### Security Considerations

- All data transmission must be encrypted (HTTPS/TLS)
- Validate all user input (prevent injection, enforce reasonable ranges)
- Rate limit data entry API to prevent abuse
- Export functionality should include patient authentication verification
- Audit all data access and modifications per CORE_PRINCIPLES.md

### Audit Trail Requirements

All health data actions must be logged per CORE_PRINCIPLES.md:

- **Data Logged:** Log who entered (patient, provider, device), metric, value, timestamp, context (manual/device/Ava-assisted)
- **Data Corrected:** Log previous value, new value, who made correction, timestamp, reason
- **Data Viewed:** Log who viewed which patient's data, when (especially for provider access)
- **Export Generated:** Log who exported, which metrics/date range, timestamp, format
- **Target Changed:** Log previous target, new target, who changed, timestamp

These audit entries should appear as collapsible blocks in the AvaChatPane activity timeline where relevant to patient.

---

## Future Enhancements (Out of Scope for Initial Implementation)

- Multi-metric correlation charts (e.g., weight vs. blood sugar over time)
- Predictive analytics and trend forecasting
- Photo logging for meals/wounds alongside numeric data
- Integration with Apple Health, Google Fit as data sources
- Custom metric creation for unique patient needs
- Goal setting and progress celebration animations
- Social features (compare progress with others, anonymized)
- Medication tracking integrated with health metrics
- Symptom journaling alongside vital signs
- Provider annotations visible in patient's timeline
- Automated insights ("Your blood sugar tends to be higher on weekends")
- Remind features for regular logging (patient-configurable)
- Voice logging via Ava without typing
