# PROFILE-01: Settings & Profile

**Application:** Patient Portal (Mobile)
**Use Case(s):** PT-PROFILE-001
**User Type:** Patient
**Device:** Mobile-first
**Route:** `/profile`

## Page Purpose

Let the patient update their contact info, delivery address, food preferences, and communication settings -- with clear separation between what they can edit and what the care team manages.

---

## Layout Structure

### Shell
- Bottom tab bar persistent; "Profile" tab active

### Header Zone
- **Component:** Plain stacked text, `px-4 pt-6 pb-4`
- Page title: "Profile & Settings" -- Lora, large
- No subtitle needed

### Content Zone

Sections use `.card` with a `border-b` header section + `p-4` body. Cards stacked vertically with `space-y-4 px-4`.

#### Card 1: Contact & Delivery
- **Card header:** "Contact & Delivery" -- `text-sm font-semibold text-gray-700 uppercase tracking-wide`
- **Editable fields:**
  - Phone number -- `input[type="tel"]` with label "Phone"
  - Email -- `input[type="email"]` with label "Email" (optional)
  - Delivery address -- `input[type="text"]` with label "Street address"
  - City, State, ZIP -- `input[type="text"]` inline row (`.grid-2` for city + state/zip)
- **Read-only fields:**
  - Medicaid ID -- displayed as static text with label; `text-gray-500 italic text-sm` value
  - Below: `text-xs text-gray-400` -- "Managed by your care team. Contact us to update."
  - "Message care team" link -- `text-xs text-primary-600`
- **Save:** `.btn-primary` small, "Save changes" -- appears below card only when a field has been edited (dirty state)

#### Card 2: Meal Preferences
- **Card header:** "Meal Preferences"
- **Editable fields:**
  - Cultural food preferences -- same visual checkbox cards as ONB-03 (`.grid-2` image cards); currently selected shown pre-checked
  - Dietary notes -- `textarea` 2 rows, label "Notes for your care team", placeholder "Any preferences or things to avoid?" -- `text-sm`
- **Read-only fields:**
  - Clinical dietary restrictions -- displayed as pill badges (`.badge-warning`) in a wrapped row
  - Below: `text-xs text-gray-400` -- "Set by your care team. Message us to make changes."
  - "Message care team" link -- `text-xs text-primary-600`
- **Save:** Inline `.btn-primary` small per card on dirty state

#### Card 3: Communication
- **Card header:** "How We Reach You"
- **Editable fields:**
  - Preferred language -- two `.radio-label` cards side by side: "English" / "Español"; selecting immediately re-renders app language
  - Preferred contact method -- three `.radio-label` cards: "Phone call" (`fa-phone`), "Text" (`fa-comment-sms`), "App only" (`fa-bell`)
  - Best times to reach you -- three checkbox cards: "Morning", "Afternoon", "Evening"
- **Save:** Inline `.btn-primary` small per card on dirty state

#### Card 4: Account
- **Card header:** "Account"
- **Actions (tappable rows):**
  - "Change password" -- `fa-lock` left, `fa-chevron-right` right -- navigates to password change flow
  - "Log out" -- `fa-right-from-bracket` left -- triggers confirmation modal before logging out

---

## Interaction Specifications

### Edit a Field
- **Trigger:** Patient taps any editable field
- **Feedback:** Field enters native focus state; card-level "Save changes" button animates in below the card
- **Error handling:** Inline validation on blur for format errors (phone, email, address)

### Save Changes
- **Trigger:** Patient taps "Save changes" on a card
- **Feedback:** Save button replaced by `fa-circle-check text-success-500` "Saved" that fades after 2 seconds; button disappears
- **Error handling:** Inline error below card -- "We couldn't save your changes. Try again?" with retry; save button remains visible

### Delivery Address Change
- **Trigger:** Patient saves a new delivery address
- **Feedback:** If address is in the service area: standard save confirmation. If address cannot be confirmed: `bg-warning-50` alert below card -- "We're checking your new address. Your care team will follow up before your next delivery."

### Language Toggle
- **Trigger:** Patient selects a different language in Card 3
- **Feedback:** Entire app re-renders in selected language immediately; card-level save button becomes visible

### Log Out
- **Trigger:** Patient taps "Log out"
- **Feedback:** Confirmation modal -- "Are you sure you want to log out?" with "Log out" `.btn-danger` and "Cancel" `.btn-outline`; on confirm, navigate to login screen

---

## States

### Clean State
All save buttons hidden.

### Dirty State
Save button visible for the card containing edited field(s).

### Loading State
Skeleton input fields while profile data loads.

### Error State
Error alert at top of content zone: "We couldn't load your profile. Check your connection." with retry.

---

## Accessibility Notes
- Read-only fields: `aria-readonly="true"` plus visual distinction (`italic` + lock icon -- not color alone)
- Language change must update the `lang` attribute on the `<html>` element immediately
- Save button appearance must be announced to screen readers (`aria-live="polite"` on the card's action zone)
- Log out confirmation modal must trap focus

## Bilingual Considerations
- All card headers, labels, and help text must be in the patient's selected language
- Address fields remain Latin-character inputs regardless of language
- Cultural preference image card labels must be bilingual (same as ONB-03)

## Open Questions
- Can patients update dietary preferences and notes themselves, or do changes require care team review before affecting the meal plan?
- Should family/caregiver contact (e.g., a phone number for delivery notifications) be managed on this screen?
