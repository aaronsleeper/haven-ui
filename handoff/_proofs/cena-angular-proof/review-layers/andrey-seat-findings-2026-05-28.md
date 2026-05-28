# Andrey's seat — review findings (run 2026-05-28)

## Verdict: iterate

The emit is structurally faithful to the catalog contract and his observed Angular idioms (standalone, signals, `inject()`, `@if`/`@for`, separate `.html`/`.scss`, `app-` prefix, `NonNullable<...>[number]` types from `@dataconnect/generated`). It typechecks and tests pass. But it diverges from his **terminal/concrete idiom** in ways that read as "generated, not written by him" — the kind of drift the preference ledger exists to surface. Most fixes are `config` or `porter-rule` cost. None block ship of the proof; several are likely-grimace if the same shape lands in `cena-health-spark`.

## Per-file findings

### messages.component.ts

- **[likely-grimace] line 9, line 32, line 68 — type renamed `MessageThreadItem` → `ThreadItem`.** His pattern: `MessageThreadItem` (Andrey, `cena-health-spark/.../messages.component.ts:9`). His names carry their domain prefix — they read in isolation. `ThreadItem` is more generic and reads "AI-shortened." `likely-grimace because` his Slack register is terse on chat but his code names are *precise*, not short.
- **[likely-grimace] lines 95, 101, 106, 111, 125, 131, 135 — variable names compressed (`r`, `d`, `m`, `key`, `ts`).** His pattern: `role`, `date`, `message`, `dayKey`, `ts` (kept) — full nouns (`cena-health-spark/.../messages.component.ts:98, 120, 73`). Compressing to single letters reads as code-golf and is *out of register* — his code is verbose-but-clear, never terse. `likely-grimace because` "trust-through-checking" reading his code means he wants to skim and understand, not decode.
- **[likely-grimace] lines 70–72, 75 — loop variable `m` for message + destructured-like access.** His pattern: `for (const message of orderedMessages)`, `orderedMessages` not `ordered` (`messages.component.ts:73, 67`). Same register issue as above.
- **[likely-grimace] lines 78, 82 — separator ID `sep-${key}` and shortened `senderLabel` call site.** His: `separator-${dayKey}` (`messages.component.ts:77`). Tiny on its own, but it's the same compression pattern; in aggregate this reads as "an LLM made these shorter to look clean."
- **[likely-grimace] lines 46–66 — `onSend` optimistic-then-refresh shape changed.** His shape: `await send → optimistic prepend → silent catch` (3 statements, append to head, comment-explained). Ours: `tempId optimistic prepend → await send → await getMessages refresh → rollback by tempId filter`. The **double round-trip** (send + refetch) is a real architectural choice the ledger does not currently capture; he prepends one item, we round-trip the whole list. `likely-grimace because` he wrote a deliberately cheap optimistic path and we replaced it with a server-truth reconciliation pattern without naming the trade. The `event-mutation.json` catalog says "optimistic + refetch on success" — that's the catalog being more conservative than him; surface as a structural-or-porter-rule call, not silently emitted.
- **[likely-grimace] line 47 — `crypto.randomUUID()` vs his `Date.now()`.** Tiny but pointed: `Date.now()` is the idiom across the rest of the patient codebase. `randomUUID` is correct, but reads "library-correct" not "his style."
- **[probably-fine] line 57 — append to tail (`[...list, optimistic]`) vs his prepend (`[optimistic, ...msgs]`).** Defensible either way (newest-at-bottom vs top); his thread renders chronologically too. Surface to Aaron — it's a UX question, not an idiom one.
- **[probably-fine] line 22 — `ZardCardComponent` import.** Honors the catalog binding contract. He'd ask "what is `@cena/catalog-ui`?" but that question is the whole proving conversation.
- **[unclear] no `I18nService` injection (line 27).** His app i18n's every label. Our emit ships English strings raw. This is either (a) "the catalog doesn't know about i18n yet" (defensible scope) or (b) a hole that will land badly when his real screen needs ES. Surface to Aaron — needs a ledger row.

### messages.component.html

