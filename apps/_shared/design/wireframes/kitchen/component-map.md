# Component Map: Kitchen App — Universal Shell Pipeline (2026-05-04)

**Date:** 2026-05-04
**Source wireframes:**
- `apps/_shared/design/wireframes/kitchen/kt-shell-flow.md`
- `apps/_shared/design/wireframes/kitchen/shell-kt-kitchen.md`
- `apps/_shared/design/wireframes/kitchen/kt-01-orders-with-packing-slip.md`
**components.css read:** 2026-05-04 (fresh — packing-slip confirmed absent; no existing entry)
**COMPONENT-INDEX.md read:** 2026-05-04 (fresh)

> Kitchen app is archived at `archive/inactive-apps/kitchen/`. Design proceeds here in `_shared/`. Build waits on `git mv archive/inactive-apps/kitchen apps/kitchen`.

---

## Component Inventory Summary

**Existing components used:** 22
**New components required:** 2 (`packing-slip` primitive + `[NEW COMPOSITION: status-grouped queue header]`)
**Utility-only patterns:** 3

> `status-grouped queue header` is a Tier 1 composition that extends `queue-section-header` with `is-status-*` modifiers. `packing-slip` is a Tier 1 primitive. Both require PL fragment authoring before kitchen app can build. `packing-slip` additionally requires the 4-expert panel.

---

## New Components Required

| Component | Spec File | Priority | Preline Base |
|-----------|-----------|----------|--------------|
| `packing-slip` (Tier 1 novel primitive) | `apps/_shared/design/new-components/packing-slip.md` | Required for launch | No — Haven-native |
| `[NEW COMPOSITION: status-grouped queue header]` — `is-status-*` modifiers on `queue-section-header` | Inline extension of existing PL fragment; no separate spec file needed | Required for launch | No |

---

## Screen: shell-kt-kitchen (Persistent Kitchen Shell)

**Wireframe source:** `wireframes/kitchen/shell-kt-kitchen.md`

### Recipe

1. **Shell root:** `agentic-shell` — inherits universal shell; right pane collapsible-by-default below 1240px
2. **Left pane — Orders status-grouped:**
   - `queue-sidebar` → `queue-sidebar-brand` → `nav-header` + `nav-logo` (Cena wordmark)
   - `queue-sidebar-body`:
     - Today date + total count row: Body/02 Semibold + `text-link` "Tomorrow (preview)"
     - Six status sections — each: `queue-section-header` + new `is-status-*` modifier `[NEW COMPOSITION]`:
       - `queue-section-header.is-status-pending` — "Pending" (sand color family)
       - `queue-section-header.is-status-prepping` — "Prepping" (lime family)
       - `queue-section-header.is-status-packed` — "Packed" (cyan family)
       - `queue-section-header.is-status-quality_checked` — "Quality Checked" (cyan family)
       - `queue-section-header.is-status-dispatched` — "Dispatched" (gold family)
       - `queue-section-header.is-status-delivered` — "Delivered" (emerald family)
     - Each section: `queue-list` → `queue-item` (kitchen variant — name + last initial + `badge-pill` meal count + delivery window + optional `severity-badge severity-high` "⚠ Nut-free" allergen indicator)
   - Below: `divider` → `sidebar-nav-list` → `sidebar-nav-item` × 4 (Recipes / Grocery / History / Settings)
   - User menu pinned bottom: `avatar-sm` + `hs-dropdown`
3. **Center pane — Daily production summary (default) / packing slip (order selected):**
   - Default: `card` → `card-header` "Daily production · [date]" + `card-body`
     - `data-table` — recipe-grouped rows (name + count + status badges)
     - Per recipe: `btn-secondary btn-sm` "Start all [recipe] (N)" — triggers `overlay-confirm-dialog`
     - `alert-warning` — allergen callout (gold family + rose for multi)
     - `alert-success` — grocery status (or `alert-warning` for shortfalls)
   - Order selected: `record-header` + `[NEW COMPONENT: packing-slip]` (see packing-slip spec) — see kt-01 recipe below
4. **Right pane — Order status thread + status-progression buttons (collapsible):**
   - `thread-panel` (kitchen allowlist: `status_change`, `system`, `human_message` ops, scoped `agent_tool_*`, `notification`)
   - Status-progression action row at top of pane (vertical button stack — see kt-01 recipe)
   - Below: chronological thread events + `prompt-input-container` placeholder "Add a note for the order…" + `btn-outline btn-sm` "Flag issue"
5. **Empty state (no orders):** `data-empty-state` — "No orders today" + body copy
6. **Loading:** `skeleton` rows all three panes
7. **Error:** per-pane `alert-error` + "Try again"

### Data Bindings

