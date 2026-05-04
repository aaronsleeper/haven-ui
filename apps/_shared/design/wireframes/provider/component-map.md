# Component Map: Provider App — Universal Shell Pipeline (2026-05-04)

**Date:** 2026-05-04
**Source wireframes:**
- `apps/_shared/design/wireframes/provider/pv-shell-flow.md`
- `apps/_shared/design/wireframes/provider/shell-pv-provider.md`
- `apps/_shared/design/wireframes/provider/pv-01-patient-record-with-clinical-decision.md`
**components.css read:** 2026-05-04 (fresh — `thread-approval-card` confirmed at lines 7969–8111; `.is-clinical` modifier confirmed absent)
**COMPONENT-INDEX.md read:** 2026-05-04 (fresh — `thread-approval-card` row confirmed: variants `is-urgent, is-warning, is-historical`; `.is-clinical` absent)

> Provider app is archived at `archive/inactive-apps/provider/`. Design proceeds here in `_shared/`. Build waits on `git mv archive/inactive-apps/provider apps/provider`.

---

## Component Inventory Summary

**Existing components used:** 28
**New components required:** 1 (`thread-approval-card.is-clinical` variant)
**Utility-only patterns:** 2

---

## New Components Required

| Component | Spec File | Priority | Preline Base |
|-----------|-----------|----------|--------------|
| `thread-approval-card.is-clinical` (Tier 1 variant on existing primitive) | `apps/_shared/design/new-components/thread-approval-card-is-clinical.md` | Required for launch | No — extends existing Haven primitive |

---

## Screen: shell-pv-provider (Persistent Provider Shell)

**Wireframe source:** `wireframes/provider/shell-pv-provider.md`

### Recipe

1. **Shell root:** `agentic-shell` — inherits universal shell; right pane always rendered ≥720px (provider always uses thread)
2. **Left pane — Clinical queue gate-type-grouped:**
   - `queue-sidebar` → `queue-sidebar-brand` → `nav-header` + `nav-logo` (Cena wordmark)
   - `queue-sidebar-body`:
     - Five gate-type sections (content-label grouping — inline carve-out, no new visual modifier for `queue-section-header`; gate-type labels are content not visual-semantic):
       - "Care plan nutrition reviews" — `queue-section-header` + `fa-clipboard-list` (sand), 24h SLA
       - "SOAP notes pending signature" — `queue-section-header` + `fa-pen-clip` (cyan), 48h SLA
       - "Lab results flagged" — `queue-section-header` + `fa-flask` (gold), 8h SLA
       - "Recipe nutritional validation" — `queue-section-header` + `fa-utensils` (lime), 72h SLA
       - "Meal match exceptions" — `queue-section-header` + `fa-triangle-exclamation` (rose), 8h SLA
     - Each section: `queue-list` → `queue-item` (patient name + gate-type `badge-pill` + summary + SLA chip `.is-warning` / `.is-breached`)
   - Below: `divider` → `sidebar-nav-list` → `sidebar-nav-item` × 3 (Patients / Recipes / Settings)
   - User menu pinned bottom: `avatar-sm` + role label + `hs-dropdown`
3. **Center pane — Caseload overview (default) / patient record (item selected):**
   - Default: `record-header` "Your caseload · 47 patients" + `data-table` with `clinical-patient-row` rows
   - Item selected: gate-specific view — see pv-01 recipe below for care-plan nutrition review
4. **Right pane — Clinical thread + clinical approval card:**
   - `thread-panel` (provider clinical allowlist: full clinical messages + BHN summaries + coordinator notes)
   - Active card hero: `[NEW COMPONENT: thread-approval-card.is-clinical variant]`
   - Thread events: `thread-msg-system`, `thread-msg-tool` (collapsed), `thread-msg-human`, `thread-msg-response`
   - Bottom: `prompt-input-container` — placeholder "Ask Ava (e.g., 'Pull last 12 months HbA1c')…"
5. **Empty state (no clinical items):** `data-empty-state` — "Nothing pending right now" + body copy
6. **Loading:** `skeleton` rows + skeleton section headers; center caseload `data-table` skeleton
7. **Error:** per-pane `alert-error`; other panes continue

### Data Bindings

- Gate-type sections: `*ngFor` over clinical gate groups; counts reactive
- SLA chip state: `.is-warning` if elapsed > 75%; `.is-breached` if elapsed > 100%
- `queue-item.active`: bound to selected item ID; `aria-current="true"`
- Clinical approval card: `[NEW COMPONENT: thread-approval-card.is-clinical]` — rendered when `approval.type === 'clinical_decision'`

### Preline Interactions

- `panel-splitter.js` — drag-resize both boundaries
- `hs-dropdown` on user menu
- `data-hs-collapse` on `thread-msg-tool` rows (HSCollapse)
- `data-hs-overlay` — modals for Reassign (deferred) + any dialogs

---

## Screen: pv-01-patient-record-with-clinical-decision (Worked Example)

**Wireframe source:** `wireframes/provider/pv-01-patient-record-with-clinical-decision.md`

### Recipe

