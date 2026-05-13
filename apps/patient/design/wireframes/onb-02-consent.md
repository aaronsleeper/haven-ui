---
shells:
  - name: mobile-shell
    pl_shell_version: sha256:7216f974a242c2b4803414646c733b3b194a1bdeec04e10b61be499eb7a2e599
---

# onb-02-consent: Consent

**Application:** Patient App
**Use Case(s):** PT-ONB-001
**User Type:** Patient
**Device:** Mobile (320-430px); desktop renders centered at 430px max-width
**Route:** `/onboarding/consent` (single route, internal stage state)

Walk the patient through three required consents one at a time before program participation begins. Each consent is a full-screen surface with a plain-language summary, an optional accordion for full legal text, and an "I agree" / radio commitment.

Translated from `Lab/cena-health-spark/design/patient-app/wireframes/onb-02-consent.md`. **AVA Voice Interaction Consent (Stage C) reframed to Voice Call Preferences** per 2026-05-13 decision: Cena has no agent calling capabilities yet, so voice calls are from human care coordinators only. AVA branding dropped entirely from this consent.

---

## Page Purpose

The patient progresses through three consents in order: HIPAA Authorization → Program Participation Agreement → Voice Call Preferences. Each is presented one at a time so the patient can process each agreement without scroll fatigue. Plain-language summaries lead; full legal text is available behind an accordion.

---

## Layout Structure

### Shell

`shell-pt-mobile`. **Bottom-nav suppressed.** Back chevron in top header bar after Stage A (returns to previous stage, or to ONB-01 from Stage A).

### Header Zone (per stage)

- Back chevron `IconButton` (top-left, after Stage A)
- Progress indicator: `.onb-progress` with `aria-label="Step 2 of 3"`. Body/04 centered.
- Step label (uppercase tracking): Body/04 muted, `text-xs uppercase tracking-wide`:
  - Stage A: EN "HIPAA Authorization" / ES "Autorización HIPAA"
  - Stage B: EN "Program Participation" / ES "Participación en el programa"
  - Stage C: EN "Voice Call Preferences" / ES "Preferencias de llamadas"
- `.page-title` (Heading/01 Lora 27.65px Medium) — plain-language headline:
  - Stage A: EN "Your health information" / ES "Su información de salud"
  - Stage B: EN "Joining the program" / ES "Unirse al programa"
  - Stage C: EN "Voice calls from your care team" / ES "Llamadas de su equipo de cuidado"
- Short plain-language summary, Body/02, sand-700:
  - Stage A: EN "We will share your health information with your care team to help you eat well, feel better, and stay healthy. Your information is private." / ES "Compartiremos su información de salud con su equipo de cuidado para ayudarle a comer bien, sentirse mejor y mantenerse saludable. Su información es privada."
  - Stage B: EN "Joining the program means we'll send you meals, check in on your progress, and stay in touch with your care team. You can stop at any time." / ES "Unirse al programa significa que le enviaremos comidas, revisaremos su progreso y nos mantendremos en contacto con su equipo. Puede detenerse en cualquier momento."
  - Stage C: EN "Your care coordinator may call you sometimes — about appointments, deliveries, or check-ins. You can opt out and keep using the app and messages instead." / ES "Su coordinadora puede llamarle a veces — sobre citas, entregas o revisiones. Puede optar por no recibir llamadas y seguir usando la app y los mensajes."

### Content Zone (per stage)

#### Stages A and B — read full text accordion

- **Component:** `hs-accordion` (Preline) single-item
- Toggle label, Body/03 primary-600 underline:
  - EN: "Read the full text"
  - ES: "Leer el texto completo"
- Content: scrollable full consent text inside the accordion body, Body/04 sand-600
- Default state: collapsed

#### Stage C — Voice Call Preferences (replaces AVA opt-out)

