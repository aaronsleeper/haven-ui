# doc-emit spike

Proves the **content↔component seam** for a haven-ui documentation-site emitter: portable markdown + a nav manifest → build-time AST rewrite → static HTML styled entirely by haven-ui semantic classes + tokens. The haven-ui analogue of Mintlify's `components` prop, but emitting static HTML instead of serialized React.

Full research context: `Vaults/workflows/ui-development/doc-site-generation-research.md`.

## What it proves

- **Content carries zero styling.** `content/*.md` is plain markdown + a few directives (`:::callout`, `:::card`, `:badge[]`). No classes, no haven-ui markup, no imports.
- **The seam is one file.** `handlers.mjs` maps content nodes → haven-ui markup. Two kinds, mirroring Mintlify:
  - authored components — `:::callout` → `.alert`, `:::card` → `.card`, `:badge[]` → `.badge`
  - markdown primitives — table → `.data-table`, `h2` → `.section-title`, inline `code`, links
- **Swap = reskin, zero content edits.** Rebind a directive in `handlers.mjs` (e.g. `callout` → `.card` with a colored left border instead of `.alert`), re-emit, and every callout site-wide reskins. The `.md` files never change. This is the property the whole exercise exists to demonstrate.
- **The manifest is authoritative for routing** (`nav.json`), exactly like Mintlify's `docs.json` — a content file absent from the manifest is not emitted (the emitter reports orphans).

## Architecture (tiers)

| Tier | File | Brand judgment? |
| --- | --- | --- |
| Content | `content/*.md` + `nav.json` | none |
| Compile | `emit.mjs` (remark/rehype) | none |
| **Seam** | **`handlers.mjs`** | **all of it** |
| Shell | `shell.mjs` (nav walk + chrome) | almost none |

Only the seam is swappable and brand-bearing. Everything else is correctness-only plumbing.

## Two emit modes

```bash
cd spikes/doc-emit
npm install                          # isolated; spikes/* is outside the pnpm workspace

# devserver mode — Vite + Tailwind compile components.css live (fast iteration)
node emit.mjs                        # -> packages/design-system/pattern-library/_docs-spike/*.html
pnpm --filter @haven/design-system dev
# open http://localhost:5173/pattern-library/_docs-spike/getting-started.html

# standalone mode — self-contained bundle, NO toolchain on the consumer side
bash build-bundle.sh                 # build DS, bundle CSS+fonts, emit -> dist/
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
