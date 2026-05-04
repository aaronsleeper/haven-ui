# Universal App Shell — Use Cases, Functional Spec, IA

**Feature:** Universal application shell + per-app shaping minimums
**Source:** Discovery sweep 2026-05-03 (haven-ui-universal-app-shell plan); `planning/architecture/ui-patterns.md`; `planning/vision.md`; `DESIGN.md`; `layout-agentic-shell.html`; `Knowledge/Projects/Cena Health/Ava Architecture Overview.md`
**Personas:** Care Coordinator, Patient, Kitchen Staff, Provider (RDN)
**Device:** Desktop primary (coordinator/kitchen/provider); mobile primary (patient)
**Status:** Phase 1–3 complete; Gate 1 ready
**Locked decisions (do not re-litigate):** G1.1 (rich agentic-shell base), G1.2 (per-app minimums), G1.3 (patient mobile shell authored now)

---

## Phase 1: Discovery

### Convergent shell behaviors (from `ui-patterns.md`)

The universal shell is one structural pattern adapted across surfaces. Pane *content* varies; the structure does not.

- Three panes: left (navigation/queue), center (content), right (thread/activity)
- The thread is contextual to whatever is open in the center
- Approval cards live in the right pane, not as modals
- Empty queue is a good state, not an error state ("Nothing needs your attention right now")
- Failure is always visible — no silent dead-ends; failures land in a named human queue
- Resizable panes (left and right boundaries) on desktop; persisted per-user
- Mobile collapses to single-pane swipe-nav; center is default; right swipes from right; left swipes from left
- Cena logo in nav header is constant across all apps
- Ava avatar appears only when the agent is doing something or has authored content; never as app chrome

### Personas involved (shell-level)

The shell serves four primary personas plus secondary roles. Each interacts with the same three-pane structure but with different content expectations and capability limits.

#### Care Coordinator (Sarah)
- Manages 60-patient panel; daily workflow is queue-driven
- Primary mode: review-and-approve agent recommendations
- Sees the full agent activity thread (it is the audit record)
- Approves, edits, rejects, or reassigns queue items
- Desktop primary; tablet acceptable; mobile rare (approval card is the primary mobile interaction when it happens)

#### Patient (Maria Rivera)
- Chronic conditions, variable tech literacy, often elderly, mobile-first, bilingual EN/ES
- 5th grade reading level for all patient-facing copy
- Does NOT see agent activity thread; the patient-facing thread is notifications + coordinator messages only
- Primary mode: respond to prompts (assessments, check-ins, feedback) and view own progress
- Mobile primary; desktop is acceptable but not the design center

#### Kitchen Staff (Carlos)
- Lead cook at partnered kitchen; physical-work role; not at a computer continuously
- Most restricted PHI access — sees what to make, where to deliver, allergen flags only
- Primary mode: status progression — pending → prepping → packed → quality_checked → dispatched → delivered
- Desktop primary (workstation in kitchen); tablet realistic; mobile occasional
- The Kitchen App data scope is structurally different from Admin/Provider — not a permission toggle

#### Provider — RDN (Dr. Soto)
- Clinical lead for nutrition; signs the nutrition section of every care plan
- Reviews agent-drafted SOAP notes before signing
- Sees a clinical queue: care plan nutrition reviews, lab flags, MNT visit documentation, recipe nutritional validation
- Primary mode: clinical review + signature; the thread carries clinical context and rationale
- Desktop primary

### User goals per persona (shell-level only)

| Persona | Goal | Frequency | Priority |
|---|---|---|---|
| Coordinator | Open the app and immediately know what needs my attention today | Daily, first action | Highest |
| Coordinator | Move from queue item to record to decision in 2 taps | Per item, many times daily | Highest |
| Coordinator | See the full activity thread for the record I'm working on without leaving context | Per item | Highest |
| Patient | See my next health task and complete it on my phone | 1–3x per week | Highest |
| Patient | View my own progress and feel a sense of momentum | 1–2x per week | High |
| Patient | Read a message from my care coordinator without confusion | Occasional | Medium |
| Kitchen | Open the app and see today's order load and any allergen alerts at a glance | Daily, start of shift | Highest |
| Kitchen | Move an order through prep → pack → quality check → dispatch with one tap each | Per order, 40+/day | Highest |
| Kitchen | Mark a delivery confirmation or flag a missed delivery without navigating | Per delivery | High |
| Provider (RDN) | Open my clinical queue and see what needs signature this morning | Daily | Highest |
| Provider (RDN) | Review the nutrition section of a care plan with the agent's draft + my edit room | Per care plan | Highest |
| Provider (RDN) | Sign clinical documentation knowing the audit trail is intact | Per visit | Highest |

