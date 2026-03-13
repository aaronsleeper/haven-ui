# MEALS-01: Weekly Meals

**Application:** Patient Portal (Mobile)
**Use Case(s):** PT-MEALS-001
**User Type:** Patient
**Device:** Mobile-first
**Route:** `/meals`

## Page Purpose

Show the patient their upcoming week's meals, allow limited substitutions, and get confirmation before the ordering window closes.

---

## Layout Structure

### Shell
- Bottom tab bar persistent (see `shell-bottom-nav.md`); "Meals" tab active

### Header Zone
- **Component:** Plain stacked text, `px-4 pt-6 pb-2`
- Page title: "Your Meals" -- Lora, large
- Subtitle: Ordering window status -- `text-sm text-gray-500`
  - Open: "Confirm by Wednesday at 5pm"
  - Closed: "Confirmed for delivery [date]"
- Bilingual toggle top right (handled at shell level)

### Content Zone

#### Status Banner
- **Component:** Alert bar, full width below header
- **Unconfirmed (window open):** `bg-warning-50 border border-warning-200` -- `fa-clock` -- "Please confirm your meals by [day] at [time]."
- **Confirmed:** `bg-success-50 border border-success-200` -- `fa-circle-check` -- "Your meals are confirmed. Delivery on [date]."
- **Auto-confirmed:** `bg-info-50 border border-info-200` -- `fa-info-circle` -- "Your meals were automatically confirmed. Delivery on [date]."
- Hidden once the delivery is complete

#### Meal List
- **Component:** Stacked list of `.card` items, `space-y-3 px-4`
- Each card:
  - Left: meal photo (`size-20`, `rounded-lg`, `object-cover`)
  - Right: stacked text
    - Meal name -- Inter medium, `text-base`
    - Day label -- `text-xs text-gray-500` (e.g., "Monday")
    - Up to 2 diet tag badges (`.badge-info` or `.badge-secondary`) -- e.g., "Low sodium", "Diabetic-friendly"
  - If a substitute is available and the window is open: "Swap" text link, `text-sm text-primary-600`, right-aligned
- Tapping a card (not the Swap link) opens a bottom sheet with meal detail

#### Message Care Team Shortcut
- **Component:** `.card` with `bg-teal-50 border border-teal-200`, below the meal list
- `fa-comment` icon in teal
- "Have a question about your meals?" -- `text-sm`
- "Message your care team" -- `text-sm text-primary-600 font-medium`
- Navigates to `/care-team/messages` with "Question about my meals" pre-filled in the compose field

### Footer Zone
- **Component:** Sticky bar above tab bar, `bg-white border-t border-gray-200 p-4`
- `.btn-primary` full width: "Confirm my meals"
- Visible only when the ordering window is open and meals are not yet confirmed
- Hidden once confirmed or window closes

---

## Interaction Specifications

### Confirm My Meals
- **Trigger:** Patient taps "Confirm my meals"
- **Feedback:** Status banner switches to confirmed state; sticky footer disappears
- **Error handling:** Toast error -- "We couldn't confirm your meals. Please try again." with retry

### Swap a Meal
- **Trigger:** Patient taps "Swap" on a meal card
- **Feedback:** Bottom sheet slides up with a list of available substitute meals (same card layout, no swap link). Patient taps one to select it. Sheet closes; card updates to show the substitute with a "Swapped" badge.
- **Error handling:** If no substitutes: "Swap" link is not shown. If substitutes fail to load: bottom sheet shows error with retry.

### View Meal Detail
- **Trigger:** Patient taps anywhere on a meal card except the Swap link
- **Feedback:** Bottom sheet slides up showing larger photo, full meal name, description, diet tags, and ingredients summary if available. Close on swipe-down or tap-outside.

---

## States

### Empty State
- **Component:** Empty state card, centered
- Icon: `fa-bowl-food` in `text-gray-300`, large
- Heading: "Your meals aren't ready yet"
- Message: "Your care team is setting up your meal plan. You'll get a notification when it's ready."
- CTA: "Message your care team" `.btn-outline`

### Loading State
- 3 skeleton cards while meal data loads; gray placeholder blocks matching card dimensions

### Error State
- Error alert at top of content zone: "We couldn't load your meals. Check your connection." with retry
- If retry fails: "Call your care team at [phone]" with `fa-phone`

---

## Accessibility Notes
- Meal photos require `alt` text with meal name and brief description
- "Swap" links must have `aria-label="Swap [meal name]"` to distinguish multiple instances
- Bottom sheets must trap focus; close on swipe-down or tap-outside
- Diet tags: icon + text, not color alone

## Bilingual Considerations
- Meal names and descriptions must be available in Spanish
- Day labels and deadline text must be localized
- Diet tag text must be translated

## Open Questions
- Can a patient swap back to the original meal after substituting?
- Are multi-day meals (one card covering multiple days) a real scenario, or is it always one card per day?
- What is the maximum number of meal cards per week? Affects scroll length.
