---
slot: 1
slot-name: brief
primary-author: Product Strategist
project: cena-uconn-patient-app
created: 2026-05-24
status: in-review  # drafted under proceed-and-document; Aaron gates in AM
consumes: []
inputs-hash: null
friction: []
pre-flight-authority: aaron
---

# Brief — Cena × UConn Patient App

<!-- Owner: Product Strategist. Slot 1. Entry artifact. Drafted overnight under proceed-and-document;
     scope fences + commander's intent are Aaron's to ratify at the gate. -->

## Problem statement

UConn's HIV Nutrition Support Program enrolls HIV+, food-insecure adults into a 26-week medically-tailored food intervention. These patients must order weekly meals within a budget, complete clinical assessments at set timepoints, log outcomes, schedule with an RDN, and stay oriented to what the program needs from them — through a phone app, many with low tech-literacy and limited English. The patient app is the surface that carries all of this. It must let a vulnerable population accomplish real clinical and logistical jobs **with dignity and without nagging, surveillance, or confusion** — and it must work for Cena to own and run, not just demo well.

## Target users

- **Primary:** UConn pilot participants — HIV+, food-insecure adults; mixed/low tech-literacy; some ESL (English-only v1); sensitive to surveillance/judgment. A patient who may open the app uncertain, on a phone, needing one clear next thing.
- **Secondary:** Cena care coordinators and RDNs *indirectly* — the app feeds their workflows (assessments, outcomes, scheduling) but they have their own surfaces (CC/Provider apps, out of scope here).
- **Not the target:** clinicians as primary users; power users; desktop-first users; anyone who wants a feature-dense dashboard. The app is not a portal; it is a calm, guided patient surface.

## Success criteria

<!-- Observable; each becomes acceptance rows (slot 19). App-level here; per-surface criteria live in per-surface acceptance.md. -->

- [ ] Every patient-facing capability (consent, ordering, budget, check-ins, outcomes, scheduling, notifications, escalation) has a **home in the IA** and a **reachable entry** — no orphan job (slot-7 Layer-1 structural coverage).
- [ ] A cold, unprimed reader given each patient job can say where they'd go or expect to be surfaced, matching the IA's pre-committed answer (slot-7 Layer-2 findability).
- [ ] The **caught-up / nothing-due** state is the designed-for default and reads as calm/affirming, never as empty or as "0 tasks."
- [ ] No surface shows counts, scores, streaks, progress-on-people, or overdue-shaming. The **no-score invariant** holds (computed assessment scores never reach the patient).
- [ ] Clinical copy (assessments, recall, consent) traces to primary source; consent reads plain and unhurried with no dark patterns.
- [ ] "Talk to a person" is reachable from every surface, never agent-gated, visibly human.
- [ ] Copy is plain second-person present-tense at ~5th–6th-grade reading level; mobile-first; meets WCAG 2.2 AA.
- [ ] The formative documentation set (this manifest's Phase 0 + the in-scope surfaces' Phase 1) is complete and internally consistent **before** any code starts.

## Scope fences

### In scope

- The **whole patient app's formative design** — all patient-facing capabilities run through the pipeline into one complete IA + per-surface design specs (Phases 0–1 of the manifest).
- Six surfaces: Home, The Order, Check-ins, My Health, Appointments, Activity — plus the consent/onboarding gate and the cross-cutting "Talk to a person" + budget reconciliation + EN-only-with-ES-slot.
- Eventual build target: **self-contained static HTML** composed from the haven-ui pattern library (the chrome is a referenced DS shell component).

### Out of scope

- **Production framework / runtime** (React vs Angular) — the **T0.1** decision, owned by Andrey + Vanessa. This run declares only the formative + owned-prototype target.
- **Backend / data layer** — financial system, budget rule engine, Athena read/write boundaries — the **T0.2** decision, Andrey's domain. Surfaces are specced against assumed data shapes; contracts (slot 15) deferred.
- CC / Provider / Kitchen surfaces (separate apps).
- Spanish translation (cap-19) — EN-only v1 with the ES slot reserved in the account corner.
- Agent-detected **distress-detection** behavior spec (cap-27 sensitive path) — flagged to Vanessa as the highest-stakes open gap; the app keeps the patient-initiated "Talk to a person" path.

### Deferred (next slice / post-launch)

