# Modal

**Type:** Layout / Overlay Component

**Purpose:** Reusable modal dialog container for displaying focused content over the main application, such as forms, detailed information, or confirmations.

**Usage:** Used throughout the application for various modals (LogDataModal, AppointmentDetailsModal, ScheduleAppointmentModal, etc.). Provides consistent structure, styling, and behavior.

**Data Fields:**

- `content` (ReactNode) - Modal body content
  - Required
- `onClose` (Function) - Handler for closing the modal
  - Required
- `title` (String, optional) - Modal title/heading
  - Displayed in header
  - Optional
- `size` (Enum: "small" | "medium" | "large" | "fullscreen") - Modal width
  - Default: "medium"
  - Optional
- `showCloseButton` (Boolean) - Whether to show X button in header
  - Default: true
  - Optional
- `closeOnOverlayClick` (Boolean) - Whether clicking backdrop closes modal
  - Default: true
  - Optional
- `footer` (ReactNode, optional) - Custom footer content (buttons, etc.)
  - Optional

**Visual Structure (SVG):**

```svg
<svg viewBox="0 0 1200 900" xmlns="http://www.w3.org/2000/svg">
  <!-- Backdrop overlay -->
  <rect x="0" y="0" width="1200" height="900" fill="#000000" opacity="0.5"/>

  <!-- Modal container (centered) -->
  <rect x="300" y="150" width="600" height="600" fill="#ffffff" rx="12" stroke="#e5e7eb" stroke-width="2"/>

  <!-- Header -->
  <rect x="300" y="150" width="600" height="60" fill="#f9fafb" rx="12 12 0 0"/>
  <text x="324" y="185" font-size="18" font-weight="600" fill="#1a1a1a">Modal Title</text>

  <!-- Close button -->
  <circle cx="870" cy="180" r="16" fill="transparent"/>
  <text x="870" y="188" font-size="20" fill="#6b7280" text-anchor="middle">×</text>

  <!-- Content area -->
  <rect x="300" y="210" width="600" height="480" fill="#ffffff"/>
  <text x="600" y="450" font-size="14" fill="#9ca3af" text-anchor="middle">[Modal Content]</text>

  <!-- Footer (optional) -->
  <rect x="300" y="690" width="600" height="60" fill="#f9fafb" rx="0 0 12 12"/>
  <rect x="650" y="705" width="100" height="36" fill="transparent" stroke="#d1d5db" rx="6"/>
  <text x="700" y="728" font-size="14" fill="#6b7280" text-anchor="middle">Cancel</text>

  <rect x="770" y="705" width="110" height="36" fill="#3b82f6" rx="6"/>
  <text x="825" y="728" font-size="14" font-weight="600" fill="#ffffff" text-anchor="middle">Confirm</text>
</svg>
```

**States:**

- **Opening:** Fade in animation
- **Open:** Fully visible and interactive
- **Closing:** Fade out animation
- **Scrollable content:** If content exceeds viewport, enable scroll within modal

**Interactions:**

- **Click X button** → Close modal (call onClose)
- **Click backdrop** → Close modal if `closeOnOverlayClick` is true
- **Press Escape** → Close modal
- **Scroll** → Scroll content if it exceeds modal height

**Accessibility:**

- **ARIA labels:**
  - `role="dialog"` on modal container
  - `aria-modal="true"` to indicate modal state
  - `aria-labelledby` pointing to title (if present)
  - `aria-describedby` pointing to content (if helpful)
- **Keyboard navigation:**
  - Focus trapped within modal (can't tab to content behind modal)
  - First focusable element focused when modal opens
  - Tab cycles through interactive elements within modal
  - Shift+Tab moves backwards
  - Escape closes modal
- **Screen reader support:**
  - Modal announced when opened
  - Title read first
  - Focus moved to first interactive element or content
  - Close button clearly labeled
- **Visual considerations:**
  - Backdrop dims background content
  - Modal visually distinct and elevated (shadow)
  - Close button clearly visible
  - Adequate padding around content
  - Responsive sizing for different screen sizes
  - Maximum height to prevent overflow off screen

**Size Variants:**

- **small:** 400px width
- **medium:** 600px width (default)
- **large:** 800px width
- **fullscreen:** 100vw x 100vh (for complex workflows)

**Technical Considerations:**

- Portal to render modal at document root (prevent z-index issues)
- Prevent body scroll when modal open
- Restore focus to trigger element when modal closes
- Handle nested modals appropriately
- Ensure modal doesn't extend beyond viewport
- Smooth animations for open/close
