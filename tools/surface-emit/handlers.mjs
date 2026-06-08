// ============================================================================
// THE SEAM (haven binding) — content primitives -> haven-ui component markup
// ============================================================================
// Converged from three prior implementations (2026-05-25):
//   - doc-emit handlers (remark/rehype, JS)        — callout/card/badge directives
//   - SoT surface.lua (pandoc Lua filter)          — h1/h2/table mappings, status badges
//   - cena-reasoning hand-built <details>          — the :::reason poke disclosure
// One map, one engine (remark/rehype). This is the haven-ui analogue of
// Mintlify's `components` prop: content node-type -> haven markup, build-time.
// Per the convergence plan ~/.claude/plans/surface-emission-convergence.md.

import { visit, SKIP } from 'unist-util-visit';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import matter from 'gray-matter';

const __dirname = dirname(fileURLToPath(import.meta.url));

// :::diagram aliases — workflow slug → use-case directory containing manifest.md
// + fragment markdown files the spec_from_markdown.py loader consumes. Today's
// entries point at content-sot/use-cases/; cena-sot migration updates this table
// per sop-diagram-embedding.md Q4 alias-table delivery.
const DIAGRAM_ALIASES_PATH = resolve(__dirname, 'diagram-aliases.json');
let _diagramAliases = null;
function loadDiagramAliases() {
  if (_diagramAliases) return _diagramAliases;
  if (!existsSync(DIAGRAM_ALIASES_PATH)) {
    _diagramAliases = {};
    return _diagramAliases;
  }
  _diagramAliases = JSON.parse(readFileSync(DIAGRAM_ALIASES_PATH, 'utf8'));
  return _diagramAliases;
}

// Resolve a workflow slug to { sourceDir, title, description } from the alias
// table + manifest.md. Returns null on miss; rehype plugin surfaces a warning.
function resolveDiagramWorkflow(slug) {
  const aliases = loadDiagramAliases();
  const sourceDir = aliases[slug];
  if (!sourceDir) return null;
  const manifestPath = resolve(sourceDir, 'manifest.md');
  if (!existsSync(manifestPath)) return null;
  const { data } = matter(readFileSync(manifestPath, 'utf8'));
  return {
    sourceDir,
    title: data.title || slug,
    description: data.description || '',
  };
}

// Render a workflow source dir to a standalone HTML string by invoking the
// existing spec_from_markdown.py | spec_to_haven_svg.mjs chain synchronously.
// Returns null on render failure; rehype plugin emits the placeholder fallback.
function renderDiagramStandalone(sourceDir) {
  const specToHavenSvg = resolve(__dirname, 'spec_to_haven_svg.mjs');
  const specFromMarkdown = resolve(__dirname, 'spec_from_markdown.py');
  try {
    const specJson = execFileSync('python3', [specFromMarkdown, '--json', sourceDir], {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    const html = execFileSync('node', [specToHavenSvg], {
      input: specJson,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      maxBuffer: 32 * 1024 * 1024,
    });
    return html;
  } catch (err) {
    console.warn(`[haven] :::diagram render failed for ${sourceDir}: ${err.message}`);
    return null;
  }
}

// Escape a string for safe inclusion in an HTML attribute value (srcdoc, etc.).
function htmlAttrEscape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Escape a string for safe inclusion as HTML text content.
function htmlTextEscape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const ALERT_ICON = {
  success: 'circle-check',
  warning: 'triangle-exclamation',
  error: 'circle-xmark',
  info: 'circle-info',
};

function el(hName, properties, children = []) {
  return { type: 'havenElement', data: { hName, hProperties: properties }, children };
}
const icon = (faClasses) => el('i', { className: faClasses }, []);
const text = (value) => ({ type: 'text', value });

// ---------------------------------------------------------------------------
// remark: strip Obsidian wikilinks  [[a|b]] -> b,  [[a]] -> a
// (ported from the SoT build.sh sed step; the SoT markdown is wikilink-heavy)
// ---------------------------------------------------------------------------
export function stripWikilinks() {
  return (tree) => {
    visit(tree, 'text', (node) => {
      node.value = node.value
        .replace(/\[\[[^\]|]*\|([^\]]*)\]\]/g, '$1')
        .replace(/\[\[([^\]]*)\]\]/g, '$1');
    });
  };
}

