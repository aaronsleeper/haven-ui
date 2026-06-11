# Headspace Health — pipeline architecture research

## Source quality summary

- **Named practitioners cited:**
  - **Product / Design leadership** — Leslie Witt (Chief Product and Design Officer), Cal Thompson (VP of Product Design & Research), Christine Evans (President), Johnson Lieu (SVP of Product Management).
  - **Design system / craft** — Steven Sczepanik (Senior Product Designer, Design Systems), Stephanie Nakamae (Lead Product Designer), Jayne Cayabyab (Lead Product Designer; original brief cites her as "Jane Kiyabiab" — verified spelling Cayabyab), Grant Nickel (Design Manager), Jonathan DeFavre (designer), Nick Hayward (Senior iOS Engineer).
  - **Ebb AI team** — Priyanka Marawar (Product Design Manager / UX Design Lead), Leah Braunstein (Lead Product Designer, conversational interface), Lauren Allik (Lead Brand Designer), Dani Balenson (Creative Director), Crystal Small (Lead UX Copywriter), Sandy Sanchez (Senior Copywriter).
  - **Brand / verbal identity (2017–2023)** — Makenzie McNeill (Lead Copywriter from 2017), plus creative team: Crystal Small, Steve Dennis, Carrie Laven, Liz Tran, Lauren Allik, Tina Hardison, Ryan Cox, Karen Hong, Joseph Mains, David Hsia.
  - **Clinical leadership** — Dr. Jenna Glover (Chief Clinical Officer, since Nov 2022), Dr. Jon Kole (psychiatry lead), Dr. Clare Purvis (Director of Behavioral Science / leads Science Team).
  - **Pre-merger Ginger leadership** — Karan Singh (co-founder, now COO of Headspace Health), Russell Glass (former Ginger CEO, became Headspace Health CEO post-merger Oct 2021), CeCe Morken (former Headspace CEO → President of combined entity).
  - **Pre-merger Ginger design (2016)** — Sara Koay (UX Researcher), Steph Dunn (collaborator on chat-client redesign).
