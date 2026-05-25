# AD-08-revisit — How the UI pipeline should deliver to production

> **Type:** Architecture Decision Record (revisit of [AD-08](../../decisions.md#ad-08-react-19--vite-as-frontend-framework), Decided 2026-04-18)
> **Author:** Frontend Architecture expert (independent analysis)
> **Created:** 2026-05-25
> **Status:** Proposal — for Aaron's review; T0.1/T0.2 questions route to Andrey + Vanessa
> **Decision axis (load-bearing):** the **ownership bar** — the build target is chosen on whether the team owns and maintains it without depending on Andrey's throughput, NOT on language merits (`feedback_ownership_bar_over_language.md`).

---

## Context — why now

- AD-08 (2026-04-18) chose React 19 + Vite and locked it with a stated scope change: *"haven-ui now owns the full frontend; no more HTML-to-Angular translation step."* That sentence is the justification the whole decision rests on.
- **The live contradiction:** today we ship **static HTML to Andrey, who hand-ports it into Angular.** That is exactly the handoff AD-08 swore we had stopped. Evidence:
  - `handoff/cena-uconn/README.md` (2026-05-14) — "self-contained HTML composites … designed for hand-port into Cena's Angular codebase by Andrey."
  - `Patient App Delivery Model.md` (2026-05-24) — "the delivery artifact is HTML/CSS + tightly-scoped runner JS … bundled self-contained for Andrey to **port to Angular**."
  - `~/.claude/plans/patient-app-readiness.md` T0.1 — "Cena production = Angular, doesn't consume haven-ui; handoff retired; Andrey already builds meal ordering (cap-17) in Angular outside the chat shell."
- So AD-08's premise lapsed within ~4 weeks of being locked. The decision was made by 3 internal experts; **Andrey ("CTO courtesy review, not blocking") never signed off** — and Andrey is the one who actually ships production.
- The pipeline now reliably emits HTML composites from the real design system. The open question is no longer "can we build a frontend" — it's **what artifact the pipeline should hand to production**, given that the team does not own production and Andrey's throughput is the binding constraint.
- This revisit ranks three delivery paths and recommends one under the ownership bar. It does **not** re-open the React-vs-Vue-vs-Angular *language* debate; AD-08's language analysis is largely moot once the premise (we own the frontend) is removed.

### A correction to how AD-08 framed itself

- AD-08's decision axes were **"AI code-gen quality"** and **"a11y primitive depth."** Both axes evaluate *authoring apps in a framework via free-form AI generation* (`stack-recommendations.md` lines 39–51: "When agents are writing the bulk of your UI…").
- That is **not how haven-ui works.** haven-ui is pattern-library-first: the PL HTML + `components.css` is the spec, and ports are **1:1 mechanical transliterations** via `ui-react-porter` (`ui-react-porter.md` — "purely deterministic … never invents HTML structure, class names, or props"). Free-form generation is explicitly forbidden ("copy, don't generate," `haven-ui/CLAUDE.md`).
- Therefore AD-08's two dominant axes were measuring the wrong activity for this pipeline. This matters most for Path C below.

---

## Options

All three are steelmanned. Path C is argued *against* as hard as it is argued *for*.

### Path A — HTML handoff (status quo)

Pipeline emits self-contained static HTML composites (+ vanilla-JS behavior primitives like `panel-splitter.js`, `quantity-stepper.js`); Andrey ports them into Angular templates/services by hand.

- **Pros**
  - **Demonstrably owned.** HTML+CSS is the PL's native spec; the team builds, renders, and gates it without anyone's help (`render-check.mjs`, the handoff render gate). This is the only path that clears the ownership bar today with zero new capability claims.
  - **Zero new tooling.** It is what runs now; no porter to build, no second discipline to maintain.
  - **Andrey stays in his stack.** He receives a structural spec, not a foreign-framework codebase. He decides Angular idioms, services, state.
  - **Honest about the boundary.** A composite is explicitly "a content area, not a route" — it never pretends to be the functional app, so it doesn't over-promise on the T0.2 data layer it can't deliver.
- **Cons**
  - **Andrey is the bottleneck, and the work is the most onerous kind.** Hand-porting HTML→Angular is precisely the friction AD-08 named as "slow and produced far-from-optimal results" (`decisions.md` AD-08 scope note). Every UI change spends Andrey's throughput twice: once to read the composite, once to reimplement it.
  - **Translation is where quality dies** (`feedback_handoff_friction`). The composite's a11y wiring, focus management, and behavior contracts can be silently dropped or altered in the manual port; the team can't gate Andrey's Angular output.
  - **Two representations of every surface drift apart** — the HTML composite and Andrey's Angular reimplementation. No mechanical conformance check spans the boundary.

### Path B — React ownership (the current AD-08 decision)

Pipeline builds React apps directly (`packages/ui-react/` + `apps/*/`); the team owns/ships the frontend in React; Andrey adopts React or React runs as a separate surface.

- **Pros**
  - **If true ownership existed, it removes Andrey from the UI critical path entirely** — the team ships frontend end-to-end, no handoff, no translation. This is the path's whole appeal and it is real *if the premise holds*.
  - Best AI-authoring ecosystem and deepest a11y primitives (AD-08's analysis) — but see the framing correction above; these axes are largely inert for a mechanical-port pipeline.
  - The React port already exists (75 of 196 PL components ported) — sunk tooling.
- **Cons**
  - **The premise is false.** AD-08 justified React by "we own the full frontend." We don't — production is Angular, Andrey-owned, and doesn't consume haven-ui. Remove that premise and React's central advantage evaporates.
  - **Fails the ownership bar as an unproven claim.** Shipping React to production means the team must "build, launch, support, extend, and integrate to Andrey's backend on his terms" — a capability we have **not demonstrated** (`Patient App Delivery Model.md`; `feedback_ownership_bar_over_language.md`). Until proven, React is "handing Andrey a fire to finish in a language he doesn't use."
  - **Maximum demand on Andrey, or a fork.** Either Andrey learns React under time pressure (he's "time-pressed and overwhelmed"), or Cena runs two production frontends (his Angular + the team's React) — operational overhead a 3-person team cannot carry.
  - **Andrey never signed off.** A production-stack decision the CTO didn't agree to is not a decision; it's a draft.
  - **The React port is only ~38% of the spec** (75/196 components). It is prototype tooling, not a frontend ready to own production.

### Path C — Angular mechanical emit

The pipeline emits **Angular components** via a mechanical 1:1 port from the locked PL spec — the same transliteration discipline `ui-react-porter` applies for React — so the team ships functional Angular updates that drop into Andrey's stack instead of HTML he reimplements.

- **Pros**
  - **It is the only path that reduces Andrey's throughput demand while staying in his stack.** He receives Angular components that compile into his codebase, not HTML to re-type. The team absorbs the port work the pipeline is already good at (mechanical transliteration).
  - **Dodges both of AD-08's anti-Angular objections — see the dedicated analysis below.** A mechanical port from a locked spec is not free-form generation (objection (a) doesn't bind), and the a11y primitives already ship as framework-agnostic vanilla JS (objection (b) is largely answered).
  - **Plays to the pipeline's actual strength.** `ui-react-porter` proves the team can run a deterministic spec→component transliteration; a `ui-angular-porter` is a mirror of an existing, working discipline, not a new capability.
  - **The vanilla-JS behavior primitives are the bridge.** ~29 primitive modules (`assess-slider.js`, `cart-panel.js`, `panel-splitter.js`, `quantity-stepper.js`, …) already ship framework-agnostic behavior with documented event/API contracts. An Angular port wraps these as-is (or thin-wraps the contract) rather than reinventing focus management and bounds logic.
- **Cons (argued honestly)**
  - **It does not solve the real blocker.** "Functional app updates instead of HTML" requires the data/integration layer (services, state, Athena wiring) = **T0.2, unbuilt and Andrey-owned.** A mechanical port emits *presentation + behavior*, not Andrey's service layer. See "Presentational vs functional gap" — the word "functional" in the path's promise is mostly aspirational without T0.2.
  - **Two ports to maintain** (Angular + the existing React port) unless React is sunset. See "Maintenance cost."
  - **Angular wrapping of vanilla-JS primitives has real friction.** Angular's change-detection, lifecycle hooks, and `@ViewChild` element access don't map as cleanly to "IIFE that runs on script load and queries `[data-*]`" as React's `useEffect` does. The port discipline has to define how a primitive's `el._{primitiveName}` programmatic API binds to an Angular component — not hard, but not free.
  - **Andrey may not want generated Angular dropped into his codebase.** Even mechanically-correct Angular components carry opinions (module structure, standalone vs NgModule, signal vs RxJS state) that are *his* to set. Path C trades "Andrey re-types HTML" for "Andrey reviews/reconciles generated Angular" — which could be net-neutral or worse if the generated idioms fight his conventions. **This is the single biggest risk and only Andrey can resolve it.**
  - **No Angular porter exists yet** — confirmed: `.project-docs/agent-workflow/skills/` has `ui-react-porter` but no Angular equivalent. Path C is a build, not a switch-flip.

---

## The five things this analysis must address

### 1. The lapsed premise

- AD-08 = "React because we own the full frontend." **We never owned it; we ship HTML to Andrey today.**
- **Path A** stands cleanly without the premise — it never assumed ownership; it assumes handoff, which is the reality.
- **Path B** *is* the premise; remove it and B has no remaining justification beyond ecosystem axes that don't apply to a mechanical-port pipeline. B is the weakest of the three once the premise is gone.
- **Path C** also stands without the premise — it assumes Andrey owns production (true) and meets him there, in Angular, with less manual work than A.

### 2. Does Path C dodge AD-08's anti-Angular reasons?

AD-08 rejected Angular on (a) AI codegen quality and (b) a11y primitive depth. Tested honestly:

- **(a) AI codegen quality — does NOT bind under Path C.** AD-08's objection was that "verbose patterns confuse AI" during *free-form generation*. Path C does no free-form generation. It mechanically transliterates a locked PL spec — the exact deterministic discipline `ui-react-porter` enforces ("never invents structure, class names, or props"). Angular's verbosity is a *generation* problem; transliteration from a fixed spec is a *mapping* problem, and the spec already fixed every class name and structure. **Objection (a) is largely neutralized.**
  - *Residual bind:* Angular's component boilerplate (decorators, template/style separation, change-detection) is more surface to map mechanically than React's function-component. More mapping rules to author in the porter; not a quality risk, a porter-complexity cost.
- **(b) a11y primitive depth — mostly answered, with a caveat.** AD-08 wanted React Aria's headless primitives. But haven-ui does **not** consume React Aria — its a11y/behavior lives in the **framework-agnostic vanilla-JS primitives** (~29 modules) and in the PL HTML's semantic structure (the `ui-react-porter` pre-port a11y audit gates roles, `aria-*`, focus, hit targets at the *HTML* layer). Those primitives bind to any consumer. **So the a11y depth AD-08 wanted is in the PL/vanilla-JS layer, not in React — and travels to Angular unchanged.**
  - *Residual bind:* the React port currently relies on React's render model to wire some interactions (e.g., `aria-current` toggling via the `active` prop). The Angular port must re-express those bindings in Angular idioms. The *contracts* are framework-agnostic; the *wiring* is per-framework. This is real work but it is mechanical, spec-driven work — the porter's job.

**Verdict on the two objections:** neither binds the way AD-08 assumed, because AD-08 evaluated free-form generation and React-Aria-based a11y, and haven-ui does neither. The objections were aimed at a pipeline we don't run.

### 3. Presentational vs functional gap (quantified)

- "Functional app updates instead of HTML" implies the **data/integration layer**: services, state management, Athena read/write, the cap-18 "generalized financial system" (budget rule, spend tracking, order records). That is **T0.2 — unbuilt and Andrey-owned** (`patient-app-readiness.md`).
- A mechanical port (any framework) emits **presentation + behavior contracts only.** It cannot emit Andrey's service layer because the service layer's contract doesn't exist yet.
- **How much of "functional" each path delivers without T0.2:**
  - Structure / layout / copy / semantic CSS — **~100%** (all three paths; this is the PL spec).
  - Client-side behavior (validation, stepper bounds, panel resize, focus, cart math on dummy data) — **~80–90%** via the vanilla-JS primitives + their documented contracts (all three paths can carry these; A as `<script>` includes, B/C as framework wrappers).
  - Data binding to real services, persistence, Athena, budget enforcement — **0%** for all three paths until T0.2 exists. **No emit strategy closes this; only Andrey's data layer does.**
- **Implication:** Path C's headline promise ("functional, not HTML") is **overstated by exactly the T0.2 gap.** What Path C actually delivers over Path A is: Andrey gets *Angular components with behavior wired in his idioms* instead of *HTML he transliterates* — a real reduction in his manual work, but **both still stop at the same data-layer boundary.** The honest framing of Path C is "mechanical presentation+behavior port into Andrey's stack," not "functional app."
- **The contract needed to go further:** a written **service/data interface contract** (T0.2) that the porter targets — e.g., "this component emits a `cart-change` event with `{itemId, qty}`; the host Angular service implements `OrderService.updateCart()`." The porter can emit the component bound to a *named, typed contract*; Andrey implements the contract. That contract is T0.2's deliverable and is the precondition for any path to claim "functional."

### 4. Maintenance cost — does the React port become vestigial?

- Today: React port = **75 of 196 PL components (~38%)**, plus `apps/care-coordinator` and `apps/patient` prototypes. It is the team's local proving/demo surface.
- **If Path C ships and Cena production stays Angular:** the React port has **no production consumer.** Its remaining honest jobs are (i) a fast local prototyping/demo surface (the Dieckhaus demo ran on it), (ii) a second conformance target for `conform:visual`. Neither requires keeping it *current* with the spec.
- **The two-ports trap is real but avoidable:** maintaining React + Angular ports both at parity with 196 PL components is overhead a 3-person team should not pay. **Resolution: designate one port as the production target (Angular under Path C) and let the other decay to "demo-only, not spec-current."** Don't gate "built" on React-port presence (this is exactly the `feedback_no_haven_ui_react_conflation` drift — React port silently becoming canonical). PL-HTML presence remains the spec-level "exists."
- **Maintenance math for the AI-assisted team:** the porters are *mechanical and cheap to run* — porting cost is near-zero marginal once the porter exists; the real cost is **human review of generated output + keeping the porter's mapping rules current as the PL evolves.** One production-current port (Angular) + one decayed demo port (React) is sustainable. Two production-current ports is not.

### 5. Andrey acceptance / org reality

- AD-08 was 3 internal experts; **Andrey never signed off** and is "time-pressed and overwhelmed" but wants to stay open.
- **Throughput demand, lowest to highest:**
  - **Path C (lowest)** — if generated Angular drops cleanly into his stack, his per-change cost falls from "read HTML + reimplement in Angular" to "review generated Angular + wire services." *Conditional on his accepting generated Angular.*
  - **Path A (medium)** — he keeps full control but pays the full manual-port cost on every change. Sustainable but slow; he stays the bottleneck.
  - **Path B (highest)** — he either learns React under pressure or owns a second production frontend. Maximum demand; least aligned with his constraints.
- **The org reality:** the production-stack call is **not the team's to make** — it's T0.1, Andrey + Vanessa. The team's leverage is to *meet Andrey where he is* (Angular) and reduce his load, then let him decide whether generated Angular helps or hinders. Path C is the only path that proposes meeting him in his stack with less work; A meets him in his stack with the same work; B asks him to leave his stack.

### 6. Build the PL→Angular porter — the actual work

If Path C is viable, the work is a mirror of `ui-react-porter`:

- **Preference-driven by design (load-bearing).** The porter takes its idiom choices as **parameters read from [`angular-emit-preferences.md`](./angular-emit-preferences.md)** (the effort SoT), NOT hardcoded. This is deliberate: we are making many assumptions about how Andrey wants generated code, we *will* get some wrong, and correcting them must be a one-line edit to the preferences ledger — not a mechanism rebuild. Each preference row pre-computes its correction cost (`config` / `porter-rule` / `structural`); keep assumptions out of the mechanism so "he prefers B" stays a `config` edit. The SoT also doubles as the decision queue for the Andrey conversation.
- **A `ui-angular-porter` skill** — deterministic, spec-driven, fails loudly on judgment. Same preconditions (PL HTML exists, classes in `components.css`, COMPONENT-INDEX row, pre-port a11y audit).
- **The spec→component mapping** (Angular-specific):
  - `class="..."` → `[class]` / `class="..."` (Angular keeps `class`); `for=` → `for=` (Angular label binding).
  - Inline handlers → `(click)` / `@Output()` event emitters mirroring the vanilla primitive's `CustomEvent` names.
  - Content slots → `<ng-content>` (vs React `children`); named slots → `<ng-content select="...">`.
  - Variant props → `@Input() variant` composing the modifier class mechanically (`badge badge-{{variant}}`).
  - `.active` state → `@Input() active` toggling the class + `[attr.aria-current]` — the Angular expression of `ui-react-porter`'s active-state rule.
- **Angular-specific a11y wiring:** the PL HTML and vanilla-JS primitives own the a11y *contract*; the porter wires it to Angular's lifecycle — `aria-live` debounce stays in the vanilla module; the component exposes the primitive's element API via `@ViewChild` + `ngAfterViewInit`.
- **How vanilla-JS primitives bind in Angular** (the load-bearing detail): two options —
  - **(a) Import the vanilla module unchanged** and let it self-init on `[data-{name}]` in the rendered template; the Angular component reads/writes via the primitive's `el._{name}` API and listens to its bubbling `CustomEvent`s. Zero rewrite; honors "import the file unchanged" from the haven-ui vanilla-JS convention.
  - **(b) Thin-wrap the contract** in an Angular service/directive when (a) fights change detection. Port the *contract* (events + API), not the logic.
  - Decide per-primitive; default to (a) — it's the cheapest and matches the convention's intent.
- **What the porter does NOT emit:** Angular services, state stores, Athena wiring, routing — all T0.2/Andrey. The porter emits standalone presentational+behavioral components bound to *named contracts* Andrey implements.

---

## Decision

**Recommended ranking under the ownership bar: A is the safe floor now; C is the target to earn; B is deprioritized.**

1. **Hold Path A as the live delivery model** (it already clears the ownership bar and ships today) **while** running a thin proving slice of **Path C**.
2. **If the Path C proving slice clears its gates AND Andrey accepts generated Angular, promote Path C to the delivery model** — it dominates A on Andrey throughput while staying in his stack, and it neutralizes AD-08's anti-Angular objections (which were aimed at free-form generation + React-Aria a11y, neither of which this pipeline uses).
3. **Deprioritize Path B.** Its sole justification (we own the full frontend) lapsed; it fails the ownership bar as an unproven capability and makes the heaviest demand on Andrey. Keep the React port as a **demo-only, not-spec-current** local surface; do not invest in bringing it to production parity.

- **Why not just stay on A?** A keeps Andrey as the permanent bottleneck on the most onerous work, which is the exact friction AD-08 tried to kill. C is the path that actually attacks that friction without asking Andrey to leave Angular.
- **Why not commit to C now?** Two unknowns gate it: (i) does generated Angular drop into Andrey's stack cleanly enough to *reduce* his work rather than shift it (only he can answer), and (ii) the T0.2 data layer doesn't exist, so "functional" is capped regardless. A proving slice de-risks (i); (ii) is Andrey's to build under any path.
- **Link to principle:** the ownership bar (`feedback_ownership_bar_over_language.md`) drives this — A and C both keep the team building in stacks it owns/runs (HTML, or mechanical Angular emit) and keep Andrey in his stack; B asks the team to own a production capability it hasn't demonstrated.

---

## Consequences

- **What changes:**
  - Path A continues as the shipping artifact in the near term — no disruption to the UConn handoff.
  - A new `ui-angular-porter` skill gets prototyped (mirror of `ui-react-porter`) against one already-verified PL component.
  - The React port is explicitly reclassified as **demo/prototype-only, not a production target and not spec-current.** Status taxonomy stays PL-HTML-based (resists the React-as-canonical drift).
  - A T0.2 **service/data interface contract** becomes the named precondition for any path to claim "functional" — surfaced to Andrey as the real blocker.
- **Trade-offs accepted:**
  - Short-term we keep paying Path A's manual-port cost while C is unproven — accepted, because A is the only path that clears the ownership bar with zero new claims.
  - Building a second porter is real effort — accepted, because it's a mechanical mirror of a working skill and the payoff (removing Andrey's reimplementation tax) is large.
  - We risk the proving slice showing generated Angular fights Andrey's conventions — accepted; that's *why* it's a slice, not a commitment.
- **Non-consequence:** this does not reverse AD-08 as a *language* claim, and it does not settle T0.1. It re-scopes the *delivery* question and hands the production-stack call back to Andrey + Vanessa where it belongs.

---

## Assumptions / falsifiers

- **Assumption:** Cena production stays Angular, Andrey-owned, for the pilot horizon. *Falsifier:* Andrey commits to adopting React and owning it — then Path B's premise returns and B re-ranks up.
- **Assumption:** generated Angular components can drop into Andrey's codebase with net-lower effort than reimplementing HTML. *Falsifier:* the proving slice shows generated Angular needs as much or more reconciliation than a manual port (idiom mismatch, module structure fights) → Path C collapses back to Path A.
- **Assumption:** the vanilla-JS primitives bind in Angular via import-unchanged or thin-wrap without rewriting their logic. *Falsifier:* a primitive's IIFE/`[data-*]` self-init fundamentally fights Angular change detection and needs a full rewrite → raises Path C's cost, may still be worth it but changes the math.
- **Assumption:** "functional" is gated by T0.2 equally for all paths. *Falsifier:* Andrey exposes a stable data/service contract sooner than expected → "functional" becomes reachable and the A-vs-C gap widens in C's favor (Angular components bind to his contract directly; HTML composites still need re-typing).
- **Assumption:** maintaining one production-current port + one decayed demo port is sustainable for a 3-person team. *Falsifier:* the React port keeps getting pulled to spec-parity by demos → the two-ports cost materializes and React should be sunset outright.

---

## Thin proving slice (smallest experiment before committing)

- **Andrey's idioms are extracted → [`andrey-angular-idioms.md`](./andrey-angular-idioms.md)** (from `cena-health-spark` devel @ 2026-05-19). Headline: Angular 19 zoneless + standalone + signal `input()`/`output()` + `@if`/`@for`, and **his hand-written class vocabulary already overlaps the PL dialect** (`badge badge-primary badge-pill`, `meal-card-*`) — so the port maps classes near-verbatim and emits *his-looking* code. The port targets those idioms; the doc carries the deterministic PL→Angular mapping table. (Re-verify against his latest before the Andrey-facing demo — solo dev, infrequent pushes.)
- **Pick one already-verified PL component that has a React port and a vanilla-JS behavior primitive** — e.g., the quantity-stepper (`quantity-stepper.js` + its PL HTML + `QuantityStepper.tsx`). It has real behavior (bounds, disabled-state, a11y announce) so it tests the hard parts, not just static markup.
- **Hand-port it to Angular mechanically, in Andrey's extracted idioms** (no porter skill yet — do it by hand to discover the mapping rules), binding the existing `quantity-stepper.js` via import-unchanged (option (a) above).
- **Measure the gap to "functional":**
  - Does the vanilla primitive self-init and emit its `CustomEvent`s inside an Angular component without modification?
  - How much Angular-specific wiring (lifecycle, `@ViewChild`, `@Output`) does the behavior contract require?
  - What's the line count + judgment-call count vs the equivalent React port? (Judgment calls > 0 means the port wasn't truly mechanical — a red flag for porter-ability.)
