# Device Integration Screen - Enhanced Requirements

**Navigation Label:** "Device Integration"

**Screen Type:** Secondary navigation screen (Account > Device Integration)

---

## Screen Overview

The Device Integration screen allows patients to connect and manage health monitoring devices (smart scales, fitness trackers, blood pressure monitors, continuous glucose monitors, etc.) for automatic data synchronization. Patients can view their connected devices, check sync status, troubleshoot connection issues, and disconnect devices when needed. Data synced from connected devices automatically appears in the Health Data screen (My Health > Health Data).

**Primary User Goals:**

- Connect new health monitoring devices to automatically sync data
- View all currently connected devices and their sync status
- Troubleshoot connection or sync issues with existing devices
- Disconnect or remove devices that are no longer in use
- Understand which data types each device provides

---

## Components Used

### Global Components

- **ScreenHeader** - See [ScreenHeader](../components/ScreenHeader.md)
  - **Usage Context:** Page title "Device Integration" with primary action button "Connect Device"
  - **Data Passed:**
    - `title`: "Device Integration"
    - `primaryAction`: { label: "Connect Device", onClick: openConnectDeviceModal }

- **AvaChatPane** - See [AvaChatPane](../components/AvaChatPane.md)
  - **Usage Context:** Persistent right-side chat pane where Ava displays contextual greeting and assists with device connection troubleshooting
  - **Data Passed:**
    - `greetingText`: Context-aware greeting based on connected devices status
    - `conversationHistory`: Patient's chat history
    - `pageContext`: "device-integration"

### Screen-Specific Components

- **DeviceList** - See [DeviceList](../components/DeviceList.md) - NEW COMPONENT
  - **Usage Context:** Container for displaying all connected devices with sync status
  - **Data Passed:**
    - `connectedDevices`: Array of device objects
    - `onDeviceClick`: Handler to open device detail modal

- **DeviceCard** - See [DeviceCard](../components/DeviceCard.md) - NEW COMPONENT
  - **Usage Context:** Individual device preview showing device type, name, and sync status
  - **Data Passed:**
    - `deviceId`: Unique identifier
    - `deviceType`: Type of device (e.g., "Smart Scale", "Fitness Tracker", "Blood Pressure Monitor", "CGM")
    - `deviceName`: Display name (e.g., "Withings Scale", "Fitbit Charge 5")
    - `manufacturer`: Device manufacturer (e.g., "Withings", "Fitbit", "Dexcom")
    - `syncStatus`: "Active", "Syncing", "Error", "Disconnected"
    - `lastSyncTime`: Timestamp of last successful sync
    - `dataTypes`: Array of data types this device provides (e.g., ["weight", "body_fat", "bmi"])

- **DeviceDetailsModal** - See [DeviceDetailsModal](../components/DeviceDetailsModal.md) - NEW COMPONENT
  - **Usage Context:** Modal showing comprehensive device information and management actions
  - **Data Passed:**
    - `device`: Full device object with all details
    - `syncHistory`: Recent sync events with timestamps
    - `onDisconnect`: Handler to disconnect device
    - `onReauthorize`: Handler to re-authorize device connection
    - `onClose`: Handler to close modal

- **ConnectDeviceModal** - See [ConnectDeviceModal](../components/ConnectDeviceModal.md) - NEW COMPONENT
  - **Usage Context:** Multi-step modal for connecting new health devices
  - **Data Passed:**
    - `supportedDevices`: List of supported device types and manufacturers
    - `onConnect`: Handler to initiate OAuth or connection flow
    - `onClose`: Handler to close modal

- **SyncStatusBadge** - See [SyncStatusBadge](../components/SyncStatusBadge.md) - NEW COMPONENT
  - **Usage Context:** Visual indicator of device sync status
  - **Data Passed:**
    - `status`: "Active", "Syncing", "Error", "Disconnected"
    - `lastSyncTime`: Timestamp of last sync (optional)

- **EmptyState** - See [EmptyState](../components/EmptyState.md) - NEW COMPONENT
  - **Usage Context:** Displayed when no devices are connected
  - **Data Passed:**
    - `illustration`: Empty state illustration/icon
    - `title`: "No Connected Devices"
    - `description`: "Connect health monitoring devices to automatically track your health data"
    - `primaryAction`: { label: "Connect Your First Device", onClick: openConnectDeviceModal }

### Form Components

- **Button** - See [Button](../components/Button.md)
  - **Usage Context:** "Connect Device", "Disconnect", "Re-authorize", "Troubleshoot"
  - **Data Passed:** Varies by action - label, onClick handler, variant (primary/secondary/danger)

