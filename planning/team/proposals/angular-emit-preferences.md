# Angular Emit — Conventions & Preferences (effort SoT)

> **What this is:** the single source of truth for *what the Angular-emit effort assumes about how Andrey wants generated code.* The `ui-angular-porter` reads its rules **from this doc**, not from hardcoded assumptions — so when an assumption is wrong, the fix is an edit **here**, not a mechanism rebuild. This doc is also the **agenda for the conversation with Andrey**: every `assumed` row is a question for him.
> **Supersedes** the raw extraction in `andrey-angular-idioms.md` (kept as the observed-evidence appendix; this doc owns the *decisions + correction costs*).
> **Source baseline:** `cena-health-spark` devel @ `b205df2` (2026-05-19). **Created:** 2026-05-25.

## The caveat that governs every row below

**A convention in his codebase is not necessarily Andrey's preference.** Andrey codes LLM-assisted (as Aaron does); an idiom we observe may be (a) a deep preference he'd defend, (b) a reasonable default he'd swap without caring, or (c) an LLM default he never chose. We **cannot tell which from the code alone.** So every row carries a **source** and **confidence**, and nothing is treated as a hard requirement until `confirmed`. Aaron can facilitate a direct read with Andrey to resolve the `assumed` rows.

## The design that makes correction cheap (the answer to "do we rebuild?")

Two layers, deliberately decoupled:

- **Mechanism** (`ui-angular-porter`) — stable. It knows *how* to transliterate PL→Angular, but takes its idiom choices as **parameters**.
- **Preferences** (this doc) — volatile. It supplies those parameters.

So a correction's blast radius is bounded and **pre-computed per row** in the `correction cost` column:
- **`config`** — flip a value the porter reads (e.g., `viewChild()` vs `@ViewChild`). One-line edit, re-run the porter. No rebuild.
- **`porter-rule`** — adjust one mapping rule in the porter (e.g., how a variant prop composes a class). Localized code change, all output re-emits.
- **`structural`** — changes the porter's architecture (rare; e.g., "don't use standalone components"). This is the only tier that's expensive — and we surface those rows *first* to Andrey precisely so we don't build on them unconfirmed.

The discipline: **keep assumptions out of the mechanism.** Every idiom choice lives here as a parameter. Then "he prefers B" is almost always a `config` edit.

## Preference ledger

Legend — **source:** `observed` (in his code) · `inferred` (reasonable for his stack, no direct evidence) · `confirmed` (Andrey said so). **confidence:** L/M/H. **correction cost:** `config` / `porter-rule` / `structural`.

| # | Convention | Value (our current assumption) | Source | Conf | Porter binding | Correction cost |
|---|---|---|---|---|---|---|
| 1 | Component style | Standalone (no NgModule) | observed | M | emit standalone | **structural** |
| 2 | Change detection | Zoneless | observed | M | no Zone APIs; signal state only | **structural** |
| 3 | Inputs/outputs | Signal `input()` / `output()` (not decorators) | observed | M | emit signal I/O | porter-rule |
| 4 | DI | `inject()` functional | observed | M | emit `inject()` | config |
| 5 | Control flow | `@if` / `@for` blocks | observed | M | emit blocks | porter-rule |
| 6 | Template/style files | separate `.html` + `.scss`, never inline | observed | M | emit 3 files | config |
| 7 | Selector prefix | `app-` | observed | H | prefix rule | config |
| 8 | Class vocabulary | PL semantic classes verbatim (`badge-pill`, `meal-card-*`) | observed | H | copy classes | porter-rule |
| 9 | Layout utilities | Tailwind utilities inline | observed | M | pass through | config |
| 10 | Internal stateful value | `linkedSignal` seeded from input | inferred | L | state-seed rule | porter-rule |
| 11 | Element queries | `viewChild()` (signal) vs `@ViewChild` | **assumed** | L | query rule | config |
| 12 | Two-way value | `model()` vs input+output | **assumed** | L | I/O rule | porter-rule |
| 13 | Data layer contract | Firebase Data Connect connectors (T0.2) | observed | M | components bind to named contract; host wires Data Connect | **structural** (his to own) |
| 14 | Inline `style=` | tolerated lightly (he uses CSS vars inline) | observed | L | n/a (PL forbids; we stay strict) | config |
| 15 | Behavior primitives | re-express contract as signals (NOT import the IIFE) | proven (proving slice) | M | contract→signal rule | porter-rule |

## Highest-priority questions for Andrey (the `structural` + low-confidence rows)

Surface these *first* — they're either expensive to get wrong or pure guesses:

- **#13 (structural):** What's the Data Connect contract shape a generated component should bind against? This gates "functional" entirely (T0.2).
- **#1/#2 (structural):** Standalone + zoneless — deep preference, or current default? (If he'd move off either, the porter architecture shifts.)
- **#10/#11/#12 (low-conf):** For a *stateful* component, does he reach for `linkedSignal`? `viewChild()` or `@ViewChild`? `model()` for two-way? (No stateful component observed in his code yet — these are guesses.)
- **#15:** Would he rather we ship behavior as re-expressed signals (our finding), or have the primitives refactored to a shared contract he imports? (Bears on the ~29-primitive refactor scope.)

## Lifecycle

- **Corrections land here.** Andrey says "B not A" → edit the row, bump `source` to `confirmed`, adjust the porter parameter named in `correction cost`. Log the change date inline.
- **Graduation to the person layer.** If a row proves to be a *deep, durable* Andrey value (not just an effort convention), migrate it to [[Andrey Kartashov]] (the profile owns enduring person-truth; this doc owns effort-scoped technical conventions). Most rows stay here.
- **This doc drives the agentic Andrey conversation.** It's structured as his decision queue: a model to react to (his engagement key — see [[Andrey Kartashov]] how-to-engage), not an open-ended interview.

## Observed-evidence appendix

Raw idiom extraction (the code we read, verbatim) lives in [`andrey-angular-idioms.md`](./andrey-angular-idioms.md) — the *evidence* behind the `observed` rows above. This doc owns the *decisions*; that doc owns the *evidence*.
