# shell-kt-kitchen: Kitchen Shell (Universal Agentic Base)

**Application:** Kitchen App
**Use Case(s):** KT-SHELL-01 through KT-SHELL-06 (`apps/_shared/design/kitchen-shell-use-cases.md`)
**User Type:** Kitchen Staff (Carlos)
**Device:** Desktop primary (kitchen workstation); tablet (≥768px) supported
**Route:** Persistent shell wrapping every kitchen route

This wireframe specifies kitchen's slice of the universal shell — the `agentic-shell` rich base specialized for the kitchen's status-driven order workflow. Inherits structure from `apps/_shared/design/wireframes/shell-universal-agentic.md`. Per Gate 2-prep decision 2, the right pane (status thread) is **collapsible-by-default below 1240px** because kitchen's primary mode is status-progression, not agent-conversation.

---

## Page Purpose

Render the persistent three-pane workspace for Carlos. Left = today's orders status-grouped + daily preview + secondary nav. Center = daily production summary by default; orders, packing slips, recipes, and end-of-day summary on demand. Right = order activity thread (status events + ops messages) when an order is open; empty + collapsed-by-default below 1240px otherwise. Carlos's day is felt as orders moving through statuses; the UI gives that progression weight.

---

## Layout Structure

### Shell

Inherits from `shell-universal-agentic.md`:
- `agentic-shell` flex root at `height: 100vh`
- Three panes with two `panel-splitter` handles
- 260px default left, flex center, 640px default right (480-800 range)
- Right pane **collapsible-by-default below 1240px** (Gate 2-prep decision 2): renders as inspector sheet on demand below threshold; toggle button in center pane header
- Surface: chrome (sand-100 outer) → page (sand-50 panes) → solid white inputs

### Header Zone — left pane top

- **Component:** `nav-header` + `nav-logo`
- Cena Health wordmark (constant; never substituted)

### Content Zone

#### Left pane (`panel-nav`) — Daily orders, status-grouped

- **Component:** `queue-sidebar` + `queue-sidebar-brand` + `queue-sidebar-body`
- Today's date + total order count at top: Body/02 Semibold "Tuesday, May 3 · 47 orders" + small `text-link` "Tomorrow (preview)"
- Six order sections (status-grouped) — uses `queue-section-header` extended with new `is-status-*` modifiers `[NEW COMPOSITION: status-grouped queue header — extends queue-section-header with .is-status-pending / .is-status-prepping / .is-status-packed / .is-status-quality_checked / .is-status-dispatched / .is-status-delivered modifiers]`:
  - Pending (count) — `is-status-pending` (sand)
  - Prepping (count) — `is-status-prepping` (lime — "in-progress")
  - Packed (count) — `is-status-packed` (cyan — "informational")
  - Quality Checked (count) — `is-status-quality_checked` (cyan)
  - Dispatched (count) — `is-status-dispatched` (gold — "attention until delivered")
  - Delivered (count) — `is-status-delivered` (emerald — "complete")
- Within each section: `queue-list` of `queue-item` rows
  - Each `queue-item` (kitchen variant — composed from existing primitives): patient first name + last initial (e.g., "Maria R.") + `badge-pill` showing meal count (e.g., "3 meals") + delivery window (e.g., "11:00-1:00")
  - Allergen indicator on `queue-item`: small `severity-badge severity-high` "⚠ Nut-free" pill if any allergen flag present
  - Active state: `.active` (`aria-current="true"`) on selected order
- Below: `divider` + secondary nav: Recipes / Grocery / History / Settings (`sidebar-nav-list`)
- User menu pinned at bottom
- Surface: pane = translucent white over chrome ground

#### Center pane (`panel-chat`) — Daily production / order / catalog

- **Component:** envelope is `panel-chat`; inner content varies by view
- **Default (no order selected):** Daily production summary (kt-summary, deferred to later wireframe)
  - `card` with `card-header` "Daily production · Tuesday, May 3" + `card-body`
  - Inside: recipe-grouped breakdown — `data-table` with rows per recipe (recipe name + count + status badges)
  - Per recipe: `btn-secondary btn-sm` "Start all Chicken & rice bowls (18)" inline action — batch-start affordance per Gate 1 use case KT-SHELL-04
  - Allergen alerts: `alert-warning` callout "⚠ 6 orders are nut-free, 3 are dairy-free" (gold + rose families per `DESIGN.md` 9-color tag-semantic palette)
  - Grocery status: `alert-success` "✅ All ingredients available" or `alert-warning` if shortfalls
