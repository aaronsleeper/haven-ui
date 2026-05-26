// ============================================================================
// THE SEAM — content primitives -> haven-ui component markup
// ============================================================================
// This is the haven-ui analogue of Mintlify's `components` prop. Mintlify maps
// tag-names -> React components at render; we map content-node-types -> haven-ui
// HTML + semantic CSS classes at BUILD time (an mdast/hast rewrite). The content
// files carry ZERO styling knowledge; all brand surface lives in this one map +
// haven-ui's components.css. Swap this map -> the whole site reskins, no content
// edits. That is the property the spike exists to demonstrate.
//
// Two kinds of substitution, mirroring Mintlify exactly:
//   1. Authored components  — `:::callout`, `:::card`  (directive nodes)
//   2. Markdown primitives  — table, inline code, links (default node rewrite)
// ============================================================================

import { visit } from 'unist-util-visit';

// variant -> FontAwesome Pro icon, matching pattern-library/components/alert.html
const ALERT_ICON = {
  success: 'circle-check',
  warning: 'triangle-exclamation',
  error: 'circle-xmark',
  info: 'circle-info',
};

// A hast-emitting node helper: an mdast node that remark-rehype passes through
// using data.hName / data.hProperties / its children.
function el(hName, properties, children = []) {
  return { type: 'havenElement', data: { hName, hProperties: properties }, children };
}
function icon(faClasses) {
  return el('i', { className: faClasses }, []);
}
function text(value) {
  return { type: 'text', value };
}

// ---------------------------------------------------------------------------
// 1. AUTHORED-COMPONENT SEAM — remark-directive nodes -> haven-ui components
// ---------------------------------------------------------------------------
export function havenDirectives() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type !== 'containerDirective' &&
        node.type !== 'leafDirective' &&
        node.type !== 'textDirective'
      ) {
        return;
      }

      // :::callout{variant="success" title="Saved"}  ->  <div class="alert alert-success">
      // (Swap demo: rebinding this one handler to .card markup reskins every callout
      // site-wide with zero content edits — the property the spike proves. See README.)
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

      // :::card{title="..." icon="rocket"}  ->  <div class="card"> ... </div>
      if (node.name === 'card') {
        const title = node.attributes?.title;
        const ic = node.attributes?.icon;
        const header = el('div', { className: ['card-header'] }, [
          el('h3', { className: ['card-title'] }, [
            ...(ic ? [icon(['fa-solid', `fa-${ic}`, 'mr-2', 'text-primary-500'])] : []),
            text(title || ''),
          ]),
        ]);
        const bodyChildren = node.children;
        node.children = [...(title ? [header] : []), el('div', { className: ['card-body'] }, bodyChildren)];
        node.data = { hName: 'div', hProperties: { className: ['card'] } };
        return;
      }

      // :::badge[Label]{variant="success"}  (leaf/text) -> <span class="badge badge-success">
      if (node.name === 'badge') {
        const variant = node.attributes?.variant || 'primary';
        node.data = { hName: 'span', hProperties: { className: ['badge', `badge-${variant}`] } };
        return;
      }
    });
  };
}

// ---------------------------------------------------------------------------
// 2. PRIMITIVE SEAM — default markdown elements -> haven-ui-classed elements
//    (the equivalent of Mintlify overriding `table`, `code`, `a` in its map)
// ---------------------------------------------------------------------------
export function havenPrimitives() {
  return (tree) => {
    visit(tree, 'element', (node, _index, parent) => {
      if (node.tagName === 'table') addClass(node, 'data-table');
      if (node.tagName === 'h2') addClass(node, 'section-title');
      if (node.tagName === 'a') addClass(node, 'text-primary-600', 'underline', 'underline-offset-2');
      // inline code only — fenced blocks render as <code> inside <pre>
      if (node.tagName === 'code' && parent?.tagName !== 'pre') {
        addClass(node, 'px-1.5', 'py-0.5', 'rounded', 'bg-sand-100', 'text-sand-800', 'text-sm');
      }
    });
  };
}

function addClass(node, ...classes) {
  node.properties = node.properties || {};
  const existing = node.properties.className || [];
  node.properties.className = [...existing, ...classes];
}
