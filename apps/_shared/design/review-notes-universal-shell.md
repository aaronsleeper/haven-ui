# UX Review: Universal Agentic Shell

**Date:** 2026-05-03
**Inputs:** `apps/_shared/design/wireframes/shell-universal-agentic.md`
**Reviewer:** ux-design-review (pre-build mode)
**Research consulted:**
- NN/G, "Basic Patterns for Mobile Navigation: A Primer" — bottom-nav 4–5 tab guidance [Source: NN/G, "Basic Patterns for Mobile Navigation"]
- NN/G, "Tabs, Used Right" — cognitive load implications of tabbed navigation [Source: NN/G, "Tabs, Used Right"]
- NN/G, "Dangerous UX: Consequential Options Close to Benign Options" — destructive-adjacent action separation [Source: NN/G, "Dangerous UX"]
- W3C WAI, "Understanding Success Criterion 2.2.1: Timing Adjustable" — timing controls for users with reduced motion / cognition [Source: W3C WAI, "WCAG 2.1 — Timing Adjustable"]
- WCAG 2.1.2 (No Keyboard Trap) — verified; shell wireframe correctly excludes focus trap from persistent panes
- Material 3 Navigation Rail / Drawer specs — used by shell; widths and breakpoints align with spec (uncited but established practice for nav rail behavior)

## Summary

Universal shell wireframe is structurally sound and inherits from `layout-agentic-shell` correctly. All primitives exist in PL — no new components required at the universal level. The wireframe is specific, accessible, and respects locked Gate 1 + Gate 2 decisions. Two cross-cutting issues need resolution: (1) the per-user resize-pref clamping rule is restated in three documents and needs a single canonical implementation note; (2) the `panel-splitter` React port is repeatedly flagged as a downstream dev concern but no wireframe captures the keyboard-resize behavior the shell promises in §Accessibility — this risks the spec promising behavior the build doesn't deliver. Both flagged below.

## Screen: shell-universal-agentic

### Critical Issues

None at the universal-shell level. All component vocabulary maps to COMPONENT-INDEX entries; surface roles align with `DESIGN.md` §Surface; Ava-vs-Cena identity rules are correctly stated; HIPAA tool-call rendering rule (field names + summaries, never raw PHI) is captured.

### Improvements

- **Resize pref clamping rule is implicit in Open Question #3 but not in the §Interaction Specifications.** The agreed Gate 2 decision (clamp saved widths to current viewport's allowed range) should be promoted from Open Question to the canonical interaction spec for `Drag to resize`. Otherwise dev-tasker may build the naive "honor saved value blindly" path. — Recommendation: revise §Interaction Specifications to state the clamp behavior explicitly; remove from Open Questions.

- **Keyboard resize on `panel-splitter` is promised but underspecified.** §Accessibility states "Left/Right arrows resize by 10px; Home/End jump to min/max." 10px feels arbitrary; consider 16px (matches 4px Tailwind scalar × 4 — one design unit) for parity with the visual rhythm. NN/G doesn't specifically prescribe an increment, but matching the underlying scalar reads more polished and is the same answer dev-tasker will need. — Recommendation: change "10px" to "16px (one Tailwind unit ×4)".

- **`<aside aria-label="Activity thread">` for the right pane is correct but ambiguous when the right pane content is genuinely a thread for one persona and an order-status feed for another.** Per-app overrides exist in the per-app shell wireframes, so this is a clarity point: the universal shell should state that `aria-label` is per-app-overridable. — Recommendation: add a note that per-app shells re-author this aria-label (kitchen: "Order activity thread"; provider: "Clinical activity thread") and that the universal default is "Activity thread."

- **Toast position is "bottom of right pane" per §Interaction Specifications "Approve / Edit / Reject / Reassign," but the wireframe doesn't state z-index or overflow behavior when right pane is `overflow-y: auto` for the thread.** The toast must escape the pane's clipping context. — Recommendation: add interaction note: "Toast renders in a portal at the document level (not inside `<aside>`); pane scroll does not move the toast."

- **§Open Questions #1 (chat input location) is effectively decided** — Gate 2 confirmed thread input lives in right pane at v1. Promote to canonical interaction spec; remove from Open Questions.

### Copy

