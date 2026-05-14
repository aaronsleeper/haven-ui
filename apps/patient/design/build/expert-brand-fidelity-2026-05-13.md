# Brand Fidelity verdict — message register + demo-flow selection

**Reviewer:** Brand Fidelity expert
**Date:** 2026-05-13
**Context:** Cena patient app, UConn MVP, Dr. Dieckhaus demo ~2026-05-22
**Prior work:** Contributor to 2026-05-13 4-expert panel (see `2026-05-13-design-panel-verdict.md`)

## Framing

Two questions arrived together, and they share a single underlying tension: **where does Haven's institutional voice attach — to the patient self-identifying, or to the care team / agent reaching out?** DESIGN.md answers this consistently across its prescriptions, and the answer constrains both the bubble register and the demo-flow choice.

The brand-fidelity lens here is narrow on purpose. I am not arguing IA (where does the message bubble live in the thread), accessibility (contrast on teal-on-white labels), or pattern-library expression (does `.message-bubble-out` reuse the right tokens). I am only answering: which configuration *feels like Haven*, per DESIGN.md §Voice and §Brand expression. The other three expert lenses should weigh in separately on their axes before this ships.

## Q1 — Message bubble register

### Verdict

**Flip the register.** Care team carries Haven teal (`teal/700`); patient self is neutral (`sand-100` or white card). The current iMessage-convention assignment reads as generic-app and leaks primary teal off its reserved use.

### DESIGN.md grounding

Three sections converge:

1. **§Brand expression → Logo:** *"Cena Health logo appears in the nav header across every app and context. It never changes based on persona, mode, or content. It is the application's brand identity."* Brand identity attaches to the institutional surface, not to the user. The patient is the user; Cena/Haven is the institution. The bubble register should mirror this — institutional voice gets brand color.

2. **§Component archetypes → Button → Brand-taste rule:** *"primary teal is reserved for **user commitments that change state** — 'Book my visit,' 'Schedule Appointment,' 'Continue' in a destructive dialog, 'Send' in chat. … The teal earns its weight by being used sparingly."* Outgoing chat bubbles are not state-changing commitments — the *send button* is. Painting every patient-outgoing bubble teal dilutes the reserved use of primary teal across the thread surface. By the time the patient scrolls a long conversation, the page is a teal field; the *next* teal Send button no longer reads as a commitment moment.

3. **§Voice → Brand-taste rules:** *"Warmth is observational, not performative."* The teal-on-self convention is performative ("here I am, in brand color"). Teal-on-care-team is observational from the patient's seat ("this is Cena reaching me"). It matches the §Voice exemplars where Ava observes the patient's specific action and reflects it back — the institution sees the patient, not the other way around.

