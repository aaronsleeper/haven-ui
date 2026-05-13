---
shells:
  - name: mobile-shell
    pl_shell_version: sha256:7216f974a242c2b4803414646c733b3b194a1bdeec04e10b61be499eb7a2e599
---

# onb-03-preferences: Preferences Setup

**Application:** Patient App
**Use Case(s):** PT-ONB-002
**User Type:** Patient
**Device:** Mobile (320-430px); desktop renders centered at 430px max-width
**Route:** `/onboarding/preferences`

The final onboarding step. The patient sets language, cultural food preferences, and communication preferences so the program feels personalized from day one. Skipping is allowed — defaults apply and the patient can update later in Settings.

Translated from `Lab/cena-health-spark/design/patient-app/wireframes/onb-03-preferences.md`. **Food category images skipped at v1** per 2026-05-13 decision: programmatic or manual sourcing is a later step. Cards render text + icons only.

---

## Page Purpose

Single scrollable page with three sections: Language, Food, and Communication. Patients can select all, some, or none — defaults apply on skip. After confirmation, they enter the main app for the first time.

---

## Layout Structure

### Shell

`shell-pt-mobile`. **Bottom-nav suppressed.** Back chevron in top-left (returns to ONB-02).

### Header Zone

- Back chevron `IconButton`
- Progress indicator: `.onb-progress` with `aria-label="Step 3 of 3"`. Body/04 centered.
- `.page-title` (Heading/01 Lora 27.65px Medium):
  - EN: "Let's personalize your experience"
  - ES: "Personalicemos su experiencia"
- Subline, Body/03 muted:
  - EN: "You can always update these later."
  - ES: "Siempre puede actualizarlos después."

### Content Zone

Sections separated by `.divider`. Each section uses `<fieldset>` + `<legend>` for grouping.

#### Section 1 — Language

- `<fieldset>` with `<legend>`:
  - EN: "Your preferred language"
  - ES: "Su idioma preferido"
- Two `.radio-label` card-style options in `.grid-2`:
  - "English"
  - "Español"
- Default: no pre-selection (system uses browser/device default until user picks)
- **Selecting a language re-renders all UI immediately** to that language

#### Section 2 — Cultural food preferences (text + icons only, no photos at v1)

- `<fieldset>` with `<legend>`:
  - EN: "What kind of food feels like home?"
  - ES: "¿Qué tipo de comida le hace sentir en casa?"
- Sub-label (Body/04 muted):
  - EN: "We'll use this to personalize your meals. You can pick more than one."
  - ES: "Usaremos esto para personalizar sus comidas. Puede elegir más de una."
- Multi-select checkbox cards in `.grid-2`. Each card composed as:
  - Top: FontAwesome icon (`size-12` mx auto, sand-500), e.g.:
    - Latin American: `fa-solid fa-pepper-hot`
    - Soul Food: `fa-solid fa-drumstick-bite`
    - Mediterranean: `fa-solid fa-olive` (fallback: `fa-leaf`)
    - Asian: `fa-solid fa-bowl-rice` (fallback: `fa-bowl-food`)
    - No preference: `fa-solid fa-check-double`
  - Below icon: label, Body/03 medium
  - Selected state: `radio-label.is-selected` (or `.checkbox-card.is-selected`) — primary-600 border + check icon overlay
- "No preference" deselects all others when tapped; selecting any cuisine deselects "No preference"

**Future scope (post-demo):** food category images replace icons when the brand/imagery pipeline is in place.

#### Section 3 — Communication preferences

##### Sub-section 3a — Contact method
- Sub-label: EN "Preferred contact method" / ES "Método de contacto preferido"
- Three `.radio-label` cards (single-select):
  - EN "Phone call" `fa-phone` / ES "Llamada"
  - EN "Text message" `fa-comment-sms` / ES "Mensaje de texto"
  - EN "App only" `fa-bell` / ES "Solo la app"

