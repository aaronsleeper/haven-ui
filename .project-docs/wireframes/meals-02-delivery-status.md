# MEALS-02: Delivery Status

**Application:** Patient Portal (Mobile)
**Use Case(s):** PT-MEALS-002
**User Type:** Patient
**Device:** Mobile-first
**Route:** `/deliveries`

## Page Purpose

Give the patient visibility into their delivery status and a structured way to report issues on delivery day.

---

## Layout Structure

### Shell
- Bottom tab bar persistent; "Deliveries" tab active

### Header Zone
- **Component:** Plain stacked text, `px-4 pt-6 pb-2`
- Page title: "Delivery" -- Lora, large
- Subtitle: "Expected [day], [date]" -- `text-sm text-gray-500`

### Content Zone

#### Delivery Status Card
- **Component:** `.card`, `mx-4`
- Top section: large centered status indicator
  - Icon + status label + timing, stacked vertically:

  | Status | Icon | Label | Timing text |
  |--------|------|-------|-------------|
  | Preparing | `fa-kitchen-set text-warning-500` | "Preparing your meals" | "Arriving between 10am – 2pm" |
  | Out for delivery | `fa-truck text-primary-500` | "On the way" | "Arriving between 10am – 2pm" |
  | Delivered | `fa-circle-check text-success-500` | "Delivered" | "Delivered at 11:43am" |

  - Icon: centered, large (`text-5xl`)
  - Status label: Lora, `text-xl`, centered, below icon
  - Timing: `text-sm text-gray-500`, centered, below label

- Divider
- Bottom section: delivery summary
  - Label: "What's coming" -- `text-xs uppercase tracking-wide text-gray-500`
  - Meal count: "[N] meals" -- `text-sm font-medium`
  - Up to 3 meal names: plain `ul` list, `text-sm text-gray-600`
  - "See full list" text link if more than 3 meals (navigates to `/meals`)

#### Report an Issue
- **Component:** `.card`, `mx-4 mt-3`
- Always visible (patients may notice problems before or after delivery)
- Card header: "Something wrong?" -- `text-sm font-medium`
- **Default:** `.btn-outline` full width: `fa-triangle-exclamation` "Report an issue"
- **After submission:** Confirmation replaces button -- `fa-circle-check text-success-600` "Issue reported. Your care team will follow up."

##### Issue Report Form (inline expansion)
Expands inside the card on button tap -- no new screen or modal.
- **Fields:**
  1. Issue type -- full-width stacked `.btn-outline` buttons (tap to select one):
     - `fa-box-open` "Meals not delivered"
     - `fa-utensils` "Wrong meals"
     - `fa-trash` "Damaged packaging"
     - `fa-circle-question` "Something else"
  2. Optional text area: "Tell us more (optional)" -- standard `textarea`, 3 rows
  3. `.btn-primary` "Submit report"
  4. Text link: "Cancel"
- Issue type selection is required to enable Submit

#### Message Care Team Shortcut
- **Component:** Centered text link below the issue card
- "Questions? Message your care team" -- `text-sm text-primary-600`
- Navigates to `/care-team/messages`

---

## Interaction Specifications

### "Report an Issue" Button
- **Trigger:** Patient taps "Report an issue"
- **Feedback:** Card expands inline to show the issue form; smooth expand animation

### Submit Issue Report
- **Trigger:** Patient taps "Submit report" with an issue type selected
- **Feedback:** Form collapses; confirmation message appears in the card -- `fa-circle-check text-success-600` "Issue reported. Your care team will follow up."
- **Error handling:** Inline error below submit button -- "We couldn't send your report. Try again?" with retry

### Cancel Issue Report
- **Trigger:** Patient taps "Cancel"
- **Feedback:** Form collapses; card returns to the "Report an issue" button

---

## States

### No Active Delivery
- **Component:** Empty state card replacing the status card
- Icon: `fa-calendar-days text-gray-300`
- Heading: "No delivery scheduled right now"
- Message: "Your next delivery will show up here once it's scheduled."
- Issue card remains visible

### Loading State
- Skeleton card matching the status card dimensions

### Status Unavailable
- Status card shows: `fa-circle-exclamation text-warning-500` -- "Status unavailable"
- Sub-text: "Last updated: [timestamp]" -- `text-xs text-gray-400`
- "Refresh" text link -- `text-sm text-primary-600`
- Issue reporting remains fully functional

### Delivered State
- Status card shows delivered confirmation
- Issue card remains visible (problems may be noticed after the driver leaves)

---

## Accessibility Notes
- Status must be communicated with icon + label + color (not color alone)
- Issue type buttons must be keyboard-selectable with clear focus ring
- Inline form expansion must announce itself to screen readers (`aria-live="polite"`)

## Bilingual Considerations
- All status labels, timing text, and issue type options must be in Spanish when language is set to Español
- Timestamps use locale-appropriate format (Spanish: DD/MM not MM/DD)

## Open Questions
- What are the exact status states exposed to the patient UI? (Preparing / Out for delivery / Delivered is assumed -- confirm with Andrey.)
- Should the Delivery tab in the bottom nav show a visual indicator (dot or badge) when a delivery is active today?
