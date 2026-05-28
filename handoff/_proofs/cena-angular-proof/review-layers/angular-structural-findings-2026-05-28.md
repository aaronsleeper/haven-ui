# Angular Structural Skeptic — review findings (run 2026-05-28)

## Verdict: iterate

Two-way `[(ngModel)]` is wired against signal-typed fields it cannot drive, the `compose-bar`/`profile` `[(ngModel)]` bindings will fail at runtime under strict signal access, and the unit specs omit fakeAsync around promise-driven change detection. Structural shape against the data-binding contract is correct; the runtime wiring of forms + a few zoneless subtleties needs another pass.

## Findings (numbered)

### Finding 1 — `[(ngModel)]` two-way bound to a `WritableSignal` field on `ProfileComponent`
- File: `Lab/haven-ui/handoff/_proofs/cena-angular-proof/emitted/E2-profile/profile.component.html:44`, `:68`
- Failure mode: signal vs RxJS/forms bridging — `FormsModule`'s `NgModel` expects a property whose getter returns the value and whose setter accepts a value; `signal()` is a callable, not a plain field. `[(ngModel)]="preferenceNotesDraft"` will get/set the signal *reference* rather than its value. The text in the textarea will not update the signal, and `onSavePreferences()` will read the initial empty string.
- Reference: Angular 21 forms with signals — `ngModel` is not signal-aware; the canonical bridge is `[ngModel]="preferenceNotesDraft()" (ngModelChange)="preferenceNotesDraft.set($event)"`, or migrate to `model()` input with `[(value)]` on a signal-aware control. `https://angular.dev/guide/signals`
- Severity: blocker
- Fix: replace `[(ngModel)]="preferenceNotesDraft"` with `[ngModel]="preferenceNotesDraft()" (ngModelChange)="preferenceNotesDraft.set($event)"` for both textareas in `profile.component.html`. Same change for `deliveryNotesDraft`. Alternative: convert `preferenceNotesDraft`/`deliveryNotesDraft` from `signal('')` to plain `string` fields (matches `ComposeBarComponent.text`) and keep `[(ngModel)]`. The component spec at `profile.component.spec.ts:68` calls `.set('new notes')` directly on the signal, which bypasses the broken template binding — the spec passes while the UI is dead.

### Finding 2 — Optimistic write replaces tier-3 reconciliation; refresh path is missing for preferences and delivery note
- File: `emitted/E2-profile/profile.component.ts:74-86` and `:88-100`
- Failure mode: HttpClient/service-tier responsibility — the data-connect-binding pattern (`writeBinding` template) prescribes optimistic-update → service call → refresh-on-success → rollback-on-failure. `onSavePreferences` mutates the local `preferences` signal but never re-reads `loadProfileData` after success, so server state and UI state diverge silently when the backend normalizes notes differently. `onSaveDeliveryNote` does not refresh either, and the delivery note is not held in `preferences` at all (no local mirror), so the save round-trip is invisible to the rest of the UI.
- Reference: in-catalog `data-connect-binding.json` → `templates.writeBinding` step 3 ("Reconcile — re-read or trust optimistic"). E1 `messages.component.ts:60-65` does this correctly (calls `getMessages({limit:50})` after `sendMessage`); E2 does not.
- Severity: concern
- Fix: after `await this.patientData.updatePreferences({notes: draft})` succeeds, call `await this.patientData.loadProfileData()` (or a narrower `getDietaryPreferences()` adapter) and `this.preferences.set(...)`. For `onSaveDeliveryNote`, decide whether the note belongs in `profile()` (re-read profile) or in a dedicated `deliveryNotePersisted` signal, then refresh.

### Finding 3 — Optimistic message update mutates a signal mid-render via `computed`
- File: `emitted/E1-messages/messages.component.ts:32, 57, 64`
- Failure mode: change detection ordering — `threadItems` is `computed(() => buildThreadItems(this.messages()))`. `onSend` calls `this.messages.update(...)` synchronously, then `await this.patientData.sendMessage(body)`, then `this.messages.set(refreshed.patientMessages ?? [])`. Under zoneless, every write schedules CD; the template renders the optimistic state, then the awaited refresh wholesale-replaces it. The reconciled list does **not** include the optimistic `temp-` row, so it disappears for one frame then is replaced by the server-side persisted row with a real id. Track-by is `item.id`, so the disappearing temp row triggers a remove+add animation in the DOM. There is no merge that retains the temp row until its server counterpart arrives.
- Reference: zoneless + signals — `https://angular.dev/guide/zoneless`; `cd-zoneless` pattern principle on `computed()` lazy memoization and reconciliation.
- Severity: concern
- Fix: in the success branch, merge: `this.messages.update(list => mergeOptimistic(list, refreshed.patientMessages ?? [], tempId))` where `mergeOptimistic` keeps the temp row only if no server row arrived for it (matched by `body` + `sentAt` window). Or trust the optimistic write and only re-read on page revisit.

