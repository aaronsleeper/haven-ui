# Dependencies — UX Design Lead

Who this expert relies on, and who relies on this expert. This graph is walked
during `/expert-update` to detect cascading staleness.

---

## Depends on

These experts or knowledge sources provide input that shapes UX decisions.
If they change, this expert may need to update.

| Source | What flows in | Impact if source changes |
|---|---|---|
| **Haven design system** (`Lab/haven-ui/`) | Component library, design tokens, spacing/color/type scales | All component specs and interaction specs may reference stale tokens or components |
| **Cena Health brand** (`Stack Overflowed/Projects/Cena Health/Brand/`) | Brand colors, voice, visual identity | Surface-level visual updates; rarely affects interaction design |
| **Clinical Care expert** (future) | Workflow requirements, clinical terminology, documentation formats (SOAP, NCP) | Interaction specs for clinical surfaces may need adjustment |
| **Compliance expert** (future) | HIPAA rendering constraints, audit trail requirements, PHI display rules | Can invalidate views that display patient data |
| **Patient Ops expert** (future) | Queue workflows, coordination patterns, SLA requirements | Impacts queue design, urgency visualization, escalation flows |
| **Product strategy** (human — Aaron) | Feature priorities, user research findings, product direction | Determines what gets designed and in what order |
| **WCAG specification** (external) | Accessibility requirements | Version updates can require retroactive compliance work |
| **Role definitions** (`roles/*.md`) | What each role needs from the UI, their workflow context | Changes to role responsibilities change the design targets |
| **Design System Steward** (planned) | Component dedup decisions, governance rulings, token usage guidance | Determines whether proposed components are approved, modified, or rejected in favor of existing ones |
| **Expert Operations** (planned) | New expert/role integration requirements | When a new expert enters the system, this expert's workflows and escalation paths may need updating |

---

## Depended on by

These experts or systems consume this expert's output. If this expert changes
its outputs, these downstream consumers may break.

| Consumer | What flows out | Impact if this expert changes |
|---|---|---|
| **Frontend engineering** (human — Aaron/Andrey + agents) | Interaction specs, component specs | Engineers build what this expert designs; spec changes = rework |
| **QA expert** (future) | Quality criteria, expected states, accessibility spec | QA tests against the spec; changed spec means changed test criteria |
| **Clinical Care expert** (future) | Clinical UI patterns, documentation view design | Clinical workflows depend on the UI patterns this expert defines |
| **Patient Experience expert** (future) | Patient app interaction design, AVA voice flow design | Patient-facing UX directly affects experience quality metrics |
| **Haven design system** (`Lab/haven-ui/`) | New component requests, component modifications | Bidirectional: this expert both consumes and proposes changes to Haven |
| **Design System Steward** (planned) | Component proposals, token usage questions | Steward depends on this expert's component specs as primary input for governance decisions |

---

## Interface contracts

When this expert's outputs change, these specific interfaces must be checked:

| Interface | Between | What to verify |
|---|---|---|
| Approval card format | UX ↔ Agent framework | Card structure matches what orchestrators produce |
| Thread message rendering | UX ↔ Agent framework | Visual rendering rules match message type definitions |
| Component API | UX ↔ Haven design system | Component props and variants align with implementation |
| Queue item format | UX ↔ QueueManager agent | Queue display matches what the agent surfaces |
| Token consumption | UX ↔ Haven tokens | All referenced tokens exist and have current values |
| Token usage guidance | UX ↔ Haven token reference (dependency) | Token selection follows documented usage contexts — Haven must maintain agent-readable guidance |
| Component governance | UX → Design System Steward | New component proposals follow governance protocol before implementation |
