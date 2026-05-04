# shell-pt-mobile: Patient Mobile Shell

**Application:** Patient App
**Use Case(s):** PT-SHELL-01 through PT-SHELL-06 (`apps/patient/design/shell-use-cases.md`)
**User Type:** Patient (Maria Rivera)
**Device:** Mobile-first (320-430px); desktop renders centered at 430px max-width
**Route:** Persistent shell wrapping every patient route

This is the canonical wireframe-format spec for the patient mobile shell. Refines and supersedes `apps/patient/design/wireframes/patient-mobile-shell.md` (preserved for context) into the `ux-wireframe` skill format. Per Gate 1 G1.3 the patient mobile shell is authored alongside the coordinator desktop shell because mobile is the patient's reality.

The universal three-pane abstraction collapses on mobile to a route-based single-pane view. The patient app omits the agent-activity surface entirely — Ava's avatar never appears in the patient app; the Cena logo is the only brand identity in patient chrome.

---

## Page Purpose

Render a calm, brand-correct mobile envelope wrapping every patient route. The patient sees:
- A fixed top language toggle (EN/ES)
- A scrollable content area sized to one task or message at a time
- A fixed bottom navigation with 5 tabs

The shell never exposes agent activity, tool calls, or approval cards; the Messages route is the patient's "thread" equivalent and renders the strict allowlist (`notification`, `human_message` from coordinator/patient, `status_change` of patient-visible events only). Layout absorbs Spanish strings (~30% longer than English) without breaking. iOS home indicator clearance honored on every sticky surface.

---

## Layout Structure

### Shell

`<body class="mobile-app">` disables desktop ambient blobs. Inside, `<div class="mobile-shell">` is the inner envelope: `block w-full max-w-[430px] mx-auto min-h-dvh bg-white relative`. Outside the shell on larger screens, `bg-sand-100` shows through (chrome ground per `DESIGN.md` §Surface).

```
┌─────────────────────────────────┐  ← viewport (sand-100 outside on large screens)
│ ┌─────────────────────────────┐ │
│ │  mobile-i18n-bar (fixed top)│ │  ← Cena mark + EN/ES toggle, ~36px tall
│ ├─────────────────────────────┤ │
│ │                             │ │
│ │   route content             │ │  ← scrollable, 430px max-width
│ │   (Dashboard / My Health /  │ │
│ │    Messages / Care /        │ │
│ │    Settings)                │ │
│ │                             │ │
│ ├─────────────────────────────┤ │
│ │  mobile-bottom-nav (fixed)  │ │  ← 5-tab nav, ~64px + safe-area
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
        ← max-width: 430px →
```

### Header Zone — `mobile-i18n-bar` (fixed top)

- **Component:** `mobile-i18n-bar` + `mobile-i18n-toggle`
- Cena Health wordmark (`logo-cenahealth-teal.svg`), small (~24px tall × ~80px wide), left-aligned
- EN/ES toggle right-aligned: two-button radio pattern with `aria-pressed` reflecting state
- Surface: `--color-surface-chrome` (sand-100); fixed at top; full-width within `mobile-shell`
- Height: ~36px
- No other affordances (no profile, no settings shortcut) — keeps cognitive load minimal

### Content Zone — Route content area

- Scrollable container; `padding-top` accounts for `mobile-i18n-bar`; `padding-bottom` accounts for `mobile-bottom-nav` + safe-area
- Surface inside the shell: `bg-white` (the shell envelope is card-like)
- Content max-width: 430px (the shell width); per-route padding lives in the route wireframes
- Each route's main content wrapped in `<main aria-label="<route name>">`

### Footer Zone — `mobile-bottom-nav` (fixed bottom)

- **Component:** `mobile-bottom-nav` + `mobile-bottom-nav-tab` + `mobile-bottom-nav-badge`
- 5 tabs:

| Tab | Icon (FA Pro) | Route | Use case |
|---|---|---|---|
| Dashboard | `fa-house` | `/` | PT-DASHBOARD — today's task, message preview, next delivery |
| My Health | `fa-heart-pulse` | `/health` | PT-HEALTH — trend cards |
| Messages | `fa-message` | `/messages` | PT-MESSAGES — patient-side notifications-only thread |
| Care | `fa-stethoscope` | `/care` | PT-CARE — care plan + appointments overview |
| Settings | `fa-gear` | `/settings` | PT-SETTINGS — language, notifications, sign out |

- Active tab: `mobile-bottom-nav-tab.active` — teal accent on icon + label, weight bumped to Source Sans 3 Semibold per `DESIGN.md` brand-taste rule (active state = weight, not background)
- Optional badge on Messages tab: `mobile-bottom-nav-badge` with unread count
- Height: ~64px + safe-area (iOS home indicator honored via `pb-safe-4` or `env(safe-area-inset-bottom)`)
- Surface: `bg-white` with subtle `border-t` separator; sand-100 fallback if needed

---

## Interaction Specifications

### Tap a bottom-nav tab
- **Trigger:** Tap any `mobile-bottom-nav-tab`
- **Feedback:** Tab icon + label switch to active state (teal + weight bump). Previous active tab returns to default. Subtle press animation respecting `prefers-reduced-motion`.
- **Navigation:** Route changes; content area replaces; scroll position resets to top of new route.
- **Error handling:** If route fails to load, `alert-error` inline at top of content area + retry CTA; `mobile-i18n-bar` and `mobile-bottom-nav` remain functional.

