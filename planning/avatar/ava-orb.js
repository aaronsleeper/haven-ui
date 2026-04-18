/**
 * Ava Orb — Vanilla Three.js animated avatar for Cena Health
 *
 * Raytraced sphere with curved gradient arcs.
 * State-driven animation where each state has a fundamentally
 * different motion CHARACTER, not just different parameter values.
 *
 * Idle:      heavy, languid, slow breathing — arcs drift wide and slow
 * Listening: held breath, contracted, tense stillness — arcs gather inward
 * Thinking:  electric, irregular bursts — arcs fragment and flicker
 * Speaking:  rhythmic, confident pulse — arcs expand/contract on a beat
 */

// Three.js loaded via global <script> tag

const COLORS = {
  forest:    "#0D322D",
  teal500:   "#3A8478",
  teal600:   "#52A395",
  sage700:   "#81B983",
  warmGold:  "#C9A84C",
  coolBlue:  "#4A8DB7",
};

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform float uSpeed;
uniform float uIntensity;
uniform float uOpacity;
uniform float uInverted;
uniform float uStretchMod;
uniform float uColorShift;
uniform float uConverge;
uniform float uRhythmPulse;    // 0-1 rhythmic expand/contract (speaking)
uniform float uFragmentation;  // 0 = smooth arcs, 1 = broken/flickering segments (thinking)
uniform float uBreathPhase;    // slow sine for idle breathing
uniform vec3 uColor0;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform vec3 uColor5;

varying vec2 vUv;

