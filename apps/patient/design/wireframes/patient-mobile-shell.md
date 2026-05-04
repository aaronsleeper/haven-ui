# PT-SHELL: Patient App Mobile Shell

**Application:** Patient App (Mobile)
**Use Case(s):** PT-SHELL-01 through PT-SHELL-06 (see `apps/patient/design/shell-use-cases.md`)
**User Type:** Patient
**Device:** Mobile-first (320–430px design width); desktop renders centered at 430px max-width
**Route:** All patient routes — this is the persistent shell wrapping every screen

This spec is the parallel mobile counterpart to `apps/care-coordinator/design/wireframes/cc-shell-layout.md`. Per Gate 1 G1.3 the patient mobile shell is authored alongside the coordinator desktop shell because mobile is the patient's reality.

---

## Page Purpose

The persistent mobile shell for every patient-facing screen. The patient interacts with one pane at a time on a phone — the universal three-pane abstraction collapses into a route-based single-pane model with a fixed bottom-nav for navigation and a fixed top i18n bar for language toggle.

The shell must:
1. Render brand-correct from first paint (Lora display + Source Sans 3 body)
2. Constrain content width to 430px max so larger screens don't break the design
3. Clear the iOS home indicator on sticky footers
4. Persist the EN/ES toggle across all screens
5. Persist the bottom-nav across all screens (tabs reflect current route)
6. NEVER expose agent activity — the patient's "thread" surface (Messages tab) renders a strict allowlist

---

## Layout Structure

### Shell wrapper

```
┌─────────────────────────────────┐  ← viewport (sand-100 bg outside shell)
│ ┌─────────────────────────────┐ │
│ │  mobile-i18n-bar (fixed top)│ │  ← EN/ES toggle, ~36px tall
│ ├─────────────────────────────┤ │
│ │                             │ │
│ │                             │ │
│ │   route content             │ │  ← scrollable, max-width 430px
│ │   (Dashboard / My Health /  │ │
│ │    Messages / Care /        │ │
│ │    Settings)                │ │
│ │                             │ │
│ │                             │ │
│ │                             │ │
│ ├─────────────────────────────┤ │
│ │  mobile-bottom-nav (fixed)  │ │  ← 5-tab nav, ~64px + safe area
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
        ← max-width: 430px →
```

### Components

- **`<body class="mobile-app bg-sand-100">`** — disables desktop ambient blobs, sets warm tan background outside the shell on larger screens
- **`<div class="mobile-shell">`** — inner wrapper, `block w-full max-w-[430px] mx-auto min-h-dvh bg-white relative`, the shell envelope where all content lives
- **`mobile-i18n-bar`** — fixed at top of `mobile-shell`, full-width, sand-100 bg, EN/ES toggle right-aligned. Partial: `src/partials/patient-i18n-bar.html`. JS: `src/scripts/components/i18n.js`
- **Route content area** — scrollable container; padding-top accounts for `mobile-i18n-bar`; padding-bottom accounts for `mobile-bottom-nav` + safe-area
- **`mobile-bottom-nav`** — fixed at bottom of `mobile-shell`, 5 tabs: Dashboard / My Health / Messages / Care / Settings. Active tab uses `.active` modifier. Shared partial: `src/partials/patient-bottom-nav.html`. Copy + set `.active` per screen.
- **Sticky footers (per-screen)** — when a screen needs a primary CTA at the bottom (e.g., assessment "Continue", consent "Sign"), use `pb-safe-4` or `pb-safe-8` to clear the iOS home indicator via `max(visual-floor, env(safe-area-inset-bottom))`

### Bottom-nav tabs

| Tab | Icon (FA Pro) | Route | Use case |
|---|---|---|---|
| Dashboard | `fa-house` | `/` | PT-DASHBOARD — today's task, message preview, next delivery |
| My Health | `fa-heart-pulse` | `/health` | PT-HEALTH — trend cards |
| Messages | `fa-message` | `/messages` | PT-MESSAGES — patient-side "thread" (notifications-only) |
| Care | `fa-stethoscope` | `/care` | PT-CARE — care plan, appointments (deferred detail) |
| Settings | `fa-gear` | `/settings` | PT-SETTINGS — language, notifications, accessibility |

Each tab: `mobile-bottom-nav-tab` semantic class. Active state via `.active`. Optional badge via `mobile-bottom-nav-badge` for unread message counts on Messages tab.

---

## Interaction Specifications

### Tab navigation
- **Trigger:** Tap a bottom-nav tab
- **Feedback:** Tab icon + label switch to active state (teal accent per DESIGN.md interactive)
- **Navigation:** Route changes; content area replaces; scroll position resets to top
- **Error handling:** If route fails to load, show `alert-error` inline at top of content area

### Language toggle
- **Trigger:** Tap EN or ES in `mobile-i18n-bar`
- **Feedback:** Active state moves; all visible strings re-render via `data-i18n-en` / `data-i18n-es`
- **Persistence:** Lang pref written to localStorage + user profile; survives session
- **Layout:** Spanish strings ~30% longer than English; layout already padded for max-length (see assessment + dashboard wireframes)

### Pull-to-refresh (optional, deferred)
- Native iOS/Android pull-to-refresh on Dashboard and Messages routes
- Out of scope at v1; flag for v1.1

### Push-notification deep link
- **Trigger:** Patient taps push notification (system-level)
- **Feedback:** App opens
- **Navigation:** Lands on Dashboard with the relevant task surfaced (recommended at v1; direct-to-task is a future optimization — see `shell-use-cases.md` open question 2)

