# Andrey's Angular idioms — the PL→Angular porter target

> **Purpose:** the conventions a `ui-angular-porter` (and the Path-C proving slice) must emit so generated Angular *looks like Andrey wrote it* — the respect signal that decides his acceptance (see [[Andrey Kartashov]] how-to-engage; [AD-08-revisit](./AD-08-revisit-pipeline-framework-emit.md)).
> **Source:** `cena-health-spark` `origin/devel` @ `b205df2` (2026-05-19, "Patient noai 0514"), `patients/` app. Re-verify against his latest before any Andrey-facing demo — he pushes infrequently (solo).
> **Extracted:** 2026-05-25.
> **This doc is evidence, not decisions.** It records what his codebase *shows*. Whether each idiom is a deep Andrey preference, a swap-without-caring default, or an LLM default he never chose **cannot be told from code alone** (he codes LLM-assisted). The *decisions* — what we assume, our confidence, and the correction cost if he prefers otherwise — live in the effort SoT: [`angular-emit-preferences.md`](./angular-emit-preferences.md). Treat everything below as `observed evidence` feeding that ledger, not as confirmed requirements.

## Stack signals (from `patients/src/app/app.config.ts`)

- **Angular 19, zoneless** — `provideZonelessChangeDetection()` + `provideBrowserGlobalErrorListeners()`. No Zone.js reactivity; state is explicit via signals.
- **Standalone bootstrap** — `ApplicationConfig` + `provideRouter(routes)`; no NgModule anywhere. `app.config.ts` + `app.routes.ts` + `app.ts`.
- **Functional DI** — `inject(...)` everywhere, not constructor injection.
- **Data layer = Firebase Data Connect** (`@dataconnect/generated`, `connectorConfig`) over `@angular/fire` (Auth, Functions). This is the T0.2 contract a porter's components would bind against — GraphQL-over-Postgres codegen connectors, not hand-written REST services.

## Component idioms (from `components/meal-card`, `components/bottom-nav`)

- `@Component({ standalone: true, selector: 'app-<name>', templateUrl: './*.html', styleUrl: './*.scss' })` — **separate template + scss files**, never inline.
- **Signal API for I/O** — `input.required<T>()`, `input<T>()`, `output<T>()`. **No `@Input()`/`@Output()` decorators.** Members are `readonly`.
- Typed data interface **co-located in the component `.ts`** (e.g., `export interface MealCardData { … }`).
- DI via `readonly svc = inject(SvcService)`.
- Standalone `imports: [...]` array for what the template uses (`RouterLink`, `RouterLinkActive`, etc.).

## Template idioms (from `meal-card.component.html`)

- **Block control flow** — `@if (cond) { }`, `@for (x of xs(); track x) { }`. Not `*ngIf`/`*ngFor`.
- **Signal access in template** — call the signal: `meal().mealName`, `meal().mealTags?.length`.
- **Event binding to outputs** — `(click)="detail.emit(meal())"`.
- Property binding `[src]`, `[alt]`; interpolation `{{ }}`.
- Light, occasional inline `style="…"` with CSS vars (e.g., `var(--color-stone-100)`) — he is not strict about the no-inline-style rule haven-ui enforces.

## The decisive finding — his class vocabulary already overlaps the PL

His hand-written patient markup uses the **same semantic-class dialect haven-ui's pattern library emits**, plus Tailwind utilities for layout:

- `meal-card`, `meal-card-img`, `meal-card-body`, `meal-card-name`, `meal-card-tags`
- `badge badge-primary badge-pill` (a verbatim haven-ui PL pattern)
- `w-full h-full object-cover` (Tailwind layout)

Implication: a PL→Angular port maps classes **near-verbatim** — the markup it emits is already in his idiom, not a foreign dialect. This is the strongest available evidence that Path C produces *his-looking* code, which is the gate on his acceptance.

## PL → Angular mapping (the porter's deterministic rules)

| Pattern-library source | Angular emission (Andrey's idiom) |
|---|---|
| Semantic classes (`badge badge-primary`, `meal-card-*`) | Verbatim — same class vocabulary he already uses |
| Tailwind layout utilities | Verbatim |
| Component prop / variant | `input<T>()` / `input.required<T>()` signal; variant composes the modifier class (`badge badge-{{variant()}}`) |
| Component event | `output<T>()` + `(event)="out.emit(...)"` |
| Conditional content | `@if (cond()) { }` |
| Repeated content | `@for (x of items(); track x) { }` |
| Co-located data shape | `export interface <Name>Data { … }` in the `.ts` |
| Vanilla-JS behavior primitive (`quantity-stepper.js`) | Default: import unchanged, self-init on `[data-*]`; read/write via `el._{name}` API + listen to its `CustomEvent`s, wired in `ngAfterViewInit` via `@ViewChild`/`viewChild()` |
| Data binding (lists, persistence) | NOT emitted by the porter — host wires Firebase Data Connect connectors (T0.2, Andrey-owned) |
| Selector | `app-<kebab-name>` |
| Template/style | separate `.html` + `.scss`, never inline |

## Open verification (before the Andrey demo)

- Confirm the above against his latest pushed code (this snapshot is 2026-05-19).
- Confirm whether he uses `viewChild()` (signal query) vs `@ViewChild` decorator — both exist in 19; pick his.
- Find his closest existing analog to a haven-ui interactive primitive (e.g., does a stepper/quantity control already exist in `patients/` or `kitchens/`?) to compare the port against hand-written.
