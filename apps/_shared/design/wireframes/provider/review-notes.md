# UX Review: Provider Shell + Per-App Minimums (RDN scope)

**Date:** 2026-05-03
**Inputs:**
- `apps/_shared/design/wireframes/provider/pv-shell-flow.md`
- `apps/_shared/design/wireframes/provider/shell-pv-provider.md`
- `apps/_shared/design/wireframes/provider/pv-01-patient-record-with-clinical-decision.md`
**Reviewer:** ux-design-review (pre-build mode)
**Research consulted:**
- NN/G, "Dangerous UX: Consequential Options Close to Benign Options" — applies to clinical Sign & approve / Reject proximity [Source: NN/G, "Dangerous UX"]
- W3C WAI 2.2.1 Timing Adjustable — clinical signature timing has higher stakes than coordinator approval; the 10-second undo (Gate 2 decision 1) gives RDN more reaction time, aligned with WCAG accommodation principles [Source: W3C WAI, "WCAG 2.1 — Timing Adjustable"]
- "Designing better destructive action modals" (UX Psychology, established practice) — clinical signature stakes; Gmail-Undo-Send precedent at 20-30s; 10s is conservative-but-defensible
- NCP (Nutrition Care Process) terminology and ICD-10 mapping — established clinical-documentation standards (Academy of Nutrition and Dietetics, AHIMA) — uncited but established

## Summary

