# Inactive apps — archived

Persona apps moved out of `apps/*` to drop scan time on every conformance gate and remove inert package directories from the workspace glob.

## Contents

| Folder | Original path | Archived | Reason |
|---|---|---|---|
| `kitchen/` | `apps/kitchen/` | 2026-04-23 | Shell stub only; no shipped slice. Last meaningful work was the Apr 18 monorepo restructure. |
| `provider/` | `apps/provider/` | 2026-04-23 | Same as kitchen. |

## To restore

```
git mv archive/inactive-apps/<name> apps/<name>
```

Then:
- Re-add the persona to `RELAXED_ROOTS` in `packages/ui-react/tests/conform/plain-language.ts`
- Re-link the entry card in `packages/design-system/index.html`
- Re-list the dev port in [CLAUDE.md](../../CLAUDE.md)
- Run `pnpm install` to re-add to the workspace

The `git mv` preserves history, so commit log and `git blame` still work after restoration.

## Rule

`archive/` content is frozen — do not modify in-place per `Lab/haven-ui/CLAUDE.md`. Restore first, then edit.
