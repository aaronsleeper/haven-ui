---
shells:
  - name: mobile-shell
    pl_shell_version: sha256:7216f974a242c2b4803414646c733b3b194a1bdeec04e10b61be499eb7a2e599
---

# pt-02-messages: Patient Messages

**Application:** Patient App
**Use Case(s):** PT-SHELL-03 (`apps/patient/design/shell-use-cases.md`)
**User Type:** Patient (Maria Rivera)
**Device:** Mobile (320-430px); desktop renders centered at 430px max-width
**Route:** `/messages`

Per Gate 2-prep decision 3: this route is named "Messages" in patient-facing copy. System events render as "Notifications" / "Updates". The word "thread" never appears patient-facing; "agent" never appears patient-facing.

The Messages route IS the patient's "thread" surface — the right-pane equivalent in the universal three-pane model. Renders with the **strict patient allowlist** (`notification`, `human_message` from coordinator/patient, `status_change` of patient-visible events). Defense-in-depth: filtered server-side AND client-side. A `tool_call` leak is a P0 bug.

---

## Page Purpose

Maria sees a clean chronological list of messages from her care coordinator and system updates that affect her (delivery dispatched, appointment confirmed, assessment available). She can tap a message to expand and reply. New messages have a "New" pill until viewed. The surface feels conversational — message bubbles, not a clinical activity log.

---

## Layout Structure

### Shell

`shell-pt-mobile`. Active bottom-nav tab: Messages (`fa-message`). Optional `mobile-bottom-nav-badge` shows unread count when present.

### Header Zone

- **Component:** Page header at top of route content
- `<h1>`: Heading/01 27.65px Lora Medium — "Messages" / "Mensajes" [REVISED]
- Subline: Body/03 muted — EN "From your care team." / ES "De su equipo de cuidado."
- Optional unread count: small `badge-pill badge-info` next to title, e.g., "2 new" / "2 nuevos"
- Padding: `p-4`

### Content Zone

#### Message list (chronological, newest at top)
- **Component:** `thread-panel` configured with strict patient allowlist
- Inside, render message types per allowlist:
  - **Coordinator message (incoming):** `message-bubble-in` with `message-sender-label` "Sarah K., Care Coordinator" + body Body/02 + `message-timestamp` + optional `message-new-pill` until read
  - **Patient reply (outgoing):** `message-bubble-out` (right-aligned) with body + timestamp
  - **System update (notification, status_change):** `notif-item` rendered inline (NOT as a chat bubble) — `notif-item-icon-success` / `notif-item-icon-info` / `notif-item-icon-warning` per type + `notif-item-content` (title + description + timestamp). Patient-friendly labels — "Your Wednesday delivery is on the way", not "status_change.delivery.dispatched"
- Day separators between messages on different dates: `message-date-sep` with localized date (e.g., "Yesterday" / "Ayer")
- Scrollable; padding-bottom sufficient to clear bottom-nav + reply composer when open

#### Reply composer (collapsed by default)
- **Component:** Sticky at bottom of content area (above `mobile-bottom-nav`)
- Collapsed: thin row with EN "Write to your coordinator…" / ES "Escriba a su coordinadora…" + `fa-pen-to-square` icon [REVISED]
- Tapping the row expands the composer:
  - Textarea: 3-line minimum auto-grow
  - Send button: `btn-primary` "Send" / "Enviar" — primary teal because it's a patient commitment (sending a message to coordinator)
  - Cancel: `btn-ghost` "Cancel" / "Cancelar"
  - On send: outgoing message appears as `message-bubble-out`; composer collapses
- Honors `pb-safe-4` for iOS home-indicator clearance

### Footer Zone

`mobile-bottom-nav` (shell-level). Reply composer sits above bottom-nav when expanded.

---

## Interaction Specifications

### Tap a message bubble
- **Trigger:** Tap any incoming message
- **Feedback:** Bubble expands to show full content if previously truncated; `message-new-pill` removes; mark-read written to backend
- **Navigation:** Stays on /messages
- **Error handling:** Mark-read failure logs silently; pill stays until next sync

### Tap reply composer
- **Trigger:** Tap the collapsed reply row
- **Feedback:** Composer expands; textarea focuses; keyboard opens (mobile)
- **Navigation:** Stays on /messages
- **Error handling:** N/A

### Send a reply
- **Trigger:** Type in textarea, tap Send / Enviar
- **Feedback:** Outgoing `message-bubble-out` appears immediately; composer collapses; subtle "delivering" indicator on the new bubble (gray timestamp until confirmed)
- **Navigation:** Stays on /messages; list scrolls to bottom to show new outgoing
- **Error handling:** [REVISED] Send failure → bubble shows retry icon; tap to retry; if persistent, banner alert at top:
  - EN: "We couldn't send your message. Tap to try again."
  - ES: "No pudimos enviar su mensaje. Toque para intentar de nuevo."

### Tap a system notification (e.g., "Your delivery is on the way")
- **Trigger:** Tap a `notif-item`
- **Feedback:** Notification briefly inverts; expanded detail (if any) shows; mark-read.
- **Navigation:** May route to relevant surface (delivery → /care; assessment available → assessment intro)
- **Error handling:** Mark-read failure logs silently

### Pull-to-refresh (DEFERRED to v1.1)
- Native pull-to-refresh on this route is deferred

---

## States

### Default (messages present)
- Page header at top
- Chronological message list (newest at top)
- Reply composer collapsed at bottom

