// HTML canonicalization for the wireframe-shell gate. Normalizes pattern-library
// shell HTML into a deterministic form before content-hashing so that Prettier
// reflows, comment churn, and attribute reordering do not invalidate downstream
// wireframe `pl_shell_version` hashes.
//
// Rules applied (in order):
//   1. Drop all comments
//   2. Sort element attributes alphabetically by name
//   3. Collapse runs of whitespace to a single space inside text nodes that are
//      NOT descendants of <pre>, <code>, <textarea>, or <script>
//   4. Trim leading/trailing whitespace from every text node outside the
//      whitespace-preserving ancestors
//   5. Re-serialize via parse5
//
// Used by both the gate (tests/conform/wireframe-shell.ts) and the CLI
// (scripts/print-shell-canon.ts). Lives in src/lib so neither caller couples to
// the other's directory.

import { parse, serialize, type DefaultTreeAdapterMap } from 'parse5';

type ChildNode = DefaultTreeAdapterMap['childNode'];
type Element = DefaultTreeAdapterMap['element'];
type Document = DefaultTreeAdapterMap['document'];

const WHITESPACE_PRESERVING_TAGS = new Set(['pre', 'code', 'textarea', 'script']);

function isElement(node: { nodeName: string }): node is Element {
  return 'tagName' in node && 'attrs' in node;
}

function processChildren(
  parent: Document | Element,
  preserveWhitespace: boolean,
): void {
  const filtered: ChildNode[] = [];
  for (const child of parent.childNodes) {
    if (child.nodeName === '#comment') continue;
    if (child.nodeName === '#text' && 'value' in child) {
      if (!preserveWhitespace) {
        const collapsed = child.value.replace(/\s+/g, ' ').trim();
        if (collapsed === '') continue;
        child.value = collapsed;
      }
      filtered.push(child);
      continue;
    }
    if (isElement(child)) {
      child.attrs = [...child.attrs].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      const childPreserve =
        preserveWhitespace || WHITESPACE_PRESERVING_TAGS.has(child.tagName);
      processChildren(child, childPreserve);
      filtered.push(child);
      continue;
    }
    filtered.push(child);
  }
  parent.childNodes = filtered;
}

export function canonicalizeShellHtml(html: string): string {
  const document = parse(html);
  processChildren(document, false);
  return serialize(document);
}
