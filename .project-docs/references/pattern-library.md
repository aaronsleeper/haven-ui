# Cena Health UI Pattern Library

A living catalog of UI patterns approved for use across Cena Health applications. Each pattern documents when to use it, how it behaves, and where it's already been applied.

## How to Use This File

- Before designing a new screen, scan this library for applicable patterns
- When introducing a new pattern, add it here with rationale
- When reusing a pattern in a new context, add that context to its "Applied in" list
- Patterns should be described behaviorally (what they do), not visually (what they look like)

---

## Navigation Patterns

### NP-001: Role-Based Landing
**What:** After login, route users to a landing page optimized for their role. Patients see their dashboard. Dietitians see their patient panel. Coordinators see their task queue.
**Why:** Eliminates navigation decisions at the highest-traffic moment. Reduces time to first useful action.
**Constraints:** Each role's landing must be reachable in 1 click from any other page via persistent navigation.
**Applied in:** (none yet)

### NP-002: Persistent Section Navigation
**What:** Top-level navigation remains visible and accessible from all pages within the application. Shows current location clearly.
**Why:** Users should always know where they are and be able to get to major sections without backtracking.
**Constraints:** Mobile: use bottom tab bar (5 items max). Desktop: use sidebar or top nav. Highlight active section.
**Applied in:** (none yet)

### NP-003: Breadcrumb Trail
**What:** For pages deeper than 2 levels, show the path from the section root to the current page. Each segment is clickable.
**Why:** Supports wayfinding in deep hierarchies. Especially important for clinical users navigating patient records.
**Constraints:** Don't use for flat navigation structures. Keep labels short.
**Applied in:** (none yet)

---

## Data Display Patterns

### DP-001: Overview-Then-Detail (Master/Detail)
**What:** Show a scannable list or grid of items. Selecting an item reveals its full detail in a panel, overlay, or new page.
**Why:** Core pattern for any list-based workflow (patient panels, meal plans, task queues). Lets users scan quickly and drill down intentionally.
**Constraints:** List view should show enough info to decide whether to drill down (2-3 key attributes). Detail view should not require scrolling for primary info.
**Applied in:** (none yet)

### DP-002: Status-at-a-Glance Cards
**What:** Compact cards showing entity status using color-coded indicators, key metrics, and a primary action. Used in dashboards and overview pages.
**Why:** Enables rapid scanning across many items. Color and position communicate status before reading text.
**Constraints:** Max 3-4 data points per card. Status colors must be supplemented with icons/labels for colorblind users. Touch target for primary action must be 44px+.
**Applied in:** (none yet)

### DP-003: Exception-Based Alerts
**What:** Instead of showing all items equally, highlight items that need attention. Normal-state items are visually subdued. Exception items are visually elevated with clear reason and action.
**Why:** For dietitians managing 50+ patients, the question is always "who needs me right now?" Not "show me everything."
**Constraints:** Define clear thresholds for what constitutes an exception. Avoid alert fatigue by limiting to genuinely actionable items.
**Applied in:** Kitchen Partner > Recipe Management (Issues Panel for duplicates and missing data)

### DP-004: Contextual Data Grouping
**What:** Group related data fields visually using whitespace, borders, or subtle background color. Label each group with a clear heading.
**Why:** Reduces cognitive load by chunking information. Users can skip groups that aren't relevant to their current task.
**Constraints:** Max 5-7 groups per page. Groups should map to the user's mental model, not the database schema.
**Applied in:** Kitchen Partner > Recipe Management (recipe card field groups: Identity, Nutrition, Tags)

### DP-005: Timeline / Activity Feed
**What:** Chronological list of events, actions, or changes related to an entity (patient, meal plan, etc.). Most recent at top.
**Why:** Provides narrative context. "What happened with this patient?" is answerable at a glance.
**Constraints:** Filter by event type. Limit initial display to recent events with "show more" for history. Include who, what, when for each entry.
**Applied in:** (none yet)

### DP-006: Issue Resolution Queue
**What:** A collapsible panel showing a list of issues that need user attention, each linking to the relevant content. Issues are automatically marked resolved when the user takes action. Unresolved issues generate warnings but do not block progress.
**Why:** Strongly encourages data quality without preventing forward progress. Flag problems, make them easy to fix, let the user decide when they're done.
**Constraints:**
- Issues auto-resolve when user takes action (no manual checkbox)
- Unresolved issues show count badge and warning at save time
- Each issue links directly to the relevant content (click to scroll/highlight)
- Issues can be dismissed ("not an issue") which counts as resolution
- Support multiple issue types: duplicates, missing required data, agent confidence warnings
**Applied in:** Kitchen Partner > Recipe Management (duplicate detection, missing nutrition data)

---

## Input & Form Patterns

### FP-001: Stepped Form (Wizard)
**What:** Break a complex form into sequential steps. Show one step at a time with a progress indicator. Allow back navigation.
**Why:** Core progressive disclosure pattern. Reduces cognitive load for complex data entry (patient intake, meal plan creation).
**Constraints:** Max 5-7 steps. Each step should be completable in under 2 minutes. Show summary/review before final submission. Allow saving mid-flow.
**Applied in:** (none yet)

### FP-002: Inline Editing
**What:** Allow editing of displayed data in-place, without navigating to a separate edit screen. Click/tap to activate edit mode on a field or section.
**Why:** Faster for small changes. Maintains context. Good for expert users making frequent adjustments.
**Constraints:** Clear visual distinction between view and edit modes. Save/cancel controls visible when editing. Auto-save or explicit save depending on data criticality.
**Applied in:** Kitchen Partner > Recipe Management (all parsed fields on recipe cards)

