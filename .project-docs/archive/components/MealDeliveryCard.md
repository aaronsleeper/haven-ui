# MealDeliveryCard

**Type:** Card / List Item Component

**Purpose:** Displays a summary of a meal delivery order in the activity timeline on the Home Dashboard, showing order date, meal count, and produce count.

**Usage:** Used on the Home Dashboard in the "Meal Deliveries" section to show recent meal orders. Each card is clickable to view full order details.

**Data Fields:**

- `orderDate` (Date) - Date of order/delivery
  - Format: "Dec 15" or "Dec 15, 2025"
  - Required
- `mealCount` (Number) - Number of meals in order
  - Required
- `produceCount` (Number) - Number of produce items/bags
  - Required
- `orderId` (String) - Unique order identifier
  - Used for navigation to details
  - Required
- `detailLink` (String) - URL to full order details screen
  - Optional (computed from orderId if needed)

**Visual Structure (SVG):**

```svg
<svg viewBox="0 0 480 80" xmlns="http://www.w3.org/2000/svg">
  <!-- Card background -->
  <rect x="0" y="0" width="480" height="80" fill="#ffffff" stroke="#e5e7eb" stroke-width="1" rx="6"/>

  <!-- Date -->
  <text x="16" y="28" font-size="14" font-weight="600" fill="#1a1a1a">Dec 15, 2025</text>

  <!-- Order summary -->
  <text x="16" y="50" font-size="13" fill="#4b5563">12 meals, 1 bag of produce</text>

  <!-- Click indicator / arrow -->
  <path d="M 450 35 L 460 40 L 450 45" stroke="#9ca3af" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Hover state indicator -->
  <rect x="0" y="0" width="480" height="80" fill="transparent" stroke="#3b82f6" stroke-width="0" rx="6" class="hover-outline"/>
</svg>
```

**States:**

- **Default:** Normal card display with order information
- **Hover:** Background color change, subtle shadow, cursor pointer
- **Active/Clicked:** Navigate to full meal order details screen
- **Loading:** Skeleton loader while fetching order data
- **Delivered/Pending:** Visual indicator of delivery status (if applicable)

**Interactions:**

- **Click on card** → Navigate to meal order details screen showing complete order
- **Hover** → Highlight card, show cursor pointer

**Accessibility:**

- **ARIA labels:**
  - `role="link"` or `role="button"` for the card
  - `aria-label="View meal delivery order from December 15, 2025: 12 meals and 1 bag of produce"`
- **Keyboard navigation:**
  - Focusable with Tab key
  - Activatable with Enter
- **Screen reader support:**
  - Order summary read as complete sentence
  - Date formatted accessibly
  - Clear indication this is clickable/interactive
- **Visual considerations:**
  - Sufficient color contrast for all text
  - Touch target at least 44px height for mobile
  - Visual affordance for interactivity (arrow, hover state)
