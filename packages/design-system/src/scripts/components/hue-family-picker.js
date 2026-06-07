/**
 * Hue Family Picker — single slider along a Haven hue-family OKLCH line
 *
 * Framework-agnostic vanilla ES module. Loaded as a Vite module so it can
 * import culori for OKLCH math and gamut detection. Drop-in usable in
 * vanilla HTML; portable to Angular/React by reading the contract below.
 *
 * Concept:
 *   Every Haven hue family is defined by three OKLCH anchors — root (stop-500),
 *   max (stop-50 end, lightest), min (stop-950 end, darkest). The 11 canonical
 *   stops 50–950 are linear-in-L interpolations along the line through these
 *   three points. This picker exposes that line as a single slider:
 *
 *     slider value 0   → min   anchor (stop-950, darkest)    LEFT
 *     slider value 50  → root  anchor (stop-500)             MIDDLE
 *     slider value 100 → max   anchor (stop-50, lightest)    RIGHT
 *
 *   Canonical stops snap at every 10% (0=950, 10=900, 20=800, 30=700, 40=600,
 *   50=500, 60=400, 70=300, 80=200, 90=100, 100=50). Continuous values between
 *   ticks produce derived stop-number readouts (e.g. value 35 → teal-650).
 *
 * Usage:
 *   <div class="hue-family-picker" data-hue-family-picker data-family="teal" data-value="50">
 *     <!-- markup per pattern-library/components/forms-hue-family-picker.html -->
 *   </div>
 *
 * Attributes (root element):
 *   data-family           initial family slug (default: "teal")
 *   data-value            initial slider value 0–100 (default: 50 — root)
 *
 * Events:
 *   Dispatches 'hue-pick' CustomEvent on the root element when the value or
 *   family changes:
 *     el.addEventListener('hue-pick', (e) => {
 *       console.log(e.detail);
 *       // { family, value, oklch, hex, rgb, hsl, stopName, inGamut, source }
 *     });
 *   source: 'pointer' | 'keyboard' | 'tick' | 'family' | 'set'
 *
 * Programmatic API:
 *   el._hueFamilyPicker.setValue(n)        // set slider 0–100
 *   el._hueFamilyPicker.setFamily(slug)    // switch family, resets to 50
 *   el._hueFamilyPicker.getState()         // returns same shape as event detail
 *
 * Accessibility:
 *   - Native <input type="range"> with aria-valuemin/max and aria-valuetext
 *     (stop name like "teal-500 · root")
 *   - Arrow keys ±1, Shift+arrow snaps to nearest canonical tick (±10),
 *     Home/End jump to anchors
 *   - 44px touch target on thumb (precedent: assess-slider)
 *   - Focus ring on slider thumb and copy buttons
 *   - Live readout for the value label
 */

import {
  parse,
  formatHex,
  formatRgb,
  formatHsl,
  oklch as toOklch,
  interpolate,
  displayable,
} from 'culori';

// ---- Family canon (mirror of Lab/cena-health-brand/tools/color-generator/family-source.json) ----
// Inlined so the picker has no runtime dependency on the brand-tooling repo;
// when family-source.json changes, this constant must be re-synced. Keep in
// sync with palette.css regeneration cadence. (Define-once: palette.css is the
// canonical generated artifact; this is a smaller authored mirror of the
// three-anchor SOURCE for runtime interpolation, not the 11 derived stops.)

