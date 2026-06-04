# Recall-emit design review asks — 2026-06-04

Source: Aaron's walk of the cena-uconn dietary-recall Angular emit v1 slice (branch `claude/emit-dietary-recall` on `cena-health-spark`), 2026-06-04 morning.

Two audiences, one file: items routed to the **Haven Visual Designer** (haven canon questions and design-system drift) and items routed to the **UX team** (experience design questions). Surfaced from a faithful-implementation slice that hit four canon gaps and four UX questions during visual walk.

The slice itself is canon-faithful (chips → inject text into haven `prompt-input-container`, `.patient-recall-list-add` hover bug patched in haven canon and rebuilt, ellipsis using U+2026). This brief is the residual — what surfaced beyond what an Angular-emit pass should resolve in-slice.

Pipeline boundary established this session: **Angular emit = faithful implementation, NOT UX critique**. UX questions surface here, not as in-slice fixes.

---

## To: Haven Visual Designer

Items where the visible drift is haven-canon territory — not pipeline implementation, not UX choice.

### HVD-01 — Recall-list / chat-thread top alignment in `layout-two-pane-grid`

**Observed (1280px desktop, dietary-recall entry + pass1):** the right-pane card (recall-list) sits ABOVE the first chat-thread message. Visually, the recall-list header label aligns at viewport-top + small padding, while the first agent chat message sits below it (the chat thread has its own top padding inside `chat-thread-inner`).

**Ask:** is this the intended top alignment for `layout-two-pane-grid` when both panes are at their natural starting state, or is one of the two panes paying an unintended top offset? If intended, canon-document the asymmetry; if unintended, name which pane should adjust.

**Why it matters:** the asymmetry is mild on desktop but reads as misalignment when both panes are first-impressioned (entry phase, before any patient interaction). Likely affects all `layout-two-pane-grid` consumers, not just recall.

---

### HVD-02 — Bordered vs. non-bordered button alignment as global pattern

**Observed:** Aaron has flagged this since his first design system — when a row contains a bordered button (`.btn-outline`, `.btn-danger`, anything with a 1px border) sitting next to a non-bordered button (`.btn-primary`, `.btn-ghost`), the optical alignment of text baselines vs. mathematical alignment of bounding boxes diverges by ~1px. Mathematical alignment makes the bordered button's text sit slightly higher because the bottom border consumes 1px the unbordered button doesn't have.

**Ask:** is there a canon pattern for this? Options that have surfaced historically:
  - Add an invisible 1px to the non-bordered button (e.g., `border: 1px solid transparent`) so bounding boxes match mathematically AND text baselines match optically.
  - Adjust padding asymmetrically on the bordered button.
  - Accept the 1px drift as visually negligible.

The patient-app's `chat-chip` (filled) next to `chat-chip.is-soft` (bordered) is the most-frequent surfacing in current work; chat-button-row (chat-button-primary next to chat-button-secondary with border) hits the same pattern.

**Why it matters:** universal pattern — every button row in every haven consumer.

---

### HVD-03 — Styled-wrapper semantics canon proposal

**Observation across the recall surface:** `.patient-recall-list-add` is a `<button>` styled as a text link (no border, no fill, color-only hover). `.chat-chip` is a `<button>` styled as a filled pill. `.chat-chip.is-soft` is a `<button>` styled as a bordered pill. Three distinct visual treatments for the same DOM primitive, with no canonical mapping between visual treatment and interactive contract.

**Proposal:** codify a styled-wrapper semantics rule that ties visual chrome to interactive contract:
  - **Border = actionable** (the bordered chrome signals "this commits an action")
  - **Color/fill = content-display** (the fill signals "this is a preferred/active variant")
  - **Focus-ring slot + `cursor: pointer` = interactive contract** (regardless of visual chrome, presence of these two signals "interact with me")

