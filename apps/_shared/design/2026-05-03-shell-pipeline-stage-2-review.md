# Stage 2 Pre-Build Design Review — Universal App Shell Pipeline

**Date:** 2026-05-03
**Pipeline run:** haven-ui-universal-app-shell (worked example through design-to-build pipeline)
**Stage completed:** ux-design-review (pre-build mode) — Stage 2 of 7
**Next stage:** haven-mapper (Stage 3 — wireframe-vs-PL delta + build plan)
**Skill:** `Lab/haven-ui/.project-docs/agent-workflow/skills/ux-design-review.md`
**Reviewer:** ux-design-review skill (sonnet → escalated to opus per stakes)

This summary closes the loop on Stage 2: 17 wireframes reviewed, copy resolved, revisions landed, and per-app review-notes filed. Ready for Aaron's Gate 2-review.

---

## Files reviewed (17 wireframes + Stage 2 outputs)

### Universal (1)
- `apps/_shared/design/wireframes/shell-universal-agentic.md`

### Coordinator (3)
- `apps/care-coordinator/design/wireframes/cc-shell-flow.md`
- `apps/care-coordinator/design/wireframes/shell-cc-coordinator.md`
- `apps/care-coordinator/design/wireframes/cc-01-queue-with-care-plan-approval.md`

### Patient (7)
- `apps/patient/design/wireframes/pt-shell-flow.md`
- `apps/patient/design/wireframes/shell-pt-mobile.md`
- `apps/patient/design/wireframes/pt-01-dashboard.md`
- `apps/patient/design/wireframes/pt-02-messages.md`
- `apps/patient/design/wireframes/pt-03-settings.md`
- `apps/patient/design/wireframes/pt-04-my-health.md`
- `apps/patient/design/wireframes/pt-05-care.md`

### Kitchen (3 — archived app)
- `apps/_shared/design/wireframes/kitchen/kt-shell-flow.md`
- `apps/_shared/design/wireframes/kitchen/shell-kt-kitchen.md`
- `apps/_shared/design/wireframes/kitchen/kt-01-orders-with-packing-slip.md`

### Provider (3 — archived app)
- `apps/_shared/design/wireframes/provider/pv-shell-flow.md`
- `apps/_shared/design/wireframes/provider/shell-pv-provider.md`
- `apps/_shared/design/wireframes/provider/pv-01-patient-record-with-clinical-decision.md`

### Stage 2 summary input
- `apps/_shared/design/2026-05-03-shell-pipeline-gate-2.md`

---

## Files revised (with `[REVISED]` markers, in place)

### Universal (1)
- `apps/_shared/design/wireframes/shell-universal-agentic.md` — resize-clamp behavior promoted from Open Question to canonical interaction spec; toast portal pattern stated; keyboard-resize increment changed 10px→16px; per-app `aria-label` override pattern documented; differentiated undo windows (5s coord / 10s prov / no-undo kitchen) referenced; copy fully resolved.

### Coordinator (2)
- `apps/care-coordinator/design/wireframes/shell-cc-coordinator.md` — empty-state per-tier copy resolved; queue-load-failed copy resolved; thread input placeholder resolved; filter persistence promoted to per-user.
- `apps/care-coordinator/design/wireframes/cc-01-queue-with-care-plan-approval.md` — approval action ordering revised (Reject moved to rightmost, separated from Approve per NN/G "Dangerous UX"); locked-section indicator added on RDN-signed nutrition values; Edit-first coordinator-editable scope enumerated; auto-scroll-to-card promoted from Open Q to canonical; tool-call default-collapsed stated; copy fully resolved (record header, downstream effects, approval card, toast, error states, Reject/Reassign/Edit-first paths).

