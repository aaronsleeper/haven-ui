# Patient — Shell Use Cases (Universal Shell + Patient Minimums)

**Application:** Patient App
**Persona:** Patient (primary)
**Device:** Mobile-first (primary); desktop/tablet supported but not the design center
**Status:** Phase 1–3 complete; Gate 1 ready
**Parent:** [`apps/_shared/design/universal-shell-use-cases.md`](../../_shared/design/universal-shell-use-cases.md)

This doc covers the patient's slice of the universal shell + the **minimum features that make the app feel like the patient app** rather than chrome with placeholders. Per Gate 1 G1.2: *assessments list (already shipped) + one in-progress thread surface showing notifications-only (no agent activity exposed to patient).* Per Gate 1 G1.3: *patient mobile shell authored now in parallel with coordinator desktop spec.*

---

## Phase 1: Discovery

### Persona — Patient (Maria Rivera)

- Chronic conditions; variable tech literacy; often elderly; bilingual EN/ES
- Mobile-first interaction; small phone screens, occasional shaky hands, slow connections
- 5th grade reading level for everything they read
- Does NOT see the agent activity thread; the patient-side thread is **notifications-only** (messages from coordinator + system reminders + status events that affect the patient)
- Primary mode: respond to prompts (assessments, check-ins, feedback), view own progress, read messages

The patient's shell exists to support AVA (voice) and the coordinator relationship — not to replace either. The app handles the asynchronous and self-paced moments: read a consent, complete an assessment, check a delivery time.

### User goals (patient shell-level)

| Goal | Frequency | Priority |
|---|---|---|
| Open the app and see what I need to do today | 1–3x/week | Highest |
| Tap a prompt and complete it without feeling lost | per prompt | Highest |
| Read a message from my care coordinator and respond | occasional | High |
| See my own progress and feel a sense of momentum | 1–2x/week | High |
| Switch between English and Spanish without the layout breaking | per session if bilingual | High |

### Use cases (patient-specific)

#### PT-SHELL-01: Open app and see today's prompt
**Precondition:** Patient is enrolled. Care team has assigned a task or sent a message.
**Trigger:** Patient opens the app or taps a push notification.
**Flow:**
1. Mobile shell renders at 430px max-width (centered on larger screens), `mobile-app` body class disables desktop ambient blobs
2. `mobile-i18n-bar` fixed at top with EN/ES toggle
3. Center pane (default tab — Dashboard): today's task card if any, recent message preview, next delivery countdown
4. `mobile-bottom-nav` at bottom: Dashboard / My Health / Messages / Care / Settings
5. Padding-bottom honors iOS home-indicator clearance (`pb-safe-4` or `pb-safe-8`)
**Outcome:** Patient sees what they should do without scrolling.

#### PT-SHELL-02: Complete a prompted assessment
**Precondition:** Care team has assigned an assessment.
**Trigger:** Patient taps assessment card on dashboard or push notification.
**Flow:**
1. Patient sees assessment intro — what it's about, how long it takes, why it matters (5th grade language)
2. One question per screen (mobile pattern)
3. Progress indicator (`progress-bar-pagination`) shows position
4. Back button for previous question; never feels trapped
5. Submit at the end → warm thank-you screen
6. If answer triggers a flag (food insecurity, safety concern), system routes alert to coordinator quietly — patient sees reassuring message, not a clinical warning
**Outcome:** Assessment recorded; patient feels heard.

(Already shipped via assess-01 through assess-05 wireframes; this universal-shell pass does not redesign assessments — it confirms they sit inside the mobile shell.)