Under this rule, `.patient-recall-list-add` reads as a primary action (color-only, no border) but functions as a navigation/focus-affordance ("add another item" focuses the input). The border-actionable rule would push it toward a bordered treatment OR a different non-button DOM (`<a>` with `text-link` styling).

**Ask:** is this canon-worthy? If yes, audit existing haven primitives against it; if no, document why the haven approach diverges.

---

### HVD-04 — Global `button:hover { bg: var(--accent-10) }` rule contaminates text-only buttons

**Observed (and patched in-slice in haven canon):** `defaults.css` line 77-81 sets `background-color: var(--accent-10)` on ALL `button:hover, [type="button"]:hover, [type="submit"]:hover`. The `--accent-10` token resolves to `var(--color-primary-700)` (dark teal). Every button without an explicit `hover:bg-*` rule gets painted dark teal on hover, including text-only haven affordances like `.patient-recall-list-add`.

**In-slice fix landed** (haven-ui commit pending): added `@apply hover:bg-transparent` to `.patient-recall-list-add` so its hover state is text-only as canon describes. The components.css comment notes the global rule and flags this brief.

**Wider ask:** should the global `button:hover { bg: accent-10 }` rule in `defaults.css` be **removed**? Audit:
  - Every `.btn-*` class in haven already sets explicit `:hover { background-color }` (verified: btn-primary/secondary/outline/danger/ghost/icon). They don't need the global default.
  - Text-only affordances (patient-recall-list-add, others?) actively bug-out from the default.
  - The components.css comment at line 812 said "Defeat Preline's button:hover" — suggesting the author thought the rule was Preline's, but it's haven's own `defaults.css`.

If the global rule has no remaining consumer, removing it cleans up the contamination at the source. Blast-radius audit recommended before removing.

**Why it matters:** every consumer who reaches for a `<button>` outside the `.btn-*` taxonomy gets surprised by the dark-teal paint. This is a load-bearing canon decision.

---

## To: UX team

Items where the question is "what's the right experience design here" — not haven canon, not implementation.

### UX-01 — "Or type your answer" gating decision

**Context:** the prior recall-entry implementation collapsed the free-text input behind a `<details>/<summary>` disclosure ("Or type your answer") that the patient had to click to expand. The grief-context note in `recall.entry.html` (F1, 2026-05-25) justified this: "day-selection is closed/chip-enumerable, so a standing chat field would be at the wrong step."

**What changed:** the agentic-chat conversion (chips inject text into a visible prompt input) requires the textarea to be visible by default — disclosure-hidden inputs can't receive injected text observably. The `<details>` pattern was removed in-slice.

**Ask the UX team to confirm:** for the conversational/agentic UX pattern, should the prompt input be visible by default at all steps (the new state) or only at specific steps (the old design intent)? If the answer is "visible by default for agentic patterns, gated for radio-toggle patterns," we have a clean rule. If the answer is more nuanced, codify the heuristic.

---

### UX-02 — Mobile experience design intentionality

**Observed:** at 390px the two-pane layout stacks vertically. The recall-list right pane lands BELOW the chat thread + input on mobile, even on the entry phase where the right pane is just a "Pick a day to begin" stub. The patient scrolls past the chat-input to see the recall list.

**Question:** is this the intended mobile experience? Two alternatives surface:
  - **Reorder for mobile:** put the recall-list ABOVE the chat thread on mobile so the patient sees their state-of-recall before the conversation continues.
  - **Hide the recall-list on mobile during entry:** the stub state has no content; reveal only after the day is selected.

**Underlying principle ask:** avoid Andrey's "mobile-only that reflows" canon (per `feedback_no_haven_ui_react_conflation.md` and project memory) — patient-app should be experience-makes-sense-at-any-viewport with mobile as the majority case, not a desktop layout that reflows.

**Why it matters:** dietary recall is likely a mobile-primary surface (patients do this on phones, not desktops). The desktop layout we just built may be the secondary case, not the primary.