- **[likely-grimace] line 3 — `<h1>Your Care Team</h1>` raw string.** His: `{{ i18n.t('Your Care Team', 'Tu equipo de cuidado') }}`. Same i18n hole as above; visible here.
- **[likely-grimace] lines 1–5 — header lost his Tailwind utility layer (`px-4 pt-20 pb-3 shrink-0 border-b border-gray-100`, inline `style="font-family: var(--font-serif);"`).** His shape mixes semantic + utility classes heavily; ours is all semantic-class (`.messages-header`). The ledger row 9 explicitly says "Tailwind utilities inline" is the observed convention — we emitted *away* from that toward all-semantic. `likely-grimace because` it violates the documented `observed M` row without naming the move.
- **[probably-fine] lines 22–32 — message-row template flattened.** His has nested `<div class="flex flex-col items-start gap-1">` wrapper around bubble+timestamp; ours has them as siblings in a flex column on the row. Functionally identical; ours is less nested. Defensible cleanup but worth surfacing.
- **[likely-grimace] line 42 — `<app-compose-bar />` is *inside* `<main>`.** His: `<app-compose-bar />` is **outside** `<main>` (after the closing tag), because the compose bar is `position: fixed` and structurally outside the scrollable region (`messages.component.html:54-56`). Moving it inside `<main>` is a *layout* change, not a port. `likely-grimace because` it changes the fixed-positioning model his SCSS depends on.

### messages.component.scss

- **[likely-grimace] entire file — hand-rolled CSS replacing his Tailwind composition.** His SCSS is **6 lines** (`care-team-screen` flex + thread overscroll). Ours is **81 lines** of bespoke colors/sizes (`var(--card, #f5f5f5)`, hardcoded `0.75rem` radii, `max-width: 80%`). His patient app has component-level semantic classes in `components.css` (haven-ui token layer) and uses Tailwind for everything else; he doesn't write per-component SCSS rules. `likely-grimace because` this is *the* most visible "this isn't how I write Angular" — and the values (`#5f9a8f`, `#9ca3af`) are baked literals where his app reads from tokens. `correction cost: porter-rule` (the porter's class-emission strategy).
- **[likely-grimace] lines 47, 75 — `background: var(--primary, #5f9a8f); color: white;`.** Hardcoded `white` instead of a token, and the fallback hex is the v2 teal-400 from `project_haven_ui_brand_token_divergence` — correct-but-inlined. He'd inherit a class like `.message-bubble-out` defined in the token layer, not redefine it per component.
- **[likely-grimace] line 4 — `height: 100vh`.** His: `min-height: calc(100dvh - 104px)` (`messages.component.scss:8`). `100vh` is the iOS-Safari trap his code already worked around; `dvh` minus chrome height is the considered choice. `likely-grimace because` this is the kind of regression he'd catch and roll his eyes at.

### messages.component.spec.ts

- **[probably-fine] line 11 — `jasmine.createSpyObj`.** Matches his test idiom (Karma+Jasmine, not Vitest). Good.
- **[likely-grimace] lines 41–50 — failure-rollback test asserts `messages()` returns to `[]`.** Coverage is good; the rollback shape itself is the disagreement (see `onSend` finding above). The test honors *our* design, not his. He'd read the test fine but would say "why did we add a refetch."
- **[unclear] no test for `i18n.t` calls.** Because i18n was dropped from the emit; not a test-quality issue but a scope question.

### compose-bar.component.ts

- **[probably-fine] entire file — near-identical to his.** Removed `I18nService` (i18n drop, surfaced above); removed `[disabled]="!text.trim() || sending()"` second clause. Otherwise structurally faithful.
- **[likely-grimace] line 18 — `if (event.key !== 'Enter' || event.shiftKey) return;` collapsed to single line.** His: same logic broken across `if (...) { return; }` 3-line form (`compose-bar.component.ts:19-21`). Stylistic; his code never inlines block bodies. `correction cost: config` (formatter/prettier rule, or porter-rule for control-flow shape).

### compose-bar.component.html

- **[likely-grimace] lines 1–11 — lost the attach-image button, the icon-send button, ARIA labels, focus-ring, mobile placeholder.** His: image-attach button, `<i class="fa-solid fa-paper-plane">` icon-only send, `[attr.aria-label]` on textarea + buttons, placeholder copy "Message your care team..." (`compose-bar.component.html:1-31`). Ours: text-only "Send" button, no attach, no aria-labels, generic "Type a message" placeholder. This is the largest *visible* drop. `likely-grimace because` the spec-fidelity bar at Cena is "what's on screen now" — dropping a button is a feature regression dressed as a port. `correction cost: config or porter-rule` depending on whether the source wireframe declares those affordances.
- **[likely-grimace] line 10 — `<button z-button>` with `[zDisabled]` directive.** His `btn-icon-primary` class is the haven-ui semantic-class idiom (`components.css`). The `z-` Zard prefix is the *catalog* idiom — defensible because that's what the proof is testing, but he'd ask "what's `z-`, why isn't this `btn-primary`?" — a real conversation, not a defect.

