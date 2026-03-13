# CARE-02: Meal Feedback

**Application:** Patient Portal (Mobile)
**Use Case(s):** PT-CARE-002
**User Type:** Patient
**Device:** Mobile-first
**Route:** `/care-team/feedback`

## Page Purpose

Collect structured post-delivery feedback on meals in under 60 seconds.

---

## Layout Structure

### Shell
- Bottom tab bar persistent; "Care Team" tab active
- Back button top left (`fa-chevron-left`)

### Header Zone
- **Component:** Plain stacked text, `px-4 pt-6 pb-2`
- Page title: "How were your meals?" -- Lora, large
- Subtitle: "Delivery on [date]" -- `text-sm text-gray-500`

### Content Zone

Designed to fit on one screen without scrolling for typical use. Sections use `fieldset` + `legend`.

#### Section 1: Overall Rating
- **Component:** `fieldset` with `legend` "Overall, how were your meals this week?"
- **Fields:** Three equal-width `.radio-label` card-style buttons in a row (`.grid` 3-column):
  - `fa-thumbs-up` + "Good" label below
  - `fa-face-meh` + "Okay" label below
  - `fa-thumbs-down` + "Not good" label below
- Touch target: minimum 72px height per option
- Selected state: primary border + `bg-primary-50`
- If "Not good" is selected, Section 1b animates in below

#### Section 1b: Issue Type (conditional)
- **Component:** `fieldset` with `legend` "What went wrong?" -- animates in when thumbs down is selected; collapses if patient switches to another rating
- **Fields:** Stacked full-width `.btn-outline` buttons (single-select):
  - `fa-box-open` "Meals didn't arrive"
  - `fa-utensils` "Wrong meals"
  - `fa-trash` "Poor quality / damaged"
  - `fa-scale-unbalanced` "Too much / too little food"
  - `fa-circle-question` "Something else"
- Selected state: primary border + `fa-check` right-aligned
- Required when thumbs down is selected (validated on submit)

#### Section 2: Per-Meal Ratings (optional, collapsed by default)
- **Component:** `hs-accordion` with toggle "Rate individual meals" (`fa-chevron-down`)
- When expanded: compact list of this delivery's meals, each with:
  - Meal name -- `text-sm font-medium`
  - Three icon buttons in a row: `fa-thumbs-up`, `fa-face-meh`, `fa-thumbs-down` (`size-8` touch targets, `text-gray-400` default, colored on tap)

#### Section 3: Free Text (optional)
- **Component:** `fieldset` with `legend` "Anything else to tell us? (optional)"
- Standard `textarea`, 3 rows
- Placeholder: "Tell us more..." / "Cuéntanos más..."
- Helper text: "Your care team will read this." -- `text-xs text-gray-400`

### Footer Zone
- **Component:** Sticky bar above tab bar, `bg-white border-t border-gray-200 p-4`
- `.btn-primary` full width: "Submit feedback"
- Disabled until Section 1 rating is selected
- Below: "Skip for now" text link -- `text-sm text-gray-400 text-center` -- navigates back without submitting

---

## Interaction Specifications

### Overall Rating Selection
- **Trigger:** Patient taps a rating card
- **Feedback:** Selected card shows active state; Section 1b animates in if thumbs down, collapses if switching away from thumbs down

### Submit Feedback
- **Trigger:** Patient taps "Submit feedback" with rating selected (and issue type selected if thumbs down)
- **Feedback:** Form is replaced by a confirmation state:
  - `fa-circle-check text-success-500`, large, centered
  - "Thanks -- we shared this with your care team." -- `text-center`
  - "Done" `.btn-outline` -- navigates to `/meals`
- **Error handling:** Error alert above footer -- "We couldn't send your feedback. Try again?" with retry

### Skip for Now
- **Trigger:** Patient taps "Skip for now"
- **Feedback:** Immediate navigation back; no data submitted

### Push Notification Entry
- **Trigger:** Patient taps the post-delivery push notification
- **Feedback:** App opens directly to this screen with the relevant delivery pre-loaded

### Already Submitted
- **Trigger:** Patient navigates to this screen for a delivery they already rated
- **Feedback:** Confirmation state shown immediately (no form)

---

## States

### Loading State
- Sections 1 and 3 render immediately (no async dependency)
- Skeleton list in Section 2 while meal names load

### Error State
- If delivery data fails to load: error alert -- "We couldn't load your delivery details. Try again?" with retry
- Submit failure handled inline (see Interaction Spec)

---

## Accessibility Notes
- Overall rating: icon + text label on every option (never icon alone); `aria-label` on each radio
- Section 1b expansion announced via `aria-live="polite"`
- Issue type buttons: keyboard-navigable with clear focus ring
- Free text textarea supports voice dictation

## Bilingual Considerations
- All labels, option text, and placeholders in Spanish when language is set to Español
- Meal names in Section 2 should already be bilingual per MEALS-01 spec
- Confirmation: "Gracias -- compartimos esto con tu equipo de atención."

## Open Questions
- Does "Something else" in issue type require free text to be entered (to ensure actionable data)?
- Should the patient be able to view their past feedback history anywhere in the app?
