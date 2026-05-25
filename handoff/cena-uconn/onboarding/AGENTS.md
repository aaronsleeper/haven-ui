# AGENTS.md — Onboarding / Consent slice

For AI coding agents working with this slice. Read [`../AGENTS.md`](../AGENTS.md) first for bundle-wide conventions, then this file.

## What this slice is

The patient-facing onboarding stepper for the UConn pilot. A **linear, nav-suppressed flow** — account setup → three required consents → preferences — that gates entry to the Home surface. The four HTML pages in this directory are static state exemplars. The Angular port makes them live.

## The shape

- **Container:** `.mobile-shell` + sticky footer. No sidebar, no bottom-nav, no app-shell-frame.
- **Steps:** 3-step linear stepper using `.onb-progress` as the indicator. Step 4 (`onboarding.welcome-to-home.html`) is the settled-state transition — no step indicator, onboarding is complete.
- **Navigation:** SUPPRESSED throughout. Bottom-nav first appears when the patient taps "Go to my home screen" and the Angular router transitions to `/`.
- **"Talk to a person":** Always reachable as a quiet `<a>` in the sticky footer. Never hidden, never agent-gated, not a tab.

## Hard invariants

Load-bearing rules from `onb-01/02/03` wireframes + `flow-onboarding.md`. A ported runner that violates one breaks the spec.

- **No pre-checked consent boxes.** The "I agree" consent radio starts unselected. The primary CTA is `aria-disabled="true"` until the patient explicitly selects "Yes, I agree". Pre-checking consent is a dark pattern — do not introduce it.
- **No e-signature.** The consent tap records a `timestamped acknowledgment event` on the patient record (cap-12). The binding legal consent is held by Athena. Do not present the in-app action as a legal signature.
- **No celebration / no gamification.** No progress trophies, no confetti, no "great job!" copy. The settled transition (`welcome-to-home`) is calm and informational, not celebratory.
- **Consent: three stages, one at a time.** Stage A (HIPAA) → Stage B (Program Participation) → Stage C (Voice Call Preferences). Each stage occupies the full canvas; the patient processes one before seeing the next. Do not batch them on a single scroll.
- **Stage C is a preference, not a consent.** "Voice calls from your care team" — two radio options, Continue always enabled regardless of selection. Do not make it gate-like.
- **Preferences are all optional.** No required field, no "you must complete this." "All done" with nothing selected applies defaults and advances. The "Skip for now" fallback on the error state saves locally and retries next session.
- **Food card mutual exclusivity (one direction only).** "No preference" deselects all cuisine cards. Selecting any cuisine deselects "No preference." Cuisine cards are multi-select among themselves.
- **Bottom-nav appears ONLY after Home is entered.** The Angular router mounts the nav on transition to `/`, not on the transition from preferences to `welcome-to-home`.

## Closed-vocabulary contract

Copy semantic classes from `../assets/haven.css`. Do not invent. If a class you need does not exist in the bundle, that is a gap — surface it, do not substitute.

Classes used in this slice: `.mobile-shell`, `.mobile-i18n-bar`, `.mobile-i18n-toggle`, `.onb-progress`, `.page-header`, `.page-title`, `.card`, `.card-body`, `.field-row`, `.field-label`, `.field-input-group`, `.field-addon`, `.field-help`, `.field-error`, `.field-row-error`, `.radio-label`, `.consent-doc-viewer`, `.consent-doc-viewer-header`, `.consent-doc-viewer-title`, `.consent-doc-viewer-scroll`, `.consent-doc-viewer-actions`, `.btn-primary`, `.btn-block`, `.btn-ghost`, `.btn-sm`, `.btn-secondary`, `.alert-error`, `.divider`, `.grid-2`, `.pb-safe-4`, `.onboarding-orientation-card` (full class family), `.week-rhythm-card` (full class family).

Inline layout utilities (`space-y-*`, `p-*`, `flex`, `text-*`, `text-sand-*`) are from the Tailwind bundle and are fine inline.

## Accordion / collapse: native `<details>`, NOT Preline

The "Read the full text" toggle in `onboarding.consent.html` uses native `<details>/<summary>`. There is no `hs-accordion`, no `data-hs-accordion`, no Preline JS dependency in this slice. Port to Angular using Angular's `(click)` toggle or a simple `*ngIf` / `@if` block — do not reach for ngb-accordion or CDK overlay.

