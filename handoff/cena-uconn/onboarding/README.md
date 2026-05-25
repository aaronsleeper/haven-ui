# Slice 5 — Onboarding / Consent

Patient-facing onboarding for the UConn pilot. New patients complete a 3-step linear stepper (account setup → consent → preferences) before entering the Home surface. Navigation is suppressed throughout; a quiet "Talk to a person" affordance persists on every step.

## What this is

A focused, full-canvas onboarding flow. The patient arrives via a referral link, creates a password, works through three required consents, sets language + food + communication preferences, and lands on a gentle settled-state transition page before Home.

**Scope = onboarding gate only.** The Home surface (post-onboarding) is the `home/` slice. The cap-12 consent gate on Home is referenced here but implemented in the angular app's routing layer — see "Cap-12 gate relationship" below.

## States

Each state is a separate self-contained HTML page. Open directly in a browser — CSS and fonts load from `../assets/`.

| File | Step | What it shows |
|---|---|---|
| [`onboarding.welcome.html`](./onboarding.welcome.html) | Step 1 of 3 | Warm welcome + account setup form. Two password fields (create + confirm) with show/hide toggles. Continue disabled until both fields are valid. |
| [`onboarding.consent.html`](./onboarding.consent.html) | Step 2 of 3 | HIPAA Authorization consent (Stage A of 3). Plain-language summary → consent-doc-viewer with native `<details>` full-text accordion → explicit radio agreement (no pre-checked box). Stages B (Program Participation) and C (Voice Call Preferences) follow the same template with different copy. |
| [`onboarding.preferences.html`](./onboarding.preferences.html) | Step 3 of 3 | Language + food + communication preferences. All optional; skipping applies defaults. Food cards are icon-only (no photos at v1). |
| [`onboarding.welcome-to-home.html`](./onboarding.welcome-to-home.html) | Transition | "You're all set, Maria" settled-state transition. Orientation card + week-rhythm card. CTA leads into Home (bottom-nav appears for the first time after this tap). |

## Composition — primitives used

All classes confirmed present in `../assets/haven.css` before use (grep verified).

**Shell + layout:**
- `.mobile-shell` — 430px max-width centered canvas; onboarding-specific (no sidebar, no bottom-nav)
- `.mobile-i18n-bar`, `.mobile-i18n-toggle` — persistent language toggle
- `.onb-progress` — "Step N of 3" text indicator
- `.page-header`, `.page-title` — heading zone
- `.divider` — section separator (preferences page)
- `.grid-2` — 2-column grid for language + food preference cards
- `.pb-safe-4` — safe-area-aware bottom padding on sticky footer

**Form + input:**
- `.card`, `.card-body` — form container
- `.field-row` — labeled input group container
- `.field-label` — input label
- `.field-input-group` — input + addon wrapper
- `.field-addon` — show/hide password toggle button
- `.field-help` — helper text below input
- `.field-error` — inline validation error (shown on blur)
- `.field-row-error` — modifier on `.field-row` when input has an error
- `.radio-label` — card-style radio and checkbox options (used for both radio and checkbox semantics per wireframe carve-out; `.checkbox-card` deferred)

**Consent:**
- `.consent-doc-viewer`, `.consent-doc-viewer-header`, `.consent-doc-viewer-title`, `.consent-doc-viewer-scroll`, `.consent-doc-viewer-actions` — doc preview + acknowledge flow

**Settled-state cards:**
- `.onboarding-orientation-card`, `.onboarding-orientation-card-body`, `.onboarding-orientation-card-title`, `.onboarding-orientation-card-grid`, `.onboarding-orientation-card-cell`, `.onboarding-orientation-card-icon`, `.onboarding-orientation-card-label`
- `.week-rhythm-card`, `.week-rhythm-card-body`, `.week-rhythm-card-row`, `.week-rhythm-card-icon`, `.week-rhythm-card-meta`, `.week-rhythm-card-label`, `.week-rhythm-card-detail`

