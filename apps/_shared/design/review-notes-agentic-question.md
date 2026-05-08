# UX Review: Agentic Question (thread-question-card)

**Date:** 2026-05-08
**Inputs:**
- `apps/_shared/design/wireframes/agentic-question.md`
- `apps/_shared/design/wireframes/agentic-question-brief.md`
- `apps/_shared/design/wireframes/shell-universal-agentic.md`
- `apps/care-coordinator/design/wireframes/cc-08-duplicate-comparison.md` (likely master-detail consumer)
- `apps/care-coordinator/design/wireframes/cc-01-queue-with-care-plan-approval.md` (sibling thread-approval-card precedent)
- `packages/design-system/pattern-library/COMPONENT-INDEX.md`
- `DESIGN.md` §Voice
**Reviewer:** ux-design-review (pre-build mode)
**Mode:** Pre-Build (Gate 2 → haven-mapper)

**Research consulted:**
- Nielsen Norman Group, "The Power of Defaults" — defaults as instructional + normative; warns against exploiting defaults; does NOT prescribe how to visually distinguish a "recommended" default from an "auto-selected" one (gap covered by expert judgment below) [Source: NN/G, "The Power of Defaults"]
- Nielsen Norman Group, "Website Forms Usability: Top 10 Recommendations" — radio for single-select, checkbox for multi-select; multiple visual cues over color alone [Source: NN/G, "Web Form Design"]
- gov.uk Accessibility Blog, "An update on the accessibility of conditionally revealed questions" (2021) — ARIA Working Group concluded "conditional reveals are fine — as long as they're kept simple"; problematic when reveal contains *multiple* fields or text content; single-input reveal performs well in user testing [Source: gov.uk Accessibility Blog, "Conditionally revealed questions", 2021]
- W3C WAI-ARIA Authoring Practices, "Radio Group Pattern" — roving tabindex; on group mount, focus moves to the checked radio if any, otherwise the first radio; arrow keys move focus *and* check; Space checks the focused radio [Source: W3C WAI-ARIA APG, "Radio Group Pattern"]
- USWDS Radio button accessibility tests — focus indicator must encompass both glyph and label; visible against background [Source: USWDS, "Radio buttons accessibility tests"]
- MDN, `aria-keyshortcuts` reference — single-letter and single-digit shortcuts are fragile across keyboard layouts (French AZERTY requires Shift for digits 1–9); shortcuts must be both visible to sighted users AND announced to AT [Source: MDN Web Docs, "aria-keyshortcuts"]
- Webapphuddle, "Master-Detail UI Pattern Design" — stacked (mobile) vs side-by-side (wide); Google Maps example uses an explicit back arrow on the detail pane on mobile [Source: webapphuddle.com, "Master-Detail UI Pattern Design"]
- AHRQ PSNet, "Alert Fatigue" — interruptive alerts that don't carry clinically distinct payload drive override behavior; specificity + role tailoring reduce override rates [Source: AHRQ PSNet, "Alert Fatigue"]

## Summary

The wireframe is structurally sound, well-decomposed against existing PL primitives, and correctly defers architectural calls already settled by the steward (option-row vs. response-option boundary). Five variants cover the responsive surface space comprehensively. The most consequential gaps cluster around *commit-cycle clarity* — what happens between Submit-tap and Submitted-state, what happens when an in-flight question is interrupted, and how the master-detail variant signals which option the user is currently previewing. Twelve open questions are listed; nine of them are resolvable inline by this review (resolved + tagged `[REVISED 2026-05-08]` in the wireframe), three genuinely require feel-tests at PL-fragment authoring time and are deferred. No new components are flagged beyond the 12 already locked at Gate 2.

## Variant 1 — Single-select, no preview (desktop)

### Critical Issues

