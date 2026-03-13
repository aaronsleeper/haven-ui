# QuickActionsPanel

**Type:** Panel / Button Group Component

**Purpose:** Provides quick access to the 3 most common patient actions from the Home Dashboard: logging health data, ordering meals, and scheduling appointments.

**Usage:** Displayed prominently near the top of the Home Dashboard, below the progress overview cards. Makes frequent actions easily accessible without navigating through menus.

**Data Fields:**

- `actions` (Array of Action Objects) - List of quick action configurations
  - Each action contains:
    - `label` (String) - Button text (e.g., "Log Health Data")
    - `onClick` (Function) - Navigation target or modal trigger
    - `icon` (String/Component, optional) - Visual icon for the action
  - Required
  - Fixed to 3 actions: "Log Health Data", "Order Meals", "Schedule Appointment"

**Visual Structure (SVG):**

```svg
<svg viewBox="0 0 600 100" xmlns="http://www.w3.org/2000/svg">
  <!-- Panel background -->
  <rect x="0" y="0" width="600" height="100" fill="#f9fafb" stroke="#e5e7eb" stroke-width="1" rx="8"/>

  <!-- Quick Actions title (optional) -->
  <text x="20" y="25" font-size="12" font-weight="600" fill="#6b7280">Quick Actions</text>

  <!-- Button 1: Log Health Data -->
  <rect x="20" y="40" width="180" height="48" fill="#3b82f6" rx="6"/>
  <text x="110" y="68" font-size="14" font-weight="600" fill="#ffffff" text-anchor="middle">Log Health Data</text>

  <!-- Button 2: Order Meals -->
  <rect x="210" y="40" width="180" height="48" fill="#3b82f6" rx="6"/>
  <text x="300" y="68" font-size="14" font-weight="600" fill="#ffffff" text-anchor="middle">Order Meals</text>

  <!-- Button 3: Schedule Appointment -->
  <rect x="400" y="40" width="180" height="48" fill="#3b82f6" rx="6"/>
  <text x="490" y="68" font-size="14" font-weight="600" fill="#ffffff" text-anchor="middle">Schedule Appointment</text>
</svg>
```

**States:**

- **Default:** All buttons in normal state
- **Hover:** Individual button hover state (darker background, slight shadow)
- **Active:** Button pressed state (slightly darker, inset appearance)
- **Disabled:** Button grayed out if action unavailable (rare, but possible for permissions)
- **Loading:** Spinner or loading indicator if action triggers async operation

**Interactions:**

- **Click "Log Health Data"** → Navigate to health data logging screen or open LogDataModal
- **Click "Order Meals"** → Navigate to meal ordering screen
- **Click "Schedule Appointment"** → Open ScheduleAppointmentModal or navigate to appointments screen
- **Keyboard navigation** → Tab through buttons, activate with Enter/Space

**Accessibility:**

- **ARIA labels:**
  - Each button has clear, descriptive text
  - Optional: `aria-describedby` for additional context if needed
- **Keyboard navigation:**
  - All buttons focusable with Tab key
  - Activatable with Enter or Space
  - Logical tab order (left to right)
- **Screen reader support:**
  - Buttons announced with their labels
  - Panel structure clear (e.g., `role="group"` with `aria-label="Quick Actions"`)
- **Visual considerations:**
  - High contrast between button text and background
  - Touch targets at least 44x44px for mobile
  - Clear visual separation between buttons
  - Icons (if used) have text alternatives
