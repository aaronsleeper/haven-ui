# ScreenHeader

**Type:** Layout / Navigation Component

**Purpose:** Page-level header component displaying the screen title and optional primary action button or context actions.

**Usage:** Used at the top of every screen to provide clear context about the current view and quick access to the primary action for that screen.

**Data Fields:**

- `title` (String) - Page title
  - Examples: "Dashboard", "Health Data", "Appointments"
  - Required
- `primaryAction` (Object, optional) - Primary action button configuration
  - Contains: `label` (String), `onClick` (Function), `icon` (optional)
  - Examples: "Log Data", "Schedule Appointment"
  - Optional
- `contextActions` (Array of Action Objects, optional) - Additional actions
  - Each contains: `label` (String), `onClick` (Function), `icon` (optional)
  - Examples: "Export", "Filter", "Settings"
  - Optional
- `showBackButton` (Boolean, optional) - Whether to show back navigation
  - For detail views or modal-like screens
  - Default: false
  - Optional
- `onBack` (Function, optional) - Back button handler
  - Required if `showBackButton` is true
  - Optional

**Visual Structure (SVG):**

```svg
<svg viewBox="0 0 800 80" xmlns="http://www.w3.org/2000/svg">
  <!-- Header container -->
  <rect x="0" y="0" width="800" height="80" fill="#ffffff" stroke="#e5e7eb" stroke-width="0 0 1 0"/>

  <!-- Example 1: Title with primary action -->
  <text x="24" y="45" font-size="24" font-weight="700" fill="#1a1a1a">Health Data</text>
  <rect x="650" y="24" width="130" height="40" fill="#3b82f6" rx="6"/>
  <text x="715" y="49" font-size="14" font-weight="600" fill="#ffffff" text-anchor="middle">Log Data</text>
</svg>
```

```svg
<svg viewBox="0 0 800 80" xmlns="http://www.w3.org/2000/svg">
  <!-- Example 2: Title with back button -->
  <rect x="0" y="0" width="800" height="80" fill="#ffffff" stroke="#e5e7eb" stroke-width="0 0 1 0"/>

  <!-- Back button -->
  <path d="M 32 40 L 20 40 L 28 32 M 20 40 L 28 48" stroke="#3b82f6" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>

  <text x="44" y="45" font-size="24" font-weight="700" fill="#1a1a1a">Weight Tracking</text>
</svg>
```

```svg
<svg viewBox="0 0 800 80" xmlns="http://www.w3.org/2000/svg">
  <!-- Example 3: Title with multiple context actions -->
  <rect x="0" y="0" width="800" height="80" fill="#ffffff" stroke="#e5e7eb" stroke-width="0 0 1 0"/>

  <text x="24" y="45" font-size="24" font-weight="700" fill="#1a1a1a">Appointments</text>

  <!-- Context actions -->
  <rect x="530" y="28" width="100" height="36" fill="transparent" stroke="#3b82f6" stroke-width="2" rx="6"/>
  <text x="580" y="51" font-size="13" fill="#3b82f6" text-anchor="middle">Export</text>

  <rect x="650" y="28" width="130" height="36" fill="#3b82f6" rx="6"/>
  <text x="715" y="51" font-size="13" font-weight="600" fill="#ffffff" text-anchor="middle">Schedule</text>
</svg>
```

**States:**

- **Default:** Title and actions displayed
- **Mobile:** Title may truncate, actions may collapse to menu

**Interactions:**

- **Click primary action** → Execute primary action (e.g., open modal, navigate)
- **Click context action** → Execute context action
- **Click back button** → Navigate back to previous screen

**Accessibility:**

- **ARIA labels:**
  - Header has `role="banner"` or `role="region"` with `aria-label="Page header"`
  - Title has `role="heading"` with `aria-level="1"`
  - Buttons have clear labels
  - Back button has `aria-label="Go back"`
- **Keyboard navigation:**
  - All buttons focusable with Tab
  - Back button focusable and activatable
  - Logical tab order (back → title → actions)
- **Screen reader support:**
  - Title announced as page heading
  - Buttons announced with their purpose
  - Clear indication of current location
- **Visual considerations:**
  - Clear visual hierarchy (title largest)
  - Adequate spacing between elements
  - Responsive layout for mobile
  - Touch-friendly button sizes
  - Consistent styling across all screens

**Layout Options:**

- **Desktop:** Title left-aligned, actions right-aligned, full height (60-80px)
- **Mobile:** Title may wrap, actions may stack or collapse to overflow menu

**Usage Examples:**

- **Dashboard:** Title "Dashboard", no primary action
- **Health Data:** Title "Health Data", primary action "Log Data"
- **Appointments:** Title "Appointments", primary action "Schedule Appointment"
- **Metric Detail:** Title "Weight Tracking", back button, primary action "Log New Weight"
