# SoP authoring guide

How to write a new Cena SoP in markdown source-of-truth form, using the haven directive vocabulary.

This guide is the **operator-facing companion** to two other docs:

- [`sop-review-and-approval.md`](sop-review-and-approval.md) — what happens to an SoP after it's drafted (review, approval, publication). Read it first to understand the lifecycle you're authoring into.
- [`Lab/cena-health-brand/specs/haven-directive-styling.md`](../../../../cena-health-brand/specs/haven-directive-styling.md) — why each directive looks the way it does in the docx surface. Reference when judging which directive fits a piece of content.

## Where SoP source files live

- One file per SoP: `tools/surface-emit/content-sot/sops/<slug>.md`
- Slug convention: kebab-case, role or process name (`care-coordinator.md`, `enrollment-onboarding.md`, `sop-review-and-approval.md`)
- Existing SoPs in this folder are the canonical examples — when in doubt, copy from one and modify

## Frontmatter

Every SoP starts with YAML frontmatter:

```yaml
---
title: <Document title — sentence case, no "SOP" or version suffix>
role: <Role this SoP serves — Care Coordinator | Registered Dietitian | Program Administrator>
  # OR for cross-role process SoPs:
roles: [Care Coordinator, Registered Dietitian]
type: Standard Operating Procedure
version: "0.1 (draft)"   # bump on each approved version
status: draft            # draft | approved
reviewed: 2026-05        # last reviewed date — YYYY-MM
accountable: Director of Clinical Operations
slug: <matches the filename without .md>
---
```

Use `role:` for single-role SoPs and `roles:` (array) for multi-role process SoPs. Everything else is fixed.

## The standard six-section structure

Every SoP uses the same scaffold. The structure exists so reviewers can build a mental model that survives across SoPs; deviate only when you have a real reason.

The names below are **internal section names** — the authoring vocabulary the team uses to organize itself. **Never ship these names directly as reader-facing headings.** Each SoP rewrites the heading to name the reader's payoff in their context — see "Heading labels" below.

1. **Title block + masthead** — H1 + a paragraph naming role / type / version / review date
2. **Scope section** — what this SoP covers and where its boundaries are (always a 3-row table: For / Covers / Does not cover)
3. **Procedure section** — numbered list of action-prose-result steps in order
4. **Decision branches and/or escalation** — `:::decision-branch` for routing forks, `:::callout-warning/error/success` for severity flags, `:::escalation` for "what to do when something already broke"
5. **Quick-reference section** — `:::card-title` header followed by a tickable checklist
6. **Glossary section** — `:::glossary-term` / `:::glossary-def` pairs
7. **Sign-off section** — `:::attestation` followed by `:::attestation-gate` entries; honest about which gates are pending

