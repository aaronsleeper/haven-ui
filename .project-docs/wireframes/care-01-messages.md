# CARE-01: Messages

**Application:** Patient Portal (Mobile)
**Use Case(s):** PT-CARE-001
**User Type:** Patient
**Device:** Mobile-first
**Route:** `/care-team/messages`

## Page Purpose

Give the patient a familiar, SMS-like thread for async communication with their care team.

---

## Layout Structure

### Shell
- Bottom tab bar persistent; "Care Team" tab active
- Unread message badge on "Care Team" tab (managed at shell level -- see `shell-bottom-nav.md`)

### Header Zone
- **Component:** Plain stacked text, `px-4 pt-6 pb-2`
- Page title: "Your Care Team" -- Lora, large
- Subtitle: "Your dietitian & your coordinator" -- `text-sm text-gray-500`
  - Fallback if names unavailable: "Your care team"
- Single unified thread for MVP (no tabs or per-member filters)

### Content Zone

#### Message Thread
- **Component:** Scrollable list, `px-4`, fills the area between header and compose bar
- Auto-scrolls to the most recent message on load

##### Outgoing messages (patient)
- Right-aligned bubble: `bg-primary-500 text-white rounded-2xl rounded-br-sm px-4 py-2 max-w-[80%] ml-auto`
- Timestamp below: `text-xs text-gray-400 text-right`

##### Incoming messages (care team)
- Left-aligned bubble: `bg-gray-100 text-gray-900 rounded-2xl rounded-bl-sm px-4 py-2 max-w-[80%]`
- Sender label above bubble (first message in a consecutive group only): `text-xs text-gray-500` -- "Your dietitian" or "Your coordinator"
- Timestamp below: `text-xs text-gray-400`

##### Date separators
- Centered between day groups: `text-xs text-gray-400 text-center py-2` -- "Today", "Yesterday", "Feb 14"

##### Image attachments
- Rendered inline in the message bubble: `rounded-lg max-w-full`, tappable to full-screen view
- If attachment only (no text): shown as a standalone bubble

#### "New Message" Pill
- Shown when the patient has scrolled up and a new message arrives
- **Component:** Floating pill at bottom of thread -- `bg-primary-500 text-white rounded-full text-sm px-3 py-1`
- Tapping scrolls to the bottom and dismisses the pill
- Announced via `aria-live="polite"`

### Footer / Compose Zone
- **Component:** Sticky bar, `position: sticky; bottom: [tab-bar-height]; bg-white border-t border-gray-200 p-3`
- Layout: attachment button | auto-growing textarea | send button
- `textarea`: 1 row default, expands to 4 rows max; placeholder "Message your care team..." / "Escríbele a tu equipo..."
- Attachment button: `.btn-icon` `fa-image` -- opens native image picker (single image)
- Send button: `.btn-icon-primary` `fa-paper-plane` -- disabled when textarea is empty and no attachment pending

---

## Interaction Specifications

### Send a Message
- **Trigger:** Patient taps send button
- **Feedback:** Bubble appears immediately with a "Sending..." indicator that resolves to a timestamp on success
- **Error handling:** Bubble shows `fa-triangle-exclamation text-error-500` with "Tap to retry"

### Attach an Image
- **Trigger:** Patient taps the attachment icon
- **Feedback:** Native image picker opens; selected image shows as a thumbnail preview in the compose area with an `fa-xmark` remove button; patient sends or removes before sending
- **Error handling:** Inline error below compose area -- "Couldn't attach image. Try again."

### Receive a Message
- **Trigger:** New message arrives
- **Feedback:** Bubble appended at bottom; auto-scrolls if patient is near the bottom; shows "New message" pill if patient has scrolled up

### Deep-Link with Pre-Filled Text
- **Trigger:** Patient arrives via a shortcut from another screen (e.g., the meals screen's "Message your care team" link)
- **Feedback:** Compose textarea pre-populated with context text (e.g., "Question about my meals"); cursor placed at end; patient can edit before sending

### Mark as Read
- **Trigger:** Patient opens the messages screen
- **Feedback:** Unread badge on the Care Team tab clears

---

## States

### Empty State
- **Component:** Empty state card centered in the thread area
- Icon: `fa-comments text-gray-300`, large
- Heading: "No messages yet"
- Message: "Have a question about your meals or your care? Send us a message."
- No CTA needed (compose bar is always visible)

### Loading State
- 3-4 skeleton bubbles (alternating left/right alignment) while thread loads

### Error State
- Error alert above compose bar: "We couldn't load your messages. Check your connection." with retry

---

## Accessibility Notes
- Message bubbles must remain readable at 200% text zoom without horizontal scrolling
- Attachment button: `aria-label="Attach image"`
- Send button: `aria-label="Send message"`, reflects disabled state via `aria-disabled`
- Compose textarea supports voice dictation (native mobile keyboard behavior)

## Bilingual Considerations
- Sender labels in Spanish: "Tu dietista", "Tu coordinador/coordinadora"
- Date separators localized: "Hoy", "Ayer"
- Pre-filled text from deep links must be provided in the patient's selected language
- Care team and patient each write in their own language; no in-app translation

## Open Questions
- Should a care team response time expectation be surfaced to the patient ("We typically respond within [X] hours")?
- Should "read" receipts (double-check marks) be shown to the patient?
