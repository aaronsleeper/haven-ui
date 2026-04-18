# CC-06: Care Plan Diff

**Application:** Care Coordinator Admin App (Desktop)
**Use Case(s):** UC-CC-07 (Alt 1: Care Plan Update)
**User Type:** Care Coordinator
**Device:** Desktop (center panel of three-panel shell)
**Route:** `/care-coordinator/` (center panel, loaded when a care plan update queue item is selected)

## Page Purpose

Show what changed between care plan versions so the coordinator can review quickly without re-reading the entire plan. The new version is the primary view, with changes highlighted inline. Unchanged sections are collapsed. This is the difference between a 5-minute review and a 15-minute review.

---

## Layout Structure

### Shell
Center panel of CC-SHELL. Same as CC-05 but with diff-specific header and content treatment.

### Header Zone

#### Record Header
- **Component:** `[NEW COMPONENT: record-header]` (same component, diff context)
- Left side:
  - "Care Plan Update" — `text-lg font-semibold text-gray-900`
  - Patient name below — `text-sm text-gray-500`
- Right side:
  - Version label: `badge-sm badge-neutral` "v1.0 → v1.1"
  - Emergency variant: `badge-sm badge-error` "v1.0 → v1.0e — Emergency"

#### Change Summary
- **Component:** `alert-info` (or custom banner)
- Full-width below record header
- Content: "3 fields updated in 2 sections" — concise summary of what changed
- If emergency: "Triggered by: HbA1c 12.1 — up from 8.4" in `alert-warning`
- Dismissible after reading

### Content Zone

Same accordion structure as CC-05, but with diff-aware behavior:

- **Changed sections:** Expanded by default, with inline diff highlighting
- **Unchanged sections:** Collapsed by default, header shows `fa-minus text-gray-300` + "No changes"

#### Diff Highlighting
- **Component:** `[NEW COMPONENT: diff-added — inline highlight for additions]` and `[NEW COMPONENT: diff-removed — inline highlight for deletions]`
- **Additions:** `bg-green-50 text-green-800` with subtle left border `border-l-2 border-green-400`, or underline for inline text changes
- **Deletions:** `bg-red-50 text-red-800 line-through`, or strikethrough for inline text changes
- **Modified values:** Show old value struck through, then new value highlighted. Example:
  ```
  Sodium: ~~2300mg~~ → 1800mg
  ```
  Old value uses `.diff-removed`, new value uses `.diff-added`
- **Added sections/rows:** Entire row gets `.diff-added` background
- **Removed sections/rows:** Entire row gets `.diff-removed` background

#### Example: Changed Section (Nutrition Plan)
- **Accordion header:**
  - `fa-pen text-amber-500` + "Nutrition Plan" + `badge-sm badge-warning` "Modified"
  - Count: "1 field changed"
- **Accordion body:** Same `kv-table` as CC-05, but with diff applied:
  | Label | Value |
  |---|---|
  | Calories | 1600–1800 cal/day |
  | Sodium | ~~2300mg~~ → 1800mg `.diff-removed` / `.diff-added` |
  | Diet type | Diabetic-appropriate |
  | Allergens | Nut-free |

#### Example: Unchanged Section (Behavioral Health)
- **Accordion header:**
  - `fa-minus text-gray-300` + "Behavioral Health" — `text-gray-400`
  - "No changes"
- **Accordion body:** (collapsed) Same content as CC-05, no highlighting

#### Example: Added Section (if a new section was added)
- **Accordion header:**
  - `fa-plus text-green-600` + "New Section Name" + `badge-sm badge-success` "Added"
- **Accordion body:** Entire content has `.diff-added` background

### Footer Zone
No footer.

---

## Interaction Specifications

### Toggle "Show Changes Only"
- **Trigger:** Toggle switch at the top of the content zone, next to the change summary
- **Feedback:** When on, unchanged sections are hidden entirely (not just collapsed). When off, all sections are visible (unchanged ones collapsed).
- **Navigation:** None
- **Error handling:** N/A

### Expand Unchanged Section
- **Trigger:** Click accordion header of an unchanged section
- **Feedback:** Expands to show current content (no diff highlighting — nothing changed)
- **Navigation:** None
- **Error handling:** N/A

---

## States

### Loading State
- Record header: `skeleton-text` for title
- Change summary: `skeleton-text` banner
- Content: 4-5 `skeleton` accordion items

### Error State
- `alert-error`: "Couldn't load care plan changes."
- CTA: `btn-outline` "Retry"

### No Changes State
- Extremely unlikely (wouldn't be in queue if nothing changed), but defensive:
- `alert-info`: "No differences between versions."
- Full plan shown without diff highlighting

---

## Accessibility Notes
- Diff highlighting uses color + text decoration (strikethrough for removed, underline or bold for added) — not color alone
- Screen reader: `.diff-added` has `aria-label="Added: [value]"`, `.diff-removed` has `aria-label="Removed: [value]"`
- "Show changes only" toggle: `aria-label="Show only changed sections"`

## Open Questions
- Should the coordinator be able to click a changed field to see a tooltip with the full before/after context? Or is inline display sufficient?
- Should the version comparison be selectable? (i.e., "Compare v1.0 with v1.1" dropdown for plans with 3+ versions) — probably future.

---

## New Components Flagged
- `[NEW COMPONENT: diff-added — inline/block highlight for added content. bg-green-50, text-green-800, optional left border or underline.]`
- `[NEW COMPONENT: diff-removed — inline/block highlight for removed content. bg-red-50, text-red-800, line-through.]`
