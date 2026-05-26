---
slot: 17
slot-name: component-plan
variant: angular-reuse
primary-author: Frontend Architecture expert
project: cena-uconn-patient-app
created: 2026-05-25
status: in-review
consumes:
  - framework-binding-angular.md
  - ds-binding.md
references:
  - planning/team/proposals/angular-emit-preferences.md
  - planning/team/proposals/AD-08-revisit-pipeline-framework-emit.md
source-baseline-his: cena-health-spark patients/ @ b205df2 (2026-05-19)
source-baseline-html: haven-ui/handoff/cena-uconn/ (current)
inputs-hash: null
friction: []
pre-flight-authority: aaron
---

# Component Plan — Angular Emit, New-vs-Reuse (Cena × UConn Patient App)

> **What this is:** a new-vs-reuse mapping of the **verified HTML app** (`handoff/cena-uconn/`) against **Andrey's real Angular build** (`cena-health-spark/patients/` @ b205df2). For each surface it buckets the work the Angular-emit reconciliation would actually require. It is the slot-17 component-plan for the Angular-emit variant; the static-HTML variant's component set lives in [`ds-binding.md`](../ds-binding.md).
> **This is a model to break, not a verdict.** Every row is grounded in a named file. It is measured against his **pushed** code at b205df2 — he pushes infrequently (solo), so his working tree may already differ. A fresh-context reviewer + skeptic check this after; **low-confidence rows are flagged inline** for them to challenge.

> **Reading note (2026-05-25 fold — read before the buckets).** Three corrections from the skeptic + Aaron run, so the bucket labels don't mislead:
> 1. **REBUILD on a surface he already has = a pilot-scope *proposal*, NOT a decision.** "Supersedes" below means "the pilot IA proposes a richer model"; whether it wins over his working surface is **Aaron + Vanessa + Andrey's call**, not settled here. Read every existing-surface REBUILD as "candidate, his to weigh," especially where the row is M-confidence or asks "is this over-scoped."
> 2. **The cart is OURS, with rationale — not a smuggled change.** It was designed in [`flow-meal-ordering.md`](../../../../../Knowledge/Projects/Cena%20Health/Partners/UCONN%20Health/capabilities/development/flows/flow-meal-ordering.md) (reviewed 2026-05-07, decisions logged), incl. a Step-6 submit/confirm beat. His build already has the same *shape* (draft order + `ConfirmMeals`). Aaron is conceptually fine with an order/cart object (term flexible). The one open detail — **persist-timing of qty edits** — routes through the team's use-case process via the **product-rule gate audit** (slot-19 sub-check). See the Order deep-dive + Dispositions.
> 3. **Version: Angular 21.2.13** (read from `patients/package.json` 2026-05-25), not the earlier-inferred "20+". The porter pins to his version's APIs.
> Full objection→disposition trail: **§Fold — dispositions** at the end.

## Buckets + columns

- **REUSE** — his existing code carries with little/no change.
- **REBUILD** — he has something in this domain, but the new interaction model supersedes it; the row names what is **salvageable** vs **discarded**.
- **NET-NEW** — he has nothing; emit fresh from the PL spec.
- **DS-vs-app ownership** — `DS` = the emitted unit is a haven-ui PL component the porter targets; `app` = composition/orchestration that lives in his app code (porter emits the template shell, host wires data); `his` = his existing code the porter must not touch (data layer, guards, services).
- **Confidence (H/M/L)** — how sure the bucket is, given the survey + spot-reads.

## The four boundaries that frame every row

