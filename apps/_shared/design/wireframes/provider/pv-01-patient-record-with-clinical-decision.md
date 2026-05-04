# pv-01-patient-record-with-clinical-decision: Clinical Queue + Patient Record + Clinical Decision (Worked Example)

**Application:** Provider App (RDN)
**Use Case(s):** PR-SHELL-02 (`apps/_shared/design/provider-shell-use-cases.md`)
**User Type:** Provider (RDN — Dr. Soto)
**Device:** Desktop primary
**Route:** `/patients/maria-rivera/care-plan`

This is the worked example for the provider slice (Gate 1 G1.2 minimum): clinical queue + selected patient record + clinical-decision approval card. Demonstrates the per-app minimum inside the universal agentic shell. The active queue item is **Maria Rivera's care plan nutrition section pending Dr. Soto's signature** — the clinical predecessor to the coordinator's full-plan approval (cc-01).

---

## Page Purpose

Dr. Soto opens the app and sees the clinical queue. The top item: Maria Rivera, "Care plan nutrition review pending signature." She clicks. The center loads Maria's patient record with focus on nutrition section + biomarker trends + the agent's drafted nutrition update. The right pane shows the clinical thread — the agent's reasoning steps, lab pulls, meal-match exceptions — and a `thread-approval-card.is-clinical` with NCP terminology, ICD-10 mapping, and a signature affordance. Dr. Soto reviews, optionally edits the nutrition values, and signs. The signed care plan transitions to coordinator's queue for full-plan approval.

---

## Layout Structure

### Shell

Inherits from `shell-pv-provider.md`. Three panes:
- Left: clinical queue with Maria Rivera "Care plan nutrition review" active
- Center: patient record with nutrition focus + biomarker trends + agent's drafted nutrition section (editable)
- Right: clinical thread with `thread-approval-card.is-clinical` pinned

### Header Zone — `record-header` in center pane

- **Component:** `record-header` + `record-header-main` + `record-header-title` + `record-header-subtitle` + `record-header-trailing` + `record-header-meta`
- Title: "Maria Rivera · Care Plan v2 — Nutrition Section" (Lora display, Heading/01)
- Subtitle: "DOB 1958-03-12 · MRN PT-2024-0847 · Type 2 Diabetes (E11.9), Hypertension (I10)" (Body/03 muted; ICD-10 codes inline because RDN reads them)
- Trailing: status `badge-warning` "Pending signature" + risk tier `badge-info` "Moderate"
- Meta: "Drafted by Ava 9:30 AM · Last visit MNT 97803 with Dr. Soto · 2026-04-22"

### Content Zone

#### Left pane — Clinical queue with active item

- Section: "Care plan nutrition reviews" (count: 1)
  - `queue-item.active` (`aria-current="true"`) — Maria Rivera "Nutrition review pending signature" + SLA chip "12h elapsed / 24h" `.is-warning`
- Section: "SOAP notes pending signature" (count: 3) — preview rows
- Section: "Lab results flagged" (count: 2) — preview rows
- Section: "Recipe nutritional validation" (count: 5) — preview rows
- Section: "Meal match exceptions" (count: 1) — preview rows
- Below: secondary nav (Patients, Recipes, Settings)

#### Center pane — Patient record with nutrition focus

- **Record header** (described above)

- **Patient identity card** — `clinical-patient-card`
  - Patient name + photo (if available; otherwise `avatar-icon`) + DOB + MRN + active diagnoses (chips) + caseload note ("Assigned to Dr. Soto since 2024-08")

- **Biomarker trends card** — `card` with `card-header` "Biomarker trends" + `card-body`
  - Inside: `trend-chart` (Chart.js, line charts only per Tufte) showing 4 metrics over 6 months:
    - HbA1c (target <7.0; current 6.8 — improving)
    - Lipid panel (LDL trend; current within target)
    - Weight (kg, slow downward trend)
    - Nutritional labs (albumin, prealbumin — stable)
  - Each metric: `clinical-metric-card` with current value + delta + trend badge
  - **No pie/donut charts** per `DESIGN.md`

- **Dietary restrictions + preferences card** — `card`
  - `tag-group` with restrictions (Nut-free, low-sodium target 1800mg, Mediterranean-leaning preferences)
  - "Editable" note: only coordinator + RDN can update; patient-stated preferences come through coordinator

