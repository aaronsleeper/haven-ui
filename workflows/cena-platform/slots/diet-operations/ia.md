---
slot: 7
slot-name: information-architecture (per-surface — Diet Operations)
primary-author: IA Designer
project: cena-platform
surface: diet-operations
created: 2026-05-26
status: in-review
consumes:
  - slots/_app/trigger-map.md
  - slots/_app/surface-shell-model.md
  - slots/_app/content-model.md
---

# Diet Operations — Information Architecture (per-surface)

Per-surface IA for **Diet Operations** — the **biggest structural change** in the redesign. The current app severs the medically-tailored-diet pipeline across six sibling flat tables (food-providers / meals / meals-by-week / meals-ai-import / meal-distribution / orders). This surface reconnects them into **ONE legible surface a coordinator holds in their head**, with cross-links along the diet chain, an in-surface sub-nav (NOT six sidebar items), and two multi-step flows (AI import stepper J9, distribution wizard J10). Absorbs J7, J8, J9, J10, J11, J12.

**"Diet" not "Meal"** (IA review, content-model voice contract): these are prescriptions conforming to each patient's clinical needs + tastes, not menu logistics — the naming carries the clinical intent into the IA.

## The one-surface model (six sub-areas, one connected pipeline)

The diet chain *is* the surface's spine. The six sub-areas are stops along it, not peers in a list. The coordinator enters at an **overview/router** and moves along the chain via cross-links — a week shows its distributions + orders; a provider shows its meals; an order links back to its distribution + week.

```
Diet chain (content-model spine):
  Food Provider ──supplies──▶ Meal (catalog) ──appears in──▶ Weekly Plan ──produces──▶ Distribution ──generates──▶ Kitchen Order
                                   ▲                              │ cutoff                    │ distribution-due           │ exception
                              AI Import ──feeds──┘                └──── PUSH "due" to Today ───┴──── PUSH to Today (J10) ───┴── PUSH to Today (J11)
```

| # | Sub-area | Job | Supply/demand position | What it is |
|---|---|---|---|---|
| 1 | **Food Providers** | J12 | supply side (chain head) | kitchens/vendors that supply meals + fulfill orders; list → provider record |
| 2 | **Meal catalog** | J7 | catalog | medically-tailored meals (diet tags, clinical conformance); list → meal record |
| 3 | **AI Import** | J9 | catalog feeder | bulk-create meals from text — a parse→review→commit **stepper** that feeds the catalog |
| 4 | **Weekly Plans** | J8 | demand assembly | meal sets + cutoffs; list → week record; **cutoff PUSHES "due" to Today** |
| 5 | **Distribution** | J10 | demand→supply handoff | distribute a week's meals to a partner kitchen — a **wizard**; **PUSHES "distribution-due" to Today** |
| 6 | **Kitchen Orders** | J11 | fulfillment | monitor fulfillment; list → order record; **exceptions PUSH to Today** |

## In-surface sub-nav (the legibility move — NOT sidebar sub-menus)

