# Component Map: Patient App — Universal Shell Pipeline (2026-05-04)

**Date:** 2026-05-04
**Source wireframes:**
- `apps/patient/design/wireframes/pt-shell-flow.md`
- `apps/patient/design/wireframes/shell-pt-mobile.md`
- `apps/patient/design/wireframes/pt-01-dashboard.md`
- `apps/patient/design/wireframes/pt-02-messages.md`
- `apps/patient/design/wireframes/pt-03-settings.md`
- `apps/patient/design/wireframes/pt-04-my-health.md`
- `apps/patient/design/wireframes/pt-05-care.md`
**components.css read:** 2026-05-04 (fresh)
**COMPONENT-INDEX.md read:** 2026-05-04 (fresh)

> Note: Supersedes the earlier `component-map.md` (dated 2026-03-12) for the shell-pipeline pass. Prior file remains as historical reference for the MVP assess pass.

---

## Component Inventory Summary

**Existing components used:** 35
**New components required:** 0
**Utility-only patterns:** 5

---

## New Components Required

None. All patient app primitives ship in PL. The patient-allowlist `thread-panel` configuration (Messages route) is a Tier 1 promotable composition — promote when kitchen ships its own allowlist; inline carve-out at v1.

---

## Screen: shell-pt-mobile (Persistent Patient Mobile Shell)

**Wireframe source:** `wireframes/shell-pt-mobile.md`

### Recipe

1. **Body:** `mobile-app` class on `<body>` — disables desktop ambient blobs; `bg-sand-100` chrome ground outside shell
2. **Shell envelope:** `mobile-shell` — `block w-full max-w-[430px] mx-auto min-h-dvh bg-white relative`
3. **Fixed top:** `mobile-i18n-bar` → `mobile-i18n-toggle` × 2 (EN/ES radio pair)
   - Cena logo `logo-cenahealth-teal.svg` at ~24×80px; EN/ES toggle right-aligned
   - Ava avatar: **does NOT appear** in patient shell — Cena logo is the only brand identity
   - Surface: `--color-surface-chrome` (sand-100)
4. **Route content area:** scrollable; `padding-top` for i18n bar; `padding-bottom` for bottom-nav + safe-area
5. **Fixed bottom:** `mobile-bottom-nav` → 5× `mobile-bottom-nav-tab` (Dashboard / My Health / Messages / Care / Settings)
   - Icons: `fa-house` / `fa-heart-pulse` / `fa-message` / `fa-stethoscope` / `fa-gear`
   - Active tab: `.active` — teal icon + label (Source Sans 3 Semibold weight bump, not background)
   - Unread badge: `mobile-bottom-nav-badge` on Messages tab (when unread count > 0)
   - Safe-area: `pb-safe-4` / `pb-safe-8` via `max(floor, env(safe-area-inset-bottom))`
6. **Shell states — loading:** `skeleton` placeholders; i18n bar + bottom-nav remain rendered
7. **Shell states — error:** `alert-error` at top of content area; i18n bar + bottom-nav remain functional
8. **Shell states — offline:** `alert-warning` sticky below i18n bar (EN/ES copy)

### Data Bindings

- `body[lang]`: bound to active language preference (`en` / `es`); updated on toggle
- `mobile-bottom-nav-tab.active`: bound to current route
- `mobile-bottom-nav-badge`: bound to unread message count from API
- All visible strings: `data-i18n-en` / `data-i18n-es` attributes; switched by `i18n.js`

### Preline Interactions

- None at shell level; `mobile-i18n-toggle` and `mobile-bottom-nav` are CSS-only + vanilla JS (`i18n.js`)

---

## Screen: pt-01-dashboard (Patient Dashboard)

**Wireframe source:** `wireframes/pt-01-dashboard.md`

### Recipe

1. **Shell:** `shell-pt-mobile`; active tab: Dashboard (`fa-house`)
2. **Header zone:**
   - `<h1>` Heading/01 Lora Medium — "Welcome back, Maria" / "Bienvenida, María"
   - Subheading Body/03 muted — one of 3 template variants (action-recent / action-none-warm / time-of-day-fallback) EN/ES
3. **Content — Today's task card (when present):**
   - Section heading Heading/04 Lora Medium "Today's check-in" / "Su revisión de hoy"
   - `task-card` (`.task-card-overdue` / `.task-card-in-progress` / default) → `task-card-icon` + `task-card-content` → `task-card-name` (Body/02 Semibold) + `task-card-meta` (Body/04 muted)
