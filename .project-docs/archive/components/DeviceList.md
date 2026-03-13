# DeviceList

**Type:** List Container

**Purpose:** Container component for displaying all connected health monitoring devices with their sync status

**Usage:** Used on the Device Integration screen to organize and display multiple DeviceCard components

---

## Data Fields

- `connectedDevices` (Array<Device>) - Array of device objects to display
  - Required
- `onDeviceClick` (Function) - Handler called when a device card is clicked
  - Parameters: deviceId (String)
  - Required

---

## Visual Structure (SVG)

```svg
<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Container -->
  <rect x="0" y="0" width="600" height="400" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>

  <!-- Section Header -->
  <text x="20" y="30" font-size="14" font-weight="600" fill="#111827">CONNECTED DEVICES</text>

  <!-- Device Card 1 -->
  <rect x="20" y="50" width="560" height="100" fill="#f9fafb" stroke="#e5e7eb" stroke-width="1" rx="8"/>
  <circle cx="50" cy="90" r="20" fill="#3b82f6"/>
  <text x="90" y="85" font-size="16" font-weight="600" fill="#111827">Withings Body+</text>
  <text x="90" y="105" font-size="14" fill="#6b7280">Smart Scale</text>
  <rect x="450" y="75" width="100" height="30" fill="#10b981" rx="4"/>
  <text x="470" y="95" font-size="12" fill="#ffffff">Active ✓</text>

  <!-- Device Card 2 -->
  <rect x="20" y="170" width="560" height="100" fill="#f9fafb" stroke="#e5e7eb" stroke-width="1" rx="8"/>
  <circle cx="50" cy="210" r="20" fill="#8b5cf6"/>
  <text x="90" y="205" font-size="16" font-weight="600" fill="#111827">Fitbit Charge 5</text>
  <text x="90" y="225" font-size="14" fill="#6b7280">Fitness Tracker</text>
  <rect x="450" y="195" width="100" height="30" fill="#ef4444" rx="4"/>
  <text x="470" y="215" font-size="12" fill="#ffffff">Error ⚠</text>

  <!-- Device Card 3 -->
  <rect x="20" y="290" width="560" height="100" fill="#f9fafb" stroke="#e5e7eb" stroke-width="1" rx="8"/>
  <circle cx="50" cy="330" r="20" fill="#f59e0b"/>
  <text x="90" y="325" font-size="16" font-weight="600" fill="#111827">Omron Evolv</text>
  <text x="90" y="345" font-size="14" fill="#6b7280">Blood Pressure Monitor</text>
  <rect x="450" y="315" width="100" height="30" fill="#10b981" rx="4"/>
  <text x="470" y="335" font-size="12" fill="#ffffff">Active ✓</text>
</svg>
```

---

## States

- **Default:** Displays list of connected devices
- **Loading:** Shows skeleton placeholders while fetching device data
- **Empty:** Shows EmptyState component when no devices connected
- **Error:** Displays error message if devices cannot be loaded

---

## Interactions

- **Click device card** → Calls onDeviceClick handler with deviceId
- **Scroll** → List is scrollable if many devices are connected

---

## Accessibility

- **ARIA Labels:**
  - `role="list"` on container
  - `role="listitem"` on each DeviceCard
  - `aria-label="Connected health devices"`
- **Keyboard Navigation:**
  - Tab through device cards
  - Enter/Space to activate device card click
- **Screen Reader Support:**
  - Announce number of devices: "3 connected devices"
  - Each device announces name, type, and status

---

## Notes

- Displays section header "CONNECTED DEVICES" above the list
- Devices are ordered by most recently synced first
- List should support pagination or virtual scrolling for patients with many devices
- Wraps EmptyState component when connectedDevices array is empty
