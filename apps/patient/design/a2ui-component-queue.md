# Patient app — A2UI component PL authoring queue

**Date:** 2026-05-07
**Source mapping doc (canonical):** `Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/flows/a2ui-haven-gap.md` (uconn-pilot-docs repo)
**Source build inventory:** `Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/flows/build-companion.md` (uconn-pilot-docs repo)
**COMPONENT-INDEX read:** 2026-05-07
**Validated by:** Haven Visual Designer expert review (verdict: iterate; corrections integrated)

This doc is the **haven-ui build queue** subset of the full A2UI ↔ Haven gap analysis. It tells PL authors what to build, in what order, with what naming, under what surface-treatment discipline. For full per-component mapping context (A2UI composition, used-in flows, build-companion references, sequence templates, validators), read the canonical doc in uconn-pilot-docs.

---

## Coverage summary

After validating each of the 51 patient-app components against `pattern-library/COMPONENT-INDEX.md`:

- **exists (4)** — `complex-tag-group` partial, `complex-notification-center`, `BasketReview` (agentic), `MenuGrid` + agentic `MealCard`. PL HTML present; React port status varies (out of scope here).
- **extends (12)** — existing PL pattern needs a new variant or modifier
- **missing (~17)** — needs full PL authoring (HTML + components.css + COMPONENT-INDEX entry)

**Total PL authoring queue: ~29 actions** (12 extensions + 17 new primitives).

---

## Surface treatment & button-tier discipline (apply to every component below)

Per [DESIGN.md](../../../DESIGN.md) and [design-principles.md](../../../../cena-health-brand/principles/design-principles.md):

- **Page surface (center chat thread)** — `surface-page` (sand-50). Never pure white. Per Principle 3 (Warm Ground, Cool Figure).
- **Card / right-pane surface** — `surface-card`. Cards sit on the page surface with appropriate elevation tokens.
- **Button tier defaults**:
  - **Primary teal** — reserved for user *commitments that change state*: "Send order to kitchen", "Submit recall", "Begin assessment", "I understand" (consent ack).
  - **Secondary (sand-150 fill)** — default for advancement chat affordances (most chip rows, action sets).
  - **Tertiary (transparent + border)** — persistent affordances: `chat-handoff-trigger`, soft third option chips, handoff-menu's secondary buttons.
  - **Ghost / link** — inline help, "Tap to view" sheet links, spillover "See everything waiting" chip.
- **Crisis surface** — `surface-card` with `border-l-4` left accent in `rose-04`. **Never** a fully red surface (violates Principle 3 + warm-ground mechanism).
- **Typography** — heading levels follow [DESIGN.md] §Typography (Lora display, Source Sans 3 body/UI, Source Code Pro mono). Recall list header (`patient-recall-list`) uses Heading/04 (Lora Medium 16). Default to existing token system; do not override fonts in component proposals.

---

## Authoring queue (priority order)

### Tier 1a — Foundational chat-affordance primitives (ship first; shared across all flows)

The chat-pane affordance family is where the largest gap lives — Haven currently has page-level patterns, not chat-thread-embedded ones. Land these first to unblock every flow.

