# shell-pv-provider: Provider Shell (Universal Agentic Base)

**Application:** Provider App (RDN — primary v1 scope)
**Use Case(s):** PR-SHELL-01 through PR-SHELL-05 (`apps/_shared/design/provider-shell-use-cases.md`)
**User Type:** Provider (RDN — Dr. Soto)
**Device:** Desktop primary
**Route:** Persistent shell wrapping every provider route

This wireframe specifies provider's slice of the universal shell — the `agentic-shell` rich base specialized for the RDN's clinical-review workflow. Inherits structure from `apps/_shared/design/wireframes/shell-universal-agentic.md`. Per Gate 2-prep decision 8, provider serves RDN only at v1; BHN is deferred.

---

## Page Purpose

Render the persistent three-pane workspace for Dr. Soto. Left = clinical queue gate-type-grouped + secondary nav (Patients caseload, Recipes, Settings). Center = caseload by default; patient record viewer / care plan / SOAP note / recipe validation on demand. Right = clinical activity thread including any active clinical-decision approval card. The RDN opens the app, sees the clinical day at a glance, and works through review-and-signature gates with the agent's drafts in hand.

---

## Layout Structure

### Shell

Inherits from `shell-universal-agentic.md`:
- `agentic-shell` flex root at `height: 100vh`
- Three panes, two `panel-splitter` handles, drag-resize
- 260px default left, flex center, 640px default right (480-800)
- Surface: chrome → page → solid white inputs

### Header Zone — left pane top

- **Component:** `nav-header` + `nav-logo`
- Cena Health wordmark (constant)

### Content Zone

#### Left pane (`panel-nav`) — Clinical queue gate-type-grouped + secondary nav

- **Component:** `queue-sidebar` + `queue-sidebar-brand` + `queue-sidebar-body`
- Five queue sections (gate-type-grouped — inline carve-out using existing `queue-section-header` with content-only labels, no new visual modifier):
  - Care plan nutrition reviews (count) — 24h SLA — leading `fa-clipboard-list` (sand)
  - SOAP notes pending signature (count) — 48h SLA — leading `fa-pen-clip` (cyan)
  - Lab results flagged (count) — varies / 8h for meal-relevant — leading `fa-flask` (gold)
  - Recipe nutritional validation (count) — 72h SLA — leading `fa-utensils` (lime)
  - Meal match exceptions (count) — 8h SLA — leading `fa-triangle-exclamation` (rose)
- Within each section: `queue-list` of `queue-item` rows
  - Each `queue-item`: patient name + gate-type badge + one-line summary + time-in-queue + SLA chip (`is-warning` at 75% elapsed; `is-breached` past)
  - Active state: `.active` (`aria-current="true"`) — teal left border + bold name
- Below sections: `divider` + secondary nav: Patients (caseload) / Recipes / Settings (`sidebar-nav-list`)
- User menu pinned at bottom — Dr. Soto's `avatar-sm` + name + role badge + dropdown
- Surface: pane = translucent white over chrome ground

#### Center pane (`panel-chat`) — Caseload / patient record / care plan / SOAP / recipe

- **Component:** envelope is `panel-chat`; inner content varies by view
- **Default (no item selected):** caseload overview
  - `record-header` "Your caseload · 47 patients"
  - `data-table` with `clinical-patient-row` rows; sortable by last activity, risk tier, next MNT visit
- **Care plan nutrition review selected:** patient record viewer with nutrition focus — see pv-01 wireframe
- **SOAP note selected:** SOAP note draft (S/O/A/P sections, deferred wireframe)
- **Lab flag selected:** patient record with lab focus (deferred wireframe)
- **Recipe validation selected:** recipe + nutritional values (deferred wireframe)
- **Meal-match exception selected:** patient + dietary constraints + recipe failure log (deferred wireframe)
- Min-width 480 floor (560 comfortable). Never collapses.

#### Right pane (`panel-content`) — Clinical thread + clinical-decision approval card

- **Component:** `thread-panel` configured with **provider clinical allowlist** — `system`, `agent_tool_call`, `agent_tool_result`, `approval_request` (clinical variant), `approval_response` (with signature timestamp + actor), `human_message` (RDN, BHN summaries, coordinator notes), `notification`, `status_change`
- Active clinical-decision approval card (when present) pins as the hero — `[NEW COMPONENT: thread-approval-card.is-clinical variant]` carrying NCP terminology + ICD-10 mapping + signature affordance
- BHN + coordinator messages render **as summaries**, not full conversational threads (keeps attention on clinical action)
- Thread events render newest at bottom — `thread-msg-system`, `thread-msg-tool`, `thread-msg-human`, `thread-msg-response`
- Bottom: `prompt-input-container` for clinical-direction queries (e.g., "Pull last 6 months HbA1c trend")
- Default 640px; clamp 480-800

### Footer Zone

No persistent footer at shell level. Sticky CTAs (e.g., Save & approve in care plan editor) live in center record viewer.

---

## Interaction Specifications