Provider wireframes correctly extend the universal shell for the RDN clinical-review workflow. The `[NEW COMPONENT: thread-approval-card.is-clinical variant]` is correctly classified as a Tier 1 variant (extends existing primitive, not a new one) requiring the 4-expert panel at PL-fragment authoring time. Two issues need attention: (1) Sign & approve / Reject button proximity is the same NN/G concern as cc-01 — clinical signature is higher stakes than coordinator approval, so the proximity-fix is even more important; (2) the Reassign-to-BHN button is "visible-but-disabled" at v1 with a tooltip — this is a transparent communication of a v1 gap, but the disabled-state pattern needs careful screen-reader treatment (a disabled button that announces "BHN review is not yet available" must do so via `aria-describedby`, not via tooltip alone, since some screen readers don't surface tooltips). The 10-second undo on signature (Gate 2 decision 1) is correctly applied. NCP + ICD-10 inline rendering is correct for RDN audience and respects "ICD-10 codes are universal" (no translation needed).

## Screen: pv-shell-flow

### Critical Issues

None.

### Improvements

- **Flow doc explicitly notes BHN deferred at v1, RDN-only.** Good. Confirm "Reassign to BHN" button copy is "Reassign to BHN" not "Reassign to BHN team" — keep tight.

## Screen: shell-pv-provider

### Critical Issues

None.

### Improvements

- **Right pane default visibility (Open Question 3)** — Recommend: provider always uses thread (drives every clinical decision); right pane always-rendered above 720px, not collapsible-by-default like kitchen. Promote.

- **BHN summary card styling (Open Question 4)** — Recommend `card.bg-violet-16` (premium-special-status — BHN crosses clinical/behavioral boundaries) per `DESIGN.md` 9-color tag-semantic palette. Promote; defer detail until BHN ships post-v1.

- **Caseload-as-default center (Open Question 2)** — Recommend caseload — RDN's primary identity is "I have N patients" not "I have N items today." Promote.

- **Reassign-to-BHN disabled-state UX (Open Question 1)** — Recommend visible-but-disabled with helper. Promote. **Critical implementation note: the disabled-state explanation must be available to screen readers via `aria-describedby` referencing a hidden `<span>` with the explanation text — tooltip-only is insufficient because some screen readers don't surface tooltips on disabled controls.**

- **`thread-msg-tool` events default state** — same as coordinator: default collapsed. State explicitly.

### Copy

- **Empty queue heading (no clinical items):** "Nothing pending right now"
- **Empty queue body:** "We'll surface clinical reviews as they come in."
- **Right pane empty (no record selected):** "Pick a clinical review to start."
- **Section headers:** "Care plan nutrition reviews" / "SOAP notes pending signature" / "Lab results flagged" / "Recipe nutritional validation" / "Meal match exceptions"
- **Reassign-to-BHN disabled tooltip + aria-describedby content:** "BHN review is not yet available — please contact coordinator"
- **Queue load failed:** "We couldn't load your clinical queue. Retrying…" + "Try again"

## Screen: pv-01-patient-record-with-clinical-decision

### Critical Issues

- **Sign & approve and Reject sit adjacent.** Same NN/G "Dangerous UX" issue as cc-01 — but more consequential here because (a) Reject sends back for redraft, blocking meal-match scheduling, and (b) signature implies billing + audit-trail commitment. Current order: `[Sign & approve] [Edit first] [Reject] [Reassign to BHN]`. — Recommendation: reorder to `[Sign & approve] [Edit first] [Reassign to BHN] [Reject]` — Reject rightmost, separated. The disabled "Reassign to BHN" sits between as a visible v1 gap; this works because it's not a tap-target either way at v1. If/when BHN ships, the pattern still holds: Reject stays rightmost. [Source: NN/G, "Dangerous UX"]
  - **Severity:** moderate-to-high — clinical stakes warrant even firmer separation than coordinator. Worth fixing.

### Improvements

- **Signature undo timing (Open Question 1)** — confirmed 10 seconds per Gate 2 decision 1. Promote from Open Questions; remove ambiguity.

- **"Before / after" diff inline vs separate card (Open Question 2)** — Recommendation: separate "What changed" card in center (current spec). Approval card stays scannable; full diff lives in center where editing happens. Promote.

- **Edit-first agent re-validation (Open Question 3)** — Recommendation: save+sign directly. RDN's signature is the authority; agent re-validation isn't required. Promote.

- **"What changed" card auto-expand (Open Question 6)** — Recommendation: auto-expand on first view; persist user's collapse pref for future viewings. Promote.

- **NCP terminology block** — Body/03 plain-language for the general blocks; the PES Statement specifically uses NCP shorthand which is correct for RDN audience. Confirm inline rendering doesn't break the assistive-tech reading order — the `aria-describedby` pattern from `thread-approval-card` should cover NCP block too.

- **ICD-10 codes inline** — Body/03 with no special semantic markup — correct for RDN flow. Screen-reader users hear them in normal flow. State that ICD-10 codes are NOT translated (universal). Inherits from §Bilingual Considerations correctly.

- **`clinical-ai-field` confirm icons** — `<button>` with `aria-label="Confirm value"` and `aria-pressed`. Add: post-confirm state announces "Reviewed by Dr. Soto" via `aria-live="polite"` on the field's parent so screen-reader users hear the confirmation.

- **Sticky footer in Edit-first mode** — `btn-primary "Save & sign"` + `btn-outline "Cancel"`. Confirm Save & sign uses primary teal (clinical commitment); Cancel is outline; both are 48px-tall on potential tablet use.

- **Auto-scroll to active approval card** (per Gate 2 decision 6) applies here too. State explicitly in Interaction Specifications.

- **Disabled "Reassign to BHN" — `aria-describedby` for the explanation.** Critical implementation note from the shell review applies here in the worked example; document explicitly.

### Copy

- **Record header title:** "Maria Rivera · Care Plan v2 — Nutrition Section"
- **Record header subtitle:** "DOB 1958-03-12 · MRN PT-2024-0847 · Type 2 Diabetes (E11.9), Hypertension (I10)"
- **Record header status badge:** "Pending signature"
- **Record header risk tier:** "Moderate"
- **Record header meta:** "Drafted by Ava 9:30 AM · Last visit MNT 97803 with Dr. Soto · 2026-04-22"
- **Patient identity card caseload note:** "Assigned to Dr. Soto since 2024-08"
- **Biomarker trends card heading:** "Biomarker trends"
- **Dietary restrictions editable note:** "Editable by coordinator + RDN; patient-stated preferences come through coordinator"
- **Nutrition section card heading:** "Nutrition plan (agent draft — review before signing)"
- **Care plan diff card heading:** "What changed"
- **Care plan diff full-link:** "View full plan diff"
- **Meal plan helper:** "Ava generated this meal plan from Maria's preferences and the nutrition targets above. Approving the nutrition section resumes the meal-match workflow."
- **Approval card header title:** "Clinical signature requested · Care plan nutrition section"
- **Approval card context meta:** "Drafted by Ava 9:30 AM · Pulled HbA1c 9:28 AM · Pulled lipid panel 9:28 AM · Coordinator briefed at 9:32 AM"
- **Approval card NCP block label:** "Nutrition Care Process"
- **Approval card NCP PES line label:** "PES Statement"
- **Approval card NCP diagnosis line label:** "Nutrition diagnosis"
- **Approval card NCP intervention line label:** "Intervention"
- **Approval card NCP monitoring line label:** "Monitoring"
- **Approval card ICD block label:** "ICD-10 mapping"
- **Approval card summary:** "Plan: 1500 kcal, 1800mg sodium, 75g protein/day, Mediterranean-lean. Two values changed from v1 (caloric target -100, sodium -200). Rationale: supports current weight + BP trends."
- **Approval card effects label:** "Signing this nutrition section will:"
- **Approval card effects bullets:**
  - "Lock the nutrition section to v2 with your digital signature + timestamp"
  - "Resume meal-match workflow (7 days)"
  - "Route the full care plan to coordinator for final approval"
- **Sign & approve toast:** "Signed at 9:48 AM. Tap to undo." (10-second window per Gate 2 decision 1)
- **Sign & approve confirmed log:** `[Dr. M. Soto, RDN] Signed · 9:48 AM · digital signature applied`
- **Sign & approve confirmed system events:**
  - "9:48 AM · Care plan routed to coordinator for final approval"
  - "9:48 AM · Meal-match workflow resumed"
- **Sign & approve write-failed:** "We couldn't save the signature. Tap retry, or contact support if it keeps failing." + "Try again"
- **Edit-first sticky save:** "Save & sign"
- **Edit-first sticky cancel:** "Cancel"
- **Reject note label (sr-only):** "Reason for rejection (required)"
- **Reject note placeholder:** "Tell Ava what to revise…"
- **Reject confirmation log:** `[Dr. M. Soto, RDN] Rejected — [first 60 chars of note] · 9:48 AM`
- **Reassign-to-BHN disabled tooltip:** "BHN review is not yet available — please contact coordinator"
- **`clinical-ai-field` post-confirm announcement (aria-live):** "Reviewed by Dr. Soto"
- **Thread input placeholder:** "Ask Ava (e.g., 'Pull last 12 months HbA1c')…"

## Cross-Screen Issues

- **Approval card action ordering** — apply the proximity-fix consistently; same as coordinator.
- **`thread-msg-tool` default-collapsed** — same pattern as coordinator + kitchen.
- **Disabled button + screen-reader explanation** — `aria-describedby` pattern applies to all v1-disabled affordances (currently just Reassign-to-BHN, but extend if more added).
- **10-second undo for clinical signature** — applies to all clinical decisions in pv-01 and any future pv-02+ wireframes (SOAP notes, lab flags, recipe validation).

## Use Case Walk-Through

- **PR-SHELL-01 (Open app):** Walks. Caseload as default; clinical queue gate-type-grouped.
- **PR-SHELL-02 (Open clinical queue item):** Walks. Approval card pinned; biomarker trends + nutrition editor in center. Friction: Sign & approve / Reject adjacency.
- **PR-SHELL-03 (Sign & approve):** Walks. 10-second undo, signature + timestamp + RDN identity attach, downstream events log.
- **PR-SHELL-04 (Edit first):** Walks. Inline-edit nutrition values → Save & sign → flow returns to signature.
- **PR-SHELL-05 (Reject):** Walks. Note required; agent receives feedback to redraft.
- **Direct agent via thread:** Walks. RDN can request "Pull last 12 months HbA1c" inline.

## Open Questions for Aaron at Gate 2-review

1. **Approval card action ordering** — re-order to `[Sign & approve][Edit first][Reassign to BHN][Reject]` per NN/G destructive-separation guidance? Recommend yes (high-stakes; even more important than coordinator).
2. **Disabled-button screen-reader pattern** — confirm `aria-describedby` (with hidden `<span>` carrying the explanation) is the canonical pattern for v1-disabled affordances; tooltips alone are insufficient.
3. **Reassign-to-BHN copy** — keep "Reassign to BHN" tight; confirm not "Reassign to BHN team."

## 4-Expert Panel — Downstream Prerequisite

The `[NEW COMPONENT: thread-approval-card.is-clinical variant]` is brand-fidelity-weighted (clinical signature is high-stakes). The 4-expert panel review (pattern-library steward / IA / accessibility / brand fidelity) runs **at PL fragment authoring time** per CLAUDE.md slice authoring rules — NOT at this wireframe-review stage. Flag the panel as a Stage 5-prep prerequisite for the provider app restoration + `is-clinical` variant authoring slice.

## Verdict

**ITERATE-THEN-SHIP.** Action-ordering revision lands inline (pending Aaron confirmation); disabled-button accessibility pattern documented; 10-second undo and other Gate 2 decisions promoted from Open Questions. Wireframes are ready for haven-mapper after Aaron's Gate 2-review on the three open questions above. The `is-clinical` variant 4-expert panel review fires at PL fragment authoring time (Stage 5 prep), not now.