Per surface-shell-model: Diet Operations is **one** sidebar anchor (`fa-utensils`); its six sub-areas live *inside* the surface. The sub-nav is a **`nav-tabs` segment ordered along the chain** (Providers · Catalog · Weekly Plans · Distribution · Orders), with **AI Import reached from within Catalog** (it is a catalog-feeder action, not a peer destination — it belongs to J7's home, surfaced as a "Bulk import" CTA + its own stepped flow).

- **Entry default:** the **Weekly Plans** tab is the operational center of gravity (cutoffs + distributions + orders all hang off a week), but the surface opens with a **chain-oriented overview header** so the coordinator sees the whole pipeline at a glance before drilling. Provisional; finalize at render-verify.
- **Sub-nav = `nav-tabs`** (Preline `hs-tab`), not `nav-segmented-control` (5 ordered stops + chain semantics read better as tabs than a 2–3 way toggle). Flagged as a build-time confirm if 5 tabs crowd.
- Each list within a tab uses the ★ shared **toolbar + dense table** pattern (Patients-authored); each record uses the ★ **record-header + nav-tabs** pattern.

## Where/how reached

- **Reached as:** the **Diet Operations nav anchor** (4th of 7) — coordinator-pulled (J7/J9/J12 maintenance; J11 full list).
- **Pushed-into (from Today — the load-bearing cross-surface edge):** Today's queue deep-links land **inside the relevant sub-area record**, never at the surface overview:
  - Order-exception card → **that Kitchen Order record** (Orders tab, record open, exception visible).
  - Due-cutoff card → **that Weekly Plan record** (Weekly Plans tab, week open, cutoff state visible).
  - Distribution-due card → **that Distribution** (Distribution tab/wizard, the due distribution).
- **Drill-down + cross-links (the connected pipeline):** every record links along the chain in both directions (see Nav graph).

## Entities (see content-model)

Food Provider (kitchen/vendor; supplies Meals, fulfills Kitchen Orders); Meal (medically-tailored attributes, provider, hot/cold; appears in Weekly Plans); AI Import (source text → parsed candidates → committed; feeds catalog); Weekly Plan (week range, meal set, cutoff date/time; produces Distributions; cutoff drives Today "due"); Distribution (source week, target partner kitchen, quantities, status; generates Kitchen Orders); Kitchen Order (distribution, provider, fulfillment status, exceptions; exceptions push to Today).

## Nav graph (out-edges — the cross-link web)

| From element | Routes to | Trigger |
|---|---|---|
| Sub-nav tab | that sub-area's list | pulled |
| Providers row | Provider record (overview tab) | pulled / drill-down |
| **Provider record → "Meals" tab** | filtered **Catalog** (this provider's meals) | cross-link |
| **Provider record → "Orders" tab** | filtered **Orders** (this provider's fulfillment) | cross-link |
| Catalog row | Meal record | pulled / drill-down |
| Meal record → "Provider" | the source Provider record | cross-link |
| Meal record → "In plans" | Weekly Plans containing this meal | cross-link |
| Catalog "Bulk import" CTA | **AI Import** stepper (step 1: paste) | pulled |
| AI Import commit | back to Catalog (new meals flagged) | flow complete |
| Weekly Plans row | Week record (overview tab) | pulled / drill-down |
| **Week record → "Distributions" tab** | this week's Distributions | cross-link |
| **Week record → "Orders" tab** | this week's Kitchen Orders | cross-link |
| Week record "Distribute" CTA | **Distribution wizard** (step 1, week pre-selected) | pulled |
| Distribution row / wizard finish | Distribution record | drill-down / flow complete |
| **Distribution record → "Source week"** | the originating Weekly Plan | cross-link (back-edge) |
| **Distribution record → "Orders"** | the Kitchen Orders this distribution generated | cross-link |
| Orders row | Kitchen Order record | pulled / drill-down |
| **Order record → "Distribution"** | the source Distribution | cross-link (back-edge) |
| **Order record → "Week"** | the originating Weekly Plan | cross-link (back-edge) |
| **Order record → "Provider"** | the fulfilling Food Provider | cross-link |
| Roster bulk-select → action (Catalog) | in-place retire/activate + confirm dialog | pulled |
| Today exception/cutoff/distribution card | the relevant record (see Where/how reached) | agent-pushed deep-link |

**The cross-link invariant:** from any record on the chain, the coordinator can reach the adjacent links in *both directions* without returning to a list. A week reaches its distributions + orders; an order reaches back to its distribution + week + provider. This is the "one surface held in the head" payoff — the current app's severed-tables failure mode is the thing this graph exists to kill.

## URL / page contract (static-bundle targets, under `handoff/cena-platform/diet-operations/`)

This surface has the **most built pages** of any in the redesign. Grouped by sub-area; each is a candidate built page `diet-operations.<area>-<state>.html`.

**Providers (J12)**
- `diet-operations.providers-list.html` — dense provider table (default)
- `diet-operations.providers-empty.html` — no providers (empty-state)
- `diet-operations.provider-record.html` — provider record (overview tab; Meals / Orders cross-link tabs)

**Catalog (J7)**
- `diet-operations.catalog-list.html` — dense meal table (default)
- `diet-operations.catalog-empty.html` — no meals → "Add meal" / "Bulk import" CTAs
- `diet-operations.catalog-selected.html` — bulk-select active (sticky bulk-action-bar) *(may fold into list as a documented variant at build)*
- `diet-operations.meal-record.html` — meal record (medically-tailored attributes; Provider / In-plans cross-links)

**AI Import (J9 — stepper flow)**
- `diet-operations.import-paste.html` — step 1: paste/upload source text
- `diet-operations.import-review.html` — step 2: parsed-candidate review table (valid / needs-edit rows)
- `diet-operations.import-result.html` — step 3: receipt (N created, M skipped) *(steps 2–3 may fold per build)*

**Weekly Plans (J8)**
- `diet-operations.weeks-list.html` — dense week table with cutoff/status columns (default)
- `diet-operations.weeks-empty.html` — no weeks → "Plan a week" CTA
- `diet-operations.week-record.html` — week record (meal set, cutoff; Distributions / Orders cross-link tabs)
- `diet-operations.week-cutoff-due.html` — week record in **cutoff-approaching / passed** state (the Today deep-link target) *(may fold into week-record as a state variant)*

**Distribution (J10 — wizard flow)**
- `diet-operations.distribute-step1.html` — wizard: select week + target partner kitchen
- `diet-operations.distribute-step2.html` — wizard: confirm meal quantities per kitchen
- `diet-operations.distribute-step3.html` — wizard: review + send (receipt on commit) *(steps may fold per build)*
- `diet-operations.distribution-record.html` — distribution record (Source-week / Orders cross-links; the distribution-due deep-link target)

**Kitchen Orders (J11)**
- `diet-operations.orders-list.html` — dense order table with fulfillment-status + exception columns (default)
- `diet-operations.orders-empty.html` — no orders (empty-state)
- `diet-operations.order-record.html` — order record (fulfillment detail; Distribution / Week / Provider back-link cross-links; the exception deep-link target)

**Cross-cutting system states** (loading / error) specified in `states.md`; built as pages only if warranted at build (lean default). No client router; cross-links + sub-nav tabs are the contract, not URL strings (when a production framework binds, these become routes). Exact built page count finalized at build — selection/state/step variants may fold.

## Cognitive-walkthrough pre-commit (feeds acceptance.md)

A coordinator working the diet pipeline should:
- **(orientation)** land seeing the whole chain at a glance (overview header + chain-ordered sub-nav), recognize which stop they're at, and know which stops carry due/exception signal.
- **(path)** move from any record to its adjacent chain links — both directions — in ≤1 action, without going back to a list; reach the AI-import and distribution flows from the entity they feed/serve (Catalog, Week).
- **(affordance)** tell the two multi-step flows (AI import, distribution wizard) apart from list/record navigation; see "Bulk import" and "Distribute" read as the obvious controls where they belong.
- **(pushed-work)** when arriving from a Today deep-link, land *inside the relevant record* with the exception/cutoff/distribution state already visible — not at the surface overview.

Pre-committed expected answers live in `acceptance.md`.
