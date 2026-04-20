// WCAG 2.x contrast-ratio computation. Implements the relative-luminance
// formula from https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
// and ratio from #dfn-contrast-ratio.
//
// Input: two CSS color strings (hex or rgb()). Alpha is ignored — WCAG's
// ratio is defined against a solid background; callers that need to
// blend alpha must composite first.

export function wcagContrast(foreground: string, background: string): number {
  const fg = relativeLuminance(parseColor(foreground));
  const bg = relativeLuminance(parseColor(background));
  const lighter = Math.max(fg, bg);
  const darker = Math.min(fg, bg);
  return (lighter + 0.05) / (darker + 0.05);
}

type RGB = { r: number; g: number; b: number };

function parseColor(value: string): RGB {
  const v = value.trim().toLowerCase();

  const hex = v.match(/^#([0-9a-f]{3,8})$/);
  if (hex) {
    const h = hex[1]!;
    if (h.length === 3 || h.length === 4) {
      return {
        r: parseInt(h[0]! + h[0]!, 16),
        g: parseInt(h[1]! + h[1]!, 16),
        b: parseInt(h[2]! + h[2]!, 16),
      };
    }
    if (h.length === 6 || h.length === 8) {
      return {
        r: parseInt(h.slice(0, 2), 16),
        g: parseInt(h.slice(2, 4), 16),
        b: parseInt(h.slice(4, 6), 16),
      };
    }
    throw new Error(`invalid hex color: ${value}`);
  }

  const rgb = v.match(
    /^rgba?\(\s*([\d.]+)\s*[,\s]\s*([\d.]+)\s*[,\s]\s*([\d.]+)(?:\s*[,/]\s*[\d.]+%?)?\s*\)$/,
  );
  if (rgb) {
    return {
      r: Math.round(parseFloat(rgb[1]!)),
      g: Math.round(parseFloat(rgb[2]!)),
      b: Math.round(parseFloat(rgb[3]!)),
    };
  }

  if (v === 'white') return { r: 255, g: 255, b: 255 };
  if (v === 'black') return { r: 0, g: 0, b: 0 };

  throw new Error(`unsupported color format for contrast computation: ${value}`);
}

function relativeLuminance({ r, g, b }: RGB): number {
  const [R, G, B] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  }) as [number, number, number];
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}
