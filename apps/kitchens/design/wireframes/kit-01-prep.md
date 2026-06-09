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
shells: []  # MVP uses a minimal shell-free layout — see Layout Structure below
---

# kit-01-prep: Kitchen prep stage — aggregate item totals

**Application:** Kitchens App (UConn MVP)
**Use Case(s):** KIT-001 (see aggregate prep list), KIT-002 (mark prep progress where it gates handoff)
**User Type:** Kitchen staff (operator role; Greens 'n' Things partner)
**Device:** Desktop primary (≥1280px); tablet supported (≥720px)
**Route:** `/?stage=prep` (default for the kitchens app)

The staff member walks up to the counter laptop / tablet at shift start and sees what they need to prep today. The aggregate is grouped by item + modifier so the same prep run produces all instances of an item; per-patient identity does not appear at this stage (PHI minimization).

---

## Page Purpose

Surface today's prep load as an aggregate that maps to physical kitchen work: how many of each thing to make, including any per-item modifiers (e.g., "no onions"). Let the staff member mark items as fully prepped, so the packing stage knows what's ready. Optimize for **glance-and-act** during a busy shift, not for analytics.

---

## Layout Structure

### Shell

No persistent shell at MVP — the kitchens app is one route with a top bar + content region, no sidebar. (Future: a shell primitive may be promoted from this app once a second surface earns its place.)

### Header Zone

- Cena brand mark (left): `logo-cenahealth-teal.svg`, 32px tall
- Period label (center-left, prose): "Orders due {window-label}" — `window-label` is bound from the order data (cadence-dependent; brief Open Questions). MVP placeholder: "Orders due Wednesday delivery."
- Stage switch (center): two-button segmented control — **Prep** (active) | **Packing**
- Identity (right): "Greens 'n' Things — Hartford" (one kitchen at MVP; future multi-kitchen makes this dynamic)

Header is `border-b border-sand-200`, `py-4 px-6`, `bg-white`.

### Content Zone

#### Aggregate prep list

Primary block. List of rows, one per item-modifier group. Each row contains:

- **Item name** (Body/01 Semibold) — e.g., "Pollo guisado"
- **Quantity** (large numeric, Heading/03 weight) — "× 8"
- **Modifier annotation** (Body/03 muted, secondary line if present) — "2 no onions"
- **Prep status toggle** (right-aligned) — button states: `Not started` (default, btn-outline) → `Prepping` (btn-primary, pressed state) → `Done` (btn-success with check icon)

Rows are 64px+ tall (target-size minimum for wet-hands tap), `border-b border-sand-100` between rows.

Section header above list: Heading/04 "Today's prep — {N} items total" where N is the sum of all quantities. Updates live as orders arrive.

#### Status summary strip (below list)

`stat-group` (existing PL primitive) with three counts:

- **Items to prep** — items not yet `Done`
- **Items in prep** — items with `Prepping` status
- **Items done** — items with `Done` status

Visible at all times above the fold (no scrolling required to see the summary).

#### Advance affordance

`btn-primary` button at bottom of content: **"Move to packing →"**. Disabled state when no items are `Done`. Enabled when ≥1 item is `Done`. Reasoning: staff may want to start packing items that are done while other items continue prepping; the rigid "all done before pack" pattern was rejected at the IA stage.

### Footer Zone

None at MVP.

---

## Interaction Specifications

- **Toggle item status:** tap the right-aligned status button → cycles `Not started` → `Prepping` → `Done`. Stays in `Done` once reached; long-press to revert (defensive against fat-finger).
- **Advance to packing:** tap `Move to packing →` → URL changes to `?stage=pack` → packing wireframe (kit-02) loads.
- **Stage switch (header):** tap `Packing` in header segmented control → URL changes to `?stage=pack`. Tap `Prep` returns. State persists across switches (a row marked `Prepping` stays so).
- **New order arrived mid-prep:** non-intrusive toast appears at bottom of content: "{N} new orders added — refresh totals". Tap to merge into the visible aggregate; auto-merges after 10 seconds if untapped.
- **Long-running shift:** surface state persists across page reloads (server-side state, not local storage).

---

## States

### Default (orders present)
Aggregate list populated with rows; status summary populated; advance button enabled if ≥1 done.

### Empty
"No orders in prep right now." — calm message, no exhortation. Common between shifts; not an error.

### Loading
Skeleton rows (3-5) matching row structure; no spinner.

### Error — order ingestion failed
Banner above the list: "Orders aren't loading right now. {detail}. Reach Cena ops on Slack #{channel} or call {number}." Surface still shows the most recent known good state below.

### Error — update conflict (two staff members marked same item)
Toast: "{item} status was just updated by someone else. Refreshed." Last write wins; surface re-renders with the conflicting value.

### Branch — overdue (delivery window getting close, items still prepping)
Status summary strip turns amber if `Items to prep > 0` within {threshold} of delivery window. Threshold TBD with kitchen partner.

---

## Render-time assertions

For slot-22 render-check to verify:

- Header height + content padding total ≤ 120px (the prep list must be visible above the fold on a 1280×720 tablet)
- Each prep row is ≥56px tall (touch-target minimum)
- The `Move to packing →` button is below the fold ONLY when the list overflows; if list is short, button is visible without scroll
- No food images (cap-17 G12 enforcement)
- No first-name patient identity strings in the rendered DOM (PHI check)

---

## Novel primitives (delta-review candidates)

None known. Existing PL primitives expected to cover: button-group (segmented control for stage switch), stat-group (status summary), btn-primary/outline/success (status toggles + advance), basic list composition.

Slot-21 build-tasks confirms via wireframe-vs-PL delta review.

## Proposed use cases

- **KIT-001** — Kitchen staff views the aggregate prep list at shift start, sees what needs to be made in totals (PHI minimized — no patient identity at prep stage).
- **KIT-002** — Kitchen staff marks each item's prep progress (Not started → Prepping → Done) where the progress change gates downstream (packing) action.