- **Component:** `.card` body with two radio options (use `.radio-label` PL class for card-style radios)
- Options:
  - Default selected: EN "Yes, calls from my care team are okay" / ES "Sí, está bien que mi equipo me llame"
  - Alternative: EN "No, please don't call me — I'll use the app and messages" / ES "No, por favor no me llamen — usaré la app y los mensajes"
- Helper text below the radios, Body/04 muted:
  - EN: "Either choice is fine. You can change this anytime in Settings."
  - ES: "Cualquier opción está bien. Puede cambiarlo en cualquier momento en Ajustes."

#### Future scope flag (NOT visible to patient at v1)

When AVA voice-calling capability ships post-MVP, this consent step likely needs a re-consent or refined wording covering AI voice. Patients consented to human voice calls in v1; expanding to agent voice without explicit re-consent is a compliance risk. Logged in plan `~/.claude/plans/uconn-mvp-ui-pivot.md` under Open follow-ups.

### Footer Zone

- **Component:** Sticky footer at bottom, `pb-safe-4`
- `.btn-primary` `.btn-block`:
  - Stages A and B: EN "I agree" / ES "Acepto"
  - Stage C: EN "Continue" / ES "Continuar"
- Below the button on Stages A and B — small helper text, centered, Body/04 muted:
  - EN: "By tapping 'I agree', you confirm you have read and understood the above."
  - ES: "Al tocar 'Acepto', confirma que ha leído y entendido lo anterior."

---

## Interaction Specifications

### Tap accordion toggle (Stages A and B)
- Accordion expands / collapses; chevron rotates per Preline `hs-accordion` pattern

### Tap radio option (Stage C)
- Selected radio shows active state (primary border + check icon, not color alone)
- Continue button remains enabled regardless of which radio is selected

### Tap I agree / Continue
- **Trigger:** Patient taps the footer button
- **Feedback:** Brief loading on button
- **Navigation:** Advances to the next stage; after Stage C, routes to `/onboarding/preferences`
- **Persistence:** Each consent decision written to backend on tap; cached locally until acknowledged
- **Error handling:** Submit failure → inline `alert-error` above button: EN "We couldn't record your consent. Please try again." / ES "No pudimos registrar su consentimiento. Por favor intente de nuevo."

### Tap back chevron (Stages B and C)
- Returns to previous stage with the previously recorded choice intact

---

## States

### Default (per stage)
- Progress + step label + headline + summary + accordion (A/B) or radios (C) + footer button

### Submit error
- `alert-error` above the footer button until resolved

### Loading
- Initial mount: spinner inside the card body until consent metadata loads (rare at v1; consents are static text)

---

## Accessibility Notes

- `<main aria-label="Onboarding — consent">` wraps content
- `<h1>` (`.page-title`) receives focus on stage entry
- Back button: `aria-label="Go back"` / "Volver"
- Accordion keyboard-navigable (Preline `hs-accordion` defaults)
- Radio options grouped via `<fieldset>` + `<legend>` (sr-only legend if visual heading already covers it)
- Continue / I agree button has `aria-label` that identifies the consent:
  - EN: `aria-label="I agree to HIPAA Authorization"` (etc per stage)
- Minimum font size 16px for all consent body text
- Touch targets 44px+

## Bilingual Considerations

- All visible strings: `data-i18n-en` / `data-i18n-es`
- Full legal consent text (accordion content) must be available in Spanish — pending legal team translations
- Spanish copy ~30% longer than English; accordion absorbs gracefully via internal scroll

## Open Questions

- Plain-language summaries — does legal need to pre-approve the EN/ES copy above? Recommend draft as-is + flag for legal review during build.
- Read-aloud feature — deferred to post-demo per 2026-05-13 decision.
- Download-a-copy of signed consents — recommend defer to v1.1.

---

## New Components Flagged

None. All primitives shipped: `.page-title`, `.onb-progress`, `.card`, `.radio-label`, `.btn-primary`, `.btn-block`, `.alert-error`, `hs-accordion` (Preline), `IconButton` (ui-react), `pb-safe-4`.
