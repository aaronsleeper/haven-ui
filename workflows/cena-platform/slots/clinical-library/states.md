---
slot: 10
slot-name: state-and-transition-spec (Clinical Library)
primary-author: Interaction Designer
project: cena-platform
surface: clinical-library
created: 2026-05-26
status: in-review
consumes:
  - slots/clinical-library/ia.md
  - slots/_app/content-model.md
  - slots/_app/surface-shell-model.md
folds-in: [flows (9), wireframes (11), a11y (13), strings (14), component-plan (17)]
---

# Clinical Library — State & Transition Spec

State machine per zone + PL primitives each state composes (copy, don't generate). Register: **professional coordinator** — clinical/operational vocabulary (ICD-10 codes, dietary guidelines, diagnosis linkage) used directly, no plain-language simplification. This is a low-frequency reference surface; compositions are lean relative to Patients or Diet Operations, but maintain the dense-professional register.

Reuses ★ shared primitives established in `patients/states.md` and `patients/acceptance.md` — no re-authoring, reference only.

## In-surface sub-nav (zone switching)

- `nav-segmented-control` (`segmented-control` + `segmented-control-btn`) immediately below the `page-header` + `page-title` — two items: **Dietary Guidelines** | **Diagnosis Codes**.
- Active zone state: `.active` on the corresponding `segmented-control-btn`.
- This is the only Clinical Library navigation element; it is NOT replicated in the sidebar.

---

## Zone A: Dietary Guidelines (J15)

### State set

| State | Trigger | Content | Built page |
|---|---|---|---|
| **guidelines** (default) | ≥1 guideline exists | populated `data-table data-table-compact` + toolbar + actions | `clinical-library.guidelines.html` |
| **guidelines-empty** | no guidelines | `data-empty-state` + Add-guideline CTA | `clinical-library.guidelines-empty.html` |
| **guidelines-detail** | row click / edit action | single-guideline view: `kv-table` of fields + Edit / Archive / Restore actions | `clinical-library.guidelines-detail.html` |
| **guidelines-add** | "Add guideline" CTA | add-new form (inline or page) | `clinical-library.guidelines-add.html` |

### `clinical-library.guidelines.html` (populated table)

- **Shell:** `layout-app-shell-responsive` per surface-shell-model — sidebar (Clinical Library active, no badge), topbar (patient search + user/role).
- **Page head:** `page-header` + `page-title` "Clinical Library" + sub-nav (`nav-segmented-control`: Dietary Guidelines active | Diagnosis Codes).
- ★ **Toolbar:** `toolbar` + `toolbar-search` (`search-input`) + `nav-filter-pills` (status: Current / Archived / All). No stratification bar (volume doesn't warrant it on this surface).
- ★ **Dense table:** `data-table data-table-compact` with `row-clickable`. Columns:
  - Guideline name/title (`cell-primary`)
  - Diagnosis linkage — `badge-pill badge-sm` per linked diagnosis category (one or more)
  - Status — `badge-success` "Current" / `badge-neutral` "Archived"
  - Last updated — `cell-mono` date
  - Actions — `btn-ghost btn-xs` row actions: Edit, Archive/Restore (context-appropriate)
- **Page-level action:** `btn-primary` "Add guideline" in `page-header` actions-right.
- `data-pagination` below the table (paginate at build if list grows; reference tables are typically short — may omit at build if count is small).

### `clinical-library.guidelines-empty.html`

- Same shell + sub-nav.
- `data-empty-state` (`empty-state` + `empty-state-icon` — `fa-regular fa-book-medical`): "No dietary guidelines yet. Add one to inform meal conformance."
- `btn-primary` "Add guideline" inside or below the empty state.

### `clinical-library.guidelines-detail.html`

- Same shell + sub-nav (Guidelines active).
- `nav-breadcrumb`: Clinical Library › Dietary Guidelines › {Guideline name}.
- ★ **`record-header`** (`record-header` + `record-header-title` + `record-header-trailing`): guideline name + status badge right.
- **Body:** `kv-table` — fields: Guideline text (full), Diagnosis linkage (tag list), Status, Created, Last updated, Source/reference.
- **Actions** (right of record-header or sticky footer): `btn-primary` "Edit", `btn-outline` "Archive" (or "Restore" if archived). Archive → `overlay-confirm-dialog` (warning variant).
- **Cross-link:** "Used by N meals" `text-link` → Diet Operations meal conformance context (deferred at build if cross-surface href not yet resolved).
- Inline edit variant (alternative at build): replace `kv-table` rows with `field-row` inputs in-place on "Edit" click, with `sticky-footer` Save / Cancel. Use this pattern if a full add/edit page feels heavy for this low-frequency surface. Finalize at build.

### `clinical-library.guidelines-add.html`

- Same shell + sub-nav.
- `nav-breadcrumb`: Clinical Library › Dietary Guidelines › Add.
- `page-header` + `page-title` "Add Dietary Guideline".
- **Form:** `field-row` set — Guideline name (text input), Guideline text (textarea, full clinical prose), Diagnosis linkage (`forms-tags-input` — link to one or more ICD-10 categories), Status (radio: Current / Archived, default Current).
- `forms-validation` error states on required fields.
- **Footer:** `sticky-footer` — `btn-primary` "Save guideline" + `btn-outline` "Cancel".
- On save: land on the new guideline's detail view (`guidelines-detail`); show `toast-success` "Guideline saved."

---

## Zone B: Diagnosis Codes (J16)

### State set

| State | Trigger | Content | Built page |
|---|---|---|---|
| **codes** (default) | ≥1 code exists | populated `data-table data-table-compact` + toolbar + actions | `clinical-library.codes.html` |
| **codes-empty** | no codes | `data-empty-state` + Add-code CTA | `clinical-library.codes-empty.html` |
| **codes-detail** | row click / edit action | single-code detail: `kv-table` + Edit / Deprecate / Restore | `clinical-library.codes-detail.html` |
| **codes-add** | "Add code" CTA | add-new form | `clinical-library.codes-add.html` |

### `clinical-library.codes.html` (populated table)

- **Shell:** same as Guidelines — `layout-app-shell-responsive`, sidebar (Clinical Library active), topbar.
- **Page head:** `page-header` + `page-title` "Clinical Library" + `nav-segmented-control` (Diagnosis Codes active).
- ★ **Toolbar:** `toolbar` + `toolbar-search` (`search-input`, placeholder "Search by code or description") + `nav-filter-pills` (Active / Deprecated / All).
- ★ **Dense table:** `data-table data-table-compact` with `row-clickable`. Columns:
  - Code (`cell-mono cell-primary`) — ICD-10 code, monospace for readability
  - Description (`cell-primary`) — full text, may truncate at width
  - Status — `badge-success` "Active" / `badge-neutral` "Deprecated"
  - Last updated — `cell-mono` date
  - Actions — `btn-ghost btn-xs`: Edit, Deprecate/Restore
- **Page-level action:** `btn-primary` "Add code" in `page-header` actions-right.
- `data-pagination` below table.

### `clinical-library.codes-empty.html`

- Same shell + sub-nav (Codes active).
- `data-empty-state` (`empty-state-icon` — `fa-regular fa-tag`): "No diagnosis codes yet. Add codes to tag patients and filter dietary conformance."
- `btn-primary` "Add code".

### `clinical-library.codes-detail.html`

- Same shell + sub-nav.
- `nav-breadcrumb`: Clinical Library › Diagnosis Codes › {Code}.
- ★ **`record-header`**: code (`record-header-title`, monospace styling) + description (`record-header-subtitle`) + status badge right.
- **Body:** `kv-table` — fields: ICD-10 code, Full description, Status, Created, Last updated.
- **Actions:** `btn-primary` "Edit", `btn-outline` "Deprecate" (or "Restore"). Deprecate → `overlay-confirm-dialog` (warning: "Deprecating this code removes it from active use. Existing patient records that use this code will retain it historically.").
- **Cross-link:** "Used by N patients" `text-link` → Patients roster filtered to this code (deferred at build if cross-surface href not yet resolved). This is the most important cross-link: diagnosis codes are how coordinators tag patients and Patients/Diet Operations consume them.
- Inline edit at build (same decision as Guidelines): `field-row` inputs in-place or separate add page.

### `clinical-library.codes-add.html`

- Same shell + sub-nav.
- `nav-breadcrumb`: Clinical Library › Diagnosis Codes › Add.
- `page-header` + `page-title` "Add Diagnosis Code".
- **Form:** `field-row` set — ICD-10 code (text input, monospace, required; include `field-help` "e.g. E11.9"), Description (text input, full clinical text, required), Status (radio: Active / Deprecated, default Active).
- `forms-validation` error states.
- **Footer:** `sticky-footer` — `btn-primary` "Save code" + `btn-outline` "Cancel".
- On save: land on the new code's detail view; `toast-success` "Diagnosis code saved."

---

## Transitions

- **Sub-nav switch:** `guidelines` ↔ `codes` — same page shell, content region swaps; sub-nav active state updates.
- `guidelines → guidelines-detail` (row click) → back via breadcrumb → `guidelines`.
- `guidelines → guidelines-add` (Add guideline) → `guidelines-detail` (saved) or `guidelines` (cancelled).
- `guidelines-detail → overlay-confirm-dialog → guidelines` (archived/restored).
- `codes → codes-detail` (row click) → back via breadcrumb → `codes`.
- `codes → codes-add` (Add code) → `codes-detail` (saved) or `codes` (cancelled).
- `codes-detail → overlay-confirm-dialog → codes-detail` (deprecated/restored, state updated).
- Cross-surface transitions (deferred at build): diagnosis code detail → Patients roster; guideline detail → Diet Operations meal conformance context.

---

## Invariants (carry to acceptance + a11y)

- **Low-frequency register maintained** — no urgency color, no badge on the sidebar anchor. This is deliberate reference maintenance, not daily triage work. `badge-success` / `badge-neutral` for status only.
- **Sub-nav, not two sidebar items** — the single Clinical Library anchor + within-surface `nav-segmented-control` is the IA design choice. Do not split into two sidebar anchors at build.
- **Code column is monospace** — ICD-10 codes use `cell-mono` in the table and `record-header-title` monospace styling in detail; descriptions use standard type. Visual distinction between code and prose is load-bearing for clinical accuracy.
- **Deprecate is not delete** — diagnosis codes are historically associated with patients; deleting a code would corrupt records. Deprecate-not-delete is enforced: the action is "Deprecate" with a confirm dialog that explains the historical-retention behavior. No delete affordance on either entity.
- **Archive is not delete (guidelines)** — same principle; "Archive" preserves the guideline for historical conformance reference.
- **Furniture stable** — shell + page-header + sub-nav persist across all states; only the table body / empty-state / detail pane swaps.
- **A11y:**
  - `nav-segmented-control` uses `role="tablist"` / `role="tab"` or equivalent Preline pattern; active tab `aria-selected="true"`.
  - Dense table: `<th scope="col">` headers; `row-clickable` rows keyboard-activable via the code/name link (not a bare div onclick).
  - `overlay-confirm-dialog` traps focus; destructive action button is not the default focus target.
  - `forms-tags-input` (guideline linkage): each tag chip has a remove button with `aria-label="Remove {code}"`.
  - `nav-breadcrumb` provides context; `skip-link` to main content.
  - ICD-10 codes in the table read naturally as letters+numbers; no special `aria-label` override needed unless a screen-reader test reveals ambiguity at build.
- **Strings (voice):** operational/clinical — "Dietary Guideline", "Diagnosis Code", "ICD-10 code", "Active", "Deprecated", "Current", "Archived", "Diagnosis linkage", "Used by N patients", "Used by N meals". No plain-language softening; no gamification.
- **No real clinical/patient data** — guideline text and codes are representative (e.g. "E11 — Type 2 diabetes mellitus"), not sourced from Cena's live records.

---

## PL gap flags

**No blocking gaps** for this surface. All required components are confirmed in `COMPONENT-INDEX.md` (ds-binding.md coverage-confirmation: "Reference tables (Clinical Library): `data-table`, `kv-table`, `data-accordion`, `data-list-group` — ✅ covered").

Surface-level notes:

- **`nav-segmented-control`** — confirmed in index (`nav-segmented-control`, `segmented-control`, `segmented-control-btn`). Copy existing HTML; use `.active` on the active zone btn.
- **`cell-mono`** — confirmed as a `DataTable extension` class. Use on the ICD-10 code column.
- **Inline edit pattern** — composes existing `field-row` inputs in-place; no new primitive needed. Decision deferred to build (inline vs. separate add/edit page). Either path uses confirmed PL.
- **`toast-success` on save** — `toast.html` + `HavenToast.show()` API confirmed in index. Confirm at build that the static-bundle page can initialize `toast.js` correctly.

---

## Shared-primitive reuse (★ from patients/states.md — no re-authoring)

- ★ **Toolbar pattern** (`toolbar` + `toolbar-search` + `nav-filter-pills`) — reused here as on Patients, Referrals, Diet Ops, Network.
- ★ **Dense table** (`data-table-compact` + `row-clickable` + column structure) — same primitive, different column set.
- ★ **`record-header`** (`layout-record-header`) — reused for guideline and code detail views.
- ★ **`kv-table`** — detail view body, same usage as Patient record overview.
- ★ **`sticky-footer`** (`layout-sticky-footer` + `sticky-footer-actions`) — add/edit form Save/Cancel; same pattern as Patients intake.
- ★ **`overlay-confirm-dialog`** — archive/deprecate/restore confirmations; same pattern as Patients bulk actions and app-access changes.

No new shared primitives authored here (Clinical Library is a consumer of existing patterns, not an author of new ones). The bulk-action-bar promote-candidate from Patients does NOT apply to this surface — Clinical Library has no multi-select bulk actions; the reference table is lean by design.
