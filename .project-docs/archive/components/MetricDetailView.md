# MetricDetailView

**Type:** Page / Detail View Component

**Purpose:** Expanded view showing full historical chart, detailed data entries, and actions for a single health metric.

**Usage:** Displayed when a patient clicks on a HealthMetricCard to see complete history and trend analysis for that metric. May be a full page or modal overlay.

**Data Fields:**

- `metric` (Object) - Full metric information
  - Includes all fields from HealthMetricCard
  - Required
- `timeSeriesData` (Array of DataPoint Objects) - Complete historical data
  - Each point contains: `timestamp`, `value`, `source`, `notes`
  - Used for chart and recent entries list
  - Required
- `dateRangeFilter` (Enum: "7d" | "30d" | "90d" | "1y" | "all") - Selected time range
  - Controls what data is displayed in chart
  - Default: "30d"
  - Required
- `onLogData` (Function) - Handler to open LogDataModal pre-filled for this metric
  - Required
- `onLearnMore` (Function) - Handler to open MetricEducationCard
  - Optional
- `onBack` (Function) - Handler to return to Health Data list view
  - Required if full-page view

**Visual Structure (SVG):**

```svg
<svg viewBox="0 0 700" height="600" xmlns="http://www.w3.org/2000/svg">
  <!-- Header -->
  <text x="20" y="30" font-size="18" font-weight="600" fill="#1a1a1a">Weight Tracking</text>
  <text x="650" y="30" font-size="14" fill="#3b82f6" text-anchor="end">← Back</text>

  <!-- Current status -->
  <text x="20" y="65" font-size="14" fill="#4b5563">Current: 183 lbs</text>
  <text x="150" y="65" font-size="14" fill="#4b5563">Target: 175 lbs</text>

  <!-- Data source badge -->
  <rect x="20" y="75" width="100" height="20" fill="#dbeafe" rx="4"/>
  <text x="70" y="88" font-size="10" fill="#1e40af" text-anchor="middle">Device + Manual</text>

  <!-- Time range filters -->
  <rect x="20" y="110" width="40" height="28" fill="#e5e7eb" rx="4"/>
  <text x="40" y="129" font-size="12" fill="#6b7280" text-anchor="middle">7d</text>

  <rect x="70" y="110" width="40" height="28" fill="#3b82f6" rx="4"/>
  <text x="90" y="129" font-size="12" fill="#ffffff" text-anchor="middle">30d</text>

  <rect x="120" y="110" width="40" height="28" fill="#e5e7eb" rx="4"/>
  <text x="140" y="129" font-size="12" fill="#6b7280" text-anchor="middle">90d</text>

  <rect x="170" y="110" width="40" height="28" fill="#e5e7eb" rx="4"/>
  <text x="190" y="129" font-size="12" fill="#6b7280" text-anchor="middle">1y</text>

  <rect x="220" y="110" width="40" height="28" fill="#e5e7eb" rx="4"/>
  <text x="240" y="129" font-size="12" fill="#6b7280" text-anchor="middle">All</text>

  <!-- Chart area -->
  <rect x="20" y="155" width="660" height="250" fill="#ffffff" stroke="#e5e7eb" rx="4"/>
  <text x="350" y="280" font-size="12" fill="#9ca3af" text-anchor="middle">[HealthDataChart Component]</text>

  <!-- Recent entries section -->
  <text x="20" y="435" font-size="14" font-weight="600" fill="#1a1a1a">RECENT ENTRIES</text>

  <!-- Entry list -->
  <rect x="20" y="450" width="660" height="40" fill="#f9fafb" stroke="#e5e7eb"/>
  <text x="30" y="473" font-size="12" fill="#1a1a1a">Today 8:30 AM</text>
  <text x="200" y="473" font-size="12" fill="#1a1a1a">183 lbs</text>
  <text x="300" y="473" font-size="11" fill="#6b7280">[Device: Withings]</text>

  <rect x="20" y="495" width="660" height="40" fill="#ffffff" stroke="#e5e7eb"/>
  <text x="30" y="518" font-size="12" fill="#1a1a1a">Yesterday 8:15 AM</text>
  <text x="200" y="518" font-size="12" fill="#1a1a1a">185 lbs</text>
  <text x="300" y="518" font-size="11" fill="#6b7280">[Device: Withings]</text>

  <!-- Action buttons -->
  <rect x="20" y="555" width="150" height="36" fill="#3b82f6" rx="6"/>
  <text x="95" y="578" font-size="14" fill="#ffffff" text-anchor="middle">Log New Weight</text>

  <rect x="185" y="555" width="120" height="36" fill="transparent" stroke="#3b82f6" stroke-width="2" rx="6"/>
  <text x="245" y="578" font-size="14" fill="#3b82f6" text-anchor="middle">Learn More</text>
</svg>
```

**States:**

- **Default:** Full chart and recent entries displayed
- **Loading:** Skeleton loader for chart while fetching data
- **Time range changing:** Loading indicator on chart during data refresh
- **No data:** Empty state encouraging first data entry
- **Data loaded:** Chart and entries displayed

**Interactions:**

- **Click time range filter** → Update chart to show selected time period
- **Click "Log New [Metric]"** → Open LogDataModal pre-filled for this metric
- **Click "Learn More"** → Open MetricEducationCard with educational content
- **Click "Back"** → Return to Health Data list view
- **Hover on chart data point** → Show tooltip with exact value and date (handled by HealthDataChart)
- **Click on entry** → Optionally expand to show notes or edit (future enhancement)

**Accessibility:**

- **ARIA labels:**
  - `role="region"` with `aria-label="Weight metric detail view"`
  - Time range filters are radio button group with `role="radiogroup"`
  - Chart has text alternative describing trend
  - Entry list has `role="table"` or `role="list"` with appropriate structure
- **Keyboard navigation:**
  - Back button focusable
  - Time range filters navigable with arrow keys
  - Action buttons focusable and activatable
  - Entry list navigable
- **Screen reader support:**
  - Current values announced
  - Selected time range announced
  - Chart data available in table format
  - Recent entries announced with all details
- **Visual considerations:**
  - Clear visual hierarchy
  - Selected time range clearly indicated
  - Chart accessible colors
  - Entry list scannable
  - Sufficient spacing between interactive elements
