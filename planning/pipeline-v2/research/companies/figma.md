# Figma — pipeline architecture research

## Source quality summary

- **Named practitioners cited:** Yuhki Yamashita (CPO), Dylan Field (CEO/co-founder), Sho Kuwamoto (VP Product, Editor), Noah Levin (VP Design), Marcin Wichary (design manager, Editor team), Kris Rasmussen (CTO), Ojan Vafai (engineer who introduced eng crits), Shirley Miao + Laura Pang (engineers who run eng crits), Mihika Kapoor (PM, Figma Slides), Thomas Wright (engineering, values post), Ryan Cordell (content design), Holly Li, Tara Nadella, Summer Wang, Sean Lee (PMs cited in Figma Make/PRD post), Tori Hinn (Creative Director), Rasmus (design systems), Josh Ferrell + Brian Schlenker + Tom Williams + Wayne Sun + Ryhan Hassan + Rachel Miller (design systems team).
- **Independent sources triangulated:** 14 distinct sources spanning (a) Figma Blog primary posts authored by named Figma practitioners; (b) Yamashita's published Coda PRD template; (c) Lenny's Newsletter long-form Q&A with Yamashita; (d) First Round Review long-form on Yamashita + Mihika Kapoor / Figma Slides; (e) Latent Space podcast transcript with Field; (f) Pragmatic Engineer (Gergely Orosz) on Rasmussen / Figma engineering culture.
- **Date range of sources:** 2018 (Levin's early design-team post) → 2026 (Field's Latent Space appearance, Figma Make / "Prototypes are the new PRDs" post). The bulk of process-shape material is 2022–2025, post-multi-product expansion.
- **Honest limits — what could NOT be verified from public discourse:**
  - The exact post-Maker-Week governance mechanism that promotes a hackathon idea to roadmap (Figma describes the cultural shape — Field/Yamashita approve, internal-adoption validates — but no formally-named gate or scoring rubric is public).
  - Whether eng crits and design crits ever block ship vs. only inform (public language is consistently "feedback, not approval"). The actual ship-gate likely sits in product review with Field/Yamashita per the Slides story, but the artifact-shape of that approval is not publicly named.
  - The current size and structure of design-engineer headcount at Figma (Field acknowledges role convergence but does not give an org-chart number); compared to e.g. Linear or Vercel where design-engineer is an explicitly-named role with public job ladders.
  - How the design-systems team's contract with consumer product teams is governed at the spec level — Figma's internal DS team is named and dogfoods Dev Mode, but the change-management protocol (deprecation cadence, breaking-change rules, consumer-side migration support) is not publicly documented.
  - Any post-mortems naming pipeline failures attributable to coordination-layer gaps. Public discourse skews celebratory; the closest critical material is Field's reflection on Make Designs (a feature pulled and reworked) but that's product-decision not pipeline-shape.

---

## Block A — Artifact chain

Figma's artifact chain is intentionally **fewer-artifacts-more-fidelity**: the dominant unit of communication is a *working Figma file* (design or prototype), not a written doc, and the written artifacts that do exist are scaffolded around the file rather than the other way around. Where competitors might have "PRD doc → spec doc → design file → handoff doc," Figma collapses these into **a PRD with embedded live Figma files + a prototype + Dev Mode**. The chain below names the named artifacts; the embedded files inside them are the load-bearing payload.