- Status sections: `*ngFor` over status groups; `is-status-*` class bound to `order.status`
- `queue-item` allergen indicator: conditional render of `severity-badge severity-high` if `order.allergen_flags.length > 0`
- Batch-start confirm: `overlay-confirm-dialog` — title and body are templated from recipe name + count
- Right pane collapse: `user_pane_prefs.kitchen_right_pane_collapsed` — per-user, per-kitchen-app; persisted on toggle

### Preline Interactions

- `panel-splitter.js` — drag-resize; right pane only inline at ≥1240px
- `hs-dropdown` on user menu
- `data-hs-overlay` — confirm dialogs (batch-start; flag-issue modal)
- `data-hs-collapse` — `thread-msg-tool` rows (default collapsed)

---

## Screen: kt-01-orders-with-packing-slip (Worked Example)

**Wireframe source:** `wireframes/kitchen/kt-01-orders-with-packing-slip.md`

### Recipe

1. **Shell:** `shell-kt-kitchen`; active queue item: Order #4287 (Maria R.) in Prepping section
2. **Left pane:** status-grouped orders; Order #4287 `.active` in `is-status-prepping` section
3. **Center pane — Packing slip:**
   - `record-header` → title "Order #4287 · Maria R." (Lora Heading/01) + `record-header-trailing` (`badge-pill` with status) + `record-header-meta` (generated by / meals count / delivery window)
   - **`[NEW COMPONENT: packing-slip]`** — canonical kitchen order view:
     - `packing-slip` container (sand-100 card-like envelope, `border-radius/md`, `elevation/02`, `p-6`)
     - `packing-slip-header` — patient first name + last initial (Lora Heading/02) + delivery address (Body/02) + delivery window (Body/02 Semibold)
     - `packing-slip-allergens` — flex row of `packing-slip-allergen-flag` items (32px+ tall pills, `bg-rose-16` + `text-rose-04` + `border-rose-14` + `fa-triangle-exclamation` + uppercase label)
       - "⚠ NUT-FREE" / "⚠ DAIRY-FREE" / "⚠ GLUTEN-FREE" / combos
     - `packing-slip-meals` — vertical `packing-slip-meal` items (meal name Body/02 Semibold + portion Body/04 muted + recipe ID Body/04)
     - `packing-slip-instructions` (optional) — Body/03 muted block
   - **Full spec:** `apps/_shared/design/new-components/packing-slip.md`
4. **Right pane — Status thread + progression buttons:**
   - Status-progression action row (vertical):
     - Current-state chip: active status label (e.g., "Prepping")
     - Next-status: `btn-primary btn-lg` with label + icon (e.g., "Mark packed" + `fa-box`) — 56px+ tall for gloved-hand UX
     - Other states: `btn-outline btn-sm` (or `aria-disabled="true"` if not yet reachable)
     - Dispatch: `btn-primary btn-lg` "Dispatch" disabled until Quality Checked; triggers `overlay-confirm-dialog` (no-undo)
   - Thread events (newest at bottom):
     - `thread-msg-system` — order generation + Carlos's status-change events + coordinator notes
     - `thread-msg-tool` (collapsed) — Ava allergen checks + other tool output
     - `thread-msg-human` — coordinator operational notes (kitchen allowlist permits)
   - Bottom: `prompt-input-container` "Add a note for the order…" + `btn-outline btn-sm` "Flag issue"
5. **Allergen-hold state:** `alert-warning` persistent in center; "Dispatch" `aria-disabled="true"` + tooltip "Hold until coordinator + RDN sign off"
6. **Loading:** packing-slip skeleton (`skeleton` header + `skeleton-text` blocks) + thread row skeletons; action buttons in skeleton state
7. **Error:** `alert-error` per-pane; status-progression buttons disabled until loaded

### Data Bindings

- `packing-slip` data: `order.patient.first_name` + `order.patient.last_initial` (never full last name / MRN / clinical data)
- `packing-slip-allergen-flag` items: `*ngFor` over `order.allergen_flags`; always render all flags — never collapsed
- Status-progression button enabled/disabled: bound to `order.status` + business-rule DAG (pending → prepping → packed → quality_checked → dispatched)
- Dispatch confirm dialog SMS copy: templated by Ava in patient language pref

### Preline Interactions

- `data-hs-overlay` — Dispatch confirm dialog; Flag-issue modal
- `data-hs-collapse` — `thread-msg-tool` expand/collapse
- Status-progression: vanilla click handler + API call; no Preline needed

---

## Utility-Only Patterns

- `grid` and responsive column utilities for daily production summary recipe grouping — one-off layout, not a semantic class
- `gap-4 p-6` direct on packing-slip container (subsumed by the new `packing-slip` semantic class once built)
- `aria-disabled="true"` + tooltip pattern on Dispatch button (allergen-hold) — HTML attribute + vanilla JS tooltip; no semantic class
