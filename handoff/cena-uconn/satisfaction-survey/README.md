# Slice — Satisfaction survey (cap-09)

Patient-facing satisfaction survey runner for the UConn pilot. Delivered at Months 3, 6, and 9 per Exhibit B.h.i. Reuses the assessments slice pattern exactly (same state machine, same shell, same primitive classes).

## State table

| State | File | Description |
|---|---|---|
| Entry | `take-survey.entry.html` | Agent-pushed entry from Home. Preflight card + framing message. No nav tab — surfaces inline when triggered at M3/M6/M9 milestone. |
| Preflight | `take-survey.preflight.html` | Runner state 1. Survey name, question count, time estimate, disclosure, "I'm ready" CTA. |
| Question | `take-survey.question.html` | Runner state 2. Working surface — assessment-header + progress-bar-pagination + questionnaire card. Demonstrates two question shapes: 5-point Likert (Q1) and emoji-scale (Q5). Interactive runner at bottom of page. |
| Confirm | `take-survey.confirm.html` | Runner state 3. Submit confirmation. NO score shown to patient. |

## Composition — primitive classes used

**Shell (shared with assessments slice):**
- `.app-shell`, `.app-shell-frame`, `.app-shell-sidebar`, `.app-shell-main`, `.app-shell-content`, `.app-shell-bottom-nav`
- `.nav-header`, `.nav-logo`, `.nav-section`, `.nav-section--pinned-bottom`, `.nav-item`, `.nav-avatar`
- `.mobile-bottom-nav`, `.mobile-bottom-nav-tab`

**Preflight card:**
- `.assessment-preflight-card`, `.assessment-preflight-card-body`, `.assessment-preflight-card-title`, `.assessment-preflight-card-meta`, `.assessment-preflight-card-meta-item`, `.assessment-preflight-card-disclosure`, `.assessment-preflight-card-actions`

**Question working surface:**
- `.assessment-header`, `.assessment-header-title`, `.assessment-header-meta`
- `.progress-bar-pagination`, `.progress-bar-pagination-segment`, `.is-filled`
- `.card`, `.card-header`, `.card-body`
- `.response-option-group`, `.response-option-group-prompt`, `.response-option-group-list`
- `.response-option`, `.response-option-index`, `.response-option-index-num`, `.response-option-label`, `.response-option-check`
- `.emoji-scale`, `.emoji-scale-option`, `.emoji-scale-icon`, `.emoji-scale-label`
- `.pagination-row`
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-ghost`, `.btn-sm`

**Agent framing + confirmation:**
- `.patient-chat-message`
- `.assessment-confirmation`, `.receipt`, `.receipt-title`

**Utilities (layout-only, not semantic classes):**
- `p-6`, `lg:p-10`, `space-y-6`, `space-y-2`, `flex`, `items-center`, `justify-between`, `text-sm`, `text-base`, `font-medium`, `text-sand-600`, `mb-4`, `mb-6`, `grid`, `grid-cols-3`, `gap-2`, `sr-only`

## Runner reuse

`satisfaction-runner.js` is a copy-and-configure of `../assessments/assessment-runner.js`. The state machine contract, DOM wiring (`data-assessment-root`, `data-state`, `data-action`, `data-confirm-variant`), CustomEvents, and programmatic API (`el._assessment`) are IDENTICAL.

**What was stripped:**
- Identity state (`data-state="identity"`) — satisfaction has no identity-capture step.

**What was added:**
- `inputType: 'emoji-scale'` handling — renders a `.emoji-scale` fieldset with `.emoji-scale-option` labels + sr-only inputs for the overall-satisfaction item (Q5). The `.emoji-scale` primitive is already in `haven.css`.

**Fallback instance data:** `window.SURVEY_INSTANCE` → `[data-instance]` JSON on root → built-in `DEFAULT_SURVEY_INSTANCE` (8 provisional items). Override the default by setting `window.SURVEY_INSTANCE` before the script loads.

## Nav tab note

The satisfaction survey has **no nav tab**. Per IA-v1, Check-ins are agent-pushed program moments — they surface on Home (or via Activity push) when triggered, not as a persistent tab. The nav in these pages shows the 3 IA-v1 tabs (Home · Order · Activity) with no active Check-ins tab.

## NO-SCORE invariant

**Hard rule. Not a UX choice. Not a "for now" decision.**

The satisfaction instrument generates a score for the care team. That score is:
- Present in the `assessment:submit` CustomEvent detail (for backend consumption).
- **Never rendered in the DOM on the patient surface.**

`take-survey.confirm.html` shows only: "Submitted just now. Your care team has it." No numeric, categorical, or visual score. No "you scored X out of Y." No outcome label.

This mirrors the same invariant in the assessments slice (DG-01 / cap-51 clinician-surface routing).

## Provisional content note

Survey item copy and the full item set are **placeholders**. Final items require Vanessa's input per cap-09 acceptance criteria: *"Survey content drafted and approved (Vanessa input)."*

Placeholders were written to be representative and in the correct voice (plain, warm, 2nd-person, ~5th–6th grade). Do not treat them as approved content. Every item in `satisfaction-runner.js` `DEFAULT_SURVEY_INSTANCE.items` is a `[VERIFY]`-equivalent until Vanessa signs off.

## Canonical references

- cap-09 spec: `Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/cap-09-satisfaction-surveys.md`
- Assessments slice (reuse target): `../assessments/`
- IA-v1 (Check-ins surface role): `~/.claude/plans/patient-app-ia-v1.md`
- haven.css component reference: `../assets/haven.css`
