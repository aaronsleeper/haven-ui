# AppointmentCard

**Type:** Interactive List Item / Card

**Purpose:** Displays a summary of a single appointment in a list view, providing key information at a glance and serving as a clickable entry point to view full appointment details.

**Usage:** Used within AppointmentList component on the Appointments screen. Multiple cards are displayed in chronological order, separated into "Upcoming" and "Past" sections.

---

## Data Fields

- `appointmentId` (String, UUID) - Unique identifier
  - Required
  - Used for click handlers and data fetching

- `scheduledDateTime` (ISO 8601 Timestamp) - Appointment date and time
  - Required
  - Format: "Tue Dec 10 2025 at 2:00 PM Pacific" (upcoming appointments)
  - Format: "Dec 3, 2025" (past appointments - time less critical)

- `providerName` (String) - Care team member's name
  - Required
  - Example: "Dr. Sarah Chen"
  - Display: Full name

- `providerRole` (String) - Provider type/title
  - Required
  - Example: "Registered Dietitian Nutritionist" or "Behavioral Health Navigator"
  - Display: May be truncated on small screens ("Registered Dietitian Nutr...")

- `appointmentMode` (Enum: "video" | "phone" | "in-person") - How appointment is conducted
  - Required
  - Display as: "Video call", "Phone call", "In-person"

- `duration` (Number) - Appointment length in minutes
  - Required
  - Format: Display as "[duration] minutes" (e.g., "30 minutes", "45 minutes")

- `status` (Enum: "scheduled" | "completed" | "cancelled" | "no-show") - Appointment state
  - Required
  - Affects styling and which section (upcoming/past) the card appears in

- `onClick` (Function) - Handler to open AppointmentDetailsModal
  - Required

---

## Visual Structure (SVG)

```svg
<svg viewBox="0 0 600 120" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="600" height="120" fill="#ffffff" stroke="#e5e7eb" stroke-width="1" rx="8"/>
  <text x="20" y="35" font-size="18" font-weight="600" fill="#111827">Tue Dec 10 2025 at 2:00 PM Pacific</text>
  <text x="20" y="60" font-size="14" fill="#374151">Dr. Sarah Chen - Registered Dietitian Nutritionist</text>
  <text x="20" y="85" font-size="13" fill="#6b7280">Video call • 30 minutes</text>
  <path d="M 560 55 L 575 60 L 560 65" stroke="#9ca3af" stroke-width="2" fill="none"/>
</svg>
```

---

## States

- **Default:** White background, gray border
- **Hover:** Subtle background change, pointer cursor
- **Active/Pressed:** Darker background for tactile feedback
- **Past:** Muted colors and background
- **Cancelled:** Red "Cancelled" text, muted styling
- **No-Show:** Orange "Missed" text, muted styling

---

## Interactions

- **Click/Tap:** Opens AppointmentDetailsModal
- **Keyboard:** Tab to focus, Enter/Space to activate

---

## Accessibility

- `role="button"` with `tabindex="0"`
- `aria-label="Appointment with [Provider] on [Date/Time]. Click to view details"`
- Keyboard navigable
- WCAG AA contrast ratios
- Minimum 44x44px touch target on mobile
