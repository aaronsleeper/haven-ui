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

      // :::callout{variant="success" title="Saved"}  ->  <div class="alert alert-success">
      if (node.name === 'callout') {
        const variant = node.attributes?.variant || 'info';
        const title = node.attributes?.title;
        const body = el('div', {}, [
          ...(title ? [el('span', { className: ['font-medium'] }, [text(title + ' ')])] : []),
          ...node.children,
        ]);
        node.children = [icon(['fa-solid', `fa-${ALERT_ICON[variant] || 'circle-info'}`, 'alert-icon']), body];
        node.data = { hName: 'div', hProperties: { className: ['alert', `alert-${variant}`], role: 'alert' } };
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

// The binding object = everything DS-specific the DS-agnostic core consumes.
export const havenBinding = {
  remarkPlugins: [stripWikilinks, havenDirectives],
  rehypePlugins: [havenPrimitives, havenStatusBadges],
  // extra stylesheet (beyond the compiled bundle) that restores prose flow
  // Tailwind preflight strips; shipped in the standalone bundle.
  proseCss: 'surface-prose.css',
};
