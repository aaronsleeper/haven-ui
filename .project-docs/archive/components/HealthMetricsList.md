# HealthMetricsList

**Type:** Container / List Component

**Purpose:** Container for displaying all tracked health metrics organized into categorical sections (Vitals, Lab Results, Lifestyle, Symptoms).

**Usage:** Used on the Health Data screen as the main content area, containing multiple HealthMetricCard components grouped by category.

**Data Fields:**

- `metrics` (Array of Metric Objects) - List of all health metrics
  - Each contains data for HealthMetricCard component
  - Grouped by `metricCategory`
  - Required
- `categories` (Array of Strings) - Category groupings
  - Examples: "Vitals", "Lab Results", "Lifestyle", "Symptoms"
  - Determines section headers
  - Required
- `onMetricClick` (Function) - Handler for when a metric card is clicked
  - Expands to detail view or navigates to detailed metric page
  - Required

**Visual Structure (SVG):**

```svg
<svg viewBox="0 0 600" height="800" xmlns="http://www.w3.org/2000/svg">
  <!-- Container -->
  <rect x="0" y="0" width="600" height="800" fill="#ffffff"/>

  <!-- Category 1: Vitals -->
  <text x="0" y="25" font-size="14" font-weight="700" fill="#6b7280" letter-spacing="0.5">VITALS</text>

  <!-- Metric cards in this category -->
  <rect x="0" y="40" width="600" height="140" fill="#f9fafb" stroke="#e5e7eb" rx="8"/>
  <text x="20" y="70" font-size="12" fill="#6b7280">[HealthMetricCard - Weight]</text>

  <rect x="0" y="195" width="600" height="140" fill="#f9fafb" stroke="#e5e7eb" rx="8"/>
  <text x="20" y="225" font-size="12" fill="#6b7280">[HealthMetricCard - Blood Pressure]</text>

  <!-- Category 2: Lab Results -->
  <text x="0" y="365" font-size="14" font-weight="700" fill="#6b7280" letter-spacing="0.5">LAB RESULTS</text>

  <rect x="0" y="380" width="600" height="140" fill="#f9fafb" stroke="#e5e7eb" rx="8"/>
  <text x="20" y="410" font-size="12" fill="#6b7280">[HealthMetricCard - A1C]</text>

  <!-- Category 3: Lifestyle -->
  <text x="0" y="550" font-size="14" font-weight="700" fill="#6b7280" letter-spacing="0.5">LIFESTYLE</text>

  <rect x="0" y="565" width="600" height="140" fill="#f9fafb" stroke="#e5e7eb" rx="8"/>
  <text x="20" y="595" font-size="12" fill="#6b7280">[HealthMetricCard - Sleep]</text>
</svg>
```

**States:**

- **Default:** All categories and metrics displayed
- **Loading:** Skeleton loaders for metric cards
- **Empty (no metrics tracked):** Empty state message encouraging enrollment or setup
- **Category collapsed/expanded:** Optional accordion-style category sections (future enhancement)

**Interactions:**

- **Click on metric card** → Handled by HealthMetricCard component (expands to detail view)
- **Scroll** → Vertical scrolling through all categories
- **Optional: Collapse/expand categories** → Toggle category visibility (future enhancement)

**Accessibility:**

- **ARIA labels:**
  - `role="region"` for the overall list
  - Each category section has `role="group"` with `aria-labelledby` pointing to category header
  - Metric cards use appropriate roles (handled by HealthMetricCard)
- **Keyboard navigation:**
  - Category headers focusable if interactive
  - Tab through metric cards in order
  - Logical reading order maintained
- **Screen reader support:**
  - Category structure announced clearly
  - Number of metrics per category announced
  - Clear navigation between categories
- **Visual considerations:**
  - Category headers visually distinct
  - Adequate spacing between categories
  - Scroll position maintained when returning to screen
  - Responsive layout for mobile
