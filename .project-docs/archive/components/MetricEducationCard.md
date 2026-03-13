# MetricEducationCard

**Type:** Modal / Educational Content Component

**Purpose:** Displays educational content explaining what a health metric is, why it matters for the patient's condition, ideal ranges, and tips for improvement.

**Usage:** Opened from HealthMetricCard or MetricDetailView "Learn More" action, or provided by Ava in conversational context.

**Data Fields:**

- `metricName` (String) - Which metric this explains
  - Examples: "A1C", "Blood Pressure", "BMI"
  - Required
- `description` (String) - What this metric measures
  - Brief, patient-friendly explanation (2-3 sentences)
  - Required
- `whyItMatters` (String) - Why this is tracked for patient's condition
  - Personalized relevance (1-2 paragraphs)
  - Required
- `idealRange` (String) - Normal/target ranges with context
  - May include multiple ranges (non-diabetic, pre-diabetic, diabetic target)
  - Required
- `tips` (Array<String>) - How to improve this metric
  - Actionable advice items (3-5 tips)
  - Required
- `learnMoreLinks` (Array of Link Objects, optional) - External resources
  - Each contains: `title` (String), `url` (URL)
  - Optional

**Visual Structure (SVG):**

```svg
<svg viewBox="0 0 600" height="600" xmlns="http://www.w3.org/2000/svg">
  <!-- Modal background -->
  <rect x="0" y="0" width="600" height="600" fill="#ffffff" stroke="#e5e7eb" stroke-width="2" rx="12"/>

  <!-- Header -->
  <text x="24" y="35" font-size="18" font-weight="600" fill="#1a1a1a">Understanding A1C</text>
  <text x="570" y="35" font-size="20" fill="#6b7280">×</text>

  <!-- What is A1C? section -->
  <text x="24" y="75" font-size="14" font-weight="600" fill="#1f2937">What is A1C?</text>
  <text x="24" y="100" font-size="13" fill="#4b5563">A1C is a blood test that measures your average</text>
  <text x="24" y="118" font-size="13" fill="#4b5563">blood glucose levels over the past 2-3 months.</text>
  <text x="24" y="136" font-size="13" fill="#4b5563">It shows how well your diabetes management plan</text>
  <text x="24" y="154" font-size="13" fill="#4b5563">is working over time.</text>

  <!-- Why it matters section -->
  <text x="24" y="190" font-size="14" font-weight="600" fill="#1f2937">Why It Matters for You:</text>
  <text x="24" y="215" font-size="13" fill="#4b5563">For people with diabetes, keeping A1C in your</text>
  <text x="24" y="233" font-size="13" fill="#4b5563">target range reduces risk of complications like</text>
  <text x="24" y="251" font-size="13" fill="#4b5563">vision problems, kidney disease, and nerve damage.</text>

  <!-- Target ranges section -->
  <text x="24" y="287" font-size="14" font-weight="600" fill="#1f2937">Target Ranges:</text>
  <circle cx="32" cy="312" r="3" fill="#6b7280"/>
  <text x="42" y="316" font-size="13" fill="#4b5563">Non-diabetic: Below 5.7%</text>
  <circle cx="32" cy="337" r="3" fill="#6b7280"/>
  <text x="42" y="341" font-size="13" fill="#4b5563">Pre-diabetic: 5.7% - 6.4%</text>
  <circle cx="32" cy="362" r="3" fill="#6b7280"/>
  <text x="42" y="366" font-size="13" fill="#4b5563">Diabetic (target): Below 7.0%</text>
  <circle cx="32" cy="387" r="3" fill="#3b82f6"/>
  <text x="42" y="391" font-size="13" font-weight="600" fill="#1f2937">Your target: Below 7.0%</text>

  <!-- Tips section -->
  <text x="24" y="427" font-size="14" font-weight="600" fill="#1f2937">How to Improve Your A1C:</text>
  <circle cx="32" cy="452" r="3" fill="#6b7280"/>
  <text x="42" y="456" font-size="13" fill="#4b5563">Monitor and manage daily blood sugar levels</text>
  <circle cx="32" cy="477" r="3" fill="#6b7280"/>
  <text x="42" y="481" font-size="13" fill="#4b5563">Follow your meal plan and eat regular meals</text>
  <circle cx="32" cy="502" r="3" fill="#6b7280"/>
  <text x="42" y="506" font-size="13" fill="#4b5563">Stay physically active</text>
  <circle cx="32" cy="527" r="3" fill="#6b7280"/>
  <text x="42" y="531" font-size="13" fill="#4b5563">Take medications as prescribed</text>

  <!-- Learn more links -->
  <text x="24" y="567" font-size="14" font-weight="600" fill="#1f2937">Learn More:</text>
  <text x="24" y="587" font-size="13" fill="#3b82f6" text-decoration="underline">ADA Guide to A1C Testing</text>
</svg>
```

**States:**

- **Default:** All educational content displayed
- **Loading:** Skeleton loader while fetching content
- **Content unavailable:** Error state or empty state
- **Expanded sections:** Optionally collapsible sections for long content

**Interactions:**

- **Click "Learn More" links** → Open external resources in new tab
- **Click X or Close** → Close modal
- **Scroll** → View all content if longer than viewport
- **Optional: Print** → Allow printing educational content

**Accessibility:**

- **ARIA labels:**
  - `role="dialog"` with `aria-labelledby` pointing to title
  - `aria-modal="true"`
  - Sections have clear heading structure (`h2`, `h3`)
  - Links have descriptive text
- **Keyboard navigation:**
  - Focus trapped within modal
  - Tab through links
  - Escape closes modal
- **Screen reader support:**
  - Modal announced when opened
  - Content structure clear with headings
  - Lists properly marked up
  - Links announced with purpose
- **Visual considerations:**
  - Clear visual hierarchy with headings
  - Sufficient spacing between sections
  - Bulleted lists easy to scan
  - Patient's target highlighted
  - Links clearly identifiable
  - Readable font size
  - Adequate color contrast
  - Scrollable if content is long
  - Print-friendly styling