#### PT-SHELL-03: Read a coordinator message
**Precondition:** Coordinator has sent a message.
**Trigger:** Patient taps Messages tab in bottom-nav OR taps a message preview on dashboard.
**Flow:**
1. Messages tab (the patient's "right pane" surfaced as a route, not a swipe) shows a chronological list of messages
2. Each message uses `message-bubble-in` for incoming (left-aligned with sender label) and `message-bubble-out` for outgoing (right-aligned)
3. New messages have a "new" pill until viewed
4. Tap a message to expand or compose a reply
**Outcome:** Patient reads + replies in one place.

The patient's "thread" is the notifications + messages surface — it never renders agent activity, tool calls, or approval cards. The same `thread-panel` pattern is composed with a strict allowlist (`message_type` ∈ `{notification, human_message, status_change}` only, where `human_message` actor is the coordinator or the patient themselves).

#### PT-SHELL-04: View my health trends
**Precondition:** Patient has submitted at least 2 data points.
**Trigger:** Patient taps My Health tab in bottom-nav.
**Flow:**
1. My Health hub shows trend cards per tracked metric — patient-friendly labels ("Mood", "Energy"), not clinical names
2. Each card has a sparkline, a trend badge (improving / stable / needs attention), and last-updated date
3. Tap a card → metric detail view with recent history and plain-language context
**Outcome:** Patient feels informed and motivated.

(Already shipped via assess-01 / assess-05.)

#### PT-SHELL-05: Switch language
**Precondition:** Patient is in either EN or ES.
**Trigger:** Patient taps the language toggle in `mobile-i18n-bar`.
**Flow:**
1. Toggle flips between EN/ES
2. All visible text updates in place via `data-i18n-en` / `data-i18n-es` attributes (`src/scripts/components/i18n.js`)
3. Layout absorbs Spanish strings (~30% longer than English) without overflow or wrap-breakage
**Outcome:** Patient reads in their preferred language seamlessly.

#### PT-SHELL-06: Mobile swipe-nav (deferred per `ui-patterns.md` mobile model)
**Precondition:** Patient is on mobile.
**Trigger:** Patient swipes left or right on the center pane.
**Flow:**
1. Swipe left → navigates to Messages route (the right-pane surface for patient)
2. Swipe right → navigates to a side menu (alternative to bottom-nav, optional)
3. Bottom-nav remains the canonical navigation; swipe is a power-user convenience
**Outcome:** Power users navigate fast; novices use the bottom-nav.

**Note:** the swipe-nav model is part of the universal shell vision but is **deferred to v1.1** — the patient shell at v1 uses bottom-nav only. The mobile-shell spec at `apps/patient/design/wireframes/patient-mobile-shell.md` documents the v1 layout; swipe-nav is flagged as future.

### Constraints (patient-specific)

- **Mobile primary:** 320–430px design width; iOS home indicator clearance via `pb-safe-*`
- **Bilingual EN/ES:** every visible string supports both via `data-i18n-en` / `data-i18n-es`; layouts pad for Spanish ~30% longer
- **5th grade reading level:** all copy gated by `conform:plain-language`
- **WCAG 2.1 AA:** 44px+ tap targets; high contrast; screen reader; large-text mode
- **Low-data mode:** no autoplay; lightweight images; functional on slow connections
- **No agent-activity exposure:** strict server- + client-side filtering of thread events; if a tool_call ever leaks to a patient surface it's a P0 bug
- **No clinical raw numbers:** trend cards show "Improving" / "Low risk" / "Needs attention", not "PHQ-9 = 4"
- **Reading-level + bilingual + brand fonts** all mandatory at first paint

### Constraints inherited from universal shell

See `_shared/design/universal-shell-use-cases.md` §Phase 1 Constraints.

---

## Phase 2: Functional Specification

### Patient-specific functions

| Function | Notes |
|---|---|
| `loadDashboard(patientId)` | renders today's task card, message preview, next-delivery countdown |
| `loadAssessment(patientId, assessmentId, mode)` | mode: `intro` or `checkin` (skip intro for quick check-ins) |
| `submitAssessmentResponse(assessmentId, questionId, value)` | per-question persistence; resumes from last-answered if abandoned |
| `loadMessages(patientId)` | chronological list filtered to coordinator and patient messages only |
| `composeReply(threadId, text)` | adds outgoing message_bubble; routes to coordinator queue |
| `loadHealthTrends(patientId)` | trend cards per tracked metric; patient-friendly labels |
| `setLanguage(lang)` | persists user pref; re-renders visible strings |

### Thread message-type allowlist (patient — STRICT)

The patient's "thread" surface (Messages tab) renders ONLY:
- `notification` (system-generated patient-relevant: delivery dispatched, appointment confirmed, assessment available)
- `human_message` where actor ∈ {coordinator, patient}
- `status_change` of patient-visible events (delivery delivered, appointment rescheduled)

NEVER renders (filtered server-side AND client-side, defense-in-depth):
- `agent_tool_call`
- `agent_tool_result`
- `approval_request`
- `approval_response`
- `system` events that contain agent internals
- Any `human_message` from RDN/BHN/Provider directly (those route through coordinator first)

### Business rules (patient)

- Assessment progress is auto-saved per question; abandoning mid-flow shows a resume prompt next visit
- Push notification + in-app dashboard prompt are coordinated; tapping either lands on the same task
- Trend cards shown only when ≥2 data points exist; otherwise empty state
- Trend labels are patient-friendly never clinical (e.g., "Mood" not "PHQ-2 score")
- A flagged response (food insecurity, safety) routes to coordinator silently — patient sees reassurance, never an error
- Bilingual toggle persists across sessions

---

## Phase 3: Information Architecture

### Patient screen inventory

| Screen ID | Name | Purpose | Primary actions |
|---|---|---|---|
| PT-MOBILE-SHELL | Mobile shell | 430px max-width centered shell with i18n bar + bottom-nav | layout |
| PT-DASHBOARD | Dashboard (Tasks tab) | Today's task, message preview, next delivery | tap task |
| PT-ASSESS-* | Assessment flow | Assessment intro + question stepper + complete + metric detail | answer, next, submit |
| PT-MESSAGES | Messages | Coordinator-patient threaded messages (the "thread" surface) | read, reply |
| PT-HEALTH | My Health | Trend cards per tracked metric | tap card |
| PT-CARE | Care plan / appointments | View care plan and appointments (deferred detail) | view |
| PT-SETTINGS | Settings | Language, notifications, accessibility | toggle |

### Navigation placement

- **`mobile-bottom-nav`** is the canonical navigation: Dashboard / My Health / Messages / Care / Settings
- **`mobile-i18n-bar`** persistent at top: EN/ES toggle
- **No left or right pane abstraction** — the universal shell's three-pane model collapses on mobile to a route-based single-pane view; the "right pane" (Messages) is itself a route, not a swipe target in v1
- Swipe-nav between routes is deferred to v1.1

### Screen flows

```
Open app → PT-DASHBOARD (with today's task surfaced)

Tap task card → PT-ASSESS-* (intro or directly to first question)
Complete assessment → PT-ASSESS-COMPLETE → return to PT-DASHBOARD

Tap My Health tab → PT-HEALTH → tap trend card → PT-ASSESS-METRIC-DETAIL → back

Tap Messages tab → PT-MESSAGES → tap message → reply composer

Tap language toggle → all visible strings re-render in target language → user pref persisted
```

### Content priority per screen

**PT-DASHBOARD:**
1. Today's task card (if any)
2. Recent coordinator message preview (if any)
3. Next delivery countdown (if any)
4. Empty-positive copy if no items: "Nothing to do today. Enjoy your day, Maria."

**PT-MESSAGES (the patient "thread" surface):**
1. Newest message at top
2. Coordinator messages (incoming) and patient replies (outgoing) interleaved
3. Compose reply field at bottom
4. NO agent activity, NO approval cards — strict allowlist enforced

**PT-HEALTH:**
1. Trend cards (one per tracked metric)
2. Patient-friendly labels (Mood, Energy, Meal Satisfaction)
3. Sparklines + trend badges (no raw clinical numbers)

### Per-app minimum (Gate 1 G1.2)

- **Assessments list:** already shipped (assess-01 My Health hub + assess-02 intro + assess-03 question stepper + assess-04 complete + assess-05 metric detail)
- **One in-progress thread surface (notifications-only):** the Messages tab renders the strict-allowlist `thread-panel` variant. For the worked example: one coordinator message visible (e.g., "Your delivery was rescheduled to Wednesday — let me know if that doesn't work for you"), one system notification (e.g., "Assessment complete"), one patient outbound reply.
- **No agent activity exposure:** the same `thread-panel` component, allowlist parameterized.

---

## Component-gap pointer

See `apps/_shared/design/shell-component-gaps.md` for the wireframe-vs-PL delta. Patient-specific items already shipped: `mobile-shell`, `mobile-i18n-bar`, `mobile-bottom-nav`, `message-bubble-in/out`, `task-card`, `trend-card`, `assessment-header`, `progress-bar-pagination`, `pagination-row`, all the assessment primitives. The gap is configuring `thread-panel` to render with the patient's strict allowlist and composing a Messages route that uses it.

---

## Open questions for Aaron at Gate 2

1. **Patient "thread" naming:** in patient-facing copy, "thread" is too clinical/technical. Recommend "Messages" as the route name and "Notifications" or "Updates" for system-generated events. Confirm.
2. **Push-notification → app deep-link target:** when a push notification opens the app, does it land on the dashboard with the task surfaced, or directly on the task itself? Recommend dashboard-with-task-surfaced for v1 to give the patient orientation; direct-to-task is a future optimization.
3. **Bilingual scope at v1:** assessments and dashboard are bilingual-ready in source docs. Messages tab and Settings tab — are they v1 bilingual or deferred? Recommend v1 for both since both contain plain-language copy that already supports it.
4. **Mobile vs. desktop patient access:** patient on a desktop browser is a real case (older patients with desktops, advocate logging in to help). Does the mobile shell render on desktop centered (current pattern, max-width 430px), or do we author a desktop-equivalent later? Current centered-mobile is the recommended v1 stance.