1. **Data layer is his and stays (REUSE-as-contract).** Firebase Data Connect (`app.config.ts`), `DataConnectService`, and `PatientDataService` (the orchestration layer — caching, ISO-week resolution, the verb surface `createOrderItem`/`updateOrderItemQuantity`/`deleteOrderItem`/`confirmMeals`/`sendMessage`/`submitFeedback`/…) are **never emitted.** Emitted UI binds to this contract via `input()`/`output()`; the host page wires it to the service exactly as `meals.component.ts` does today. This is the T0.2 boundary — **already built on his side**, unlike the generic Angular-emit case. (framework-binding-angular §data layer; preferences ledger row #13.)
2. **Guards + auth are his and stay (REUSE).** Four functional guards in `patients/src/app/guards/`; the porter slots emitted routes into his guard arrays, never emits a guard.
3. **i18n binds to his signal service.** Emitted bilingual strings call his `i18n.t(en, es)` (`services/i18n.service.ts`), not the HTML `i18n.js`. `porter-rule`, not structural.
4. **IA/shell is the single biggest item** — its own section below.

---

## Surface-by-surface map

| Surface | Bucket | His artifact (b205df2) | HTML-app target | Salvageable vs discarded | Ownership | Conf |
|---|---|---|---|---|---|---|
| **IA / shell** | **REBUILD** | `mobile-shell.component` (i18n-bar + `<router-outlet>` + bottom-nav), `components/bottom-nav` (**6 tabs**: dashboard/meals/delivery/messages/feedback/profile), `components/i18n-bar` | `layout-app-shell-responsive` (desktop sidebar ≥lg + **3-tab** bottom-nav <lg) + `layout-mobile-bottom-nav` (Home·Order·Activity) | **Salvage:** the shell-as-layout-route topology (`app.routes.ts` `path:''`→shell→child outlet), the i18n-bar component wholesale, the bottom-nav *component pattern* (RouterLink/RouterLinkActive + i18n), guard wiring. **Discard:** the 6-tab set + tab→route map; no desktop sidebar exists. | app + DS (shell is a referenced DS component per ds-binding) | **H** |
| **Home** | **NET-NEW** | none (his entry is `dashboard`) | `home.{caught-up,one-item,several}.html` (`patient-focus-card` focus-card model) + `home.js` | His `dashboard.component` is a *different surface*, not a Home — see Dashboard row. The focus-card "things-to-do" model has no analog. | DS (`patient-focus-card` is a slot-5 flagged gap) + app | **H** |
| **Dashboard** (his) | **REBUILD → folds into Home/Activity** | `dashboard.component` + 4 children: `meal-confirm-banner`, `delivery-preview`, `meal-chip-scroll`, `message-preview-list` | no 1:1 target; its content disperses into Home focus-cards + Activity | **Salvage:** the child preview components are genuine reusable units — `delivery-preview`, `message-preview-list`, `meal-confirm-banner` can re-home as Home focus-card contents or Activity items; the `loadDashboardData` orchestration is his and REUSE. **Discard:** the dashboard *page shell* + greeting-page composition (Home's focus-card model supersedes it). | app | **M** — depends on how Home's focus-card model absorbs these previews; reviewer should pressure-test the re-home mapping |
| **Order — data + budget math** | **REUSE** | `meals.component.ts` budget/order logic + `PatientDataService` | `cart-panel.js` budget recompute, `data-budget-cap` | **Salvage (REUSE):** `selectedBudget`/`totalBudget`/`totalSelectedMeals` computed signals, `wouldExceedBudget`, `readProgramBudget` (reads `programWeeklyBudget` from provider config), `isOverBudget`, the create→update→delete order-item lifecycle, `applyLocalQuantityChange` optimistic update, `confirmMeals` gate. This is real, tested-against-his-schema budget math. | his (service) + app (component logic) | **H** |
| **Order — UI components** | **REBUILD** | inline per-row qty controls in `meals.component.html` (no stepper component; `changeQuantity(row, ±1)` persists immediately) + `order.component` (summary + confirm) | `quantity-stepper` (debounced, bounds, a11y announce), `cart-panel` (browse→cart pane), `budget-meter`, `delivery-status-timeline` | **Salvage:** none of his *UI* maps 1:1 — he has no stepper component, no cart pane, no budget meter. **Discard:** his inline qty markup + his `order.component` summary view. **Interaction-model divergence (load-bearing):** his model is **persist-on-each-change, no cart** (`changeQuantity` writes to Data Connect immediately); the HTML model is **browse→cart→submit** (`cart-panel.js` accumulates, `confirmMeals`-equivalent on submit). The porter emits the new cart/stepper/meter UI; the **host re-wires it to his existing service verbs** — but the persist-timing change (debounced cart vs immediate) is an app-logic decision Andrey owns, not a porter emit. | DS (stepper/cart-panel/budget-meter are PL) + app | **H** on the bucket; **M** on whether Andrey wants the cart model at all vs keeping persist-on-change — skeptic target |
| **Activity** | **NET-NEW** | none | `activity.list.html` (notifications) | His `message-preview-list` is adjacent (a list of items) but is a messages preview, not a notification feed. | DS + app | **H** |
| **Appointments** | **NET-NEW** | none (ABSENT — confirmed: no appointments route in `app.routes.ts`) | `appointment-card` + states (`empty/pending/upcoming/request`) | nothing | DS + app | **H** |
| **Log-outcome** | **NET-NEW** | none | `log-outcome.{form,confirm}.html`, `log-check-in.html`, `log-outcome.js` (per-card measures) | nothing | DS + app | **H** |
| **Assessments** | **NET-NEW** | none | runner (`entry→preflight→question→[identity]→confirm`), `assessment-runner.js`, instrument pages (HFIAS/WHOQOL/GNKQ/screener) | nothing; the runner state machine is net-new behavior | DS (assessment-* PL) + app (runner port) | **H** |
| **Dietary recall** | **NET-NEW** | none | multi-pass runner (`recall.pass1–4`, `.review`, `.confirm`), `dietary-recall-runner.js`, `patient-recall-list` | nothing | DS + app | **H** |
| **Satisfaction survey** | **NET-NEW** | none (his `care-team/feedback` is meal feedback, a different instrument — see Feedback row) | Likert + `emoji-scale` runner, `satisfaction-runner.js` | his feedback ratings are NOT this; do not conflate | DS + app | **H** |
| **Order-status** | **REBUILD** | `components/delivery-status-card` + `delivery.component` (status + issue form) | `delivery-status-timeline` (`active/confirmed/issue/optimize` states) | **Salvage:** the delivery *data* binding (`getDeliveryStatus`) is his and REUSE; the issue-report form maps to `order-status.issue`. **Discard:** his single `delivery-status-card` (a card, not a timeline) — the timeline state model supersedes it. | DS (timeline is PL) + app | **M** — his card→timeline is a real shape change; reviewer should confirm the timeline isn't over-scoped vs pilot need |
| **Onboarding** | **REBUILD (light)** | `onboarding/{welcome,consent,preferences}` — 3-step, `FormsModule`+`[(ngModel)]`, signal step state, **outside shell** | `onboarding.{welcome,consent,preferences,welcome-to-home}.html` (mobile-shell, EN/ES) | **Salvage:** his 3-step structure, the `[(ngModel)]` form idiom, the consent radio pattern, his route topology (onboarding outside the shell). **Discard/align:** copy + step composition to the PL onboarding spec; add `welcome-to-home` transition state if pilot needs it. Closest-to-REUSE of the REBUILD rows. | app | **M** — bucketed REBUILD not REUSE because copy/states differ; if pilot accepts his current onboarding, this slides toward REUSE — flag |
| **Care-team / messages** | **REUSE (light REBUILD)** | `care-team/messages` (signal thread, `computed` thread items, `message-bubble`, `compose-bar`, `sendMessage`) | `talk/talk-to-person.html` (a "talk to a person" entry, not a full thread UI) | **Salvage:** his whole messages surface — thread model, `message-bubble`, `compose-bar`, `sendMessage` wiring — is more complete than the HTML app's talk entry. **Likely REUSE wholesale**, possibly re-skinned to PL classes. | app + DS (message-bubble/compose-bar candidates for PL) | **M** — HTML app under-specifies messages vs his build; the new IA's "talk to a person" may just link to his existing surface |
| **Care-team / feedback** (his) | **REUSE or retire** | `care-team/feedback` (`FeedbackRatingCard`, `PerMealRating`, `submitFeedback`) | no direct HTML target (satisfaction-survey is a different instrument) | **Salvage:** meal-feedback is his and works against `submitFeedback`; it has no HTML-app supersessor. Keep as REUSE unless the pilot IA drops per-meal feedback. | app | **M** — unclear if the pilot IA keeps meal feedback; not in the 3-tab HTML app surfaces |
| **Profile** | **REUSE** | `profile.component` + `personal-info-card`, `food-preferences-edit`, `delivery-note-edit` (`updatePreferences`/`updateDeliveryNote`) | no dedicated HTML profile surface surveyed | nothing to supersede; his profile carries. | app | **M** — no HTML target to reconcile against; carries by default |
| **Delivery** (his, standalone) | folds into **Order-status** | `delivery.component` + `issue-report-form` | `order-status.*` | see Order-status row — his delivery surface is the thing Order-status REBUILDs. | app | **M** |

---

## Deep dive — Order (the hard surface)

The honest migration splits cleanly along the data/UI line:

- **His data + budget math = REUSE.** `meals.component.ts` carries the budget computeds (`selectedBudget`, `totalBudget` from `programWeeklyBudget`, `wouldExceedBudget`, `isOverBudget`), the order-item create/update/delete lifecycle, optimistic local update, and the confirm gate — all against his real Data Connect schema. `PatientDataService` carries the orchestration. **None of this is emitted.** It is the contract the new UI binds to.
- **His Order UI = REBUILD.** He has no `quantity-stepper` component (qty is inline buttons calling `changeQuantity`), no `cart-panel`, no `budget-meter`. The PL components supersede the inline markup.
- **The genuine divergence is the interaction model, not the components.** His model: **persist-on-each-change** — every `changeQuantity` immediately hits `createOrderItem`/`updateOrderItemQuantity`/`deleteOrderItem` — plus a `confirmMeals` finalize. The HTML model: **browse→accumulate-in-cart→submit** (`cart-panel.js` recomputes locally; submit is the persist point). **Both already share the same conceptual shape: a draft weekly-order object + a confirm/lock step.**
  - **The cart is ours, with rationale — not a mockup artifact.** [`flow-meal-ordering.md`](../../../../../Knowledge/Projects/Cena%20Health/Partners/UCONN%20Health/capabilities/development/flows/flow-meal-ordering.md) (reviewed 2026-05-07, rounds 1+2, decisions logged) deliberately designed `cart-panel` as the working surface, with edit-in-place (Step 5) + a Step-6 submit/confirm that locks the cart. Aaron is conceptually fine with an order/cart *object* (a weekly order needs a representation to list items + confirm); the term is flexible. So this is not a smuggled UX change — it's our prior design meeting his prior build, both of which have a draft-order + confirm.
  - **The one genuinely open detail is persist-timing of quantity edits** (his immediate-write vs whether the cart implies deferred). Our flow supports edit-in-place/live, so the two may even be compatible (live edits to a draft order, submit locks it = his `confirmMeals`). **This routes through the team's use-case process — specifically the product-rule gate audit** (slot-19 sub-check, the mechanism for "which rule governs this decision gate" — here the edit/persist gate). His immediate-persist is a legitimate input, **possibly preferred for low-tech-literacy patients** (no abandonment/unsaved state), not something the porter overrides. The porter emits the cart/stepper/meter UI; the persist-timing rule is decided in the gate audit, not by the emit.

## Deep dive — agent flows (recall / assessments / survey)

- **He has NONE. All NET-NEW.** No assessment, recall, or survey route or component exists in `patients/` (confirmed against `app.routes.ts` + the full component tree).
- The runners (`assessment-runner.js`, `dietary-recall-runner.js`, `satisfaction-runner.js`) are **net-new behavior** — vanilla state machines (`preflight→question→[identity]→confirm`, multi-pass recall, Likert/emoji survey). Per the framework-binding-angular behavior-primitive rule + preferences ledger row #15, the porter **re-expresses the runner contract as Angular signals** (not import the IIFE): the state machine becomes signal state + `computed` transitions, wiring `aria-live` debounce and `aria-invalid` per the runner's documented contract. This is the largest net-new build and the one most exposed to "translation is where quality dies" (AD-08-revisit) — the a11y + flow-advancement logic must survive the port.

---

## Honest summary

Against his pushed code at b205df2, the reuse picture splits along a clean and favorable line: **his data layer carries entirely, and his UI mostly does not.** The Firebase Data Connect stack, `PatientDataService` orchestration, the budget math, the auth guards, and the i18n service are all REUSE-as-contract — the single most valuable thing he has built, and the boundary the Angular-emit path was designed to respect (the T0.2 data layer already exists on his side, which is the material difference from the generic case). His UI is a different story: roughly half of the HTML app's surfaces are **NET-NEW** because he simply has nothing for them (Home focus-cards, Activity, Appointments, Log-outcome, and all three agent flows — assessments, dietary recall, satisfaction survey — which are net-new *behavior*, not just markup). Most of what he *does* have is **REBUILD rather than REUSE**, because the new interaction models supersede his — the 6-tab shell gives way to the 3-tab responsive app-shell (salvaging the shell-route topology, the i18n-bar, and the bottom-nav pattern, discarding the tab set and adding a desktop sidebar he never had); his immediate-persist meal ordering meets a browse→cart→submit model; his delivery card meets a status timeline. A genuine handful is clean **REUSE**: profile, messages (more complete than the HTML app's "talk to a person" entry), the onboarding skeleton, and — crucially — everything below the UI. The headline is not "his build maps cleanly"; it is "his **plumbing** maps cleanly and his **surfaces** mostly get rebuilt to a richer model" — which is the expected shape when a 9-surface 6-tab build meets a 13-surface 3-tab one. This is a model to break, not a verdict: it is measured against pushed code, several rows hinge on pilot-scope decisions only Aaron/Andrey/Vanessa can settle (does the pilot keep meal feedback? what persist-timing for the order? need the full timeline?) — and those existing-surface REBUILDs are *proposals*, not decisions. (Version now read: **Angular 21.2.13**, `patients/package.json`, 2026-05-25.)

## Rows I most expect the skeptic to challenge

1. **Order interaction-model (REBUILD UI / REUSE math, H/M) — challenged + RESOLVED 2026-05-25.** The skeptic read the cart as a smuggled UX change. Resolved: the cart is **ours with documented rationale** (`flow-meal-ordering.md`, 2026-05-07 review), his build already has the same draft-order+confirm shape, Aaron is conceptually fine with an order object, and the lone open detail (persist-timing) routes to the **product-rule gate audit** with his immediate-persist a legit/possibly-preferred input. The "smuggle" framing was wrong; see the Order deep-dive + Dispositions §2.
2. **Dashboard → Home/Activity dispersal (REBUILD, M).** I claim his dashboard child previews (`delivery-preview`, `message-preview-list`, `meal-confirm-banner`) re-home into Home focus-cards / Activity. That re-home mapping is asserted from component names + the focus-card concept, not from a built reconciliation — the skeptic should demand the explicit preview→focus-card mapping before trusting "salvage."
3. **Messages REUSE-wholesale (M).** I rate his messages surface as more complete than the HTML app's `talk-to-person` and therefore REUSE. That leans on the HTML app under-specifying messages; if the 3-tab IA actually intends a different messaging model (or routes "talk to a person" somewhere his thread UI doesn't fit), this flips toward REBUILD.

