# UX Review: Patient App MVP

**Date:** 2026-03-12
**Mode:** Pre-build
**Inputs:** `.project-docs/wireframes/` (all 10 screen specs), `.project-docs/use-cases/` (all 7 use case docs)
**Research consulted:** NNG mobile patterns, W3C WCAG 2.1 touch target guidance, USWDS plain language guidance, Baymard form UX research

---

## Summary

The wireframes are well-structured and detailed. The primary user flows are achievable as specced. Three issues warrant revision before building: (1) the language toggle mechanism needs a concrete implementation pattern for the prototype, (2) the consent screen's "read aloud" feature needs to be descoped cleanly with a placeholder, and (3) the messages screen's compose area needs explicit mobile keyboard handling. No structural changes recommended.

---

## Screen: ONB-01 Welcome

### Improvements
- The "Need help? Call us: [phone number]" text uses a placeholder. Spec a real dummy number (e.g., 1-800-CENA-HLT) so the agent doesn't leave `[phone number]` in the HTML.
- The language toggle is top-right in the header zone. At the top of a form card, this conflicts with the show/hide password toggle spatially. Recommend moving the language toggle to the very top of the viewport above the card, not inside the header zone.

### Copy [REVISED]
- Welcome headline: "Welcome to Cena Health"
- Subhead: "Your meals and care team are ready. Let's set up your account."
- Password label: "Create a password"
- Confirm password label: "Confirm your password"
- Helper text: "Must be at least 8 characters"
- Error - mismatch: "Passwords don't match. Try again."
- Error - too short: "Password must be at least 8 characters."
- CTA: "Continue"
- Footer help: "Need help? Call us at 1-800-246-2458"
- Language toggle: "English" / "Español"
- Dummy phone: 1-800-246-2458 (use throughout all screens)

### i18n Implementation Note [NEW]
The language toggle uses `data-i18n-en` and `data-i18n-es` attributes on every text node. A small vanilla JS module reads the current language from `localStorage` key `cena-lang` and swaps all strings on toggle. All screens share a single `src/scripts/components/i18n.js` file. The toggle button lives in a fixed top bar that persists across all screens (both onboarding and post-onboarding). See new-components spec: `mobile-i18n-bar`.

---

## Screen: ONB-02 Consent

### Critical Issues
- "Read aloud" feature is listed as an open question in the wireframe. Descope for prototype: render the button as disabled with a tooltip "Coming soon" rather than hiding it. This gives Andrey a clear integration target without building TTS in the prototype.

### Improvements
- Back button on consent step 1 should return to ONB-01, not be disabled. The wireframe is ambiguous -- clarify: back from consent step 1 = back to ONB-01 welcome.
- The AVA consent opt-out card uses `bg-warning-50` which could read as "this is bad." Neutral `bg-stone-50` better fits the tone of "this is optional, no pressure."

### Copy [REVISED]
- HIPAA step label: "Step 1 of 3"
- HIPAA headline: "Your health information"
- HIPAA summary: "We'll share your health records with your care team so they can create the right meal plan for you. We keep your information private and secure."
- Program step label: "Step 2 of 3"
- Program headline: "How the program works"
- Program summary: "By joining, you agree to receive meals, care check-ins, and health support through Cena Health. You can leave the program at any time."
- AVA step label: "Step 3 of 3"
- AVA headline: "Voice check-ins (optional)"
- AVA summary: "AVA is our automated health assistant. It can call you for quick check-ins between visits. This is optional -- your meals and care continue either way."
- AVA option A: "Yes, I'd like AVA calls"
- AVA option B: "No thanks"
- Expand link: "Read full text"
- Read aloud button: "Read aloud" (disabled, tooltip: "Coming soon")
- I agree CTA: "I agree"
- AVA CTA: "Continue"
- Footer note: "By tapping 'I agree', you confirm you have read and understood the above."

---

## Screen: ONB-03 Preferences

### Improvements
- "What kind of food feels like home?" as a legend label is warm but may be confusing for patients who don't primarily cook at home. Alternative: "What flavors do you enjoy?"
- "No preference" should be visually distinct from the cuisine options (e.g., smaller, below the grid) to avoid patients feeling they must choose it if they don't see themselves in the options.

