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

## Run

```bash
cd spikes/doc-emit
npm install                       # isolated; spikes/* is outside the pnpm workspace
node emit.mjs                     # -> packages/design-system/pattern-library/_docs-spike/*.html
# serve via the design-system dev server (Vite + Tailwind compile the haven-ui CSS):
pnpm --filter @haven/design-system dev
# open http://localhost:5173/pattern-library/_docs-spike/getting-started.html
```

## Status & limits

- **Spike, not product.** Hardcoded 2-page sample; no search, no versions/i18n, no OpenAPI, no incremental build.
- **Render depends on the design-system dev server** to compile `components.css` (`@apply` + Tailwind v4). True standalone static emission (linking a pre-compiled CSS bundle + bundled fonts, self-contained per the handoff rule) is the next step — not proven here.
- Emitted output is gitignored (regenerate with `node emit.mjs`).
- Isolated from the pnpm workspace on purpose (`spikes/` is not a workspace glob), so its deps never touch the haven-ui lockfile.
