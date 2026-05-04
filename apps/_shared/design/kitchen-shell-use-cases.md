# Kitchen — Shell Use Cases (Universal Shell + Kitchen Minimums)

**Application:** Kitchen App
**Persona:** Kitchen Staff (Carlos, lead cook at partnered kitchen)
**Device:** Desktop primary (kitchen workstation); tablet realistic
**Status:** Phase 1–3 complete; Gate 1 ready
**Parent:** [`apps/_shared/design/universal-shell-use-cases.md`](universal-shell-use-cases.md)
**Restoration note:** Kitchen app was archived 2026-04-23 to `archive/inactive-apps/kitchen/`. Shell design proceeds now; **Stage 5 (build) requires `git mv archive/inactive-apps/kitchen apps/kitchen` first** — see `archive/inactive-apps/README.md`. Living here under `_shared/` until restoration.

This doc covers the kitchen's slice of the universal shell + the **minimum features that make the app feel like the kitchen app** rather than chrome with placeholders. Per Gate 1 G1.2: *orders queue + one open order with packing slip + status thread (all new).*

---

## Phase 1: Discovery

### Persona — Kitchen Staff (Carlos)

- Lead cook at partnered kitchen; physical-work role; not at a computer continuously
- Most restricted PHI access — sees what to make, where to deliver, allergen flags only
- Primary mode: status progression — pending → prepping → packed → quality_checked → dispatched → delivered
- Desktop primary (workstation in kitchen, fixed location); tablet realistic for moving between stations; mobile occasional for delivery confirmation
- Thinks in **batches by recipe** ("make 18 chicken bowls"), not in patients
- The Kitchen App data scope is structurally different from Admin/Provider — kitchen never sees clinical data because the data model doesn't expose it, not because of a permission toggle

### User goals (kitchen shell-level)

| Goal | Frequency | Priority |
|---|---|---|
| Open the app at start of shift and see today's load + allergen alerts | Daily, start of shift | Highest |
| Move an order through prep → pack → quality check → dispatch with one tap each | Per order, 40+/day | Highest |
| See a packing slip with the right level of detail (no clinical data) | Per order | Highest |
| Mark a delivery confirmation or flag a missed delivery | Per delivery | High |
| Flag an ingredient shortfall or allergen concern to the coordinator | Occasional | Medium |
| End of day, review what got delivered and what failed | Daily, end of shift | Medium |

### Use cases (kitchen-specific)

#### KT-SHELL-01: Open app at start of shift
**Precondition:** Orders have been generated overnight by the agent from active meal prescriptions.
**Trigger:** Carlos opens the Kitchen App.
**Flow:**
1. Shell renders three panes; agentic-shell rich base with Cena logo in nav header
2. Left pane: today's orders list grouped by status — `pending`, `prepping`, `packed`, `quality_checked`, `dispatched`, `delivered`. Each group header shows count.
3. Center pane: daily production summary — recipe-grouped breakdown ("Chicken & rice bowl × 18, Lentil soup × 14, ..."), allergen alerts ("⚠ 6 orders are nut-free, 3 are dairy-free"), grocery status ("✅ All ingredients available")
4. Right pane: empty state — "Pick an order to see its activity"
**Outcome:** Carlos sees the day's load, knows what to prep first, knows the constraints.

#### KT-SHELL-02: Open one order → see packing slip + status thread
**Precondition:** At least one order is pending.
**Trigger:** Carlos clicks an order in the left pane.
**Flow:**
1. Left pane: clicked order gets active state
2. Center pane: open order with packing slip — patient first name + last initial, delivery address, meal contents, **allergen flags prominent (red, large, impossible to miss)**, delivery window. NO diagnosis, NO insurance, NO clinical notes, NO full last name.
3. Right pane: order's status thread — chronological events (order generated, allergen flag added by agent, etc.) + status-change buttons (mark prepping / packed / quality_checked / dispatched)
**Outcome:** Carlos has full context to prep + pack + dispatch.

#### KT-SHELL-03: Progress order through statuses
**Precondition:** Order is in some status; next status is available.
**Trigger:** Carlos taps the next-status button in the right pane.
**Flow:**
1. `pending` → tap "Start prep" → status advances; left pane group counts update; status event logged in thread
2. `prepping` → tap "Mark packed" (after physical packing)
3. `packed` → tap "Quality checked" (mandatory step before dispatch)
4. `quality_checked` → tap "Dispatch" — patient receives SMS automatically
5. `dispatched` → driver confirms delivery elsewhere; status auto-advances to `delivered` or `delivery_failed`
6. Each transition is one tap; the day's progression is **felt** as the left pane reorganizes
**Outcome:** Status discipline is tactile, not bureaucratic.