| # | Component | Status | Notes |
|---|---|---|---|
| 1 | `chat-button-row` | missing | Single + dual variants. Default tier: secondary. Chat-anchored submit variant with disabled-state-aware helper text below (covers C-1, C-2, C-14). |
| 2 | `chat-chip-row` | missing | Base + `.is-soft` modifier (for soft-third option). Sizing modifier as needed (do not over-specify). Covers C-3, C-6, C-7, C-8, C-12. |
| 3 | `chat-tag-group` | extends `complex-tag-group.html` | Preference-confirmation variant with selected-state highlighting + inline Save/Skip buttons. Restaurant-menu register only — no clinical/population labels. |
| 4 | `chat-handoff-trigger` | missing | Persistent talk-to-a-person affordance. Two variants: header chip (desktop) + sticky-footer button (mobile). Tier: tertiary. *Renamed from `talk-to-person-trigger` — user-facing copy ≠ component name.* |
| 5 | `chat-numeric-input` | extends `nutrition-input` family | With unit-toggle (lb/kg, %, etc.); defaults to last-used unit. |
| 6 | `chat-paired-numeric` | missing | BP-specific: two `<input type=number>` with slash separator, no unit toggle. |
| 7 | `chat-time-preference-picker` | missing | Free-text input + two chip rows (day-of-week + time-of-day). Free text overrides chip selection. |
| 8 | `chat-sheet-link` | extends `text-link.html` + `overlay-bottom-sheet.html` | Inline link in agent message that opens a right-pane sheet. *Renamed from `chat-mobile-link` — same component across viewports; only target sheet behavior differs.* |
| 9 | `chat-status-row` | extends `thread-msg-system.html` | Patient-app variant. Used when CC takes over chat thread ("[CC first name] joined"). Subdued register. |
| 10 | `patient-chat-message` | extends `complex-chat.html` | Ava-styled chat-bubble pattern (dot-sparkle leading indicator + plain Body/02, no bubble) per [DESIGN.md] §Chat message patterns. Distinct from coordinator's `thread-msg-*` family. |

### Tier 1b — Foundational right-pane primitives

| # | Component | Status | Notes |
|---|---|---|---|
| 11 | `budget-meter` | extends `data-progress.html` | Variants: live-update, error state ("Over budget by $X"), $0 first-time, post-order ("$190 of $200 used"). |
| 12 | `quantity-stepper` | missing | Patient-app version distinct from kitchen partials (per CLAUDE.md "must not be used in other apps"). |
| 13 | `appointment-card` | missing | RDN name, date/time, location, "Add to calendar". Used in onboarding Fork A, idle next-appointment, request-appointment confirmation. |
| 14 | `appointments-list` | missing | Read-only list of upcoming appointments. May compose from `data-list-group` + appointment-row, or standalone. |
| 15 | `pending-request-card` | missing | Requested type + preference window + status + expected response window. |
| 16 | `delivery-status-timeline` | missing | 5-step status timeline with completed/current/future styling, pickup vs. delivery variants, fulfillment-window copy alongside. Distinct from agentic `progress-tracker` (different content register). |
| 17 | `meal-warning-tooltip` | extends warning patterns | Small icon + tooltip, "never blocks, never dims" rule. Items remain at full opacity. |
| 18 | `onboarding-orientation-card` | missing | Card + 3-column icon-label pattern (meals / appointments / check-ins). |
| 19 | `consent-doc-viewer` | missing | Card + scroll-container + `overlay-bottom-sheet` for full PDF on mobile. |
| 20 | `week-rhythm-card` | missing | 3-row visualization (meal-ordering window / CC check-in cadence / occasional surveys). Visual-only, non-interactive. Used onboarding Step 5. |

### Tier 1c — Per-flow right-pane primitives

