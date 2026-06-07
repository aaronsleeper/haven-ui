/**
 * Ambient declarations for @haven/design-system's vanilla JS exports.
 *
 * The picker module is JS-only (no .d.ts shipped); declare the named
 * exports the editor relies on so TS doesn't fall back to `any`.
 */

declare module '@haven/design-system/scripts/components/hue-family-picker.js' {
  /**
   * Re-init any picker DOM elements not yet initialized. Idempotent.
   * Called after the editor renders new picker markup.
   */
  export function initHueFamilyPickers(): void;
}
