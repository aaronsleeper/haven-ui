# New Component Spec: `thread-approval-card.is-clinical`

**Date:** 2026-05-04
**Tier:** 1 — Variant on existing PL primitive (`thread-approval-card`)
**Priority:** Required for launch
**App:** Provider App (archived at `archive/inactive-apps/provider/`; build waits on `git mv`)
**Wireframes:**
- `apps/_shared/design/wireframes/provider/pv-01-patient-record-with-clinical-decision.md`
- `apps/_shared/design/wireframes/provider/shell-pv-provider.md`
**Gate references:**
- Gate 2-prep decision #6: confirmed as variant, not new primitive — same structural anatomy as `thread-approval-card`; only content priorities + semantics differ
- Stage 2-review pre-build: action ordering per NN/G dangerous-UX separation; 10-second undo for clinical signature (distinct from coordinator's 5-second); Reassign-to-BHN `aria-disabled` pattern

---

## Purpose

Extends the existing `thread-approval-card` primitive with a `.is-clinical` modifier class for the provider clinical signature workflow. Adds two clinical-specific content blocks (`thread-approval-ncp` and `thread-approval-icd`) inside `thread-approval-body`, swaps the icon to `fa-stethoscope` and the primary action label to "Sign & approve" (with `fa-pen-fancy`), and applies a teal-based clinical surface treatment (distinct from the urgent/warning/historical variants already shipped).

This is the approval-card entry point for RDN signature on care plan nutrition sections. The signed output triggers coordinator's `thread-approval-card.is-urgent` flow (cc-01).

---

## New Classes Required

| Class | Type | Notes |
|-------|------|-------|
| `.thread-approval-card.is-clinical` | Modifier on existing primitive | Teal-family surface; clinical signature context |
| `.thread-approval-ncp` | Content block (new) | NCP PES statement + diagnosis + intervention + monitoring |
| `.thread-approval-icd` | Content block (new) | ICD-10 code + description list |

**Existing classes reused (no changes needed):**
- `.thread-approval-card` — outer container
- `.thread-approval-header` — icon + title + Ava sparkle dot
- `.thread-approval-body` — content region
- `.thread-approval-context` — title + meta row
- `.thread-approval-context-title` — entity name
- `.thread-approval-context-meta` — drafted-by + tool-call provenance
- `.thread-approval-summary` — Body/03 plan summary text
- `.thread-approval-effects-label` — downstream effects label
- `.thread-approval-effects` — downstream effects list
- `.thread-approval-actions` — button row
- `.thread-approval-note` — reject note field (hidden until Reject clicked)

---

## HTML Structure

```html
<!-- thread-approval-card.is-clinical -->
<section class="thread-approval-card is-clinical" role="region" aria-labelledby="approval-card-title-[id]">

  <!-- Header -->
  <div class="thread-approval-header">
    <i class="fa-solid fa-stethoscope" aria-hidden="true"></i>
    <h3 id="approval-card-title-[id]">Clinical signature requested · Care plan nutrition section</h3>
    <!-- Ava identity: 16px sparkle leading dot — subtle; not chrome-level prominence -->
    <span class="thread-approval-ava-dot" aria-hidden="true"></span>
  </div>

  <!-- Body -->
  <div class="thread-approval-body">

    <!-- Existing: context block -->
    <div class="thread-approval-context">
      <div class="thread-approval-context-title">Maria Rivera · Care Plan v2 nutrition section</div>
      <div class="thread-approval-context-meta">Drafted by Ava 9:30 AM · Pulled HbA1c 9:28 AM · Pulled lipid panel 9:28 AM · Coordinator briefed at 9:32 AM</div>
    </div>

    <!-- NEW: NCP terminology block (clinical-variant-specific) -->
    <div class="thread-approval-ncp">
      <div class="thread-approval-ncp-label">Nutrition diagnosis (NCP)</div>
      <div class="thread-approval-ncp-pes">
        <span class="thread-approval-ncp-pes-text">Inadequate carbohydrate intake (NI-5.8.1) related to elevated HbA1c, as evidenced by 6.8% current HbA1c and patient self-report of meal pattern</span>
      </div>
      <dl class="thread-approval-ncp-codes">
        <div class="thread-approval-ncp-row">
          <dt>Diagnosis</dt>
          <dd>NI-5.8.1 — Carbohydrate intake</dd>
        </div>
        <div class="thread-approval-ncp-row">
          <dt>Intervention</dt>
          <dd>ND-1.2 — Modify carbohydrate distribution</dd>
        </div>
        <div class="thread-approval-ncp-row">
          <dt>Monitoring</dt>
          <dd>HbA1c at 3 months</dd>
        </div>
      </dl>
    </div>

    <!-- NEW: ICD-10 mapping block (clinical-variant-specific) -->
    <div class="thread-approval-icd">
      <div class="thread-approval-icd-label">ICD-10 codes</div>
      <ul class="thread-approval-icd-list" role="list">
        <li class="thread-approval-icd-item">
          <span class="thread-approval-icd-code">E11.9</span>
          <span class="thread-approval-icd-desc">Type 2 Diabetes mellitus without complications</span>
        </li>
        <li class="thread-approval-icd-item">
          <span class="thread-approval-icd-code">I10</span>
          <span class="thread-approval-icd-desc">Essential (primary) hypertension</span>
        </li>
      </ul>
    </div>

    <!-- Existing: summary -->
    <div class="thread-approval-summary">
      Plan: 1500 kcal, 1800mg sodium, 75g protein/day, Mediterranean-lean. Two values changed from v1 (caloric target −100, sodium −200). Rationale: supports current weight + BP trends.
    </div>

    <!-- Existing: effects -->
    <div class="thread-approval-effects-label">Signing this nutrition section will:</div>
    <ul class="thread-approval-effects" role="list">
      <li>Lock the nutrition section to v2 with your digital signature + timestamp</li>
      <li>Resume meal-match workflow (7 days)</li>
      <li>Route the full care plan to coordinator for final approval</li>
    </ul>

  </div><!-- /thread-approval-body -->

  <!-- Actions — NN/G dangerous-UX ordered: primary → secondary → ghost (disabled) → destructive -->
  <!-- 16px explicit gap between "Edit first" and "Reject" to enforce NN/G separation -->
  <div class="thread-approval-actions">
    <button type="button" class="btn-primary btn-sm">
      <i class="fa-solid fa-pen-fancy" aria-hidden="true"></i>
      Sign &amp; approve
    </button>
    <button type="button" class="btn-outline btn-sm">Edit first</button>
    <button
      type="button"
      class="btn-ghost btn-sm"
      aria-disabled="true"
      aria-describedby="reassign-bhn-helper"
    >Reassign to BHN</button>
    <span id="reassign-bhn-helper" class="sr-only">BHN review is not yet available — please contact coordinator</span>
    <!-- 16px visual spacer before destructive action -->
    <button type="button" class="btn-outline btn-sm thread-approval-reject-btn">Reject</button>
  </div>

  <!-- Reject note — hidden until Reject clicked; required; minimum 10 chars -->
  <div class="thread-approval-note" hidden>
    <label class="sr-only" for="rejection-note-[id]">Reason for rejection (required)</label>
    <textarea
      id="rejection-note-[id]"
      class="thread-approval-note-textarea"
      placeholder="Explain why you're rejecting this draft (required)"
      aria-required="true"
      minlength="10"
      rows="3"
    ></textarea>
    <div class="thread-approval-note-actions">
      <button type="button" class="btn-danger btn-sm">Send reject</button>
      <button type="button" class="btn-ghost btn-sm">Cancel</button>
    </div>
  </div>

</section>
```

---

## CSS Definition (`components.css` additions)

```css
/* ============================================================
   thread-approval-card.is-clinical
   Tier 1 variant — extends existing thread-approval-card.
   Teal-family surface for clinical signature context.
   Gate 2-prep #6: confirmed variant (not new primitive).
   Wireframe source: pv-01-patient-record-with-clinical-decision.md
   ============================================================ */

.thread-approval-card.is-clinical {
    background-color: var(--color-teal-50);
    border-color: var(--color-teal-200);
    border-left-color: var(--color-teal-600);
}

.thread-approval-card.is-clinical .thread-approval-header {
    color: var(--color-teal-800);
}

.thread-approval-card.is-clinical .thread-approval-header h3 {
    color: var(--color-teal-900);
}

.thread-approval-card.is-clinical .thread-approval-header .fa-stethoscope {
    color: var(--color-teal-600);
}

/* Ava sparkle dot — subtle; 8px circle; teal family; leading dot not chrome prominence */
.thread-approval-ava-dot {
    @apply inline-block w-2 h-2 rounded-full ml-auto flex-shrink-0;
    background-color: var(--color-teal-400);
}

/* ----------------------------------------------------------
   thread-approval-ncp — NCP terminology block
   NCP PES statement + diagnosis + intervention + monitoring.
   Compact clinical typography (Body/03 scale).
   ---------------------------------------------------------- */

.thread-approval-ncp {
    @apply space-y-1;
    padding: 0.5rem 0.75rem;
    background-color: var(--color-teal-16);
    border-left: 2px solid var(--color-teal-400);
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.thread-approval-ncp-label {
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-teal-700);
}

.thread-approval-ncp-pes {
    @apply py-0.5;
}

.thread-approval-ncp-pes-text {
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    color: var(--color-sand-800);
    line-height: 1.4;
}

.thread-approval-ncp-codes {
    @apply space-y-0.5 mt-1;
}

.thread-approval-ncp-row {
    @apply flex gap-2;
}

.thread-approval-ncp-row dt {
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--color-sand-600);
    min-width: 5.5rem;
    flex-shrink: 0;
}

.thread-approval-ncp-row dd {
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    color: var(--color-sand-800);
}

/* ----------------------------------------------------------
   thread-approval-icd — ICD-10 mapping block
   Code + description list; inline pill treatment for code.
   ---------------------------------------------------------- */

.thread-approval-icd {
    @apply space-y-1;
}

.thread-approval-icd-label {
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-sand-500);
}

.thread-approval-icd-list {
    @apply space-y-1;
    list-style: none;
    padding: 0;
    margin: 0;
}

.thread-approval-icd-item {
    @apply flex items-baseline gap-2;
}

.thread-approval-icd-code {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--color-teal-700);
    background-color: var(--color-teal-16);
    border: 1px solid var(--color-teal-200);
    border-radius: var(--radius-sm);
    padding: 0 0.25rem;
    flex-shrink: 0;
}

.thread-approval-icd-desc {
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    color: var(--color-sand-700);
}

/* ----------------------------------------------------------
   Reject button gap — NN/G dangerous-UX separation
   16px forced gap between secondary cluster and destructive action.
   Stage 2-review pre-build: action ordering directive.
   ---------------------------------------------------------- */

.thread-approval-reject-btn {
    margin-left: 0.5rem; /* 8px, pairs with gap-2 in flex container for ~16px total */
    color: var(--color-rose-600);
    border-color: var(--color-rose-200);
}

.thread-approval-reject-btn:hover {
    background-color: var(--color-rose-16);
    border-color: var(--color-rose-300);
}

/* ----------------------------------------------------------
   Dark mode
   All color properties must be redeclared — no implicit inheritance.
   ---------------------------------------------------------- */

.dark .thread-approval-card.is-clinical {
    background-color: var(--color-teal-950);
    border-color: var(--color-teal-800);
    border-left-color: var(--color-teal-500);
}

.dark .thread-approval-card.is-clinical .thread-approval-header {
    color: var(--color-teal-200);
}

.dark .thread-approval-card.is-clinical .thread-approval-header h3 {
    color: var(--color-teal-100);
}

.dark .thread-approval-card.is-clinical .thread-approval-header .fa-stethoscope {
    color: var(--color-teal-400);
}

.dark .thread-approval-ava-dot {
    background-color: var(--color-teal-500);
}

.dark .thread-approval-ncp {
    background-color: color-mix(in srgb, var(--color-teal-900) 40%, transparent);
    border-left-color: var(--color-teal-600);
}

.dark .thread-approval-ncp-label {
    color: var(--color-teal-400);
}

.dark .thread-approval-ncp-pes-text {
    color: var(--color-sand-200);
}

.dark .thread-approval-ncp-row dt {
    color: var(--color-sand-400);
}

.dark .thread-approval-ncp-row dd {
    color: var(--color-sand-200);
}

.dark .thread-approval-icd-label {
    color: var(--color-sand-400);
}

.dark .thread-approval-icd-code {
    font-family: var(--font-mono);
    color: var(--color-teal-300);
    background-color: color-mix(in srgb, var(--color-teal-900) 50%, transparent);
    border-color: var(--color-teal-700);
}

.dark .thread-approval-icd-desc {
    color: var(--color-sand-300);
}

.dark .thread-approval-reject-btn {
    color: var(--color-rose-400);
    border-color: var(--color-rose-800);
}

.dark .thread-approval-reject-btn:hover {
    background-color: color-mix(in srgb, var(--color-rose-900) 40%, transparent);
    border-color: var(--color-rose-700);
}
```

---

## Variants

### `.is-clinical` (this spec)
The only variant in this spec. The clinical modifier layer:
- Surface: `teal-50` light / `teal-950` dark — quieter than the urgent `red-50` / warning `amber-50` variants; teal communicates clinical trust rather than alarm
- Left border: `teal-600` — same structural signal as base card; teal family overrides
- Icon: `fa-stethoscope` — clinical identity; replaces `fa-hand` (coordinator) or `fa-circle-exclamation` (urgent)
- Primary action label: "Sign & approve" — clinical signature affordance; "Approve" (coordinator) implies endorsement; "Sign" implies legal/clinical commitment
- Ava dot: teal-400 (light) / teal-500 (dark) — matches clinical context

### Disabled/pending state
When `Sign & approve` is in-flight (request sent, awaiting response):
- All action buttons disable; add `btn-loading` + `btn-spinner` to "Sign & approve" per existing loading state convention
- Card remains `.is-clinical`; no state modifier class needed

### Post-signature (collapsed)
Card is replaced by `thread-msg-response.is-approved` in the thread on confirmation. The `.is-clinical` class is not used in the post-signature state; that state is covered by the existing `thread-msg-response.is-approved` variant.

### Edit-first active state
When "Edit first" is clicked and the center pane enters edit mode:
- Card actions disable with inline helper text "Editing in progress — save or cancel in main panel"
- No new modifier class needed; `aria-disabled="true"` + helper text handles the state

---

## Data Bindings

| Element | Binding |
|---------|---------|
| Rendered condition | `approval.type === 'clinical_decision'` |
| `.is-clinical` variant | Bound to `approval.type`; no urgency variant needed (clinical is its own tier) |
| `thread-approval-ncp` content | `approval.clinical_data.ncp` — object: `{ pes_statement, diagnosis_code, diagnosis_desc, intervention_code, intervention_desc, monitoring }` |
| `thread-approval-icd` items | `*ngFor` over `approval.clinical_data.icd10_codes[]` — each: `{ code, description }` |
| "Sign & approve" action | `approval.id` → POST to clinical signature endpoint; 10-second undo window (Gate 2 decision 1 — clinical stakes warrant longer window than coordinator's 5s) |
| Signature timestamp | Written to `approval.signature.timestamp` + `approval.signature.actor` on commit |
| `thread-approval-context-title` | `approval.patient_name` + care plan section label |
| `thread-approval-context-meta` | `approval.agent_context` — array of tool provenance strings; rendered inline |

---

## Accessibility Notes

- `<section role="region" aria-labelledby="approval-card-title-[id]">` — landmark for screen-reader navigation; `[id]` must be unique per thread
- `<h3>` in `thread-approval-header` — heading hierarchy: `thread-panel` is `<aside>`, approval card is a region within; h3 is appropriate
- `fa-stethoscope` icon: `aria-hidden="true"` — decorative; meaning carried by `<h3>` label
- "Sign & approve" button: primary teal; color-independence met by label + `fa-pen-fancy` icon (both carry meaning)
- `aria-disabled="true"` on "Reassign to BHN" + `aria-describedby` pointing to `sr-only` span — tooltip on hover/focus presents same text visually; `aria-disabled` prevents activation without hiding from accessibility tree
- Reject textarea: `<label class="sr-only">` + `aria-required="true"` + `minlength="10"` — required validation announced on submit attempt
- 10-second undo toast: `aria-live="assertive"` on `<div role="status">`
- `thread-approval-ncp-codes` is a `<dl>` — semantic key-value pairs; screen readers read `dt` + `dd` pairs correctly
- `thread-approval-icd-list` is a `<ul role="list">` — required when `list-style: none` in CSS (Safari VoiceOver strips list semantics from `list-style: none` lists without `role="list"`)
- ICD-10 codes in `thread-approval-icd-code`: `font-mono` renders codes distinctly; screen readers spell them verbatim — no special treatment needed; "E11.9" reads as "E-11-point-9" which is correct clinical pronunciation
- Tab order within card: "Sign & approve" → "Edit first" → "Reassign to BHN" (disabled, skipped in AT) → "Reject" — left-to-right matches DOM order; no `tabindex` manipulation required
- `thread-approval-note` uses `hidden` attribute (not CSS `display: none`) — fully removed from accessibility tree until Reject is clicked; must be toggled via JS to `hidden = false` (not CSS class swap)
- Touch targets: action buttons are `btn-sm` (36px tall on desktop) — confirm 44px+ for any tablet provider use; a `btn-sm` tablet variant may be needed

---

## 4-Expert Panel Scope

Required before PL fragment ships (Tier 1, brand-fidelity-weighted per `CLAUDE.md` §Tier system).

| Expert | Focus areas |
|--------|-------------|
| **Pattern-library steward** | Variant pattern (modifier class vs. new file); teal token discipline; reuse of existing approval-card structure; `thread-approval-ncp` + `thread-approval-icd` as semantic classes vs. inline carve-out; confirm `@apply` cleanliness |
| **Information architecture** | NCP block + ICD block hierarchy within card — clinical density without overwhelming; scan order (context → NCP → ICD → summary → effects → actions); signature affordance prominence; "Edit first" placement (confirms center-pane coordination pattern) |
| **Accessibility** | Clinical signature audit-trail UX; `<dl>` for NCP codes (screen-reader cadence); ICD codes in `font-mono` inline (pronunciation cadence); `aria-disabled` + `aria-describedby` Reassign pattern; reject note `hidden`/`visible` toggle; 10-second undo toast `aria-live`; WCAG AA contrast on teal-600 over teal-50 for icon + text |
| **Brand fidelity** | Clinical voice ("Sign & approve" vs. "Approve" — commitment vs. endorsement distinction); restraint (clinical without over-medicalizing warm Cena tone); Ava identity in clinical context (subtle teal dot, not chrome-level sparkle); teal as clinical trust signal (not alarm) vs. coordinator's neutral sand; fa-stethoscope as clinical icon (medical-equipment vs. institutional medical imagery — confirm Cena brand posture) |

---

## PL Authoring Checklist

Before this spec feeds the build (dev-tasker Stage 4):

- [ ] 4-expert panel review complete (all four verdicts ship or iterate-then-ship)
- [ ] `packages/design-system/pattern-library/components/thread-approval-card.html` updated: add `.is-clinical` section after `.is-historical`; add `thread-approval-ncp` + `thread-approval-icd` examples; update `@component-meta` variants list
- [ ] New classes added to `packages/design-system/src/styles/tokens/components.css` per CSS definition above
- [ ] `packages/design-system/pattern-library/COMPONENT-INDEX.md` row for `thread-approval-card` updated: variants list adds `is-clinical`; new semantic classes `thread-approval-ncp`, `thread-approval-icd` noted in the row (or as child rows)
- [ ] `pnpm --filter @haven/design-system dev` renders the `.is-clinical` variant at http://localhost:5173 pattern-library page
- [ ] `conform:contrast-pairs` passes: teal-600 text on teal-50 background, teal-700 codes on teal-16, sand-800 body copy on teal-50 — WCAG AA minimum; panel accessibility reviewer confirms
- [ ] `ui-react-porter` skill: port variant flag `is-clinical` to existing `<ThreadApprovalCard />` React component in `packages/ui-react/src/components/`; port `ThreadApprovalNcp` and `ThreadApprovalIcd` sub-components; update `registry.json`
- [ ] Storybook: add `.is-clinical` story to `ThreadApprovalCard.stories.tsx`; add `ThreadApprovalNcp` + `ThreadApprovalIcd` stories
- [ ] Provider app restoration prerequisite: `git mv archive/inactive-apps/provider apps/provider` before composing this component into app code
- [ ] Dark mode verified: all color properties in `.dark` block render at ≥ WCAG AA contrast

---

## Build Sequencing Note

This component cannot be composed into app code until the provider app is restored from `archive/inactive-apps/provider/`. The PL fragment and `ui-react` port can be authored and tested independently. Recommended sequence:

1. PL fragment + CSS + COMPONENT-INDEX update (pattern-library only task, Tier 1)
2. 4-expert panel
3. `ui-react-porter` skill (variant flag on `<ThreadApprovalCard />`; sub-components for ncp + icd)
4. `git mv archive/inactive-apps/provider apps/provider` (app restoration)
5. Compose into provider app shell (Tier 2, uses ported component)
