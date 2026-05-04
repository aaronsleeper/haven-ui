# pt-05-care: Patient Care (Stub)

**Application:** Patient App
**Use Case(s):** Bottom-nav tab Care (per shell-use-cases.md screen inventory; PT-CARE)
**User Type:** Patient (Maria Rivera)
**Device:** Mobile (320-430px); desktop renders centered at 430px max-width
**Route:** `/care`

**Stub-level wireframe.** Care plan + appointments overview. Per Gate 1 G1.2 patient minimum, the assessments + Messages routes carry the bulk of the v1 patient experience. Care exists in the bottom-nav so the shell accommodates growth without redesign; v1 ships a high-level overview with deeper detail flagged for a later wireframe pass.

---

## Page Purpose

Maria opens Care to see her active care plan summary, upcoming appointments, and recent meal deliveries. The surface is read-only at v1 — patient cannot modify the plan or reschedule from here; instructions point to "message your coordinator" for changes.

---

## Layout Structure

### Shell

`shell-pt-mobile`. Active bottom-nav tab: Care (`fa-stethoscope`).

### Header Zone

- `<h1>`: Heading/01 27.65px Lora Medium — "Care" / "Cuidado" [REVISED]
- Subline: Body/03 muted — EN "Your plan, appointments, and deliveries." / ES "Su plan, citas y entregas."

### Content Zone

#### Section 1 — Care plan summary (read-only) [REVISED]
- **Component:** `card` with `card-header` ("Your care plan" / "Su plan de cuidado") + `card-body`
- Body: 3 patient-friendly bullets summarizing current goals (no clinical jargon)
  - EN: "Eat balanced meals to keep your blood sugar steady."
    ES: "Comer comidas balanceadas para mantener el azúcar estable."
  - EN: "Watch your salt intake."
    ES: "Cuidar la sal en sus comidas."
  - EN: "Check in once a week so your team knows how you're doing."
    ES: "Revisar una vez a la semana para que su equipo sepa cómo va."
- Helper:
  - EN: "Your care coordinator updates this plan with your team."
  - ES: "Su coordinadora actualiza este plan con su equipo."

#### Section 2 — Upcoming appointments
- **Component:** `card` with `card-header` ("Upcoming" / "Próximas citas") + `card-body`
- Inside: `list-group` of `list-group-item` rows (1-3 entries)
  - Each row: `list-group-item-icon` (`fa-calendar-check`) + `list-group-item-content` (title: "Nutrition check-in with Dr. Soto" / "Revisión con Dr. Soto" + description: date/time) + `list-group-item-trailing` (`text-link` "Details" / "Detalles", deferred to v1.1)
- Empty state if no appointments: small inline — EN "Nothing scheduled right now." / ES "Nada programado en este momento." [REVISED]

#### Section 3 — Recent deliveries
- **Component:** `card` with `card-header` ("Recent deliveries" / "Entregas recientes") + `card-body`
- Inside: `list-group` of 2-3 entries (date + delivered-status badge)
- Empty state if no deliveries: small inline — EN "Your meals will show up here once they're on the way." / ES "Sus comidas aparecerán aquí cuando vayan en camino." [REVISED]

#### Footer-instructional helper [REVISED]
- Body/04 muted at bottom of content:
  - EN: "To change anything, message your care coordinator."
  - ES: "Para cambiar algo, envíe un mensaje a su coordinadora."
- `text-link` "Open Messages" / "Abrir mensajes" routing to `/messages`

### Footer Zone

`mobile-bottom-nav` (shell-level).

---

## Interaction Specifications

### Tap "Open Messages" link
- **Trigger:** Tap `text-link`
- **Feedback:** Link active state
- **Navigation:** Routes to `/messages` (pt-02-messages)

### Tap an appointment / delivery row (DEFERRED to v1.1)
- v1: rows are visual-only; `text-link` "Details" deferred. Patient gets full appointment + delivery detail via /messages or coordinator follow-up.

---

## States

### Default (loaded with data)
- Header + 3 sections + footer helper

### Empty (no plan / no appointments / no deliveries) [REVISED — warmer tone register]
- Per-section empty inline copy
- If literally everything empty (new patient): single `data-empty-state` filling content area
  - Heading EN: "We're getting your plan ready" / ES: "Estamos preparando su plan"
  - Body EN: "Your care team is putting your plan together. We'll show it here as soon as it's ready."
  - Body ES: "Su equipo de cuidado está preparando su plan. Lo verá aquí en cuanto esté listo."

### Loading
- Page header
- 3 `skeleton` cards with `skeleton-text` lines

### Error
- `alert-error` at top with retry CTA; cards hide until reload succeeds

---

## Accessibility Notes

- `<main aria-label="Care">` wraps content
- `<h1>` receives focus on route entry
- Section headers are `<h2>` (Heading/03)
- `list-group-item` rows are static at v1 (no interactive behavior); when interactive at v1.1, they become `<button>` or `<a>` with proper labels
- Color-as-status: delivery status badges include text label
- Touch targets 44px+ for any link

## Bilingual Considerations

- All visible strings `data-i18n-en` / `data-i18n-es`
- Care plan goals authored in patient's language pref by the agent; if pref toggles, regenerate or pull pre-translated copies
- Date formatting locale-aware
- Spanish ~30% longer; sections padded

## Open Questions

- Care plan goals — how many should v1 surface? Recommend 3 to match the worked-example coordinator approval card (which lists 3 goals). Confirm same data source.
- Should "Recent deliveries" link to a separate per-delivery detail screen, or stay inline at v1? Recommend inline at v1; per-delivery detail is v1.1.
- Appointments at v1: read-only or rescheduleable? Recommend read-only — rescheduling routes through coordinator. v1.1 may add direct rescheduling.
- Should patient see who's on their team (coordinator name + RDN name) on this page? Could be a useful "your team" callout. Recommend deferred — keep v1 minimal.

---

## New Components Flagged

None. All primitives shipped: `card`, `card-header`, `card-body`, `list-group`, `list-group-item`, `list-group-item-icon`, `list-group-item-content`, `list-group-item-title`, `list-group-item-description`, `list-group-item-trailing`, `text-link`, `data-empty-state`, `alert-error`, `skeleton`, `skeleton-text`, `badge`.
