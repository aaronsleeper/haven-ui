// Ported verbatim from Lab/generative-ui-research/spikes/conformance-gate/src/normalizeColor.ts
// Canonicalizes a CSS color into rgb(R, G, B) or rgba(R, G, B, A) so
// comparisons between declared hex (tokens.css) and computed rgb() (browser
// output) don't false-positive on representation differences. Scope: hex
// (3/4/6/8 digit) and rgb()/rgba() with comma or space-slash syntax.

export function normalizeColor(value: string): string {
  const v = value.trim().toLowerCase();

  const hex = v.match(/^#([0-9a-f]{3,8})$/);
  if (hex) {
    const h = hex[1];
    let r: number, g: number, b: number, a = 1;
    if (h.length === 3 || h.length === 4) {
      r = parseInt(h[0] + h[0], 16);
      g = parseInt(h[1] + h[1], 16);
      b = parseInt(h[2] + h[2], 16);
      if (h.length === 4) a = parseInt(h[3] + h[3], 16) / 255;
    } else if (h.length === 6 || h.length === 8) {
      r = parseInt(h.slice(0, 2), 16);
      g = parseInt(h.slice(2, 4), 16);
      b = parseInt(h.slice(4, 6), 16);
      if (h.length === 8) a = parseInt(h.slice(6, 8), 16) / 255;
    } else {
      throw new Error(`invalid hex color: ${value}`);
    }
    return a === 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${round3(a)})`;
  }

  const rgb = v.match(
    /^rgba?\(\s*([\d.]+)\s*[,\s]\s*([\d.]+)\s*[,\s]\s*([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/,
  );
  if (rgb) {
    const r = Math.round(parseFloat(rgb[1]));
    const g = Math.round(parseFloat(rgb[2]));
    const b = Math.round(parseFloat(rgb[3]));
    let a = 1;
    if (rgb[4] !== undefined) {
      const raw = rgb[4];
      a = raw.endsWith('%') ? parseFloat(raw) / 100 : parseFloat(raw);
    }
    return a === 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${round3(a)})`;
  }

  return v;
}

function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}
