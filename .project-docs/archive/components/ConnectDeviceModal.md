# ConnectDeviceModal

**Type:** Modal (Multi-step)

**Purpose:** Guides patients through the process of connecting a new health monitoring device

**Usage:** Opens when patient clicks "Connect Device" button or asks Ava to connect a device

---

## Data Fields

- `supportedDevices` (Array<Object>) - List of supported device types and manufacturers
  - `deviceType` (String) - Category name (e.g., "Smart Scale") - Required
  - `deviceTypeId` (String) - Identifier for device type - Required
  - `icon` (String or Component) - Icon for device type - Required
  - `description` (String) - Brief description of what device tracks - Required
  - `manufacturers` (Array<Object>) - Supported manufacturers for this type
    - `manufacturerId` (String) - Identifier - Required
    - `manufacturerName` (String) - Display name - Required
    - `logoUrl` (URL, optional) - Manufacturer logo
    - `dataTypesProvided` (Array<String>) - Data types this manufacturer provides - Required
    - `authMethod` (Enum: "OAuth" | "API_Key" | "Bluetooth") - Connection method - Required
  - Required
- `onConnect` (Function) - Handler to initiate connection
  - Parameters: manufacturerId (String), deviceTypeId (String)
  - Required
- `onClose` (Function) - Handler to close modal
  - Required

---

## Visual Structure (SVG) - Step 1: Device Type Selection

```svg
<svg viewBox="0 0 600 700" xmlns="http://www.w3.org/2000/svg">
  <!-- Modal Container -->
  <rect x="0" y="0" width="600" height="700" fill="#ffffff" stroke="#e5e7eb" stroke-width="1" rx="12"/>

  <!-- Header -->
  <text x="30" y="40" font-size="20" font-weight="700" fill="#111827">Connect New Device</text>
  <circle cx="570" cy="30" r="15" fill="#f3f4f6"/>
  <text x="565" y="35" font-size="16" fill="#6b7280">✕</text>

  <!-- Step Indicator -->
  <text x="30" y="75" font-size="14" fill="#6b7280">Step 1 of 2: Select Device Type</text>

  <!-- Instructions -->
  <text x="30" y="105" font-size="15" fill="#4b5563">What type of device do you want to connect?</text>

  <!-- Device Type Option 1: Smart Scale -->
  <rect x="30" y="130" width="540" height="80" fill="#f9fafb" stroke="#e5e7eb" stroke-width="1" rx="8"/>
  <circle cx="65" cy="170" r="20" fill="#3b82f6"/>
  <text x="55" y="177" font-size="20" fill="#ffffff">⚖</text>
  <text x="105" y="165" font-size="16" font-weight="600" fill="#111827">Smart Scale</text>
  <text x="105" y="185" font-size="13" fill="#6b7280">Automatically track weight, BMI, body fat</text>
  <rect x="490" y="155" width="70" height="30" fill="#3b82f6" rx="6"/>
  <text x="505" y="175" font-size="13" font-weight="600" fill="#ffffff">SELECT</text>

  <!-- Device Type Option 2: Fitness Tracker -->
  <rect x="30" y="230" width="540" height="80" fill="#f9fafb" stroke="#e5e7eb" stroke-width="1" rx="8"/>
  <circle cx="65" cy="270" r="20" fill="#8b5cf6"/>
  <text x="55" y="277" font-size="20" fill="#ffffff">📱</text>
  <text x="105" y="265" font-size="16" font-weight="600" fill="#111827">Fitness Tracker / Smartwatch</text>
  <text x="105" y="285" font-size="13" fill="#6b7280">Track steps, activity, heart rate, sleep</text>
  <rect x="490" y="255" width="70" height="30" fill="#3b82f6" rx="6"/>
  <text x="505" y="275" font-size="13" font-weight="600" fill="#ffffff">SELECT</text>

  <!-- Device Type Option 3: Blood Pressure Monitor -->
  <rect x="30" y="330" width="540" height="80" fill="#f9fafb" stroke="#e5e7eb" stroke-width="1" rx="8"/>
  <circle cx="65" cy="370" r="20" fill="#f59e0b"/>
  <text x="55" y="377" font-size="20" fill="#ffffff">🩺</text>
  <text x="105" y="365" font-size="16" font-weight="600" fill="#111827">Blood Pressure Monitor</text>
  <text x="105" y="385" font-size="13" fill="#6b7280">Monitor blood pressure and heart rate</text>
  <rect x="490" y="355" width="70" height="30" fill="#3b82f6" rx="6"/>
  <text x="505" y="375" font-size="13" font-weight="600" fill="#ffffff">SELECT</text>

  <!-- Device Type Option 4: CGM -->
  <rect x="30" y="430" width="540" height="80" fill="#f9fafb" stroke="#e5e7eb" stroke-width="1" rx="8"/>
  <circle cx="65" cy="470" r="20" fill="#ef4444"/>
  <text x="55" y="477" font-size="20" fill="#ffffff">🩸</text>
  <text x="105" y="465" font-size="16" font-weight="600" fill="#111827">Continuous Glucose Monitor</text>
  <text x="105" y="485" font-size="13" fill="#6b7280">Track blood sugar levels continuously</text>
  <rect x="490" y="455" width="70" height="30" fill="#3b82f6" rx="6"/>
  <text x="505" y="475" font-size="13" font-weight="600" fill="#ffffff">SELECT</text>

  <!-- Device Type Option 5: Heart Rate Monitor -->
  <rect x="30" y="530" width="540" height="80" fill="#f9fafb" stroke="#e5e7eb" stroke-width="1" rx="8"/>
  <circle cx="65" cy="570" r="20" fill="#ec4899"/>
  <text x="55" y="577" font-size="20" fill="#ffffff">❤</text>
  <text x="105" y="565" font-size="16" font-weight="600" fill="#111827">Heart Rate Monitor</text>
  <text x="105" y="585" font-size="13" fill="#6b7280">Track heart rate during activities</text>
  <rect x="490" y="555" width="70" height="30" fill="#3b82f6" rx="6"/>
  <text x="505" y="575" font-size="13" font-weight="600" fill="#ffffff">SELECT</text>

  <!-- Cancel Button -->
  <rect x="480" y="640" width="90" height="40" fill="none" stroke="#d1d5db" stroke-width="1.5" rx="6"/>
  <text x="510" y="665" font-size="14" font-weight="600" fill="#6b7280">Cancel</text>
</svg>
```

