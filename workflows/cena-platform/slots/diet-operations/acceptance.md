---
slot: 19
slot-name: acceptance-criteria (Diet Operations)
primary-author: QA Lead
project: cena-platform
surface: diet-operations
created: 2026-05-26
status: in-review
consumes:
  - slots/diet-operations/states.md
  - slots/diet-operations/ia.md
  - slots/_app/content-model.md
folds-in: [test-plan (20)]
---

# Diet Operations — Acceptance Criteria

Per-screen observable rows (binary pass/fail) + flow-level use-case acceptance + pre-build cognitive walkthrough. This surface is the **biggest structural change** and has the **most built pages** — the connected-pipeline cross-links and the two multi-step flows carry the highest acceptance weight.

## Per-screen acceptance

| # | Criterion | State | Pass condition |
|---|---|---|---|
| D1 | One surface, one sidebar anchor, in-surface sub-nav | all | Diet Operations is a single sidebar anchor; six sub-areas reached via in-surface `nav-tabs` (Providers · Catalog · Weekly Plans · Distribution · Orders); AI Import reached from Catalog, not a tab; **zero of the six are sidebar items** |
| D2 | Sub-nav ordered along the diet chain | all | tab order follows Provider → Catalog → Week → Distribution → Order (supply→fulfillment); chain-orientation header present |
| D3 | Providers list + record with cross-link tabs | providers-list, provider-record | dense table; record `layout-record-header` + `nav-tabs` (overview/Meals/Orders/contact); Meals + Orders tabs render this provider's filtered meals + orders |
| D4 | Catalog list is a dense table with diet-signal columns | catalog-list | `data-table-compact`; name + diet/conformance tags + hot/cold + provider + status; checkbox per row |
| D5 | Catalog bulk-select reveals the sticky bulk-action-bar | catalog-selected | checking ≥1 row shows `sticky-footer` "N selected" + Retire/Activate/Export; this is the **second consumer** of the Patients bulk-action-bar composition |
| D6 | Catalog bulk action is confirm-gated | catalog-selected | Retire/Activate → `overlay-confirm-dialog`; destructive verb uses `btn-danger` |
| D7 | Meal record read-first with provider + in-plans cross-links | meal-record | attributes display before edit chrome; `clinical-nutrition-list` always-editable; Provider tab → provider, In-plans tab → weeks (cross-links resolve) |
| D8 | AI Import is a paste→review→commit stepper | import-paste, import-review, import-result | `nav-stepper`; paste/upload → parsed-candidate validation table (valid/needs-edit/error) → `receipt` (N created / M skipped); commit disabled while error rows remain |
| D9 | Weekly Plans list shows cutoff + status with urgency color | weeks-list | dense table; cutoff (`cell-mono`) + status badge; cutoff-passed reads as `badge-warning`/`badge-error` (operational urgency, not decorative) |
| D10 | Week record with Distributions + Orders cross-link tabs + Distribute CTA | week-record | `layout-record-header` + `nav-tabs` (meals/Distributions/Orders); Distribute → wizard with week pre-selected |
| D11 | Cutoff-due state surfaces the cutoff (Today deep-link target) | week-cutoff-due | `clinical-sla-warning`/`alert` names time-to-cutoff or cutoff-passed; Distribute emphasized; this is where Today's due-cutoff card lands |
| D12 | Distribution is a wizard ending in a confirm-gated send | distribute-step1/2/3 | `nav-stepper` select→quantities→review; "Send distribution" → `overlay-confirm-dialog`; commit → `receipt` |
| D13 | Distribution quantities use the form suite, NOT the kitchen grid | distribute-step2 | quantities via `data-table` + form inputs / `quantity-stepper`; **`kitchen-meal-assignment-grid` / `meal-qty-*` classes absent** |
| D14 | Distribution record with source-week + orders back-links | distribution-record | `layout-record-header` + `nav-tabs` (overview/Source week/Orders); back-edge to week resolves; Today distribution-due card lands here |
| D15 | Orders list flags exceptions with urgency color | orders-list | dense table; exception status = `badge-error` + `severity-badge`; exception filter pill leads |
| D16 | Order record with distribution/week/provider back-links + exception surfaced | order-record | `layout-record-header` + `nav-tabs` (overview/Distribution/Week/Provider); exception via `alert`(error) + `clinical-alert-summary-row`; all three back-edges resolve; Today exception card lands here |
| D17 | Cross-link invariant — chain traversable both directions | all records | from any record, adjacent chain links reachable in ≤1 action without returning to a list (week↔distribution↔order↔provider↔meal) |
| D18 | Empty states distinguish no-data vs no-matches | *-empty | no-providers/meals/weeks/orders → Add CTA; catalog no-matches → clear-filters |
| D19 | Breadcrumb orients every drill-down | records, flows | Diet Operations › {tab} › {record}; flows show step context |
| D20 | Furniture stable across states | transitions | shell + page-header + breadcrumb + sub-nav persist; only content/step swaps |
| D21 | Professional voice, no plain-language simplification | all | operational strings ("Cutoff in 6h", "Exception · 3 orders unfulfilled", "Send distribution"); domain terms direct |
| D22 | A11y floor | all | `<th scope>` headers, labeled checkboxes, keyboard-activable rows, real `tablist`, stepper position announce, validation `aria-describedby`, focus-trapping dialogs, urgency `aria-label`, skip-link |
| D23 | Renders self-contained under `file://`, render-gate clean | all | `../assets/haven.css` + relative paths; zero undefined classes; no dev server |
| D24 | No real patient/business data | all | synthetic provider/meal/week/order names; representative diet/conformance values |