### Patient (7)
- `apps/patient/design/wireframes/shell-pt-mobile.md` — push-deep-link landing confirmed (Dashboard at v1); offline banner ES tightened; bilingual tab labels resolved; 5-tab decision and active-accent intensity promoted from Open Q to canonical.
- `apps/patient/design/wireframes/pt-01-dashboard.md` — 3 greeting subline templates resolved (action-recent / action-none-warm / time-of-day-fallback) EN+ES; section heading copy + empty-state copy + error-state copy fully resolved.
- `apps/patient/design/wireframes/pt-02-messages.md` — page header + reply composer + empty/error/worked-example copy fully resolved EN+ES; system notification routing target stated; **defense-in-depth allowlist enforcement section added** (server-side FIRST + client-side BACKSTOP) — operational guarantee for HIPAA / no-agent-exposure rule.
- `apps/patient/design/wireframes/pt-03-settings.md` — all sections (Language / Notifications / Account) copy fully resolved EN+ES; Sign-out confirm dialog copy resolved; pref-save-error copy resolved; footer privacy/terms placeholder noted as legal-pending.
- `apps/patient/design/wireframes/pt-04-my-health.md` — page title + subline copy resolved EN+ES.
- `apps/patient/design/wireframes/pt-05-care.md` — full-empty state warmed to match Dashboard register; care plan goals + helper copy + footer + section empty states fully resolved EN+ES.
- (`pt-shell-flow.md` was already concise; no inline revisions needed beyond the review-notes flag.)

### Kitchen (2)
- `apps/_shared/design/wireframes/kitchen/shell-kt-kitchen.md` — empty queue copy resolved; batch-start no-undo behavior stated; confirm dialog copy revised to communicate no-undo.
- `apps/_shared/design/wireframes/kitchen/kt-01-orders-with-packing-slip.md` — allergen flag wording locked to constraint format ("NUT-FREE" / "DAIRY-FREE" / "GLUTEN-FREE" / multi-restriction) per Gate 2 decision 5; allergen pill height locked to 32px; Dispatch confirm dialog copy resolved (templated SMS in patient language pref); status-progression no-undo stated; thread input placeholder resolved.

### Provider (2)
- `apps/_shared/design/wireframes/provider/shell-pv-provider.md` — empty queue copy resolved; right-pane empty copy resolved (provider variant); Reassign-to-BHN disabled-state accessibility pattern documented (`aria-disabled` + `aria-describedby` + sr-only span + tooltip).
- `apps/_shared/design/wireframes/provider/pv-01-patient-record-with-clinical-decision.md` — clinical action ordering revised (Reject moved rightmost, separated from Sign & approve); 10-second undo confirmed (Gate 2 decision 1) and replaces 5s; Reassign-to-BHN disabled-state accessibility pattern applied; tool-call default-collapsed stated; auto-scroll-to-card stated; clinical-ai-field aria-live announce stated; thread input placeholder resolved.

---

## Top 3 cross-cutting findings

1. **Approval card action ordering — Reject adjacent to Approve / Sign & approve.** [Source: NN/G, "Dangerous UX: Consequential Options Close to Benign Options"] The current order `[Approve][Edit first][Reject][Reassign]` (cc-01) and `[Sign & approve][Edit first][Reject][Reassign to BHN]` (pv-01) puts the consequential Reject button next to the happy-path commit button. NN/G explicitly recommends physical separation. **Recommendation applied inline:** reorder to `[Approve | Sign & approve][Edit first][Reassign | Reassign to BHN][Reject]` with Reject rightmost and 16px gap separation. Pending Aaron confirmation at Gate 2-review. — Found in: `cc-01`, `pv-01`. Cross-applies to any future approval surfaces.

2. **Tool-call default-collapsed pattern.** Coordinator + provider thread events include `thread-msg-tool` rows that the wireframes describe as "(collapsible)" but did not specify default state. Default-collapsed is the right call: the approval card is the hero (per `thread-approval-card` PL spec), and tool-call breadcrumbs are context, not action. State explicitly across all relevant wireframes. **Recommendation applied inline** in cc-01, pv-01. Kitchen flagged in review-notes.

3. **Defense-in-depth allowlist enforcement (HIPAA-aware).** The patient app's strict allowlist (no agent-internal events) was specified at the spec level but the wireframe did not explicitly state the server-FIRST + client-BACKSTOP operational guarantee. A `tool_call` leak to a patient surface is a P0 bug per source spec. **Recommendation applied inline** in pt-02-messages — added a "Privacy / Defense-in-Depth (HIPAA-aware)" section that names the two layers explicitly so dev-tasker doesn't accidentally rely on client-only filtering. Same pattern applies to kitchen's order-relevant allowlist and provider's clinical allowlist.

---

## Top 3 cross-cutting copy decisions made