## Visual Structure (SVG) - Step 2: Manufacturer Selection

```svg
<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
  <!-- Modal Container -->
  <rect x="0" y="0" width="600" height="600" fill="#ffffff" stroke="#e5e7eb" stroke-width="1" rx="12"/>

  <!-- Header -->
  <text x="30" y="40" font-size="20" font-weight="700" fill="#111827">Connect New Device</text>
  <circle cx="570" cy="30" r="15" fill="#f3f4f6"/>
  <text x="565" y="35" font-size="16" fill="#6b7280">✕</text>

  <!-- Step Indicator -->
  <text x="30" y="75" font-size="14" fill="#6b7280">Step 2 of 2: Select Manufacturer</text>

  <!-- Selected Device Type -->
  <rect x="30" y="90" width="200" height="35" fill="#eff6ff" stroke="#3b82f6" stroke-width="1" rx="6"/>
  <text x="40" y="113" font-size="13" font-weight="600" fill="#1e40af">Device Type: Smart Scale</text>

  <!-- Instructions -->
  <text x="30" y="150" font-size="15" fill="#4b5563">Select your device manufacturer:</text>

  <!-- Manufacturer Option 1: Withings -->
  <rect x="30" y="175" width="540" height="100" fill="#f9fafb" stroke="#e5e7eb" stroke-width="1" rx="8"/>
  <rect x="50" y="195" width="80" height="40" fill="#ffffff" stroke="#e5e7eb" stroke-width="1" rx="4"/>
  <text x="60" y="220" font-size="12" font-weight="600" fill="#111827">Withings</text>
  <text x="150" y="205" font-size="16" font-weight="600" fill="#111827">Withings</text>
  <text x="150" y="230" font-size="13" fill="#6b7280">Syncs: Weight, Body Fat %, BMI, Muscle Mass</text>
  <rect x="460" y="207" width="90" height="36" fill="#3b82f6" rx="6"/>
  <text x="478" y="230" font-size="13" font-weight="600" fill="#ffffff">CONNECT</text>

  <!-- Manufacturer Option 2: Fitbit -->
  <rect x="30" y="295" width="540" height="100" fill="#f9fafb" stroke="#e5e7eb" stroke-width="1" rx="8"/>
  <rect x="50" y="315" width="80" height="40" fill="#ffffff" stroke="#e5e7eb" stroke-width="1" rx="4"/>
  <text x="60" y="340" font-size="12" font-weight="600" fill="#111827">Fitbit</text>
  <text x="150" y="325" font-size="16" font-weight="600" fill="#111827">Fitbit Aria</text>
  <text x="150" y="350" font-size="13" fill="#6b7280">Syncs: Weight, Body Fat %, BMI</text>
  <rect x="460" y="327" width="90" height="36" fill="#3b82f6" rx="6"/>
  <text x="478" y="350" font-size="13" font-weight="600" fill="#ffffff">CONNECT</text>

  <!-- Manufacturer Option 3: Garmin -->
  <rect x="30" y="415" width="540" height="100" fill="#f9fafb" stroke="#e5e7eb" stroke-width="1" rx="8"/>
  <rect x="50" y="435" width="80" height="40" fill="#ffffff" stroke="#e5e7eb" stroke-width="1" rx="4"/>
  <text x="60" y="460" font-size="12" font-weight="600" fill="#111827">Garmin</text>
  <text x="150" y="445" font-size="16" font-weight="600" fill="#111827">Garmin</text>
  <text x="150" y="470" font-size="13" fill="#6b7280">Syncs: Weight, Body Fat %, BMI, Water %</text>
  <rect x="460" y="447" width="90" height="36" fill="#3b82f6" rx="6"/>
  <text x="478" y="470" font-size="13" font-weight="600" fill="#ffffff">CONNECT</text>

  <!-- Navigation Buttons -->
  <rect x="30" y="540" width="80" height="40" fill="none" stroke="#d1d5db" stroke-width="1.5" rx="6"/>
  <text x="53" y="565" font-size="14" font-weight="600" fill="#6b7280">Back</text>

  <rect x="480" y="540" width="90" height="40" fill="none" stroke="#d1d5db" stroke-width="1.5" rx="6"/>
  <text x="510" y="565" font-size="14" font-weight="600" fill="#6b7280">Cancel</text>
</svg>
```

