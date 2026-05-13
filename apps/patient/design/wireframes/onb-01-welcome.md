---
shells:
  - name: mobile-shell
    pl_shell_version: sha256:7216f974a242c2b4803414646c733b3b194a1bdeec04e10b61be499eb7a2e599
---

# onb-01-welcome: Welcome & Account Setup

**Application:** Patient App
**Use Case(s):** PT-ONB-001
**User Type:** Patient (newly referred)
**Device:** Mobile (320-430px); desktop renders centered at 430px max-width
**Route:** `/onboarding/welcome`

First impression of the Cena Health patient app. The patient has been referred by their care team and is opening the app for the first time. The goal is a warm welcome + the single account-setup action needed to enter the program.

Translated from `Lab/cena-health-spark/design/patient-app/wireframes/onb-01-welcome.md` per the haven-ui translation plan. Source tokens (`text-gray-500`, `bg-stone-50`) replaced with sand-family equivalents.

---

## Page Purpose

The patient lands on the welcome screen after tapping a link in a referral email (or opening the app from a notification). They see a warm greeting + a one-step account setup (create a password). On submit they advance to consent.

---

## Layout Structure

### Shell

`shell-pt-mobile`. **Bottom-nav suppressed** for all `/onboarding/*` routes — onboarding is a linear stepper, not a navigable space. i18n bar remains for language toggle.

### Header Zone

- Progress indicator at top of content area: `.onb-progress` with `aria-label="Step 1 of 3"`. Body/04 muted, centered.
- `.page-title` (Heading/01 Lora 27.65px Medium):
  - EN: "Welcome to Cena Health"
  - ES: "Bienvenida a Cena Health"
- Subline: Body/03 muted:
  - EN: "Your meals and care team are ready. Let's set up your account."
  - ES: "Sus comidas y equipo de cuidado están listos. Vamos a configurar su cuenta."
- Padding: `p-4`

### Content Zone

#### Account setup form

- **Component:** `.card` centered with generous vertical padding
- Form rendered as a stack of two `.field-row` entries (vertical layout):

##### Field 1 — Create password
- `field-label`: EN "Create a password" / ES "Cree una contraseña"
- `<input type="password">` with show/hide toggle:
  - Toggle button: `<button type="button" aria-label="Show password">` containing `<i class="fa-regular fa-eye">` (or `fa-eye-slash` when shown)
  - Toggle is absolutely positioned inside the input via `field-input-group` + `field-addon`
- `field-help`: EN "At least 8 characters" / ES "Al menos 8 caracteres"

##### Field 2 — Confirm password
- `field-label`: EN "Confirm password" / ES "Confirme la contraseña"
- `<input type="password">` with the same show/hide toggle pattern
- Error message via `field-error` when:
  - Passwords don't match: EN "Passwords don't match" / ES "Las contraseñas no coinciden"
  - Too short: EN "Too short — needs at least 8 characters" / ES "Muy corta — necesita al menos 8 caracteres"

### Footer Zone

- **Component:** Sticky footer at bottom of content (above shell-level bottom edge), padded with `pb-safe-4`
- `.btn-primary` `.btn-block`:
  - EN: "Continue"
  - ES: "Continuar"
- Disabled (`aria-disabled="true"`) until both passwords are filled and matching
- Below button — small helper text, centered, Body/04 muted:
  - EN: "Need help? Call us: [phone]"
  - ES: "¿Necesita ayuda? Llámenos: [phone]"
- Phone number: open question — pending Vanessa

---

## Interaction Specifications

### Type password / Confirm password
- **Trigger:** Patient types
- **Feedback:** Show/hide eye toggles characters on tap
- **Validation:** Inline on blur — min length + match check. Continue button enables only when both pass.

### Tap Continue
- **Trigger:** Patient taps Continue with both fields valid
- **Feedback:** Brief loading state on button
- **Navigation:** Route to `/onboarding/consent`
- **Error handling:** Submit failure → inline `alert-error` at top of card: EN "Something went wrong. Please try again." / ES "Algo salió mal. Por favor intente de nuevo." with retry CTA

### Tap language toggle (shell-level i18n bar)
- All visible strings re-render in target language; layout absorbs Spanish ~30% longer

---

## States

### Default
- Progress + greeting + form + sticky Continue button (disabled)

### Filled-valid
- Continue button enabled (primary teal)

### Validation error
- `field-row-error` modifier on the offending field; error message visible below input

### Submit error
- `alert-error` above the card with retry CTA; button stays enabled for retry

### Loading
- Spinner inside the card while the page initializes (rare; usually skipped at v1)

---

## Accessibility Notes

- `<main aria-label="Onboarding — welcome">` wraps content
- `<h1>` (`.page-title`) receives focus on route entry
- Password fields: `<input type="password">` with associated `<label>`; show/hide toggle has `aria-label="Show password" / "Hide password"` and `aria-pressed` to reflect state
- Continue button has `aria-disabled="true"` when blocked
- Error messages associated with inputs via `aria-describedby`
- Touch targets 44px+; passwords-toggle button 48px tall

## Bilingual Considerations

- All visible strings: `data-i18n-en` / `data-i18n-es`
- Spanish copy ~30% longer than English; sticky button + helper text absorb wrap
- Phone number renders identically in both languages

## Open Questions

- Care team phone number in footer — pending Vanessa
- Patient name personalization in headline (e.g., "Welcome, Maria") — recommend yes when referral payload includes name; fallback to generic if not. Confirm with Vanessa.

---

## New Components Flagged

None. All primitives shipped: `.page-title`, `.onb-progress`, `.card`, `.field-row`, `.field-label`, `.field-help`, `.field-error`, `.field-input-group`, `.field-addon`, `.field-row-error`, `.btn-primary`, `.btn-block`, `.alert-error`, `pb-safe-4`.

The `.page-title` class was added in this sprint (commit `23ef86f`).