4. **Content — Recent message preview (when present):**
   - Section heading Heading/04 "Recent message" / "Mensaje reciente"
   - `card` → `card-body` — sender label + body truncated 2-line (Body/03) + `message-new-pill` (if unread) + `text-link` "View" / "Ver"
5. **Content — Next delivery countdown (when present):**
   - `delivery-status-card` — three states (preparing / delivering / delivered) driven by delivery progression; auto-rendered
6. **Content — Empty state (nothing to surface):**
   - `data-empty-state` — `fa-mug-hot` icon 64px + "Nothing to do today" / "Nada que hacer hoy" + warm body copy
7. **Error state:**
   - `alert-error` below greeting + `btn-outline btn-sm` "Try again" / "Intentar de nuevo"

### Data Bindings

- Greeting subheading variant: computed at render from patient activity log + time-of-day
- Task card variant: bound to `task.status` — `overdue` / `in_progress` / null
- `message-new-pill`: conditional on `message.read === false`
- All copy strings: `data-i18n-en` / `data-i18n-es`

### Preline Interactions

- None on this route; `delivery-status-card` states are CSS-class-driven from API data

---

## Screen: pt-02-messages (Patient Messages)

**Wireframe source:** `wireframes/pt-02-messages.md`

### Recipe

1. **Shell:** `shell-pt-mobile`; active tab: Messages (`fa-message`); `mobile-bottom-nav-badge` with unread count
2. **Header zone:**
   - `<h1>` Heading/01 — "Messages" / "Mensajes"
   - Subline Body/03 muted — "From your care team." / "De su equipo de cuidado."
   - Optional `badge-pill badge-info` unread count next to title
3. **Content — Message list:**
   - `thread-panel` (strict patient allowlist: `notification`, `human_message`, `status_change` patient-visible only)
   - Per event type:
     - Coordinator incoming: `message-bubble-in` → `message-sender-label` + body (Body/02) + `message-timestamp` + optional `message-new-pill`
     - Patient reply (outgoing): `message-bubble-out` (right-aligned) + body + `message-timestamp`
     - System event: `notif-item` (inline, NOT a bubble) → `notif-item-icon-*` + `notif-item-content` → title + description + timestamp
   - Day separators: `message-date-sep` (locale-aware date string)
4. **Footer — Reply composer (sticky above bottom-nav):**
   - Collapsed: thin row + "Write to your coordinator…" / "Escriba a su coordinadora…" + `fa-pen-to-square`
   - Expanded: `<textarea>` (3-line min, auto-grow) + `btn-primary` "Send" / "Enviar" + `btn-ghost` "Cancel" / "Cancelar"
   - `pb-safe-4` for iOS home-indicator clearance
5. **Empty state:** `data-empty-state` — `fa-envelope-open` 64px + "No messages yet" / "Sin mensajes aún"
6. **Loading:** 3–4 `skeleton` rows alternating left/right + 1 `skeleton` row for notif style
7. **Error:** `alert-error` + "Try again" / "Intentar de nuevo"

### Data Bindings

- `thread-panel` allowlist: `data-allowlist="notification,human_message,status_change_patient"` — enforced server-FIRST + client-BACKSTOP (HIPAA defense-in-depth per pt-02 wireframe)
- `notif-item-icon-*` variant: bound to `notification.type` — success / info / warning
- Reply send → `message-bubble-out` optimistic render; gray timestamp until delivery confirmed
- `message-new-pill` removed on tap + mark-read API call

### Preline Interactions

- None at route level; reply composer expand/collapse is vanilla JS or React state
- `role="log"` with `aria-live="polite"` on message list for new-arrival announcements

---

## Screen: pt-03-settings (Patient Settings)

**Wireframe source:** `wireframes/pt-03-settings.md`

### Recipe

1. **Shell:** `shell-pt-mobile`; active tab: Settings (`fa-gear`)
2. **Header zone:**
   - `<h1>` Heading/01 — "Settings" / "Ajustes"
   - Subline Body/03 muted
3. **Section 1 — Language:**
   - `card` → `card-header` "Language" / "Idioma" + `card-body`
   - `field-row` (horizontal) → label "App language" / "Idioma de la app" + `segmented-control` (2 buttons: English / Español)
   - Helper text Body/04 muted
