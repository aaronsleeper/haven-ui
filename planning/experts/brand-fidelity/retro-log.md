# Retro Log

Append-only log of brand-fidelity reviews, calibration observations, and DESIGN.md deltas surfaced through reviews.

## 2026-04-21 — Patch 14 — text-xs scale leak + white-surface name gap (item 8b CI follow-up)

**Trigger:** Item 8b CI first-run surfaced 3 real leaks local dev conform:token had been hiding. Parallel consult with Token Steward on naming + placement of the response-option bg-white fix; I owned the surface-archetype + voice call, Token Steward owned the token vocabulary.

**Verdict:** ship — Path B pattern for text-xs leaks (swap utility for Haven token on the rule itself) + Path (a) for bg-white (declare Haven-named token for white, close palette gap). Score 9/10 — D2 (surface hierarchy) preserved, D3 (type expression) lifts to 2/2 for the 3 previously-leaked rules, D4 (teal discipline) unchanged, D5 (sand substitution) correct.

**Observations:**
- **Three text-xs leaks resolved in scope:** `.queue-item-summary` → `var(--text-body-04)` (dense body 11.11px), `.queue-item-meta` → `var(--text-utility-timestamp)` (semantically timestamp-adjacent, 11.11px), `.queue-section-header` → `var(--text-utility-overline)` (UPPERCASE + letter-spacing semantic match, 11.11px). All three move from Tailwind's inlined 12px to Haven's major-third 11.11 stop. Sub-pixel hinted shift (-0.89px, ~7%); noticeable side-by-side but not disruptive in isolation.
- **`.response-option bg-white` resolved via token naming, not visual change.** Stark-white option surface is correct per DESIGN.md §Surface line 243 ("Cards: solid white on sand, or sand-100 for grouped rows"). The leak was that `bg-white` rode on Tailwind's `--color-white` default rather than a Haven-named token. Token Steward N2-adjusted path: rename current `--color-surface-card` (sand-100, misnamed per DESIGN.md as it's actually the "grouped rows" variant) → `--color-surface-card-grouped`; add new `--color-surface-card: #ffffff` matching DESIGN.md primary-card intent. Zero existing consumers of old name (verified grep) — no migration cost.
- **Why not sand-50 bg (Brand-rejected Path c):** Would collapse the option surface INTO the page background (sand-50 on sand-50 with only a 1px border = visually flat), lose the "pickable pop" that distinguishes unselected options, and misalign with the hover→select progression (pale baseline → pale-sand hover → teal-bordered selection). The rhythm of the pick state needs a stark baseline.
- **Why not universal-exempt white (Brand-rejected Path b):** Exempting `rgb(255, 255, 255)` would treat white as non-color (like transparent/inherit), throwing away the ability to distinguish "legitimate Haven white surface" from "Tailwind bleed." Same pattern class as Patch 13 Path C (introduce off-scale Haven token) — rejected then for breaking the scale's declarative claim; rejected now for weakening the palette-completeness invariant.
- **Scope discipline:** 3 other `@apply bg-white` card-role surfaces exist in components.css (lines 4444, 4494, 8324) — Token Steward flagged them as sibling leaks missing `@surface-role: card` annotation. Explicitly scoped OUT of Patch 14. They'll join a follow-up slice that combines with the proposed `conform:surface-semantic` gate surfacing every bare `bg-*` on registered components. Matches the `feedback_close_debt_before_advancing.md` pattern — fix the triggering leak cleanly, park the full-system sweep as its own slice.

**Calibration updates:**
- **DESIGN.md §Surface line 243 is authoritative on card-variant hierarchy.** Primary = solid white on sand; secondary = sand-100 for grouped rows. Any semantic-layer token named `--color-surface-card` must point at the primary variant; the secondary gets a hyphenated qualifier. Standing rule: when DESIGN.md orders variants with "X, or Y for grouped" phrasing, X is base-token, Y is `-grouped` suffix. Same pattern applies to other surfaces — check for latent drift in `--color-surface-pane` (currently translucent-only; DESIGN.md may support solid variants for elevated contexts).
- **"Option surfaces" are card-role, not their own archetype.** Token Steward N3 option `--color-surface-option` was rejected — assessment response-options are card-archetype surfaces; Haven's surface-role vocabulary (page/pane/card/raised) already covers them. Calibration: resist inventing archetype-specific surface names when an existing role matches. Semantic-layer tokens reflect DESIGN.md archetypes, not per-component placement.
- **Twice-observed pattern worth naming:** "Silent Tailwind-default leak surfaces on CI that local dev hides." Patch 13 surfaced `text-sm` = 14px as a font-size leak; Patch 14 surfaces `text-xs` = 12px + `bg-white` = Tailwind's `--color-white` as leaks. Pattern class: Tailwind utility classes whose default values are NOT on Haven's declared scale. Standing rule: CI-side conform:token verdicts override local dev verdicts; local passes are a sanity check, not green signal.