- **Nutrition section editor card** — `card` with `card-header` "Nutrition plan (agent draft — review before signing)" + `card-body`
  - Inside: `clinical-nutrition-list` — editable rows:
    - Caloric target: `nutrition-input` 1500 kcal/day (was 1600 — reduced; agent flagged "weight trend supports lower target")
    - Protein: `nutrition-input` 75 g/day (unchanged)
    - Sodium: `nutrition-input` 1800 mg/day (was 2000 — reduced; agent flagged "BP trending up")
    - Carbohydrate: `nutrition-input` 175 g/day (unchanged)
    - Fiber: `nutrition-input` 30 g/day (unchanged)
  - Each row: `clinical-ai-field` styling (subtle violet ai-insight indicator) on agent-changed values; `clinical-ai-field-confirmed` after RDN reviews + clicks confirm
  - "Reviewed by [Dr. Soto]" indicator appears next to each value once RDN clicks the confirm icon

- **Care plan diff card** — `card` with `card-header` "What changed" + `card-body`
  - Inline diff: 2 metrics changed (caloric target, sodium) with rationale from agent
  - `text-link` "View full plan diff" routes to a fuller comparison view (deferred wireframe)

- **Meal plan preview card** — `card`
  - `data-table` showing 7 days × 3 meals/day grid, recipe-matched to the new nutrition targets
  - Helper: "Ava generated this meal plan from Maria's preferences and the nutrition targets above. Approving the nutrition section resumes the meal-match workflow." [REVISED]

#### Right pane — Clinical thread with `thread-approval-card.is-clinical`

- **Active approval card (hero) — `[NEW COMPONENT: thread-approval-card.is-clinical variant]`:**
  - Header: `thread-approval-header` with `fa-stethoscope` icon (sand) + "Clinical signature requested · Care plan nutrition section" + Ava avatar (16px sparkle leading dot)
  - Body: `thread-approval-body`
    - `thread-approval-context` — `thread-approval-context-title` "Maria Rivera · Care Plan v2 nutrition section" + `thread-approval-context-meta` "Drafted by Ava 9:30 AM · Pulled HbA1c 9:28 AM · Pulled lipid panel 9:28 AM · Coordinator briefed at 9:32 AM"
    - **NCP terminology block (clinical-variant-specific):** Body/03 with NCP framing:
      - PES Statement: "Inadequate carbohydrate intake (NI-5.8.1) related to elevated HbA1c, as evidenced by 6.8% current HbA1c and patient self-report of meal pattern"
      - Nutrition diagnosis: NI-5.8.1 (carbohydrate)
      - Intervention: ND-1.2 (modify carbohydrate distribution)
      - Monitoring: HbA1c at 3 months
    - **ICD-10 mapping block (clinical-variant-specific):**
      - E11.9 — Type 2 Diabetes mellitus without complications
      - I10 — Essential (primary) hypertension
    - `thread-approval-summary` — Body/03: "Plan: 1500 kcal, 1800mg sodium, 75g protein/day, Mediterranean-lean. Two values changed from v1 (caloric target -100, sodium -200). Rationale: supports current weight + BP trends."
    - `thread-approval-effects-label` "Signing this nutrition section will:" + `thread-approval-effects` (3-bullet list):
      - Lock the nutrition section to v2 with your digital signature + timestamp
      - Resume meal-match workflow (7 days)
      - Route the full care plan to coordinator for final approval
  - Actions row: `thread-approval-actions` [REVISED — action ordering separates destructive from happy-path per NN/G "Dangerous UX" guidance; clinical stakes warrant firmer separation]
    - `btn-primary btn-sm` "Sign & approve" (primary teal — clinical commitment per `DESIGN.md` brand-taste rule); icon `fa-pen-fancy`
    - `btn-outline btn-sm` "Edit first"
    - `btn-ghost btn-sm` "Reassign to BHN" (disabled at v1 per Gate 2-prep decision 8; `aria-disabled="true"` + `aria-describedby="reassign-bhn-helper"` referencing hidden `<span class="sr-only">BHN review is not yet available — please contact coordinator</span>`; tooltip on hover/focus presents the same text visually)
    - `btn-outline btn-sm` "Reject" (rightmost; visually separated by 16px gap from Sign & approve)
  - Note field (collapsed by default; expands on Reject) — `thread-approval-note` + sr-only `<label>`. Required; minimum 10 chars.
  - Signature affordance: when "Sign & approve" tapped, signature timestamp + Dr. Soto identity attach to the decision (rendered in the response message, not before)
  - Approval card auto-scrolls to itself on first record-open (Gate 2 decision 6); preserves user scroll on subsequent reads.

