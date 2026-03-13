# AvaChatPane

**Type:** Container / Persistent Panel Component

**Purpose:** Persistent right-side chat interface that houses Ava, the AI care assistant. Always visible throughout the application, providing context-aware assistance and maintaining conversation history.

**Usage:** Fixed position on the right side of all screens (desktop) or overlay/bottom drawer (mobile). Contains AvaChatMessages, AvaChatInput, and displays AvaActionLog blocks for audit trail.

**Data Fields:**

- `greetingText` (String, optional) - Context-aware ephemeral greeting based on current screen
  - Changes when user navigates to different screens
  - Removed if user navigates away without interacting
  - Optional
- `conversationHistory` (Array of Message Objects) - Persistent chat history
  - Each contains: `sender` (Enum: "patient" | "ava"), `content` (String), `timestamp` (DateTime), `actionLog` (Object, optional)
  - Required
- `pageContext` (String) - Current screen identifier for contextual assistance
  - Examples: "home-dashboard", "health-data", "appointments"
  - Used by Ava to provide relevant suggestions
  - Required
- `patientId` (String) - Patient identifier for session
  - Required for security and data access
  - Required
- `isAvaTyping` (Boolean) - Indicates Ava is generating response
  - Shows typing indicator
  - Required

**Visual Structure (SVG):**

```svg
<svg viewBox="0 0 350 800" xmlns="http://www.w3.org/2000/svg">
  <!-- Chat pane container -->
  <rect x="0" y="0" width="350" height="800" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>

  <!-- Header -->
  <rect x="0" y="0" width="350" height="60" fill="#f9fafb" stroke="#e5e7eb" stroke-width="0 0 1 0"/>
  <circle cx="30" cy="30" r="16" fill="#3b82f6"/>
  <text x="52" y="28" font-size="14" font-weight="600" fill="#1a1a1a">Ava</text>
  <text x="52" y="42" font-size="11" fill="#6b7280">Your care assistant</text>

  <!-- Messages area (AvaChatMessages component) -->
  <rect x="0" y="60" width="350" height="660" fill="#ffffff"/>
  <text x="175" y="100" font-size="12" fill="#9ca3af" text-anchor="middle">[AvaChatMessages]</text>

  <!-- Example greeting message -->
  <rect x="16" y="120" width="318" height="60" fill="#eff6ff" rx="8"/>
  <text x="24" y="140" font-size="12" fill="#1e40af">Great to see you! You've logged</text>
  <text x="24" y="156" font-size="12" fill="#1e40af">your weight 5 days in a row.</text>
  <text x="24" y="172" font-size="12" fill="#1e40af">Ready to log today's data?</text>

  <!-- Action log example -->
  <rect x="16" y="200" width="318" height="40" fill="#f0fdf4" stroke="#86efac" rx="6"/>
  <text x="24" y="218" font-size="11" font-weight="600" fill="#15803d">▼ Weight Logged</text>
  <text x="24" y="232" font-size="11" fill="#166534">185 lbs → 183 lbs</text>

  <!-- Input area (AvaChatInput component) -->
  <rect x="0" y="720" width="350" height="80" fill="#f9fafb" stroke="#e5e7eb" stroke-width="1 0 0 0"/>
  <rect x="16" y="736" width="280" height="48" fill="#ffffff" stroke="#d1d5db" rx="24"/>
  <text x="28" y="763" font-size="13" fill="#9ca3af">Type message to Ava...</text>

  <!-- Send button -->
  <circle cx="314" cy="760" r="18" fill="#3b82f6"/>
  <path d="M 308 760 L 318 760 L 318 754 L 320 760 L 318 766 L 318 760" fill="#ffffff"/>
</svg>
```

**States:**

- **Default:** Chat history and input visible
- **Ava typing:** Typing indicator shown in messages area
- **Greeting visible:** Ephemeral greeting shown at top of conversation
- **No greeting:** Standard conversation view without contextual greeting
- **Mobile collapsed:** Chat hidden, accessible via floating button
- **Mobile expanded:** Chat overlay full screen or bottom drawer

**Interactions:**

- **Type message** → AvaChatInput handles input
- **Send message** → Message sent to Ava, response generated
- **Click action log** → Expand/collapse audit trail details
- **Navigate to different screen** → Greeting updates, old greeting removed if not interacted with
- **Scroll messages** → View conversation history
- **Mobile: Open/close** → Toggle chat visibility

**Accessibility:**

- **ARIA labels:**
  - `role="region"` with `aria-label="Ava chat assistant"`
  - Messages area has `role="log"` with `aria-live="polite"` for new messages
  - Clear landmarks for header, messages, and input areas
- **Keyboard navigation:**
  - Input focusable with Tab
  - Scroll through messages with arrow keys
  - Action logs expandable with keyboard
- **Screen reader support:**
  - New messages announced automatically
  - Ava typing status announced
  - Action logs announced when created
  - Clear indication of message sender
- **Visual considerations:**
  - High contrast for readability
  - Clear visual distinction between patient and Ava messages
  - Fixed width prevents layout shift
  - Scrollbar for message history
  - Mobile: Adequate touch targets for close/minimize

**Technical Considerations:**

- Messages persist across page navigation
- Greeting is ephemeral (not stored in conversation history)
- Auto-scroll to newest message when new message arrives
- Handle long messages with appropriate wrapping
- Support markdown formatting in Ava responses (optional)
- WebSocket or polling for real-time updates
- Message timestamps shown in relative format
