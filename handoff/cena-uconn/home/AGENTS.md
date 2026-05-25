# AGENTS — Home slice

Read [`README.md`](./README.md) first. This slice is the IA-v1 Home surface (3 static state pages + the new `patient-focus-card` primitive).

## Ground rules (inherit from `../AGENTS.md`)

- **Copy semantic classes from `../assets/haven.css`. Do not regenerate equivalents.** If a class is missing, it's a gap — surface it, don't invent a substitute.
- **Do not modify `../assets/haven.css` directly** — regenerate from haven-ui source (see README "Rebuilding the assets"). This slice added `patient-focus-card` to the design system and rebuilt the bundle.
- Nav is **IA-v1 3-tab** (Home · Order · Activity). The sibling slices (assessments, log-outcome) still use the demo-era 5-tab nav — that is **known drift pending reconciliation**, not the canon. Build new patient surfaces against the 3-tab IA.

## What's intentionally NOT here

- **`home.js` (the live zone controller)** — `aria-live`, dismiss-memory, post-dismiss focus, Surfacer sequencing. Static pages carry the markup contract (see README "Behavior to implement on port"); the controller is the next build step / the Angular port's responsibility.
- **First-run / consent** — owned by `flow-onboarding`; gates Home.
- **Caught-up affirmation as a primitive** — it's an inline chrome-less block here; promote to a PL entry only if a second surface needs the same treatment.
