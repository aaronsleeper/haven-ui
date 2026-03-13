# ONB-02: Consent

**Application:** Patient Portal (Mobile)
**Use Case(s):** PT-ONB-001
**User Type:** Patient
**Device:** Mobile-first
**Route:** `/onboarding/consent`

## Page Purpose

Walk the patient through three required consent screens one at a time, ensuring informed agreement before program participation begins.

---

## Layout Structure

### Shell
- No bottom tab bar (onboarding suppresses persistent nav)
- Back button top left (`fa-chevron-left`) -- returns to previous consent step or to ONB-01
- Progress indicator top center: "Step 2 of 3" -- `text-sm text-gray-500`

### Consent Step Structure

Each consent is a full-screen view. The three consents in order:
1. HIPAA Authorization
2. Program Participation Agreement
3. AVA Voice Interaction Consent (opt-out allowed)

#### Header Zone
- **Component:** Plain stacked text, no card
- Step label: "HIPAA Authorization" (or current consent name) -- `text-xs uppercase tracking-wide text-gray-500`
- Headline: Plain-language summary title (e.g., "Your health information") -- Lora, large
- Short plain-language summary: 2-3 sentences explaining what they're agreeing to -- Inter, regular, `text-gray-700`
- Bilingual toggle maintained in top right corner

#### Content Zone

##### Read Aloud Button
- **Component:** `.btn-outline` full width with `fa-volume-high` icon
- Label: "Read this aloud" / "Leer en voz alta"
- Positioned directly below the summary, above the full text
- While playing: button shows pause icon (`fa-pause`); tap to stop
- If unavailable: button is hidden rather than broken

##### Full Consent Text (expandable)
- **Component:** `hs-accordion` single item
- Toggle label: "Read full text" / "Leer el texto completo" -- `text-sm text-primary-600 underline`
- Content: scrollable full consent text inside accordion body, `text-sm text-gray-600`
- Default: collapsed

#### AVA Consent Only -- Opt-Out Option
- **Component:** `.card` with `bg-warning-50 border border-warning-200`
- Text: "This is optional. You can still receive meals and care without AVA calls."
- Below: two `.radio-label` card-style options:
  - "Yes, I'd like AVA calls" (default selected)
  - "No thanks, skip AVA calls"

### Footer Zone
- `.btn-primary` full width: "I agree" (consents 1 and 2) / "Continue" (consent 3)
- Below button on consents 1 and 2: "By tapping 'I agree', you confirm you have read and understood the above." -- `text-xs text-gray-400 text-center`

---

## Interaction Specifications

### "I Agree" / "Continue"
- **Trigger:** Patient taps the footer button
- **Feedback:** Brief transition to next consent step; after the last consent, navigates to `/onboarding/preferences`
- **Error handling:** If submit fails: inline error alert -- "We couldn't record your consent. Please try again." with retry

### Back Navigation
- **Trigger:** Patient taps back chevron
- **Feedback:** Returns to previous consent step; prior agreements are retained

### AVA Opt-Out Selection
- **Trigger:** Patient selects "No thanks, skip AVA calls"
- **Feedback:** Selected radio card shows active state (primary border + check); "Continue" button remains active with no warning or pressure

---

## States

### Loading State
- Full-page spinner on initial mount only

### Error State
- Submit failure: persistent error alert above footer button until resolved

---

## Accessibility Notes
- Back button: `aria-label="Go back"`
- Accordion must be keyboard-navigable
- Radio options must be keyboard-selectable
- "I agree" button `aria-label` must identify the consent: e.g., `aria-label="I agree to HIPAA Authorization"`
- Minimum font size 16px for all consent body text

## Bilingual Considerations
- Full consent text must be available in Spanish; longer Spanish text handled gracefully by the accordion's scroll
- "Read aloud" plays in the patient's selected language

## Open Questions
- Is "read aloud" in scope for MVP?
- Does the legal team need to approve the plain-language summaries before implementation?
- Should a "download a copy" option be offered after consent?
