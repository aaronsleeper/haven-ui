# Linear — pipeline architecture research

## Source quality summary

- **Named practitioners cited:**
  - Karri Saarinen (co-founder, CEO, designer)
  - Jori Lallo (co-founder)
  - Tuomas Artman (co-founder, engineering)
  - Nan Yu (Head of Product, since May 2022)
  - Sabin Roman (first Engineering Manager)
  - Cristina Cordova (COO, since 2026-era)
- **Independent sources triangulated:** 14 primary + secondary sources across (a) the canonical `linear.app/method` doc set (Karri and team authored), (b) the `linear.app/docs` conceptual model, (c) the `linear.app/now` blog (Karri, others), (d) Lenny's Newsletter (Lenny Rachitsky's deep-dive on Linear's process + the Nan Yu interview), (e) Pragmatic Engineer (Sabin Roman interview), (f) First Round Review (Karri's path to PMF), (g) Figma Blog (Karri's 10 rules), (h) Glimpse (Nan Yu on team structure).
- **Date range of sources:** 2019 (early launch posts) → 2025 (Karri's "Design for the AI age", remote-work post, Cristina announcement). Linear's discourse is unusually current; most cited posts are from 2022–2025 because Linear keeps publishing.
- **Honest limits:** What I could **NOT** verify from public discourse:
  - The actual content of a Linear project spec template (the "Triage feature spec" Karri references in the Lenny interview is mentioned but not published in full).
  - Specifics of the design-review process — Linear says "design reviews are central" but no public artifact shows the cadence, the format, or the halt mechanics. They are described as "ad hoc and iterative" by Karri, which is itself the finding but obscures detail.
  - Internal disagreement resolution. Linear's discourse emphasizes "decisions based on taste and opinions" but does not show what happens when senior people's taste diverges. The implicit answer is "Karri's taste wins" since he is CEO + principal designer; this is read but not stated.
  - Quality gate falsifiability. Linear says "no strict checklist" — the gate is judgment carried by the engineers on the project. This is principle-stated rather than mechanism-described.
  - The exact shape of the "spec is the baseline, not the finish line" discipline in execution. Karri names it as a rule; the operational implication (when is a project actually "done"?) is left as judgment.

---

## Block A — Artifact chain

The Linear pipeline maps roughly to the seven sections of the Linear Method, in order, but the public discourse and the Lenny interview make the artifact sequence more granular. The chain is:

1. **Strategic direction document(s) / annual planning input** — *no fixed name, but referenced as "the 12-month direction"*
   - **Author:** Founders + small leadership group (Karri, Jori, Tuomas, Nan Yu, Cristina) for top-down; everyone in the company contributes parallel input via FigJam sessions.
   - **Reviewer/sign-off:** Founders own the final synthesis.
   - **Input:** Customer feedback, internal team observations, market position, founders' product vision.
   - **Output:** The set of **initiatives** for the year (top-down) + a half-year roadmap sketch.
   - **Format:** FigJam boards for input; the synthesized direction lives across multiple Linear initiatives + a written direction post.
   - **Source:** [Lenny — How Linear builds product](https://www.lennysnewsletter.com/p/how-linear-builds-product); [Karri's Linear Annual Product Planning Template on Figma Community](https://www.figma.com/community/file/1285828596884760720/linear-annual-product-planning-template).

2. **Initiative** — workspace-level container that groups a set of projects toward an objective
   - **Author:** Leadership (Karri + Nan + heads of function).
   - **Reviewer/sign-off:** Founders.
   - **Input:** Strategic direction.
   - **Output:** A curated list of projects + a brief describing the intent.
   - **Format:** Linear initiative entity — "manually curated list of projects with an accompanying document" ([Linear docs — Initiatives](https://linear.app/docs/initiatives)).

3. **Project plan (idea-draft document)** — exploratory phase, pre-spec
   - **Author:** Anyone who reaches for the project; often the eventual project lead (engineer or designer, never PM).
   - **Reviewer/sign-off:** No formal reviewer at this stage; reviewers self-select via weekly product meetings.
   - **Input:** Initiative brief, customer support themes, user research notes, internal observations.
   - **Output:** A "document or list where they draft ideas" ([Karri via Lenny](https://www.lennysnewsletter.com/p/how-linear-builds-product)).
   - **Format:** Linear document (markdown-like) attached to a placeholder project.

4. **Project spec** — the load-bearing written artifact
   - **Author:** The **project lead**, who is "in charge of writing the spec and general execution" ([Linear docs — Projects](https://linear.app/docs/projects)).
   - **Reviewer/sign-off:** The full team that will work on the project; Nan Yu (Head of Product) reviews at the highest level; Karri's taste is the implicit final filter for top-tier projects.
   - **Input:** Project plan, customer interviews, support themes.
   - **Output:** A "concise 1–2 page spec outlining key decisions" ([linear.app/now — How we run projects at Linear](https://linear.app/now/how-we-run-projects-at-linear)); communicates the "**why**, **what**, and **how**" ([Method — Introduction](https://linear.app/method/introduction)). Focuses on "context and intent" over technical implementation.
   - **Format:** Linear document, short. Karri explicitly notes "short specs for fast feedback."

5. **Project (in Linear, the entity)** — the unit of execution; contains issues + the spec + milestones
   - **Author:** Project lead instantiates the Linear project entity.
   - **Reviewer/sign-off:** Lead is "in charge of writing the spec and general execution" but the whole team collaborates on the brief and writes issues.
   - **Input:** Spec + initiative.
   - **Output:** A populated project with milestones (Internal, Beta, GA, Post-launch, Nice-to-haves), issues, and assigned owners.
   - **Format:** Linear project entity, with a single `lead` field plus members.
   - **Source:** [linear.app/now — How we run projects at Linear](https://linear.app/now/how-we-run-projects-at-linear).

6. **Issues** — the fundamental unit of work
   - **Author:** "Everyone on the team should write their own issues" ([Method — Write issues not user stories](https://linear.app/method/write-issues-not-user-stories)).
   - **Reviewer/sign-off:** Self-owned; the assignee is accountable. Bug reports may be filed by others (CX team, goalie) but the assignee reframes them.
   - **Input:** Spec, sub-decomposition of milestones, customer feedback funneled through triage.
   - **Output:** Linear issue entity with title (short, plain), optional description, status, assignee, cycle assignment.
   - **Format:** Linear issue — short plain-language title, optional description (Karri: descriptions "should be optional, not required").

7. **Weekly project update** — coordination touchpoint during execution
   - **Author:** Project lead.
   - **Reviewer/sign-off:** No formal sign-off; auto-posts to `#product-updates` Slack channel + project-specific channel for visibility.
   - **Input:** Current project state.
   - **Output:** Async written summary of "current state of the project and what's top of mind."
   - **Format:** Linear project-update entity, auto-distributed.
   - **Source:** [linear.app/now — How we run projects at Linear](https://linear.app/now/how-we-run-projects-at-linear); [Lenny — How Linear builds product](https://www.lennysnewsletter.com/p/how-linear-builds-product).

8. **Feature flag / internal dogfood release** — first gate to seeing the work in the wild
   - **Author:** Engineers on the project.
   - **Reviewer/sign-off:** The team self-judges; Linear ships internally first within "days or weeks of project start."
   - **Input:** Working code behind a flag.
   - **Output:** Internal usage data + qualitative team feedback.
   - **Format:** Working software gated by flags.

9. **Feature roast / product meeting demo** — weekly cross-team review
   - **Author:** Project lead presents.
   - **Reviewer/sign-off:** Product meeting attendees (heads + interested cross-team eyes); no formal vote, judgment-based feedback.
   - **Input:** Work-in-progress feature.
   - **Output:** Iteration direction.
   - **Format:** Live demo + critique in the weekly product meeting.
   - **Source:** [linear.app/now — How we run projects at Linear](https://linear.app/now/how-we-run-projects-at-linear).

10. **Release candidate → Origins (private beta)** — external gate
    - **Author:** Project team.
    - **Reviewer/sign-off:** Origins beta customers; team gates promotion based on feedback.
    - **Input:** Polished RC build.
    - **Output:** Beta usage + qualitative customer feedback.
    - **Format:** Linear Origins program (private beta channel).

11. **Public launch** — GA milestone
    - **Author:** Project team + marketing/comms (post-Cristina, this is a more formalized GTM hand).
    - **Reviewer/sign-off:** "It comes down to the engineers working on the project feeling that the project is ready" ([linear.app/now — How we run projects at Linear](https://linear.app/now/how-we-run-projects-at-linear)). No strict checklist; engineers' judgment of polish + customer-segment readiness.
    - **Input:** Beta-validated RC.
    - **Output:** GA release.
    - **Format:** Public Linear product release.

12. **Changelog** — public-facing artifact + internal accountability
    - **Author:** The project team writes the changelog entry.
    - **Reviewer/sign-off:** Goes up alongside launch; team judgment.
    - **Input:** Shipped work.
    - **Output:** Public changelog post; reminds market of progress and serves as internal accountability ("it reminds you every week what happened" — [Method — Build in public](https://linear.app/method/build-in-public)).
    - **Format:** Blog-style post on linear.app/changelog.

13. **Post-launch iteration + bug triage** — ongoing
    - **Author:** The weekly **goalie** (rotating engineer) handles incoming triage.
    - **Reviewer/sign-off:** Goalie owns routing for the week; engineer fixes or reassigns to the right expert.
    - **Input:** CX-filed issues, user reports, Origins feedback.
    - **Output:** Categorized issues routed to teams or assigned directly; bugs fixed per zero-bugs policy.
    - **Format:** Linear Triage queue (a special inbox) + the team's normal workflow.
    - **Source:** [linear.app/now — CX in Linear](https://linear.app/now/cx-in-linear); [Linear docs — Triage](https://linear.app/docs/triage); [Pragmatic Engineer — Linear: Move fast with little process](https://newsletter.pragmaticengineer.com/p/linear-move-fast-with-little-process).

**Branch + merge points:** The chain has one early branch: design exploration and engineering exploration run **in parallel from the spec phase forward**, not as design-hands-to-eng sequentially. The merge point is continuous — design and engineering "work collaboratively throughout the project design and implementation process and start working together when writing the project spec" ([Method — Manage design projects](https://linear.app/method/manage-design-projects)). Karri is explicit: **"there's no handoff to dev."** ([Figma Blog — Karri's 10 rules](https://www.figma.com/blog/karri-saarinens-10-rules-for-crafting-products-that-stand-out/)).

---

## Block B — Roles + expertise

Linear's role topology is the headline finding for the **Cena-shape question** ("minimum viable structure for a high-velocity team"). The roles are deliberately few, deliberately fluid, and deliberately empower the maker.

### Project Lead

- **Title:** Project Lead.
- **Stages owned:** Authoring the project spec; running the weekly project update; "general execution" of the project; ship/no-ship judgment with the engineering team.
- **Expertise the role brings:** The lead is an engineer or designer with **product judgment** specific to this project's domain — typically someone with prior expertise in the adjacent area, but bandwidth also factors in.
- **Headcount discipline:** Rotational, not specialized. "Nobody is the de facto project lead" — the practice is to spread leadership capacity across the team. Each project has exactly one lead at a time; the role is filled per-project, not per-team.
- **Source:** [linear.app/now — How we run projects at Linear](https://linear.app/now/how-we-run-projects-at-linear); [Linear docs — Projects](https://linear.app/docs/projects).

### Product Engineer (the load-bearing default role)

- **Title:** Engineer / Product Engineer / Software Engineer (Linear does not stratify with engineering levels — Sabin Roman: "no engineering levels exist; seniority is contextual rather than titular" — [Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/linear-move-fast-with-little-process)).
- **Stages owned:** Writes own issues; makes implementation + design-during-implementation decisions; ships work; participates in feature roasts; serves on goalie rotation; signs off on ship-readiness.
- **Expertise the role brings:** **Strong product sense** — engineers are de-facto PMs. Karri: "every engineer and designer is a de-facto PM." Engineers are expected to "be experts at using their product" (Nan Yu, via [Grace Ge — When to Hire Your First PM](https://gracege.substack.com/p/when-to-hire-your-first-product-manager)).
- **Headcount discipline:** ~20–25 engineers on web/mobile when Nan Yu was interviewed (Glimpse). Hire slowly, expect product judgment baseline.

### Product Designer

- **Title:** Designer / Product Designer.
- **Stages owned:** Embedded in every user-facing project (one designer per project team); files own issues; explores during early phase; collaborates on the project spec; makes design decisions during implementation.
- **Expertise the role brings:** Both visual/interaction craft AND product-decision authority. Linear hires designers who "stay pretty high level" so engineers can make pixel-level decisions during execution (Nan Yu via Glimpse).
- **Headcount discipline:** Very lean — **~2 designers serving ~20–25 engineers** ([Glimpse — Building Product at Linear](https://www.theglimpse.co/p/nan-yu)). One designer typically lands on each user-facing feature team.

### Head of Product (Nan Yu — the only PM at Linear)

- **Title:** Head of Product.
- **Stages owned:** Highest-level problem definition; customer-intelligence synthesis from sales/support; cross-team connection ("how do these features interact?"); provides supporting role to engineers/designers on product decisions, not directing role.
- **Expertise the role brings:** **Customer intelligence + cross-pipeline coordination** — Nan describes their job as "to connect different teams to each other." Specifically anti-pattern-avoiding: "engineers and designers rely completely on PMs for product decisions. We want to avoid that" (Nan Yu via [Creator Economy](https://creatoreconomy.so/p/nan-yu-inside-how-linear-crafts-quality-products)).
- **Headcount discipline:** **One.** Linear hired its first PM only after reaching PMF; Nan Yu remains the only PM in the role as of public discourse through 2025.

### CEO / Co-founder (Karri Saarinen)

- **Title:** CEO + Co-founder + Designer.
- **Stages owned:** Sets product direction at the annual + 12-month layer; ultimate brand + design taste filter; quality-bar holder.
- **Expertise the role brings:** Principal-designer expertise + founder vision authority. "Quality is our first principle. Every other metric and decision flows from that" ([First Round Review — Linear's Path to PMF](https://review.firstround.com/linears-path-to-product-market-fit/)).
- **Headcount discipline:** One. Karri is the implicit final-taste arbiter for top-tier work, but does not gate every project — most projects ship without his direct review beyond direction-setting.

### Co-founders (Jori Lallo, Tuomas Artman)

- **Title:** Co-founders / engineering + product backbone.
- **Stages owned:** Annual direction; architectural / strategic engineering decisions.
- **Expertise the role brings:** Founder context + senior engineering taste.

### Engineering Manager (Sabin Roman — first EM)

- **Title:** Engineering Manager.
- **Stages owned:** Team coordination, hiring, remote-work coordination; "manages people," not "manages projects" (projects are owned by their leads).
- **Headcount discipline:** Added when the team was ~25 engineers, which signals the threshold Linear treats EMs as needed.

### COO (Cristina Cordova, joined ~2026)

- **Title:** Chief Operating Officer.
- **Stages owned:** GTM, marketing, sales, operations, data, talent — i.e., everything that surrounds the product pipeline without being inside it. Joined as Linear's complexity grew enough to warrant a non-product COO.
- **Source:** [linear.app/now — Welcoming Cristina Cordova](https://linear.app/now/welcoming-cristina-cordova-to-linear).

### Weekly Goalie (a *responsibility*, not a role)

- **Stages owned:** All incoming triage during the week — bug reports, support escalations, user-filed feature requests; either fixes directly or routes.
- **Expertise the role brings:** Cross-team awareness; quality discipline (the goalie is the embodiment of the zero-bugs policy at week-cadence).
- **Headcount discipline:** Rotating among engineers (and sometimes product people). PagerDuty / OpsGenie / Rootly / Incident.io integrations automate the schedule.
- **Source:** [linear.app/now — CX in Linear](https://linear.app/now/cx-in-linear); [Linear docs — Triage](https://linear.app/docs/triage); [Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/linear-move-fast-with-little-process).

### Customer Experience (CX) team

- **Stages owned:** Intake of customer feedback (Intercom, Slack, social, Reddit); converting raw signal into Linear Asks templates that auto-route bugs to engineering and feature requests to product.
- **Expertise the role brings:** Customer-voice translation — making support "feel like an extension of the product itself" by closing the loop directly through Linear's own toolset.

### Boundary roles — explicitly absent at Linear

The Cena-shape value is partly in **what Linear deliberately does not have**. Linear has no:

- **Engineering Manager-per-team layer.** Engineering managers exist but are not per-project gatekeepers.
- **Product Manager-per-team layer.** "No durable cross-functional teams. No PMs except Nan." ([Lenny — How Linear builds product](https://www.lennysnewsletter.com/p/how-linear-builds-product)).
- **Designer-as-handoff-author role.** "There's no handoff to dev." Designers are embedded, not upstream.
- **Specialized QA team.** The goalie + engineer ownership covers the surface QA would own.
- **Engineering levels.** Sabin Roman: contextual seniority, no titular hierarchy.

The implicit boundary-role finding is that Linear collapses traditional PM-EM-design-lead-QA boundaries **into the maker** — engineers and designers carry product judgment, ship judgment, and customer-empathy responsibility. The "coordination layer" between roles is therefore **shrunk to nearly nothing** at the per-project level; it lives only in the project-lead-and-Head-of-Product layer above the makers.

---

## Block C — Gates between artifacts

Linear's gating discipline is **judgment-shaped, not checklist-shaped**. The Linear Method explicitly favors values over rigid processes ("establish values over rigid processes" — [Figma Blog rule 9](https://www.figma.com/blog/karri-saarinens-10-rules-for-crafting-products-that-stand-out/)). The gates exist but are carried by individuals' product sense rather than written stage-passes. This is itself the load-bearing finding for Cena: Linear's pipeline runs on **gates as judgment**, with the falsifiability mostly mechanical-at-the-tool-layer (cycles auto-advance, dates don't move, milestones auto-roll) rather than checklist-at-the-content-layer.

### Direction → Initiative

- **What is checked:** Does the initiative ladder up to the annual direction? Is it phrased as an objective with associated projects?
- **Authority to halt:** Founders, particularly Karri.
- **What halt produces:** Re-scoping at the founder layer; not exposed downward.
- **Falsifiability:** Judgment. There is no public mechanism that says "initiative X failed the gate." The mechanism is leadership-room argument.

### Initiative → Project plan

- **What is checked:** Does the proposed project move the initiative forward in a 1–3 week × 1–3 person scope? Linear's scope discipline: "Designed to be completed in 1–3 weeks with a team of 1–3 people" ([Method — Scope projects down](https://linear.app/method/scope-projects)).
- **Authority to halt:** Project lead (when self-selecting); Nan Yu when the cross-team coordination question matters; Karri when direction-fit is in question.
- **What halt produces:** Re-scoping ("break it down into stages"). Linear is explicit: if it can't be scoped down, break it down.
- **Falsifiability:** Judgment. The "scoped enough?" gate is carried by the project lead's experience.

### Project plan → Project spec

- **What is checked:** Is the spec clear on **why**, **what**, and **how**? Does it focus on **context and intent** rather than technical implementation? Is it short (1–2 pages)? Does it engage with customer interviews and synthesize them?
- **Authority to halt:** The project team (collectively); Nan reviews high-level for product cohesion ("how do these features interact?"); Karri's taste applies on the high-stakes ones.
- **What halt produces:** Spec rework. Iterative re-drafting in async Slack feedback.
- **Falsifiability:** Judgment. Linear's explicit anti-pattern is "ad hoc and iterative" review rather than formal gates ([Lenny](https://www.lennysnewsletter.com/p/how-linear-builds-product)).

### Project spec → Issues + execution

- **What is checked:** Are issues written by the people doing the work, in plain language, with optional descriptions? Are they small enough?
- **Authority to halt:** The assignee can refuse to take an issue that doesn't match their understanding of the work.
- **What halt produces:** Reframing of the issue by the assignee.
- **Falsifiability:** Mechanical at the tool layer (issue exists, has assignee, has cycle, has team workflow status). Content-falsifiability is judgment.
- **Source:** [Method — Write issues](https://linear.app/method/write-issues-not-user-stories).

### Cycle gate (the load-bearing mechanical one)

- **What is checked:** Are issues in the active cycle progressing? Does the capacity dial show feasibility?
- **Authority to halt:** None — the cycle auto-advances. "Past cycle dates cannot be changed" ([Linear docs — Cycles](https://linear.app/docs/use-cycles)).
- **What halt produces:** Auto-rollover of unfinished work to the next cycle. "Any unfinished work rolls over to the next cycle automatically. There is no way to keep unfinished issues in a closed cycle."
- **Falsifiability:** **Mechanical and full.** This is the most falsifiable gate in the Linear stack — the cycle ends, period. The gate is enforced by the software primitive itself.

### Execution → Internal dogfood

- **What is checked:** Does the feature work behind a flag? Internal team finds it usable?
- **Authority to halt:** Engineers on the project judge readiness.
- **What halt produces:** More iteration before any external exposure.
- **Falsifiability:** Judgment-shaped; mechanical only in the flag-toggle sense.

### Feature roast (cross-team review)

- **What is checked:** Does the work-in-progress hold up to cross-team product critique? Does it feel like Linear-quality?
- **Authority to halt:** No single reviewer; the product meeting attendees raise concerns; the project team absorbs the feedback.
- **What halt produces:** Iteration before progressing to RC.
- **Falsifiability:** Judgment, with social pressure as the calibration ("does this feel Linear-quality?").

### Internal → Origins (private beta)

- **What is checked:** Does the project team feel the work is ready for selected external users?
- **Authority to halt:** Project lead + team.
- **What halt produces:** More internal iteration.

### Origins → GA (public launch)

- **What is checked:** Karri's headline quote: **"It comes down to the engineers working on the project feeling that the project is ready"** ([linear.app/now — How we run projects at Linear](https://linear.app/now/how-we-run-projects-at-linear)). Balanced against polish levels and customer-segment readiness.
- **Authority to halt:** The engineers on the project. **This is unusual.** In most companies the PM, designer, or leadership holds ship-authority; at Linear the engineers do.
- **What halt produces:** More iteration; potentially expanded beta.
- **Falsifiability:** None mechanical. "No strict checklist." This is the gate Linear most explicitly leaves as judgment.

### Zero-bugs gate (continuous, post-launch)

- **What is checked:** Are filed bugs being closed promptly? Are users surfacing issues that the team didn't see?
- **Authority to halt:** **Goalie**, then engineer-owner. Linear's zero-bugs policy is enforced at week-cadence by the goalie.
- **What halt produces:** Bug fixes prioritized into normal cycles; new feature work yields to bug debt when needed.
- **Falsifiability:** Mechanical in the sense that bugs are tracked as issues with status; judgmental in the "is this a bug or expected behavior?" call. Sabin Roman: "giving engineers the freedom to both decide when a bug should be considered a bug" ([Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/linear-move-fast-with-little-process)).

### The pattern — gates as judgment, mechanics as scaffolding

Linear's gate philosophy is: **the software primitive (the project + cycle + milestone model) is the mechanical scaffold; the judgment of the maker is the actual gate.** Cycles auto-advance because time is the only mechanical halt Linear trusts. Everything else is judgment that the makers carry, with the spec as the "context and intent" reference they can hold themselves to.

The implicit cost: this only works because Linear hires for product judgment as the floor (paid 2–5 day work trials; rejection of candidates who lack product sense). The gates are robust when the makers are; the discipline does not transfer to teams that hire for narrower skill bands.

---

## Block D — Per-artifact briefs (5-attribute frame)

### D1. Strategic direction (annual planning)

- **Purpose:** Set the company's product direction for the next 12 months; align all initiatives, projects, and individual issue-writing back to a coherent overarching story. Downstream: initiatives (Block A artifact 2) inherit from this document; every project's spec connects back through the initiative it serves; even individual issues are written by people who internalize the direction.
- **Canon:** Past direction documents; the brand voice (which Karri personally owns); the product's positioning ("the best in class tool for this particular purpose"); the company's quality-first principle ("quality is our first principle"); customer-segment focus (ICs in fast-growing startups, expanded toward enterprise readiness as company scales).
- **Brief:** A combined top-down + bottom-up shape. Two-track input: (a) founders + leadership draft 12-month direction; (b) parallel FigJam sessions with the whole team gather ideas, frustrations, themes. Synthesis combines both into the year's set of initiatives + a half-year detailed view + a sketched second-half. Format is short prose + initiative list; Karri's posted [Annual Product Planning Template on Figma Community](https://www.figma.com/community/file/1285828596884760720/linear-annual-product-planning-template) is the public artifact.
- **Domain:** Founder vision + product taste (Karri); customer intelligence (Nan + CX team feeding it); engineering capacity awareness (Tuomas + Sabin); business strategy (Cristina, post-2026). Cross-functional, but **owned by the founders**.
- **Process:** Annual cadence. Leadership group drafts. Parallel team-wide FigJam input. Synthesis into initiatives. Communicated company-wide. Consulted at every subsequent project-spec authoring as the "does this ladder up?" check. Reviewed at high-level half-year mark with quarterly tracking.

### D2. Initiative

- **Purpose:** Express a strategic objective and group the set of projects that achieve it. Downstream: project plans (D3) check against an initiative for fit; leadership dashboards roll up initiative progress.
- **Canon:** The annual direction document; prior initiatives (especially still-open ones); customer-segment focus.
- **Brief:** "A manually curated list of projects with an accompanying document" ([Linear docs — Initiatives](https://linear.app/docs/initiatives)). The accompanying document names the objective, the success criteria (light-touch, taste-based; Linear avoids OKRs), and the rationale.
- **Domain:** Leadership + product (Nan).
- **Process:** Authored by leadership; visible to whole company as a Linear initiative entity; provides the "why" context for any project that joins it. Not gated heavily — projects can move between initiatives as understanding evolves.

### D3. Project plan (exploratory)

- **Purpose:** Surface a candidate area of work; gather context before committing to a project spec. Downstream: feeds the project spec (D4) when the project is committed; can also be archived if the team decides not to pursue.
- **Canon:** Customer feedback themes (CX-funneled); user research notes; the initiative the work would belong to; prior projects in adjacent area.
- **Brief:** A Linear document. "Project plans start as documents or lists where they draft ideas." Captures candidate problem framings, sketches, related tickets. Not heavy.
- **Domain:** Whoever is touching the area — typically the future project lead (engineer or designer) and adjacent teammates.
- **Process:** Lightweight. Iterates async. Triggers commitment when the team agrees "this is worth a project."

### D4. Project spec

- **Purpose:** **Communicate the why, the what, and the how clearly and concisely.** Downstream: the spec is the team's shared reference during execution; engineers + designers compose against it; the project lead writes the weekly update against it; ship-readiness is partly judged against whether the spec's intent has been honored. **Karri's frame: "The spec is the baseline, not the finish line"** — the spec defines minimum quality, the team strives beyond it.
- **Canon:** The initiative brief (ladder-up check); the Linear design canon (what does Linear-quality look like in this surface?); the conceptual model (Issues / Projects / Initiatives / Cycles vocabulary); prior specs (especially for related features); customer-segment focus.
- **Brief:** **Concise (1–2 pages).** Focus on **context and intent over technical implementation**. Sections (inferred from Karri's writing + Lenny interview, not formally documented as a template): the problem being solved (why); the proposed approach at a high level (what); how it fits the product (how); customer interviews summarized; key decisions enumerated; out-of-scope items named. **Short for fast feedback** — Linear privileges spec-velocity over spec-completeness.
- **Domain:** Product judgment + design taste + engineering pragmatism. The project lead carries primary authoring weight; the whole team contributes; Nan Yu reviews at the cross-cohesion layer; Karri's taste applies to brand-shape decisions.
- **Process:** Project lead drafts; team comments async via Slack; iterates within days. Customer interviews happen alongside. Spec is "done" when the team agrees it captures intent — not when every decision is locked. Then the team starts writing issues and the spec becomes the reference.

### D5. Project (Linear entity)

- **Purpose:** Hold the unit of execution; provide the scaffold that issues + the spec + milestones + the lead all attach to. Downstream: enables weekly updates, milestones, progress visibility for leadership and cross-team eyes.
- **Canon:** The Linear conceptual model (a project is "a unit of work that has a clear outcome or planned completion date" — [Linear docs — Conceptual model](https://linear.app/docs/conceptual-model)); the scope discipline (1–3 weeks × 1–3 people, or break down).
- **Brief:** Linear project entity with: name; lead (single field, "to keep ownership of the project clear"); icon; description; spec doc attached; milestones (Internal, Beta, GA, Post-launch, Nice-to-haves — these are the conventional ones, not enforced); issues; status; target dates.
- **Domain:** Project lead authors; whole team uses.
- **Process:** Instantiated when the project spec is committed. Lives as a Linear entity that the team works inside. Closes when the GA milestone ships and the team agrees it's done.

### D6. Issues

- **Purpose:** **Describe a task with a clear, defined outcome.** Downstream: an issue is the unit an engineer or designer picks up and executes; it generates the commit / PR / design file / decision artifact.
- **Canon:** The Linear conceptual model; the **"write issues not user stories"** anti-pattern stance from Karri (user stories as "a cargo cult ritual that feels good but wastes a lot of resources and time"); plain-language discipline.
- **Brief:** **Short, simple title that directly states what the task is.** Description optional — "should be optional, not required, and you should write only as much as needed to share and communicate relevant information." Quote user feedback verbatim, don't summarize. Keep user-experience discussion at the product level (in the spec), not at the issue level.
- **Domain:** **Whoever is doing the work writes the issue.** "It's faster and easier for the person who understands how to do the work to write issues describing it."
- **Process:** Author writes; assignee owns (almost always the same person, except for bug reports where CX/goalie files and engineer reframes). Issue moves through team's workflow statuses. Auto-rolls between cycles.

### D7. Weekly project update

- **Purpose:** Maintain cross-team visibility on project state; force project lead to reflect weekly; surface blockers. Downstream: leadership scans updates; cross-team makers stay aware of related work; absent escalation surfaces as drift in updates.
- **Canon:** The project spec (the intent against which "current state" is measured); the milestones the project is tracking.
- **Brief:** Async written summary. "Current state of the project and what's top of mind." Short. Linear's update entity auto-posts to `#product-updates` Slack channel and to project-specific channels.
- **Domain:** Project lead.
- **Process:** Weekly cadence. Written async. Auto-distributed. Not formally reviewed; serves as ambient awareness.

### D8. Cycle

- **Purpose:** Provide rhythm for the team; time-box a coherent batch of issues; force capacity awareness. Downstream: issues auto-roll between cycles, forcing teams to confront unfinished work.
- **Canon:** The Linear cycle conceptual model; the team's chosen cycle duration + start day; the capacity dial.
- **Brief:** 1–8 weeks (2-week most common). Auto-creates upcoming cycles. Cannot vary duration. Past dates immutable. Includes cooldown periods optional.
- **Domain:** Team-level configuration (engineering team picks duration + day).
- **Process:** Mechanical and recurring. Linear's tool enforces. No human gate.

### D9. Internal dogfood / feature flag

- **Purpose:** Get the work into actual use by the team before any external exposure. Downstream: qualitative + quantitative signal informs whether to advance to Origins.
- **Canon:** "Build for the daily users" — Linear's team is its own first user.
- **Brief:** Implementation behind a flag. Linear's team turns the flag on for themselves "within days or weeks of project start."
- **Domain:** Engineering.
- **Process:** Continuous. No formal cadence.

### D10. Feature roast (weekly product meeting demo)

- **Purpose:** **Cross-team review of work-in-progress.** Downstream: project team absorbs critique and iterates; "feels Linear-quality?" judgment is sharpened.
- **Canon:** The brand + design canon (Karri's taste); Linear-quality as the implicit bar.
- **Brief:** Project lead demos live in the weekly product meeting. Cross-team eyes critique.
- **Domain:** Cross-functional — every senior maker brings their lens.
- **Process:** Weekly cadence. Informal but consistent.

### D11. Release candidate → Origins beta

- **Purpose:** External validation with motivated customers before public launch.
- **Canon:** The customer-segment focus; the spec's success criteria.
- **Brief:** RC build deployed; Origins customers (private beta) get access; CX team gathers feedback.
- **Domain:** Project team + CX.
- **Process:** Customer-feedback iteration loop; project team decides when GA-ready.

### D12. Public launch + changelog

- **Purpose:** Reach the market; remind market of progress; create accountability for ongoing shipping.
- **Canon:** "Launch and keep launching" — multiple launches over one big launch; build-in-public discipline; brand voice (Karri's tone).
- **Brief:** Public changelog entry + (sometimes) a longer post on linear.app/now. Voice is Karri-set — direct, opinionated, craft-honoring.
- **Domain:** Project team writes the changelog entry. (Post-Cristina, GTM/comms support exists for larger launches.)
- **Process:** Aligned with GA. Auto-distributed.

### D13. Triage queue + zero-bugs

- **Purpose:** Catch all incoming signal (bugs, feature requests, user feedback) and route reliably. Downstream: issues flow into normal team workflows or get fixed directly.
- **Canon:** Zero-bugs policy ("engineers have the freedom to decide when a bug is a bug"); the Linear Triage primitive.
- **Brief:** Special inbox per team. Issues land there when filed by integration or non-team-member. **Triage Intelligence** assists: duplicate detection, label-suggestion, assignee-suggestion. Goalie owns final routing.
- **Domain:** Goalie (rotating engineer + product); CX for intake; assignee-engineer for closure.
- **Process:** Continuous intake; weekly goalie ownership; auto-rotation can be tied to PagerDuty / OpsGenie / Rootly / Incident.io.

---

## Block E — Coordination/orchestration layer

This is the load-bearing block per the brief, and Linear's answer is **distinctive**: the coordination layer is partly a *role* (Head of Product), partly a *cadence* (weekly project updates + monthly all-hands + annual planning), partly a *written artifact* (the project spec + the initiative + the changelog), and crucially **partly the software primitive itself** — the Linear conceptual model (Issues / Projects / Initiatives / Cycles / Triage) **encodes the discipline as a tool surface, not just an authored doc**.

This last point is the load-bearing Linear-specific finding. Linear ships its own coordination primitive and uses it for itself, making the coordination layer **a software surface the makers operate in directly** rather than a layer that hovers above them.

### What does this layer do

- **Sequencing across projects.** The cycle primitive enforces rhythm; the project lead role keeps single-pipeline coherence; weekly updates surface cross-project drift.
- **Strategic alignment.** Initiatives + annual direction provide ladder-up; the project spec explicitly opens with "why" so makers re-encounter the strategic intent inside their daily artifact.
- **North-star-from-initial-brief enforcement.** Two mechanisms: (a) the **initiative entity** carries the objective from annual planning into every project that joins it, so makers see "this project belongs to initiative X" inside their tool; (b) the **project spec's "context and intent" focus** forces every project lead to restate the why in their own words. The combination is generative-determinism shaped — the initiative is the deterministic contract (the objective), the spec is the generative fill (the project's specific approach within it).
- **Missed-thing detection.** Linear's mechanism is largely **the goalie + triage primitive** for incoming signal, the **CX team's structured intake** (Intercom + Linear Asks templates auto-routing), and the **weekly product meeting + feature roasts** for in-progress work. The Karri / Nan answer is essentially "many eyes plus a structured-inbox primitive plus rotating accountability."

### Where does this layer sit

- **A role:** Head of Product (Nan Yu). Nan's primary function: "to connect different teams to each other" and "how do these features interact?" Cross-project cohesion is held by one person, not a layer.
- **A cadence:** Weekly project meetings + weekly project updates + weekly goalie rotation + monthly all-hands + Quality Wednesdays + annual planning + annual offsite.
- **A tool/system:** **Linear itself** — the conceptual-model entities (Initiative → Project → Cycle → Issue + Triage + Cooldown + Project-update entity) ARE the coordination layer made tangible.
- **A written artifact:** The project spec; the initiative document; the weekly updates; the changelog.
- **A software primitive:** **The single-`lead` field on Projects** keeps ownership unambiguous; **cycle auto-advance** removes the human-gate failure mode of date-slippage; **triage-responsibility rotation** mechanically distributes accountability for incoming work.

### What artifacts does it produce or consume

- **Consumes:** customer feedback (via CX intake + Linear Asks templates), team-wide planning input (annual FigJam), individual maker observations.
- **Produces:** annual direction document, initiatives, project specs, weekly updates, monthly all-hands metrics + demos, the public changelog.

### How does it interact with the per-pipeline chains

- **Gates them lightly.** Cycles auto-advance (mechanical gate); ship-readiness is held by engineers (judgment gate); the layer above does not stop individual projects.
- **Observes them.** Weekly updates auto-distribute. Leadership scans rather than approves.
- **Course-corrects mid-pipeline.** The feature roast in the weekly product meeting is the formal mid-stream course-correction surface; ad-hoc Slack feedback fills the rest.
- **Holds the north star.** The annual direction + initiatives carry the north star; the spec's "why" pulls it down into every project.

### How does it maintain course toward the north star

The mechanism is **structural restatement at every layer**:

- Annual direction document is authored.
- Initiatives carry objectives forward from it.
- Project specs open with "why" — every project lead restates how this project ladders up.
- Weekly project updates re-express current-state-against-intent.
- The product-meeting cadence asks "is this still Linear-quality, still on-direction?" weekly.

The layer relies on **the maker** having internalized the direction (via hiring + onboarding + the spec discipline) rather than an external check enforcing it. The structural restatement is the safety net.

### How does it ensure things don't get missed

**Three primitives in combination:**

1. **Triage as a typed inbox.** Anything filed by a non-team member or an integration lands in the team's triage queue. The goalie + Triage Intelligence assist routing.
2. **Goalie rotation.** Accountability for the inbox is rotated weekly. Nobody can quietly let triage rot.
3. **The CX team's structured intake.** CX converts raw customer signal into typed Linear Asks templates that auto-route. This is the "design the inbox so the right things land in the right place" discipline.

Notably absent: **a centralized "did we miss anything?" review.** Linear does not have a formal cross-pipeline retro mechanism that scans for misses. The mechanism is structural intake plus rotating accountability plus the bug-tracking discipline (zero-bugs). The failure mode this leaves open: things that don't surface as bugs or as triage items can stay missed (e.g., a strategic-direction-drift question that nobody files as an issue). The implicit answer is "Karri + Nan + the leadership group catch this at the annual + half-year cadence" — which works at Linear's scale and won't necessarily scale to teams without that hands-on leadership.

### What happens when it's absent or weak

Linear has not publicly retro'd "we used to not have this and here's what broke" in a structured way that's discoverable in the public discourse — they generally publish forward-going wisdom, not retro-honest failure analysis. Inferences from the public material:

- **Pre-Cristina (no COO):** GTM, sales, marketing were either Karri-held or distributed across functional leads. The hiring of Cristina in 2026 signals that the coordination scope outgrew "Karri holds it all"; the coordination role was promoted formally.
- **Pre-Nan (no Head of Product):** Karri held product direction with Tuomas + Jori. The product-coordination role was promoted formally only when complexity warranted (post-PMF).
- **Pre-Sabin (no EM):** Engineering coordination was peer-held. The EM role was added at ~25 engineers.
- **The pattern:** Linear promotes a coordination role only when the complexity demands it, not preemptively. **The default is "embedded in the maker," not "delegated to a coordinator."**

### Linear's coordination layer is a software-primitive answer to the coordination question

The frame that emerges: **the coordination layer at Linear is mostly a TOOL surface, not a HUMAN process.** The cycle primitive replaces the "sprint planning meeting → sprint review → retro" ceremony. The triage primitive replaces the "incoming-bug intake meeting." The project primitive replaces the "PRD review → spec sign-off → design review" ceremony. The weekly project update replaces the standup. The changelog replaces the "release notes meeting."

Where ceremony remains, it's **light and judgment-based** (weekly product meeting + feature roast). Where the discipline matters most, it's **encoded in the tool primitive** (cycle auto-advance, single project lead field, triage routing).

This is generative-determinism applied at the org-coordination layer: the **tool primitive is the deterministic contract**; the **maker's judgment is the generative fill**.

---

## Clinical-context probe (Headspace only)

N/A — Linear is a software pick, not the clinical-overlay pick.

---

## Citations

(Format: claim → source URL + practitioner / outlet + date when available.)

- "Linear Method" overall structure and 14 practices → [Linear Method — Principles & Practices](https://linear.app/method/introduction) (Karri Saarinen, ongoing maintenance).
- "Build for the creators... a tool should work for you, not the other way around" → [Linear Method — Introduction](https://linear.app/method/introduction).
- Initiatives as primary direction-setting artifact → [Linear Method — Set the product direction](https://linear.app/method/product-direction).
- Goals as "remind you what matters for the medium or long term" + walked-backward approach (10 users → 100 users → $1000 MRR) → [Linear Method — Set useful goals](https://linear.app/method/set-useful-goals).
- Enablers vs. blockers definition → [Linear Method — Prioritize enablers and blockers](https://linear.app/method/prioritize-enablers-and-blockers).
- Scope discipline: 1–3 weeks × 1–3 people → [Linear Method — Scope projects down](https://linear.app/method/scope-projects).
- "Decide to do it or not to do it. Then you do it today instead of tomorrow" → [Linear Method — Generate momentum](https://linear.app/method/building-with-momentum).
- "User stories... a cargo cult ritual that feels good but wastes a lot of resources and time" → [Linear Method — Write issues not user stories](https://linear.app/method/write-issues-not-user-stories).
- "There's no handoff to dev." + designers + engineers file own issues → [Linear Method — Manage design projects](https://linear.app/method/manage-design-projects); also [Figma Blog — Karri Saarinen's 10 rules](https://www.figma.com/blog/karri-saarinens-10-rules-for-crafting-products-that-stand-out/).
- Multiple launches vs. one launch → [Linear Method — Launch and keep launching](https://linear.app/method/launching).
- Changelog discipline → [Linear Method — Build in public](https://linear.app/method/build-in-public).
- Project entity definition; project lead writes spec; single lead field → [Linear Docs — Projects](https://linear.app/docs/projects).
- Initiatives = manually curated list of projects with accompanying document → [Linear Docs — Initiatives](https://linear.app/docs/initiatives).
- Cycle definition; 1–8 weeks; auto-advance; immutable past dates; auto-rollover → [Linear Docs — Cycles](https://linear.app/docs/use-cycles).
- Conceptual model (Workspace → Teams → Issues, Projects, Cycles, Initiatives) → [Linear Docs — Conceptual model](https://linear.app/docs/conceptual-model).
- Triage as "special inbox" + Triage Intelligence + Triage Responsibility + integrations → [Linear Docs — Triage](https://linear.app/docs/triage).
- "How we run projects at Linear" — exploratory → spec → execution → release-candidate → Origins → public; weekly updates; goalie; "engineers feeling project is ready"; milestones (Internal / Beta / GA / Post-launch / Nice-to-haves) → [linear.app/now — How we run projects at Linear](https://linear.app/now/how-we-run-projects-at-linear).
- CX intake; Intercom + Linear Asks templates; triage routing; goalie; engineering closes loop → [linear.app/now — How our Customer Experience team works in Linear](https://linear.app/now/cx-in-linear).
- Remote-work discipline; weekly written updates; monthly all-hands; Quality Wednesdays; "we wanted to give people space to do their best work, without extra layers of process" → [linear.app/now — Designing remote work at Linear](https://linear.app/now/designing-remote-work-at-linear).
- Karri on form-follows-function + workbench metaphor for AI design → [linear.app/now — Design for the AI age](https://linear.app/now/design-for-the-ai-age) (Karri Saarinen, 2025).
- Cristina Cordova joins as COO; GTM + marketing + sales + ops + data + talent → [linear.app/now — Welcoming Cristina Cordova to Linear](https://linear.app/now/welcoming-cristina-cordova-to-linear).
- Karri's full Linear-process interview — no PMs except head of product (Nan); no durable cross-functional teams; 1 designer + 2 engineers per project team; rotational leads; "ad hoc and iterative" reviews; no A/B tests; "validate ideas driven by taste and opinions"; feature flags within days/weeks; Origins beta; goalie rotation; Triage as inbox → [Lenny's Newsletter — How Linear builds product](https://www.lennysnewsletter.com/p/how-linear-builds-product) (Lenny Rachitsky × Karri Saarinen).
- Karri's craft / hiring interview — paid 2–5 day work trials; design+brand as competitive advantage; quality + craft → [Lenny's Newsletter — Inside Linear: Building with taste, craft, and focus](https://www.lennysnewsletter.com/p/inside-linear-building-with-taste).
- First Round PMF story — 2018-2019 validation; weekly bar meetings; "what if we can build a tool that's never slow"; "quality is our first principle"; first PM (Nan) hired post-PMF → [First Round Review — Linear's Path to PMF](https://review.firstround.com/linears-path-to-product-market-fit/).
- "10 rules for crafting products" — connected teams; eliminate handoffs; "spec is the baseline, not the finish line"; rotating responsibilities; quality ≠ perfection; values over rigid processes → [Figma Blog — Karri Saarinen's 10 rules](https://www.figma.com/blog/karri-saarinens-10-rules-for-crafting-products-that-stand-out/).
- Sabin Roman on Linear engineering — "principles not guidebooks"; zero-bugs policy; goalie system; no engineering levels; no email culture → [Pragmatic Engineer — Linear: Move fast with little process](https://newsletter.pragmaticengineer.com/p/linear-move-fast-with-little-process).
- Nan Yu on PM role — "primary responsibility is to connect different teams to each other"; "engineers and designers rely completely on PMs for product decisions. We want to avoid that"; "I try to define the problem space clearly and stay at the highest level possible for solutions" → [Creator Economy — Nan Yu inside Linear's craft](https://creatoreconomy.so/p/nan-yu-inside-how-linear-crafts-quality-products); [Lenny's Newsletter — Linear's secret to building beloved B2B products](https://www.lennysnewsletter.com/p/linears-secret-to-building-beloved-b2b-products-nan-yu).
- Nan Yu on team ratio (~2 designers, ~20-25 engineers); "I have to stay very high level, and the designers have to stay pretty high level"; product engineers do "a lot of the design work, design decisions as they're iterating on things" → [The Glimpse — Building Product at Linear with Nan Yu](https://www.theglimpse.co/p/nan-yu).
- "When the right time to hire a PM is when there is a real product for them to own" — Nan Yu philosophy; everyone-is-a-PM ethos → [Grace Ge — When to Hire Your First Product Manager](https://gracege.substack.com/p/when-to-hire-your-first-product-manager).
- Annual Product Planning Template — top-down + parallel FigJam input → [Figma Community — Linear Annual Product Planning Template](https://www.figma.com/community/file/1285828596884760720/linear-annual-product-planning-template) (Karri Saarinen-published).

**[SINGLE-SOURCE] flags:**

- The exact contents of the **project spec format** are described in [linear.app/now — How we run projects at Linear](https://linear.app/now/how-we-run-projects-at-linear) and corroborated at a high level in the Lenny Rachitsky interview, but the actual template / per-section breakdown is not published. The "1–2 page; context and intent; why-what-how" frame is consistently mentioned across sources, so the core claim triangulates; the granular structure does not.
- **Karri's "spec is the baseline, not the finish line"** is sourced only from the Figma Blog "10 rules" piece. It is consistent with broader Linear discourse but I did not find a second independent source restating that exact frame.
- **"Sabin Roman: ~25 engineers at time of interview; no engineering levels"** is from the Pragmatic Engineer post; I did not find a second source corroborating the headcount-at-interview-time number specifically.
- **"Annual + half-year planning cadence with FigJam input"** is described in [Lenny — How Linear builds product](https://www.lennysnewsletter.com/p/how-linear-builds-product) and the Annual Planning Template post; the specific quarterly tracking detail beyond that triangulates only in the Lenny piece.

---

## Surprises / tensions

### Surprises

1. **Linear has effectively ONE PM (Nan Yu) for ~25 engineers + ~2 designers.** This is a more extreme ratio than the public discourse usually flags. The Cena-shape implication: with 3 humans and an agent collective, Cena's coordination layer can plausibly run with **zero dedicated PMs** during pilot phase, with Aaron as the de-facto Karri (taste + direction + final filter) and an agent expert taking the Nan Yu role of cross-pipeline coordination (problem-definition + customer-intelligence-translation).

2. **The cycle primitive is the only mechanically-enforced gate in the Linear stack.** All other gates are judgment. Aaron's "minimum viable structure for a high-velocity team" question gets a sharp answer: **the rhythm primitive does most of the work**, not the per-stage approval gates. Cena's equivalent could be a short cycle + an auto-advance discipline.

3. **The project spec is short (1–2 pages) and explicitly judged on "context and intent" over technical implementation.** The cena-apps slot-11 wireframe rationalization that triggered this whole research arc is a long, dense, technically-detailed artifact. Linear's discipline says: **shorter specs force the maker to internalize the intent rather than hide behind elaborated detail**.

4. **"There's no handoff to dev."** Linear's design + engineering work in continuous parallel from the spec stage forward. This is the load-bearing answer to Aaron's feedback memory `feedback_handoff_friction`: at Linear, the discipline isn't *better handoffs*, it's *no handoffs* — design and engineering are fused at the role level. Implication for Cena: framework-translation handoffs (HTML → Angular) are not avoidable at Cena's stack reality, but the *design-spec → engineering-spec* handoff CAN be removed by having one role hold both — which the agent collective already does in practice.

5. **The single `lead` field on Projects.** Linear specifically rejected multi-owner projects: "the project lead is in charge of writing the spec and general execution" + "a single lead field to keep ownership of the project clear." This is the structural opposite of consensus-based ownership. For Cena, the question becomes: who is the single lead per project? Karri's discipline says one human OR one agent — not "Aaron + the agent collective collectively."

6. **The coordination layer is a SOFTWARE PRIMITIVE, not a human process.** Linear ships its own coordination as a product and uses it. The Cena-equivalent question: does Cena's coordination layer live in a tool surface (Linear, Notion, agent-substrate) or in human ceremony? Linear's answer is unambiguous — the tool primitive carries the discipline; ceremony is light, judgment-based, and weekly.

7. **The goalie rotation as a single-week accountability transfer.** This is a structurally elegant solution to "who watches the inbox?" For Cena's agent collective, an agent rotation (or an always-on goalie agent) is the structural analog. The discipline isn't human-availability; it's named-accountability-this-period.

8. **Zero documented "review gate" between spec and execution.** Linear does not have a "spec sign-off" or "engineering design review" gate that resembles Stripe's. The spec iterates async, the team starts building when it agrees, the team gates ship. Stripe (sibling research) reportedly has a more formalized gate sequence; Linear deliberately doesn't. This is a Cena-shape question: is Cena's failure mode closer to Stripe's (specs need stronger formal review) or to Linear's (specs are over-engineered without payoff)?

### Tensions

1. **"Strong opinions + plain prose" vs. "spec is short."** The Method emphasizes opinionated design + clear writing, but the spec is also short. Reconciling: the spec is short because it captures **decisions**, not options. Karri's frame: get the decisions in 1–2 pages and stop. This is harder than it sounds and depends on the author having strong product judgment.

2. **"No PMs" vs. "Head of Product."** Linear simultaneously says it has no PMs and has Nan Yu as Head of Product. The reconciliation: Nan is a *coordination* role, not a *decision* role. Engineers + designers make product decisions; Nan connects, supports, and surfaces customer intelligence. This is the boundary-role finding — Nan is the boundary between makers and customers / between teams.

3. **"Gates as judgment" vs. "Quality is the first principle."** If quality is paramount and gates are judgment, what catches the case where the maker's judgment is wrong? The Linear answer: **hiring**. The paid 2–5 day work trial is the screen for product judgment; if you pass that, your judgment is trusted. Cena's equivalent would be agent calibration + an outside-voice review pattern (which is already encoded in `.claude/rules/outside-voice-review.md`).

4. **"Build in public" vs. "Internal-first."** Linear says ship internally first, but also build in public. Reconciliation: build-in-public is about the **announcing** layer — frequent launches, public changelog — not about the *spec authoring* layer. Internal dogfooding happens before any external surface.

5. **"Annual planning" + "1–3 week projects."** The cadence tension: 12-month direction sets initiatives, but execution is in 1–3 week chunks with 2-week cycles. The reconciliation: **the initiative is the long-lived container, the projects within it are short-lived**. This is the same shape as Cena's program-planning / initiative pattern.

### Tensions specifically Cena-shape-relevant

- **Linear's stack reality:** Linear ships software, uses its own product, has a tight customer-segment focus (engineers in fast-growing startups). Cena is pre-revenue, multi-stakeholder (patients, clinicians, partner institutions), agent-first. The "spec is short" discipline transfers; the "engineers feel project is ready" discipline transfers IF Cena's agent collective is calibrated to hold that judgment.
- **Linear's quality gate is unwritten.** Cena's equivalent would need to be *agent-calibrated* — which the `outside-voice-review.md` + `haven-primitive-codification.md` + `pipeline-coverage-gate.md` rules are already structurally building toward.
- **Linear's coordination-layer-as-tool answer suggests Cena's agent substrate IS the coordination layer.** The Vault's `triage-first.md` + `emit-vs-create.md` + `catalog-first.md` + the registries (Pipeline, Expert, Skill) collectively form the same shape of "the tool primitive carries the discipline." This is the strongest Linear-to-Cena parallel: Linear's project-model-as-coordination-layer maps to Cena's vault-orchestration-layer-as-coordination-layer.