const FAMILIES = {
  teal:    { role: 'brand primary',                                root: 'oklch(56.3% 0.0762 181.3)', max: 'oklch(96% 0.013 181)',   min: 'oklch(15% 0.025 183)'  },
  sage:    { role: 'paired counterpart (18th family)',             root: 'oklch(55% 0.085 145.5)',    max: 'oklch(95% 0.018 148)',   min: 'oklch(15% 0.020 148)'  },
  sand:    { role: 'warm neutral',                                 root: 'oklch(65% 0.016 75)',       max: 'oklch(96.8% 0.011 82)',  min: 'oklch(15% 0.008 60)'   },
  red:     { role: 'error / critical',                             root: 'oklch(55% 0.170 25)',       max: 'oklch(95.5% 0.030 28)',  min: 'oklch(20% 0.075 23)'   },
  amber:   { role: 'warning / caution',                            root: 'oklch(63% 0.108 82)',       max: 'oklch(95.5% 0.030 84)',  min: 'oklch(22% 0.060 78)'   },
  green:   { role: 'success / confirmation',                       root: 'oklch(55% 0.105 160)',      max: 'oklch(95.5% 0.036 156)', min: 'oklch(20% 0.060 165)'  },
  cyan:    { role: 'info / informational',                         root: 'oklch(50% 0.090 235)',      max: 'oklch(94% 0.048 215)',   min: 'oklch(20% 0.060 240)'  },
  orange:  { role: 'terracotta / earth accent',                    root: 'oklch(58% 0.115 35)',       max: 'oklch(96% 0.025 45)',    min: 'oklch(20% 0.065 30)'   },
  yellow:  { role: 'illumination accent',                          root: 'oklch(72% 0.115 95)',       max: 'oklch(96% 0.025 90)',    min: 'oklch(28% 0.060 100)'  },
  lime:    { role: 'sage-adjacent accent',                         root: 'oklch(65% 0.110 115)',      max: 'oklch(95% 0.025 125)',   min: 'oklch(25% 0.060 110)'  },
  emerald: { role: 'alt saturated green',                          root: 'oklch(56% 0.115 170)',      max: 'oklch(96% 0.025 165)',   min: 'oklch(20% 0.065 175)'  },
  blue:    { role: 'deep slate (post sky-drop)',                   root: 'oklch(48% 0.090 245)',      max: 'oklch(95% 0.025 240)',   min: 'oklch(18% 0.060 250)'  },
  indigo:  { role: 'external systems / partners',                  root: 'oklch(55% 0.095 265)',      max: 'oklch(95% 0.030 270)',   min: 'oklch(22% 0.060 260)'  },
  violet:  { role: 'data / AI / inference',                        root: 'oklch(55% 0.100 300)',      max: 'oklch(95% 0.030 315)',   min: 'oklch(22% 0.065 295)'  },
  purple:  { role: 'alt violet',                                   root: 'oklch(52% 0.105 285)',      max: 'oklch(95% 0.030 295)',   min: 'oklch(20% 0.070 280)'  },
  fuchsia: { role: 'vivid magenta accent',                         root: 'oklch(58% 0.130 325)',      max: 'oklch(95% 0.030 335)',   min: 'oklch(22% 0.075 320)'  },
  pink:    { role: 'warm-shifted pink',                            root: 'oklch(60% 0.100 340)',      max: 'oklch(95% 0.025 348)',   min: 'oklch(22% 0.060 335)'  },
  rose:    { role: 'community / relational',                       root: 'oklch(55% 0.100 355)',      max: 'oklch(95% 0.025 0)',     min: 'oklch(22% 0.065 350)'  },
};

const FAMILY_ORDER = [
  'teal', 'sage', 'sand',
  'red', 'amber', 'green', 'cyan',
  'orange', 'yellow', 'lime', 'emerald',
  'blue', 'indigo', 'violet', 'purple',
  'fuchsia', 'pink', 'rose',
];

// Slider value → canonical stop-name table. Canon scale = 50 lightest → 950 darkest.
// Slider 0 = min anchor (darkest, 950 end). Slider 100 = max anchor (lightest, 50 end).
const TICKS = [
  { value: 0,   stop: 950, role: 'min anchor' },
  { value: 10,  stop: 900 },
  { value: 20,  stop: 800 },
  { value: 30,  stop: 700 },
  { value: 40,  stop: 600 },
  { value: 50,  stop: 500, role: 'root' },
  { value: 60,  stop: 400 },
  { value: 70,  stop: 300 },
  { value: 80,  stop: 200 },
  { value: 90,  stop: 100 },
  { value: 100, stop: 50,  role: 'max anchor' },
];
const TICK_VALUES = TICKS.map(t => t.value);

// ---- Interpolation ----
// Slider 0–50 interpolates (min, root) with t = value / 50.
// Slider 50–100 interpolates (root, max) with t = (value - 50) / 50.
// We use culori's OKLCH interpolator to stay in OKLCH space.

function interpolateAlongFamily(familySlug, value) {
  const fam = FAMILIES[familySlug] || FAMILIES.teal;
  const root = parse(fam.root);
  const min = parse(fam.min);
  const max = parse(fam.max);
  if (value <= 50) {
    const t = value / 50; // 0 at min, 1 at root
    return interpolate([min, root], 'oklch')(t);
  } else {
    const t = (value - 50) / 50; // 0 at root, 1 at max
    return interpolate([root, max], 'oklch')(t);
  }
}