**Actions + alerts:**
- `.btn-primary`, `.btn-block` — primary CTA (Continue / I agree / All done / Go to home)
- `.btn-ghost`, `.btn-sm` — back chevron, secondary actions
- `.btn-secondary` — "View full document" (within consent-doc-viewer-actions)
- `.alert-error` — inline error state above footer CTA

**Layout utilities (inline, not new classes):**
- `space-y-*`, `p-*`, `text-*`, `text-sand-*`, `flex`, `grid` — Tailwind layout utilities from the bundle

## Nav suppression

Bottom-nav is **fully suppressed** on all four pages. No `.mobile-bottom-nav` or `.app-shell-bottom-nav` is rendered anywhere in this slice. The bottom-nav appears for the first time when the patient taps "Go to my home screen" on `onboarding.welcome-to-home.html` and the app routes to `/` (Home). The Angular router gate enforces this; it is not in the static HTML.

"Talk to a person" is reachable on every page as a quiet `<a>` in the sticky footer — not gated, not hidden, never agent-mediated.

## Consent: three stages

`onboarding.consent.html` shows **Stage A (HIPAA Authorization)**. Stages B and C use the same HTML structure with different copy:

| Stage | Topic | CTA |
|---|---|---|
| A | HIPAA Authorization | "I agree" |
| B | Program Participation Agreement | "I agree" |
| C | Voice Call Preferences | "Continue" (radio choice, not an "agree") |

Stage C uses two `.radio-label` cards inside a `<fieldset>` — one pre-selected "Yes, calls are okay" and one "No, use app and messages." The Continue button remains enabled regardless of which radio is chosen. No dedicated HTML file for B and C in this handoff — the single template carries the pattern.

## Cap-12 gate relationship to Home

The consent gate lives at the **routing layer**, not in this HTML:

- Home (`/`) requires `consentComplete: true` on the patient record.
- A patient who exits mid-onboarding (after consent but before preferences, or before consent at all) lands back at their last incomplete step on next sign-in.
- A patient who declines consent on Stage A cannot advance. After three sign-ins without completing consent, an alert routes to the care coordinator (cap-22).
- These states are described in `flow-onboarding.md` § Edge cases; the static HTML here shows the happy-path states only.

## Behavior to implement on port

These pages are static state exemplars. The Angular port wires:

- **Password validation** — enable Continue only when both fields are filled and matching (min 8 chars); show `.field-row-error` + `.field-error` on blur failure.
- **Show/hide password** — toggle `.field-addon` `aria-pressed` + swap `fa-eye` / `fa-eye-slash`; change `input[type]` between `password` and `text`.
- **Consent acknowledgment gating** — "I agree" button enabled only when the "Yes, I agree" radio is selected. Tapping records a timestamped event on the patient record (cap-12). NOT an e-signature; Athena holds the binding consent.
- **Consent stage progression** — after Stage A "I agree", mount Stage B copy into the same template; after Stage C "Continue", route to `/onboarding/preferences`.
- **Preferences submit** — write all selections to backend in one call on "All done"; apply defaults for unselected sections. "Skip for now" fallback saves locally + retries next session.
- **Language toggle** — selecting a language card re-renders all `data-i18n-en`/`data-i18n-es` content immediately.
- **Food card mutual exclusivity** — "No preference" (`data-exclusive="true"`) deselects all cuisine cards when tapped; tapping any cuisine card deselects "No preference".
- **Nav gate** — bottom-nav mounts only after the patient taps "Go to my home screen" and the router transitions to `/`.

## Open questions (from wireframes)

- Care team phone number in onb-01 footer — pending Vanessa. Placeholder: `(860) 000-0000`.
- Patient name personalization on welcome ("Welcome, Maria") — recommend yes when referral payload includes name; fallback to generic copy if not. Confirm with Vanessa.
- Consent plain-language summaries — legal pre-approval of EN/ES copy recommended before pilot.
- Default values for unselected preferences — "app only" + no time preference. Confirm with Vanessa.
- Cadence specifics in week-rhythm-card ("every 2 weeks", "each Sunday by 6 PM") — fuzzy until cap-22 lands; confirm before demo.