### Use cases (shell-level — apply to all four apps)

#### UC-SHELL-01: Open app and orient
- **Precondition:** User is authenticated. Agent has been running.
- **Trigger:** User loads the app.
- **Flow:**
  1. Shell renders three panes immediately (no flash; brand fonts already linked)
  2. Left pane shows role-specific entry surface — coordinator queue, patient task list, kitchen order load, provider clinical queue
  3. Center pane shows a role-specific orientation surface — coordinator morning summary, patient dashboard, kitchen daily summary, provider caseload overview
  4. Right pane shows empty-state copy if no record is selected — "Pick a [queue item / task / order / patient] to start"
- **Outcome:** User can read the room in 2–3 seconds.

#### UC-SHELL-02: Navigate to a record + load contextual thread
- **Precondition:** Left pane has at least one selectable item.
- **Trigger:** User clicks/taps a left-pane item.
- **Flow:**
  1. Left pane highlights the selected item (active state)
  2. Center pane loads the relevant record/content
  3. Right pane loads the thread/activity contextual to that record
  4. For patient, right pane shows notifications-only context — never agent activity
- **Outcome:** Single navigation gesture brings the full context to the user.

#### UC-SHELL-03: Resize panes (desktop)
- **Precondition:** User is on desktop ≥960px.
- **Trigger:** User drags a panel splitter handle.
- **Flow:**
  1. Pane width updates live during drag, clamped to per-pane min/max
  2. Center pane never compresses below its floor (480px / 560 comfortable)
  3. New width persists per-user (not per-device)
- **Outcome:** User shapes the workspace to their preference.

#### UC-SHELL-04: Resize / collapse responsively
- **Precondition:** Viewport changes (window resize, device orientation).
- **Trigger:** Viewport crosses a breakpoint.
- **Flow per Material 3 + Fluent 2 thresholds:**
  - ≥1240px: 260 expanded nav, flex chat, 640 visible right
  - 960–1239px: 260 expanded nav, flex chat, 480 collapsible right
  - 720–959px: 80 icon-rail nav, flex chat, right pane becomes inspector sheet on demand
  - <720px: hamburger sheet for nav, full-width center, right is full-screen sheet on demand
  - Patient app override: <720px is the design center; swipe-nav between left/center/right
- **Outcome:** Layout adapts; center chat is the product and never collapses.

#### UC-SHELL-05: Approval / decision in thread (coordinator + provider)
- **Precondition:** A queue item has been opened.
- **Trigger:** Approval card appears in the right pane.
- **Flow:**
  1. Approval card shows: what the agent did, what it recommends, downstream effects
  2. Action buttons: Approve / Edit first / Reject + note / Reassign
  3. User decides; decision is logged in the thread with timestamp + actor
  4. Card collapses to a one-line summary `[Sarah K.] Approved with edits — sodium target reduced to 1800mg · 9:47am`
  5. Queue item resolves; left pane decrements
- **Outcome:** Decision and audit are the same artifact.

#### UC-SHELL-06: Direct the agent via thread (coordinator + provider)
- **Precondition:** A record is open in the center pane.
- **Trigger:** User types in the thread input.
- **Flow:**
  1. User types a natural-language request (e.g., "Check secondary insurance")
  2. Agent runs the requested action; tool call + result appear in the thread
  3. User uses the new info to make a decision
- **Outcome:** Information arrives without navigating away.

#### UC-SHELL-07: Patient receives + acts on a notification
- **Precondition:** Coordinator or system has produced a notification for this patient.
- **Trigger:** Patient opens app or taps push notification.
- **Flow:**
  1. Patient lands on dashboard (center) with the active notification surfaced
  2. Right pane is the notifications-only thread surface — past messages from coordinator, system reminders
  3. Tap the notification → relevant flow (assessment, message, delivery confirmation)
- **Outcome:** Patient acts on the prompt; never sees agent internals.

#### UC-SHELL-08: Kitchen progresses an order through statuses
- **Precondition:** Order is in `pending`.
- **Trigger:** Kitchen taps the order in the left pane.
- **Flow:**
  1. Center pane shows the open order with packing slip
  2. Right pane shows the order thread (status events, allergen flags, delivery context)
  3. Each status transition is a tap (`prepping` → `packed` → `quality_checked` → `dispatched`)
  4. Status events are logged in the order thread
- **Outcome:** Day's progress is felt as physical progression in the UI.