---

## States

### Step 1: Device Type Selection
- **Default:** Displays list of supported device types
- **Hover:** Device type card shows hover effect
- **Selected:** Advances to Step 2 with selected device type

### Step 2: Manufacturer Selection
- **Default:** Displays manufacturers for selected device type
- **Hover:** Manufacturer card shows hover effect
- **Connecting:** Shows loading state when OAuth flow initiated
- **Success:** Modal closes, device added to list
- **Error:** Shows error message, option to retry

---

## Interactions

### Step 1: Device Type Selection

- **Click device type card** → Advances to Step 2 with selected device type stored
- **Click "Cancel"** → Calls onClose handler, modal closes
- **Click Close (X)** → Calls onClose handler, modal closes
- **Press Escape** → Calls onClose handler, modal closes

### Step 2: Manufacturer Selection

- **Click "CONNECT" button** → Calls onConnect handler with manufacturerId and deviceTypeId, initiates OAuth flow
- **Click "Back"** → Returns to Step 1
- **Click "Cancel"** → Calls onClose handler, modal closes
- **Click Close (X)** → Calls onClose handler, modal closes
- **Press Escape** → Calls onClose handler, modal closes

### OAuth Flow (After CONNECT clicked)

1. Modal remains open with loading state
2. OAuth window/redirect opens in new tab or popup
3. Patient authenticates with manufacturer
4. Patient authorizes data access
5. OAuth callback returns to app
6. Modal closes automatically
7. Success message appears
8. Device appears in DeviceList

### Error Handling

If connection fails:
1. Show error message in modal: "Connection failed. [Error reason]"
2. Provide "Try Again" button
3. Provide "Cancel" button
4. Log error details for support

---

## Accessibility

- **ARIA Labels:**
  - `role="dialog"`
  - `aria-modal="true"`
  - `aria-labelledby="connect-device-title"`
  - `aria-describedby="connect-device-instructions"`
  - `aria-live="polite"` for step changes
- **Focus Management:**
  - Focus trapped within modal while open
  - Focus returns to "Connect Device" button when closed
  - First focusable element receives focus on open
  - Focus moves to first manufacturer when advancing to Step 2
- **Keyboard Navigation:**
  - Tab/Shift+Tab to navigate between options
  - Enter/Space to select device type or manufacturer
  - Escape to close modal
  - Arrow keys for vertical navigation between options (optional enhancement)
- **Screen Reader Support:**
  - Current step announced when changed
  - Selected device type announced when moving to Step 2
  - Connection status announced (connecting, success, error)
  - Instructions read when entering each step

---

## Ava Integration

When Ava guides device connection:

1. **Device Type Pre-selection:**
   - If patient says "connect my scale", modal opens directly to Step 2 with device type pre-selected
   - Ava message: "I'll open the connection page for scales"

2. **Manufacturer Pre-selection:**
   - If patient says "connect my Withings scale", modal opens to Step 2 with Withings pre-selected
   - Ava message: "Opening Withings authorization now"

3. **Full Manual Flow:**
   - If patient says "connect a device" without specifics, modal opens to Step 1
   - Ava message: "I've opened the device connection page. Select your device type to get started."

---

## Notes

- Step indicator should clearly show progress (Step 1 of 2, Step 2 of 2)
- Device type icons should be consistent with DeviceCard icons
- Manufacturer logos (if available) improve recognition and trust
- OAuth flow should handle popup blockers gracefully
- Consider showing "Why do we need this?" or privacy information
- Data types listed should match what will actually appear in Health Data
- Failed connection should not close modal - allow retry
- Consider adding a "Can't find your device?" help link
