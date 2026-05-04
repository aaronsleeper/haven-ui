# pt-03-settings: Patient Settings

**Application:** Patient App
**Use Case(s):** PT-SHELL-05 (language switch), shell-level controls
**User Type:** Patient (Maria Rivera)
**Device:** Mobile (320-430px); desktop renders centered at 430px max-width
**Route:** `/settings`

Settings is intentionally minimal at v1 per Gate 1 G1.2 patient-app minimum. Three sections — Language, Notifications, Account — with the most-used controls (language toggle, notification preferences, sign out). All copy bilingual EN/ES per Gate 2-prep decision 4.

---

## Page Purpose

Maria opens Settings to change her language preference, manage which notifications she receives, or sign out. Each control is one tap. The screen never overwhelms — settings the patient is unlikely to use (advanced privacy, account-deletion, MFA setup) are excluded at v1 and reachable through coordinator help if needed.

---

## Layout Structure

### Shell

`shell-pt-mobile`. Active bottom-nav tab: Settings (`fa-gear`).

### Header Zone

- **Component:** Page header at top of route content
- `<h1>`: Heading/01 27.65px Lora Medium — "Settings" / "Ajustes" [REVISED]
- Subline: Body/03 muted — EN "Manage your language, notifications, and account." / ES "Administre su idioma, notificaciones y cuenta."
- Padding: `p-4`

### Content Zone

#### Section 1 — Language [REVISED]
- **Component:** `card` with `card-header` ("Language" / "Idioma") + `card-body`
- Inside `card-body`: `field-row` with horizontal layout
  - Label: Body/03 Semibold — EN "App language" / ES "Idioma de la app"
  - Toggle: `segmented-control` with two buttons "English" / "Español"; active state on current pref
  - Helper text: Body/04 muted —
    - EN: "Your messages and check-ins will use this language."
    - ES: "Sus mensajes y revisiones usarán este idioma."
- Note: This in-page toggle mirrors the `mobile-i18n-bar` toggle — they are the same setting; either updates the pref

#### Section 2 — Notifications
- **Component:** `card` with `card-header` ("Notifications" / "Notificaciones") + `card-body`
- Inside `card-body`: `toggle-group` with three rows
  - Row 1: `toggle` (default ON) + label "Push notifications" / "Notificaciones push" + description Body/04 "We'll let you know when something needs you." / "Le avisaremos cuando algo lo necesite."
  - Row 2: `toggle` (default ON) + label "Delivery updates" / "Actualizaciones de entrega" + description "When your meals are on the way." / "Cuando sus comidas van en camino."
  - Row 3: `toggle` (default ON) + label "Check-in reminders" / "Recordatorios de revisión" + description "Weekly nudges for your health check-ins." / "Recordatorios semanales para sus revisiones."
- Each toggle: `toggle-success` (green when ON), 48px tap target

#### Section 3 — Account
- **Component:** `card` with `card-header` ("Account" / "Cuenta") + `card-body`
- Account info: `data-table-kv` (read-only) with rows:
  - Name: Maria Rivera
  - Email: m.rivera@example.com
  - Phone: (555) 123-4567
- Below: `divider`
- Sign out button: `btn-outline btn-block` "Sign out" / "Cerrar sesión" — full-width, outline (not danger; sign-out is reversible)
- Note: editing account info is out of scope at v1 (per Gate 2-review decision); instructional helper text Body/04: [REVISED]
  - EN: "To update your details, message your care coordinator."
  - ES: "Para actualizar sus datos, envíe un mensaje a su coordinadora."
- `text-link` "Open Messages" / "Abrir mensajes" routing to `/messages`

#### Footer area within content [REVISED]
- App version + tiny privacy/terms links at the bottom of the content (above bottom-nav)
- Body/04 muted, centered:
  - EN: "Haven · v1.0 · Privacy · Terms"
  - ES: "Haven · v1.0 · Privacidad · Términos"
- Privacy + Terms link URLs pending legal team confirmation before ship.

### Footer Zone

`mobile-bottom-nav` (shell-level).

---

## Interaction Specifications

