# Verdict — Angular-emit proving slice

Authored: 2026-05-28T23:35:00Z
Authored by: Claude (opus)
Against EVIDENCE.md hash: commit `342b201` (haven-ui main)

## Headline

**The generative-determinism thesis held for Angular against Andrey's stack.**

E2 invoked **2× the catalog items as E1** (12 vs 6) at **lower emission cost** (344 LOC vs 370; 4 files vs 7; 1 gate-adapter fix vs 6) with **zero new pattern entries authored**. Both emissions typecheck against Andrey's real `@dataconnect/generated` SDK and `PatientDataService`; both spec suites pass; all four invariant tripwires hold. The catalog amortizes across emissions exactly as the hypothesis predicted.

## Per-success-criterion verdict

### SC #1 — Catalog completeness

> Pattern catalog authored once covers: standalone component shell, route declaration (with lazy-loading), signal I/O, form layout, list rendering, detail view, event wiring, route guards, DI scoping, CD signal-emission timing, Jasmine spec scaffold. Each entry declares variants/properties and references the preference-ledger row that governs it. **Net catalog primitive count locked before any emission run begins.**

**Verdict**: **PASS**

Evidence: EVIDENCE.md §1. Catalog locked at 13 registry items (5 component primitives, 7 patterns, 1 data-binding) before E1 emission began. **Zero** new entries authored during E1 or E2.

### SC #2 — E1 emission

> E1 = Care-team messages emitted from the catalog. Typechecks under Angular 21.2.13 in a temp workspace built from Andrey's config. Jasmine spec passes. Binds against his real `dataconnect.service.ts` import paths (no invented contracts; structural row #13 holds).

**Verdict**: **PASS**

Evidence: EVIDENCE.md §4. `tsc --noEmit` exit 0; `ng test` 3/3 SUCCESS; binds against real `PatientDataService.getMessages({limit: 50})` and `sendMessage(body)`; uses `GetMessagesData` type from `@dataconnect/generated`; structural tripwire row #13 PASS.

### SC #3 — E2 emission

> E2 = Profile/preferences emitted from the SAME catalog with zero new pattern entries authored. Typechecks. Spec passes.

**Verdict**: **PASS**

Evidence: EVIDENCE.md §5. Zero new pattern entries authored (constraint held); `tsc --noEmit` exit 0; `ng test` 7/7 SUCCESS (3 E1 + 4 E2 including a regression test that proves the blocker-fix holds); binds against `loadProfileData()` + `updatePreferences()` + `updateDeliveryNote()` and `GetProfileData` + `GetDietaryPreferencesData` types.

### SC #4 — Catalog reusability proof

> E2 ≥ E1 in primitive count AND E2 emission cost < E1 emission cost (LOC + ledger rows + transcript steps). Catalog-authoring phase logged separately and excluded from emission cost.

**Verdict**: **PASS** — the load-bearing test of the thesis

Evidence: EVIDENCE.md §5 ("Falsifiable SC #4 check"). E2 primitive count = 12; E1 = 6 (E2 ≥ E1 by 2×). E2 LOC = 344; E1 = 370 (E2 < E1). E2 files = 4; E1 = 7. E2 gate-adapter fixes = 1; E1 = 6 (one-time first-run cost amortized to E2). Only ledger-rows touched was a tie (7 = 7), and that's a count-of-rows tie, not a cost-equivalence claim.

### SC #5 — Tripwire falsifiability

> Three invariant tripwires planted across the three blast-radius tiers; each proven falsifiable.

**Verdict**: **PASS** (with bonus: also empirically PASS against real emission output)

