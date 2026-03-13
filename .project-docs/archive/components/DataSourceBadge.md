# DataSourceBadge

**Type:** Badge / Indicator Component

**Purpose:** Small visual indicator showing whether health data came from a connected device, manual entry, or both.

**Usage:** Displayed on HealthMetricCard and MetricDetailView to indicate the source of the most recent data or overall data collection method for a metric.

**Data Fields:**

- `source` (Enum: "device" | "manual" | "both") - Data source type
  - Required
- `deviceName` (String, optional) - If from device, which device
  - Examples: "Withings Scale", "Apple Watch", "Dexcom CGM"
  - Displayed in tooltip or extended version
  - Optional

**Visual Structure (SVG):**

```svg
<svg viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
  <!-- Example 1: Device only -->
  <rect x="10" y="10" width="110" height="24" fill="#dcfce7" stroke="#86efac" stroke-width="1" rx="12"/>
  <circle cx="22" cy="22" r="4" fill="#16a34a"/>
  <text x="30" y="26" font-size="11" font-weight="500" fill="#15803d">Device</text>

  <!-- Example 2: Manual only -->
  <rect x="140" y="10" width="110" height="24" fill="#dbeafe" stroke="#93c5fd" stroke-width="1" rx="12"/>
  <circle cx="152" cy="22" r="4" fill="#2563eb"/>
  <text x="160" y="26" font-size="11" font-weight="500" fill="#1e40af">Manual</text>

  <!-- Example 3: Both -->
  <rect x="270" y="10" width="120" height="24" fill="#fef3c7" stroke="#fcd34d" stroke-width="1" rx="12"/>
  <circle cx="282" cy="22" r="4" fill="#16a34a"/>
  <circle cx="290" cy="22" r="4" fill="#2563eb"/>
  <text x="298" y="26" font-size="11" font-weight="500" fill="#92400e">Device + Manual</text>

  <!-- Example 4: With device name (extended) -->
  <rect x="10" y="50" width="180" height="24" fill="#dcfce7" stroke="#86efac" stroke-width="1" rx="12"/>
  <circle cx="22" cy="62" r="4" fill="#16a34a"/>
  <text x="30" y="66" font-size="11" font-weight="500" fill="#15803d">Device: Withings Scale</text>
</svg>
```

**States:**

- **Default:** Badge displayed with appropriate source indicator
- **Hover:** Tooltip showing device name if available
- **Syncing:** Optional loading indicator if device sync in progress

**Interactions:**

- **Hover** → Show tooltip with device name or additional details
  - Example: "Data from Withings Scale, last synced 5 minutes ago"
- **Click** (optional) → Navigate to device settings or sync details

**Accessibility:**

- **ARIA labels:**
  - `role="status"` or `role="img"`
  - `aria-label` describing the source clearly
  - Examples:
    - "Data from connected device"
    - "Manually entered data"
    - "Data from both device and manual entry"
    - "Data from Withings Scale"
- **Keyboard navigation:**
  - Not focusable unless clickable
  - If clickable, focusable with Tab
- **Screen reader support:**
  - Source announced when badge is encountered
  - Device name announced if available
- **Visual considerations:**
  - Color not sole indicator (use icons/text)
  - Sufficient contrast between badge background and text
  - Icon clearly distinguishable
  - Compact size doesn't compromise readability

**Color Coding:**

- **Device:** Green (`#dcfce7` background, `#15803d` text)
- **Manual:** Blue (`#dbeafe` background, `#1e40af` text)
- **Both:** Yellow/amber (`#fef3c7` background, `#92400e` text)

These colors should be configurable based on design system.
