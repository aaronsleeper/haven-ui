# surface-emit — haven static-surface engine

One engine that emits **any** branded, self-contained static surface from portable markdown: markdown (+ manifest) → build-time AST rewrite → static HTML styled entirely by haven-ui semantic classes + tokens. The haven-ui analogue of Mintlify's `components` prop, emitting static HTML instead of serialized React.

**Converged (2026-05-26)** from three independent emitters of the same seam — a doc-site (remark/rehype), the UConn SoT surface (pandoc/Lua), and the cena-reasoning surface (hand-built). One engine now; each surface is a *config*. See `~/.claude/plans/surface-emission-convergence.md` + research context `Vaults/workflows/ui-development/doc-site-generation-research.md`.

## What it proves

- **Content carries zero styling.** Content is plain markdown + directives (`:::callout`, `:::card`, `:badge`, `:::reason`, `:::push`). No classes, no haven markup, no imports.
- **The seam is one binding.** `handlers.mjs` exports `havenBinding` (remark + rehype plugins + prose layer) — content node → haven markup. Two kinds:
  - authored components — `:::callout`→`.alert`, `:::card`→`.card`, `:badge`→`.badge`, `:::reason`→`<details>` disclosure, `:::push`→the "where to push" block
  - markdown primitives — `h1`→`.page-title`, `h2`→`.section-title`, table→`.data-table`, status-cell strong→haven badge (build-time), wikilink-strip, inline `code`, links
- **DS-agnostic core + per-DS binding.** `emit.mjs` is config-driven (`SURFACE`); swap `havenBinding` → a different design system. v1 binding = haven only.
- **Swap = reskin, zero content edits.** Rebind a directive in the binding, re-emit, every site reskins; content `.md` never changes.

## Architecture (tiers)

| Tier | File | Brand judgment? |
| --- | --- | --- |
| Content | `content*/` markdown + `nav.json` | none |
| Compile | `emit.mjs` (DS-agnostic core) | none |
| **Seam (binding)** | **`handlers.mjs` `havenBinding` + `surface-prose.css`** | **all of it** |
| Shell | `shell.mjs` (chrome strategies: sidebar / surface) | almost none |

Only the binding is swappable and brand-bearing. Everything else is correctness-only plumbing.

## Surfaces (each = a config, no bespoke emitter)

| `SURFACE=` | What | Chrome |
| --- | --- | --- |
| `docs` | doc site (sidebar nav from `nav.json`) | sidebar |
| `sot` | UConn Pilot Source-of-Truth (read-only proof on the real markdown) | surface (banner+nav) |
| `reason` | patient-app reasoning surface (`:::reason`/`:::push` disclosures) | surface |

## Two emit modes

```bash
cd tools/surface-emit
npm install                          # isolated; tools/ is outside the pnpm workspace

# devserver mode — Vite + Tailwind compile components.css live (fast iteration)
SURFACE=docs node emit.mjs           # -> packages/design-system/pattern-library/_docs-spike/*.html
pnpm --filter @haven/design-system dev
# open http://localhost:5173/pattern-library/_docs-spike/getting-started.html

# standalone mode — self-contained bundle, NO toolchain on the consumer side
bash build-bundle.sh docs            # SURFACE = docs | sot | reason; build DS, bundle, emit -> dist*/
#   (use --no-build to reuse an existing packages/design-system/dist)
cd dist && python3 -m http.server 8799    # any plain static server works
# open http://localhost:8799/getting-started.html  (no Vite, no Tailwind)
```

`build-bundle.sh` mirrors the production precedent `scripts/handoff-rebuild-bundle.sh`: compiled `haven.css` + FA Pro woff2 binaries copied together, `url(/assets/)` → `url(./)` relativized. Output renders from any static server or `file://`.

## What this resolved — haven-ui's distribution model ("yarn/npm package?")

The standalone mode answers how a consumer gets haven-ui without running its toolchain:

- **In-monorepo consumers (React apps, future ports):** haven-ui already IS a workspace package — `@haven/design-system` / `@haven/ui-react` consumed via the pnpm workspace protocol. No registry publish needed.
- **External / static consumers (a doc site, Andrey's Angular port, any non-toolchain target):** the distribution unit is the **compiled self-contained bundle** (`haven.css` + FA woff2, relativized paths), copied in — *not* an npm install. Both the `handoff/cena-uconn` bundle and this spike consume it that way. A private-registry publish would add a dependency and still require extracting the compiled assets; the copied bundle is simpler and ownership-aligned.
- **The real boundary (the bundle's contract with consumers):** semantic component classes (`.alert`, `.card`, …) are unconditionally in `components.css`, so they always ship. *Utility* classes only ship if Tailwind scanned them at build time. A consumer using a novel utility not in the build's content scan gets a missing class. haven-ui already mitigates this with the `@source inline(...)` **sanctioned utility surface** in `src/styles/main.css` — the declared closed-vocabulary set guaranteed into the bundle for out-of-scan consumers. Doc-site emission should rely on semantic classes + that surface, and grow the surface (or add the emit output to the content scan) when it needs a new utility.

## Status & limits

- **Spike, not product.** Hardcoded 2-page sample; no search, no versions/i18n, no OpenAPI, no incremental build, no link-checking (the handoff build has link-checking; a product emitter should adopt it).
- Both emitted outputs (`dist/`, `_docs-spike/`) are gitignored — regenerate with `node emit.mjs` / `bash build-bundle.sh`.
- Isolated from the pnpm workspace on purpose (`spikes/` is not a workspace glob), so its deps never touch the haven-ui lockfile.