// ---------------------------------------------------------------------------
// remark: AUTHORED-COMPONENT seam — directive nodes -> haven components
// ---------------------------------------------------------------------------
export function havenDirectives() {
  return (tree) => {
    visit(tree, (node) => {
      if (!['containerDirective', 'leafDirective', 'textDirective'].includes(node.type)) return;

      // :::alert-{info|warning|success|error}{title="..."}  ->  <div class="alert alert-{variant}">
      // Directive names are haven canon per .claude/rules/markdown-directives.md.
      // Hard-renamed from `callout`/`callout-*` 2026-06-08 (Phase B of canon alignment);
      // SoP source content was migrated in the same commit, so no back-compat alias.
      if (node.name === 'alert-info' || node.name === 'alert-warning' ||
          node.name === 'alert-success' || node.name === 'alert-error') {
        const variant = node.name.slice('alert-'.length);
        const title = node.attributes?.title;
        const body = el('div', {}, [
          ...(title ? [el('span', { className: ['font-medium'] }, [text(title + ' ')])] : []),
          ...node.children,
        ]);
        node.children = [icon(['fa-solid', `fa-${ALERT_ICON[variant] || 'circle-info'}`, 'alert-icon']), body];
        node.data = { hName: 'div', hProperties: { className: ['alert', `alert-${variant}`], role: 'alert' } };
        return;
      }

      // :::escalation  ->  <div class="escalation">
      // Single-class haven primitive (brand spec §3.10) — amber-700 left rule on
      // sand-50 bg. Content carries the routing instruction; no extra chrome.
      if (node.name === 'escalation') {
        node.data = { hName: 'div', hProperties: { className: ['escalation'] } };
        return;
      }

      // :::glossary-term  ->  <div class="glossary-term">  (bold term paragraph)
      // :::glossary-def   ->  <div class="glossary-def">   (indented def paragraph)
      // Sequential sibling pairs per brand spec §3.12; visual binding is structural.
      if (node.name === 'glossary-term') {
        node.data = { hName: 'div', hProperties: { className: ['glossary-term'] } };
        return;
      }
      if (node.name === 'glossary-def') {
        node.data = { hName: 'div', hProperties: { className: ['glossary-def'] } };
        return;
      }

      // :::review-marker  ->  <div class="review-marker">
      // Pre-approval scaffolding (brand spec §3.14) — dashed amber-700 left rule on
      // amber-50 bg. Author convention: open with [Needs <reviewer>] prefix.
      if (node.name === 'review-marker') {
        node.data = { hName: 'div', hProperties: { className: ['review-marker'] } };
        return;
      }

      // :::card{title="..." icon="cube"}  ->  <div class="card"> ... </div>
      if (node.name === 'card') {
        const title = node.attributes?.title;
        const ic = node.attributes?.icon;
        const header = el('div', { className: ['card-header'] }, [
          el('h3', { className: ['card-title'] }, [
            ...(ic ? [icon(['fa-solid', `fa-${ic}`, 'mr-2', 'text-primary-500'])] : []),
            text(title || ''),
          ]),
        ]);
        node.children = [...(title ? [header] : []), el('div', { className: ['card-body'] }, node.children)];
        node.data = { hName: 'div', hProperties: { className: ['card'] } };
        return;
      }

      // :badge[Label]{variant="success"}  ->  <span class="badge badge-success">
      if (node.name === 'badge') {
        const variant = node.attributes?.variant || 'primary';
        node.data = { hName: 'span', hProperties: { className: ['badge', `badge-${variant}`] } };
        return;
      }

      // :::push  ->  the amber "where to push" open-question block (reasoning surface)
      if (node.name === 'push') {
        const label = node.attributes?.label || 'Where to push';
        node.children = [
          el('p', { className: ['poke-label'] }, [icon(['fa-solid', 'fa-hand-point-right']), text(' ' + label)]),
          ...node.children,
        ];
        node.data = { hName: 'div', hProperties: { className: ['push-here'] } };
        return;
      }

      // :::diagram{workflow="<slug>"}  ->  placeholder div, resolved post-parse by
      // resolveDiagramPlaceholders rehype plugin. The :::diagram directive is the
      // first resolved-asset directive in the haven vocabulary — its rendered
      // output is a pre-built workflow swim-lane (spec_to_haven_svg.mjs) rather
      // than a styled paragraph. Brand spec §3.13 in Lab/cena-health-brand/specs/
      // haven-directive-styling.md owns the figure-frame layer.
      if (node.name === 'diagram') {
        const slug = node.attributes?.workflow;
        if (!slug) {
          console.warn('[haven] :::diagram missing workflow= attribute');
          return;
        }
        node.data = {
          hName: 'div',
          hProperties: {
            className: ['diagram-figure-placeholder'],
            'data-workflow': slug,
          },
        };
        node.children = [];
        return;
      }

      // :::reason{q="Why X?" source="path" kind="poke|challenge"}  ->  native <details> disclosure
      // (folds the cena-reasoning hand-built poke/challenge block into one directive)
      if (node.name === 'reason') {
        const kind = node.attributes?.kind === 'challenge' ? 'challenge' : 'poke';
        const q = node.attributes?.q || (kind === 'challenge' ? 'Challenge this' : 'Why this approach?');
        const source = node.attributes?.source;
        const chevron = kind === 'challenge' ? 'fa-flag' : 'fa-chevron-right';
        const summary = el('summary', {}, [
          icon(['fa-solid', chevron, 'poke-chevron']),
          text(' ' + q),
        ]);
        const bodyKids = [...node.children];
        if (source) {
          bodyKids.push(el('p', { className: ['poke-label'] }, [text('Source')]));
          bodyKids.push(el('p', { className: ['poke-source'] }, [text(source)]));
        }
        const body = el('div', { className: [kind === 'challenge' ? 'challenge-body' : 'poke-body'] }, bodyKids);
        node.children = [summary, body];
        node.data = { hName: 'details', hProperties: { className: [kind] } };
        return;
      }
    });
  };
}