- **Submit double-tap / rapid-fire is undefined.** Wireframe says Submit enters loading state, but doesn't say what blocks a second click during that window. Care coordinators with high-volume queues will hit this. Recommendation: Submit transitions to `disabled` simultaneously with the spinner-on transition; the disabled-with-spinner state is canonical for in-flight commits across `thread-approval-card.actions` already, so this is a consistency point not a new pattern. — Resolved inline.
- **Recommendation signaling collapses two distinct affordances into one.** The wireframe's Variant 2 (multi-select) says "agent may pre-select the recommended option(s) on mount" while Variant 1 (single-select) does not. NN/G's defaults-paper draws the distinction: a *default* is pre-selected; a *recommendation* is suggested but not pre-selected. Conflating these in copy ("(Recommended)" badge on a pre-selected option) is the exploit-defaults trap NN/G warns against [Source: NN/G, "The Power of Defaults"]. Recommendation: single-select uses `(Recommended)` badge but does NOT pre-select; multi-select may pre-select recommended options when the agent's confidence is high, with the badge still visible AND a subtle "agent suggested these" line above the option list. — Resolved inline; copy proposed below.

### Improvements

- **Initial focus contradicts WAI-ARIA radio-group pattern.** Wireframe says "focus moves to the first option-row (NOT the Submit button)." WAI-ARIA APG specifies: focus moves to the *checked* radio if one is checked; otherwise the first. In single-select with a recommendation that is *not* pre-selected, this becomes "focus the first option" which matches APG. But if a future variant pre-selects, the spec needs to honor "focus the checked option" [Source: W3C WAI-ARIA APG, "Radio Group Pattern"]. Recommendation: revise focus rule to "first checked option, otherwise first option."
- **The "Recommendation:" callout (`ai-insight-callout`, violet) above the option list will visually compete with the inline `(Recommended)` badge when both render.** Two violet zones in adjacent vertical rhythm. Recommendation: either drop the badge when the callout is present (callout is sufficient) OR drop the callout register-shift on the badge (use neutral `badge-sm` instead of an AI-content register since the option-row context is already inside the AI conversation). Steward call at PL authoring; flagging here for consideration.

### Copy

- **Question class chip examples** (header chip, ~12 char):
  - Coordinator referral clarification: "Match referral"
  - Patient meal-window: "Delivery time"
  - Provider clinical-decision: "Care plan path"
  - Kitchen substitution: "Substitution"
- **Submit (single-select):** "Submit answer"
- **Submit (single-select, when keybinding shown):** "1 — Submit answer"
- **Esc hint:** "Esc to cancel"
- **"Other" description (default):** "Type a different answer"
  - Spanish: "Escribe otra respuesta"
- **Empty textarea placeholder under "Other":** "Tell us what fits better."
  - Spanish: "Cuéntanos qué se ajusta mejor."
- **Submit-disabled-but-an-option-is-revealed-and-empty hint** (sr-only, announced when user attempts Submit with empty Other textarea): "Add a few words to your answer to submit." — Resolved inline.

## Variant 2 — Multi-select, no preview

### Critical Issues

- **Submit-enabled rule is ambiguous when the agent pre-selects options.** Wireframe says "enabled when ≥1 option selected." If the agent pre-selects two, Submit is enabled on mount. But the user has not committed yet — Submit firing on a stray Enter would commit the agent's pre-selection as if it were the user's. Recommendation: when the agent pre-selects, render a quiet "agent's suggestion" affordance above the list ("Ava suggested these. Edit and submit when ready.") and require at least one user-driven interaction (toggle on or off) before Submit fires, OR keep Submit enabled but require a confirmation modal on first commit. The first option is less intrusive and matches haven's "warm + specific" voice. — Resolved inline (less intrusive option).

### Improvements

- **ARIA pattern decision.** Wireframe says "alt: `<button aria-pressed>`; steward call at PL authoring." `<button role="checkbox">` + `aria-checked` is the WAI-ARIA-canonical multi-select-from-a-group pattern; `aria-pressed` is the toggle-button pattern (one button stands alone, no group semantics). Since the option-row-list IS a group of selectable options, `role="checkbox"` is correct here, parallel to `chat-tag-group`'s use of `aria-pressed` (chat-tag-group is a free-form chip-cloud, not a structured option list — different shape). Recommendation: lock to `role="checkbox"` for the option-row-list multi-select variant. — Resolved inline.