## Flow-level use-case acceptance

**Jobs:** J7 meal catalog · J8 weekly plans (cutoff→Today) · J9 AI import · J10 distribution wizard (→Today) · J11 kitchen orders (exception→Today) · J12 food providers.

| Sub-check | Pre-committed expected answer |
|---|---|
| **Orientation** | Landing reads as the whole diet pipeline at a glance (chain-orientation header + chain-ordered sub-nav); the coordinator recognizes which stop they're at and where due/exception signal sits. |
| **Affordance** | "Bulk import" (Catalog) and "Distribute" (Week) read as the obvious controls in the entity they feed/serve; the two stepper flows read as multi-step, distinct from list/record nav. |
| **Path** | Any record reaches its adjacent chain links — both directions — in ≤1 action without a list round-trip; AI import = paste→review→commit; distribution = select→quantities→review→send. |
| **Feedback** | Committed import lands new meals in the catalog (flagged) + receipt; sent distribution produces a receipt + orders + lands on the distribution record; bulk action updates rows + clears selection; resolved exception updates the order. |
| **Legibility** | Dense but scannable; operational labels; cutoff/exception urgency color carries triage meaning along the chain. |
| **Pushed-work landing** | A Today deep-link lands *inside the relevant record* with the exception/cutoff/distribution state already visible — never at the surface overview. |

## Cross-surface dependency contract (the load-bearing edges)

Diet Operations is the **deep-link target for three of the four Today queue groups** (trigger-map). These edges are non-negotiable and must be honored at build:

| Today queue card | Lands at (Diet Operations) | Entity (content-model) | Job |
|---|---|---|---|
| Order exception | `order-record` (exception surfaced) | Kitchen Order | J11 |
| Due cutoff | `week-cutoff-due` (cutoff surfaced) | Weekly Plan | J8 |
| Distribution due | `distribution-record` (due state) | Distribution | J10 |

**Build-order consequence:** these record/state pages must exist before Today's deep-link hrefs finalize (Today builds last, per its states.md). The page-contract IDs in `ia.md` are the href targets.

## Pre-build cognitive walkthrough (slot-19 sub-step) — result

Fresh-context walk of the spec against the six jobs (spec-checkable subset):

- **Path:** PASS — every list→record→cross-link route resolves; both flows have a single clear multi-step route; cross-link invariant (D17) gives both-direction chain traversal; Today deep-links land inside records.
- **Feedback-existence:** PASS — receipts (import, distribution), confirm dialogs (send, bulk, exception-resolve), row updates, new-meal flagging all specified (states.md transitions).
- **Legibility:** PASS — dense-professional copy + diet/cutoff/exception signal columns (ds-binding voice + content-model); operational urgency color reserved for real signal.
- **Orientation-ingredients:** PASS — page-title + chain-orientation header + chain-ordered sub-nav + breadcrumb orient every stop; the one-surface model is the explicit fix for the severed-tables failure mode.
- **Product-rule gate audit:** every mutating path (distribution send → creates orders, bulk retire/activate, exception resolution, AI-import commit) is confirm-gated or validation-gated; no unguarded irreversible action. `kitchen-meal-assignment-grid` is fenced out (D13). No real data crosses into any screen.
- **PL-coverage audit:** zero new primitives required (ds-binding verdict holds); `bulk-action-bar` promotion is the one tracked composition obligation (3-use rule fired by Catalog as second consumer).

**Render-only checks (one-surface-reads-as-one, cross-links-discoverable, chain-orientation-legible, density-still-scannable, urgency-reads-right, 5-tab-sub-nav-not-crowded):** deferred to slot 30 (human cold render-and-look) — non-waivable. This surface's render gate is the highest-stakes of the redesign given it is the biggest structural change.
