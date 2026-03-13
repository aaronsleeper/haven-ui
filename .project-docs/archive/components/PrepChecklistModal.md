# PrepChecklistModal

**Type:** Modal / Help Content Component

**Purpose:** Displays general appointment preparation information including technical requirements for video calls, suggested discussion topics, and tips for getting the most from appointments.

**Usage:** Opened from the "Appointment Preparation Checklist" link on the Appointments screen. This is a general resource, not tied to a specific appointment.

**Data Fields:**

- `prepChecklistContent` (Object) - Preparation checklist information
  - `technicalRequirements` (Array<String>) - Tech setup items for video calls
  - `discussionTopics` (Array<String>) - Suggested topics to prepare
  - `tips` (Array<String>) - General appointment tips
  - Required
- `onClose` (Function) - Handler to close modal
  - Required

**Visual Structure (SVG):**

```svg
<svg viewBox="0 0 600" height="650" xmlns="http://www.w3.org/2000/svg">
  <!-- Modal background -->
  <rect x="0" y="0" width="600" height="650" fill="#ffffff" stroke="#e5e7eb" stroke-width="2" rx="12"/>

  <!-- Header -->
  <text x="24" y="35" font-size="18" font-weight="600" fill="#1a1a1a">Appointment Preparation Checklist</text>
  <text x="570" y="35" font-size="20" fill="#6b7280">×</text>

  <!-- Technical Requirements Section -->
  <text x="24" y="75" font-size="14" font-weight="600" fill="#1f2937">Technical Requirements (for video calls):</text>

  <rect x="32" y="90" width="20" height="20" fill="transparent" stroke="#d1d5db" rx="3"/>
  <text x="60" y="105" font-size="13" fill="#4b5563">Stable internet connection (minimum 1 Mbps)</text>

  <rect x="32" y="120" width="20" height="20" fill="transparent" stroke="#d1d5db" rx="3"/>
  <text x="60" y="135" font-size="13" fill="#4b5563">Working camera and microphone</text>

  <rect x="32" y="150" width="20" height="20" fill="transparent" stroke="#d1d5db" rx="3"/>
  <text x="60" y="165" font-size="13" fill="#4b5563">Updated web browser (Chrome, Firefox, Safari, Edge)</text>

  <rect x="32" y="180" width="20" height="20" fill="transparent" stroke="#d1d5db" rx="3"/>
  <text x="60" y="195" font-size="13" fill="#4b5563">Quiet, well-lit space for your appointment</text>

  <rect x="32" y="210" width="20" height="20" fill="transparent" stroke="#d1d5db" rx="3"/>
  <text x="60" y="225" font-size="13" fill="#4b5563">Test your connection 5-10 minutes before</text>

  <!-- Discussion Topics Section -->
  <text x="24" y="270" font-size="14" font-weight="600" fill="#1f2937">Topics to Prepare:</text>

  <circle cx="40" cy="295" r="3" fill="#6b7280"/>
  <text x="52" y="299" font-size="13" fill="#4b5563">Recent health data or measurements</text>

  <circle cx="40" cy="320" r="3" fill="#6b7280"/>
  <text x="52" y="324" font-size="13" fill="#4b5563">Questions about your care plan or medications</text>

  <circle cx="40" cy="345" r="3" fill="#6b7280"/>
  <text x="52" y="349" font-size="13" fill="#4b5563">Challenges or obstacles you're facing</text>

  <circle cx="40" cy="370" r="3" fill="#6b7280"/>
  <text x="52" y="374" font-size="13" fill="#4b5563">Progress or wins you'd like to share</text>

  <circle cx="40" cy="395" r="3" fill="#6b7280"/>
  <text x="52" y="399" font-size="13" fill="#4b5563">Goals for the next few weeks</text>

  <circle cx="40" cy="420" r="3" fill="#6b7280"/>
  <text x="52" y="424" font-size="13" fill="#4b5563">Any symptoms or concerns</text>

  <!-- Tips Section -->
  <text x="24" y="465" font-size="14" font-weight="600" fill="#1f2937">Tips for a Successful Appointment:</text>

  <circle cx="40" cy="490" r="3" fill="#3b82f6"/>
  <text x="52" y="494" font-size="13" fill="#4b5563">Log in 5 minutes early to test your connection</text>

  <circle cx="40" cy="515" r="3" fill="#3b82f6"/>
  <text x="52" y="519" font-size="13" fill="#4b5563">Have a pen and paper ready for notes</text>

  <circle cx="40" cy="540" r="3" fill="#3b82f6"/>
  <text x="52" y="544" font-size="13" fill="#4b5563">Be in a private space where you can speak freely</text>

  <circle cx="40" cy="565" r="3" fill="#3b82f6"/>
  <text x="52" y="569" font-size="13" fill="#4b5563">Ask questions - your care team is here to help!</text>

  <circle cx="40" cy="590" r="3" fill="#3b82f6"/>
  <text x="52" y="594" font-size="13" fill="#4b5563">Review action items before ending the call</text>

  <!-- Close button -->
  <rect x="250" y="610" width="100" height="36" fill="#3b82f6" rx="6"/>
  <text x="300" y="633" font-size="14" font-weight="600" fill="#ffffff" text-anchor="middle">Got it</text>
</svg>
```

**States:**

- **Default:** All checklist content displayed
- **Loading:** Skeleton loader while fetching content (if dynamic)
- **Content unavailable:** Error state

**Interactions:**

- **Click X or "Got it"** → Close modal
- **Check checkboxes** → Interactive checklist (optional enhancement - save user's check state)
- **Scroll** → View all content if longer than viewport

**Accessibility:**

- **ARIA labels:**
  - `role="dialog"` with `aria-labelledby` pointing to title
  - `aria-modal="true"`
  - Technical requirements list has `role="list"` with checkboxes (if interactive)
  - Discussion topics and tips have `role="list"`
  - Sections have clear heading structure
- **Keyboard navigation:**
  - Focus trapped within modal
  - Tab through checkboxes (if interactive) and close button
  - Escape closes modal
  - Enter activates focused button
- **Screen reader support:**
  - Modal announced when opened
  - Sections announced with headings
  - Lists properly structured
  - Checkbox state announced (if interactive)
  - Number of items in each list announced
- **Visual considerations:**
  - Clear visual hierarchy with section headings
  - Adequate spacing between sections
  - Checkboxes visually distinct from bullet points
  - Different markers for different sections (checkboxes, bullets, styled bullets)
  - Readable font size
  - Sufficient color contrast
  - Scannable layout
  - Scrollable if content is long

**Content Variations:**

- **For video appointments:** Show full technical requirements section
- **For phone appointments:** Hide technical requirements or show simplified version
- **For in-person appointments:** Show location-specific information instead
- Content may be dynamically adjusted based on appointment type (future enhancement)