### Open app
- **Trigger:** Dr. Soto loads `/`
- **Feedback:** Shell renders; left = clinical queue; center = caseload; right = empty
- **Navigation:** Stays at /
- **Error handling:** Per universal shell

### Click clinical queue item
- **Trigger:** Click any `queue-item`
- **Feedback:** Item gets `.active`
- **Navigation:** Center loads gate-specific view (patient record / SOAP / lab / recipe / meal-match); right loads clinical thread for the record, scrolled to the active approval card
- **Error handling:** Per universal shell

### Type in clinical thread input
- **Trigger:** Type query in `prompt-input-container`
- **Feedback:** Message appears as `thread-msg-human`; spinner with "Ava is working..."
- **Navigation:** Stays in current record context; tool call + result render in thread
- **Error handling:** Send-failed retry icon

### Approve / Edit / Reject / Reassign-to-BHN on clinical-decision approval card [REVISED]
- See pv-01 for the worked-example interaction details
- Reassign-to-BHN is **disabled at v1** (BHN deferred per Gate 2-prep decision 8)
- Disabled-state accessibility: button uses `aria-disabled="true"` AND `aria-describedby="reassign-bhn-helper"` referencing a hidden `<span id="reassign-bhn-helper" class="sr-only">BHN review is not yet available — please contact coordinator</span>`. Tooltip on hover/focus presents the same text visually. Tooltip-only is insufficient because some screen readers don't surface tooltips on disabled controls.

### Resize panes
- Per universal shell

### Toggle nav collapse
- Per universal shell

---

## States

### Default (queue loaded, no item selected) [REVISED]
- Left: queue rendered, 5 gate-type sections with item counts; SLA chips visible
- Center: caseload overview (47 patients)
- Right: empty state with "Pick a clinical review to start."

### Default (item selected)
- Left: queue + selected item active
- Center: gate-specific view per pv-01 (or other gate-type wireframes when authored)
- Right: clinical thread + active approval card

### Loading
- Left: `skeleton` rows under skeleton section headers
- Center: caseload `data-table` skeleton OR record-header skeleton + `clinical-*` block skeletons
- Right: skeleton thread events + skeleton approval card

### Empty State (no clinical items) [REVISED]
- Left pane body: `data-empty-state`
  - Heading: "Nothing pending right now"
  - Body: "We'll surface clinical reviews as they come in."
- Center: caseload still renders

### Error State
- Per-pane `alert-error` with retry; other panes continue functioning

### SLA-breached state
- Queue items past SLA: `queue-item.is-breached`: red SLA chip + persistent at top of section + escalation tooltip

---

## Accessibility Notes

- Left = `<aside aria-label="Clinical queue">`; center = `<main aria-label="Main content">`; right = `<aside aria-label="Clinical activity thread">`
- Tab order left → center → right
- No focus trapping in shell
- Touch targets 44px+ (provider is desktop-primary; mouse / keyboard primary input)
- Color-as-status: SLA chips, gate-type indicators, approval-card variants all carry icon + label, never color alone
- Approval card: `<section role="region" aria-labelledby>` with `<h3>` for landmark navigation
- Live regions: `aria-live="polite"` on left + right pane bodies for dynamic updates
- Screen-reader announcement on approval card hero entrance

## Bilingual Considerations

- Provider EN-only at v1
- Future Spanish-speaking RDN support is a string update

## Open Questions

- Reassign-to-BHN UI at v1: render the button disabled with helper, or hide entirely? Recommend disabled with helper — it's a known v1 gap that will fill in later; users see the affordance is in the system.
- Caseload-as-default center: confirm caseload is the right "orientation" surface for Dr. Soto. Alternative: morning summary similar to coordinator. Recommend caseload — RDN's primary identity is "I have N patients" not "I have N items today."
- Right pane default visibility: provider always uses thread (drives every clinical decision) — keep right pane always-rendered above 720px, not collapsible-by-default like kitchen. Confirm.
- BHN message summaries: how do they render in the provider thread when they exist? Recommend: small `card.bg-violet-16` (premium-special-status, per `DESIGN.md` 9-color palette) with sender label "BHN summary" + truncated body + "View full" link. Defer detail to v1.1 when BHN ships.

---

## New Components Flagged

### `[NEW COMPONENT: thread-approval-card.is-clinical variant]` — Tier 1 variant, brand-fidelity-weighted, 4-expert panel required

(Detailed in pv-01 wireframe.)

Anatomy: extends shipped `thread-approval-card` with new modifier class `.is-clinical`. Same anatomy (header / context / summary / effects / actions) but content priorities differ:
- NCP (Nutrition Care Process) terminology in the summary block
- ICD-10 mapping displayed inline (not hidden behind a toggle)
- Signature affordance (digital signature timestamp + signer identity) on the Approve action
- Clinical-decision-specific iconography (subtle stethoscope / clipboard glyph) in header

Why a variant, not a new primitive:
- Same structural anatomy as other approval cards
- Brand-fidelity-weighted because clinical signature is high-stakes; voice + visual hierarchy + Ava identity carry weight
- 4-expert panel required for the modifier class entry in `components.css`