### Copy

- **Submit (multi-select):** "Submit answers"
- **Submit (multi-select, agent pre-selected):** "Submit answers" (same — the suggestion line above sets the context)
- **Agent-suggestion line above pre-selected list:**
  - "Ava suggested these. Edit and submit when ready."
  - Spanish: "Ava sugirió estas opciones. Ajusta y envía cuando quieras."
  - 5th-grade-level for patient surfaces: "Ava picked these to start. Change them or send as is."
  - Spanish patient: "Ava marcó estas para empezar. Cámbialas o envíalas así."

## Variant 3 — Single-select, master-detail preview (desktop)

### Critical Issues

- **The "focused option" definition allows two simultaneous preview-eligible states (hover AND keyboard-focus AND selection).** The wireframe says "Selection takes precedence over hover," but doesn't address keyboard-focus-vs-hover. A coordinator using the keyboard and a hovering mouse simultaneously will see the preview swap rapidly. Recommendation: precedence order is **selection > keyboard-focus > hover**, and keyboard-focus changes mute hover-induced swaps for a short cooldown (e.g., 300ms after the last keyboard event). The preview pane needs a `data-preview-source` attribute exposing which signal drives the current preview, for diagnostic + screen-reader announcement. — Resolved inline.
- **Preview swap is a screen-reader announcement gap.** When a sighted user hovers an option, the preview pane changes silently. For a screen-reader user navigating with arrow keys, the preview pane content updates as a side effect of focus moves. Without an `aria-live` region on the preview pane, the user gets no indication that the right pane changed. Recommendation: `panel-content` (the detail pane) wraps an `aria-live="polite"` region announcing the focused option's title + first-line preview summary. Suppress announcements when selection is the trigger (the announcement on selection is already happening at the option-row level). — Resolved inline.

### Improvements

- **The "no-preview-available" state has the right shape but ambiguous trigger.** `[NEW STATE: option-preview-empty]` is fine for a list mostly-with-previews. But what if zero options have previews? Then Variant 3 should not render — the layout should fall back to Variant 1 (no master-detail break). Recommendation: add a layout-decision rule: master-detail engages only when ≥2 options have preview payloads, OR when ≥1 option has a preview AND the agent has marked the question as "preview-comparing." Single-option-with-preview is a corner case that warrants Variant 1 + a "View preview" inline disclosure, not full master-detail. — Resolved inline as a runtime layout rule.

### Copy

- **`option-preview-empty` heading:** "No preview for this option"
- **`option-preview-empty` body:** "Pick a different option to see a preview, or select this one to commit."
  - Spanish heading: "Sin vista previa"
  - Spanish body: "Selecciona otra opción para ver una vista previa, o elige esta para enviar."
- **`option-preview-error` heading:** "Couldn't load this preview"
- **`option-preview-error` body:** "Try again, or pick a different option."
- **`option-preview-error` retry CTA:** "Try again"

## Variant 4 — Mobile single-select (`overlay-bottom-sheet`)

### Critical Issues

- **No focus-trap call-out for the bottom-sheet variant.** A bottom-sheet IS a modal-equivalent overlay; per WCAG 2.4.3 + the haven-ui shell rule (focus trap in modals only), the question card on mobile is one of the few places focus-trap applies. The wireframe's §Accessibility section is silent on this. Recommendation: explicit focus-trap inside the bottom-sheet body; Tab cycles through option-rows → Submit → close-button (`fa-xmark`) and back. Esc dismisses the sheet (matches mobile-overlay convention; no keyboard on touch is a reasonable assumption only when there's NO Bluetooth keyboard — assume keyboards exist on tablets). — Resolved inline.

### Improvements

- **Sticky-footer-inside-bottom-sheet-body approach.** The wireframe says "Sticky footer inside bottom-sheet-body's bottom edge." This works visually, but iOS Safari's bottom-bar collapse during scroll can briefly hide the footer behind the address bar. Recommendation: footer pins to the `bottom-sheet-panel` root (sibling of body), not inside body's scroll context. Existing `sticky-footer` primitive already supports this. — Resolved inline.