- **Recent thread events** (above the approval card, scrollable): [REVISED — default collapsed state stated explicitly]
  - `thread-msg-tool` (collapsible, default collapsed) — Ava authored — "Pulled HbA1c trend (last 6 months)" + on expand: trend data summary
  - `thread-msg-tool` (collapsible, default collapsed) — Ava authored — "Pulled lipid panel (most recent: 2026-04-15)"
  - `thread-msg-tool` (collapsible, default collapsed) — Ava authored — "Generated meal plan with 1800mg sodium target"
  - `thread-msg-tool` (collapsible, default collapsed) — Ava authored — "Drafted nutrition section v2"
  - `thread-msg-system` "9:32 AM · Coordinator (Sarah K.) noted: 'Patient confirmed she'd like to try lower sodium.'" — operational note from coordinator (provider allowlist permits coordinator notes as summaries)
  - Older events fade upward; user scrolls for history

- **Thread input** at bottom: `prompt-input-container` — placeholder "Ask Ava (e.g., 'Pull last 12 months HbA1c')…" [REVISED]

### Footer Zone

No persistent footer; record-viewer in center has a sticky footer **only** when in Edit-first mode (sticky `btn-primary` "Save & approve" + `btn-outline` "Cancel").

---

## Interaction Specifications

### Tap "Sign & approve" [REVISED]
- **Trigger:** Click `btn-primary btn-sm` "Sign & approve" in the approval card
- **Feedback:** Card actions disable; **10-second** undo `toast.toast-info` slides in (per Gate 2 decision 1 — clinical signature gets a longer window than coordinator's 5s because audit-trail / billing implications are irreversible): "Signed at 9:48 AM. Tap to undo." with `fa-arrow-rotate-left`
- **Navigation:** On undo timeout (10s elapsed):
  1. Approval card collapses to `thread-msg-response.is-approved` summary: "[Dr. M. Soto, RDN] Signed · 9:48 AM · digital signature applied"
  2. Queue item disappears from left; "Care plan nutrition reviews" count decrements 1 → 0
  3. Care plan transitions: nutrition section locked, full plan routes to coordinator's queue (the cc-01 worked example)
  4. Center pane status badge updates to `badge-success` "Signed by Dr. Soto · 9:48 AM"
  5. New `thread-msg-system` events log downstream: "9:48 AM · Care plan routed to coordinator for final approval", "9:48 AM · Meal-match workflow resumed"
- **Error handling:** If signature write fails: undo toast persists; `alert-error` inline below card "We couldn't save the signature. Tap retry, or contact support if it keeps failing." + retry CTA "Try again"; signature stays unsigned [REVISED]

### Tap "Edit first"
- **Trigger:** Click `btn-outline btn-sm` "Edit first"
- **Feedback:** Center pane nutrition section transitions to inline-edit mode (input rows become editable; `nutrition-input` accepts numeric input)
- **Navigation:** Sticky footer appears in center: `btn-primary` "Save & sign" + `btn-outline` "Cancel"
- On Save: returns to Sign & approve flow; the signed response notes any edits ("Signed with edits — sodium 1800 → 1700")
- **Error handling:** Per-input validation; save-failed inline error

### Tap "Reject"
- **Trigger:** Click `btn-outline btn-sm` "Reject"
- **Feedback:** `thread-approval-note` field expands; textarea appears with sr-only label "Reason for rejection (required)"
- Buttons: `btn-danger btn-sm` "Send reject" + `btn-ghost btn-sm` "Cancel"
- **Navigation:** On Send: decision logs as `thread-msg-response.is-rejected` with note expanded; queue item moves back to "Care plan nutrition reviews" with new agent task to revise; agent receives feedback to redraft
- **Error handling:** Required-field validation

### Tap "Reassign to BHN" (disabled at v1) [REVISED]
- Button state: `btn-ghost btn-sm` with `aria-disabled="true"` AND `aria-describedby="reassign-bhn-helper"` referencing hidden `<span id="reassign-bhn-helper" class="sr-only">BHN review is not yet available — please contact coordinator</span>`. Tooltip on hover/focus presents the same text visually. Tooltip-only is insufficient for screen readers.

### Click an existing thread tool-call
- **Trigger:** Click a `thread-msg-tool` toggle
- **Feedback:** Tool detail expands inline (collapsible)
- **Navigation:** Stays in current view

### Type in clinical thread input
- **Trigger:** Type a query and press Enter
- **Feedback:** Message appears as `thread-msg-human` (right-aligned); spinner with "Ava is working..."
- **Navigation:** Stays in current record context; tool call + result render in thread
- **Error handling:** Send-failed retry icon

### Click a `clinical-ai-field` confirm icon [REVISED]
- **Trigger:** Click the confirm checkmark next to an agent-changed nutrition value
- **Feedback:** Icon transitions to confirmed state; small "Reviewed by Dr. Soto" indicator appears; `aria-live="polite"` on the field's parent announces "Reviewed by Dr. Soto" to screen readers
- **Navigation:** Stays in nutrition editor
- **Error handling:** Per-field

### Click another queue item
- **Trigger:** Click any non-active queue item in left pane
- **Feedback:** New item gets `.active`; current Maria Rivera record fades from center; new record loads
- **Navigation:** Center loads new gate-specific view; right loads new clinical thread

---

## States

### Default (loaded)
- Approval card pinned as hero in right pane
- Queue: 1 nutrition review (Maria Rivera active), other gate types preview
- Center: Maria Rivera record with nutrition section editable + biomarker trends + meal plan preview
- Bottom of right pane: thread input visible

### Loading State
- Approval card: `skeleton` matching card height + button row skeleton
- Thread above: 4-5 `skeleton` rows for prior tool-call events
- Center: record-header skeleton + 4 `skeleton` cards (patient identity / biomarkers / nutrition / meal plan)
- Left queue: `skeleton` rows under skeleton section headers

### Empty State (no clinical items)
- Per shell-pv-provider empty state

### Error State (signature fails)
- Approval card remains pending
- Below action row: `alert-error` inline with retry CTA
- 5-sec undo toast persists; card actions re-enabled

### Edit-first State
- Nutrition input rows become editable; sticky footer "Save & sign" + "Cancel" appears in center
- Approval card stays visible; actions disabled with helper text "Editing in progress in main panel"

### Post-signature State (decision logged)
- Approval card collapses to one-line `thread-msg-response.is-approved` with signature timestamp
- New `thread-msg-system` events log downstream effects
- Center status badge updates to `badge-success` "Signed by Dr. Soto"
- Queue item disappears

### Lab-anomaly state (illustrative — not active in this worked example)
- If a lab anomaly is mid-review and a new lab arrives, agent posts `thread-msg-tool` "New HbA1c result available" + tool-call summary; approval card stays pending until RDN reviews

---

## Accessibility Notes

- `<main aria-label="Maria Rivera care plan nutrition section">` wraps center
- Approval card: `<section role="region" aria-labelledby="approval-card-title">` with `<h3>` title for landmark navigation
- Sign & approve button: primary teal — color-independence: button label ("Sign & approve") + icon (`fa-pen-fancy`) carry meaning beyond color
- `clinical-ai-field` confirm icons: `<button>` with `aria-label="Confirm value"` and `aria-pressed` reflecting state
- 5-second undo toast: `aria-live="assertive"`; toast is `<div role="status">`
- Reject note textarea: `<label class="sr-only">` + `aria-required="true"`
- Disabled "Reassign to BHN" button: `aria-disabled="true"` + tooltip; not visually hidden (transparency about v1 gap)
- Tab order: queue items → record content (top to bottom: identity → biomarkers → nutrition → diff → meal plan) → thread events → approval card actions → thread input
- Touch targets 44px+; primary action `btn-sm` may be 36px-tall on desktop — confirm tablet (48px-tall variant) for any tablet provider use
- ICD-10 codes inline: rendered as Body/03 (no special semantic markup beyond inheritance from subtitle); screen-reader users hear them in normal flow

## Bilingual Considerations

- Provider EN-only at v1
- ICD-10 codes are universal (numeric + alpha); no translation needed
- NCP terminology is English-source clinical vocabulary; future Spanish-speaking RDN UX would translate the surrounding labels but keep NCP codes verbatim

## Open Questions

- Signature stake: 5-second undo correct? Clinical signature is high-stakes (audit trail; billing implications). Recommend **10-second undo** for clinical actions specifically (longer than coordinator's 5s); undo window is more important when audit-trail is the artifact. Confirm at Gate 2.
- Should the approval card show the "before / after" diff inline (current spec: separate "What changed" card in center)? Recommend separate card — keeps approval card scannable; full diff lives in center where the editing happens.
- "Edit first" path: when RDN edits the nutrition section, do they need to re-confirm with the agent, or can they save+sign directly? Recommend save+sign directly — RDN's signature is the authority; agent re-validation isn't required.
- Reassign-to-BHN UI: button visible-but-disabled vs. hidden entirely at v1? Recommend visible-but-disabled with helper — communicates the v1 gap transparently.
- BHN summary card styling: `card.bg-violet-16` (premium-special-status) per `DESIGN.md` 9-color palette — confirm violet is right for BHN. Alternative: `cyan` (informational). Recommend violet because BHN crosses clinical/behavioral boundaries (premium/special).
- "What changed" diff card: should it auto-expand on first view, or stay collapsed? Recommend auto-expand for first view (Dr. Soto needs to see the changes); persist user's collapse pref for future viewings.

---

## New Components Flagged

### `[NEW COMPONENT: thread-approval-card.is-clinical variant]` — Tier 1 variant on existing `thread-approval-card`, brand-fidelity-weighted, 4-expert panel required

**Anatomy:**
- Extends shipped `thread-approval-card` with new modifier class `.is-clinical`
- Same outer structure: `thread-approval-card.is-clinical` → `thread-approval-header` → `thread-approval-body` → `thread-approval-context` → `thread-approval-summary` → `thread-approval-effects` → `thread-approval-actions` → optional `thread-approval-note`
- Adds two clinical-specific content blocks inside `thread-approval-body`:
  - `thread-approval-ncp` — NCP terminology block (PES statement + diagnosis + intervention + monitoring)
  - `thread-approval-icd` — ICD-10 mapping block (codes + descriptions)
- Adds clinical iconography in `thread-approval-header`: `fa-stethoscope` or `fa-pen-fancy` semantic icon
- Approve action label changes to "Sign & approve" (vs. coordinator's "Approve")
- Signature affordance: digital signature timestamp + signer identity recorded on Approve; rendered in subsequent `thread-msg-response.is-approved` summary

**Why a variant, not a new primitive:**
- Same structural anatomy; only content priorities + semantics differ
- Brand-fidelity-weighted because clinical signature is high-stakes
- 4-expert panel required for the new modifier class entry in `components.css`

**Promotion sequence:**
1. Update PL HTML at `packages/design-system/pattern-library/components/thread-approval-card.html` to add `is-clinical` variant section + `thread-approval-ncp` + `thread-approval-icd` semantic classes
2. Add classes to `components.css`
3. Update `COMPONENT-INDEX.md` row to note `.is-clinical` variant
4. 4-expert panel review on the variant
5. Port via `ui-react-porter` skill (variant flag on existing `<ThreadApprovalCard />` React component)
6. Compose into provider app once provider restored from `archive/inactive-apps/provider/`

**4-expert panel scope:**
- Pattern-library steward: variant pattern (modifier class vs. new file); token discipline; reuse of existing approval-card structure
- Information architecture: NCP block + ICD block hierarchy; signature affordance prominence
- Accessibility: signature audit trail UX; ICD-10 codes inline (screen-reader cadence); WCAG AA contrast on clinical iconography
- Brand fidelity: clinical voice ("Sign & approve" vs. "Approve"); restraint (don't over-medicalize warm Cena tone); Ava identity in clinical context (subtle leading dot, not chrome-level)
