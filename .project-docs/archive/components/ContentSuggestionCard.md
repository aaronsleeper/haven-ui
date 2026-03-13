# ContentSuggestionCard

**Type:** Card / Content Preview Component

**Purpose:** Displays a personalized content recommendation (recipe, exercise, article) with thumbnail, title, and relevance tags.

**Usage:** Used on the Home Dashboard in the "Relevant Content" section to show content suggestions tailored to the patient's care plan and preferences.

**Data Fields:**

- `contentType` (String) - Type of content
  - Examples: "Recipe", "Exercise", "Article", "Video"
  - Required
- `title` (String) - Content title
  - Examples: "Low-Carb Dinner Ideas", "15-Minute Home Workout"
  - Required
- `preview` (String or Image URL) - Preview text or thumbnail image
  - If image: URL to thumbnail
  - If text: Brief description or excerpt
  - Required
- `sourceLink` (String) - URL to full content
  - Required
- `relevanceTags` (Array<String>) - Why this content is suggested
  - Examples: ["diabetes-friendly", "quick prep", "high protein"]
  - Optional
- `contentId` (String) - Unique content identifier
  - Required

**Visual Structure (SVG):**

```svg
<svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">
  <!-- Card background -->
  <rect x="0" y="0" width="200" height="260" fill="#ffffff" stroke="#e5e7eb" stroke-width="1" rx="8"/>

  <!-- Thumbnail image area -->
  <rect x="0" y="0" width="200" height="120" fill="#f3f4f6" rx="8 8 0 0"/>
  <text x="100" y="65" font-size="12" fill="#9ca3af" text-anchor="middle">[Thumbnail]</text>

  <!-- Content type badge -->
  <rect x="10" y="130" width="50" height="20" fill="#dbeafe" rx="4"/>
  <text x="35" y="144" font-size="10" font-weight="600" fill="#1e40af" text-anchor="middle">Recipe</text>

  <!-- Title -->
  <text x="10" y="170" font-size="13" font-weight="600" fill="#1a1a1a">Low-Carb Chicken</text>
  <text x="10" y="186" font-size="13" font-weight="600" fill="#1a1a1a">Stir Fry</text>

  <!-- Relevance tags -->
  <text x="10" y="210" font-size="10" fill="#6b7280"># diabetes-friendly</text>
  <text x="10" y="225" font-size="10" fill="#6b7280"># quick prep</text>

  <!-- Click indicator -->
  <rect x="0" y="240" width="200" height="20" fill="#f9fafb" rx="0 0 8 8"/>
  <text x="100" y="253" font-size="10" fill="#6b7280" text-anchor="middle">View recipe →</text>
</svg>
```

**States:**

- **Default:** Normal card display with content preview
- **Hover:** Subtle elevation, shadow increase, cursor pointer
- **Active/Clicked:** Navigate to full content page
- **Loading:** Skeleton loader while fetching content
- **Favorited/Saved:** Visual indicator if patient has saved this content (future enhancement)

**Interactions:**

- **Click on card** → Navigate to full content page (recipe, article, video, etc.)
- **Hover** → Elevate card, show additional preview if available
- **Optional: Save/bookmark** → Allow patient to save for later (future enhancement)

**Accessibility:**

- **ARIA labels:**
  - `role="link"` or `role="article"` for the card
  - `aria-label="Recipe: Low-Carb Chicken Stir Fry, diabetes-friendly, quick prep"`
  - Thumbnail has `alt` text describing the image
- **Keyboard navigation:**
  - Focusable with Tab key
  - Activatable with Enter
- **Screen reader support:**
  - Content type announced first
  - Title read clearly
  - Relevance tags read as list
  - Clear indication this is clickable
- **Visual considerations:**
  - Content type badge has sufficient contrast
  - Title legible against background
  - Tags visually distinct from title
  - Touch target adequate for mobile (entire card clickable)
  - Image loading states handled gracefully