---

### UX-03 — "Add another item" affordance value

**Observed:** the recall-list footer shows an "Add another item" button that focuses the input field (the same input the patient just typed into). After the first item is added, the input clears and remains focused — clicking "Add another item" essentially focuses an already-focused input.

**Question:** does this button add value, or is it clutter? Two reads:
  - **Affordance value:** signals "you can add more" — discoverable invitation, even if mechanically redundant.
  - **Clutter:** the cleared input + cursor placement already signal "you can keep typing"; the button repeats the affordance.

**If "clutter," remove it.** If "affordance value," keep it but consider variants where the affordance changes shape after the first item is added (e.g., subtle "type more above" hint instead of a button).

---

### UX-04 — "10–15 min" copy verification against cap-08 AMPM clinical canon

**Observed copy:** "Hi! Time for your dietary check-in. I'll walk you through what you ate — we go through it a few times to catch everything. It takes about 10–15 minutes."

**Ask the UX team to verify:** is the "10–15 min" estimate aligned with cap-08 AMPM (multiple-pass method) clinical canon? Clinical AMPM literature describes a 5-pass method that can take 20–30 minutes for full structured recalls. If the patient finishes faster than the estimate, no problem; if they hit 20+ minutes and the message said "10–15," trust erodes.

**Suggested resolution:** either verify with the clinical lead (Vanessa or Soto-equivalent) what a realistic AMPM-truncated-to-5-pass time-estimate is, or replace the specific range with a softer "a few minutes" framing.

---

### UX-05 — Placeholder text quality ("Type a food or drink…")

**Observed (pass1 input):** `placeholder="Type a food or drink…"`

**Question:** is this the right placeholder voice? Alternatives surfaced:
  - "Type a food or drink…" (current)
  - "What did you eat or drink?"
  - "e.g., scrambled eggs"
  - blank (no placeholder)

**Voice-test:** does the placeholder read as an INSTRUCTION (imperative — "Type X") or as a CONVERSATION CONTINUATION (the patient is mid-sentence with the agent — "scrambled eggs" continues the agent's "what did you eat" prompt)? The agentic-chat surrounding pattern leans conversational, suggesting placeholders should match the conversational register.

This is a small-stakes copy question per surface but a load-bearing voice decision across the patient app's input affordances.

---

### UX-06 — Recall-list header day label wraps tightly at 390px

**Observed (mobile spot-check):** "Wednesday, June 3" wraps to two lines in the recall-list header at 390px because the "PASS 1 OF 5 — QUICK LIST" right-aligned label competes for horizontal space.

**Ask:** is the two-line wrap acceptable, or should the header stack the day label and the pass-label vertically at narrow viewports (stacked instead of horizontal flex)?

**Why it matters:** small thing on its own, but the same pattern is likely to surface across other right-pane primitives that pair a primary label with a state/status label at narrow widths.

---

## Routing

- **HVD-01 through HVD-04** → Haven Visual Designer expert (`Lab/haven-ui/planning/experts/brand-fidelity/` or vault-tier HVD if escalation needed).
- **UX-01 through UX-06** → UX team / `ux-design-lead` expert (`Lab/haven-ui/planning/experts/ux-design-lead/`).

Both files can be routed via `/route` from the vault root.

---

## Provenance

- Source slice: `cena-health-spark` branch `claude/emit-dietary-recall` (commit pending — slice in v1 polish).
- Walk session: 2026-06-04 morning PDT, Aaron walked the running app at http://localhost:4203/recall on desktop 1280px + mobile 390px.
- In-slice fixes that addressed adjacent items: hover CSS-collision (HVD-04 partial — per-class patch landed, global rule audit deferred to HVD), agentic chat conversion (UX-01 partial — visible-by-default state established, gating principle deferred to UX).
- Plan: `~/.claude/plans/cena-angular-emit-dietary-recall.md`.
