# pt-01-dashboard: Patient Dashboard

**Application:** Patient App
**Use Case(s):** PT-SHELL-01 (`apps/patient/design/shell-use-cases.md`)
**User Type:** Patient (Maria Rivera)
**Device:** Mobile (320-430px); desktop renders centered at 430px max-width
**Route:** `/`

The Dashboard is Maria's first surface every visit — what she should do today, recent message preview, next delivery countdown. Surfaces today's task without scrolling. Welcome copy is warm + specific ("Welcome back, Maria"), not generic.

---

## Page Purpose

Maria opens the app or taps a push notification. She sees, in order: a warm greeting, today's task card if any, the most recent message preview if any, and the next delivery countdown if any. Tapping any card takes her to the relevant flow. If nothing is needed, the dashboard says so positively ("Nothing to do today. Enjoy your day, Maria.").

---

## Layout Structure

### Shell

`shell-pt-mobile`. Active bottom-nav tab: Dashboard (`fa-house`).

### Header Zone

- **Component:** Greeting at the top of the route content area
- Heading (`<h1>`): Heading/01 27.65px Lora Medium — "Welcome back, Maria" / "Bienvenida, María"
- Subheading: Body/03 muted — three template variants chosen at render time per data availability: [REVISED]
  1. Action-recent EN: "It's a sunny Tuesday. You logged your weight this morning — great job."
     ES: "Es un martes soleado. Pesó esta mañana — ¡buen trabajo!"
  2. Action-none-warm EN: "Hope you're having a good morning." / ES: "Esperamos que esté teniendo un buen día."
  3. Time-of-day-fallback EN: "Good morning, Maria." / ES: "Buenos días, María." (or afternoon/evening variant)
- Surface: solid white inside `mobile-shell`; greeting block padded `p-4`

### Content Zone

#### Today's task card (when present)
- **Component:** `task-card` (shipped — `<TaskCard />`)
- Variant: `task-card-overdue` (left warning border + badge) if past-due, `task-card-in-progress` (left teal border) if mid-flow, `task-card` (default) if new
- Icon: `task-card-icon` with FA glyph based on task type (`fa-clipboard-list` for assessment, `fa-utensils` for meal feedback)
- Content: `task-card-name` Body/02 Semibold + `task-card-meta` Body/04 muted (time estimate, due date)
- Tappable row entire; 56px+ tall

Section heading above the card: Heading/04 16px Lora Medium — EN "Today's check-in" / ES "Su revisión de hoy" [REVISED]

#### Recent coordinator message preview (when present)
- **Component:** `card` with `card-body`
- Message preview: incoming bubble lite — sender label "Maria's coordinator · Sarah K." + body Body/03 (truncated to 2 lines with `…`)
- Trailing: `text-link` "View" / "Ver" — taps through to `/messages`
- New-message indicator: `message-new-pill` if unread

Section heading above: Heading/04 — EN "Recent message" / ES "Mensaje reciente" [REVISED]

#### Next delivery countdown (when present)
- **Component:** `delivery-status-card` (shipped — three states: preparing / delivering / delivered)
- Auto-renders state per delivery progression
- Tap → `/care` for full delivery details (or stays inline at v1)

#### Empty state (when nothing to surface) [REVISED]
- **Component:** `data-empty-state`
- Icon: `fa-mug-hot` (regular) in sand-200, 64px (warm/calm icon, not a clinical check)
- Heading EN: "Nothing to do today" / ES: "Nada que hacer hoy"
- Message EN: "Enjoy your day, Maria. We'll let you know when there's something new."
- Message ES: "Disfrute su día, María. Le avisaremos cuando haya algo nuevo."
- No CTA — the empty state is the win

### Footer Zone

No sticky footer. `mobile-bottom-nav` is the persistent footer (shell-level).

---

## Interaction Specifications

### Tap today's task card
- **Trigger:** Tap anywhere on `task-card`
- **Feedback:** Card briefly inverts (subtle press animation respecting `prefers-reduced-motion`)
- **Navigation:** Routes to assessment flow (assess-02-assessment-intro for new) or assess-03-question for resume
- **Error handling:** Network failure → return to dashboard with `alert-error` inline at top of content area

