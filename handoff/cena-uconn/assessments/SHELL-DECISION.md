# Shell decision — assessments slice

**Date:** 2026-05-14
**Question:** "the right pane content is an affordance for when agentic chat is the primary patient interaction surface so we can still have a 'normal html content area' in this version of the patient ui that's not the case and everything can exist in the main content area. things like meal ordering may need a right pane but assessments certainly don't seem like they do. can we get input from ux experts on this and figure out how to or if we should adjust"

---

## TL;DR

Switch the assessments slice from `layout-agentic-shell.html` (3-pane) to `layout-app-shell-responsive.html` (nav + single content area). The right pane is structurally inert in every assessment state — chat carries only a single framing sentence at entry/preflight, is explicitly silent during question administration, and the content that lives in the right pane (`assessment-header`, `questionnaire-panel`, `pagination-row`) works as a full-bleed content region with zero loss. The responsive app shell maps cleanly to the deterministic-first build scope, handles mobile natively (which the agentic shell does not), and does not require a rebuild of the questionnaire components — only the outer wrapper changes. The agentic shell remains the right forward-compatible wrapper for meals and any future chat-primary flows; assessments ship a different shell without forcing app-level consistency between the two.

---

## Expert: UX Design Lead (Information Architecture)

**Verdict:** deterministic-app-shell
**Confidence:** high

### Findings

- In `take-assessment.question.html`, `panel-chat` contains exactly two elements at runtime: (1) a single framing sentence pre-populated at step 2; (2) an optional "mid-question help" message rendered at 0.4 opacity, marked `aria-hidden="true"` as a visual annotation. The chat pane carries no active interaction surface during the entire question-administration phase — the flow doc (`flow-take-assessment.md` § Step 3) explicitly states "Chat UI: none during administration."
- In `take-assessment.entry.html`, the chat pane carries the agent's greeting and a single "Start the questionnaire" chip. Per the chat-affordance principles (`chat-affordance-principles.md`), affordances render only when they are a productive next move. The greeting + chip is the entire conversational surface for the entry state — there is no ongoing conversation; it is a one-shot prompt.
- The UX Design Lead judgment framework's decision tree ("When to break consistency") specifies: break the three-panel layout only when the task is a focused, multi-step flow — "Full-screen center panel with step indicator. Thread available via toggle." This is precisely the assessment runner. The judgment framework itself would place the questionnaire in the center panel with the thread togglable, not permanently open.
- The `layout-app-shell-responsive.html` notes section explicitly says: "assessments suppress all three non-content regions for a full-screen stepper experience." The responsive shell was designed with exactly this carve-out in mind.
- Per the domain-knowledge table ("Agent-thread paradigm"): "The right panel is not a chat — it's an audit log with interaction points." In the assessment flow, there is no audit log to surface in the right pane. The questionnaire IS the interaction; moving it out of the right pane into the main content area is semantically correct, not a workaround.

### Reasoning

The agentic shell's three-pane layout exists because conversation IS the primary surface and the right pane opens only when an agent action creates a contextual artifact (a cart, a form, a record view). In the assessment flow, there is no ongoing conversation to anchor the center pane — there is one framing sentence and then silence. Keeping a 260px+ chat pane permanently visible to show a single paragraph of copy is structural waste: it steals viewport width from the questionnaire, which is the actual task. The deterministic-app-shell eliminates that waste without losing any functional surface. The "Talk to a person" handoff affordance (currently a header button in `panel-chat`) ports as a topbar or header button in the content region with no loss. The one-sentence agent framing at entry/preflight becomes an inline `patient-chat-message` component at the top of the content area, where it belongs architecturally in the absence of a persistent thread.

---

## Expert: Patient Ops

**Verdict:** deterministic-app-shell
**Confidence:** high

### Findings

- Patient Ops' core principle is "advance automatically when safe, gate when consequential." The assessment runner is a deterministic multi-step form — every transition (entry → preflight → question N → question N+1 → confirmation) is mechanical, no agent arbitration needed. The agentic shell's center panel implies an agent is present and routing. It is not.
- The patient experience model (judgment framework density table) calls for lower density for patients: "Show: next appointment, next delivery, one clear action. Hide: clinical detail, system status, anything requiring interpretation." A full-width questionnaire panel in a deterministic shell serves one clear action per viewport. The three-pane layout introduces chrome (chat pane, splitters) that adds cognitive load without adding functional surface.
- The Patient Ops coordinator interaction principle "Lead with the ask" applies symmetrically to the patient-facing surface. The questionnaire IS the ask — it should occupy as much screen as the task needs, not be squeezed into a right panel.
- Mobile handling is a patient-ops gap in the current agentic shell: `layout-agentic-shell.html` is documented as "desktop-only shell." The assessment flow will be completed on mobile devices by a food-insecure, HIV-positive patient population. The responsive app shell handles mobile natively (bottom-nav + full-content), where the agentic shell requires a separate mobile composition strategy that does not currently exist in the handoff artifacts.

### Reasoning

