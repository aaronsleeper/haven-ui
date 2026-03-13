# AppointmentDetailsModal

**Type:** Modal / Overlay

**Purpose:** Displays comprehensive details about a specific appointment, including provider information, notes, virtual visit links, and action buttons for rescheduling, cancelling, or joining the appointment.

**Usage:** Opened when user clicks an AppointmentCard. Provides full context and actions for managing a single appointment.

---

## Data Fields

- `appointment` (Object) - Complete appointment data
  - `appointmentId` (String, UUID) - Required
  - `scheduledDateTime` (ISO 8601 Timestamp) - Required
    - Display: "Tue Dec 10 2025 at 2:00 PM Pacific"
  - `providerName` (String) - Required
  - `providerRole` (String) - Required
  - `appointmentMode` (Enum) - Required
  - `duration` (Number) - Required
  - `status` (Enum) - Required
  - `providerNotes` (String, Optional) - Notes visible to patient
  - `patientNotes` (String, Optional) - Patient's own notes
  - `virtualVisitLink` (String, Optional) - For video appointments
  - `phoneNumber` (String, Optional) - For phone appointments
  - `location` (String, Optional) - For in-person appointments

- `onClose` (Function) - Handler to close modal
  - Required

- `onReschedule` (Function) - Handler to initiate reschedule flow
  - Required

- `onCancel` (Function) - Handler to cancel appointment
  - Required

- `onJoinCall` (Function) - Handler to join virtual visit
  - Required (but button only shown when applicable)

---

## Visual Structure (SVG)

```svg
<svg viewBox="0 0 500 600" xmlns="http://www.w3.org/2000/svg">
  <!-- Modal overlay background -->
  <rect x="0" y="0" width="500" height="600" fill="#000000" opacity="0.5"/>
  
  <!-- Modal container -->
  <rect x="50" y="50" width="400" height="500" fill="#ffffff" rx="12" stroke="#e5e7eb" stroke-width="1"/>
  
  <!-- Header with close button -->
  <text x="70" y="85" font-size="20" font-weight="600" fill="#111827">Appointment Details</text>
  <text x="420" y="85" font-size="24" fill="#6b7280">[✕]</text>
  
  <!-- Appointment date/time -->
  <text x="70" y="130" font-size="16" font-weight="600" fill="#111827">Tue Dec 10 2025 at 2:00 PM Pacific</text>
  
  <!-- Provider info -->
  <text x="70" y="160" font-size="14" fill="#374151">Dr. Sarah Chen</text>
  <text x="70" y="180" font-size="13" fill="#6b7280">Registered Dietitian Nutritionist</text>
  
  <!-- Info section box -->
  <rect x="70" y="200" width="360" height="200" fill="#f9fafb" rx="6"/>
  
  <!-- Info labels and values -->
  <text x="85" y="225" font-size="13" font-weight="600" fill="#374151">Appointment Type:</text>
  <text x="220" y="225" font-size="13" fill="#6b7280">Video call</text>
  
  <text x="85" y="250" font-size="13" font-weight="600" fill="#374151">Duration:</text>
  <text x="220" y="250" font-size="13" fill="#6b7280">30 minutes</text>
  
  <text x="85" y="280" font-size="13" font-weight="600" fill="#374151">Provider Notes:</text>
  <text x="85" y="305" font-size="12" fill="#6b7280">Please bring your food journal to discuss</text>
  <text x="85" y="322" font-size="12" fill="#6b7280">your eating patterns from last week.</text>
  
  <text x="85" y="352" font-size="13" font-weight="600" fill="#374151">Your Notes:</text>
  <text x="85" y="377" font-size="12" fill="#6b7280">Ask about meal prep strategies</text>
  
  <!-- Join Call button (primary) -->
  <rect x="70" y="420" width="360" height="44" fill="#3b82f6" rx="6"/>
  <text x="200" y="447" font-size="14" font-weight="600" fill="#ffffff">Join Call</text>
  
  <!-- Action buttons (secondary) -->
  <rect x="70" y="480" width="170" height="40" fill="#ffffff" stroke="#d1d5db" stroke-width="1" rx="6"/>
  <text x="112" y="505" font-size="14" fill="#374151">Reschedule</text>
  
  <rect x="260" y="480" width="170" height="40" fill="#ffffff" stroke="#d1d5db" stroke-width="1" rx="6"/>
  <text x="280" y="505" font-size="14" fill="#dc2626">Cancel Appointment</text>
</svg>
```

---

## States

- **Default:** Modal open, all content visible
- **Join Call Available:** "Join Call" button enabled (within time window)
- **Join Call Not Yet:** Button disabled with countdown timer
- **Join Call Expired:** Button hidden or disabled
- **Loading:** Spinner while fetching details
- **Error:** Error message with retry option

---

## Interactions

- **Close:** Click X button or click outside modal (closes modal)
- **Join Call:** Opens video/phone interface (when available)
- **Reschedule:** Opens ScheduleAppointmentModal in reschedule mode
- **Cancel:** Shows confirmation dialog, then cancels appointment
- **Edit Notes:** Patient can edit their own notes (if feature enabled)

---

## Accessibility

- `role="dialog"` with `aria-modal="true"`
- `aria-labelledby` pointing to modal title
- Focus trapped within modal while open
- Escape key closes modal
- First focusable element receives focus on open
- WCAG AA contrast for all text

---

## Notes

- Join Call button availability determined by time window (e.g., 15 min before to 1 hour after)
- Provider notes only shown if explicitly shared with patient
- Modal should be responsive (smaller width on mobile, potentially full-screen)
- Close on Esc key or click outside (with confirmation if form data entered)
