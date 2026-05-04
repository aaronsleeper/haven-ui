# Slice Manifest — pt-shell-and-routes: Patient Universal Shell + v1 Routes

**Target app:** `apps/patient`
**Primary wireframe(s):**
- `apps/patient/design/wireframes/pt-shell-flow.md`
- `apps/patient/design/wireframes/shell-pt-mobile.md`
- `apps/patient/design/wireframes/pt-01-dashboard.md`
- `apps/patient/design/wireframes/pt-02-messages.md`
- `apps/patient/design/wireframes/pt-03-settings.md`
- `apps/patient/design/wireframes/pt-04-my-health.md`
- `apps/patient/design/wireframes/pt-05-care.md`
**Commit:** [sha pending — to be filled after slice commit]
**Stage:** Stage 4 (dev-tasker) output → ready for Stage 5 (build)
**Tier:** Tier 2 — Slice composition (zero PL gaps confirmed at Stage 3)

---

## In scope (ships in this slice)

### Shell: `shell-pt-mobile` (persistent)
- `mobile-i18n-bar` — fixed top bar with Cena logo + EN/ES toggle — `apps/patient/src/components/I18nBar.tsx`
- `mobile-i18n-toggle` — EN/ES button pair with `aria-pressed` — inside `I18nBar.tsx`
- `mobile-bottom-nav` — fixed bottom 5-tab nav — `apps/patient/src/components/BottomNav.tsx`
- `mobile-bottom-nav-tab` — 5 tabs: Dashboard / My Health / Messages / Care / Settings — inside `BottomNav.tsx`
- `mobile-bottom-nav-badge` — unread count badge on Messages tab — inside `BottomNav.tsx`
- `pb-safe-4` / `pb-safe-8` — iOS home indicator clearance on sticky surfaces — task 08/09
- Language preference hook (`useLanguage`) — `apps/patient/src/lib/useLanguage.ts`
- Online status hook (`useOnlineStatus`) — `apps/patient/src/lib/useOnlineStatus.ts`
- Offline banner (`alert alert-warning`) — `apps/patient/src/components/OfflineBanner.tsx`
- Shell-level offline state — wired in `App.tsx` (task 09)
- `App.tsx` route wiring for all 5 routes + retained assessment flows — task 08

### Route: pt-01-dashboard (`/`)
- `<h1>` greeting — Heading/01 Lora Medium — `apps/patient/src/screens/dashboard/index.tsx`
- Greeting subline — 3 template variants (action-recent / action-none-warm / time-of-day-fallback) EN/ES
- `task-card` — today's task card (links to `/assessment/gad-7`) — using `TaskCard` from `@haven/ui-react`
- Message preview card — `card` + `card-body` with `message-new-pill` + `text-link` "View" → `/messages`
- `delivery-status-card` — demo "On the way" state (3-state component: preparing/delivering/delivered)
- `data-empty-state` — empty state when no task/message/delivery: **deferred to post-build** (demo always shows data state)
- Dashboard error state (`alert-error` + retry CTA): **deferred** (per-route error states are v1.1 polish)
- Loading skeleton state: **deferred** (per task scope constraint)

### Route: pt-02-messages (`/messages`)
- `<h1>` page header EN/ES
- Message list with `role="log"` + `aria-live="polite"` — `apps/patient/src/screens/messages/index.tsx`
- `message-bubble-in` — incoming coordinator message — `article` with `message-sender-label` + body
- `message-bubble-out` — patient outgoing reply — right-aligned
- `message-timestamp` — `<time datetime>` ISO 8601 on all messages
- `notif-item` + `notif-item-icon-info` — system notification (inline, not bubble)
- `message-new-pill` — unread indicator on incoming message
- Reply composer — collapsed row + expanded textarea + `btn-primary` "Send" + `btn-ghost` "Cancel"
- `pb-safe-4` — iOS clearance on sticky reply bar
- Client-backstop allowlist filter (ALLOWED_TYPES) — HIPAA defense-in-depth documented in code
- Worked-example demo messages (3 items: 1 in / 1 out / 1 notif)

