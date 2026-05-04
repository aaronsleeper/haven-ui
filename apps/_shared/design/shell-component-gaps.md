# Universal Shell — Component-Gap Report

**Source:** ux-architect pass for universal-shell + per-app minimums (Gate 1, 2026-05-03)
**Audience:** `haven-mapper` skill (next stage in pipeline) — turns this into a build plan
**Method:** wireframe-vs-PL delta against `packages/design-system/pattern-library/COMPONENT-INDEX.md`

This report categorizes every shell-level + per-app-minimum component into three buckets per `Lab/haven-ui/CLAUDE.md` slice authoring rules:

1. **Exists in PL** — copy the HTML; if a `ui-react` port is missing, port it (Tier 1 mechanical)
2. **Novel composition (recurring shape)** — composition of existing primitives appearing across ≥2 wireframes; promote to PL composition entry (Tier 1)
3. **Novel primitive** — no PL equivalent and no decomposition path; promote to PL as new primitive (Tier 1, full ceremony)

---

## Universal shell (applies to all four apps)

| Need | Bucket | PL component | Notes |
|---|---|---|---|
| Three-pane outer shell (rich base) | Exists | `layout-agentic-shell` (`agentic-shell` class + `panel-splitter`) | Ported as `AgenticShell` (Patch 2026-04-28) — thin layout-shell wrapper. Inner panes (panel-nav / panel-chat / panel-content) remain inline in app code until a 2nd consumer needs them. |
| Three-pane outer shell (bare alternative) | Exists | `three-panel-shell` | Bare `three-panel-shell` available; for v1 we adopt the rich agentic-shell base per Gate 1 G1.1 |
| Pane drag-resize | Exists | `panel-splitter` + `panel-splitter.js` | Wired in agentic-shell. React port: drag-resize behavior pending; current React shell uses fixed widths. **Carry forward to dev-tasker.** |
| Mobile shell wrapper | Exists | `layout-mobile-shell` (`mobile-shell` + `mobile-app`) | Shipped |
| Mobile i18n bar | Exists | `layout-mobile-i18n-bar` (`mobile-i18n-bar` + `mobile-i18n-toggle`) | Shipped, partial available |
| Mobile bottom-nav | Exists | `layout-mobile-bottom-nav` (`mobile-bottom-nav` + `mobile-bottom-nav-tab` + `mobile-bottom-nav-badge`) | Shipped, partial available |
| Safe-area bottom padding | Exists | `pb-safe-4` / `pb-safe-8` utilities | Shipped |
| Cena logo in nav header | Exists | `logo-cenahealth-teal.svg` asset + `nav-logo` semantic | Used in `agentic-shell` and `queue-sidebar-brand` |
| Ava avatar (chat-pane header, message-leading) | Exists | `sphere-ava.png` asset + `message-avatar` + `message-agent` semantic classes | Used in `agentic-shell` chat thread |
| Agent-working indicator | Exists | composes `spinner` + `chat-thread` styling | Already rendered in `agentic-shell` |
| Tool-call rendering | Exists | `thread-msg-tool-call` + `tool-call` (agentic) | Two PL entries — `thread-msg-tool-call` is the formal collapse-able pattern; `tool-call` is the agentic-shell inline rendering. Both shipped. |
| Approval card (any variant) | Exists | `thread-approval-card` with `.is-urgent` / `.is-warning` / `.is-historical` | Shipped, full anatomy |

**Universal shell verdict:** all primitives exist. Adoption gap is binding the existing care-coordinator React shell to the agentic-shell rich base + porting `panel-splitter` drag-resize behavior to React.

---

## Care Coordinator minimums

| Need | Bucket | PL component | Notes |
|---|---|---|---|
| Queue sidebar shell | Exists | `queue-sidebar` + `queue-sidebar-brand` + `queue-sidebar-body` | Shipped |
| Queue urgency-tier section header | Exists | `queue-section-header` with `.is-urgent` / `.is-attention` / `.is-info` | Shipped |
| Queue item | Exists | `queue-item` with `.is-urgent` / `.is-attention` / `.is-info` + `.active` + SLA states (`.is-warning`, `.is-breached`) | Shipped, accessible |
| Approval card (coordinator variant) | Exists | `thread-approval-card` + `.is-urgent` / `.is-warning` | Shipped |
| Thread system message | Exists | `thread-msg-system` | Shipped |
| Thread tool call | Exists | `thread-msg-tool-call` | Shipped |
| Thread human message | Exists | `thread-msg-human` | Shipped |
| Thread approval response (collapsed summary) | Exists | `thread-msg-response` with `.is-approved` / `.is-rejected` | Shipped |
| Thread input | Exists | `prompt-input-container` | Shipped (richer than coordinator needs); inline carve-out acceptable for cc-02 |
| Morning summary card | Exists (compose) | `card` + `stat-card` | Composition exists in cc-03 wireframe |
| Record header (patient/referral identity) | Exists | `record-header` + `record-header-main` etc. | Shipped (cc-04/cc-05/cc-06/cc-07 already use it) |
| Editable indicator | Exists | `editable-indicator` | Shipped |

