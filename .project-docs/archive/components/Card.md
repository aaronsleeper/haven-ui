# Card

**Type:** Layout / Container Component

**Purpose:** Reusable container component for grouping related content with consistent styling, padding, and optional elevation.

**Usage:** Used throughout the application to wrap sections of content, data displays, and interactive elements. Provides visual hierarchy and organization.

**Data Fields:**

- `children` (ReactNode) - Card content
  - Required
- `title` (String, optional) - Card header title
  - Optional
- `variant` (Enum: "default" | "outlined" | "elevated") - Visual style
  - Default: "default"
  - Optional
- `padding` (Enum: "none" | "small" | "medium" | "large") - Internal padding
  - Default: "medium"
  - Optional
- `clickable` (Boolean) - Whether card is interactive
  - Adds hover state and cursor pointer
  - Default: false
  - Optional
- `onClick` (Function, optional) - Click handler if clickable
  - Optional

**Visual Structure (SVG):**

```svg
<svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg">
  <!-- Default variant -->
  <rect x="10" y="10" width="380" height="70" fill="#ffffff" stroke="#e5e7eb" stroke-width="1" rx="8"/>
  <text x="20" y="35" font-size="14" font-weight="600" fill="#1a1a1a">Card Title</text>
  <text x="20" y="60" font-size="13" fill="#6b7280">Card content goes here...</text>

  <!-- Outlined variant -->
  <rect x="10" y="95" width="380" height="70" fill="transparent" stroke="#d1d5db" stroke-width="2" rx="8"/>
  <text x="20" y="120" font-size="14" font-weight="600" fill="#1a1a1a">Outlined Card</text>
  <text x="20" y="145" font-size="13" fill="#6b7280">Content with outlined style...</text>

  <!-- Elevated variant (with shadow) -->
  <rect x="10" y="180" width="380" height="70" fill="#ffffff" rx="8"/>
  <!-- Shadow effect -->
  <rect x="12" y="182" width="380" height="70" fill="#f3f4f6" opacity="0.4" rx="8"/>
  <rect x="10" y="180" width="380" height="70" fill="#ffffff" stroke="#e5e7eb" stroke-width="1" rx="8"/>
  <text x="20" y="205" font-size="14" font-weight="600" fill="#1a1a1a">Elevated Card</text>
  <text x="20" y="230" font-size="13" fill="#6b7280">Content with elevation shadow...</text>
</svg>
```

**States:**

- **Default:** Normal display
- **Hover (if clickable):** Background color change, increased elevation
- **Active (if clickable):** Slight scale or color change
- **Focus (if clickable):** Visible focus ring

**Interactions:**

- **Click (if clickable)** → Execute onClick handler
- **Hover (if clickable)** → Visual feedback

**Accessibility:**

- **ARIA labels:**
  - If clickable: `role="button"` or `role="link"`
  - If has title: `aria-labelledby` pointing to title
  - If interactive but not clickable/linkable: appropriate `role` (e.g., `role="article"`)
- **Keyboard navigation:**
  - If clickable: Focusable with Tab
  - If clickable: Activatable with Enter or Space
- **Screen reader support:**
  - Title announced when card is focused
  - Content structure preserved
  - Clear indication if interactive
- **Visual considerations:**
  - Adequate padding for readability
  - Clear visual boundaries
  - Consistent styling across application
  - Hover state clearly distinguishable
  - Touch-friendly if clickable (minimum 44px height)

**Padding Options:**

- **none:** 0px padding
- **small:** 12px padding
- **medium:** 16px padding (default)
- **large:** 24px padding

**Variant Styles:**

- **default:** White background, light gray border, no shadow
- **outlined:** Transparent background, medium gray border, no shadow
- **elevated:** White background, light border, drop shadow

**Usage Examples:**

- Progress overview sections on dashboard
- Meal delivery summaries
- Message previews
- Metric cards
- General content grouping
