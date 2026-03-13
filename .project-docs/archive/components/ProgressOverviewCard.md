# ProgressOverviewCard

**Type:** Card / Data Display Component

**Purpose:** Displays a summary of an individual health metric showing current value, target, trend direction, and when it was last updated. Part of the patient's progress overview on the Home Dashboard.

**Usage:** Used on the Home Dashboard to show key health metrics specific to the patient's care program (e.g., Weight, A1C, Blood Pressure). Multiple cards are displayed together to give an at-a-glance view of health progress.

**Data Fields:**

- `metricName` (String) - Name of the health metric
  - Examples: "Weight", "A1C", "Blood Pressure", "Blood Sugar"
  - Required
- `currentValue` (Number or String) - Most recent measured value
  - Format: Depends on metric (e.g., "185", "6.8", "120/80")
  - Required
- `targetValue` (Number or String) - Goal value per care plan
  - Format: Matches currentValue format
  - Optional (some metrics may not have targets)
- `trendDirection` (Enum: "up" | "down" | "stable") - Direction of recent trend
  - Visual representation: ↑ up, ↓ down, ≈ stable
  - Optional
- `lastUpdated` (DateTime) - When this metric was last recorded
  - Format: Relative time (e.g., "2 hours ago", "Yesterday", "Dec 9")
  - Required
- `unitOfMeasure` (String) - Display unit
  - Examples: "lbs", "%", "mmHg", "mg/dL"
  - Required

**Visual Structure (SVG):**

```svg
<svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg">
  <!-- Card background -->
  <rect x="0" y="0" width="300" height="180" fill="#ffffff" stroke="#e0e0e0" stroke-width="1" rx="8"/>

  <!-- Metric name -->
  <text x="16" y="30" font-size="14" font-weight="600" fill="#1a1a1a">Weight</text>

  <!-- Current value -->
  <text x="16" y="65" font-size="28" font-weight="700" fill="#1a1a1a">183 lbs</text>

  <!-- Target value -->
  <text x="16" y="90" font-size="12" fill="#666666">Target: 175 lbs</text>

  <!-- Trend indicator -->
  <text x="16" y="115" font-size="12" fill="#10b981">↓ Down 2 lbs</text>

  <!-- Last updated -->
  <text x="16" y="140" font-size="11" fill="#999999">Last updated: Today at 8:30 AM</text>

  <!-- Click indicator -->
  <rect x="0" y="160" width="300" height="20" fill="#f9fafb"/>
  <text x="150" y="174" font-size="10" fill="#6b7280" text-anchor="middle">Click for details</text>
</svg>
```

**States:**

- **Default:** Shows metric data with normal styling
- **Hover:** Subtle background color change, cursor pointer, slight elevation/shadow
- **Active/Clicked:** Navigates to detailed metric view or opens data logging
- **Loading:** Skeleton loader or spinner while fetching metric data
- **No Data:** Shows "No data yet" message with prompt to log first entry
- **Concerning Trend:** Highlighted warning color if trend is problematic (e.g., red for worsening)

**Interactions:**

- **Click on card** → Navigate to detailed metric history/trend view OR open data logging modal (design decision pending)
- **Hover** → Show additional context (e.g., tooltip with more trend details)

**Accessibility:**

- **ARIA labels:**
  - `role="button"` or `role="link"` if clickable
  - `aria-label="Weight metric: 183 pounds, down 2 pounds, target 175 pounds, last updated today at 8:30 AM"`
- **Keyboard navigation:**
  - Focusable with Tab key
  - Activatable with Enter or Space
- **Screen reader support:**
  - All text content properly structured
  - Trend direction announced clearly ("decreasing" not just arrow icon)
  - Color not sole indicator of trend (use icons and text)
- **Visual considerations:**
  - Sufficient color contrast for all text
  - Trend indicators use both color AND icons
  - Font sizes readable at default zoom levels
