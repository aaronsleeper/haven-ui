# ActivityTimelinePreview

**Type:** List / Timeline Component

**Purpose:** Displays a chronological preview of recent patient interactions with the system, showing recent activities like data logged, appointments completed, and messages received.

**Usage:** Used on the Home Dashboard to give patients a quick view of their recent activity history. Each activity item is clickable to navigate to the detailed view.

**Data Fields:**

- `activities` (Array of Activity Objects) - List of recent activities
  - Each activity contains:
    - `activityType` (String) - Type of activity
      - Examples: "Appointment", "Message", "Health Data Log", "Meal Delivery"
    - `timestamp` (DateTime) - When activity occurred
      - Format: Relative or absolute (e.g., "Dec 9", "Yesterday", "2 hours ago")
    - `description` (String) - Brief description of activity
      - Examples: "Logged weight", "Message from Care Team", "Completed appointment"
    - `detailLink` (String) - URL to detailed view
      - Varies by activity type
    - `icon` (String/Component, optional) - Visual indicator for activity type
  - Required
- `maxItems` (Number) - Maximum number of activities to display
  - Default: 5-7 recent items
  - Optional

**Visual Structure (SVG):**

```svg
<svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
  <!-- Container -->
  <rect x="0" y="0" width="500" height="200" fill="#ffffff" stroke="#e5e7eb" stroke-width="1" rx="8"/>

  <!-- Header -->
  <text x="16" y="28" font-size="16" font-weight="600" fill="#1a1a1a">Recent Activity</text>

  <!-- Timeline line -->
  <line x1="30" y1="50" x2="30" y2="180" stroke="#d1d5db" stroke-width="2"/>

  <!-- Activity 1 -->
  <circle cx="30" cy="60" r="6" fill="#3b82f6"/>
  <text x="50" y="58" font-size="12" fill="#6b7280">Dec 9</text>
  <text x="50" y="72" font-size="14" fill="#1a1a1a">Logged weight</text>

  <!-- Activity 2 -->
  <circle cx="30" cy="100" r="6" fill="#10b981"/>
  <text x="50" y="98" font-size="12" fill="#6b7280">Dec 8</text>
  <text x="50" y="112" font-size="14" fill="#1a1a1a">Message from Care Team</text>

  <!-- Activity 3 -->
  <circle cx="30" cy="140" r="6" fill="#8b5cf6"/>
  <text x="50" y="138" font-size="12" fill="#6b7280">Dec 7</text>
  <text x="50" y="152" font-size="14" fill="#1a1a1a">Completed appointment</text>

  <!-- View more link -->
  <text x="16" y="185" font-size="12" fill="#3b82f6" text-decoration="underline">View full timeline</text>
</svg>
```

**States:**

- **Default:** List of activities displayed chronologically
- **Hover (individual item):** Background highlight, cursor pointer
- **Active/Clicked:** Navigate to activity detail view
- **Loading:** Skeleton loader while fetching activities
- **Empty State:** "No recent activity" message with helpful prompt

**Interactions:**

- **Click on activity item** → Navigate to detailed view of that activity (varies by type)
  - Health data log → Health Data screen with that metric
  - Message → Messages screen with that message open
  - Appointment → Appointments screen with that appointment
  - Meal delivery → Meal order details
- **Click "View full timeline"** → Navigate to complete activity history (if available)
- **Hover** → Show additional details or tooltip

**Accessibility:**

- **ARIA labels:**
  - `role="list"` for the timeline container
  - `role="listitem"` for each activity
  - Each item link has descriptive `aria-label`: "View details of weight logged on December 9"
- **Keyboard navigation:**
  - All activity items focusable with Tab key
  - Activatable with Enter
  - Skip to "View full timeline" link
- **Screen reader support:**
  - Chronological order announced clearly
  - Activity type and timestamp read together
  - Clear indication of interactive elements
- **Visual considerations:**
  - Color-coded activity types also use icons
  - Sufficient contrast for all text
  - Timeline structure clear with visual and semantic markup
  - Touch targets adequate for mobile
