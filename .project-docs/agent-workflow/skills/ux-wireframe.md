---
name: ux-wireframe
description: Produce text-based screen specifications from ux-architect outputs. Use this skill after Gate 1 is approved and before ux-design-review. Each screen spec is a markdown file that fully defines layout zones, components, interactions, states, accessibility, and copy — enough for haven-mapper to map without ambiguity and for ux-design-review to evaluate without guessing.
---

# UX Wireframe Spec Writer

You produce structured, text-based screen specifications. No visual mockups or pixel measurements. Every element is described in terms of Haven component vocabulary, interaction intent, and content requirements. The output must be complete enough that haven-mapper can map it to components without revisiting the use cases, and ux-design-review can evaluate it without referring back to you.

## haven-ui Path Conventions

- **ux-architect outputs:** `apps/[persona]/design/[feature]-use-cases.md`, `[feature]-func-spec.md`
- **IA map:** `src/data/shared/ia-map.md`
- **Pattern library (component vocabulary):** `pattern-library/COMPONENT-INDEX.md`
- **Personas:** `src/data/personas/[persona]/`
- **Wireframe output:** `apps/[persona]/design/wireframes/[screen-id]-[screen-name].md`
- **Screen flow overview:** `apps/[persona]/design/wireframes/[feature]-screen-flow.md`

## Screen ID Convention

Prefix each screen with a short feature code and a two-digit sequence number:

```
[FEATURE_CODE]-[NN]-[screen-name].md

Examples:
  onb-01-welcome.md
  onb-02-consent.md
  meals-01-weekly-meals.md
  meals-02-delivery-status.md
  shell-bottom-nav.md
```

Feature codes are 2-4 characters. `shell-` prefix for persistent chrome (nav bars, sidebars, headers that appear across multiple screens).

## Before You Start

1. Read the ux-architect outputs for this feature: use cases, func spec, IA.
2. Read the relevant persona files from `src/data/personas/`.
3. Read `pattern-library/COMPONENT-INDEX.md` to learn the current component vocabulary. Use component names from this index (e.g. "card", "badge-success", "data-table") as placeholder vocabulary in layout specs. Do not invent component names.
4. Read `src/data/shared/ia-map.md` to understand navigation context.
5. List the screens to be produced (from the IA phase) and confirm with the wireframe plan before writing individual files.

## Screen Spec Format

Every wireframe file follows this structure exactly. Omit sections that genuinely do not apply (e.g. a screen with no bilingual requirements). Do not omit sections because they are hard or uncertain -- add them to Open Questions instead.

```markdown
# [SCREEN-ID]: [Screen Name]

**Application:** [App name] ([device context: Mobile / Desktop / Both])
**Use Case(s):** [Use case IDs from func spec, e.g. PT-MEALS-001]
**User Type:** [Persona name]
**Device:** [Mobile-first / Desktop / Responsive]
**Route:** `/[path]`

## Page Purpose

[One paragraph. What task does the user arrive here to complete? What does success look like for them?]

---

## Layout Structure

### Shell
[Describe the persistent chrome: sidebar, bottom nav, top bar. Reference the shell spec file if it exists. Note active nav item.]

### Header Zone
- **Component:** [component name from COMPONENT-INDEX]
- [Elements: title, subtitle, actions, status indicators]
- [Typography scale: e.g. "page title — Lora, large"]
- [Copy: exact strings or copy placeholders in brackets]

### Content Zone

#### [Section Name]
- **Component:** [component name]
- [Describe contents: fields, labels, data, icons]
- [Icon references: `fa-[icon-name]` from FontAwesome Pro]
- [Badge usage: e.g. `.badge-success` for "Active" status]
- [Conditional visibility: e.g. "Only shown when [condition]"]
- [Copy: exact strings or `[COPY: brief description]` for placeholders to be written by ux-design-review]

#### [Section Name]
[Continue for each logical content section]

### Footer Zone
[Sticky actions, CTAs, secondary links, disclaimers]

---

## Interaction Specifications

### [Action Name]
- **Trigger:** [What the user does]
- **Feedback:** [Immediate visual response]
- **Navigation:** [If applicable: where the user goes next]
- **Error handling:** [What happens if the action fails]

### [Action Name]
[Continue for each significant interaction]

---

## States

### Empty State
- **Component:** `data-empty-state`
- Icon: `fa-[icon]` in `text-gray-300`
- Heading: "[Exact copy or COPY placeholder]"
- Message: "[Exact copy or COPY placeholder]"
- CTA: "[Button label]" — `.btn-outline` or `.btn-primary`

### Loading State
[Describe skeleton pattern: how many skeleton items, which components are placeholders]

### Error State
[Alert component, message copy, retry behavior]

### [Other States]
[Any feature-specific states: confirmed, expired, locked, read-only, etc.]

---

## Accessibility Notes
- [Touch target requirements: 44px minimum for mobile interactive elements]
- [ARIA labels for icon-only or ambiguous interactive elements]
- [Focus trap requirements for modals / bottom sheets]
- [Color independence: where color is used as status indicator, name the non-color fallback]
- [Any screen reader announcement requirements for dynamic content]

## Bilingual Considerations
- [Which strings need Spanish translation]
- [Whether Spanish text changes layout (longer strings, different character patterns)]
- [Any language-specific formatting: dates, currency, phone numbers]

## Open Questions
- [Anything unresolved from ux-architect, or discovered during wireframing, that needs Aaron's input]
```

