# Context Budget — Meal Prescription

> Per-step context loading profiles. Each expert loads the minimum viable context
> for their role in that step. Shared context loads once per workflow run.

---

## Shared context (loaded once)

| Source | Lines (est.) | Rationale |
|---|---|---|
| Workflow README | ~60 | Workflow identity, participating experts, hardcoded gates |
| Patient record (care plan nutrition section + allergen profile) | ~40 | The clinical parameters this workflow operates on |
| Meal prescription schema | ~20 | Structural reference for the output format |
| **Shared total** | **~120** | |

---

## Per-step expert context

### Step 1 — Extract prescription parameters (Clinical Care)

| Layer | Loaded? | Rationale |
|---|---|---|
| README | Yes | Identity and scope |
| domain-knowledge | Partial | MNT section only — caloric/macro reference for unit conversion |
| output-contract | Yes | Prescription must match output format |
| task-routing | Yes | Confirms model tier (Haiku) |
| judgment-framework | No | Extraction is mechanical, not judgment |
| quality-criteria | No | Not self-evaluating |
| **Expert total** | **~200 lines** | Reduced profile — extraction task |

**Step 1 total: ~320 lines.** Light step.

### Step 2 — Validate prescription (Clinical Care)

| Layer | Loaded? | Rationale |
|---|---|---|
| README | Yes | Identity |
| domain-knowledge | Yes | Full MNT knowledge for validation |
| judgment-framework | Partial | Tradeoff frameworks section only — for restriction conflict validation |
| quality-criteria | Yes | Validating against quality criteria |
| task-routing | Yes | Confirms model tier (Sonnet) |
| **Expert total** | **~350 lines** | Near-core work profile |

**Step 2 total: ~470 lines.** Within budget.

### Step 3 — Match recipes (Meal Ops)

| Layer | Loaded? | Rationale |
|---|---|---|
| README | Yes | Identity |
| domain-knowledge | Yes | Recipe catalog knowledge, matching algorithms |
| judgment-framework | Yes | Preference optimization tradeoffs |
| output-contract | Yes | Match result format |
| task-routing | Yes | Confirms model tier (Sonnet) |
| **Expert total** | **~400 lines** | Core work profile (expert does not yet exist — estimate from spec target) |

**Step 3 total: ~520 lines.** Within budget.

### Step 4 — Select meals (Meal Ops or Clinical Care for 4b)

| Variant | Expert | Layers | Lines (est.) |
|---|---|---|---|
| 4.0 (sufficient) | Meal Ops | README + output-contract + task-routing | ~150 |
| 4.a (limited) | Meal Ops | README + output-contract + task-routing | ~150 |
| 4.b (no match) | Clinical Care | README + domain-knowledge + judgment-framework + escalation-thresholds | ~350 |

**Step 4 total: ~270-470 lines** depending on variant. Within budget.

### Step 5 — Compliance check (Compliance)

| Layer | Loaded? | Rationale |
|---|---|---|
| README | Yes | Identity |
| quality-criteria | Yes | PHI display rules |
| task-routing | Yes | Confirms model tier (Haiku) |
| **Expert total** | **~150 lines** | Light review profile (expert does not yet exist — estimate) |

**Step 5 total: ~270 lines.** Light step.

### Step 6 — Lock prescription (Patient Ops)

| Layer | Loaded? | Rationale |
|---|---|---|
| README | Yes | Identity |
| output-contract | Yes | Final output format |
| **Expert total** | **~90 lines** | Minimal — mechanical state transition |

**Step 6 total: ~210 lines.** Lightest step.

---

## Budget summary

| Step | Experts active | Est. context lines | Status |
|---|---|---|---|
| 1. Extract | 1 (Clinical Care) | ~320 | Within budget |
| 2. Validate | 1 (Clinical Care) | ~470 | Within budget |
| 3. Match | 1 (Meal Ops) | ~520 | Within budget |
| 4. Select | 1 (Meal Ops or Clinical Care) | ~270-470 | Within budget |
| 5. Compliance | 1 (Compliance) | ~270 | Within budget |
| 6. Lock | 1 (Patient Ops) | ~210 | Within budget |

No step exceeds the ~1,400-line expert context guideline from workflow-spec.md.
This workflow is lighter than care-plan-creation because each step involves
only one expert (no fan-out parallel review).