#### KT-SHELL-04: Batch start by recipe
**Precondition:** Multiple orders share the same recipe.
**Trigger:** Carlos taps "Start all Chicken & rice bowls (18)" in the production summary.
**Flow:**
1. All matching orders advance to `prepping` simultaneously
2. Left pane group counts update in bulk
3. Status events logged for each
**Outcome:** Carlos batches by recipe (how he actually thinks), not by patient.

#### KT-SHELL-05: Flag an issue to coordinator
**Precondition:** An ingredient shortfall, recipe ambiguity, or allergen concern surfaces.
**Trigger:** Carlos taps "Flag issue" on a recipe or order.
**Flow:**
1. Issue dialog asks for type (shortfall / recipe / allergen / other) and a brief note
2. Issue posted to order's thread + coordinator queue
3. Coordinator notified in their queue (urgent if allergen)
**Outcome:** Coordinator handles the safety event before it reaches the patient.

#### KT-SHELL-06: End-of-day review
**Precondition:** Shift end.
**Trigger:** Carlos clicks "End of day" or the date header in the left pane.
**Flow:**
1. Center pane: daily completion summary — delivered count, failed count with reasons, quality checks, food safety log
2. Carlos confirms the day's record
**Outcome:** Day closes with a clean accounting.

### Constraints (kitchen-specific)

- **Most restricted PHI access** — packing slip uses first name + last initial only; never diagnosis, insurance, or clinical detail; data scope is structurally limited
- **Allergen prominence** is non-negotiable — red, bold, large on every surface (packing slip, order detail, daily summary). Allergen compliance is safety-critical, not a data field
- Quality check step is **mandatory** — cannot mark dispatched without quality_checked
- Performance: order list ≤2s for ~50 orders; status transitions ≤300ms perceived
- EN-only at v1; Spanish kitchen partners are realistic but bilingual deferred until partnership exists
- Tablet workflow realistic — touch targets must accommodate gloved hands (48px minimum recommended)

### Constraints inherited from universal shell

See `_shared/design/universal-shell-use-cases.md` §Phase 1 Constraints.

---

## Phase 2: Functional Specification

### Kitchen-specific functions

| Function | Notes |
|---|---|
| `loadDailyOrders(kitchenId, date)` | groups by status; counts per group; today + tomorrow preview |
| `loadProductionSummary(kitchenId, date)` | recipe-grouped breakdown, allergen alerts, grocery status |
| `loadOrder(orderId)` | center-pane order with packing-slip view |
| `progressOrderStatus(orderId, nextStatus)` | logs status_change to thread; transitions order |
| `batchStartByRecipe(recipeId, date)` | advances all matching orders in bulk |
| `flagIssue(orderId, type, note)` | posts to thread + coordinator queue |
| `confirmDelivery(orderId, outcome)` | driver/staff action; outcome ∈ {delivered, delivery_failed} |
| `loadEndOfDaySummary(kitchenId, date)` | completion summary |

### Thread message-type allowlist (kitchen)

