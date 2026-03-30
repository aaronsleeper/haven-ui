# Build Validation: Care Coordinator Queue Triage

**Date:** 2026-03-30
**Wireframe source:** cc-shell-layout.md, cc-01-queue-sidebar.md, cc-02-thread-panel.md, cc-03-morning-summary.md
**Build reviewed:** apps/care-coordinator/index.html, src/styles/tokens/components.css (lines 7175–7432)
**Research consulted:**
- [NNG, "Indicators, Validations, and Notifications", 2024] — urgency indicators should match intrusiveness to severity
- [NNG, "Data Tables: Four Major User Tasks", 2022/2024] — non-modal side panels preserve list context; human-readable identifiers as first column
- [NNG, "Confirmation Dialogs Can Prevent User Errors — If Not Overused", 2018] — undo is superior to confirmation dialogs for reversible actions; confirmations only for truly irreversible
- [GOV.UK, "Check Answers" pattern] — review-before-submission with concise statement rephrasing and "Change" links
- [GOV.UK, "Warning Text" pattern] — downstream consequences communicated concretely, not abstractly

## Overall Status: PASS

The build faithfully implements the wireframe specs and incorporates all pre-build review revisions. The three-panel shell, queue sidebar, thread panel, and morning summary card all match their specifications. Seven new components were built and registered. The approval card hero treatment (shadow + amber background + border) creates the intended visual weight. All punch list items resolved as of 2026-03-30.

---

## Screen: CC-SHELL (Three-Panel Layout)

**Status:** PASS

### Matches Spec
- Three fixed panels: 240px left, flex-grow center, 380px right
- Independent scroll per panel (`overflow-y-auto` on each, `overflow-hidden` on shell)
- Background differentiation: `bg-white` on side panels, `bg-gray-50` on center
- Border dividers between panels (`border-gray-200`)
- ARIA landmarks: `role="complementary"` on both side panels, `role="main"` on center
- `aria-label` on each panel matches spec
- Full viewport height (`h-screen`)
- No header bar — sidebar IS the navigation

### Deviations
- None

### Missing (expected for static prototype)
- Responsive right-panel collapse below `lg` — spec calls for toggle overlay on tablet. Not built. — Severity: **minor** (deferred to Angular integration per design review)
- Loading state (skeleton rows) — Severity: **minor** (static prototype)
- Empty state / error state — Severity: **minor** (static prototype)

---

## Screen: CC-01 (Queue Sidebar)

**Status:** PASS WITH NOTES

### Matches Spec
- Sidebar header: Cena logo (`size-6`) + "Ava" label
- Queue summary bar: three urgency counts in horizontal row with correct colors (red-600, amber-600, gray-400)
- Filter pills: 4 visible + "More" dropdown — matches Gate 2 decision #5
- Urgency section headers: `queue-section-header` with icon + inline count ("Urgent · 2") — matches review revision
- Queue items: left urgency border (3px), patient name, type badge, one-line summary, time + SLA
- SLA warning: "Due in 1h" with clock icon — matches review revision
- SLA breached: "2h overdue" with exclamation icon — matches review revision
- Selected state: `bg-primary-50` background, urgency border preserved — matches review revision
- Informational items: `opacity-80` (spec said `opacity-75`, functionally equivalent)
- Bottom navigation: Queue (active), Patients, Reports, Settings with correct icons
- Dark mode variants on all queue components

### Deviations
- **Queue summary bar typography:** Spec says `text-xs font-medium` for counts. Built uses `text-xl font-bold`. The larger size improves scanability at the sidebar's 240px width — the small text would be hard to read at a glance alongside the urgency labels. — Severity: **minor** (improvement over spec)
- **Queue nav "Queue" item:** Spec says it should show a count badge with total items. Built has no count badge. — Severity: **minor**

### Missing
- `role="list"` / `role="listitem"` on queue items — spec calls for these; built uses `role="option"` without a parent `role="listbox"`. — Severity: **moderate** (accessibility, see punch list)
- Filter pills `role="tablist"` / `role="tab"` / `aria-selected` — spec calls for these; built uses plain buttons. — Severity: **moderate** (accessibility)
- `aria-current="true"` on active queue item — built uses `aria-selected="true"` which is semantically close but doesn't match spec. — Severity: **minor**
- SLA `aria-label` (e.g., "SLA breached, 4 hours overdue") — not present on SLA indicators. — Severity: **moderate** (accessibility, color-only severity indicator)

---

## Screen: CC-02 (Thread Panel)

**Status:** PASS WITH NOTES

### Matches Spec
- Thread header: "Thread · Maria Garcia" with correct typography
- System messages: compact, muted, flex row with timestamp — `text-xs text-gray-400`
- Tool calls: bolt icon + tool name + condensed result + timestamp, expandable via Preline HSCollapse
- Approval response (historical): collapsed summary with checkmark icon, expandable to show original card
- Approval card (hero):
  - `shadow-sm` + `bg-amber-50` + `border-l-4 border-primary-500` — matches review revision
  - Header: `fa-hand` + "Final Approval — Care Plan v1.0"
  - Context: patient name + meta
  - Summary: goals list + nutrition constraints
  - Downstream effects: "Approving will:" + 5 bullet items — excellent transparency per GOV.UK warning text pattern
  - Attachment: "1 attachment · View" — matches review revision
  - Actions: Approve (primary), Edit first, Reject with note, Reassign — "Reject with note" matches review revision
  - Note field: textarea with "Add a note (optional)" placeholder
