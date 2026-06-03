---
name: sop-from-fragments
description: Render a SoP-style directive-marked markdown document from a use-case's manifest + fragments. Output feeds the existing surface-emit pipeline (markdown → docx/HTML) — same shape as the existing per-role SoP authoring path, but assembled from typed fragments rather than hand-authored.
model: sonnet
tier: skill
---

# sop-from-fragments

Renders an operational SoP (Standard Operating Procedure) for external audiences — partners, auditors, staff training — from a use case's structured spec.

The wireframe-paradigm SoP analogue of `diagram-mapper`. Different concern (operational document, not visual), same source data (manifest + fragments).

## Inputs

| Input | Path | Purpose |
|---|---|---|
| `manifest.md` | `use-cases/<slug>/manifest.md` | Use case metadata + sequence + gaps + L1 narrative |
| Fragment files | `use-cases/<slug>/fragments/*.md` | Typed step specs + prose body (the SoP-render source) |
| SoP authoring guide | `Lab/haven-ui/tools/surface-emit/content-sot/sops/AUTHORING.md` | Canonical conventions for SoP structure (six-section scaffold, heading scaffolding-leak rule, restraint caps) |
| Directives rule | `.claude/rules/markdown-directives.md` | Registered directive vocabulary |
| Brand directive spec | `Lab/cena-health-brand/specs/haven-directive-styling.md` | Visual treatment per directive on the docx surface |

## Output

A `rendered-sop.md` file at the use-case folder root containing directive-marked markdown that follows the SoP six-section structure (per AUTHORING.md):

1. **Title block + masthead** — H1 + YAML frontmatter with role / type / version / status / reviewed-date / accountable / slug
2. **Scope** — 3-row table: For / Covers / Does not cover (heading per scaffolding-leak rule, e.g. "Who this is for and what it covers")
3. **Procedure** — numbered action-prose-result steps in order (heading per scaffolding-leak rule, e.g. "When the screening fires the trigger")
4. **Decision branches and/or escalation** — using `:::decision-branch`, `:::escalation`, `:::callout-warning/error/success`
5. **Quick-reference checklist** — using `:::card` + `:::checklist`
6. **Glossary** — using `:::glossary-term` + `:::glossary-def`
7. **Sign-off** — using `:::attestation` + `:::attestation-gate`

## Mapping fragments → directive markdown

| Fragment type | SoP placement | Directive(s) used |
|---|---|---|
| `enquiry` (trigger) | Procedure step 1 | numbered prose; `:::callout-info` for context |
| `decision` | Procedure + Decision-Branches section | numbered prose + `:::decision-branch` row per branch |
| `action` | Procedure | numbered prose |
| `attestation-gate` (human) | Procedure + Sign-off | numbered prose for "what is attested"; `:::attestation` + `:::attestation-gate` for the formal multi-gate at the SoP's end |
| `attestation-gate` (system) | Procedure (compact) | `:::callout-success` for the automatic audit moment |
| `hand-off` | Procedure + Escalation section (for cross-org transitions) | `:::escalation` block with "Trigger / Who / How" structure |

## Steps

1. **Read inputs.** Load manifest + all fragments + AUTHORING.md + brand directive spec.
2. **Build the title block + frontmatter.** Pull from `manifest.title`, `version`, `status`, `owner` → `accountable`, `created` → `reviewed`. The slug matches the use-case folder name.
3. **Build the Scope section.** Derive:
   - **For** — from `manifest.parent_sop` + actors enumerated across fragments (the role(s) executing the procedure)
   - **Covers** — from the use case's name + summary (the operational arc)
   - **Does not cover** — from `manifest.cross_references` and the structural gaps that route to other SoPs
4. **Build the Procedure section.** For each fragment in `manifest.sequence`:
   - Render a numbered prose step with the fragment's prose body (excluding `## Authoring note (Cena-internal)` sections — those are spec-author notes, not SoP content)
   - Inline a `:::callout-warning` block for any `x_cena_uncertainty: tbd|gap` content not already prose-surfaced
   - Heading per scaffolding-leak rule (per AUTHORING.md): name the reader's payoff, not the team's bucket label
5. **Build the Decision-Branches / Escalation section.** For each fragment of type `decision` or `hand-off`:
   - `decision` → `:::decision-branch` with one row per branch from frontmatter
   - `hand-off` with cross-organization receiver → `:::escalation` block with "Trigger / Who / How" structure
