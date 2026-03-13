# LogDataModal

**Type:** Modal / Form Component

**Purpose:** Form modal for manually entering health measurements, allowing patients to select a metric, enter a value, set date/time, and add optional notes.

**Usage:** Opened from Health Data screen "Log Data" button, from HealthMetricCard "Log" button, or via Ava conversation auto-population.

**Data Fields:**

- `availableMetrics` (Array of Metric Objects) - List of metrics patient can log
  - Each contains: `metricId`, `metricName`, `unit`, `inputType`
  - Required
- `preselectedMetric` (String, optional) - Metric ID if opened from specific metric card
  - Pre-fills the metric dropdown
  - Optional
- `onSubmit` (Function) - Handler to save new measurement
  - Receives: `metricId`, `value`, `timestamp`, `notes`
  - Required
- `onClose` (Function) - Handler to close modal
  - Required

**Form Fields:**

- `selectedMetric` (Dropdown) - Which metric to log
  - Options from `availableMetrics`
  - Required
- `value` (Number Input or Multi-field) - Measurement value
  - Single field for most metrics (Weight, Blood Sugar)
  - Multi-field for compound metrics (Blood Pressure: systolic/diastolic)
  - Validation: Must be reasonable for metric type
  - Required
- `unit` (Dropdown, if applicable) - Unit of measure
  - Pre-populated based on metric, may allow selection (lbs/kg)
  - Required (auto-filled in most cases)
- `dateTime` (DateTimePicker) - When measurement was taken
  - Defaults to current date/time
  - Can be backdated
  - Required
- `notes` (Textarea) - Optional patient notes
  - Max length: 500 characters
  - Optional

**Visual Structure (SVG):**

```svg
<svg viewBox="0 0 500" height="500" xmlns="http://www.w3.org/2000/svg">
  <!-- Modal background -->
  <rect x="0" y="0" width="500" height="500" fill="#ffffff" stroke="#e5e7eb" stroke-width="2" rx="12"/>

  <!-- Header -->
  <text x="24" y="35" font-size="18" font-weight="600" fill="#1a1a1a">Log Health Data</text>
  <text x="470" y="35" font-size="20" fill="#6b7280">×</text>

  <!-- Select Metric -->
  <text x="24" y="75" font-size="13" font-weight="500" fill="#374151">Select Metric:</text>
  <rect x="24" y="85" width="452" height="40" fill="#ffffff" stroke="#d1d5db" rx="6"/>
  <text x="36" y="110" font-size="14" fill="#1a1a1a">Weight ▼</text>

  <!-- Value -->
  <text x="24" y="155" font-size="13" font-weight="500" fill="#374151">Value:</text>
  <rect x="24" y="165" width="280" height="40" fill="#ffffff" stroke="#d1d5db" rx="6"/>
  <text x="36" y="190" font-size="14" fill="#9ca3af">Enter value...</text>

  <rect x="320" y="165" width="156" height="40" fill="#ffffff" stroke="#d1d5db" rx="6"/>
  <text x="332" y="190" font-size="14" fill="#1a1a1a">lbs ▼</text>

  <!-- Date & Time -->
  <text x="24" y="235" font-size="13" font-weight="500" fill="#374151">Date & Time:</text>
  <rect x="24" y="245" width="220" height="40" fill="#ffffff" stroke="#d1d5db" rx="6"/>
  <text x="36" y="270" font-size="14" fill="#1a1a1a">Today ▼</text>

  <rect x="256" y="245" width="220" height="40" fill="#ffffff" stroke="#d1d5db" rx="6"/>
  <text x="268" y="270" font-size="14" fill="#1a1a1a">8:30 AM ▼</text>

  <!-- Notes -->
  <text x="24" y="315" font-size="13" font-weight="500" fill="#374151">Notes (optional):</text>
  <rect x="24" y="325" width="452" height="80" fill="#ffffff" stroke="#d1d5db" rx="6"/>
  <text x="36" y="350" font-size="13" fill="#9ca3af">Add any notes about this measurement...</text>

  <!-- Action buttons -->
  <rect x="240" y="440" width="100" height="40" fill="transparent" stroke="#d1d5db" stroke-width="1" rx="6"/>
  <text x="290" y="465" font-size="14" fill="#6b7280" text-anchor="middle">Cancel</text>

  <rect x="355" y="440" width="121" height="40" fill="#3b82f6" rx="6"/>
  <text x="415" y="465" font-size="14" font-weight="600" fill="#ffffff" text-anchor="middle">Save</text>
</svg>
```

**States:**

- **Default:** Form fields empty or pre-filled (if from specific metric)
- **Filling:** Patient entering data
- **Validating:** Client-side validation of entered values
- **Submitting:** Loading state while saving data
- **Success:** Data saved, modal closes, success message shown
- **Error:** Validation error displayed or server error shown

**Interactions:**

- **Select metric** → Update form to show appropriate fields and units
- **Enter value** → Validate in real-time (reasonable range check)
- **Select date/time** → DateTimePicker interaction
- **Add notes** → Text entry
- **Click "Save"** → Validate, submit, close modal
- **Click "Cancel" or X** → Close modal without saving
- **Ava auto-population** → Form fields pre-filled from conversation, patient confirms

**Accessibility:**

- **ARIA labels:**
  - Modal has `role="dialog"` with `aria-labelledby` pointing to title
  - `aria-modal="true"` to indicate modal state
  - All form fields have associated labels
  - Error messages associated with fields via `aria-describedby`
- **Keyboard navigation:**
  - Focus trapped within modal
  - Tab through form fields
  - Escape key closes modal
  - Enter submits form (when valid)
- **Screen reader support:**
  - Modal announced when opened
  - Form structure clear
  - Required fields announced
  - Validation errors announced immediately
  - Success confirmation announced
- **Visual considerations:**
  - Clear visual hierarchy
  - Required fields marked
  - Validation errors inline and clear
  - Focus indicators visible
  - Touch-friendly form controls
  - Sufficient color contrast
