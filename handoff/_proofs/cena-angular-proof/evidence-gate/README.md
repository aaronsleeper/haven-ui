# Mechanical evidence gate

The proving slice's SC #2, #3, and #5 require the emitted E1/E2 code to typecheck + run specs against **Andrey's actual Angular configuration**. This directory holds the setup procedure + acceptance criteria for that mechanical gate.

## What it is

A temp Angular workspace assembled from:

1. `cena-health-spark/patients/package.json` — Andrey's dep tree (Angular 21.2.13 + Firebase Data Connect + ng-icons + ...)
2. `cena-health-spark/patients/tsconfig.app.json` + base `tsconfig.json` — his compiler config
3. `cena-health-spark/patients/angular.json` (or minimal subset) — Angular workspace config
4. His generated `@dataconnect/generated` types (copied from his `node_modules/`) — required for catalog binding code to resolve types
5. `@cena/catalog-ui` source (copied from `Lab/haven-ui/packages/angular-patterns/src/`)
6. Emitted E1/E2 code (lands during emission runs)

`ng test --watch=false` + `npx tsc --noEmit` run against (5) + (6) under (1)–(4). Pass/fail is machine-falsifiable — the gate the skeptic cannot fake.

## Why Aaron runs this in his terminal

`npm install` is harness-gated for in-thread + subagent execution (verified during the Phase 0 sandbox run: even `dangerouslyDisableSandbox` did not unblock it). Aaron has terminal access; the install completes in seconds vs. minutes of harness-gate-friction.

## Setup procedure

Once E1 emission is ready, run:

```bash
bash Lab/haven-ui/handoff/_proofs/cena-angular-proof/evidence-gate/setup.sh
```

The script:

1. Creates a fresh workspace at `/tmp/cena-evidence-gate/` (idempotent — re-running cleans the previous workspace via `mv` to a `.delete` sibling, per the reversibility-gate convention)
2. Copies Andrey's package.json + tsconfig.app.json + tsconfig.json from `Lab/cena-health-spark/patients/`
3. Copies his `node_modules/@dataconnect/generated/` (required for type resolution; cannot regenerate without his Firebase Data Connect CLI auth)
4. Runs `npm install` to materialize the rest of his dep tree
5. Copies `@cena/catalog-ui` source from `Lab/haven-ui/packages/angular-patterns/src/` into `/tmp/cena-evidence-gate/src/lib/catalog-ui/`
6. Runs baseline `tsc --noEmit` (empty-emission state) to verify the workspace builds clean before any emitted code lands

## Acceptance criteria (baseline)

Before any E1/E2 emission runs are added to the workspace, the baseline gate must:

- ✓ `npm install` exits 0 with no peer-dep errors
- ✓ `npx tsc --noEmit` exits 0 (catalog source typechecks against Andrey's tsconfig)
- ✓ `npx ng test --watch=false` runs (no tests yet — succeeds with "no specs found" or similar)

If the baseline fails:

- **npm peer-dep errors** → likely the version pin in `@cena/catalog-ui` package.json drift from Andrey's actual version. Reconcile against `cena-health-spark/patients/package.json` and update `@cena/catalog-ui/package.json` peer-deps.
- **tsc errors in catalog source** → typically a TS-version mismatch (TS 6.0.3 vs ZardUI's 5.9.3) or a missing `@dataconnect/generated` import. Either bump TS or stub the missing generated types from Andrey's usage.
- **ng test fails to bootstrap** → likely a missing testing dependency (zone.js for jasmine — note: zoneless apps can still use zone.js for tests; the test harness lives separately from the app's CD strategy).

## Acceptance criteria (emission)

When E1/E2 emission lands in this workspace:

- ✓ `npx tsc --noEmit` exits 0 (emitted code typechecks)
- ✓ `npx ng test --watch=false` passes all specs (smoke tests survive)
- ✓ `python3 .claude/scripts/invariants.py` exits 0 (no tripwires fire on emitted code)

Captured in `EVIDENCE.md` per the proving slice plan.

## Why the gate is the skeptic-can't-fake layer

The "Andrey's seat" + Angular Structural Skeptic review layers catch taste + structural-judgment concerns. The mechanical evidence gate catches what code can falsify: does the emitted code build against Andrey's actual config? Does it typecheck against his actual types? Do the specs run?

Pass/fail is binary and machine-verifiable. There is no opinion to negotiate. That's the layer the proof's credibility leans on.

## Related

- Proving slice plan: `~/.claude/plans/angular-emit-proving-slice.md` (SC #2 + #3 + #5 + #6)
- Tripwire fixtures: `../tripwire-fixtures/` (SC #5 — falsifiability proof)
- Andrey's tree: `Lab/cena-health-spark/patients/` (read-only per audit guardrail)
- Catalog source: `Lab/haven-ui/packages/angular-patterns/`
