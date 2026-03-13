# ScheduleAppointmentModal

**Type:** Multi-step Modal / Form

**Purpose:** Guides patient through scheduling a new appointment or rescheduling an existing one via a step-by-step wizard interface.

**Usage:** Opened when patient clicks "Schedule New" button or "Reschedule" in appointment details. Can also be opened pre-filled via Ava conversational shortcuts.

---

## Data Fields

- `assignedProviders` (Array of Provider Objects) - Patient's care team
  - Each provider: `{ providerId, providerName, providerRole, appointmentTypes }`
  - Required
  - Used to populate provider selection step

- `defaultProvider` (Provider Object, Optional) - Pre-selected provider
  - Used when opened from specific context (e.g., reschedule, Ava pre-fill)

- `mode` (Enum: "schedule" | "reschedule") - Modal behavior mode
  - Default: "schedule"
  - "reschedule" shows current appointment info for context

- `existingAppointment` (Object, Optional) - Current appointment (reschedule mode only)
  - Used to display "from" time in reschedule flow

- `onClose` (Function) - Handler to close modal
  - Required

- `onScheduleComplete` (Function) - Handler called after successful scheduling
  - Required
  - Receives new appointment object

---

## Step-by-Step Structure

### Step 1: Select Provider
- **Fields:**
  - Provider selection (radio buttons or cards)
  - Shows: Provider name, role, "Assigned" badge
  - Default selection if `defaultProvider` provided

### Step 2: Select Appointment Type
- **Fields:**
  - Appointment mode (radio buttons)
  - Options: Video call, Phone call, In-person (if available for provider)
  - Default: Video call

### Step 3: Select Date & Time
- **Fields:**
  - Calendar/date picker
  - Available time slots for selected date
  - "Show more dates" button to load additional availability
  - Display: Next 14 days initially

### Step 4: Confirm
- **Fields:**
  - Summary of all selections
  - Optional: Patient notes text area
  - Confirm button

---

## Visual Structure (SVG)

### Step 1: Select Provider

```svg
<svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Modal container -->
  <rect x="0" y="0" width="500" height="400" fill="#ffffff" rx="12" stroke="#e5e7eb"/>
  
  <!-- Header -->
  <text x="30" y="40" font-size="18" font-weight="600" fill="#111827">Schedule Appointment</text>
  <text x="460" y="40" font-size="20" fill="#6b7280">[✕]</text>
  
  <!-- Step indicator -->
  <text x="30" y="70" font-size="13" fill="#6b7280">Step 1 of 4: Select Provider</text>
  
  <!-- Provider options -->
  <rect x="30" y="90" width="440" height="70" fill="#f9fafb" stroke="#e5e7eb" stroke-width="1" rx="6"/>
  <circle cx="50" cy="125" r="8" fill="none" stroke="#3b82f6" stroke-width="2"/>
  <circle cx="50" cy="125" r="4" fill="#3b82f6"/>
  <text x="70" y="122" font-size="14" font-weight="600" fill="#111827">Dr. Sarah Chen</text>
  <text x="70" y="140" font-size="12" fill="#6b7280">Registered Dietitian Nutritionist</text>
  <rect x="400" y="115" width="60" height="20" fill="#dbeafe" rx="4"/>
  <text x="412" y="129" font-size="11" fill="#1e40af">Assigned</text>
  
  <rect x="30" y="170" width="440" height="70" fill="#ffffff" stroke="#e5e7eb" stroke-width="1" rx="6"/>
  <circle cx="50" cy="205" r="8" fill="none" stroke="#d1d5db" stroke-width="2"/>
  <text x="70" y="202" font-size="14" fill="#111827">John Martinez</text>
  <text x="70" y="220" font-size="12" fill="#6b7280">Behavioral Health Navigator</text>
  <rect x="400" y="195" width="60" height="20" fill="#dbeafe" rx="4"/>
  <text x="412" y="209" font-size="11" fill="#1e40af">Assigned</text>
  
  <!-- Action buttons -->
  <rect x="360" y="340" width="110" height="40" fill="#d1d5db" rx="6"/>
  <text x="392" y="365" font-size="14" fill="#6b7280">Cancel</text>
</svg>
```

