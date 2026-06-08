# Phase 2 — patient-flow HTML blobs (UConn pilot)

**Date opened:** 2026-05-12
**Status:** READY TO START — pick up in a new thread
**Predecessor:** Phase 1 (shell template handoff to Andrey) shipped 2026-05-12

## What you're picking up

Aaron and the prior thread shipped the agentic-shell template to Andrey today (`apps/_shared/handoff/andrey-uconn-2026-05-12/`, commit `597ec5c`). Phase 2 is the next deliverable: **per-use-case HTML blob docs** that Andrey can drop into the shell's slots to populate each state of each user flow.

The intended consumer is Andrey's LLM working from the template. Each blob doc covers one use case; sections inside the doc label the step(s) and condition(s) that the adjacent HTML represents.

## The output format

Aaron specified the shape in the kickoff thread (2026-05-12):

> *"we'll go through the patient use cases we already defined and create all the html blobs to support each state of the user flow and i think we can just have those in a long html document separated into sections where we list the step(s) and condition(s) to which the adjacent html blob is relevant. we should probably do this one use case at a time. as i imagine there's complexity here i haven't thought of yet."*

Concretely, one Markdown-or-HTML doc per use case. Inside each doc:

- One **section per state** — a state is defined by step + condition (e.g., "Step 3, condition: patient has 2+ data points")
- Each section contains a short prose note naming the step/condition + the HTML blob that should appear in the relevant pane(s) of the shell
- Most states will need blobs for **multiple panes** — center chat thread (the agent's turn + artifacts visible inline) + right pane (the contextual artifact opened by the agent). Sometimes the nav state changes too (active item, badge, etc.)

Suggested doc skeleton for each use case:

```markdown
# PT-SHELL-XX — [use case name]

## Use case reference
Pointer to `apps/patient/design/shell-use-cases.md` §PT-SHELL-XX.

## Wireframe reference
Pointer to `apps/patient/design/wireframes/[matching].md` if one exists.

## States

### State 1 — [step/condition label]
**Step:** [from use case]
**Condition:** [e.g., "first visit, no prior data" or "after assessment submission"]

**Nav state:** [what's active, what badges appear]

**Center pane (chat thread):**
```html
<!-- HTML blob: the chat thread content for this state -->
```

**Right pane (contextual artifact):**
```html
<!-- HTML blob: the artifact opened by the agent at this state (or empty state) -->
```

### State 2 — [next step/condition]
[same pattern]

## Edge cases / variants
[any notable variants — error states, low-data states, etc.]
```

## Where output goes

`Lab/haven-ui/apps/_shared/handoff/andrey-uconn-2026-05-12/flows/` — one file per use case. Suggested naming: `pt-shell-01-open-app.md` (use case ID + slug). Sibling to the shell template files so Andrey can pull them together.

When ready to share with Andrey, ship the same way as Phase 1 — paste into Slack as attachment + a brief intro message.

## Inputs — read these first, in this order

**Mandatory:**

- `Lab/haven-ui/apps/_shared/handoff/andrey-uconn-2026-05-12/README.md` — shell template architecture + brand-fidelity notes. Anything you put in the slots must respect these rules.
- `Lab/haven-ui/apps/patient/design/shell-use-cases.md` — PT-SHELL-01 through PT-SHELL-06. The canonical use case list. Each blob doc covers exactly one.
- `Lab/haven-ui/DESIGN.md` §Voice, §Typography, §Color, §Composition patterns — the canonical haven-ui spec.

**Reference (read as needed):**

- `Lab/haven-ui/apps/patient/design/wireframes/` — mobile-first wireframes for patient routes. Use as content reference, not literal layout — Andrey's UI is 3-column desktop, not mobile bottom-nav. See translation note below.
- `Lab/haven-ui/apps/patient/design/a2ui-component-queue.md` — A2UI extension components already shipped to the PL (chat-button-row, chat-chip-row, chat-numeric-input, chat-paired-numeric, chat-sheet-link, chat-handoff-trigger, chat-time-preference-picker, chat-status-row, patient-chat-message). Use these inside the chat-thread blobs when an interaction fits.
- `Lab/haven-ui/packages/design-system/pattern-library/COMPONENT-INDEX.md` — full PL component list. Compose from here; don't invent.
- `Lab/haven-ui/packages/design-system/pattern-library/pages/layout-agentic-shell.html` — the live page demo showing what compositions look like in the shell. Useful as a worked example.
- `Lab/haven-ui/apps/patient/design/component-map.md` — patient-specific component map (which PL components compose into which flows).

**Predecessor context:**

- `~/.claude/plans/andrey-uconn-shell-handoff.md` — the ambient plan from Phase 1. Decisions, rationale, what shipped. Read if context is unclear.
- `Lab/haven-ui/.project-docs/handoffs/2026-05-12-pre-v2-sand-outlier-remediation.md` — separate-thread cleanup for pre-v2 sand outliers. Don't touch outlier tokens (sand-15, sand-16, sand-150, sand-250) in your blobs — use v2-canonical stops only.

## First use case to tackle

**PT-SHELL-01 — open app and see today's prompt.** It's the simplest, most universal, and sets the pattern for subsequent use cases. The states are:

- State 1: First-of-day visit, has assigned task → dashboard surfaces today's task card
- State 2: Returning later same day, task completed → dashboard shows "nothing to do today" empty state with warm voice
- State 3: New message arrived since last visit → message preview surfaces above task card
- State 4: First visit ever (just enrolled) → empty-positive onboarding-ish state

Walking through these gives you the format pattern. After PT-SHELL-01 ships, propose to Aaron which use case to tackle next — likely PT-SHELL-03 (read a coordinator message) since it's another high-frequency state.

## Translation note — mobile-first → 3-column desktop

The patient app is documented as **mobile-first** with bottom-nav (`apps/patient/design/shell-use-cases.md` §Phase 1 Constraints). Andrey is building a **3-column desktop** agentic UI. Use case content carries forward; pane layout doesn't.

How to translate:

| Mobile (documented) | 3-column desktop (Andrey's) |
|---|---|
| Bottom-nav: Dashboard / My Health / Messages / Care / Settings | Left rail: same items as nav-items in the persistent rail. Conversations list below |
| Dashboard route (today's task card, recent message, next delivery) | Center chat thread + agent prompts for the same things ("Hi Maria, your blood pressure check is due — want to do it now?") |
| Messages route (patient-coordinator threads, strict allowlist) | Right pane when Messages is the active artifact; or in-thread `patient-chat-message` blocks when handed off into chat |
| My Health route (trend cards) | Right pane shows trend cards when the agent opens "Show me my health" or similar |
| Slide-up sheets / modals | Right pane opens with the same content |

The patient `thread-panel` strict-allowlist rule (no agent_tool_call exposure) still applies — but it lives on the Messages-route surface, not the chat-thread surface. The 3-column shell's center chat IS the agent thread; for patient context, that thread renders only patient-facing message types per `shell-use-cases.md` §Thread message-type allowlist. **This is load-bearing — confirm with Aaron before writing the first state if you're unsure.**

## Constraints (must apply to every blob)

From `DESIGN.md`, `apps/patient/design/shell-use-cases.md`, and the Phase 1 handoff README:

- **5th grade reading level** for all patient-facing copy (`conform:plain-language` gate)
- **Bilingual EN/ES**: every visible string supports `data-i18n-en` / `data-i18n-es` attributes
- **No agent-activity exposure** to patient: filter `agent_tool_call`, `agent_tool_result`, `approval_request`, etc. from any patient-visible thread blob
- **No clinical raw numbers**: trend cards show "Improving" / "Low risk" / "Needs attention", not "PHQ-9 = 4"
- **WCAG 2.1 AA**: 44px+ tap targets, high contrast, screen reader support
- **Voice**: warm + specific + observational + stress-literate. Sample lines in `DESIGN.md` §Voice. Avoid generic positivity.
- **Brand-fidelity must-dos** (from handoff README): active nav = bold weight not bg; primary teal for state-changing commits only; Ava avatar on transparent; up-arrow send; empty-state describes purpose
- **v2-canonical tokens only**: don't reach for sand-15/16/150/250 (pre-v2 outliers being remediated separately)

## Composition discipline

- **PL-first per haven-ui CLAUDE.md.** If a component you need exists in `COMPONENT-INDEX.md`, copy its HTML directly. Don't regenerate.
- **A2UI chat-thread components** (chat-button-row, chat-chip-row, chat-numeric-input, chat-paired-numeric, chat-sheet-link, chat-handoff-trigger, chat-time-preference-picker, chat-status-row, patient-chat-message) are the canonical in-chat interactive primitives. Compose them when a state needs an in-thread interaction.
- **Inline carve-outs okay** for one-off compositions in the blob docs (e.g., a specific empty-state layout for State 4) — but don't promote to PL without a second consumer.

## Routing — when to dispatch experts

- **UX questions** (icon convention, interaction pattern, nav placement) → Agent() with subagent_type=general-purpose, briefed with `Lab/haven-ui/planning/experts/ux-design-lead/` brief + DESIGN.md §Voice + unbiased prompt. Pattern that worked in Phase 1: ask the open question without pre-suggesting an answer.
- **Brand-fidelity questions** (does this feel like Haven, voice/hierarchy/typography review) → `planning/experts/brand-fidelity/` essential briefing has stale facts (still says "Inter Bold", "stone/50") — read DESIGN.md as authority, treat the brief as orientation only.
- **Token / palette questions** → check whether the outlier-remediation handoff applies; if it's a fresh question, route to design-system-steward via the same pattern.
- **Use case interpretation / clinical context** → ask Aaron. UConn cohort is HIV+ food-insecure adults (60 patients); Maria Rivera persona is the default unless Aaron explicitly updates.

## Done definition — per use case

- [ ] One Markdown file at `apps/_shared/handoff/andrey-uconn-2026-05-12/flows/pt-shell-XX-[slug].md`
- [ ] All states from the use case represented, each labeled with step + condition
- [ ] Each state has the chat-thread blob + the right-pane blob (and nav-state note if it changes)
- [ ] Every visible string carries `data-i18n-en` / `data-i18n-es`
- [ ] All HTML uses classes from `COMPONENT-INDEX.md` (no invented classes)
- [ ] All copy passes `conform:plain-language` mentally (5th grade reading, no clinical jargon)
- [ ] Aaron reviews; ship to Andrey via Slack with a brief intro per Phase 1 pattern

## Suggested opener for the new thread

Paste something like:

> *Pick up Phase 2 of the UConn patient-flow work. Read `Lab/haven-ui/.project-docs/handoffs/2026-05-12-patient-flow-html-blobs-phase-2.md` for the full brief, then read the mandatory inputs in the order listed there. When you're oriented, start on PT-SHELL-01 — propose the doc skeleton + State 1's blobs and we'll iterate from there.*

## Open questions you may hit early

These are flagged so you don't burn cycles re-discovering them:

1. **The chat-thread allowlist for patient context.** Mobile shell-use-cases says patient `thread-panel` (Messages route) is strict-allowlisted: notification + human_message-from-coordinator + status_change only. Does that allowlist also apply to the *center* chat pane (the agentic shell's main chat)? Mobile docs say center pane IS the agent thread (which exposes tool calls). Desktop center pane plays the same role. Confirm with Aaron whether patient context drops the tool-call/approval-card exposure in the desktop center pane too, or whether the desktop center pane is genuinely an agent thread that the patient sees.
2. **The "agent activity" vs "agent conversation" distinction.** Coordinator gets both (tool calls visible as transparency). Patient probably gets just conversation. Decide before writing State 1 of any use case.
3. **i18n bilingual rendering in the chat-thread.** The mobile-i18n-bar pattern is mobile-shell-only. How does language toggle work in the 3-column desktop? Probably a control in the nav or a per-message language indicator. Confirm with Aaron.
4. **Cohort-specific data adjustments.** Default is Maria Rivera (chronic conditions, broader case). UConn cohort is HIV+ food-insecure. Use cases reference meal planning, blood pressure, etc. Should the use case content adjust to HIV/food-insecurity specifics (medication adherence prompts, food-insecurity assessments)? Aaron said in Phase 1 it's OK to keep Maria for v1 — but confirm if states diverge.

## What NOT to do

- Don't touch the canonical pattern library (`packages/design-system/`) — Phase 2 is content/composition work in the handoff folder, not pattern-library authoring
- Don't update DESIGN.md (still dirty with in-flight work from another session)
- Don't sweep pre-v2 sand outliers — that's the separate remediation handoff's scope
- Don't promote inline carve-outs to PL without checking for a second consumer
- Don't push to remote without Aaron's confirmation (Phase 1 pattern: commit when ready, ask before pushing)

## Closing note

Aaron's frame in Phase 1 was *"enable Andrey to move forward and do everything we can to help get this launched."* That's the bar. The blob docs exist to make Andrey's LLM productive on the patient UI without him needing to consume the broader vision docs. Be operational, not strategic. Concrete blobs over comprehensive coverage.