- The conversational/agentic versions of surfaces that ship deterministic v1 (e.g., chat-driven outcome logging).
- My Health promotion from from-Home door to a full tab (earns it only if usage proves patient-pulled-recurring).
- Appointments read/write richness (waits on the Athena B7 boundary; request-only v1).
- Push-notification category scheme (B3 unresolved; in-app things-to-do is the canonical channel v1).

## Constraints

### Technical

- Self-contained static-HTML bundle: HTML + `assets/haven.css` + font binaries, relative paths, renders under `file://`. **No Preline JS** in the bundle (native `<details>` for disclosure).
- Closed-vocabulary contract: only DS component classes + sanctioned/safelisted utilities; the render gate enforces. Rebuild only via `scripts/handoff-rebuild-bundle.sh` (never CSS-only).
- 3-tab nav canon (Home · Order · Activity); the sibling 5-tab demo nav is drift — do not propagate.
- Build is downstream of the formative set **and** gated on T0.1/T0.2.

### Brand

- Haven design system (`DESIGN.md` + pattern library) is canonical. Cena brand = **restraint**. Typography: Lora (headings) / Source Sans 3 (body/UI) / Source Code Pro (mono). FontAwesome Pro v7 icon canon (local bundle, never CDN/MDI).
- Population-frame voice: warm, plain, second-person, present tense; no jargon, no gamification, no surveillance phrasing, no guilt. Dignity is a brand constraint, not a nicety.

### Regulatory / compliance

- HIPAA-sensitive population; **no PHI in push notifications** (privacy). No-score invariant is structural. IRB consent (cap-12) gates the app and must be dark-pattern-free. Clinical content traces to primary source. WCAG 2.2 AA floor.

### Time

- No hard UI deadline tonight; the program schedule reset (UConn slipped to May 4, 2026; revised Exhibit C pending). Contractual milestones (data-management go-live, intervention start) gate *backend*, not this formative design work.

### Budget

- Solo (Aaron + agents). Cost discipline via model-routing (Opus for judgment/IA, Sonnet for mechanical). The ownership bar (we maintain it without Andrey) is itself a budget constraint on the build target.

## Conditional + optional slot declarations

- `discovery-research` (slot 6): **skip** — the population, the 13 caps, jobs/pains/behaviors are already discovered and documented (capability matrix, IA derivation, home-surface design). Recorded, not silently omitted.
- `visual-direction` (slot 12): **conditional** — fires only where the DS lacks coverage for a needed pattern (e.g., the budget meter, the things-to-do focus card if not already a PL component).
- `prototype-novel-interactions` (slot 18): **conditional** — likely for the Order pre-fill-and-approve basket and the Check-ins conversational runner.
- `data-contracts` (slot 15): **deferred** — full-stack; waits on T0.2 (Andrey).
- `performance-audit` (slot 28): **required at build** — patient-facing/client-facing.
- `responsive-cross-browser` (slot 29): **required at build** — mobile-first with desktop reflow.
- `human-exploratory` (slot 30): **required + non-waivable** — client-facing/regulated; the human cold render-and-look is the last line of defense.

## Open questions

- T0.1 (stack/ownership) and T0.2 (data layer) — genuinely open with Andrey/Vanessa, or settled in a way not captured? (Carried from `patient-app-readiness.md`.)
- The one IA assumption to validate with pilot users: do patients open the app to order, or wait to be pushed? (Doesn't block formative work; tells us if the IA rationale needs rewriting.)
- Distress-detection agent-behavior spec — → Vanessa.

## References

- Capability matrix (canonical cap source): `Knowledge/Projects/Cena Health/Partners/UCONN Health/Capability matrix.md` + `capabilities/`
- Build readiness + gating: `~/.claude/plans/patient-app-readiness.md`
- Validated IA priors (ratify at slot 7): `~/.claude/plans/patient-app-ia-v1.md`, `ui-workflow-ia-synthesis/trigger-entry-point-map.md`, `surface-primary-shell-model.md`
- Home design (Home surface S.* inputs): `~/.claude/plans/patient-app-home-surface.md`
- Product-rule gate priors (slot 0.8): `~/.claude/plans/ui-workflow-patient-gate-audit.md`, `ui-workflow-meal-ordering-gate-map.md`
- Flow docs (slot 9, ratify/recompose): `…/capabilities/development/flows/flow-*.md`
- Build-target rationale: `[[feedback_ownership_bar_over_language]]`