**Changes to this expert:**
- Add to `judgment-framework.md` (future edit): "On every slice review, grep `components.css` for Tailwind size-utility classes (`text-xs`, `text-sm`, `text-lg`, `text-xl`, `text-base`) AND Tailwind color-utility classes whose defaults (`bg-white`, `bg-black`, `bg-gray-*`, `text-gray-*`) aren't declared in Haven's palette. Each occurrence is a suspected default leak until DESIGN.md authorizes."
- Add to `domain-knowledge.md` (future edit): "Card variants per DESIGN.md §Surface line 243 — primary is solid white (`--color-surface-card: #ffffff`), secondary is sand-100 (`--color-surface-card-grouped: sand-100`). Any future `bg-white` in components.css that's card-role should migrate to `bg-surface-card`; any `bg-sand-100` that's card-role should migrate to `bg-surface-card-grouped`."

**Follow-ups (out of Patch 14 scope):**
- `bg-white` card-role leaks at components.css:4444, 4494, 8324 — need `@surface-role: card` annotation + migration to `bg-surface-card`. Group with proposed `conform:surface-semantic` gate (Token Steward follow-up).
- 17 `bg-white` references in pattern-library HTML — same class of leak, broader audit scope.
- `bg-white/20`, `bg-white/80`, `bg-white/10` translucent overlays (components.css:2581, 4331, 6498, 6502) — semantically distinct from stark card surfaces; need their own translucent-scrim token or stay as alpha-modified utilities. Separate analysis.
- Ambient observation: `.queue-section-header` preserved `tracking-wide` (Tailwind 0.025em) alongside the new `--text-utility-overline` font-size. Overline's declared letter-spacing is 0.002em (much tighter). Mixed-family — correct for gate scope (closing font-size leak only) but worth a later Brand pass on whether section-header should adopt the overline letter-spacing too.

## 2026-04-21 — Generic button font-size Tailwind-default leak (Patch 13; slice-1 debt item 3b)

**Trigger:** Slice-1 debt item 3b — `conform:token` gate reports `.queue-item fontSize 14px` unregistered. Root cause at Patch 7: generic `button, [type=...], a.btn-*` rule in `components.css:382` applied `@apply text-sm` (Tailwind default 0.875rem = 14px), which doesn't live on Haven's major-third scale (11.11 / 13.33 / 16 / ...). Parallel consult with Token Steward.

**Verdict:** ship — Path B with `var(--text-button-medium)` (13.33px). Scored 9/10. Typography-expression dimension (D3) currently 1/2 system-wide because of the leak; patch lifts to 2/2.

**Observations:**
- Three candidate paths surfaced (A: override `.queue-item` only; B: fix generic button rule; C: introduce 14px Haven token). Token Steward + Brand Fidelity converged on B.
- Path C rejected by construction: `13.33 × 1.25 = 16.66`, not 14 — admitting 14px as a Haven token breaks the major-third invariant. Haven scale is a declarative claim about which sizes exist; accepting off-ratio stops to accommodate a legacy Tailwind bleed would make the scale a descriptive accident.
- Path A rejected as debt-shaped: generic rule still bleeds 14px to every other button; next pilot component rendering as `<button>` re-hits the same gate failure.
- Path B chosen with `--text-button-medium` (13.33px) NOT `--text-button-large` (16px). 13.33 preserves Haven's intentional button density; 16 would pull buttons into the "loud" register, wrong for Haven's restrained voice where weight comes from Lora headings + primary-teal discipline, not button labels.
- Brand Fidelity amendment landed: `.queue-item-name` at line 7454 also used `text-sm`. Retargeted to `var(--text-body-03)` (same 13.33px but semantically correct — queue-item names are dense body text, not button labels, even though the host element is `<button>`).
- Patch scope: `components.css:382` (generic button rule) + `components.css:7454` (`.queue-item-name`). Two CSS edits.

**Calibration updates:**
- **Silent Tailwind-default leaks are twice-observed now** — this case (`text-sm` on generic button rule) and the prior latent `--font-sans` cascade bug (typography.css header note). Pattern: Tailwind 4 inlines utility-class values rather than emitting `--token-name` custom properties at `:root`, so runtime-scan gates miss them. Standing rule for Brand Fidelity reviews: grep for Tailwind size-utility classes (`text-sm`, `text-xs`, `text-lg`, etc.) in `components.css` on every slice review; each occurrence is a suspected leak until DESIGN.md explicitly authorizes.
- **"Dense body vs button label" framing**: when a host element is a `<button>` but the visible text is semantically dense body (list row name, table cell, compact identifier), prefer `--text-body-*` tokens over `--text-button-*`. The token expresses intent, not markup.
- Brand voice principle reaffirmed: buttons are not where visual weight comes from in Haven. Weight comes from primary-teal commits, from Lora in headings, from surface hierarchy. Button labels stay crisp and precise.

**Changes to this expert:**
- Add to `judgment-framework.md` (future edit): "On every slice review, grep `components.css` for Tailwind size-utility classes (`text-sm`, `text-xs`, `text-lg`, etc.). Each occurrence is a suspected default leak. Haven tokens exist for every register; utility classes bleed Tailwind defaults off-scale."
- Add to `domain-knowledge.md`: "Button host + dense-body text" pattern — prefer `--text-body-*` over `--text-button-*` when the text semantically belongs to body, not label hierarchy.