### Copy

- **`bottom-sheet` close button aria-label:** "Cancel question"
  - Spanish: "Cancelar pregunta"
- **Backdrop tap dismiss** is silent; no copy needed.

## Variant 5 — Mobile master-detail (sequential bottom-sheets)

### Critical Issues

- **Sheet 2 → Sheet 1 return behavior is the load-bearing UX call.** Open Question in the wireframe asks: does Sheet 2's "Select this option" commit-and-dismiss directly, or return to Sheet 1 with the option pre-selected for explicit Submit? Resolution: **return to Sheet 1 with the option pre-selected.** Three reasons:
  1. Consistency: every variant has Submit as the canonical commit affordance; collapsing both sheets on Sheet-2 commit makes Sheet 2's button a different verb (commit) than every other "Select" / "Pick" affordance in the system.
  2. Reversibility: returning to Sheet 1 with the option highlighted lets the user back out without re-opening the preview.
  3. Mental model: master-detail's "drill in, come back, decide" matches Apple HIG and Material's bottom-navigation conventions [Source: webapphuddle.com, "Master-Detail UI Pattern Design"; Apple HIG, Navigation, by reference].
   — Resolved inline.

### Improvements

- **Back-affordance copy on Sheet 2.** A `fa-arrow-left` icon-only button is ambiguous on a screen-reader pass. Recommendation: `aria-label="Back to options"` with the icon. Sighted users get the icon; AT users get the verbose label.
- **Sheet-stack focus return.** When Sheet 2 dismisses (via back), focus returns to the option-row in Sheet 1 that opened Sheet 2 — NOT to Sheet 1's first option. Standard sheet-stack pattern. — Resolved inline.

### Copy

- **Sheet 2 back button aria-label:** "Back to options"
- **Sheet 2 commit button:** "Choose this option" (returns to Sheet 1 with selection)
  - Spanish: "Elegir esta opción"
- **Sheet 1 returning-from-Sheet-2 announcement** (sr-only, `aria-live`): "Returned to options. [Option title] is selected. Submit answer at the bottom." — Resolved inline.

## Cross-Variant Consistency Issues

- **In-flight idle behavior is unspecified across all variants.** What does the card look like at minute 5 when the user walked away? Recommendation: after 90 seconds of idle (no focus, no interaction), the card collapses its description text into a one-line summary ("Question from Ava: [class]") and dims slightly to free the thread for non-blocking activity. Tapping/focusing re-expands. This matches haven's "every line earns its warmth by being specific" — a stale full-card is louder than a quiet collapsed one. — Resolved inline as `[NEW STATE: thread-question-card.is-idle]` BUT this would be a 13th component flagged. **Flagged as open question for Aaron.**
- **Multiple in-flight questions per thread.** Wireframe defaults to "no, queue subsequent questions." Resolution: lock to **one in-flight question per thread**; the agent must wait for the user's answer (or cancel) before posing another. If urgent context arrives mid-question, the agent posts a `thread-msg-system` "Heads up: [context]" without invalidating the in-flight card. — Resolved inline.
- **Cancellation logging.** Wireframe asks: always log, or only when agent's logic depends on it? Resolution: **always log** as `thread-msg-system` ("Question dismissed at [timestamp]"). Three reasons: (a) thread-history clarity for retrospective debugging, (b) HIPAA-adjacent audit trail for clinical apps, (c) the noise cost is bounded — one line per cancel, dimmed register. The "noise becomes a problem" concern is valid but solvable later by collapsing consecutive system messages. — Resolved inline.
- **Master-detail breakpoint.** Wireframe asks at what viewport master-detail collapses. The agentic-shell minimum is 720px (per shell-universal-agentic.md); below 720px, mobile-shell takes over. Resolution: **breakpoint is implicit at the shell-routing level — no per-card breakpoint.** Above 720px → Variant 3 (master-detail panes); below 720px → Variant 5 (sequential bottom-sheets). — Resolved inline.
- **"Other" reveal direction.** Wireframe asks: in-place expansion (default in spec) vs. dedicated slot below the option list. Resolution: **in-place expansion** for option lists ≤6 options. For lists >6, the dedicated-slot-below approach is better because in-place pushes options out of view. The wireframe's expected option count is 2–5 (matching response-option-group precedent), so in-place is right for the default. Add a guardrail: option lists exceeding 6 options should trigger a steward review. — Resolved inline.
- **Loading spinner on Submit.** Wireframe asks if a meaningful latency window exists. For agent-platform commits, the 95th percentile is unmeasured today. Resolution: ship the spinner; instrument the latency; revisit if 95p stays under 800ms (drop the spinner) or exceeds 2s (add a "still working" affordance after 1.5s). The current spinner-on-Submit is the safe default. — Resolved inline.
- **Preview swap transition** (instant vs. crossfade). Pure feel-test. Deferred to PL fragment authoring.
- **Per-option keybinding hint visibility** (always vs. Cmd-hold vs. never). Pure feel-test. Deferred to PL fragment authoring. Note: per MDN's `aria-keyshortcuts` guidance, the Submit-button-displayed digit must be both visible AND in `aria-keyshortcuts` regardless of whether per-option hints render [Source: MDN, "aria-keyshortcuts"].

