# AGENTS.md — Appointments slice

For AI coding agents working with this slice. Read [`../AGENTS.md`](../AGENTS.md) first for bundle-wide conventions, then this file.

## What this slice is

The patient-facing appointment request surface for the UConn pilot (cap-21). **Request-only v1 (Path A):** the patient states a time preference; the care coordinator confirms a real slot. No live Athena calendar integration. Cena never books a slot directly in this version.

This is a **direct-manipulation form surface**, not chat-driven. The `chat-time-preference-picker` primitive is reused here in a form context — its markup is agnostic. Do not treat the Appointments slice as a chat flow.

## Hard invariants

These come from cap-21 + `flow-request-appointment.md`. A ported runner that violates one breaks the spec.

- **Request-only in v1.** The form collects a preference string. It does not book against a live calendar. The CC confirms the real slot out-of-band. Path B (live Athena slot fetch) is future scope.
- **Free text is canonical.** When the free-text field is populated, treat it as the preference. Chip selections are a fallback for when the patient doesn't type anything.
- **No calendar grid.** Never render a slot picker or Athena calendar view. That is Path B, and it is not built yet.
- **Pending-request card surfaces post-submit, not during input.** The card appears only after the preference is submitted. The form view and pending view are separate states.
- **Appointments is a Home-row destination, not a bottom-nav tab.** Do not add it to the bottom nav. Mark Home as active in all four states.
- **"Talk to a person" is always reachable.** Every state keeps the persistent affordance. Never hide it.
- **No celebration.** Cohort (HIV+, food-insecure, chronic stress). The post-submit copy is calm: "Got it. Your care coordinator will reach out…" No "Great job!" or confetti.
- **RDN session only in v1.** Non-RDN requests route to Talk-to-a-person. Do not add a type picker here; that is future scope.

## Conventions to honor

- **chat-time-preference-picker in form context.** Use the PL markup unchanged. Add `name="preference_text"` on the text input for form serialization. Chip toggle behavior (add/remove `is-selected`) is vanilla JS — wire it or port to Angular `(click)` handlers. Free text and chip state are independent; the consumer combines them on submit.
- **btn-primary = "Send request".** Sending a request is a commitment (DESIGN.md: primary teal = commitments). The add-to-calendar button is `btn-secondary` (advancement, not a new commitment — the appointment already exists).
- **badge-warning = "Pending."** The ETA line is `pending-request-card-eta` (muted). Do not use badge-success until the CC has confirmed. Badge lifecycle: `badge-warning` (pending CC review) → `badge-info` (queued) → `badge-success` (approved, transitional before becoming an `appointment-card`).
- **Copy vocabulary.** "Your dietitian" not "your RDN" or "your provider." "Care coordinator" not "CC" in patient-facing copy. "Request a time" not "schedule an appointment" (Athena owns actual scheduling). "Reach out" not "contact" or "reply."
- **Section label class.** Use inline `text-xs font-semibold uppercase tracking-wider text-sand-500` for the "Next visit" / "Coming up" labels in the upcoming state — these are layout-only, not a semantic class.

## Shape of each state

- **Empty** — `card > empty-state > empty-state-icon + h3 + p + btn-primary` (Request a time). No appointment rows.
- **Request** — `patient-chat-message` (agent framing) + `card > card-header + card-body > chat-time-preference-picker + p (reassurance) + btn-primary` (Send request).
- **Pending** — `patient-chat-message` (post-submit reassurance, `role="status"` + `aria-live="polite"`) + `pending-request-card > pending-request-card-body > …type + detail + status-row(badge-warning + eta)`.
- **Upcoming** — section label + `appointment-card` (next-up) + section label + `appointments-list` (2 rows) + `btn-primary` (Request another time). No pending card here; the pending state is a transient step before this one.

## ARIA notes

- `patient-chat-message` in the pending state carries `role="status"` and `aria-live="polite"` — the confirmation message is a live-region announcement for screen readers.
- Each `chat-chip-row` carries `role="group"` + `aria-labelledby` pointing at its `chat-time-preference-picker-section-label`. Preserve these on port.
- The free-text input has a `<label class="sr-only">` — keep it. Screen readers need the label even though the placeholder fills the visible role.
- Detail-row icons and button icons: `aria-hidden="true"` throughout.
- `appointment-card-avatar` inner `<span>` carries initials (visual only); the card title is the accessible name for the provider.

## JS behavior to port

No JS ships with this slice (no vanilla `.js` file). The chips are inert in the static HTML demo. On Angular port:

1. **Chip toggle:** `(click)` toggles `is-selected` class. Day-of-week and time-of-day chips are independently multi-select within each row. No single-select enforcement.
2. **Submit:** collect `free_text` value + serialize selected chips from both rows into a `preference` string. Write preference + timestamp to backend. Navigate to pending state.
3. **add-to-calendar:** generate an `.ics` blob from appointment details (date, time, location, provider name). Trigger download or system calendar intent.

## How to know when a porting task is done

- DOM hierarchy + semantic class names match the four HTML files
- Home is the active nav item in all four states (not a custom "Appointments" tab)
- "Talk to a person" affordance present in all four states
- Chip toggle wired: `is-selected` toggles per chip; both rows multi-select
- Free text + chip serialization on submit produces a `preference_text` string
- No calendar grid or slot picker rendered anywhere in v1
- Pending card shows `badge-warning` (not success) until CC confirms
- Post-submit `patient-chat-message` is a live region (`aria-live="polite"`)
- No celebration copy

If any criterion cannot be met, surface the gap. Do not substitute structure or behavior.

## Where to find the canonical spec

- Capability: `Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/cap-21-self-service-scheduling.md`
- Flow doc: `…/development/flows/flow-request-appointment.md`
- IA-v1: `~/.claude/plans/patient-app-ia-v1.md`
- Bundle conventions: `../AGENTS.md`

When those paths are not accessible, the per-page HTML comment blocks + this AGENTS.md + the slice README carry the load-bearing spec.