(Yes that's seven — the masthead and Scope section are usually treated as one block by readers, hence "six." Count by visual sections, not by HTML structure.)

## Heading labels — the scaffolding-leak rule

The most common SoP failure mode is shipping internal section names as reader-facing headings. The team calls section 2 the "Scope section"; the reader sees `## Scope` and reads it as the team's bucket label, not a question they had. The fix: **every section gets a reader-facing heading that names what the reader will get, not what the team called the bucket.**

Origin: 2026-05-31 Content Design D3 pass on the first 4 staff SoPs flagged `## Scope`, `## Quick reference`, `## Terms used in this SOP`, and `## Sign-off` as the canonical scaffolding-leak catch across all 4 SoPs — same shape as the CAA "Key messages" catch (where a per-module IA template slot label shipped as the rendered page heading). Fixed at this layer (the contract) so every future SoP inherits the discipline.

### Don't ship these names as headings

- `## Scope`
- `## The procedure` (or `## The weekly routine`, `## Recurring administration tasks` etc. when those name the team's bucket more than the reader's job)
- `## Decision branches`, `## Escalation flags`
- `## Quick reference`
- `## Terms used in this SoP`
- `## Sign-off`

### Heading patterns that work

Lead with the reader's job, the answer-shape, or the decision; not the artifact-type.

- **Scope section** — `## Who this is for and what it covers` · `## Is this the right procedure for you` · `## What you do, and what you don't`
- **Procedure section** — name the start-state → end-state arc, verb-led: `## From referral to enrolled` · `## Each counseling session` · `## Each week, for every participant`
- **Decision-branch sections** — name **what to do + when + the deciding factor**, not the topic: `## Access requests — give only when training is current` (not `## When someone needs access`) · `## Two consent layers — verify both before the care plan begins` (not `## How consent arrives`) · `## Two routing decisions — modality and where data lives` (not `## Where things go`)
- **Escalation sections** — front-load the stakes: `## Escalation — when to involve the clinical team` · `## Red, yellow, green — what each means and what to do`
- **Quick-reference section** — promote the inner `card-title` to the section heading (drop the outer "Quick reference" label entirely): `## For every new referral — the 7-day checklist` · `## Keep current — the standing checks` · `## Each week, for every participant — the routine checklist` · `## Every counseling session — the checklist`
- **Glossary section** — `## Terms used here` or `## Glossary`. Drop "in this SoP" — the reader knows they're in a thing
- **Sign-off section** — `## Approval status` · `## Not yet approved — gates remaining`

### Scent test for every heading

Before shipping a section heading, ask: would the target reader, scanning, know why to stop here and what they'll get?

- Heading names the team's artifact-type or template slot → rewrite for the reader's payoff
- Heading names the topic without an answer-shape (e.g., "Where things go") → rewrite to name **what to do + when + the deciding factor**
- A sub-heading or `card-title` underneath is doing better scent work → promote it; drop the outer label

### Where this rule comes from

This rule is the contract-level fix from the [generative-determinism](../../../../../.claude/rules/generative-determinism.md) discipline applied to SoP emission: the **pipeline contract** (this AUTHORING.md + the [Clinical Staff SOP entity doc](../../../../../Knowledge/Areas/Meta/Entities/workflows/clinical-staff-sop.md)) names internal authoring vocabulary; **per-SoP instances** rewrite for the reader. Fixing it at the contract layer propagates to every future SoP this pipeline emits.

## Directive vocabulary

The 13 directives that author SoP content. Use them; don't invent new ones without updating the brand spec.

### Block-level (paragraph styles)

| Directive | Semantic intent | When to use |
|---|---|---|
| `:::callout-info` | Informational note, lowest severity | Context the reader benefits from but doesn't need to act on |
| `:::callout-warning` | Pay-attention note | Draft banner, "do this with care," gentle flag |
| `:::callout-success` | Affirmative state | "On track," "green flag," confirmation of correct path |
| `:::callout-error` | Critical risk | "Stop and do X," safety-adjacent alerts |
| `:::card` | Quiet structural container | Use sparingly — most content speaks for itself |
| `:::card-title` | Title for a card-wrapped section | Pair with checklist for the Quick Reference section |
| `:::card-body` | Body within a card | Rarely needed — only when you want sand-50 shading on a block |
| `:::attestation` | Sign-off block header | Once per SoP, in the Sign-off section |
| `:::attestation-gate` | One sign-off gate line | One per gate (clinical / operational / accountable) |
| `:::escalation` | Routing rule with safety weight | "When something already broke, do X" — distinct from `callout-warning` (forward-looking caution) and `callout-error` (critical risk) |
| `:::decision-branch` | Multi-row "if A → X; if B → Y" fork | Multiple rows in one block, separated by blank lines, each row of shape `**condition** — outcome.` |
| `:::glossary-term` | A term being defined | Pair with `glossary-def` directly below |
| `:::glossary-def` | The definition of the term above | One per term; indent in docx provides the printed-reference register |

### Inline (character style)

| Directive | Semantic intent | When to use |
|---|---|---|
| `[text]{.screen-ref}` | Inline reference to a screen, app path, or system location | "In [Care-coordinator app → Roster]{.screen-ref}, ..." — wayfinding inside the platform |

The screen-ref uses Pandoc's bracketed-span syntax, not the `:::` block syntax. This is intentional — see the inline-directive note in [`~/.claude/plans/haven-markdown-sot-directives.md`](~/.claude/plans/haven-markdown-sot-directives.md) under "Tracked concerns" for the dual-renderer context.

## Per-SoP restraint caps

The brand spec leaves restraint to authoring discipline (the styling can't enforce it). Aim for these per-SoP caps, deviating only when the content genuinely demands more:

- **At most 1** `:::callout-error` (a second critical-risk callout means there's an unhandled hazard pattern)
- **At most 1** `:::escalation` block (a second one usually means two distinct escalations that should be in separate SoPs, or the escalation belongs in a callout)
- **At most 2** `:::callout-warning` blocks (a draft banner + one yellow flag is typical)
- **At most 3** `:::decision-branch` blocks (more usually means a flowchart, not an SoP)
- **At most 2 callouts of any one severity** (info / warning / success / error)
- **Glossary should have 5–7 entries** (fewer and it's not earning the section; more and it's a glossary doc, not an SoP glossary)

If you find yourself exceeding these caps, ask whether the SoP is doing too much — most over-cap SoPs decompose cleanly into two.

## Sign-off block — gate vocabulary

Use these gates verbatim. The role names match the accountability model.

- **Clinically accurate** — clinical lead
- **Operationally true** — Vanessa Sena
- **Signed off** — Director of Clinical Ops
- **Scope confirmed** — Vanessa Sena (use when the SoP scope itself is still being settled; otherwise omit)

The last `:::attestation-gate` entry is always a "awaiting all gates" status line in italics, with the version: `_Awaiting all gates — draft, not yet approved for use · Version 0.1_`

## Rendering an SoP

```bash
cd tools/surface-emit
./docx-emit.sh content-sot/sops/<slug>.md content-sot/sops/<slug>.docx
```

That produces the Cena-branded `.docx` ready to upload to Drive. The script applies the canonical reference docx, the bookmark-stripper, and the directive-mapping Lua filter — no flags to remember.

## Capturing a review

After a reviewer makes suggesting-mode edits in Google Docs and you've downloaded the edited `.docx`:

```bash
cd tools/surface-emit
./docx-diff.mjs <path-to-edited.docx>
```

That produces a patch proposal at `tools/surface-emit/diffs/<slug>-<reviewer>-<date>.patch.md` with one entry per tracked change. Work through each, mark the disposition (absorb / reject / discuss), then apply the absorbed changes to the markdown source before re-rendering.

Honest v1 limits to be aware of:
- The tool extracts suggesting-mode insertions and deletions
- Google Docs comments live in a separate file (`word/comments.xml`) and are NOT surfaced yet — read those directly in the Google Doc
- Formatting-only changes (e.g., bolding without text change) are not captured

## Anti-patterns — don't do these

- **Don't add inline HTML or `<div class="...">` markup.** The point of the directive vocabulary is that content carries zero styling. Use directives or plain markdown.
- **Don't add raw colors, font choices, or sizing.** All visual decisions live in the reference docx and the directive spec, not in the source. If you want a different treatment, propose it in the brand spec — don't override in source.
- **Don't invent new directive names.** New directives mean a brand-spec update + a regenerate + a deploy. If you need one, raise it as a brand-spec change, not as a one-off in a source file.
- **Don't put role-specific content in the Process SoPs and vice versa.** A care-coordinator-specific step belongs in `care-coordinator.md`, not in `enrollment-onboarding.md`. Cross-role SoPs name who owns each step in prose ("Care Coordinator — ...").
- **Don't edit the rendered `.docx` files directly.** They are build artifacts — they regenerate on every render and your edits get overwritten. Source is the source of truth.
- **Don't bypass the review-and-approval cycle for "small" changes.** Every material change to an approved SoP starts a new draft cycle. The approved Drive doc stays as the witnessed record.
- **Don't author in the Drive doc.** Drafting happens in markdown source. The Drive doc is a review surface, not an authoring surface.

## When you change the directive vocabulary itself

Out of scope for this guide. See:

- [`Lab/cena-health-brand/specs/haven-directive-styling.md`](../../../../cena-health-brand/specs/haven-directive-styling.md) — the brand spec for each directive's visual treatment
- [`.claude/config/drive-themes/generate-references.py`](../../../../../.claude/config/drive-themes/generate-references.py) — the Python that builds `reference-cena.docx` from the spec
- [`haven-directives.lua`](../../haven-directives.lua) — the Pandoc filter that maps directive class names to Word custom-style attributes
- [`Lab/haven-ui/tools/surface-emit/README.md`](../../README.md) — the surface-emit engine architecture

A directive vocabulary change touches all three. Update the spec, regenerate the reference docx, validate end-to-end against at least one real SoP, then update this guide's table.