### Tap EN/ES toggle
- **Trigger:** Tap "EN" or "ES" in `mobile-i18n-bar`
- **Feedback:** Active button moves; `<body lang>` updates; all visible strings re-render via `data-i18n-en` / `data-i18n-es` attributes (powered by `src/scripts/components/i18n.js`)
- **Persistence:** Lang pref written to localStorage + user profile; persists across sessions and devices
- **Layout:** Spanish strings ~30% longer than English; layouts already padded for max-length per shipped patient screens

### Push-notification deep link [REVISED]
- **Trigger:** Patient taps a system push notification
- **Feedback:** App opens
- **Navigation:** Lands on pt-01-dashboard with the relevant task surfaced (per Gate 2 decision 7 — Dashboard at v1; direct-to-task at v1.1).

### Pull-to-refresh (DEFERRED to v1.1)
- Native iOS/Android pull-to-refresh on Dashboard and Messages routes — flagged for v1.1; not specced here

### Swipe-nav (DEFERRED to v1.1 per Gate 2-prep decision 9)
- v1 ships bottom-nav only; swipe-nav is the universal-shell vision but defers behind tab-nav

---

## States

### Default (any route)
- `mobile-i18n-bar` visible at top with active language pressed
- Route content scrolls
- `mobile-bottom-nav` visible at bottom; active tab corresponds to current route

### Loading
- Route content area shows `skeleton` placeholders matching the target screen's layout
- `mobile-i18n-bar` and `mobile-bottom-nav` stay rendered (no full-screen blank flash)

### Empty (route-specific — see route wireframes for details)
- Dashboard with no task: warm copy + illustration
- My Health with no data: empty state pointing patient to first assessment
- Messages with no messages: positive empty state ("No messages yet")

### Error
- `alert-error` at top of content area with retry CTA
- `mobile-i18n-bar` + `mobile-bottom-nav` remain functional

### Offline [REVISED]
- Sticky `alert-warning` banner just below `mobile-i18n-bar`:
  - EN: "You're offline. Some things may not work right now."
  - ES: "Sin conexión. Algunas funciones están limitadas ahora."
- Cached content remains accessible; new content blocked

### Resume (returning to abandoned mid-flow)
- If patient previously abandoned an assessment mid-flow, dashboard shows a "Resume" task card on next visit; route restoration handled at the route level

---

## Accessibility Notes

- `<body lang="en">` or `lang="es"` updated on language toggle (for screen readers)
- `mobile-bottom-nav` is `<nav aria-label="Main navigation">` with each tab as `<button role="tab">` or `<a role="link">` with `aria-current="page"` on the active tab
- Tap targets: 44px minimum (48px for the bottom-nav for thumb-friendly hit zones; 56px-tall icons-and-label combined recommended)
- Each route's main content wrapped in `<main aria-label="<screen-name>">`
- `mobile-i18n-bar` toggle: `<button>` pair with `aria-pressed` reflecting state; `aria-label="English"` / `aria-label="Español"`
- Focus management: route changes move focus to the route's main heading (`<h1>`) for screen readers; visible focus ring on bottom-nav tabs
- Reduced motion: respect `prefers-reduced-motion` for tab transitions and any micro-animations
- Large-text mode: layout absorbs +200% font scaling without overlap
- Color independence: active tab uses weight bump + teal — both signals carry meaning; even at WCAG AA gray-blindness, weight conveys state

## Bilingual Considerations [REVISED]

- All shell-level strings defined as `data-i18n-en` / `data-i18n-es` pairs
- EN tab labels: "Dashboard" / "My Health" / "Messages" / "Care" / "Settings"
- ES tab labels: "Inicio" / "Mi Salud" / "Mensajes" / "Cuidado" / "Ajustes"
- Language toggle is the only i18n-bar control
- Tab layout is vertical (icon above label); at 320px / 5 tabs / 13.33px Semibold — "Mensajes" (longest at 8 chars) fits within ~64px tab width. Validate at first build.

---

## Brand Treatment (per `DESIGN.md`)

- Mobile shell at 430px max-width effectively floats inside the viewport at larger sizes (page floats per `DESIGN.md` §Voice rule)
- Surface roles: `mobile-app` body uses `bg-sand-100` (chrome ground); `mobile-shell` uses `bg-white` (card-like envelope)
- Typography: Lora display for headings (`<h1>` Heading/01 = 27.65px Lora Medium); Source Sans 3 body; Source Code Pro reserved for any tabular data
- Cena logo: appears in `mobile-i18n-bar` at left, small (~24×80px). Per `DESIGN.md`, "Cena Health logo appears in the nav header across every app and context."
- Ava avatar: **does NOT appear in the patient app.** Ava is the agent; patients don't see agent identity. The Cena logo is the only brand identity in patient chrome.

---

## Open Questions

- Persistent "Call your care team" affordance on Dashboard? Out of scope for the shell spec; flagged for the Dashboard wireframe pass.
- iOS PWA / native shell: PWA recommended at v1 (consistent code path); native is a future packaging concern, not a shell-design concern.

(5-tab decision confirmed at Gate 2 decision 10. Active-tab accent confirmed `interactive/accent-color` #418f82 per `DESIGN.md` brand-taste rule.) [REVISED]

---

## New Components Flagged

None. All shell-level components ship in PL: `mobile-shell`, `mobile-i18n-bar`, `mobile-i18n-toggle`, `mobile-bottom-nav`, `mobile-bottom-nav-tab`, `mobile-bottom-nav-badge`, `pb-safe-4`, `pb-safe-8`, `alert-error`, `alert-warning`, `skeleton`.