4. **§Component archetypes → Chat message patterns:** the canonical chat treatment for *Ava* messages is *"Dot-sparkle leading indicator (teal + sand)"* — teal already marks the agent/institutional side at the message-author level. Care-team-on-teal extends that consistency. (Note: care team ≠ Ava; care team is human clinicians. But both are "institutional voice from the patient's perspective," and DESIGN.md's existing precedent paints that side with the brand mark.)

### Counter-framing acknowledged

The iMessage convention is real and learned. Patients have decades of self-on-color muscle memory. But Haven is not a peer-messaging product; it is a patient-portal expression of care continuity. The brand promise (per the README on this expert: *"would Aaron recognize this as Haven at a glance"*) leans on the institutional voice being legible. Generic-app conventions defeat that test.

### What would change

`packages/design-system/src/styles/tokens/components.css`:
- `.message-bubble-in` (care team incoming) → `bg-primary-500` / `teal/700` with white text
- `.message-bubble-out` (patient outgoing) → `bg-sand-100` or `bg-white` card-grouped treatment with `text/on-light/normal`

Pattern-library spec page should be updated in the same patch to keep `pattern-library/` canonical with code (per CLAUDE.md "pattern-library-first" rule).

### Defer to other experts

- **Accessibility:** verify `teal/700` bg with white text passes WCAG 2.1 AA at the bubble's actual text size; verify the inverted relationship still passes for outgoing bubbles. The teal palette is brand-color-safe per existing button precedent but should be re-confirmed at body-text density.
- **Pattern-library steward:** confirm the token swap doesn't break sibling chat primitives (Ava messages, recommended-content inline cards) — the family-parity criterion in `judgment-framework.md` applies.
- **IA / ux-design-lead:** confirm directionality reads correctly in RTL languages (Spanish is in-scope for UConn pilot, not RTL — but worth naming as a forward concern).

### Confidence

**High (8/10).** DESIGN.md grounding is unusually direct here — three independent sections converge on the same answer. The remaining uncertainty is the muscle-memory cost of breaking iMessage convention, which is a real friction but not a brand-fidelity question.

---

## Q2 — Interactive demo moment

### Verdict

**Message reply (Sarah K. → patient types → sends).**

### Emotional reasoning per flow

Scoring each against DESIGN.md §Voice ("warm + specific + playful + stress-literate") and the README's *"observational warmth"* / *"Gentle Strength"* framing:

| Flow | What it communicates | Haven-ness |
|---|---|---|
| **Meal swap** | Optionality, agency, food choice. Reads as utility — closer to a grocery-app substitution UX than a care relationship. The teal Send button gets one moment to shine inside a bottom sheet; the rest is form-shaped interaction. | **Generic-app risk: high.** No observational moment, no specific warmth. The flow demonstrates a feature (substitutions exist) more than a brand voice. |
| **Check-in start** | Self-tracking, assessment cadence. Has potential — the §Voice exemplar *"Your A1C dropped like it's hot"* lives in this register if the completion screen lands warmly. But the *start* of an assessment is the cold part: Likert scales, numbered options, GAD-7 ceremony. The warm payload arrives at the end. | **Voice-payload-at-the-end risk.** Demo attention typically lands on the kickoff moment; the warm reveal happens after the demo's natural cut. Three-step assessment is also longer than a 30-second demo wants. |
| **Message reply** | Care continuity, observed-and-responded-to, the institution sees the patient. This *is* the §Voice register, demonstrated live. Sarah K. (a named human clinician, not Ava) writes something specific; patient replies; Send button fires teal at exactly the moment §Component-archetypes →Button reserves it for (*"'Send' in chat"* — named explicitly in the brand-taste rule). | **Best match.** Combines: institutional voice (care team), observational warmth (Sarah's message can carry a specific reference per §Voice exemplars), and a teal Send moment that lands at its reserved purpose. The bubble-register flip from Q1 amplifies this — Sarah's incoming message arrives teal, patient's outgoing reply lands neutral, Send fires teal as the commit. |

### "Gentle Strength" reading

§Voice does not use the phrase "Gentle Strength" literally — the closest framing is *"warm + specific + playful + stress-literate"* plus *"Warmth is observational, not performative"* (§Voice → Brand-taste rules). I am treating "Gentle Strength" as Aaron's shorthand for that register. Message reply embodies it because:

- **Gentle:** the patient does not have to do work to receive care attention — Sarah reaches out first. No assessment burden, no form ceremony.
- **Strength:** the institution is present and specific. The reply moment is small but load-bearing — it is the demonstrable proof that the agent-mediated platform produces real human care continuity, not chatbot loops.

Meal swap is gentle but not strong (utility, not care). Check-in is strong but not gentle (the platform asking the patient to do work). Message reply is both.

### Demo dramaturgy

A 30-second demo to Dr. Dieckhaus benefits from a moment where *he sees the institutional voice through the patient's eyes*. Care-team-on-teal (per Q1) plus message reply creates that frame: he reads the incoming message, sees it carries Haven brand color, watches the patient reply land neutral, and the teal Send button fires as the commit. The brand voice is visible *in the chrome*, not just in the copy.

### Defer to other experts

- **ux-design-lead:** confirm the demo flow's cold-start state (is there an unread Sarah K. message visible on dashboard load, or does the demo need a nudge to surface it?). A demo that requires Aaron to navigate to find the message wastes its dramatic moment.
- **Content / voice author (informal, no expert today):** Sarah K.'s incoming message should follow §Voice exemplars — *specific observation*, not generic ("Hi Maria, I noticed your weight log this morning…"). Generic warmth deflates the demo regardless of color treatment.
- **Pattern-library steward:** confirm the message-reply flow uses existing `agentic-shell` + chat pane patterns without app-local divergence.

### Confidence

**Medium-high (7/10).** The brand-fidelity case is strong, but a successful demo depends on stagecraft (timing, copy specificity, Sarah K.'s message landing well) more than on the flow choice. Brand fidelity argues *for* message reply; execution still has to honor it.

---

## Summary

| Question | Verdict | Confidence |
|---|---|---|
| Q1 — Bubble register | Flip: care team teal, patient neutral | High (8/10) |
| Q2 — Demo flow | Message reply (Sarah K. → patient → send) | Medium-high (7/10) |

Both verdicts ground in the same DESIGN.md principle: **Haven's brand voice attaches to the institutional surface, not to patient self-identification.** Care team carries teal in the thread; care team initiates the demo moment. The two decisions reinforce each other — flipping the register makes the message-reply demo dramatically better at *showing* Haven's voice rather than telling it.

The brand-fidelity gate is one of four. IA, accessibility, and pattern-library steward should weigh in on their axes before either decision ships. I have flagged specific handoffs inline.