6. **Build the Quick-Reference Checklist.** Derive a tickable list from the procedure: one item per fragment, expressed as the verb-led actionable summary.
7. **Build the Glossary.** Pull defined terms from the fragments' prose. Standard glossary entries for the inventive primitives (attestation gate, escalation route, hand-off, who-watches, chain of custody) PLUS clinical/domain terms (PHQ9, C-SSRS, BHN, etc.). Use `:::glossary-term` + `:::glossary-def` for each.
8. **Build the Sign-off section.** Default to the standard 3-gate clinical SoP attestation pattern (Clinically accurate / Operationally true / Signed off) per AUTHORING.md, with the closing italicized "_Awaiting all gates — draft, not yet approved for use · Version 0.1_" line.
9. **Apply scaffolding-leak rule** (per AUTHORING.md). Section headings name the reader's payoff, not the internal bucket label.
10. **Apply per-SoP restraint caps** (per AUTHORING.md): at most 1 `:::callout-error`, at most 1 `:::escalation`, at most 2 `:::callout-warning`, at most 3 `:::decision-branch`, glossary 5–7 entries. If exceeded, flag for human review.
11. **Write to `rendered-sop.md`.**

## Rules

- **Use ONLY registered directives** per `markdown-directives.md`. Inventing a directive in source means the renderer drops it silently — never do this.
- **Strip authoring-note content.** Fragment sections explicitly labeled `## Authoring note (Cena-internal)` are for spec authors. They do NOT appear in the SoP render.
- **TBD content is surfaced** as `:::callout-warning` blocks with the explicit gap labeled — the SoP shows reviewers (Marrero, Vanessa, etc.) what's pending. This is the spec's iteration mode reaching the SoP surface.
- **SoP voice is operational, external-audience.** Author intent (why we designed the spec this way, the architectural choices) does NOT belong in the SoP. Plain-language clinical operations.
- **Heading scaffolding-leak rule** (per AUTHORING.md): never ship `## Scope`, `## Procedure`, `## Quick reference`, `## Terms used in this SoP`, `## Sign-off` as headings. Rewrite each to name the reader's payoff.
- **Inventive primitives are surfaced through glossary.** The reader doesn't need to know the spec primitive names (attestation gate, escalation route), but if they DO appear in the procedure prose (e.g., "the clinical lead's sign-off is recorded as an attestation"), include a glossary entry so the SoP is self-contained.

## Output as input to surface-emit pipeline

The rendered `rendered-sop.md` feeds the existing surface-emit pipeline:

```
cd Lab/haven-ui/tools/surface-emit
./docx-emit.sh path/to/rendered-sop.md path/to/rendered-sop.docx
```

Result: a brand-fidelity Cena docx ready for Google Drive review (haven directives styled per `haven-directive-styling.md`).

## Drift detection

The skill verifies (at render time) that:

- Every fragment in `manifest.sequence` exists in `fragments/`
- Every `outgoing_edges.to` reference points to a fragment in the same sequence OR explicitly marks `out-of-scope-<other-use-case>`
- Every `x_cena_actor: agent` step has a corresponding `x_cena_watches` annotation (the who-watches discipline)
- Every cross-fragment glossary term is consistently used (no synonyms drift — e.g., not "screening" in one fragment and "assessment" in another for the same thing)

Per the same drift-mitigation reasoning as `diagram-mapper`: the load-bearing surfaces (fragment IDs, directive vocabulary, frontmatter schema) are stable; rare changes; smell-detectable in output.

## Honest limits

- **Clinical content is not validated.** That's Marrero's review at the clinical-accurate attestation gate.
- The skill produces a **DRAFT SoP** — the review-and-approval cycle per `sop-review-and-approval.md` is required before operational use. The 3-gate attestation block in the Sign-off section explicitly carries `.is-pending` until each gate signs off.
- **Cross-fragment glossary unification is heuristic.** The agent flags ambiguous or synonym-drift terms for human review.
- **The skill does not enforce the restraint caps mechanically** — it surfaces a warning when caps are exceeded but does not edit the source to fit. SoP authors resolve.

## Relationship to other skills

- **`diagram-mapper`** — sibling skill; renders the diagram side from the same source. Both can run in parallel after fragments + manifest are stable.
- **`surface-emit pipeline`** (existing) — consumes the rendered SoP markdown → produces brand-fidelity docx via pandoc + reference docx + Lua filter.
- **`sop-review-and-approval`** (existing) — the lifecycle this skill's output enters. Each attestation-gate sign-off updates the rendered SoP's gate-status modifier class.

## Source

2026-06-03: Aaron approved Direction D (markdown fragments with YAML spec frontmatter + manifest assembly) as the use-case spec format. This skill is the SoP-rendering half of the Direction-D pipeline; sibling to `diagram-mapper` which is the visual-rendering half.
