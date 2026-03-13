# Button

**Type:** Form / Interactive Component

**Purpose:** Reusable button component for actions throughout the application, with consistent styling and behavior for different action types.

**Usage:** Used for all clickable actions: form submissions, navigation, modal triggers, quick actions, etc.

**Data Fields:**

- `label` (String or ReactNode) - Button text or content
  - Required
- `onClick` (Function) - Click handler
  - Required
- `variant` (Enum: "primary" | "secondary" | "danger" | "ghost" | "link") - Visual style
  - Default: "primary"
  - Optional
- `size` (Enum: "small" | "medium" | "large") - Button size
  - Default: "medium"
  - Optional
- `disabled` (Boolean) - Whether button is disabled
  - Default: false
  - Optional
- `loading` (Boolean) - Whether button shows loading state
  - Default: false
  - Optional
- `icon` (ReactNode, optional) - Icon to display alongside label
  - Optional
- `iconPosition` (Enum: "left" | "right") - Icon placement
  - Default: "left"
  - Optional
- `fullWidth` (Boolean) - Whether button spans full container width
  - Default: false
  - Optional

**Visual Structure (SVG):**

```svg
<svg viewBox="0 0 500" height="300" xmlns="http://www.w3.org/2000/svg">
  <!-- Primary variant -->
  <rect x="20" y="20" width="140" height="44" fill="#3b82f6" rx="6"/>
  <text x="90" y="47" font-size="14" font-weight="600" fill="#ffffff" text-anchor="middle">Primary Button</text>

  <!-- Secondary variant -->
  <rect x="180" y="20" width="140" height="44" fill="transparent" stroke="#3b82f6" stroke-width="2" rx="6"/>
  <text x="250" y="47" font-size="14" font-weight="600" fill="#3b82f6" text-anchor="middle">Secondary</text>

  <!-- Danger variant -->
  <rect x="340" y="20" width="140" height="44" fill="#dc2626" rx="6"/>
  <text x="410" y="47" font-size="14" font-weight="600" fill="#ffffff" text-anchor="middle">Delete</text>

  <!-- Ghost variant -->
  <rect x="20" y="80" width="140" height="44" fill="transparent"/>
  <text x="90" y="107" font-size="14" font-weight="600" fill="#3b82f6" text-anchor="middle">Ghost Button</text>

  <!-- Link variant -->
  <text x="250" y="107" font-size="14" font-weight="600" fill="#3b82f6" text-decoration="underline">Link Button</text>

  <!-- Disabled state -->
  <rect x="20" y="140" width="140" height="44" fill="#e5e7eb" rx="6"/>
  <text x="90" y="167" font-size="14" font-weight="600" fill="#9ca3af" text-anchor="middle">Disabled</text>

  <!-- Loading state -->
  <rect x="180" y="140" width="140" height="44" fill="#3b82f6" rx="6"/>
  <circle cx="220" cy="162" r="6" fill="#ffffff"/>
  <text x="250" y="167" font-size="14" font-weight="600" fill="#ffffff" text-anchor="middle">Loading...</text>

  <!-- Small size -->
  <rect x="20" y="200" width="100" height="32" fill="#3b82f6" rx="4"/>
  <text x="70" y="221" font-size="12" font-weight="600" fill="#ffffff" text-anchor="middle">Small</text>

  <!-- Medium size (default) -->
  <rect x="140" y="196" width="120" height="40" fill="#3b82f6" rx="6"/>
  <text x="200" y="221" font-size="14" font-weight="600" fill="#ffffff" text-anchor="middle">Medium</text>

  <!-- Large size -->
  <rect x="280" y="192" width="140" height="48" fill="#3b82f6" rx="6"/>
  <text x="350" y="221" font-size="16" font-weight="600" fill="#ffffff" text-anchor="middle">Large</text>

  <!-- With icon -->
  <rect x="20" y="260" width="160" height="44" fill="#3b82f6" rx="6"/>
  <text x="35" y="287" font-size="16" fill="#ffffff">+</text>
  <text x="100" y="287" font-size="14" font-weight="600" fill="#ffffff" text-anchor="middle">Add Item</text>
</svg>
```

**States:**

- **Default:** Normal clickable state
- **Hover:** Darker background for filled buttons, light background for outlined
- **Active/Pressed:** Slightly darker than hover, inset appearance
- **Focus:** Visible focus ring (keyboard navigation)
- **Disabled:** Grayed out, cursor not-allowed, not interactive
- **Loading:** Spinner icon, disabled interaction, label may change

**Interactions:**

- **Click** → Execute onClick handler
- **Hover** → Visual feedback
- **Focus** → Keyboard navigation highlight

**Accessibility:**

- **ARIA labels:**
  - `role="button"` (implicit with `<button>` element)
  - `aria-label` if label is icon-only
  - `aria-disabled="true"` if disabled
  - `aria-busy="true"` if loading
- **Keyboard navigation:**
  - Focusable with Tab
  - Activatable with Enter or Space
  - Not focusable if disabled
- **Screen reader support:**
  - Label announced clearly
  - Disabled state announced
  - Loading state announced
  - Icon has text alternative if necessary
- **Visual considerations:**
  - Minimum 44x44px touch target for mobile
  - High contrast for text on background
  - Focus indicator clearly visible
  - Loading spinner visible and announced
  - Disabled state visually distinct

**Variant Styles:**

- **primary:** Filled blue background, white text (call to action)
- **secondary:** Outlined blue border, blue text (secondary actions)
- **danger:** Filled red background, white text (destructive actions)
- **ghost:** No border or background, colored text (minimal emphasis)
- **link:** Underlined text, no border or background (inline actions)

**Size Options:**

- **small:** 32px height, 12px font size, 12px padding
- **medium:** 40-44px height, 14px font size, 16px padding (default)
- **large:** 48px height, 16px font size, 20px padding

**Usage Examples:**

- Form submissions
- Modal confirmations
- Navigation actions
- Quick action panels
- Data logging triggers
- Appointment scheduling
