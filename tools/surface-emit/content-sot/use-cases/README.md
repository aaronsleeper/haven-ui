# Use cases

Workflow source-of-truth for Cena's clinical operations. Each use case is a folder describing one clinical workflow as a typed-fragment spec, with separate diagram-rendering instructions and SoP-rendering output.

The Direction-D format from the workflow-spec research synthesis (2026-06-03): markdown fragments with YAML spec frontmatter + manifest assembly. Architecture: the spec is the canonical source of truth; both the diagram (visual) and the SoP (operational document) are renderings of it. SoPs are external documentation for partners / auditors / staff training — they are NOT source of truth.

## Folder shape — one per use case

Example: `escalation-phq9-positive/`

| File | Purpose | Audience |
|---|---|---|
| `manifest.md` | Use-case metadata + sequence + gaps + L1 narrative summary | Spec authors + downstream renderers |
| `fragments/*.md` | Typed step specs (enquiry, decision, action, attestation-gate, hand-off) + prose body for SoP rendering | Spec authors |
| `diagram.md` | Visual rendering intent — lanes, node placement, emphasis, uncertainty visualization | The `diagram-mapper` skill |
| `rendered-diagram.html` | The actual diagram (SVG + haven primitives) — output of `diagram-mapper` | Vanessa, Marrero, clinical team, internal review |
| `rendered-sop.md` | Directive-marked markdown SoP — input to the existing surface-emit pipeline | Partners, auditors, staff training (after surface-emit converts to docx) |

## How the pipeline works

```
manifest.md + fragments/ + diagram.md
                 │
                 ├──► diagram-mapper skill ──► rendered-diagram.html (visual)
                 │
                 └──► sop-from-fragments skill ──► rendered-sop.md ──► surface-emit ──► docx
```

Both renderings derive from the same source spec. Per the generative-determinism principle (`.claude/rules/generative-determinism.md`): the spec is the deterministic contract; the renderings are generative fills against the contract; staleness in the renderings is detectable via the views pattern on rendered-at hash (`.claude/rules/views.md`).

## Authoring conventions

### Fragment types — closed vocabulary

Five types: `enquiry`, `decision`, `action`, `attestation-gate`, `hand-off`. Extension requires updating both rendering skills. Maps to PROforma's four primitives (Plan / Decision / Action / Enquiry) + the two Cena-novel primitives (AttestationGate / Handoff) from the research synthesis.

### Cena-novel `x_cena_*` fields

These carry the inventive primitives Cena is betting on per the research synthesis:

- `x_cena_actor` — typed actor (human, agent, system, partner, patient)
- `x_cena_watches` — supervisor-of-record for the step (the "who watches" annotation)
- `x_cena_uncertainty` — resolved / tbd / assumption / gap / deferred (labeled scoping uncertainty as first-class)
- `x_cena_severity` — on decision branches when severity-coded
- `x_cena_attestation` — attestation gate contract (attestor_role, evidence_required, decision_payload_schema, sla, escalation_on_timeout)

The `x_cena_*` namespace borrows OpenAPI's x-extension convention for domain semantics. New `x_cena_*` fields require updating both rendering skills + this README.

### Gaps are first-class

Label TBD / assumption / gap content in fragment frontmatter (`x_cena_uncertainty`) AND inline in prose so it survives the SoP render as a visible blocker. Labeled uncertainty is the spec's iteration mode — diagrams and SoPs render the uncertainty visibly until it resolves.

The diagram-mapper skill turns labeled uncertainty into noisy visual callouts. The sop-from-fragments skill turns it into `:::callout-warning` blocks that reviewers must engage with. The discipline: never let uncertainty hide in the source; surface it on every output.

## Skills used

- [`diagram-mapper`](../../../../.project-docs/agent-workflow/skills/diagram-mapper.md) — renders the diagram from `diagram.md` + manifest + fragments + haven-ui PL
- [`sop-from-fragments`](../../../../.project-docs/agent-workflow/skills/sop-from-fragments.md) — renders the directive-markdown SoP from manifest + fragments
- Existing `surface-emit` pipeline (`./docx-emit.sh`) — converts the rendered SoP markdown to a brand-fidelity docx

## Current catalog

Marrero-owned use cases enumerated by the catalog workflow `wf_804a8e73-bfc` (2026-06-03). 33 use cases total across 5 SoPs (Care Coordinator, Registered Dietitian, Enrollment & Onboarding, Escalation Protocol, Monthly Reporting). The catalog identifies the next 5 priority use cases for diagramming after escalation lands.

| Use case | SoP | Status | Primitives exercised |
|---|---|---|---|
| escalation-phq9-positive | Escalation Protocol (folded in CC) | DRAFT — worked example | attestation-gate, escalation-route, who-watches, hand-off |
| written-consent-execution | Enrollment & Onboarding | not yet authored | attestation-gate, hand-off |
| phq9-administration | Care Coordinator | not yet authored | attestation-gate, escalation-route |
| monthly-uconn-review-meeting | Monthly Reporting | not yet authored | hand-off, who-watches |
| weekly-checkin-call | Care Coordinator | not yet authored | escalation-route, who-watches |
| initial-care-plan-meal-plan | Registered Dietitian | not yet authored | attestation-gate |

Full catalog (all 33) lives at `~/.claude/plans/cena-workflow-diagram-asset-family.md` in the plan's completion notes.

## Source

2026-06-03: Direction D locked as the spec format. Diagram-as-instructions pattern (Aaron's wireframe-paradigm reframe) locked as the diagram layer's authoring approach. First worked example: `escalation-phq9-positive/`. Pipeline test for Friday's Marrero session.