From a patient journey standpoint, the agentic shell creates a false signal: it implies "there is an agent here you can talk to, and this working surface is what the agent opened for you." In the deterministic-first build, there is no live agent. The chat pane is showing a pre-scripted sentence. Showing a full persistent chat column around a scripted message misleads the patient about the interaction model. The responsive app shell accurately represents the deterministic interaction: this is a form, the form lives in the main content area, navigation is available. When the agentic layer ships later, the chat affordances wire into the existing questionnaire components — the components don't change, only the shell and the "Talk to a person" affordance gains a live agent behind it.

---

## Expert: Brand Fidelity

**Verdict:** deterministic-app-shell
**Confidence:** medium

### Findings

- **Dimension 5 (Ava identity treatment):** Per the scorecard, this dimension is scored 0–2 "only when chat is in scope." The brand-fidelity scorecard explicitly substitutes dimension 5 with "Stone surface palette" when there is no chat pane. In the current agentic-shell renders, the chat pane exists but carries only a pre-scripted message with no Ava avatar, no agent-action citations, no live thread. It scores 0 on dimension 5 (Ava avatar absent), dragging every assessment page below the ship threshold of 7 for a patient-facing surface (threshold 8 per brand-fidelity judgment framework).
- **Dimension 2 (Visual hierarchy):** The current renders show the `panel-chat` occupying roughly 40% of the viewport on a standard 1280px desktop, with the questionnaire confined to `panel-content` at ~640px. The questionnaire-panel renders narrower than its content warrants. In the responsive app shell, the questionnaire expands to `--app-shell-content-max-w` (48rem by default) centered in the viewport, which matches DESIGN.md's right-pane sizing target and fills the vertical space correctly.
- **Stone surface palette:** The agentic shell's `.panel-chat` background and `.panel-content` surface both render as translucent white over stone ground. This is correct for the agentic case. In the deterministic shell, a single `app-shell-content` region on stone-50 with questionnaire panels on `bg-white` / `bg-sand-50` maintains the correct surface stack without the visual split created by two distinct translucent-white panes for what is functionally one content area.

### Reasoning

The agentic shell is load-bearing for Haven's visual identity precisely because the chat thread earns the center-pane real estate through ongoing conversation and agent actions. When the chat pane is a static pre-scripted paragraph, the three-pane layout reads as a layout looking for a purpose. Brand fidelity is not just token discipline — it is the coherence between structure and content. A questionnaire in a right-pane artifact slot, beside a near-empty chat pane, does not feel like Haven. It feels like the wrong shell. The responsive app shell places the questionnaire as the center of gravity, which is what Haven's design intent calls for when the task is focused and form-shaped.

---

## Expert: Pattern-Library Steward

**Verdict:** deterministic-app-shell
**Confidence:** high

### Findings

- The `layout-agentic-shell.html` component meta notes it explicitly: "when-to-use: Outermost shell for agent-led workflows where the chat thread is the primary surface (middle pane) and the right pane carries a contextual artifact opened by the agent." The assessment flow does not satisfy this condition. Chat is not the primary surface during question administration (it is silent). The questionnaire is not a contextual artifact opened by an agent — it IS the primary task.
- The `layout-app-shell-responsive.html` component meta notes: "assessments suppress all three non-content regions for a full-screen stepper experience." This carve-out was authored into the shell's contract documentation — it was anticipated.
- The current handoff HTML files use `app-shell--agentic` as the root modifier. Switching to the responsive shell requires: replacing `class="app-shell app-shell--agentic"` + `.agentic-shell` wrapper structure with `.app-shell` + `.app-shell-frame` + `.app-shell-sidebar` + `.app-shell-main` + `.app-shell-content`. The questionnaire-panel, assessment-header, progress-bar-pagination, response-option-group, pagination-row, and preflight-card components require zero changes — they compose into `app-shell-content` identically to how they composed into `panel-content`. The class contracts for those components do not reference the parent shell.
- The `panel-splitter` elements become obsolete and are dropped. The `panel-nav` class is replaced by `.app-shell-sidebar` + `.nav-section` + `.nav-item` (shared nav-item family per the responsive shell notes: "same nav-item family shared with .panel-nav").
- No new PL primitives needed. This is a Tier 2 shell swap at the handoff HTML level, not a Tier 1 primitive authoring event — the components are unchanged; only the wrapper changes.

### Reasoning

Pattern-library discipline requires shell usage to match when-to-use contracts. Using the agentic shell for a deterministic questionnaire is a misuse of the component contract — the shell communicates "agent-led, chat-primary" by its structure, and that signal is wrong here. The steward's role is to prevent patterns from being used outside their documented scope, because misuse creates expectation drift: Andrey reads the shell markup, infers "this is an agent chat flow," and builds Angular scaffolding for a chat interaction that is not intended for this slice. The correct shell signals the correct interaction model — deterministic, task-focused, form-shaped.

---

## Panel-level consolidated recommendation

**Shell:** `layout-app-shell-responsive.html` for all four assessment pages (`take-assessment.entry.html`, `take-assessment.preflight.html`, `take-assessment.question.html`, `take-assessment.confirm.html`).