#### UC-SHELL-09: Failure surfaces visibly
- **Precondition:** A workflow step failed (agent error, missed delivery, eligibility unclear).
- **Trigger:** Failure event lands in the relevant queue.
- **Flow:**
  1. Left pane shows the failed item with what failed and what's needed
  2. Center pane loads the record; right pane loads the thread including the failure event
  3. User decides: retry, override, escalate, contact patient
- **Outcome:** No patient is stuck with no one responsible.

### Constraints (apply to all four apps)

| Constraint | Impact |
|---|---|
| **HIPAA — PHI handling** | Tool calls in thread show field names + value summaries only, never raw SSN / full medical history. Kitchen sees first-name + last-initial on packing slips. Each app queries a different data scope structurally. |
| **WCAG 2.1 AA** | 44px minimum touch targets, contrast pairs, focus management, screen-reader landmarks (`<aside aria-label>`, `<main>`). No focus trapping in the persistent shell — only inside modals. |
| **Bilingual EN/ES (patient + AVA)** | All patient-facing copy supports both languages without layout breaking. Spanish strings can run ~30% longer than English; pad layouts accordingly. Coordinator/provider/kitchen apps are EN-only at v1. |
| **Reading level (patient)** | 5th grade reading level for all patient-facing copy. Plain-language gate in CI. |
| **Brand fonts (all apps)** | Lora (display) + Source Sans 3 (body) + Source Code Pro (mono). Required `<link>` block in `index.html` per app. `conform:brand-fonts` blocks commits without it. |
| **Brand surface palette** | `sand-50` page background (never pure white); `sand-100` chrome ground; translucent white `rgba(255,255,255,0.6)` panes; solid white card primitives. |
| **Agent identity scope** | Ava avatar (gradient sphere) appears in chat-pane header (44px), as message-leading dot on Ava-authored messages, and as agent-action citation. NOT in nav header (Cena logo only), NOT in app branding. |
| **Patient agent-activity hiding** | Patient app's right pane is notifications-only. No `tool_call`, no `tool_result`, no agent activity rendering. The same `thread-panel` component renders a different message-type allowlist per app. |
| **Performance** | Queue (left) loads ≤2s for up to 100 items. Thread loads ≤1s. Resize is 60fps. |
| **Resize state persistence** | Per-user, not per-device — coordinator keeps their layout when they switch from office desktop to home laptop. |

### Research findings

- **Material 3 Navigation Rail + Drawer specs** — informed the 80px / 260px nav widths and the 720px / 960px / 1240px breakpoints
- **Apple HIG Sidebars** — split-view conventions; persistent left rail expected on desktop
- **IBM Carbon + Fluent 2 Drawer S/M/L tier** — supports the 480/640/800 right-pane band
- **NN/G + Baymard line-length research** — 480px center floor; 560px comfortable; below 480 reading degrades sharply
- **NN/G healthcare patient portals** — bilingual labels, plain language, large tap targets reduce drop-off in chronic-care populations
- **WCAG 2.1.2 (No Keyboard Trap, Level A)** — focus must be able to leave any pane; trapping is only correct inside modal dialogs
- **WCAG 1.4.10 reflow** — content reflows down to 320px without horizontal scrolling; the patient mobile shell at 430px max-width respects this with margin
- **ePRO completion research** — ≤5-question micro-surveys complete at 90%+; >20 questions drop below 60%

---

## Phase 2: Functional Specification

### Required functions per use case (shell-level)

| Function | Owns | Reads | Writes | Notes |
|---|---|---|---|---|
| `loadShell(userId, app)` | shell | user prefs, app role | — | renders three panes; reads pane widths from user pref |
| `loadLeftPane(userId, app)` | shell | role-specific list source | — | coordinator: queue; patient: tasks; kitchen: orders; provider: clinical queue |
| `selectLeftItem(itemId)` | shell | item record, thread | UI state (active item) | triggers center + right load in parallel |
| `loadCenterRecord(itemId)` | shell | item-specific record | — | record viewer is content-led; type varies by item |
| `loadRightThread(recordId, app)` | shell | thread events filtered by app's allowlist | — | patient app filters out `tool_call` / `tool_result` / `agent_*` |
| `resizePane(boundary, deltaPx)` | splitter | min/max constraints | user pref | clamped; center never below floor |
| `toggleNavCollapse()` | shell | nav state | UI state | 260 ↔ 80 |
| `submitApprovalDecision(cardId, decision, note?)` | thread | card state | thread event, queue item | coordinator / provider only |
| `sendThreadInput(text)` | thread | — | thread event, agent task | coordinator / provider only |
| `progressOrderStatus(orderId, nextStatus)` | thread | order state | order event | kitchen only |
| `viewNotification(notifId)` | thread | notification | notification.read=true | patient only |

