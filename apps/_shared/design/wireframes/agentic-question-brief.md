---
status: brief
intended_artifact: wireframe + PL composition entry
working_name: thread-question-card
shells: [] # pre-wireframe brief, not a screen composing inside a shell — gate skips
---

# Agentic Question — wireframe brief

**Type:** Pre-wireframe brief. Drives a wireframe authoring pass; not itself a wireframe.
**Application:** Multi-app shared component (Care Coordinator, Provider, Kitchen — desktop + tablet via `agentic-shell`; Patient — mobile via `mobile-shell`)
**Source:** Claude Code `AskUserQuestion` sheet (2026-05-08), two-pass UX Design Lead review
**Working name:** `thread-question-card` — parallels `thread-approval-card`. Final naming is a design-system-steward call at PL authoring time.

## Pattern job

Render an agent-posed structured question that requires the user to commit a single-or-multi-option answer (with optional free-text "Other" fallback) to advance the agent's work. The pattern carries:

- Short header chip (the question class, ~12 chars)
- Long-form prompt body (context + recommendation summary)
- N options with bold title + description body + optional inline "(Recommended)" badge + radio/checkbox glyph
- "Other" escape-hatch with reveal-on-select textarea
- Primary Submit commit (with optional numbered keybinding hint)
- Cancel/dismiss affordance

When an option carries a rich preview payload (mockup, code snippet, diagram), the layout escalates to master-detail: option list as the primary column, focused option's preview rendered in a secondary column.

## Provenance

- The Claude Code modal version is the inspiration but not the canonical haven-ui surface — Claude Code uses a modal because it lacks a thread pane. Haven-ui has one. See "Surface decisions" below.
- A two-pass UX Lead review (unprimed + primed) corrected an initial "compose `ChoicePicker` + `bottom-sheet`" hypothesis. The corrections are preserved as decisions in this brief.

## Surface decisions

**Canonical desktop surface:** inline thread approval-class card, hosted in `panel-content` (right rail of `agentic-shell`). Same family as `thread-approval-card`. The agent's preceding message provides provenance; the question lives in the thread where the answer also lives.

**Mobile surface:** `overlay-bottom-sheet`. Mobile has no thread pane; the bottom-sheet preserves focus + commit affordance.