1. **Maker Week project (optional discovery)**
    - **Author role:** anyone (cross-functional; PM/designer/engineer/marketer)
    - **Reviewer/sign-off roles:** Maker Week judges + company-wide visibility; downstream review by Field (CEO) + Yamashita (CPO) for promotion to roadmap
    - **Input:** an observed user behavior or hunch (e.g. Mihika Kapoor saw 3.5M Figma files repurposed as slide decks)
    - **Output:** a scrappy prototype + pitch + (sometimes) internal viral momentum that feeds an executive product review
    - **Format:** prototype-in-Figma + role-play demo + pitch deck
    - **Cadence:** **twice yearly** ([Inside Maker Week](https://www.figma.com/blog/inside-maker-week-more-than-a-hackathon/))
2. **Headlines (claim-shaped goals)**
    - **Author role:** product team (PM lead drafts; team revises)
    - **Reviewer/sign-off roles:** product leadership; reviewed each planning cycle
    - **Input:** annual company priorities set by leadership; six-month review cycle
    - **Output:** a roadmap-ready claim of the form "Figma is the most efficient way to design," paired with quant + qual evaluation methods
    - **Format:** short prose claim + evaluation rubric (replaced OKRs; later rebranded as "commitments" once data leadership joined) ([Lenny's Newsletter](https://www.lennysnewsletter.com/p/how-figma-builds-product))
3. **PRD (Yamashita format)**
    - **Author role:** PM (problem alignment + solution alignment); designer contributes solution-alignment Figma embeds; eng contributes launch-readiness rows
    - **Reviewer/sign-off roles:** designer + tech-lead + cross-functional stakeholders (legal, marketing, ops via launch-readiness checklist)
    - **Input:** headline / problem signal
    - **Output:** three sections (Problem Alignment / Solution Alignment / Launch Readiness) → engineering & ship plan
    - **Format:** Coda doc with **embedded live Figma files** (auto-update; permission-respecting) + an **auto-synced Figma Project Tracker** that pulls status, contributors, ship dates, launch-readiness criteria into the PRD without redundant data entry ([Yamashita's Coda PRD template](https://coda.io/@yuhki/figmas-approach-to-product-requirement-docs))
4. **Prototype (Figma Make + Figma design files) — increasingly *the* PRD**
    - **Author role:** PM (lead in 2025+); designer (visual/interaction refinement); eng (technical-feasibility framing)
    - **Reviewer/sign-off roles:** cross-functional viewing (designer, eng, PM, often stakeholders) via Loom demos, FigJam annotated walkthroughs, live walkthroughs
    - **Input:** problem space (often hazy at this stage)
    - **Output:** the engineering spec itself ("The spec to Figma's engineering teams is often a Figma Make file plus designs"; engineers can push the Make code directly to GitHub as foundation) ([Figma Blog: Prototypes Are the New PRDs](https://www.figma.com/blog/prototypes-are-the-new-prds/))
    - **Format:** Figma Make file + Figma design file + (often) Supabase backend connectivity + Make Connectors syncing external context
5. **Design crit (review ceremony, not artifact, but produces feedback as artifact-attached comments)**
    - **Author role:** N/A (presenter brings the work)
    - **Reviewer/sign-off roles:** explicitly NOT a sign-off gate — "Critiques need to remain a safe space for exploration and feedback, independent from roadmap decision making" ([Figma Blog: How we do design critiques at Figma](https://www.figma.com/blog/design-critiques-at-figma/))
    - **Input:** in-progress design at any fidelity (concept, refined comp, pre-ship polish)
    - **Output:** feedback as Figma comments on the file itself; meeting recording for absent participants
    - **Format:** six modes — Standard / Jams & Workshops / Pair Design / Silent / Paper / FYI — chosen by presenter for the work's stage
    - **Cadence:** **two weekly scheduled sessions (Wednesday + Friday, 30-min slots each)** ([Inside Figma: the product design team's process](https://www.figma.com/blog/inside-figma-the-product-design-teams-process/)) plus ad-hoc; supplemented by **Tech-pillars Tuesday / Editor + Non-Editor Thursday / All-design Friday** in a five-slot weekly arrangement reported by Yamashita ([Lenny's Newsletter](https://www.lennysnewsletter.com/p/how-figma-builds-product))
6. **Eng crit (engineering critique, parallel to design crit)**
    - **Author role:** presenting engineer (prepares FigJam with design they want critiqued + framing of "high-level architecture vs. specific-component deep-dive")
    - **Reviewer/sign-off roles:** explicitly NOT approval — "rather than facing another approval step"; reviewers lead with suggestions, not mandates; sessions are recorded
    - **Input:** in-progress technical design (early-to-middle phases preferred; occasional late-stage targeted questions)
    - **Output:** sticky-note feedback in FigJam (parallel conversations); teams iterate or proceed with sufficient direction
    - **Format:** synchronous in FigJam, silent-feedback periods, optional attendance, originated by Ojan Vafai, run by Shirley Miao + Laura Pang ([Figma Blog: How We Engineer Feedback at Figma with Eng Crits](https://www.figma.com/blog/how-we-run-eng-crits-at-figma/))
7. **Design system update / token publication**
    - **Author role:** design-systems team (designers Wayne Sun, Ryhan Hassan; engineers Josh Ferrell, Brian Schlenker, Tom Williams; manager Rachel Miller)
    - **Reviewer/sign-off roles:** internal to the DS team for the spec; consumer surfaces (product teams) consume via Figma libraries + Dev Mode + Code Connect
    - **Input:** Figma variables (color, spacing, typography) replacing the prior CSV-based source-of-truth
    - **Output:** GitHub Action **automatically triggers** when the Figma color library publishes, pushing tokens to the codebase ([Figma Best Practices: How Figma's Internal Design System Team uses Dev Mode](https://www.figma.com/best-practices/how-figma-uses-dev-mode/))
    - **Format:** Figma variables + code-syntax mapping (so Dev Mode renders `var(--spacer-2)` for a `4px` value); Storybook documentation + GitHub source code linked via Dev Mode resources
8. **Dev Mode handoff (continuous, not a moment)**
    - **Author role:** designer (annotations in design file; variable application; intent encoded in scopes)
    - **Reviewer/sign-off roles:** engineer (consumes; ports). Definition of done per one external practitioner (Thiebault, Decathlon, EM): "If it's not linked in Figma, it doesn't exist" ([Figma Blog: A Year With Dev Mode](https://www.figma.com/blog/10-lessons-from-an-engineering-manager/))
    - **Input:** the design file itself (no separate handoff artifact); Code Connect maps Figma components → codebase components
    - **Output:** engineer pulls CSS values, spacing measurements, component properties, asset exports; Code Connect renders the real codebase snippet in Dev Mode instead of an autogenerated default
    - **Format:** Dev Mode panel in the same Figma file the designer authored; MCP server allows pulling design components + variables into the engineer's IDE
9. **Product review (executive checkpoint)**
    - **Author role:** PM + project leads (FigJam structured templates with "option space" framing + alignment widgets)
    - **Reviewer/sign-off roles:** **Dylan Field (CEO), Yuhki Yamashita (CPO), project leads, key decision-makers** ([Lenny's Newsletter](https://www.lennysnewsletter.com/p/how-figma-builds-product))
    - **Input:** problem framing, prototype/design files, option-space analysis
    - **Output:** decision recorded; Mihika Kapoor's Figma Slides example: initial executive review approved the concept with skepticism about the Config delivery timeline ([First Round Review](https://review.firstround.com/how-to-make-your-product-idea-go-viral-inside-your-company-lessons-from-figma-slides/))
    - **Format:** Figma deck (often) + FigJam supplements; happens at "critical lifecycle milestones"
10. **Launch readiness (auto-synced checklist)**
    - **Author role:** cross-functional (legal, marketing, ops)
    - **Reviewer/sign-off roles:** the team — checklist completion is the gate; team members **receive notifications when readiness criteria are met** ([Yamashita's Coda PRD template](https://coda.io/@yuhki/figmas-approach-to-product-requirement-docs))
    - **Input:** the PRD; the Figma Project Tracker
    - **Output:** ship readiness
    - **Format:** auto-synced from the Figma Project Tracker into the PRD's Launch Readiness section
11. **Ship + post-launch retrospective**
    - **Author role:** team-wide
    - **Reviewer/sign-off roles:** team-wide; values doc names "engineers conduct retrospectives on every project" ([Figma Blog: Figma's engineering values](https://www.figma.com/blog/figmas-engineering-values/))
    - **Input:** shipped feature + telemetry + user feedback
    - **Output:** lessons → next planning cycle
    - **Format:** team-internal; specific artifact shape not publicly documented

**Notable chain shape:** the chain has fewer named artifacts than the Stripe-style writing-heavy chain, but the artifacts that exist carry **more embedded fidelity** (a PRD is not a doc *about* designs; it *contains* live designs that auto-update). The "translation count" between brief, design, spec is structurally lower because the design file IS the spec.

---

## Block B — Roles + expertise

### Product Manager (PM)
- **Stages owned:** Maker Week pitches; headline drafting; PRD authorship (Problem Alignment + Solution Alignment lead); prototype lead in 2025+ era; product review presenter
- **Expertise:** problem framing, "ask 'why' one more time than you think you need" (Yamashita), prototype-as-investigation, narrative + storytelling (the "screenshot test": "What's the one screenshot that's completely self-explanatory?")
- **Headcount discipline:** **22 PMs** total as of the Lenny's Newsletter interview, organized as **two product-specific teams** (Figma Design, FigJam) **+ horizontal platform teams** (Enterprise, Infrastructure). Multi-product expansion (FigJam → Dev Mode → Slides) added "team thinking about shared primitives right out of the gate" rather than per-product silos.

### Product Designer
- **Stages owned:** Solution Alignment Figma embeds in the PRD; design crits (present + critique); Dev Mode annotation + variable application; design crit modes (six modes; pick by stage)
- **Expertise:** visual + interaction craft; "design is a team sport" (Field); designers are **mostly embedded in product areas, sometimes more than one, sometimes none at all**; some sit with other designers, some with engineers (Noah Levin, [How we built the Figma Design Team](https://www.figma.com/blog/how-we-built-the-figma-design-team/))
- **Headcount discipline:** embedded model; design ops + Tori Hinn (Creative Director) coordinate horizontal craft via Design All-Hands

### Engineer (incl. tech lead)
- **Stages owned:** PRD launch-readiness inputs; eng crits (present + critique); architecture decisions; Code Connect mapping; consume Dev Mode → port; "engineers get involved early in the planning process" (Rasmussen via Orosz)
- **Expertise:** full-stack — "teams are staffed to be full stack and work across code boundaries" (Rasmussen). React + TypeScript + C++ frontend; Ruby + Go + TypeScript backend.
- **Headcount discipline:** "never doubled in size within a year" by deliberate cultural protection (Rasmussen)

### Design Engineer — *named as a role-shape, not as an explicit org tier*
- **Stages owned:** Field acknowledges "roles are blurring, stages are blurring" ([Latent Space](https://www.latent.space/p/figma)). The function is real and named ("design engineer" appears in role conversations) but Figma does not publicize a dedicated DE tier the way Linear or Vercel do.
- **Expertise:** moving "from design to code...is kind of like the most mechanical part. And actually thinking through all the states...that is a lot of the interesting work" (Field). The DE-shaped work — prototyping in tooling, encoding interactions, navigating between Figma and code — is *what design engineers do at other companies* but at Figma is increasingly absorbed by PMs using Figma Make + by engineers consuming Code Connect.
- **Headcount discipline:** ambiguous in public discourse. The closest explicit signal is Figma's **acquisition of Visly** to bring in "an external engineering leader who was thinking about how to translate design into code" (Yamashita via First Round) — i.e., they acqui-hired DE-shaped expertise rather than building an internal ladder.

### Design Systems team (boundary role: design ↔ engineering)
- **Stages owned:** Figma variables authorship; code-syntax mapping; GitHub Action publish workflow; Storybook documentation; Code Connect maintenance; Dev Mode resource linkage
- **Expertise:** the contract-keeping role. Named composition (Sho Kuwamoto's framing of "composition" applied to design systems) is foundational; the team "make[s] Figma beautiful, accessible, and reliable by crafting high quality UI systems and patterns"
- **Headcount discipline:** **named team of ~6** (3 engineers, 2 designers, 1 manager visible in dogfooding post); embedded GitHub Action means the consumer side is automated, not manually handed off

### Content Designer / UX Writer
- **Stages owned:** content from the outset of UI work; conversation scripting before visual design; real content (not placeholders) as UI is created; loops engineers in via tagged Figma comments for technical-feasibility checks
- **Expertise:** "ensure users can complete their tasks as simply and effectively as possible" (Ryan Cordell, [How to do content design / UX writing in Figma](https://www.figma.com/blog/how-to-do-content-design-ux-writing-in-figma/)). User-voice + task-completion lens that designers and engineers don't structurally own.
- **Headcount discipline:** reports up through VP Design (Levin); rolled into the design team's UX writing function

### VP Design (Noah Levin)
- **Stages owned:** design crit attendance (VP Product also attends); culture stewardship; horizontal craft quality
- **Expertise:** organizational design; Levin's design team blog series explicitly distinguishes **design-team process** (horizontal culture, craft elevation) from **product-team process** (vertical shipping). Levin emphasizes critiques are NOT roadmap decisions.

### CPO (Yuhki Yamashita)
- **Stages owned:** planning cycles (he deprecated OKRs → headlines → "commitments"); product reviews (sign-off authority); multi-product coordination strategy
- **Expertise:** product scaling + storytelling; explicit framework-design for how a 22-PM org coordinates across products with shared primitives
- **Headcount discipline:** singular role

### CEO (Dylan Field)
- **Stages owned:** product review (alongside Yamashita); taste-as-moat strategic framing; Maker Week + acquisition decisions (acqui-hired Visly's DE expertise)
- **Expertise:** taste; the original product/design vision; "design is a team sport"

### CTO (Kris Rasmussen)
- **Stages owned:** engineering culture stewardship; the deliberate-growth discipline (never double in a year)
- **Expertise:** preserves collaborative-team shape against scale pressure

### Boundary roles (the load-bearing observation)

Figma's **most load-bearing boundary roles are**:
- **PM using Figma Make as PRD authoring tool** — the PM gains design-tooling fluency to author specs as prototypes, collapsing what would otherwise be a PRD-doc → designer-translation → eng-translation chain. *This is the role-shape change Figma is most actively expanding.* (See Holly Li / Tara Nadella / Summer Wang / Sean Lee quotes in [Prototypes Are the New PRDs](https://www.figma.com/blog/prototypes-are-the-new-prds/).)
- **Design Systems team as the live contract between design intent and code reality** — the DS team's tokens-via-Figma-variables + GitHub-Action publish workflow IS the contract; no separate handoff exists.
- **Content Designer as parallel-authored discipline (not late-stage editor)** — Cordell's framing of co-design rather than post-design copy review.

The role-blurring is the explicit Figma thesis (Field, 2025) — not an accident or growing pain, but the goal.

---

## Block C — Gates between artifacts

Figma's gates are **mostly soft-coordination + checklist + auto-sync**, with **two named hard gates**: executive product review (Field + Yamashita) and the launch-readiness auto-checklist. The pattern is consistent: keep judgment-class gates (crits) explicitly non-blocking; let the spec-shape gates (Code Connect, variable scoping, launch-readiness) auto-enforce.

| Transition | What is checked | Authority to halt | What halt produces | Falsifiability |
|---|---|---|---|---|
| Maker Week → roadmap promotion | Cultural signal: did the company-wide reveal land? Did internal adoption build? Specific case: Yamashita using Slides for Sales Kickoff "blew everyone's minds" | **Field + Yamashita** (Slides went through executive product review with conditional approval) | Conditional green light or kill | Judgment, not falsifiable; the calibration mechanism is internal-adoption traction + executive read |
| Headline → PRD draft | Does the headline survive "ask 'why' one more time than you think you need"? | PM-self + product leadership at planning review | Re-scope or kill | Quant + qual claims; explicitly NOT OKR-shaped |
| PRD Problem Alignment → Solution Alignment | Is the problem articulated with as much rigor as the solution? Are KPIs + qualitative goals (think/feel/do) named? | PM (author) + product leadership reviewing the PRD | Rework Problem Alignment | Judgment, calibrated by PRD review |
| Solution Alignment → engineering | Does the embedded Figma file + prototype show enough behavioral fidelity for engineers to build? | Engineer at eng crit ("frame whether seeking high-level architecture input or deep-dive component feedback") | Iterate prototype | **Soft** — eng crit is "feedback, not approval" |
| Design crit (any stage) → next iteration | Six modes (Standard / Jams / Pair / Silent / Paper / FYI) — choice of mode signals desired feedback shape | **Explicitly nobody** — "Critiques need to remain a safe space for exploration and feedback, independent from roadmap decision making" ([How we do design critiques at Figma](https://www.figma.com/blog/design-critiques-at-figma/)) | Author decides | Non-blocking by design |
| Eng crit → architecture decision | Is the technical-design path defensible? Are irreversible decisions called out? | **Explicitly nobody** — "rather than facing another approval step" | Author decides; teams "iterate or conclude with sufficient direction to move forward without formal approval" | Non-blocking by design |
| Design file → Dev Mode → code | Variable scoping ("developers can't misapply tokens — e.g., using background colors for text"); Code Connect renders the real codebase snippet; if a designer used a raw `4px`, Dev Mode auto-surfaces the corresponding `var(--spacer-2)` | The Dev Mode tool itself; variable scoping is the **mechanical gate** | Designer notified of mis-application; engineer never sees the wrong value | **Mechanical/falsifiable** — code-syntax mapping is deterministic |
| DS team Figma variable change → consumer codebases | GitHub Action triggers on publish; tokens flow into code automatically | The Action's CI gate at consumer codebase | CI failure if downstream codebase doesn't honor the new token | **Mechanical/falsifiable** — discovered "over 280 differences, many of which were using the wrong color ramps" when migrating from spreadsheet-based source |
| PRD → product review | Option-space framed; alignment widgets in FigJam template indicate decision-readiness | **Dylan Field (CEO) + Yuhki Yamashita (CPO) + project leads** ([Lenny's Newsletter](https://www.lennysnewsletter.com/p/how-figma-builds-product)) | Strategic re-direction or kill | Judgment; this IS the load-bearing executive gate |
| All-ready → launch | Launch-readiness checklist auto-pulled from Figma Project Tracker; **collaborators receive notifications when criteria are met** | Cross-functional (legal, marketing, ops) — checklist completion | Ship blocked until each row clears | **Mechanical/falsifiable on the row level**, judgment on whether each row is *adequately* met |

### The pattern: hard gates are mechanical; soft gates are explicitly non-blocking; the human-judgment gate sits at executive product review

This is consistent with Figma's stated culture: collaboration over approval; "communicate early and often" (engineering values, [Thomas Wright via Figma Blog](https://www.figma.com/blog/figmas-engineering-values/)); crits as exploration not gate. The **failure mode this is designed to avoid** is approval-theater that gates work without improving it. The cost is that calibration depends heavily on a small executive group (Field + Yamashita) being the load-bearing strategic-judgment vote.

---

## Block D — Per-artifact briefs (5-attribute frame)

### Artifact 1: PRD (Yamashita format)

- **Purpose:** Single source of truth for a project, connecting problem rationale → solution shape → ship readiness. Downstream needs informed: engineering builds against it; cross-functional stakeholders (legal, marketing, ops) plan launches against the Launch Readiness section; future product reviewers consume it as the canonical project record. Supports those needs efficiently by **embedding live Figma files that auto-update** rather than freezing the design as a screenshot — eliminating the "PRD says X but the designs now say Y" drift that traditional PRDs suffer.
- **Canon:** Yamashita's published three-section template (Problem Alignment / Solution Alignment / Launch Readiness); the Figma Project Tracker as the auto-sync source for status + contributors + ship dates; brand voice in writing; the principle "ask 'why' one more time than you think you need."
- **Brief:**
    - Three sections, in order.
    - Problem Alignment: problem statement + high-level approach + KPIs + qualitative goals (what users should think/feel/do).
    - Solution Alignment: user flows (the easiest way for readers to understand the project) + key features + **embedded live Figma files** (private-permission-respecting; not requiring public link sharing).
    - Launch Readiness: cross-functional checklist of legal/marketing/ops dependencies; **auto-synced from the Figma Project Tracker**.
    - Format: Coda doc with Figma embeds.
- **Domain:** product management (problem framing), product design (Solution Alignment Figma embeds), engineering (technical feasibility surfacing in solution + Launch Readiness eng rows), cross-functional ops (legal, marketing). Most often authored by the PM with designer + tech-lead embedded as live contributors.
- **Process:** PM drafts Problem Alignment first → solicits feedback (often async via Coda comments + Figma file comments) → designer iterates Solution Alignment embed → eng crit on technical approach → cross-functional fills Launch Readiness rows → product review with Field + Yamashita at critical lifecycle milestones → ship readiness reached when all checklist rows clear and notifications fire.

### Artifact 2: Prototype (Figma Make + design file) — increasingly *the* PRD in 2025+

- **Purpose:** Replace the traditional PRD-as-doc with a working artifact that demonstrates behavior rather than describing it. Downstream needs: engineers use it as interaction reference (or push the Make code directly to GitHub as foundation); user-testers interact with it during validation (Sean Lee: "prepared a functional prototype in just one day for five user interviews"); stakeholders evaluate trade-offs by interacting (Holly Li: "Figma Make has condensed and simplified that problem for us immensely").
- **Canon:** the existing design system (Make kits bring DS components in); Figma's brand voice; established interaction patterns from the editor product
- **Brief:**
    - Use Figma Make when the problem space isn't well understood (Tara Nadella: "I use Figma Make when I don't feel like I understand a problem space very well")
    - Generate multiple concept variations rapidly (Summer Wang: "solves the blank-canvas problem by giving you something to riff on")
    - Pull variations into FigJam for annotated comparison
    - For validation, ship a functional prototype within ~1 day
    - For engineering handoff, the prototype IS the spec — designs + Make file together
- **Domain:** PM (lead in 2025+ for ideation prototypes); product designer (refinement); engineering (technical-feasibility framing during ideation; consumption at handoff)
- **Process:** PM drafts in Figma Make → variations explored → pulled into FigJam with stakeholder annotations → either user-tested for validation OR handed to engineering as spec (push Make code to GitHub directly, or use as foundation for production build with Code Connect / MCP server pulling components + variables into the IDE)

### Artifact 3: Design crit (ceremony; produces feedback as Figma comments on the file)

- **Purpose:** Elevate craft + share context + move projects forward — **not** make product or roadmap decisions. The hard separation is canonical (Levin: critiques explicitly NOT roadmap decisions; the [design crits blog post](https://www.figma.com/blog/design-critiques-at-figma/) names this).
- **Canon:** the six-modes vocabulary (Standard / Jams / Pair / Silent / Paper / FYI); the principle "Critiques need to remain a safe space for exploration and feedback"
- **Brief:**
    - Presenter picks one of six modes based on the work's stage and the feedback shape they need.
    - Standard: presenter shares context → team feedback via Round-the-Room or Popcorn
    - Jams & Workshops: early-stage ideation in the file (Crazy 8's, etc.)
    - Pair Design: 2–3 people, scheduled or ad-hoc, sometimes assigned as "copilot"
    - Silent: async, all comment in parallel
    - Paper: physical printouts + sticky notes
    - FYI: brief context-sharing, no feedback request
    - Smaller rooms preferred; remote accommodated via Figma links + recordings
- **Domain:** design (primary); engineers + PMs + researchers attend as optional guests when their lens helps (Levin notes the Wednesday + Friday 30-min slots have "optional guests")
- **Process:** Topics scheduled Monday morning → presentations Wednesday + Friday → VP Product attends; engineers optional → feedback lives as Figma comments on the file → presenter decides what to absorb. No vote, no approval, no gate.

### Artifact 4: Eng crit

- **Purpose:** Solicit early-and-often feedback on technical design; brainstorm + identify hard challenges + validate hypotheses + share knowledge + call out irreversible decisions. **Explicitly not approval.**
- **Canon:** the FigJam template with context-background-questions; the Ojan-Vafai-originated lineage; the Shirley-Miao-and-Laura-Pang-stewarded format
- **Brief:**
    - Prepare a FigJam with the design to be critiqued.
    - Before starting: provide background; frame whether seeking high-level architecture input or deep-dive component feedback.
    - During: parallel sticky-note feedback in FigJam.
    - After: iterate, or proceed with sufficient direction.
    - Listed as optional on calendar invites (200+ engineers eligible).
    - Sessions recorded for later.
- **Domain:** engineering (primary); designers + PMs welcome to attend
- **Process:** Engineer prepares FigJam → posts in eng channel → engineers self-select to attend → silent-write feedback period → live discussion → iterate. Like design crits, no sign-off.

### Artifact 5: Design system update (variables + Code Connect + GitHub Action)

- **Purpose:** Be the live, code-synced contract between design intent and built reality. Downstream needs: product designers consume tokens with confidence they match production; engineers see the *correct* token value in Dev Mode regardless of whether the designer applied the variable; new hires onboard without memorizing token names ("new hires can immediately grab correct token values without extensive training on variable naming conventions"). Most efficient because it eliminates manual handoff entirely (the GitHub Action publishes on Figma library publish).
- **Canon:** Figma variables system; code-syntax-mapping convention; the design-systems team's mandate ("make Figma beautiful, accessible, and reliable by crafting high quality UI systems and patterns"); the dogfood discipline (the DS team uses Dev Mode internally)
- **Brief:**
    - Define tokens as Figma variables (color, spacing, typography).
    - Map code syntax per variable (so Dev Mode renders `var(--spacer-2)` rather than `4px`).
    - Configure scopes (background color, text color, padding, etc.) so the variable can't be mis-applied.
    - Wire a GitHub Action that triggers on library publish to push tokens to the codebase.
    - Link Dev Mode resources to Storybook docs + GitHub source.
    - When migrating from a prior source-of-truth (CSV, spreadsheet), expect to find drift (the team "found over 280 differences, many of which were using the wrong color ramps").
- **Domain:** design systems team — Josh Ferrell, Brian Schlenker, Tom Williams (engineers); Wayne Sun, Ryhan Hassan (designers); Rachel Miller (manager). Composition expertise (Kuwamoto's framing applied at the spec level).
- **Process:** DS team authors variables in Figma → publishes library → GitHub Action fires → tokens land in code → consumer surfaces (product designers in Figma, engineers in Dev Mode, engineers in IDE via MCP) consume the published version. No per-consumer approval; the contract is live.

### Artifact 6: Product review (executive checkpoint)

- **Purpose:** Strategic alignment at critical lifecycle milestones. Downstream needs: product team gains executive direction; downstream investment (eng staffing, GTM commitment) gets sized. Most efficient via FigJam structured templates that make the option space + decision points scannable in the meeting.
- **Canon:** the option-space framing convention; the alignment widgets convention; Field + Yamashita as the decision-makers
- **Brief:**
    - Present in a Figma deck (often) with FigJam supplements for live decisions
    - Frame as option space, not pre-decided answer
    - Use alignment widgets to make positions visible
    - For executive review specifically: "be incredibly real about the risks" (Mihika Kapoor's lesson — initial pitch was overly optimistic and backfired)
- **Domain:** PM (presenting); product design (Solution Alignment context); engineering (tech-lead represented); executive judgment (Field strategic + Yamashita product)
- **Process:** PM + project leads prepare the deck → executive review happens at "critical lifecycle milestones" (not on every project, not on every iteration) → option-space discussion → decision recorded → team executes against the strategic direction. This is the load-bearing executive gate.

### Artifact 7: Launch readiness (auto-synced checklist)

- **Purpose:** Coordinate cross-functional dependencies before ship without a human chasing each stakeholder. Downstream need: each function (legal, marketing, ops) gets notified when their input is needed; no surprises at launch.
- **Canon:** the Figma Project Tracker as the auto-sync source; the PRD's Launch Readiness section as the consumer surface; the notification-on-criteria-met convention
- **Brief:**
    - The checklist's rows are owned by the responsible function (legal owns its rows, marketing owns its rows, etc.)
    - Status flows automatically from the Project Tracker into the PRD
    - Notifications fire when criteria are met
    - The checklist is the gate; ship-readiness = checklist-clearance
- **Domain:** cross-functional (legal, marketing, ops, engineering); coordination owned by PM
- **Process:** PRD authoring populates the checklist → Project Tracker tracks live status → each function fills in as they complete → notifications fire on completion → all-cleared = ship-ready

---

## Block E — Coordination/orchestration layer (the spine)

**What this layer does at Figma:** It sequences across the multi-product expansion (Figma Design + FigJam + Dev Mode + Slides + Make); tracks dependencies between shared primitives and product-specific work; enforces north-star alignment from headlines through ship; and surfaces missed things via a combination of mechanical auto-sync and executive product review. Yamashita explicitly redesigned the multi-product coordination shape: "We should have a different way of organizing so that there's a team that's thinking about these shared primitives right out of the gate."

**Where it sits — five components in combination:**

1. **A planning cadence** — annual company priorities + biannual product-team revisits + quarterly adjustments. ([Lenny's Newsletter](https://www.lennysnewsletter.com/p/how-figma-builds-product))
2. **A claim-shaped target system** — headlines (later "commitments"), explicitly *not* OKRs because Yamashita found OKR meetings produced "dreadful companywide…spreadsheet tracker[s] of hundreds of OKRs that were really more like tasks."
3. **A written-but-living artifact** — the PRD with embedded Figma files + auto-synced Project Tracker. This is the **load-bearing coordination artifact** because it's where status, contributors, and launch-readiness all converge. It's not a doc *about* a project; it's the *project state surface*.
4. **A software primitive** — the Figma Project Tracker widget. Mini command center for the project: task names, dates, links to prototypes/briefs. The auto-sync into PRDs is what makes the written artifact stay live without manual update friction. ([Yamashita's Coda PRD template](https://coda.io/@yuhki/figmas-approach-to-product-requirement-docs))
5. **A leadership review at critical lifecycle milestones** — product review with Field + Yamashita + project leads. This is the strategic judgment layer; everything mechanical-and-coordination flows beneath it.

Plus the two design-system specific primitives:
- **GitHub Action auto-publishing tokens on library publish** — the design ↔ engineering contract auto-enforces; consumer-side never has to chase the DS team for "what's the current value of teal-400?"
- **Code Connect** — the design-component ↔ code-component map IS the contract layer between design intent and implementation.

**What artifacts it produces or consumes:**
- Consumes: headlines, PRDs, prototypes, design files, Project Tracker rows, eng + design crit recordings (for absent participants), launch-readiness criteria
- Produces: planning-cycle roadmaps, product review decisions, launch-readiness notifications, status updates synced into PRDs without redundant data entry

**How it interacts with per-pipeline chains:** The coordination layer is *embedded in* the artifact chain rather than sitting above it. The PRD doesn't summarize what's happening; it *is* what's happening (embedded live Figma files, auto-synced status). The Project Tracker doesn't report on the project; it *is* the project's status surface. This is the structural pattern: **coordination as live-artifact-surface, not as separate-summary-layer**. The cost is heavy dependency on Figma's own tooling (Coda, FigJam, Figma files, Project Tracker widget); the benefit is zero translation lag between "what the doc says" and "what's true."

**How it maintains course toward the north star of the initial brief:**
- The PRD's Problem Alignment section is **canonical** — it's the cached restatement of "why we're doing this" and reviewers can always check ship-ready solution against original problem framing.
- Headlines are claim-shaped (not task-shaped), so progress is evaluated against "does the claim now hold?" rather than "did we complete N tasks?" — preserves the original strategic intent against the drift toward task-completion-as-success.
- Product review at critical lifecycle milestones is the explicit checkpoint where strategic re-direction can happen if the solution drifted from the problem.

**How it ensures things don't get missed:**
- **Auto-sync from Project Tracker into PRD Launch Readiness** — the mechanical answer. If a row isn't in the tracker, it's not in the PRD; if it's not in the PRD, it's surfaced as missing during review.
- **Eng crit + design crit as feedback amplifiers** — the explicit non-blocking design means engineers and designers bring in-progress work BEFORE it's frozen, so peers can catch missed considerations before they bake in.
- **Cross-functional launch-readiness notifications** — legal, marketing, ops are *notified when their rows are needed*, not chased.
- **Internal dogfooding** — the DS team uses Dev Mode internally; Yamashita used Figma Slides for a Sales Kickoff before it shipped; engineers eat Figma's own tooling. Missed things surface as internal pain before they surface as customer pain.

**What absence looks like — public retros of pipeline-shape failure are scarce.** The closest critical material is Field's reflection on Make Designs (a feature pulled and reworked) but that's product-decision shape, not coordination-layer shape. The Mihika Kapoor / Figma Slides story is closer to a positive-case demonstration of how the layer is supposed to work (idea bubbles up from Maker Week → internal viral momentum → executive review → conditional approval → Sales Kickoff dogfood reveal → ship at Config 2024) rather than a story of what breaks when the layer fails.

**Implicit-coordination shape (where there is no separate layer):** the coordination layer is **not a separate PMO function** at Figma. There is no role titled "Program Manager" or "Chief of Staff" doing dedicated cross-product orchestration in public discourse. The coordination is *embedded in*:
- The CPO + project leads via product review (strategic)
- The PM role per product team (tactical)
- The Project Tracker + PRD auto-sync (operational/status)
- The Design Systems team + Code Connect + GitHub Action (design↔engineering contract)
- The crit cadence (cultural)

This is consistent with Field's "design is a team sport" framing and the engineering values' "communicate early and often" — the bet is that distributing coordination across roles + tools + ceremonies beats centralizing it in a coordination role.

**Minimum viable shape (implicit observation, not Figma's own statement):** the load-bearing pieces appear to be (a) the PRD-with-embedded-live-design pattern; (b) the Project Tracker auto-sync; (c) the product review at critical milestones with explicit decision-makers; (d) the non-blocking crit cadence for early feedback. Take any of these out and either translation drift returns (without auto-sync), or executive direction gets lost (without product review), or early feedback gets bypassed (without crits). The DS-side GitHub Action is the analogous primitive at the design↔code seam.

---

## Citations

- **Figma's three-section PRD template (Problem Alignment / Solution Alignment / Launch Readiness):** [Yuhki Yamashita's published Coda template](https://coda.io/@yuhki/figmas-approach-to-product-requirement-docs); Yuhki Yamashita; accessed 2026-06-11.
- **PRDs with embedded live Figma files + auto-synced Project Tracker:** same source as above ([Yamashita Coda template](https://coda.io/@yuhki/figmas-approach-to-product-requirement-docs)).
- **Prototypes as the new PRDs (Figma Make + design files as spec to engineering):** [Figma Blog: Prototypes Are the New PRDs](https://www.figma.com/blog/prototypes-are-the-new-prds/); Figma PMs Tara Nadella, Holly Li, Summer Wang, Sean Lee quoted; 2025.
- **Planning cadence (annual + biannual + quarterly); headlines instead of OKRs; 22 PMs structure; product review with Field + Yamashita; FigJam structured templates with option-space framing:** [Lenny's Newsletter: How Figma builds product, Yuhki Yamashita](https://www.lennysnewsletter.com/p/how-figma-builds-product); 2023.
- **The five-slot weekly crit arrangement (Tech-pillars Tuesday, Editor + Non-Editor Thursday, All-design Friday) + ~10-15 min present / ~5 min lingering Qs / ~5 min silent writing format:** same source as above [Lenny's Newsletter](https://www.lennysnewsletter.com/p/how-figma-builds-product).
- **Yamashita on multi-product coordination + acqui-hiring Visly for DE expertise + Maker Week as idea source + screenshot test:** [First Round Review: Lessons in Product Scaling and Storytelling from Figma's CPO](https://review.firstround.com/lessons-in-product-scaling-and-storytelling-from-figmas-cpo/); 2024.
- **The Mihika Kapoor / Figma Slides Maker-Week → executive review → Sales Kickoff dogfood reveal → Config 2024 ship story:** [First Round Review: How to Make Your Product Idea Go Viral Inside Your Company](https://review.firstround.com/how-to-make-your-product-idea-go-viral-inside-your-company-lessons-from-figma-slides/); 2024.
- **Six design-crit modes (Standard / Jams / Pair / Silent / Paper / FYI) + explicit "critiques NOT roadmap decisions" stance + named practitioners (Noah Levin, Niko, Jenny Wen, Andrew Shen):** [Figma Blog: How we do design critiques at Figma](https://www.figma.com/blog/design-critiques-at-figma/); Figma Blog (multiple authors).
- **Eng crits (Ojan Vafai origin; Shirley Miao + Laura Pang stewards; FigJam template; "feedback, not approval"; ~200 engineers eligible; recorded sessions):** [Figma Blog: How We Engineer Feedback at Figma with Eng Crits](https://www.figma.com/blog/how-we-run-eng-crits-at-figma/).
- **Wednesday + Friday weekly 30-min crit slots + VP Product attends + design team process structure + Levin's distinction between design-team and product-team process:** [Figma Blog: Inside Figma — the product design team's process](https://www.figma.com/blog/inside-figma-the-product-design-teams-process/); Noah Levin.
- **Figma's internal design system team using Dev Mode (Josh Ferrell, Brian Schlenker, Tom Williams, Wayne Sun, Ryhan Hassan, Rachel Miller; GitHub Action on Figma library publish; code-syntax mapping; 280-difference migration story):** [Figma Best Practices: How Figma's Internal Design System Team uses Dev Mode](https://www.figma.com/best-practices/how-figma-uses-dev-mode/).
- **Engineering values (Communicate Early & Often; Lift Your Team; Craftsmanship; Prioritize Impact); Thomas Wright + team co-authorship; "values are descriptive not aspirational":** [Figma Blog: Figma's engineering values](https://www.figma.com/blog/figmas-engineering-values/); Thomas Wright + Figma engineering.
- **A Year With Dev Mode lessons (variable scoping; Code Connect; "if it's not linked in Figma, it doesn't exist"; Laurent Thiebault, Decathlon EM as external practitioner):** [Figma Blog: A Year With Dev Mode — 10 Lessons From An Engineering Manager](https://www.figma.com/blog/10-lessons-from-an-engineering-manager/).
- **Field on roles blurring + design-to-code as "the most mechanical part" + taste-as-moat + Figma Make's role + visual-homogeneity concern:** [Latent Space: Taste is your moat — with Dylan Field, Figma](https://www.latent.space/p/figma); 2026.
- **CTO Rasmussen on Figma's engineering culture (full-stack teams across code boundaries; engineers engaged early in planning; deliberate never-double-in-a-year discipline; React/TypeScript/C++ frontend; Ruby/Go/TypeScript backend):** [The Pragmatic Engineer: Inside Figma's Engineering Culture](https://newsletter.pragmaticengineer.com/p/inside-figmas-engineering-culture); Gergely Orosz interviewing Kris Rasmussen.
- **Content design / UX writing at Figma (Ryan Cordell on real content from outset, conversation scripting before visual design, tagged comments looping in engineers for feasibility checks):** [Figma Blog: How to do content design / UX writing in Figma](https://www.figma.com/blog/how-to-do-content-design-ux-writing-in-figma/); Ryan Cordell.
- **Maker Week structure (twice yearly; four thematic Frames in #6; cross-functional inclusivity; some projects ship to production; historic outputs include auto layout + interactive components):** [Figma Blog: Inside Maker Week](https://www.figma.com/blog/inside-maker-week-more-than-a-hackathon/).
- **Noah Levin's account of design team growth + culture rituals (Trading Cards, Monday Warm-Up, monthly Design All-Hands, design ops staffing):** [Figma Blog: How we built the Figma Design Team](https://www.figma.com/blog/how-we-built-the-figma-design-team/); Noah Levin.
- **Sho Kuwamoto on composition applied to design systems + structured/loose-cousin features philosophy:** [LinkedIn / Computerworld / Figmalion topic page on Sho Kuwamoto](https://figmalion.com/topics/sho-kuwamoto); Sho Kuwamoto.
- **Marcin Wichary's prototyper methodology + role as design manager on Editor team:** [Figma Blog: Meet the maker — Marcin Wichary](https://www.figma.com/blog/meet-the-maker-marcin-wichary/).

`[SINGLE-SOURCE]` flags:
- The five-slot weekly crit arrangement (Tech-pillars Tuesday + Editor/Non-Editor Thursday + All-design Friday) appears only in the Lenny's Newsletter excerpt — the Levin design-team-process post names a different cadence (Wednesday + Friday 30-min slots). These may be a) two different reads of the same schedule, b) schedule evolution between 2018 and 2023, or c) different crit types (design-team-wide vs. team-area-specific). Treat as `[SINGLE-SOURCE]` until reconciled.
- The 22-PM org structure is sourced only from the Lenny's Newsletter interview — `[SINGLE-SOURCE]`. Likely accurate but no triangulation in this research pass.
- The acqui-hire of Visly to bring in DE expertise is sourced only from the First Round Yamashita interview — `[SINGLE-SOURCE]`. Visly's acquisition itself is publicly documented; the DE-expertise framing is Yamashita's read.
- The "engineers conduct retrospectives on every project" claim is sourced from the engineering-values post — `[SINGLE-SOURCE]` for the universality claim, though the value-statement itself is co-authored by the engineering team.

---

## Surprises / tensions

- **Far fewer named artifacts than expected.** I expected Figma to have parallel artifact tracks (design doc + eng doc + PRD + spec + handoff doc) the way Stripe or Linear might. Instead Figma collapses these into **a PRD-with-embedded-live-Figma-files + a prototype + Dev Mode**. The artifact count is small; the embedded fidelity per artifact is high. The Aaron framing this most directly answers — *how does design-tooling reduce the brief→design→spec translation count?* — is exactly this: the design file IS the spec; the prototype IS the PRD; the variable IS the token. There is no separate translation artifact for engineers to interpret.
- **Gates are deliberately split into mechanical (auto-enforce) vs. judgment (explicitly non-blocking).** Design crits and eng crits are *explicitly* not approval gates. Variable scoping and Code Connect and the GitHub Action are *explicitly* mechanical and falsifiable. Executive product review is the *only* human-judgment hard gate, and it sits with Field + Yamashita. This is a different shape than I expected — I anticipated multiple human-judgment gates spread across the chain. The Figma bet is to **centralize human-judgment gates at the strategic seam and mechanize everything below it**.
- **The Design Engineer role is structurally absorbed, not named.** Field acknowledges "roles are blurring" but Figma does not staff a public DE ladder the way Linear, Vercel, or even Stripe do. The work DE-shaped people do at peer companies — prototyping in tooling, encoding interactions, navigating between design and code — is at Figma absorbed by (a) PMs using Figma Make as PRD authoring tool, (b) engineers consuming Code Connect, and (c) the design-systems team holding the contract. This is a load-bearing pattern Cena should notice: Figma believes the DE function can be distributed via *tooling* rather than centralized in a role.
- **The coordination/orchestration layer is embedded in artifacts, not held by a PMO role.** No "Chief of Staff" or "Program Manager" appears in public discourse as a load-bearing coordination owner. The coordination is held by (a) the PRD + Project Tracker auto-sync, (b) Field + Yamashita at product review, (c) the crit cadence, and (d) the DS team's contract-shape via Code Connect + GitHub Action. This is the most Figma-specific structural observation: **coordination as live-artifact-surface rather than as separate-summary-layer**. Whether this scales beyond Figma's ~22-PM/200+-engineer size is an open question; it likely depends on the tooling being good enough that drift doesn't accumulate.
- **Maker Week as a coordination primitive.** I expected Maker Week to be culture-and-morale only; instead it's a load-bearing **idea-discovery primitive** that feeds the roadmap via internal viral momentum + executive review. Figma Slides shipped at Config 2024 via this path. The structural feature is **Field + Yamashita pay attention to internal-adoption signals** as a validation mechanism — not just as a cultural touch.
- **Tension between embedded-design model and coordination needs.** Designers "sometimes sit with other designers and sometimes with engineers; sometimes more than one product, sometimes none at all" (Levin). This creates real coordination cost — there isn't a single design-team ownership model. The crit cadence + Design All-Hands are the explicit cultural counterweight. For a 3-person Cena team this tension is moot (everyone sits with everyone); the lesson is that as Cena grows, the embedded model is Figma's chosen pattern, not a centralized design pod.
- **Public discourse is asymmetrically celebratory.** I expected to find at least one named pipeline failure or coordination-layer breakdown story. The closest is Field's reflection on Make Designs (pulled and reworked) but that's product-shape not pipeline-shape. The honest read is that Figma's public discourse is selection-biased toward what works; private failure stories (the Slides keynote was buggy at delivery; some Maker Week projects don't promote; some crits fail to land) are not publicly documented. This is a coverage gap for the synthesis pass to acknowledge.
