# DeviceCard

**Type:** Card / List Item

**Purpose:** Displays individual connected device information with sync status at a glance

**Usage:** Used within DeviceList to show preview of each connected health monitoring device

---

## Data Fields

- `deviceId` (String) - Unique identifier for the device
  - Required
- `deviceType` (Enum) - Type of device
  - Values: "Smart Scale" | "Fitness Tracker" | "Blood Pressure Monitor" | "CGM" | "Heart Rate Monitor" | "Sleep Tracker" | "Smart Watch"
  - Required
- `deviceName` (String) - Display name of the device (e.g., "Withings Body+")
  - Required
- `manufacturer` (String) - Device manufacturer name
  - Required
- `syncStatus` (Enum) - Current sync status
  - Values: "Active" | "Syncing" | "Error" | "Disconnected"
  - Required
- `lastSyncTime` (DateTime) - Timestamp of last successful sync
  - Format: Relative for recent ("2 hours ago", "Just now")
  - Format: Full for older than 24h: "Dec 9 at 3:45 PM"
  - Required
- `dataTypes` (Array<String>) - Data types this device provides
  - Examples: ["weight", "body_fat_percentage", "bmi"], ["steps", "heart_rate", "sleep"]
  - Required

---

## Visual Structure (SVG)

```svg
<svg viewBox="0 0 560 100" xmlns="http://www.w3.org/2000/svg">
  <!-- Card Container -->
  <rect x="0" y="0" width="560" height="100" fill="#f9fafb" stroke="#e5e7eb" stroke-width="1" rx="8"/>

  <!-- Device Icon -->
  <circle cx="30" cy="40" r="20" fill="#3b82f6"/>
  <text x="20" y="45" font-size="20" fill="#ffffff">⚖</text>

  <!-- Device Name & Type -->
  <text x="70" y="35" font-size="16" font-weight="600" fill="#111827">Withings Body+</text>
  <text x="70" y="55" font-size="14" fill="#6b7280">Smart Scale</text>

  <!-- Sync Status Badge -->
  <rect x="430" y="25" width="110" height="30" fill="#10b981" rx="4"/>
  <text x="450" y="45" font-size="12" font-weight="600" fill="#ffffff">Active ✓</text>

  <!-- Last Sync Time -->
  <text x="70" y="75" font-size="12" fill="#9ca3af">Last synced: 2 hours ago</text>

  <!-- Data Types -->
  <text x="70" y="92" font-size="11" fill="#6b7280">Data: Weight, Body Fat %, BMI, Muscle Mass</text>

  <!-- Hover Indication -->
  <rect x="0" y="0" width="560" height="100" fill="none" stroke="#3b82f6" stroke-width="2" rx="8" opacity="0">
    <animate attributeName="opacity" begin="mouseover" dur="0.2s" fill="freeze" to="1"/>
    <animate attributeName="opacity" begin="mouseout" dur="0.2s" fill="freeze" to="0"/>
  </rect>
</svg>
```

---

## States

- **Default:** Shows device info with current sync status
- **Hover:** Border highlight and slight elevation to indicate clickability
- **Active/Selected:** Distinct visual treatment if card represents currently viewing device
- **Syncing:** Shows animated sync indicator, status badge displays "Syncing..."
- **Error:** Status badge displays "Error ⚠" in red/orange color
- **Disconnected:** Greyed out appearance, status badge displays "Disconnected"

---

## Interactions

- **Click anywhere on card** → Opens DeviceDetailsModal with full device information
- **Hover** → Shows visual feedback (border highlight, subtle elevation)

---

## Accessibility

- **ARIA Labels:**
  - `role="button"` since card is clickable
  - `aria-label="[Device Name], [Device Type], Status: [Status], Last synced [Time]"`
  - Example: `aria-label="Withings Body+, Smart Scale, Status: Active, Last synced 2 hours ago"`
- **Keyboard Navigation:**
  - Focusable with Tab
  - Activatable with Enter or Space
  - Focus visible indicator
- **Screen Reader Support:**
  - Announces device name, type, sync status, and last sync time
  - Status changes announced dynamically

---

## Visual Design Notes

### Device Type Icons

Each device type should have a distinct icon:
- **Smart Scale:** ⚖️ or scale icon
- **Fitness Tracker:** 📱 or wristband icon
- **Blood Pressure Monitor:** 🩺 or heart monitor icon
- **CGM:** 🩸 or medical sensor icon
- **Heart Rate Monitor:** ❤️ or heart icon
- **Sleep Tracker:** 🌙 or bed icon
- **Smart Watch:** ⌚ or watch icon

### Sync Status Colors

- **Active:** Green (#10b981) with checkmark ✓
- **Syncing:** Blue (#3b82f6) with animated spinner
- **Error:** Red/Orange (#ef4444 or #f59e0b) with warning ⚠
- **Disconnected:** Gray (#6b7280) with disconnect icon

### Data Types Display

- Show up to 4 data types in abbreviated format
- If more than 4, show first 3 and "+X more"
- Example: "Weight, Body Fat %, BMI, +2 more"

---

## Notes

- Card should have subtle shadow and rounded corners
- Hover state should provide clear affordance that card is clickable
- Error state should be visually prominent but not alarming
- Last sync time updates in real-time (relative time format)
- Consider truncating very long device names with ellipsis