**Master-detail (preview) escalation:** when any option carries a rich preview payload, desktop expands the card across `panel-chat` + `panel-content` as a master-detail; mobile uses sequential bottom-sheets (one for option list, one for focused option's preview).

**Why not a modal:** modal pulls the user out of context. Inline-thread keeps the question + answer co-located with the question's provenance. Modals are reserved for cross-thread or cross-record interruptions.

**Why not always master-detail:** layout shifts based on payload presence are non-trivial responsive contracts. The base case (no preview) is the common case; master-detail is the escalation. Wireframe must show both clearly.

## Composition map (Tier 2 + one Tier 1 sub-primitive)

The base pattern composes from existing primitives. One sub-primitive is genuinely novel.

| Slot | Composes from | Notes |
|---|---|---|
| Envelope | `thread-approval-card` (variant) | New variant: `.is-question` (parallels `.is-urgent` / `.is-warning` / `.is-historical`). Owns header + body + actions slots. |
| Header chip (question class label) | `badge-pill` | Steward call: does this earn a `question-class-chip` modifier or stay an inline `badge-pill` usage? |
| Prompt body | Prose body in `thread-approval-summary` | Reuse existing summary slot. |
| Recommendation summary | `ai-insight-callout` | Render the "Recommendation:" line as an AI-content callout (violet) since the recommendation is agent-authored. Inline within the prompt body. |
| Option list (single-select) | `response-option-group` + `response-option` | Closer ancestor than `ChoicePicker`. Already has bold-title + description + Radix-compatible `<button role="radio">` + `aria-checked`. |
| Option list (multi-select) | `response-option-group` + `response-option` (checkbox variant) | `aria-pressed` toggle pattern; verify `response-option` exposes a multi-select variant or extend it. |
| "(Recommended)" inline tag | `badge-sm` | Trailing on the recommended option's title. |
| **"Other" escape-hatch** | **NOVEL — Tier 1 sub-primitive** | `response-option-other` variant (or `choice-picker-option-other`): radio/checkbox option that reveals a `<textarea>` on selection. No PL precedent today. |
| Submit row | `btn-primary` + `btn-block` in `sticky-footer` | Pinned at card bottom. |
| Numbered keybinding hint | Token reuse from `cmd-palette-shortcut` | Inline-with-button affordance is a new editorial composition, not a primitive. Steward call on whether it earns a class. |
| Esc-to-cancel hint | `text-link` muted + dismiss-hint typography | Existing pattern. |
| Preview pane (master-detail variant) | `info-panel` *or* `code-view` | NOT `complex-comparison-panel` — that's for paired content (e.g., cc-08 duplicate compare). The agentic-question preview is one-option detail against a list. |

## Define-once boundaries (must be answered before the PL entry ships)

- `ChoicePicker` owns generic single/multi-select option-list picking; `thread-question-card` owns *answering an agent-posed structured question with commit*. Boundary: picking vs. committing.
- `ConfirmAction` owns binary approve/cancel for an agent-proposed action; `thread-question-card` owns *N-option answer to an agent-posed question*. Boundary: cardinality + verb (confirm vs. answer).
- `thread-approval-card` owns thread-embedded approvals (act on agent's proposal); `thread-question-card` owns thread-embedded questions (provide input agent needs). Implementation likely: same envelope, new `.is-question` variant. Boundary: approval vs. question.
- **Fuzziest boundary — must resolve before authoring:** `response-option-group` owns patient-assessment Likert (PHQ-9, GAD-7) — patient self-report instruments. `thread-question-card` owns agent-thread questions to coordinator/operator/patient. **Decision needed:** does `response-option-group` graduate to the canonical option-row primitive that both assessments and agentic questions compose, OR do they remain separate primitive families with parallel option-row implementations? Cleanest outcome is the former; the brief recommends it but the call belongs to design-system-steward.

## Variants the wireframe must capture

1. **Single-select, no preview** (the base case)
2. **Multi-select, no preview** (checkboxes, "Submit answers" plural)
3. **Single-select with master-detail preview** (one option focused, preview in secondary column)
4. **Mobile (single-select)** in `overlay-bottom-sheet`
5. **Mobile (master-detail)** sequential bottom-sheets (list → detail) with back affordance

## Interactions the wireframe must capture

- Option select (radio): single-select swap; selected-state-with-check
- Option select (checkbox): multi-select toggle; commit-button enabled when ≥1 selected
- "Other" reveal: when selected, a `<textarea>` reveals below or in-place; focus moves to the textarea
- Submit: commits selection(s); for "Other," commits the free-text payload
- Cancel/dismiss: Esc on desktop; back affordance / overlay-tap on mobile
- Numbered keybinding: pressing the displayed number commits Submit (desktop only — mobile has no keyboard surfaced)
- Preview swap: focusing/selecting an option in the master-detail variant updates the preview pane

## Acceptance criteria for the wireframe

The wireframe is "done enough" to advance to PL fragment authoring when:

- [ ] All 5 variants above are diagrammed
- [ ] All 7 interactions above are specified (trigger + feedback)
- [ ] `shells:` frontmatter declares `agentic-shell` (desktop variants) and `mobile-shell` (mobile variants) with current canon hashes
- [ ] The wireframe-vs-PL delta review (haven-mapper) is run against `pattern-library/COMPONENT-INDEX.md` and produces the bucketed build plan (exists / novel-composition / novel-primitive)
- [ ] The fuzzy `response-option-group` boundary above is resolved (steward sign-off captured in the wireframe's open-questions section)
- [ ] At least one consuming wireframe is named (likely cc-08 duplicate comparison for the master-detail variant; a coordinator referral-clarification flow for the base variant — to be confirmed with the consuming wireframe author)

## Likely consumers

- **Care Coordinator:** referral clarification questions ("which of these duplicate referrals is canonical?"), care-plan template selection, queue-prioritization disambiguation. The master-detail variant maps onto `cc-08-duplicate-comparison.md` shape.
- **Provider:** clinical-decision approvals where the question is "which interpretation matches your read?" with lab-data preview side-by-side.
- **Patient (mobile):** Ava asking structured questions during meal-ordering or care-team chat ("which delivery window works?", "which of these tags fits how you've been feeling?"). Bottom-sheet surface.
- **Kitchen:** less likely; kitchen flows are more status-driven than question-driven, but possible for substitution decisions.

The wireframe author should confirm consumers with the corresponding app-design owners before the wireframe ships — at least one consumer must be named for the wireframe to satisfy haven-ui's wireframe-driven discipline.

## Open questions for the wireframe author (not for the brief)

- Header chip naming + rendering: badge-pill usage vs. new modifier?
- "Other" textarea reveal: in-place expansion vs. dedicated reveal slot below the option list?
- Numbered keybinding affordance: visible label vs. tooltip vs. pressed-state hint? Desktop-only or also surfaced on tablet?
- Preview-variant breakpoint: at what viewport does master-detail collapse to sequential mobile bottom-sheets? Desktop-only escalation or also tablet?
- Multi-select Submit copy: "Submit answers" (plural) vs. context-specific (e.g., "Apply selections")? Likely a copy-decision per-instance, not a primitive concern.
- Idle state: while the user is selecting (no commit yet), can the agent send another message in the thread? If yes, where does the in-flight question live (pinned? scrolled?)?

## Out of scope for this brief

- Semantic class names, CSS, HTML, JSX (PL fragment authoring stage)
- Accessibility judgment beyond the radiogroup/listbox + Other-reveal focus call already made (full pass at PL authoring time)
- Brand-fidelity judgment (typography, "Recommended" badge color, AI-insight-callout vs. inline-prose recommendation framing)
- Token decisions (steward at PL authoring time)
- React port (Tier 2 mechanical port of the PL fragment, runs after PL fragment ships and after `ui-react-porter` skill — a separate downstream slice)

## References

- `apps/_shared/design/wireframes/shell-universal-agentic.md` — agentic-shell carrier surface
- `apps/care-coordinator/design/wireframes/cc-08-duplicate-comparison.md` — likely consumer of master-detail variant
- `apps/patient/design/wireframes/assess-03-question.md` — related but distinct (patient self-report, not agent-clarification)
- `packages/design-system/pattern-library/COMPONENT-INDEX.md` — full PL inventory; entries for `thread-approval-card`, `response-option-group`, `ai-insight-callout`, `info-panel`, `code-view`, `sticky-footer`, `cmd-palette-shortcut`
- `planning/experts/ux-design-lead/judgment-framework.md` — surface decision tree (routine + low-risk → thread message; default approval → in-thread card)
- `CLAUDE.md` — slice authoring (wireframe-driven, PL-first); tier criteria; gate triage