## Password field contract

- Both fields are `type="password"` by default.
- The `.field-addon` button toggles `aria-pressed` + swaps icon between `fa-eye` (hidden) and `fa-eye-slash` (shown); Angular handler also toggles `input.type` between `password` and `text`.
- `aria-label="Show password"` / `"Hide password"` kept in sync with the toggle state.
- Validation on blur: min 8 chars; fields must match. Set `.field-row-error` on the offending `.field-row` and unhide the `.field-error` `<p>`. Use `aria-describedby` linking the input to its error element.
- Continue button: `aria-disabled="true"` while invalid; set to `aria-disabled="false"` (or remove the attribute) when both fields pass.

## Consent acknowledgment gating (cap-12)

On tap of "I agree":
1. Set button to loading state (spinner, `aria-busy="true"`).
2. POST acknowledgment to backend → `{ patientId, consentType: 'hipaa-v1', acknowledgedAt: Date.now() }`.
3. On success: advance to Stage B (or route to preferences after Stage C).
4. On failure: unhide `.alert-error` above the footer button; keep button enabled for retry.

Do not advance on network failure. The acknowledgment must land before the patient proceeds (cap-12 requires a timestamped event, not a best-effort write).

## Preferences submit contract

On tap of "All done":
1. Gather selections: `{ language, foodPrefs: string[], contactMethod, contactTimes: string[] }`.
2. Apply defaults for unselected sections: `language = navigator.language`, `foodPrefs = []`, `contactMethod = 'app-only'`, `contactTimes = []`.
3. POST to backend. On success: route to `onboarding.welcome-to-home` (the settled-state transition).
4. On failure: unhide `.alert-error` above the footer; offer "Skip for now" — save selections to localStorage, route to `welcome-to-home` anyway. Retry the write on next session open.

## Language toggle

Both `mobile-i18n-toggle` buttons carry `role="switch"` / `aria-checked`. On select:
1. Set `aria-checked="true"` on the selected language, `false` on the other.
2. Walk the DOM and swap `textContent` of any element carrying `data-i18n-en` / `data-i18n-es` to the target language string.
3. Write the selection to localStorage as `{ language: 'en' | 'es' }`.
4. On the preferences page, also mark the corresponding language `.radio-label` as selected.

## `data-exclusive` attribute

The "No preference" food card carries `data-exclusive="true"` on its `<input type="checkbox">`. The Angular handler for the food preference field set observes:
- If a user checks `data-exclusive="true"`: uncheck all sibling checkboxes.
- If a user checks any non-exclusive checkbox: uncheck any checked `data-exclusive` checkbox.

## Cap-12 gate relationship to Home

The routing guard lives at the Angular router layer:
- `canActivate: [ConsentGuard]` on the `/` (Home) route.
- Guard checks `patient.consentComplete === true` on the session/auth state.
- Guard redirects to `/onboarding` at the last incomplete step if not complete.
- The static HTML pages in this slice show the happy-path states; the guard handles the re-entry + decline paths described in `flow-onboarding.md` § Edge cases.

## How to know when a porting task is done

- DOM hierarchy + semantic class names match the static pages in this slice
- ARIA preserved: `aria-label` on password toggles, `aria-disabled` on gated buttons, `aria-pressed` on show/hide, `aria-describedby` linking inputs to errors, `role="alert"` on `.alert-error`, `role="switch"` on language toggles
- No pre-checked consent boxes
- Consent acknowledgment writes to backend before advancing (not fire-and-forget)
- Preferences submit applies defaults for unselected sections, not null/empty
- Bottom-nav absent on all onboarding routes; present only after routing to `/`
- "Talk to a person" reachable at every step

If any criterion cannot be met, surface the gap. Do not substitute behavior or structure.

## Where to find the canonical spec for this slice

- Wireframes (source of truth): `apps/patient/design/wireframes/onb-01-welcome.md`, `onb-02-consent.md`, `onb-03-preferences.md`
- Flow doc (design intent + edge cases): `Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/flows/flow-onboarding.md`
- Cap-12 (consent gate): `…/development/cap-12-*.md`
- Pattern library: `Lab/haven-ui/packages/design-system/pattern-library/COMPONENT-INDEX.md`

When those paths are not accessible to your environment, the per-page HTML comment blocks + this AGENTS.md + the slice `README.md` carry the load-bearing spec.
