# Judgment Framework

## Extract vs keep local

```
Is it used in 2+ apps?
  YES → extract to @ava/ui (component) or @ava/shared (type/util)
  NO  → Is it used 3+ times in one app?
    YES → extract
    NO  → Is it used 2x with identical signature?
      YES → extract
      NO  → keep app-local
```

**Tie-breaker:** When borderline, ask "will the second app need this within 3 months?"
If yes, extract now to avoid divergence.

## Resolving divergent copies

When copies of the same pattern differ:

1. **Catalog all variants** — list every copy with its exact interface/values
2. **Canonical = union** — the canonical version includes all fields/values across copies, with fields not present in all copies marked optional
3. **Divergent values** — pick the value that aligns with existing conventions (e.g., plural form for labels in list contexts). Document the choice
4. **Token-driven over hardcoded** — if copies differ only in color/style, the canonical version uses semantic tokens so the difference resolves through theming, not code

## Where things live

| Type | Package | Path convention |
|---|---|---|
| React component | `@ava/ui` | `packages/ui/src/components/<Name>.tsx` |
| TypeScript interface/type | `@ava/shared` | `packages/shared/src/types/<domain>.ts` |
| Utility function | `@ava/shared` | `packages/shared/src/utils/<name>.ts` |
| Constants/labels | `@ava/shared` | `packages/shared/src/constants/<domain>.ts` |
| CSS tokens | `@ava/ui` | `packages/ui/src/tokens/<layer>.css` |

## Breaking changes

| Change type | Protocol |
|---|---|
| Token rename | Codemod required; update all consumers in same PR |
| Token value change | Non-breaking if semantic meaning preserved |
| Component prop rename | Deprecation period (keep old prop with console.warn) or flag day if pre-MVP |
| Component removal | Flag day only if zero external consumers |
| Interface field addition (optional) | Non-breaking |
| Interface field removal | Breaking -- requires consumer audit |

**Pre-MVP exception:** While @ava/ui has no external consumers beyond the monorepo,
flag-day changes are acceptable. Track when external consumption begins.

## Dark mode migration sequence

1. Define semantic surface tokens (`--color-surface`, `--color-surface-raised`, `--color-surface-muted`, `--color-text-primary`, `--color-text-secondary`)
2. Add corresponding Tailwind classes (`bg-surface`, `bg-surface-raised`, etc.)
3. Migrate components to semantic classes during extraction (never as a separate pass)
4. Add `.dark {}` overrides in `haven.css` when dark mode ships
5. Audit: grep for raw color classes post-migration

**Principle:** Dark mode readiness is a side effect of good token hygiene, not a
separate workstream.

## New token naming

When a new semantic token is needed:

1. Check if an existing token covers the intent (consult `haven.css`)
2. Follow the pattern: `--color-{category}-{variant}` where category is `surface`, `text`, `status`, `border`, `accent`
3. Alias to a palette value, never a raw hex
4. Add to `haven.css` with a comment explaining the semantic intent