**Coordinator verdict:** all components exist. Adoption gap is the agentic-shell rich-base upgrade.

---

## Patient minimums

| Need | Bucket | PL component | Notes |
|---|---|---|---|
| Mobile shell + i18n bar + bottom-nav | Exists | (universal-shell row above) | Shipped |
| Task card (dashboard) | Exists | `patient-task-card` with `.task-card-overdue` / `.task-card-in-progress` / `.task-card-completed` | Shipped, ported as `<TaskCard />` |
| Trend card (My Health hub) | Exists | `patient-trend-card` | Shipped |
| Message bubble (incoming/outgoing) | Exists | `patient-message-bubble` (`message-bubble-in` / `message-bubble-out`) | Shipped |
| Assessment header | Exists | `assessment-header` | Shipped |
| Progress bar pagination | Exists | `progress-bar-pagination` | Shipped |
| Pagination row (Previous/Next) | Exists | `pagination-row` | Shipped |
| Response option (Likert/multi-choice) | Exists | `response-option` + `response-option-group` | Shipped |
| Emoji scale | Exists | `patient-emoji-scale` | Shipped |
| Assessment slider | Exists | `patient-assess-slider` | Shipped |
| Feedback rating | Exists | `patient-feedback-rating` | Shipped |
| Preference image card | Exists | `patient-pref-image-card` | Shipped |
| Onboarding progress | Exists | `layout-onb-progress` | Shipped |
| Bottom sheet | Exists | `overlay-bottom-sheet` | Shipped (mobile-only) |
| Patient-side "thread" surface | **Novel composition** | `thread-panel` configured with strict allowlist | Compose `thread-panel` + `message-bubble-*` + `notif-item` (renaming visible to "Notifications"); STRICT allowlist enforced — see patient `shell-use-cases.md` Phase 2. **Promote to PL as a thread-panel variant when 2nd app needs the configured-allowlist pattern (kitchen has its own allowlist, so this is a reasonable trigger).** |