### Tap recent message preview
- **Trigger:** Tap the message card or "View" link
- **Feedback:** Card briefly inverts
- **Navigation:** Routes to `/messages` (pt-02-messages); message expands as default open
- **Error handling:** Failure → return to dashboard with retry option

### Tap delivery card
- **Trigger:** Tap `delivery-status-card`
- **Feedback:** Card press
- **Navigation:** Routes to delivery detail (deferred to later wireframe pass; v1 may stay inline on dashboard)
- **Error handling:** Falls back to inline expand at v1

### Tap EN/ES toggle (shell-level — covered in shell wireframe)
- All visible strings re-render in target language; layout absorbs Spanish ~30% longer

### Tap any bottom-nav tab (shell-level)
- Routes change per shell-pt-mobile spec

---

## States

### Default (loaded with task + message + delivery)
- Greeting at top
- Today's task card
- Recent message preview
- Next delivery countdown
- Three sections stacked vertically, each padded `p-4`

### Default (loaded with empty surfaces)
- Greeting at top
- `data-empty-state` filling the remaining content area
- Bottom-nav remains active

### Loading
- Greeting renders immediately (cached patient name)
- Below greeting: 3 `skeleton` `card`-shaped placeholders (task / message / delivery) with `skeleton-text` lines

### Empty (mid-loaded, no data after fetch)
- Greeting renders
- `data-empty-state` fills below

### Error [REVISED]
- Greeting renders
- Below greeting: `alert-error` with retry CTA "Try again" / "Intentar de nuevo"
  - EN: "We're having trouble loading your dashboard. Tap to try again."
  - ES: "No podemos cargar su tablero. Toque para intentar de nuevo."

### Resume (assessment abandoned mid-flow)
- Today's task card shows `task-card-in-progress` variant — left teal border + "Continue" badge
- Tapping resumes at the last-answered question

### Push-notification deep link
- Same as Default but with the relevant task auto-scrolled into view if below the fold (rare at 430px width — usually visible)

---

## Accessibility Notes

- `<main aria-label="Dashboard">` wraps the content
- `<h1>` greeting receives focus on route entry for screen reader announcement
- `task-card` is a `<button>` (or `<a>` if it routes); 56px+ tap target
- Message preview card is a `<button>` or `<a>` with `aria-label` describing the unread state if applicable ("Unread message from Sarah K.")
- Color-as-status: delivery-status-card states (preparing / delivering / delivered) carry icon + label + color — never color alone
- Reduced motion respected for press animations
- Large-text mode: stack adapts to wrapping; cards remain readable at +200% scaling

## Bilingual Considerations [REVISED]

- All visible strings: `data-i18n-en` / `data-i18n-es`
- Greeting personalization: name renders raw (no i18n needed for patient's own name)
- Subheading variants resolved inline above (action-recent / action-none-warm / time-of-day-fallback) — three EN/ES pairs.
- Spanish copy ~30% longer than English; greeting block padded enough to absorb wrap
- Date / time formatting: locale-aware via `Intl.DateTimeFormat` — EN: "Tuesday, May 3"; ES: "Martes, 3 de mayo"

## Open Questions

- Greeting at the top vs. greeting embedded in the empty-state copy: when no task/message/delivery, do we still show the dedicated greeting block, or does the empty state's heading carry the greeting? Recommend dedicated greeting always — it's the warmth signal regardless of task state.
- Time-of-day subheading: morning / afternoon / evening variants vs. one neutral subheading? Recommend three variants — feels human; small effort.
- Tap on delivery card v1: route to detail view OR stay inline expand? Inline at v1 is simpler; deferred routing to v1.1.

---

## New Components Flagged

None. All primitives shipped: `task-card` (with overdue / in-progress / completed variants), `card`, `card-body`, `delivery-status-card`, `data-empty-state`, `text-link`, `message-new-pill`, `alert-error`, `btn-outline`, `btn-sm`, `skeleton`, `skeleton-text`.