// ── Simplex 3D noise ────────────────────────────────────────────────
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise3(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

// ── 3D rotation helpers ─────────────────────────────────────────────
vec3 rotX(vec3 p, float a) {
  float c = cos(a), s = sin(a);
  return vec3(p.x, c*p.y - s*p.z, s*p.y + c*p.z);
}
vec3 rotY(vec3 p, float a) {
  float c = cos(a), s = sin(a);
  return vec3(c*p.x + s*p.z, p.y, -s*p.x + c*p.z);
}
vec3 rotZ(vec3 p, float a) {
  float c = cos(a), s = sin(a);
  return vec3(c*p.x - s*p.y, s*p.x + c*p.y, p.z);
}

// ── Arc-shaped noise ────────────────────────────────────────────────
float arcNoise(vec3 pos, vec3 rot, float stretch, float freq, float t, float bandSeed) {
  vec3 rp = rotZ(rotY(rotX(pos, rot.x), rot.y), rot.z);

  float theta = atan(rp.z, rp.x);
  float phi = asin(clamp(rp.y, -1.0, 1.0));

  float finalStretch = stretch * uStretchMod;

  vec3 samplePt = vec3(
    theta * freq,
    phi * freq / finalStretch,
    t
  );

  float n = snoise3(samplePt) * 0.65
          + snoise3(samplePt * 2.1 + vec3(7.3, 2.1, 0.0)) * 0.35;

  // Fragmentation: break continuous arcs into flickering segments
  // Uses high-frequency noise gated by uFragmentation to punch holes in arcs
  if (uFragmentation > 0.01) {
    float fragNoise = snoise3(vec3(theta * 4.0, phi * 2.0, t * 3.0 + bandSeed * 10.0));
    float fragMask = smoothstep(-0.2, 0.4, fragNoise);
    // Mix between smooth (fragMask=1) and fragmented
    n *= mix(1.0, fragMask, uFragmentation);
  }

  return n;
}

vec3 screenBlend(vec3 base, vec3 layer) {
  return 1.0 - (1.0 - base) * (1.0 - layer);
}

vec2 intersectSphere(vec3 ro, vec3 rd, float radius) {
  float b = dot(ro, rd);
  float c = dot(ro, ro) - radius * radius;
  float disc = b * b - c;
  if (disc < 0.0) return vec2(-1.0);
  float sq = sqrt(disc);
  return vec2(-b - sq, -b + sq);
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;

  vec3 ro = vec3(0.0, 0.0, 2.5);
  vec3 rd = normalize(vec3(uv, -1.5));

  vec2 hit = intersectSphere(ro, rd, 1.0);
  if (hit.x < 0.0) {
    gl_FragColor = vec4(0.0);
    return;
  }

  vec3 pNear = ro + rd * hit.x;
  vec3 pFar  = ro + rd * hit.y;
  vec3 normal = normalize(pNear);

  float fresnel = pow(1.0 - abs(dot(normal, -rd)), 3.0);

  float t = uTime * uSpeed;

  // Convergence factor
  float convFactor = uConverge * 0.3;

  // Rhythmic pulse: modulates arc width (squash/stretch on a beat)
  // When speaking, arcs physically expand and contract
  float rhythmStretch = 1.0 - uRhythmPulse * 0.3; // pulse narrows arcs on beat
  float rhythmIntensity = 1.0 + uRhythmPulse * 0.4; // pulse brightens on beat

  // Breath: gentle scale for idle (very slow, makes orb feel heavy and alive)
  float breathScale = 1.0 + uBreathPhase * 0.06;

  // Color warmth bias
  float warmMix = 1.0 + uColorShift * 0.5;
  float coolMix = 1.0 - uColorShift * 0.3;

  vec3 color = vec3(0.0);

  // Band 0: forest
  {
    float depth = 0.75 - convFactor * uConverge;
    vec3 sp = mix(pNear, pFar, depth) * breathScale;
    vec3 r = vec3(0.3, t * 0.10, -0.2);
    float n = arcNoise(sp, r, 5.0 * rhythmStretch, 1.0, t * 0.10, 0.0);
    float band = smoothstep(0.15, 0.5, n) * smoothstep(0.85, 0.5, n);
    color = screenBlend(color, uColor0 * band * 1.2 * rhythmIntensity);
  }

  // Band 1: teal 500
  {
    float depth = 0.55 - convFactor * uConverge;
    vec3 sp = mix(pNear, pFar, depth) * breathScale;
    vec3 r = vec3(-t * 0.13, 0.8, 0.4);
    float n = arcNoise(sp, r, 5.5 * rhythmStretch, 1.2, t * 0.14, 1.0);
    float band = smoothstep(0.1, 0.48, n) * smoothstep(0.82, 0.48, n);
    color = screenBlend(color, uColor1 * band * 1.1 * coolMix * rhythmIntensity);
  }

  // Band 2: teal 600
  {
    float depth = 0.4 - convFactor * uConverge;
    vec3 sp = mix(pNear, pFar, depth) * breathScale;
    vec3 r = vec3(t * 0.09 + 1.2, -0.5, t * 0.07);
    float n = arcNoise(sp, r, 7.0 * rhythmStretch, 1.3, t * 0.18, 2.0);
    float band = smoothstep(0.18, 0.48, n) * smoothstep(0.78, 0.48, n);
    color = screenBlend(color, uColor2 * band * 1.0 * coolMix * rhythmIntensity);
  }

  // Band 3: sage
  {
    float depth = 0.2 + convFactor * uConverge * 0.5;
    vec3 sp = mix(pNear, pFar, depth) * breathScale;
    vec3 r = vec3(-0.6, 0.3, -t * 0.12 + 2.0);
    float n = arcNoise(sp, r, 6.0 * rhythmStretch, 1.1, t * 0.16, 3.0);
    float band = smoothstep(0.12, 0.46, n) * smoothstep(0.82, 0.46, n);
    color = screenBlend(color, uColor3 * band * 1.0 * warmMix * rhythmIntensity);
  }

  // Band 4: warm gold
  {
    float depth = 0.35 - convFactor * uConverge * 0.5;
    vec3 sp = mix(pNear, pFar, depth) * breathScale;
    vec3 r = vec3(0.9, -t * 0.08, t * 0.11 + 3.5);
    float n = arcNoise(sp, r, 7.5 * rhythmStretch, 1.4, t * 0.12, 4.0);
    float band = smoothstep(0.2, 0.5, n) * smoothstep(0.78, 0.5, n);
    color = screenBlend(color, uColor4 * band * 0.7 * warmMix * rhythmIntensity);
  }

  // Band 5: cool blue
  {
    float depth = 0.6 - convFactor * uConverge;
    vec3 sp = mix(pNear, pFar, depth) * breathScale;
    vec3 r = vec3(t * 0.07 + 0.4, t * 0.06, -1.1);
    float n = arcNoise(sp, r, 5.0 * rhythmStretch, 1.0, t * 0.15, 5.0);
    float band = smoothstep(0.1, 0.46, n) * smoothstep(0.85, 0.46, n);
    color = screenBlend(color, uColor5 * band * 0.6 * coolMix * rhythmIntensity);
  }

  // Bright highlights at overlaps
  float brightness = dot(color, vec3(0.299, 0.587, 0.114));
  color += color * smoothstep(0.4, 0.8, brightness) * 0.3;

  // Fresnel
  vec3 fresnelColor = mix(uColor2, uColor5, 0.3);
  color += fresnelColor * fresnel * 0.35;

  // Specular
  vec3 lightDir = normalize(vec3(-0.4, 0.6, 1.0));
  float spec = pow(max(dot(reflect(rd, normal), lightDir), 0.0), 24.0);
  color += vec3(1.0) * spec * 0.12;

  // Intensity
  color *= uIntensity;

  // Light theme
  if (uInverted < 0.5) {
    float lum = dot(color, vec3(0.299, 0.587, 0.114));
    color = mix(vec3(lum), color, 1.5);
    color *= 1.15;
  }

  gl_FragColor = vec4(color, uOpacity);
}
`;

// ── Helpers ─────────────────────────────────────────────────────────

function clamp01(n) {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

// ── Orb class ───────────────────────────────────────────────────────

class AvaOrb {
  constructor(container, options = {}) {
    this.container = container;
    this.inverted = options.inverted ?? 0;
    this.state = null;

    this._target = {
      speed: 0.3,         // idle starts slow
      intensity: 1.0,
      stretchMod: 1.0,
      colorShift: 0.0,
      converge: 0.0,
      fragmentation: 0.0,
    };
    this._cur = { ...this._target };

    this._initThree();
    this._startLoop();
  }

  _initThree() {
    const w = this.container.clientWidth || 200;
    const h = this.container.clientHeight || 200;
    const dpr = Math.min(window.devicePixelRatio, 2);

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      premultipliedAlpha: true,
    });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(dpr);
    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    this.camera.position.z = 1;

    this.uniforms = {
      uTime:          new THREE.Uniform(0),
      uSpeed:         new THREE.Uniform(0.3),
      uIntensity:     new THREE.Uniform(1.0),
      uOpacity:       new THREE.Uniform(0),
      uInverted:      new THREE.Uniform(this.inverted),
      uStretchMod:    new THREE.Uniform(1.0),
      uColorShift:    new THREE.Uniform(0.0),
      uConverge:      new THREE.Uniform(0.0),
      uRhythmPulse:   new THREE.Uniform(0.0),
      uFragmentation: new THREE.Uniform(0.0),
      uBreathPhase:   new THREE.Uniform(0.0),
      uColor0:        new THREE.Uniform(new THREE.Color(COLORS.forest)),
      uColor1:        new THREE.Uniform(new THREE.Color(COLORS.teal500)),
      uColor2:        new THREE.Uniform(new THREE.Color(COLORS.teal600)),
      uColor3:        new THREE.Uniform(new THREE.Color(COLORS.sage700)),
      uColor4:        new THREE.Uniform(new THREE.Color(COLORS.warmGold)),
      uColor5:        new THREE.Uniform(new THREE.Color(COLORS.coolBlue)),
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);

    this._resizeObserver = new ResizeObserver(() => {
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.renderer.setSize(w, h);
    });
    this._resizeObserver.observe(this.container);
  }

  _startLoop() {
    const clock = new THREE.Clock();

    const tick = () => {
      this._raf = requestAnimationFrame(tick);
      const delta = clock.getDelta();
      const u = this.uniforms;
      const t = u.uTime.value;

      u.uTime.value += delta;

      // Fade in
      if (u.uOpacity.value < 1) {
        u.uOpacity.value = Math.min(1, u.uOpacity.value + delta * 2);
      }

      // ── State machines ────────────────────────────────────────

      // These produce fundamentally different motion TYPES, not just
      // different amounts of the same motion.

      // Rhythm pulse: only active during speaking (computed here, not in target)
      let rhythmPulse = 0.0;

      // Breath phase: slow sine, most visible in idle
      let breathPhase = Math.sin(t * 0.8) * 0.5 + 0.5; // 0-1, ~8 second cycle

      if (this.state === null) {
        // ── IDLE: heavy, languid, slow breathing ────────────────
        // The orb rests. Wide, slow-drifting arcs. Long sine curves.
        // Feels heavy and alive, like a sleeping creature breathing.
        this._target.speed        = 0.3;
        this._target.intensity    = 0.95 + Math.sin(t * 0.8) * 0.05; // subtle breath
        this._target.stretchMod   = 0.85;  // wider arcs — relaxed
        this._target.colorShift   = 0.0;   // neutral palette
        this._target.converge     = 0.0;   // natural spread
        this._target.fragmentation = 0.0;  // smooth, continuous
        breathPhase = Math.sin(t * 0.8);   // slow, prominent breathing

      } else if (this.state === "listening") {
        // ── LISTENING: held breath, contracted, tense stillness ──
        // Arcs gather inward like cupped hands. Motion nearly stops.
        // The orb contracts — anticipation without action.
        // Stillness with tension, ready to respond.
        this._target.speed        = 0.15;   // nearly frozen
        this._target.intensity    = 0.9;    // slightly dimmed — not the focus
        this._target.stretchMod   = 1.4;    // thinner arcs — taut
        this._target.colorShift   = -0.3;   // slight cool — receptive
        this._target.converge     = 0.8;    // strong inward pull — gathering
        this._target.fragmentation = 0.0;   // smooth — attentive, not chaotic
        breathPhase = Math.sin(t * 0.4) * 0.3; // shallow breath — held

      } else if (this.state === "thinking") {
        // ── THINKING: electric, irregular bursts ────────────────
        // Arcs fragment into shorter flickering segments.
        // Motion comes in quick bursts with micro-pauses.
        // The orb feels light and electric — synapses firing.
        // Irregular rhythm signals "working, not stuck."
        const burstNoise = Math.sin(t * 7.3) * Math.sin(t * 3.1) * Math.sin(t * 11.7);
        const burst = 0.3 + Math.abs(burstNoise) * 0.7; // irregular 0.3-1.0

        this._target.speed        = 1.2 * burst;  // irregular speed — bursts and pauses
        this._target.intensity    = 0.8 + burst * 0.4; // flicker with bursts
        this._target.stretchMod   = 1.6;    // thin, precise arcs
        this._target.colorShift   = -0.6;   // strong cool — computational
        this._target.converge     = 0.5;    // moderate inward — focused
        this._target.fragmentation = 0.7;   // arcs break into segments
        breathPhase = 0.0; // no breathing — electric

      } else if (this.state === "talking") {
        // ── SPEAKING: rhythmic, confident, expansive ────────────
        // Strong heartbeat-like pulse. Arcs expand on each beat,
        // contract between beats (squash and stretch).
        // Warm colors dominate — projecting, communicating.
        // Regular rhythm signals "I'm in control, listen."
        const beatRate = 2.2; // ~132 BPM feel
        const beat = Math.sin(t * Math.PI * beatRate);
        const beatEnvelope = Math.pow(Math.max(beat, 0.0), 0.6); // sharp attack, softer release

        this._target.speed        = 1.0;
        this._target.intensity    = 1.2 + beatEnvelope * 0.3;
        this._target.stretchMod   = 0.65;   // wide, bold arcs — expressive
        this._target.colorShift   = 0.6;    // warm — communicating
        this._target.converge     = -0.3;   // arcs push outward — projecting
        this._target.fragmentation = 0.0;   // smooth — confident, not scattered

        rhythmPulse = beatEnvelope; // drives physical arc width pulsing
        breathPhase = beat * 0.3;   // breathing syncs to speech rhythm
      }

      // ── Smooth interpolation ──────────────────────────────────
      // Different lerp rates: fast for rhythm-driven properties,
      // slow for character shifts (so transitions feel organic)

      const slowLerp = 0.04;  // character changes: ~1.5s to settle
      const fastLerp = 0.15;  // rhythm-responsive: snappy

      this._cur.speed         += (this._target.speed         - this._cur.speed)         * fastLerp;
      this._cur.intensity     += (this._target.intensity     - this._cur.intensity)     * fastLerp;
      this._cur.stretchMod    += (this._target.stretchMod    - this._cur.stretchMod)    * slowLerp;
      this._cur.colorShift    += (this._target.colorShift    - this._cur.colorShift)    * slowLerp;
      this._cur.converge      += (this._target.converge      - this._cur.converge)      * slowLerp;
      this._cur.fragmentation += (this._target.fragmentation - this._cur.fragmentation) * slowLerp;

      // Push to uniforms
      u.uSpeed.value          = this._cur.speed;
      u.uIntensity.value      = this._cur.intensity;
      u.uStretchMod.value     = this._cur.stretchMod;
      u.uColorShift.value     = this._cur.colorShift;
      u.uConverge.value       = this._cur.converge;
      u.uFragmentation.value  = this._cur.fragmentation;
      u.uRhythmPulse.value    = rhythmPulse;
      u.uBreathPhase.value    = breathPhase;

      this.renderer.render(this.scene, this.camera);
    };

    tick();
  }

  setState(state) {
    this.state = state;
  }

  dispose() {
    if (this._raf) cancelAnimationFrame(this._raf);
    if (this._resizeObserver) this._resizeObserver.disconnect();
    this.renderer.dispose();
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.container.removeChild(this.renderer.domElement);
  }
}

// ── Boot ────────────────────────────────────────────────────────────

window.addEventListener("load", () => {
  const orbs = {};

  function createOrb(containerId, options) {
    const el = document.getElementById(containerId);
    if (!el) return null;
    const orb = new AvaOrb(el, options);
    orbs[containerId] = orb;
    return orb;
  }

  createOrb("orb-light", { inverted: 0 });
  createOrb("orb-dark",  { inverted: 1 });
  createOrb("orb-48",    { inverted: 0 });
  createOrb("orb-40",    { inverted: 0 });
  createOrb("orb-32",    { inverted: 0 });

  document.querySelectorAll(".state-controls").forEach((controls) => {
    const target = controls.dataset.target;
    const orbId = `orb-${target}`;

    controls.querySelectorAll(".state-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        controls.querySelectorAll(".state-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const state = btn.dataset.state === "null" ? null : btn.dataset.state;
        if (orbs[orbId]) orbs[orbId].setState(state);

        if (target === "light") {
          ["orb-48", "orb-40", "orb-32"].forEach((id) => {
            if (orbs[id]) orbs[id].setState(state);
          });
        }
      });
    });
  });
});
