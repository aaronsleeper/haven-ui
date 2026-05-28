# Evidence — Angular-emit proving slice

Raw measurements and observations from the proving slice. **This document locks before VERDICT.md is authored** (per absorbed review #9 — pass-pressure mitigation). The verdict reads the evidence and judges; the evidence cannot reshape to match a desired verdict.

> **STATUS:** scaffold — fills in as each measurement lands. Once all sections have content (or explicit "not run"), this document is locked and `VERDICT.md` authoring begins.

## 1. Catalog state at emission time

- **Catalog commits**: <!-- list haven-ui commits up to emission run -->
- **Registry items**: 13 (5 component primitives + 7 patterns + 1 data binding)
- **Primitive count locked at**: <!-- count -->
- **REGISTRY.md hash**: <!-- short SHA of REGISTRY.md -->

## 2. Phase 0 sandbox (basis verification)

- **Run date**: 2026-05-28 (Aaron, local terminal)
- **Workspace**: `/tmp/angular-eval/ng21-zard-sandbox/`
- **Angular version**: 21.2.13 (CLI scaffold)
- **ZardUI version installed**: zard-cli@1.0.0-beta.70 + library version landed by zard-cli init
- **Build result**: ✓ ng build clean (2.388s; 235.08 kB initial; 62.67 kB transferred)
- **Typecheck result**: ✓ npx tsc --noEmit clean
- **Notes**: TS 6.0.3 vs ZardUI's TS did not bite (blocker #2 cleared). zard-cli's "Failed to read version from package.json" warning is non-fatal cosmetic.

## 3. Mechanical evidence gate setup (baseline)

- **Workspace**: `/tmp/cena-evidence-gate/`
- **Setup script**: [`evidence-gate/setup.sh`](./evidence-gate/setup.sh)
- **Baseline acceptance** (catalog source under Andrey's config, no emission yet):
  - `npm install` exit: <!-- 0/N -->
  - `npx tsc --noEmit` exit: <!-- 0/N -->
  - `npx ng test --watch=false` exit: <!-- 0/N -->
- **Setup observations**: <!-- peer-dep warnings, missing @dataconnect/generated path, TS-version friction -->

## 4. E1 emission — Care-team messages

- **Target path**: `/tmp/cena-evidence-gate/src/app/care-team/messages/`
- **Catalog patterns applied**: list-stream, event-mutation, data-connect-binding (Messages reference impl)
- **Catalog primitives invoked**: button, input, form (compose-bar uses these)
- **Andrey-anchor**: `cena-health-spark/patients/src/app/care-team/messages/{messages,compose-bar}.component.ts`
- **Measurements**:
  - Primitives invoked count: <!-- N -->
  - LOC emitted: <!-- N -->
  - Preference-ledger rows touched: <!-- list of #s -->
  - Emission-phase transcript steps: <!-- N -->
- **Mechanical gate results**:
  - `npx tsc --noEmit` exit: <!-- 0/N -->
  - `npx ng test --watch=false` exit: <!-- 0/N -->
- **Tripwire scan after E1**:
  - `python3 .claude/scripts/invariants.py` exit: <!-- 0/N -->
  - Per-tripwire status: <!-- row #5/#13/#16 each PASS or FAIL with row reason -->

## 5. E2 emission — Profile/preferences

- **Target path**: `/tmp/cena-evidence-gate/src/app/profile/`
- **Catalog patterns applied**: detail-view, event-mutation, data-connect-binding (Profile reference impl)
- **Catalog primitives invoked**: button, input, form, card (multi-card sections)
- **Andrey-anchor**: `cena-health-spark/patients/src/app/profile/{profile,personal-info-card,food-preferences-edit,delivery-note-edit}.component.ts`
- **NEW pattern entries authored during E2 emission**: <!-- should be ZERO per SC #3 -->
- **Measurements**:
  - Primitives invoked count: <!-- N (compare against E1) -->
  - LOC emitted: <!-- N -->
  - Preference-ledger rows touched: <!-- list of #s -->
  - Emission-phase transcript steps: <!-- N -->
- **Falsifiable SC #4 check**:
  - E2 primitive count ≥ E1 primitive count: <!-- yes/no -->
  - E2 emission cost < E1 emission cost (LOC + ledger rows + transcript steps): <!-- yes/no -->
- **Mechanical gate results**:
  - `npx tsc --noEmit` exit: <!-- 0/N -->
  - `npx ng test --watch=false` exit: <!-- 0/N -->
- **Tripwire scan after E2**:
  - `python3 .claude/scripts/invariants.py` exit: <!-- 0/N -->
  - Per-tripwire status: <!-- row #5/#13/#16 each PASS or FAIL -->

## 6. Tripwire falsifiability evidence

- **Tripwires defined**: 3 across blast-radius tiers (config row #16, porter-rule row #5, structural row #13)
- **Falsifiability run date**: 2026-05-28
- **Plant phase result**: each tripwire fired with its row reason against the corresponding fixture:
  - `cena-angular-zoneless-config-row16` — 2 violations on `fixture-config-row16-violation.ts`
  - `cena-angular-control-flow-row5` — 3 violations on `fixture-template-row5-violation.html` (2 real + 1 in-comment self-reference)
  - `cena-angular-dc-tier-row13` — 1 violation on `fixture-structural-row13-violation.component.ts`
- **Allow-list phase result**: all 4 invariants PASS (3 new Cena Angular + original no-sweep-staging-instruction)
- **Vault commit**: `9f8390d` (configs); haven-ui commit: `2c36a7a` (fixtures)

## 7. Review layer — Andrey's seat (taste/style)

- **Dispatch date**: <!-- YYYY-MM-DD -->
- **Reviewer agent**: fresh-context Claude subagent (opus), unprimed
- **Findings file**: <!-- review-layers/andrey-seat-findings-YYYY-MM-DD.md -->
- **Verdict per file**: <!-- per file -->
- **Per-file findings count** (likely-grimace / probably-fine / unclear): <!-- N/N/N -->
- **Overall verdict**: <!-- ship / iterate / block -->
- **Honest limit acknowledged**: same-model simulation, not Andrey
- **Aaron's dispositions**: <!-- per finding: absorb / defer / reject -->

## 8. Review layer — Angular Structural Skeptic

- **Dispatch date**: <!-- YYYY-MM-DD -->
- **Reviewer agent**: fresh-context Claude subagent (opus), unprimed
- **Findings file**: <!-- review-layers/angular-structural-findings-YYYY-MM-DD.md -->
- **Findings by category** (CD ordering / DI scoping / route composition / lazy-loading / test harness / HttpClient / signal-RxJS bridging): <!-- counts -->
- **Severity breakdown** (blocker / concern / nit): <!-- counts -->
- **Overall verdict**: <!-- ship / iterate / block -->
- **Aaron's dispositions**: <!-- per finding -->

## 9. Review layer — Mechanical evidence gate (binary)

- **Final run date**: <!-- YYYY-MM-DD -->
- **`npx tsc --noEmit` on E1+E2 together**: <!-- 0/N -->
- **`npx ng test --watch=false` on E1+E2 together**: <!-- 0/N -->
- **Tripwires final scan**: <!-- 0/N -->
- **Binary verdict**: <!-- PASS / FAIL -->

## 10. Cross-cutting observations (non-criterion)

<!-- Things noticed during the proving run that don't satisfy a specific SC but are worth knowing:
- Catalog pattern friction observed during emission
- ZardUI primitives that didn't fit cleanly and were adjusted
- Preference-ledger rows that emerged as ambiguous or underspecified
- Data-connect-binding shape surprises
- Unexpected dependencies between catalog items
-->

## Lock

<!-- When all sections above have content (or explicit "not run" markers with reasons), lock this document. After lock, NO further edits to EVIDENCE.md. VERDICT.md authors against this frozen state.
Lock signature: -->

- **Locked at**: <!-- ISO 8601 timestamp -->
- **Locked by**: <!-- author -->
- **Hash at lock time**: <!-- short SHA of this file at lock -->