**Patient verdict:** all primitives exist. **One novel composition flagged: patient-allowlist `thread-panel` Messages route.** Tier 1 promote when 2nd-consumer trigger fires (kitchen's own allowlist is the trigger).

---

## Kitchen minimums (app archived; design proceeds)

| Need | Bucket | PL component | Notes |
|---|---|---|---|
| Three-pane shell | Exists | (universal row) | Shipped |
| Orders list — status-grouped | Novel composition | `queue-section-header` + `queue-list` + `queue-item` | Same shape as coordinator queue but groups by *status* not urgency. Add `is-status-pending` / `is-status-prepping` / etc. modifiers to `queue-section-header` (extend existing `.is-urgent` / `.is-attention` / `.is-info` set) — Tier 1 promote since recurring across kitchen orders |
| Daily production summary | Novel composition | `card` + `data-table` + `alert-warning` | Recipe-grouped breakdown + allergen alerts + grocery status. Composition appears once at v1 — inline carve-out acceptable until 2nd consumer; promote when end-of-day summary uses the same shape |
| **Packing slip** | **Novel primitive** | None — needs new entry | Patient first name + last initial + delivery address + meal contents + **prominent allergen flags (red, large)** + delivery window. **Brand-fidelity-weighted (safety-critical)**, 4-expert panel review required. Tier 1 promote. |
| Status progression buttons | Novel composition | `btn-secondary` + `btn-primary` + `btn-group` (vertical or horizontal) | Inline carve-out at v1; promote if 2nd consumer (e.g., delivery driver mobile flow) |
| Allergen alert indicator | Novel composition | `severity-badge` (`severity-high`) + `alert-warning` | Composition; promote if recurring across kitchen surfaces |
| Recipe-batch start | Inline carve-out | `btn-secondary` + numeric badge + count | Single use at v1 (production summary card) |
| Order status thread | Exists | `thread-panel` + kitchen allowlist | Same `thread-panel` variant pattern as patient — kitchen-allowlist is *another* allowlist of the same primitive |

**Kitchen verdict:** **1 novel primitive (packing slip) + 1 novel composition (status-grouped orders list)** + `thread-panel` allowlist variant configuration. Pre-restoration design work proceeds; build waits on `git mv archive/inactive-apps/kitchen apps/kitchen`.

---

## Provider minimums (app archived; design proceeds)

| Need | Bucket | PL component | Notes |
|---|---|---|---|
| Three-pane shell | Exists | (universal row) | Shipped |
| Clinical queue — gate-type-grouped | Novel composition | `queue-section-header` + `queue-list` + `queue-item` | Same shape as coordinator queue; group labels are gate types (Care Plan / SOAP / Lab Flag / Recipe / Meal Match). Inline at v1; promote if recurring (e.g., BHN queue uses same shape) |
| Clinical patient record (nutrition focus) | Novel composition | `clinical-patient-card` + `clinical-metric-card` + `clinical-medication-row` + `clinical-nutrition-list` + `clinical-timeline` + `trend-chart` (agentic) | All primitives shipped; composition is novel. Inline carve-out acceptable until 2nd consumer (BHN record could share) |
| Care plan nutrition section editor | Exists | `clinical-nutrition-list` + `clinical-ai-field` (agent-populated values pending confirmation) | Shipped |
| Biomarker trend chart | Exists | `trend-chart` (agentic) + Chart.js with HAVEN.* defaults | Shipped — line charts only per Tufte |
| SOAP note editor (S/O/A/P sections) | Novel composition | `card` + `card-header` + `card-body` + textarea | Composition; inline at v1; promote when 2nd consumer (BHN safety note?) |
| **Clinical-decision approval card** | **Novel composition (variant of existing)** | `thread-approval-card` + new modifier class `.is-clinical` | Same anatomy as `.is-urgent` / `.is-warning` / `.is-historical`; clinical content priority differs (NCP terminology + ICD-10 mapping + signature affordance). Tier 1 — extend the `thread-approval-card` PL fragment; 4-expert panel because brand-fidelity-weighted (clinical signature is high-stakes). |
| Caseload list | Exists | `data-table` + `clinical-patient-row` | Shipped |
| Recipe nutritional validation card | Novel composition | `clinical-ai-field` + `card` + clinical-decision approval card | Inline at v1; clinical-decision approval card variant covers the action |
| Provider thread allowlist | Exists | `thread-panel` configured | Same primitive as patient + kitchen, different allowlist (full clinical messages, BHN/coordinator as summaries) |

**Provider verdict:** **1 novel variant (clinical-decision approval card)** that extends `thread-approval-card`. Tier 1 — needs 4-expert panel since clinical decision-making is brand-fidelity-weighted. Pre-restoration design work proceeds; build waits on `git mv archive/inactive-apps/provider apps/provider`.

---

## Summary table — what to build

| Item | Tier | Rationale | Bucket |
|---|---|---|---|
| Bind care-coordinator React shell to agentic-shell rich base + port `panel-splitter` drag-resize | Tier 1 mechanical port + composition | All PL exists; this is the React-side adoption | Mechanical |
| Compose Messages route in patient app using `thread-panel` + strict allowlist | Tier 2 slice composition | All primitives exist; inline at v1; promote when kitchen ships its own allowlist | Composition |
| **Packing slip primitive (kitchen)** | **Tier 1 primitive — 4-expert panel** | Brand-fidelity-weighted; allergen prominence is safety-critical | NEW PRIMITIVE |
| Status-grouped orders list (kitchen) | Tier 1 composition | Extend `queue-section-header` with `is-status-*` modifiers; recurring across kitchen orders | NEW COMPOSITION |
| Daily production summary card (kitchen) | Tier 2 inline carve-out | Single use at v1; promote when 2nd consumer | Inline |
| **Clinical-decision approval card variant (provider)** | **Tier 1 variant — 4-expert panel** | Extends `thread-approval-card` with `.is-clinical` modifier; clinical signature is brand-fidelity-weighted | NEW VARIANT |
| Clinical patient record composition (provider) | Tier 2 inline carve-out | Single use at v1 (RDN); promote when BHN ships | Inline |
| Gate-type-grouped clinical queue (provider) | Tier 2 inline carve-out | Single use at v1; promote when BHN queue ships | Inline |
| SOAP note editor (provider) | Tier 2 inline carve-out | Single use at v1; promote when BHN safety note ships | Inline |

---

## Brand-fidelity-weighted items (4-expert panel required)

Per `Lab/haven-ui/CLAUDE.md` slice authoring rules, these items require the 4-expert review panel before merge:

1. **Packing slip primitive (kitchen)** — allergen prominence is safety-critical; brand decisions about red/gold severity treatment matter
2. **Clinical-decision approval card variant (provider)** — clinical signature is high-stakes; voice + visual hierarchy + Ava identity all carry weight
3. **Agentic-shell adoption in care-coordinator React app** — first React-side adoption of the rich base across the universal shell; brand-fidelity expert sign-off is the gate

Mechanical 1:1 ports (`AgenticShell` already shipped) skip the panel.

---

## Pipeline handoff to `haven-mapper`

This report is the input. `haven-mapper` produces a build plan that:
- Sequences the items above into slices (e.g., shell adoption first, then patient Messages route, then kitchen packing slip + orders list, then provider clinical-decision card)
- Names tier per item (per Lab/haven-ui/CLAUDE.md `Slice authoring`)
- Names the gates that block each patch (`conform:*` set per tier)
- Calls out the 4-expert panel dispatches needed
- Calls out app-restoration prerequisites (kitchen + provider)

The build plan goes through Gate 3 with Aaron before Stage 5 (build) starts.
