---
slot: 5
slot-name: design-system-binding
primary-author: DS Steward
project: cena-uconn-patient-app
created: 2026-05-24
status: in-review
consumes:
  - framework-binding.md
  - stack.md
inputs-hash: null
friction: []
pre-flight-authority: aaron
---

# Design-System Binding — Cena × UConn Patient App

Declares the design system, token map, allowed components, forbidden ad-hoc patterns, and escape-hatch policy. Canonical DS spec: `Lab/haven-ui/DESIGN.md` + `packages/design-system/pattern-library/COMPONENT-INDEX.md` (ground truth — "copy, don't generate").

## Declared DS + version

- **Haven Design System**, haven-ui repo (operationally canonical; Figma retired 2026-05-07).
- Pattern library: `packages/design-system/pattern-library/` (HTML+CSS spec). Tokens: `packages/design-system/src/styles/tokens/`. Compiled to `handoff/cena-uconn/assets/haven.css`.

## Token map (the four register dimensions — Principle 7)

- **Color:** teal (brand primary) + sand (warm-neutral surface family; canonical name, not `stone`); 9-family tag-semantic palette (`/04 /14 /16` stops); semantic singletons (`--color-text-normal/-muted/-faint`, `--color-border-default`, `--color-accent-interactive`). Source: `colors.css`. Patient surfaces lean calm/low-stimulation — sand surfaces, restrained teal, no alarm-red for due items.
- **Typography:** **Lora** (headings — greeting/page-title register), **Source Sans 3** (body/UI), **Source Code Pro** (mono). 4px scalar. Per-axis source: Cena brand spec for families; haven-ui for scale/tokens.
- **Density:** comfort default for the patient surface (low-tech-literacy, large tap targets ≥44px) — NOT the compact clinician density.
- **Motion:** restraint register. `--duration-*` / `--ease-*` tokens. **No marketing-cheerful springs, no ceremony motion on routine actions, no stagger-as-default, no motion-as-loading-disguise** (principles §12 motion-specific; clinical/sensitive register).
- **Icons:** **FontAwesome Pro v7.1.0**, local bundle (never CDN, never MDI). `foundations-icons.html` for usage rules.
- **Voice/tone:** codified in content-model (slot 8) + per-surface strings (slot 14); warm/plain/second-person/present, ~5th–6th grade, no jargon/gamification/surveillance.

## Allowed components (the patient-app subset of the PL)

Chrome / layout (the **shell is a referenced DS component**, not hand-rolled):
- `layout-mobile-shell` — `mobile-app` on `<body>`, `mobile-shell` inner wrapper; `pb-safe-4/8` for iOS home-indicator clearance. **Patient app only.**
- `layout-mobile-bottom-nav` — `mobile-bottom-nav`, `mobile-bottom-nav-tab`, `mobile-bottom-nav-badge`; shared partial `patient-bottom-nav.html`. **3 tabs: Home · Order · Activity.**
- `layout-mobile-i18n-bar` — EN/ES toggle (reserved; EN-only v1).
- `layout-app-shell-responsive` — desktop reflow counterpart (sidebar ≥lg, bottom-nav <lg, persistent topbar).
- `layout-container`, `layout-card` (+ header/title/subtitle/body/footer), `layout-stat-card`, `layout-section-title`, `layout-divider`, `layout-grid`, `layout-sticky-footer`, `layout-prose-section`, `layout-onb-progress` (consent steps), `layout-two-pane` (desktop where applicable).

Content/form components (per surface; confirm against COMPONENT-INDEX before use):
- `typography-page-title`, card variants, input/response-option, tag, button, dialog, receipt, text-link, skip-link. (Per-surface component-plan, slot 17, names the exact set + flags any gap.)

**Gaps to confirm at slot 17 (may need slot-12 visual-direction or a Tier-1 PL addition):** the **budget meter**, the Home **things-to-do focus card**, the **order basket / menu grid** composition. If a needed component is absent from COMPONENT-INDEX, that is a gap to surface — add to the PL first (Tier-1 ceremony), never invent app-local.

## Forbidden ad-hoc patterns

- Hand-rolled nav/shell (use the referenced shell components).
- The **5-tab demo nav** (assessments/meals/log-outcome siblings) — drift; do not propagate (Guardrail 4).
- Inline styles (`style=...`, scoped `<style>`) — break propagation (DESIGN.md).
- Arbitrary-value utilities (`max-w-[...]`, `grid-cols-[minmax(...)]`) — promote to a named pattern instead.
- Phantom classes with no backing token (`text-fg-muted` → use `text-sand-600`).
- Regenerating equivalents of existing PL components ("copy, don't generate").
- Count badges/scores/streaks/progress-on-people; alarm-red overdue styling.

## Escape-hatch policy

- A genuinely-new pattern logs a follow-up to **canonize** it into the PL (principles §12 — no escape hatch without a return path). Two routes: standard utility → `@source inline(...)` safelist + rebuild + re-gate; new component → `components.css` + COMPONENT-INDEX (Tier-1). The 3-use rule governs promotion (wait for 3 uses before codifying a one-off).
- Every escape hatch used in a surface is recorded in that surface's `components.md` (slot 17) and surfaced at retro.