1. **Empty-state heading register.** Resolved to a consistent warm-but-action-oriented register across all four apps:
   - Universal pattern: "Nothing [state] right now" + "We'll surface [thing] when [condition]."
   - Patient pattern: warmer, signed with patient's name where natural. Dashboard "Enjoy your day, Maria" set the bar; Care's full-empty was warmed to match ("We're getting your plan ready" / "Your care team is putting your plan together. We'll show it here as soon as it's ready.").
   - Coordinator: action-oriented ("Pick a queue item to start. Each conversation lives with a specific patient or referral.")
   - Provider: short ("Pick a clinical review to start.")
   - Kitchen: physical ("Pick an order to see its activity.")

2. **Error-state CTA copy.** Resolved to a consistent two-part pattern:
   - First sentence names what failed plainly ("We couldn't load your queue. Retrying…" / "We couldn't send your message. Tap to try again." / "We couldn't save the approval.")
   - Retry button: "Try again" (EN) / "Intentar de nuevo" (ES). Patient-facing surfaces use "Tap to try again" for warmer second-person framing.
   - Avoid "support" callouts except for high-stakes failures (approval write, signature) where contacting support is genuinely the next step.

3. **Allergen flag wording (kitchen, safety-critical).** Locked to the constraint format per Gate 2 decision 5:
   - Single restriction: "⚠ NUT-FREE" / "⚠ DAIRY-FREE" / "⚠ GLUTEN-FREE"
   - Multi-restriction: "⚠ GLUTEN-FREE + DAIRY-FREE" (combined into a single pill)
   - Communicates what the patient *cannot* have (the constraint), not what the dish *contains* (the contents). This phrasing is unambiguous to a kitchen worker scanning the slip from across the room — "FREE" reads as "this dish must not contain X" without parsing.

---

## Open questions for Aaron at Gate 2-review

The human Aaron review of *this* review pass — distinct from the earlier Gate 2 confirmation Aaron already gave on the 10 Gate 2-prep + 8 Gate 2 cross-cutting decisions. These are NEW questions surfaced during this review.

1. **Approval card action ordering** — re-order across cc-01 + pv-01 to `[Approve|Sign & approve][Edit first][Reassign|Reassign to BHN][Reject]` per NN/G destructive-separation guidance? Recommend yes (cross-cutting, structurally meaningful).
2. **Toast portal vs in-pane** — confirm undo toasts render in a document-level portal (not inside the right `<aside>`) so pane scroll doesn't move them?
3. **Splitter keyboard-resize increment** — change spec from 10px to 16px (matches 4px Tailwind scalar × 4)?
4. **Coordinator filter persistence** — promote from per-session to per-user (matches resize-pref pattern)?
5. **Coordinator filter pills set** — "All / Referrals / Care plans / Discharges / Insurance" — confirm Insurance stands alone?
6. **Reassign scope (coordinator)** — team-only at v1 vs org-wide?
7. **Disabled-button screen-reader pattern (provider Reassign-to-BHN)** — confirm `aria-describedby` + sr-only span pattern (not tooltip-only) is the canonical v1 approach?
8. **Patient bottom-nav ES label fit at 320px** — vertical icon-above-label layout absorbs "Mensajes" (longest at 8 chars) at 13.33px Semibold; validate at first build?
9. **Patient greeting subline templates** — confirm 3-template selection logic (action-recent / action-none-warm / time-of-day-fallback)?
10. **Kitchen end-of-day affordance prominence** — keep as small `text-link` and reassess post-launch?

---

## Verdict per file

| File | Verdict |
|---|---|
| shell-universal-agentic.md | SHIP |
| cc-shell-flow.md | SHIP |
| shell-cc-coordinator.md | ITERATE-THEN-SHIP |
| cc-01-queue-with-care-plan-approval.md | ITERATE-THEN-SHIP |
| pt-shell-flow.md | SHIP |
| shell-pt-mobile.md | ITERATE-THEN-SHIP |
| pt-01-dashboard.md | ITERATE-THEN-SHIP |
| pt-02-messages.md | ITERATE-THEN-SHIP |
| pt-03-settings.md | ITERATE-THEN-SHIP |
| pt-04-my-health.md | SHIP |
| pt-05-care.md | ITERATE-THEN-SHIP |
| kt-shell-flow.md | SHIP |
| shell-kt-kitchen.md | ITERATE-THEN-SHIP |
| kt-01-orders-with-packing-slip.md | ITERATE-THEN-SHIP |
| pv-shell-flow.md | SHIP |
| shell-pv-provider.md | ITERATE-THEN-SHIP |
| pv-01-patient-record-with-clinical-decision.md | ITERATE-THEN-SHIP |

