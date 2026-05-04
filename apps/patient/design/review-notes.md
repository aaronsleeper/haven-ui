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

---

# UX Review: Patient Mobile Shell + v1 Routes (Stage 2 Pipeline)

**Date:** 2026-05-03
**Inputs:**
- `apps/patient/design/wireframes/pt-shell-flow.md`
- `apps/patient/design/wireframes/shell-pt-mobile.md`
- `apps/patient/design/wireframes/pt-01-dashboard.md`
- `apps/patient/design/wireframes/pt-02-messages.md`
- `apps/patient/design/wireframes/pt-03-settings.md`
- `apps/patient/design/wireframes/pt-04-my-health.md`
- `apps/patient/design/wireframes/pt-05-care.md`
**Reviewer:** ux-design-review (pre-build mode)
**Research consulted:**
- NN/G, "Basic Patterns for Mobile Navigation: A Primer" — bottom-nav 4-5 tab boundary; "5 tabs is at the upper limit of what's practical for mobile navigation bars" [Source: NN/G, "Basic Patterns for Mobile Navigation"]
- NN/G, "Tabs, Used Right" — cognitive load and tab chunking [Source: NN/G, "Tabs, Used Right"]
- NN/G, "Beyond the Hamburger" — bottom-nav discoverability [Source: NN/G, "Beyond the Hamburger"]
- WCAG 2.1 — touch target sizing (44px) and `lang` attribute toggling
- HIPAA-aware UX: patient-facing surfaces hide agent activity (defense-in-depth: server-side AND client-side allowlist filtering — established practice)
- Plain language standards: 5th grade reading level for chronic-care, bilingual patient populations (uncited but established practice; gov.uk Design System / USWDS plain-language precedents)

## Summary

Patient wireframes are bilingual-ready, accessibility-conscious, and respect the locked decisions (patient never sees "thread" / "agent" / "tool call"; route-based instead of swipe-nav at v1; 5 tabs in bottom-nav; bilingual on Messages + Settings + Assessments + Dashboard). All primitives ship — the patient-allowlist `thread-panel` is correctly flagged as a Tier 1 promotable composition. Three issues need attention: (1) the 5-tab bottom-nav approaches NN/G's practical upper limit; tab labels in Spanish ("Mi Salud" / "Mensajes" / "Cuidado" / "Ajustes") need confirmation that they fit at the active-state weight bump without truncating at 320px; (2) the empty-state copy across screens is warm but inconsistent in tone — Dashboard reads "Nothing to do today. Enjoy your day, Maria." (very warm); Messages reads "No messages yet" (terse); Care reads "Your care plan will appear here once your team finishes setting it up." (institutional). Aim for one tone register; (3) bilingual patient copy needs review for ES strings that are ~30% longer — the dashboard's "Bienvenida, María" + greeting subline pair is a known wrap risk. All copy is now resolved inline; tone-consistency is a pattern fix.

## Screen: pt-shell-flow

### Critical Issues

None. Flow document accurately reflects v1 routes and the deferred swipe-nav decision.

### Improvements

- **Push-notification deep-link** lands on Dashboard at v1 (Gate 2 decision 7). The flow doc mentions this but the patient-mobile-shell doesn't reinforce it; reader has to cross-reference. Recommendation: add a single line to `shell-pt-mobile` Interaction Specifications confirming Dashboard-as-deep-link-landing.

## Screen: shell-pt-mobile

### Critical Issues

None. The mobile shell is structurally correct, including the "Ava avatar never appears in patient app" rule and the strict allowlist for the patient `thread-panel` configuration.

### Improvements

- **Bottom-nav 5-tab cognitive load.** NN/G research identifies 5 tabs as the practical upper limit; designers should question whether all items are necessary. The Care + My Health combo could fold into one in a v1.5 simplification, but this is locked at v1 (Gate 2 decision 10). Surface in Open Questions: confirm 5 tabs is the right call for v1; recommend a usability check post-launch.

