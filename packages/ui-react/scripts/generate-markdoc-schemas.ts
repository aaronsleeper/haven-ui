// Generate Markdoc tag schemas from *.props.ts propSchemas.
//
// Reads: packages/ui-react/registry.json — for each entry where
//   haven.composition.markdocTag is non-null and propSchema is non-null,
//   walks the propSchema with ts-morph and emits a Markdoc tag schema.
// Writes: packages/ui-react/schema/<markdocTag>.markdoc.js + index.js barrel.
//
// The core type-mapping logic was spike-validated at 186 LOC in
// Lab/generative-ui-research/spikes/codegen/ (Apr 19). This file adds a
// ~60-LOC driver that reads registry.json and iterates.
//
// Not Markdoc-addressable (queue-section-header: slotModel "children-slot",
// markdocTag: null) entries are intentionally skipped.

import { Project, type PropertySignature, type Type } from 'ts-morph';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

type MarkdocAttribute = {
  type: 'String' | 'Number' | 'Boolean' | 'Array' | 'Object';
  required: boolean;
  matches?: string[];
  default?: string | number | boolean;
};

type ProcessedProp =
  | { kind: 'attribute'; name: string; attribute: MarkdocAttribute }
  | { kind: 'unsupported'; name: string; typeText: string; reason: string };

class CodegenError extends Error {}

// ---------- core: ts-morph → Markdoc attribute mapping ---------------------

function mapType(prop: PropertySignature): ProcessedProp {
  const name = prop.getName();
  const required = !prop.hasQuestionToken();
  const type = prop.getType();
  const annotationText = prop.getTypeNode()?.getText() ?? type.getText(prop);
  const resolvedText = type.getText(prop);
  const defaultValue = readJsDocDefault(prop);

  if (isFunctionOrReactNode(type, annotationText, resolvedText)) {
    return {
      kind: 'unsupported',
      name,
      typeText: annotationText,
      reason:
        type.getCallSignatures().length > 0 || /=>/.test(annotationText)
          ? 'function prop cannot round-trip through Markdoc'
          : 'ReactNode/JSX prop requires slotModel: "manual"',
    };
  }

  const nonUndefined = type.getNonNullableType();

  if (nonUndefined.isString()) {
    return {
      kind: 'attribute',
      name,
      attribute: { type: 'String', required, default: defaultValue },
    };
  }
  if (nonUndefined.isNumber()) {
    return {
      kind: 'attribute',
      name,
      attribute: {
        type: 'Number',
        required,
        default: coerceNumber(defaultValue),
      },
    };
  }
  if (nonUndefined.isBoolean()) {
    return {
      kind: 'attribute',
      name,
      attribute: {
        type: 'Boolean',
        required,
        default: coerceBoolean(defaultValue),
      },
    };
  }

  if (nonUndefined.isUnion()) {
    const members = nonUndefined.getUnionTypes().filter((t) => !t.isUndefined());
    const stringLiterals = members.filter((t) => t.isStringLiteral());
    if (stringLiterals.length === members.length && members.length > 0) {
      const matches = stringLiterals.map((t) => t.getLiteralValue() as string);
      return {
        kind: 'attribute',
        name,
        attribute: { type: 'String', required, matches, default: defaultValue },
      };
    }
    const numberLiterals = members.filter((t) => t.isNumberLiteral());
    if (numberLiterals.length === members.length && members.length > 0) {
      return {
        kind: 'attribute',
        name,
        attribute: {
          type: 'Number',
          required,
          default: coerceNumber(defaultValue),
        },
      };
    }
    return {
      kind: 'unsupported',
      name,
      typeText: annotationText,
      reason: 'mixed or non-literal union not representable in Markdoc',
    };
  }

  if (nonUndefined.isArray()) {
    return { kind: 'attribute', name, attribute: { type: 'Array', required } };
  }

  if (nonUndefined.isObject() && !nonUndefined.isClass()) {
    return { kind: 'attribute', name, attribute: { type: 'Object', required } };
  }

  return {
    kind: 'unsupported',
    name,
    typeText: annotationText,
    reason: `unsupported type ${annotationText}`,
  };
}

function isFunctionOrReactNode(
  type: Type,
  annotationText: string,
  resolvedText: string,
): boolean {
  if (type.getCallSignatures().length > 0) return true;
  if (
    type.isUnion() &&
    type.getUnionTypes().some((t) => t.getCallSignatures().length > 0)
  ) {
    return true;
  }
  const pattern = /\bReactNode\b|\bReactElement\b|\bJSX\.Element\b/;
  return pattern.test(annotationText) || pattern.test(resolvedText);
}

function readJsDocDefault(
  prop: PropertySignature,
): string | number | boolean | undefined {
  for (const doc of prop.getJsDocs()) {
    for (const tag of doc.getTags()) {
      if (tag.getTagName() === 'default') {
        const raw = tag.getCommentText()?.trim();
        if (raw === undefined) return undefined;
        return parseJsDocValue(raw);
      }
    }
  }
  return undefined;
}

