---
slot: 4
slot-name: framework-binding
variant: angular-emit
primary-author: Frontend Architecture expert
project: cena-uconn-patient-app
created: 2026-05-25
status: in-review
consumes:
  - stack.md
  - framework-binding.md   # sibling: the static-HTML target this one is the Angular counterpart to
references:
  - planning/team/proposals/angular-emit-preferences.md   # idiom decisions SoT (define-once)
  - planning/team/proposals/andrey-angular-idioms.md       # observed-evidence appendix
  - planning/team/proposals/AD-08-revisit-pipeline-framework-emit.md  # ownership-bar decision axis
source-baseline: cena-health-spark patients/ @ b205df2 (2026-05-19, "Patient noai 0514")
inputs-hash: null
friction: []
pre-flight-authority: aaron
---

# Framework Binding — Angular Emit (Cena × UConn Patient App)

> **What this is:** the porter's *target* for the Angular-emit reconciliation. The sibling `framework-binding.md` (slot 4, static-HTML) governs the **owned design realization** the team builds + gates. This doc governs **emit into Andrey's real Angular app** — the path AD-08-revisit calls Path C. It is grounded in his **actual code** at `cena-health-spark/patients/` @ b205df2, not generic Angular.
> **Define-once:** idiom *decisions* (standalone, zoneless, signal I/O, DI, control flow, class vocab, Data Connect contract) live in [`angular-emit-preferences.md`](../../../planning/team/proposals/angular-emit-preferences.md) as a parameter ledger with per-row correction cost. This doc **references** that ledger and adds only what the survey of his code surfaced that the ledger does not already own (routing, guards, the service-orchestration shape, FormsModule, the shell topology).
> **The bar (AD-08-revisit):** the target is chosen on the **ownership bar** — what the team can emit and the porter can target *without* depending on Andrey's throughput. This binding is the contract a `ui-angular-porter` aims at; the data layer below the contract is Andrey's and is never emitted.

## Caveat that governs this whole doc

Per [`angular-emit-preferences.md` §"the caveat that governs every row"](../../../planning/team/proposals/angular-emit-preferences.md): **a convention in his codebase is not necessarily Andrey's preference.** He codes LLM-assisted. Everything below is `observed` at b205df2 unless marked otherwise; confidence and correction cost for each idiom decision live in the preferences ledger, not restated here. Re-verify against his latest push before any Andrey-facing demo — he pushes infrequently (solo).

## Target framework + version

- **Angular standalone, zoneless, signal-based.** App bootstraps via `ApplicationConfig` + `provideRouter` — no NgModule anywhere (`patients/src/app/app.config.ts`, `app.routes.ts`, `app.ts`).
- **Version — verify exact before emit.** The idioms doc records "Angular 19"; the monorepo `cena-health-spark/CLAUDE.md` pins platform to Angular 20 and lists kitchens at Angular 21. `patients/src/app/app.config.ts` uses the **stable** `provideZonelessChangeDetection()` (stable as of 19.2+; 19.2 itself shipped only `provideExperimentalZonelessChangeDetection`), so the patient app is **≥19.2, likely 20**. Pin the porter to his exact `patients/package.json` Angular version's API names — this is a `config`-cost row (#16 in the ledger), not a structural one. **Low-confidence row** for the skeptic: the "20+" inference is from the stable-API name + monorepo siblings, not a read of `patients/package.json` (not yet read).
- **DI:** `inject()` functional everywhere; no constructor injection (`app.config.ts` line 28 inside a `useFactory`; every component/service).

## Routing / navigation

Grounded in `patients/src/app/app.routes.ts`:

- **`provideRouter(routes)`**, lazy `loadComponent: () => import(...).then(m => m.XComponent)` per route — every surface is route-level code-split. The porter emits routes in this exact shape.
- **Two route zones:**
  - **Onboarding** (`onboarding/welcome`, `/consent`, `/preferences`) — **outside the shell**, each guarded individually (`loginRedirectGuard`, then `authGuard`).
  - **Main app** — a single shell route (`path: ''` → `MobileShellComponent`) with `canActivate: [authGuard, patientAccessGuard, onboardingGuard]` and **child routes rendered into the shell's `<router-outlet>`** (`dashboard`, `meals`, `order`, `delivery`, `care-team/messages`, `care-team/feedback`, `profile`).
  - `access-denied` is a bare route; `**` redirects to `dashboard`.
- **The shell-as-layout-route pattern is his, and it is the seam the IA divergence lands on** (see component-plan slot 17): the new 3-tab app-shell must re-home these children under a different nav + add `home`/`activity`/agent-flow routes. Routing *mechanism* (lazy `loadComponent`, guard arrays, child outlet) is REUSE; the *route table contents* are REBUILD.

## State library

- **No external state library. Angular signals are the state layer.** Every surveyed component holds local UI state in `signal()` and derives with `computed()` (`meals.component.ts`, `order.component.ts`, `dashboard.component.ts`, `messages.component.ts`). Server data is fetched imperatively in `ngOnInit` via the service and stuffed into signals.
- **No NgRx / no RxJS store.** Observables appear only at the Firebase SDK boundary (auth), not as an app-state idiom.
- **Optimistic local update is a hand-rolled pattern** (`meals.component.ts` `applyLocalQuantityChange` mutates the order signal immutably after the mutation fires). The porter does **not** emit this — it is data-layer-coupled app logic Andrey owns (see slot 17 Order row).

## Data layer = Firebase Data Connect (the T0.2 binding — his, never emitted)

This is the load-bearing difference from the generic Angular-emit case: **the data layer already exists in his code.** The porter's emitted components bind to it as a contract; they never emit it. Grounded in:

