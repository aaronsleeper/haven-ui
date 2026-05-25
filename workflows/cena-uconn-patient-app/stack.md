---
slot: 3
slot-name: stack-declaration
primary-author: Tech Lead
project: cena-uconn-patient-app
created: 2026-05-24
status: in-review
consumes:
  - brief.md#constraints
inputs-hash: null
friction: []
pre-flight-authority: aaron
---

# Stack Declaration — Cena × UConn Patient App

Declares the target stack, deploy target, repo, and a11y/perf tiers. **Scoped to the formative + owned-prototype layer** — production-runtime stack (T0.1) is a separate Andrey/Vanessa decision this run does not make.

## Two distinct stack questions (do not conflate)

| Question | Owner | This run |
|---|---|---|
| **What do we author + own as the design realization?** | Aaron + agents | **Decided here:** self-contained static HTML composed from haven-ui PL |
| **What does Cena production ship the patient app in?** (React vs Angular) | **Andrey + Vanessa (T0.1)** | **Out of scope** — not resolvable here; build waits on it |

This split is the load-bearing decision. See [[feedback_ownership_bar_over_language]]: the bar is whether **we own and maintain** the artifact without Andrey, not which language we can emit.

## Declared stack (owned-prototype / design-realization)

- **Target:** static HTML5 + the compiled haven-ui CSS bundle (`assets/haven.css`) + FontAwesome Pro v7 font binaries. No JavaScript framework. Native `<details>` for disclosure (no Preline in the bundle).
- **Composition:** every surface composes **referenced** pattern-library components (the chrome is a referenced DS shell component — `layout-mobile-shell` + `layout-mobile-bottom-nav`; never hand-rolled). Closed-vocabulary contract; render gate enforces.
- **Self-contained:** relative asset paths; renders under `file://`; a single static HTTP server suffices. Fonts via Google Fonts CDN (standard pattern).
- **Repo:** `CenaHealth/haven-ui` at `Lab/haven-ui`. Build output under `handoff/cena-uconn/<surface>/`.
- **Why this is "owned":** HTML+CSS from the PL is the design system's native stack; we have built and maintained it (assessments/meals/log-outcome/home slices). It carries no React-ownership liability and is not a translation handoff to Angular (that would be the T0.1 production pipeline, a separate decision).

## Deploy target

- **Formative phase:** none — these are documents.
- **Prototype phase:** static hosting (local `python3 -m http.server`, or a static host) for review/render-verification. Not a production deploy.
- **Production deploy:** owned by T0.1 outcome (Cena's runtime, Andrey). Out of scope.

## Accessibility tier

- **WCAG 2.2 AA** (regulated/vulnerable population). Mobile-first target sizes ≥44px; visible focus; keyboard operable; screen-reader walkthrough at slot 27.

## Performance tier

- Client-facing → perf-audit (slot 28) **required at build**. Self-contained bundle keeps payload small; no framework runtime. Core Web Vitals measured at build; budgets set in framework-binding.

## Constraints inherited

- 3-tab nav canon (Home · Order · Activity).
- Rebuild only via `scripts/handoff-rebuild-bundle.sh` (never CSS-only — font-binary/glyph hazard, Guardrail 1).
- No inline styles (DESIGN.md propagation discipline); semantic classes only.