**Follow-ups:**
- `.queue-item-summary` + `.queue-item-meta` (components.css:7458, 7463) use `text-xs` (12px, off-scale). Closest Haven tokens: `--text-body-04` (11.11px) or `--text-utility-timestamp` (11.11px). Scope-separate slice — not patch 13.
- Full-system audit: ~100+ `text-sm` references in `components.css`, most in body-text classes that independently declare their own size. Separate retrofit slice.
- Verification pass on pattern-library pages (btn-primary, btn-outline, btn-danger, tag-selector, hs-dropdown-toggle, queue-item, response-option) recommended after Aaron browser-reviews the shift.

## 2026-04-20 — State-indicator contrast calls (Patch 8; slice-1 debt item 4)

**Trigger:** Contrast-pair gate caught 2 pilot-scope state indicators failing WCAG 1.4.11 3:1 beyond the 2 known-failure progress-bar pairs. Token Steward + A11y requested a Brand Fidelity call before shipping.

**Observations:**
- The two cases: `.queue-item.active` solo-bg `primary-50` (1.12:1) and `.response-option:hover` solo-bg `sand-50` (1.05:1). Both are pale tints intentional to Haven's "soft stone pages" voice. Path A (bump fill to first passing tier — primary-500 / sand-500) would turn *selection* and *hover* into loud fills, violating the brand-taste rule "primary teal reserved for commits; chrome is minimal." Path B (preserve fill, add edge carrying 3:1 contrast) is the brand-correct answer.
- Decision 1 — `.queue-item.active`: ship Path B with `box-shadow: inset -3px 0 0 0 var(--color-accent-interactive)` on the RIGHT edge (per UX Design Lead's amendment — left edge already carries urgency tier; four-channel separation preserves visual vocabulary).
- Decision 2 — `.response-option:hover`: ship Path B with `border-color: var(--color-sand-500)` on the existing 1px border. Fill stays pale sand-50 ("considering"); border darkens to sand-500 ("pointing at this"); selected state (`aria-checked="true"`) still owns teal border ("committed"). Each state distinguishable without fill-weight escalation.
- Aaron's "passing barely is passing" principle applies to the edge contrast, not the fill. The fill carries voice; the edge carries compliance.
- `brand-taste-override` exemption was proposed for the contrast-pair gate but rejected by A11y — DESIGN.md does not authorize brand-taste relaxations of WCAG. Brand Fidelity concurred.

**Calibration updates:**
- **Standing rule**: when a state-indicator color fails 3:1 on a pale-fill pattern, default to "preserve fill, move WCAG to edge" before considering tier-bump. Applies to active/hover/focus/checked states across the design system.
- Primary teal (`--color-accent-interactive` = teal-600) is load-bearing as the "selected/committed" signal — using it for active-state edges is legal under the teal-discipline rule because selection-of-record is a commit (the coordinator has committed attention). Added to judgment-framework as explicit exception to "teal reserved for commits."
- The `.queue-item.is-attention` (amber-400 = 2.23:1) and `.is-info` (sand-200 = 1.45:1) urgency tiers got token-level bumps to amber-500 / sand-500. These tiers are informational (only carrier of urgency at row level; section headers don't descend into per-row state), so Path B (preserve-fill-add-edge) didn't apply — the border IS the informational surface. Tier-bump was correct.

**Changes to this expert:**
- Add to `judgment-framework.md` (future edit): "State indicators failing WCAG 1.4.11 — default to preserve-fill-add-edge before tier-bumping the fill. Use `accent-interactive` for active / `sand-500` for hover on pale-fill components."
- Add to `domain-knowledge.md`: note that primary teal on active-state edges does not violate teal-discipline when the state IS a commit (selection, submission, confirmation).

**Open questions:**
- **Primary teal on active-row edge in multi-row contexts**: when 20+ queue items are visible simultaneously and one is active, does the right-edge teal stripe read loudly as "global urgency signal" rather than "local selection"? Browser review pending from Aaron. Adjust edge width / fill tint pairing if the visual weight skews.

## 2026-04-18 — Expert created

Brand-fidelity expert initialized following the design-system-completeness pivot. Slices 1 and 2 (shipped pre-DESIGN.md) are the first retrofit targets. No reviews run yet.

**Baseline expectation:** first 3–5 retrofit reviews will score 3–5 out of 10 before DESIGN.md rules are applied. Calibration data will come from the retrofit diff scores, not the original scores.

---

## Template for future entries

```
## YYYY-MM-DD — <slice name> review

**Verdict:** ship / iterate / block
**Score:** X/10 (D1: n, D2: n, D3: n, D4: n, D5: n)
**Reviewer model tier:** standard / deep

### Top findings
- ...

### DESIGN.md delta surfaced
- Section, proposed text, status

### Calibration note
- Did Aaron's post-ship reaction match the scorecard? If no, what was off?

### Follow-ups
- Retrofit scope, token adds, new archetypes, etc.
```
