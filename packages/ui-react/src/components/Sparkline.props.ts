// Props for the Sparkline component — mirror of the pattern-library
// chart-sparkline pattern (canvas inside chart-canvas-wrapper, no axes, smooth
// fill-line). See packages/design-system/src/scripts/env/haven-chart-config.js
// → havenSparkline for the vanilla-JS reference.

export interface SparklineProps {
  /** Numeric data points; rendered chronologically left-to-right. */
  data: number[];
  /** Line color as an HSLA / hex / CSS color. Fill auto-derives at 0.15 alpha
   *  when the color is HSLA in `..., 1)` form; otherwise the consumer is
   *  responsible for opacity. */
  color: string;
  /** Optional aria-label for the wrapper; describe the trend in plain language. */
  ariaLabel?: string;
}