### Layout Components

- **Modal** - See [Modal](../components/Modal.md)
  - **Usage Context:** Container for device details and connection flows
  - **Data Passed:** Content, onClose handler, size variant

- **Card** - See [Card](../components/Card.md)
  - **Usage Context:** Container for individual device cards in the list
  - **Data Passed:** Content, optional onClick handler

---

## Interactions

### View Device Details

- **Trigger:** Click/tap on DeviceCard in the list
- **Result:** DeviceDetailsModal opens showing full device information
- **States:**
  - Loading: Fetching device details and sync history
  - Success: Modal displays with device data and management options
  - Error: Error message if device details cannot be loaded
- **Components Involved:** DeviceCard, DeviceDetailsModal, Modal

### Connect New Device

- **Trigger:** Click "Connect Device" button in ScreenHeader or via Ava conversation
- **Result:** ConnectDeviceModal opens with device selection flow
- **Flow:**
  1. Patient selects device type (scale, fitness tracker, blood pressure monitor, etc.)
  2. Patient selects specific manufacturer/model from supported devices
  3. System initiates OAuth or connection flow (redirects to manufacturer's auth page)
  4. Patient authorizes Cena Health to access device data
  5. System confirms connection and begins initial sync
  6. Device appears in connected devices list
- **States:**
  - Browsing: Viewing available device types
  - Connecting: OAuth flow in progress
  - Success: Device connected, initial sync started
  - Error: Connection failed (invalid credentials, API error, unsupported device)
- **Components Involved:** Button, ConnectDeviceModal, Modal

### Disconnect Device

- **Trigger:** Click "Disconnect" button in DeviceDetailsModal
- **Result:** Confirmation dialog, then device is disconnected
- **Flow:**
  1. Confirmation dialog appears: "Are you sure you want to disconnect this device? Historical data will be preserved, but no new data will sync."
  2. Patient confirms or cancels action
  3. If confirmed, device authorization is revoked
  4. Device is removed from connected devices list
  5. Audit trail logged
- **States:**
  - Confirming: Showing confirmation dialog
  - Success: Device disconnected, modal closes
  - Error: Server error prevents disconnection
- **Components Involved:** DeviceDetailsModal, Button, Modal (for confirmation)

### Re-authorize Device Connection

- **Trigger:** Click "Re-authorize" button in DeviceDetailsModal (visible when sync status is "Error" or "Disconnected")
- **Result:** Re-initiates OAuth flow to restore connection
- **Flow:**
  1. System initiates OAuth flow for the device
  2. Patient authorizes access on manufacturer's page
  3. Connection is restored
  4. System attempts sync
  5. Device status updates to "Active"
- **States:**
  - Re-authorizing: OAuth flow in progress
  - Success: Connection restored, sync initiated
  - Error: Re-authorization failed
- **Components Involved:** DeviceDetailsModal, Button

### Troubleshoot Connection Issues (via Ava)

- **Trigger:** Patient mentions sync issue in Ava chat or clicks "Troubleshoot" button
- **Result:** Ava guides troubleshooting conversation
- **Flow:**
  1. Ava asks clarifying questions about the issue
  2. Ava checks device sync status and history
  3. Ava provides step-by-step troubleshooting guidance
  4. If issue persists, Ava offers to re-authorize or suggests contacting support
- **States:**
  - Diagnosing: Ava gathering information
  - Guiding: Ava providing troubleshooting steps
  - Resolved: Issue fixed, sync restored
  - Escalated: Issue requires support team assistance
- **Components Involved:** AvaChatPane, DeviceDetailsModal (optionally opened by Ava)

### Conversational Device Connection (via Ava)

- **Trigger:** Patient says "I want to connect my scale" or similar in Ava chat
- **Result:** Ava guides conversational connection flow
- **Flow:**
  1. Ava identifies device type from patient's message
  2. Ava asks for manufacturer/model if not specified
  3. Ava confirms device is supported
  4. Ava initiates connection flow (opens ConnectDeviceModal pre-populated)
  5. Patient completes OAuth authorization
  6. Ava confirms successful connection
  7. Traditional UI updates to show new device
  8. Audit trail logged in chat
- **States:**
  - Conversation in progress: Multi-turn dialogue
  - Connecting: OAuth flow initiated
  - Success: Device connected
  - Error: Device not supported or connection failed
- **Components Involved:** AvaChatPane, ConnectDeviceModal (optionally), DeviceList (updates)

---

## Screen Data Requirements

### Data Displayed on This Screen

**Device List Data:**

- `deviceId` (String) - Unique identifier for each connected device
- `deviceType` (Enum: "Smart Scale" | "Fitness Tracker" | "Blood Pressure Monitor" | "CGM" | "Heart Rate Monitor" | "Sleep Tracker" | "Smart Watch") - Type of device
- `deviceName` (String) - Display name (e.g., "Withings Body+")
- `manufacturer` (String) - Device manufacturer (e.g., "Withings", "Fitbit", "Dexcom", "Omron")
- `model` (String, optional) - Device model number
- `syncStatus` (Enum: "Active" | "Syncing" | "Error" | "Disconnected") - Current connection status
- `lastSyncTime` (DateTime) - Timestamp of last successful sync
  - Format: Relative for recent ("2 hours ago", "Just now")
  - Format: Full for older than 24h: "Dec 9 at 3:45 PM"
- `dataTypes` (Array<String>) - Types of data this device provides (e.g., ["weight", "body_fat_percentage", "bmi", "muscle_mass"])
- `connectedAt` (DateTime) - When device was first connected

**Device Details Data (shown in modal):**

- All fields from list above, plus:
- `authorizationStatus` (Enum: "Active" | "Expired" | "Revoked") - OAuth authorization status
- `syncFrequency` (String) - How often device syncs (e.g., "Every 15 minutes", "Real-time", "Daily")
- `syncHistory` (Array) - Recent sync events
  - `syncTime` (DateTime) - When sync occurred
  - `syncStatus` (Enum: "Success" | "Failed" | "Partial") - Outcome
  - `dataSynced` (Number, optional) - Number of data points synced
  - `errorMessage` (String, optional) - Error details if failed
- `dataSyncedCount` (Number) - Total number of data points synced from this device
- `batteryLevel` (Number, optional) - Device battery level if available (0-100)
- `firmwareVersion` (String, optional) - Device firmware version if available

**Supported Devices Data (for connection flow):**

- `deviceType` (String) - Category of device
- `supportedManufacturers` (Array) - List of supported manufacturers in this category
  - `manufacturerName` (String) - Display name
  - `manufacturerId` (String) - Identifier for connection
  - `logoUrl` (URL, optional) - Manufacturer logo
  - `supportedModels` (Array, optional) - Specific models if applicable
  - `dataTypesProvided` (Array<String>) - What data this manufacturer's devices provide
  - `authMethod` (Enum: "OAuth" | "API_Key" | "Bluetooth") - How device connects

### Permission Requirements

**Role-Based Access:**

- **Patient:** Can view their own connected devices, connect new devices, disconnect devices, view sync status
- **Provider (RDN/BHN):** Can view patient's connected devices (read-only), view sync status and history
- **Care Coordinator:** Can view patient's connected devices (read-only), assist with troubleshooting
- **Admin:** Full access to all device connection data and management

**Field-Level Permissions:**

| Field              | Patient View | Patient Edit | Provider View | Provider Edit | Coordinator View | Coordinator Edit |
| ------------------ | ------------ | ------------ | ------------- | ------------- | ---------------- | ---------------- |
| deviceType         | ✓            | -            | ✓             | -             | ✓                | -                |
| deviceName         | ✓            | -            | ✓             | -             | ✓                | -                |
| manufacturer       | ✓            | -            | ✓             | -             | ✓                | -                |
| syncStatus         | ✓            | -            | ✓             | -             | ✓                | -                |
| lastSyncTime       | ✓            | -            | ✓             | -             | ✓                | -                |
| dataTypes          | ✓            | -            | ✓             | -             | ✓                | -                |
| syncHistory        | ✓            | -            | ✓             | -             | ✓                | -                |
| connect/disconnect | ✓            | ✓            | -             | -             | -                | -                |
| authorizationToken | -            | -            | -             | -             | -                | -                |

**Conditional Access Rules:**

- Patients can only view and manage their own connected devices
- Authorization tokens and API credentials are never exposed to any user role
- Providers can only view devices for patients assigned to their care team
- Device sync data automatically flows to Health Data screen based on patient's data viewing permissions

---

## Ava Integration Details

### Context-Aware Greeting

Ava's greeting appears as text IN the chat conversation when the patient navigates to the Device Integration screen. The greeting is ephemeral - if the patient navigates away without interacting, the greeting is removed and not stored in persistent chat history.

**Greeting Examples Based on Patient State:**

1. **Patient has no connected devices:**

   ```
   Let me know if I can help you connect a health device. I can walk you through the process for scales, fitness trackers, blood pressure monitors, and more.
   ```

2. **Patient has devices connected and syncing normally:**

   ```
   Your devices are syncing normally. Let me know if you need help with anything related to your connected devices.
   ```

3. **Patient has a device with sync error:**

   ```
   I noticed your Withings scale hasn't synced in 3 days. Would you like me to help you troubleshoot the connection?
   ```

4. **Patient has a device with expired authorization:**

   ```
   Your Fitbit authorization expired yesterday. I can help you reconnect it so your activity data continues syncing automatically.
   ```

5. **Patient just connected a device successfully:**

   ```
   Great! Your new scale is connected and syncing. Your weight data will now automatically appear in your Health Data. Is there anything else you'd like to connect?
   ```

### Conversational Shortcuts

Ava enables natural language interactions for device management:

**Connecting Devices:**

- "I want to connect my smart scale"
- "Help me set up my Fitbit"
- "Can I connect my blood pressure monitor?"
- "I have a Withings scale I want to link"

**Viewing Device Status:**

- "Is my scale syncing?"
- "When did my Fitbit last sync?"
- "Show me my connected devices"
- "What devices do I have connected?"

**Troubleshooting:**

- "My scale isn't syncing"
- "I'm having trouble with my Fitbit connection"
- "Why isn't my blood pressure monitor working?"
- "My device shows an error"

**Disconnecting:**

- "I want to remove my old scale"
- "Disconnect my Fitbit"
- "I'm not using my blood pressure monitor anymore"

**Information:**

- "What devices can I connect?"
- "Does this work with Apple Watch?"
- "Can I connect a continuous glucose monitor?"
- "What data does my scale sync?"

### Form Auto-Population

When a patient engages in conversational device connection with Ava:

1. **Device Type Identification:**

   - Patient: "I want to connect my smart scale"
   - Ava identifies device type (scale) and pre-filters manufacturer list
   - If multiple manufacturers supported, Ava asks: "Which brand is your scale? We support Withings, Fitbit Aria, and Garmin."

2. **Manufacturer Selection:**

   - Patient: "It's a Withings scale"
   - Ava identifies manufacturer and pre-selects in connection modal
   - Opens ConnectDeviceModal pre-populated with device type and manufacturer

3. **Connection Guidance:**

   - Ava: "Great! I'll open the connection page. You'll need to sign in to your Withings account to authorize data sharing. Once you approve, your scale data will automatically sync."
   - Patient completes OAuth flow
   - Ava confirms: "Perfect! Your Withings scale is now connected. I'll let you know if there are any sync issues."

### Confirmation Workflows

Ava always requests confirmation before executing device management actions:

**Connection Confirmation:**

```
Ava: "I see you want to connect a Withings scale. When you connect this device, Cena Health will automatically receive your weight, body fat percentage, and BMI data. You can disconnect it anytime. Ready to proceed?"

Patient: "Yes"

Ava: "Great! I'm opening the Withings authorization page. Please sign in and approve access."

[Patient completes OAuth]

Ava: "Done! Your Withings scale is now connected. Your weight data will automatically sync and appear in your Health Data."
```

**Disconnection Confirmation:**

```
Patient: "Disconnect my old Fitbit"

Ava: "Are you sure you want to disconnect your Fitbit Charge 5? Your historical data will be preserved, but no new data will sync. You can reconnect it later if you change your mind."

Patient: "Yes, disconnect it"

Ava: "Done! Your Fitbit has been disconnected. If you want to connect a different device, just let me know."
```

**Re-authorization Confirmation:**

```
Ava: "Your Withings scale authorization expired. I can help you reconnect it. You'll need to sign in to your Withings account again to restore access. Should I start the process?"

Patient: "Yes please"

Ava: "Opening the Withings authorization page now. Please sign in and approve access."

[Patient completes OAuth]

Ava: "Perfect! Your scale is reconnected and syncing again. Everything looks good."
```

---

## ASCII Wireframe

### Main Device Integration Screen (With Connected Devices)

```
┌─────────────────────────────────────────────────────┬──────────────────────────────┐
│ ScreenHeader                                        │ AvaChatPane                  │
│ ┌─────────────────────────────────────────────────┐ │                              │
│ │ Device Integration      [Connect Device CLICK]  │ │ Ava greeting appears here:   │
│ └─────────────────────────────────────────────────┘ │ "Your devices are syncing    │
│                                                     │  normally. Let me know if    │
│ DeviceList                                          │  you need help."             │
│ ┌─────────────────────────────────────────────────┐ │                              │
│ │ CONNECTED DEVICES                               │ │ [Patient can type here...]   │
│ │                                                 │ │                              │
│ │ DeviceCard [CLICK -> details modal]            │ │                              │
│ │ ┌─────────────────────────────────────────────┐ │ │                              │
│ │ │ [Scale Icon]                                │ │ │                              │
│ │ │ Withings Body+                              │ │ │ Chat message history         │
│ │ │ Smart Scale                                 │ │ │ appears below...             │
│ │ │                                             │ │ │                              │
│ │ │ [SyncStatusBadge: Active ✓]                │ │ │                              │
│ │ │ Last synced: 2 hours ago                   │ │ │                              │
│ │ │                                             │ │ │                              │
│ │ │ Data: Weight, Body Fat %, BMI, Muscle Mass │ │ │                              │
│ │ └─────────────────────────────────────────────┘ │ │                              │
│ │                                                 │ │                              │
│ │ DeviceCard [CLICK -> details modal]            │ │ │                              │
│ │ ┌─────────────────────────────────────────────┐ │ │                              │
│ │ │ [Tracker Icon]                              │ │ │                              │
│ │ │ Fitbit Charge 5                             │ │ │                              │
│ │ │ Fitness Tracker                             │ │ │                              │
│ │ │                                             │ │ │                              │
│ │ │ [SyncStatusBadge: Error ⚠]                 │ │ │                              │
│ │ │ Last synced: 3 days ago                    │ │ │                              │
│ │ │                                             │ │ │                              │
│ │ │ Data: Steps, Heart Rate, Sleep, Activity   │ │ │                              │
│ │ └─────────────────────────────────────────────┘ │ │                              │
│ │                                                 │ │                              │
│ │ DeviceCard [CLICK -> details modal]            │ │ │                              │
│ │ ┌─────────────────────────────────────────────┐ │ │                              │
│ │ │ [Monitor Icon]                              │ │ │                              │
│ │ │ Omron Evolv                                 │ │ │                              │
│ │ │ Blood Pressure Monitor                      │ │ │                              │
│ │ │                                             │ │ │                              │
│ │ │ [SyncStatusBadge: Active ✓]                │ │ │                              │
│ │ │ Last synced: Just now                      │ │ │                              │
│ │ │                                             │ │ │                              │
│ │ │ Data: Blood Pressure, Heart Rate           │ │ │                              │
│ │ └─────────────────────────────────────────────┘ │ │                              │
│ └─────────────────────────────────────────────────┘ │                              │
└─────────────────────────────────────────────────────┴──────────────────────────────┘
```

### Device Integration Screen (Empty State)

```
┌─────────────────────────────────────────────────────┬──────────────────────────────┐
│ ScreenHeader                                        │ AvaChatPane                  │
│ ┌─────────────────────────────────────────────────┐ │                              │
│ │ Device Integration      [Connect Device CLICK]  │ │ Ava greeting appears here:   │
│ └─────────────────────────────────────────────────┘ │ "Let me know if I can help   │
│                                                     │  you connect a health device.│
│ EmptyState                                          │  I can walk you through the  │
│ ┌─────────────────────────────────────────────────┐ │  process."                   │
│ │                                                 │ │                              │
│ │            [Empty State Illustration]           │ │                              │
│ │                                                 │ │                              │
│ │         No Connected Devices                    │ │                              │
│ │                                                 │ │                              │
│ │    Connect health monitoring devices to         │ │                              │
│ │    automatically track your health data         │ │                              │
│ │                                                 │ │                              │
│ │    [Connect Your First Device CLICK]            │ │                              │
│ │                                                 │ │                              │
│ └─────────────────────────────────────────────────┘ │                              │
└─────────────────────────────────────────────────────┴──────────────────────────────┘
```

### Device Details Modal

```
┌─────────────────────────────────────────────────────┬──────────────────────────────┐
│ DeviceDetailsModal                         [X CLOSE]│ AvaChatPane                  │
│ ┌─────────────────────────────────────────────────┐ │                              │
│ │ Device Details                                  │ │ "Your Fitbit hasn't synced   │
│ │                                                 │ │  in 3 days. Would you like   │
│ │ [Device Icon]                                   │ │  me to help troubleshoot?"   │
│ │ Fitbit Charge 5                                 │ │                              │
│ │ Fitness Tracker                                 │ │                              │
│ │                                                 │ │                              │
│ │ Manufacturer: Fitbit                            │ │                              │
│ │ Connected: Dec 1, 2025                          │ │                              │
│ │                                                 │ │                              │
│ │ Status: [SyncStatusBadge: Error ⚠]            │ │                              │
│ │ Last Sync: 3 days ago (Dec 8 at 9:15 AM)      │ │                              │
│ │                                                 │ │                              │
│ │ ─────────────────────────────────────────────── │ │                              │
│ │                                                 │ │                              │
│ │ DATA TYPES:                                     │ │                              │
│ │ • Steps                                         │ │                              │
│ │ • Heart Rate                                    │ │                              │
│ │ • Sleep Duration & Quality                      │ │                              │
│ │ • Active Minutes                                │ │                              │
│ │ • Calories Burned                               │ │                              │
│ │                                                 │ │                              │
│ │ SYNC HISTORY:                                   │ │                              │
│ │ ┌─────────────────────────────────────────────┐ │ │                              │
│ │ │ Dec 8 at 9:15 AM - Success (12 data points)│ │ │                              │
│ │ │ Dec 8 at 6:00 AM - Failed (Auth expired)   │ │ │                              │
│ │ │ Dec 7 at 9:30 PM - Success (15 data points)│ │ │                              │
│ │ │ Dec 7 at 3:15 PM - Success (8 data points) │ │ │                              │
│ │ └─────────────────────────────────────────────┘ │ │                              │
│ │                                                 │ │                              │
│ │ Total Data Points Synced: 1,247                 │ │                              │
│ │                                                 │ │                              │
│ │ ─────────────────────────────────────────────── │ │                              │
│ │                                                 │ │                              │
│ │ [Re-authorize Connection CLICK]                 │ │                              │
│ │                        [Disconnect Device CLICK]│ │                              │
│ └─────────────────────────────────────────────────┘ │                              │
└─────────────────────────────────────────────────────┴──────────────────────────────┘
```

### Connect Device Modal (Step 1 - Device Type Selection)

```
┌─────────────────────────────────────────────────────┬──────────────────────────────┐
│ ConnectDeviceModal                         [X CLOSE]│ AvaChatPane                  │
│ ┌─────────────────────────────────────────────────┐ │                              │
│ │ Connect New Device                              │ │ Patient: "I want to connect  │
│ │                                                 │ │ my smart scale"              │
│ │ Step 1 of 2: Select Device Type                │ │                              │
│ │                                                 │ │ Ava: "Great! Which brand is  │
│ │ What type of device do you want to connect?    │ │ your scale? We support       │
│ │                                                 │ │ Withings, Fitbit Aria, and   │
│ │ [Scale Icon] Smart Scale                       │ │ Garmin."                     │
│ │ Automatically track weight, BMI, body fat      │ │                              │
│ │                                      [SELECT]   │ │                              │
│ │                                                 │ │                              │
│ │ [Tracker Icon] Fitness Tracker / Smartwatch    │ │                              │
│ │ Track steps, activity, heart rate, sleep       │ │                              │
│ │                                      [SELECT]   │ │                              │
│ │                                                 │ │                              │
│ │ [Monitor Icon] Blood Pressure Monitor          │ │                              │
│ │ Monitor blood pressure and heart rate          │ │                              │
│ │                                      [SELECT]   │ │                              │
│ │                                                 │ │                              │
│ │ [CGM Icon] Continuous Glucose Monitor          │ │                              │
│ │ Track blood sugar levels continuously          │ │                              │
│ │                                      [SELECT]   │ │                              │
│ │                                                 │ │                              │
│ │ [Heart Icon] Heart Rate Monitor                │ │                              │
│ │ Track heart rate during activities             │ │                              │
│ │                                      [SELECT]   │ │                              │
│ │                                                 │ │                              │
│ │                                       [Cancel]  │ │                              │
│ └─────────────────────────────────────────────────┘ │                              │
└─────────────────────────────────────────────────────┴──────────────────────────────┘
```

### Connect Device Modal (Step 2 - Manufacturer Selection)

```
┌─────────────────────────────────────────────────────┬──────────────────────────────┐
│ ConnectDeviceModal                         [X CLOSE]│ AvaChatPane                  │
│ ┌─────────────────────────────────────────────────┐ │                              │
│ │ Connect New Device                              │ │ Patient: "It's a Withings    │
│ │                                                 │ │ scale"                       │
│ │ Step 2 of 2: Select Manufacturer               │ │                              │
│ │                                                 │ │ Ava: "Perfect! I'll open the │
│ │ Device Type: Smart Scale                        │ │ Withings connection page.    │
│ │                                                 │ │ You'll need to sign in to    │
│ │ Select your device manufacturer:                │ │ authorize data sharing."     │
│ │                                                 │ │                              │
│ │ [Withings Logo]                                 │ │                              │
│ │ Withings                                        │ │                              │
│ │ Syncs: Weight, Body Fat %, BMI, Muscle Mass    │ │                              │
│ │                                    [CONNECT]    │ │                              │
│ │                                                 │ │                              │
│ │ [Fitbit Logo]                                   │ │                              │
│ │ Fitbit Aria                                     │ │                              │
│ │ Syncs: Weight, Body Fat %, BMI                 │ │                              │
│ │                                    [CONNECT]    │ │                              │
│ │                                                 │ │                              │
│ │ [Garmin Logo]                                   │ │                              │
│ │ Garmin                                          │ │                              │
│ │ Syncs: Weight, Body Fat %, BMI, Water %        │ │                              │
│ │                                    [CONNECT]    │ │                              │
│ │                                                 │ │                              │
│ │                             [Back]  [Cancel]    │ │                              │
│ └─────────────────────────────────────────────────┘ │                              │
└─────────────────────────────────────────────────────┴──────────────────────────────┘
```

---

## Clarifying Questions

### Missing Information

1. **Supported Device Platforms:**
   - What specific device manufacturers and models are supported at launch?
   - Are there priority device types to support first (e.g., scales before CGMs)?
   - Will support vary by insurance/plan type?

2. **OAuth Integration Details:**
   - Which OAuth providers need to be integrated (Withings, Fitbit, Apple Health, Google Fit, etc.)?
   - Are there any devices that use non-OAuth connection methods (Bluetooth, API keys)?
   - What happens if a manufacturer's API is temporarily down?

3. **Data Sync Frequency:**
   - How frequently does each device type sync (real-time, hourly, daily)?
   - Can patients manually trigger a sync?
   - Is there a "sync now" button for immediate data refresh?

4. **Historical Data Import:**
   - When connecting a device, how much historical data is imported?
   - Is there a date range limit (e.g., last 90 days only)?
   - Can patients choose what historical data to import?

5. **Device Replacement Flow:**
   - What happens when a patient upgrades to a new device of the same type?
   - Should old and new devices both remain connected, or replace the old one?
   - How is device replacement handled in the audit trail?

### Ambiguous Requirements

1. **"Manage device permissions":**
   - Does this mean controlling which data types sync from each device?
   - Or does it refer to OAuth permission scopes?
   - Can patients selectively disable certain data types while keeping the device connected?

2. **"View device-synced data":**
   - Does this screen show actual synced data values, or just metadata about sync status?
   - Or does it redirect to Health Data screen where synced data appears?
   - **Proposed resolution:** Device Integration shows sync status and metadata only; actual data values appear in Health Data screen

3. **Multiple Devices of Same Type:**
   - Can patients connect multiple smart scales (e.g., one at home, one at gym)?
   - If so, how is data from multiple sources of the same type handled?
   - Do patients choose a "primary" device for each data type?

4. **Device Connection Errors:**
   - What specific error types exist (auth expired, API error, device offline, rate limited)?
   - How are different error types communicated to patients?
   - Which errors can patients resolve themselves vs. need support?

### Edge Cases

1. **Concurrent Device Connection:**
   - What happens if a patient tries to connect the same device twice?
   - Should the system detect and prevent duplicate connections?
   - Or show a "this device is already connected" message?

2. **Data Conflicts:**
   - If patient manually logs weight at 10am, then device syncs weight from 10:05am, which is used?
   - How are duplicate or conflicting data points handled?
   - Does one source take priority (device over manual, or newer over older)?

3. **Device Deauthorization by Manufacturer:**
   - What happens if a patient revokes access from the manufacturer's side (not from Cena app)?
   - How does the system detect this and update sync status?
   - What notification does the patient receive?

4. **Long Sync Gaps:**
   - If a device hasn't synced in 30+ days, should it be flagged as potentially disconnected?
   - At what point does the system suggest removing an inactive device?
   - Are there different thresholds for different device types?

5. **Device Battery Died:**
   - If a device's battery dies and it stops syncing, how is this communicated?
   - Can the system differentiate between "device offline" vs. "auth expired" vs. "API error"?
   - Should patients receive proactive notifications when devices stop syncing?

6. **Account Changes:**
   - What happens to connected devices if a patient changes their account email or password?
   - Do device authorizations need to be renewed after account security changes?
   - Are device connections preserved during account migration or data transfers?

### Design Decisions Needing Stakeholder Input

1. **Initial Device Priority:**
   - **Question:** Which device types should be supported at MVP launch?
   - **Options:**
     - Option A: Start with smart scales only (simplest, most common use case)
     - Option B: Scales + fitness trackers (broader appeal)
     - Option C: All device types from day one (most comprehensive but complex)
   - **Trade-offs:** Complexity vs. user value vs. development time

2. **Manual Sync Button:**
   - **Question:** Should patients be able to manually trigger a sync?
   - **Options:**
     - Option A: Yes, include "Sync Now" button on each device card
     - Option B: No, syncs happen automatically only (reduces support burden)
     - Option C: "Sync Now" only available when troubleshooting or in error state
   - **Trade-offs:** User control vs. API rate limits vs. unnecessary sync requests

3. **Device Removal vs. Pause:**
   - **Question:** Should there be a "pause sync" option separate from full disconnect?
   - **Options:**
     - Option A: Only "Disconnect" (full removal, can reconnect later)
     - Option B: "Pause" and "Disconnect" (pause temporarily, disconnect permanently)
   - **Trade-offs:** Flexibility vs. complexity, especially for temporary travel or device issues

4. **Data Type Granularity:**
   - **Question:** Can patients control which data types sync from each device?
   - **Options:**
     - Option A: All-or-nothing (connect device = all its data types sync)
     - Option B: Granular control (checkboxes to enable/disable specific data types)
   - **Trade-offs:** User control vs. UX complexity vs. API limitations

5. **Sync Status Notifications:**
   - **Question:** How proactively should patients be notified about sync issues?
   - **Options:**
     - Option A: Immediate push notification on sync failure
     - Option B: Daily digest of sync status (less intrusive)
     - Option C: No notifications, patient checks manually (least intrusive but risks missed issues)
     - Option D: Ava proactive message in chat when sync issue detected
   - **Trade-offs:** Awareness vs. notification fatigue

6. **Historical Data Import Limit:**
   - **Question:** How much historical data should be imported when connecting a device?
   - **Options:**
     - Option A: All available historical data (complete history but slow initial sync)
     - Option B: Last 90 days only (balanced approach)
     - Option C: Last 30 days only (fast sync but less context)
     - Option D: Let patient choose date range (most flexible but adds complexity)
   - **Trade-offs:** Completeness vs. sync speed vs. storage

---

## Implementation Notes

### Accessibility Considerations

- Device cards must be keyboard navigable with proper focus indicators
- Sync status must not rely solely on color (use icons + text labels)
- Error messages must be clearly announced to screen readers
- OAuth flows must be accessible (consider redirect vs. popup approaches)
- All device type icons need proper alt text
- Connection status changes should be announced to screen readers

### Performance Considerations

- Device list should be paginated for patients with many connected devices
- Sync history should be limited to recent events (e.g., last 50 syncs) with option to load more
- Avoid frequent polling of sync status - use websockets or push notifications for real-time updates
- Cache device manufacturer logos and icons for faster loading

### Security Considerations

- OAuth tokens must be encrypted at rest and in transit
- Never expose API keys or tokens in client-side code
- Implement token refresh logic before expiration when possible
- Log all device connection/disconnection events in audit trail
- Rate limit device connection attempts to prevent abuse
- Validate OAuth callbacks to prevent man-in-the-middle attacks

### Audit Trail Requirements

All device management actions must be logged per CORE_PRINCIPLES.md:

- **Device Connected:** Log patient ID, device type, manufacturer, timestamp, data types authorized
- **Device Disconnected:** Log patient ID, device ID, who disconnected (patient or system), timestamp, reason (if applicable)
- **Authorization Renewed:** Log patient ID, device ID, timestamp
- **Sync Success:** Log device ID, timestamp, number of data points synced, data types
- **Sync Failure:** Log device ID, timestamp, error type, error message

These audit entries should appear as collapsible blocks in the AvaChatPane activity timeline.

---

## Future Enhancements (Out of Scope for Initial Implementation)

- Bluetooth device pairing directly through the app (currently OAuth only)
- Support for multiple devices of the same type with automatic conflict resolution
- Device firmware update notifications and instructions
- Integration with Apple HealthKit and Google Fit as aggregation layers
- Device battery level monitoring and low battery alerts
- Automatic device replacement flow when upgrading to new model
- Device sharing between family members or care partners
- Sync scheduling preferences (e.g., "only sync on WiFi")
- Data export showing which device each data point came from
- Device comparison and recommendations ("upgrade to a device that tracks more metrics")
- Troubleshooting wizard with step-by-step diagnostic flow
