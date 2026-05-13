import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import type { ChartConfiguration } from 'chart.js';
import type { SparklineProps } from './Sparkline.props';

export type { SparklineProps } from './Sparkline.props';

// 40px-tall fill-line sparkline mirroring the pattern-library chart-sparkline
// pattern. Composes the same chart-canvas-wrapper + chart-sparkline classes
// from components.css; height/positioning live there, not here.
//
// Mirrors haven-chart-config.js → havenSparkline (vanilla JS variant). Differences:
//   - lifecycle managed by React effect (init on mount, destroy on unmount/data change)
//   - Chart.js v4 type-safe config
//   - aria-label on the wrapper for screen reader trend description
//
// Fill auto-derives at 0.15 alpha when the color is HSLA in `..., 1)` form
// to match the PL helper exactly. For other color formats, fill stays the
// same as borderColor.

export function Sparkline({ data, color, ariaLabel }: SparklineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const fillColor = color.includes(', 1)')
      ? color.replace(/, 1\)$/, ', 0.15)')
      : color;

    // Tighten Y-domain around the actual data range so the wobble reads
    // visually (default 0-anchored axes flatten small variations to a line).
    // Padding = 10% of the range (with a floor) keeps the line off the edges.
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    const pad = Math.max(range * 0.1, 0.5);

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: data.map(() => ''),
        datasets: [
          {
            data,
            borderColor: color,
            backgroundColor: fillColor,
            borderWidth: 2,
            fill: true,
            pointRadius: 0,
            pointHoverRadius: 0,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: 0 },
        scales: {
          x: { display: false },
          y: { display: false, min: min - pad, max: max + pad },
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
      },
    };

    const chart = new Chart(ctx, config);
    return () => chart.destroy();
  }, [data, color]);

  return (
    <div
      className="chart-canvas-wrapper chart-sparkline"
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
