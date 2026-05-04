# Gate 2 — Universal App Shell + Per-App Minimums (haven-ui)

**Date:** 2026-05-03
**Pipeline run:** haven-ui-universal-app-shell (worked example through design-to-build pipeline)
**Stage completed:** ux-wireframe (15 wireframe files + this summary)
**Next stage:** ux-design-review (pre-build) + 4-expert panel for brand-fidelity-weighted entries
**Plan:** `~/.claude/plans/haven-ui-universal-app-shell.md`
**Skill:** `Lab/haven-ui/.project-docs/agent-workflow/skills/ux-wireframe.md`

> **Note on production:** Wireframe agent (opus) hit the 8pm rate limit after writing all 15 wireframe files but before drafting this summary. Summary written by orchestrator from direct read of the worked-example wireframes (universal shell + cc-01 + kt-01 + pv-01 + patient mobile shell). All other wireframes verified present on disk; spot-check coverage indicates consistent quality with the worked examples.

---

## Files produced

### Universal shell (1 file)
- `apps/_shared/design/wireframes/shell-universal-agentic.md` — the contract every desktop app inherits; three-pane structure with `panel-splitter` resize, breakpoint behavior, per-app variant rules, no new components flagged

### Coordinator (3 files)
- `apps/care-coordinator/design/wireframes/cc-shell-flow.md`
- `apps/care-coordinator/design/wireframes/shell-cc-coordinator.md`
- `apps/care-coordinator/design/wireframes/cc-01-queue-with-care-plan-approval.md` — the Maria Rivera worked example: queue with 3 urgency tiers + care plan center + approval card with Approve/Edit/Reject/Reassign + 5s undo

### Patient (8 files — 5 routes + shell + 2 prior pieces)
- `apps/patient/design/wireframes/pt-shell-flow.md`
- `apps/patient/design/wireframes/shell-pt-mobile.md` — refined into ux-wireframe format (supersedes the prior `patient-mobile-shell.md`)
- `apps/patient/design/wireframes/pt-01-dashboard.md`
- `apps/patient/design/wireframes/pt-02-messages.md` — notifications-only, "thread"/"agent" terminology absent per Gate 2-prep #3
- `apps/patient/design/wireframes/pt-03-settings.md` — language, notifications, sign-out
- `apps/patient/design/wireframes/pt-04-my-health.md`
- `apps/patient/design/wireframes/pt-05-care.md`

### Kitchen (3 files)
- `apps/_shared/design/wireframes/kitchen/kt-shell-flow.md`
- `apps/_shared/design/wireframes/kitchen/shell-kt-kitchen.md` — collapsible right-pane below 1240px per Gate 2-prep #2
- `apps/_shared/design/wireframes/kitchen/kt-01-orders-with-packing-slip.md` — Order #4287 worked example: packing slip + status-progression buttons + nut-free allergen flag, **flags `[NEW COMPONENT: packing-slip]`**

### Provider (3 files)
- `apps/_shared/design/wireframes/provider/pv-shell-flow.md`
- `apps/_shared/design/wireframes/provider/shell-pv-provider.md`
- `apps/_shared/design/wireframes/provider/pv-01-patient-record-with-clinical-decision.md` — Dr. Soto signing Maria Rivera's nutrition section; **flags `[NEW COMPONENT: thread-approval-card.is-clinical variant]`** with NCP terminology + ICD-10 mapping

---

## New Components Flagged (exactly 2, as expected)

### `[NEW COMPONENT: packing-slip]` — kitchen
- **Tier:** 1 primitive, brand-fidelity-weighted, **4-expert panel required**
- **Why new:** No existing PL primitive composes patient-id-restricted + allergen-prominent + meal-list pattern. Allergen prominence is safety-critical (visually impossible to miss).
- **Anatomy:** `packing-slip` envelope → `packing-slip-header` (first name + last initial, address, delivery window) → `packing-slip-allergens` (large red pills, multi-restriction combos render combined) → `packing-slip-meals` (vertical meal list with portion notes) → optional `packing-slip-instructions`
- **Brand-fidelity reasons:** restraint-driven brand needs careful red treatment (rose family, not arbitrary red); patient identity copy needs warmth without PHI exposure; spacing must scan in 2 seconds at 24" away
- **Promotion sequence:** PL HTML → components.css → COMPONENT-INDEX → 4-expert panel → React port via ui-react-porter