### FP-003: Smart Defaults
**What:** Pre-populate form fields with the most likely values based on user history, role, or context.
**Why:** Reduces input effort. Reduces errors. Especially valuable for clinical users doing repetitive documentation.
**Constraints:** Defaults must be clearly visible and easily overridden. Never silently submit a default without user confirmation for clinical data.
**Applied in:** Kitchen Partner > Recipe Management (agent-populated nutrition values)

### FP-004: Constrained Selection
**What:** Use selectors (dropdowns, radio buttons, toggles) instead of free-text input wherever possible.
**Why:** Prevents invalid input. Reduces typing effort (especially on mobile). Ensures data consistency for analytics.
**Constraints:** Provide search/filter for long option lists (10+ items). Include "Other" with free-text only when the set is genuinely open-ended.
**Applied in:** (none yet)

### FP-005: Agent-Assisted Input
**What:** A two-phase input pattern where the user provides unstructured content, an AI agent parses it into structured fields, and the user reviews/edits the result. The agent's contributions are visually distinguished from user-provided data and require explicit approval for high-stakes fields.
**Why:** Bridges the gap between what users know (unstructured) and what the system needs (structured). Eliminates multi-field form fatigue for batch data entry.
**Constraints:**
- Agent-populated fields must be visually distinct (icon + subtle background, not color-only)
- Required fields populated by the agent need explicit user confirmation before save
- A persistent prompt area allows the user to instruct the agent for corrections without manually editing every field
- Processing state must be clearly communicated
**Applied in:** Kitchen Partner > Recipe Management (text-to-structured recipe parsing)

---

## Communication Patterns

### CP-001: Contextual Help Tooltip
**What:** Small info icon next to complex fields or labels. On hover/tap, shows a brief explanation.
**Why:** Provides help at the point of need without cluttering the interface.
**Constraints:** Keep tooltip text under 2 sentences. For longer explanations, link to a help article. Don't use for essential information (that should be visible by default).
**Applied in:** Kitchen Partner > Recipe Management (nutrition field explanations)

### CP-002: Empty State with Guidance
**What:** When a section has no data yet, show a helpful message explaining what will appear here and how to get started.
**Why:** Prevents confusion and abandonment. Turns a potentially negative moment ("nothing here") into a coaching moment.
**Constraints:** Include a clear call-to-action. Keep tone warm and encouraging, not clinical.
**Applied in:** Kitchen Partner > Recipe Management (empty recipe list)

### CP-003: Confirmation with Context
**What:** Before completing significant actions (submitting a plan, marking a delivery, closing a case), show a summary of what will happen and ask for confirmation.
**Why:** Error prevention for high-stakes actions. Builds user confidence.
**Constraints:** Show the key details that changed, not the entire form. Use plain language. Allow easy cancellation.
**Applied in:** Kitchen Partner > Recipe Management (save batch confirmation)

### CP-004: Status Messaging
**What:** After an action, show a clear, temporary message confirming success or explaining failure. Use appropriate tone and color.
**Why:** Feedback loop closure. Users need to know their action worked.
**Constraints:** Success messages auto-dismiss after 3-5 seconds. Error messages persist until dismissed. Include recovery guidance for errors.
**Applied in:** Kitchen Partner > Recipe Management (save success/error)

---

## Patient-Specific Patterns

### PP-001: Voice-First Interaction
**What:** For patient-facing features, design the voice interaction (AVA) as the primary interface, with screen UI as the visual companion/fallback.
**Why:** Many patients prefer voice interaction due to literacy, vision, or comfort levels. AVA is a core differentiator.
**Constraints:** Screen must show what AVA is saying/doing. Visual fallback must be fully functional without voice. Support interruption and correction.
**Applied in:** (none yet)

### PP-002: Simplified Patient View
**What:** Patient-facing screens use larger text, fewer options, more whitespace, and warmer visual language than clinical-facing screens.
**Why:** Patients are not power users. They need clarity, confidence, and warmth over density and efficiency.
**Constraints:** Touch targets 48px+ (above WCAG minimum). Max 3 actions per screen. Primary action visually dominant. Reading level 5th grade or below.
**Applied in:** (none yet)

### PP-003: Cultural Meal Display
**What:** Show meals with culturally accurate names, descriptions, and imagery. Group by cultural cuisine when browsing. Support dietary preferences within cultural context.
**Why:** Cultural competency in food is a core Cena Health differentiator. Generic "healthy meal" displays undermine trust and adherence.
**Constraints:** Meal names in both English and Spanish where applicable. No "healthy vs. unhealthy" framing. Show familiar foods as the default, not as alternatives.
**Applied in:** (none yet)

---

## Changelog

| Date | Pattern | Change | Rationale |
|------|---------|--------|-----------|
| (initial) | All | Created initial pattern library | Baseline patterns for VozCare MVP |
| 2025-02-11 | FP-005 | Added Agent-Assisted Input pattern | Kitchen Partner recipe management requires unstructured-to-structured parsing |
| 2025-02-11 | DP-006 | Added Issue Resolution Queue pattern | Recipe duplicate detection needs non-blocking quality enforcement |
| 2025-02-11 | Multiple | Updated "Applied in" for DP-003, DP-004, FP-002, FP-003, CP-001, CP-002, CP-003, CP-004 | Kitchen Partner recipe management feature |