Kitchen sees order-relevant events only:
- `system` (compact, muted)
- `status_change` (the kitchen's primary thread content)
- `human_message` from kitchen staff or coordinator (operational only)
- `notification` (system-generated kitchen-relevant)
- `agent_tool_call` / `agent_tool_result` ONLY when scoped to the order (e.g., agent flagged allergen, agent suggested substitution)
- NEVER renders clinical events; clinical data isn't in the order's thread to begin with

### Business rules (kitchen)

- Quality check is mandatory; `packed → dispatched` is not allowed; must go `packed → quality_checked → dispatched`
- Allergen concern at packing time **holds the order** — does not allow dispatch until coordinator + RDN sign off
- Recipe submissions enter `pending_nutritional_review`; RDN approval required before `active` in catalog
- Failed deliveries route to coordinator queue automatically
- Recipe ambiguity is a thread event; the recipe is updated for future orders, but kitchen makes a documented judgment call now

---

## Phase 3: Information Architecture

### Kitchen screen inventory

| Screen ID | Name | Purpose | Primary actions |
|---|---|---|---|
| KT-SHELL | Kitchen three-pane shell | Persistent layout | pane resize, item select |
| KT-LEFT | Daily orders list | Status-grouped orders + secondary nav (Recipes, Grocery, History, Settings) | click order, batch action |
| KT-CENTER-SUMMARY | Daily production summary | Recipe breakdown, allergen alerts, grocery status | read, batch start |
| KT-CENTER-ORDER | Open order with packing slip | Per-order detail + packing slip view | tap status button |
| KT-CENTER-RECIPES | Recipe catalog | Recipe list + create | create, mark inactive |
| KT-RIGHT-THREAD | Order activity thread | Status events + ops messages | log issue, see history |

### Navigation placement

- **Left pane:** today's orders list (default) → secondary nav: Recipes, Grocery, History, Settings, user menu
- **Center pane:** loads based on left selection or secondary-nav choice
- **Right pane:** order's thread when an order is open; empty otherwise

### Screen flows

```
Open app → KT-LEFT (orders rendered) + KT-CENTER-SUMMARY + KT-RIGHT-THREAD (empty)

Click order → KT-LEFT (order active) + KT-CENTER-ORDER (packing slip) + KT-RIGHT-THREAD (loaded for that order)

Tap "Start all Chicken & rice bowls (18)" in KT-CENTER-SUMMARY → KT-LEFT counts update in bulk

Tap status button in KT-RIGHT-THREAD → status_change logged + KT-LEFT regroups order

Tap "End of day" → KT-CENTER end-of-day summary
```

### Content priority per pane

**KT-LEFT (orders list):**
1. Cena logo header
2. Today's date + total order count
3. Status-grouped orders: Pending / Prepping / Packed / Quality Checked / Dispatched / Delivered with counts
4. Per-order: patient first name + last initial, meal count, delivery window
5. Tomorrow preview at the bottom
6. Secondary nav: Recipes, Grocery, History, Settings
7. User menu

**KT-CENTER-ORDER (packing slip view):**
1. Order number + patient first name + last initial
2. Delivery address (no full contact info)
3. Meal contents list
4. **Allergen flags — red, bold, large** (this is the safety-critical surface)
5. Delivery window
6. Status buttons (current status + next available status)
7. NO diagnosis, NO insurance, NO clinical notes

**KT-RIGHT-THREAD (order activity):**
1. Latest status event at bottom
2. Status events with timestamps + actor (kitchen staff name, agent, system)
3. Issue events (allergen concern, recipe ambiguity, ingredient shortfall) prominent
4. Thread input for operational messages (kitchen ↔ coordinator)
5. Thread renders order-relevant events only — strict scope

### Per-app minimum (Gate 1 G1.2)

- **Orders queue:** today's orders grouped by status (pending / prepping / packed / quality_checked / dispatched / delivered)
- **One open order with packing slip:** center pane renders the canonical packing slip — first name + last initial, delivery address, meal contents, **allergen flags prominently** (red large), delivery window, status buttons
- **Status thread:** right pane renders the order's status events + thread input for operational messages

---

## Component-gap pointer

See `apps/_shared/design/shell-component-gaps.md`. Kitchen-specific gaps:
- **Packing slip** — no PL component yet; novel composition needed (Tier 1 promote — recurring pattern across orders, brand-fidelity-weighted because allergen prominence is safety-critical)
- **Order list status-grouped** — `queue-section-header` + `queue-list` + `queue-item` cover the structure; semantic class for status-tier headers (`is-status-pending`, `is-status-prepping`, etc.) needed
- **Recipe-batch start button** — composes existing `btn-secondary` + numeric badge; inline carve-out acceptable until 2nd consumer
- **Daily production summary card** — composes `card` + `data-table` + `alert-warning` for allergen alerts; novel composition

---

## Open questions for Aaron at Gate 2

1. **Restoration timing:** Stage 5 (build) requires kitchen app restored from `archive/inactive-apps/kitchen/`. Does Aaron want restoration to happen as part of this pipeline run (before build), or as a prerequisite gate before scheduling build?
2. **Tablet vs. desktop primary:** kitchen workstations are realistic on either. Recommend designing for desktop primary + tablet (≥768px) supported, with the same agentic-shell rich base since both share the screen real estate.
3. **Allergen-flag visual treatment:** the brand-taste rule says primary teal is reserved for commitments, not warnings. Allergen flags should use the `rose` or `gold` family per the 9-color tag-semantic palette. Confirm `rose` for severe (nut-free, gluten-free + dairy-free combo) and `gold` for single-restriction warnings — or all-`rose` for any allergen present.
4. **Kitchen + provider apps both rely on agent-rich shell:** confirm the same agentic-shell rich base (Ava avatar in chat header, agent-working indicator) applies to kitchen even though kitchen's primary mode is status-progression more than agent-conversation. Recommend yes for consistency; the chat input becomes a low-frequency surface but is available.