// ---- Stop-name derivation ----
// Slider value → stop number. Continuous-in-value (value 35 → between stop-700 and
// stop-600 → "teal-650"). Snap to a real canonical stop name if on a tick (±0.5).
function stopNameForValue(familySlug, value) {
  // Snap to canonical if within ±0.5 of a tick (which is what slider step=1 gives us anyway).
  const nearestTick = TICKS.reduce((best, t) =>
    Math.abs(t.value - value) < Math.abs(best.value - value) ? t : best
  , TICKS[0]);
  if (Math.abs(nearestTick.value - value) < 0.5) {
    return {
      stop: nearestTick.stop,
      label: `${familySlug}-${nearestTick.stop}`,
      role: nearestTick.role || null,
      onTick: true,
    };
  }
  // Continuous interpolation between flanking ticks. The stop-number axis is
  // inverted from the slider axis (slider 0 → stop 950; slider 100 → stop 50).
  // Linear interp between the flanking tick stop numbers.
  const sorted = TICKS.slice().sort((a, b) => a.value - b.value);
  let lo = sorted[0], hi = sorted[sorted.length - 1];
  for (let i = 0; i < sorted.length - 1; i++) {
    if (value >= sorted[i].value && value <= sorted[i + 1].value) {
      lo = sorted[i]; hi = sorted[i + 1]; break;
    }
  }
  const t = (value - lo.value) / (hi.value - lo.value || 1);
  const stop = Math.round(lo.stop + (hi.stop - lo.stop) * t);
  return {
    stop,
    label: `${familySlug}-${stop}`,
    role: null,
    onTick: false,
  };
}

// ---- Formatting ----

function fmtOklch(c) {
  if (!c) return 'oklch(0% 0 0)';
  const L = ((c.l ?? 0) * 100).toFixed(2);
  const C = (c.c ?? 0).toFixed(4);
  const H = (c.h ?? 0).toFixed(2);
  return `oklch(${L}% ${C} ${H})`;
}

function fmtHex(c) {
  return (formatHex(c) || '#000000').toUpperCase();
}

function fmtRgb(c) {
  // Use culori's formatRgb for sRGB output, then normalize to the "rgb(R, G, B)"
  // shape designers expect to paste.
  const s = formatRgb(c) || 'rgb(0, 0, 0)';
  return s.replace(/\s+/g, ' ').replace(/,(\S)/g, ', $1');
}

function fmtHsl(c) {
  const s = formatHsl(c) || 'hsl(0, 0%, 0%)';
  return s.replace(/\s+/g, ' ').replace(/,(\S)/g, ', $1');
}

// ---- Track gradient ----
// Render the slider track as an OKLCH gradient from min → root → max. We
// sample 21 stops along the OKLCH line (every 5% slider value) so browsers
// that don't yet support `oklch()` gradient stops still get a faithful
// approximation via the hex per-stop. Modern browsers interpolate smoothly.

function buildTrackGradient(familySlug) {
  const stops = [];
  for (let v = 0; v <= 100; v += 5) {
    const c = interpolateAlongFamily(familySlug, v);
    stops.push(`${fmtOklch(c)} ${v}%`);
  }
  return `linear-gradient(to right, ${stops.join(', ')})`;
}

// ---- Clipboard ----

async function copyToClipboard(text, button) {
  // Fire the visual feedback optimistically so the designer sees confirmation
  // even when the clipboard API rejects (headless QA, non-secure contexts,
  // restricted iframes). The actual copy attempt happens in parallel; failures
  // are logged but do not unwind the visual state.
  if (button) {
    button.classList.add('is-copied');
    button.setAttribute('aria-label', 'Copied');
    setTimeout(() => {
      button.classList.remove('is-copied');
      button.setAttribute('aria-label', button.dataset.copyAriaLabel || 'Copy');
    }, 1100);
  }
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for non-secure contexts: hidden textarea + execCommand.
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'absolute';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    return true;
  } catch (e) {
    console.warn('hue-family-picker: clipboard copy failed', e);
    return false;
  }
}

// ---- Per-instance init ----

