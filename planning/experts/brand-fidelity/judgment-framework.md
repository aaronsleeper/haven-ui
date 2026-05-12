# Judgment Framework

## The five-question scorecard

For each slice, score 0–2 on each dimension. Max score 10. Ship threshold 7.

### 1. Brand voice (0–2)

- 0: Generic / clinical / instruction-framed
- 1: Warm but generic ("Welcome back!")
- 2: Observational + specific ("I noticed you logged your weight this morning — great job!")

### 2. Visual hierarchy (0–2)

- 0: Flat — no surface layering, hard edges, pure white bg
- 1: Correct tokens but missing translucency / elevation polish
- 2: Stone + translucent white + warm shadows + float-in-shell treatment all present

### 3. Typography expression (0–2)

- 0: Sans-only, default font-features, no Lora
- 1: Lora + Inter but default font-feature settings
- 2: Lora + Inter + JetBrains Mono with canonical `font-feature-settings` enabled

### 4. Primary teal discipline (0–2)

- 0: Teal used on navigation, advancement, or informational actions
- 1: Teal on most user-commits but some leakage onto advancement
- 2: Teal reserved strictly for commits-that-change-state; advancement is secondary stone

### 5. Ava identity treatment (0–2, only scored when chat is in scope)

- 0: No Ava avatar present; FA icon or initials substitute
- 1: Ava avatar in chat but wrong size / wrong position / not used on action citations
- 2: Ava avatar correctly sized + positioned in chat; used on action citations; never in nav chrome

For slices without a chat pane, substitute dimension 5 with "Stone surface palette — is the page bg `stone/50`, are panes translucent white, are cards on white/`stone/100`?" (same 0/1/2 scale).

## Ship / iterate / block verdicts

| Score | Verdict | Action |
|---|---|---|
| 9–10 | Ship | Merge; notes on any 1-point deductions for follow-up |
| 7–8 | Iterate | Return with specific changes; single-pass retry expected |
| 0–6 | Block | Return to slice owner; requires rework + re-review |

Never escalate a "block" to "ship" via argument. Scores are artifacts; the dimension names the gap.

## Resolving close calls

When scoring is borderline (e.g., 6.5), ask:

1. **Would Aaron recognize this as Haven at a glance?** If no, block.
2. **Is the gap one-line fixes, or does it require re-thinking?** One-line fixes iterate; re-thinks block.
3. **Does this slice ship to a patient-facing surface, or internal-only?** Patient-facing gets a higher bar — ship threshold climbs to 8.

## Common decision patterns

### "The mock uses FA icon; DESIGN.md says Ava avatar for agent presence"

→ DESIGN.md wins. The mock may be outdated or illustrative. Flag the mock for Figma update in the finding.

### "Slice uses primary teal for Next button in a form"

→ Block on dimension 4. Next is advancement, not a commit. Should be secondary stone.

### "Copy is warm but generic — 'Welcome!' instead of specific observation"

→ 1 on dimension 1. Iterate with one-line rewrite suggestion tied to a user observation actually available in context.

### "Slice uses `bg-white` instead of `stone/50` for page bg"

→ Block on dimension 2. This is a whole-slice visual regression; the page bg is load-bearing for the Haven feel.

### "Slice shipped before DESIGN.md landed (retrofit target)"

→ Score it as the retrofit diff, not the original slice. Focus review on what the retrofit changed, not what it inherited.

### "Sibling primitives diverge on surface, opacity, or border-width"

When two primitives serve the same role-family in the same render context (e.g., `thread-approval-card` and `thread-question-card` both rendering as hero cards in the same thread pane), they must align on the family-defining axes: surface token, opacity at parity states, border weights, and accent treatment. Drift on any of these reads as "different family" even when the underlying decisions are correct.

→ Flag as iterate on dimension 2 (visual hierarchy) with the specific divergence named. Anchor the verdict on the *sibling* primitive's values — name them in the finding so the iteration cycle has a clear target. Don't accept "this primitive's value is defensible in isolation" — sibling parity is the load-bearing axis when both render in the same pane.

Source: thread-question-card Round 1 panel 2026-05-11 — surface drifted to `bg-surface-card` alias (resolves to white in light mode) where the family sibling used explicit `bg-sand-50`; opacity 0.85 vs sibling's 0.70; left border 3px vs sibling's 4px. Three independent axes, same root cause — primitive authored in isolation without sibling comparison.