// ---------------------------------------------------------------------------
// rehype: PRIMITIVE seam — markdown elements -> haven-classed elements
// (merges doc-emit's h2/table/code/a with SoT's h1->page-title)
// ---------------------------------------------------------------------------
export function havenPrimitives() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'h1') addClass(node, 'page-title');        // SoT: content h1 is the title
      if (node.tagName === 'h2') addClass(node, 'section-title');
      if (node.tagName === 'table') {
        // haven .data-table wraps the table in a div (matches surface.lua Table()).
        // Replace in parent + SKIP so the wrapped table isn't re-visited (infinite loop).
        const alreadyWrapped = parent?.tagName === 'div' && (parent.properties?.className || []).includes('data-table');
        if (!alreadyWrapped && parent && typeof index === 'number') {
          parent.children[index] = { type: 'element', tagName: 'div', properties: { className: ['data-table'] }, children: [node] };
          return [SKIP, index];
        }
        return;
      }
      if (node.tagName === 'a') addClass(node, 'text-primary-600', 'underline', 'underline-offset-2');
      if (node.tagName === 'code' && parent?.tagName !== 'pre') {
        addClass(node, 'px-1.5', 'py-0.5', 'rounded', 'bg-sand-100', 'text-sand-800', 'text-sm');
      }
    });
  };
}

// ---------------------------------------------------------------------------
// rehype: HEADING SLUGS — add stable id to h2/h3 from their text, so a sidebar
// (or any link) can deep-link to a section anchor (e.g. #state-ledger). Inline
// (no github-slugger dep): lowercase, drop punctuation, spaces->hyphens.
// ---------------------------------------------------------------------------
function slugify(s) {
  return s.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')   // drop punctuation (commas, ampersands handled as words below)
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
export function havenHeadingSlugs() {
  return (tree) => {
    const seen = new Map();
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'h2' && node.tagName !== 'h3') return;
      node.properties = node.properties || {};
      if (node.properties.id) return;
      let id = slugify(textOf(node));
      if (!id) return;
      const n = seen.get(id) || 0;
      seen.set(id, n + 1);
      node.properties.id = n ? `${id}-${n}` : id;
    });
  };
}

// ---------------------------------------------------------------------------
// rehype: STATUS-BADGE promotion — a <td><strong>decided</strong> -> haven badge
// (ported from the SoT _after.html client JS to BUILD time — no client script)
// ---------------------------------------------------------------------------
const STATUS_KIND = (t) =>
  t.includes('decided') ? 'success' : t.includes('deferred') ? 'warning' : t.includes('open') ? 'info' : null;