### compose-bar.component.scss

- **[likely-grimace] lines 1–17 — bespoke per-component SCSS where his has the fixed-position safe-area math.** His: `position: fixed`, `bottom: calc(64px + env(safe-area-inset-bottom))`, `max-width: 430px`, `transform: translateX(-50%)` — the mobile-app dock pattern (`compose-bar.component.scss:5-14`). Ours has none of this — it's a static flex row. `likely-grimace because` it's a layout regression (mobile UX), not a port. Same root as the `<app-compose-bar>` inside-`<main>` move.

### profile.component.ts

- **[likely-grimace] line 36 — one fat component owning three concerns (info + preferences + delivery note).** His pattern: **decompose** into `PersonalInfoCardComponent`, `FoodPreferencesEditComponent`, `DeliveryNoteEditComponent` (3 child components, see `Lab/cena-health-spark/patients/src/app/profile/`). Each child takes `input()`, emits `output()`, owns its own template. Our emit is a single ~106-line component handling all three sections inline. `likely-grimace because` decomposition-into-child-components for forms is *the* observed idiom in his profile code — the most clear-cut "this isn't how he factored it" in the whole review. `correction cost: porter-rule` (decomposition strategy in the porter; or surface as `structural` if the catalog wants single-component-per-screen).
- **[likely-grimace] lines 42–46 — six signals on the component (`preferenceNotesDraft`, `deliveryNotesDraft`, `savingPreferences`, `savingDeliveryNote`, `errorMessage`, …).** His child components each own their own `saving`/`saved`/`note` state. Centralizing it on the parent is the **wrong place** by his decomposition rule — and "saving" + "saved" + "error" on a parent is the noisier pattern.
- **[likely-grimace] lines 68–86 — `onSavePreferences` does snapshot/optimistic-update/rollback for a string-update.** His `delivery-note-edit` does `this.save$.emit(this.note.trim())` — fire-and-forget; the parent calls the service `await this.patientData.updateDeliveryNote(note)` plainly (`profile.component.ts:46-49`). Our shape is more defensive (preserves prior preferences list on failure, sets error message). Defensible *if* contested-state matters; but it adds 18 lines of error handling where his shape is 2. `likely-grimace because` it adds ceremony he didn't write. The catalog `event-mutation.json` may demand this; surface as a contract-vs-Andrey conflict to Aaron.
- **[likely-grimace] line 102 — `firstPreferenceNotes` private helper.** His app doesn't have a "preferences notes" field surfaced as a `<textarea>` at all — his preferences UI is *checkboxes* over fixed categories (`food-preferences-edit.component.ts:5-11`). Our emit invented a *string notes* field. `likely-grimace because` we are *not porting his profile* — we're emitting a new design *on top of* it. That's fine if the catalog says so, but it's not a parallel of his work. Surface to Aaron.

### profile.component.html

- **[likely-grimace] lines 14–22 — `<dl><dt><dd>` for personal info.** His pattern: `<div class="info-row"><span class="info-label">…</span><span class="info-value">…</span></div>` (`personal-info-card.component.ts:13-50`). `<dl>` is semantically correct, but it's not his vocabulary and his SCSS targets `.info-row`/`.info-label`/`.info-value` everywhere. `likely-grimace because` it's idiom drift from his shipped semantic class layer — a token-layer miss.
- **[likely-grimace] lines 37–51 — `z-form-field`/`z-form-control`/`z-form-label`/`z-form-message` stack.** His: a `<textarea class="form-control w-full">` (`delivery-note-edit.component.ts:14-20`). Three layers of Zard form ceremony around a 3-row textarea reads as over-built. He'd ask why every field needs four wrappers. Defensible only if the Zard form primitives carry real a11y wiring he doesn't currently have — surface to Aaron.
- **[likely-grimace] no i18n.** Same hole as messages.
- **[probably-fine] line 33 — `<z-badge>` for preference type chips.** Matches catalog binding; a clean primitive.

### profile.component.scss

- **[probably-fine] 50 lines of per-component SCSS.** Same root issue as messages.scss (we should be in the token layer), but Andrey's profile-component.scss is `:host { display: block; }` and child components carry inline `styles: [...]` — so this isn't a clean parallel. Still likely-grimace as a class of issue, but defensible as a contained section.

### profile.component.spec.ts

