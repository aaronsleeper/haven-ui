# New Component: Trend Card

## Purpose
Tappable card showing a single tracked health metric with its current value, trend direction, last data date, and a sparkline chart. Used in the Health hub to give patients an at-a-glance view of each tracked metric.

## Used In
- assess-01 (My Health hub): one card per tracked metric

## Preline Base
Pure Tailwind implementation. No Preline JS. Chart.js sparkline inside.

## Proposed Semantic Classes

### `.trend-card`
Tappable card wrapping a metric summary + sparkline.

### `.trend-card-header`
Top row: metric label, last data date, trend badge.

### `.trend-card-chart`
Container for the sparkline chart canvas.

## Implementation Notes

### HTML Structure
```html
<a href="/apps/patient/health/metric.html?id=mood" class="trend-card">
  <div class="trend-card-header">
    <div>
      <p class="text-sm font-medium" data-i18n-en="Mood" data-i18n-es="Estado de ánimo">Mood</p>
      <p class="text-xs text-sand-400">Last: Mar 28</p>
    </div>
    <span class="trend-badge trend-improving">
      <i class="fa-solid fa-arrow-up text-[10px]"></i> Improving
    </span>
  </div>
  <div class="trend-card-chart">
    <div class="chart-canvas-wrapper chart-sparkline">
      <canvas id="trend-mood"></canvas>
    </div>
  </div>
</a>
```

### @apply Definition
```css
.trend-card {
  @apply block bg-white border border-sand-200 rounded-xl p-4;
  @apply hover:border-sand-300 hover:shadow-2xs;
  @apply dark:bg-neutral-800 dark:border-neutral-700 dark:hover:border-neutral-600;
  text-decoration: none;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.trend-card-header {
  @apply flex items-start justify-between mb-3;
}

.trend-card-chart {
  @apply mt-2;
}
```

### States
- Default: white bg, sand border
- Hover: darker border, subtle shadow
- No disabled or completed variant

### Dark Mode
- Background: `dark:bg-neutral-800`
- Border: `dark:border-neutral-700`
- Hover: `dark:hover:border-neutral-600`
- Text inherits from children (existing dark mode on text utilities)
- Sparkline colors handled via `HAVEN.*` JS constants

### Responsive Behavior
Full-width card. Sparkline scales with container width automatically (Chart.js responsive).

### Accessibility
- `<a>` element for tap target
- `aria-label`: "View mood trend — improving"
- Sparkline canvas: `aria-hidden="true"` — trend direction communicated via `trend-badge` text
- Touch target: full card, well above 44px minimum

## Pattern Library
- [ ] Component file needed: `pattern-library/components/patient-trend-card.html`
- [ ] `COMPONENT-INDEX.md` row needed

## Priority
Required for launch.