### Route: pt-03-settings (`/settings`)
- `<h1>` page header EN/ES
- Language card: `card` + `segmented-control` (English / Español) wired to `useLanguage()` — `apps/patient/src/screens/settings/index.tsx`
- Notifications card: `card` + `toggle-group` with 3 `toggle toggle-success` rows (Push / Delivery / Check-in)
- Account card: `card` + `kv-table` (Name / Email / Phone, read-only) + `divider` + `btn-outline btn-block` Sign out
- Sign-out confirm dialog — state-controlled inline overlay using `hs-overlay-backdrop` + `modal-panel` + `card`
- Footer (app version + privacy/terms placeholder text)
- Helper Body/04 text + `text-link` "Open Messages" → `/messages`

### Route: pt-04-my-health (`/health`)
- `<h1>` page header EN/ES
- 3× `trend-card` blocks (Mood / Energy / Meal Satisfaction) — `apps/patient/src/screens/health/index.tsx`
- `trend-card-header` + `trend-card-chart` per card
- `trend-badge trend-improving` / `trend-badge trend-flat` / `trend-badge trend-worsening` per metric
- Chart.js sparkline placeholder (`chart-sparkline` container with `// TODO v1.1` comment)
- Each card links to the relevant assessment flow

### Route: pt-05-care (`/care`)
- `<h1>` page header EN/ES
- Care plan card: `card` + 3 patient-friendly goal bullets (EN/ES) — `apps/patient/src/screens/care/index.tsx`
- Upcoming appointments card: `card` + `list-group list-group-flush` + 1 demo appointment row
- Recent deliveries card: `card` + `list-group list-group-flush` + 2 demo delivery rows with `badge-success badge-pill`
- Footer helper + `text-link` "Open Messages"

---

## Deferred (explicitly not in this slice, tracked for later)

Walk of each wireframe section-by-section:

### shell-pt-mobile

- **Pull-to-refresh** — reason: deferred to v1.1 per Gate 2-prep decision 9 — tracked as: v1.1 roadmap
- **Swipe-nav between routes** — reason: deferred to v1.1 per Gate 2-prep decision 9 (bottom-nav only at v1) — tracked as: v1.1 roadmap
- **Desktop-specific layout adaptations** beyond 430px centering — reason: mobile-first; `mobile-shell` handles desktop by centering at 430px — tracked as: n/a (by design)
- **Resume (assessment abandoned mid-flow) visual indicator** — reason: assess-04 shows `task-card-in-progress`; the Dashboard route will show it when the hook is wired to real state — tracked as: next-slice item (API integration)
- **Push-notification deep link to specific task** — reason: v1 lands on dashboard (Gate 2 decision 7); direct-to-task is v1.1 — tracked as: v1.1 roadmap
- **Loading skeleton (full-screen flash prevention)** — reason: per-route loading skeletons deferred; shell stays rendered; good enough at demo stage — tracked as: next-slice item (API integration)
- **Accessibility: focus management on route change** (move focus to `<h1>` for screen reader) — reason: React Router does not auto-focus on navigate; requires a `useEffect` hook with a ref on each `<h1>` — tracked as: next-slice item (a11y polish)

### pt-01-dashboard

- **Empty state** (`data-empty-state` with `fa-mug-hot`) — reason: demo shows data state; empty state renders when API returns empty — tracked as: next-slice item (API integration)
- **Dashboard error state** (`alert-error` + retry CTA) — reason: deferred to API integration pass — tracked as: next-slice item
- **Loading skeletons** (3 `skeleton` card-shaped placeholders) — reason: deferred to API integration — tracked as: next-slice item
- **Delivery card tap behavior** — reason: inline at v1 (confirmed); deeper routing to care deferred to v1.1 — tracked as: v1.1 roadmap
- **Greeting personalization by real data** (action-recent variant picks from real patient activity log) — reason: hardcoded demo state; real API integration deferred — tracked as: next-slice item

### pt-02-messages

