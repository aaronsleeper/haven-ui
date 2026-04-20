// Ported from Lab/generative-ui-research/spikes/conformance-gate/src/parseTokensCSS.ts
// (spike 3, 10/10 pass 0% flake). Reads a CSS string containing token
// declarations from @theme, @theme inline, :root, :host, or html blocks
// and returns a flat map `{ name: resolvedValue }` with all var() chains
// resolved. Scope-limited: does not evaluate calc(), does not handle
// media-query-scoped declarations, does not honor !important ordering.
//
// Spike-relative change: block selector pattern extended with `:host` and
// multi-selector comma lists — Tailwind 4's compiled @theme output targets
// `:root, :host { ... }`, which the spike's :root-only regex missed.

export function parseTokensCSS(cssSource: string): Record<string, string> {
  const noComments = cssSource.replace(/\/\*[\s\S]*?\*\//g, '');

  const raw = new Map<string, string>();
  // Match any block whose selector list starts with @theme, :root, :host, or
  // html. `[^{]*` lets the regex skip past additional comma-joined selectors
  // before the opening brace.
  const blockRe = /(?:@theme(?:\s+inline)?|:root|:host|html)[^{]*\{([\s\S]*?)\}/g;
  let block: RegExpExecArray | null;
  while ((block = blockRe.exec(noComments)) !== null) {
    const body = block[1];
    const declRe = /(--[\w-]+)\s*:\s*([^;]+);/g;
    let decl: RegExpExecArray | null;
    while ((decl = declRe.exec(body)) !== null) {
      raw.set(decl[1].trim(), decl[2].trim());
    }
  }

  const resolved: Record<string, string> = {};
  const resolving = new Set<string>();

  function resolve(name: string): string {
    if (resolved[name] !== undefined) return resolved[name];
    if (resolving.has(name)) throw new Error(`circular var reference: ${name}`);
    resolving.add(name);

    const rawValue = raw.get(name);
    if (rawValue === undefined) {
      resolving.delete(name);
      return '';
    }

    const out = rawValue.replace(
      /var\(\s*(--[\w-]+)\s*(?:,\s*([^)]+))?\)/g,
      (_, refName: string, fallback?: string) => {
        const r = resolve(refName.trim());
        return r || (fallback?.trim() ?? '');
      },
    );

    resolving.delete(name);
    resolved[name] = out;
    return out;
  }

  for (const name of raw.keys()) resolve(name);
  return resolved;
}