## Use Case Walk-Through

- **Coordinator referral clarification (Variant 1, single-select, ~3 options + Other, no preview).** Walks cleanly. Coordinator opens a duplicate-flagged referral in cc-04, the right-pane thread shows Ava's question card pinned as hero ("Match referral: same person, different person, link as new episode?"). Three radio options with descriptions. Coordinator selects "Same person, link as new episode," presses Enter (or "1"), card collapses to Submitted state, agent's next message appears. Friction point: the coordinator's mental model of duplicate resolution lives in cc-08 (full comparison panel); the question card may pose the question without the coordinator having seen the comparison yet. Recommendation: when the question class is "Match referral" (or any class that has a corresponding viewer), the question body includes a `chat-sheet-link` ("View full comparison") that opens cc-08 in the center pane. The card stays pinned in the right pane. — Captured in wireframe revision.

- **Patient meal-window selection (Variant 4, mobile bottom-sheet, single-select, 3 windows).** Walks cleanly. Patient gets a chat-thread message from Ava asking "When should we deliver?", followed by a thread-question-card that opens as a bottom-sheet on mobile. Three options (lunch / dinner / late evening). Patient taps one, taps Submit. Bottom-sheet dismisses, thread shows confirmation. Friction point: bilingual layout for "(Recommended)" → "(Recomendado)" may break the inline-with-title slot at small viewports. — Captured in Bilingual section revision.

- **Provider clinical-decision with preview (Variant 3, desktop master-detail, single-select, 2 options each with care-plan preview).** Walks cleanly. Provider reviews a referral in pv-01; right-pane thread shows Ava's question card asking "Which care plan path matches your read?", master pane shows option list, detail pane shows the focused option's care-plan preview rendered via `info-panel`. Provider hovers option 2, preview swaps to plan B. Provider selects option 2, presses Submit. Friction point: pv-01's right-pane uses a clinical thread allowlist that may not yet include `agent_question` event types — confirm allowlist parity. **Flagged as open question for Aaron** (allowlist coordination across personas).

- **Kitchen substitution (Variant 2, multi-select, 2-3 substitution options + Other).** Walks. Kitchen staff in kt-01 sees an order with a missing ingredient; Ava poses the substitution question; staff selects 1-2 acceptable subs and submits. Friction: kitchen tablets often have gloved hands and 48px touch-target requirements (per shell-universal-agentic.md); the wireframe's 44px floor for option-rows is too small. Recommendation: kitchen-app consumers override the 44px floor to 48px via `option-row.is-tablet-dense` or by setting `--option-row-min-height` at the app level. Steward call at PL authoring. — Captured in revision.

## Healthcare-specific checks

