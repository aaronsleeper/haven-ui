# Fallback Modes

> When a required expert is unavailable — planned but unbuilt, health status red,
> or invalidated by a freshness trigger — workflows degrade gracefully instead of
> halting. This document defines the fallback type catalog, quality signaling
> protocol, and graduation path back to full capability.
>
> Referenced by `expert-spec.md` (Layer 5: Dependencies) and `workflow-spec.md`
> (step anatomy).

---

## Fallback types

| Mode | What happens | When to use | Confidence cap |
|---|---|---|---|
| **`human-covers`** | Human fills the expert's role using a structured checklist prompt | Expert absent, step is high-stakes or requires domain judgment | `low` |
| **`checklist`** | Static checklist replaces expert judgment — produces pass/fail per item, no reasoning | Expert absent or red-health, step is moderate-stakes with codifiable criteria | `medium` |
| **`peer-covers`** | Another built expert covers at reduced scope (only the domain intersection) | A peer's domain overlaps enough to be useful; coverage is partial by definition | `low` |
| **`skip-and-flag`** | Step skipped entirely, gap documented in handoff envelope and degradation manifest | Step is non-blocking — downstream steps can proceed without its output | N/A — step produces no output |
| **`defer`** | Step produces a placeholder marked for retroactive expert review | Workflow can activate without this step, but output needs validation when expert arrives | `low` (provisional) |

**Selection principle:** Use the least-degraded mode that is safe for the step's
stakes. `human-covers` preserves the most judgment; `skip-and-flag` preserves the
least. When in doubt, `human-covers` — a human doing the work slowly is better
than skipping it.

---

## Declaration

Fallbacks are declared in two places. The step-level declaration is authoritative;
the dependency-level declaration provides defaults.

**In `dependencies.md`** (per-dependency default): Add `fallback_mode` and
`fallback_detail` columns to the depends-on table. These fire when the dependency
is unavailable and no workflow step overrides them.

**In workflow `steps.md`** (per-step override): A `fallback` field on any step
that references a planned or potentially-unavailable expert. Format:

```
| **fallback** | <mode>: <what specifically happens>. Checklist: <path if applicable>. Confidence capped at <level>. |
```

**Override rule:** Step-level fallback wins over dependency-level default. This
follows the same override principle as autonomy tiers: workflows can tighten
(more conservative fallback) but not loosen (less conservative than the
dependency default).

---

## Quality signaling

### Handoff envelope extension

When a step runs in fallback mode, the handoff envelope includes a `degradation`
block:

```
handoff {
  ...existing fields...
  degradation: {
    active: boolean
    mode: "human-covers" | "checklist" | "peer-covers" | "skip-and-flag" | "defer"
    original_expert: string
    substitute: string | null     — who/what filled the role
    confidence_cap: "low" | "medium"
    gaps: []                      — specific capabilities the fallback lacks
  }
}
```

### Propagation rule

Degradation signals propagate forward through the workflow. Downstream steps
inherit the most severe degradation from their inputs:

- If step 1 ran `human-covers` (confidence `low`), step 3 (reconciliation)
  carries that signal even if step 3's own expert is available.
- The final workflow output includes a **degradation manifest**: a summary of
  every degraded step, what mode was used, and what capabilities were missing.
- Human gates (checkpoints) display the degradation manifest prominently — the
  reviewer must know which parts had full expert coverage and which didn't.

### Confidence interaction

The handoff envelope's existing `confidence` field interacts with degradation:

- A fallback step's confidence cannot exceed its mode's cap, regardless of how
  confident the substitute is in its output.
- If a non-degraded step receives degraded input, it should note that its own
  confidence is bounded by the quality of its inputs — but it does not
  automatically downgrade. The expert applies judgment about whether the
  degraded input affects its specific output.

---

## Context budget impact

Fallback modes change the context math from `context-budget.md`:

| Mode | Context change |
|---|---|
| `human-covers` | No expert layers loaded. Checklist prompt (~30-50 lines) replaces the expert's ~400-line core work profile. Net savings. |
| `checklist` | Static checklist (~20-40 lines) replaces expert layers. Largest savings. |
| `peer-covers` | Covering expert loads its own profile (already budgeted if it has other steps). Add ~20 lines for the coverage scope declaration. |
| `skip-and-flag` | Zero expert context. Step contributes only the skip notice to the handoff envelope. |
| `defer` | Placeholder template (~10 lines). Minimal. |

Degraded workflows are cheaper to run. This is a feature, not a bug — it means
the system can bootstrap workflows early, before expert context budgets are real.

---

## Graduation protocol

When the real expert comes online and is ready to take over from a fallback,
the full shadowing, comparison, graduation, and cutover process is defined
in [shadowing-protocol.md](shadowing-protocol.md). Key points:

- The expert shadows the fallback for a minimum of 5 runs, output captured
  but not consumed
- Graduation requires >= 80% agreement rate, zero safety misses, and human
  approval
- Fallback-era retro log entries transfer to the new expert with
  `[fallback-era]` tags for calibration
- Cutover is clean — no gradual blend. Rollback to fallback is available if
  early live runs show problems

---

## Checklist authoring

When a fallback uses mode `checklist` or `human-covers` (which also uses a
checklist prompt), the checklist lives at:

```
workflows/<workflow-name>/.checklists/<step-id>-<short-name>.md
```

Checklists are static — they encode the expert's quality criteria as binary
pass/fail items. They should be authored by extracting the most critical items
from the expert's planned `quality-criteria.md` and `domain-knowledge.md`.

A checklist is not a substitute for an expert. It catches known issues and
enforces minimum standards. It does not reason about novel situations, weigh
tradeoffs, or adapt to context. This limitation must be visible in the
degradation manifest.