### Tap language toggle
- **Trigger:** Tap "English" or "Español" in the in-page segmented-control
- **Feedback:** Active state moves; all visible strings re-render via `data-i18n-en` / `data-i18n-es`; `mobile-i18n-bar` toggle reflects new state
- **Persistence:** Lang pref written to localStorage + user profile; persists across sessions and devices
- **Error handling:** Persistence write failure logs silently; toggle still applies for current session

### Toggle a notification
- **Trigger:** Tap any `toggle` in the Notifications section
- **Feedback:** Toggle animates to new state; label color/state matches; subtle haptic on mobile
- **Persistence:** Pref written immediately on tap
- **Error handling:** Persistence failure → toggle reverts + `alert-error` inline at top of section: [REVISED]
  - EN: "We couldn't save that change. Tap to try again."
  - ES: "No pudimos guardar ese cambio. Toque para intentar de nuevo."

### Tap "Open Messages" link
- **Trigger:** Tap `text-link` "Open Messages"
- **Feedback:** Link active state
- **Navigation:** Routes to `/messages` (pt-02-messages)

### Tap Sign out [REVISED]
- **Trigger:** Tap `btn-outline btn-block` "Sign out"
- **Feedback:** `overlay-confirm-dialog` appears
  - Title EN: "Sign out?" / ES: "¿Cerrar sesión?"
  - Body EN: "You can sign back in anytime with your phone or email."
  - Body ES: "Puede volver a iniciar sesión en cualquier momento con su teléfono o correo."
  - Buttons: `btn-outline` "Cancel" / "Cancelar" (left) + `btn-primary` "Sign out" / "Cerrar sesión" (right)
- **Navigation:** On confirm: clear session, route to login screen; on cancel: dismiss dialog
- **Error handling:** Sign-out failure → dialog stays with `alert-error` inline

---

## States

### Default (loaded)
- Page header
- Three section cards stacked
- App version / privacy footer at bottom

### Loading
- Page header renders
- Three `skeleton` cards with `skeleton-text` lines

### Error (settings load fails)
- Page header
- `alert-error` filling content area with retry CTA
- Notifications + account info hidden until reload succeeds

### Pref-save error
- Inline `alert-error` at top of the affected section; toggle reverts; retry CTA in alert

### Sign-out confirm dialog
- `overlay-confirm-dialog` with two action buttons; backdrop dims content

---

## Accessibility Notes

- `<main aria-label="Settings">` wraps the content
- `<h1>` receives focus on route entry
- Each section header is `<h2>` (Heading/03)
- Each toggle: `<input type="checkbox" role="switch">` with `aria-checked`; visible label; description in `<span id>` referenced via `aria-describedby`
- Sign out: `<button>` (not a link); confirm dialog uses `overlay-confirm-dialog` with focus trap (modal — focus trap is correct here per WCAG)
- Touch targets 44px+; toggles 48px tall
- Reduced motion respected for toggle animation

## Bilingual Considerations

- All visible UI strings: `data-i18n-en` / `data-i18n-es`
- Account info values render raw (Maria Rivera's name doesn't translate)
- Date / phone formatting locale-aware
- Spanish copy ~30% longer; sections padded enough to absorb wrap
- "Sign out" / "Cerrar sesión" — both 9 chars; balanced

## Open Questions

- Edit-account-info: should phone / email be editable in-app at v1? Currently routed through coordinator. Recommend keep coordinator-mediated at v1 — simplifies SOC2 + reduces account-takeover surface; revisit at v1.1 with proper MFA flow.
- Notification granularity: 3 toggles cover 80% of patient needs; should "Check-in reminders" sub-toggle into "Daily" / "Weekly" / "Off"? Recommend 3 toggles at v1; granularity deferred.
- Privacy + Terms links at footer — required at v1 per legal? Confirm with Cena legal team; placeholder strings now, real links as soon as URLs exist.
- Account section — show MRN or any clinical identifier? Recommend NO — keep patient-facing settings non-clinical. MRN is a clinical/billing artifact; coordinator + RDN see it; patient sees their name + contact only.

---

## New Components Flagged

None. All primitives shipped: `card`, `card-header`, `card-body`, `field-row`, `segmented-control`, `toggle`, `toggle-group`, `toggle-success`, `divider`, `data-table-kv`, `btn-outline`, `btn-block`, `btn-primary`, `text-link`, `overlay-confirm-dialog`, `alert-error`, `skeleton`, `skeleton-text`.
