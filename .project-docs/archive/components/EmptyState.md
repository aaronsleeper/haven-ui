# EmptyState

**Type:** Empty State Display

**Purpose:** Provides friendly, actionable messaging when no data or content exists

**Usage:** Used throughout the app when lists, collections, or content areas are empty

---

## Data Fields

- `illustration` (String or Component) - Empty state illustration, icon, or image
  - Can be emoji, SVG, or image URL
  - Optional (can use default illustration)
- `title` (String) - Main empty state heading
  - Required
- `description` (String) - Explanatory text about why empty and what to do
  - Required
- `primaryAction` (Object, optional) - Primary call-to-action button
  - `label` (String) - Button text - Required
  - `onClick` (Function) - Click handler - Required
- `secondaryAction` (Object, optional) - Secondary action (e.g., "Learn More")
  - `label` (String) - Link or button text - Required
  - `onClick` (Function) - Click handler - Required

---

## Visual Structure (SVG)

```svg
<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Container -->
  <rect x="0" y="0" width="600" height="400" fill="#ffffff"/>

  <!-- Illustration / Icon -->
  <circle cx="300" cy="120" r="60" fill="#f3f4f6"/>
  <text x="270" y="145" font-size="48" fill="#9ca3af">📱</text>

  <!-- Title -->
  <text x="300" y="220" font-size="20" font-weight="700" fill="#111827" text-anchor="middle">
    No Connected Devices
  </text>

  <!-- Description -->
  <text x="300" y="250" font-size="14" fill="#6b7280" text-anchor="middle">
    Connect health monitoring devices to
  </text>
  <text x="300" y="270" font-size="14" fill="#6b7280" text-anchor="middle">
    automatically track your health data
  </text>

  <!-- Primary Action Button -->
  <rect x="200" y="300" width="200" height="44" fill="#3b82f6" rx="8"/>
  <text x="300" y="327" font-size="15" font-weight="600" fill="#ffffff" text-anchor="middle">
    Connect Your First Device
  </text>

  <!-- Secondary Action (Optional) -->
  <text x="300" y="370" font-size="14" fill="#3b82f6" text-anchor="middle" text-decoration="underline">
    Learn More
  </text>
</svg>
```

---

## States

- **Default:** Shows illustration, title, description, and action(s)
- **Hover (on button):** Primary action button shows hover state
- **Loading (optional):** If checking for data, show loading state before empty state

---

## Interactions

- **Click Primary Action** → Calls primaryAction.onClick handler
- **Click Secondary Action** → Calls secondaryAction.onClick handler (if provided)

---

## Accessibility

- **ARIA Labels:**
  - Illustration: `role="img"` with `aria-label` describing the illustration
  - Title: Use semantic heading tag (h2 or h3 depending on context)
  - Description: Use paragraph tag
- **Keyboard Navigation:**
  - Action buttons are keyboard accessible (Tab to focus, Enter/Space to activate)
  - Logical tab order: Primary action → Secondary action
- **Screen Reader Support:**
  - Entire empty state announced as cohesive unit
  - Action buttons clearly labeled with purpose

---

## Variants

### Device Integration (No Devices)
```
Illustration: 📱 or device icon
Title: "No Connected Devices"
Description: "Connect health monitoring devices to automatically track your health data"
Primary Action: "Connect Your First Device"
```

### Appointments (No Appointments)
```
Illustration: 📅 or calendar icon
Title: "No Upcoming Appointments"
Description: "Schedule an appointment with your care team to get started"
Primary Action: "Schedule Appointment"
```

### Messages (No Messages)
```
Illustration: 💬 or message icon
Title: "No Messages"
Description: "Your messages with your care team will appear here"
Primary Action: "Send a Message"
```

### Search Results (No Results)
```
Illustration: 🔍 or search icon
Title: "No Results Found"
Description: "Try adjusting your search terms or filters"
Primary Action: "Clear Filters"
Secondary Action: "View All"
```

### General / Flexible
```
illustration: (customizable)
title: (customizable)
description: (customizable)
primaryAction: (customizable)
secondaryAction: (optional, customizable)
```

---

## Design Guidelines

### Illustration
- Should be relevant to the context (devices for device integration, calendar for appointments)
- Keep illustrations simple and friendly
- Use neutral, calming colors
- Size: 80-120px for icon/emoji, larger for detailed illustrations

### Title
- Clear and descriptive
- Should acknowledge the empty state positively (not "Nothing here" but "No appointments yet")
- Keep to one line if possible

### Description
- Explain why the state is empty or what the user should do
- Keep to 1-2 lines
- Encouraging and action-oriented tone

### Actions
- Primary action should be most obvious next step
- Use action verbs (Connect, Schedule, Create, etc.)
- Secondary action optional (Learn More, Help, etc.)

---

## Content Tone

Empty states should:
- Be encouraging, not discouraging
- Suggest next steps
- Use positive language
- Avoid blame or negative framing

**Good:**
- "No connected devices yet. Connect your first device to get started!"
- "You're all caught up! No new messages."

**Bad:**
- "You don't have any devices." (negative framing)
- "Nothing here." (unhelpful)

---

## Notes

- Center-align all content vertically and horizontally
- Maintain generous whitespace around elements
- Empty state should occupy full container height/width
- Consider loading state before showing empty state (avoid flash of empty content)
- Animation: Consider subtle fade-in or slide-in for empty state appearance
- Responsive: Stack elements vertically on mobile, may need smaller illustration