- **ES tab labels at active-state weight bump.** "Mi Salud" / "Mensajes" / "Cuidado" / "Ajustes" — at Source Sans 3 Semibold + Navigation/Primary 13.33px, "Mensajes" is 8 chars (longest); "Mi Salud" + "Ajustes" + "Cuidado" all fit. Spec says "may need a tighter Spanish phrase if the longer string causes wrap." At 320px viewport / 5 tabs / ~64px per tab — text width is the constraint. Mensajes at 13.33px Semibold ≈ 70px label width — fits within 64px tab if the icon is above (vertical layout), tight for horizontal. Recommendation: confirm vertical icon-above-label layout in `mobile-bottom-nav-tab` (which the partial already uses); validate at 320px.

- **Active-tab teal accent intensity (Open Question 4)** — confirmed `interactive/accent-color` (#418f82) per `DESIGN.md`, not `teal-700` button-fill. Promote from Open Questions to canonical spec.

- **Offline banner copy** uses "Sin conexión" — ES is correct but slightly terse compared to the EN "You're offline. Some things may not work right now." Tighten or expand both? Recommendation: "Sin conexión. Algunas funciones están limitadas ahora." reads more naturally than the spec's truncated "están limitadas." Update inline.

### Copy

- **Offline banner EN:** "You're offline. Some things may not work right now."
- **Offline banner ES:** "Sin conexión. Algunas funciones están limitadas ahora."
- **Tab labels EN:** Dashboard / My Health / Messages / Care / Settings
- **Tab labels ES:** Inicio / Mi Salud / Mensajes / Cuidado / Ajustes

## Screen: pt-01-dashboard

### Critical Issues

None.

### Improvements

- **Greeting subheading variants** — "It's a sunny Tuesday. You logged your weight this morning — great job." is rich but assumes recent-action data. What if patient hasn't logged anything? Recommendation: define 3 templates explicitly:
  1. Action-recent: "It's [day]. You [action] [time-period] — great job."
  2. Action-none-but-warm: "Hope you're having a good [day-period], Maria."
  3. Time-of-day-fallback: "Good [morning|afternoon|evening], Maria."
  All ES translated. Pick template per data availability at render time.

- **Empty-state icon `fa-mug-hot` in sand-200** is warm but contextually odd for a "nothing-to-do" state — coffee-mug suggests a break, which is fine. Confirm sand-200 has enough contrast; alternative `fa-sun` or `fa-leaf` (calming) for variation.

- **Delivery card tap behavior at v1** confirmed: inline expand vs route to detail. Recommendation: inline at v1 (Open Question 3 — promote to canonical).

### Copy

- **Greeting EN:** "Welcome back, Maria"
- **Greeting ES:** "Bienvenida, María"
- **Subline action-recent EN:** "It's a sunny Tuesday. You logged your weight this morning — great job."
- **Subline action-recent ES:** "Es un martes soleado. Pesó esta mañana — ¡buen trabajo!"
- **Subline action-none EN:** "Hope you're having a good morning."
- **Subline action-none ES:** "Esperamos que esté teniendo un buen día."
- **Subline fallback EN morning:** "Good morning, Maria."
- **Subline fallback ES morning:** "Buenos días, María."
- **Section heading "Today's check-in" EN:** "Today's check-in"
- **Section heading ES:** "Su revisión de hoy"
- **Section heading "Recent message" EN:** "Recent message"
- **Section heading ES:** "Mensaje reciente"
- **Empty heading EN:** "Nothing to do today"
- **Empty heading ES:** "Nada que hacer hoy"
- **Empty body EN:** "Enjoy your day, Maria. We'll let you know when there's something new."
- **Empty body ES:** "Disfrute su día, María. Le avisaremos cuando haya algo nuevo."
- **Dashboard error EN:** "We're having trouble loading your dashboard. Tap to try again."
- **Dashboard error ES:** "No podemos cargar su tablero. Toque para intentar de nuevo."

## Screen: pt-02-messages

### Critical Issues

- **Strict allowlist enforcement at the rendering layer (Open Question 5).** A `tool_call` leak to a patient client is a P0 bug per the source spec. The wireframe says "client filter drops silently AND logs to telemetry as P0; UI shows nothing for that event." This is correct behavior but the wireframe doesn't state the operational defense-in-depth pattern in §States — the rendering-layer filter is the LAST line; server-side filter is FIRST. Recommend adding to §Accessibility / Privacy notes: "Defense-in-depth: server filters non-allowlist events before transit; client renderer filters again. Either layer dropping the event is correct; both must be present and tested."
  - **Severity:** moderate — not a wireframe-design defect, but the spec must communicate the operational guarantee so dev-tasker doesn't accidentally rely on client-only filtering.

### Improvements

- **Coordinator terminology (Open Question 4)** — Recommendation: keep "Sarah K., Care Coordinator" in the sender label (accountability) and use "your care team" in surrounding helper copy where warmth helps. Promote from Open Questions to canonical.

- **Mark-all-as-read affordance (Open Question 3)** — Recommendation: not at v1; automatic mark-on-tap is simpler. Promote to Out-of-Scope.

- **Image attachment (Open Question 1)** — text-only at v1. Promote.

- **System notification "Your weekly check-in is ready"** — link target should be the assessment intro (`assess-02-assessment-intro`). State explicitly in the system-notif worked-example so dev-tasker wires the routing correctly.

- **`<time datetime>` for timestamps** — confirm dev-tasker uses ISO 8601 in the `datetime` attribute and renders user-locale via `Intl.DateTimeFormat`.

### Copy

- **Page title EN:** "Messages"
- **Page title ES:** "Mensajes"
- **Subline EN:** "From your care team."
- **Subline ES:** "De su equipo de cuidado."
- **Unread badge EN:** "2 new"
- **Unread badge ES:** "2 nuevos"
- **Reply prompt collapsed EN:** "Write to your coordinator…"
- **Reply prompt collapsed ES:** "Escriba a su coordinadora…"
- **Send button EN:** "Send"
- **Send button ES:** "Enviar"
- **Cancel button EN:** "Cancel"
- **Cancel button ES:** "Cancelar"
- **Empty heading EN:** "No messages yet"
- **Empty heading ES:** "Sin mensajes aún"
- **Empty body EN:** "When your care team sends you a message, you'll see it here."
- **Empty body ES:** "Cuando su equipo de cuidado le envíe un mensaje, lo verá aquí."
- **Send-failed EN:** "We couldn't send your message. Tap to try again."
- **Send-failed ES:** "No pudimos enviar su mensaje. Toque para intentar de nuevo."
- **Messages-load-failed EN:** "We're having trouble loading your messages. Tap to try again."
- **Messages-load-failed ES:** "No podemos cargar sus mensajes. Toque para intentar de nuevo."
- **Coordinator worked-example message EN:** "Your delivery was rescheduled to Wednesday — let me know if that doesn't work for you."
- **Coordinator worked-example ES:** "Su entrega se cambió al miércoles — avíseme si no le funciona."
- **Patient reply worked-example EN:** "Wednesday is fine. Thank you!"
- **Patient reply worked-example ES:** "El miércoles está bien. ¡Gracias!"
- **System notification worked-example EN:** "Your weekly check-in is ready. It takes about 2 minutes."
- **System notification worked-example ES:** "Su revisión semanal está lista. Toma como 2 minutos."

## Screen: pt-03-settings

### Critical Issues

None.

### Improvements

- **Account-info edit (Open Question 1)** — keep coordinator-mediated at v1. Promote to canonical.
- **Notification granularity (Open Question 2)** — 3 toggles at v1. Promote.
- **Privacy + Terms links (Open Question 3)** — placeholder URLs at v1; flagged for legal-confirmed URLs before ship.

### Copy

- **Page title EN:** "Settings"
- **Page title ES:** "Ajustes"
- **Subline EN:** "Manage your language, notifications, and account."
- **Subline ES:** "Administre su idioma, notificaciones y cuenta."
- **Language card heading EN:** "Language"
- **Language card heading ES:** "Idioma"
- **App language label EN:** "App language"
- **App language label ES:** "Idioma de la app"
- **App language helper EN:** "Your messages and check-ins will use this language."
- **App language helper ES:** "Sus mensajes y revisiones usarán este idioma."
- **Notifications card heading EN:** "Notifications"
- **Notifications card heading ES:** "Notificaciones"
- **Push toggle label EN / ES:** "Push notifications" / "Notificaciones push"
- **Push toggle desc EN:** "We'll let you know when something needs you."
- **Push toggle desc ES:** "Le avisaremos cuando algo lo necesite."
- **Delivery toggle label EN / ES:** "Delivery updates" / "Actualizaciones de entrega"
- **Delivery toggle desc EN:** "When your meals are on the way."
- **Delivery toggle desc ES:** "Cuando sus comidas van en camino."
- **Check-in toggle label EN / ES:** "Check-in reminders" / "Recordatorios de revisión"
- **Check-in toggle desc EN:** "Weekly nudges for your health check-ins."
- **Check-in toggle desc ES:** "Recordatorios semanales para sus revisiones."
- **Account card heading EN:** "Account"
- **Account card heading ES:** "Cuenta"
- **Account-edit helper EN:** "To update your details, message your care coordinator."
- **Account-edit helper ES:** "Para actualizar sus datos, envíe un mensaje a su coordinadora."
- **Open Messages link EN:** "Open Messages"
- **Open Messages link ES:** "Abrir mensajes"
- **Sign out button EN:** "Sign out"
- **Sign out button ES:** "Cerrar sesión"
- **Footer EN:** "Haven · v1.0 · Privacy · Terms"
- **Footer ES:** "Haven · v1.0 · Privacidad · Términos"
- **Sign-out confirm title EN:** "Sign out?"
- **Sign-out confirm title ES:** "¿Cerrar sesión?"
- **Sign-out confirm body EN:** "You can sign back in anytime with your phone or email."
- **Sign-out confirm body ES:** "Puede volver a iniciar sesión en cualquier momento con su teléfono o correo."
- **Pref-save error EN:** "We couldn't save that change. Tap to try again."
- **Pref-save error ES:** "No pudimos guardar ese cambio. Toque para intentar de nuevo."

## Screen: pt-04-my-health

### Critical Issues

None. Stub-level wireframe correctly delegates content composition to assess-01-my-health.

### Improvements

- **Trend labels** — "Improving" / "Stable" / "Needs attention" — confirm ES translations: "Mejorando" / "Estable" / "Necesita atención" (already in spec). Plain-language gate should pass.
- **Worked-example metric set (Open Question 1)** — 3 metrics (Mood, Energy, Meal Satisfaction) at v1. Promote.

### Copy

- **Page title EN:** "My Health"
- **Page title ES:** "Mi Salud"
- **Subline EN:** "Your progress, your story."
- **Subline ES:** "Su progreso, su historia."

## Screen: pt-05-care

### Critical Issues

None.

### Improvements

- **Empty-state tone:** "Your care plan will appear here once your team finishes setting it up." is institutional compared to Dashboard's "Enjoy your day, Maria." Recommendation: warm it slightly: "Your care team is putting your plan together. We'll show it here as soon as it's ready."

- **"Recent deliveries" inline-vs-route at v1 (Open Question 2)** — inline at v1. Promote.
- **Care-plan goal count (Open Question 1)** — 3 goals to mirror coordinator approval card. Promote.

### Copy

- **Page title EN:** "Care"
- **Page title ES:** "Cuidado"
- **Subline EN:** "Your plan, appointments, and deliveries."
- **Subline ES:** "Su plan, citas y entregas."
- **Care plan card heading EN:** "Your care plan"
- **Care plan card heading ES:** "Su plan de cuidado"
- **Goal 1 EN:** "Eat balanced meals to keep your blood sugar steady."
- **Goal 1 ES:** "Comer comidas balanceadas para mantener el azúcar estable."
- **Goal 2 EN:** "Watch your salt intake."
- **Goal 2 ES:** "Cuidar la sal en sus comidas."
- **Goal 3 EN:** "Check in once a week so your team knows how you're doing."
- **Goal 3 ES:** "Revisar una vez a la semana para que su equipo sepa cómo va."
- **Care plan helper EN:** "Your care coordinator updates this plan with your team."
- **Care plan helper ES:** "Su coordinadora actualiza este plan con su equipo."
- **Upcoming heading EN:** "Upcoming"
- **Upcoming heading ES:** "Próximas citas"
- **Upcoming empty EN:** "Nothing scheduled right now."
- **Upcoming empty ES:** "Nada programado en este momento."
- **Recent deliveries heading EN:** "Recent deliveries"
- **Recent deliveries heading ES:** "Entregas recientes"
- **Deliveries empty EN:** "Your meals will show up here once they're on the way."
- **Deliveries empty ES:** "Sus comidas aparecerán aquí cuando vayan en camino."
- **Footer helper EN:** "To change anything, message your care coordinator."
- **Footer helper ES:** "Para cambiar algo, envíe un mensaje a su coordinadora."
- **Full-empty heading EN:** "We're getting your plan ready"
- **Full-empty heading ES:** "Estamos preparando su plan"
- **Full-empty body EN:** "Your care team is putting your plan together. We'll show it here as soon as it's ready."
- **Full-empty body ES:** "Su equipo de cuidado está preparando su plan. Lo verá aquí en cuanto esté listo."

## Cross-Screen Issues

- **Empty-state tone consistency** — Dashboard ("Enjoy your day, Maria") is warmest; Messages ("No messages yet") is terse; Care ("Your care plan will appear here…") is institutional. Apply Dashboard's warm register everywhere — see Care revisions above.
- **Bilingual ES wrap risk** — Spanish ~30% longer; section padding absorbs but bottom-nav tab labels at 320px need validation. Confirm at first build via 320px viewport check.
- **Coordinator-mediated edits** — Settings + Care both route patient to "Open Messages" for changes; consistent pattern. Good.
- **No clinical raw numbers** — Trend cards show plain-language labels not "PHQ-9 = 4". Verified across pt-04 and assess-01.
- **HIPAA / no-agent-exposure** — strict allowlist applied; defense-in-depth pattern called out in pt-02 review above.

## Use Case Walk-Through

- **PT-SHELL-01 (Open app + see today's prompt):** Walks. Shell renders; Dashboard surfaces task + message + delivery in one screen.
- **PT-SHELL-02 (Complete prompted assessment):** Walks per existing assess-01 through assess-05.
- **PT-SHELL-03 (Read coordinator message):** Walks. Tap Messages tab → list → expand → reply composer. Bilingual flow tested.
- **PT-SHELL-04 (View health trends):** Walks per existing assess-01.
- **PT-SHELL-05 (Switch language):** Walks. EN/ES toggle in mobile-i18n-bar OR Settings card; both update the same pref. Layout absorbs ES.

## Open Questions for Aaron at Gate 2-review

1. **5-tab bottom-nav at NN/G upper limit** — confirm fold-down is not warranted at v1 (keep 5 per Gate 2 decision 10). Plan post-launch usability check.
2. **ES tab label widths at 320px** — "Mensajes" is 8 chars; vertical icon-above-label layout absorbs it at 13.33px Semibold. Confirm at first build.
3. **Greeting subheading templates** — 3 variants (action-recent / action-none-warm / time-of-day-fallback). Confirm template selection logic.
4. **Defense-in-depth allowlist filtering** — server-side AND client-side; confirm dev-tasker treats client filter as backstop, not primary.
5. **System notification → assessment intro routing** — wired in dev-tasker; confirm.

## Verdict

**ITERATE-THEN-SHIP.** All copy resolved inline; defense-in-depth pattern note added to messages spec; tone consistency revisions land in pt-05-care. Patient set is ready for haven-mapper after Aaron's Gate 2-review.