### Copy [REVISED]
- Headline: "Let's personalize your experience"
- Subhead: "You can always update these in your profile."
- Language legend: "What language do you prefer?"
- Food legend: "What flavors do you enjoy?"
- Food sub-label: "Pick as many as you like. We'll rotate your meals to match."
- Food options: "Latin American" / "Soul Food" / "Mediterranean" / "Asian" / "No preference"
- Contact method legend: "How should we reach you?"
- Contact sub-label: "Preferred contact method"
- Contact options: "Phone call" / "Text message" / "App notifications only"
- Best times legend: "Best times to reach you"
- Time options: "Morning (8am–12pm)" / "Afternoon (12pm–5pm)" / "Evening (5pm–8pm)"
- CTA: "All done"
- Skip note: "Skipping is fine -- we'll use your defaults and you can update anytime."
- Error: "We couldn't save your preferences. Try again?"
- Skip fallback link: "Skip for now"

---

## Screen: MEALS-01 Weekly Meals

### Improvements
- The meal card "Swap" link is `text-sm` right-aligned inside the card. On a 375px phone, right-aligning a small tap target next to a 64px photo is tight. Recommend placing "Swap" below the diet tags, left-aligned, to give it a full-width tap area.
- The sticky "Confirm my meals" footer overlaps content on short phones (iPhone SE). The meal list needs `pb-[80px]` to clear it.
- The care team shortcut card at the bottom should not appear when the ordering window is closed (meals already confirmed). It adds noise when the task is done.

### Copy [REVISED]
- Page title: "Your Meals"
- Subtitle - open: "Confirm by [day] at [time]"
- Subtitle - confirmed: "Confirmed for delivery [date]"
- Banner - unconfirmed: "Please confirm your meals by [day] at [time]."
- Banner - confirmed: "Your meals are confirmed. Delivery on [date]."
- Banner - auto-confirmed: "Your meals were confirmed automatically. Delivery on [date]."
- Swap link: "Swap meal"
- CTA: "Confirm my meals"
- Toast error: "Couldn't confirm. Please try again."
- Care team card: "Have a question about your meals?"
- Care team link: "Message your care team"
- Empty state heading: "Your meals aren't ready yet"
- Empty state body: "Your care team is setting up your meal plan. We'll send you a notification when it's ready."
- Empty state CTA: "Message your care team"
- Bottom sheet close: swipe down or tap outside (no visible close button needed)

---

## Screen: MEALS-02 Delivery Status

### Improvements
- The issue report form expands inline inside a card. After submission, the card shows confirmation text. This works but the transition needs to be explicitly specced: the form collapses (height: 0, opacity: 0) before the confirmation text fades in. Specify this as a CSS class swap, not JS animation -- keeps it simple for the agent.
- "See full list" navigates to `/meals`. Acceptable for prototype; note in the spec that this should deep-link to a read-only view of the confirmed meal list, not the ordering screen.

### Copy [REVISED]
- Page title: "Delivery"
- Subtitle: "Expected [day], [date]"
- Status - preparing: "Getting your meals ready"
- Status - out for delivery: "On the way"
- Status - delivered: "Delivered"
- Timing text: "Arriving between [time] and [time]"
- Delivered timing: "Delivered at [time]"
- Summary label: "What's coming"
- See full list: "See all meals"
- Issue card header: "Something wrong?"
- Issue button: "Report an issue"
- Issue options: "Meals not delivered" / "Wrong meals" / "Damaged packaging" / "Something else"
- Optional text placeholder: "Tell us more (optional)"
- Submit: "Submit report"
- Cancel: "Cancel"
- Confirmation: "Issue reported. Your care team will follow up."
- Care team link: "Questions? Message your care team"
- Empty state heading: "No delivery scheduled yet"
- Empty state body: "Your next delivery will show up here once it's scheduled."
- Status unavailable: "Status unavailable"
- Status unavailable sub: "Last updated: [time]"
- Refresh link: "Refresh"

---

## Screen: CARE-01 Messages

### Critical Issues
- The compose area is `position: sticky; bottom: [tab-bar-height]`. On iOS, the virtual keyboard pushes the viewport up, which can cause the sticky compose bar to sit above the keyboard with the message thread scrolled out of view. Spec this explicitly: the compose wrapper uses `env(safe-area-inset-bottom)` for padding and the thread area uses `-webkit-overflow-scrolling: touch` with `overflow-y: auto`. For the prototype (static HTML), this is a CSS-only concern -- no JS needed. Flag for Andrey as an Angular scroll restoration issue.
- The "new message" floating pill requires real-time updates -- descope for prototype. Build the pill as a static visible element for demo purposes; note that it requires WebSocket or polling in production.