### Empty State [REVISED]
- **Component:** `data-empty-state` filling content area
- Icon: `fa-envelope-open` (regular) in sand-200, 64px
- Heading EN: "No messages yet" / ES: "Sin mensajes aún"
- Message EN: "When your care team sends you a message, you'll see it here."
- Message ES: "Cuando su equipo de cuidado le envíe un mensaje, lo verá aquí."
- No CTA needed
- Reply composer hidden

### Loading
- Page header renders
- 3-4 `skeleton` rows alternating left/right alignment to suggest message bubbles + 1 `skeleton` row for a system notif
- Reply composer hidden until messages load

### Error [REVISED]
- Page header renders
- `alert-error` at top of message list area + retry CTA "Try again" / "Intentar de nuevo"
  - EN: "We're having trouble loading your messages. Tap to try again."
  - ES: "No podemos cargar sus mensajes. Toque para intentar de nuevo."
- Reply composer remains functional with cached state

### Send-pending state
- Outgoing bubble appears with grayed timestamp
- Once delivery confirmed, timestamp solidifies; if failed, retry icon appears

### Worked-example content (for v1 demo) [REVISED]
- 1 incoming message from Sarah K.:
  - EN: "Your delivery was rescheduled to Wednesday — let me know if that doesn't work for you."
  - ES: "Su entrega se cambió al miércoles — avíseme si no le funciona."
- 1 outgoing reply from patient:
  - EN: "Wednesday is fine. Thank you!"
  - ES: "El miércoles está bien. ¡Gracias!"
- 1 system notification (taps through to assess-02-assessment-intro):
  - EN: "Your weekly check-in is ready. It takes about 2 minutes."
  - ES: "Su revisión semanal está lista. Toma como 2 minutos."

---

## Privacy / Defense-in-Depth (HIPAA-aware) [REVISED]

The patient-allowlist `thread-panel` configuration enforces filtering at TWO layers:

1. **Server-side (FIRST line):** non-allowlist message types (`agent_tool_call`, `agent_tool_result`, `approval_request`, `approval_response`, agent-internal events) are filtered before transit. Patient client never receives these payloads.
2. **Client-side renderer (BACKSTOP):** the React `<ThreadPanel>` component re-applies the allowlist when rendering. If a non-allowlist event somehow arrives (server bug, replay attack, race condition), the client drops it silently AND logs to telemetry as P0.

Either layer dropping the event is correct behavior; both layers must be present and tested. This is the operational guarantee dev-tasker must implement.

## Accessibility Notes

- `<main aria-label="Messages">` wraps the content
- `<h1>` page title receives focus on route entry
- Message list uses `role="log"` with `aria-live="polite"` so new arrivals announce
- Each `message-bubble-in` / `message-bubble-out`: structured as `<article>` with sender label as `<span class="message-sender-label">` and timestamp as `<time datetime>`
- `notif-item` uses `<button>` if tappable, `<div>` if read-only; icon `aria-hidden="true"`; semantic label provides context
- Reply composer: textarea has visible label OR `aria-label="Write a reply"`; Send button is a `<button>` (not a div)
- Touch targets 44px+ for all interactive elements
- Reduced motion respected for bubble appear animation
- Color independence: notif-item severity carries icon + text label, never color alone
- `message-new-pill` includes the word "New" / "Nuevo" — color is supplemental

## Bilingual Considerations

- All visible UI strings: `data-i18n-en` / `data-i18n-es`
- Coordinator-authored messages: rendered in the language they were written (coordinator typically writes in EN; if Spanish-speaking coordinator authors in ES, render as-is)
- Patient-authored messages: rendered in the language patient typed (no auto-translate)
- System notifications: must support EN/ES — the agent generates these per patient language pref
- Date / time / "Yesterday" / "Ayer": locale-aware
- Spanish UI strings ~30% longer than English; reply composer expands to absorb without breaking layout

## Open Questions

- Should patient be able to attach an image to a reply at v1? Recommend no — text-only at v1; image attach deferred.
- Should patient see typing indicators when coordinator is replying? Real-time presence is deferred to v1.1.
- "Mark all as read" affordance: needed at v1? Recommend no — automatic mark-read on tap is simpler.
- Confirm "Coordinator" terminology vs. "Care team" / "Equipo de cuidado" — the persona is "Sarah K., Care Coordinator" per `DESIGN.md` mock samples, but patient-facing copy might prefer "your care team" for warmth. Recommend role title in sender label ("Sarah K., Care Coordinator") to keep accountability; "your care team" in surrounding helper copy.
- Strict allowlist enforcement at the rendering layer: if a non-allowlist message_type leaks to the patient client, what's the failure mode? Recommend: client filter drops silently AND logs to telemetry as P0; UI shows nothing for that event. Confirm.

---

## New Components Flagged

None — but flagging the **patient-allowlist `thread-panel` configuration** as a Tier 1 promotable composition (per `shell-component-gaps.md`). Trigger to promote: when kitchen ships its own allowlist. Until then, inline carve-out: compose `thread-panel` + strict allowlist data + `message-bubble-in` / `message-bubble-out` + `notif-item` in app code.

All primitives shipped: `thread-panel`, `message-bubble-in`, `message-bubble-out`, `message-sender-label`, `message-date-sep`, `message-timestamp`, `message-new-pill`, `notif-item` (with `notif-item-icon-*` modifiers), `data-empty-state`, `alert-error`, `btn-primary`, `btn-ghost`, `skeleton`, `badge-pill`, `badge-info`.
