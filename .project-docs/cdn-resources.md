<!-- Extracted from CLAUDE.md — edit here, not in CLAUDE.md -->

## CDN Resources (Use These Exact Versions)

```html
<!-- Haven UI compiled theme (always first) -->
<link rel="stylesheet" href="/dist/assets/haven-ui.css">

<!-- FontAwesome Pro (local) -->
<link rel="stylesheet" href="/src/vendor/fontawesome/css/all.css">

<!-- Preline JS is loaded via Vite module (src/scripts/main.js) — do NOT add a CDN script tag -->

<!-- Chart.js v4 (only on pages with charts) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>

<!-- Chart.js annotation plugin (only on pages with zone bands / reference lines) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/chartjs-plugin-annotation/3.1.0/chartjs-plugin-annotation.min.js"></script>

<!-- Leaflet CSS (only on pages with a map) -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css">

<!-- Leaflet JS (only on pages with a map) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>

<!-- Haven chart config (after Chart.js, before page chart scripts) -->
<script src="/src/scripts/env/haven-chart-config.js"></script>
```

Only include Chart.js, annotation plugin, and Leaflet on pages that actually use them.