---

*One additional flag for the reviewer, not a row:* preferences-ledger row #6 ("separate `.html`+`.scss`, never inline") is **contradicted** by his route-level page components (`feedback.component.ts`, `delivery.component.ts` use inline `template:`). His reusable `components/*` use separate files. The "never inline" is too strong; recommend softening the ledger row to "separate files for reusable components; inline tolerated for route-level pages" and re-confirming with Andrey.

---

## Fold — skeptic + Aaron dispositions (2026-05-25)

The objection→disposition trail from the skeptic ("Andrey's seat") pass + Aaron's steers. This section authoritatively amends the rows above where noted.

| # | Objection (skeptic, in Andrey's voice) | Disposition |
|---|---|---|
| 1 | "You're telling me to throw away my work" — REBUILD on surfaces I have reads as a design-authority claim. | **Valid (framing).** "Supersedes" was written as fact; it's a **pilot-scope proposal**. Reading note added up top; every existing-surface REBUILD is now flagged "Aaron+Vanessa+Andrey's call, not decided." His delivery card→timeline (M) explicitly flagged as possibly over-scoped. |
| 2 | The cart is a smuggled UX/architecture change; nobody decided patients want a cart. | **Rejected — the cart is OURS with rationale** (`flow-meal-ordering.md`, 2026-05-07 review, Step-6 submit/confirm). His build already has draft-order+`ConfirmMeals`. Aaron conceptually fine with an order object. Open detail = persist-timing → **product-rule gate audit**; his immediate-persist a legit/possibly-preferred input. Order deep-dive + reading note #2 rewritten. |
| 3 | Emit thesis extrapolates from one hand-ported stepper whose behavior wasn't even mechanical. | **Valid — sharpened.** The agent-flow runners are **NET-NEW builds the pipeline scaffolds, not mechanical ports** (behavior re-expression is the judgment-heavy part per the proving slice). The ~29-primitive `init()`-contract refactor the behavior-bridge needs is **unbuilt** — named as a gap below. Claim narrowed to: markup mechanical, behavior scaffolded-then-human-finished. |
| 4 | "It binds to my data layer" does less than implied — my components ARE the integration. | **Valid — quantified.** His components hold the `mealRows` 3-way join + persist orchestration. The emitted shell saves **markup + behavior-scaffold**, NOT the integration/data wiring (that stays his). Boundary #1 + the Order deep-dive say the host re-wires; this disposition makes the *thinness* explicit so it isn't oversold. |
| 5 | Maintenance/ownership of generated code in my tree; idiom-drift between emits. | **Partly genuine gap (a) below.** Reframed via Aaron: the objection presents as technical but the cause is the **rework wire** ("moving his cheese"); mitigation is process (don't obsolete settled work on him without him), not an ownership policy. Captured in [[Andrey Kartashov]] profile. |
| 6 | The framework-binding is inferred from my pushed (stale, partly-LLM) code — why trust it? | **Acknowledged — it's by design correctable.** The preferences SoT tags each row observed/inferred/`assumed` with a one-line correction cost; it's the decision-queue for the Andrey conversation, not a claim of captured truth. **The version error proved the point:** inferred "20+", actual **21.2.13** (now read). |

### Genuine gaps (named, not papered over)
- **(a) Idiom-drift / generated-code ownership between emits** — once emitted code is in his tree he owns the bugs; if his conventions drift from the SoT, re-emits fight his code. Real cost; only works if the SoT stays a living conversation. Root cause is the rework wire (see profile), so the primary mitigation is relational, not technical.
- **(b) No patient-research basis for the cart vs persist-on-change** — the order/cart *object* is settled (ours + his both have it); the persist-timing + any abandonment-risk question is genuinely open → product-rule gate audit, not guessed.
- **(c) The ~29-primitive `init()`-contract refactor is unbuilt** — the behavior-bridge for framework targets depends on it; until built, behavior emit is partly aspirational.

### Verification note
The dedicated fresh-context verifier under-delivered (returned only a sign-off). The skeptic independently grounded the load-bearing items against his tree (confirmed persist-on-change in `meals.component.ts`; read the actual Angular version 21.2.13). A clean REUSE/NET-NEW verification table is a remaining nicety — re-run if wanted before this goes to Andrey.