### Data model (shell-level slice)

**Queue/list item (parametric across apps):**
| Field | Type | Source | Notes |
|---|---|---|---|
| id | string | system | |
| app | enum: coordinator, patient, kitchen, provider | system | data scope binding |
| owner_id | string | system | user receiving the item |
| subject_type | enum: patient, referral, care_plan, order, recipe, partner_request, ... | workflow | |
| subject_id | string | workflow | |
| title | string | agent | |
| summary | string | agent | one-line for left pane |
| urgency_tier | enum: urgent, needs_attention, informational | agent | per ui-patterns.md |
| sla_deadline | datetime | workflow rules | |
| sla_status | enum: within_sla, warning, breached | computed | |
| status | enum: pending, in_progress, resolved, reassigned | system | |
| created_at | datetime | system | |

**Thread event (parametric across apps):**
| Field | Type | Notes |
|---|---|---|
| id | string | |
| thread_id | string | bound to a record (subject_type:subject_id) |
| app_visibility | enum-set: coordinator, patient, kitchen, provider | which apps render this event |
| message_type | enum: system, agent_tool_call, agent_tool_result, approval_request, approval_response, human_message, notification, status_change | patient never sees agent_tool_* / approval_* |
| actor | string (user_id or agent_id) | |
| timestamp | datetime | |
| content | object (varies by type) | |

**User pane preferences:**
| Field | Type | Notes |
|---|---|---|
| user_id | string | |
| app | enum | |
| left_width_px | int | default 260; min 220; max 320 |
| right_width_px | int | default 640; min 480; max 800 |
| nav_collapsed | bool | default false |

### State transitions (shell-level)

- **Pane resize:** `idle → dragging → idle` (write user pref on idle)
- **Item selection:** `none → loading → loaded → (re-select) loading → loaded`
- **Approval card:** `pending → in_review → resolved (approved | edited | rejected | reassigned)`
- **Order status (kitchen):** `pending → prepping → packed → quality_checked → dispatched → delivered | delivery_failed`

### Business rules

- Patient app's thread renderer applies a strict allowlist: only `notification`, `human_message` (from coordinator), `status_change` of patient-visible events, and patient's own `human_message` outbound. Any agent-internal event is filtered server-side AND client-side (defense in depth).
- Kitchen's thread allowlist excludes any clinical event types — only order-relevant `status_change`, `system` events, and operational `human_message`.
- Approval cards always show downstream effects before the user taps — never just "approve / reject" without naming what happens next.
- 5-second undo on approve actions before the agent resumes the workflow.
- Empty queue copy is positive ("Nothing needs your attention right now"), never error-framed.

### Validation requirements

- Left pane: at least one item OR a non-error empty state at all times
- Right pane: never shows raw PHI (SSN, full med history) in tool-call rendering — only field names + summaries
- Resize: pane widths clamped at min/max even if user pref is corrupted
- Brand fonts present at first paint — `conform:brand-fonts` ensures `index.html` linkage

### System dependencies

- Pattern library: `agentic-shell.html` (rich base), `three-panel-shell.html` (bare port target), `layout-mobile-shell.html` (mobile constraint), `panel-splitter.html` (drag-resize), `queue-sidebar.html`, `thread-panel.html`
- React ports: `AgenticShell` (thin layout-shell wrapper, shipped Patch 2026-04-28); per-app pane composition lives in `apps/[persona]/src/App.tsx` until a second consumer needs the inner panes promoted
- Tokens: `colors.css`, `typography.css`, `spacing.css`, `components.css` — surface roles per `DESIGN.md` §Surface
- Fonts: Lora + Source Sans 3 + Source Code Pro (per-app `index.html` link block)
- Preline: required for dropdowns and overlays inside the shell; not for the shell structure itself

---

## Phase 3: Information Architecture

### Universal screen inventory