## Screen Flow Overview File

Before writing individual screen files, produce a flow overview file: `wireframes/[feature]-screen-flow.md`.

```markdown
# Screen Flow: [Feature Name]

## Screens in This Feature

| ID | Name | Route | Persona | Shell |
|----|------|-------|---------|-------|
| [id] | [name] | `/[path]` | [persona] | [shell type] |

## Navigation Flows

[Describe how screens connect. Use plain text or a simple list, not a diagram.]

Example:
- ONB-01 → (continue) → ONB-02
- ONB-02 → (agree) → ONB-03
- ONB-02 → (back) → ONB-01
- ONB-03 → (complete) → MEALS-01 (main app shell)

## Shared Shell Components

[List any shell files (bottom nav, sidebar, header) that are shared across multiple screens in this feature. These get their own wireframe file.]

## Out of Scope
[Screens referenced in the flow that exist in a different feature or are not being built now]
```

## Component Vocabulary Rules

Use only component names that exist in `pattern-library/COMPONENT-INDEX.md`. If you need a component that does not exist:

1. **Do not invent a name.** Use a descriptive phrase in brackets: `[NEW COMPONENT: pill-shaped action button with icon + label]`.
2. **Flag it explicitly** in the screen spec under a `## New Components Flagged` section at the bottom of the file.
3. haven-mapper will spec it properly.

This prevents the wireframe vocabulary from drifting from what Haven can actually produce.

## Copy Rules

For copy you are confident about, write the exact string in the spec. For copy you are uncertain about or that requires ux-design-review input, use a placeholder:

```
`[COPY: error message when meal confirmation fails]`
`[COPY: empty state heading for a patient with no assigned meals]`
```

Do not write placeholder copy like "Lorem ipsum" or "Error occurred." The placeholder must describe what the copy needs to communicate. ux-design-review will write final copy for all `[COPY: ...]` placeholders.

## Level of Detail Rules

These are minimum requirements per section. Agents tend to under-specify interactions and states -- these are the most common gaps.

**Layout zones:** Every zone must be present (even if it's "no footer zone on this screen").

**Components:** Every element in every zone must have a named component. "A card showing meal information" is not sufficient. "`.card` with `.card-header` (meal name, day label), left-side meal photo (`size-20 rounded-lg`), right-side content column" is sufficient.

**Interactions:** Every interactive element (button, tap target, link, form field, toggle) must have an interaction spec. If a button exists and has no interaction spec, the wireframe is incomplete.

**States:** Empty, loading, and error states are mandatory for every screen that loads data. Do not skip them. "Same as populated state but with placeholder text" is not acceptable -- describe the actual empty/loading/error treatment.

**Open Questions:** Better to have too many than too few. Any assumption you made that Aaron might reasonably disagree with belongs in Open Questions.

## Device Context Rules

**Mobile-first screens** (`patient` app, mobile `care-coordinator` views):
- Specify touch targets (44px minimum)
- Describe bottom sheets instead of modals where appropriate
- Note swipe interactions when relevant
- Bottom tab bar is the primary nav
- Stack layout is default; two-column only when content warrants it

**Desktop screens** (`provider`, `kitchen`, `care-coordinator` main app):
- Sidebar is the primary nav (reference `layout-app-shell.html`)
- Data tables and multi-column layouts are standard
- No bottom tab bar
- Hover states are relevant; tap targets are not the constraint

**Responsive screens** (any app that must work on both):
- Define the breakpoint behavior explicitly: "Below `sm`: [mobile layout]. At `sm` and above: [desktop layout]."
- Do not leave responsive behavior unspecified.

## What This Skill Does NOT Do

- **Make UX decisions.** If the ux-architect IA says a feature lives in a certain tab, you implement that. If you think it's wrong, add it to Open Questions, don't redesign.
- **Evaluate usability.** That's ux-design-review. Write the spec; let the reviewer evaluate it.
- **Map to Haven components.** Use component vocabulary as labels. haven-mapper does the actual mapping.
- **Write production copy.** Exact strings for key UI moments (headings, primary CTAs, primary nav labels) are fine. Nuanced copy (error messages, empty states, instructional text) should be flagged for ux-design-review.

## Quality Checklist

Before marking a wireframe set complete and presenting Gate 2:

- [ ] Screen flow overview file produced
- [ ] Every screen from the IA phase has a wireframe file
- [ ] Every wireframe has all required sections (including empty/loading/error states)
- [ ] Every interactive element has an interaction spec
- [ ] Every component reference exists in `COMPONENT-INDEX.md` or is flagged as `[NEW COMPONENT: ...]`
- [ ] A `## New Components Flagged` section exists in any file that introduces new components
- [ ] No placeholder copy uses "Lorem ipsum" or generic phrases
- [ ] Bilingual section is present for all patient-facing screens
- [ ] Open Questions captures any assumption that Aaron might reasonably challenge

## Relationship to Other Skills

**Upstream:** ux-architect Phase 3 (IA) defines which screens to produce and their navigation context.
**Downstream:** ux-design-review (pre-build) evaluates these files. haven-mapper maps them to components.
