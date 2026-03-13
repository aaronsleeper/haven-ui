# ONB-01: Welcome & Account Setup

**Application:** Patient Portal (Mobile)
**Use Case(s):** PT-ONB-001
**User Type:** Patient
**Device:** Mobile-first
**Route:** `/onboarding/welcome`

## Page Purpose

Allow a newly referred patient to set a password or PIN so they can access their account.

---

## Layout Structure

### Shell
- No bottom tab bar (onboarding suppresses persistent nav)
- No back button on this first screen
- Progress indicator at top: "Step 1 of 3" -- plain text, `text-sm text-gray-500`, centered

### Header Zone
- **Component:** Full-bleed warm background (`bg-stone-50`), centered content
- Cena Health wordmark/logo (small, top center)
- Headline: "Welcome to Cena Health" -- Lora font, large
- Subhead: "Your meals and care team are ready. Let's set up your account." -- Inter, regular weight, `text-gray-500`
- Bilingual toggle at top right: "English / Español" -- `.btn-outline` small

### Content Zone

#### Account Setup Form
- **Component:** `.card` centered with generous vertical padding
- **Fields:**
  - Label: "Create a password"
  - `input[type="password"]` -- auto-styled, full width, show/hide toggle (`fa-eye` / `fa-eye-slash`)
  - Label: "Confirm password"
  - `input[type="password"]` -- auto-styled, full width, show/hide toggle
  - Helper text below: "At least 8 characters" -- `text-xs text-gray-500`
- **Field states:**
  - Default: empty
  - Error: inline message below field in `text-error-600` -- "Passwords don't match" or "Too short"

### Footer Zone
- `.btn-primary` full width: "Continue"
- Disabled until both fields are filled and matching
- Below button: "Need help? Call us: [phone number]" -- `text-xs text-center text-gray-500`

---

## Interaction Specifications

### Continue Button
- **Trigger:** Patient taps "Continue" with valid matching passwords
- **Feedback:** Immediate navigation to `/onboarding/consent`
- **Error handling:** If submit fails: inline error alert at top of card -- "Something went wrong. Please try again." with retry

### Language Toggle
- **Trigger:** Patient taps "Español"
- **Feedback:** All UI text on this and all subsequent screens switches to Spanish immediately; toggle label updates

---

## States

### Loading State
- Spinner centered in the card while the page initializes
- If initialization fails: error alert with care team phone number

### Error State
- Network error on submit: alert at top of card -- "We couldn't save your account. Check your connection and try again."

---

## Accessibility Notes
- Password fields must support show/hide toggle (`aria-label="Show password"`)
- "Continue" button must have clear disabled state (`aria-disabled="true"`)
- Error messages must be associated with their inputs via `aria-describedby`

## Bilingual Considerations
- All strings are short; Spanish translations are roughly the same length -- no layout changes needed
- Phone number in footer is the same in both languages

## Open Questions
- Should the patient's name appear in the welcome headline ("Welcome, Maria")?
- Who provides the care team phone number shown in the footer?
