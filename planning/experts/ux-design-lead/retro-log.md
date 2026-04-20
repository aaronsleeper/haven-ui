# Retro Log — UX Design Lead

Running record of interactions, self-assessments, peer reviews, and update proposals.
This is the expert's learning mechanism — reviewed and synthesized during `/expert-update`.

See `experts/expert-spec.md` for the full review system protocol.

---

## 2026-04-20 — State-indicator IA calls (Patch 8; slice-1 debt item 4)

**Trigger:** Contrast-pair gate caught `.queue-item.active` and `.response-option:hover` below WCAG 1.4.11 3:1. Brand Fidelity consulted in parallel on aesthetic / brand coherence; UX Design Lead asked to scope affordance clarity and competing-signal management.

**Observations:**
- **Decision 1 — `.queue-item.active`**: Brand Fidelity proposed a 3px **left**-edge inset shadow in `accent-interactive` (teal-600). Caught a collision — the left edge is already the urgency-tier channel (`.is-urgent` red-500, `.is-attention` amber-500, `.is-info` sand-500). Layering teal on top would create a color fight, and from a low-vision / cognitive-load angle, two simultaneous signals on the same edge reduces legibility rather than increasing it. **Moved the active-state indicator to the right edge.** Four distinct visual channels preserved: fill=hover, border-left=urgency, border-right=selection, ring=focus. Brand Fidelity concurred in synthesis.
- **Decision 2 — `.response-option:hover`**: Ship Brand Fidelity's proposed `border-color: var(--color-sand-500)` darken-on-hover. Competing-signals audit: default=sand-200 border, hover=sand-500 border, focus-visible=primary-600 2px ring, selected (aria-checked=true) = accent-interactive border. Each state uses a distinct visual property OR distinct color within the same property — clean state-vocabulary.
- **Decision rationale — anxious patient context**: PHQ-9 / GAD-7 users are doing emotional work. A medium-gray sand-500 FILL on hover (Path A) reads as weight/judgment on the hovered answer. Border-weight affordance (Path B) communicates "you're pointing at this" without tonal commitment.
- **Low-vision judgment on hover states**: Hover is primarily pointer affordance for sighted users; it's not the load-bearing state for accessibility (focus + selected do that heavy lifting at 3:1+). A 1px edge-darken is sufficient for sighted hover; keyboard users get the focus ring instead. Keeping hover visually light preserves the clinical calm of the form surface.

**Calibration updates:**
- **Multi-channel state-vocabulary rule** (new): when a component has multiple concurrent states (urgency + selection + hover + focus), each state owns a distinct visual property OR a distinct color axis. Collapsing two states onto the same edge produces visual fights. Apply during state-space design for any interactive pattern.
- **"Preserve fill, move WCAG to edge" dovetails with affordance calm**: pale fills preserve voice for clinical surfaces; loud state fills disproportionately signal weight on anxiety assessments. Brand Fidelity's brand-coherence rule produces the right IA result here.
- **Amendment protocol** when collaborating with Brand Fidelity: sometimes the brand-correct path needs an IA-level tweak (left→right edge swap). Surface the collision, propose the amendment, synthesize the final call. Both experts concurred in this cycle.

**Changes to this expert:**
- Add to `judgment-framework.md`: multi-channel state-vocabulary rule.
- Add note on Brand Fidelity co-review amendment protocol for contrast-remediation cases.

**Open questions:**
- Queue-item right-edge selection indicator — at scale (20+ items) does it read as "global signal" or "local cursor"? Pending Aaron's browser review.
- Response-option border-darken on hover vs focus-visible primary-600 ring — with both states potentially active (hover + focus), are the two states visually distinguishable? Expect yes (different color axes: sand vs primary) but confirm in browser.

---

## Interaction summaries

### 2026-04-03 — Expert created

**Task:** Draft the initial UX Design Lead expert with all 8 layers, grounded in
Ava's existing architecture and UI pattern documentation.

**Recommendation:** Produced full spec with domain knowledge drawn from ui-patterns.md,
agent-framework.md, and vision.md. Judgment framework organized around Vision
principle 5 ("human attention is the scarce resource"). Escalation thresholds
calibrated conservatively (more gates than autonomous actions for a draft expert).

**Outcome:** Pending — expert has not yet been applied to a real design task.

**Overrides:** None yet.

**Surprises:** None yet.

**Layers affected:** All (initial creation).

**Open questions for validation:**
- Is the density heuristic calibrated correctly for each role?
- Are the escalation thresholds at the right level?
- Does the output contract cover everything downstream consumers actually need?
- Is the domain knowledge layer missing critical areas?

**Next:** Apply to a real design task (suggested: approval card for care plan review)
to validate whether the spec produces good output.

---

## Self-assessments

_No self-assessments yet — first one will run during the initial `/expert-update` sweep
after this expert has accumulated interaction summaries from real tasks._

---

## 360 peer reviews

_No peer reviews yet — requires at least one other expert in the dependency graph to
be online. Until then, human review fills this role._

**Planned reviewers when available:**

| Reviewer | Type | What they'd evaluate |
|---|---|---|
| Clinical Care expert | Upstream | Do interaction specs accurately reflect clinical workflow needs? |
| QA expert | Downstream | Are quality criteria testable as written? Do expected states cover real scenarios? |
| Compliance expert | Lateral | Are PHI display boundaries handled correctly? |
| Patient Experience expert | Lateral | Does patient app design serve experience quality? |
| Frontend engineering (human — Aaron/Andrey) | Downstream | Are specs implementable without ambiguity? |

---

## Update proposals

_No proposals yet — first synthesis will follow the first self-assessment + 360 review cycle._

Template for future proposals:

```
### YYYY-MM-DD — Review cycle synthesis

**Period:** [date range reviewed]
**Inputs:** [N interaction summaries, self-assessment, N peer reviews]

**Proposed changes:**

| Layer | Change | Evidence | Status |
|---|---|---|---|
| judgment-framework.md | [specific edit] | [which interactions/reviews support this] | pending / accepted / modified / rejected |

**Human disposition:** [Aaron's decision on each proposal]
```
