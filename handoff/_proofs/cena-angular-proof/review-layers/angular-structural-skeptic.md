# Angular Structural Skeptic — prompt

The second review layer of the proving slice's three review layers. Catches the structural-validity gaps that the taste skeptic ("Andrey's seat") misses by construction: state management correctness, change detection ordering, DI scope mistakes, route guard composition errors, lazy-loading semantics, test-harness mismatches, HttpClient interaction.

This layer was added during the `/review-plan` pass (review finding #8, absorbed) precisely because "Andrey's seat" — a taste-shaped reviewer — was the wrong defense against the failure modes that matter most. The plan author already chose the structure; a same-flavored second pass confirms the structure they chose instead of challenging it.

## When to dispatch

After emission lands and mechanical gate passes. Independent of the taste skeptic — both can run in parallel; their findings get cross-referenced in `EVIDENCE.md`.

## Dispatch shape

`Agent` (general-purpose, model: opus, fresh context, no thread history, prompted explicitly as senior Angular dev with adversarial intent on structural concerns). Pass:

- Emitted E1 files (`/tmp/cena-evidence-gate/src/app/care-team/messages/`)
- Emitted E2 files (`/tmp/cena-evidence-gate/src/app/profile/`)
- Andrey's `app.routes.ts` (so the reviewer can verify route composition + guards)
- The catalog's data-connect-binding pattern + cd-zoneless pattern + di-providing pattern + route-guard pattern
- The Angular 21.2.13 docs surface (the reviewer can WebFetch if needed)

DO NOT pass:
- Reassurance about correctness ("this typechecks and passes specs")
- The plan's intent ("we want this to ship")
- Andrey's existing implementations as a "this is fine" anchor

## Prompt template

> You are a senior Angular dev reviewing emitted code with adversarial intent on STRUCTURAL concerns. Your job is to find what's wrong with the architecture, the state management, the change detection ordering, the DI scoping, the route composition, the test harness compatibility — not the variable names.
>
> The code typechecks and its specs pass. That's not enough. You're looking for code that **runs correctly today but will fail in production** because of structural assumptions that don't hold.
>
> Specific failure modes to hunt:
>
> 1. **Change detection ordering under zoneless + signals.**
>    - Effects that mutate signals they also read (loop unless guarded with untracked())
>    - computed() that depends on signals that change inside an effect
>    - DOM measurement code outside afterNextRender
>    - State updates triggered from RxJS without explicit toSignal boundaries
>
> 2. **DI scoping mistakes.**
>    - providedIn: 'root' on services that hold per-feature state (memory leak when feature unmounts)
>    - Route-level providers on a route without children (provider never instantiates)
>    - Component-level providers that recreate state on every component instance unintentionally
>    - Services injected at the wrong tier (component injecting DataConnectService directly when it should inject PatientDataService — tripwire row #13 should catch this; verify)
>
> 3. **Route guard composition.**
>    - Guards in wrong order (cheap-first vs expensive-first)
>    - Guards that throw vs guards that return UrlTree (consistency)
>    - Guards that don't handle Promise rejection cleanly
>    - Missing guards on routes that should have them
>
> 4. **Lazy-loading semantics.**
>    - loadComponent paths that won't resolve at runtime (typos pass typecheck)
>    - Eager imports of lazy-loaded components elsewhere (defeats lazy boundary)
>    - Missing loadChildren for sub-route trees (when applicable)
>
> 5. **Test harness compatibility.**
>    - TestBed.configureTestingModule for components that need providers (auth, http, router) without providing them
>    - Async test handlers without explicit fakeAsync/tick or HttpTestingController flush
>    - Specs that pass under jasmine but would fail under jest (the project uses jasmine; verify)
>
> 6. **HttpClient / interceptor interaction.**
>    - Data Connect bindings that assume specific interceptor behavior
>    - Error normalization happening at the wrong layer (component vs service)
>    - Retry logic in the component instead of the service tier
>
> 7. **Signal vs RxJS bridging.**
>    - toSignal() without explicit handling of initialValue when the source can be empty
>    - Subscribing in components without takeUntilDestroyed (memory leak)
>    - Two-way bridges (signal → observable → signal) without justification
>
> For each finding, provide:
> - The specific file + line(s)
> - The structural failure mode it represents (from the list above or named explicitly)
> - The Angular 21 docs reference or canonical pattern it violates
> - Severity (blocker / concern / nit)
> - Concrete fix recommendation
>
> Honest limit you must name: same-model fresh-context cannot fully simulate a different reasoner. Findings reliable from this pass: structural-shape mismatches with canonical Angular patterns. Findings less reliable: subtle runtime behaviors that require actually running the code in a real browser under real load.
>
> Cap response at ~1500 words. Numbered findings + severity summary.

## Output

Structured review at `<sandbox>/review-layers/angular-structural-findings-{date}.md` mirroring the andrey-seat format but with structural categories instead of taste categories.

## Related

- Companion skeptic: `andrey-seat-skeptic.md` (taste layer)
- Companion gate: `../evidence-gate/README.md` (mechanical layer)
- Proving slice plan: `~/.claude/plans/angular-emit-proving-slice.md` (SC #6, absorbed review finding #8)
- Outside-voice rule: `.claude/rules/outside-voice-review.md`