| # | Component | Status | Notes |
|---|---|---|---|
| 21 | `patient-recall-list` | missing | Largest single new authoring effort. Header (Heading/04, Lora Medium 16) with day + pass indicator. Food rows: name + time/occasion + amount columns populated progressively across passes. Per-row inline editor + trash + "+ add" footer. Variants per pass (1: names; 2: more names; 3: time; 4: amounts; 5/6: locked via `.is-locked` modifier). *Renamed from `food-recall-list` to slot with `patient-*` family.* |
| 22 | `outreach-card` | missing | CC photo + name + role + arrival time + topic + note. Variants: weekly check-in (with question preview), missed-visit (softer copy), general message, photo-unavailable fallback, `.is-checkin-active` modifier (right-pane indicator during CC check-in), `.is-handoff-live` modifier ("Live with [CC first name]" indicator). *Renamed from `cc-outreach-card` — "CC" is internal jargon.* |
| 23 | `handoff-menu` | missing | Contact card + 3 stacked handoff buttons (Phone / In-chat / Email) with helper text. 11 variants: patient-initiated, agent-suggested, agent-escalated, crisis-non-clinical, crisis-clinical, CC-unavailable, language-mismatch, anonymized, no-CC-assigned, order-status-escalation, respond-to-cc-handoff. |
| 24 | `crisis-resources-card` | missing | 988 + UConn-specific protocol. `surface-card` + `border-l-4 rose-04` left accent. Never red surface. Variants TBD pending UConn clinical-team protocol input. |
| 25 | `assessment-preflight-card` | extends `AssessmentHeader` | Pre-flight card *before* the questionnaire panel: instrument name in plain language, question count, time estimate, "your answers go to your care team" disclosure, "Begin" button. |
| 26 | `trend-snippet-list` | missing | Bullet list of last 3–5 values with dates ("Apr 30 — 184 lb / Apr 23 — 185 lb / ..."). Demo + likely pilot path. Do not extend `patient-trend-card.html` (Chart.js-bound) downward — `patient-trend-card.html` exists for the P3 sparkline polish path. |
| 27 | `log-confirmation-card` | extends `Receipt` | Receipt-shaped variant: attribute(s), value(s), context, timestamp. |
| 28 | `assessment-confirmation` | extends `Receipt` | Receipt-shaped variant: instrument name, "Submitted [date]", "Your care team has it." No score shown to patient. |

### Tier 2 — Compositions (author after dependencies land)

| # | Component | Notes |
|---|---|---|
| 29 | `patient-week-panel` | Idle-state right-pane composition: budget meter (`budget-meter`) + delivery status (existing `patient-delivery-status-card.html`) + next-appointment (`appointment-card`). *Renamed from `at-a-glance-panel` to slot with `patient-meal-card`, `patient-trend-card` family.* |

### Deferred

- `appointment-slot-list` — when/if Athena Path B lands (currently P2; Path A ships first)

---

## Sequence templates (NOT Haven components — do not author)

These are agent-orchestrated flow templates that compose existing chat + right-pane components. They do NOT get their own PL entries. Listed here so PL authors don't accidentally pattern-library-ify them:

- **CC structured check-in** — composition of `chat-button-row` + `chat-chip-row` + textarea + `outreach-card.is-checkin-active` modifier
- **Multi-pass dietary recall** — orchestrates `patient-recall-list` across 5–6 pass states with paced agent prompts
- **Crisis-tier escalation** — preempts other affordances with `crisis-resources-card` + `handoff-menu` (clinical-tier variant)

---

## Open question (Aaron decision)

**MealCard rename.** The agentic `MealCard` (browse+select; pattern-library COMPONENT-INDEX line 63) and `patient-meal-card.html` (delivery+swap; line 275) currently collide on the `.meal-card` semantic class. Haven Visual Designer expert recommends:
- Rename agentic → `MealOptionCard`
- Rename `patient-meal-card.html` → `MealDeliveryCard`

Patient-app meal-ordering chat-pane (browse + select among 14 meals + quantity stepper) needs the agentic semantics, not delivery+swap. Until decided, the queue maps the meal-list role to "agentic MealCard (rename pending)."

This rename touches an existing exposed semantic class and is Aaron's call.

---

## Out of scope for this queue

- React ports — next-step task driven from the PL inventory, not gating.
- Behaviors & patterns (mobile collapse, dual interaction paths, edit-in-place, etc.) — composition rules, not PL components. Captured in the canonical gap doc.
- Validators (cart count, plausible-range value, etc.) — agent-side logic, not UI primitives.
- A2UI protocol mapping per component — see canonical gap doc.

---

## Notes

- Haven Visual Designer review (2026-05-07) corrected systematic miscategorization in an earlier draft and locked the 5 component renames listed above.
- All naming follows existing Haven prefixes (`chat-*`, `patient-*`, `clinical-*`, `complex-*`, `nav-*`, etc.) per CLAUDE.md "audit before building."
- Pattern-library-first discipline: per CLAUDE.md, every component in this queue gets a PL HTML file with `@component-meta` header + semantic classes in `components.css` + row in COMPONENT-INDEX.md before any app-level use.
