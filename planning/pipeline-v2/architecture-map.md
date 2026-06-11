# haven-ui-pipeline-v2 — architecture map

**Phase:** 1-R.c synthesis (Q1–Q4 of the discovery-brief synthesis frame)
**Authoring expert:** [Workflow Designer](../../../../experts/workflow-designer.md)
**Paired with:** [cena-recommendation.md](./cena-recommendation.md) (Q5a + Q5b)
**Inputs:** Five company research files (`research/companies/{stripe,linear,figma,airbnb,headspace-health}.md`) + `research/vault-failure-log.md` + `research/discovery-brief.md`
**Status:** draft for Aaron review (Phase 1-R.d gate)

---

## Executive summary

The headline finding is structural and uniform across five very different companies: **the coordination/orchestration layer is a SUBSTRATE, not a PMO role.** None of the five mature, design-led teams maintains a dedicated cross-pipeline PM function as the load-bearing coordination primitive. The work that "a PMO would do" is instead carried by some combination of (a) a persistent written canon every artifact references; (b) a tool primitive that encodes discipline at the entity level; (c) a small set of boundary roles holding cross-product judgment; (d) a small set of forcing-function gates; (e) a recurring cadence anchored to written artifacts; and (f) one judgment-tier executive backstop. Each company picks a different substrate shape — Stripe's writing culture, Linear's project-model, Figma's PRD-with-live-embeds + Project Tracker auto-sync, Airbnb's DesignOps + storyboard-on-the-wall + DLS contract, Headspace's four-loci distribution — but the substrate-over-role finding is universal.

