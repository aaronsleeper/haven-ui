/**
 * Haven Chart Config
 * Shared Chart.js defaults and helper functions for the Haven design system.
 *
 * ENVIRONMENT FUNCTION — lives in src/scripts/env/
 * Referenced by: src/partials/scripts-charts.html
 * Used on: any page with charts
 *
 * Include after Chart.js and before any page-specific chart scripts.
 */

/* ===================================
   HAVEN COLOR PALETTE
   Resolved from colors.css token values.
   primary = teal, success = green, warning = amber,
   danger = red (error), info = cyan, violet = violet, sand = sand
   =================================== */

const HAVEN = {
  primary: {
    50:  'hsla(144, 65.2%, 95.5%, 1)',
    100: 'hsla(151, 65.6%, 81.8%, 1)',
    200: 'hsla(158, 53.8%, 69.4%, 1)',
    300: 'hsla(162, 43%, 59.4%, 1)',
    400: 'hsla(166, 33.9%, 50.8%, 1)',
    500: 'hsla(169, 35.8%, 42.7%, 1)',
    600: 'hsla(173, 38.5%, 35.1%, 1)',
    700: 'hsla(176, 41.3%, 28%, 1)',
  },
  success: {
    50:  'hsla(74, 36.7%, 88.2%, 1)',
    100: 'hsla(77, 35.2%, 78.8%, 1)',
    500: 'hsla(105, 17.7%, 51.4%, 1)',
    600: 'hsla(114, 16.7%, 45.7%, 1)',
  },
  warning: {
    50:  'hsla(39, 50%, 89%, 1)',
    100: 'hsla(41, 47.7%, 79%, 1)',
    500: 'hsla(54, 23.9%, 45.9%, 1)',
    600: 'hsla(58, 24%, 39.2%, 1)',
  },
  danger: {
    50:  'hsla(343, 41.2%, 93.3%, 1)',
    100: 'hsla(346, 43.3%, 86.9%, 1)',
    500: 'hsla(358, 32%, 59.6%, 1)',
    600: 'hsla(2, 26%, 51.8%, 1)',
  },
  info: {
    50:  'hsla(176, 73.3%, 91.2%, 1)',
    100: 'hsla(181, 62.6%, 75.9%, 1)',
    500: 'hsla(191, 51.4%, 42.7%, 1)',
    600: 'hsla(192, 54%, 36.7%, 1)',
  },
  violet: {
    50:  'hsla(260, 31.6%, 92.5%, 1)',
    100: 'hsla(265, 30.6%, 85.9%, 1)',
    500: 'hsla(292, 19.6%, 57.1%, 1)',
    600: 'hsla(297, 15.8%, 48.4%, 1)',
  },
  secondary: {
    50:  'hsla(24, 22.7%, 91.4%, 1)',
    100: 'hsla(23, 20%, 82.4%, 1)',
    200: 'hsla(25, 19.1%, 73.3%, 1)',
    300: 'hsla(23, 17.3%, 64.9%, 1)',
    400: 'hsla(26, 14.3%, 56.1%, 1)',
    500: 'hsla(25, 12.7%, 48%, 1)',
    600: 'hsla(26, 13.7%, 40%, 1)',
    700: 'hsla(27, 14.6%, 32.2%, 1)',
  },
  sand: {
    100: 'hsla(23, 20%, 82.4%, 1)',
    200: 'hsla(25, 19.1%, 73.3%, 1)',
    300: 'hsla(23, 17.3%, 64.9%, 1)',
    400: 'hsla(26, 14.3%, 56.1%, 1)',
    500: 'hsla(25, 12.7%, 48%, 1)',
  },
};

/* ===================================
   CHART.JS GLOBAL DEFAULTS
   =================================== */

Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Inter", sans-serif';
Chart.defaults.font.size = 12;
Chart.defaults.color = HAVEN.sand[500];
Chart.defaults.borderColor = HAVEN.sand[200];
Chart.defaults.plugins.legend.display = false;
Chart.defaults.plugins.tooltip.backgroundColor = '#ffffff';
Chart.defaults.plugins.tooltip.titleColor = HAVEN.sand[500];
Chart.defaults.plugins.tooltip.bodyColor = HAVEN.sand[400];
Chart.defaults.plugins.tooltip.borderColor = HAVEN.sand[200];
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.padding = 10;
Chart.defaults.plugins.tooltip.cornerRadius = 8;

/* ===================================
   HELPER: havenSparkline
   =================================== */

function havenSparkline(canvasId, dataPoints, color) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  const fillColor = color.replace(/, 1\)$/, ', 0.15)');
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: dataPoints.map(() => ''),
      datasets: [{
        data: dataPoints,
        borderColor: color,
        backgroundColor: fillColor,
        borderWidth: 2,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: 0 },
      scales: { x: { display: false }, y: { display: false } },
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
    },
  });
}

/* ===================================
   HELPER: havenLineChart
   =================================== */

function havenLineChart(canvasId, config) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  const annotations = {};

  if (config.referenceValue !== undefined) {
    annotations.referenceLine = {
      type: 'line',
      yMin: config.referenceValue,
      yMax: config.referenceValue,
      borderColor: HAVEN.sand[300],
      borderWidth: 1,
      borderDash: [6, 4],
    };
  }

  if (config.zones && Array.isArray(config.zones)) {
    config.zones.forEach(function (zone, i) {
      annotations['zone_' + i] = {
        type: 'box',
        yMin: zone.min !== undefined ? zone.min : undefined,
        yMax: zone.max !== undefined ? zone.max : undefined,
        backgroundColor: zone.color.replace(/, 1\)$/, ', 0.08)'),
        borderWidth: 0,
        label: zone.label ? {
          display: true,
          content: zone.label,
          position: 'start',
          color: zone.color,
          font: { size: 10, weight: 'normal' },
        } : undefined,
      };
    });
  }

  const datasets = (config.datasets || []).map(function (ds) {
    return Object.assign({
      borderWidth: 2,
      pointRadius: 3,
      pointHoverRadius: 5,
      tension: 0.3,
      fill: ds.backgroundColor ? true : false,
    }, ds);
  });

  return new Chart(ctx, {
    type: 'line',
    data: { labels: config.labels || [], datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { grid: { display: false } },
        y: {
          min: config.yMin,
          max: config.yMax,
          grid: { color: HAVEN.sand[200] },
        },
      },
      plugins: {
        annotation: Object.keys(annotations).length > 0
          ? { annotations }
          : undefined,
      },
    },
  });
}

/* ===================================
   HELPER: havenBarChart
   =================================== */

function havenBarChart(canvasId, config) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  const horizontal = config.horizontal || false;
  const stacked = config.stacked || false;

  const datasets = (config.datasets || []).map(function (ds) {
    return Object.assign({
      borderRadius: {
        topLeft: horizontal ? 0 : 4,
        topRight: 4,
        bottomLeft: 0,
        bottomRight: horizontal ? 4 : 0,
      },
      borderSkipped: horizontal ? 'start' : 'bottom',
      maxBarThickness: 48,
    }, ds);
  });

  return new Chart(ctx, {
    type: 'bar',
    data: { labels: config.labels || [], datasets },
    options: {
      indexAxis: horizontal ? 'y' : 'x',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { stacked, grid: { display: horizontal } },
        y: { stacked, grid: { display: !horizontal } },
      },
    },
  });
}
