# MessagePreviewCard

**Type:** Card / List Item Component

**Purpose:** Displays a preview of a message in the Messages section of the Home Dashboard, showing sender, subject, preview text, and read/unread status.

**Usage:** Used on the Home Dashboard to show the 3 most recent unread messages. Each card is clickable to open the full message.

**Data Fields:**

- `senderName` (String) - Name of message sender
  - Examples: "Dr. Martinez", "Care Team", "System"
  - Required
- `subject` (String) - Message subject line
  - Examples: "Lab results ready", "Weekly check-in"
  - Required
- `previewText` (String) - First ~100 characters of message body
  - Truncated with ellipsis if longer
  - Required
- `timestamp` (DateTime) - When message was sent
  - Format: Relative time (e.g., "2 hours ago", "Yesterday")
  - Required
- `isRead` (Boolean) - Read/unread status
  - Determines visual styling
  - Required
- `messageId` (String) - Unique message identifier
  - Used for navigation
  - Required

**Visual Structure (SVG):**

```svg
<svg viewBox="0 0 480 100" xmlns="http://www.w3.org/2000/svg">
  <!-- Card background (unread has subtle highlight) -->
  <rect x="0" y="0" width="480" height="100" fill="#eff6ff" stroke="#e5e7eb" stroke-width="1" rx="6"/>

  <!-- Unread indicator dot -->
  <circle cx="12" cy="20" r="5" fill="#3b82f6"/>

  <!-- Sender name -->
  <text x="26" y="24" font-size="13" font-weight="600" fill="#1a1a1a">Dr. Martinez</text>

  <!-- Timestamp -->
  <text x="440" y="24" font-size="11" fill="#6b7280" text-anchor="end">2 hours ago</text>

  <!-- Subject -->
  <text x="26" y="46" font-size="14" font-weight="600" fill="#1f2937">Lab results ready</text>

  <!-- Preview text -->
  <text x="26" y="66" font-size="12" fill="#4b5563">Your recent lab work has been completed and reviewed...</text>

  <!-- Click indicator / arrow -->
  <path d="M 450 85 L 460 90 L 450 95" stroke="#9ca3af" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="translate(0, -40)"/>
</svg>
```

**States:**

- **Unread:** Blue background tint, bold subject, unread indicator dot visible
- **Read:** Normal white background, regular weight text, no indicator dot
- **Hover:** Subtle background change, shadow, cursor pointer
- **Active/Clicked:** Navigate to full message view
- **Loading:** Skeleton loader while fetching message data

**Interactions:**

- **Click on card** → Navigate to full message view in messages screen
- **Mark as read** → Automatically marked as read when viewed
- **Hover** → Highlight card

**Accessibility:**

- **ARIA labels:**
  - `role="link"` for the card
  - `aria-label="Unread message from Dr. Martinez: Lab results ready, sent 2 hours ago"`
  - `aria-live="polite"` for new message notifications (if real-time)
- **Keyboard navigation:**
  - Focusable with Tab key
  - Activatable with Enter
- **Screen reader support:**
  - Read/unread status announced
  - Sender, subject, and time read in logical order
  - Preview text included for context
- **Visual considerations:**
  - Unread status indicated by both color AND icon (blue dot)
  - Sufficient color contrast for all text
  - Touch targets adequate for mobile
  - Font weight difference between read/unread clearly visible
