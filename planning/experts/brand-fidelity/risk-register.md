# Risk Register

## Common failure modes

### 1. Passing token-discipline but failing brand expression

**Risk:** A slice uses every correct token but still doesn't feel like Haven because the hierarchy, density, or voice is off.

**Mitigation:** Brand-fidelity review scores dimensions 1–5, not just token adoption. Dimension 2 (visual hierarchy) and dimension 1 (voice) catch this.

**Severity:** High — this is the root cause that created this expert.

### 2. Figma mock and DESIGN.md disagree

**Risk:** The reviewer cites Figma, but Figma is outdated relative to a DESIGN.md decision Aaron made in conversation.

**Mitigation:** DESIGN.md wins. Flag the Figma gap in the review's DESIGN.md delta proposal. Do not score slices against stale Figma frames.

**Severity:** Medium.

### 3. Generic "make it more Haven" feedback

**Risk:** Review returns vague findings that don't actionably improve the slice.

**Mitigation:** output-contract.md requires every finding to have file/line/Figma-frame attribution. Reviewer prompts should reject findings lacking specificity.

**Severity:** High — renders the review useless.

### 4. Overshoot — scoring becomes a gate that blocks substance

**Risk:** Reviewer blocks slices on cosmetic points while substantive logic ships broken.

**Mitigation:** Ship threshold is 7/10, not 10/10. Iterate is the default for 7–8 scores. Calibration retro every 5 slices catches drift.

**Severity:** Medium.

### 5. Retrofit scope creep

**Risk:** Reviewing a retrofit slice, the reviewer flags issues that were inherited from pre-DESIGN.md and aren't in the retrofit diff.

**Mitigation:** judgment-framework.md rule: score retrofits on the diff, not the inherited state. Original issues go to a separate backlog.

**Severity:** Medium.

### 6. Ava-in-nav regression

**Risk:** A slice puts Ava's avatar in the nav header because an outdated mock showed it there.

**Mitigation:** DESIGN.md §Logo is explicit ("Cena Health logo only"). Ava-in-nav is an automatic dimension-5 zero, with required-change = restore Cena logo.

**Severity:** Medium — happens once per reviewer, then corrected.

### 7. Primary teal leakage

**Risk:** Teal starts appearing on advancement buttons, nav-item hovers, informational CTAs.

**Mitigation:** Dimension 4 is scored on every review. Every teal instance gets audited against the "commits-that-change-state" rule.

**Severity:** High — dilutes the brand's most important color signal.

### 8. Dimension 5 substitution confusion

**Risk:** When chat isn't in scope, reviewer forgets to substitute dimension 5 with the stone-surface-palette check, producing a 4-dimension (out of 8) score.

**Mitigation:** judgment-framework.md is explicit about the substitution. Scorecard template always shows 5 dimensions.

**Severity:** Low — template-level fix.

### 9. DESIGN.md itself drifts from Aaron's taste

**Risk:** DESIGN.md rules encode past decisions that Aaron has since moved on from.

**Mitigation:** Aaron has the final taste call. Any review where Aaron's gut disagrees with the scorecard is a calibration signal — surface it to Aaron, expect DESIGN.md update.

**Severity:** High — expert is only as good as its spec.

### 10. Expert becomes a slow blocker in slice velocity

**Risk:** Adding a 4th reviewer slows per-slice QA past acceptable velocity.

**Mitigation:** Reviews run in parallel with other reviewers when possible. Light-tier model for routine reviews (see task-routing.md).

**Severity:** Medium — watch retro-log for velocity complaints.
