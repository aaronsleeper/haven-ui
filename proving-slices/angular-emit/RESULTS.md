# Proving slice — Path C (Angular mechanical emit): results

> **What:** hand-port the haven-ui PL `quantity-stepper` (markup + behavior + a11y) into Andrey's current Angular idioms, by hand, with no porter skill — to discover the mapping rules and measure how mechanical the port actually is.
> **Against:** the decision rule in [AD-08-revisit](../../planning/team/proposals/AD-08-revisit-pipeline-framework-emit.md) → *"if the hand-port is mechanical (0 judgment calls), the vanilla primitive binds unchanged, and Andrey says it reduces his work → build the porter + promote C."*
> **Idiom target:** [andrey-angular-idioms.md](../../planning/team/proposals/andrey-angular-idioms.md) (Angular 19 zoneless, standalone, signal I/O).
> **Date:** 2026-05-25. **Files:** `quantity-stepper.component.{ts,html,scss}`.

## Headline

**Split result. The markup port is genuinely mechanical; the behavior port is not.** The ADR's optimistic assumption — that the framework-agnostic vanilla-JS primitives are a *free bridge* you "import unchanged" — **does not hold for a framework target.** The contract ports; the implementation re-expresses.

## Measured

| Dimension | Result |
|---|---|
| **Markup / class port** | **Mechanical — 0 judgment calls.** Class vocabulary is verbatim (`quantity-stepper`, `quantity-stepper-btn`, `quantity-stepper-value`, `sr-only`); only bindings change (`data-action`+JS listener → `(click)`; auto-`disabled` → `[disabled]="atMin()"`; `textContent` mutation → `{{ value() }}`). A porter can do this deterministically. |
| **Behavior port** | **Not mechanical — 2 judgment calls + full re-expression.** See ledger. |
| **Lines** | PL component markup ~10 → Angular template ~30 (binding-formatted). `quantity-stepper.js` ~95 → component `.ts` ~75. Comparable size, behavior fully rewritten not copied. |
| **Component-scoped CSS added** | 0 (styling stays in the shared semantic classes — part of why markup is verbatim). |
| **"Looks like Andrey's code"** | **Yes.** Signal `input()`/`output()`, `linkedSignal`, `computed`, standalone, `app-` selector, separate `.scss`, `[disabled]`/`(click)`/`{{ }}` bindings — all his observed idioms. |

## The decisive finding — why "import the JS unchanged" fails

`quantity-stepper.js` is a **self-running IIFE** that `document.querySelectorAll('[data-quantity-stepper]')` **at script load** and mutates the DOM directly (`valueCell.textContent = …`, `btn.disabled = …`). That breaks against Angular two ways:

1. **Timing.** Angular renders components *after* script load. The IIFE runs once, finds nothing, and never sees the dynamically-mounted component. There is no exported `init()` to call from `ngAfterViewInit`.
2. **Ownership model.** Zoneless/signal Angular owns the DOM; a module that hand-mutates `textContent`/`disabled` fights change detection and is the opposite of idiomatic. Even if re-init were possible, you wouldn't want it.

→ For a framework target the **contract** (events, bounds clamp, disabled-at-bounds, 400ms debounced SR announce, programmatic set) ports cleanly; the **implementation** must be re-expressed in signals. This flips the ADR §6 default from *option-a (import unchanged)* to *option-b (re-express the contract)* for Angular/React.

## Judgment-call ledger (the non-mechanical bits)

1. **Internal state mechanism.** PL holds `value` in the DOM; Angular holds it in a `linkedSignal` seeded from the `initial` input and clamped. No observed Andrey precedent for a *stateful* component (his samples were presentational), so the tool choice (`linkedSignal` vs `signal`+`effect` vs `model`) is a judgment call — `linkedSignal` is the canonical Angular-19 answer for "writable signal derived from an input."
2. **Debounced announce.** PL debounces the live region 400ms with a clear-then-microtask-set trick (forces AT to re-announce equal values). Re-expressed as an `announce` signal + a timer. The clear-then-set trick is unnecessary here (consecutive stepper values always differ), so it was dropped — a judgment call about what's load-bearing in the contract vs implementation detail.

## Verdict against the decision rule

- Markup mechanical: **PASS.** Most of the component library is markup/variants — that ports deterministically and in his idiom.
- Vanilla primitive binds unchanged: **FAIL** (for the ~29 behavioral primitives). The IIFE model is static-HTML-only.
- Andrey says it reduces his work: **untested** — needs the demo (and a runtime build; see below).

**Net:** Path C is viable, but not free for behavior. The honest path is a **DS-layer prerequisite** (below), after which a porter can handle behavior far more mechanically.

## Recommended up-layer fix (before building `ui-angular-porter`)

Refactor the vanilla-JS primitives from **self-running IIFEs** to **export a pure contract + an `init(el, opts)`**:

- Vanilla consumers call `init(el)` on their element (tiny change to PL pages).
- Framework ports import the **contract** (the clamp/bounds/event/debounce logic as pure functions) and wire it to signals — no DOM-mutation, no timing problem.
- This makes the primitives genuinely framework-bindable and shrinks each behavioral port's judgment calls toward zero. It's a `~29-module` mechanical refactor with a clear shape, and it benefits the React port too.

## Runtime verification — DONE 2026-05-25 ✅

Built + ran in a **standalone Angular 19.2 zoneless sandbox** (`/tmp`, throwaway; spark untouched). Evidence: `screenshot-initial.png`, `screenshot-exercised.png`.

- **Compiles + runs zoneless.** Clean build; console confirms zoneless is active (NG0914).
- **Signal inputs work** — `initial`/`min`/`max` bind; the three demo steppers seed correctly (2, 5, 10).
- **`output()` emits correctly** — driving the default stepper to 0 shows `quantityChange → value=0, previousValue=1, source=click`; bounded shows `value=6, previousValue=5`. The detail shape ports exactly.
- **Bounds enforcement is live** — at value 0 the decrement button auto-disables; at value 10 (max) the increment auto-disables. `computed` → `[disabled]` works both directions, dynamically, under zoneless.
- **Reactivity under zoneless** — the emitted-event text and value cell update without Zone.js, confirming the signal model is sufficient (no manual change detection needed).

→ **The behavior contract re-expressed as signals runs faithfully in his stack.** The proving slice's earlier "behavior not mechanical" finding stands (the re-expression took judgment), but the *output* is verified-correct and is the showable artifact for Andrey.

### Version-delta finding (new SoT row)

The 19.2 scaffold exports `provideExperimentalZonelessChangeDetection`; Andrey's spark uses the **stable** `provideZonelessChangeDetection` → **his Angular is newer than 19.2** (stable name landed later in 19.x / 20). Behaviorally identical, but the porter must target his exact version's API names. Logged as a preferences-SoT row.

## Still open

- **Andrey's stateful-component idioms.** Confirm `linkedSignal` vs his actual choice, and `viewChild()` vs `@ViewChild`, against a *stateful* component in his latest code (his observed samples were presentational). These are SoT rows #10–12, still `assumed`.
- **Pixel-brand fidelity.** The sandbox used plain-CSS approximations of the `.quantity-stepper` tokens; the real port consumes the shared semantic classes verbatim (no approximation needed in-context).