- **Alert fatigue:** if agentic-questions become a high-frequency interrupt (multiple per hour for a coordinator), the always-pinned-as-hero behavior compounds with thread-approval-card pinning. Both can't pin simultaneously. Recommendation: pin priority order is `thread-approval-card.is-urgent > thread-question-card (in-flight) > thread-approval-card (default) > thread-question-card.is-historical`. The wireframe doesn't specify pin-priority. — Captured in revision. [Source: AHRQ PSNet, "Alert Fatigue"]
- **HIPAA visibility:** option titles + descriptions are agent-authored; the agent must avoid raw PHI in option text where the thread is visible to non-attending users (e.g., over-shoulder views in shared workstations). The wireframe defers this to "agent's content layer," which is correct, but the card primitive should support an `is-phi-redacted` modifier that masks option text in screenshots/screen-shares. **Flagged as open question for Aaron** (whether to add a 13th component, or punt to consuming-app concern).
- **Documentation burden:** Submitted-state collapses to `thread-msg-response`-style summary. Good — no extra documentation. The Submitted-state copy should include the exact answer the user committed (not a paraphrase) so it's auditable later. — Captured.
- **Cultural sensitivity (patient-facing):** patient meal-window copy uses 5th-grade reading level + Spanish parity. Verified above.

## Outstanding Open Questions for Aaron at Gate 2 review

These are the items I cannot resolve without input.

1. **Pin-priority across thread message types.** Should `thread-question-card.in-flight` outrank `thread-approval-card` (default, non-urgent) when both are present in the thread? The wireframe is silent. My recommendation: yes, because a question blocks agent progress, but this is a thread-rendering-policy decision spanning multiple primitives. Confirm direction.
2. **Idle-state collapse (90s rule).** Adding `thread-question-card.is-idle` would be a 13th component beyond the locked Gate 2 list. Do you want this added now, or punted to a follow-up slice (and accept that a stale card stays full-size)?
3. **PHI-redaction modifier.** Same as above — adding `is-phi-redacted` would be a 13th component, OR a consuming-app concern (each app's thread renderer applies redaction at render time, not at primitive level). Recommendation: punt to consuming-app concern; the primitive carries no PHI-awareness. Confirm.
4. **Allowlist parity for `agent_question` event type across persona-app threads.** Coordinator + provider + patient + kitchen each have different `data-allowlist` configurations on their `panel-content` thread. Adding agent-question requires confirming each persona's allowlist explicitly accepts the new event type. This is downstream-shell work — confirm whether haven-mapper handles it or if a separate "thread-allowlist update" task is queued.
5. **Recommendation pre-selection in multi-select.** I resolved this inline as "agent suggests but user must touch the list before Submit fires; suggestion line above set the context." Confirm acceptable; the alternative is "Submit is enabled on agent pre-selection but requires confirmation modal on first commit" — slightly more intrusive but eliminates the stray-Enter risk entirely.
6. **Question class chip register.** Resolved inline to "inline `badge-pill` usage, no new modifier" — but the steward call may differ once the chip has visual weight in real renderings. Steward at PL authoring will confirm.

## Deferred to PL fragment authoring (visual feel-test)

Three items moved from "Unresolved" to deferred — they can only be evaluated against rendered output:

- **Preview swap transition** — instant vs. crossfade. Crossfade risks distraction; instant risks feeling abrupt. Test both at PL authoring with a real preview payload.
- **Per-option numbered keybinding hint visibility** — always vs. Cmd-hold vs. never. Always-on may clutter dense lists; Cmd-hold is discoverable for power users; never may underutilize the affordance. Test all three with real option counts (3, 5, 7).
- **Recommendation callout vs. inline (Recommended) badge co-existence** — when both render, do they read as redundant or as reinforcing? Test in `cc-08` consuming context where the question + recommendation both carry weight.

## Verdict

**Iterate, then ship to haven-mapper.** The wireframe is in good shape; revisions resolve nine of twelve open questions, write final copy for every placeholder, and patch four critical issues (Submit double-tap, recommendation/default conflation, master-detail focused-option precedence, focus-trap on mobile). Six items genuinely need Aaron's input at Gate 2; three items are deferred to feel-test. No new components flagged beyond the 12 already locked.