- `app.config.ts` — `DataConnect` provided via `useFactory` (Firebase App + `@dataconnect/generated` `connectorConfig`, emulator wiring).
- `services/dataconnect.service.ts` — low-level adapter over the generated SDK (named queries/mutations).
- `services/patient-data.service.ts` — **orchestration layer.** Centralizes which queries run in what order (`loadDashboardData`, `loadProfileData`), owns provider-config + available-meals caching, ISO-week resolution, and exposes a compact verb surface to components: `getAvailableMeals`, `getPatientMealOrder`, `createPatientOrderForMealWeek`, `createOrderItem`, `updateOrderItemQuantity`, `deleteOrderItem`, `confirmMeals`, `getMessages`, `sendMessage`, `submitFeedback`, `updatePreferences`, `updateDeliveryNote`, `getDeliveryStatus`, `getCareTeamPersonnel`, `getConsent`, `getDietaryPreferences`.
- **Porter contract:** an emitted component receives data via `input()` signals and emits intent via `output()`; the **host wires those to `PatientDataService`**. The porter never names a Data Connect query/mutation in emitted component code — that coupling stays in the host/page, exactly as his `meals.component.ts` does it today. (Preferences ledger row #13, marked `structural — his to own`.)

## Component / template idioms (reference the ledger; do not restate)

The deterministic PL→Angular mapping (semantic classes verbatim, `input()`/`output()` signal I/O, `@if`/`@for`, separate `.html`+`.scss`, `app-` selector, co-located `interface XData`, behavior-primitive contract→signal) is the [`andrey-angular-idioms.md` mapping table](../../../planning/team/proposals/andrey-angular-idioms.md) and the [`angular-emit-preferences.md` ledger](../../../planning/team/proposals/angular-emit-preferences.md). Re-verified at b205df2 against `meals.component.ts`, `order.component.ts`, `bottom-nav.component.ts`, `dashboard.component.ts` — all hold. Two survey additions the ledger should absorb:

- **Forms = `FormsModule` + `[(ngModel)]`, template-driven — NOT reactive forms.** Confirmed in `onboarding/welcome` (email/password), `onboarding/consent` (radio `avaChoice`), `onboarding/preferences` (`deliveryNote`), and `care-team/feedback` (`imports: [FormsModule]`). The porter emits template-driven two-way binding for inputs, not `ReactiveFormsModule`/`FormControl`. **Propose adding as a ledger row** (currently rows #11/#12 guess at two-way `model()` vs input+output for *components*; this is the orthogonal *forms* idiom and is now `observed`, not assumed).
- **Inline-template components are tolerated by him.** `feedback.component.ts` and `delivery.component.ts` use inline `template:` strings, contradicting ledger row #6 ("separate `.html`+`.scss`, never inline"). His `components/*` use separate files; his route-level page components sometimes inline. **Flag for the skeptic + Andrey:** row #6's "never inline" is too strong against his actual code. Porter default can stay separate-files (safest, matches his reusable components); note the inline tolerance so a reviewer doesn't treat an inline emit as a defect.

## i18n binding (survey addition — not in the ledger)

- His i18n is a **hand-rolled signal service** (`services/i18n.service.ts`): `lang = signal<'en'|'es'>`, `t(en, es)` returns the active string, persisted to `localStorage` under `cena-lang`. Components call `i18n.t('English', 'Español')` inline in templates.
- The HTML app's `i18n.js` is a different mechanism (data-attribute swap). **The porter binds emitted bilingual strings to his `i18n.t(en, es)` call site, not to the HTML `i18n.js`.** This is a `porter-rule` correction surface, not structural.

## Build / test toolchain (his app, not the handoff bundle)

- **Build/test is the `cena-health-spark` NX + Angular CLI toolchain** (monorepo `CLAUDE.md`: NX, `yarn sdk:generate` after `.gql` changes). The porter emits **source files into his tree**; it does not own a build. This is the inverse of the static-HTML binding (which owns `handoff-rebuild-bundle.sh` + `handoff-render-gate.sh`).
- **Verification the team CAN own pre-handoff:** render the emitted-against-spec parity in haven-ui's pattern-library + `render-check.mjs` at the declared viewports (per the static-HTML binding) *before* emit, so the spec is verified even though his build is not the team's to run. Post-emit, his NX build + his app is the integration test — and that is the AD-08-revisit "translation is where quality dies" risk this binding exists to bound.

## Declared viewports

- Same as the static-HTML binding: **mobile primary 390px**, **desktop reflow 1280px** (his `MobileShellComponent` is mobile-first with a `pb-[128px]` bottom-nav clearance; the new app-shell adds the desktop sidebar — slot 17 IA row).

## Accessibility-tree expectations

- Inherit the static-HTML binding's a11y-tree contract (landmarks, one `<h1>`/surface, `aria-current="page"` on active tab, native disclosure, labeled "talk to a person", onboarding `aria-label="Step N of N"`). The porter must **preserve** these in emit — the AD-08-revisit named risk is exactly that a11y wiring is silently dropped in framework translation. Where his existing components already satisfy a contract (e.g., `bottom-nav` active state), REUSE; where the new model adds surfaces (agent-flow runners), the a11y contract is emitted fresh from the PL spec (the runners' `aria-live` debounce, `aria-invalid` field wiring — see `assessment-runner.js` contract).

## Guard pattern (survey addition — his, REUSE)

- Four functional guards (`authGuard`, `patientAccessGuard`, `onboardingGuard`, `loginRedirectGuard`) under `patients/src/app/guards/`, wired as `canActivate` arrays in `app.routes.ts`. **The porter never emits guards** — they are auth/access policy Andrey owns, same boundary class as the data layer. Emitted routes slot into his existing guard arrays; the new IA's added routes inherit the shell's guard array.
