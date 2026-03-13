# DeviceDetailsModal

**Type:** Modal

**Purpose:** Displays comprehensive information about a connected device and provides device management actions

**Usage:** Opens when a patient clicks on a DeviceCard to view full details and manage the device

---

## Data Fields

- `device` (Object) - Full device information
  - `deviceId` (String) - Required
  - `deviceType` (String) - Required
  - `deviceName` (String) - Required
  - `manufacturer` (String) - Required
  - `model` (String, optional) - Device model
  - `syncStatus` (Enum) - Required
  - `lastSyncTime` (DateTime) - Required
  - `connectedAt` (DateTime) - When device was first connected - Required
  - `dataTypes` (Array<String>) - Data types provided - Required
  - `authorizationStatus` (Enum) - "Active" | "Expired" | "Revoked" - Required
  - `syncFrequency` (String) - How often device syncs - Optional
  - `dataSyncedCount` (Number) - Total data points synced - Optional
  - `batteryLevel` (Number, optional) - Device battery 0-100
  - `firmwareVersion` (String, optional) - Device firmware version
- `syncHistory` (Array<Object>) - Recent sync events
  - `syncTime` (DateTime) - Required
  - `syncStatus` (Enum: "Success" | "Failed" | "Partial") - Required
  - `dataSynced` (Number, optional) - Data points in this sync
  - `errorMessage` (String, optional) - Error details if failed
  - Required
- `onDisconnect` (Function) - Handler to disconnect device
  - Parameters: deviceId (String)
  - Required
- `onReauthorize` (Function) - Handler to re-authorize connection
  - Parameters: deviceId (String)
  - Required
- `onClose` (Function) - Handler to close modal
  - Required

---

## Visual Structure (SVG)

```svg
<svg viewBox="0 0 600 700" xmlns="http://www.w3.org/2000/svg">
  <!-- Modal Container -->
  <rect x="0" y="0" width="600" height="700" fill="#ffffff" stroke="#e5e7eb" stroke-width="1" rx="12"/>

  <!-- Header -->
  <text x="30" y="40" font-size="20" font-weight="700" fill="#111827">Device Details</text>
  <circle cx="570" cy="30" r="15" fill="#f3f4f6"/>
  <text x="565" y="35" font-size="16" fill="#6b7280">✕</text>

  <!-- Device Icon & Info -->
  <circle cx="60" cy="100" r="30" fill="#3b82f6"/>
  <text x="45" y="110" font-size="24" fill="#ffffff">⚖</text>
  <text x="110" y="95" font-size="18" font-weight="600" fill="#111827">Withings Body+</text>
  <text x="110" y="115" font-size="14" fill="#6b7280">Smart Scale</text>

  <!-- Manufacturer & Connection Date -->
  <text x="30" y="155" font-size="13" fill="#6b7280">Manufacturer: Withings</text>
  <text x="30" y="175" font-size="13" fill="#6b7280">Connected: Dec 1, 2025</text>

  <!-- Status Badge -->
  <rect x="30" y="190" width="120" height="32" fill="#10b981" rx="4"/>
  <text x="50" y="211" font-size="12" font-weight="600" fill="#ffffff">Active ✓</text>
  <text x="160" y="211" font-size="13" fill="#6b7280">Last Sync: 2 hours ago</text>

  <!-- Divider -->
  <line x1="30" y1="240" x2="570" y2="240" stroke="#e5e7eb" stroke-width="1"/>

  <!-- Data Types Section -->
  <text x="30" y="270" font-size="14" font-weight="600" fill="#111827">DATA TYPES:</text>
  <text x="30" y="295" font-size="13" fill="#4b5563">• Steps</text>
  <text x="30" y="315" font-size="13" fill="#4b5563">• Heart Rate</text>
  <text x="30" y="335" font-size="13" fill="#4b5563">• Sleep Duration & Quality</text>
  <text x="30" y="355" font-size="13" fill="#4b5563">• Active Minutes</text>

  <!-- Sync History Section -->
  <text x="30" y="390" font-size="14" font-weight="600" fill="#111827">SYNC HISTORY:</text>
  <rect x="30" y="400" width="540" height="180" fill="#f9fafb" stroke="#e5e7eb" stroke-width="1" rx="6"/>
  <text x="40" y="425" font-size="12" fill="#111827">Dec 11 at 9:15 AM - Success (12 data points)</text>
  <text x="40" y="450" font-size="12" fill="#111827">Dec 11 at 6:00 AM - Success (8 data points)</text>
  <text x="40" y="475" font-size="12" fill="#ef4444">Dec 10 at 9:30 PM - Failed (Auth expired)</text>
  <text x="40" y="500" font-size="12" fill="#111827">Dec 10 at 3:15 PM - Success (15 data points)</text>
  <text x="40" y="525" font-size="12" fill="#111827">Dec 10 at 9:00 AM - Success (10 data points)</text>
  <text x="40" y="550" font-size="11" fill="#6b7280">+ 45 more syncs</text>

  <!-- Total Data Points -->
  <text x="30" y="605" font-size="13" fill="#6b7280">Total Data Points Synced: 1,247</text>

  <!-- Divider -->
  <line x1="30" y1="625" x2="570" y2="625" stroke="#e5e7eb" stroke-width="1"/>

  <!-- Action Buttons -->
  <rect x="30" y="645" width="200" height="40" fill="#3b82f6" rx="6"/>
  <text x="70" y="670" font-size="14" font-weight="600" fill="#ffffff">Re-authorize Connection</text>

  <rect x="390" y="645" width="180" height="40" fill="none" stroke="#dc2626" stroke-width="1.5" rx="6"/>
  <text x="430" y="670" font-size="14" font-weight="600" fill="#dc2626">Disconnect Device</text>
</svg>
```