### Improvements
- Sender labels ("Your dietitian", "Your coordinator") appear above the first message in a consecutive group. This is correct NNG guidance for chat UIs. Confirm the label grouping rule: same sender within 5 minutes = same group, no repeated label.
- Image attachment previews inside the compose area need an explicit size constraint: `max-h-20 rounded-md` inline with the textarea row.

### Copy [REVISED]
- Page title: "Your Care Team"
- Subtitle: "Your dietitian and coordinator"
- Placeholder: "Message your care team..."
- Attach aria-label: "Attach image"
- Send aria-label: "Send message"
- Sender label - dietitian: "Your dietitian"
- Sender label - coordinator: "Your coordinator"
- Date separator - today: "Today"
- Date separator - yesterday: "Yesterday"
- New message pill: "New message"
- Empty state heading: "No messages yet"
- Empty state body: "Have a question about your meals or your care? Send us a message."
- Load error: "Couldn't load your messages. Check your connection."
- Send error (on bubble): tap to retry icon only (no text -- space constrained)
- Pre-fill from meals screen: "I have a question about my meals."
- Pre-fill from delivery screen: "I have a question about my delivery."
- Pre-fill from profile read-only field: "I'd like to update my [field name]."

---

## Screen: CARE-02 Meal Feedback

### Improvements
- Section 2 (per-meal ratings) is collapsed by default inside an accordion. The accordion toggle sits below Section 1b (conditional issue type). If a patient selects thumbs down and Section 1b animates in, the accordion toggle shifts down significantly. Pin the accordion toggle to a consistent position -- place it above Section 3 (free text), not between Sections 1 and 1b.
- The "Already submitted" state (confirmation shown immediately on re-visit) is important for the pilot -- patients may open the screen from a notification they already responded to. Build this as a static demo state on a separate URL: `/care-team/feedback?state=submitted`.

### Copy [REVISED]
- Page title: "How were your meals?"
- Subtitle: "Delivery on [date]"
- Section 1 legend: "Overall, how were your meals this week?"
- Rating options: "Good" / "Okay" / "Not good"
- Section 1b legend: "What went wrong?"
- Issue options: "Meals didn't arrive" / "Wrong meals" / "Poor quality or damaged" / "Too much or too little food" / "Something else"
- Section 2 toggle: "Rate individual meals"
- Section 3 legend: "Anything else? (optional)"
- Placeholder: "Tell us more..."
- Helper: "Your care team will read this."
- CTA: "Submit feedback"
- Skip: "Skip for now"
- Confirmation heading: "Thanks for your feedback."
- Confirmation body: "We shared this with your care team."
- Confirmation CTA: "Done"
- Submit error: "Couldn't send your feedback. Try again?"

---

## Screen: PROFILE-01 Settings

### Improvements
- Four cards stacked with equal visual weight. The "Account" card (password change, logout) should be visually lighter -- consider a minimal list style rather than a full card, or place it last with a slightly reduced header weight. The destructive action (logout) needs to be the lowest-priority visual element on the page.
- The dirty-state save button animates in below a card when a field is edited. This is good UX but the agent needs an explicit trigger: add class `is-dirty` to the card wrapper when any child input fires `input` or `change`; the save button appears via CSS `display: flex` when `.is-dirty` is present on the card. Pure CSS + one small JS listener -- no framework needed.

### Copy [REVISED]
- Page title: "Profile & Settings"
- Card 1 header: "Contact & Delivery"
- Phone label: "Phone"
- Email label: "Email (optional)"
- Address label: "Street address"
- City label: "City"
- State label: "State"
- ZIP label: "ZIP"
- Medicaid label: "Medicaid ID"
- Read-only note: "Managed by your care team."
- Read-only link: "Contact us to update"
- Card 2 header: "Meal Preferences"
- Dietary notes label: "Notes for your care team"
- Dietary notes placeholder: "Any preferences or things to avoid?"
- Clinical restrictions note: "Set by your care team."
- Clinical restrictions link: "Message us to make changes"
- Card 3 header: "How We Reach You"
- Language label: "Your preferred language"
- Contact method label: "Preferred contact method"
- Times label: "Best times to reach you"
- Card 4 header: "Account"
- Change password row: "Change password"
- Logout row: "Log out"
- Save button: "Save changes"
- Saved confirmation: "Saved"
- Save error: "Couldn't save. Try again?"
- Address out of area: "We're checking your new address. Your care team will follow up before your next delivery."
- Logout modal: "Are you sure you want to log out?"
- Logout confirm: "Log out"
- Logout cancel: "Cancel"