4. **Section 2 — Notifications:**
   - `card` → `card-header` "Notifications" / "Notificaciones" + `card-body`
   - `toggle-group` → 3× `toggle` (`toggle-success`) + label + `toggle-description`
5. **Section 3 — Account:**
   - `card` → `card-header` "Account" / "Cuenta" + `card-body`
   - `data-table-kv` — Name / Email / Phone (read-only)
   - `divider`
   - `btn-outline btn-block` "Sign out" / "Cerrar sesión" → triggers `overlay-confirm-dialog`
   - Helper Body/04 + `text-link` "Open Messages" / "Abrir mensajes"
6. **Footer within content:**
   - Body/04 muted — app version + privacy + terms links (URLs pending legal)

### Data Bindings

- `segmented-control` active state: bound to `user_prefs.lang`
- `toggle.checked`: bound to `user_prefs.notifications.*` — written on tap
- Account info values: read from user profile (name / email / phone) — no editability at v1
- Pref-save error: inline `alert-error` at top of affected section; toggle reverts on failure

### Preline Interactions

- `data-hs-overlay` — `overlay-confirm-dialog` for sign-out confirmation
- `segmented-control` — CSS-only / React state for active tracking
- Toggles: `<input type="checkbox" role="switch">` — no Preline required

---

## Screen: pt-04-my-health (Patient My Health — Stub)

**Wireframe source:** `wireframes/pt-04-my-health.md`

### Recipe

1. **Shell:** `shell-pt-mobile`; active tab: My Health (`fa-heart-pulse`)
2. **Header zone:** `<h1>` "My Health" / "Mi Salud" + subline Body/03 muted
3. **Content:** Inherits from `assess-01-my-health.md` composition:
   - `trend-card` × 3 (Mood / Energy / Meal Satisfaction) → `trend-card-header` + `trend-card-chart` (Chart.js sparkline) + `badge-trend` (trend direction)
   - Tappable → assess-05-metric-detail
4. **Empty state:** per `assess-01-my-health` spec
5. **Loading:** `skeleton` cards with `skeleton-text` lines

### Data Bindings

- `trend-card` sparkline data: `chart-sparkline` with Chart.js; HAVEN.* color constants
- `badge-trend` variant: bound to metric trend direction (`.trend-improving` / `.trend-flat` / `.trend-worsening`)

### Preline Interactions

- None; Chart.js sparklines are static canvas renders

---

## Screen: pt-05-care (Patient Care — Stub)

**Wireframe source:** `wireframes/pt-05-care.md`

### Recipe

1. **Shell:** `shell-pt-mobile`; active tab: Care (`fa-stethoscope`)
2. **Header zone:** `<h1>` "Care" / "Cuidado" + subline Body/03 muted
3. **Section 1 — Care plan summary (read-only):**
   - `card` → `card-header` + `card-body` — 3 patient-friendly bullet goals + helper Body/04 muted
4. **Section 2 — Upcoming appointments:**
   - `card` → `card-header` + `card-body`
   - `list-group` → `list-group-item` × 1–3 → `list-group-item-icon` (`fa-calendar-check`) + `list-group-item-content` → title + `list-group-item-description` (date/time) + `list-group-item-trailing` (`text-link` "Details" — deferred v1.1)
   - Inline empty: Body/03 "Nothing scheduled right now."
5. **Section 3 — Recent deliveries:**
   - `card` → `card-header` + `card-body`
   - `list-group` → `list-group-item` × 2–3 (date + delivery status badge)
   - Inline empty: Body/03 "Your meals will show up here once they're on the way."
6. **Footer helper:** Body/04 muted + `text-link` "Open Messages" → `/messages`
7. **Full empty (new patient):** `data-empty-state` — "We're getting your plan ready" / "Estamos preparando su plan"

### Data Bindings

- Care plan goals: agent-generated in patient's language pref; 3 bullets max at v1
- Appointment rows: `*ngFor` from care plan API; date formatted via `Intl.DateTimeFormat`
- Delivery rows: `*ngFor` from delivery API; status badge bound to delivery status
- `text-link` "Open Messages": router navigation to `/messages`

### Preline Interactions

- None on this route; all content is static display at v1