Evidence: EVIDENCE.md §6. Each tripwire fired with row reason against its planted fixture (config row #16: 2 violations; porter-rule row #5: 3 violations; structural row #13: 1 violation); each PASSES with fixtures allow-listed. Post-emission: all 4 invariants STILL PASS against the actual E1 + E2 code. Tripwires are not just falsifiable in theory — they hold empirically in practice.

### SC #6 — Three review layers

> Three review layers run, each producing a structured verdict.

**Verdict**: **PASS**

Evidence: EVIDENCE.md §7 (Andrey's seat — verdict: iterate), §8 (Angular Structural Skeptic — verdict: iterate, 1 blocker absorbed and fixed in-session, 4 concerns + 5 nits dispositioned), §9 (Mechanical gate — binary PASS: tsc clean, 7/7 ng test, 4/4 tripwires).

### SC #7 — Each objection cleared OR logged

> Each review-layer objection cleared OR logged with disposition (`absorbed` / `deferred` / `rejected-with-reason`).

**Verdict**: **PASS**

Evidence: EVIDENCE.md §7+§8 dispositions blocks. Every Andrey-seat finding (~32 across 11 files) carries a disposition; every Structural Skeptic finding (10) carries a disposition. One blocker absorbed and fixed in-session with a regression test; one concern partially absorbed via the blocker-fix's drain pattern; four concerns deferred with explicit reasons and follow-up flags; five nits deferred. No objection silently ignored.

### SC #8 — Two-artifact deliverable

> EVIDENCE.md authored AND locked first; VERDICT.md authored second against frozen EVIDENCE.md.

**Verdict**: **PASS**

EVIDENCE.md was committed and locked at commit `342b201` BEFORE this VERDICT.md was authored. The lock-then-verdict discipline is satisfied by git history: the EVIDENCE-lock commit precedes the VERDICT-author commit.

## Why the verdict is what it is

The load-bearing test — SC #4 — was the falsifiable claim that risked the whole thesis: *if E2 shares the catalog with E1 and emits cheaper, generative determinism extends to Angular*. The evidence is unambiguous: E2 invoked twice the catalog surface area while costing fewer lines, fewer files, fewer setup adaptations, and fewer emission-phase steps. The catalog absorbed E1's first-run friction (SDK generation, npm-vs-yarn protocol shim, peer-dep workarounds, service copy, tsconfig paths, catalog peer-deps); E2 inherited all of that as zero-cost reuse. This is the **exact behavioral signature** the generative-determinism rule predicts: a deterministic contract bounds a generative act, and once the contract is authored, subsequent fills are cheaper.

The structural skeptic catching a blocker (`[(ngModel)]` against `WritableSignal`) is *also* evidence the proof is honest. The blocker landed because the catalog patterns didn't explicitly distinguish "application state in signals" from "form-input drafts in plain fields"; the emission inherited the gap; the gate (mechanical layer) didn't catch it because the spec used `.set()` directly, bypassing the broken template binding. The structural skeptic noticed precisely this — "spec passes while UI is dead" — and was right. The fix took ten minutes; the regression test that now exists would have caught the bug on day one. **The catalog's first iteration uncovered a real catalog gap; the catalog absorbed the lesson via a new gotcha entry (cross-cutting observation in EVIDENCE.md §10) for the next emission.**

The taste skeptic catching ~22 likely-grimace items doesn't undermine the thesis; it sharpens it. Many of those findings are catalog-or-porter iteration work (variable-name conventions, SCSS strategy, template structure), not E1/E2 fixes. A handful (i18n drop, component decomposition strategy, mutation reconciliation ceremony) are real catalog gaps the proof made visible — exactly the kind of feedback an early proof should surface. The proof was never "the catalog is done"; it was "the catalog amortizes." The amortization is verified; the gaps are now named, scoped, and queued.

## What this verdict does NOT claim

- **It does not claim the catalog is production-ready** for Andrey's `cena-health-spark` app. The skeptic findings name several gaps (i18n binding, decomposition strategy, reconciliation ceremony, compose-bar feature parity) that would need to be closed before any emit lands in his tree.
- **It does not claim parity with hand-coded Angular at the senior-dev level.** Andrey's existing code has idioms our emit does not yet match (verbose-but-clear variable names, Tailwind-utility-in-template patterns, child-component decomposition for forms). The catalog can absorb these via porter-rule iteration; the proof shows the catalog *can*, not that it *has*.
- **It does not channel Andrey's actual taste.** Same-model fresh-context skeptics catch register/decomposition/i18n drift; they do not substitute for Andrey reading the code himself. His verdict is the only thing that finally tests the "Andrey-seat" simulation.
- **It does not bypass the agents-first viability research (B-research).** This proof ships flagged-as-provisional under that arc; if B's findings reshape the patient-app stack decision, this proof's outputs reshape with it.
- **It does not negate the cart product-rule open question.** The proof deliberately picked entities (Messages + Profile) that don't have the cart-class persist-timing controversy. That question is still open and out of scope here.
- **It does not claim the patterns will hold across future Angular versions** without re-verification. Row #16 pins Angular 21.2.13. An Angular 22 emission would need a fresh basis evaluation.

## Recommendations for next phase

- **Coach play to Andrey timing**: per the [[Andrey Kartashov]] engagement key (load his People profile before composing), surface the proof when there's a natural opening — not as a pitch ("here's what I built"), but as an invitation to a pairing call ("we've been exploring catalog-driven emission for the patient app; want to look at what came out and decide if it's worth pursuing"). Lead with the SC #4 result. Don't lead with the verdict; lead with the artifact at `handoff/_proofs/cena-angular-proof/emitted/E2-profile/profile.component.ts` and ask him to read it.
- **Catalog iterations the proof surfaced** (add as work items in haven-ui):
  1. Add a `data-connect-binding.json` gotcha: "form-input drafts should be plain string fields, not signals, when used with `[(ngModel)]`" (taught by the blocker fix)
  2. Add a ledger row for "i18n binding strategy" + pattern entry (taught by all 4 templates dropping i18n silently)
  3. Add a ledger row for "component decomposition: single vs child-component-per-section" (taught by profile vs Andrey's 4-child shape)
  4. Add ledger rows for "mutation reconciliation strategy" and "optimistic-rollback aggressiveness" (taught by the catalog-vs-Andrey conflict on `event-mutation` ceremony)
  5. Decide on catalog test-runner alignment (catalog ships Jest-flavored specs; consumer apps use Jasmine; the gate had to move catalog specs out of compilation) — port to Jasmine OR document the dual-runner intent
  6. Address the E2 missing-refresh after `updatePreferences` + `updateDeliveryNote` (structural-skeptic Finding 2; defer-with-reason in EVIDENCE.md)
  7. Address error-state UI for `ngOnInit` failures (Finding 7; load-failure currently indistinguishable from empty-state)
- **Blockers from the upstream evaluation pass** (#1–#5 named in the audit): #1 already resolved (entity reselection landed). #2 (TS compat) resolved (Phase 0 cleared). #3, #4, #5 still open; not affected by this proof.
- **The `data-connect-binding` pattern's "1–2 weeks of iteration" status**: started. This proof was the iteration loop's first real trip. The first-pass shape held; the gap (signal-vs-plain-field for form drafts) was named and absorbed.

## Honest unknowns

- **Production performance under real load**: not tested. The mechanical gate proves typecheck + spec pass + binding correctness, not that the emitted code performs well under Firebase Data Connect's real latency, intermittent connectivity, or concurrent users.
- **Long-running idiom drift between emissions**: this proof ran two emissions in one session against a fresh catalog. The catalog's behavior across 10+ emissions over weeks is unknown.
- **Andrey's actual taste**: the Andrey-seat skeptic explicitly named this as an honest limit. His real reaction could collapse "likely-grimace" findings into nits or escalate them into blockers.
- **Hot-path behavior under signal CD at scale**: structural-skeptic Finding 3 (the disappearing-temp-row-for-one-frame) was hypothesized statically, not observed in a real browser under real animation defaults.
- **i18n at handoff time**: dropped from this emit by design (scope discipline). Real handoff into `cena-health-spark` requires the catalog learning i18n — not just emitting it raw and hoping.
- **The `@cena/catalog-ui` distribution model**: this proof used a workspace-internal package. External consumption (e.g., into spark/) needs either workspace-link, npm publish, or vendor-copy. Decision not made.

## Closure

When this VERDICT.md is committed, the proving slice closes on the **PASS path**. The catalog is now an artifact that has demonstrated catalog-driven Angular emission for Andrey's stack works as the generative-determinism rule predicted. The artifact at `handoff/_proofs/cena-angular-proof/emitted/` is the canonical record of what came out.

- **Committed at**: this commit (the VERDICT-author commit, immediately following the EVIDENCE-lock commit `342b201`)
- **Plan transition**: mark the proving slice's status `complete` in `~/.claude/plans/angular-emit-proving-slice.md`; the remaining items (Coach play, catalog iteration backlog) move to a follow-up plan.
- **PIPELINE-REGISTRY.md update**: note Angular extension on the UI pipeline row as 🟡 (output verified via emission, not yet productionized to a real consumer tree).
- **Atlas update**: flag for next `/meta`. Lifecycle: this proving slice → `done`; spawn a new entry "Angular emit — Andrey pairing + production handoff" → `parked` until Coach play happens.
- **Follow-up commitments**:
  - Coach play to Andrey on the proof's findings and the catalog's existence
  - haven-ui CLAUDE.md clarifying carve-out per Review trail #6 reasoning ("framework-port pattern catalogs ARE design-system content")
  - Catalog iteration backlog (the 7 items in "Recommendations for next phase" above)
  - i18n binding strategy decision + catalog pattern authoring