### Finding 4 — Spec for `messages.component` runs CD without `fakeAsync`/`tick`; relies on `await fixture.whenStable()` after `detectChanges` for a promise-resolved fetch
- File: `emitted/E1-messages/messages.component.spec.ts:22-27`, `42-50`
- Failure mode: test harness compatibility — under zoneless, `fixture.whenStable()` resolves after the *current* microtask queue drains, but `ngOnInit` returns a Promise whose `.finally(() => this.loading.set(false))` runs asynchronously after the awaited `getMessages` resolves. `fixture.detectChanges()` is called once; the subsequent `await whenStable()` *may* settle before the `loading.set(false)` happens, depending on microtask ordering. The spec passes in current Angular because `getMessages` is a synchronously-resolved Promise, but any added microtask hop (a real interceptor, a `.then` in the service) makes this flaky.
- Reference: Angular testing under zoneless — `https://angular.dev/guide/zoneless#testing`. Canonical pattern is `fakeAsync` + `tick()` after each await boundary, or wrap the assertion in a second `await fixture.whenStable(); fixture.detectChanges();` loop.
- Severity: concern
- Fix: either (a) wrap the test body in `fakeAsync` and `tick()` after each await, or (b) explicitly drain: `fixture.detectChanges(); await fixture.whenStable(); fixture.detectChanges(); await fixture.whenStable();` before asserting `loading()` is `false`. The rollback test (`:41-50`) has the same pattern — rejection path needs the same drain.

### Finding 5 — Spec passes a `senderUid: ''` and `imageUrl: null` directly into a typed `Message`, masking schema-strictness drift
- File: `emitted/E1-messages/messages.component.ts:48-56`, spec `:7-19`
- Failure mode: HttpClient/interceptor interaction (type-level) — `Message` is `NonNullable<GetMessagesData['patientMessages']>[number]`, which is generated by Data Connect. Generated types often include fields like `__typename`, server-resolved timestamps, FK ids. The optimistic literal will typecheck as long as the generated `Message` includes only the listed fields; if Data Connect regenerates with a new required field, the literal silently fails to update and the runtime push of an incomplete object hits the template (template projects via `m.body`, `m.senderRole`, etc., so it tolerates missing fields cosmetically). The spec uses `as any` casts (`profile.component.spec.ts:22`, `:36`) which suppresses the same warning on the profile side.
- Reference: `feedback_primary_source_values` — don't paper over generated-type drift.
- Severity: nit (concern if Data Connect schema is in flux)
- Fix: factor the optimistic literal into a `makeOptimisticMessage(body): Message` helper that uses `Partial<Message>` + a typed cast against the *current* generated shape; remove `as any` from the spec fixtures and explicitly satisfy the generated type.

### Finding 6 — `ComposeBarComponent` uses `[(ngModel)]="text"` against a plain string but does not declare `ChangeDetectionStrategy.OnPush`; under zoneless this is fine but the inconsistency with `messages.component`'s signal-only model is a smell
- File: `emitted/E1-messages/compose-bar.component.ts:15`, `compose-bar.component.html:4`
- Failure mode: signal vs RxJS/forms bridging (mixed mental model) — `ComposeBarComponent.text` is a plain field while `sending` is a signal. `[(ngModel)]="text"` works correctly because `text` is a field with a setter (assignment); but the component disables the Send button via `[zDisabled]="!text.trim()"` which is re-evaluated by Angular's template re-render — under zoneless this only triggers when something *else* schedules CD (the `(keydown)` handler does, the `(ngModelChange)` does). So `text` lives outside the signal graph; if `sending` is set true by a parent without `text` also moving, the disabled state will not update.
- Reference: `cd-zoneless` pattern principle — "Avoid mixing signals with RxJS observables in the same flow; pick one for clarity."
- Severity: nit
- Fix: convert `text` to a `signal('')`, swap `[(ngModel)]` for `[ngModel]="text()" (ngModelChange)="text.set($event)"`, change `[zDisabled]="!text.trim()"` to `[zDisabled]="!text().trim()"`. Aligns with E2's intent and the zoneless model.

### Finding 7 — `ngOnInit` swallows errors silently; loading flips to false but the user sees an empty thread with no error surface
- File: `emitted/E1-messages/messages.component.ts:37-44`, `emitted/E2-profile/profile.component.ts:57-66`
- Failure mode: HttpClient/interceptor interaction — error normalization is happening at the wrong layer. The `try/finally` block catches nothing; any exception from `getMessages` or `loadProfileData` is rethrown, but `ngOnInit`'s promise rejection is unobserved (Angular logs to console but does not surface). The user sees `loading()` → false, `messages()` → `[]`, and the empty-state UI fires. Indistinguishable from "no messages."
- Reference: data-connect-binding `gotchas` → "Error handling: domain service throws; components catch + roll back + surface."
- Severity: concern
- Fix: add a `loadError = signal<string | null>(null)` to both components, switch `try/finally` to `try/catch/finally`, set `loadError` on catch, and render an error-state branch in the template alongside the empty-state branch. The empty/error distinction is load-bearing for diagnosing data-tier outages in production.

