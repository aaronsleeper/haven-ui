#!/usr/bin/env node
// ============================================================================
// resolve-diagram-directives.mjs — pre-pandoc runner for :::diagram directives.
// ============================================================================
//
// Walks an input markdown file, finds each :::diagram{workflow="<slug>"} block,
// resolves slug→source via diagram-aliases.json, renders the standalone HTML
// via spec_from_markdown.py | spec_to_haven_svg.mjs, screenshots it to PNG via
// Chrome headless, reads manifest.md for title/description, and rewrites the
// block's attributes inline so the pandoc Lua filter (haven-directives.lua)
// has png_path + title + description when it emits the figure.
//
// HTML emission does NOT use this runner — surface-emit's handlers.mjs has a
// resolveDiagramPlaceholders rehype plugin that handles the HTML surface
// in-process. This runner is the DOCX-side pre-step.
//
// Usage:
//   node resolve-diagram-directives.mjs \
//     --input  /abs/path/sop-source.md \
//     --output /abs/path/sop-resolved.md \
//   [ --cache-dir /abs/path/_diagram-cache ]
//
// The cache directory holds <slug>.html (the standalone Chrome screenshots
// from) and <slug>.png (what Lua filter embeds). Re-runs reuse cached outputs;
// pass --force to regenerate.
//
// Per sop-diagram-embedding.md Q3 (emit-time resolution) + HVD §2.2.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve, relative, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import matter from 'gray-matter';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---- arg parsing -----------------------------------------------------------
function parseArgs(argv) {
  const args = { force: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--input') args.input = argv[++i];
    else if (a === '--output') args.output = argv[++i];
    else if (a === '--cache-dir') args.cacheDir = argv[++i];
    else if (a === '--force') args.force = true;
    else if (a === '--help' || a === '-h') {
      console.log(`Usage: resolve-diagram-directives.mjs --input <md> --output <md> [--cache-dir <dir>] [--force]`);
      process.exit(0);
    } else {
      console.error(`Unknown arg: ${a}`);
      process.exit(64);
    }
  }
  if (!args.input || !args.output) {
    console.error('Required: --input <md> --output <md>');
    process.exit(64);
  }
  args.input = resolve(args.input);
  args.output = resolve(args.output);
  args.cacheDir = args.cacheDir
    ? resolve(args.cacheDir)
    : resolve(dirname(args.output), '_diagram-cache');
  return args;
}

// ---- alias resolution ------------------------------------------------------
const ALIASES_PATH = resolve(__dirname, 'diagram-aliases.json');
function loadAliases() {
  if (!existsSync(ALIASES_PATH)) {
    throw new Error(`diagram-aliases.json missing at ${ALIASES_PATH}`);
  }
  const raw = JSON.parse(readFileSync(ALIASES_PATH, 'utf8'));
  // Drop the _comment helper key
  const { _comment, ...aliases } = raw;
  return aliases;
}

// ---- spec render -----------------------------------------------------------
const SPEC_FROM_MARKDOWN = resolve(__dirname, 'spec_from_markdown.py');
const SPEC_TO_HAVEN_SVG = resolve(__dirname, 'spec_to_haven_svg.mjs');
const HAVEN_CSS_BUNDLE = resolve(__dirname, '../../handoff/cena-sot/assets/haven.css');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

function renderStandalone(sourceDir) {
  const specJson = execFileSync('python3', [SPEC_FROM_MARKDOWN, '--json', sourceDir], {
    encoding: 'utf8',
  });
  const html = execFileSync('node', [SPEC_TO_HAVEN_SVG], {
    input: specJson,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  });
  return html;
}

// Rewrite the standalone's source-tree CSS link to the built Cena bundle so
// Chrome can render it without traversing the haven-ui source tree. Mirrors
// the pre-process in diagram-emit.sh; preserved here for self-containment.
function rewriteCssLink(html) {
  if (!existsSync(HAVEN_CSS_BUNDLE)) {
    console.warn(`[runner] haven.css bundle missing at ${HAVEN_CSS_BUNDLE}; PNG render may be unstyled`);
    return html;
  }
  const cssUrl = 'file://' + HAVEN_CSS_BUNDLE;
  return html.replace(
    /<link[^>]*rel="stylesheet"[^>]*href="[^"]*main\.css"[^>]*>/,
    `<link rel="stylesheet" href="${cssUrl}">`
  );
}

