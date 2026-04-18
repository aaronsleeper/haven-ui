# Judgment Framework — UX Design Lead

How this expert weighs tradeoffs and makes decisions when the domain knowledge
doesn't give a clear answer. These are the heuristics, frameworks, and decision
trees that distinguish experienced design judgment from following a styleguide.

---

## Core decision principle

> **Human attention is the scarce resource** (Vision principle 5).
> Every design decision is evaluated against: does this make better use of a
> coordinator's or clinician's attention, or does it waste it?

When two design approaches compete, the one that requires less human attention
for the same outcome quality wins. "Less attention" means fewer clicks, less
reading, less context-switching — not less information.

---

## Decision trees

### New feature: how much UI does it need?

```
Is the action routine and low-risk?
├── Yes → Can the agent handle it with just a thread notification?
│   ├── Yes → No new UI. Thread message is sufficient.
│   └── No → Minimal UI: single approval card in thread.
└── No → Does the user need to review complex information to decide?
    ├── Yes → Center panel view with thread-panel approval interaction.
    └── No → Approval card with summary + expandable detail.
```

**Principle:** The default is "no new UI." Every new screen, modal, or panel
is a cost. The three-panel layout should absorb new features through composition,
not extension.

### Density vs. clarity tradeoff

```
Who is the primary user of this view?
├── Clinical staff (RDN, BHN, Coordinator)
│   → Higher density. They're trained, they process in volume, they scan.
│   → Show: key metrics, flags, and action buttons above the fold.
│   → Hide: explanatory text, onboarding cues, progressive tutorials.
├── Kitchen staff
│   → Highest density. They're on their feet, glancing at a screen.
│   → Show: today's orders, quantities, delivery status. Nothing else.
│   → Format: scannable list/table, large text, high contrast.
├── Patient
│   → Lower density. They're not trained, they use it occasionally.
│   → Show: next appointment, next delivery, one clear action.
│   → Hide: clinical detail, system status, anything requiring interpretation.
└── Partner (external)
    → Medium density. They're professionals but not daily users.
    → Show: their referrals, their reports, status of their patients.
    → Minimize: system internals, agent activity, operational detail.
```

### When to break consistency

The three-panel layout is the universal pattern. Breaking it has a cost (user
relearning) and a benefit (better fit for a specific task). The decision:

```
Does the task genuinely not fit three panels?
├── No → Use the standard layout. Customize the content, not the structure.
└── Yes → What specifically doesn't fit?
    ├── Task requires comparing two full views side by side
    │   → Consider split center panel. Keep left sidebar and thread.
    ├── Task is a focused, multi-step flow (e.g., enrollment wizard)
    │   → Full-screen center panel with step indicator. Thread available via toggle.
    └── Task is a dashboard/overview with no single record
        → Center panel as dashboard grid. Left sidebar as filter/nav. Thread hidden.
```

Breaking consistency is acceptable when the standard layout would require the user
to hold information in their head that the screen should hold for them.

---

## Prioritization heuristics

### What to design first

1. **Approval interactions** — The most common, highest-stakes moment in the app.
   Get these right before anything else.
2. **Queue views** — This is how users start every session. The queue determines
   whether the app feels overwhelming or manageable.
3. **Record views (center panel)** — Patient record, care plan, order detail.
   These are the workspace; get the information hierarchy right.
4. **Navigation and wayfinding** — Left sidebar, breadcrumbs, back behavior.
   Users must always know where they are.
5. **Edge cases and errors** — Empty states, error states, loading states.
   These are where trust is built or broken.

### Feature complexity → design investment

| Complexity | Design investment | Validation method |
|---|---|---|
| Configuration change (label, order, visibility) | Token/component update, no new design | Visual regression test |
| New view using existing components | Wireframe → mockup → review | Walkthrough with stakeholder |
| New interaction pattern | Wireframe → prototype → usability test → iterate | Task-based testing with representative user |
| New layout model or navigation change | Research → wireframe → prototype → test → iterate → test again | Multi-round testing, A/B if possible |

---

## Tradeoff frameworks

### Efficiency vs. safety

Healthcare UX constantly faces this tension. The expert resolves it with:

- **Routine, reversible actions:** Optimize for speed. One-tap approval. Batch actions.
  Undo instead of confirm.
- **Consequential, irreversible actions:** Require explicit confirmation. Show consequences.
  No batch processing. Name the action in the button ("Submit claim for $4,230" not "Submit").
- **Edge case:** When an action is routine 99% of the time but consequential 1% of the time,
  use conditional gating (e.g., claim submission is one-tap under $X, requires review above $X).

### Consistency vs. optimization

- **Default to consistency.** Same patterns, same components, same interactions across
  surfaces. Predictability reduces cognitive load.
- **Optimize when measured.** If a specific workflow has measurable friction (time-on-task,
  error rate, abandonment), optimize that workflow. Don't speculatively optimize.
- **Document the exception.** When a surface breaks from the standard pattern, document
  why in the component or view file. Future designers need to know if it's intentional or
  an oversight.

### Simplicity vs. power

- **Start simple.** The first version of any feature should solve the 80% case.
  Don't design for configurability before the core flow works.
- **Power through composition, not configuration.** Instead of settings panels
  with dozens of options, let users compose the tools they need (pinned items,
  custom queue filters, saved views).
- **Expose complexity progressively.** Default view serves the common case. Expand
  to show detail. Advanced actions live in menus, not primary surfaces.

---

## Worked examples

### Example 1: Designing the denial management view

**Context:** Revenue Cycle needs a view for managing claim denials.

**Judgment call:** Do denials get their own surface or live within the existing
admin view?

**Reasoning:**
- Denials are a subset of revenue cycle work → same user (admin/finance)
- Processing a denial requires seeing: original claim, denial reason, patient
  record, recommended action
- This is a center-panel view with thread-panel showing denial workflow

**Decision:** Center panel shows denial detail (claim summary, denial code,
payer response, recommended action). Thread panel shows the agent's denial
analysis and proposed resolution. Left sidebar filters queue by denial type,
payer, age, and value.

No new surface. Composes existing patterns. The approval card for "submit appeal"
includes the specific appeal letter the agent drafted.

### Example 2: Kitchen app order density

**Context:** Kitchen staff need to see today's orders at a glance.

**Judgment call:** How much information per order line?

**Reasoning:**
- Kitchen staff scan, they don't read. High cognitive load environment.
- Per order they need: patient name (for labeling), dietary restrictions (for safety),
  meal selection (what to prepare), delivery window (when it goes out)
- They do NOT need: clinical detail, insurance info, care plan status

**Decision:** Dense table with 4 columns. Dietary restrictions as color-coded
badges (with text labels — never color alone). Sort by delivery window.
Expandable row for notes. No thread panel by default — toggle-accessible
if needed for delivery coordination.
