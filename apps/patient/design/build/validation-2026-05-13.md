# Build Validation: Patient App (post-build, screen-by-screen)

**Date:** 2026-05-13
**Wireframe source:** `apps/patient/design/wireframes/*.md` (pt-01..05, assess-01..05, onb-01..03)
**Build reviewed:** `apps/patient/src/screens/**/*.tsx` rendered at http://localhost:5176/, captured headless at 1280×800 and 390×844
**Out of scope (already in flight):** the 12 AppShell items in `apps/patient/design/build/2026-05-13-design-panel-verdict.md`
**Research consulted:**
- W3C WAI, [WCAG 2.5.5 Target Size (Enhanced)](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html) — 44×44 CSS px floor for primary patient-facing touch targets
- W3C WAI, [WCAG 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) — 24×24 AA floor when spacing is preserved
- Smashing Magazine, ["Accessible Target Sizes Cheatsheet"](https://www.smashingmagazine.com/2023/04/accessible-tap-target-sizes-rage-taps-clicks/), Apr 2023 — Apple 44pt + Material 48dp consensus
- Baymard Institute, ["Live Chat Usability Issues"](https://baymard.com/blog/live-chat-usability-issues) — sticky chat affordances obscure when registers are inverted; sender contrast carries identity
- AHRQ Integration Academy, [PHQ-9 reference instrument](https://integrationacademy.ahrq.gov/sites/default/files/2020-07/PHQ-9.pdf) — clinical scoring bands are NOT shown to the patient at point of completion

## Overall Status: NEEDS REVISION

The shell behaves; the screens have one cross-cutting break (FontAwesome not loaded at runtime, so every icon renders blank), one IA gap (Meals route exists with no nav entry), and several screen-level deviations from wireframe spec (Settings notification layout, Messages bubble register inversion, Meals image source 404s, Welcome eye-toggle escape, prototype debug text shipped on assessment complete). With the FontAwesome and IA fixes, the demo is survivable; without them, every screen looks half-finished.

The good news: every route loads, the assessment flow works end-to-end with state persistence, validation gates on the password form fire, the consent walker advances through stages A→B→C, and the meals confirm-flow exists. The scaffolding is right; the polish layer is half-applied.

---

## Cross-cutting findings (affect multiple screens)

### CRITICAL: FontAwesome is not loaded in the patient app at runtime

Evidence: `getComputedStyle(<i.fa-solid>, ':before').content === "none"` and `font-family: "Source Sans 3"` for every icon element on every screen. Network requests on `/` show **no FA stylesheet fetched** — only Google Fonts. `apps/patient/index.html` includes Lora + Source Sans 3 + Source Code Pro but no `<link>` to the FA vendor CSS.

Comparison: the design-system pattern library loads FA via `packages/design-system/src/partials/head.html` → `<link href="/src/vendor/fontawesome/css/all.css">`. The React apps don't inherit that partial.

Visible consequences on every screen reviewed:
- Dashboard: `fa-truck` on delivery card → empty
- Dashboard: `fa-clipboard-list` on TaskCard (Anxiety check-in) → empty pale-teal disc
- Care: care-plan bullet markers → missing; reads as un-bulleted prose
- Health: trend-badge icons (`fa-arrow-trend-up`, `fa-minus`) → absent; trend status reads as text-only
- Messages: care-team avatar icon → empty light-blue disc
- Meals: status icon (`fa-clock` / `fa-circle-check`) on banner → invisible (banner reads as just text)
- Assessment Complete: `fa-circle-check` confirmation icon → not rendering
- Welcome / Consent: password-show `fa-eye` toggle → glyph absent; button still focusable but visually invisible (only its shape escapes the input — see Welcome punch-list item below)

This is the same failure class Aaron caught visually in Patch 75 (April 2026) for missing brand-font links. The `conform:brand-fonts` gate exists to catch font links; there is no equivalent gate for FA. **Recommend adding one** — or restructure the partial so apps inherit it.

### CRITICAL: `/meals` is unreachable from the app shell

Sidebar (desktop) and bottom-nav (mobile) both list five tabs: Dashboard, My Health, Messages, Care, Settings. No "Meals" tab. The only entry point to `/meals` is the "View my meals" link inside the `Recent deliveries` card on `/care`. The route exists, is themed, has a confirm flow, and is the highest-density action surface in the patient app — and it's a deep-link orphan.

The patient mobile shell wireframe (`patient-mobile-shell.md`, `shell-pt-mobile.md`) and `pt-shell-flow.md` should be checked against this — if they spec a 5-tab bar excluding Meals, the IA itself needs revisit. For demo, add "Meals" as a primary tab.

### MODERATE: Bottom-nav badge collides with label text

On mobile (390×844) viewing any route, the red `1` unread-badge on the Messages tab sits *on top of* the label rather than at the icon-top-right anchor. Confirms verdict item #4 isn't fully landed — the `mobile-bottom-nav-badge` → `nav-badge` rename + positioning fix is still in flight. Already in the verdict, not re-litigated, just noting it remains visible.

---

## Screen-by-screen

### Screen: Dashboard (`/`)

**Status:** NEEDS REVISION
**Wireframe:** `pt-01-dashboard.md`

#### Matches Spec
- Greeting + subline render with action-recent variant copy
- Today's check-in TaskCard wired to `/assessment/gad-7`
- Recent message preview card with sender label, body, View link
- Delivery status card present with "On the way" + arriving window + 5-meal summary

#### Deviations
- TaskCard icon column is an empty pale-teal disc — `fa-clipboard-list` not rendering (cross-cutting FA issue)
- Delivery status card icon (`fa-truck`) not rendering — card reads as untagged label + timing
- "New" pill positioning is suspicious — on the desktop capture it appears below the delivery card as a floating element rather than as a corner-anchored unread indicator on the message card. Re-verify after FA loads; if still misplaced, the `flex justify-between` on the message card is letting the pill escape.

#### Missing
- No skeleton/loading state visible (entire dashboard hardcoded to "loaded" variant per source comment)
- No empty state for "no tasks today" or "no recent message" — wireframe specifies fallback states
- No offline banner (verified `OfflineBanner` component exists; assumed dormant when online)

---

### Screen: Messages (`/messages`)

**Status:** NEEDS REVISION
**Wireframe:** `pt-02-messages.md`

#### Matches Spec
- "From your care team" subline present
- Sender label ("Sarah K., Care Coordinator") above first care-team bubble
- Outbound patient bubble right-aligned with teal background
- Notification card pattern for the check-in system message
- Sticky reply composer at bottom

#### Deviations
- **CRITICAL: bubble registers are inverted from messaging convention.** The care-team's first message renders as a *light gray bubble with dark text* (visually subdued); the patient's reply renders as the *teal-primary bubble*. iMessage, WhatsApp, Signal, and every patient-portal messaging surface I've reviewed all give the OTHER party the colored bubble and the SELF the neutral one. The current arrangement makes the care team look like a quoted reply to the patient.
  - Fix: swap the CSS for `.message-bubble-in` and `.message-bubble-out`. Care-team gets the teal / branded fill; patient gets the sand-neutral fill with subtle border.
- Care-team avatar circle (light teal) is empty — needs initials, photo, or a `fa-user-nurse` icon (cross-cutting FA blocks the icon path; initials would survive)
- The notification message ("Your weekly check-in is ready") has no sender attribution at all — reads as ambient text, not a system message

#### Missing
- No "unread" treatment visible on the care-team's first bubble despite the corresponding dashboard preview marking it `isUnread: true` — divergence between dashboard state and messages state
- No timestamps cluster headers (Today / Yesterday) per common messaging UX

---

### Screen: Settings (`/settings`)

**Status:** NEEDS REVISION
**Wireframe:** `pt-03-settings.md`

#### Matches Spec
- Language EN/ES selector renders (now per AppShell verdict item #8, should be radiogroup ARIA — in flight)
- Account name/email/phone fields render
- "Open Messages" link for account edits
- Sign out button
- Footer with Privacy / Terms

#### Deviations
- **CRITICAL: Notifications layout is horizontally split into THREE columns.** "Push notifications | Delivery updates | Check-in reminders" sit side-by-side, each with its own toggle on the right. Settings screens never use multi-column rows for toggle lists — this reads as a tablet/wide-screen experimental layout and feels broken. On mobile (390×844) it correctly stacks, suggesting the row uses a `flex` + `flex-wrap: nowrap` at viewport widths above some threshold.
  - Fix: lock notification rows to a single-column stack at all widths. Each row is `[label + help-text]` left, toggle right. Three rows, vertically.
- "Push notifications" row has a help-text ("We'll let you know when something needs you.") that the other two rows lack — inconsistent treatment of metadata
- Field labels in Account section run together with values without consistent spacing ("Name**Maria Rivera**" reads as concatenated)

#### Missing
- No "Account" subhead consistency with other section headers — Account card has heading; Notifications and Language do too, so this is mostly fine
- No "delete account" / "data export" footer per healthcare-app norms (out of scope for demo)

---

### Screen: My Health (`/health`)

**Status:** NEEDS REVISION
**Wireframe:** `pt-04-my-health.md` + `assess-01-my-health.md`

#### Matches Spec
- Three `trend-card`s for Mood, Energy, Meal Satisfaction
- "Updated N days ago" metadata on each
- Trend label ("Improving" / "Stable") right-aligned in card header
- Cards link to `/assessment/gad-7` (per spec, patient drills into the source instrument)

#### Deviations
- **CRITICAL: sparklines are technically rendering but visually flat.** Canvases exist (`document.querySelectorAll('canvas').length === 3`) at 702×40px, but the small Y-domain (data values 3..7) compressed into 40px of vertical space produces near-horizontal lines. The "Mood improving" trend is invisible as a trend. On a screen literally titled "Your progress, your story" the chart that *is* the story communicates nothing.
  - Fix: bump chart container height to 64-80px and tighten the Y-domain to the visible data range with a small pad (e.g., `min - 0.5`, `max + 0.5`) so the wobble actually shows.
- Trend badge icon (`fa-arrow-trend-up`, `fa-minus`) not rendering — cross-cutting FA issue; trend status is text-only

#### Missing
- No empty state for "first time, no data yet" — wireframe defers to assess-01-my-health spec which calls for it
- No metric detail screen wired — tapping a card goes to the assessment, skipping assess-05 metric detail. May be deliberate scope reduction, but the wireframe still references it.

---

### Screen: Care (`/care`)

**Status:** NEEDS REVISION
**Wireframe:** `pt-05-care.md`

#### Matches Spec
- "Your care plan" card with three plan items
- "Upcoming" card with appointment (Nutrition check-in with Dr. Soto, Thursday May 8 10am)
- "Recent deliveries" card with two delivered rows + "View my meals" trailing action (verdict item #3 `card-header` flex fix appears applied here)
- "To change anything, message your care coordinator" footer with "Open Messages" link
- DELIVERED status pills on delivery rows

#### Deviations
- Care plan items render as un-bulleted, indented text rows. Wireframe expects either bullet icons or check-glyphs (FA-driven) per item — currently they look like an ambiguous paragraph
- "Nutrition check-in with Dr. Soto" lacks a left icon (`fa-stethoscope` or similar) for visual hierarchy
- Date in the appointment row reads "Thursday, May 8" — today is May 13, so this appointment is in the past. Either change demo data to future date OR add a "today/upcoming/past" classification chip.

#### Missing
- No empty state for "no care plan yet" or "no upcoming appointments" — both wireframes call for fallbacks

---

### Screen: Meals (`/meals`)

**Status:** NEEDS REVISION
**Wireframe:** Per `meals-01-weekly-meals.md` (referenced in source comment)

#### Matches Spec
- 5 meal-day cards (Mon-Fri) with name, day, tag chips, and Swap action
- Status banner at top with confirm-by deadline
- "Have a question about your meals?" footer card with care-team link
- Sticky "Confirm my meals" CTA at page bottom

#### Deviations
- **CRITICAL: all 5 meal images are broken.** `imgSrc` points to `loremflickr.com/240/240/healthy,...?lock=NN` — DOM check confirms `complete: false, naturalWidth: 0` for every image. The placeholder gray boxes are the browser's broken-image rendering. For a patient-facing meal selector this is demo-blocking — patients pick food visually.
  - Fix: switch to local image assets (even stock photography committed to `apps/patient/public/meals/*.jpg`) OR an inline SVG plate-icon fallback when src fails OR a CSS gradient placeholder that explicitly reads as "image coming" rather than as a broken asset.
- "Swap meal" link wraps onto two lines ("Swap" / "meal") on both desktop and mobile because the column width is narrow. Reads as two separate links.
  - Fix: `white-space: nowrap` on the swap CTA OR shorten copy to just "Swap"
- Badge register is inconsistent across cards: "Low sodium", "Heart-healthy", "High protein" render with teal-tinted fill; "Diabetic-friendly", "Vegetarian" render with cool-gray fill. Verdict item #11 calls out the attribute-tag class extraction — this is the visible symptom. Likely both should be the same attribute-tag treatment.
- Status banner icon (`fa-clock`) not rendering — cross-cutting FA issue; banner reads as text-only on a warning-tinted background
- "Please confirm your meals by Wednesday at 5pm" — today is Tuesday May 13 (per system context). Wednesday is May 14. Deadline lands tomorrow. If demo runs through May 22 the date will be in the past on demo day; pin to a future-relative date string or compute it from current week.

#### Missing
- No "swap meal" interaction visible — clicking just logs (per source comment), no bottom-sheet picker; demo will hit a dead end if the panel clicks Swap
- No confirmed state visible (would require clicking Confirm and is gated by the screen state)
- No empty state for "no meals scheduled yet" per wireframe

---

### Screen: Onboarding — Welcome (`/onboarding/welcome`)

**Status:** NEEDS REVISION
**Wireframe:** `onb-01-welcome.md`

#### Matches Spec
- Step 1 of 3 progress indicator
- Headline + subline render
- Password + Confirm password inputs in card body
- "At least 8 characters" help text
- Continue button (disabled when invalid, enabled when both pass criteria)
- "Need help? Call us: (555) 123-CENA" footer

#### Deviations
- **CRITICAL: the password show/hide eye button has escaped its input wrapper.** Source position is `field-addon absolute right-2 top-1/2 -translate-y-1/2`. The parent `field-input-group` lacks `position: relative`, so the absolute-positioned button anchors to the nearest positioned ancestor (the viewport or some far ancestor), and the toggle floats at the right edge of the page — visible as a stray pill/toggle hanging in the empty space to the right of the card on desktop. On mobile it clips out of the viewport entirely.
  - Fix: add `relative` to `.field-input-group` in `components.css` (or whatever owns that class).
- Disabled Continue button uses a washed-teal fill that's visually ambiguous — could read as "loading" or "primary, just less saturated." Pair with cursor:not-allowed and remove hover affordance, or use a clearly disabled sand-200 fill.
- No password-meets-criteria affirmative feedback (green check, "8+ characters ✓") — only error states on blur. Adds anxiety for the patient who doesn't know whether they've satisfied the rule.

#### Missing
- Password strength meter (out of scope for demo, fine)
- "Already have an account? Sign in" link (out of scope for v1)

---

### Screen: Onboarding — Consent (`/onboarding/consent`)

**Status:** NEEDS REVISION
**Wireframe:** `onb-02-consent.md`

#### Matches Spec
- Step 2 of 3 progress
- Stage A label "HIPAA AUTHORIZATION"
- Headline "Your health information"
- Summary copy
- "Read the full text" accordion (correctly expands inline)
- "I agree" primary action
- Disclaimer footer

#### Deviations
- Stage walker progression is in component state, not URL — browser back skips the walker (verdict item already names this as post-demo polish)
- Accordion content is `[Full HIPAA authorization text pending legal review.]` — acceptable for an internal demo, but the moment this is shown to a real patient it's a compliance issue. Add a `[DEMO]` ribbon or have legal sign off before any patient touches the screen.
- "Step 2 of 3" implies linear progress — but the consent stage walker has its own A/B/C inside step 2. A reviewer doesn't know they've answered 1 of 3 sub-questions. Consider showing "Step 2 of 3 — Consent A of 3" or similar nested progress.

#### Missing
- No "Read the full text" content for stage C (Voice Call Preferences) — `fullText: { en: '', es: '' }` in source. Either remove the accordion on stage C or fill it.
- No yes/no radio for the voice-call preference visible at stage C in the captured screenshot (I confirmed default `voiceCallChoice: 'yes'` in state; the UI for the choice may be hidden or not rendered)

---

### Screen: Onboarding — Preferences (`/onboarding/preferences`)

**Status:** PASS WITH NOTES
**Wireframe:** `onb-03-preferences.md`

#### Matches Spec
- Step 3 of 3 progress
- Three fieldsets: language, cuisine preference, contact preference
- Skipping copy ("Skipping is okay — we'll use defaults...")
- All done CTA

#### Deviations
- "Phone call" and "Text message" chips wrap their labels onto two lines on mobile (390×844). Chip min-width too narrow for the longer of the three labels.
  - Fix: `white-space: nowrap` OR shrink horizontal padding OR add `flex: 1` so chips share row evenly
- No visible selection state on any chip — tapping "Latin American" produces no visual change in the capture. May be missing the `data-selected` / `aria-pressed` CSS hook
- Fieldset legends sit slightly above the fieldset border in a way that looks misaligned (visual nit, not functional)

#### Missing
- No "review and confirm" summary before All done — the patient submits without seeing what they chose

---

### Screen: Assessment Start (`/assessment/gad-7`, `/assessment/phq-9`)

**Status:** NEEDS REVISION
**Wireframe:** `assess-02-assessment-intro.md`

#### Matches Spec
- Title ("Anxiety check-in" for GAD-7; PHQ-9 should be "Mood check-in" per patient-friendly naming)
- Description ("Over the last 2 weeks, how often have you been bothered...")
- Duration estimate ("About 2 minutes — 7 questions")
- Privacy reassurance ("Your answers are private and shared only with your care team")
- Start CTA
- "Back to home" link

#### Deviations
- Header avatar circle is empty (`fa-clipboard-list` or similar not rendering — FA issue)
- PHQ-9 start screen title was not visually verified to differ from GAD-7; both routes render with the same layout; quick spot-check that PHQ-9 title isn't accidentally still "Anxiety check-in"

#### Missing
- No "you've taken this before — your last score was X" affordance (out of scope for demo)

---

### Screen: Assessment Question (`/assessment/gad-7/question/q1`)

**Status:** PASS WITH NOTES
**Wireframe:** `assess-03-question.md`

#### Matches Spec
- Title + 7-segment progress bar at top with current segment teal-filled
- "Question 1 of 7" caption
- Question prompt ("Feeling nervous, anxious, or on edge")
- 4 response options each with a numbered badge (0..3) + label
- Next CTA disabled until an answer is selected
- Selected state shows teal outline on the chosen card + filled teal number badge — confirmed visually
- localStorage persistence between questions

#### Deviations
- On desktop (1280×800), the response option cards sit in a narrow column flush-left with huge empty space to the right. Either center the column OR widen to a sensible reading width (60-75ch) OR use a card-grid for the 4 options.
- No back button visible to revisit a prior question — wireframe specifies a "Back" affordance per question
- "Question 1 of 7" caption is set in a muted gray that disappears against the sand background — bump to sand-700 for legibility

#### Missing
- Per-question info-tooltip not implemented — wireframe specifies a `(?)` icon for "what does this mean?" per question

---

### Screen: Assessment Complete (`/assessment/gad-7/complete`)

**Status:** NEEDS REVISION
**Wireframe:** `assess-04-complete.md`

#### Matches Spec
- "Thank you" Lora headline
- "Your care team will review your answers" assurance
- Done CTA returns to dashboard
- Guard logic redirects to /start if no responses exist (smart, correct)

#### Deviations
- **CRITICAL: `[prototype] score 5 of 21 — mild` is rendered as visible patient-facing copy.** Source comment explicitly says "Debug/demo only — score band visible while slice 1 is prototype. Production wireframe (assess-04) hides raw score from patient." The PHQ-9 / GAD-7 clinical convention is that the patient does NOT see their score at point of completion — the care team contextualizes it. Showing a "mild" band to a patient who scored 5 on anxiety could read as dismissive of their lived experience.
  - Fix: gate the prototype line behind a query-param or environment flag before the demo OR remove it entirely. If the demo audience (Dr. Dieckhaus) wants to verify the score calculation, show it in a clinician-facing view, not the patient confirmation.
- `fa-circle-check` success icon does not render — patient sees a "Thank you" text alone with no visual affirmation. Cross-cutting FA issue.

#### Missing
- No "your next check-in is in N days" copy — wireframe calls for a forward-looking nudge
- No "want to share more? Message your care team" affordance — single dead-end Done button

---

## Accessibility spot-checks

- Tab order on Dashboard goes: sidebar links → main content → "New" pill → View link → delivery card → end. The unexpected "New" pill stop suggests the pill is a `<button>` or has `tabindex` set inappropriately. Investigate.
- Touch targets on mobile: bottom-nav tabs appear ~48dp tall (good). Meal swap link is ~36px clickable height — below WCAG 2.5.5 AAA 44px. [Source: [W3C WAI WCAG 2.5.5](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)]
- Color-as-status: trend-badge currently relies on color + icon — but the FA icon is missing, so it's *color-only*. WCAG 1.4.1. The text label ("Improving", "Stable") is present, mitigating the failure to non-failing AA; restore the icon to clear the bar fully.
- Sparkline `aria-label` exists per source but I did not audit the actual content. The verdict already flags "labels chart existence, not the trend" as post-demo polish.
- Card-as-link on `/health`: every trend card is wrapped in `<Link aria-label="Mood: Improving">` — semantic-correct, screen-reader navigable.
- No skip-to-content link visible in the AppShell on the patient app. Sidebar nav comes first in DOM order; AT users tab through every nav item before reaching content. (Post-demo polish.)

## Healthcare-specific checks

- **HIPAA visibility:** consent text is placeholder. Acceptable for internal demo; not acceptable for any patient touch.
- **Error stakes:** the assessment "Next" button correctly disables until an answer is selected — good. Skip-question is not offered (correct for validated instruments).
- **Alert fatigue:** the Messages tab badge sits alone — no other alert/badge in the UI, so the patient has one signal to track. Healthy.
- **Cultural sensitivity:** "What kind of food feels like home?" is warm and well-pitched. "Soul Food" capitalization is correct. Spanish translations look accurate where present (didn't deep-validate).
- **Trust signals:** privacy reassurance copy is present on assessment start ("Your answers are private and shared only with your care team"). Consent walker correctly stages permission asks one at a time rather than a single overwhelming block.

## Cross-screen consistency

- Date formats: "Wednesday, Apr 30" (Care) vs "Thursday, May 8 · 10:00 AM" (Care Upcoming) vs "May 3, 1:00 AM" (Messages) — three different patterns. Pick one.
- "Care" vs "Care team" vs "Care coordinator" — vocabulary inconsistent across screens. Settle on a primary noun in copy.
- Card padding and corner radius look consistent across screens (verdict items #1, #10 are addressing). Good baseline.
- Page title typography (Lora serif) consistent across all screens. Good.
- "Open Messages" link copy appears verbatim on both Care and Settings — consistent, but might read as scripted. (Minor.)

---

## Punch List

Ordered by severity, then by screen. Each item is actionable (file + concrete fix).

### Critical (blocks or visibly breaks the demo)

1. **[Critical] Cross-cutting:** FontAwesome Pro CSS not loaded in patient app. Every `<i class="fa-...">` renders empty. **Fix:** add `<link rel="stylesheet" href="/src/vendor/fontawesome/css/all.css" />` to `apps/patient/index.html` (mirror the pattern-library partial). Verify with `getComputedStyle(<i>, ':before').content !== "none"`. Add a `conform:fontawesome` gate to parallel `conform:brand-fonts`.

2. **[Critical] Cross-cutting:** `/meals` is not in the sidebar or bottom-nav, despite being a high-density patient action. **Fix:** add a "Meals" tab to both `apps/patient/src/components/Sidebar.tsx` and `apps/patient/src/components/BottomNav.tsx` with icon `fa-utensils` (or per design system). Decide tab order with Aaron — likely Dashboard, My Health, Messages, Meals, Care, Settings (six tabs).

3. **[Critical] Messages (`/messages`):** care-team bubble and patient bubble are visually inverted from messaging convention. Care-team renders as muted gray, patient as branded teal. **Fix:** in `packages/design-system/src/styles/tokens/components.css`, swap the fill/border styling of `.message-bubble-in` and `.message-bubble-out`. Verify against iMessage/SMS convention (other party = colored, self = neutral). [Source: common chat-UI convention noted in [Baymard Live Chat usability research](https://baymard.com/blog/live-chat-usability-issues)]

4. **[Critical] Settings (`/settings`):** Notifications row lays out as three horizontal columns at desktop widths. **Fix:** in the notifications card markup in `apps/patient/src/screens/settings/index.tsx`, replace the flex-row layout with a vertical stack (each row = label + help + toggle). Notification preferences are never horizontal-multi-column at any width.

5. **[Critical] Meals (`/meals`):** all five meal images 404 from loremflickr.com — DOM check shows `naturalWidth: 0` for every img. **Fix:** in `apps/patient/src/screens/meals/index.tsx` (`DEMO_MEALS` array), replace `loremflickr.com` URLs with either local images committed to `apps/patient/public/meals/*.jpg` OR a deterministic inline SVG meal-plate placeholder. Patient picking food visually is the core flow.

6. **[Critical] Onboarding Welcome (`/onboarding/welcome`):** password show/hide eye button escapes its input — anchors to a far ancestor and floats at the right edge of the viewport (page on desktop, off-screen on mobile). **Fix:** in `packages/design-system/src/styles/tokens/components.css`, add `position: relative;` to the `.field-input-group` class. The eye button's `absolute right-2` will then anchor to the input wrapper as intended.

7. **[Critical] Assessment Complete (`/assessment/gad-7/complete`, `/phq-9/complete`):** `[prototype] score 5 of 21 — mild` renders visibly to the patient. **Fix:** in `apps/patient/src/screens/gad-7/complete.tsx` (and phq-9/complete.tsx), delete the prototype score `<p>` block at lines 44-48, or gate behind `import.meta.env.DEV`. PHQ-9/GAD-7 patient-facing UX convention does not show the score at point of completion — that's the care team's job. [Source: clinical scoring guidance per [AHRQ PHQ-9 reference](https://integrationacademy.ahrq.gov/sites/default/files/2020-07/PHQ-9.pdf)]

### Moderate (visible but workable)

8. **[Moderate] Dashboard (`/`):** the "New" unread pill on the message preview card appears mispositioned — sits below the delivery card as a floating element rather than corner-anchored on the message card. **Fix:** re-test after FA icons load; if still misplaced, audit the `flex items-start justify-between gap-2` wrapper in `apps/patient/src/screens/dashboard/index.tsx` line 83 — the pill may need `self-start` or to wrap inside the inner content div.

9. **[Moderate] My Health (`/health`):** trend sparklines compressed into 40px vertical space — Mood/Energy/Meal-Satisfaction wobble is visually flat. **Fix:** in `apps/patient/src/screens/health/index.tsx`, wrap each `<Sparkline>` in a container with `min-height: 64px` or `aspect-ratio: 12/1`. Also tighten the Sparkline Y-domain to `[min - 0.5, max + 0.5]` instead of 0-anchored.

10. **[Moderate] Care (`/care`):** Care plan items render as un-bulleted indented text — reads as a paragraph with awkward indents. **Fix:** in `apps/patient/src/screens/care/index.tsx`, add either a `<ul class="care-plan-list">` with disc bullets OR per-item `fa-check` icons. After FA loads either path works.

11. **[Moderate] Care (`/care`):** "Nutrition check-in with Dr. Soto, Thursday May 8" — date is in the past as of today (May 13). **Fix:** in `apps/patient/src/screens/care/index.tsx`, change demo data to a date in the future relative to demo day OR compute it dynamically (next Thursday).

12. **[Moderate] Meals (`/meals`):** "Swap meal" link wraps onto two lines because column is narrow. **Fix:** in the meal-card component (`packages/ui-react/src/components/MealDeliveryCard.tsx` or the consuming markup in `apps/patient/src/screens/meals/index.tsx`), apply `white-space: nowrap` to the Swap CTA OR shorten to "Swap".

13. **[Moderate] Meals (`/meals`):** badge register inconsistent — some tags fill teal-tinted, others gray. **Fix:** apply verdict item #11 (`attribute-tag` modifier class extraction) to all meal tags. They're all attribute-tags (sentence-case descriptive metadata), so they should all read the same way.

14. **[Moderate] Meals (`/meals`):** confirm-by date "Wednesday at 5pm" will be in the past by demo day. **Fix:** same pattern as care — compute or hardcode a future-relative deadline.

15. **[Moderate] Onboarding Preferences (`/onboarding/preferences`):** chip selection state not visible on tap; "Phone call" / "Text message" chips wrap. **Fix:** verify the chip `aria-pressed` styling exists in `components.css`; if missing, add filled-state CSS. Also `white-space: nowrap` on chip labels OR flex chips evenly across the row.

### Minor (polish)

16. **[Minor] Messages (`/messages`):** system notification ("Your weekly check-in is ready") has no sender attribution — reads as ambient text. **Fix:** add a small system-event label ("Cena Health system" or "Care reminder") above the notification card.

17. **[Minor] Messages (`/messages`):** no Today/Yesterday timestamp cluster headers. **Fix:** when adding a future date scroll, group messages by day with section headers. Out of scope for demo; track for next cycle.

18. **[Minor] Assessment question (`/assessment/gad-7/question/q1`):** on desktop, response options flush-left in a narrow column with huge empty right space. **Fix:** either center the question column at `max-w-2xl mx-auto` OR widen the option cards to a comfortable reading width.

19. **[Minor] Assessment question:** "Question 1 of 7" caption text-sand-400 is barely visible against the page. **Fix:** bump caption to sand-700.

20. **[Minor] Settings (`/settings`):** Account section "Name**Maria Rivera**" label and value run together. **Fix:** add `mr-2` or `gap-2` between `<dt>` and `<dd>` (or whatever pattern the source uses) in `apps/patient/src/screens/settings/index.tsx`.

21. **[Minor] Cross-screen:** date format inconsistent — "Wednesday, Apr 30" / "Thursday, May 8 · 10:00 AM" / "May 3, 1:00 AM" coexist. **Fix:** pick one (recommend "Wed, May 8 · 10:00 AM"); apply via a shared `formatDate` util in `apps/patient/src/lib/`.

22. **[Minor] Cross-screen:** vocabulary drift — "Care", "Care team", "Care coordinator" all in active use. **Fix:** settle on "your care team" as the primary noun; "care coordinator" only when naming the specific role (Sarah K.).

23. **[Minor] Welcome (`/onboarding/welcome`):** disabled Continue button uses washed teal that reads as ambiguous (loading vs disabled). **Fix:** use a sand-200 fill with sand-500 text + `cursor-not-allowed` for the explicit disabled state.

24. **[Minor] Welcome (`/onboarding/welcome`):** no affirmative "criteria met" feedback on password — only error states. **Fix:** add a subtle green check + "Looks good" below the password field when criteria pass.

25. **[Minor] Consent (`/onboarding/consent`):** stage walker A/B/C inside "Step 2 of 3" — patient doesn't know they have sub-questions. **Fix:** show "Step 2 of 3 — Part 1 of 3" or similar nested progress, OR redesign as a single-page scroll if all three consents must be acknowledged anyway.

---

## What to skip for demo (track for next cycle)

- Empty / loading states across screens (patient app currently hardcoded to loaded-with-data; OK for demo)
- URL routing for consent stages (verdict already names this)
- Per-question info-tooltips on assessments
- Skip-to-content landmark in AppShell
- Forward-looking nudge copy on assessment complete ("next check-in in N days")
- Storybook visual baselines for AppShell breakpoint switch (verdict already names)
- Sparkline `aria-label` trend-description upgrade (verdict already names)

The demo can survive without these. The 25 punch-list items above — especially the 7 criticals — cannot.

---

## Files referenced

Build:
- `/Users/aaronsleeper/Vaults/Lab/haven-ui/apps/patient/index.html` (FA missing)
- `/Users/aaronsleeper/Vaults/Lab/haven-ui/apps/patient/src/App.tsx`
- `/Users/aaronsleeper/Vaults/Lab/haven-ui/apps/patient/src/components/Sidebar.tsx`
- `/Users/aaronsleeper/Vaults/Lab/haven-ui/apps/patient/src/components/BottomNav.tsx`
- `/Users/aaronsleeper/Vaults/Lab/haven-ui/apps/patient/src/screens/dashboard/index.tsx`
- `/Users/aaronsleeper/Vaults/Lab/haven-ui/apps/patient/src/screens/messages/index.tsx`
- `/Users/aaronsleeper/Vaults/Lab/haven-ui/apps/patient/src/screens/settings/index.tsx`
- `/Users/aaronsleeper/Vaults/Lab/haven-ui/apps/patient/src/screens/health/index.tsx`
- `/Users/aaronsleeper/Vaults/Lab/haven-ui/apps/patient/src/screens/care/index.tsx`
- `/Users/aaronsleeper/Vaults/Lab/haven-ui/apps/patient/src/screens/meals/index.tsx`
- `/Users/aaronsleeper/Vaults/Lab/haven-ui/apps/patient/src/screens/onboarding/welcome.tsx`
- `/Users/aaronsleeper/Vaults/Lab/haven-ui/apps/patient/src/screens/onboarding/consent.tsx`
- `/Users/aaronsleeper/Vaults/Lab/haven-ui/apps/patient/src/screens/onboarding/preferences.tsx`
- `/Users/aaronsleeper/Vaults/Lab/haven-ui/apps/patient/src/screens/gad-7/{start,question,complete}.tsx`
- `/Users/aaronsleeper/Vaults/Lab/haven-ui/apps/patient/src/screens/phq-9/{start,question,complete}.tsx`
- `/Users/aaronsleeper/Vaults/Lab/haven-ui/packages/design-system/src/partials/head.html` (the FA-link reference for apps to mirror)
- `/Users/aaronsleeper/Vaults/Lab/haven-ui/packages/design-system/src/styles/tokens/components.css` (the bubble + field-input-group + attribute-tag fixes land here)
- `/Users/aaronsleeper/Vaults/Lab/haven-ui/packages/ui-react/src/components/MealDeliveryCard.tsx`

Screenshots (evidence): `/tmp/patient-validation-2026-05-13/*.png` (28 screenshots, desktop + mobile per route, plus assessment in-progress + real complete state seeded via localStorage).