function parseJsDocValue(raw: string): string | number | boolean {
  const stripped = raw.replace(/^["'`]|["'`]$/g, '');
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  const n = Number(raw);
  if (!Number.isNaN(n) && raw.trim() !== '') return n;
  return stripped;
}

function coerceNumber(
  v: string | number | boolean | undefined,
): number | undefined {
  return typeof v === 'number'
    ? v
    : typeof v === 'string' && v !== '' && !Number.isNaN(Number(v))
      ? Number(v)
      : undefined;
}

function coerceBoolean(
  v: string | number | boolean | undefined,
): boolean | undefined {
  return typeof v === 'boolean' ? v : undefined;
}

function pascalToCamel(s: string): string {
  return s[0].toLowerCase() + s.slice(1);
}

function serializeLiteral(v: string | number | boolean): string {
  if (typeof v === 'string') return JSON.stringify(v);
  return String(v);
}

function renderAttribute(attr: MarkdocAttribute): string {
  const parts: string[] = [`type: ${attr.type}`];
  parts.push(`required: ${attr.required}`);
  if (attr.matches)
    parts.push(`matches: [${attr.matches.map((m) => JSON.stringify(m)).join(', ')}]`);
  if (attr.default !== undefined)
    parts.push(`default: ${serializeLiteral(attr.default)}`);
  return `{ ${parts.join(', ')} }`;
}

function renderSchema(
  componentName: string,
  exportName: string,
  processed: ProcessedProp[],
): string {
  const supported = processed.filter(
    (p): p is Extract<ProcessedProp, { kind: 'attribute' }> =>
      p.kind === 'attribute',
  );
  const unsupported = processed.filter(
    (p): p is Extract<ProcessedProp, { kind: 'unsupported' }> =>
      p.kind === 'unsupported',
  );

  const header: string[] = [
    `// Generated from ${componentName}Props by generate-markdoc-schemas.ts — do not edit by hand.`,
  ];
  if (unsupported.length > 0) {
    header.push(`//`);
    header.push(
      `// Unsupported props flagged — component requires slotModel: 'manual' in registry.json`,
    );
    header.push(
      `// until these props are redesigned or removed from the Markdoc-authored surface:`,
    );
    for (const u of unsupported) {
      header.push(`//   - ${u.name}: ${u.reason} (type: ${u.typeText})`);
    }
  }

  const attrLines = supported
    .map((p) => `    ${p.name}: ${renderAttribute(p.attribute)},`)
    .join('\n');

  return [
    header.join('\n'),
    '',
    `export const ${exportName} = {`,
    `  render: '${componentName}',`,
    `  attributes: {`,
    attrLines,
    `  },`,
    `};`,
    '',
  ].join('\n');
}

// ---------- driver: registry.json → schema/*.markdoc.js --------------------

type RegistryEntry = {
  name: string;
  haven: {
    composition: {
      propSchema: string | null;
      markdocTag: string | null;
      slotModel: 'typed-props' | 'children-slot';
    };
  };
};

type Registry = { items: RegistryEntry[] };

function run(): void {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const pkgRoot = path.resolve(here, '..');
  const registryPath = path.join(pkgRoot, 'registry.json');
  const schemaDir = path.join(pkgRoot, 'schema');

  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8')) as Registry;

  const addressable = registry.items.filter(
    (item) =>
      item.haven.composition.markdocTag !== null &&
      item.haven.composition.propSchema !== null,
  );

  if (addressable.length === 0) {
    throw new CodegenError('no addressable entries in registry.json');
  }

  fs.mkdirSync(schemaDir, { recursive: true });

  const emittedBarrelLines: string[] = [];
  const project = new Project({ skipAddingFilesFromTsConfig: true });

  for (const item of addressable) {
    const propSchemaPath = path.resolve(
      pkgRoot,
      'src',
      item.haven.composition.propSchema!.replace(/^\.\//, ''),
    );
    if (!fs.existsSync(propSchemaPath)) {
      throw new CodegenError(
        `propSchema not found for '${item.name}': ${propSchemaPath}`,
      );
    }

    const sourceFile = project.addSourceFileAtPath(propSchemaPath);
    const propsInterface = sourceFile
      .getInterfaces()
      .find((i) => i.isExported() && i.getName().endsWith('Props'));
    if (!propsInterface) {
      throw new CodegenError(
        `no exported *Props interface in ${propSchemaPath}`,
      );
    }

    const componentName = propsInterface.getName().replace(/Props$/, '');
    const exportName = pascalToCamel(componentName);
    const processed = propsInterface.getProperties().map(mapType);
    const schemaSource = renderSchema(componentName, exportName, processed);

    const outFile = path.join(schemaDir, `${item.haven.composition.markdocTag}.markdoc.js`);
    fs.writeFileSync(outFile, schemaSource);

    emittedBarrelLines.push(
      `export { ${exportName} } from './${item.haven.composition.markdocTag}.markdoc.js';`,
    );

    process.stdout.write(
      `  ✓ ${item.haven.composition.markdocTag} → schema/${item.haven.composition.markdocTag}.markdoc.js\n`,
    );
  }

  const indexPath = path.join(schemaDir, 'index.js');
  const indexHeader =
    '// Generated barrel for Markdoc tag schemas — do not edit by hand.\n\n';
  fs.writeFileSync(indexPath, indexHeader + emittedBarrelLines.join('\n') + '\n');

  process.stdout.write(
    `\n  ${addressable.length} schema(s) + barrel written to schema/\n`,
  );
}

run();
