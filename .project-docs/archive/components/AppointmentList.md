# AppointmentList

**Type:** Container / List Component

**Purpose:** Displays a chronologically organized list of patient appointments, separated into upcoming and past sections.

**Usage:** Used on the Appointments screen as the main content area to show all patient appointments.

---

## Data Fields

- `appointments` (Array of AppointmentObjects) - List of all patient appointments
  - Required
  - Should include both upcoming and past appointments
  - Sorted chronologically (upcoming: soonest first, past: most recent first)

- `onAppointmentClick` (Function) - Callback when an appointment card is clicked
  - Required
  - Parameters: `appointmentId` (String)
  - Opens appointment details modal

- `emptyStateMessage` (String, Optional) - Message shown when no appointments exist
  - Default: "No appointments scheduled"

---

## Visual Structure (SVG)

```svg
<svg viewBox="0 0 600 500" xmlns="http://www.w3.org/2000/svg">
  <!-- Container -->
  <rect x="0" y="0" width="600" height="500" fill="#ffffff" stroke="#e0e0e0"/>

  <!-- Upcoming Section -->
  <text x="20" y="30" font-size="14" font-weight="bold" fill="#333">UPCOMING APPOINTMENTS</text>
  <line x1="20" y1="40" x2="580" y2="40" stroke="#e0e0e0"/>

  <!-- Appointment Card 1 -->
  <rect x="20" y="50" width="560" height="80" fill="#f9f9f9" stroke="#ddd" rx="4"/>
  <text x="30" y="75" font-size="16" font-weight="600" fill="#000">Tue Dec 10 2025 at 2:00 PM Pacific</text>
  <text x="30" y="95" font-size="14" fill="#555">Dr. Sarah Chen - Registered Dietitian Nutritionist</text>
  <text x="30" y="115" font-size="12" fill="#777">Video call • 30 minutes</text>

  <!-- Appointment Card 2 -->
  <rect x="20" y="140" width="560" height="80" fill="#f9f9f9" stroke="#ddd" rx="4"/>
  <text x="30" y="165" font-size="16" font-weight="600" fill="#000">Thu Dec 12 2025 at 10:00 AM Pacific</text>
  <text x="30" y="185" font-size="14" fill="#555">John Martinez - Behavioral Health Navigator</text>
  <text x="30" y="205" font-size="12" fill="#777">Phone call • 45 minutes</text>

  <!-- Past Section -->
  <text x="20" y="250" font-size="14" font-weight="bold" fill="#333">PAST APPOINTMENTS</text>
  <line x1="20" y1="260" x2="580" y2="260" stroke="#e0e0e0"/>

  <!-- Past Appointment Card -->
  <rect x="20" y="270" width="560" height="80" fill="#f9f9f9" stroke="#ddd" rx="4"/>
  <text x="30" y="295" font-size="16" font-weight="600" fill="#666">Dec 3, 2025</text>
  <text x="30" y="315" font-size="14" fill="#555">Dr. Sarah Chen - Registered Dietitian Nutritionist</text>
  <text x="30" y="335" font-size="12" fill="#777">Completed • Video call</text>
</svg>
```

---

## States

### Default
- Shows appointments grouped into "UPCOMING APPOINTMENTS" and "PAST APPOINTMENTS" sections
- Upcoming appointments display full date/time format
- Past appointments display date only (time less relevant)
- Each section header is bold, uppercase, with divider line

### Empty (No Upcoming Appointments)
- "UPCOMING APPOINTMENTS" section shows empty state message: "No upcoming appointments scheduled"
- CTA suggestion could be displayed: "Schedule your first appointment"

### Empty (No Past Appointments)
- "PAST APPOINTMENTS" section shows: "No past appointments"
- Or section is hidden entirely if no past appointments exist

### Loading
- Skeleton screens or loading spinner while fetching appointment data

### Error
- Error message displayed if appointments cannot be loaded
- Retry button provided

---

## Interactions

### Appointment Card Click
- **Trigger:** User clicks/taps on any AppointmentCard within the list
- **Action:** Calls `onAppointmentClick(appointmentId)` callback
- **Result:** Opens AppointmentDetailsModal with selected appointment details

### Scroll Behavior
- If appointment list is long, container should be scrollable
- Consider "scroll to today" or "scroll to next appointment" functionality

---

## Layout Behavior

### Grouping Logic
- **Upcoming Appointments:**
  - Includes all appointments with status "Scheduled" and scheduledDateTime >= current time
  - Sorted ascending by scheduledDateTime (soonest first)

- **Past Appointments:**
  - Includes all appointments with status "Completed", "Cancelled", or "No-Show"
  - OR appointments with scheduledDateTime < current time
  - Sorted descending by scheduledDateTime (most recent first)

### Section Visibility
- If no upcoming appointments, show empty state for upcoming section
- If no past appointments, either show empty state or hide section entirely (design decision)
- At least one section should always be visible

---

## Accessibility

### ARIA Labels
- Container: `role="list"` with `aria-label="Your appointments"`
- Section headers: `role="heading"` with appropriate `aria-level`
- Each appointment card: `role="listitem"` with descriptive `aria-label` including date, provider, and type

### Keyboard Navigation
- Entire list should be keyboard navigable
- Tab key moves between appointment cards
- Enter or Space key activates card (same as click)

### Screen Reader Support
- Announce number of appointments in each section
- Read appointment details in logical order: date/time, provider name, appointment type
- Announce appointment status clearly (especially for cancelled or no-show)

---

## Responsive Design

### Desktop
- List takes up main content area, with AvaChatPane on right side
- AppointmentCards display full details

### Tablet
- Similar to desktop, possibly narrower cards
- Ava chat pane may be collapsible

### Mobile
- Full width cards
- Ava chat pane accessible via overlay or bottom sheet
- Consider card height optimization for smaller screens

---

## Performance Considerations

- **Pagination:** If patient has many appointments (50+), implement pagination or infinite scroll
- **Virtual Scrolling:** For very long lists, consider virtual scrolling to render only visible items
- **Initial Load:** Load upcoming appointments first, then past appointments asynchronously

---

## Future Enhancements (Out of Scope)

- Filter appointments by provider, type, or date range
- Search functionality
- Export appointment list to calendar file
- Sorting options (by date, by provider, by type)
- "Jump to next appointment" button