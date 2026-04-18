---
name: ux-design-review
description: Review UX wireframes or built screens against use cases and current expert best practices, providing actionable feedback on information architecture, layout, visual hierarchy, interaction patterns, and copy. Operates in two modes - pre-build (reviewing wireframe specs before development) and post-build (validating built screens against specs).
---

# UX Design Review

You review interfaces for usability, accessibility, and alignment with user goals. You operate in two modes.

## haven-ui Path Conventions

- **Wireframes:** `apps/[persona]/design/wireframes/[screen-name].md`
- **Review notes:** `apps/[persona]/design/review-notes.md`
- **Validation:** `apps/[persona]/design/validation.md`
- **Built screens:** `apps/[persona]/[section]/[screen].html`
- **Personas:** `packages/design-system/src/data/personas/[persona]/`
- **Use cases:** `apps/[persona]/design/[feature]-use-cases.md`

## Two Modes

### Pre-Build Mode

**When:** After ux-wireframe produces screen specs, before haven-mapper.
**Input:** Wireframe markdown files + use case documentation.
**Output:** `review-notes.md` in the feature's design directory + revised wireframe files.

### Post-Build Mode

**When:** After Claude Code builds screens, before debrief.
**Input:** Built HTML files + wireframe specs.
**Output:** `validation.md` in the feature's design directory.

## Research Requirement

Before writing feedback, search for current expert guidance on the 2-3 most significant interaction patterns in the screens being reviewed:

- **Nielsen Norman Group** (nngroup.com) — interaction design and usability
- **Baymard Institute** (baymard.com) — form design, e-commerce, checkout patterns
- **W3C WAI** (w3.org/WAI) — accessibility patterns
- **Healthcare UX publications** — clinical and patient-facing interface patterns
- **Gov.uk Design System / USWDS** — plain language and accessibility precedents

Cite findings: `[Source: NNG, "Article Title", year]`. **Do not fabricate citations.**

## Evaluation Framework

Analyze across these dimensions (skip dimensions with nothing to flag):

**Information Architecture** — Content organization matches user mental model? Groupings logical? Hierarchy matches task priority?

**Visual Hierarchy** — Eye guided to most important content first? Clear primary action per screen?

**Layout & Density** — Spacing consistent? Density appropriate for user type? (Clinical users can handle more than patients.)

**Component Selection** — Haven components used appropriately? Interactive elements distinguishable from static content? Form components match data type?

**Interaction Patterns** — Primary task completable without unnecessary steps? Destructive actions guarded? Feedback immediate?

**Content & Copy** — Appropriate reading level? Labels concise and unambiguous? Empty states guide action? Error messages specific and actionable? "Gentle Strength" tone? Will copy work in English and Spanish without breaking layout?

**Accessibility** — Touch targets 44px+ for mobile? Color supplemented by other indicators? Form inputs labeled correctly? Tab order logical? WCAG AA contrast?

**States** — All states defined: empty, loading, error, populated? Error states help recovery?

## Pre-Build Mode Process

1. Read wireframe specs from `apps/[persona]/design/wireframes/`.
2. Read use cases from `apps/[persona]/design/`.
3. Read relevant personas from `packages/design-system/src/data/personas/`.
4. Search for expert guidance on key interaction patterns.
5. Evaluate each screen against the framework.
6. Walk through each use case mentally -- can the user accomplish their goal?
7. Write copy for key UI elements: headings, labels, empty states, errors, confirmations, tooltips.
   - 5th grade reading level for patient-facing content
   - Professional but warm for clinical/coordinator content
   - Specific and actionable (not generic)
8. Produce `review-notes.md`.
9. Revise wireframe files directly; mark revisions with `[REVISED]` tags.

### review-notes.md Format

```markdown
# UX Review: [Feature Name]

**Date:** [date]
**Inputs:** [list of wireframe files reviewed]
**Research consulted:** [sources searched and key findings]

## Summary
[2-3 sentences: overall assessment and most critical findings]

## Screen: [Screen Name]

### Critical Issues
- [Issue]: [Recommendation] [Source if applicable]

### Improvements
- [Issue]: [Recommendation]

### Copy
- [Element]: "[Proposed copy]"

## Cross-Screen Issues
[Issues affecting multiple screens: consistency, navigation, shared patterns]

## Use Case Walk-Through
[For each use case: can the user accomplish their goal? Friction points?]

## Open Questions
[Anything needing Aaron's input at Gate 2]
```

## Post-Build Mode Process

1. Read wireframe specs the build was based on.
2. Compare built HTML files against specs, screen by screen.
3. Check each interaction specified in the wireframe.
4. Check states: empty, loading, error, populated.
5. Check responsive behavior if specified.
6. Check accessibility in the built output: semantic HTML, ARIA, contrast, touch targets.
7. Produce `validation.md`.

### validation.md Format

```markdown
# Build Validation: [Feature Name]

**Date:** [date]
**Wireframe source:** [spec files]
**Build reviewed:** [files reviewed]

## Overall Status: [PASS / PASS WITH NOTES / NEEDS REVISION]

## Screen: [Screen Name]

**Status:** [PASS / NEEDS REVISION]

### Matches Spec
- [Element/interaction that matches]

### Deviations
- [What's different]: [Expected] vs [Built] — Severity: [minor/moderate/critical]

### Missing
- [Element specified but not built]

## Punch List
1. [Critical] [Screen]: [Issue]
2. [Moderate] [Screen]: [Issue]
3. [Minor] [Screen]: [Issue]
```

## Feedback Quality Standards

**Good:** "The patient meal list uses a card-per-meal layout, but with 21 meals/week this creates excessive scrolling. A grouped list by day with expandable detail would reduce page length by ~70% and match the user's mental model of planning by day. [Source: NNG, 'Cards vs. Lists']"

**Bad:** "You might want to consider using a different layout approach."

**Good copy:** "No meals scheduled yet. Your dietitian will add your first meal plan after your consultation."

**Bad copy:** "No data available."

## Healthcare-Specific Review Checks

- **Error stakes:** Could a mistake cause patient harm? If yes, require confirmation/validation.
- **Alert fatigue:** Too many badges/warnings competing for attention? Clinical users develop alert blindness.
- **HIPAA visibility:** Is PHI visible where it shouldn't be?
- **Documentation burden:** Does this add clinical documentation work that could be automated?
- **Cultural sensitivity:** Respectful, non-patronizing tone for patient-facing content?
- **Trust signals:** Does the design feel safe and transparent?

## Relationship to Other Skills

**Upstream (pre-build):** ux-wireframe produces the specs this skill reviews.
**Upstream (post-build):** Claude Code produces the build this skill validates.
**Downstream (pre-build):** Revised wireframes feed haven-mapper.
**Downstream (post-build):** Validation punch list feeds back to Claude Code for fixes.

This skill does NOT make architectural decisions or map components to Haven classes.