- **Server-side allowlist filtering** — reason: this is a backend concern; client backstop is implemented; server-side is a separate backend task — tracked as: backend next-slice item (P0 HIPAA gate)
- **Mark-read on tap API call** — reason: v1 demo is static; real mark-read requires messages API — tracked as: next-slice item
- **`message-date-sep`** (day separator between dates) — reason: demo messages are all same day; separator logic requires grouping — tracked as: next-slice item
- **Empty state** (`data-empty-state` with `fa-envelope-open`) — reason: demo has messages; empty state deferred to API integration — tracked as: next-slice item
- **Loading skeletons** (3-4 skeleton rows) — reason: deferred to API integration — tracked as: next-slice item
- **Send-failed error banner** — reason: v1 logs to console; real error handling deferred to API integration — tracked as: next-slice item
- **`message-new-pill` dismiss on tap** — reason: v1 is static demo; dismiss requires state update + mark-read API — tracked as: next-slice item
- **Typing indicators** — reason: real-time presence deferred to v1.1 — tracked as: v1.1 roadmap
- **Image attachments** — reason: text-only at v1 per spec — tracked as: v1.1 roadmap
- **Unread count badge from API** — reason: hardcoded as 1 in App.tsx; real count from messages API — tracked as: next-slice item

### pt-03-settings

- **Notification toggle pref-save error** (inline `alert-error` + revert) — reason: v1 logs toggle change; real API persistence deferred — tracked as: next-slice item
- **Real sign-out** (clear session + route to login) — reason: v1 logs to console; auth integration deferred — tracked as: next-slice item
- **Loading skeletons** (3 `skeleton` cards) — reason: deferred to API integration — tracked as: next-slice item
- **Error state for settings load failure** — reason: deferred — tracked as: next-slice item
- **Privacy + Terms real URLs** — reason: pending legal team confirmation — tracked as: open question for Aaron / legal

### pt-04-my-health

- **Chart.js sparkline initialization** — reason: Chart.js not in React app's package.json; deferred to v1.1 with `// TODO` comment — tracked as: v1.1 roadmap item
- **Trend card tap → assess-05-metric-detail** — reason: assess-05 is a future wireframe pass; routes to existing assessment entry instead — tracked as: next-slice item (assess-05 wireframe)
- **Empty state** (no trend data) — reason: demo has data; empty state deferred to API integration — tracked as: next-slice item

### pt-05-care

- **"Details" `text-link` on appointment rows** — reason: per-appointment detail screen deferred to v1.1 — tracked as: v1.1 roadmap
- **"Details" link on delivery rows** — reason: per-delivery detail screen deferred to v1.1 — tracked as: v1.1 roadmap
- **Care plan goals from API** (agent-generated in patient's language pref) — reason: hardcoded demo goals; real API integration deferred — tracked as: next-slice item
- **Full empty state** (`data-empty-state` "We're getting your plan ready") — reason: demo has data; empty state deferred to API integration — tracked as: next-slice item
- **Loading skeletons** — reason: deferred to API integration — tracked as: next-slice item
- **Error state** — reason: deferred — tracked as: next-slice item

### Accessibility deferred (cross-screen)

- **Route-change focus management** — `useEffect` + ref to move focus to `<h1>` on navigate — tracked as: next-slice a11y item
- **`prefers-reduced-motion` media query** on tab transitions and press animations — tracked as: next-slice a11y item
- **Large-text mode validation** (+200% font scaling) — tracked as: QA pass before launch

---

## Workflow gates applied

- ui-react-porter preconditions met for every ported component: yes (Tier 2 slice composition; all components already in `@haven/ui-react`; no new ports required)
- app-composer utility-soup rejection clean: yes — semantic classes used throughout; only permitted layout utilities (p-4, space-y-4, flex, grid) appear inline
- Post-slice expert review dispatched (ux-design-lead, design-system-steward, accessibility): pending — dispatch after build verification (Task 10) passes

---

## Known gaps at slice-end

- Chart.js sparkline initialization in `/health` route — severity: should-fix (v1.1 iteration)
- Per-route error states and loading skeletons — severity: should-fix (API integration pass)
- Server-side allowlist for pt-02-messages — severity: **blocker** (P0 HIPAA; must ship before production; marked in code; backend task)
- 320px viewport tab label validation — severity: should-fix (validate at first build in Task 10)
- Real authentication for sign-out in `/settings` — severity: should-fix (auth integration pass)

---

## Round N expert verdict (pending — appended after each review round)

*Expert verdicts to be appended here after post-build dispatch.*

### Pre-build check retrospective (per round)

*To be completed after first expert review round.*