- **Order selected:** `record-header` (order number + patient first name + last initial) + packing slip body — see kt-01 wireframe
- **Recipes / Grocery / History from secondary nav:** routes to those screens (deferred to later wireframe pass)
- **End of day clicked:** end-of-day summary loads here (deferred to later wireframe pass)
- Surface: page (sand-50)

#### Right pane (`panel-content`) — Order status thread (collapsible)

- **Component:** `thread-panel` configured with **kitchen allowlist** — `system`, `status_change` (primary content), `human_message` (operational kitchen↔coordinator), scoped `agent_tool_call` / `agent_tool_result` (allergen flags, substitution suggestions only), `notification`
- **Collapsed-by-default below 1240px:** renders as `overlay-bottom-sheet` or right-side slide-in panel on demand; toggle button in record-header
- ≥1240px: renders inline as right pane
- Active section: status-progression buttons (the kitchen's primary action surface) — see kt-01 wireframe
- Below: chronological status events (newest at bottom) + thread input for ops messages
- Thread input is **not** primary at v1 (kitchen rarely composes free-text); render `prompt-input-container` but acknowledge low-frequency use
- Surface: page (sand-50); border-left from splitter (when inline)

### Footer Zone

No persistent footer at desktop. Sticky CTAs (none at shell level) live inside the center record viewer when needed.

---

## Interaction Specifications

### Open app
- **Trigger:** Carlos opens kitchen app
- **Feedback:** Shell renders; left = orders grouped by status; center = daily production summary; right = empty (collapsed below 1240px)
- **Navigation:** Stays at /
- **Error handling:** If orders fail to load, `alert-error` at top of left pane with retry; production summary still renders if cached

### Click an order in left pane
- **Trigger:** Click any `queue-item` in any status section
- **Feedback:** Item gets `.active`; subtle teal left-border
- **Navigation:** Center loads packing slip view; right loads order's status thread (auto-opens on tablet/mobile if collapsed)
- **Error handling:** Per-pane error states

### Tap status progression button (in right pane)
- **Trigger:** Tap "Start prep" / "Mark packed" / "Quality checked" / "Dispatch" — the next-status button per current state
- **Feedback:** Button briefly inverts; status_change writes; left pane regroups order to new status section
- **Navigation:** Order remains active; center stays on packing slip; right thread shows new `status_change` event
- **Error handling:** Status-change failure → `alert-error` inline below buttons + retry; order stays in current status

### Click batch-start in production summary [REVISED]
- **Trigger:** Click `btn-secondary btn-sm` "Start all [recipe] (18)" in center pane
- **Feedback:** `overlay-confirm-dialog` confirms — title "Start prep on 18 orders?" + body "All 18 orders advance to Prepping. There's no undo."
- **Navigation:** On confirm, all matching orders advance to Prepping; left pane regroups in bulk; center summary updates counts
- **No undo** per Gate 2 decision 1 (kitchen status changes are immediate-and-final). The confirm dialog is the only opportunity to cancel before advancement.
- **Error handling:** Per-order failures listed in toast; batch operation reports successes + retries

### Click "Flag issue"
- **Trigger:** Click "Flag issue" affordance on an order or recipe
- **Feedback:** `overlay-modal` with issue type select (`combobox`) + note textarea
- **Navigation:** On submit, issue posts to order's thread + coordinator queue; modal closes; toast confirmation
- **Error handling:** Per-modal validation

### Click "End of day"
- **Trigger:** Click `text-link` "End of day" in left pane header (small affordance near date)
- **Feedback:** Link active state
- **Navigation:** Center loads end-of-day summary view (deferred to later wireframe pass)

### Drag to resize panes
- Per universal shell spec; right pane drag clamped 480-800 (only relevant when right pane is inline at ≥1240px)

### Toggle right-pane visibility (≥1240px)
- **Trigger:** Tap collapse/expand button in record-header
- **Feedback:** Right pane animates closed/open; center reflows
- **Persistence:** Per-user (kitchen-specific pref so other apps' right-pane prefs are independent)

---

## States

### Default (loaded, no order selected)
- Left: orders status-grouped (47 total); user's eye lands on Pending at top
- Center: daily production summary + allergen alerts + grocery status
- Right: empty (collapsed at <1240px)

### Default (order selected)
- Left: orders status-grouped; selected order has `.active`
- Center: packing slip for selected order (per kt-01)
- Right: status thread + status-progression buttons (auto-expanded if user clicked through)

### Loading
- Left: 5-8 `skeleton` rows under skeleton section headers
- Center: `skeleton` `card` for production summary or order packing-slip
- Right: 3-4 `skeleton` rows for thread (when applicable)

### Error State
- Per-pane `alert-error` with retry; other panes continue functioning

### Empty State (no orders today) [REVISED]
- Left pane body: `data-empty-state`
  - Heading: "No orders today"
  - Body: "We'll surface tomorrow's load when it's ready."
- Center: empty production-summary card with same positive copy

### Allergen-flag holding state
- Order with allergen concern at packing time: `queue-item` shows persistent red `severity-high` badge; cannot advance to Dispatched until coordinator + RDN sign off (per kitchen-shell-use-cases.md business rule)
- Status-progression button row: "Dispatch" disabled with tooltip explaining the hold

### Right-pane collapsed (≥1240px, user-preference)
- Pane width = 0; toggle button visible in record-header to re-open
- Splitter handle hidden when collapsed

---

## Accessibility Notes

- Left = `<aside aria-label="Orders sidebar">`; center = `<main aria-label="Main content">`; right = `<aside aria-label="Order activity thread">`
- Tab order left → center → right
- No focus trapping in shell (per WCAG 2.1.2)
- Touch targets 44px minimum; status-progression buttons 48px for tablet/gloved-hand-friendly hit zones
- Color-as-status: every status tier and severity carries icon + text label, never color alone
- Allergen `severity-high` badge text reads "⚠ Nut-free" (label + glyph + color, all three signals)
- Decorative status icons `aria-hidden="true"`; status spans `aria-label` name the state ("Status: prepping")
- Live regions for new orders / status changes: `aria-live="polite"` on left pane body and right pane body

## Bilingual Considerations

- Kitchen app is **EN-only at v1** per kitchen-shell-use-cases.md (Spanish kitchen partners realistic but bilingual deferred)
- Future Spanish adoption is a string update, not a layout change

## Open Questions

- Right-pane collapsed-by-default below 1240px (Gate 2-prep decision 2): when user expands the pane manually, does the preference persist for next session, or always re-collapse on shell load? Recommend persist.
- Status-progression buttons: should they be in the right pane (current spec) or in the center pane near the packing slip? Recommend right pane — keeps decisions in the right pane consistent with coordinator/provider model. Confirm.
- Allergen severity treatment: per `DESIGN.md` 9-color tag-semantic palette, severity uses `rose` (severe — multi-allergen) or `gold` (single-restriction warning) families. Spec uses `severity-badge severity-high` (red/rose). Confirm — and confirm whether single-restriction warnings (e.g., gluten-free only) drop to `severity-medium` (gold) or stay at `severity-high` for safety. Recommend: **all allergen flags use severity-high (rose)** at v1 for safety simplicity; revisit if signal-to-noise is bad.
- "Daily production summary" composition: lives inline in the kitchen app at v1 (Tier 2 inline carve-out per shell-component-gaps.md); promote when 2nd consumer needs the same shape. Confirm acceptable.
- Quality-checked step: mandatory before Dispatch per business rule. Should the UI render Quality Checked as a separate column in left pane (currently spec'd) or fold it into Packed visually? Recommend separate column — it's a load-bearing mandatory gate; visibility matters.

---

## New Components Flagged

### `[NEW COMPOSITION: status-grouped queue header]`
- **Anatomy:** Extends shipped `queue-section-header` with new `is-status-*` modifiers — `is-status-pending`, `is-status-prepping`, `is-status-packed`, `is-status-quality_checked`, `is-status-dispatched`, `is-status-delivered`
- **Why new:** Kitchen orders group by status (pending → delivered), not urgency (urgent / attention / info). Same shape as urgency-grouped header; different semantic meaning.
- **Tier:** Tier 1 promote — recurring across kitchen orders; same shape may apply to driver flow if v1.1 ships
- **Brand-fidelity:** medium — color choices map to existing 9-family palette (sand / lime / cyan / gold / emerald)

### `[NEW COMPONENT: packing-slip]` (flagged here; full spec in kt-01)
- Universal kitchen primitive needed for any open-order view in the kitchen app
- See kt-01 wireframe for full specification + brand-fidelity-weighted 4-expert panel requirement
