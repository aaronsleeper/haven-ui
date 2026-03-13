# ContentSuggestionsPanel

**Type:** Container / Panel Component

**Purpose:** Container for displaying personalized content suggestion cards with an action to request different content from Ava.

**Usage:** Used on the Home Dashboard in the "Relevant Content" section to group content suggestions and provide a way for patients to ask Ava for more tailored recommendations.

**Data Fields:**

- `suggestions` (Array of ContentSuggestion Objects) - List of content suggestions
  - Each contains data for ContentSuggestionCard
  - Required
  - Typically 3-6 suggestions displayed
- `onAskAva` (Function) - Handler to open Ava chat with content request
  - Pre-populates chat input or focuses chat for custom request
  - Required
- `filterParams` (Object, optional) - Current filter settings
  - Used if patient can filter content types
  - Optional (future enhancement)

**Visual Structure (SVG):**

```svg
<svg viewBox="0 0 640" height="380" xmlns="http://www.w3.org/2000/svg">
  <!-- Panel background -->
  <rect x="0" y="0" width="640" height="380" fill="#ffffff" stroke="#e5e7eb" stroke-width="1" rx="8"/>

  <!-- Header -->
  <text x="20" y="32" font-size="16" font-weight="600" fill="#1a1a1a">Relevant Content</text>

  <!-- Content cards row -->
  <g transform="translate(20, 50)">
    <!-- Card 1 -->
    <rect x="0" y="0" width="190" height="260" fill="#f9fafb" stroke="#e5e7eb" rx="8"/>
    <text x="95" y="130" font-size="12" fill="#6b7280" text-anchor="middle">[Card 1]</text>

    <!-- Card 2 -->
    <rect x="210" y="0" width="190" height="260" fill="#f9fafb" stroke="#e5e7eb" rx="8"/>
    <text x="305" y="130" font-size="12" fill="#6b7280" text-anchor="middle">[Card 2]</text>

    <!-- Card 3 -->
    <rect x="420" y="0" width="190" height="260" fill="#f9fafb" stroke="#e5e7eb" rx="8"/>
    <text x="515" y="130" font-size="12" fill="#6b7280" text-anchor="middle">[Card 3]</text>
  </g>

  <!-- Ask Ava button -->
  <rect x="220" y="330" width="200" height="36" fill="transparent" stroke="#3b82f6" stroke-width="2" rx="6"/>
  <text x="320" y="353" font-size="13" font-weight="600" fill="#3b82f6" text-anchor="middle">Ask Ava for more</text>
</svg>
```

**States:**

- **Default:** Panel with content cards and "Ask Ava" button
- **Loading:** Skeleton loaders for cards while fetching suggestions
- **Empty:** No suggestions available (show empty state with prompt to talk to Ava)
- **Hover (on button):** "Ask Ava" button hover state

**Interactions:**

- **Click "Ask Ava for more"** → Opens or focuses AvaChatInput
  - Option A: Pre-fills with prompt like "I'm looking for [content type]"
  - Option B: Just focuses chat for patient to type custom request
- **Scroll/swipe cards** → If more than 3 cards, allow horizontal scrolling (mobile) or show all (desktop)
- **Individual card clicks** → Handled by ContentSuggestionCard component

**Accessibility:**

- **ARIA labels:**
  - `role="region"` with `aria-label="Relevant content suggestions"`
  - Card container has `role="list"`
  - "Ask Ava" button has clear label
- **Keyboard navigation:**
  - Tab through content cards
  - Tab to "Ask Ava" button
  - All focusable elements accessible
- **Screen reader support:**
  - Section heading announced
  - Number of suggestions announced
  - Clear structure for navigating cards
  - "Ask Ava" button purpose clear
- **Visual considerations:**
  - Adequate spacing between cards
  - "Ask Ava" button visually distinct
  - Responsive layout for different screen sizes
  - Horizontal scroll indicators if needed
