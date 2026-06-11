# Stripe — pipeline architecture research

> Research target for haven-ui-pipeline-v2 Phase 1-R.b. Subject company: Stripe. Authored 2026-06-11 against the [discovery brief](../discovery-brief.md) by a Sonnet research agent. Each claim is cited; load-bearing claims are triangulated across ≥2 independent sources or marked `[SINGLE-SOURCE]`.

---

## Source quality summary

- **Named practitioners cited:**
  - Patrick Collison (CEO, co-founder) — writing culture, footnoted internal emails, operating principles authorship
  - John Collison (co-founder) — PJ ("Patrick & John") notes, founder writing
  - David Singleton (CTO 2018–2024) — engineering culture, "engineerication," internal blog cadence, design-review modeling
  - Michelle Bu (Principal Product Architect, leads API design) — PaymentIntents design, API Review, "flows/engines/configs" API taxonomy, "shaping" practice
  - Will Larson (founded Stripe's Foundation Engineering org) — engineering strategy ("write five design docs, pull the similarities out")
  - Brie Wolfson (ex-Stripe BizOps + Stripe Press) — kickoffs, retrospectives, state emails, papertrails-vs-curations
  - Claire Hughes Johnson (COO 2014–2021) — operating principles, 5-year plan, two-by-two decision framework, "see one, do one, teach one"
  - Michael Glukhovsky (Product, Developer Platform) + Wissam Abirached (Eng Manager, API Services) — 2024 API release process (Acacia)
  - Brandur Leach (API Experience engineer) — 2017 API versioning post
  - Mike Bifulco (DevRel) — friction-logging toolkit, format spec
  - Dave Nunez (Documentation Manager) — "we default to writing," external/internal docs philosophy
  - Michael Siliski (Business Lead, Payment Experiences & Platforms) — interviewed by Ken Norton on shaping
  - Sam Gerstenzang (ex-Stripe PM) — operating cadence (progress reviews, effort reviews, shaping reviews)
  - Ken Norton (interviewer/observer) — Building Products at Stripe essay
- **Independent sources triangulated:** 14 distinct primary-or-attributed-secondary URLs across Stripe.com, stripe.dev, lethain.com, every.to, koolaidfactory.com, briewolfson.com, lennysnewsletter.com, firstround.com, pragmaticengineer.com, fs.blog, samgerstenzang.substack.com, mintlify.com, GitHub (Bifulco's friction-logging-toolkit), and bringthedonuts.com. Stripe-side primary blog posts (stripe.com/blog/api-versioning, stripe.dev/blog/payment-api-design, stripe.com/blog/introducing-stripes-new-api-release-process) carry the canonical voice on API process. Practitioner-authored secondaries (Wolfson, Gerstenzang, Larson on their own sites) carry the canonical voice on writing culture + operating cadence + engineering strategy.
- **Date range of sources:** 2015 (CS183C Collison class notes) → 2024 (Acacia API release announcement, Singleton on Lenny's). Most load-bearing process material is 2017–2023.
- **Honest limits:**
  - **Paywalled Pragmatic Engineer Part 2** carries the deepest engineering-side artifact-chain detail (API review mechanics, Compass tool, Trailhead internal docs system) but most is behind paywall; I extracted what was public-side and triangulated the rest from Postman's blog and Bu's StaffEng story.
  - **Multi-product matrix coordination (Payments / Billing / Treasury / Identity / Connect)** is visible at the *product surface* (Treasury composes Connect; Issuing composes Treasury) but the *internal coordination mechanism* across product lines (a cross-product PM council? a writing channel? a Compass dashboard?) is not publicly documented in the same way the API Review is. I infer from Bu's "API Review as forcing function" + Hughes Johnson's "5-year plan + operating principles as decentralization substrate" that coordination is *carried by the writing substrate itself*, not by a separate org-chart layer. Flagged in Block E.
  - **PRD format specifics** — Stripe references "PRD" but the *artifact format* differs across teams; Norton describes "shaping docs" as a distinct upstream artifact, and Wolfson describes "kickoff memos" with hypothesis/baseline/non-goals/prior-art/metrics. Whether "PRD" = "shaping doc" = "kickoff memo" or whether they chain (shaping → kickoff → PRD) is fuzzy in public discourse. I treat them as a chain in Block A but flag the uncertainty.
  - **Tacit judgment vs. documented format** — the rule "no meeting without a circulated written doc" is documented; the *quality bar* a reviewer applies inside that doc is tacit (per the brief's honest-limits section). Stripe's tacit judgment is invisible to this research.
  - **Recency** — the Singleton interview (2023) is the most recent first-person engineering-leadership account; Singleton stepped down as CTO in 2024 and the post-Singleton process is not well-documented publicly.

---

## Block A — Artifact chain

The chain below is the public-discourse picture, ordered from "we're considering this problem" → "live in front of users → learning from real use." Branch + merge points called out inline. Vocabulary uses Stripe's actual terms where attested; flagged `[INFERRED]` where I'm composing across sources.

### 1. Operating principles + 5-year plan (the persistent canon)

- **Name:** Operating Principles (publicly attested 3-line short form: "Users First / Move with urgency and focus / Create with craft and beauty" on stripe.com/jobs/culture, with longer narrative versions distributed internally per Wolfson); 5-Year Plan ("three to five paragraphs briefly describing the biggest, macro goals" per Hughes Johnson)
- **Author role:** Founders (Patrick + John); CEO/COO maintain the 5-year plan
- **Reader/reviewer roles:** Entire company; cited continuously in PRDs, shaping docs, kickoffs, reviews
- **Input:** Strategic + cultural intent
- **Output:** Persistent decision substrate every downstream artifact references
- **Format:** Long-form prose with footnotes (Collison style); the short principles are 3 lines but unpack into multi-page narrative (per Wolfson, "I received this how we operate document...it had quotes from Tyler Cowen and it had a story about Richard Feynman")
- **Sources:** [stripe.com/jobs/culture](https://stripe.com/jobs/culture); Wolfson on Stripe operating manual ([Every / Brie Wolfson](https://every.to/p/what-i-miss-about-working-at-stripe)); Hughes Johnson on 5-year plan ([First Round Review](https://review.firstround.com/to-grow-faster-hit-pause-and-ask-these-questions-from-stripes-coo/))

### 2. Shaping doc

- **Name:** "Shaping doc" (or "shape" as a verb — "to shape a product")
- **Author role:** PM, often paired with eng tech lead and/or design partner
- **Reader/reviewer roles:** Cross-functional stakeholders; published broadly so other teams can find it
- **Input:** Operating Principles, 5-year plan, customer conversations (every PM is "actively talking with customers" per Siliski), prior shaping docs
- **Output:** Crystallized problem framing → feeds PRD/kickoff doc
- **Format:** Long-form narrative document, written "from the perspective of a user, often looking like a description of a user story, [...] interspersed with code snippets because a lot of Stripe's products are APIs, with curl commands showing how everything is done via an API at each step"
- **Purpose attested:** "Fills the space between the broad strategy and the detailed product specification or PRD" and "frontloads a lot of the critical thinking about what you're planning to build and why" — Michael Siliski via Ken Norton
- **Sources:** [Ken Norton — Building Products at Stripe](https://www.bringthedonuts.com/essays/building-products-at-stripe/); [Sam Gerstenzang — Operating well, what I learned at Stripe](https://samgerstenzang.substack.com/p/operating-well-what-i-learned-at) ("Shaping reviews addressed problem definition, target customer, scope, solution outline, timeline, dependencies, and key metrics early in planning")

### 3. Kickoff memo / PRD

- **Name:** Kickoff memo (per Wolfson) and PRD (per Stripe's own Atlas guide; per the public PM-hiring rubric)
- **Author role:** PM (primary); sometimes co-authored with tech lead
- **Reader/reviewer roles:** Cross-functional team (eng, design, content, legal, etc.); broader org via Google Group
- **Input:** Shaping doc; Operating Principles; 5-year plan
- **Output:** Eng design doc + design spec downstream; kickoff *meeting* runs against the memo (replaces slide deck)
- **Format:** Per Wolfson — "hypothesis, baseline, non-goals, prior art, metrics, team structure"; per Stripe Atlas — "primary features and product needs," a "crisp PRD"
- **Replacement of PowerPoint attested:** "You're far more likely to read a narrative memo during a Stripe project kickoff meeting than to sit through a PowerPoint presentation" — Mintlify on Stripe docs ([mintlify.com](https://www.mintlify.com/blog/stripe-docs)); reinforced by [Slab](https://slab.com/blog/stripe-writing-culture/) quoting Dave Nunez: "From leadership on down, we default to writing. We don't really have slide decks."
- **Sources:** [Brie Wolfson on First Round podcast](https://review.firstround.com/podcast/from-kickoffs-to-retros-and-slack-channels-stripes-documentation-best-practices-with-brie-wolfson/); [Stripe Atlas — Building a great PM org](https://stripe.com/guides/atlas/building-a-great-pm-org); Mintlify; Slab

### 4. Engineering design doc

- **Name:** "Design document" (most commonly) or "design doc"; Stripe-internal also references RFC-shaped artifacts but the canonical term in public discourse is "design doc"
- **Author role:** Tech lead, staff/senior engineer, or "product architect" (informal role per Pragmatic Engineer Part 1)
- **Reader/reviewer roles:** Eng team + cross-functional stakeholders flagged at the document head via "gavel blocks" (checkboxes naming impacted parties)
- **Input:** Shaping doc, PRD/kickoff memo
- **Output:** API Review submission (for API-affecting changes); implementation tasks
- **Format:** "Not unusual to circulate 20-page design documents proposing new changes" — Postman blog on Stripe; Larson's framework ("five design docs, pull the similarities out → engineering strategy") implies long-form prose
- **Sources:** [Postman — How Stripe Builds APIs](https://blog.postman.com/how-stripe-builds-apis/) (with CJ Avilla, Stripe DevRel attribution); [Will Larson — Writing an engineering strategy](https://lethain.com/eng-strategies/); [Michelle Bu on StaffEng](https://staffeng.com/stories/michelle-bu/) ("I spend time on several of our review forums like API Review, but often these sorts of forums work more like code review")

### 5. API Review (the canonical cross-product gate)

- **Name:** API Review
- **Author role:** N/A — this is a *forum*; the design doc author submits
- **Reviewer roles:** "Cross-functional group of people who care about API design" — Pragmatic Engineer; a "governance team... a review board staffed with engineers from across the organization" per Postman/CJ Avilla
- **Input:** API-affecting design doc + brief supporting writeup
- **Output:** Approval / iterate / block on API-affecting changes; canonical for new and modified API endpoints across every Stripe product
- **Format:** Asynchronous threaded comments in document + occasional virtual meeting; "gavel blocks" identify stakeholders at document head; "all the different options we considered, and why we chose not to do each" must be outlined (CJ Avilla)
- **Quote attested:** "API Review... is a surprisingly important and central part of Stripe's culture, where each and every change that modifies Stripe's API must pass a strict review process" — Pragmatic Engineer Part 1
- **Bu's honest critique attested:** "I spend time on several of our review forums like API Review, but often these sorts of forums work more like code review. They happen so late in the design process that they tend to do a better job of preventing bad outcomes than of partnering with teams to steer great outcomes" — Michelle Bu, StaffEng
- **Sources:** [Pragmatic Engineer Part 1](https://newsletter.pragmaticengineer.com/p/stripe); [Postman — How Stripe Builds APIs](https://blog.postman.com/how-stripe-builds-apis/); [Michelle Bu — StaffEng](https://staffeng.com/stories/michelle-bu/)

### 6. Implementation (code review + feature flagging)

- **Name:** Code review; deploy via feature flags + gradual rollout
- **Author role:** Engineers
- **Reviewer roles:** Per-team eng reviewers; "code review expectations explicitly encode helping fellow engineers" (Pragmatic Engineer)
- **Input:** Approved design doc
- **Output:** Code in production behind flags; shipping cadence "hundreds of times per day"
- **Format:** Pull requests; "custom built deployment tooling" (Pragmatic Engineer)
- **Sources:** [Pragmatic Engineer Part 1](https://newsletter.pragmaticengineer.com/p/stripe)

### 7. Product review (pre-ship gate)

- **Name:** "Product review" (per Gerstenzang)
- **Author role:** Product team
- **Reviewer roles:** Cross-functional; can combine with launch review depending on scope
- **Input:** Working product close to done
- **Output:** Ship / iterate / hold
- **Format:** Document-based review; "occurred pre-ship for holistic assessment" — Gerstenzang
- **Sources:** [Sam Gerstenzang](https://samgerstenzang.substack.com/p/operating-well-what-i-learned-at)

### 8. Friction log (parallel/continuous quality artifact)

- **Name:** Friction log
- **Author role:** Anyone at Stripe; DevRel teams systematize; Singleton "engineerication" practice generates them
- **Reader/reviewer roles:** Product team building the surface logged + company-wide email list; "all employees are encouraged to actively participate in giving feedback" (Bifulco)
- **Input:** A real attempt to use the product or API from a user persona perspective
- **Output:** Three-part doc — Context (persona + goal), Pros and Cons (bulleted), Stream of Consciousness (unstructured experience with screenshots); size indicator (Small/Medium/Large); follow-through to product changes is part of the format
- **Format:** Markdown / doc, often with screenshots and screencasts; bulleted pros/cons + narrative
- **Sources:** [Mike Bifulco — friction-logging-toolkit](https://github.com/mikeb-stripe/friction-logging-toolkit/blob/main/how-we-use-friction-logs-at-stripe.md); [David Singleton on Lenny's Newsletter](https://www.lennysnewsletter.com/p/building-a-culture-of-excellence) (referenced friction-logging at timestamp 25:39)

### 9. Launch / Shipped doc

- **Name:** "Shipped" (and its sibling "Unshipped" for cut work)
- **Author role:** Team (PM + tech lead + design)
- **Reader/reviewer roles:** Company-wide via Google Group
- **Input:** Shipped surface; metrics from rollout
- **Output:** Org-wide visibility; raw material for future kickoffs/shaping docs
- **Format:** Per Wolfson — "What shipped, what exists now that didn't before?" + summary, context, metrics, what's next, thanks
- **Sources:** [Brie Wolfson — First Round podcast](https://review.firstround.com/podcast/from-kickoffs-to-retros-and-slack-channels-stripes-documentation-best-practices-with-brie-wolfson/); [Brie Wolfson — Every](https://every.to/p/what-i-miss-about-working-at-stripe)

### 10. Retrospective (NOT postmortem)

- **Name:** Retrospective (terminology defended deliberately — Wolfson recalls the CFO calling to correct her use of "postmortem")
- **Author role:** ICs and managers — Wolfson observed "the practitioner set the record for the company" with ICs writing "really fantastic write-ups"
- **Reader/reviewer roles:** Company-wide Google Group for retrospectives
- **Input:** Completed project (success or struggle)
- **Output:** Organizational learning; "somebody was always writing up their learnings"
- **Format:** Long-form prose; learning-focused not blame-focused; "more reflective of what we were doing and a lot less morbid" (Wolfson quoting CFO)
- **Sources:** [Brie Wolfson — Every](https://every.to/p/what-i-miss-about-working-at-stripe); [Brie Wolfson — First Round podcast](https://review.firstround.com/podcast/from-kickoffs-to-retros-and-slack-channels-stripes-documentation-best-practices-with-brie-wolfson/)

### 11. State emails / weekly progress reviews (the continuous coordination layer)

- **Name:** "State emails" (Wolfson); "Progress reviews" (Gerstenzang); leader snippets + PJ notes (Wolfson)
- **Author role:** ICs, managers, leadership — "anyone can publish"; Wolfson notes "you kind of got org points for doing this stuff"
- **Reader/reviewer roles:** Cross-functional, opt-in via Google Groups by artifact type (not by team)
- **Input:** Current state of a workstream
- **Output:** Continuous async coordination; cross-team discovery
- **Format:** Status, metrics-against-primary-goal, workstream tracking spreadsheet (state/DRI/next steps/blockers), deep dives, open questions
- **Wolfson quote:** "I published into the company a state email...there was a section at the bottom with kind of questions I was struggling with"
- **Sources:** [Brie Wolfson — Every](https://every.to/p/what-i-miss-about-working-at-stripe); [Brie Wolfson — First Round podcast](https://review.firstround.com/podcast/from-kickoffs-to-retros-and-slack-channels-stripes-documentation-best-practices-with-brie-wolfson/); [Sam Gerstenzang](https://samgerstenzang.substack.com/p/operating-well-what-i-learned-at)

### Branch + merge points

- **Branch:** Eng-track (design doc → API Review → implementation) and design/product-track (shaping doc → PRD/kickoff → design files) run in parallel after the shaping doc, with the PRD/kickoff memo serving as the merge point. The API Review forum is the additional eng-side gate that has no design-side equivalent (because Stripe's product *is* the API for most surfaces).
- **Continuous parallel:** Friction logs + state emails + retros run continuously alongside the main chain — they're not gated stages, they're a perpendicular coordination substrate.
- **The cycle closes** when shipped/retro docs become input material for the next shaping doc cycle (informally; not a gated transition).

---

## Block B — Roles + expertise

### Product Manager (PM)

- **Stages owned:** Shaping doc (author); PRD/kickoff memo (primary author); product review (co-owner); shipped doc (co-author)
- **Expertise:** Synthesizing customer conversations into rigorous problem framing; "every product manager [is] actively talking with customers" (Siliski); writing as a *thinking tool*; cross-functional coordination (eng + design + content + legal)
- **Headcount discipline:** Per product line, but with archetypes (Business PM / Technical PM / Design PM / Growth PM per Stripe Atlas) so the right kind of PM staffs the right kind of problem
- **Sources:** [Stripe Atlas — Building a great PM org](https://stripe.com/guides/atlas/building-a-great-pm-org); [Ken Norton — Building Products at Stripe](https://www.bringthedonuts.com/essays/building-products-at-stripe/)

### Tech Lead

- **Stages owned:** Engineering design doc (primary author); implementation oversight; design-doc reviews (reviewer for other docs)
- **Expertise:** Translating product framing into system design; tradeoff analysis ("all the different options that we considered, and why we chose not to do each" — CJ Avilla)
- **Headcount discipline:** Per workstream / project; tech leads are an informal role-shape, not necessarily a title
- **Sources:** [Pragmatic Engineer Part 1](https://newsletter.pragmaticengineer.com/p/stripe); [Postman — How Stripe Builds APIs](https://blog.postman.com/how-stripe-builds-apis/)

### Product Architect (boundary role — load-bearing for this brief)

- **Stages owned:** API design across multiple product lines; "lifecycle of an API design" responsibility (Bu at StaffPlus NY)
- **Expertise:** Cross-product API consistency; long-horizon abstractions; PaymentIntents-class design work (3 months in a conference room with 4 engineers + 1 PM, per Bu); the "flows / engines / configs" API taxonomy as shared vocabulary
- **Headcount discipline:** Few; informal — Pragmatic Engineer describes "product architects" as not a job title but a role-shape collaborating with tech leads. Bu is publicly Principal Product Architect, and the role is *load-bearing for cross-product coordination because it's where one human holds the API consistency picture across products that would otherwise diverge.*
- **Quote attested (Bu):** "Folks started to organically use these categories after seeing them once" — describing how she and a colleague named API patterns and the names spread
- **Sources:** [Pragmatic Engineer Part 1](https://newsletter.pragmaticengineer.com/p/stripe); [Michelle Bu — StaffEng](https://staffeng.com/stories/michelle-bu/); [LeadDev profile](https://leaddev.com/community/michelle-bu)

### Foundation Engineering Lead (boundary role — strategy across products)

- **Stages owned:** Engineering strategy across product lines; infrastructure decisions that cross product boundaries
- **Expertise:** "Write five design documents, and pull the similarities out — that's your engineering strategy" (Larson); strategy as documented existing implicit decisions
- **Headcount discipline:** One per significant org cut; Larson founded Stripe's Foundation Engineering org (infrastructure, data, internal+external developer tools)
- **Sources:** [Will Larson — Writing an engineering strategy](https://lethain.com/eng-strategies/); [Will Larson on Intercom](https://www.intercom.com/blog/podcasts/stripe-will-larson-infrastructure-engineering-management/)

### CTO / Engineering Leadership (boundary role — modeling)

- **Stages owned:** Internal blog publishing (Singleton: "more than one internal blog piece per month"); "engineerication" — embedding in eng teams to find friction; design review modeling (Hughes Johnson: "See one, do one, teach one — founders demonstrate (design reviews), teams execute independently, then teach newcomers")
- **Expertise:** Pattern-setting for what good writing + good review look like; using the public engineering blog to recruit + retain
- **Sources:** [David Singleton on Lenny's](https://www.lennysnewsletter.com/p/building-a-culture-of-excellence); [Pragmatic Engineer Part 1](https://newsletter.pragmaticengineer.com/p/stripe); [Claire Hughes Johnson on First Round](https://review.firstround.com/to-grow-faster-hit-pause-and-ask-these-questions-from-stripes-coo/)

### DevRel + Documentation Manager (boundary role — voice-of-developer)

- **Stages owned:** Friction logs (DevRel — Bifulco); documentation standards (Documentation Manager — Nunez); external docs as canonical surface
- **Expertise:** "The voice for devs who use Stripe's products to build their own" (Bifulco); writing as discipline ("Writing forces you to structure your thoughts in a manner just not possible when you verbalize it" — Nunez)
- **Sources:** [Mike Bifulco — friction-logging-toolkit](https://github.com/mikeb-stripe/friction-logging-toolkit/blob/main/how-we-use-friction-logs-at-stripe.md); [Slab — Stripe writing culture](https://slab.com/blog/stripe-writing-culture/)

### Founders / Executive (boundary role — written canon)

- **Stages owned:** Operating Principles, "How We Operate" manual, PJ notes, 5-year plan
- **Expertise:** Setting the writing bar and making it visible; Collison structures emails "to be like research papers and put the peripheral information at the bottom so as not to detract from the core information... footnotes became a common component of internal emails at Stripe"
- **Headcount discipline:** Founders; non-replicable
- **Sources:** [Slab — Stripe: best way to encourage proficient writing is to demonstrate it](https://slab.com/guides/how-success-is-written/stripe-the-best-way-to-encourage-proficient-writing-is-to-demonstrate-it/); [Wolfson on Stripe operating manual](https://every.to/p/what-i-miss-about-working-at-stripe); [Patrick Collison on Knowledge Project](https://fs.blog/knowledge-project-podcast/patrick-collison/)

### "Red Pens" (boundary role — editorial)

- **Stages owned:** Editorial review of high-leverage internal docs; "Writing Review Channel" for async feedback
- **Expertise:** "Great wordsmiths and upholders of the company tone" (Wolfson); ensure consistent voice and quality on high-leverage docs (those affecting multiple teams or business operations); high-leverage docs receive mandatory review before publication (per Slab)
- **Headcount discipline:** Small; appointed editors rather than per-team
- **Sources:** [Brie Wolfson — Kool Aid Factory](https://koolaidfactory.com/writing-in-public-inside-your-company/); [Slab — Stripe writing culture](https://slab.com/blog/stripe-writing-culture/)

### API Review Governance Team (boundary role — cross-product API consistency)

- **Stages owned:** API Review forum
- **Expertise:** API design quality bar across products; "engineers from across the organization" (Postman/Avilla); the cross-product memory of what an "engine" vs. a "flow" vs. a "config" is, and which previous decisions a proposed change must reconcile with
- **Headcount discipline:** Cross-org standing committee; not a team that ships features
- **Sources:** [Postman — How Stripe Builds APIs](https://blog.postman.com/how-stripe-builds-apis/); [Pragmatic Engineer Part 1](https://newsletter.pragmaticengineer.com/p/stripe)

---

## Block C — Gates between artifacts

### Gate: Shaping doc → PRD/kickoff

- **What is checked:** Has the problem been framed from a real user perspective (not from internal architecture or features)? Are code snippets / curl commands present where the surface is an API? Is the problem worth solving against the operating principles?
- **Who has authority to halt:** PM owner + cross-functional readers; soft consensus via written feedback. No formal "halt" in public discourse — the gate is *should we even kickoff*.
- **What halt produces:** Iteration on the shaping doc; in extreme cases, the workstream dies before kickoff
- **Falsifiability:** Soft (judgment-based; calibrated via the founders' modeling of "good" shaping docs and the operating principles)
- **Sources:** [Norton](https://www.bringthedonuts.com/essays/building-products-at-stripe/); [Gerstenzang](https://samgerstenzang.substack.com/p/operating-well-what-i-learned-at)

### Gate: PRD/kickoff → eng design doc

- **What is checked:** Have hypothesis, baseline, non-goals, prior art, metrics, team structure been written? Have stakeholders been identified?
- **Who has authority to halt:** Engineering tech lead, design partner, content designer — cross-functional consent before eng builds
- **What halt produces:** PRD revision
- **Falsifiability:** Soft (judgment); but the *artifact's existence* is hard (no kickoff meeting without the memo — attested by Wolfson + Slab/Nunez "we default to writing")
- **Sources:** [Wolfson — First Round](https://review.firstround.com/podcast/from-kickoffs-to-retros-and-slack-channels-stripes-documentation-best-practices-with-brie-wolfson/); [Slab](https://slab.com/blog/stripe-writing-culture/)

### Gate: Eng design doc → API Review (for API-affecting changes — the canonical hard gate)

- **What is checked:** Is the API consistent with prior Stripe API decisions? Have all options been considered and tradeoff-analyzed? Are stakeholders identified via "gavel blocks"? Does the change fit the rolling-date versioning model (per Brandur Leach's [API versioning post](https://stripe.com/blog/api-versioning))? Per the 2024 Acacia process: does it ship in the right release cadence (semiannual major for breaking changes, monthly for compatible features)?
- **Who has authority to halt:** Governance team / API Review forum; "each and every change that modifies Stripe's API must pass a strict review process" (Pragmatic Engineer); review can block public-facing impacts
- **What halt produces:** Design doc revision; sometimes major rework (Bu's PaymentIntents was a 3-month conference-room redesign that emerged in part from accumulated API inconsistency pressure)
- **Falsifiability:** Mixed. Hard: did the doc circulate? Did stakeholders check off gavel blocks? Did it submit to API Review? Soft: was the design judgment good? (Bu's own honest critique: API Review "happens so late in the design process that [it] tend[s] to do a better job of preventing bad outcomes than of partnering with teams to steer great outcomes.")
- **Sources:** [Pragmatic Engineer Part 1](https://newsletter.pragmaticengineer.com/p/stripe); [Postman — How Stripe Builds APIs](https://blog.postman.com/how-stripe-builds-apis/); [Stripe blog — Brandur Leach on API versioning](https://stripe.com/blog/api-versioning); [Stripe blog — Glukhovsky + Abirached on Acacia release process](https://stripe.com/blog/introducing-stripes-new-api-release-process); [Michelle Bu — StaffEng](https://staffeng.com/stories/michelle-bu/)

### Gate: Implementation → product review (pre-ship)

- **What is checked:** Is the surface holistically ready to ship? Combines with launch review for larger scope (Gerstenzang)
- **Who has authority to halt:** Product team + cross-functional reviewers
- **What halt produces:** Iteration or ship-delay
- **Falsifiability:** Soft (judgment-based)
- **Sources:** [Gerstenzang](https://samgerstenzang.substack.com/p/operating-well-what-i-learned-at)

### Gate: Continuous — friction logs as quality reset

- **What is checked:** Does any employee, using the product, encounter friction the team didn't anticipate? "Engineerication" (Singleton) is the leadership version of this — embedding in eng to find friction firsthand.
- **Who has authority to halt:** No one halts via friction log — but logs are addressed-to product teams and the follow-through (turning logs into changes) is part of the format (Bifulco)
- **What halt produces:** Product changes; sometimes wholesale redesigns when the same friction recurs
- **Falsifiability:** Mixed. The *log existing* is hard; whether it leads to a change is soft (depends on team uptake — Bifulco notes "all your work in crafting a great friction log is worthless if you don't follow through and make sure that it has an impact")
- **Sources:** [Bifulco — friction-logging-toolkit](https://github.com/mikeb-stripe/friction-logging-toolkit/blob/main/how-we-use-friction-logs-at-stripe.md); [Singleton on Lenny's](https://www.lennysnewsletter.com/p/building-a-culture-of-excellence)

### Gate: Retrospective (post-ship learning)

- **What is checked:** What happened? What should we keep doing? What should we change?
- **Who has authority to halt:** N/A — backward-looking
- **What halt produces:** N/A; output is institutional learning that informs future shaping docs
- **Falsifiability:** Soft, but the *artifact existing and being shared widely* is the hard part
- **Sources:** [Wolfson — Every](https://every.to/p/what-i-miss-about-working-at-stripe); [Wolfson — First Round podcast](https://review.firstround.com/podcast/from-kickoffs-to-retros-and-slack-channels-stripes-documentation-best-practices-with-brie-wolfson/)

### The meta-gate: written doc precedes every meeting

- **What is checked:** Does a circulated written doc exist explaining the problem, proposed solution, and open questions?
- **Who has authority to halt:** Anyone — "No meeting happened without this" (Slab)
- **What halt produces:** Meeting cancelled or rescheduled until the doc exists
- **Falsifiability:** Hard — either the doc exists or it doesn't
- **Quote:** "Stripe discouraged real-time ideation in meetings and instead everyone wrote down their thoughts independently first to ensure deeper insights" — Slab
- **Sources:** [Slab — Stripe writing culture](https://slab.com/blog/stripe-writing-culture/); [Giacomo Falcone — Stripe playbook on writing](https://giacomofalcone.substack.com/p/the-importance-of-writing-in-business)

---

## Block D — Per-artifact briefs (5-attribute frame)

### Artifact 1: Operating Principles + 5-Year Plan

- **Purpose:** Persistent decision substrate. Every downstream artifact references it. Decentralization mechanism: "Your principles should be clear and explicit enough that the people who consult them will make the same decisions a founder would" (Hughes Johnson). Replaces founder-bottlenecking.
- **Canon:** Patrick + John's writing style (footnoted, long-form, rigorous); intellectual references (Cowen, Feynman, Latour); company history's prior principles iterations.
- **Brief:** 3-line short form + multi-page narrative unpack. Stories + quotes + concrete examples. Hughes Johnson on the 5-year plan: "three to five paragraphs briefly describing the biggest, macro goals." Narrative voice, not bullet-point summaries.
- **Domain:** Founder-level strategic and cultural judgment; deep familiarity with company history and the customer base; rigorous editorial discipline.
- **Process:** Authored by founders (and rare COO/CEO partners); reviewed in close circle before broad distribution; cited continuously by everyone downstream; refreshed *rarely* and *deliberately* — Wolfson notes employees "could recite content from iconic company documents verbatim — sometimes years after they were originally published."

### Artifact 2: Shaping doc

- **Purpose:** Frontload critical thinking *before* PRD-level detail. Crystallize problem framing from a user perspective. Test concept viability with curl-snippet integration walkthroughs (for API products) or storyboard-equivalent narrative (for surface products).
- **Canon:** Operating Principles; 5-year plan; prior shaping docs in the same product area; customer-conversation source material; the company's API taxonomy ("flows / engines / configs" per Bu) for API-shaped products.
- **Brief:** Long-form narrative from the user's POV; embedded code (curl, JSON, sample integrations); hypothetical-integration-guides-as-validation per Bu's PaymentIntents process ("writing hypothetical integration guides for every payment method — even invented ones like 'sending cash via carrier pigeon'"); explicit problem framing; "first-principles" framing — "Question every assumption underpinning existing APIs" (Bu).
- **Domain:** PM + tech lead + product-architect-class judgment; deep customer understanding ("we expect every product manager to be actively talking with customers" — Siliski); API-design intuition for API products; writing rigor.
- **Process:** PM (primary author) drafts; cross-functional comments async in the doc; "shaping reviews" are a meeting cadence (Gerstenzang) covering "problem definition, target customer, scope, solution outline, timeline, dependencies, and key metrics"; published to Google Group for broad org visibility; iterated until the team can defend the framing to the operating principles.

### Artifact 3: PRD / Kickoff memo

- **Purpose:** Crystallize the *committed* product spec. Replace the kickoff PowerPoint. Become the meeting's read-aloud or read-silently substrate, with discussion landing on the doc (not on slides).
- **Canon:** Shaping doc; Operating Principles; 5-year plan; prior PRDs in the area; the API Review's prior decisions for API-affecting changes; design system + brand canon for surface work; the company's "How We Operate" manual for tonal calibration.
- **Brief:** Per Wolfson: hypothesis, baseline, non-goals, prior art, metrics, team structure. Per Stripe Atlas: primary features, product needs, "crisp." Narrative voice. Code/integration examples where applicable. Cross-functional stakeholders flagged at top.
- **Domain:** PM-primary; tech lead + design + content + legal co-review. Cross-functional judgment.
- **Process:** PM drafts; circulates to cross-functional team async; kickoff meeting reads the doc (silently or aloud); discussion lands in-doc and in-meeting; iterate; commit; publishes to Google Group; *every subsequent decision references back to it*. Wolfson: "kickoff in general is pretty overlooked."

### Artifact 4: Engineering design doc

- **Purpose:** Translate the PRD into system design. Pre-decide the tradeoffs in writing. Become the substrate for API Review for API-affecting changes; for non-API work, the substrate for cross-eng review.
- **Canon:** PRD/kickoff; prior design docs in the area; the API versioning system (Brandur Leach's "rolling date-based versioning" with "lightweight / first-class / fixed-cost" principles); the API release cadence (Acacia-era semiannual major + monthly minor); the company's API taxonomy; prior architectural strategies (per Larson: documented engineering strategies emerge by "writing five design documents, and pull the similarities out").
- **Brief:** Long-form (commonly ~20 pages per Postman); options considered + why each was rejected; "gavel blocks" for stakeholders at top with checkboxes; documentation of downstream impacts; tradeoff analysis; testing/rollout plan.
- **Domain:** Tech lead / staff eng / product architect judgment; system-design fluency; API-design fluency for API work; deep familiarity with prior Stripe design decisions.
- **Process:** Author drafts; circulates to eng team async; stakeholders check off gavel blocks; debates threaded in document; if API-affecting, submits to API Review forum; iterate; approve; implementation begins.

### Artifact 5: API Review forum (the cross-product gate)

- **Purpose:** Cross-product API consistency. Single point where API decisions across Payments / Billing / Treasury / Identity / Connect *must* reconcile against each other. This is the structural reason Stripe's API feels coherent across products — the gate has authority over every product team's API surface.
- **Canon:** Every prior approved Stripe API decision; the API taxonomy (flows / engines / configs); the operating principles; the API versioning model; the release cadence (Acacia).
- **Brief:** Submission is the engineering design doc + brief supporting writeup; format is per the design-doc canon; review happens in-document (threaded comments) + occasional synchronous meeting.
- **Domain:** Cross-product API consistency judgment; the *governance team* holds this — engineers from across the organization who have absorbed the canon over time.
- **Process:** Design doc submitted; mailing-list distribution; governance team + stakeholders review async; threaded comments; meeting if needed; approve / iterate / block. Bu's honest critique: gate fires "late in the design process" — better at blocking bad than at steering good — which is why the *shaping doc* + *first-principles up-front design* practice (e.g., the PaymentIntents 3-month conference-room work) exists to do steering *before* the gate.

### Artifact 6: Implementation (code review + feature flag rollout)

- **Purpose:** Ship the design doc's commitments without regression. Feature flags + gradual rollout absorb risk.
- **Canon:** Eng team's code standards; the design doc; existing system invariants.
- **Brief:** Pull requests against the design doc; code review with "explicitly encoded" expectations of mutual help (Pragmatic Engineer).
- **Domain:** Implementation engineering; rollout discipline.
- **Process:** Build; PR; review; merge behind flag; gradual rollout via custom deployment tooling; "hundreds of times per day" ship rate.

### Artifact 7: Product review (pre-ship)

- **Purpose:** Holistic look at the product *as user-facing surface* before it goes live. Catches issues the design doc + code review didn't.
- **Canon:** PRD; shipped principles; brand/design canon for surface work.
- **Brief:** Document + meeting; combines with launch review depending on scope.
- **Domain:** Product judgment; cross-functional view.
- **Process:** Team submits product close to done; cross-functional reviewers walk it; ship / iterate / hold.

### Artifact 8: Friction log

- **Purpose:** Continuous quality channel; voice-of-actual-user (often employee dogfooding); catches issues the chain didn't surface.
- **Canon:** Stripe writing standards ("avoid emotionally loaded language, describe objectively" — Bifulco); friction-logging format (three-part).
- **Brief:** Context (persona + goal) + Pros/Cons (bulleted) + Stream of Consciousness (with screenshots/screencasts) + size indicator (S/M/L). Make the journey clear.
- **Domain:** Anyone — but DevRel + leadership are pattern-setters. Singleton's "engineerication" practice generates leadership-tier friction logs.
- **Process:** Author writes log against real product use; shares to product team + company email list; product team triages; follow-through into changes is the integrity check.

### Artifact 9: Shipped doc

- **Purpose:** Org-wide visibility on completed work; institutional learning; recruitment + retention signal.
- **Canon:** "What shipped, what exists now that didn't before?" + summary / context / metrics / what's next / thanks (Wolfson).
- **Brief:** Narrative; metrics; specific named contributors; what's next.
- **Domain:** Team-level synthesis judgment; comms craft.
- **Process:** Team co-authors at launch; publishes to org-wide Google Group.

### Artifact 10: Retrospective

- **Purpose:** Institutional learning from completed work, framed forward-looking ("retrospective," not "postmortem").
- **Canon:** Stripe's tonal canon (per Wolfson's CFO correction); prior retros in the area; learning-focused not blame-focused.
- **Brief:** Long-form; ICs as the primary practitioner-voice; specific decisions revisited; what to keep / change.
- **Domain:** Practitioner judgment (Wolfson: "the ICs who were doing the work" wrote the best ones); writing rigor.
- **Process:** Author drafts; iterates with peers; publishes to retrospectives Google Group; cited as input material for future shaping docs.

### Artifact 11: State emails / progress reviews (continuous coordination)

- **Purpose:** Continuous async coordination; cross-team discovery; surface stuck-points before they ossify.
- **Canon:** Stripe writing canon; the workstream's primary goal.
- **Brief:** Status + metrics-against-primary-goal + workstream table (state/DRI/next steps/blockers) + deep dives + open questions at bottom (the "questions I was struggling with" section per Wolfson).
- **Domain:** ICs and managers; writing rigor; honest framing of stuck-points.
- **Process:** Author publishes to Google Group; cross-functional read; comments async; sometimes triggers cross-team collaboration that the org chart wouldn't have surfaced (Wolfson's "engineer I had never met in an office across the country... shared the model" anecdote).

---

## Block E — Coordination/orchestration layer (the spine)

**Stripe's coordination layer is the writing substrate itself.** This is the load-bearing finding for Aaron's frame — and it is *different in kind* from the per-pipeline gates above. The writing substrate is *not a separate org-chart layer* (no "Director of Coordination"); it is a *cross-cutting medium* that every per-pipeline artifact lands inside, and a *small number of named ceremonies* + a *small number of boundary roles* hold the cross-product picture.

### What this layer does

- **Sequences across product lines** by making every product team's planning visible in the same channels (state emails, shipped docs, retros) and by gating cross-product API decisions through one forum (API Review).
- **Holds the north star** through the persistent canon (Operating Principles, 5-year plan, "How We Operate" manual) that every downstream artifact references and that is cited continuously — Wolfson: "You couldn't get through a single day without hearing the operating principles cited multiple times."
- **Detects missed things** through three mechanisms:
  - **Friction logs as continuous parallel signal** — anyone in the company can publish a friction log, and "all employees are encouraged to actively participate" (Bifulco). This catches surface-level missed things.
  - **Open-question sections in state emails** — Wolfson's practice of "a section at the bottom with kind of questions I was struggling with" surfaces stuck-points to people who can help, *without* a meeting. Cross-team discovery happens via the writing.
  - **API Review gavel blocks** — every API-affecting change names its stakeholders explicitly; if a stakeholder is missing or a downstream impact isn't flagged, the doc is incomplete and reviewers push back. This is the *structural* missed-thing detector.
- **Course-corrects mid-pipeline** through "debug meetings" (Gerstenzang: "topic-specific when a big thorny issue comes up, or there's conflict between two teams") and through "engineerication" (Singleton: CTO embeds in an eng team to find friction firsthand).

### Where it sits

Across *all* of the following, simultaneously — and this is the answer Aaron's brief was probing for:

- **A medium (writing) that every artifact lives inside.** Not a tool; not a meeting; the *substrate*.
- **A small persistent canon (3 docs)** — Operating Principles, 5-year plan, "How We Operate" — that every artifact references.
- **A small number of named ceremonies** with consistent format:
  - *No meeting without a circulated doc* (the meta-rule)
  - *Shaping reviews / product reviews / debug meetings / weekly progress reviews* (Gerstenzang) — each tied to a written artifact
  - *Heavyweight biannual planning, lighter-weight midyear* (Pragmatic Engineer)
  - *Weekly ops reviews* examining SLAs, recent incidents, patterns
- **A small number of named distribution channels** — Google Groups organized *by artifact type* (retrospectives, shipped, state of, kickoffs, leader snippets), not by team — Wolfson: "Slack/email groups organized by artifact type ... enabling cross-functional discovery."
- **A small number of boundary roles** that hold cross-product judgment:
  - Product architects (Bu) — cross-product API consistency
  - Foundation engineering leads (Larson) — cross-product infrastructure strategy
  - Documentation manager (Nunez) — writing-standards canon
  - "Red Pens" editors (Wolfson) — voice + quality on high-leverage docs
  - CTO + COO modeling (Singleton + Hughes Johnson) — pattern-setting for what good looks like
- **A small number of forcing-function gates** — most notably API Review — that *halt* cross-product divergence.

### What this layer produces / consumes

- **Produces:** the persistent canon (Operating Principles, 5-year plan, manual); the channel structure (Google Groups by artifact type); the ceremony cadence (biannual planning, weekly ops, etc.); the API Review forum's decisions.
- **Consumes:** every shaping doc, PRD, design doc, friction log, state email, shipped doc, retro — i.e., everything in Block A — and *makes them legible to each other* via the shared writing substrate.

### How it interacts with the per-pipeline chains

- **It does not gate them** at the start (every team starts its own shaping work).
- **It gates them at API Review** for API-affecting changes (the canonical cross-product gate).
- **It observes them continuously** via state emails, shipped docs, retros — visible in shared channels.
- **It course-corrects mid-stream** via debug meetings and engineerication.
- **It holds the north star** through the persistent canon — cited so often the org "could recite content from iconic company documents verbatim."

### How north-star convergence is maintained

The *only* mechanism Stripe seems to use for "are we still going where we said we'd go" is:

- **The persistent canon is the north star** (Operating Principles + 5-year plan), and
- **Every artifact references it back**, so any drift surfaces as a misalignment between artifact and canon at review time.

This is *not* a "PM-watches-the-roadmap" mechanism; it's a *substrate-level* mechanism. The substrate is the writing culture; the canon is what the writing references.

### How missed-thing detection works

Three layers, named above:

1. **Gavel blocks** at the head of API-affecting design docs name the stakeholders. *Structural* missed-thing detection.
2. **Friction logs**, continuous and any-employee-can-write. *Quality-surface* missed-thing detection.
3. **Open-question bottoms** of state emails, distributed broadly. *Cross-team* missed-thing detection.

### What happens when it's absent or weak

- **Bu's own critique** of API Review: "they happen so late in the design process that they tend to do a better job of preventing bad outcomes than of partnering with teams to steer great outcomes." This is the *flip side*: a single gate at the end can't steer; it can only block. The PaymentIntents redesign (3 months, 4 engineers + 1 PM in a conference room) was a *response* to accumulated API inconsistency that the late-stage gate couldn't have prevented incrementally.
- **Larson's "no unified engineering strategy at Stripe"** observation (in [Crafting Engineering Strategy](https://www.oreilly.com/library/view/crafting-engineering-strategy/9798341645516/)) is the second flip side: even at Stripe, *implicit* strategy across product lines wasn't consistently documented — Larson's prescription was "write five design docs and pull the similarities out." This suggests Stripe's coordination layer leaves *engineering strategy* under-documented relative to *API consistency*, and Larson's Foundation org is part of the response.
- **Sources:** [Michelle Bu — StaffEng](https://staffeng.com/stories/michelle-bu/); [Larson — Writing an engineering strategy](https://lethain.com/eng-strategies/)

### Is it human, agent, software-primitive, or all three?

For Stripe, it is: **human roles (boundary roles) + software primitives (Compass project tool, Trailhead internal docs, Go links, Google Groups) + ceremonies (the named cadences) + a persistent canon (Operating Principles + 5-Year Plan + How-We-Operate)** — but **the load-bearing substrate is the writing culture itself**, which is what holds all the others together. No agents in the Stripe model (the public discourse predates the agent-substrate era for Cena's purposes).

### Coverage gap on multi-product matrix

The brief specifically asked about how Payments / Billing / Treasury / Identity / Connect coordinate. The public picture:

- **API Review is the gate** — every API-affecting change across every product passes through it.
- **The persistent canon + the operating principles** are the strategic spine.
- **Boundary roles** (product architects like Bu) hold cross-product judgment in a small number of humans.
- **But the *PM-side* cross-product coordination layer** — the "PM pass that ties pipelines together" Aaron flagged — is *not visible in public discourse as a named ceremony or role*. It may exist as biannual planning + ops reviews + leadership weeklies, but the public material doesn't expose the mechanics. I infer it's carried by Hughes Johnson-era operating discipline (operating principles + 5-year plan + two-by-two escalation framework) rather than by a named "cross-product PM council."
- This is the most honest answer I can give: Stripe's coordination layer is *deeply baked into writing + canon + a few forcing-function gates*, not into a dedicated org-chart layer. Cena's question — "where does the cross-pipeline PM live?" — at Stripe is answered "in the substrate, plus a few boundary roles" rather than "in a named role."

---

## Clinical-context probe (Headspace only)

Not applicable to Stripe.

---

## Citations

(Inline citations are above per-claim; this section is the master URL list with source-type tags.)

**Primary — Stripe-authored:**

- [Stripe — API release process (Acacia), Glukhovsky + Abirached, Oct 2024](https://stripe.com/blog/introducing-stripes-new-api-release-process)
- [Stripe — APIs as infrastructure: future-proofing Stripe with versioning, Brandur Leach, Aug 2017](https://stripe.com/blog/api-versioning)
- [stripe.dev — Stripe's payments APIs: The first 10 years, Michelle Bu](https://stripe.dev/blog/payment-api-design)
- [Stripe Atlas — Building a great product management organization](https://stripe.com/guides/atlas/building-a-great-pm-org)
- [Stripe — Operating Principles (public/jobs surface)](https://stripe.com/jobs/culture)
- [Stripe Sessions 2024 — Developer keynote (Michelle Bu et al.)](https://stripe.com/sessions/2024/developer-keynote)

**Primary — practitioner-authored on their own surface:**

- [Will Larson — Writing an engineering strategy (staffeng.com)](https://staffeng.com/guides/engineering-strategy/) and [lethain.com — Writing engineering strategy](https://lethain.com/eng-strategies/)
- [Will Larson — Crafting Engineering Strategy (lethain.com announcement)](https://lethain.com/crafting-engineering-strategy/)
- [Michelle Bu — StaffEng story](https://staffeng.com/stories/michelle-bu/)
- [Brie Wolfson — What I Miss About Working at Stripe (Every)](https://every.to/p/what-i-miss-about-working-at-stripe)
- [Brie Wolfson — Writing in Public Inside Your Company (Kool Aid Factory)](https://koolaidfactory.com/writing-in-public-inside-your-company/)
- [Brie Wolfson — personal site](https://www.briewolfson.com/)
- [Sam Gerstenzang — Operating well, what I learned at Stripe](https://samgerstenzang.substack.com/p/operating-well-what-i-learned-at)
- [Mike Bifulco — friction-logging-toolkit / how-we-use-friction-logs-at-stripe.md](https://github.com/mikeb-stripe/friction-logging-toolkit/blob/main/how-we-use-friction-logs-at-stripe.md)

**Primary — interview / podcast with named Stripe practitioners:**

- [Pragmatic Engineer — Inside Stripe's Engineering Culture, Part 1 (with David Singleton)](https://newsletter.pragmaticengineer.com/p/stripe)
- [Pragmatic Engineer — Inside Stripe's Engineering Culture, Part 2 (with David Singleton) — partial / paywalled](https://newsletter.pragmaticengineer.com/p/stripe-part-2)
- [Lenny's Newsletter podcast — Building a culture of excellence, David Singleton](https://www.lennysnewsletter.com/p/building-a-culture-of-excellence)
- [First Round Review podcast — From kickoffs to retros and Slack channels, Brie Wolfson](https://review.firstround.com/podcast/from-kickoffs-to-retros-and-slack-channels-stripes-documentation-best-practices-with-brie-wolfson/)
- [First Round Review — To grow faster, hit pause, Claire Hughes Johnson](https://review.firstround.com/to-grow-faster-hit-pause-and-ask-these-questions-from-stripes-coo/)
- [Farnam Street podcast (Knowledge Project) — Patrick Collison](https://fs.blog/knowledge-project-podcast/patrick-collison/)
- [Ken Norton essay — Building Products at Stripe (with Michael Siliski, Business Lead, Payment Experiences & Platforms)](https://www.bringthedonuts.com/essays/building-products-at-stripe/)

**Secondary — named practitioner quoted:**

- [Postman blog — How Stripe Builds APIs (with CJ Avilla, Stripe DevRel)](https://blog.postman.com/how-stripe-builds-apis/)
- [Slab — How Stripe Built a Writing Culture (with Dave Nunez, Documentation Manager)](https://slab.com/blog/stripe-writing-culture/)
- [Slab — Stripe: The best way to encourage proficient writing is to demonstrate it (with David Singleton)](https://slab.com/guides/how-success-is-written/stripe-the-best-way-to-encourage-proficient-writing-is-to-demonstrate-it/)
- [Mintlify blog — How Stripe creates the best documentation in the industry](https://www.mintlify.com/blog/stripe-docs)
- [Giacomo Falcone — The importance of Writing in business: the Stripe playbook](https://giacomofalcone.substack.com/p/the-importance-of-writing-in-business) (synthesis; useful for cross-check)

---

## Surprises / tensions

- **Surprise 1: The coordination layer is the writing substrate.** I expected to find a named "product council" or "cross-product PM council" or "Architecture Review Board" — Stripe's coordination layer is *the writing culture itself*, with API Review as the one forcing-function cross-product gate. The public discourse repeatedly returns to "every artifact references the canon; canon is widely read; that's how coordination works." This has Cena implications: if you don't have the writing culture *operating in the substrate*, no number of meetings or roles will produce Stripe-class coordination. The substrate is load-bearing.

- **Surprise 2: Bu's honest critique of API Review.** It's the canonical cross-product gate, and the Principal Product Architect publicly says "it happens so late in the design process that [it] tend[s] to do a better job of preventing bad outcomes than of partnering with teams to steer great outcomes." The implication: a *single gate at the end* cannot steer outcomes; it can only block bad ones. The steering happens *earlier*, in shaping docs + first-principles thinking. The PaymentIntents 3-month conference-room redesign exists because the late-stage gate accumulated technical debt that couldn't be incrementally fixed. For Cena: a single late-stage canon-alignment gate (similar to what failed in the cena-apps Rewind C) is the same shape as Bu's critique — Stripe's response is *up-front shaping discipline*, not a stricter end-stage gate.

- **Surprise 3: Larson's "no unified engineering strategy" observation.** Even at Stripe, *implicit* engineering strategy across product lines wasn't consistently documented; Larson's prescription was to write five design docs and pull the similarities out. The coordination layer at Stripe is *strong* on API-design consistency and *weaker* on architecture strategy. Foundation engineering exists in part to address this gap. For Cena: don't assume "have a writing culture + have API Review" automatically produces engineering-strategy coherence — that's a separate workstream.

- **Surprise 4: "Retrospective, not postmortem" is enforced down to terminology.** The CFO called Wolfson after a "postmortem" notes share to correct the terminology. This is small but signals how *deeply* the writing canon is embedded — even single-word choices are governed by the writing canon. For Cena: tonal canon at this fidelity costs money to maintain (Wolfson explicitly proposed "Red Pens" editors as a role). The cost isn't optional if you want the canon to hold.

- **Tension: Stripe's writing substrate works at scale but didn't start at Cena's scale.** Most of the named ceremonies (biannual planning, weekly ops, Google Groups by artifact type, Red Pens) presuppose 100+ people. Cena (3 humans + agents) doesn't have the volume to populate those channels. The substrate has to be *re-shaped* for agent-substrate — agents can carry the canon, file the artifacts, run the shaping reviews, but the human-modeling layer (Collison's footnoted emails, Singleton's "engineerication") is what *signals* the canon's seriousness, and at 3 humans that signaling has to come from Aaron + early experts, not from a CTO modeling.

- **Tension: The 5-attribute frame (Purpose / Canon / Brief / Domain / Process) maps unevenly to Stripe artifacts.** Most Stripe artifacts have clear Purpose, Brief, and Process; "Canon" and "Domain" are *implicit* in the writing culture (everyone reads everyone; everyone absorbs the canon) but rarely named per-artifact. Cena's pipeline would benefit from making Canon + Domain *explicit per artifact* — Stripe's culture lets them be implicit because everyone has absorbed them, but a new + small team can't rely on absorption.

- **Surprise 5: Shaping docs use curl snippets as the wireframe equivalent.** "A description of a user story, interspersed with code snippets... curl commands showing how everything is done via an API at each step" — Siliski via Norton. This is the API-shaped product equivalent of UI wireframes. For Cena's UI pipeline, the equivalent is *probably wireframes-with-narrative*, not pure wireframes — i.e., the shaping artifact should carry the user-story narrative *and* the proto-UI in one document, rather than splitting them.

- **Coverage gap acknowledged: PRD format specifics.** Stripe references "PRD" but the artifact's *internal format* is fuzzier in public discourse than the kickoff memo's (Wolfson's hypothesis/baseline/non-goals/prior-art/metrics) or the shaping doc's (Norton/Siliski's user-story-plus-curl). It's possible PRD = kickoff memo at Stripe, or that PRD is a stage *between* shaping and kickoff. I treated them as one artifact in Block A.

- **Coverage gap acknowledged: post-Singleton process.** Singleton stepped down as CTO in 2024; the post-Singleton process is not well-documented publicly. The Acacia API release process (Oct 2024) and Bu's Sessions 2025 keynote on AI-improving-API-design are the most recent signal.