- **Empty-state heading (left pane, no items):** "Nothing needs your attention right now"
- **Empty-state body (left pane):** "We'll surface anything urgent. Until then, you're caught up."
- **Right pane empty (no item selected, coordinator):** "Pick a queue item to start. Each conversation lives with a specific patient or referral."
- **Right pane empty (provider):** "Pick a clinical review to start."
- **Right pane empty (kitchen):** "Pick an order to see its activity."
- **Per-pane error — queue load:** "We couldn't load your queue. Retrying…" + retry CTA "Try again"
- **Per-pane error — center load:** "We couldn't load this record. Try again or pick a different item." + retry CTA "Try again"
- **Per-pane error — thread load:** "We couldn't load activity for this record." + retry CTA "Try again"
- **Send-failed inline error (thread input):** "Couldn't send. Tap to retry."

## Cross-Screen Issues

These apply to the universal shell and propagate to every per-app shell that inherits.

- **Resize pref clamping** — flagged on shell-universal-agentic; same clarification needed in shell-cc-coordinator, shell-pv-provider, shell-kt-kitchen. Address at the universal level so per-app docs inherit by reference.
- **Toast portal pattern** — same flagged behavior should hold in every approve/edit/reject flow (cc-01, pv-01). Stating it once at the universal level avoids drift.
- **Keyboard splitter resize increment** — propagates the same way.
- **Loading-state parallel-load** — every per-app shell describes "all three panes load in parallel; whichever returns first renders its real content while others remain skeleton." This is correct and consistent — flag as a gold pattern, not an issue.

## Use Case Walk-Through

- **UC-SHELL-01 (Open app and orient):** Walks cleanly. Three panes render; left has role-specific list; center has orientation surface; right shows empty-state guidance. 2-3 second read confirmed achievable.
- **UC-SHELL-02 (Navigate to record + load thread):** Walks cleanly. Click triggers parallel-load of center + right. Active state on left item is unambiguous (`aria-current="true"` + teal left border).
- **UC-SHELL-03 (Resize panes — desktop):** Walks. Live-update during drag, clamp on min/max, persist on release. Concern: the spec doesn't state what happens during drag if user drags past max — does the cursor visually "stop" at max while the mouse continues, or does the splitter detach? Recommend: pane stops at max; cursor continues but splitter visually clamps. Add to interaction spec.
- **UC-SHELL-04 (Responsive collapse):** Walks. Material 3 + Fluent 2 thresholds map to the four breakpoints clearly. Patient app override (mobile is the design center) is correctly carved out.
- **UC-SHELL-05 (Approve in thread):** Walks for coordinator + provider. The 5-second undo is the spec — see Open Questions for whether 5s holds for clinical (Gate 2 decision is differentiated: 5s coordinator / 10s provider clinical / no-undo kitchen). Per-app shells already capture this; universal spec could mention the differentiation exists.
- **UC-SHELL-06 (Direct agent via thread):** Walks for coordinator + provider. Patient app correctly excludes (no agent thread). Kitchen v1 is low-frequency but supported.
- **UC-SHELL-07 (Patient acts on notification):** Walks. Patient app's right-pane equivalent is the Messages route (per Gate 1 decision). Push-deep-link lands on Dashboard at v1 (Gate 2 confirmed).
- **UC-SHELL-08 (Kitchen progresses order):** Walks. Status-progression buttons in right pane. Right pane auto-expands when order opens even below 1240px (per kt-01).
- **UC-SHELL-09 (Failure surfaces visibly):** Walks. Per-pane `alert-error` patterns are consistent across all four apps.

## Open Questions for Aaron at Gate 2-review

These are cross-cutting questions that apply to the universal shell and propagate downstream. Per-screen questions stay in per-app review-notes.

1. **Toast portal vs in-pane?** Recommend portal at document level so the toast escapes pane scroll. Confirm.
2. **Splitter keyboard-resize increment.** Recommend 16px (4px Tailwind unit ×4) over the spec's 10px. Confirm.
3. **Per-pane drag clamp visual:** when user drags past max, does the splitter handle visually clamp or detach from cursor? Recommend visual clamp.
4. **`prefers-reduced-motion` baseline coverage:** shell wireframe says "respect" — confirm all transitions (pane resize, nav-collapse, undo-toast slide, route-change) check the media query at one source rather than per-component.
5. **Right-pane `aria-label` per app:** confirm per-app override pattern documented at universal level.

## Verdict

**SHIP.** Wireframe is specific enough for haven-mapper handoff. Recommended improvements above are tightening, not blocking. Apply revisions inline; cross-cutting toast/keyboard/clamp questions go to Aaron's Gate 2 review.
