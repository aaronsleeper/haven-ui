---
slot: 4
slot-name: framework-binding
primary-author: Tech Lead
project: cena-platform
created: 2026-05-26
status: ratified
consumes:
  - stack.md
mode: ratify
---

# Framework Binding — Cena Care-Coordinator Platform (ratify)

**Ratified, not re-derived.** Confirms how the Tier-A target binds to haven-ui authoring.

- **Authoring substrate:** semantic-class HTML composed from `packages/design-system/pattern-library/` — class names from `components.css`, copied (never generated) per the pattern-library-first rule. No hand-authored markup, no invented classes, no inline `style=`/`<style>` (Guardrail: gap → stop and flag).
- **Compiled CSS:** the pattern library compiles to one self-contained `assets/haven.css` per the rebuild script. Screens link `../assets/haven.css` + the Google-Fonts Lora / Source Sans 3 / Source Code Pro stack (the cena-uconn head block).
- **Bundle assembly:** `scripts/handoff-rebuild-bundle.sh` only — never a CSS-only edit (Guardrail 1). The script copies `haven.css`, font binaries, the Cena logo, and the behavior JS (`flow-actions.js`, `quantity-stepper.js`, `panel-splitter.js`, etc.) into `handoff/cena-platform/assets/`.
- **Interactive behavior:** Preline `data-hs-*` attributes for overlays/accordions/steppers; per-primitive vanilla ES modules where the PL ships them (e.g. `context-menu.js`, `command-palette.js`, `file-upload.js`). Imported unchanged into the static bundle.
- **Render path:** every screen must render under `file://` with relative paths — no dev server assumed (self-contained-handoff discipline, [[feedback_self_contained_handoff_format]]).

Resolves: steps.md step 0.4.
