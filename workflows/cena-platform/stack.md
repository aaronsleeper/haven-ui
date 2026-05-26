---
slot: 3
slot-name: stack-declaration
primary-author: Tech Lead
project: cena-platform
created: 2026-05-26
status: ratified
consumes:
  - Knowledge/Projects/Cena Health/Apps/Platform/Redesign Brief.md
mode: ratify
---

# Stack Declaration — Cena Care-Coordinator Platform (ratify)

**Ratified, not re-derived.** The brief's `Bindings + variables` already resolved the stack; this confirms it holds for the whole-app run.

- **Build target:** Tier-A static HTML/CSS, self-contained bundle, emitted from the haven-ui pattern library — the patient-app emit pattern (`handoff/cena-uconn/`). NOT React, NOT Angular. No build framework, no router, no runtime data layer.
- **Why this tier:** per [[feedback_ownership_bar_over_language]] and the brief — the static-HTML handoff is the DS-native artifact and is **not** gated on Andrey buy-in. Andrey sees the built UI *after* it exists; the production-stack (React vs Angular) ownership call is a downstream Andrey/Vanessa decision once the UI is real.
- **Runtime primitives the static bundle relies on:** Preline (vendored ES module, for dropdowns/accordions/modals/steppers where the composed PL components require it) + the framework-agnostic `flow-actions.js` behavior primitive (navigation + in-place save + reveal-submit without a router, `file://`-safe). Both already ship in the cena-uconn bundle's `assets/` and are copied by `handoff-rebuild-bundle.sh`.
- **No data contracts (slot 15) for this tier** — screens compose representative/synthetic copy only; production data layer is Andrey's. No real patient/business data in any screen (Priority 1, data safety).

Resolves: steps.md step 0.3.