| Screen ID | Name | Primary persona | Where it lives |
|---|---|---|---|
| SHELL-DESKTOP | Desktop three-pane shell | coordinator, kitchen, provider | repo-wide composition based on `agentic-shell` |
| SHELL-MOBILE | Mobile single-pane swipe shell | patient | repo-wide composition based on `mobile-shell` |
| SHELL-LEFT-COORDINATOR | Coordinator queue sidebar | coordinator | `apps/care-coordinator` |
| SHELL-LEFT-PATIENT | Patient task/nav sidebar (mobile-bottom-nav on mobile) | patient | `apps/patient` |
| SHELL-LEFT-KITCHEN | Kitchen orders list + daily summary | kitchen | restoration target |
| SHELL-LEFT-PROVIDER | Provider clinical queue | provider | restoration target |
| SHELL-CENTER-* | Per-app primary content surface | varies | per app |
| SHELL-RIGHT-COORDINATOR | Full agent activity thread + approvals | coordinator | shared `thread-panel` with full message-type allowlist |
| SHELL-RIGHT-PATIENT | Notifications-only thread surface | patient | shared `thread-panel` with restricted allowlist |
| SHELL-RIGHT-KITCHEN | Order activity thread (status events + ops) | kitchen | shared `thread-panel` with kitchen allowlist |
| SHELL-RIGHT-PROVIDER | Clinical action thread + clinical approvals | provider | shared `thread-panel` with provider allowlist |

### Navigation placement

The shell IS the navigation. There is no top-level navbar competing with the left pane.

- **Desktop:** left pane = role-specific list (queue/tasks/orders/clinical-queue) + secondary nav below the list (Patients, Reports, Settings, etc.)
- **Mobile (patient):** bottom-nav with 4–5 tabs (Dashboard, My Health, Messages, Care, Settings); swipe-nav between center and right within a tab

### Screen-to-screen flows

```
Open app → SHELL-LEFT-* (rendered) + SHELL-CENTER-* (orientation surface) + SHELL-RIGHT-* (empty state)

Click left item → SHELL-LEFT-* (item active) + SHELL-CENTER-* (record loaded) + SHELL-RIGHT-* (thread loaded for that record)

Approve in SHELL-RIGHT-COORDINATOR → SHELL-LEFT-COORDINATOR (item removed) + (next item highlighted, not auto-opened)

Mobile swipe left in SHELL-MOBILE → SHELL-RIGHT-PATIENT (notifications surface) → swipe right → back to SHELL-CENTER-PATIENT

Resize panel boundary → user pref written → next session inherits the layout
```

### Content priority per pane

**SHELL-LEFT (universal):**
1. Role-specific list (queue/tasks/orders/clinical-queue)
2. Urgency / status grouping (visual hierarchy)
3. Per-item: subject identity, one-line summary, time/SLA marker
4. Secondary nav (Patients, Reports, Settings) below the list
5. Cena logo + user menu in header

**SHELL-CENTER (universal):**
1. Record identity / page title (Lora display per `DESIGN.md` §Typography)
2. Status / risk markers
3. Record content (varies by record type)
4. Inline edit affordances for owner-editable fields

**SHELL-RIGHT (universal):**
1. Active approval card OR active notification (the hero)
2. Recent thread events (newest at bottom)
3. Thread input (coordinator/provider only) OR patient-side message composer (patient only) at bottom
4. Historical thread above (scrollable)

### Cognitive load check

- Coordinator's primary action (approve a queue item) is reachable in 2 taps from the most common entry point: open app → click queue item (1) → tap approve in approval card (2)
- Patient's primary action (complete an assessment) is reachable in 2 taps: open app → tap dashboard task (1) → tap response option (2)
- Kitchen's primary action (mark order packed) is reachable in 2 taps: open app → tap order (1) → tap status button (2)
- Provider's primary action (sign nutrition section) is reachable in 2 taps: open app → click queue item (1) → tap sign in approval card (2)

---

## Open questions for Aaron at Gate 2

1. **Right-pane availability per app:** kitchen and provider apps both *have* a thread in vision docs but the value is different. Kitchen's thread is order-status events; provider's is clinical decision context. Confirm both render the right pane by default, or kitchen lets the right pane be optional / collapsible-by-default since most kitchen actions don't require thread context.
2. **Right-pane on mobile:** for kitchen and provider tablet use, should the right pane be drawer-on-demand (768–960px) or always visible if the screen permits? Defaulting to drawer-on-demand below 1240px until evidence says otherwise.
3. **Patient app right pane existence:** patient on mobile is single-pane swipe-nav. Does the patient app even surface a "right pane" abstraction, or does the right swipe land on a notifications screen that's structurally a separate route? Recommend treating it as a route (cleaner) but composing the same `thread-panel` component to the route.
4. **Provider mobile:** provider RDN is desktop-primary, but lab-flag check-ins from a phone are realistic. Out of scope for v1 mobile shell, but flag whether v1.1 needs a mobile provider variant.

---

## Component-gap pointer

See `apps/_shared/design/shell-component-gaps.md` for the wireframe-vs-PL delta. Most universal-shell needs are covered by existing PL primitives; per-app-specific gaps (kitchen packing slip, provider nutrition-section approval card variant) are flagged there.
