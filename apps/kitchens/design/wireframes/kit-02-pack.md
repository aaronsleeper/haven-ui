---
slot: 11
slot-name: wireframes
project: cena-uconn-kitchens-app
created: 2026-06-09
status: draft
consumes:
  - apps/kitchens/design/brief.md
  - apps/kitchens/design/ia.md
  - apps/kitchens/design/flows/meal-fulfillment.md
shells: []  # same minimal shell as kit-01-prep
---

# kit-02-pack: Kitchen packing/handoff stage — per-patient boxes

**Application:** Kitchens App (UConn MVP)
**Use Case(s):** KIT-003 (assemble per-patient boxes for delivery handoff)
**User Type:** Kitchen staff (operator role)
**Device:** Desktop primary; tablet supported
**Route:** `/?stage=pack`

The prep run produced bulk meals; now the staff member breaks the bulk down into per-patient boxes for the delivery party to collect. Each box gets a packing slip with patient last name + delivery address + the items in that order. PHI threshold is lifted from prep stage because per-box identity is operationally necessary at this stage (same shape as a restaurant ticket — the packer needs to know what to put in the box).

---

## Page Purpose

Surface today's per-patient boxes as a list of cards, each card a packing slip. Staff assembles each box from the prepped items and marks it ready for handoff. The handoff event itself happens off-surface (delivery driver picks up physical boxes).

---

## Layout Structure

### Shell

Same as kit-01 — no persistent left sidebar; top bar + content region.

### Header Zone

Identical to kit-01 except the stage-switch segmented control: **Prep** | **Packing** (active).

### Content Zone

#### Packing-slip cards

Primary block. Grid of cards (1-2 columns at ≥1280px, 1 column at <1024px). Each card is a packing slip for one order. Card contents:

- **Card header:**
  - Patient last name (Body/01 Semibold) — e.g., "Rivera"
  - Delivery window (Body/03 muted) — e.g., "Delivery by 5pm Wed"
  - Box status badge (right-aligned): `Ready to pack` (default) | `Packed` (success) | `Out for delivery` (info — appears after handoff event)
- **Card body:** item list — one line per item in this box:
  - Item name (Body/02)
  - Quantity (Body/02 right-aligned) — e.g., "× 2"
  - Modifier annotation (Body/04 muted, secondary line if present) — "no onions"
- **Card footer:**
  - Delivery address (Body/04 muted, single line truncated with full-text tooltip on hover)
  - Action button (right-aligned): `Mark packed` (when status is `Ready to pack`) → button disappears once status is `Packed`

Cards are `border border-sand-200 rounded-md`, `bg-white`, `p-4`. Hover state: `border-sand-300`. Each card target-size minimum: 200px tall.

Section header above grid: Heading/04 "Packing — {N} boxes" where N is total order count.

#### Status summary strip

Mirror of kit-01's strip but for packing:

- **To pack** — boxes with `Ready to pack`
- **Packed** — boxes with `Packed`
- **Out for delivery** — boxes after handoff event

Pinned at top of content region (above the grid).

#### Handoff affordance

`btn-primary` at bottom of content: **"All boxes ready — confirm pickup"**. Disabled state when any box is still `Ready to pack`. Enabled when all are `Packed`. On tap: status badges across all boxes shift to `Out for delivery`; surface enters post-handoff state.

### Footer Zone

None at MVP.

---

## Interaction Specifications

- **Mark box packed:** tap `Mark packed` on a card → status badge changes to `Packed`; button hides; status-summary counts update; if last box → handoff affordance enables.
- **Stage switch (header):** tap `Prep` → returns to kit-01.
- **Handoff confirm:** tap "All boxes ready — confirm pickup" → all status badges → `Out for delivery`; affordance disappears; surface shows post-handoff message ("Boxes handed off at {time} — see you tomorrow").
- **Mid-shift order edit** (patient cancelled or changed): affected card surfaces a calm "this changed" indicator with the new content; staff acks before continuing.
- **Print packing slips:** browser-native print (Cmd-P / Ctrl-P); page has print-CSS that renders one slip per page (deferred — verify in slot 22 build).

---

## States

### Default (orders to pack)
Card grid populated; status summary populated; handoff button visible (disabled until all packed).

### Empty
"No orders ready to pack yet." — staff may be in prep stage; calm message, not an error.

### Loading
Skeleton cards matching card structure; no spinner.

### Error — order ingestion
Same banner pattern as kit-01.

### Error — discrepancy (packing slip data doesn't match prep totals)
Affected card shows an inline calm warning row inside the card: "Heads up: {item} count looks different from prep. Double-check the box." Non-destructive; staff judges.

### Post-handoff state
After "confirm pickup": cards remain visible (audit/recall during shift) with `Out for delivery` badges. Surface shows a calm footer message ("Boxes handed off at {time}. Next ordering window opens {next-window}.")

### Branch — partial handoff (driver only takes some boxes)
Future scope; defer until partner workflow is clear (some drivers do "rolling pickup" where they take a subset and return for the rest).

---

## Render-time assertions

For slot-22 render-check to verify:

- Each card is ≥200px tall (touch-friendly + reduces accidental "Mark packed" taps on adjacent cards)
- Card grid renders 2 columns at ≥1280px width; 1 column at <1024px
- No first-name strings in patient-identifier slots (PHI check — last name only)
- No food images in card bodies (cap-17 G12)
- Handoff affordance is disabled when any card has `Ready to pack` status

---

## Novel primitives (delta-review candidates)

None known. Existing PL primitives expected to cover: card / card-header / card-body, btn-primary, status-badge, basic grid layout, stat-group, btn-disabled state.

Slot-21 build-tasks confirms via wireframe-vs-PL delta review.

## Proposed use cases

- **KIT-003** — Kitchen staff assembles a per-patient box from prepped items, references the packing slip for what items belong, marks the box packed; confirms pickup when all boxes ready.