export function havenStatusBadges() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'td' && node.tagName !== 'th') return;
      visit(node, 'element', (inner) => {
        if (inner.tagName !== 'strong' && inner.tagName !== 'b') return;
        const t = textOf(inner).toLowerCase();
        const kind = STATUS_KIND(t);
        if (kind) addClass(inner, 'badge', `badge-${kind}`);
      });
    });
  };
}

function textOf(node) {
  if (node.type === 'text') return node.value;
  return (node.children || []).map(textOf).join('');
}
function addClass(node, ...classes) {
  node.properties = node.properties || {};
  node.properties.className = [...(node.properties.className || []), ...classes];
}

// ---------------------------------------------------------------------------
// rehype: RESOLVED-ASSET seam — :::diagram placeholders -> full figure markup
// Walks for <div class="diagram-figure-placeholder" data-workflow="<slug>">,
// resolves slug→use-case dir via diagram-aliases.json, reads manifest.md
// frontmatter for title/description, invokes the spec→haven-svg renderer, and
// replaces the placeholder with a complete figure (eyebrow + caption + iframe
// srcdoc embed + description).
//
// Iframe-srcdoc embed is the v1 transport: the diagram's CSS + JS live inside
// the standalone HTML, fully isolated from host page scope. This honors HVD's
// deferred Tier 1 PL promotion of diagram-* classes to components.css — when
// that promotion lands, the embed can flip to inline SVG without changing the
// directive contract.
// ---------------------------------------------------------------------------
export function resolveDiagramPlaceholders() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'div') return;
      const classes = (node.properties && node.properties.className) || [];
      if (!classes.includes('diagram-figure-placeholder')) return;
      const slug = node.properties?.['data-workflow'];
      if (!slug) return;
      const resolved = resolveDiagramWorkflow(slug);
      if (!resolved) {
        console.warn(`[haven] :::diagram unresolved workflow: ${slug}`);
        return;
      }
      const standalone = renderDiagramStandalone(resolved.sourceDir);
      if (!standalone) {
        // Leave the placeholder div in place as a visible fallback so a
        // reviewer notices the missing render rather than a silent gap.
        return;
      }
      const titleText = htmlTextEscape(resolved.title);
      const descText = htmlTextEscape(resolved.description);
      const iframeSrcdoc = htmlAttrEscape(standalone);
      const iframeTitle = htmlAttrEscape(`Workflow diagram: ${resolved.title}`);
      // Min-height keeps the iframe from collapsing to 0; the renderer's
      // panzoom-library handles internal sizing. Future fit-to-content sizing
      // is a Tier 1 PL promotion concern.
      const figureHtml = [
        `<figure class="diagram-figure" data-workflow="${htmlAttrEscape(slug)}">`,
        `<figcaption class="diagram-figure-caption">`,
        `<span class="diagram-figure-eyebrow">WORKFLOW DIAGRAM</span>`,
        `<span class="diagram-figure-title">${titleText}</span>`,
        `</figcaption>`,
        `<div class="diagram-figure-asset">`,
        `<iframe class="diagram-figure-frame" srcdoc="${iframeSrcdoc}" title="${iframeTitle}" style="width:100%;min-height:600px;border:0;display:block;" loading="lazy"></iframe>`,
        `</div>`,
        descText
          ? `<p class="diagram-figure-description">${descText}</p>`
          : '',
        `</figure>`,
      ].join('');
      // Replace the placeholder div with a raw-HTML node so rehype-stringify
      // emits the figure markup unchanged (host uses allowDangerousHtml).
      node.type = 'raw';
      node.value = figureHtml;
      delete node.tagName;
      delete node.properties;
      delete node.children;
    });
  };
}

// The binding object = everything DS-specific the DS-agnostic core consumes.
export const havenBinding = {
  remarkPlugins: [stripWikilinks, havenDirectives],
  rehypePlugins: [havenPrimitives, havenHeadingSlugs, havenStatusBadges, resolveDiagramPlaceholders],
  // extra stylesheet (beyond the compiled bundle) that restores prose flow
  // Tailwind preflight strips; shipped in the standalone bundle.
  proseCss: 'surface-prose.css',
};