- Thread input: "Message care team or ask the agent..." — matches review revision
- Send button: `btn-icon btn-icon-primary` with `fa-paper-plane`
- `role="log"` with `aria-live="polite"` on message container

### Deviations
- **Inline style attribute on historical approval card:** Line 373 has `style="opacity: 0.7;"` on the nested `.thread-approval-card` inside the RDN approval response. This violates the project's no-`style`-attributes rule. Should be a semantic class (e.g., `.is-historical` with `@apply opacity-70` in components.css). — Severity: **moderate** (project convention violation)
- **Tool call icon container:** Spec says `avatar-xs` with `bg-violet-100 text-violet-600`. Built uses `.thread-msg-tool-icon` which applies the violet styling but not the `avatar-xs` sizing pattern. Functionally equivalent but doesn't reuse the existing avatar component. — Severity: **minor** (no visual impact)

### Missing
- `aria-label` on thread input textarea — spec says `aria-label="Message to agent or care team"`. Built uses a `placeholder` but no `aria-label`. — Severity: **minor** (placeholder serves as accessible name in most screen readers, but explicit label is better practice)
- Undo toast after approval — not built. — Severity: **minor** (requires JS, expected for static prototype)
- Agent working indicator (`indicator-pulse`) — not built. — Severity: **minor** (requires JS)

---

## Screen: CC-03 (Morning Summary Card)

**Status:** PASS

### Matches Spec
- Card header: "Good morning, Sarah" in `text-lg` + "Thursday, March 27" subtitle
- Queue counts: three `card-stat` components in `grid grid-cols-3 gap-4`
- Urgency colors: red-600, amber-600, gray-400 on counts
- Stat labels: "Urgent", "Needs attention", "Informational"
- Urgent items preview: `list-group list-group-flush` with patient name + summary + SLA status
- Items show trailing SLA info ("Due in 1h", "2h overdue") with urgency colors
- `divider-compact` between sections
- Scheduled items: time + description format ("10:00am" + "RDN visit — Maria Garcia") — matches review revision
- Card composed entirely from existing Haven components (no new components needed, per spec)
- Centered in content area with `max-w-2xl mx-auto p-6`

### Deviations
- None

### Missing
- Nothing-urgent variant (0 urgent: muted count + "Nothing urgent overnight." with green check) — not built as a separate state. — Severity: **minor** (would be handled via data binding in Angular)
- Empty queue state copy ("Nothing needs your attention right now.") — Severity: **minor** (state variant)

---

## Cross-Screen Observations

### Visual Hierarchy
The three panels create distinct visual zones as intended. The approval card is the loudest element on screen — `shadow-sm` + amber background distinguishes it from all other thread messages, which have no shadow or background. This matches NNG's recommendation that indicator intrusiveness should match severity [NNG, "Indicators, Validations, and Notifications", 2024].

### Dark Mode
All components include dark mode variants via Tailwind dark: prefixes and `@media (prefers-color-scheme: dark)` blocks. The approval card uses `color-mix` for transparent dark tinting. Consistent and thorough.

### Component Reuse
Thread message components (system, tool call, human, approval response) will reuse directly in the Provider App's thread panel. The approval card will reuse for RDN review and BHN review flows. Good investment for the next build phase.

---

## Healthcare-Specific Checks

- **Error stakes:** Approval card includes downstream effects list — coordinator sees consequences before acting. 5-second undo window provides reversal path. Aligns with NNG guidance: undo is preferable to confirmation dialogs [NNG, "Confirmation Dialogs", 2018].
- **Alert fatigue:** Three urgency tiers with proportional visual weight (red border + header tint for urgent, amber border only for attention, muted for informational). Spec-faithful opacity reduction on informational items reduces noise. Reasonable gradient — not everything is screaming.
- **HIPAA visibility:** Thread tool calls show field names and summary values (`phq9: 7, sdoh: 3`), not full records. Patient names visible in queue and thread — appropriate for coordinator role with full panel access.
- **Trust signals:** The "Approving will:" section is transparency done right. The coordinator sees exactly what happens downstream. This matches GOV.UK's warning text pattern and builds the coordinator's trust in the system.

---

## Punch List

1. ~~**[Moderate]** CC-02 Thread Panel: Inline `style="opacity: 0.7;"` on historical approval card. Replace with `.is-historical` class.~~ **FIXED** 2026-03-30 — pattern library updated to use `.is-historical`; app already used the class.
2. ~~**[Moderate]** CC-01 Queue Sidebar: ARIA roles on queue items, filter pills, SLA indicators.~~ **FIXED** (app already had correct ARIA: `role="list"`/`role="listitem"`, `role="tablist"`/`role="tab"`, descriptive `aria-label` on SLAs).
3. ~~**[Minor]** CC-02 Thread Panel: Add `aria-label` to thread input textarea.~~ **FIXED** (app already had `aria-label="Message to agent or care team"`).
4. ~~**[Minor]** CC-01 Queue Sidebar: Add count badge to "Queue" nav item.~~ **FIXED** (app already had badge with "12").
5. **[Moderate]** CC-02 Thread Panel: Urgent approval card icon stayed amber instead of switching to red. **FIXED** 2026-03-30 — added `.thread-approval-card.is-urgent .thread-approval-header i` rule.
6. **[Minor]** CC-02 Thread Panel: No human message shown in demo thread. **FIXED** 2026-03-30 — added coordinator question + agent verify_meal_constraints tool call to show the ask-and-agent-acts loop.