### Swipe-nav (DEFERRED to v1.1)
- Per `ui-patterns.md` mobile model: swipe left = right-pane (Messages), swipe right = left-pane (alternative nav)
- v1 ships bottom-nav only; swipe-nav is the universal-shell vision but defers behind tab-nav for v1
- Document here so the v1.1 plan inherits the spec

---

## States

### Default (any route)
- `mobile-i18n-bar` visible at top
- Route content scrolls
- `mobile-bottom-nav` visible at bottom; active tab corresponds to current route

### Loading
- Route content area shows `skeleton` placeholders matching the target screen's layout
- `mobile-i18n-bar` and `mobile-bottom-nav` stay rendered (no full-screen blank flash)

### Empty (route-specific)
- Dashboard with no task: warm copy ("Nothing to do today. Enjoy your day, Maria." / "Nada que hacer hoy. Disfrute su día, María.") + illustration
- My Health with no data: empty state per assess-01 wireframe ("Your progress will show up here" / "Su progreso aparecerá aquí")
- Messages with no messages: empty state ("No messages yet" / "Sin mensajes aún")

### Error
- `alert-error` at top of content area with retry CTA
- `mobile-i18n-bar` + `mobile-bottom-nav` remain functional

### Offline
- Sticky `alert-warning` banner just below `mobile-i18n-bar`: "You're offline. Some features may be limited." / "Sin conexión. Algunas funciones están limitadas."
- Cached content remains accessible; new content blocked

---

## Accessibility Notes

- `<body>` has `lang="en"` or `lang="es"` updated when language toggles (for screen readers)
- `mobile-bottom-nav` is `<nav aria-label="Main">` with each tab as `<a role="link">` or `<button>`; active tab has `aria-current="page"`
- Tap targets: 44px minimum (48px on the bottom-nav for thumb-friendly hit zones)
- Each route's main content is wrapped in `<main aria-label="<screen-name>">`
- `mobile-i18n-bar` toggle is a `<button>` pair or radio pattern with `aria-pressed` reflecting state
- Focus management: route changes move focus to the route's main heading (`<h1>`) for screen readers; visible focus ring on bottom-nav tabs
- Reduced motion: respect `prefers-reduced-motion` for tab transitions and any micro-animations
- Large-text mode: layout absorbs +200% font scaling without overlap

---

## Bilingual Considerations

- All shell-level strings (tab labels, toggle, system messages) defined in `data-i18n-en` / `data-i18n-es`
- Spanish tab labels: "Inicio" / "Mi Salud" / "Mensajes" / "Cuidado" / "Ajustes"
- "Care" → "Cuidado" is concise; if a partner team prefers "Mi atención médica" later, that's a string update only
- Language toggle is the only i18n-bar control; do NOT add other affordances (settings, profile) here — keeps cognitive load minimal

---

## Brand Treatment (per DESIGN.md)

- **Page floats:** the mobile shell at 430px max-width effectively floats inside the viewport at larger sizes; on phones it fills width and `bg-sand-100` is unseen
- **Surface roles:** `mobile-app` body uses `bg-sand-100` (chrome ground); `mobile-shell` uses `bg-white` (card-like surface); within content, panes layer translucent white per pattern. (Note: at v1 the patient mobile shell uses solid white inside the shell envelope rather than translucent — consistent with shipped patient app; revisit if brand-fidelity expert flags during Gate 2.)
- **Typography:** Lora display for headings (`<h1>` Heading/01 = 27.65px Lora Medium); Source Sans 3 body; Source Code Pro reserved for any tabular data
- **Cena logo:** appears in the `mobile-i18n-bar` at left; small (~24×80px). Per DESIGN.md, "Cena Health logo appears in the nav header across every app and context. It never changes based on persona."
- **Ava avatar:** does NOT appear in the patient app — Ava is the agent; patients don't see agent identity. The Cena logo is the only brand identity in the patient app's chrome.

---

## New Components Flagged

All required components are already in the pattern library:
- `mobile-shell` (shipped — `layout-mobile-shell.html`)
- `mobile-i18n-bar` (shipped — `layout-mobile-i18n-bar.html`)
- `mobile-bottom-nav` (shipped — `layout-mobile-bottom-nav.html`)
- `pb-safe-4` / `pb-safe-8` utilities (shipped)

**No new shell-level components needed.** The Messages route requires composing the existing `thread-panel` with a strict patient allowlist — not a new component, a configuration of an existing one.

---

## Open Questions

- Does the bottom-nav need the **Care** tab at v1, or should it be 4 tabs (Dashboard / My Health / Messages / Settings) with Care content folded into Dashboard? Recommend keeping 5 tabs; care plan + appointments are conceptually distinct from "today's task" and the shell should accommodate growth without a redesign.
- Should the Dashboard show a persistent "AVA call" entry point (e.g., "Call your care team now")? Out of scope for the shell spec; flag for the Dashboard wireframe pass.
- Does the iOS PWA / native shell wrap this same `mobile-shell`, or do native wrappers replace it? PWA recommended at v1 (consistent code path); native is a future packaging concern, not a shell-design concern.

---

## References

- `apps/patient/design/shell-use-cases.md` — patient shell use cases this wireframe implements
- `apps/patient/design/new-components/mobile-shell.md` — original mobile-shell component spec
- `apps/patient/design/new-components/mobile-bottom-nav.md` — bottom-nav component spec
- `apps/patient/design/new-components/mobile-i18n-bar.md` — i18n bar component spec
- `packages/design-system/pattern-library/components/layout-mobile-shell.html` — pattern-library entry
- `apps/_shared/design/universal-shell-use-cases.md` — universal shell parent doc
- `DESIGN.md` §Composition patterns — canonical shell + responsive collapse
- `planning/architecture/ui-patterns.md` §Mobile behavior — universal-shell mobile model
