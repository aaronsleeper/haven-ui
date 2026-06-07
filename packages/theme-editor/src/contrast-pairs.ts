/**
 * Contrast pair registry — curated foreground → background mapping.
 *
 * The Relations registry alone doesn't know which pairs read as
 * "foreground on background." This table names the canonical pairings
 * the editor checks for contrast.
 *
 * Each entry says: when rendering `fg`, the user sees it on top of `bg`.
 * The editor walks the table on every save, resolves both sides against
 * the current preset/mode, and computes the WCAG ratio.
 *
 * The `bg` reference may itself be a registered relation (so the resolved
 * background follows the surface anchor automatically). Pairs whose
 * background is mode-dependent in non-trivial ways (e.g. modal background
 * differs in light vs dark mode) work because the resolver runs per mode.
 *
 * Scope: only the pairs UX proposal §1 names AND a handful of obvious
 * derivations from those (tag-color/tag-background, blockquote-on-primary).
 * Phase 5 may grow the table; Phase 4 ships the load-bearing pairs.
 */

export interface ContrastPair {
  fg: string;
  bg: string;
  /** Human-readable context for the Issues panel. */
  context: string;
}

export const CONTRAST_PAIRS: ContrastPair[] = [
  // Body + heading text on the primary surface.
  { fg: '--text-normal',        bg: '--background-primary', context: 'Body text on primary surface' },
  { fg: '--text-muted',         bg: '--background-primary', context: 'Muted body text on primary surface' },
  { fg: '--text-faint',         bg: '--background-primary', context: 'Faint helper text on primary surface' },
  { fg: '--h1-color',           bg: '--background-primary', context: 'H1 heading on primary surface' },
  { fg: '--h2-color',           bg: '--background-primary', context: 'H2 heading on primary surface' },
  { fg: '--h3-color',           bg: '--background-primary', context: 'H3 heading on primary surface' },
  { fg: '--h4-color',           bg: '--background-primary', context: 'H4 heading on primary surface' },
  { fg: '--h5-color',           bg: '--background-primary', context: 'H5 heading on primary surface' },
  { fg: '--h6-color',           bg: '--background-primary', context: 'H6 heading on primary surface' },
  { fg: '--inline-title-color', bg: '--background-primary', context: 'Inline note title on primary surface' },

  // Accent / link register on the primary surface.
  { fg: '--color-accent',       bg: '--background-primary', context: 'Primary accent on primary surface' },
  { fg: '--interactive-accent', bg: '--background-primary', context: 'Interactive accent on primary surface' },
  { fg: '--link-color',         bg: '--background-primary', context: 'Link on primary surface' },
  { fg: '--text-accent',        bg: '--background-primary', context: 'Accent text on primary surface' },

  // Signals on the primary surface.
  { fg: '--text-error',         bg: '--background-primary', context: 'Error text on primary surface' },
  { fg: '--text-warning',       bg: '--background-primary', context: 'Warning text on primary surface' },
  { fg: '--text-success',       bg: '--background-primary', context: 'Success text on primary surface' },

  // Companion derivations on the primary surface.
  { fg: '--code-function',      bg: '--background-primary', context: 'Code function on primary surface' },

  // Tag pair (companion-derived background carries companion-derived text).
  { fg: '--tag-color',          bg: '--tag-background',     context: 'Tag text on tag background' },
];