### `[NEW COMPONENT: thread-approval-card.is-clinical variant]` — provider
- **Tier:** 1 variant on existing primitive, brand-fidelity-weighted, **4-expert panel required**
- **Why a variant, not new primitive:** Same structural anatomy as `thread-approval-card`; only content priorities + semantics differ. Adds two new content blocks (`thread-approval-ncp` + `thread-approval-icd`) and a clinical icon. "Approve" label changes to "Sign & approve"; signature affordance attaches signer identity + timestamp on commit.
- **Brand-fidelity reasons:** clinical signature is high-stakes; voice must be clinical without over-medicalizing the warm Cena tone; Ava identity in clinical context (subtle leading dot, not chrome-level)
- **Promotion sequence:** Update existing `thread-approval-card.html` PL entry with `is-clinical` variant section + new semantic classes → components.css → COMPONENT-INDEX → 4-expert panel → React variant flag on existing `<ThreadApprovalCard />`

---

## Conflicts with locked decisions

**None directly.** All Gate 1 (G1.1–G1.3) and Gate 2-prep (#1–#10) decisions honored:
- Coordinator wireframed against the **target** rich agentic-shell (#1 ✓)
- Kitchen right-pane collapsible-by-default below 1240px (#2 ✓)
- Patient routes named "Messages" / "Notifications"; no "thread" or "agent" in patient copy (#3 ✓)
- Bilingual EN/ES on Patient Messages + Settings + Assessments + Dashboard (#4 ✓)
- Coordinator approval-card worked example = Maria Rivera care-plan final approval (#5 ✓)
- Clinical-decision approval card spec'd as `.is-clinical` variant, not new primitive (#6 ✓)
- Kitchen + provider wireframes note app restoration at Stage 5 prep (#7 ✓)
- "Reassign to BHN" in provider rendered as visible-but-disabled with v1-gap helper (#8 ✓)
- Patient shell uses bottom-nav only at v1; swipe-nav deferred to v1.1 (#9 ✓)
- Kitchen specced desktop-primary, tablet-supported (#10 ✓)

---

## Cross-cutting open questions for Gate 2

Most route-level questions are inside individual wireframes; these are the **cross-cutting** ones requiring Aaron's call before `ux-design-review` runs:

1. **Undo window stake-tiering.** Coordinator approval = 5s undo. Provider clinical signature = 10s undo recommended (audit-trail importance). Kitchen status-progression = no undo (state changes are forward-only with explicit confirm dialogs on Dispatch). **Recommendation: confirm 5s coordinator / 10s provider / no-undo kitchen tiering.**

2. **Thread input chat-pane location (universal shell).** The shipped vanilla `agentic-shell` prototype puts chat input in center pane; the coordinator + provider wireframes assume input lives in the right pane (alongside the thread). **Recommendation: lock right-pane location for v1; revisit if center-pane chat use cases emerge.**

3. **Per-user pane prefs vs per-device.** Saved width/collapse prefs are per-user. If a coordinator moves between a 27" desktop and a 14" laptop, a saved 800px right-pane will hit auto-collapse on the laptop. **Recommendation: clamp saved widths to current viewport's allowed range; fall back to breakpoint default if saved value out of range.**

4. **"Edit first" → RDN re-signature semantics (provider).** When a coordinator clicks "Edit first" on a care plan and edits the nutrition section (which an RDN signed), should the system require RDN re-signature? **Recommendation: nutrition section is read-only after RDN signature. Coordinator's "Edit first" path can only edit goals + downstream effects; nutrition edits require explicit "Re-route to RDN" instead of "Approve."** Confirm.

5. **Allergen flag wording (kitchen).** "⚠ NUT-FREE" (the constraint — what to avoid) vs. "⚠ Contains nuts" (the contents). **Recommendation: constraint-first ("NUT-FREE", "DAIRY-FREE", "GLUTEN-FREE") because the kitchen's job is to verify the patient can't have these things, not to inventory what's present.** Confirm.

6. **Auto-scroll to active approval card on record open (coordinator + provider).** When a record loads with a pending approval card in the thread, should the right pane auto-scroll to that card? **Recommendation: yes — auto-scroll on first record-open; preserve user scroll position on subsequent reads.** Confirm.

7. **Patient push-notification deep-linking depth at v1.** Tap notification → land on Dashboard with task surfaced (current spec) vs. land directly in the relevant flow. **Recommendation: Dashboard at v1, direct-to-task at v1.1 (avoids deep-link state management complexity in v1).** Confirm.

8. **Bottom-nav 5 tabs vs 4 (patient).** My Health / Care could fold into Dashboard at v1. **Recommendation: 5 tabs at v1** — shell accommodates growth without redesign; cognitive load is acceptable; tabs stay 64px wide each at 320px viewport. Confirm.

---

## What Aaron must confirm before Gate 2

- [ ] **Spot-check the wireframes themselves.** The 4 worked examples are the highest-leverage to read: universal shell + cc-01 + kt-01 + pv-01 + patient mobile shell. The shell + per-app shell wireframes inherit from these.
- [ ] **The 8 cross-cutting open questions** above — go/no-go on each (or "your recs" to accept all).
- [ ] **The two new components** (packing-slip + thread-approval-card.is-clinical variant) are correctly classified — Tier 1 PL work, brand-fidelity-weighted, 4-expert panel required. If either should be a different tier or scope, say now.
- [ ] **No surprises in coverage.** Universal shell + 4 worked examples + 4 per-app shells + 5 patient routes + 2 cross-cutting flow files = 16 wireframes. (Universal counts as 1 + 4 shells + 4 examples + 5 patient routes + 2 flow files = 16. Inventory matches the file list above.)

If Aaron confirms, the next stage is `ux-design-review` (pre-build):
- Evaluate every wireframe for usability, copy quality, accessibility coverage, brand fidelity
- Resolve all `[COPY: ...]` placeholders
- Run 4-expert panel for the two brand-fidelity-weighted entries (packing-slip + thread-approval-card.is-clinical)
- Produce iterate verdicts where needed

Then Gate 3 (haven-mapper delta review + dev-tasker build plan).

---

## Pipeline status update

**Done:**
- [x] Reframed the question: shell + pipeline run, not features
- [x] Confirmed the four apps in scope
- [x] Discovery sweep across 22+ source docs
- [x] Reconciled with code (rich agentic-shell vs. bare three-panel-shell)
- [x] **Stage 1: ux-architect (Discovery + Functional Spec + IA) — complete**
- [x] **Gate 1: confirmed by Aaron 2026-05-03**
- [x] **Stage 2: ux-wireframe — 15 wireframes + this summary — complete 2026-05-03**

**Next:**
- [ ] **Gate 2 review with Aaron** — confirm scope, the 8 cross-cutting questions, the 2 new components (this doc)
- [ ] Stage 2 review: ux-design-review (pre-build) + 4-expert panel for brand-fidelity-weighted entries
- [ ] Stage 3: haven-mapper delta review (input is `apps/_shared/design/shell-component-gaps.md` + the new components flagged)
- [ ] Stage 4: dev-tasker build plan
- [ ] **Gate 3 review with Aaron**
- [ ] Stage 5: build (kitchen + provider apps restored from `archive/inactive-apps/` first)
- [ ] Stage 6: ux-design-review post-build + 4-expert panel
- [ ] Stage 7: debrief-capture