### Finding 8 — `MessagesComponent` re-fetches the full list after every send (no incremental write); `getMessages` is unbounded by patient context
- File: `emitted/E1-messages/messages.component.ts:60-62`
- Failure mode: HttpClient/interceptor interaction (cost + cache invalidation) — every successful send issues a full `getMessages({limit: 50})` round-trip. The service tier (`patient-data.service.ts:156-158`) is a thin pass-through with no caching; under realistic load a chatty patient could trigger N+1 requests. No cache invalidation hook on the service tier means consumers cannot detect a write happened.
- Reference: tier responsibility per the binding pattern — cross-cutting concerns (caching, retries) belong at the domain-service tier.
- Severity: nit
- Fix: optional. The pattern's reconciliation step *does* prescribe a re-read; the concern is cost, not correctness. If iterating, add a `sendMessageAndRefresh` composite to `PatientDataService` that returns the updated list, and let the component just `this.messages.set(result)`.

### Finding 9 — Profile spec asserts `preferenceTypes()` after `whenStable` but never calls `fixture.detectChanges()` a second time; signal-derived computed may be stale
- File: `emitted/E2-profile/profile.component.spec.ts:54-61`
- Failure mode: test harness compatibility — `computed()` is lazy. Reading `fixture.componentInstance.preferenceTypes()` directly *will* recompute (signal read forces evaluation), but if any future change makes `preferenceTypes` depend on a template-tracked DOM signal (e.g., a `viewChild` signal), the same pattern would fail. The test is brittle to the kind of refactor `cd-zoneless` explicitly warns about.
- Reference: `cd-zoneless` pattern — `computed()` is lazy + memoized.
- Severity: nit
- Fix: prefer the canonical drain pattern (`detectChanges → whenStable → detectChanges`) over reading computed signals directly in specs.

### Finding 10 — Both components depend on `@cena/catalog-ui` Zard components without declaring how they are provided/registered; emitted files assume a global imports source that the host app may not have wired
- File: `emitted/E1-messages/messages.component.ts:2, 22`, `emitted/E1-messages/compose-bar.component.ts:3, 8`, `emitted/E2-profile/profile.component.ts:2-12, 22-32`
- Failure mode: DI scoping — Zard components are standalone, so importing them in `imports: []` is the correct shape (no provider needed). The structural risk is path resolution: `@cena/catalog-ui` is a workspace alias that exists in the catalog repo (haven-ui's emit target), but in the production `cena-health-spark/patients/` app the existing message component imports nothing from `@cena/catalog-ui` (it uses local components only). If these files are dropped into the spark app verbatim, the import will fail at build time, not runtime — caught by typecheck, so not a runtime blocker, but the *handoff* will fail until Andrey wires the workspace.
- Reference: `feedback_handoff_friction` — framework-translation handoffs are where quality dies.
- Severity: nit (handoff concern)
- Fix: document the `@cena/catalog-ui` dependency in the proof's handoff README. If the proof is meant to ship into `cena-health-spark/`, either vendor the Zard components or land a workspace package first.

## Severity summary

- 1 blocker (Finding 1 — `[(ngModel)]` against signal in ProfileComponent)
- 4 concerns (Findings 2, 3, 4, 7)
- 5 nits (Findings 5, 6, 8, 9, 10)

## Honest limits

- Same-model fresh-context. Findings here are reliable for **structural shape mismatches** with canonical Angular 21 patterns and with the in-catalog `data-connect-binding.json` contract. Less reliable: subtle runtime behaviors that need a real browser under real load — Finding 3's "disappearing temp row for one frame" is a hypothesized failure based on the code shape; it could be masked by Zard's animation defaults or render batching that I cannot observe statically.
- I did not run the emitted code. Findings 1 and 4 in particular would be confirmed in seconds by `ng test` + opening the profile screen in a dev server; the proof should do that before relying on this review.
- I did not cross-check against `ZardInputDirective`'s actual signature — if Zard's `z-input` directive implements its own `ControlValueAccessor` that *is* signal-aware (some Zard ports do), Finding 1 collapses from blocker to nit. Worth verifying against `@cena/catalog-ui` source before fixing the binding everywhere.
- Route-level concerns (guard composition, lazy boundaries) were out of scope for the emitted files; the production `app.routes.ts` has its own structure and is not affected by this emission.