---

## Cross-Screen Issues

### Language Toggle Implementation [NEW]
All screens use a shared `data-i18n-en` / `data-i18n-es` attribute pattern. A single JS module `src/scripts/components/i18n.js` handles the toggle. The toggle button lives in a fixed top bar (`mobile-i18n-bar` partial) that renders above all content on all screens. The `html` element gets `lang="en"` or `lang="es"` on toggle. The current language persists in `localStorage` key `cena-lang` for within-session consistency.

**All bilingual strings in this document are authoritative.** The agent uses `data-i18n-en` for English and `data-i18n-es` for Spanish on every text node. Spanish translations are provided in the component specs below.

### Dummy Phone Number
Use `1-800-246-2458` (1-800-CENA-HLT) consistently across all screens as the care team contact number.

### Meal Image Assets
Meal photos referenced as `src/assets/meals/[slug].jpg`. The agent uses descriptive slugs matching the meal name (e.g., `chicken-verde-rice.jpg`). All `<img>` tags include `alt` text. If the image file doesn't exist, the card shows a styled placeholder background (`bg-stone-100`) -- never a broken image icon. Use CSS: `img { object-fit: cover; } img[src=""], img:not([src]) { visibility: hidden; }` pattern with a background color on the wrapper.

### Safe Area Insets
All screens with fixed/sticky elements (bottom nav, sticky footer, compose bar) must use `padding-bottom: env(safe-area-inset-bottom)` on the fixed element itself to clear iOS home indicator.

### Prototype State Convention
Demo states accessible via URL query params:
- `?state=confirmed` -- meals confirmed state on MEALS-01
- `?state=delivering` -- delivery in progress on MEALS-02
- `?state=delivered` -- delivered state on MEALS-02
- `?state=submitted` -- already-submitted state on CARE-02
The agent implements these as JS that reads `URLSearchParams` on load and applies a CSS class to the body (`body.state-confirmed` etc.), which CSS then uses to show/hide the appropriate variant.

---

## Use Case Walk-Through

**PT-ONB-001 (Account Setup):** User can complete in ONB-01 and ONB-02. Progress indicator is clear. Consent is stepped. AVA opt-out is low-pressure. ✅

**PT-ONB-002 (Preferences):** User completes in ONB-03. Skip is allowed. Proceeds to meals. ✅

**PT-MEALS-001 (Browse & Confirm):** User sees meals, can swap, can confirm. Ordering window state is clear via banner. Auto-confirm state is represented. ✅

**PT-MEALS-002 (Delivery Status):** User sees status at a glance. Issue reporting is self-contained. ✅

**PT-CARE-001 (Messaging):** Compose is always visible. Thread is readable. Pre-fill shortcuts from other screens work. Deep-link pattern is specified. ✅

**PT-CARE-002 (Meal Feedback):** Under 60 seconds for typical flow. Thumbs down triggers issue type. Skip is explicit. ✅

**PT-PROFILE-001 (Profile):** Editable vs read-only fields are clearly separated. Save is per-card, dirty-state only. Logout is guarded. ✅

---

## Open Questions for Aaron

1. **Food preference images:** Confirm slug naming convention before build. Suggested: `latin-american.jpg`, `soul-food.jpg`, `mediterranean.jpg`, `asian.jpg`, `no-preference.jpg` (for preferences screen) + individual meal slugs for meal cards.
2. **Dummy meal data:** How many meals per week in the prototype? Suggest 5 (Mon-Fri) with 2 substitutes per meal for the swap demo.
3. **Dummy care team names:** The messages screen shows "Your dietitian" and "Your coordinator" as sender labels. Should we also show names? Suggest: "Maria Chen, RD" and "James Rivera" as dummy names, displayed as subtext under the role label.
4. **Delivery date in prototype:** Use a static future date (e.g., "Thursday, March 19") so the prototype doesn't feel stale. Confirm or suggest a date.

