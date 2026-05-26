// ============================================================================
// EMIT PIPELINE — portable content + nav manifest -> static haven-ui HTML
// ============================================================================
// Fixed plumbing: read manifest -> for each page, parse markdown -> run the seam
// (directives + primitives) -> stringify HTML -> wrap in shell -> write static file.
// The only brand-bearing step is handlers.mjs (the seam). Everything here is
// correctness-only: no taste, no brand judgment. Mirrors Mintlify's build-time
// serialize() step, but emitting static HTML instead of serialized React.

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import matter from 'gray-matter';

import { havenDirectives, havenPrimitives } from './handlers.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = resolve(__dirname, 'content');
const OUT_DIR = resolve(__dirname, '../../packages/design-system/pattern-library/_docs-spike');

const manifest = JSON.parse(readFileSync(resolve(__dirname, 'nav.json'), 'utf8'));

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkDirective)
  .use(havenDirectives) // SEAM: authored components
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(havenPrimitives) // SEAM: markdown primitives
  .use(rehypeStringify, { allowDangerousHtml: true });

function renderMarkdown(md) {
  const { content, data } = matter(md);
  const html = processor.processSync(content).toString();
  return { html, frontmatter: data };
}

async function main() {
  const { renderPage } = await import('./shell.mjs');
  mkdirSync(OUT_DIR, { recursive: true });

  // Drive emission from the manifest (manifest is authoritative for routing,
  // exactly like Mintlify's docs.json — a page absent here is not emitted).
  const pages = manifest.nav.flatMap((g) => g.pages);
  for (const page of pages) {
    const md = readFileSync(resolve(CONTENT_DIR, `${page.slug}.md`), 'utf8');
    const { html, frontmatter } = renderMarkdown(md);
    const out = renderPage({
      manifest,
      slug: page.slug,
      title: frontmatter.title || page.title,
      description: frontmatter.description,
      bodyHtml: html,
    });
    writeFileSync(resolve(OUT_DIR, `${page.slug}.html`), out, 'utf8');
    console.log(`  emitted  _docs-spike/${page.slug}.html  (${html.length} bytes of body)`);
  }

  // Report any content files NOT in the manifest (would be silently dropped — same
  // contract Mintlify enforces; surfaced here so it is visible, not hidden).
  const contentFiles = readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''));
  const orphans = contentFiles.filter((s) => !pages.some((p) => p.slug === s));
  if (orphans.length) console.log(`  note: ${orphans.length} content file(s) not in manifest, not emitted: ${orphans.join(', ')}`);

  console.log(`\nEmitted ${pages.length} page(s) -> ${OUT_DIR}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
