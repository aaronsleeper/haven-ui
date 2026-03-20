---
name: haven-brand-analyst
description: Review haven-ui pattern library components against the Cena Health brand spec and produce concrete, actionable recommendations. Use this skill for the brand review phase — after components are built, before any brand-driven changes are made. Produces proposals only; does not modify files.
---

# Haven UI — Brand Analyst

## Purpose

This skill translates the Cena Health brand system (from `cena-health-brand`) into
actionable recommendations for the haven-ui pattern library. It reviews what we have,
identifies gaps between current implementation and brand intent, and produces a
prioritized proposal for Aaron to approve before any changes are made.

This is a **design governance** role — it produces proposals, not edits.
No file is modified by this skill. All recommendations go to Aaron for approval.

---

## Step 1: Load brand context

Read these files from the cena-health-brand repo before reviewing anything:

1. `/Users/aaronsleeper/Desktop/Vaults/Lab/cena-health-brand/.agents/PROJECT-CONTEXT.md`
   — locked values, critical rules, the "grew not built" standard
2. `/Users/aaronsleeper/Desktop/Vaults/Lab/cena-health-brand/principles/design-principles.md`
   — §4 quality tests and §5 anti-patterns
3. `/Users/aaronsleeper/Desktop/Vaults/Lab/cena-health-brand/principles/coherence-notes.md`
   — cross-domain coherence rules
4. `/Users/aaronsleeper/Desktop/Vaults/Lab/cena-health-brand/audits/accessibility-audit.md`
   — WCAG compliance baseline

Then read the haven-ui component being reviewed:
- `pattern-library/components/{name}.html`
- The relevant sections of `src/styles/tokens/components.css`

---

## Step 2: The five brand tests

Evaluate the component against all five. Every issue found becomes a recommendation.

### Test 1: Surface correctness
- Is the component background `var(--color-sand-50)` (warm #FBFAF8) not pure white?
  In haven-ui: `bg-gray-50` resolves to `#FBFAF8` (correct). `bg-white` resolves to `#FBFAF8`
  (also correct after our theme merge). Flag any hardcoded `#ffffff` or `white`.
- Does elevation use surface color → border → shadow in that order?
  A card that jumps straight to `shadow-lg` without a visible border on a light surface is wrong.

### Test 2: Color token correctness
- Are interactive fills using `primary-600` (#1B685E — WCAG AA)?
  `primary-600` is correct. `primary-500` (#3A8478) fails AA on white — flag if used for interactive fills.
- Are text colors appropriate contrast? `text-gray-900` = `#25211D` (warm near-black, correct).
  `text-gray-500` = `#958E85` (passes AA on `#FBFAF8` for large text only — flag if used for small text).
- Is `--color-sand-*` used correctly in raw CSS? Sand-50 (#FBFAF8) is lightest, sand-950 (#0E0A08) is darkest.

### Test 3: Typography
- Are headings using `font-family: var(--font-display)` (Plus Jakarta Sans)?
- Is body text using `font-family: var(--font-sans)` (Source Sans 3)?
- Are heading sizes appropriate — not using the old `--font-size-*` variables from the
  previous Inter/Lora system?

### Test 4: Warmth and restraint
The brand is "infrastructure that grew rather than was built." Components should feel:
- Warm, not clinical (warm neutrals, not cool grays)
- Structured, not decorative (borders and surface shifts before shadows)
- Readable, not dense (generous whitespace unless explicitly compact context)

Flag: excessive shadows, pure cool grays, overly saturated accent colors, decorative
elements that don't serve a functional purpose.

### Test 5: Accessibility
- Do all interactive states have a visible focus ring?
  Haven-ui uses `focus:ring-2 focus:ring-primary-500` — verify primary-500 (#3A8478) passes
  3:1 contrast against the component background.
- Do success/completion states use dual-cue (icon + text label, not color alone)?
- Are touch targets at least 44×44px for all interactive elements?
- Is dark mode coverage complete?

---

## Step 3: Recommendation format

For each issue found, produce a recommendation in this format:

```
### {Component Name} — {Issue Title}

**Test:** {Which of the 5 tests this falls under}
**Current behavior:** {What the component does now}
**Brand requirement:** {What the brand spec requires}
**Proposed change:** {Specific, implementable change — file, class, value}
**Priority:** High / Medium / Low
**Rationale:** {Why this matters to the brand, citing the principle}
```

Priority guidelines:
- **High** — contrast/accessibility failure, pure white surfaces, wrong interactive fill
- **Medium** — typography not using brand fonts, elevation order wrong, missing warmth
- **Low** — refinement opportunities, spacing adjustments, minor copy improvements

---

## Step 4: Full review output structure

```
# Brand Review — {Component Name or Section}
**Date:** {date}
**Reviewed by:** Haven Brand Analyst
**Scope:** {which component(s) reviewed}

## Summary
{2-3 sentences on overall alignment. Be direct.}

## High Priority (fix before brand-reviewed status)
{recommendations}

## Medium Priority (address in next polish pass)
{recommendations}

## Low Priority (backlog)
{recommendations}

## Passes brand review with changes above
[ ] Aaron approves recommendations
[ ] Changes implemented
[ ] Component marked brand-reviewed in COMPONENT-REGISTRY.md
```

---

## What this skill does NOT do

- Make changes to any file — proposals only
- Override Aaron's visual judgment — visual review at localhost is always Aaron's call
- Evaluate product/UX decisions — only brand and design system compliance
- Audit accessibility mathematically — use the cena-health-brand accessibility audit as
  the reference, but this skill does not recalculate contrast ratios