**Counts:** 6 SHIP, 11 ITERATE-THEN-SHIP, 0 BLOCK.

ITERATE-THEN-SHIP indicates revisions landed inline + ready for haven-mapper after Aaron's Gate 2-review on the open questions above. None blocked structurally; all revisions are tightening (copy, accessibility patterns, decision promotion, NN/G-driven micro-restructure).

---

## Recommended next stage

**haven-mapper (Stage 3 — wireframe-vs-PL delta + build plan).**

Prerequisites:
1. Aaron's Gate 2-review on the 10 open questions above. The action-ordering question (Q1) is the only structurally meaningful one; the rest are copy / decision / accessibility-pattern promotions.
2. The Stage 2 outputs and revisions are now in place; haven-mapper can read:
   - All 17 wireframes (revised in place)
   - The 5 review-notes files
   - This summary doc

haven-mapper will produce a build plan that:
- Sequences the work into slices (universal-shell adoption first, coordinator agentic-shell upgrade, patient routes, then kitchen + provider after restoration)
- Names tier per item (Tier 1 PL fragment / Tier 2 slice composition / Tier 3 polish)
- Names gates per patch (`conform:*` set per tier)
- Calls out the 4-expert panel dispatches needed (kitchen `packing-slip` + provider `thread-approval-card.is-clinical` variant — both at PL-fragment authoring time, not at this review stage)
- Calls out app-restoration prerequisites (kitchen + provider `git mv`)

The build plan goes through Gate 3 with Aaron before Stage 5 (build) starts.

---

## Pipeline status update

**Done:**
- [x] Stage 1: ux-architect — Gate 1 confirmed
- [x] Stage 2: ux-wireframe — Gate 2 (pre-prep + 8 cross-cutting decisions) confirmed
- [x] **Stage 2: ux-design-review (pre-build) — this pass complete**

**Next:**
- [ ] **Gate 2-review with Aaron — confirm 10 open questions above (this review's findings)**
- [ ] Stage 3: haven-mapper — wireframe-vs-PL delta + build plan
- [ ] **Gate 3 review with Aaron**
- [ ] Stage 4: dev-tasker
- [ ] **Gate 3 confirmation**
- [ ] Stage 5: build (kitchen + provider apps restored from `archive/inactive-apps/` first; 4-expert panels run during PL fragment authoring for `packing-slip` + `thread-approval-card.is-clinical` variant)
- [ ] Stage 6: ux-design-review post-build + 4-expert panel re-runs as needed
- [ ] Stage 7: debrief-capture

---

## File List (append-only)

This is a design-review stage; no code or config changed. All work is markdown.

- `apps/_shared/design/review-notes-universal-shell.md` — created
- `apps/_shared/design/wireframes/kitchen/review-notes.md` — created
- `apps/_shared/design/wireframes/provider/review-notes.md` — created
- `apps/_shared/design/wireframes/shell-universal-agentic.md` — revised in place
- `apps/_shared/design/wireframes/kitchen/shell-kt-kitchen.md` — revised in place
- `apps/_shared/design/wireframes/kitchen/kt-01-orders-with-packing-slip.md` — revised in place
- `apps/_shared/design/wireframes/provider/shell-pv-provider.md` — revised in place
- `apps/_shared/design/wireframes/provider/pv-01-patient-record-with-clinical-decision.md` — revised in place
- `apps/care-coordinator/design/review-notes.md` — appended new section (preserved historical 2026-03-27 review)
- `apps/care-coordinator/design/wireframes/shell-cc-coordinator.md` — revised in place
- `apps/care-coordinator/design/wireframes/cc-01-queue-with-care-plan-approval.md` — revised in place
- `apps/patient/design/review-notes.md` — appended new section (preserved historical review)
- `apps/patient/design/wireframes/shell-pt-mobile.md` — revised in place
- `apps/patient/design/wireframes/pt-01-dashboard.md` — revised in place
- `apps/patient/design/wireframes/pt-02-messages.md` — revised in place
- `apps/patient/design/wireframes/pt-03-settings.md` — revised in place
- `apps/patient/design/wireframes/pt-04-my-health.md` — revised in place
- `apps/patient/design/wireframes/pt-05-care.md` — revised in place
- `apps/_shared/design/2026-05-03-shell-pipeline-stage-2-review.md` — this summary (created)
