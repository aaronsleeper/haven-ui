# Tripwire fixtures

This directory holds **planted-violation files** — concrete examples of the failure modes the proving-slice's three invariant tripwires catch. They serve two purposes:

1. **Falsifiability evidence.** Each tripwire was proven to fire against the corresponding fixture before being committed (SC #5 of the proving slice). The captured detector output is recorded in the proving slice plan's Completion Notes.
2. **Teaching examples.** Anyone reading the catalog or contributing emission code can see exactly what each banned pattern looks like.

## Why these files exist with violations

The three tripwires live in `.claude/config/invariant-patterns.json`:

| Tripwire | Row | Blast tier | Banned pattern |
|---|---|---|---|
| `cena-angular-zoneless-config-row16` | #16 | `config` | `provideZoneChangeDetection` (zoneful) |
| `cena-angular-control-flow-row5` | #5 | `porter-rule` | `*ngIf` / `*ngFor` (legacy structural directives) |
| `cena-angular-dc-tier-row13` | #13 | `structural` | Importing `DataConnectService` from a component file |

Each fixture below contains exactly the banned pattern for its row. Each fixture path is added to the corresponding tripwire's `allow_files` so production scans pass — but the file itself remains as the proof that the tripwire CAN catch the violation when it appears in real emitted code.

## Files

- [`fixture-config-row16-violation.ts`](./fixture-config-row16-violation.ts) — uses `provideZoneChangeDetection`
- [`fixture-template-row5-violation.html`](./fixture-template-row5-violation.html) — uses `*ngIf`
- [`fixture-structural-row13-violation.component.ts`](./fixture-structural-row13-violation.component.ts) — imports `DataConnectService` from a component

## How to re-verify falsifiability

To re-prove the tripwires catch their violations after a config change:

```bash
# Temporarily remove the fixture paths from allow_files in invariant-patterns.json
python3 .claude/scripts/invariants.py
# Observe each tripwire FAIL with its row reason
# Restore allow_files
python3 .claude/scripts/invariants.py
# Observe PASS
```

## Why this isn't a `rm` candidate

These files are committed evidence. They are NOT scratch files to be deleted. The proving-slice's SC #5 depends on their presence + the corresponding `allow_files` exemptions for the tripwires to be both falsifiable AND non-disruptive.
