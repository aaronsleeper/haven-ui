---
slot: 10
slot-name: state-and-transition-spec (Diet Operations)
primary-author: Interaction Designer
project: cena-platform
surface: diet-operations
created: 2026-05-26
status: in-review
consumes:
  - slots/diet-operations/ia.md
  - slots/_app/content-model.md
  - slots/_app/surface-shell-model.md
folds-in: [flows (9), wireframes (11), a11y (13), strings (14), component-plan (17)]
---

# Diet Operations — State & Transition Spec

State machine per sub-area + the PL primitives each composes (copy, don't generate). Register: **dense professional coordinator** — operational urgency color is allowed and wanted (SLA breach, cutoff, exception legitimately use error/warning tone; NOT the patient-app calm/no-alarm frame). This is the surface with the **most built pages**; every state below is a candidate built page.

**Reuses ★ shared primitives authored in Patients** (`slots/patients/states.md`): toolbar, dense table, bulk-action-bar, `layout-record-header` + `nav-tabs`, stepped form / `nav-stepper`, `forms-file-upload`, `forms-validation`, `receipt`. Diet Operations is a **second/third consumer** of bulk-action-bar and the stepped-form pattern — **confirms the 3-use rule for PL promotion** (see Shared-primitive flags).

**Hard rule (inherited from ds-binding):** `kitchen-meal-assignment-grid` (`meal-qty-cell` etc.) is **kitchen-app-coupled and must NOT be reused here** (COMPONENT-INDEX explicitly fences it). Distribution-wizard quantity entry composes the form suite + `data-table`, not the kitchen grid.

## Surface frame (every state inherits)

- **Shell:** `layout-app-shell-responsive` per surface-shell-model — sidebar (Diet Operations active, `fa-utensils`), topbar (patient search + work-queue badge + user/role).
- **Page head:** `page-header` + `page-title` "Diet Operations" + `nav-breadcrumb` (Diet Operations › {tab} › {record}).
- **Sub-nav:** `nav-tabs` (Preline `hs-tab`) ordered along the diet chain — **Providers · Catalog · Weekly Plans · Distribution · Orders**. AI Import is reached from within Catalog (CTA), not a tab. The sub-nav persists across all list/record states; only the content region swaps.
- **Chain-orientation header (overview):** a compact chain glyph / `complex-pipeline-bar` summary above the active tab showing pipeline shape + where due/exception signal sits — subordinate, glanceable. Provisional; confirm at render.

---

## 1. Food Providers (J12)

| State | Trigger | Content | Built page |
|---|---|---|---|
| **providers-list** (default) | ≥1 provider | dense `data-table` of providers | `diet-operations.providers-list.html` |
| **providers-empty** | no providers | `data-empty-state` + "Add provider" CTA | `diet-operations.providers-empty.html` |
| **provider-record** | open a provider | record header + cross-link tabs | `diet-operations.provider-record.html` |

**Composition:**
- List: ★ **toolbar** (`toolbar` + `toolbar-search` + `nav-filter-pills` kitchen/vendor · active/inactive) + ★ **dense table** (`data-table data-table-compact`, `row-clickable`): name (`cell-primary`), type `badge-pill`, meals-offered count, active-orders count, contact, status `badge`. `data-pagination`.
- Record: ★ **`layout-record-header`** (provider name + type subtitle + status badge/meta) + `nav-breadcrumb` + ★ **`nav-tabs`**: **overview / Meals / Orders / contact**. Meals + Orders tabs are the **cross-links** — render filtered Catalog / Orders dense tables scoped to this provider (`data-list-group` or `data-table-compact`). Overview = `kv-table` of key fields.

---

## 2. Meal Catalog (J7)

| State | Trigger | Content | Built page |
|---|---|---|---|
| **catalog-list** (default) | ≥1 meal | dense meal `data-table` | `diet-operations.catalog-list.html` |
| **catalog-empty** | no meals OR no filter matches | `data-empty-state` (distinguish "no meals yet" → Add meal / Bulk import, vs "no matches" → clear filters) | `diet-operations.catalog-empty.html` |
| **catalog-selected** | ≥1 row checked | ★ bulk-action-bar (sticky-footer): "N selected" · Retire · Activate · Export | fold into list (documented variant) |
| **meal-record** | open a meal | meal record (read-first attributes + cross-links) | `diet-operations.meal-record.html` |

**Composition:**
- List: `page-header` actions right — `btn-primary` "Add meal", `btn-outline` "Bulk import" (→ AI Import). ★ **toolbar** (search + `nav-filter-pills`: diet-tag / hot-cold / active-retired; optional `nav-stratification-bar` by provider). ★ **dense table** w/ row `form-checkbox` leading: name (`cell-primary`), diet/clinical-conformance tags (`badge-pill badge-sm`), `complex-meal-type` hot/cold label, provider, status. `data-pagination`.
- ★ **Bulk-action-bar** — `layout-sticky-footer` (`sticky-footer-info` "N selected" + `sticky-footer-actions` Retire/Activate/Export). **Second confirmed consumer of the Patients-authored composition → fires the 3-use rule for PL promotion to `bulk-action-bar`.**
- Record: ★ **`layout-record-header`** + ★ **`nav-tabs`**: **overview / Provider / In-plans**. Overview — `kv-table` of attributes + `clinical-nutrition-list` (always-editable per contract) + diagnosis/diet-conformance tags + Clinical Library guideline cross-link. **Read-first** (values display; edit deliberate). Provider tab → source Provider; In-plans tab → Weekly Plans containing this meal (cross-links).

---

## 3. AI Import (J9 — parse → review → commit stepper)

| State | Trigger | Content | Built page |
|---|---|---|---|
| **import-paste** | Catalog "Bulk import" | paste textarea + optional `forms-file-upload` | `diet-operations.import-paste.html` |
| **import-review** | source parsed | parsed-candidate validation table (valid / needs-edit / error rows) | `diet-operations.import-review.html` |
| **import-result** | committed | `receipt` (N created, M skipped) | `diet-operations.import-result.html` |
| **import-empty-parse** | parse yields zero candidates | inline `alert` (info/warning) "No meals found in the text" + back to paste | fold into import-review |

**Composition (★ stepped-form pattern):**
- Stepper chrome: `nav-stepper` (Preline HsStepper) — Paste → Review → Done.
- Step 1: large `textarea` (paste meal text) + optional ★ **`forms-file-upload`** dropzone (`.txt`/`.csv`); `btn-primary` "Parse".
- Step 2: ★ **review `data-table`** of parsed Meal candidates — each row uses ★ **`forms-validation`** state (`field-row-success` valid / `field-row-warning` needs-edit / `field-row-error` error); `clinical-ai-field` register for agent-populated values pending confirmation; inline edit of conformance/diet tags (`forms-tags-input`). Sticky-footer: "Commit N meals" `btn-primary` (disabled while error rows remain).
- Step 3: ★ **`receipt`** (`receipt-summary` N created / M skipped) → "View in catalog" `text-link` back to Catalog (new meals flagged).

---

## 4. Weekly Plans (J8 — cutoff pushes "due" to Today)

| State | Trigger | Content | Built page |
|---|---|---|---|
| **weeks-list** (default) | ≥1 week | dense week `data-table` w/ cutoff + status columns | `diet-operations.weeks-list.html` |
| **weeks-empty** | no weeks | `data-empty-state` + "Plan a week" CTA | `diet-operations.weeks-empty.html` |
| **week-record** | open a week | week record (meal set, cutoff; cross-link tabs) | `diet-operations.week-record.html` |
| **week-cutoff-due** | cutoff approaching / passed (Today deep-link target) | week record w/ cutoff state surfaced (`.is-warning` / `.is-breached` register; `clinical-sla-warning`) | `diet-operations.week-cutoff-due.html` (may fold into week-record as a state variant) |

**Composition:**
- List: ★ **toolbar** (search + `nav-filter-pills`: draft/open/cutoff-passed/closed). ★ **dense table**: week range (`cell-primary`), meal count, cutoff date/time (`cell-mono`), status `badge` (draft / open / **cutoff passed** = `badge-warning`/`badge-error`), distribution count. **Operational urgency color** carries cutoff state. `data-pagination`.
- Record: ★ **`layout-record-header`** (week range + cutoff subtitle + status badge/meta) + ★ **`nav-tabs`**: **meals / Distributions / Orders**. Meals tab = the week's meal set (`data-list-group` / `data-table-compact` + "Add meal to week" via `forms-combobox` against catalog). **Distributions + Orders tabs are the cross-links** — this week's Distributions and Kitchen Orders (dense tables / `data-list-group`). `page-header` action: `btn-primary` "Distribute" → Distribution wizard (week pre-selected).
- **week-cutoff-due:** the record with the cutoff foregrounded — `clinical-sla-warning` / `alert` (warning or error) naming time-to-cutoff or cutoff-passed; the Distribute CTA emphasized. This is where a Today **due-cutoff** card lands.

---

## 5. Distribution (J10 — wizard; pushes "distribution-due" to Today)

| State | Trigger | Content | Built page |
|---|---|---|---|
| **distribute-step1** | Week "Distribute" CTA | select week (pre-filled if entered from a week) + target partner kitchen | `diet-operations.distribute-step1.html` |
| **distribute-step2** | week + kitchen chosen | confirm meal quantities per kitchen | `diet-operations.distribute-step2.html` |
| **distribute-step3** | quantities confirmed | review + send → `receipt` on commit | `diet-operations.distribute-step3.html` |
| **distribution-record** | open a distribution (or Today deep-link) | distribution record (cross-links; due/sent state) | `diet-operations.distribution-record.html` |

**Composition (★ stepped-form / wizard pattern — distinct from AI import: this is a transact wizard with a confirm-gated send):**
- Wizard chrome: `nav-stepper` — Select → Quantities → Review & send.
- Step 1: `form-layout` field-rows — week (`forms-combobox`, pre-selected + locked when entered from a week record), target partner kitchen (`forms-combobox` against Network providers/kitchens), distribution date (`forms-datepicker`). `forms-validation`.
- Step 2: **quantities table** — `data-table` (NOT `kitchen-meal-assignment-grid`, which is kitchen-coupled): meal × quantity per the week's meal set; quantity entry via `form-input-text` (number) or `quantity-stepper`. Totals row (`cell-numeric`). `forms-validation` for zero/over-supply.
- Step 3: review summary (`kv-table` / `complex-comparison-panel` week-vs-kitchen if useful) + `overlay-confirm-dialog` on "Send distribution" (`btn-primary`) — mutating + creates Kitchen Orders, so confirm-gated. On commit → ★ **`receipt`** (distribution reference, quantities, target) → "View distribution" link.
- **distribution-record:** ★ **`layout-record-header`** + ★ **`nav-tabs`**: **overview / Source week / Orders**. Overview — `kv-table` + status `badge` (draft / sent / confirmed); `complex-pipeline-bar` of fulfillment if useful. Source-week tab → originating Weekly Plan (back-edge cross-link); Orders tab → the Kitchen Orders this distribution generated. This is where a Today **distribution-due** card lands.

---

## 6. Kitchen Orders (J11 — exceptions push to Today)

| State | Trigger | Content | Built page |
|---|---|---|---|
| **orders-list** (default) | ≥1 order | dense order `data-table` w/ fulfillment-status + exception columns | `diet-operations.orders-list.html` |
| **orders-empty** | no orders | `data-empty-state` | `diet-operations.orders-empty.html` |
| **order-record** | open an order (or Today deep-link) | order record (fulfillment detail; back-link cross-links; exception surfaced) | `diet-operations.order-record.html` |

**Composition:**
- List: ★ **toolbar** (search + `nav-filter-pills`: pending/fulfilling/fulfilled/**exception**; the exception pill leads). ★ **dense table**: order ref (`cell-mono`), provider, distribution/week, fulfillment status `badge` (**exception** = `badge-error` + `severity-badge`), quantity, last-update. **Operational urgency color** — exceptions visibly red. `data-pagination`.
- Record: ★ **`layout-record-header`** (order ref + provider subtitle + status badge/meta) + ★ **`nav-tabs`**: **overview / Distribution / Week / Provider** (the back-link cross-links). Overview — `kv-table` + fulfillment detail; **exception state** surfaced via `alert` (error) + `clinical-alert-summary-row` naming the exception, with the entity action (resolve/flag) — `overlay-confirm-dialog` for any mutating resolution. This is where a Today **order-exception** card lands.

---

## Transitions

- **Sub-nav:** `nav-tabs` switches the active sub-area; furniture (shell, page-header, breadcrumb, sub-nav) stable.
- **List → record:** `row-clickable` → record; back via breadcrumb.
- **Cross-link traversal (the connected pipeline):**
  - `provider-record → Meals tab → meal-record` and `→ Orders tab → order-record`.
  - `meal-record → Provider → provider-record`; `→ In-plans → week-record`.
  - `week-record → Distributions tab → distribution-record`; `→ Orders tab → order-record`.
  - `distribution-record → Source week → week-record` (back-edge); `→ Orders → order-record`.
  - `order-record → Distribution → distribution-record`; `→ Week → week-record`; `→ Provider → provider-record` (back-edges).
- **AI Import flow:** `catalog-list → import-paste → import-review → import-result → catalog-list` (new meals flagged). Error rows block commit until resolved.
- **Distribution wizard:** `week-record → distribute-step1 → step2 → step3 → confirm-dialog → receipt → distribution-record`. Cancel from any step → back to the originating week.
- **Catalog bulk:** `catalog-list → catalog-selected → confirm-dialog → catalog-list` (retire/activate applied) or `→ catalog-list` (deselect).
- **Today deep-link entries:** `Today order-exception card → order-record` (exception visible); `Today due-cutoff card → week-cutoff-due`; `Today distribution-due card → distribution-record`. Each lands *inside the record*, not at the overview.

## Invariants (carry to acceptance + a11y)

- **One connected surface** — the six sub-areas are reached through one sidebar anchor + an in-surface chain-ordered `nav-tabs`; never six sidebar items. Cross-links let the coordinator traverse the chain in both directions without returning to a list.
- **Records are read-first** — meal/week/order/provider records surface signal (attributes, cutoff, exception, fulfillment) before edit chrome; `clinical-nutrition-list` is the always-editable exception by contract.
- **Mutating paths gated** — Distribution send, bulk retire/activate, order-exception resolution route through `overlay-confirm-dialog`; destructive verbs use `btn-danger`.
- **Operational urgency color is real signal, reserved** — cutoff-passed, order-exception, SLA breach use error/warning register (`badge-error`, `severity-badge`, `clinical-sla-warning`); not decorative. The patient-app no-alarm rule does NOT transfer.
- **Two flows are visibly flows** — AI Import (`nav-stepper` paste→review→commit) and Distribution (`nav-stepper` wizard) read as multi-step, distinct from list/record nav; each reached from the entity it feeds/serves (Catalog, Week).
- **Furniture stable** — shell + page-header + breadcrumb + sub-nav persist across all states; only the content region / step swaps.
- **Kitchen grid fenced out** — `kitchen-meal-assignment-grid` and its `meal-qty-*` classes never appear; quantity entry composes the form suite + `data-table`.
- **A11y:** dense tables have `<th scope>` headers, row checkboxes labeled, `row-clickable` rows keyboard-activable via a real focus target (name link); `nav-tabs` is a real `tablist` (Preline `hs-tab`); `nav-stepper` steps announce position ("Step 2 of 3"); validation rows tie errors to inputs via `aria-describedby`; confirm dialogs trap focus; cutoff/exception urgency carries an `aria-label` (color is not the only signal). Skip-link to main.
- **Strings (voice — professional/operational):** "Bulk import", "Distribute", "Cutoff passed", "Cutoff in 6h", "Exception · 3 orders unfulfilled", "Send distribution", "Retire meal", "N selected", "Sent to kitchen". Clinical/operational terms used directly (cutoff, distribution, conformance, fulfillment) — no plain-language simplification.
- **No real patient/business data** — synthetic provider/meal/week/order names + representative diet/conformance values.

## Shared-primitive flags (feed Phase-2 dependency analysis)

★ reused across surfaces — **serialize their authoring (in Patients) before parallelizing Diet Operations:**
- **Toolbar pattern** (search + filter-pills + stratification) — Diet Operations is a heavy consumer (5 list tabs).
- **Dense table** (`data-table-compact` + signal columns + `row-clickable` + checkbox) — every Diet Ops list.
- **Bulk-action-bar** (sticky-footer composition) — Catalog is the **second confirmed consumer** after Patients → **fires the 3-use rule; promote Patients' Tier-2 composition to a PL `bulk-action-bar` entry** (Tier-1 ceremony) before/at this surface's build.
- **`layout-record-header` + `nav-tabs` record pattern** — provider / meal / week / distribution / order records all use it (5 record types — the most of any surface).
- **Stepped form** (`nav-stepper` + `forms-file-upload` + `forms-validation` + `receipt`) — AI Import + Distribution wizard are the **second + third consumers** after Patients bulk intake → confirms the pattern is PL-stable.

## PL gaps + decisions flagged (resolve at/before build, never improvise)

- **No new primitives required** — ds-binding's coverage gate verdict (zero blocking gaps) holds for this surface; every state composes existing PL components.
- **`bulk-action-bar` promotion** (carried from ds-binding gap #1) — Catalog is the second consumer; promote per 3-use rule. Tracked, not a Diet-Ops-specific gap.
- **Chain-orientation header** — the overview chain glyph / `complex-pipeline-bar` summary is a **composition**, not a new primitive; confirm the exact composition at render-verify (Tier-2 tweak).
- **5-tab sub-nav crowding** — `nav-tabs` with 5 ordered stops may crowd on narrow desktop; confirm at render whether it holds or needs `nav-segmented-control` / overflow. Flagged, not blocking.
- **Sidebar nav-item count badge** — inherited micro-gap from surface-shell-model (Today's work-queue count seating); not Diet-Ops-specific, noted for cross-surface consistency.