### Step 3: Select Date & Time

```svg
<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
  <!-- Modal container -->
  <rect x="0" y="0" width="500" height="500" fill="#ffffff" rx="12" stroke="#e5e7eb"/>
  
  <!-- Header -->
  <text x="30" y="40" font-size="18" font-weight="600" fill="#111827">Schedule Appointment</text>
  
  <!-- Step indicator -->
  <text x="30" y="70" font-size="13" fill="#6b7280">Step 3 of 4: Select Date & Time</text>
  
  <!-- Calendar -->
  <text x="30" y="110" font-size="16" font-weight="600" fill="#111827">December 2025</text>
  
  <!-- Simplified calendar grid -->
  <rect x="30" y="130" width="440" height="180" fill="#f9fafb" stroke="#e5e7eb" stroke-width="1" rx="6"/>
  <text x="40" y="155" font-size="12" fill="#6b7280">Mon  Tue  Wed  Thu  Fri  Sat  Sun</text>
  
  <!-- Sample dates with availability -->
  <rect x="90" y="170" width="40" height="40" fill="#3b82f6" rx="4"/>
  <text x="103" y="195" font-size="14" font-weight="600" fill="#ffffff">10</text>
  
  <!-- Available times for selected date -->
  <text x="30" y="340" font-size="14" font-weight="600" fill="#111827">Available times for Tue Dec 10:</text>
  
  <!-- Time slot options -->
  <rect x="30" y="360" width="90" height="36" fill="#ffffff" stroke="#d1d5db" stroke-width="1" rx="6"/>
  <text x="52" y="383" font-size="13" fill="#374151">9:00 AM</text>
  
  <rect x="130" y="360" width="90" height="36" fill="#3b82f6" rx="6"/>
  <text x="148" y="383" font-size="13" fill="#ffffff">2:00 PM</text>
  
  <rect x="230" y="360" width="90" height="36" fill="#ffffff" stroke="#d1d5db" stroke-width="1" rx="6"/>
  <text x="248" y="383" font-size="13" fill="#374151">4:30 PM</text>
  
  <!-- Show more -->
  <text x="30" y="425" font-size="13" fill="#3b82f6">Show more dates →</text>
  
  <!-- Action buttons -->
  <rect x="240" y="450" width="110" height="40" fill="#e5e7eb" rx="6"/>
  <text x="280" y="475" font-size="14" fill="#374151">Back</text>
  
  <rect x="360" y="450" width="110" height="40" fill="#3b82f6" rx="6"/>
  <text x="385" y="475" font-size="14" fill="#ffffff">Continue</text>
</svg>
```

---

## States

- **Step 1-4:** Each step has its own view
- **Loading:** Fetching provider availability
- **Selecting:** User making selections
- **Validating:** Checking if selections are valid
- **Submitting:** API call in progress
- **Success:** Confirmation, modal closes
- **Error:** Error message with retry option

---

## Interactions

- **Provider Selection:** Click provider card to select
- **Date Selection:** Click date in calendar
- **Time Selection:** Click time slot button
- **Navigation:** Back/Continue buttons between steps
- **Submit:** Final "Confirm Appointment" button
- **Cancel:** Close modal at any step (with confirmation if data entered)

---

## Accessibility

- `role="dialog"` with `aria-modal="true"`
- Step indicator for screen readers
- Each step clearly labeled
- Focus management between steps
- Keyboard navigation for all selections
- Cancel button always accessible

---

## Notes

- Modal can be pre-filled by Ava (provider, date, time pre-selected)
- Reschedule mode shows original appointment for context
- Availability fetched dynamically when step 3 loads
- Default view: Next 14 days, "Show more" loads additional weeks
- Date formatting follows CORE_PRINCIPLES.md standards