- **Then put it in front of Andrey:** would *this* dropped into his codebase save him work vs receiving the HTML composite? His answer is the gate.
- **Decision rule:** if the hand-port is mechanical (0 judgment calls), the vanilla primitive binds unchanged, and Andrey says it reduces his work → build `ui-angular-porter` and promote Path C. Any of those three failing → stay on Path A and revisit.

### Result — slice run 2026-05-25 → [`../../proving-slices/angular-emit/RESULTS.md`](../../proving-slices/angular-emit/RESULTS.md)

- **Split result.** Markup/class port is **mechanical (0 judgment calls)** — class vocabulary is verbatim, only bindings change, and the output looks like Andrey's code (signal I/O, standalone, `linkedSignal`/`computed`, `app-` selector). **But the behavior port is not mechanical**, which **corrects this ADR's optimism in §C-pros and §6**: the vanilla-JS primitives are **not** a free "import-unchanged" bridge for a framework target.
- **Why:** `quantity-stepper.js` is a self-running IIFE that queries + mutates the DOM at *script load* — it never sees Angular's later-rendered component, and direct DOM mutation fights zoneless change detection. The **contract** (events/bounds/debounced a11y/programmatic set) ports; the **implementation** must re-express in signals. **§6's default flips from option-a (import unchanged) to option-b (re-express the contract) for Angular/React.**
- **Prerequisite this surfaces:** before building `ui-angular-porter`, refactor the ~29 vanilla primitives from self-running IIFEs to **export a pure contract + `init(el, opts)`**. That makes them genuinely framework-bindable (helps the React port too) and drives each behavioral port's judgment calls toward zero. The markup-only majority of components ports mechanically today regardless.
- **Runtime-verified ✅ 2026-05-25.** Built + ran in a standalone Angular 19.2 zoneless sandbox (spark untouched): compiles, zoneless confirmed, `output()` emits correct detail, bounds auto-disable both directions, reactivity holds without Zone.js. Evidence: `proving-slices/angular-emit/screenshot-*.png`. The re-expressed-as-signals behavior runs faithfully — this is the showable artifact for Andrey. Surfaced a version-delta (his Angular is newer than 19.2; stable vs experimental zoneless API) → SoT row #16.
- **Still open:** the Andrey demo/conversation + confirming his *stateful*-component idioms (SoT #10–12, still `assumed`).

---

## Open questions for Andrey + Vanessa (T0.1 / T0.2 — only they can answer)

- **T0.1 (Andrey + Vanessa):** Is Cena production one codebase or two? Does Angular remain the production frontend for the pilot horizon? Is the team expected to ever own production frontend, or is Andrey the permanent production owner?
- **T0.1 (Andrey specifically):** Would mechanically-generated Angular components dropped into your codebase *reduce* your work vs receiving HTML composites — or do generated idioms (module structure, standalone vs NgModule, signals vs RxJS) fight your conventions enough that you'd rather get HTML and write the Angular yourself? **This single answer decides Path C vs Path A.**
- **T0.2 (Andrey):** What is the data/service layer contract? Until a named, typed interface exists (e.g., `OrderService.updateCart()`, budget-rule enforcement, Athena read/write boundaries), no emit path can deliver "functional" — all three stop at presentation + client behavior. What contract can the porter target?
- **T0.2 (Andrey):** For the cap-18 "generalized financial system" (budget rule, spend tracking, order records) — does a spec exist the pipeline can bind components against, or is that itself unbuilt?
- **Org (Vanessa):** Given Andrey is time-pressed, is the priority to minimize his throughput demand (favors C if it works, A if not) — or to preserve maximum optionality on production stack (favors holding A and not investing in a second porter yet)?

---

## Cross-references

| Reference | Doc |
|---|---|
| Original AD-08 / AD-09 / AD-10 | [`../../decisions.md`](../../decisions.md) (AD-08 Decided 2026-04-18) |
| AD-08 full analysis (axes: codegen, a11y) | [`./stack-recommendations.md`](./stack-recommendations.md) |
| Mechanical-port discipline (React) | `.project-docs/agent-workflow/skills/ui-react-porter.md` |
| Framework-agnostic behavior convention | `haven-ui/CLAUDE.md` → "Vanilla JS per primitive" |
| HTML-handoff model in use today | `handoff/cena-uconn/README.md` (2026-05-14) |
| Delivery model + ownership bar | `Knowledge/Projects/Cena Health/Apps/Patients/Patient App Delivery Model.md` (2026-05-24) |
| T0.1 / T0.2 gates + readiness | `~/.claude/plans/patient-app-readiness.md` |
| Surface-primary patient app | `project_cena_patient_surface_primary` (memory) |
| Ownership-bar principle | `feedback_ownership_bar_over_language` (memory) |
| React-port-as-canonical drift | `feedback_no_haven_ui_react_conflation` (memory); `haven-ui/CLAUDE.md` "Watch for these drifts" |
