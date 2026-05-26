// ============================================================================
// EMIT CORE — DS-agnostic. Consumes a binding (the seam) + a surface config
// (content + chrome) and emits self-contained static HTML. One engine; the
// three prior emitters (doc-emit / SoT pandoc / reasoning hand-built) become
// configs of this. Per ~/.claude/plans/surface-emission-convergence.md.
//
//   SURFACE=docs | sot   (default docs)
//   MODE=devserver | standalone  (default devserver)
// ============================================================================

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import matter from 'gray-matter';

import { havenBinding } from './handlers.mjs';
import { renderPage } from './shell.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MODE = process.env.MODE === 'standalone' ? 'standalone' : 'devserver';
const SURFACE = process.env.SURFACE || 'docs';

// Build the processor from the BINDING (DS-agnostic core; haven-specific plugins
// come from the binding). Swap the binding -> a different design system.
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkDirective);
for (const p of havenBinding.remarkPlugins) processor.use(p);
processor.use(remarkRehype, { allowDangerousHtml: true });
for (const p of havenBinding.rehypePlugins) processor.use(p);
processor.use(rehypeStringify, { allowDangerousHtml: true });

function renderMarkdown(md) {
  const { content, data } = matter(md);
  return { html: processor.processSync(content).toString(), frontmatter: data };
}

// ---- surface configs (each = a consumer; zero bespoke emitter code) --------
const SOT_REPO = '/Users/aaronsleeper/Vaults/Knowledge/Projects/Cena Health/Partners/UCONN Health';
const SURFACES = {
  docs: {
    chrome: 'sidebar',
    manifest: JSON.parse(readFileSync(resolve(__dirname, 'nav.json'), 'utf8')),
    pages: null, // derived from manifest below
    contentDir: resolve(__dirname, 'content'),
    devOut: resolve(__dirname, '../../packages/design-system/pattern-library/_docs-spike'),
    standaloneOut: resolve(__dirname, 'dist'),
  },
  // READ-ONLY coverage proof against the real shipped SoT markdown. Writes only
  // to the spike's own dist-sot/ — the live uconn-pilot-docs surface/ + PR are
  // NOT touched (that swap is convergence-plan step 4, gated on Aaron's review).
  sot: {
    chrome: 'surface',
    manifest: { title: 'UConn Pilot — Source of Truth' },
    chromeConfig: {
      banner: '<strong>UConn Pilot — Source of Truth.</strong> Read-only surface (converged-engine coverage proof). Generated from the canonical SoT markdown — a <em>view</em>, not a copy. Legend: <span class="badge badge-success">decided</span> <span class="badge badge-warning">deferred</span> <span class="badge badge-info">open</span>.',
      nav: [
        { href: './index.html', label: 'Source of Truth' },
        { href: './timeline.html', label: 'Launch Timeline & Gates' },
      ],
    },
    pages: [
      { slug: 'index', srcAbs: `${SOT_REPO}/UConn Pilot — Source of Truth.md`, title: 'UConn Pilot — Source of Truth' },
      { slug: 'timeline', srcAbs: `${SOT_REPO}/Launch Timeline — Inference & Gates.md`, title: 'Launch Timeline & Gates' },
    ],
    contentDir: null,
    devOut: resolve(__dirname, '../../packages/design-system/pattern-library/_sot-spike'),
    standaloneOut: resolve(__dirname, 'dist-sot'),
  },
  // The cena-reasoning surface re-expressed as a CONSUMER of the engine (was
  // hand-built HTML). Proof that the third emitter folds in too. Content slice
  // is representative (full transcription is mechanical remaining work).
  reason: {
    chrome: 'surface',
    manifest: { title: 'Cena — Reasoning Surface' },
    chromeConfig: {
      banner: '<strong>Patient-app reasoning.</strong> A surface that shows the thinking and makes each decision pokeable — open the disclosures, push where it’s soft. A <em>view</em> of the real plans, generated, not hand-built.',
      nav: [],
    },
    pages: [{ slug: 'index', title: 'Reasoning Surface' }],
    contentDir: resolve(__dirname, 'content-reason'),
    devOut: resolve(__dirname, '../../packages/design-system/pattern-library/_reason-spike'),
    standaloneOut: resolve(__dirname, 'dist-reason'),
  },
};

const cfg = SURFACES[SURFACE];
if (!cfg) { console.error(`unknown SURFACE=${SURFACE}`); process.exit(1); }

const pages = cfg.pages || cfg.manifest.nav.flatMap((g) => g.pages);
const OUT_DIR = MODE === 'standalone' ? cfg.standaloneOut : cfg.devOut;
mkdirSync(OUT_DIR, { recursive: true });

for (const page of pages) {
  const src = page.srcAbs || resolve(cfg.contentDir, `${page.slug}.md`);
  const md = readFileSync(src, 'utf8');
  const { html, frontmatter } = renderMarkdown(md);
  const out = renderPage({
    chrome: cfg.chrome,
    chromeConfig: cfg.chromeConfig,
    manifest: cfg.manifest,
    slug: page.slug,
    title: frontmatter.title || page.title,
    description: frontmatter.description,
    bodyHtml: html,
    mode: MODE,
    proseCss: havenBinding.proseCss,
  });
  writeFileSync(resolve(OUT_DIR, `${page.slug}.html`), out, 'utf8');
  console.log(`  emitted  ${SURFACE}/${page.slug}.html  (${MODE}; ${html.length} bytes body)`);
}
console.log(`\nEmitted ${pages.length} page(s) [surface=${SURFACE}] -> ${OUT_DIR}`);
