#!/usr/bin/env node
// Focused exemplar renderer — wraps one SoP markdown file in a minimal
// document-shell HTML page with the haven.css bundle linked. Used for the
// :::diagram pilot preview; NOT a general-purpose pipeline. Once the SoP HTML
// surface graduates from approval-deferred, this should fold back into
// emit.mjs's surface configs.
//
// Usage: node _render-exemplar.mjs --input <md> --output <html>

import { readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'node:fs';
import { dirname, basename, resolve, relative } from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import matter from 'gray-matter';

import { havenBinding } from './handlers.mjs';

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : fallback;
}

const input = resolve(arg('--input'));
const output = resolve(arg('--output'));
mkdirSync(dirname(output), { recursive: true });

const raw = readFileSync(input, 'utf8');
const { content, data } = matter(raw);

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkDirective);
for (const p of havenBinding.remarkPlugins) processor.use(p);
processor.use(remarkRehype, { allowDangerousHtml: true });
for (const p of havenBinding.rehypePlugins) processor.use(p);
processor.use(rehypeStringify, { allowDangerousHtml: true });

const body = processor.processSync(content).toString();

const docTitle = data.role
  ? `${data.role} — ${data.type || 'Standard Operating Procedure'}`
  : basename(input, '.md');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${docTitle}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Source+Sans+3:ital,wght@0,300..900;1,300..900&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap" />
<link rel="stylesheet" href="./assets/haven.css" />
<style>
  body { margin: 0; background: var(--color-surface-page, #fbfaf8); }
</style>
</head>
<body>
<main class="document-shell">
${body}
</main>
</body>
</html>
`;

writeFileSync(output, html);

// Copy haven.css bundle alongside the output so the page is self-contained.
const havenCss = resolve(dirname(output), 'assets/haven.css');
mkdirSync(dirname(havenCss), { recursive: true });
const sourceCss = resolve(import.meta.dirname, 'dist-sot/assets/haven.css');
copyFileSync(sourceCss, havenCss);

console.log(`wrote ${output}`);
console.log(`copied ${relative(process.cwd(), havenCss)}`);
