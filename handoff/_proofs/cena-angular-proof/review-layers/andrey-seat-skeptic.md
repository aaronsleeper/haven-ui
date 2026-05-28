# Andrey's seat — taste/style/ergonomic skeptic prompt

The first review layer of the proving slice's three review layers. A fresh-context Claude subagent dispatched with adversarial intent on **idiom polish, voice fit, and "would Andrey grimace at this"** concerns.

This layer catches what the structural skeptic + mechanical gate cannot: code that compiles, typechecks, passes specs, and still feels wrong to a senior dev with Andrey's specific aesthetic preferences.

## When to dispatch

After E1 (and E2) emission lands in the evidence-gate workspace AND after `tsc --noEmit` + `ng test` pass. The taste skeptic runs against KNOWN-WORKING emitted code; their objections are about quality/idiom, not validity.

## Dispatch shape

`Agent` (general-purpose, model: opus, fresh context, no thread history). Pass:

- The emitted E1 files (path: `/tmp/cena-evidence-gate/src/app/care-team/messages/`)
- The emitted E2 files (path: `/tmp/cena-evidence-gate/src/app/profile/`)
- Andrey's existing parallels (read-only) from `cena-health-spark/patients/src/app/care-team/messages/` + `cena-health-spark/patients/src/app/profile/`
- The catalog's relevant patterns: list-stream, detail-view, event-mutation, data-connect-binding
- The preference ledger (`Lab/haven-ui/planning/team/proposals/angular-emit-preferences.md`)
- The `[[Andrey Kartashov]]` profile from the People layer (if accessible — calibrates engagement-key for the skeptic's tone)

DO NOT pass:
- Aaron's hoped-for outcome ("we want this to pass")
- The author's confidence ("the emission is clean")
- Any framing that primes the skeptic toward acceptance

## Prompt template

> You are reviewing emitted Angular code as Andrey would — a senior dev with 20 years of experience, opinions about idiom, and zero patience for code that smells off even when it works.
>
> The code you're reviewing was emitted from a pattern catalog (`@cena/catalog-ui`). It typechecks and its specs pass. Your job is NOT to find bugs (machine gates already caught those). Your job is to find what would make Andrey **grimace, ask questions, or quietly rework parts of this** when he sees it.
>
> Focus on taste, idiom, voice, and ergonomics — not correctness.
>
> Specific things to look for:
> - Variable naming that feels wrong (too verbose, too clever, too generic)
> - Function decomposition that doesn't match how Andrey decomposes (too many tiny functions, or too few big ones — compare to his existing implementations)
> - Comment density (his code has minimal comments; over-commenting reads as defensive)
> - Async/await vs Promise patterns (does our shape match his)
> - Error handling tone (his code does try/catch with explicit error states; ours should too)
> - Signal-update patterns (his `signal.update(list => [...list, item])` vs alternatives we might emit)
> - Template structure (line breaks, indentation, semantic group ordering)
> - Service-call composition (does our shape match how he composes Promise.all in his patient-data service)
> - Type-import-source discipline (only from `@dataconnect/generated`)
>
> Compare each emitted file against Andrey's existing equivalent (paths provided). Note divergences. Categorize each:
> - **likely-grimace** — he'd notice and probably change this
> - **probably-fine** — divergent from his style but defensible
> - **unclear** — could go either way, surface to Aaron for calibration
>
> Honest limit you must name: you are simulating Andrey's read; you are not Andrey. Aaron can override your taste judgments. Any objection should be framed as "in Andrey's existing pattern, X — here we have Y — likely-grimace because Z."
>
> Final verdict per file: `ship` / `iterate` / `block`. Synthesize an overall verdict at the end.

## Output

A structured review at `<sandbox>/review-layers/andrey-seat-findings-{date}.md`:

```markdown
# Andrey's seat — review findings (run YYYY-MM-DD)

## Verdict: ship | iterate | block

## Per-file findings

### messages.component.ts
- [likely-grimace] line N: ... — Andrey's pattern is ... (anchor: his file path:line)
- [probably-fine] ...
- [unclear] ...

### compose-bar.component.ts
...

### profile.component.ts
...

## Overall objections (cross-file)
- ...

## Dispositions for Aaron
- absorb / defer / reject — per each objection
```

Findings get recorded in `EVIDENCE.md` after Aaron's dispositions.

## What this layer does NOT catch

- Bugs (mechanical gate's job)
- Architectural correctness (Angular Structural Skeptic's job)
- Data-binding fidelity (tripwires + mechanical gate)
- Strategic decisions (Aaron's job)

## Related

- Companion skeptic: `angular-structural-skeptic.md` (this directory)
- Companion gate: `../evidence-gate/README.md`
- Proving slice plan: `~/.claude/plans/angular-emit-proving-slice.md` (SC #6)
- Outside-voice rule: `.claude/rules/outside-voice-review.md` (the discipline this skeptic inherits)
