# ONB-03: Preferences Setup

**Application:** Patient Portal (Mobile)
**Use Case(s):** PT-ONB-002
**User Type:** Patient
**Device:** Mobile-first
**Route:** `/onboarding/preferences`

## Page Purpose

Collect the patient's language, cultural food preferences, and communication preferences so the program feels personalized from day one.

---

## Layout Structure

### Shell
- No bottom tab bar (onboarding suppresses persistent nav)
- Back button top left (`fa-chevron-left`) -- returns to ONB-02
- Progress indicator top center: "Step 3 of 3"

### Header Zone
- **Component:** Plain stacked text, no card
- Headline: "Let's personalize your experience" -- Lora, large
- Subhead: "You can always update these later." -- Inter, `text-gray-500`

### Content Zone

Single scrollable page. Sections use `fieldset` + `legend` for grouping.

#### Section 1: Language
- **Component:** `fieldset` with `legend` "Your preferred language"
- **Fields:** Two `.radio-label` card-style options side by side (`.grid-2`):
  - "English"
  - "Español"
- Default: no pre-selection
- Selecting a language immediately re-renders all UI labels in that language

#### Section 2: Cultural Food Preferences
- **Component:** `fieldset` with `legend` "What kind of food feels like home?"
- Sub-label: "We'll use this to personalize your meals. You can pick more than one." -- `text-sm text-gray-500`
- **Fields:** Visual checkbox cards in a 2-column grid (`.grid-2`). Each card:
  - Food category image (square, `rounded-lg`)
  - Label below image: "Latin American", "Soul Food", "Mediterranean", "Asian", "No preference"
  - Selected state: primary border + checkmark overlay on image
- "No preference" deselects all others when tapped; selecting any cuisine deselects "No preference"

#### Section 3: Communication Preferences
- **Component:** `fieldset` with `legend` "How should we reach you?"

##### Contact Method
- Sub-label: "Preferred contact method"
- **Fields:** Three `.radio-label` cards:
  - "Phone call" (`fa-phone`)
  - "Text message" (`fa-comment-sms`)
  - "App only" (`fa-bell`)

##### Best Times
- Sub-label: "Best times to reach you"
- **Fields:** Three checkbox cards (multi-select):
  - "Morning (8am–12pm)"
  - "Afternoon (12pm–5pm)"
  - "Evening (5pm–8pm)"

### Footer Zone
- `.btn-primary` full width: "All done"
- Below: "Skipping is okay -- we'll use defaults and you can update anytime." -- `text-xs text-gray-400 text-center`
- Tapping with nothing selected applies defaults and proceeds

---

## Interaction Specifications

### Language Selection
- **Trigger:** Patient taps a language card
- **Feedback:** Selected card shows active state; all UI text re-renders in selected language immediately

### Food Preference Selection
- **Trigger:** Patient taps a food category card
- **Feedback:** Card toggles selected state; "No preference" mutual exclusivity enforced visually

### "All Done" Button
- **Trigger:** Patient taps "All done"
- **Feedback:** Navigates to `/meals`; bottom tab bar appears for the first time
- **Error handling:** If submit fails: inline error alert above button -- "We couldn't save your preferences. Try again?" with a "Skip for now" fallback link

---

## States

### Empty State
All fields start unselected.

### Error State
Submit failure: persistent error alert above footer with retry and "Skip for now" option.

---

## Accessibility Notes
- Food preference images require descriptive `alt` text
- Selected state must not rely on color alone -- use border + icon
- `fieldset`/`legend` associations required for screen readers

## Bilingual Considerations
- Food category labels: "Latin American / Latinoamericana", "Soul Food / Comida del sur", "Mediterranean / Mediterránea", "Asian / Asiática", "No preference / Sin preferencia"
- Section labels may be slightly longer in Spanish; single-column fallback available via responsive grid

## Open Questions
- Who provides and maintains the food category images? Hardcoded for MVP or configurable?
- Should dietary restrictions set by the care team be shown as read-only context on this screen, or surfaced only in Profile?