##### Sub-section 3b — Best times to reach you
- Sub-label: EN "Best times to reach you" / ES "Mejores horarios para contactarle"
- Three multi-select checkbox cards:
  - EN "Morning (8am–12pm)" / ES "Mañana (8am–12pm)"
  - EN "Afternoon (12pm–5pm)" / ES "Tarde (12pm–5pm)"
  - EN "Evening (5pm–8pm)" / ES "Noche (5pm–8pm)"

### Footer Zone

- **Component:** Sticky footer, `pb-safe-4`
- `.btn-primary` `.btn-block`:
  - EN: "All done"
  - ES: "Listo"
- Below button — Body/04 muted, centered:
  - EN: "Skipping is okay — we'll use defaults and you can update anytime."
  - ES: "Está bien saltar — usaremos predeterminados y puede actualizar cuando quiera."
- Tapping with nothing selected applies defaults and proceeds

---

## Interaction Specifications

### Tap a language card
- Selected card shows active state
- All UI text re-renders in selected language immediately
- Language pref written to localStorage + user profile

### Tap a food preference card
- Toggles selected state (`.is-selected` modifier)
- "No preference" enforces mutual exclusivity with cuisine cards

### Tap a contact method
- Single-select; tapping a new option replaces the previous

### Tap a best-time
- Multi-select; tapping toggles individual selection

### Tap All done
- **Trigger:** Patient taps footer button
- **Feedback:** Brief loading on button
- **Persistence:** All preferences written to backend in one call; defaults applied for any unselected sections
- **Navigation:** Routes to `/` (Dashboard). **Bottom-nav appears** for the first time as the patient exits onboarding into the main app.
- **Error handling:** Submit failure → inline `alert-error` above button: EN "We couldn't save your preferences. Try again?" / ES "No pudimos guardar sus preferencias. ¿Intentar de nuevo?" with a "Skip for now" fallback that proceeds anyway (preferences saved locally, retried on next session).

---

## States

### Empty (initial)
- All fields unselected; All done proceeds with defaults

### Partial selection
- Some fields filled, others not; All done proceeds with defaults filling gaps

### Submit error
- `alert-error` above footer with retry CTA + "Skip for now" fallback link

### Loading
- Initial mount: spinner inside content while preference schema loads (rare at v1)

---

## Accessibility Notes

- `<main aria-label="Onboarding — preferences">` wraps content
- `<h1>` (`.page-title`) receives focus on route entry
- `<fieldset>`/`<legend>` associations for screen readers
- Food preference cards: selected state via border + check icon (not color alone)
- Each card is keyboard-selectable; visible focus ring
- Touch targets 44px+

## Bilingual Considerations

- All visible strings: `data-i18n-en` / `data-i18n-es`
- Food category labels:
  - "Latin American" / "Latinoamericana"
  - "Soul Food" / "Comida del sur"
  - "Mediterranean" / "Mediterránea"
  - "Asian" / "Asiática"
  - "No preference" / "Sin preferencia"
- Spanish labels in some places run longer; single-column fallback below `sm` breakpoint absorbs (existing `.grid-2` responsive behavior)

## Open Questions

- Food category images — **resolved 2026-05-13: skip at v1.** Programmatic or manual sourcing is a later step. Icons-only cards ship.
- Dietary restrictions set by the care team — display read-only here or Profile-only? Recommend Profile-only at v1; onboarding stays focused on patient preference.
- Default values for unselected sections — what does "default" mean for food preferences (no preference) and communication (app only + no time pref)? Confirm with Vanessa.

---

## New Components Flagged

None. All primitives shipped: `.page-title`, `.onb-progress`, `.divider`, `.grid-2`, `.radio-label`, `.btn-primary`, `.btn-block`, `.alert-error`, `IconButton` (ui-react), `pb-safe-4`.

**Possible future primitive:** a dedicated `.checkbox-card` class (currently using `.radio-label` for both radio and checkbox semantics). Defer until a second consumer surfaces — promote then per haven-ui CLAUDE.md inline-carve-out rule.
