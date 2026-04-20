#!/usr/bin/env tsx
// Transform a .mdoc wireframe into a React screen component via the
// registered tag→component map. Deterministic: no judgment, no invention.
// Fails fast if the wireframe doesn't validate against the generated schemas,
// if a top-level node is a non-tag (e.g. a leftover heading), or if a tag has
// no registered React component.
//
// Usage: pnpm tsx scripts/compose.ts <input.mdoc> <output.tsx>

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import Markdoc from '@markdoc/markdoc';
import * as schemas from '../schema/index.js';
import registryJson from '../registry.json' with { type: 'json' };

type RegistryFile = { path: string; type: string };
type RegistryItem = {
  name: string;
  files: RegistryFile[];
  haven?: {
    composition?: {
      markdocTag: string | null;
    };
  };
};
type Registry = { items: RegistryItem[] };

const config = {
  tags: {
    'assessment-header': schemas.assessmentHeader,
    'progress-bar-pagination': schemas.progressBarPagination,
    'queue-item': schemas.queueItem,
    'queue-sidebar': schemas.queueSidebar,
    'response-option': schemas.responseOption,
    'response-option-group': schemas.responseOptionGroup,
  },
};

const tagToComponent = new Map<string, string>();
for (const item of (registryJson as Registry).items) {
  const tag = item.haven?.composition?.markdocTag;
  if (!tag) continue;
  const tsx = item.files.find((f) => f.path.endsWith('.tsx'));
  if (!tsx) continue;
  tagToComponent.set(tag, basename(tsx.path, '.tsx'));
}

const [, , inputRel, outputRel] = process.argv;
if (!inputRel || !outputRel) {
  console.error('usage: pnpm tsx scripts/compose.ts <input.mdoc> <output.tsx>');
  process.exit(2);
}

const inputAbs = resolve(process.cwd(), inputRel);
const outputAbs = resolve(process.cwd(), outputRel);

const source = readFileSync(inputAbs, 'utf8');
const ast = Markdoc.parse(source);

const validationErrors = Markdoc.validate(ast, config).filter(
  (e) => e.error.level === 'critical' || e.error.level === 'error',
);
if (validationErrors.length > 0) {
  console.error(
    `FAIL ${inputRel}  (${validationErrors.length} validation error${
      validationErrors.length > 1 ? 's' : ''
    })`,
  );
  for (const e of validationErrors) {
    const loc = e.location?.start
      ? `${inputRel}:${e.location.start.line}:${e.location.start.character ?? 0}`
      : inputRel;
    console.error(`  ${loc}  [${e.error.level}] ${e.error.id}: ${e.error.message}`);
  }
  process.exit(1);
}

const tagNodes: any[] = [];
for (const child of ast.children) {
  if (child.type === 'tag') {
    tagNodes.push(child);
    continue;
  }
  console.error(
    `FAIL ${inputRel}  unsupported top-level node type '${child.type}'. ` +
      `Pilot wireframes must contain only registered tags at the top level.`,
  );
  process.exit(1);
}

if (tagNodes.length === 0) {
  console.error(`FAIL ${inputRel}  no tags found`);
  process.exit(1);
}

const usedComponents = new Set<string>();
const elementBlocks: string[] = [];
const BODY_INDENT = '      ';

for (const node of tagNodes) {
  const componentName = tagToComponent.get(node.tag);
  if (!componentName) {
    console.error(
      `FAIL ${inputRel}  tag '${node.tag}' has no mapped React component in registry.json`,
    );
    process.exit(1);
  }
  usedComponents.add(componentName);
  const attrs: Record<string, unknown> = node.transformAttributes(config);
  elementBlocks.push(renderElement(componentName, attrs, BODY_INDENT));
}

function renderElement(
  component: string,
  attrs: Record<string, unknown>,
  indent: string,
): string {
  const entries = Object.entries(attrs);
  if (entries.length === 0) return `${indent}<${component} />`;
  const propIndent = indent + '  ';
  const propLines = entries.map(([key, value]) => formatProp(key, value, propIndent));
  return [`${indent}<${component}`, ...propLines, `${indent}/>`].join('\n');
}

function formatProp(key: string, value: unknown, indent: string): string {
  if (typeof value === 'string') {
    return `${indent}${key}=${JSON.stringify(value)}`;
  }
  if (typeof value === 'number' || typeof value === 'boolean' || value === null) {
    return `${indent}${key}={${JSON.stringify(value)}}`;
  }
  const json = JSON.stringify(value, null, 2);
  const reflowed = json
    .split('\n')
    .map((line, i) => (i === 0 ? line : indent + line))
    .join('\n');
  return `${indent}${key}={${reflowed}}`;
}

const wireframeName = basename(inputRel, '.mdoc');
const screenComponentName = toPascalCase(wireframeName);

function toPascalCase(s: string): string {
  return s
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

if (!/^[A-Z][A-Za-z0-9_]*$/.test(screenComponentName)) {
  console.error(
    `FAIL ${inputRel}  basename '${wireframeName}' does not yield a valid component identifier ` +
      `('${screenComponentName}'). Rename the wireframe or add a prefix.`,
  );
  process.exit(1);
}

const importList = [...usedComponents].sort().join(', ');

const output = `// Generated from ${inputRel} by /compose — do not edit by hand.
// Regenerate: pnpm --filter @haven/ui-react compose ${inputRel} ${outputRel}

import { ${importList} } from '@haven/ui-react';

export default function ${screenComponentName}() {
  return (
    <>
${elementBlocks.join('\n')}
    </>
  );
}
`;

mkdirSync(dirname(outputAbs), { recursive: true });
writeFileSync(outputAbs, output, 'utf8');
console.log(
  `ok   ${outputRel}  (${tagNodes.length} tag${tagNodes.length > 1 ? 's' : ''}, ${
    usedComponents.size
  } component${usedComponents.size > 1 ? 's' : ''})`,
);