function initPicker(picker) {
  // Resolve elements (markup contract — see forms-hue-family-picker.html)
  const familySelect = picker.querySelector('[data-hfp-family-select]');
  const slider = picker.querySelector('[data-hfp-slider]');
  const ticksHost = picker.querySelector('[data-hfp-ticks]');
  const trackHost = picker.querySelector('[data-hfp-track]');
  const swatch = picker.querySelector('[data-hfp-swatch]');
  const stopLabel = picker.querySelector('[data-hfp-stop-label]');
  const stopRole = picker.querySelector('[data-hfp-stop-role]');
  const gamutBadge = picker.querySelector('[data-hfp-gamut-badge]');
  const valueRows = picker.querySelectorAll('[data-hfp-value-row]');

  if (!slider || !swatch || !stopLabel) {
    console.warn('hue-family-picker: missing required elements');
    return;
  }

  // State
  let currentFamily = picker.dataset.family || 'teal';
  if (!FAMILIES[currentFamily]) currentFamily = 'teal';
  let currentValue = clampSliderValue(parseInt(picker.dataset.value, 10));

  function clampSliderValue(v) {
    if (!Number.isFinite(v)) return 50;
    return Math.max(0, Math.min(100, Math.round(v)));
  }

  function nearestTick(value) {
    return TICK_VALUES.reduce((best, tv) =>
      Math.abs(tv - value) < Math.abs(best - value) ? tv : best
    , TICK_VALUES[0]);
  }

  // Populate family selector
  if (familySelect && familySelect.options.length === 0) {
    for (const slug of FAMILY_ORDER) {
      const opt = document.createElement('option');
      opt.value = slug;
      opt.textContent = `${slug} — ${FAMILIES[slug].role}`;
      if (slug === currentFamily) opt.selected = true;
      familySelect.appendChild(opt);
    }
  } else if (familySelect) {
    familySelect.value = currentFamily;
  }

  // Build tick marks
  if (ticksHost && ticksHost.children.length === 0) {
    for (const tick of TICKS) {
      const tickEl = document.createElement('button');
      tickEl.type = 'button';
      tickEl.className = 'hue-family-picker-tick';
      tickEl.setAttribute('data-tick-value', String(tick.value));
      tickEl.setAttribute('aria-label', `Jump to stop ${tick.stop}${tick.role ? ` (${tick.role})` : ''}`);
      tickEl.style.left = `${tick.value}%`;
      const label = document.createElement('span');
      label.className = 'hue-family-picker-tick-label';
      label.textContent = String(tick.stop);
      tickEl.appendChild(label);
      ticksHost.appendChild(tickEl);
    }
  }

  // ---- Render ----
  function render(source = 'set') {
    // Track gradient
    if (trackHost) {
      trackHost.style.setProperty('--hfp-track-gradient', buildTrackGradient(currentFamily));
    }

    // Active tick highlight + slider value attr
    slider.value = String(currentValue);
    slider.setAttribute('aria-valuenow', String(currentValue));

    if (ticksHost) {
      const onTick = TICK_VALUES.includes(currentValue);
      ticksHost.querySelectorAll('.hue-family-picker-tick').forEach(t => {
        const tv = parseInt(t.getAttribute('data-tick-value'), 10);
        t.classList.toggle('is-active', onTick && tv === currentValue);
      });
    }

    // Compute color
    const c = interpolateAlongFamily(currentFamily, currentValue);
    const oklchStr = fmtOklch(c);
    const hexStr = fmtHex(c);
    const rgbStr = fmtRgb(c);
    const hslStr = fmtHsl(c);
    const inGamut = displayable(c); // sRGB-displayable check

    // Swatch
    swatch.style.background = oklchStr;

    // Stop label
    const stopInfo = stopNameForValue(currentFamily, currentValue);
    stopLabel.textContent = stopInfo.label;
    stopLabel.classList.toggle('is-on-tick', stopInfo.onTick);
    if (stopRole) {
      stopRole.textContent = stopInfo.role ? `· ${stopInfo.role}` : '';
    }
    slider.setAttribute('aria-valuetext',
      `${stopInfo.label}${stopInfo.role ? ` (${stopInfo.role})` : ''}`
    );

    // Gamut badge
    if (gamutBadge) {
      gamutBadge.hidden = inGamut;
    }

    // Value rows
    const valuesByKey = {
      oklch: oklchStr,
      hex: hexStr,
      rgb: rgbStr,
      hsl: hslStr,
    };
    valueRows.forEach(row => {
      const key = row.getAttribute('data-hfp-value-row');
      const valEl = row.querySelector('[data-hfp-value]');
      const btn = row.querySelector('[data-hfp-copy]');
      const val = valuesByKey[key] || '';
      if (valEl) valEl.textContent = val;
      if (btn) btn.setAttribute('data-copy-text', val);
    });

    // Dispatch event
    picker.dispatchEvent(new CustomEvent('hue-pick', {
      bubbles: true,
      detail: {
        family: currentFamily,
        value: currentValue,
        oklch: oklchStr,
        hex: hexStr,
        rgb: rgbStr,
        hsl: hslStr,
        stopName: stopInfo.label,
        stopRole: stopInfo.role,
        inGamut,
        source,
      },
    }));
  }

  // ---- Interactions ----
  let shiftHeld = false;
  document.addEventListener('keydown', e => { if (e.key === 'Shift') shiftHeld = true; });
  document.addEventListener('keyup',   e => { if (e.key === 'Shift') shiftHeld = false; });

  slider.addEventListener('input', e => {
    let v = clampSliderValue(parseInt(slider.value, 10));
    // Shift-drag snaps to nearest tick.
    if (shiftHeld) v = nearestTick(v);
    currentValue = v;
    render('pointer');
  });

  // Keyboard: native arrow keys handle ±1; Shift+arrow on native input is
  // also ±1 (Step is 1). Override Shift+arrow to ±10 (snap to next tick) and
  // Home/End to anchors. We use 'keydown' (not just 'input') so we can
  // override Shift behavior cleanly.
  slider.addEventListener('keydown', e => {
    let handled = false;
    if (e.key === 'Home') { currentValue = 0; handled = true; }
    else if (e.key === 'End') { currentValue = 100; handled = true; }
    else if (e.shiftKey && (e.key === 'ArrowRight' || e.key === 'ArrowUp')) {
      // Move to the next tick to the right.
      const next = TICK_VALUES.find(tv => tv > currentValue);
      currentValue = next !== undefined ? next : 100;
      handled = true;
    } else if (e.shiftKey && (e.key === 'ArrowLeft' || e.key === 'ArrowDown')) {
      const prev = [...TICK_VALUES].reverse().find(tv => tv < currentValue);
      currentValue = prev !== undefined ? prev : 0;
      handled = true;
    }
    if (handled) {
      e.preventDefault();
      slider.value = String(currentValue);
      render('keyboard');
    }
  });

  // Tick clicks jump to that stop.
  if (ticksHost) {
    ticksHost.addEventListener('click', e => {
      const tickEl = e.target.closest('.hue-family-picker-tick');
      if (!tickEl) return;
      const v = parseInt(tickEl.getAttribute('data-tick-value'), 10);
      currentValue = clampSliderValue(v);
      render('tick');
    });
  }

  // Family selector
  if (familySelect) {
    familySelect.addEventListener('change', e => {
      const next = familySelect.value;
      if (FAMILIES[next]) {
        currentFamily = next;
        currentValue = 50; // reset to root on family change
        render('family');
      }
    });
  }

  // Copy buttons
  picker.querySelectorAll('[data-hfp-copy]').forEach(btn => {
    if (!btn.dataset.copyAriaLabel) {
      btn.dataset.copyAriaLabel = btn.getAttribute('aria-label') || 'Copy';
    }
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy-text') || '';
      copyToClipboard(text, btn);
    });
  });

  // Expand drawer toggle (compact variant only). The toggle button is
  // optional — its absence means the picker is in standalone mode.
  const expandToggle = picker.querySelector('[data-hfp-expand-toggle]');
  if (expandToggle) {
    expandToggle.addEventListener('click', () => {
      const expanded = picker.classList.toggle('is-expanded');
      expandToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      expandToggle.setAttribute('aria-label',
        expanded ? 'Hide additional color formats' : 'Show additional color formats'
      );
    });
  }

  // Programmatic API
  Object.defineProperty(picker, '_hueFamilyPicker', {
    value: {
      setValue(n) {
        currentValue = clampSliderValue(n);
        render('set');
      },
      setFamily(slug) {
        if (FAMILIES[slug]) {
          currentFamily = slug;
          if (familySelect) familySelect.value = slug;
          currentValue = 50;
          render('set');
        }
      },
      getState() {
        const c = interpolateAlongFamily(currentFamily, currentValue);
        return {
          family: currentFamily,
          value: currentValue,
          oklch: fmtOklch(c),
          hex: fmtHex(c),
          rgb: fmtRgb(c),
          hsl: fmtHsl(c),
          stopName: stopNameForValue(currentFamily, currentValue).label,
          inGamut: displayable(c),
        };
      },
    },
    enumerable: false,
    writable: false,
  });

  // Initial render.
  render('set');
}

// ---- Bootstrap ----
function initAll() {
  document.querySelectorAll('[data-hue-family-picker]').forEach((picker) => {
    if (picker._hueFamilyPicker) return; // already initialized, skip
    initPicker(picker);
  });
}

// Public re-init hook for consumers that mount pickers dynamically
// (e.g. theme editors that re-render markup after preset / mode changes).
// Idempotent — skips pickers that already carry _hueFamilyPicker.
export { initAll as initHueFamilyPickers };

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}
