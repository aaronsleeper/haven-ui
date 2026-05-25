# Slice 5 — Appointments (request-only v1)

Patient-facing appointment request surface for the UConn pilot (cap-21). Request-only — Cena collects a time preference and hands off to the care coordinator, who confirms a real slot. No live Athena calendar integration in this slice (Path A from the flow doc).

## What this is

A **direct-manipulation form surface**, NOT chat-driven. Appointments is reached from a Home-row destination, not a bottom-nav tab (IA-v1 boundary; see IA note below). The patient states a time preference in plain language; the care coordinator replies within 1 business day. Cena never books against a live calendar in this version.

Scope = **request-only v1 (Path A)** per `flow-request-appointment.md`:
- Patient submits time preference (free text + optional chip shortcuts)
- Pending-request card surfaces post-submit with `badge-warning` "Pending" status
- CC confirms a real slot outside this surface
- The confirmed visit then shows as a full `appointment-card`

**Out of scope (deliberately):**
- **Path B (live Athena slot fetch)** — dependent on cap-14 Athena boundary + API access. Build Path A first; layer Path B when integration lands.
- **Reschedule / cancel flows** — patient taps an existing appointment row; flows merge back into preference-collection. Deferred post-pilot.
- **Non-RDN appointment types** — cap-21 scopes to RDN sessions for pilot. Non-RDN routes to Talk-to-a-person.
- **Smart cadence reminders** — agent surfaces "you're due" nudge (covered at greeting level in home surface, not this slice).

## Athena / B7 boundary note

The `pending-request-card` and this entire slice exist precisely because of the Athena boundary (cap-14, open question B7). Cena's job in the pilot is to initiate a request that flows into Athena — **not** to duplicate Athena's scheduling UI. If B7 resolves to "Cena gets read+write API access," add Path B as a second state; the Path A states remain as the resilient fallback.

## States

| State | File | What it shows |
|---|---|---|
| Empty | `appointments.empty.html` | No appointments yet. `data-empty-state` card + "Request a time" CTA (`btn-primary`). |
| Request | `appointments.request.html` | The preference form. Agent framing (`patient-chat-message`) + `chat-time-preference-picker` in form context + "Send request" (`btn-primary`). |
| Pending | `appointments.pending.html` | Post-submit. Agent reassurance (`patient-chat-message`) + `pending-request-card` (type + preference + `badge-warning` "Pending" + ETA). |
| Upcoming | `appointments.upcoming.html` | Confirmed visit on the books. `appointment-card` (next-up: avatar + name + role + date/time + location + add-to-calendar `btn-secondary`) + `appointments-list` (2 additional rows below). |

## Composition — primitive classes used

All classes confirmed in `../assets/haven.css` before use. Zero new classes introduced (Tier 2 composition).

**Shell:** `app-shell`, `app-shell-frame`, `app-shell-sidebar`, `app-shell-main`, `app-shell-content`, `app-shell-bottom-nav`, `nav-*`, `mobile-bottom-nav*`

**data-empty-state:** `card`, `empty-state`, `empty-state-icon`, `btn-primary`, `btn-sm`

**chat-time-preference-picker (form context):** `chat-time-preference-picker`, `chat-time-preference-picker-input`, `chat-time-preference-picker-section-label`, `chat-chip-row`, `chat-chip`, `is-small`, `is-soft`

**card form wrapper:** `card`, `card-header`, `card-title`, `card-body`

**pending-request-card:** `pending-request-card`, `pending-request-card-body`, `pending-request-card-type`, `pending-request-card-detail`, `pending-request-card-status-row`, `pending-request-card-eta`, `badge`, `badge-pill`, `badge-warning`

**appointment-card:** `appointment-card`, `appointment-card-header`, `appointment-card-avatar`, `appointment-card-meta`, `appointment-card-title`, `appointment-card-subtitle`, `appointment-card-details`, `appointment-card-detail-row`, `appointment-card-detail-icon`, `appointment-card-actions`, `avatar`, `avatar-primary`, `btn-secondary`, `btn-sm`

**appointments-list:** `appointments-list`, `appointments-list-row`, `appointments-list-row-icon`, `appointments-list-row-meta`, `appointments-list-row-when`, `appointments-list-row-who`

**Cross-cutting:** `patient-chat-message`, `list-group`, `list-group-item`, `list-group-item-action`, `list-group-item-icon`, `list-group-item-content`, `list-group-item-title`, `list-group-item-description`, `list-group-item-trailing`, `page-header`, `page-title`, `section-header`

## IA-v1 note — Appointments is not a tab

Appointments is a **Home-row destination** in IA-v1, not a bottom-nav tab. The three bottom-nav tabs are: Home · Order · Activity. The sidebar and bottom-nav mark Home as the active item from within the Appointments slice — same pattern as the log-outcome and dietary-recall slices. This reflects the open question in IA-v1 about the Athena boundary (B7): once B7 resolves, Appointments may warrant promotion to a persistent tab. Until then, it lives under Home.

## chat-time-preference-picker in a form context

The `chat-time-preference-picker` is a chat affordance primitive (category: Patient App — A2UI Chat Affordances). Its markup is agnostic — it works outside a chat pane. In this slice it is composed as a form field inside a `card-body`, not as part of a chat thread. The consumer reads `free-text` as canonical when populated; chip selections are a fallback. No new CSS was required — the classes are identical in both contexts.

## Behavior to implement on port

- **Chip toggle:** tapping a chip toggles `is-selected` on it. Chips within the same row are multi-select (a patient may want "Weekdays" + "Morning" + "Afternoon" simultaneously). Free-text input is independent.
- **Free-text canonical:** on submit, if the free-text field is populated, pass it as the primary preference string. If empty, serialize chip selections into a preference phrase (e.g., "Weekdays, mornings").
- **Preference serialization:** emit a `preference_text` string to the backend. No structured slot data in v1 — the CC reads the string and confirms manually.
- **Submit navigates to pending state.** No network call in the demo; on port, submit fires a preference write to the backend, then navigates to the patient's pending-request view.
- **No live calendar grid.** Do not render Athena slots. The pick-a-slot UI (Path B) is a future enhancement.
- **add-to-calendar action** (upcoming state): standard `data:text/calendar` generation from appointment details. Andrey owns the ICS generation.

## Open issues

- **Which Athena path is live at pilot launch** — Path A (this slice) is the default build. Path B (live slot fetch) layers on when cap-14 boundary + Athena API scope resolve.
- **Reschedule-pending state semantics** — depends on whether Athena can hold two slots during the request window. Flag for Athena alignment before implementing reschedule.
- **Whether persistent Appointments tab lands in pilot** — per IA-v1 open question B7. Currently Home-row only.

## Canonical references

- Capability: `Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/cap-21-self-service-scheduling.md`
- Flow doc (design intent + Path A / Path B spec): `…/development/flows/flow-request-appointment.md`
- IA-v1: `~/.claude/plans/patient-app-ia-v1.md` — Appointments row, Home-row destination, B7 boundary note
- Pattern library: `Lab/haven-ui/packages/design-system/pattern-library/COMPONENT-INDEX.md`
- Sibling slice conventions: `../log-outcome/README.md`, `../assessments/SHELL-DECISION.md`