---

## States

- **Default:** Shows all device information with management actions
- **Loading:** Shows skeleton placeholders while fetching details
- **Error:** Displays error message if details cannot be loaded
- **Disconnecting:** Shows loading state while disconnecting device
- **Re-authorizing:** Shows loading state while re-authorization in progress

---

## Interactions

- **Click Close (X)** → Calls onClose handler, modal closes
- **Click "Re-authorize Connection"** → Calls onReauthorize handler, initiates OAuth flow
- **Click "Disconnect Device"** → Shows confirmation dialog, then calls onDisconnect handler
- **Click outside modal (backdrop)** → Calls onClose handler, modal closes
- **Press Escape key** → Calls onClose handler, modal closes

### Disconnect Confirmation Dialog

When "Disconnect Device" is clicked, show confirmation modal:

**Title:** "Disconnect Device?"

**Message:** "Are you sure you want to disconnect this device? Your historical data will be preserved, but no new data will sync. You can reconnect it anytime."

**Actions:**
- "Cancel" (secondary button)
- "Yes, Disconnect" (danger button)

---

## Accessibility

- **ARIA Labels:**
  - `role="dialog"`
  - `aria-modal="true"`
  - `aria-labelledby="device-details-title"`
  - `aria-describedby="device-details-content"`
- **Focus Management:**
  - Focus trapped within modal while open
  - Focus returns to triggering DeviceCard when closed
  - First focusable element (close button) receives focus on open
- **Keyboard Navigation:**
  - Tab/Shift+Tab to navigate between interactive elements
  - Escape to close modal
  - Enter/Space to activate buttons
- **Screen Reader Support:**
  - Modal title announced when opened
  - All sections clearly labeled
  - Sync status changes announced
  - Error messages announced with appropriate urgency

---

## Conditional Display Logic

### Re-authorize Button

Show when:
- `authorizationStatus` is "Expired" or "Revoked"
- OR `syncStatus` is "Error" or "Disconnected"

Hide when:
- `authorizationStatus` is "Active" AND `syncStatus` is "Active" or "Syncing"

### Battery Level

Only display if `batteryLevel` is provided (optional field)

### Firmware Version

Only display if `firmwareVersion` is provided (optional field)

### Sync History

- Display most recent 5 sync events by default
- Show "Load more" or "+ X more syncs" if more history available
- Failed syncs should be visually distinct (red text or icon)

---

## Notes

- Modal should have backdrop overlay (semi-transparent dark background)
- Modal should be vertically scrollable if content exceeds viewport height
- Sync history should show most recent first (reverse chronological)
- Failed sync entries should display error message if available
- Consider showing sync frequency preference setting in future enhancement
- Battery level (if available) should show visual indicator (battery icon with level)
