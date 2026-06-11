# haven-ui-pipeline-v2 — Cena recommendation

**Phase:** 1-R.c synthesis (Q5a + Q5b of the discovery-brief synthesis frame)
**Authoring expert:** [Workflow Designer](../../../../experts/workflow-designer.md)
**Paired with:** [architecture-map.md](./architecture-map.md) (Q1–Q4)
**Inputs:** architecture-map.md (this run's Q1–Q4 output) + research/vault-failure-log.md + Cena structural conditions
**Status:** draft for Aaron review (Phase 1-R.d gate)

---

## Executive summary

The architecture: **one canonical pipeline with three named sub-shapes (Tier 1 / Tier 2 / Tier 3, retained from haven-ui's existing slice-tier model) plus a parallel clinical-context overlay for patient-facing surfaces.** Not "N chained pipelines" — the chain-shape research found convergence on a seven-slot universal sequence across all five picks. What varies is *which gates fire* and *which experts staff* the slots; the chain itself is one shape.

The coordination substrate: **the vault itself** (rules + registries + experts + skills + view blocks + invariant tripwires + emit ledger + closure obligations + ambient plans + the canonical pipeline at `workflows/ui-development/`). All five researched companies operate substrate-over-PMO-role coordination; none has a dedicated cross-pipeline PM function. Cena's vault is the same primitive at Cena's 3-person + agent-collective scale. The recommendation is **NOT to build a new coordination layer**; it is to **wire the existing v2 pipeline INTO the vault substrate that already runs.**

The Day-1 MVP: the 34-slot canonical UI pipeline at `workflows/ui-development/` is the spine. v2 adds three gates the current pipeline lacks (brief-philosophy alignment as Gate-0; persona-calibration as a layered discipline at slots 5/7/17/30; canonical-mock + canonical-primitive verification mechanical-falsifiability at slots 11/17/22), plus one new role need (a **Pipeline Steward** expert that owns the spine — proposed below — performing the role Witt holds at Headspace and Yamashita+Field hold at Figma). The clinical-context overlay activates only for patient-facing surfaces and routes through the existing factuality-reviewer expert + a proposed **Clinical Safety Reviewer** expert at the patient-app surface.

Q5b coverage: of the 15 named failure shapes in vault-failure-log.md, **14 are prevented by named gates in this recommendation and 1 is accepted with rationale** (the partner-environment-fidelity gap, accepted because the SoP-emission discipline already addresses it at the right layer per `haven-emission-pipeline-optimization.md`). All three meta-shapes (constraint-not-consumed, brief-framing-wrong, pipeline-not-run) are addressed by named gates. The ledger is the falsifiability check.

---

## Cena structural conditions (the constraints the recommendation respects)

- **3-person team + agent collective.** Aaron (design lead + product lead + Witt-shaped executive); Vanessa (clinical lead + accountability); Andrey (technical lead + production engineering at cena-health-spark). The agent collective fills the per-stage maker roles that Linear or Figma would staff with engineers + designers + PMs.
- **Pre-revenue, pilot-stage.** Cannot afford coordination-layer overhead that earns its keep only at scale (Airbnb's five-team DesignOps pillar; Stripe's Red Pens editors; Linear's COO + Head of Product). Day 1 must be implementable; maturation path must be named for what waits.
- **Vulnerable patient population (UConn pilot).** HIV+/food-insecure adults; mixed/low tech-literacy; some ESL; sensitive (dignity, no judgment/surveillance/gamification) — non-negotiable. Persona-calibration discipline must operate from Day 1 for the patient surface, not waiting on scale-justified infrastructure.
- **In-network clinical-accountability.** Pilots: partner-institution clinicians retain accountability; evolving as Cena hires Soto/Morales. Clinical-context overlay must be parallel-track (Headspace pattern), not gating design.
- **Agents-first thesis.** Agents do verifiable work; humans (Aaron, Vanessa, partner clinicians) hold accountability + judgment. Gates must distinguish what an agent can mechanically verify from what a human must judge.
- **Haven design canon deeply encoded.** Pattern-library + components.css + COMPONENT-INDEX + brand spec are already substantively built; haven-ui rules (pattern-library-first / copy-don't-generate / `haven-primitive-codification.md` / `pipeline-coverage-gate.md`) already ship the discipline that should be load-bearing in the v2.
- **[feedback_handoff_friction] memory.** Framework-translation handoffs (HTML → Angular) are where quality dies. The v2 must respect this: prefer end-to-end-in-one-stack where possible; when translation is unavoidable, the source-of-truth IS the pattern-library (the Figma "design file IS the spec" pattern).

---

## Q5a — Architecture recommendation

### Pipeline shape: one canonical chain with three sub-shapes + a parallel clinical overlay

**One pipeline, not N.** The chain-shape research found convergence across all five picks on a seven-slot universal sequence; Aaron's hypothesis ("probably multiple chained pipelines") is *partially supported* — the existing haven-ui Tier 1 / Tier 2 / Tier 3 model already encodes three named sub-shapes within one pipeline. The v2 does not need N separate pipelines; it needs the existing canonical chain with **explicit sub-shape declaration at slot-0** (which Tier? primitive / composition / fix?) and **clinical-context overlay activation** when the surface is patient-facing.

The 34-slot canonical pipeline at `workflows/ui-development/` is the chassis. The v2 keeps the chassis and adds:

- **Gate-0 (new):** brief-philosophy alignment check (fired before slot-1)
- **Tier declaration (new):** slot-0 explicit tier (Tier 1 primitive / Tier 2 composition / Tier 3 fix) — already exists in haven-ui CLAUDE.md; the v2 makes it a fired gate, not an authoring convention
- **Persona-calibration discipline (new, layered):** activated at slot-5 (canon-binding), slot-7 (IA), slot-17 (component-spec), slot-30 (verification) — NOT a single gate
- **Canonical-mock + canonical-primitive verification (new, mechanical):** the wireframe-vs-PL delta from haven-ui is already a discipline; the v2 makes it a fired gate at slots 11→17 and 17→22
- **Clinical-context overlay (new, conditional):** activates for patient-facing surfaces; parallel-track with named merge points at intake routing, AI/conversational content, copy/voice calibration, outcome verification
- **Pipeline Steward role (new):** the Witt-shaped role that holds the spine; the existing Workflow Designer expert is the meta-pipeline owner (designs new pipelines); the Pipeline Steward is the per-instance owner (runs THIS pipeline once it's running)

The clinical overlay is not a separate pipeline — it's parallel-track discipline that activates conditionally based on surface type (patient-facing vs. provider-facing vs. partner-facing). This matches Headspace's pattern: clinical does not gate design; clinical operates in parallel with named merge points.

### Per-artifact specs using Aaron's 5-attribute frame

**This section is the deterministic contract for Phase 2-R DWG fill.** Every artifact in the v2 chain gets a 5-attribute spec; Phase 2-R per-pipeline DWG runs fill the per-domain specifics. Order maps to the canonical chain slots in `workflows/ui-development/slot-list.md`.

Each spec follows the template:
```
- Purpose
- Canon
- Brief
- Domain
- Process
```

#### A-0. Brief-philosophy alignment artifact (Gate-0; new in v2)

- **Purpose.** Catch the failure shape Rewind A surfaced: brief framing itself is wrong, and downstream slots will be faithful to a wrong frame. Fires before slot-1 to surface the brief's framing language for explicit Aaron confirmation. Downstream artifacts (the brief itself + every slot's output) depend on this gate having fired.
- **Canon.** Haven design principles (every viewport accessed, function and look well, restraint-defined); the cena-fable-window-2026-06-11 Rewind A diagnosis ("absolute, not comparative" viewport relationship); the brief-framing red-flags (any "primary/secondary," "graceful upgrade," "mobile-first with future X" language that asserts a comparative relationship the product does not actually want).
- **Brief.** Three checks: (1) is the brief's design philosophy named explicitly enough to be falsifiable? (2) does any framing language assert primary/secondary viewport/persona/surface relationships? (3) does the philosophy state the product as absolute (every viewport/persona/state served), not as comparative (primary case + graceful degradation for others)? Format: a one-page review against the brief naming flagged language + a proposed reframe.
- **Domain.** Aaron (load-bearing) + Workflow Designer expert (dispatching) + the per-domain expert most relevant to the surface (Haven Visual Designer for visual; ux-design-lead for IA-shaped; persona-calibration discipline holders for vulnerable-population surfaces).
- **Process.** Brief lands in slot-1. Gate-0 dispatch runs the three checks. Surfaces flagged language to Aaron for explicit confirmation. Aaron either reframes or confirms the framing is intended. The reframe (if any) lands in the brief BEFORE slot-1's IA work begins. Gate-0 closes on Aaron sign-off; slot-1 cannot proceed without the close.

#### A-1. Brief / problem framing (existing slot-1 in canonical pipeline)

- **Purpose.** Crystallize the problem from the user's POV; name the surface, persona, success criteria, scope-in, scope-out, constraints, philosophy. Downstream slots (IA, flows, wireframes, components, build, verification) all dereference this artifact for their scope.
- **Canon.** Cena company canon (mission, brand, agents-first thesis, north-star); the patient-population canon (UConn pilot; mixed/low tech-literacy; ESL; HIV+/food-insecure dignity); prior briefs in adjacent area; the gate-0-approved philosophy.
- **Brief.** Five-attribute frame applied to the surface: persona + problem + success criteria + scope-in + scope-out + constraints + philosophy. Includes brief-section pointers for downstream gates (Section 4 = scope-in; Section 5 = scope-out; Section 6 = constraints; Section 3 = philosophy). Format: markdown doc with explicit section numbers so downstream `consumes:` declarations can reference them.
- **Domain.** Aaron (problem framing); the relevant domain expert for the surface (Haven Visual Designer; clinical-safety-reviewer if patient-facing; etc.); the persona-calibration discipline (vulnerable-population reviewer for patient-facing surfaces).
- **Process.** Aaron drafts brief. Gate-0 fires (philosophy check). Aaron confirms or reframes. Brief is committed. Downstream slots dereference by section number, not by paraphrase.

#### A-2. Information architecture (IA) (existing slot-7)

- **Purpose.** Name the canonical primitives for each screen + persona; define the surface's structural shape across viewports/states; encode the philosophy from the brief into structural decisions.
- **Canon.** Haven pattern-library COMPONENT-INDEX (canonical primitives available); the brief's philosophy + scope; prior IA for adjacent surfaces; the agents-first thesis (which content is agent-generated, which is human-authored, which is canonical).
- **Brief.** For each screen and persona, name the canonical primitives composing it (must resolve to COMPONENT-INDEX entries, or be flagged as new-primitive promotion-to-PL). Name the viewport range and which primitives compose at each. Name the agent-generated vs. human-authored vs. canonical content boundary. Format: structured markdown with screen-by-screen primitive lists.
- **Domain.** Aaron + ux-design-lead expert (for IA judgment) + design-system-steward expert (for primitive availability) + haven-mapper skill (for wireframe-vs-PL delta).
- **Process.** Author drafts IA per brief. Names primitives per screen. Flags new-primitive needs (route to `haven-primitive-codification.md` discipline BEFORE proceeding). Persona-calibration discipline applies for patient-facing surfaces (does the IA shape work for someone with low tech-literacy, in food insecurity, possibly ESL?).

#### A-3. Flows (existing slot-9)

- **Purpose.** Trace the user journey through screens; name the entry/exit/error/empty/loaded states; expose where state changes affect surface decisions.
- **Canon.** Haven canonical states (entry, loaded, empty, error, transitioning); the brief's persona + success criteria; the IA's named primitives.
- **Brief.** For each flow, name the screens traversed + the state at each screen. Name the worst-case-scenario variant (Airbnb-inspired discipline — the journey must hold for the worst-case user, not just the archetypal user). For patient surfaces, name the acute-state variant (the journey must hold for a user in distress, not just a calm user). Format: structured markdown with flow-by-flow state breakdowns.
- **Domain.** Aaron + ux-design-lead + persona-calibration discipline (for variant journeys).
- **Process.** Author drafts. Variant-journey discipline applies: archetypal + worst-case + (for patient surfaces) acute-state. Persona-calibration reviewer (vulnerable-population expert) approves the variant coverage before slot-11 proceeds.

#### A-4. Wireframes (existing slot-11)

- **Purpose.** Compose IA primitives into screen-level shape. Specify composition + copy + validators + transitions + viewport behavior. Wireframes are the PL-delta-review surface — they declare which primitives the spec needs.
- **Canon.** IA's named primitives (must resolve to COMPONENT-INDEX or be in promotion-to-PL flow); the flows' named states; the brief's scope-in/scope-out/constraints by explicit section reference; the gate-0-approved philosophy.
- **Brief.** Each wireframe declares `shells:` frontmatter (haven-ui convention). Each wireframe-named primitive must resolve to a PL fragment. Brief constraints (scope-out, no-X) materialize as **explicit negative-space assertions** in the wireframe ("zero `<img>` AND zero placeholder-treatment descendants" for the no-food-images constraint, not "use placeholder treatment"). Viewport behavior named at each named breakpoint, OR explicit reference to the PL fragment's documented behavior. Format: markdown wireframes per `apps/*/design/wireframes/` syntax.
- **Domain.** Haven Visual Designer expert (wireframe authoring) + design-system-steward (primitive verification) + ux-design-lead (composition critique).
- **Process.** Author drafts. Wireframe-vs-PL delta review fires (haven-mapper skill). Pipeline-coverage-gate's three checks fire (every brief-named requirement exercised or excluded-by-inverse-or-deferred; every IA-named primitive composed or deferred; no "for V0 we'll just..." softening framing). All three checks must pass before slot-17 proceeds.

#### A-5. Component spec (existing slot-17)

- **Purpose.** Specify the component-level contract: every wireframe-named primitive's PL source, every viewport's internal layout, every state's behavior. The spec is what slot-22 (build) emits against.
- **Canon.** Wireframe's named primitives (each must resolve to PL fragment with @component-meta header); the PL fragments themselves (the spec dereferences them, doesn't re-author them); the components.css source-of-truth for semantic class behavior.
- **Brief.** For each wireframe-named primitive, the spec declares (a) its PL source path + @component-meta hash; (b) its internal layout at each named viewport breakpoint, OR explicit reference to the PL fragment's documented behavior; (c) the canonical mock data dereferenced (named import from `packages/design-system/src/data/`, NOT fabricated literals). Format: structured markdown with per-primitive contract blocks.
- **Domain.** Haven Visual Designer + design-system-steward + (for patient surfaces) Clinical Safety Reviewer expert (proposed below; verifies clinical-loaded copy is safe).
- **Process.** Author drafts per wireframe. Canonical-primitive gate fires (every primitive resolves to PL or has approved promotion-to-PL artifact). Canonical-mock gate fires (no fabricated dummy data; every mock value dereferenced from `packages/design-system/src/data/`). Slot-19 acceptance criteria fire (consume directly from brief Section 4/5/6 in addition to wireframes — closing the slot-19 acceptance-only-from-wireframes failure shape).

#### A-6. Build (existing slot-22)

- **Purpose.** Emit working UI per the component spec. Compose against PL fragments + components.css. Wire to canonical mock data. Run in the target framework's preview server.
- **Canon.** Component spec + PL fragments + components.css + canonical mock data + the haven-ui `Lab/haven-ui/CLAUDE.md` build discipline (pattern-library-first / copy-don't-generate / no utility soup / semantic classes only).
- **Brief.** Compose per spec. Output-shape declaration at slot-22 authoring: (a) flat-reference (all states stacked for visual review) or (b) navigable-spine (inter-page nav wired). NEVER conflate the two. For navigable-spine, every state's transition target is named and wired. Format: code + preview server URL.
- **Domain.** haven-pl-builder skill + ui-react-porter skill + (for app shells) the app's framework-port authoring discipline.
- **Process.** Build runs against spec. Output-shape declared at authoring. Slot-30 verification gates accordingly (mechanical multi-viewport probes; canonical-primitive presence checks; canonical-mock presence checks; persona-calibration adequacy checks for vulnerable-population surfaces).

#### A-7. Verification (existing slot-30 + slot-31)

- **Purpose.** Falsify the build's compliance with the spec + brief + canon. Verification is the cold-look gate before any ship to client/partner/production.
- **Canon.** The brief + spec + canon (PL + components.css + brand spec + COMPONENT-INDEX); the test-environment-as-partner-surface discipline (Google Docs for docx; target browsers for web; target devices for mobile).
- **Brief.** Multi-viewport DOM probes; canonical-primitive presence assertions (every wireframe-named primitive composes from PL); canonical-mock presence assertions (no fabricated data); brief-constraint coverage assertions (every brief-named scope-out item asserted as negative-space); persona-calibration adequacy (does this read for the vulnerable-population persona? non-mechanical, judgment-based); clinical-safety review (for patient-facing surfaces, Clinical Safety Reviewer expert dispatches). Format: machine-readable assertion suite + human cold-look review.
- **Domain.** Mechanical assertions (haven-ui verification tooling); Human cold-look (Haven Visual Designer + Aaron + the persona-calibration reviewer); Clinical safety (Clinical Safety Reviewer expert dispatch when applicable).
- **Process.** Mechanical suite runs first; exits nonzero on regression (the `pipeline-coverage-gate.md` discipline). Human cold-look runs second. Clinical safety dispatches third (conditional on patient-facing). All three close before ship-readiness fires. Slot-31 release-readiness skip-audit fires last (catches "did we run the gates we said we'd run?").

#### A-8. Post-ship retrospective + emission ledger (existing post-ship slots)

- **Purpose.** Capture institutional learning. Feed the next discovery cycle. Make the emission discoverable later (the "that version we emitted last week" resolution problem).
- **Canon.** Vault emission ledger format (`Knowledge/Areas/Meta/Emissions/`); the `retro` skill's format; the closure-obligations format for proposals that earn structural status.
- **Brief.** Post-ship retro names: what shipped, what failures surfaced, what gates earned their keep, what gates didn't fire when they should have, what new failure shapes the v2 needs to add. Emission ledger entry records: pipeline + version + label + output pointer. Format: append to retro log + emission ledger.
- **Domain.** Aaron + Pipeline Steward (proposed) + the per-domain experts who staffed the run.
- **Process.** Retro after ship. Ledger entry on emission complete (step 6 of `emit-vs-create.md` gate). Failure-mode candidates surface to `/meta` retro for rule-promotion judgment.

### Gates (universal + Cena-specific + agent-mechanically-enforced)

The v2's gate inventory. Each gate names: what it checks; halting role; falsifiability; sibling vault rule.

#### Universal gates (every mature design-led team has this shape — Q2 universal)

- **G-A. Persistent canon referenced by every downstream artifact** — Cena equivalent: every brief/spec opens with `Canon:` block listing dereferenced canonical sources (vault entity docs, brand spec, design system, prior briefs). Halting role: author + any reviewer can flag missing canon reference. Falsifiability: mechanical (the `Canon:` block exists or it doesn't). Sibling rule: `define-once.md`.
- **G-B. No meeting without a circulated written artifact** — Cena equivalent: no agent dispatch without a brief; no Aaron review without a deliverable to react to. Halting role: anyone in the dispatch chain. Falsifiability: hard (the artifact exists or it doesn't). Sibling rule: `triage-first.md` (the per-prompt artifact-shape discipline).
- **G-C. Design system as token-contract between design and engineering** — Cena equivalent: haven-ui's `components.css` + COMPONENT-INDEX + PL fragments + brand spec are the token contract. Halting role: design-system-steward expert + mechanical gate (every wireframe-named primitive resolves to PL or flags promotion-to-PL). Falsifiability: mechanical (wireframe-vs-PL delta). Sibling rule: `haven-primitive-codification.md` + `Lab/haven-ui/CLAUDE.md` "Pattern-Library-First Rule".
- **G-D. Non-blocking peer feedback cadence (crits)** — Cena equivalent: the 4-expert panel for Tier 1 slices (design-system-steward + ux-design-lead + accessibility + brand-fidelity); each ships `ship | iterate | block` verdict. Distinguish: the 4-expert panel IS blocking by haven-ui's existing discipline (all four must pass or produce iterate-then-ship). Figma's crits are non-blocking; haven-ui's panel is blocking. The blocking-shape earns its keep because the Cena team is too small for Figma-style "many eyes" coverage; the panel concentrates the cross-disciplinary review in one structured pass.
- **G-E. Executive judgment gate at strategic milestones** — Cena equivalent: Aaron at brief sign-off (Gate-0); Aaron + named experts at slot-19 (acceptance criteria); Aaron at slot-30 ship-readiness; Aaron at any escalation triggered by the persona-calibration or clinical-safety reviews. Halting role: Aaron. Falsifiability: judgment. Sibling rule: `triage-first.md` (escalate-tier triage).
- **G-F. Outcome-measurement (or equivalent ship-gate)** — Cena equivalent: slot-30 verification with multi-viewport probes + persona-calibration adequacy + (for clinically-loaded copy) clinical-accuracy verification. No A/B test capacity at pilot stage; the gate is verification-against-criteria rather than statistical experiment. Halting role: mechanical (the verification suite exits nonzero on regression). Falsifiability: mechanical for structural checks; judgment for adequacy checks.
- **G-G. Post-ship retrospective (institutional learning)** — Cena equivalent: the `retro` skill + the vault emission ledger + the `/meta` sweep. Halting role: not a halting gate; an institutional discipline. Falsifiability: the artifact exists and propagates.
- **G-H. Continuous quality channel parallel to chain** — Cena equivalent: the Inbox + `/vault-organizer` + agent debrief logs + the friction-log analog Aaron's annotations represent. Halting role: not a halting gate; signal-collection. Falsifiability: friction-pattern emergence triggers a `/meta` rule-promotion candidate.

#### Cena-specific clinical-context gates (Headspace overlay; activates conditionally)

Activates for patient-facing surfaces. Inactive for provider-facing, kitchen-facing, partner-facing surfaces (where the v2 falls back to universal gates only).

- **G-Clin-A. Persona-calibration discipline (layered, not single checkpoint)** — Cena equivalent: fires at slot-5 (canon-binding adopts vulnerable-population canon); slot-7 (IA verifies primitive choice against persona); slot-17 (component-spec verifies copy reading-level + affordance density + accessibility floor + language-register against persona); slot-30 (verification verifies adequacy-to-population, not just structural compliance). Halting role: persona-calibration reviewer (new expert proposed below) + Aaron at slot-30. Falsifiability: judgment, calibrated by an explicit persona-calibration rubric authored as part of Phase 2-R DWG. Reference: Headspace's five-layered discipline + Airbnb's worst-case-scenario storyboards + Another Lens deck.
- **G-Clin-B. Clinical-accuracy verification on clinically-loaded content** — Cena equivalent: any patient-facing copy that names clinical conditions, treatments, outcomes, or makes clinical claims fires a Clinical Safety Reviewer dispatch. Halting role: Clinical Safety Reviewer expert (new, proposed below) + (for Cena's UConn pilot) Vanessa/partner-institution clinician review where stakes warrant. Falsifiability: judgment for clinical adequacy; mechanical for "is this content clinically-loaded" classification (a register/vocabulary check).
- **G-Clin-C. AI-generated patient-content safety check (analog of Headspace's 100%-AI-message-monitoring)** — Cena equivalent: when Ava (or any agent) generates patient-facing content, a Clinical Safety Reviewer dispatch (or an automated risk-classifier if/when one is built) verifies the content does not violate the no-medical-advice / no-diagnosis / no-treatment-claims guardrails before emission. Halting role: Clinical Safety Reviewer expert. Falsifiability: mechanical for guardrail-violation classification (e.g., regex/classifier on "you should...", "your diagnosis is...", drug names without disclaimer); judgment for borderline content.

#### Agent-mechanically-enforced gates (the deterministic spine)

The gates that fire without judgment, via tooling or invariant tripwires:

- **G-M-1. Wireframe-vs-PL delta** — every wireframe-named primitive resolves to PL or flags promotion-to-PL. Mechanical via haven-mapper skill. Sibling rule: `haven-primitive-codification.md`.
- **G-M-2. Canonical-mock presence** — no fabricated dummy data; every mock value resolves to a `packages/design-system/src/data/` import. Mechanical via grep + import-resolution check.
- **G-M-3. Brief-constraint coverage** — every brief-named requirement is positively exercised, excluded-by-inverse, or explicitly-deferred. Mechanical via slot-19 acceptance criteria consuming brief Section 4/5/6 (pipeline-coverage-gate's gate-1). Sibling rule: `pipeline-coverage-gate.md`.
- **G-M-4. IA-primitive composition coverage** — every IA-named primitive is composed in wireframe or explicitly-deferred. Mechanical via slot-11 vs. slot-7 cross-reference (pipeline-coverage-gate's gate-2).
- **G-M-5. "For V0 we'll just..." softening detection** — invariant tripwire (per `invariant-tripwires.md`) scans wireframe/spec markdown for softening framing phrases. Fires on detection. Sibling rule: `pipeline-coverage-gate.md` + `invariant-tripwires.md`.
- **G-M-6. Brief-philosophy alignment (Gate-0)** — mechanical detection of primary/secondary framing language in brief; surfaces flagged language for Aaron confirmation. Mechanical via regex + flagged-phrase database; judgment via Aaron at the resulting prompt.
- **G-M-7. Canonical-pipeline routing (entry gate)** — `Lab/haven-ui/CLAUDE.md` points to ONE canonical pipeline; deprecated forks carry banners routing to canonical; invariant tripwire pins absence of "run the local agent-workflow" instruction. Already shipped per the 2026-05-24 closure-obligation closeout.
- **G-M-8. Slot-prerequisite check** — every slot's expert dispatch verifies its declared `consumes:` upstream artifacts exist and are accepted. Halts dispatch if prerequisites are absent.
- **G-M-9. Render-environment fidelity** — verification runs in the partner-consumption environment (Google Docs for docx; target browsers for web; target devices for mobile). Mechanical via render-environment declaration in the verification slot. Sibling rule: `haven-emission-pipeline-optimization.md` (the partner-environment-QA-discipline lock).
- **G-M-10. Mode-declaration in expert dispatch** — every expert dispatch envelope names canonical-artifact vs. demo-shape mode. Mechanical via dispatch envelope template. Sibling rule: scope-before-execution discipline in `triage-first.md`.

### Roles (human-held vs. agent-held; existing experts cited; new experts proposed)

Per the workflow-designer judgment framework, "authority follows the accountability route." Aaron holds executive authority (the Witt-shaped role); experts hold per-domain judgment; agents staff the per-stage makers.

#### Existing experts cited (already in EXPERT-REGISTRY)

- **Haven Visual Designer** ([HVD](../../../experts/haven-visual-designer.md)) — staffs slot-11 (wireframes) + slot-22 visual decisions + slot-30 cold render-and-look review for visual fidelity
- **design-system-steward** ([Lab/haven-ui/planning/experts/design-system-steward/](../../experts/design-system-steward/)) — staffs slot-5 (canon-binding) + slot-7 (IA primitive availability) + slot-17 (component-spec verification) + 4-expert panel for Tier 1 brand-fidelity-weighted work
- **Workflow Designer** ([this expert](../../../../experts/workflow-designer.md)) — meta-pipeline owner; runs DWG against new pipelines; this v2 synthesis is a Workflow Designer dispatch
- **Vault Organization** ([Vault Organization](../../../../experts/vault-organization.md)) — staffs Step 1 (entity placement) + Step 7 (expert tier per expert-placement.md); audits topology
- **factuality-reviewer** — staffs verification of any time-sensitive claims in patient-facing content (statutes, rates, clinical citations); already shipped per `verify-time-sensitive-claims.md`
- **ux-design-lead** ([haven-ui/planning/experts/ux-design-lead/](../../experts/ux-design-lead/)) — staffs slot-7 (IA) + slot-9 (flows) + 4-expert panel
- **accessibility** ([haven-ui/planning/experts/accessibility/](../../experts/accessibility/)) — staffs WCAG 2.1 AA floor at slot-17 + slot-30 + 4-expert panel
- **brand-fidelity** ([haven-ui/planning/experts/brand-fidelity/](../../experts/brand-fidelity/)) — staffs "does this feel like Haven" review at 4-expert panel
- **Agent Security Posture** — staffs trust-boundary checks for any agent dispatch ingesting external content (per `agent-trust-boundary.md`)

#### Proposed new experts (Cena's v2 has a structural gap; current expert set does not staff it)

**Pipeline Steward** (cross-cutting, vault-tier) — *PROPOSED*

- **Domain.** Owns the haven-ui v2 pipeline at runtime: holds the spine across pipeline instances; surfaces missed-thing signals; tracks failure-pattern recurrence across runs; dispatches the right per-stage experts; closes the gate ceremony per run. Distinct from Workflow Designer (which designs new pipelines via DWG); the Pipeline Steward runs THIS one once it's running.
- **The Witt-analog role.** This is the role Witt holds at Headspace (unified P&L authority across design + product + content + brand + science); the role Field + Yamashita hold at Figma (executive product review); the role Karri holds at Linear (final-taste arbiter for top-tier work). At Cena's 3-person scale, Aaron holds the Witt-shaped authority for the company; the Pipeline Steward holds the Witt-shaped authority for THIS pipeline (the spine + the missed-thing detection + the cross-stage continuity).
- **Why it exists.** The cena-fable-window-2026-06-11 plan's Rewind A/B/C diagnosed that no single role held the spine across the three rewinds. Aaron caught each failure individually; an expert that owns the spine would have caught the failure shape *across* the rewinds (the meta-shape: brief-framing-was-wrong + downstream-was-faithful-to-wrong-framing + canon-misalignment + persona-calibration-gap all in one ship). The Workflow Designer's retro log notes this is a Step-6-embedded synthesis variant; the Pipeline Steward staffs the runtime equivalent.
- **Out of scope.** Designing new pipelines (Workflow Designer); per-stage judgment in any specific domain (the per-stage experts hold this); company-level strategic direction (Aaron + Cena leadership).
- **Tier.** Vault-tier (cross-cutting), per `expert-placement.md` subsidiarity. Serves haven-ui at Cena AND any future surface (decks, SoPs, partner one-pagers) that runs through a canonical pipeline. Promote to project-tier ONLY if the role's calibration diverges per-project — not the expected case.

**Clinical Safety Reviewer** (project-tier at Cena Health for now; promote to vault if Change Craft or other projects start producing clinical content) — *PROPOSED*

- **Domain.** Owns clinical-accuracy + clinical-safety review for patient-facing surfaces. Verifies (a) clinically-loaded content respects clinical canon (no medical advice / no diagnosis / no treatment-claims guardrails); (b) AI-generated patient content fires the safety check before emission; (c) acute-state UI calibration is encoded; (d) escalation paths to human clinicians are wired. Distinct from factuality-reviewer (which verifies time-sensitive claims); the Clinical Safety Reviewer holds the clinical guardrail discipline.
- **The Headspace-analog role.** This is the role Dr. Clare Purvis (Behavioral Science) + the AI-safety review team hold at Headspace. At Cena's UConn pilot stage, the Clinical Safety Reviewer dispatches Vanessa (or a partner-institution clinician) when stakes warrant; outside the dispatch envelope, the expert holds the persistent discipline + reads each patient-facing artifact for guardrail compliance.
- **Why it exists.** The cena-apps Rewind C surfaced a UX-adequacy gap for vulnerable patient population. The v2 needs a discipline holder that operates on patient-facing artifacts BEFORE Aaron/Vanessa cold-review. The expert pre-filters; humans hold final accountability.
- **Out of scope.** Clinical decisions (Vanessa, partner clinicians, Aaron); content authoring (Haven Visual Designer + content roles); compliance (separate pipeline per Aaron's call).
- **Tier.** Project-tier (Cena Health) per `expert-placement.md`; promote to vault if a second project surfaces clinical-content review need.

**Persona-Calibration Reviewer** (project-tier at Cena Health for patient surfaces; potentially vault if Change Craft surfaces serve vulnerable populations) — *PROPOSED*

- **Domain.** Owns the layered persona-calibration discipline for vulnerable-population surfaces. Verifies (a) reading-level appropriate; (b) affordance density appropriate; (c) accessibility floor explicit; (d) language register matches population; (e) worst-case-scenario journey covered; (f) acute-state UI adaptation encoded. Distinct from accessibility expert (WCAG floor); the Persona-Calibration Reviewer holds the population-specific calibration.
- **The Airbnb-analog role.** This is the role distributed across Airbnb's storyboard-with-worst-case-variants practice + Another Lens deck + Trust & Safety team + accessibility team. At Cena's UConn pilot stage, the Persona-Calibration Reviewer holds the discipline; agent dispatches at slot-5/7/17/30 fire the per-slot persona-calibration check.
- **Why it exists.** The cena-apps Rewind C structural failure 5 of 5 (UX-adequacy gap for non-tech-savvy / mixed-tech-literacy / partly-ESL patient population) is the existence proof. The discipline must be layered (not a single gate); the expert holds the discipline-shape; per-slot dispatches operationalize it.
- **Out of scope.** Accessibility floor (existing accessibility expert); brand voice (existing brand-fidelity expert); clinical safety (Clinical Safety Reviewer above).
- **Tier.** Project-tier (Cena Health) for UConn pilot; promote to vault if a second project surfaces vulnerable-population calibration need.

#### Role staffing per slot (the agent-dispatch map)

| Slot | Slot purpose | Human-held | Agent-held | Existing or proposed |
|---|---|---|---|---|
| **Gate-0** | Brief-philosophy alignment | Aaron (judgment) | Mechanical regex + Workflow Designer dispatch (surfaces flagged language) | Existing |
| **1. Brief** | Problem framing | Aaron (load-bearing) | n/a (Aaron drafts; experts review) | Existing |
| **5. Canon-binding** | Verify canonical references | Aaron sign-off | design-system-steward (Haven canon); Pipeline Steward (cross-canon coordination); Persona-Calibration Reviewer (population canon for patient surfaces) | Mixed: existing + proposed |
| **7. IA** | Information architecture | Aaron review | ux-design-lead (IA judgment); design-system-steward (primitive availability); Persona-Calibration Reviewer (for patient surfaces) | Mixed: existing + proposed |
| **9. Flows** | User journeys + states | Aaron review | ux-design-lead; Persona-Calibration Reviewer (worst-case + acute-state variants) | Mixed: existing + proposed |
| **11. Wireframes** | Composition + copy + transitions | Aaron review | Haven Visual Designer (load-bearing); design-system-steward (PL delta); Persona-Calibration Reviewer (for patient surfaces) | Mixed: existing + proposed |
| **17. Component spec** | Build-ready contract | Aaron sign-off (Tier 1) | Haven Visual Designer; design-system-steward; Clinical Safety Reviewer (for clinically-loaded patient content) | Mixed: existing + proposed |
| **19. Acceptance criteria** | Falsifiable assertions | Aaron review | Workflow Designer (derives from brief Sections 4/5/6 + wireframes); the per-domain expert | Existing |
| **22. Build** | Working UI | Andrey (for production stack at cena-health-spark); Aaron (for haven-ui pattern-library + cena-apps) | haven-pl-builder skill; ui-react-porter skill | Existing |
| **30. Verification** | Mechanical + human cold-look | Aaron + Haven Visual Designer (cold-look); Vanessa or partner clinician (for clinical-loaded content) | Mechanical assertion suite; Clinical Safety Reviewer; Persona-Calibration Reviewer; Pipeline Steward (gate ceremony close) | Mixed: existing + proposed |
| **31. Release readiness** | Skip-audit | Aaron sign-off | Pipeline Steward (audits the run against declared gate set; surfaces skipped gates) | Proposed: Pipeline Steward |
| **Post-ship** | Retro + emission ledger | Aaron + Vanessa (for patient surfaces) | Pipeline Steward (drives retro discipline); existing retro skill | Mixed: existing + proposed |

### Coordination/orchestration layer (THE SPINE)

The v2's spine is the Cena vault substrate + the Pipeline Steward expert + the canonical pipeline at `workflows/ui-development/`. Per the Q3 finding: substrate-over-PMO-role is universal. The Cena vault IS the substrate.

**Named role:** Pipeline Steward (the per-instance owner; proposed above). The role does NOT replace Aaron's executive authority; it dispatches the per-stage experts, tracks the run's gate ceremony, surfaces missed-thing signals to Aaron, and closes the run with a retro entry. Aaron remains the final-taste arbiter.

**Cadence:** the v2 runs in a Linear-shape rhythm: cycles are not time-boxed (Cena does not need date-discipline today); slots are state-boxed (slot-N completes when its acceptance criteria fire). Weekly checkpoints from Aaron review in-flight slot state; the Pipeline Steward surfaces blockers + missed-thing candidates. Quarterly retros run by `/meta` cluster on failure-pattern recurrence; failure-pattern thresholds trigger v3-class architecture review (this v2 is the source for that recurrence).

**Artifact:** the v2's plan artifact is `~/.claude/plans/dwg-haven-ui-pipeline-v2-{phase}.md` (Workflow Designer convention). Once the pipeline is running, each instance's plan is `~/.claude/plans/{surface}-pipeline-run-{N}.md`. The plan IS the run's status surface (Figma-analog: PRD-with-embedded-live-Figma-files; here: plan-with-embedded-view-blocks dereferencing the slot artifacts).

**Software primitive:** the Cena vault. Specifically: the registries (PIPELINE-REGISTRY, EXPERT-REGISTRY, SKILL-REGISTRY) + view blocks + invariant tripwires + emission ledger + closure obligations + ambient plans + halt-condition predicates + canonical-pipeline routing. These are the equivalent of Linear's project-model. The substrate is shipped; the v2 wires INTO it, doesn't replicate it.

**How the spine maintains course toward north-star:**

- **Cached restatement at every layer** (the universal pattern). Every brief opens with `Canon:` block dereferencing the gate-0-approved philosophy + Cena company canon + project canon. Every spec opens with `Brief:` block dereferencing the brief sections. Every wireframe opens with `IA:` block dereferencing the IA primitives. The chain restates the why at every transition.
- **View blocks** (per `views.md`) on key plan-artifacts so the cached restatements fail loudly when their source drifts. The `rendered-at` hash + `views-audit.sh` is the falsifiability mechanism that the five researched companies don't have. Cena leans on it.
- **Pipeline Steward as the carrier of the cross-stage continuity.** When the run hits slot-22 build, the Steward verifies the brief's philosophy is still operative (the Rewind A failure shape — brief framing got softened across the chain).

**How the spine ensures things don't get missed:**

The Cena v2 runs **five layered detection mechanisms** (matching the Airbnb + Headspace depth):

1. **Mechanical gates** (G-M-1 through G-M-10 above) — fire deterministically; catch structural misses.
2. **Pipeline Steward dispatches** — per-slot expert dispatches verify the slot's gate ceremony fired; missing dispatches halt the next slot.
3. **4-expert panel for Tier 1 brand-fidelity-weighted work** — concentrates cross-discipline review; catches craft + brand + accessibility + DS-canon misses.
4. **Persona-Calibration Reviewer + Clinical Safety Reviewer at patient surfaces** — catches population-calibration + clinical-safety misses.
5. **Aaron cold-look at slot-30** — the Witt-analog backstop; catches taste + brief-philosophy misses.

Plus the continuous parallel signal channel:

6. **Vault Inbox + agent debrief logs + `/meta` retros** — friction-pattern emergence triggers rule-promotion candidates. This is the Stripe-friction-log + Headspace-Monthly-Link analog.

Six layers, each catching a different miss class. The Cena v2 matches the layered-discipline depth of Airbnb and Headspace.

**Implementable at Cena's 3-person + agent-collective scale TODAY:**

The Day-1 MVP runs five layers (the sixth is already running). No new staff required; the Pipeline Steward + Persona-Calibration Reviewer + Clinical Safety Reviewer are agent experts authored once and dispatched per-run. Aaron's executive load is one slot-30 cold-look per run + Gate-0 sign-off per run + Tier 1 panel-result review. This is implementable at Cena's scale; it earns its keep at Cena's scale; it does not require Linear's 1 PM / Airbnb's 5-team DesignOps pillar / Figma's 22 PMs.

### Staging strategy: Day-1 MVP + maturation path

The Day-1 MVP earns its keep because the gates close real failure shapes the vault failure log named. The maturation path adds detection layers + role concretizations when the recurrence demands them.

#### Day-1 MVP (non-negotiable from the start)

- **All universal gates (G-A through G-H)** — already substantially in place via existing vault rules + haven-ui discipline.
- **Mechanical gates G-M-1 (wireframe-vs-PL delta), G-M-2 (canonical-mock), G-M-3 (brief-constraint coverage), G-M-4 (IA-primitive composition), G-M-5 (softening-detection invariant tripwire), G-M-6 (Gate-0 philosophy), G-M-7 (canonical-pipeline routing), G-M-8 (slot-prerequisite check), G-M-9 (render-environment fidelity), G-M-10 (mode-declaration)** — Day-1. Mechanical means low marginal cost; the discipline is already coded.
- **G-Clin-A (persona-calibration discipline, layered)** — Day-1 for patient surfaces. UConn pilot is the first instance; the discipline cannot wait.
- **G-Clin-B (clinical-accuracy verification on clinically-loaded content)** — Day-1 for patient surfaces.
- **Pipeline Steward expert** — Day-1. Without it, no role owns the cross-stage continuity.
- **Persona-Calibration Reviewer expert** — Day-1 for patient surfaces.
- **Clinical Safety Reviewer expert** — Day-1 for patient surfaces.
- **5-attribute frame applied to every artifact spec** — Day-1. The deterministic contract.

#### Maturation path (can-wait; trigger conditions named)

- **G-Clin-C (AI-generated patient-content safety check; automated risk-classifier)** — wait. Day-1 fires this via Clinical Safety Reviewer dispatches (Aaron + Vanessa review); a proprietary safety classifier earns its keep when patient-app surfaces ship enough AI-generated content that human dispatch becomes the bottleneck. Trigger: ≥20 AI-content emissions/week.
- **Outcome measurement (G-F variants — A/B testing infrastructure)** — wait. Day-1 verification is structural + adequacy + judgment. A/B testing earns its keep at scale (Headspace stage, not UConn pilot). Trigger: ≥1000 patient users sustained.
- **Multi-substrate Witt-analog at Cena scale (Headspace four-loci)** — wait. Day-1 = Aaron + Pipeline Steward holds the executive layer. Splitting into named loci (design + product + content + clinical) earns its keep when Cena grows past 5 humans. Trigger: 5th human hire.
- **Stripe-shape writing-substrate ceremonies (Red Pens editors, Google Groups by artifact type)** — wait. Day-1 = the vault registries + emission ledger + inbox handle distribution. Trigger: ≥50 simultaneous active plan artifacts (substantially more than today).
- **Airbnb-shape DesignOps five-team pillar (Program Management / Tools / Localization / Production Design / Team Coordinators)** — wait. Trigger: 15+ humans on the team; multiple parallel product lines.

The maturation path is named so future-Aaron can recognize the trigger when it fires; Day-1 implementation doesn't pretend to need it.

#### Cost-explicit honest costs

Gates that add latency but are non-negotiable for vulnerable-population safety:

- **G-Clin-A (persona-calibration layered discipline)** — adds reviewer-dispatch latency at four slots (5, 7, 17, 30). Honest cost: ~30% increase in patient-surface pipeline duration. **Non-negotiable for UConn pilot population.**
- **G-Clin-B (clinical-accuracy verification)** — adds Clinical Safety Reviewer dispatch latency at any clinically-loaded content slot. Honest cost: ~10–20% increase for patient surfaces. **Non-negotiable.**
- **Gate-0 (brief-philosophy alignment)** — adds front-loaded delay before slot-1 fires. Honest cost: 1 Aaron review per brief. **Non-negotiable** per the Rewind A diagnosis (catches the failure shape Rewind A surfaced).

Gates that earn their keep through mechanical low-cost firing:

- **G-M-1 through G-M-10** — mechanical means near-zero marginal cost per run. The discipline is in the tooling, not in human time.

---

## Q5b — Past-failure mitigation ledger (the falsifiability check)

The vault-failure-log named 15 distinct failure shapes + 3 meta-shapes. The v2 architecture must, for each, name a specific gate that prevents it OR explicitly accept the failure with rationale. NO failure shape is silently absent.

### The 15 failure shapes (each gets a row)

| # | Failure shape | Disposition | Named gate(s) preventing |
|---|---|---|---|
| 1 | **Downstream-slot silently softens upstream constraint** (food-image-via-placeholder; 2026-06-10) | Prevented | G-M-3 (brief-constraint coverage) + G-M-5 (softening-detection invariant tripwire) + slot-19 acceptance criteria consuming brief Sections 4/5/6 directly. Pipeline-coverage-gate.md is the existing rule; v2 makes it a fired gate. |
| 2 | **Brief framing itself is wrong** (430px-locked mobile-only; 2026-06-10 → 11) | Prevented | Gate-0 (brief-philosophy alignment) + G-M-6 (philosophy-language detection) + Aaron sign-off on philosophy reframe. This is the Gate-0 candidate Aaron flagged. |
| 3 | **Canon-misalignment** (`.mobile-app` body class; custom-coded top-tabs; 2026-06-11 Rewind C) | Prevented | G-M-1 (wireframe-vs-PL delta) + G-C (design system token-contract) + design-system-steward dispatch at slot-7 + haven-mapper skill running at slot-11→17. Wireframe-named primitive that doesn't resolve to PL halts; can only proceed after promotion-to-PL ceremony (`haven-primitive-codification.md`). |
| 4 | **UX-adequacy gap — persona-calibration missing for vulnerable populations** (2026-06-11 Rewind C, structural failure 5 of 5) | Prevented | G-Clin-A (persona-calibration discipline, layered at slots 5/7/17/30) + Persona-Calibration Reviewer expert. Discipline is layered (5 mechanisms) not single-checkpoint; matches Headspace + Airbnb depth. |
| 5 | **Component-level layout discipline gap** (patient-focus-card horizontal layout breaks on mobile; 2026-06-11) | Prevented | Slot-17 component-spec contract: every wireframe-named primitive must specify (a) internal layout at each named viewport, OR (b) explicit reference to PL fragment's documented behavior. The PL fragment is authority; spec dereferences it. Mechanical via spec-vs-PL fragment hash check at slot-22 build entry. |
| 6 | **Consumer-surface invisibility** (escalation/glossary-term landed in components.css but SoP render pipeline never wired; 2026-06-07) | Prevented | G-C (design-system token-contract) + `haven-primitive-codification.md`'s five-place codification gate (PL + COMPONENT-INDEX + brand spec + consumer-surface references + render-pipeline verification). Already shipped as the haven-ui rule; v2 makes it a runtime gate. |
| 7 | **Pipeline fork — agent runs deprecated/forked workflow instead of canonical** (2026-05-24) | Prevented | G-M-7 (canonical-pipeline routing) + `Lab/haven-ui/CLAUDE.md` warning banner + invariant tripwire pinning absence of "run the local agent-workflow" instruction. Already shipped; v2 inherits. |
| 8 | **Expert dispatch skips upstream pipeline slots** (HVD dispatched at slot-11 without slots 1-10; 2026-06-09) | Prevented | G-M-8 (slot-prerequisite check) + Pipeline Steward dispatch discipline. Expert refuses slot-N authoring when slot-N's named `consumes:` upstream prerequisites are absent. |
| 9 | **Canon-propagation drift — registry of consumers absent** (sand-warming color canon; 2026-05-30; 14 of 21 consumers missed) | Prevented | The `haven-canon-propagation-workflow.md` plan ships the canon-consumer registry + `.haven-consumer.json` per consumer + `sync.mjs` orchestrator + `/qa` unregistered-consumer scan. **The v2 inherits this discipline.** Pipeline Steward owns the canon-propagation check at slot-30 verification when canon changes are in flight. |
| 10 | **Acceptance criteria derived from wireframes, not from brief** (slot-19 never asserted negative-space; 2026-06-10) | Prevented | Slot-19 `consumes:` declaration includes brief Sections 4 (scope-in), 5 (scope-out), 6 (constraints) DIRECTLY in addition to slot-11 wireframes. Pipeline-coverage-gate's gate-1 enforces this at acceptance layer. |
| 11 | **Catalog-first miss in synthesis-class UI work** (UConn meal-flow second reset; 2026-06-09) | Prevented | `catalog-first.md`'s thread-entry trigger + G-M-8 (slot-prerequisite check). At every slot's entry, query canonical sources (project-index, surface's flows/wireframes folder, capability inventory, COMPONENT-INDEX). Pipeline Steward dispatch verifies the query fired. |
| 12 | **Render-environment fidelity gap** (qlmanage vs. Google Docs; 2026-06-04) | **Accepted** | The `haven-emission-pipeline-optimization.md` already shipped the partner-environment-QA-discipline lock for the docx surface. For haven-ui's web surfaces, G-M-9 (render-environment fidelity) requires verification in target browsers. The web-surface version is already mechanical (Playwright + browser-targeted dev servers). **Accepted because the discipline already operates at the right layer (per-pipeline emission specifics, not v2 spine).** v2's role is to require the gate exists; the specific implementation is per-pipeline. |
| 13 | **Mode-confusion in expert dispatch** (HVD Mode B build when intent was Mode A demo; 2026-06-09) | Prevented | G-M-10 (mode-declaration in dispatch envelope). Every expert dispatch envelope names canonical-artifact vs. demo-shape mode. Pipeline Steward dispatch template enforces. |
| 14 | **Instance pages as flat all-states demos, not navigable flows** (slice-2 returning-patient.html; 2026-06-09) | Prevented | Output-shape declaration at slot-22 build authoring: (a) flat-reference or (b) navigable-spine. Verification gates accordingly. Sibling to emission-regime-scouting. |
| 15 | **Invented dummy data when canonical mock structures exist** (kitchens + cena-staff; 2026-06-09) | Prevented | G-M-2 (canonical-mock presence) at slot-22. Mechanical grep + import-resolution check. No fabricated literals. |

### The 3 meta-shapes (each gets a row)

| Meta-shape | Disposition | Named gate(s) preventing |
|---|---|---|
| **M-1. Constraint or canon exists upstream but downstream slot does not consume it** (instances: 1, 3, 5, 6, 9, 10, 15) | Prevented | The deterministic-contract discipline (`generative-determinism.md`) operationalized via G-M-1 through G-M-4 + G-M-8 + the slot's `consumes:` declaration. Pipeline Steward verifies every slot's dispatch dereferences its declared upstream artifacts. |
| **M-2. Brief or framing is wrong before downstream fidelity even matters** (instances: 2, 13) | Prevented | Gate-0 (brief-philosophy alignment, fired before slot-1) + G-M-6 (philosophy-language detection) + G-M-10 (mode-declaration in expert dispatch). Both fire pre-pipeline; both are mechanical-then-Aaron-confirm. |
| **M-3. Pipeline existed; pipeline wasn't run** (instances: 7, 8, 11) | Prevented | G-M-7 (canonical-pipeline routing at entry) + G-M-8 (slot-prerequisite check) + `catalog-first.md`'s thread-entry trigger. Pipeline Steward dispatch discipline at thread entry. All three already shipped or shipping with v2. |

### Falsifiability claim

The Q5b ledger covers all 15 failure shapes (14 prevented + 1 accepted with rationale) and all 3 meta-shapes (3 prevented). **No failure shape is silently absent. The accepted failure (#12) names the specific layer where the discipline operates (haven-emission-pipeline-optimization.md), confirms it already exists, and explicitly does NOT silently defer.**

This is the falsifiability check Aaron's Phase 1-R.d review consumes paired with Q5a. If the v2 ships and a previously-named failure shape recurs, the failure is the gate not firing — not the failure shape being unknown. The v2 takes responsibility for every named shape.

---

## Reading order for Aaron

1. **This file's executive summary** (top — 300 words) for the headline architecture call
2. **Q5a pipeline shape** for the one-pipeline-with-overlay decision
3. **Q5b mitigation ledger** for the falsifiability check
4. **Coordination/orchestration layer (the spine)** for the vault-substrate-IS-the-spine call + the Pipeline Steward role need
5. **Staging strategy** for Day-1 vs. maturation
6. **Roles section** for the existing-experts-cited + proposed-experts-named decision points
7. **Per-artifact 5-attribute specs** for the deterministic contract that Phase 2-R per-pipeline DWG runs fill

### Specific decision points Aaron's Phase 1-R.d review owns

- **Architecture: one pipeline + overlay, or N separate pipelines?** Recommendation: one pipeline with three sub-shapes (Tier 1/2/3) + clinical-context overlay. Defended above.
- **Pipeline Steward expert: vault-tier or project-tier?** Recommendation: vault-tier (cross-cutting). Defended via expert-placement subsidiarity.
- **Clinical Safety Reviewer + Persona-Calibration Reviewer: project-tier (Cena) or vault-tier?** Recommendation: project-tier for both, Day 1. Promote on second consumer per expert-placement.
- **Day-1 MVP scope: all mechanical gates Day-1, or stage?** Recommendation: all mechanical gates Day-1. Marginal cost is near-zero once authored.
- **Maturation triggers: are the named trigger conditions right?** Recommendation: yes, but Aaron's call — each trigger is a hypothesis.
- **5-attribute frame template for Phase 2-R DWG fill: locked, or revisable?** Recommendation: locked for v2; revision lands as a v3 candidate if Phase 2-R reveals frame inadequacy.