**Specific implementation:**
- Replace `<div class="app-shell app-shell--agentic"><div class="agentic-shell">` wrapper with `<div class="app-shell"><div class="app-shell-frame">` per the responsive shell structure.
- Replace `<nav class="panel-nav">` with `<nav class="app-shell-sidebar">` — nav-item markup inside is unchanged (same `.nav-header`, `.nav-section`, `.nav-item` family, per responsive shell notes).
- Replace `<div class="app-shell-main"><main class="app-shell-content">` for the content column. Drop `.panel-splitter` divs. Drop `<main class="panel-chat">` and `<aside class="panel-content">` entirely.
- Move the agent framing sentence (currently in `panel-chat`) to an inline `patient-chat-message` block at the top of `app-shell-content`, above the questionnaire panel. This preserves the single framing sentence without requiring a chat pane. On the question-administration state (`take-assessment.question.html`), the framing sentence is not repeated — the `assessment-header` opens the content region directly.
- The "Talk to a person" affordance moves from `chat-handoff-trigger.is-header` inside `panel-chat` to a header-band element above `assessment-header` in the content area, or to the sidebar footer. Either placement is valid — sidebar footer is cleaner for the question-administration state where the header is used by the progress bar.
- Apply `app-shell-content--full-bleed` override on the content region if the questionnaire panel needs full-width at desktop. Default 48rem max-w is correct for single-column form content and matches DESIGN.md right-pane target sizing.

**What to defer:**
- Mobile bottom-nav: include the `app-shell-bottom-nav` region with the same five nav items, following `layout-app-shell-responsive.html` demo markup. This is a one-time addition to the handoff HTML; Andrey's Angular port wires the nav items to his routing layer.
- Topbar region: omit at launch (patient app is English-only at pilot, no language toggle, no notification bell for this slice). The responsive shell notes this as an acceptable omission.

**Meals and future slices:**
- Meals stays agentic-shell. Aaron's read is correct: cart vs. menu is a genuine two-surface problem (working surface in right pane, agent narrates state changes in center pane). The when-to-use contract fits meals.
- Shell context-switching across the app (assessments on responsive shell, meals on agentic shell) is acceptable. The nav rail is identical in both shells (same `.nav-header`, `.nav-section`, `.nav-item` classes), so the sidebar chrome reads as continuous. What changes is the right-pane column's presence or absence — patients who use both flows will notice the layout difference, but the flows are sufficiently distinct in purpose that the difference is meaningful rather than jarring. Per the UX Design Lead framework: "Document the exception. When a surface breaks from the standard pattern, document why in the component or view file." This doc is that documentation.

---

## Implementation impact

**Scope:** shell-wrapper swap only. Four HTML files change. No component classes change. No `components.css` edits.

**Changes per file:**
- `take-assessment.entry.html` — replace outer wrapper (agentic → responsive); move agent greeting + "Start the questionnaire" chip from `panel-chat` into `app-shell-content` as inline `patient-chat-message` + `chat-button-row`; move "Talk to a person" to header-band above assessment content or sidebar footer; drop both `panel-splitter` elements.
- `take-assessment.preflight.html` — same wrapper swap; agent preflight framing sentence moves inline above `assessment-preflight-card`; drop chat pane and splitters.
- `take-assessment.question.html` — wrapper swap; drop chat pane entirely (agent is silent during administration per flow doc); "Talk to a person" moves to sidebar footer or header-band; questionnaire panel composites into `app-shell-content` unchanged.
- `take-assessment.confirm.html` — wrapper swap; confirmation card composites into `app-shell-content`; any post-submit agent message renders inline above confirmation card.

**Effort estimate:** ~2 hours for all four files including mobile bottom-nav addition and "Talk to a person" repositioning. Zero PL ceremony — no new components, no `components.css` edits, no COMPONENT-INDEX updates. This is a Tier 2 composition change.

**Files NOT changing:** `take-screener.html`, `take-hfias.html`, `take-whoqol.html`, `take-gnkq.html` — same wrapper swap applies to these if they use the agentic shell. Verify at edit time.

**Andrey signal value:** the shell swap makes the handoff HTML self-documenting. Andrey reads the responsive shell structure and correctly infers: "this is a traditional app layout with a sidebar and a content area." He does not need to reverse-engineer why there is a chat pane with one sentence in it.

---

## Decision still parked for Aaron

- **Per-instrument HTML files** (`take-hfias.html`, `take-whoqol.html`, `take-gnkq.html`): do these already use `agentic-shell`? If yes, they get the same wrapper swap. Confirm visually before committing — the four abstract state pages are the canonical templates; the per-instrument files may or may not have already inherited the shell.
- **"Talk to a person" placement:** the panel's preferred placement is sidebar footer (always-reachable, not competing with content-area controls). If Aaron has a preference between sidebar footer and content-area header-band, name it and it ships that way. Both are structurally valid.
- **Cross-slice consistency statement:** if Aaron wants an explicit product decision documented ("assessments = responsive shell; meals = agentic shell; all future slices declare shell at authoring time"), this doc is the anchor. The `conform:wireframe-shell` gate enforces the shell declaration at build time — future wireframes under `capabilities/development/wireframes/` should update their `shells:` frontmatter to reflect whichever shell the swap lands on.