function screenshotToPng(htmlPath, pngPath) {
  if (!existsSync(CHROME)) {
    throw new Error(`Chrome not found at ${CHROME}`);
  }
  execFileSync(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      '--window-size=1800,1200',
      '--virtual-time-budget=5000',
      `--screenshot=${pngPath}`,
      `file://${htmlPath}`,
    ],
    { stdio: ['ignore', 'ignore', 'ignore'] }
  );
  if (!existsSync(pngPath)) {
    throw new Error(`Chrome failed to produce ${pngPath}`);
  }
}

// ---- directive walking + rewrite -------------------------------------------
// Match :::diagram{...} fenced directives. Block form: `:::diagram{key="val"}`
// followed by optional inner content + a `:::` closing fence on its own line.
// v1 supports the empty-content shape (no inner body); future shapes can wrap
// caption overrides here.
//
// Use [ \t]* (horizontal-only whitespace) before $ so the line-trailing
// whitespace match doesn't consume the post-block blank line. \s*$ would eat
// the newline and the blank line, breaking pandoc's fenced-div recognition
// (pandoc requires a blank line after the closing fence).
const DIAGRAM_BLOCK_RE = /^:::diagram\{([^}]*)\}[ \t]*$([\s\S]*?)^:::[ \t]*$/gm;

function parseAttrs(attrStr) {
  const out = {};
  // Tokenize key="val" pairs; tolerate spaces between tokens.
  const re = /([a-zA-Z_][a-zA-Z0-9_-]*)\s*=\s*"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = re.exec(attrStr)) !== null) {
    out[m[1]] = m[2];
  }
  return out;
}

function serializeAttrs(attrs) {
  return Object.entries(attrs)
    .map(([k, v]) => `${k}="${String(v).replace(/"/g, '\\"')}"`)
    .join(' ');
}

// Pandoc's fenced-div syntax for an attributed block is `::: {.class key="v"}`
// — the class name must carry a leading dot, and the brace block stands alone.
// The remark-directive author syntax `:::diagram{key="v"}` folds the brace
// expression into the class name when pandoc parses it (verified 2026-06-06),
// so the runner emits pandoc-compatible form here. The HTML side reads the
// author syntax directly through remark-directive — no rewrite needed there.
function serializePandocOpen(className, attrs) {
  const rest = serializeAttrs(attrs);
  return `::: {.${className}${rest ? ' ' + rest : ''}}`;
}

function processMarkdown(markdown, args, aliases) {
  return markdown.replace(DIAGRAM_BLOCK_RE, (_match, attrStr) => {
    const attrs = parseAttrs(attrStr);
    const slug = attrs.workflow;
    if (!slug) {
      console.warn('[runner] :::diagram missing workflow= attribute; leaving as-is');
      return _match;
    }
    const sourceDir = aliases[slug];
    if (!sourceDir) {
      console.warn(`[runner] :::diagram unknown workflow slug: ${slug}; leaving as-is`);
      return _match;
    }
    const manifestPath = join(sourceDir, 'manifest.md');
    if (!existsSync(manifestPath)) {
      console.warn(`[runner] manifest.md missing for ${slug} at ${manifestPath}; leaving as-is`);
      return _match;
    }
    const { data: meta } = matter(readFileSync(manifestPath, 'utf8'));
    const title = meta.title || slug;
    const description = meta.description || '';

    const cacheHtml = join(args.cacheDir, `${slug}.html`);
    const cachePng = join(args.cacheDir, `${slug}.png`);
    const cacheFresh = !args.force && existsSync(cacheHtml) && existsSync(cachePng);

    if (!cacheFresh) {
      console.log(`[runner] rendering ${slug} → ${cacheDir(args)}`);
      const standalone = rewriteCssLink(renderStandalone(sourceDir));
      writeFileSync(cacheHtml, standalone);
      screenshotToPng(cacheHtml, cachePng);
    } else {
      console.log(`[runner] cached ${slug}`);
    }

    const rewritten = {
      workflow: slug,
      png_path: relative(dirname(args.output), cachePng),
      title,
      description,
    };
    return `${serializePandocOpen('diagram', rewritten)}\n:::`;
  });
}

function cacheDir(args) {
  return relative(process.cwd(), args.cacheDir) || args.cacheDir;
}

// ---- main ------------------------------------------------------------------
function main() {
  const args = parseArgs(process.argv);
  if (!existsSync(args.input)) {
    console.error(`Input not found: ${args.input}`);
    process.exit(66);
  }
  mkdirSync(args.cacheDir, { recursive: true });
  mkdirSync(dirname(args.output), { recursive: true });
  const aliases = loadAliases();
  const input = readFileSync(args.input, 'utf8');
  const output = processMarkdown(input, args, aliases);
  writeFileSync(args.output, output);
  console.log(`[runner] wrote ${basename(args.output)}`);
}

main();