- **Independent sources triangulated:** ~22 sources spanning Figma blog, MedCity News, MobiHealthNews, Behavioral Health Business, dscout, Headspace's own marketing / care-model / AI-principles / science pages, UX-podcast show notes, Substack interviews, Pear Healthcare Playbook (Medium), portfolio sites (Sczepanik, Nakamae), and the Headspace Engineering Medium publication. Most load-bearing claims triangulated across ≥2; flagged single-sourced claims with `[SINGLE-SOURCE]`.
- **Date range of sources:** 2016 (Ginger Sara Koay case study) → Dec 2025 (Ebb voice-mode rollout). Most design-process material clusters 2021–2025 post-merger.
- **Honest limits — coverage gaps and pre/post-merger era confound:**
  - **Coverage thinned post-merger.** Pre-merger Headspace had a strong Medium presence (`headspace.design/`, individual designer blogs) and Ginger had standalone case studies (Sara Koay's 2016 chat-client redesign at Stanford Biodesign + sarakoay.com). Post-merger Headspace Health discourse is concentrated in a handful of Leslie Witt and Cal Thompson interviews + the Ebb-launch press cycle. The richer prior-art is BRAND/voice and DESIGN-SYSTEM discourse; the post-merger discourse is OPERATIONS (stratified care model, KPIs).
  - **Era flagging:** I mark every finding **[PRE-MERGER HEADSPACE]**, **[PRE-MERGER GINGER]**, **[POST-MERGER HEADSPACE HEALTH]** where the source's era is determinative.
  - **Full transcripts unavailable:** Several high-value Cal Thompson and Leslie Witt podcast episodes (UX Podcast #337, Y in the Valley, Design Better AMA) have show-notes only — premium-gated or transcript-pending. Findings from those sources are partial.
  - **Private playbooks:** Internal PRD templates, design-spec formats, RFC processes, clinical-review SOPs are NOT publicly described. Findings on the artifact chain are inferred from public discourse + named processes, not from direct artifact disclosure.
  - **No HIPAA/security/regulatory analysis.** Out of scope per Aaron's call.

---

## Block A — Artifact chain

The artifact chain is **inferred** from public discourse (no Headspace published handbook describes it whole). It reflects the observed pattern from Leslie Witt's, Cal Thompson's, Priyanka Marawar's, and Karan Singh's interviews + the Ebb launch case study + the stratified-care-model and outcome-measurement marketing pages, which collectively describe a designable surface.

The chain **branches** into two parallel tracks (consumer-design + clinical-care) that **merge through the orchestration platform** (the unified Headspace app + Headspace Care + provider-facing EHR). Block C captures the merge points.

### Discovery / problem framing

| # | Artifact | Author role | Reader/reviewer roles | Input | Output | Format |
|---|---|---|---|---|---|---|
| 1 | **Generative research findings** (foundational study) | Researcher (Product Design & Research team) | Designers, PM, Science team, Clinical leadership | Member NPS open-ended responses; outcome data (PHQ-9, GAD-7, PSS); commissioned large-scale surveys | Concept-testing brief | Research report / FigJam synthesis |
| 2 | **Concept brief / "what could and should this be"** | Designer + PM (the "two-in-the-box" or "three-in-the-box" trio, per Cal Thompson) | Cross-functional team incl. Science | Generative research findings (1) | Concept-test design candidates | FigJam workshop + concept document |
| 3 | **Concept-test design + diary-study prototype** | Designer (often with copywriter for conversational UI) | Members (testing), Researchers, Science | Concept brief (2) | Validated direction | Figma prototype + diary study protocol |

### Design / detailed design

| # | Artifact | Author role | Reader/reviewer roles | Input | Output | Format |
|---|---|---|---|---|---|---|
| 4 | **Design exploration / "playground"** | Multiple designers + illustrators + copywriters + animators (parallel exploration) | Cross-functional team | Validated direction (3) | Aligned creative direction | FigJam playground; "around six brand identities" tested for Ebb |
| 5 | **High-fidelity design spec in Figma (using DS tokens)** | Product Designer | Engineering (via Figma Dev Mode), Brand, Design Systems steward, PM | Aligned creative direction (4) | Build-ready spec | Figma file with variables + components |
| 6 | **Copy spec (cross-surface)** | UX Copywriter + Brand copywriter | Designer, PM, Clinical (for AI/clinical-adjacent copy) | Design spec (5) | Approved copy across product + emails + push notifications | Figma annotation + copy doc |

### Clinical track (parallel, intersecting at gates)

| # | Artifact | Author role | Reader/reviewer roles | Input | Output | Format |
|---|---|---|---|---|---|---|
| C1 | **Clinical content brief / evidence-based protocol** | Clinical psychologist or psychiatrist (e.g., Headspace mindfulness teacher + Headspace psychiatrist co-leading the CBT for Mood and Anxiety program) | Science team, Product, Design | Clinical literature; Unified Protocol (UP) reference | Clinical content outline | Internal doc |
| C2 | **Safety mechanism spec (AI / acute-state)** | Clinical psychologists + Science team + ML/Eng | Product, Design, Engineering | Risk model, motivational-interviewing techniques | Guardrail + escalation paths spec | Internal doc + clinically-defined response patterns |
| C3 | **Clinical assessments (PHQ-4, PHQ-9, GAD-7, PSS, C-SSRS, PROMIS-Sleep)** | Validated instruments (standard); Headspace adapts shortened versions | Members complete; Clinicians + Care navigators read; routes via algorithm | — | Routing decision + provider matching | Forms in product |

### Build / ship

| # | Artifact | Author role | Reader/reviewer roles | Input | Output | Format |
|---|---|---|---|---|---|---|
| 7 | **Engineering implementation** | Engineering (iOS, Android, web, ML) | Eng leads, Design (Dev Mode review), QA | Design spec (5) + Copy spec (6) + Clinical specs (C1–C3) | Shipped code | Code |
| 8 | **A/B test / experiment** | PM + Designer + Eng | Cross-functional team; Science team for outcome analysis | Shipped code | Validated feature | Experimentation platform |
| 9 | **RCT for guided programs** | Science team (Dr. Clare Purvis et al.) + external research collaborators | Peer reviewers; product team | Shipped program + clinical population | Peer-reviewed publication; product-decision evidence | Published study (e.g., JMIR) |

### Coordination / orchestration touchpoints (cross-cutting, Block E)

| # | Artifact | Author role | Reader/reviewer roles | Input | Output | Format |
|---|---|---|---|---|---|---|
| O1 | **Biweekly team meetings + monthly leadership showcases** (Cal Thompson, Headspace) | Design team owns; cross-functional attendance | Design team, leadership | Work in progress | Course corrections, alignment | Recurring meeting |
| O2 | **"The Monthly Link" meeting** (Jayne Cayabyab runs it) | Cross-product designers | Ensures parallel experiments add up to coherent member journey | Multiple in-flight experiments | Coherence check across experiments | Monthly recurring meeting |
| O3 | **Weekly "warmup" — all current work in Figma** | All designers | Whole design team | Each designer's WIP | Visibility, peer feedback | Recurring Figma walkthrough |
| O4 | **Aggregated outcome data → product/ops/research/data-science teams** | Clinical operations | Product, Ops, Research, Data Science | Anonymized outcome data (PHQ-9, GAD-7, etc.) from members | New product enhancement priorities | Data feed |

---

## Block B — Roles + expertise

### Product / Design leadership

- **Chief Product and Design Officer — Leslie Witt.** Owns design + product + content organization + brand creative team + the science team (clinical psychologists + actuaries who evaluate efficacy). Self-described as a "utopian pragmatist." Holds the unified P&L authority that lets design decisions ride alongside business decisions. **Centralized** (one role, multi-line scope). [SINGLE-SOURCE for the explicit "design and designers, maybe researchers, content organization, brand creative team, science team" scope statement — Finding Our Way podcast.]
- **VP of Product Design & Research — Cal Thompson.** Shepherds the Product Design team + outcomes-research team. Emphasizes "two-in-the-box, maybe three-in-the-box" partnership where PM + Designer (+ optionally a third role) riff together from discovery through testing — explicitly avoids "product saying here's what we think will solve this problem" handoff. **Centralized** across product surfaces.
- **President — Christine Evans.** Owns strategic direction including brand. Reviewed/sponsored the 2024 brand refresh.
- **SVP of Product Management — Johnson Lieu.** Oversees member experience + care platforms. Named in the Headspace personalization features announcement as responsible for the assessment-driven routing system + provider-matching capabilities.

### Design craft roles

- **Lead Product Designer** (Stephanie Nakamae) — designs member-facing consumer-app experiences supporting retention and habit formation; flagged by Cal Thompson as identifying unrealized user problems in the margins of Figma files (going beyond initial assignment to surface adjacent needs).
- **Lead Product Designer** (Jayne Cayabyab) — runs "The Monthly Link" meeting, the cross-product coherence check for parallel experiments.
- **Design Manager** (Grant Nickel) — owns design-team rituals + meetings; culture work that Cal explicitly names as making the team "humble, no ego."
- **Senior Product Designer, Design Systems** (Steven Sczepanik) — owns the multi-brand design-token system + Figma variable architecture + the design-engineering Dev Mode handoff. Sole accountability for the design system rebuild.

### Ebb AI team (post-merger, evidence-rich)

- **Product Design Manager / UX Design Lead** (Priyanka Marawar) — owned the cross-functional alignment via FigJam workshops; framed the "north-star guidelines" for Ebb (visible AI, differentiated from human care, privacy + safety, member autonomy).
- **Lead Product Designer, Conversational Interface** (Leah Braunstein) — designed the conversation UX with the guardrail that "users feel safe and supported in expressing themselves, and have the agency to exit and delete a conversation at any time."
- **Lead Brand Designer** (Lauren Allik) — owned brand identity for Ebb; ran mobile QA using Figma Mirror.
- **Creative Director** (Dani Balenson) — owned visual identity exploration ("around six brand identities" tested); built a Figma "story kit" as creative single source of truth for the campaign.
- **Lead UX Copywriter** (Crystal Small) + **Senior Copywriter** (Sandy Sanchez) — owned naming + voice + cross-surface copy ("across product screens, emails, and push notifications"). Naming process tested multiple candidates (Odom, Ibo, Scribe → Ebb).

### Verbal identity / content design

- **Lead copywriter** (Makenzie McNeill, from 2017) plus a creative team of 10 (Crystal Small et al.) developed the four **personality principles** — Hopeful, Visionary, Approachable, Reliable — that scale messaging from clinical to playful without separate style guides per surface.

### Clinical roles (Headspace Care side, post-merger)

- **Chief Clinical Officer — Dr. Jenna Glover.** Oversees Care Services: mental health coaches, therapists, psychiatrists, **QA and training**, and **care enablement teams**. Background: VP of Care Services at Children's Hospital Colorado + Director of Psychology Training at U. Colorado School of Medicine. Expertise: dialectical behavior therapy, motivational interviewing, acceptance-based therapies. **Centralized clinical authority.**
- **Psychiatry lead — Dr. Jon Kole.** Leads psychiatry services for complex cases.
- **Director of Behavioral Science — Dr. Clare Purvis.** Leads the **Science Team**; responsible for **"integrating behavioral science into company operations at scale"** + partnering with external researchers. Also "leads clinical strategy and service delivery for Headspace Health" digital-health subsidiary.
- **Mental health coaches** — master's-level professionals; team-based 24/7 model + scheduled coaching with a lead coach.
- **Therapists** — licensed LCSW / LMFT / LMHC / LPC / PhD / PsyD / MD; trained in evidence-based modalities including the **Unified Protocol (UP)** — a transdiagnostic CBT-family treatment.
- **Psychiatrists** — board-certified, in-house, for medication management.
- **24/7 care navigation team** — handles "switching providers or coordinating inpatient care."
- **Internal QA team** — audits **100% of clinical notes** for adherence to evidence-based standards.
- **Licensed clinicians reviewing Ebb risk-flagged messages** — practicing mental health professionals who review deidentified flagged conversations and determine action.

### Boundary roles (load-bearing — the coordination layer is visible HERE)

This is the single most load-bearing finding in Block B for Cena. Headspace operates at least four boundary roles that bridge between obvious roles:

1. **Behavioral Science / Science team — bridges clinical psychology ↔ product.** Dr. Purvis's team is the explicit named bridge between clinical expertise and product operations. She is described as "building new processes to bring behavioral science into the day-to-day operations of the company, at scale" — i.e., not a one-shot consult, but an embedded process.
2. **Design Systems steward — bridges design ↔ engineering.** Steven Sczepanik's role *is* the bridge: the token system + Figma variables + Dev Mode handoff exists specifically so engineers can consume design decisions without translation drift. The Nick Hayward quote ("variables has proven immensely valuable in our component creation process") + the 30% release-cycle acceleration are the proof.
3. **Care navigation team — bridges product UX ↔ clinical operations.** The 24/7 navigation team is the human escalation surface when the algorithmic routing (PHQ-9 etc.) isn't sufficient. They handle provider-switching + inpatient coordination — explicit boundary work.
4. **UX Copywriter / Content Designer — bridges design ↔ brand voice ↔ clinical safety.** Crystal Small, Sandy Sanchez, and Makenzie McNeill operate at the intersection: the same copywriters who own the playful brand voice also own clinical-adjacent messaging. This is enforced by the "four personality principles" architecture that explicitly scales from playful to clinical without forking guides.

### Headcount discipline

The data is mixed. Steven Sczepanik's design-system role is **centralized** (one Senior Designer drives the multi-brand system). The Product Design team is **~17 people** (per Figma blog photo) reporting up through Cal Thompson. Clinical staff scale **per care line** (coaches, therapists, psychiatrists each headcounted to demand). The boundary roles (Science team, care navigation, design systems) are explicitly **centralized** by design — Cena should note that these are *not* per-product-line.

---

## Block C — Gates between artifacts

### Gate 1: Research → Concept brief

- **What is checked.** Did generative research produce a defensible "what could and should this be" framing? Cal Thompson: *"What could and should this be if it's coming from Headspace?"*
- **Who has authority to halt.** Designer + PM (the two-in-the-box) plus Researcher.
- **What halt produces.** Re-scoping or additional research; the AI integration decision explicitly required *more* research before committing because "AI cannot pretend to be human and should solve genuine user needs, not replace human connection in mental health contexts."
- **Falsifiability.** Judgment-based; calibrated via member NPS open-ended responses (an always-on signal) + concept-testing with diary studies.

### Gate 2: Concept → Detailed design ("six brand identities" gate)

- **What is checked.** Did the concept survive brand-identity exploration? Did the team test enough alternatives that the chosen direction is the strongest available, not the first satisfactory? (Ebb tested ~6 brand identities; Crystal and Sandy tested multiple names before "Ebb" landed.)
- **Who has authority to halt.** Creative Director (Dani Balenson on Ebb).
- **What halt produces.** Re-exploration in the FigJam "playground."
- **Falsifiability.** Judgment; calibrated by team consensus ("a lightning-strike moment, with teams unable to refer to it as anything other than Ebb").

### Gate 3: Detailed design → Engineering implementation (the Dev Mode gate)

- **What is checked.** Are design tokens registered in Figma variables and consumable via Dev Mode? Did engineers participate in component-creation so they can implement against tokens, not pixel-traced screens?
- **Who has authority to halt.** Engineering (per Nick Hayward's role + the Sczepanik partnership pattern).
- **What halt produces.** The token system gets extended; the design-system team adds the missing primitive.
- **Falsifiability.** Mechanical — `85% average utilization of tokens/components per design file` is a directly measurable check that this gate is holding.

### Gate 4: Clinical content → Product (the clinical-evidence gate)

- **What is checked.** For every guided program, has an **RCT** been conducted to test efficacy? Headspace: *"We conduct randomized controlled trials (RCTs) for every guided program to test their impact."*
- **Who has authority to halt.** Science team (Dr. Clare Purvis) + Chief Clinical Officer (Dr. Jenna Glover); peer reviewers indirectly.
- **What halt produces.** Program iteration before scaled rollout; published findings become reference.
- **Falsifiability.** RCT outcomes — this is the most falsifiable gate Headspace operates. **Load-bearing for Cena.**

### Gate 5: Clinical-track → Member surface (the assessment-routing gate)

- **What is checked.** Every member is scored on **PHQ-4** at intake (the front-door 4-question screen); members already in care are scored on **PHQ-9 / GAD-7 / PSS**; **C-SSRS suicide-risk** is triggered conditionally by specific PHQ-9 responses; **PROMIS-Sleep** is used for the sleep program. Routing to coaching vs. therapy vs. psychiatry vs. content is **algorithmic** off these scores.
- **Who has authority to halt.** The algorithm halts and routes; care navigation team can override. Clinicians make the diagnosis-and-prescribe decision.
- **What halt produces.** Member routed to higher tier of care (acute → psychiatrist; suicide risk → C-SSRS + escalation).
- **Falsifiability.** Yes — the assessment scores are deterministic; the algorithm's routing decision is auditable. **This is the structural answer to "how does a design-led company gate for clinical safety": validated instruments + automated routing + escalation paths + human navigators as the override layer.**

### Gate 6: Ebb conversation → Clinical safety review (the AI safety gate)

- **What is checked.** *"100% of messages sent to Ebb are monitored by a proprietary Safety Risk Identification system."* Flagged messages are **deidentified**, then screened for "high-acuity risks, outliers, and emerging AI risks such as AI psychosis."
- **Who has authority to halt.** Licensed clinicians (practicing mental health professionals) review flagged messages and "determine any further action needed."
- **What halt produces.** Ebb gently guides member to crisis resources or a provider; system-level: guardrails get tuned.
- **Falsifiability.** Mechanical (the safety-risk model identifies; the human-review log records). **Load-bearing for Cena's UConn vulnerable-population question.**

### Gate 7: Clinical notes audit (the operational quality gate)

- **What is checked.** *"100% of clinical notes are audited for adherence to evidence-based standards."*
- **Who has authority to halt.** QA team under Dr. Jenna Glover.
- **What halt produces.** Provider feedback, retraining, escalation.
- **Falsifiability.** Mechanical — every note, audited.

### Gate 8: A/B test → Ship (the experimentation gate)

- **What is checked.** Does the feature improve **healthy outcomes**, not just engagement? Leslie Witt: *"engagement is the a priori to be able to deliver value. So I am pro-engagement, but it's not the goal."* Cal Thompson: *"10 minutes of meditation, three times a week...measurably reduce someone's stress. So those are the metrics we care about."*
- **Who has authority to halt.** PM + Designer + Science team consult on outcome metrics.
- **What halt produces.** Iterate or kill the feature; if outcome metric doesn't improve, engagement isn't sufficient justification.
- **Falsifiability.** Outcome metrics (stress reduction, sleep, PHQ-9/GAD-7 change scores) — falsifiable.

### Gate 9: "The Monthly Link" — coherence gate

- **What is checked.** Do parallel experiments add up to a **coherent member journey**, or do they fragment it?
- **Who has authority to halt.** Convened by Jayne Cayabyab; design team owns the call.
- **What halt produces.** Reconcile or sequence; one of the experiments waits.
- **Falsifiability.** Judgment; calibrated by reading the member journey end-to-end.

---

## Block D — Per-artifact briefs (5-attribute frame)

The frame is applied to the highest-load-bearing artifacts. I do not fill every row in Block A — some are too thinly evidenced in public discourse to fill honestly.

### D-1. Generative research findings

- **Purpose.** Inform the "what could and should this be" reframe before commitment to a concept. Surfaces non-obvious user problems (the gap Stephanie Nakamae is praised for finding "in the margins of her Figma files") and validates that the team is solving the right problem rather than the first solvable problem.
- **Canon.** Existing member NPS open-ended data; previous outcome research (the 65+ peer-reviewed publications); brand personality principles; clinical evidence base for the relevant population.
- **Brief.** Practitioner needs research expertise (qualitative + quantitative), Figma-native synthesis ability (FigJam workshops), and the discipline to surface "true synthesis, true ideation" rather than confirm pre-existing intent. Includes diary-study and concept-testing protocols.
- **Domain.** UX research, behavioral science, clinical psychology adjacency.
- **Process.** Researcher conducts (e.g., the foundational AI study + the Ebb concept tests). Outputs are consumed in cross-functional readouts (biweekly + monthly showcases). Designers, PM, Science team review. The Science team specifically reviews for behavioral-science soundness.

### D-2. Design exploration / FigJam "playground"

- **Purpose.** Generate enough creative alternatives that the chosen direction is the strongest available, not the first satisfactory. Tests visual identity + naming + interaction model in parallel.
- **Canon.** Brand personality principles (Hopeful / Visionary / Approachable / Reliable); design-system tokens; brand illustration system; motion guidelines ("movement of components is meant to look like breathing"); existing surface patterns.
- **Brief.** Practitioners coordinate via FigJam workshops with stakeholders. Illustrators, designers, copywriters, animators "all go to their corner and explore" in parallel. Multiple identities tested (Ebb: ~6) and skinned against the same screens for comparison.
- **Domain.** Visual design, brand, illustration, copy, motion, content design — multi-discipline by definition.
- **Process.** Creative Director (Dani Balenson on Ebb) framings + holds the gate; team converges through FigJam playground + naming/concept tests. Brand designer QA's via Figma Mirror on mobile.

### D-3. High-fidelity design spec in Figma (using DS tokens)

- **Purpose.** Hand engineering a build-ready spec where every value is token-referenced (color, spacing, typography, motion) so no translation step happens between design intent and code.
- **Canon.** The token system Steven Sczepanik authored — color (Emotional + Functional palettes), typography (Aperçu custom typeface), spacing, motion (Duration/Easing/Patterns/Depth), icons (bespoke quirky rounded). The pattern-library / component library inside Figma. Multi-brand mode (Headspace consumer + Headspace Care).
- **Brief.** Designers MUST author against variables (not hex literals); Dev Mode is the eng-facing read surface. 85% token-utilization target.
- **Domain.** Product design + design system fluency.
- **Process.** Designer drafts → DS steward consults if a new primitive is needed → eng reviews in Dev Mode → handoff. The token system collapses the spec-to-code translation step.

### D-4. Copy spec (cross-surface)

- **Purpose.** Hold one voice across product screens + emails + push notifications + (for Ebb) the AI conversation persona, without forking per-surface style guides.
- **Canon.** The four personality principles (Hopeful, Visionary, Approachable, Reliable); the meditation-teacher voice as the brand anchor; the "no jargon, no idioms, occasional light humor" tonal floor; for Ebb specifically: gender-neutral, "not quite human but human-adjacent," and clinical-safety boundaries (no medical advice, no diagnosis, no treatment claims).
- **Brief.** UX copywriter authors against the four principles; tone scales clinical-to-playful within them. For AI surfaces, copy is bounded by the safety guardrails authored with clinical psychologists.
- **Domain.** Content design + brand voice + (for clinical-adjacent) basic mental-health awareness.
- **Process.** Lead UX copywriter (Crystal Small on Ebb) + senior copywriter (Sandy Sanchez) author. Clinical psychologists train AI-conversation patterns. Cross-functional review.

### D-5. Clinical content brief / evidence-based protocol

- **Purpose.** Encode an evidence-based intervention (e.g., the Unified Protocol; CBT for Mood and Anxiety) into a product surface (guided program, coaching script, conversation flow).
- **Canon.** The Unified Protocol; CBT literature; motivational interviewing; the Headspace research corpus (65+ peer-reviewed publications); the four personality principles for voice; clinical guardrails on AI.
- **Brief.** Co-authored by a clinical lead and a domain practitioner — e.g., the CBT for Mood and Anxiety program is "co-led by a Headspace mindfulness meditation teacher and a Headspace psychiatrist."
- **Domain.** Clinical psychology + psychiatry + mindfulness practice + content design.
- **Process.** Clinical author drafts → Science team reviews → RCT design (every guided program gets an RCT) → product/design partner translates into UI artifact → ship → outcome measurement.

### D-6. Safety mechanism spec (AI / acute-state)

- **Purpose.** Constrain an AI surface so it cannot give medical advice, cannot diagnose, cannot replace clinical care; AND so it can detect acute risk and route to crisis resources or a human clinician.
- **Canon.** Headspace AI principles (Putting people first / Learning from experts / Taking privacy seriously); FDA/clinical norms for AI mental-health products; motivational-interviewing techniques; the C-SSRS suicide-risk instrument; the Safety Risk Identification model.
- **Brief.** Clinical psychologists train the conversational AI; safety-detection mechanisms run on 100% of messages; flagged messages are deidentified and routed to licensed clinicians for review. Guardrails specifically restrain: giving medical advice, treatment discussion, medication discussion.
- **Domain.** Clinical psychology + ML safety + content design + product design.
- **Process.** Clinical + ML + design co-author. Internal testing partners with "internal identity and experience-focused employee resource groups" to test vulnerabilities with underrepresented communities from inception. Concept + usability tests inform conversational interface design. Continuous monitoring post-ship; flagged conversations reviewed by licensed clinicians; system tuning.

### D-7. Clinical assessment routing (algorithm + UI)

- **Purpose.** Match every member to the right tier of care at intake and on an ongoing basis; minimize question-fatigue + drop-off; surface acute risk early.
- **Canon.** Standard validated instruments: PHQ-4 (intake screen), PHQ-9 (depression severity), GAD-7 (anxiety), PSS (stress), C-SSRS (suicide risk, triggered conditionally by PHQ-9 item 9), PROMIS-Sleep (sleep). The stratified care model.
- **Brief.** Designer must compose validated instruments WITHOUT modifying their psychometric properties (the instruments are canon — you don't redesign PHQ-9 questions). UX work focuses on minimizing fatigue + reducing drop-off while keeping the instrument intact.
- **Domain.** Clinical psychology + product design + content design.
- **Process.** Clinical sets the instruments + thresholds + escalation paths. Design composes the form UX + transition copy. Science team reviews. Product ships. Outcomes are tracked over time and flow back to product/ops/research/data-science (the O4 cross-team feed).

### D-8. RCT for guided programs

- **Purpose.** Establish that a product surface (guided program, intervention) measurably improves clinical outcomes — not just engagement.
- **Canon.** Clinical-trial protocols; the Headspace research corpus; peer-reviewed publication standards.
- **Brief.** Science team (Dr. Clare Purvis) + external research collaborators; standard RCT methodology; published in venues like JMIR Formative Research.
- **Domain.** Clinical research + behavioral science.
- **Process.** Designed alongside the product feature; runs while product is in market or in controlled rollout; results inform whether the feature ships broadly + the published evidence reinforces brand credibility.

---

## Block E — Coordination / orchestration layer

This is the **spine** of the synthesis frame; for Headspace specifically, the orchestration shape is **distributed across four loci** rather than centralized in one named role + cadence + artifact. Naming the distribution honestly:

### Locus 1: The unified P&L role (Leslie Witt as Chief Product and Design Officer)

- **What it does.** Holds design + product + content + brand + science under a single accountability. Witt: she transitioned from VP of Design to VP of Design and Product because "the designerly approach maps closely to product leadership," and she now holds "design and designers, maybe researchers, content organization, brand creative team, and our science team." This is *the* structural answer to "how do you keep clinical accountability + consumer design + business outcomes aligned" — by putting them in one person's authority.
- **Where it sits.** A C-level role.
- **Artifacts.** P&L; outcome metrics (stress reduction, sleep, PHQ-9/GAD-7 change); engagement metrics as floor not ceiling.
- **Interaction with chains.** Witt sets the north-star (healthy outcomes, not engagement) and holds the gate on the engineering-to-business handoff.
- **How it enforces the north-star.** Outcome metrics OVER engagement metrics — the "healthy outcomes (not just engagement)" framing IS the north-star enforcement. Every chain returns to it through O4 (the aggregated-outcome-data cross-team feed).
- **How it detects missed things.** Cross-functional scope (design + product + brand + science) means missed-thing detection is in the role's daily cognitive load, not a separate process.
- **What its absence looks like.** Implicit; Witt explicitly notes that without unified authority, "the designerly approach" remains an advocacy posture rather than an operating one — a common pattern in design-led companies where design and product leadership are siloed.

### Locus 2: The recurring meeting cadence (Cal Thompson's design org)

- **What it does.** Maintains alignment across a distributed design team via predictable rituals.
- **Where it sits.** The Product Design & Research org.
- **Artifacts and cadence.**
  - **Biweekly team meetings + monthly leadership showcases** (Cal Thompson) — keeps work visible to leadership; course corrections happen here.
  - **The Monthly Link** (Jayne Cayabyab) — *"runs the monthly link meeting ensuring experiments create coherent journeys."* This is the **missed-thing detection** mechanism at the experiment-coherence layer.
  - **Weekly "warmup"** — "showing all current work in Figma" to the whole design team; peer feedback + visibility.
  - **"The sandbox"** — collaborative problem-solving forum.
  - **"Work that is not work"** — culture rituals (silly/creative topics) maintaining "the most humble, no ego design team."
- **How it enforces the north-star.** Leadership showcases keep work tethered to outcome-metric framing; The Monthly Link specifically catches the failure shape Aaron is worried about — parallel experiments that don't add up to a coherent journey.
- **How it detects missed things.** The Monthly Link is explicitly the missed-thing-detection cadence at the experiment-fragmentation layer.

### Locus 3: The Science team as the embedded clinical operating layer (Dr. Clare Purvis)

- **What it does.** Behavioral science is **not** an external consult — Purvis's mandate is "building new processes to bring behavioral science into the day-to-day operations of the company, at scale." This is a permanent embedding.
- **Where it sits.** Reports up through Witt; partners cross-functionally.
- **Artifacts.** Research designs; RCT protocols; the 65+ peer-reviewed publications corpus; behavioral-science processes consumed by product/design.
- **How it interacts.** Sits at design-track ↔ clinical-track merge points. Reviews clinical-content briefs (gate 4) + safety mechanisms (gate 6) + the assessment-routing logic (gate 5).
- **How it enforces the north-star.** Owns the outcome side of "healthy outcomes" — the RCT evidence that the product measurably helps.
- **How it detects missed things.** Continuous research + the published-corpus discipline surfaces gaps before they become product problems.

### Locus 4: The design system as a software-primitive coordination layer (Steven Sczepanik's token system)

- **What it does.** Encodes design + brand decisions as token variables consumed via Figma Dev Mode by engineers — removing the translation step where decisions silently drift. The multi-brand mode (Headspace + Headspace Care, post-merger) lets one system serve both consumer-app and clinical-app surfaces.
- **Where it sits.** A software-primitive (tokens + components + variables) maintained by the Design Systems steward.
- **Artifacts.** The token system itself; the Figma component library; Dev Mode for engineering consumption.
- **How it enforces the north-star.** Indirectly — by holding brand + visual consistency across all surfaces, including the clinical-care surfaces, so the unified "one front door" feel stays intact through the surface transitions.
- **What its absence looks like.** Steven's own account of the pre-token system: *"manual, heavily reliant on plugins, not optimized for scale; colors were hard-coded values with multiple hex code variations; minor palette changes consumed hours or days for a single person; prone to misinterpretation and unintentional editing by engineers."* The drift was concrete and measurable. The new system: 30% release-cycle acceleration, 85% token utilization, 1-minute dark-mode implementation (down from 1 hour).

### How the four loci interact

Loci 1 + 3 hold the **north-star** (Witt = outcomes-over-engagement; Purvis = clinical-evidence rigor). Locus 2 catches **journey-coherence drift** (The Monthly Link). Locus 4 catches **visual + token drift** (the design system). Each locus has its own falsifiability mechanism.

**Honest finding:** there is no single named PM/orchestration role described publicly that owns the cross-pipeline orchestration the way (e.g.) a Linear-style project model does. The orchestration is **distributed across the four loci above**, held in place by the executive role at Locus 1.

### What the failure mode looked like before the unified platform (Aaron's "what does absence look like")

The pre-2022 state: two separate apps (Headspace consumer + Ginger clinical), two separate brands, two separate onboarding flows, two separate provider/EHR systems. Members had to navigate fragmentation. Leslie Witt's reframing was the **"one front door, one unified onboarding with a singular destination"** — the platform unification was the structural answer to the pre-unification fragmentation. The Nov 2022 unified-platform launch + the Jan 2024 brand refresh ("Ginger" → "Headspace Care") are the two artifacts that closed this.

---

## Clinical-context probe (Headspace-specific)

### Clinical-accuracy gates

**Five named clinical gates operate in parallel**, not a single gate:

1. **Validated-instrument gate.** PHQ-4 at intake; PHQ-9, GAD-7, PSS for ongoing assessment; C-SSRS for suicide risk (conditionally triggered by PHQ-9 item 9); PROMIS-Sleep for sleep program. Instruments are CANON — not redesigned. UX work composes them; clinical sets the thresholds.
2. **RCT-for-every-guided-program gate.** Headspace: *"We conduct randomized controlled trials (RCTs) for every guided program to test their impact."* This is the strongest published-gate in the Headspace pipeline and the most defensibly transferable. Authority: Science team (Dr. Clare Purvis).
3. **AI safety-detection gate.** *"100% of messages sent to Ebb are monitored by a proprietary Safety Risk Identification system."* Flagged messages → deidentified → reviewed by licensed clinicians who determine action. Authority: Clinical team via on-call rotation. **The gate is mechanical (model identification + every-message coverage) layered with human review.**
4. **Clinical-notes-audit gate.** *"100% of clinical notes are audited for adherence to evidence-based standards"* by Dr. Glover's QA team.
5. **Provider-vetting gate.** *"100% of recommended providers are pre-vetted for network status, fit, and availability."* Members can specify gender/race-ethnicity/area-of-expertise preferences; matching algorithm + member review.

**Authority structure:** Dr. Jenna Glover (Chief Clinical Officer) holds clinical authority. Dr. Clare Purvis holds behavioral-science / evidence authority. Dr. Jon Kole leads psychiatry. They sit alongside (not under) Leslie Witt's product/design authority, joined at the C-level. **Single gate vs. distributed:** distributed by function (Glover = care delivery; Purvis = research/evidence; Kole = psychiatric specifics), all rolling up to outcome data feeding O4 (cross-team aggregated-data feed).

### Persona-calibration discipline for users-in-acute-state

The discipline is composed of **five layered design moves**, not one persona-document:

1. **Validated screening at the door.** PHQ-4 catches anxiety/depression signal at intake before the member self-routes. The system surfaces severity to itself, not just to the member.
2. **Algorithmic routing based on severity.** *"Members that exhibit high levels of anxiety or depression through the PHQ-9/GAD-7 may receive an in-app recommendation to engage in therapy while members with low levels of stress may be prompted to engage in Headspace content."* The product surface adapts based on assessed acuity.
3. **C-SSRS triggering on PHQ-9 item-9 response.** A specific instrument fires conditionally on the suicide-ideation indicator. This is the load-bearing acute-state mechanism: the member's answer to one question reshapes the next screen.
4. **24/7 care navigation team.** Human escalation surface; handles provider-switching and inpatient coordination — the "the algorithm couldn't" path.
5. **Continuous-monitoring on the AI surface.** Ebb's safety-risk identification model runs on every message; "gently guides you to crisis resources or a provider" when risk escalates.

**Encoded in artifacts:** the four personality principles (Hopeful, Visionary, Approachable, Reliable) scale across acuity levels without forking guides. Ebb's content design is explicitly bounded by clinical guardrails — no medical advice, no diagnosis, no treatment, no medication discussion — meaning the COPY ITSELF carries acute-state safety. The Ebb mascot is "a friendly blob that wasn't too smiley...you want to feel like it's listening, but not too happy" — explicit calibration for users-not-in-celebratory-mode.

**Research process for vulnerable populations:** Headspace partnered with "internal identity and experience-focused employee resource groups" to test vulnerabilities with underrepresented communities from inception, with the Ebb work. Diary studies + concept testing run on actual mental-health-app users (not surrogate populations).

### Clinical-vs-design track relationship

The relationship is **parallel with coordinated handoffs**, NOT one gating the other. The merge points are:

- **At intake / routing.** Clinical assessments (PHQ-4 etc.) gate which surface the member sees — design composes the form UX, clinical owns the instruments + thresholds + routing logic.
- **At AI conversation surface.** Clinical psychologists train the persona + guardrails; design + copy own the interface + voice. They co-author Ebb's spec.
- **At guided-program surface.** Clinical lead + mindfulness teacher co-author the program (e.g., the CBT for Mood and Anxiety program is "co-led by a Headspace mindfulness meditation teacher and a Headspace psychiatrist"); design + copy compose into the product.
- **At the QA layer.** 100% clinical-notes audit + 100% AI-message monitoring; both are continuous, not gates that fire only at ship-time.
- **At the executive level.** Dr. Glover (clinical) + Leslie Witt (product/design) + Dr. Purvis (science) sit alongside one another reporting up to CEO Russell Glass. The relationship is not "clinical gates design" or "design gates clinical" — they hold separate accountabilities that meet at outcomes.

**The key structural insight for Cena:** Headspace did NOT import healthcare-firm UX patterns when adding clinical accountability. The brand voice stayed playful/approachable; the clinical addition came through (a) validated instruments as canon-not-redesign-target, (b) RCT-for-every-program as the evidence gate, (c) the AI safety-detection-plus-clinician-review model, (d) the parallel-track org structure where clinical and design report up separately and meet at outcomes. The personality principles ("Hopeful, Visionary, Approachable, Reliable") were the **voice-scaling primitive** that let the brand serve clinical content without sounding clinical.

---

## Citations

(URL + practitioner where named + date / era marker. **[SINGLE-SOURCE]** flags single-sourced load-bearing claims.)

- **Figma blog — Building a Design System That Breathes with Headspace** (https://www.figma.com/blog/building-a-design-system-that-breathes-with-headspace/) — Steven Sczepanik, Nick Hayward, ~2023. [POST-MERGER]. Source for: Sczepanik's role, multi-brand system, token architecture, Dev Mode handoff, 30% release acceleration, 85% token utilization, 1-minute dark mode.
- **Figma blog — How Headspace Built an AI Companion (Ebb)** (https://www.figma.com/blog/headspace-ebb-ai-companion/) — Priyanka Marawar, Leah Braunstein, Lauren Allik, Dani Balenson, Crystal Small, Sandy Sanchez, ~2024. [POST-MERGER]. Source for: Ebb team roster, FigJam playground process, north-star guidelines, 6-brand-identity exploration, conversational-UI gates.
- **dscout — How Headspace Created a Safe Reflection Experience Using AI** (https://dscout.com/people-nerds/headspace-using-genai) — Priyanka Marawar, ~2024. [POST-MERGER]. Source for: Ebb research process (foundational study + diary studies + concept/usability testing); safety mechanisms; ERG partnerships for vulnerable-population testing.
- **Headspace AI principles page** (https://www.headspace.com/ai) — institutional, current. [POST-MERGER]. Source for: 100% message monitoring; licensed-clinician review of flagged messages; AI does/does-not-do scope; the three named principles.
- **VAEXPERIENCE Ep14 — Cal Thompson** (https://blog.vaexperience.com/ep14-strategic-product-design-and-designing-mindful-ux-at-headspace-with-cal-thompson/) — Cal Thompson, ~2024. [POST-MERGER]. Source for: VP role; named team members (Nakamae, Cayabyab, Nickel, DeFavre); two/three-in-the-box partnership; cadence + culture rituals (biweekly, monthly showcase, monthly link, weekly warmup, sandbox); "what could and should this be"; humble-no-ego framing.
- **Future London Academy — Cal Thompson on AI** (https://futurelondonacademy.co.uk/en/articles/cal-thompson-on-how-they-use-ai) — Cal Thompson, ~2025. [POST-MERGER]. Source for: AI tooling in research (Claude, Figma Make, Google Deep Research); prototype-time compression.
- **UX Podcast #337 — Cal Thompson** (https://uxpodcast.com/337-headspace-cal-thompson/) — Cal Thompson, Apr 2025. [POST-MERGER]. **[SINGLE-SOURCE for direct quote]** *"10 minutes of meditation, three times a week, is like that perfect sort of sweet spot to measurably reduce someone's stress. So those are the metrics we care about."* — full transcript pending.
- **Finding Our Way podcast Ep 50 — Leslie Witt** (https://findingourway.design/2024/10/26/50-balancing-design-and-business-as-a-utopian-pragmatist-ft-leslie-witt/) — Leslie Witt, Oct 2024. [POST-MERGER]. Source for: design+product role transition; "utopian pragmatist"; engagement-as-floor framing; scope (design, research, content, brand, science).
- **Headspace stratified care model** (https://organizations.headspace.com/care-model) — institutional. [POST-MERGER]. Source for: care-tier structure; 100% clinical-notes audit; provider vetting; 24/7 care navigation; 62% multi-care-type stat.
- **Headspace Meet Jenna Glover** (https://organizations.headspace.com/blog/meet-jenna-glover-headspaces-new-chief-clinical-officer) — Dr. Jenna Glover, ~2022-2023. [POST-MERGER]. Source for: clinical org structure (coaches/therapists/psychiatrists/QA/training/care enablement); Unified Protocol training; scheduled-coaching rollout.
- **Headspace Measuring Outcomes** (https://organizations.headspace.com/blog/measuring-mental-health-outcomes-and-improvement) — institutional. [POST-MERGER]. Source for: PHQ-4/PHQ-9/GAD-7/PSS/C-SSRS/PROMIS-Sleep stack; outcome stats (59% / 69% / 43%); data flow to product/ops/research/data-science.
- **Headspace New Features** (https://organizations.headspace.com/blog/new-features-at-headspace) — Johnson Lieu, ~2024-2025. [POST-MERGER]. Source for: SVP PM role; intelligent routing; provider-matching by gender/race-ethnicity/expertise; RCT-per-guided-program; CBT for Mood and Anxiety as co-led by mindfulness teacher + psychiatrist.
- **Greenlight Health interview — Clare Purvis** (https://greenlighthealth.com/clare-purvis/) — Dr. Clare Purvis. [PRE-MERGER HEADSPACE, role continues post]. Source for: Director of Behavioral Science; leads Science team; "integrating behavioral science into company operations at scale"; clinical strategy for Headspace Health.
- **The Subtext — Headspace Verbal Identity** (https://www.thesubtext.online/all/headspace-verbal-identity) — Makenzie McNeill + named creative team (Small, Dennis, Laven, Tran, Allik, Hardison, Cox, Hong, Mains, Hsia). 2017→. Source for: four personality principles; voice-scaling clinical-to-playful; verbal identity development.
- **Pear Healthcare Playbook — Karan Singh** (https://medium.com/pear-healthcare-playbook/lessons-from-karan-singh-headspace-health-reinventing-new-gtms-and-business-models-in-mental-711b546c9ebc) — Karan Singh, ~2022. [PRE/POST-MERGER]. Source for: the three Cs (coaching/clinical/content) framework; Ginger's deliberate exclusion of controlled-substance prescribing; "know your boundaries."
- **MedCity News — Headspace Health "One Front Door"** (https://medcitynews.com/2022/11/one-front-door-headspace-health-launches-new-platform-following-merger-with-ginger/) — Leslie Witt, Nov 2022. [POST-MERGER]. Source for: "personalized experience from day one: one front door, one unified onboarding"; unified platform launch Jan 2023.
- **Spectrum Equity — Merger announcement** (https://www.spectrumequity.com/news/ginger-and-headspace-will-merge-to-meet-escalating-global-demand-for-mental-health-support/) — Russell Glass, CeCe Morken, Karan Singh, Aug 2021. Source for: Glass → Headspace Health CEO; Morken → President; merger close Oct 2021; $3B valuation.
- **Headspace Brand Refresh** (https://organizations.headspace.com/blog/headspace-unveils-refreshed-brand-and-expands-offerings-for-lifelong-mental-health-support) — Christine Evans, Leslie Witt, ~2023-2024. [POST-MERGER]. Source for: Christine Evans (President); Ginger → Headspace Care rename; 60+ NPS; 73% of enterprise clients citing brand as adoption driver.
- **Steven Sczepanik portfolio** (https://www.sczepanik.com/headspace) — Steven Sczepanik. [POST-MERGER]. Source for: token system structure (Emotional + Functional colors, Aperçu typeface, motion system Duration/Easing/Patterns/Depth, bespoke icons); multi-brand scope.
- **Behavioral Health Business — One year after merger** (https://bhbusiness.com/2022/11/18/a-year-after-3b-mega-merger-headspace-and-ginger-roll-out-unified-behavioral-health-offering/) — Karan Singh interview, Nov 2022. [POST-MERGER]. Source for: integration "hard and fun"; phased merger structure.
- **Sara Koay portfolio — Ginger.io chat client redesign** (https://www.sarakoay.com/gingerio) — Sara Koay, Steph Dunn, 2016. [PRE-MERGER GINGER]. Source for: pre-merger Ginger design process (research permission + brief-change buy-in challenges; interview-driven affinity diagram synthesis; iterative paper prototyping); historical context only — not the post-merger pipeline.
- **Stanford Biodesign case study on Ginger.io** (https://biodesign.stanford.edu/content/dam/sm/biodesign/documents/case-studies/Ginger.io-User-Focused-Ideation-and-Design.pdf) — 2016-era. [PRE-MERGER GINGER]. Historical context.
- **Headspace Engineering on Medium** (https://headspace.medium.com/) — various authors (Setu Shah on ML; engineering blog posts on Android testing 2022, Auth0 / AWS identity 2021, human-centered software development 2021). [POST-MERGER]. Source for: existence of an engineering writing practice; ML/MLOps + mobile testing + security + experimentation + recommendation-system A/B testing as documented practices. **No public PRD/RFC template, but practices are visible.**
- **Fast Company — Why Headspace's CPO says AI won't replace your therapist** (https://www.fastcompany.com/90874252/headspace-cpo-says-ai-wont-replace-your-therapist) — Leslie Witt. **[BLOCKED-403, single-line summary only via search]**: "What we're invested in is, how do we superpower the expert so that they can scale, so that they can be that much more confident in what it is that they're doing and that much more efficient." Marked **[UNVERIFIED]** because full article was 403 to WebFetch.
- **MobiHealthNews Q&A on Headspace Health acquisitions** (https://www.mobihealthnews.com/news/qa-how-headspace-healths-acquisitions-alter-its-mental-health-product) — Leslie Witt. **[BLOCKED-403]**. Marked **[UNVERIFIED]** — present in search results but not retrievable for direct quotation.

### Unverified / partial-coverage flags

- The full PRD/RFC/design-spec templates — INFERRED from observed practice + named gates + cadences, NOT from disclosed internal templates.
- The Cal Thompson UX Podcast #337 transcript was not yet published at fetch time — direct-quote coverage from that source is single-line.
- The Cal Thompson Substack interview (kristenberman.substack.com) was 403-blocked; search-only access.
- The Leslie Witt podcast transcripts (Y in the Valley, Design Better AMA) are gated/pending — substantive content via secondary citation only.

---

## Surprises / tensions

- **Surprise: no centralized PM/orchestration role described publicly.** I expected a Stripe-or-Linear-style named PM coordination layer. Headspace's orchestration is **distributed across four loci** (executive scope at Witt; cadence at Thompson's org; embedded science at Purvis; design-system as software-primitive at Sczepanik). The closest single named cadence to "PM coordination" is **The Monthly Link** (Jayne Cayabyab) — but it's a design-org cadence, not a PM-org cadence. This is a real finding, not a coverage gap.
- **Surprise: validated instruments are CANON.** The PHQ-9 / GAD-7 / C-SSRS instruments are treated as inputs the design doesn't get to redesign — they're psychometric assets owned by the field, and the UX work is composing them without harming their properties. This is a very different relationship between design and clinical than I would have expected from a design-led company; design respects clinical canon explicitly.
- **Surprise: AI safety has 100% message monitoring + clinician review.** I expected a sample-based or threshold-based review. Headspace's stated policy is 100% messages monitored by the Safety Risk Identification model; flagged messages reviewed by licensed clinicians. This is a meaningfully stronger gate than industry-typical AI safety practice.
- **Tension: brand voice stayed playful while adding clinical scope.** The pre-merger Headspace brand was famously playful (cheeky tone, illustrative, British meditation accent). Post-merger Headspace Health adds psychiatry + therapy + crisis routing. The tension was resolved via the **four personality principles** + the **"never speak to members as anything other than people"** rule. The brand voice DID NOT bifurcate into "clinical voice for clinical surfaces, playful voice for content surfaces" — that's the structurally interesting move. Worth special attention for Cena (the "Haven design canon stays calm/restrained, the brand serves clinical content without sounding clinical" parallel).
- **Tension: design-led culture vs. clinical-accountability rigor.** Headspace's design-org culture is described as "humble, no ego" + ritual-heavy + culture-rituals (silly meetings, sandbox, warm-up). The clinical-org culture is rigor-heavy + audit-heavy + RCT-heavy. These coexist because they're held in **parallel-track org structure** that meets at outcomes, not because they were homogenized. Cena should not flatten this — keep the design-org culture warm + the clinical-rigor explicit; meet them at the outcome layer.
- **Tension: pre-merger Ginger discourse vs. post-merger Headspace Health discourse.** The richest design-system + design-culture material is post-merger (Sczepanik, Thompson, Marawar). The richest clinical-care-delivery material is post-merger too (Glover, the stratified-care-model marketing). The Karan Singh / three-Cs framing is the bridge that holds the org-level decisions; the Sara Koay-era Ginger case study is interesting for context but is from 2016 and does not describe current process. Cena should weight post-merger material; pre-merger material is for the "where did this come from" narrative only.
- **Coverage gap: I expected more written engineering-process material.** Stripe and Linear have heavily-written engineering blogs that disclose PRDs and RFCs in template form. Headspace's engineering blog covers ML/MLOps, mobile testing, security, and experimentation, but not architecture-doc templates. This is a real gap for the pipeline-mapping work — the artifact chain in Block A is *inferred* from observed practice + named gates, not from direct artifact disclosure.