The artifact chains converge on a stable seven-step shape (canon → discovery → brief/spec → design → implementation → ship-gate → post-ship learning) with two main divergences: (1) **handoff fusion** — companies vary on whether design→engineering is a handoff (Stripe's eng design doc → API Review forum) or no handoff (Linear's "there's no handoff to dev"; Figma's "the design file IS the spec"); and (2) **clinical-track parallelism** — Headspace alone runs a parallel clinical track that intersects the design track at five named merge points (intake routing, AI safety, guided-program co-authoring, QA layer, executive level).

Eight gate shapes recur as universal-or-near-universal across the four software picks; Headspace adds five clinical gates with strikingly mechanical falsifiability (100% AI message monitoring; 100% clinical-notes audit; RCT-per-guided-program; validated-instruments-as-canon; algorithmic acuity routing). The clinical gates land in a parallel-track-with-coordinated-handoffs relationship to design, not as design-gated-by-clinical. **Persona-calibration for vulnerable users is a LAYERED discipline at all the design-celebrated companies — not a single checkpoint** (Airbnb's worst-case-scenario storyboard + Another Lens deck + DesignOps localization + accessibility team; Headspace's validated screening + algorithmic routing + acute-state UI adaptation + 24/7 navigation + AI safety monitoring). The most-load-bearing cross-cutting finding for Cena is that *all five companies operate a north-star-as-cached-canon-referenced-everywhere mechanism*, but the cached-vs-rendered axis (vault `views.md`) is invisible to all of them — Cena's vault substrate is structurally further along on this axis than any of the five.

---

## Q1 — Chain shape: convergence with two named divergences

### What's universal across all five picks

Every chain has roughly the same seven slots, named differently per company:

| Universal slot | Stripe | Linear | Figma | Airbnb | Headspace |
|---|---|---|---|---|---|
| **1. Persistent canon** | Operating Principles + 5-Year Plan + How-We-Operate manual | Annual direction + Linear Method | Headlines (claim-shaped goals, not OKRs) | Mission + brand canon + DLS principles (Unified/Universal/Iconic/Conversational) | Brand personality principles (Hopeful/Visionary/Approachable/Reliable) + AI principles + outcome-over-engagement north-star |
| **2. Discovery / problem framing** | Shaping doc | Project plan (exploratory) | Maker Week pitch / problem signal | User research + storyboard | Generative research + concept brief |
| **3. Brief / spec** | Kickoff memo / PRD | Project spec (1–2 pages, "why what how") | PRD (Problem Alignment / Solution Alignment / Launch Readiness with live Figma embeds) | EPD-triad-aligned wireframes/prototypes | Concept-test design + diary-study prototype |
| **4. Design (composes against the canon)** | Eng design doc + design files | Designer + engineer co-author embedded in project | Figma file + prototype = the spec | DLS-aligned screens + production-design pass | High-fidelity Figma spec using tokens |
| **5. Implementation (consumes the design)** | Code review + feature flags + gradual rollout | Engineer-led implementation; "no handoff to dev" | Dev Mode + Code Connect + MCP for IDE | Production engineering consuming DLS | Engineering via Dev Mode handoff |
| **6. Ship gate** | Product review (pre-ship) | "Engineers feel the project is ready" | Product review (Field + Yamashita) + Launch-Readiness auto-checklist | Pre-ship founder-mode review (Chesky post-2020) + A/B test | A/B test → outcome metric (healthy outcomes, not engagement) |
| **7. Post-ship learning** | Retrospective + Shipped doc (org-wide Google Group) | Changelog + zero-bugs policy + Triage rotation | Project-level retrospective (engineering values) | Post-ship research → next cycle | Outcome data → product/ops/research/data-science (cross-team feed) |

The convergence is real. The naming and the substrate differ; the slot shape does not.

### Divergence 1 — Handoff fusion vs. handoff ceremony

Two genuinely different shapes appear in slot 4→5:

- **Handoff-ceremony shape** (Stripe): design → engineering crosses a named gate (API Review forum + eng design doc). The handoff is a forum, not a translation — engineering authors its own design doc that the API Review committee gates. Stripe's API-shaped product makes this natural: the API IS the surface, so the engineering doc IS the design.
- **Handoff-fusion shape** (Linear, Figma, Airbnb, Headspace): design and engineering work in continuous parallel from the spec stage forward. Karri Saarinen: "there's no handoff to dev." Figma: "the design file IS the spec." Airbnb's EPD triad: "Each function is involved and aligned from a product's inception to its launch." Headspace: Dev Mode + 85% token utilization removes the translation step.

The fusion shape is **the dominant pattern at design-led teams.** Stripe's handoff ceremony fits because the discipline lives in the *writing substrate* — every artifact across the API surface is a written doc that everyone can read, so the handoff is a doc-to-doc transition, not a design-to-spec translation.

**For Cena:** the [feedback_handoff_friction] memory ("framework-translation handoffs are where quality dies") tracks exactly this finding. The four fusion-shape companies removed *design-to-spec* handoffs but four of five still have *spec-to-port* translation when shipping to a framework. Cena's chosen response (haven-ui pattern-library as framework-agnostic spec; React port as 1:1 mechanical port) is the same shape as Figma's tokens-via-variables + Code Connect — the spec IS the source-of-truth, the port is mechanical.

### Divergence 2 — Clinical-track parallelism (Headspace only)

Headspace is the only pick with a true parallel track. The design chain runs as expected (slots 1–7 above); a clinical chain runs alongside, intersecting at **five named merge points**:

1. **Intake/routing** — validated assessments (PHQ-4, PHQ-9, GAD-7) gate which surface the member sees; design composes the form UX, clinical owns the instruments + thresholds.
2. **AI conversation surface** — clinical psychologists train Ebb's persona + guardrails; design + copy own the interface + voice. Co-authored.
3. **Guided-program surface** — clinical lead + mindfulness teacher co-author the program; design + copy compose into the product.
4. **QA layer** — 100% clinical-notes audit + 100% AI-message monitoring; continuous, not ship-gates.
5. **Executive level** — Dr. Glover (clinical) + Leslie Witt (product/design) + Dr. Purvis (science) hold separate accountabilities that meet at outcomes.

**The structural insight is decisive: clinical does NOT gate design, and design does NOT gate clinical.** They are parallel with coordinated handoffs at the merge points. The reconciliation happens at the outcomes layer (Witt's unified P&L authority).

For Cena's UConn pilot: this is the answer to the clinical-context question. The Cena pipeline is design-led (Aaron is the principal designer with 25 years' UX experience); clinical accountability adds parallel checkpoints (Vanessa, Soto, Morales, partner-institution clinicians) that meet design at intake routing, copy/persona calibration, and outcome measurement — without sequentially gating design work.

---

## Q2 — Load-bearing gates (universal, vertical-specific, company-specific)

### Universal gates (every team has this shape)

These appear in some form at all five companies. They are the **non-negotiable floor** of any mature design-led pipeline:

| Gate | Shape | Falsifiability | Halting role |
|---|---|---|---|
| **G-A. Persistent canon referenced by every downstream artifact** | Brief / spec opens with a cached restatement of the why; reviewers check ship against the original framing | Soft (judgment) — the artifact's *existence* is mechanical | Author + reviewer; any reviewer can flag "this drifts from canon" |
| **G-B. No meeting without a circulated written artifact** | Doc precedes the conversation; meeting reads against the doc | Hard (yes/no — the doc exists or it doesn't) | Anyone in the meeting |
| **G-C. Design system as token-contract between design and engineering** | Variables/tokens (Figma variables; Linear's PL primitives; Airbnb's DLS components; Headspace's Aperçu + Emotional/Functional palettes; haven-ui's `components.css`) replace translation with reference | Mechanical (does the design compose from tokens? — see Figma's 85% utilization metric) | Design system steward + (sometimes) automated CI |
| **G-D. Non-blocking peer feedback cadence (crits)** | Design crit + eng crit explicitly NOT approval; surface missed considerations early | Soft (the gate's *existence* is the discipline; the feedback is judgment) | Nobody single — culture-enforced |
| **G-E. Executive judgment gate at strategic milestones** | One human (or 2–3 humans) holds final taste/direction call: Field+Yamashita, Karri, Chesky, Witt, the API Review governance | Soft (judgment) — but the gate is real and halting | Named executive(s) |
| **G-F. Outcome-measurement (or equivalent ship-gate)** | A/B test + outcome metric; engagement is floor, not ceiling (Headspace); "engineers feel ready" (Linear); Launch Readiness auto-checklist (Figma) | Mixed (A/B is mechanical; "feel ready" is judgment) | PM + Eng + Designer |
| **G-G. Post-ship retrospective (or institutional learning artifact)** | Shipped doc, retrospective, changelog, outcome-data feed; visible org-wide | Soft (the *artifact's existence and visibility* is the discipline) | Team-level + org-level reader |
| **G-H. Continuous quality channel (parallel to chain, not gated by it)** | Friction logs (Stripe), zero-bugs + goalie (Linear), eng crit (Figma), bi-weekly crit pods (Airbnb), Monthly Link (Headspace) | Mixed — log existence is mechanical; follow-through is judgment | Any employee can file; team triages |

### Vertical-specific gates (Headspace-only; Cena needs IF UConn pilot serves vulnerable patients)

These are the clinical gates Headspace operates. They are **mechanically falsifiable in ways the design-celebrated companies don't match** — and they answer Aaron's "vulnerable patient population, mixed/low tech-literacy, some ESL, partly food-insecure" framing for UConn.

| Gate | Shape | Falsifiability | Cena need (UConn pilot) |
|---|---|---|---|
| **G-Clin-1. Validated-instrument canon** | PHQ-9/GAD-7/etc. are inputs design does NOT redesign; UX composes them without harming psychometric properties | Mechanical (the instrument is canon; design doesn't get to deviate) | Partial — Cena does not screen with PHQ-9 today; but the *principle* (clinical canon = inputs that resist designer redesign) applies to clinical-accuracy gates on any clinically-loaded content |
| **G-Clin-2. RCT-per-guided-program** | Every clinically-loaded program gets an RCT before broad scale | Hard (RCT results) | Out-of-scope for UConn pilot N (50–100 patients); but the *principle* (clinical claims require evidence before they ship) applies to copy that promises clinical benefit |
| **G-Clin-3. 100%-AI-message safety monitoring + clinician review of flagged content** | Every AI-generated message scanned by a risk model; flagged → deidentified → licensed clinician review | Mechanical (the monitor runs on every message; the review log records) | **Load-bearing for Cena's AVA agent surface** — when Ava generates patient-facing content, a clinical-safety check (proprietary or partner-institution-clinician-on-call) gates emission |
| **G-Clin-4. Clinical-notes audit (100%)** | Every clinical note audited for evidence-based standards | Mechanical (100% coverage) | Partial — applies to provider-facing surfaces; not the patient app today |
| **G-Clin-5. Algorithmic routing on acuity** | Member's PHQ-9 item-9 → conditional C-SSRS trigger → escalation; algorithm + human override | Mechanical (the routing logic is auditable) | Partial — applies if Cena surfaces clinical assessments at intake |

### Company-specific gates (clever but not propagated)

These are interesting but **not load-bearing** for Cena — they're idiomatic to one company's substrate:

- **Stripe's API Review forum** — works because the API surface is the product; halts cross-product API divergence. Cena's analog would be the haven-ui design-system-steward expert (already shipped).
- **Linear's cycle auto-advance** — software primitive that prevents date-slippage. Cena's equivalent would require a similar tool primitive; the vault substrate doesn't currently have time-boxed cycles, but `closure-obligations.md` is the partial analog (gate + halting + traceability).
- **Figma's PRD-with-embedded-live-Figma-files** — collapses the doc/spec/design translation. Cena could replicate (markdown + view blocks per `views.md` is the closest vault substrate primitive).
- **Airbnb's DesignOps five-team pillar (Program Management / Tools / Localization / Production Design / Team Coordinators)** — only earns its keep at scale Cena does not have. **Cena should not replicate Day 1.**
- **Airbnb's storyboard-on-the-wall (Snow White practice)** — load-bearing as a north-star anchor that resists drift; Aaron has a 25-year UX history that already produces this naturally.
- **Headspace's "four personality principles" voice-scaling primitive** — lets one voice serve clinical + playful surfaces. The Cena/Haven canon has a structural analog (the design system's restraint-defined visual canon serves both warm patient surfaces and clinical clarity).

---

## Q3 — Coordination/orchestration layer (THE SPINE)

This is the load-bearing section. Aaron's framing: "in addition to all the steps and artifacts I'm going to be looking at the resulting plan and thinking about how we will maintain course towards the north star of the initial brief as we go through the stages and how we make sure things don't get missed."

### The headline finding — substrate-over-PMO-role is universal

**None of the five companies maintains a dedicated cross-pipeline PM coordination role as the load-bearing primitive.** All five distribute coordination across (a) a substrate every artifact lives inside; (b) a small set of boundary roles; (c) a small set of forcing-function gates; (d) a small persistent canon; (e) a small set of recurring ceremonies; (f) one executive backstop.

This holds across radically different scales: Stripe (~7000 employees, 100+ PMs), Figma (~22 PMs, ~200 engineers), Linear (1 PM/~25 engineers), Airbnb (1:6 to 1:8 designer-to-engineer ratio with full DesignOps pillar), Headspace (no centralized PM-coordination role described publicly).

### Detailed mechanics per company

**Stripe — the writing substrate IS the coordination layer.**
- Substrate: writing culture; no meeting without a circulated doc; Google Groups organized by artifact type (not by team)
- Canon: 3-doc persistent canon (Operating Principles + 5-Year Plan + How-We-Operate manual)
- Forcing-function gate: API Review (the canonical cross-product hard gate)
- Boundary roles: Product Architects (Bu) for cross-product API consistency; Foundation Engineering Lead (Larson) for cross-product strategy; Documentation Manager (Nunez); Red Pens editors (high-leverage docs)
- Cadence: heavyweight biannual planning + weekly ops review + state emails + shipped docs + retros
- Executive backstop: Patrick Collison's footnoted-email modeling + COO/CTO modeling ("See one, do one, teach one")
- Missed-thing detection: (1) Gavel blocks at design-doc head name stakeholders structurally; (2) friction logs anyone can file continuously; (3) open-question bottom of state emails surfaces stuck-points cross-team

**Linear — the tool primitive IS the coordination layer.**
- Substrate: Linear itself (Initiative → Project → Cycle → Issue + Triage + Cooldown entities)
- Canon: 12-month direction document + Linear Method (14 practices)
- Forcing-function gate: cycle auto-advance (the only mechanical halt in the stack — the cycle ends, period)
- Boundary roles: Head of Product (Nan Yu) for cross-team connection; rotating Goalie for triage accountability; CX team for customer-voice translation
- Cadence: weekly project updates + weekly product meeting + weekly goalie rotation + monthly all-hands + Quality Wednesdays + annual planning + annual offsite
- Executive backstop: Karri's taste as principal-designer + founder
- Missed-thing detection: (1) Triage as typed inbox (CX intake auto-routes); (2) goalie rotation rotates accountability weekly; (3) feature roast in weekly product meeting catches in-progress drift

**Figma — coordination is embedded in artifacts, not held by a PMO role.**
- Substrate: PRD-with-embedded-live-Figma-files + auto-synced Project Tracker (auto-updates without manual entry)
- Canon: Yamashita's 3-section PRD template (Problem Alignment / Solution Alignment / Launch Readiness); the design-system (Figma variables + Code Connect + GitHub Action)
- Forcing-function gates: variable scoping (mechanical — Dev Mode); Code Connect mapping (mechanical); GitHub Action on library publish (mechanical); product review with Field + Yamashita (judgment, load-bearing)
- Boundary roles: PMs using Figma Make as authoring tool (collapsing PRD→design→eng chain); Design Systems team (live contract); Content Designer (parallel-authored from outset); acqui-hired Visly DE expertise (absorbed into tools)
- Cadence: weekly crit slots (Wednesday + Friday 30min; Tech-pillars Tuesday + Editor/Non-Editor Thursday + All-design Friday — possibly two reads of same schedule); biannual planning; quarterly adjustments; Maker Week twice yearly
- Executive backstop: Field + Yamashita at product review
- Missed-thing detection: (1) Project Tracker auto-sync surfaces missing rows in PRD; (2) non-blocking crits surface in-progress missed considerations; (3) launch-readiness notifications fire on criteria met (not chased); (4) internal dogfooding (DS team uses Dev Mode; Yamashita used Slides for Sales Kickoff before ship)

**Airbnb — multi-substrate spine with DesignOps as the cross-pipeline anti-drift mechanism.**
- Substrate: storyboard-on-the-wall (durable across months) + DLS as transverse contract + DesignOps pillar as scaffolding
- Canon: mission + brand voice + DLS four principles (Unified/Universal/Iconic/Conversational) + archetypal-journey + variant-journey storyboards; Another Lens 15-card bias-check deck
- Forcing-function gates: DLS contribution proposal flow (proposal → implementation → accessibility review → release) + A/B test + Chesky's "founder mode" pre-ship review
- Boundary roles: Production Designers (10:1 ratio with Experience Designers) maintaining DLS; Design Engineers / Design Technologists (Jon Gold, Lottie + React Sketch.app + Lona); DesignOps Program Manager; Localization team; Team Coordinator
- Cadence: weekly full-design-team standup + bi-weekly crit pods (8–10 people, organized Guest Love / Hosts and Homes / Product Growth) + periodic Head-of-Experience review + executive reviews with Chesky for majors
- Executive backstop: Chesky's "founder mode" (post-2020) — pulls product decisions in; rewrites copy mid-meeting; "the more people and projects were pursued, the less the app changed"
- Missed-thing detection: (1) storyboard surfaces missed *moments*; (2) crit pods surface missed *craft*; (3) Another Lens surfaces missed *biases*; (4) DesignOps surfaces missed *system drift*; (5) Chesky review backstops missed *taste*. **Five layered checks, each catching a different miss class.**

**Headspace — coordination distributed across four loci, no centralized role.**
- Substrate: distributed — no single substrate carries it
- Canon: brand-personality-principles (Hopeful/Visionary/Approachable/Reliable); AI principles; outcome-over-engagement north-star; the design-system tokens (multi-brand Headspace + Headspace Care)
- Forcing-function gates: validated-instrument-as-canon; RCT-per-program; 100%-AI-message-monitoring; clinical-notes audit; algorithmic acuity routing
- Boundary roles: Behavioral Science team (Purvis) bridging clinical psychology ↔ product; Design Systems steward (Sczepanik) bridging design ↔ engineering; Care navigation team bridging product UX ↔ clinical operations; UX Copywriter/Content Designer bridging design ↔ brand voice ↔ clinical safety
- Cadence: biweekly team meetings + monthly leadership showcases (Thompson) + The Monthly Link (Cayabyab, cross-product coherence check) + weekly "warmup" (all current work in Figma) + "the sandbox" (collaborative problem-solving) + "work that is not work" (culture rituals)
- Executive backstop: Leslie Witt's unified P&L authority (design + product + content + brand + science under one role)
- Missed-thing detection: (1) The Monthly Link catches parallel-experiments-don't-add-up-to-coherent-journey; (2) algorithmic acuity routing catches acute-state members; (3) AI safety monitoring catches AI-conversation risk; (4) clinical-notes audit catches provider-side drift; (5) Witt's unified-authority cognitive load catches cross-discipline drift

### Named patterns across them

Comparing the five mechanics, three patterns emerge:

**Pattern P-1 — Substrate-shape determines what coordination looks like.**
- Writing-substrate (Stripe) → many small ceremonies + many distribution channels organized by artifact type + a few boundary roles + a few hard gates
- Tool-primitive-substrate (Linear) → coordination embedded in the tool entity model; minimal ceremony; software does what meetings would otherwise do
- Multi-substrate (Airbnb) → DesignOps pillar as the explicit cross-pipeline anti-drift function; storyboard as durable north-star anchor; layered checks each catching a different miss class
- Distributed-loci (Headspace) → no single substrate; unified executive authority (Witt) is the glue
- Embedded-artifact-substrate (Figma) → PRD-with-live-embeds + auto-sync removes translation drift; coordination IS the artifact's live-update behavior

**Pattern P-2 — Missed-thing detection is always LAYERED, never a single check.**
Every company runs ≥3 detection mechanisms in parallel:
- Stripe: gavel blocks (structural) + friction logs (continuous parallel) + open-question state emails (cross-team)
- Linear: Triage typed inbox + goalie rotation + feature roast
- Figma: Project Tracker auto-sync + non-blocking crits + launch-readiness notifications + dogfooding
- Airbnb: storyboard (moments) + crit (craft) + Another Lens (biases) + DesignOps (system drift) + Chesky review (taste)
- Headspace: Monthly Link + algorithmic routing + AI safety monitoring + clinical-notes audit + Witt's unified-authority load

**The Cena implication is direct: a single "did we miss anything" gate at any point in the pipeline will not catch the failure shapes the v2 needs to catch. Multiple layered detection mechanisms, each catching a different miss class, is the architecture.**

**Pattern P-3 — North-star maintenance is "cached restatement at every layer," not "PM watches the roadmap."**
All five companies maintain course toward the original brief through *structural restatement* — every artifact carries a cached version of "why we're doing this":
- Stripe: Operating Principles + 5-Year Plan cited continuously; "could recite verbatim"
- Linear: project spec opens with "why"; initiative entity carries objective forward
- Figma: PRD Problem Alignment is canonical; headlines are claim-shaped (not task-shaped)
- Airbnb: storyboard on the wall stays up for months; EPD triad means no role loses the thread
- Headspace: outcome-metrics (PHQ-9 change scores) as the north-star; reread continuously through O4 data feed

**No company "has a PM checking convergence quarterly."** The cached restatement IS the convergence mechanism. The vault's `views.md` rule (cached-value-vs-rendered-view) is structurally the same shape — and Cena is the only one of the six with a deterministic-detection mechanism for this drift (the `rendered-at` hash + `views-audit.sh`).

### Comparison of substrate-shapes

| Substrate | Strength | Honest cost | Cena maps to... |
|---|---|---|---|
| **Writing-substrate (Stripe)** | High legibility across teams; coordination is in the medium; canon read continuously | Presupposes 100+ people and a writing-discipline modeling cost (Red Pens editors, Collison footnote-modeling, CFO-corrects-postmortem-terminology) | Vault writing substrate (markdown + entity docs + views + emit ledger) + agent collective reading + Aaron's modeling |
| **Tool-primitive (Linear)** | The discipline runs without ceremony; software prevents date-slippage; minimal human gates | Presupposes the tool exists and the team uses it for itself; not transferable to teams whose work isn't shaped like the tool's primitives | Vault registries (PIPELINE-REGISTRY, EXPERT-REGISTRY, SKILL-REGISTRY) + closure-obligations + emit ledger; the substrate is the vault, not Linear |
| **Embedded-artifact + auto-sync (Figma)** | Zero translation drift between "what doc says" and "what's true"; tool surfaces missed rows mechanically | Heavy dependency on Figma's own tooling (Coda + FigJam + Figma files + Project Tracker widget); fragile if tooling changes | View blocks (per `views.md`) are structurally the same primitive at the markdown layer; Cena could extend to plan files with embedded live status |
| **Multi-substrate (Airbnb)** | Catches different miss classes at different layers; storyboard durability resists drift; DesignOps absorbs scale pain | Five-team DesignOps pillar requires staff; storyboard requires designer-hours; bias-check deck requires team-internalization | Cena CANNOT replicate the five-team pillar Day 1. But the LAYERED-detection principle transfers; vault rules already encode several layers (views + invariant-tripwires + catalog-first + stated-concern-predicates) |
| **Distributed-loci + unified executive (Headspace)** | Unified P&L authority holds different disciplines together; clinical track operates independently with clear merge points | Requires a Witt-shaped executive holding multi-discipline authority | Aaron holds the Witt-shaped role at Cena (design + product + brand decisions; clinical accountability with Vanessa); the architecture transfers |

### How each maintains course toward north-star

This is Aaron's specific framing. Every company has a mechanism; none of them is "a PM checks the roadmap":

- **Stripe:** persistent canon (3 docs) cited continuously; the canon IS the north-star; drift surfaces as misalignment between artifact and canon at review time
- **Linear:** initiative entity carries the objective; project spec opens with "why"; weekly product meeting asks "is this still Linear-quality, still on-direction?"
- **Figma:** PRD Problem Alignment section is canonical; headlines are claim-shaped so progress is "does the claim now hold" not "did we complete N tasks"; product review at critical milestones for strategic re-direction
- **Airbnb:** storyboard stays on the wall for months; EPD triad keeps the thread; Chesky's founder-mode is the explicit Layer-3 backstop when the chain drifts
- **Headspace:** outcome metrics (PHQ-9 change) as the north-star; The Monthly Link checks experiment-coherence; Witt's unified-authority cognitive load catches cross-discipline drift

### How each ensures things don't get missed

The five-layered Airbnb model is the most explicit, but all five companies operate ≥3 detection mechanisms:

- **Stripe:** gavel blocks (structural — stakeholders named at doc head; if missing, doc is incomplete) + friction logs (any employee, continuous) + open-question state-email bottoms (cross-team)
- **Linear:** Triage typed inbox + goalie rotation + feature roast + non-blocking crits
- **Figma:** Project Tracker auto-sync (missing rows surface) + non-blocking crits + launch-readiness notifications + internal dogfooding
- **Airbnb:** storyboard (moments) + crit (craft) + Another Lens (biases) + DesignOps (system drift) + founder review (taste) — **five layers, each a different miss class**
- **Headspace:** Monthly Link (experiment-coherence) + algorithmic routing (acute state) + AI safety monitoring + clinical-notes audit + Witt's unified authority

### What each layer is responsible for that no per-pipeline chain can hold

This is the Aaron-framing answer. The coordination layer holds *what cannot live in a single chain*:

1. **Cross-pipeline canon consistency** — that "Cena patient app voice" reads the same as "Cena provider app voice" reads the same as "Cena partner deck voice." No single pipeline can hold this; the canon must be persistent and referenceable across pipelines.
2. **Boundary-role judgment** — cross-product API consistency (Stripe Product Architect); cross-product design-system contract (Figma DS team, Airbnb DesignOps, Haven design-system-steward); cross-discipline integration (Headspace Behavioral Science). These roles hold judgment no per-pipeline maker holds.
3. **Strategic redirection at critical milestones** — when a pipeline produces clean output of the wrong shape (the cena-apps Rewind C failure), the coordination layer is the surface where redirection happens. Inside the chain, the chain is faithful to its inputs; the redirection has to come from outside.
4. **Missed-thing detection across the chain** — no single slot in a pipeline can catch every miss. The layered detection mechanisms operate across the pipeline, not at one point.
5. **Post-ship learning that feeds future pipelines** — the cycle closes when shipped/retro docs become input for the next discovery cycle. The coordination layer holds the institutional memory.

---

## Q4 — Clinical-context overlay (Headspace only)

The discovery-brief scoped clinical context to one question: how does a design-led company add clinical-accountability gates *without* importing healthcare-firm UX patterns? Headspace's answer is structurally clear and Cena-transferable.

### Clinical-accuracy gates (what design-led + clinical-accountability looks like)

Headspace operates **five clinical gates in parallel**, each falsifiable in ways the design-celebrated companies don't match:

- **Validated-instrument canon** — PHQ-9, GAD-7, PSS, C-SSRS, PROMIS-Sleep are *inputs design does not redesign*. UX work composes them without harming their psychometric properties. The instrument is canon; design respects the boundary.
- **RCT-per-guided-program** — every clinically-loaded program gets an RCT before broad rollout. Outcomes-as-evidence, peer-reviewable.
- **100%-AI-message-monitoring + clinician-review-of-flagged-content** — every Ebb message scanned by Safety Risk Identification model; flagged → deidentified → licensed clinician review.
- **Clinical-notes audit (100%)** — every clinical note audited for evidence-based standards by Dr. Glover's QA team.
- **Algorithmic routing on acuity** — PHQ-9 item-9 → conditional C-SSRS trigger → escalation paths; algorithm + human navigators as override.

**The pattern:** clinical gates are **MECHANICALLY FALSIFIABLE** at Headspace in ways the design-celebrated companies' gates aren't. 100% coverage isn't a target; it's the gate. This is a different falsifiability regime than design-celebrated work normally operates in.

### Persona-calibration for users-in-acute-state

The discipline is **layered, not single-checkpoint**. Five mechanisms operate in parallel:

1. **Validated screening at the door** — PHQ-4 catches anxiety/depression signal at intake; the system surfaces severity to itself before the member self-routes.
2. **Algorithmic routing based on severity** — product surface adapts based on assessed acuity; the UI changes for an acute member vs. a low-stress member.
3. **C-SSRS triggering on PHQ-9 item-9 response** — a specific instrument fires conditionally on suicide-ideation indicator. **A member's answer to one question reshapes the next screen.** This is the load-bearing acute-state mechanism.
4. **24/7 care navigation team** — human escalation surface for "the algorithm couldn't."
5. **Continuous-monitoring on the AI surface** — Ebb's safety-risk identification model runs on every message; "gently guides you to crisis resources or a provider" when risk escalates.

**Encoded in artifacts:**
- Four personality principles (Hopeful/Visionary/Approachable/Reliable) scale across acuity levels without forking guides
- Ebb mascot is "a friendly blob that wasn't too smiley...you want to feel like it's listening, but not too happy" — explicit calibration for users-not-in-celebratory-mode
- Internal identity/experience employee resource groups tested vulnerabilities with underrepresented communities from inception (research process discipline, not gate)

**Airbnb's analog (cross-pollination):** worst-case-scenario storyboards (Dill's variant-journey discipline) + Another Lens 15-card bias-checking deck. Different substrate, same layered-discipline shape.

### Clinical-vs-design track relationship

**Parallel with coordinated handoffs, NOT one gating the other.** The five merge points:
1. Intake/routing (clinical owns instruments; design composes form UX)
2. AI conversation surface (clinical trains persona/guardrails; design owns interface/voice; co-authored)
3. Guided-program surface (clinical lead + mindfulness teacher co-author; design composes into product)
4. QA layer (100% audit + 100% AI monitoring; continuous, not ship-gates)
5. Executive level (Glover + Witt + Purvis hold separate accountabilities; meet at outcomes)

**The structural insight for Cena:** Headspace did NOT import healthcare-firm UX patterns when adding clinical accountability. The brand voice stayed playful/approachable. The clinical addition came through (a) validated instruments as canon-not-redesign-target; (b) RCT-per-program as evidence gate; (c) AI safety-detection-plus-clinician-review model; (d) parallel-track org structure meeting at outcomes; (e) personality-principles as voice-scaling primitive. **Aaron's "25-year UX experience: I can think of very few edits I've had to make to designs just because it's a healthcare company" — Headspace's evidence confirms it. The clinical track is parallel structure, not a design constraint.**

---

## Cross-cutting patterns and tensions (the meta-shapes)

### Most surprising convergence — substrate-over-PMO-role is universal

Every researcher who went into this expecting to find a named "Director of Coordination" or "Chief Project Officer" found instead a substrate. The five substrates differ; the substrate-shape pattern does not. This is the strongest cross-cutting finding and the one Cena should weight most heavily.

For Cena specifically: **the vault substrate Aaron has already shipped (rules + registries + experts + skills + view blocks + invariant tripwires + emit ledger + closure obligations + ambient plans) IS the equivalent primitive at Cena's scale.** It is not a substitute for the coordination layer; it IS the coordination layer. The work isn't "build a PMO"; the work is "make the substrate the discipline runs in."

### Most surprising divergence — handoff fusion is the design-led pattern

I expected to find at least one design-led company that maintained design→engineering as a ceremony (the way Stripe does API Review). All four design-led picks (Linear, Figma, Airbnb, Headspace) collapse the design-engineering handoff into continuous parallel work; the four design-led picks differ on *how* (Karri: "no handoff"; Figma: "the design file IS the spec"; Airbnb: EPD triad; Headspace: Dev Mode 85% utilization). Stripe is the outlier *because* its product surface is the API — the engineering doc IS the design.

For Cena: haven-ui's pattern-library-first discipline (HTML PL = spec; React port = 1:1 mechanical port) is structurally the same shape as Figma's tokens + Code Connect. The vault already encodes the fusion-shape primitive.

### Cross-cutting tension: persona-calibration discipline is layered

Aaron flagged persona-calibration as the missing gate in the cena-apps Rewind C. The research confirms the discipline exists at design-celebrated companies, but **it is never a single checkpoint.** Airbnb runs four layers (worst-case-scenario storyboards + Another Lens deck + accessibility team + research practice); Headspace runs five layers (validated screening + algorithmic routing + acute-state UI adaptation + 24/7 navigation + AI safety monitoring). **A single "persona-calibration gate" in the v2 will not catch the failure shape it's meant to catch.** The Cena v2 needs a layered discipline.

### Cross-cutting tension: judgment gates vs. mechanical gates

A clear pattern: **mature design-led companies push judgment gates UP (to executive review) and mechanical gates DOWN (to tooling, contracts, auto-sync).** Figma is the cleanest example: design crits and eng crits are *explicitly* non-blocking; variable scoping and Code Connect and the GitHub Action are *explicitly* mechanical. The human-judgment gate is centralized at Field + Yamashita.

Linear runs the same pattern: cycles auto-advance (mechanical); ship-readiness is judgment ("engineers feel ready"); Karri's taste is the implicit final filter for top-tier work.

For Cena: the v2's gate inventory should split mechanically-falsifiable gates (e.g., wireframe-vs-PL delta, brief-constraint-coverage, canonical-mock-presence, 100%-AI-safety-monitoring) from judgment gates (e.g., brief-philosophy-alignment, persona-calibration adequacy, clinical-accuracy of patient-facing content). The mechanical gates earn their keep via tooling; the judgment gates earn their keep via Aaron + named experts at fewer, higher-altitude touchpoints.

### Cross-cutting tension: north-star maintenance scales differently from missed-thing detection

North-star maintenance is *uniform* across the five companies (cached restatement at every layer; canon read continuously; "could recite verbatim" → the Stripe extreme; storyboards on the wall for months → the Airbnb extreme; outcome-metrics over engagement → the Headspace extreme).

Missed-thing detection is *non-uniform* (Stripe = 3 layers; Linear = 3 layers; Figma = 4 layers; Airbnb = 5 layers; Headspace = 5 layers). The detection-layer count grows with org complexity and surface diversity, not with team size — Linear (~25 engineers + 1 designer) and Airbnb (much larger) run different layer counts. The pattern: detection layers earn their keep when a different *miss class* exists; you don't need an Another-Lens deck unless your product has a bias-surface, and you don't need a clinical-notes audit unless you have clinical surfaces.

### Vault-substrate finding (not in the brief but it earned its place)

**The cached-value-vs-rendered-view distinction (`views.md`) is INVISIBLE to all five companies.** None of them has a deterministic mechanism for detecting when a cached "current state" description has drifted from its underlying source. Stripe's canon is cached-by-virtue-of-being-cited-continuously (employees-could-recite-verbatim is the social mechanism). Linear's project spec is cached but has no falsifiable check against the current project state. Figma's PRD-with-embedded-live-Figma-files comes the closest — the embed is structurally a view — but the *implementation* depends on Figma's own auto-update tooling, not on a generic primitive.

**Cena's `views.md` + `views-audit.sh` + the `rendered-at` hash is structurally further along on this axis than any of the five.** The vault has a deterministic-detection mechanism for cached/rendered drift that the five companies do not have. This is a real advantage and the v2 should lean on it (not retire it). It is also a real risk if it isn't propagated — a view block that nobody refreshes is the same kind of silent staleness the rule was built to prevent.

---

## Honest gaps and limits

- **Tacit judgment is invisible.** Every research file flagged that the *artifacts* and *named gates* are visible in public discourse; the *embodied judgment* a practitioner brings to a gate review is not. The Cena experts will develop that judgment; the pipeline gives them structure to live in.
- **Post-2020/2024 thinning.** Airbnb's public discourse peaked 2017–2021; Headspace post-merger is concentrated in a few interviews. Some recent shape changes may be invisible.
- **No public retros on coordination-layer failures.** Figma's discourse is asymmetrically celebratory; Linear publishes forward-looking wisdom not retro-honest failure analysis; Headspace's public material is marketing-shaped. The closest critical material is Airbnb's 2019 React Conf rebuild (a public retro on a coordination-layer failure) and Chesky's 2020 founder-mode pivot (Layer-3 reassertion after spine-weakness).
- **Single-source flags called out per company file.** Several load-bearing claims are `[SINGLE-SOURCE]` and may not survive a triangulation pass against private playbook material that isn't public.
- **The 5-attribute frame mapped unevenly to Stripe artifacts.** Most Stripe artifacts have clear Purpose, Brief, and Process; Canon and Domain are implicit in the writing culture. Cena's pipeline should make Canon and Domain *explicit per artifact* — Stripe's culture lets them be implicit because everyone has absorbed them, but a new + small team can't rely on absorption.

---

## Reading order for Aaron

1. **This file's executive summary** (top — 300 words) for the headline shape
2. **Q3 — coordination layer (the spine)** for the load-bearing finding
3. **Cross-cutting patterns and tensions** for the meta-shapes and the Cena implications
4. **Q1 — chain shape** for the artifact convergence
5. **Q2 — load-bearing gates** for the gate inventory
6. **Q4 — clinical-context overlay** for the UConn-pilot-relevant clinical findings
7. **[cena-recommendation.md](./cena-recommendation.md)** for the architecture call against this map
