# HealthDataChart

**Type:** Data Visualization / Chart Component

**Purpose:** Interactive time-series line chart showing health metric values over time with optional target line and data source differentiation.

**Usage:** Used in MetricDetailView to display historical trends for a health metric. Shows data points, trend line, target line, and allows interactive exploration.

**Data Fields:**

- `data` (Array of DataPoint Objects) - Time-series data points
  - Each contains: `timestamp` (DateTime), `value` (Number), `source` (Enum: "device" | "manual")
  - Required
  - Minimum 2 points to render line chart
- `metricName` (String) - Name of metric being charted
  - Used for labels and accessibility
  - Required
- `unit` (String) - Unit of measure
  - Displayed on Y-axis
  - Required
- `targetValue` (Number, optional) - Goal line to display
  - Renders as horizontal dashed line
  - Optional
- `dateRange` (String) - Time range being displayed
  - Examples: "7d", "30d", "90d"
  - Used for X-axis formatting
  - Required
- `showDeviceVsManual` (Boolean) - Whether to differentiate data sources visually
  - If true, use different colors/markers for device vs manual entries
  - Default: false
  - Optional

**Visual Structure (SVG):**

```svg
<svg viewBox="0 0 660 250" xmlns="http://www.w3.org/2000/svg">
  <!-- Chart background -->
  <rect x="0" y="0" width="660" height="250" fill="#ffffff" stroke="#e5e7eb" stroke-width="1" rx="4"/>

  <!-- Y-axis labels -->
  <text x="35" y="35" font-size="11" fill="#6b7280" text-anchor="end">190</text>
  <text x="35" y="75" font-size="11" fill="#6b7280" text-anchor="end">185</text>
  <text x="35" y="115" font-size="11" fill="#6b7280" text-anchor="end">180</text>
  <text x="35" y="155" font-size="11" fill="#6b7280" text-anchor="end">175</text>
  <text x="35" y="195" font-size="11" fill="#6b7280" text-anchor="end">170</text>

  <!-- Grid lines (light) -->
  <line x1="45" y1="35" x2="640" y2="35" stroke="#f3f4f6" stroke-width="1"/>
  <line x1="45" y1="75" x2="640" y2="75" stroke="#f3f4f6" stroke-width="1"/>
  <line x1="45" y1="115" x2="640" y2="115" stroke="#f3f4f6" stroke-width="1"/>
  <line x1="45" y1="155" x2="640" y2="155" stroke="#f3f4f6" stroke-width="1"/>
  <line x1="45" y1="195" x2="640" y2="195" stroke="#f3f4f6" stroke-width="1"/>

  <!-- Target line (dashed) -->
  <line x1="45" y1="155" x2="640" y2="155" stroke="#f59e0b" stroke-width="2" stroke-dasharray="5,5"/>
  <text x="642" y="158" font-size="10" fill="#f59e0b">Target: 175 lbs</text>

  <!-- Data line -->
  <polyline points="80,45 150,55 220,60 290,65 360,75 430,85 500,95 570,105 640,115"
            stroke="#3b82f6" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Data points (circles) -->
  <circle cx="80" cy="45" r="5" fill="#3b82f6"/>
  <circle cx="150" cy="55" r="5" fill="#3b82f6"/>
  <circle cx="220" cy="60" r="5" fill="#3b82f6"/>
  <circle cx="290" cy="65" r="5" fill="#10b981"/> <!-- Device data point (green) -->
  <circle cx="360" cy="75" r="5" fill="#10b981"/>
  <circle cx="430" cy="85" r="5" fill="#3b82f6"/>
  <circle cx="500" cy="95" r="5" fill="#10b981"/>
  <circle cx="570" cy="105" r="5" fill="#3b82f6"/>
  <circle cx="640" cy="115" r="5" fill="#3b82f6"/>

  <!-- X-axis labels -->
  <text x="80" y="225" font-size="11" fill="#6b7280" text-anchor="middle">Dec 1</text>
  <text x="220" y="225" font-size="11" fill="#6b7280" text-anchor="middle">Dec 5</text>
  <text x="360" y="225" font-size="11" fill="#6b7280" text-anchor="middle">Dec 9</text>
  <text x="500" y="225" font-size="11" fill="#6b7280" text-anchor="middle">Dec 13</text>
  <text x="640" y="225" font-size="11" fill="#6b7280" text-anchor="middle">Dec 17</text>

  <!-- Legend (if showing device vs manual) -->
  <circle cx="500" cy="240" r="4" fill="#3b82f6"/>
  <text x="510" y="243" font-size="10" fill="#6b7280">Manual</text>
  <circle cx="570" cy="240" r="4" fill="#10b981"/>
  <text x="580" y="243" font-size="10" fill="#6b7280">Device</text>
</svg>
```

**States:**

- **Default:** Chart rendered with all data points
- **Loading:** Skeleton or spinner while fetching data
- **No data:** Empty state message
- **Hover on data point:** Tooltip showing exact value, date, and source
- **Interactive:** Zoom/pan capabilities (optional, future enhancement)

**Interactions:**

- **Hover on data point** → Show tooltip with detailed info
  - Example: "Dec 9, 2024 8:30 AM: 183 lbs (Device: Withings)"
- **Click data point** → Optionally highlight or show additional details
- **Optional: Zoom/pan** → Allow closer inspection of data (future enhancement)
- **Optional: Select range** → Highlight specific time period (future enhancement)

**Accessibility:**

- **ARIA labels:**
  - `role="img"` with comprehensive `aria-label` describing the chart
  - Example: "Weight trend chart showing decrease from 190 pounds to 183 pounds over 30 days, currently 8 pounds above target of 175 pounds"
  - Data also available in table format via `aria-describedby`
- **Keyboard navigation:**
  - If interactive, data points navigable with arrow keys
  - Tab to chart, then arrow keys to explore data points
- **Screen reader support:**
  - Chart summary announced
  - Data available in accessible table format
  - Trend direction announced
  - Relationship to target announced
- **Visual considerations:**
  - Color not sole indicator (use shapes/patterns for device vs manual)
  - Sufficient contrast for all chart elements
  - Lines and points clearly visible
  - Tooltip text readable
  - Target line visually distinct from data line
  - Legend clear if showing multiple data sources

**Technical Considerations:**

- Chart library should support responsive sizing
- Optimize for large datasets (>100 points)
- Graceful degradation if chart library fails
- Mobile-friendly touch interactions
- Print-friendly styling