1. **Shell:** `shell-pv-provider`; active queue: "Care plan nutrition reviews"; active item: Maria Rivera
2. **Left pane:** clinical queue; Maria Rivera "Nutrition review pending signature" `.active` with SLA `.is-warning`
3. **Center pane — Patient record with nutrition focus:**
   - `record-header` → title "Maria Rivera · Care Plan v2 — Nutrition Section" (Lora Heading/01) + `record-header-subtitle` (DOB + MRN + ICD-10 inline) + `record-header-trailing` (`badge-warning` "Pending signature" + `badge-info` "Moderate") + `record-header-meta` (drafted by Ava + last visit)
   - Patient identity: `clinical-patient-card` — name + avatar + DOB + MRN + active diagnoses chips + caseload note
   - Biomarker trends: `card` → `card-header` "Biomarker trends" + `card-body`
     - `trend-chart` (Chart.js, line charts only per DESIGN.md Tufte rule) × 4 metrics (HbA1c / Lipid / Weight / Nutritional labs)
     - `clinical-metric-card` × 4 — current value + delta + `badge-trend`
   - Dietary restrictions: `card` → `tag-group` (restrictions + preferences)
   - Nutrition section editor: `card` → `card-header` "Nutrition plan (agent draft — review before signing)" + `card-body`
     - `clinical-nutrition-list` → editable rows (caloric / protein / sodium / carbohydrate / fiber)
     - `clinical-ai-field` styling on agent-changed values (violet ai-insight indicator); `clinical-ai-field-confirmed` after RDN click
   - Care plan diff: `card` → `card-header` "What changed" + inline diff (2 metrics changed) + `text-link` "View full plan diff"
   - Meal plan preview: `card` → `data-table` (7-day × 3-meal grid) + helper Body/03
4. **Right pane — Clinical thread with `.is-clinical` approval card (hero):**
   - **`[NEW COMPONENT: thread-approval-card.is-clinical variant]`:**
     - `thread-approval-header`: `fa-stethoscope` + `<h3>` "Clinical signature requested · Care plan nutrition section" + Ava sparkle dot
     - `thread-approval-body`:
       - `thread-approval-context` → title + meta (drafted by Ava + lab pulls + coordinator briefed)
       - `thread-approval-ncp` (**new block**) — NCP PES statement + nutrition diagnosis (NI-5.8.1) + intervention (ND-1.2) + monitoring (HbA1c 3mo)
       - `thread-approval-icd` (**new block**) — E11.9 + I10 inline
       - `thread-approval-summary` — Body/03 plan summary
       - `thread-approval-effects-label` + `thread-approval-effects` (3-bullet: lock nutrition section / resume meal-match / route to coordinator)
     - `thread-approval-actions` (NN/G-ordered per Stage 2-review): `btn-primary btn-sm` "Sign & approve" (`fa-pen-fancy` icon) + `btn-outline btn-sm` "Edit first" + `btn-ghost btn-sm` "Reassign to BHN" (`aria-disabled="true"` + `aria-describedby` sr-only span) + `btn-outline btn-sm` "Reject" (rightmost, 16px gap)
     - `thread-approval-note` (hidden until Reject) → `<label class="sr-only">` + textarea + `btn-danger btn-sm` "Send reject" + `btn-ghost btn-sm` "Cancel"
   - **Full spec:** `apps/_shared/design/new-components/thread-approval-card-is-clinical.md`
   - Thread events (above card, scrollable — newest at bottom):
     - `thread-msg-tool` × 4 (collapsed) — HbA1c pull / lipid pull / meal plan gen / nutrition draft
     - `thread-msg-system` — coordinator note "Patient confirmed lower sodium"
   - Bottom: `prompt-input-container` — placeholder "Ask Ava (e.g., 'Pull last 12 months HbA1c')…"
5. **Toast (on Sign & approve):** `toast` + `toast-info` — 10-second undo window (clinical stakes per Gate 2 decision 1); portal at document level
6. **Post-signature:** `thread-msg-response.is-approved` with digital signature timestamp + signer identity; center `badge-success` "Signed by Dr. Soto"; downstream `thread-msg-system` events log routing + meal-match
7. **Edit-first sticky footer (when active):** `sticky-footer` → `btn-primary` "Save & sign" + `btn-outline` "Cancel"
8. **Error (signature write fails):** `alert-error` inline below card; card stays pending; toast persists
9. **`clinical-ai-field` confirm interaction:** field transitions to `clinical-ai-field-confirmed`; `aria-live="polite"` announces "Reviewed by Dr. Soto"

### Data Bindings

- ICD-10 codes: rendered inline in `record-header-subtitle` as Body/03 — no special semantic markup
- `clinical-ai-field`: variant bound to `field.agent_changed === true`; confirmed state bound to `field.reviewed_by`
- `thread-approval-ncp` content: bound to `approval.clinical_data.ncp` — NCP code + description + intervention + monitoring
- `thread-approval-icd` content: bound to `approval.clinical_data.icd10_codes[]`
- Signature timestamp: written to `approval.signature.timestamp` + `approval.signature.actor` on commit
- 10-second undo: provider-specific; distinct from 5-second coordinator undo (different stakes)

### Preline Interactions

- `data-hs-collapse` — all tool-call rows default collapsed
- `data-hs-overlay` — sticky footer (Edit-first mode) is inline React state, not an overlay
- Toast: `HavenToast.show()` — 10s timeout (extend default from `toast.js`)

---

## Utility-Only Patterns

- `card.bg-violet-16` pattern noted for future BHN summary card (deferred to v1.1 when BHN ships) — not present at v1; noted here for dev-tasker awareness
- `aria-disabled="true"` + `aria-describedby` + sr-only span pattern on "Reassign to BHN" button — HTML attribute pattern, no semantic class
