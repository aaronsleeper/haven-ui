# HealthMetricCard

**Type:** Card / Data Display Component

**Purpose:** Summary card showing current value, trend, and mini chart for a single health metric on the Health Data screen.

**Usage:** Used within HealthMetricsList to display individual metrics. More detailed than ProgressOverviewCard, includes data source indicator, action buttons, and sparkline chart.

**Data Fields:**

- `metricId` (String) - Unique identifier
  - Required
- `metricName` (String) - Display name
  - Examples: "Weight", "Blood Pressure", "Blood Sugar", "A1C"
  - Required
- `currentValue` (Number or String) - Most recent measurement
  - Format: Depends on metric (e.g., "183", "6.8", "120/80")
  - Required
- `unit` (String) - Unit of measure
  - Examples: "lbs", "mmHg", "mg/dL", "%"
  - Required
- `targetValue` (Number or String, optional) - Goal/target per care plan
  - Format: Matches currentValue format or range "80-130"
  - Optional
- `trendDirection` (Enum: "improving" | "stable" | "worsening", optional) - Recent trend
  - Visual: ↓ improving, ≈ stable, ↑ worsening (context-dependent)
  - Optional
- `lastLoggedDate` (DateTime) - When last measurement was taken
  - Format: Relative ("Today at 8:30 AM", "Yesterday", "4 days ago")
  - Required
- `dataSource` (Enum: "manual" | "device" | "both") - How data is collected
  - Displayed via DataSourceBadge component
  - Required
- `miniChartData` (Array of Numbers) - Last 7-30 days of values
  - Used to render sparkline chart
  - Optional (if no historical data)

**Visual Structure (SVG):**

```svg
<svg viewBox="0 0 600" height="140" xmlns="http://www.w3.org/2000/svg">
  <!-- Card background -->
  <rect x="0" y="0" width="600" height="140" fill="#ffffff" stroke="#e5e7eb" stroke-width="1" rx="8"/>

  <!-- Metric name and data source badge -->
  <text x="20" y="28" font-size="15" font-weight="600" fill="#1a1a1a">Weight</text>
  <rect x="80" y="16" width="80" height="20" fill="#dbeafe" rx="4"/>
  <text x="120" y="29" font-size="10" fill="#1e40af" text-anchor="middle">Device + Manual</text>

  <!-- Current value and target -->
  <text x="20" y="58" font-size="20" font-weight="700" fill="#1a1a1a">183 lbs</text>
  <text x="110" y="58" font-size="13" fill="#6b7280">(Target: 175 lbs)</text>

  <!-- Trend indicator -->
  <text x="20" y="80" font-size="12" fill="#10b981">↓ Down 2 lbs from last week</text>

  <!-- Last logged -->
  <text x="20" y="100" font-size="11" fill="#9ca3af">Last logged: Today at 8:30 AM</text>

  <!-- Mini sparkline chart -->
  <polyline points="350,50 370,55 390,52 410,48 430,45 450,42 470,38"
            stroke="#3b82f6" stroke-width="2" fill="none"/>
  <text x="490" y="50" font-size="10" fill="#6b7280">7 days</text>

  <!-- Action buttons -->
  <rect x="440" y="105" width="60" height="28" fill="transparent" stroke="#3b82f6" stroke-width="1" rx="4"/>
  <text x="470" y="123" font-size="12" fill="#3b82f6" text-anchor="middle">Log</text>

  <rect x="510" y="105" width="70" height="28" fill="#3b82f6" rx="4"/>
  <text x="545" y="123" font-size="12" fill="#ffffff" text-anchor="middle">Details</text>
</svg>
```

**States:**

- **Default:** Shows all metric data with normal styling
- **Hover:** Subtle background change, cursor pointer on card or buttons
- **Active/Clicked:** Navigate to MetricDetailView or open LogDataModal
- **Loading:** Skeleton loader while fetching metric data
- **No Data:** Shows "No data logged yet" with prompt to log first entry
- **Concerning Value:** Highlighted warning if value outside target range
- **Device Syncing:** Loading indicator on data source badge if sync in progress

**Interactions:**

- **Click card body** → Navigate to MetricDetailView for this metric
- **Click "Log" button** → Open LogDataModal pre-filled for this metric
- **Click "Details" button** → Navigate to MetricDetailView
- **Click "Learn More" icon** (if present) → Open MetricEducationCard modal
- **Hover on sparkline** → Show tooltip with recent values (optional enhancement)

**Accessibility:**

- **ARIA labels:**
  - Card has `role="article"` or `role="region"`
  - `aria-label="Weight metric: 183 pounds, target 175 pounds, down 2 pounds from last week, last logged today at 8:30 AM"`
  - Buttons have clear labels
  - Sparkline has text alternative describing trend
- **Keyboard navigation:**
  - Card focusable with Tab
  - Buttons focusable and activatable
  - Logical tab order (card → Log → Details)
- **Screen reader support:**
  - All data announced in logical order
  - Trend direction announced clearly
  - Data source announced
  - Buttons announced with purpose
- **Visual considerations:**
  - Trend indicators use both color AND icons
  - Sufficient color contrast for all text
  - Touch targets adequate size (44px minimum)
  - Sparkline supplements data, doesn't replace it
  - Clear visual hierarchy between elements
