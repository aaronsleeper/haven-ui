# Debrief: cc-03 Morning Summary

**Date:** 2026-05-07
**Slice plan:** `~/.claude/plans/cc-03-morning-summary-dogfood-slice.md`
**Patches:** 2 (well under ≤4 budget)
**Tier:** 2 (slice composition; zero new PL primitives)

## What this slice was

The first end-to-end dogfood of the strict `conform:wireframe-shell` gate (Phase 4 flipped 2026-05-07). Built the cc-03 morning summary card in the care-coordinator panel-chat empty-state, replacing a 2026-04-28 placeholder. Closes criterion 4 of the shell-validation-gate closure obligation.

## Reconciliation findings (the value the gate alone doesn't deliver)

The gate observation step passed cleanly — cc-03's declared `pl_shell_version` matched current `agentic-shell` canon. Four cross-document staleness issues surfaced ONLY at the haven-mapper reconciliation step or post-build browser verification:

- **IA decision provisional, not authoritative.** App.tsx empty-state comment said "no global composer; coordinator IA is strictly entry-scoped" — read alone, that retired cc-03. But `apps/care-coordinator/design/slices/cc-shell-upgrade/manifest.md` explicitly tracked cc-03 as "future slice" and `wireframes/shell-cc-coordinator.md` line 95 prescribed "center loads morning summary" as the agentic-shell default. Without reconciliation across these three docs, the slice would have been abandoned or deferred.
- **Pre-React build prompt.** `design/build/07-morning-summary.md` (2026-03-27) was vanilla HTML era. Reconciliation translated to React + reused the `urgent`/`attention`/`info` arrays already in scope.
- **Wireframe vs build prompt divergence on `.stat-value`.** Wireframe says `text-2xl font-bold text-red-600` directly. The 07 build prompt added `.stat-value`. Wireframe is authoritative; the 07 prompt's addition was a wireframe-spec drift. This drift caught only at browser verification — every stat count rendered in `primary-950` (the brand color baked into `.stat-value`) instead of urgency colors. All gates passed; visual was wrong.
- **Color token brand drift.** Wireframe used Tailwind `text-gray-*`; haven-ui brand neutral is `sand`. Reconciliation translated; the `one-family-per-role` gate would have caught it independently as a backstop.

## What worked

- **Order matters.** wireframe → reconciliation → dev-tasker → build → gates → browser verification. Skipping reconciliation would have mishandled findings 1, 2, 4. Skipping browser verification would have shipped finding 3 invisibly. Each step caught what the others didn't.
- **Component-map.md baseline from 2026-03-27 made reconciliation tractable.** Comparing "what we mapped 6 weeks ago" against "what's true today" gave structure to the staleness audit.
- **`pnpm shell-canon` CLI was load-bearing.** Confirmed cc-03's hash matched current canon in seconds; meant the gate was not the bottleneck and reconciliation was the load-bearing step.

## Lessons

- **Brand-fidelity-weighted urgency colors are deliberate exceptions to semantic-class discipline.** When a wireframe specifies utility classes for color (`text-2xl font-bold text-red-600`) instead of a semantic class, that's the wireframe author intentionally bypassing the semantic class. The haven-ui rule "Semantic Classes, Not Utility Soup" carries an implicit carve-out for urgency/status colors that override brand color — and the wireframe is the source of truth for that carve-out, not the build prompt.
- **The "I saw vs I reconciled" gate-design framing is real.** Hash-based gates record observation; the reconciliation step records reconciliation. The two are not interchangeable. A canon match at the hash layer means "no agentic-shell composition contract changes since authoring" — it does NOT mean the wireframe is current relative to surrounding IA decisions, build prompts, or color-token conventions.
- **Browser verification still earns its keep even when gates and reconciliation pass.** All 12 conform gates passed on patch 1; visual rendering was still wrong because `.stat-value` overrode utility colors. Brand-fidelity drift at this layer is unobservable to gates whose scope is structural.

## Anti-patterns

- **Treating the build prompt as authoritative.** The 07-morning-summary.md was a useful starting point; it was NOT the source of truth for class choices. The wireframe is. Reading the wireframe carefully — including which classes it uses literal-utility for vs semantic-class for — would have caught the `.stat-value` divergence at authoring time.
- **Trusting "all gates passed" as ship-readiness.** Gates cover structural properties. Visual rendering is its own check.

## Carry-forward to interaction-retro

- The slice's load-bearing finding (the parent plan's hypothesis confirmation) is that **reconciliation surfaces what the gate cannot.** Three of four findings were structural — the gate's invariant ("I saw the canon") cannot reach them. The reconciliation step's invariant ("I checked composition against current canon, current IA, current data, current tokens") does.
- The fourth finding (`.stat-value` color drift) is a useful counterexample: even reconciliation can miss visual-rendering-only failures when the agent has the right wireframe in hand but pastes pre-existing build-prompt code without re-reading the wireframe's class choices.

## Out of scope (next-slice candidates)

- Real schedule data source (currently a static fixture in MorningSummary). Hoist to `apps/care-coordinator/src/data/schedule.ts` when real data lands.
- Greeting time-of-day variation ("Good morning"/"Good afternoon") — wireframe Open Question, deferred per author intent.
- Yesterday-comparison stat ("12 items overnight, up from 5") — wireframe Open Question, deferred per author intent ("could be noisy").