- **[probably-fine] tests cover composite service call + both mutations.** Matches the shape he'd expect.
- **[unclear] line 39-43 — `jasmine.createSpyObj` listing 3 methods.** His patient-data service has 25+ public methods; spying 3 is correct test discipline. But the spec tests *our* contract, not parity with his code.

## Overall objections (cross-file)

- **The biggest single drift is `profile.component.ts` ownership.** He decomposes; we emit monolith. This is observable in *his actual code*, not in the ledger. The ledger does not currently have a row for component-decomposition-strategy — it should.
- **i18n was silently dropped across all 4 templates.** His patient app is bilingual EN/ES end-to-end via `I18nService`. The emit ships English strings raw. Either (a) the catalog binding doesn't yet model i18n (legitimate scope gap, name it), or (b) the porter dropped it as scope-out (silent regression, fix it). Either way: surface, don't bury.
- **The compose-bar lost UI affordances** (attach button, icon-send, safe-area math). This isn't idiom — it's feature surface that exists in his code today. Porting *down* without naming the drop is the worst flavor of "generated" because it reads as carelessness.
- **Hand-rolled per-component SCSS** is the most visible "not how Andrey writes" pattern. His code lives in the haven-ui token layer + Tailwind utilities; ours bakes literals into component stylesheets. `correction cost: porter-rule` (class-emission strategy).
- **Variable-name compression** (single letters, dropped prefixes) is *register drift* — his code is verbose-and-clear, not terse-and-clean. This shows up everywhere and reads as "an LLM tightened this up." `correction cost: config` (naming preference rule).
- **No `I18nService`, no `AuthService`, no `Router` injection** — our emit imports cleanly only from `@cena/catalog-ui`, `@dataconnect/generated`, and the service. That's correct per the ledger's discipline. But his real components routinely inject 4-5 services. The catalog's purity test will pass; the real-app fit may not.

## Dispositions proposed

- **absorb (likely-grimace, fix in porter):** variable-name compression (`config`), one-line `if-return` collapse (`config`), per-component SCSS as token-layer escape (`porter-rule`), `<dl>` vs `.info-row` vocabulary (`porter-rule`), header utility-class drop (`config`), `100vh` vs `100dvh` (`config`), `randomUUID` vs `Date.now()` (`config`).
- **absorb (structural-ish, ledger row needed):** profile-component decomposition strategy — add a new ledger row "component decomposition: single component per screen vs child components for form sections," surface to Andrey for confirm. `correction cost: porter-rule` once policy is set.
- **defer (catalog-contract conflict — surface to Aaron):** `onSend` refetch-after-send pattern (catalog says yes, Andrey writes no-refetch); preferences-save optimistic+rollback (catalog says yes, Andrey writes fire-and-forget). Both are real disagreements between `event-mutation.json` and his observed style. Ledger needs rows for "mutation reconciliation strategy" and "optimistic-rollback aggressiveness."
- **defer (scope gap — name it, don't fix in porter):** i18n drop. The catalog doesn't model i18n yet. Don't pretend the porter dropped it accidentally; add a ledger row "i18n binding strategy" and surface to Aaron.
- **defer (feature regression — emit-time fix):** compose-bar lost affordances + safe-area math. Fix in the source wireframe/spec used by the emit; don't blame the porter for what it wasn't told to emit.
- **reject:** the `@cena/catalog-ui` `z-`-prefixed primitive imports. They're the proof. Andrey's question "what is this?" is the *whole conversation*, not a defect.

## Honest limits

- **I am simulating Andrey, not Andrey.** His Slack register (terse, edge-case-hunting, "garbage" verdicts) is the read; the actual verdict requires a model-to-break in his hands. Aaron can override any of the taste calls here.
- **His codebase is LLM-assisted** (preference-ledger caveat, line 8). Some idioms I'm flagging as "his style" may be LLM defaults he never chose. The discriminating test is the in-person/Slack ask, not me reading it harder.
- **No first-person Andrey observation of this emit exists yet** — every "he'd grimace" framing is structurally hypothetical, calibrated against his profile (terse, verification-asking, won't-accept-hand-waving, doc-averse) and the preference ledger. The single observable that would invalidate the worst objections: him saying "yeah, that's fine" on the SCSS-per-component pattern, or "I'd want it decomposed" on the profile component.
- **Same-model blind spot.** Catalog-emission grimaces I can't see are the ones a Claude-on-Claude review will miss. The independence lever here is fresh context, not a different reasoner — so this catches register/decomp/i18n drift, not (e.g.) cases where my own emit-evaluation taste is itself off-center.
