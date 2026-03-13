# Cena Health Design Decisions Log

A chronological record of significant UX design decisions. Each entry captures what was decided, why, and what it affects. This is the institutional memory that prevents contradictory decisions as the platform evolves.

## How to Use This File

- After any significant design discussion, add an entry
- Reference decision IDs when they influence future work
- If a decision is reversed, don't delete it. Add a new entry that supersedes it with a link to the original.
- Group by application/module for easy scanning

---

## Decisions

### DD-001: Guided Flexibility over Strict Wizard

**Date:** 2025-02-11
**Application:** Kitchen Partner Portal
**Module:** Recipe Management

**Context:** Kitchen partners need to add weekly recipes. The TurboTax analogy suggests a wizard, but a locked-step wizard creates friction for users who know what they're doing and frustration when users need to go back.

**Decision:** Use a phased flow (Input > Review > Save) where phases are visually distinct but not rigidly locked. Users progress naturally through phases but can always access any part of the review workspace. The prompt bar persists throughout review so users can instruct the agent at any point.

**Rationale:** A strict wizard with step numbers and locked progression works for one-time forms (tax filing). Recipe management is a recurring task that users will get faster at over time. The flow should support both first-time guided use and experienced quick use.

**Alternatives considered:**
- Strict wizard (FP-001): Rejected because recipe entry is recurring and users will resent locked steps after the first few uses
- Fully open form: Rejected because first-time users need guidance and the agent processing step creates a natural two-phase flow

**Implications:**
- The review workspace needs to be self-explanatory without step indicators
- The prompt bar being persistent means the agent can help at any point, not just at the start
- Save button availability communicates progress better than a step indicator

**Related:** FP-005 (Agent-Assisted Input), UC-KP-RCP-001

---

### DD-002: Encourage but Don't Block on Data Quality

**Date:** 2025-02-11
**Application:** Kitchen Partner Portal
**Module:** Recipe Management

**Context:** Duplicate recipes and unconfirmed agent data reduce system reliability, but blocking kitchen partners from saving will cause frustration and abandonment.

**Decision:** Issues and unconfirmed fields generate warnings and are tracked, but do not prevent saving. The save action shows a clear summary of what's outstanding. Unresolved items persist as tasks the user can return to.

**Rationale:** These users are busy and this is not their primary job. If we block them, they'll work around us (or stop using the system). If we strongly encourage with clear, easy-to-resolve prompts, most users will fix most issues most of the time.

**Alternatives considered:**
- Hard blocks on unresolved issues: Rejected because it prioritizes data purity over user adoption
- No warnings at all: Rejected because it leads to data quality problems that affect care plan matching downstream

**Related:** DP-006 (Issue Resolution Queue), UC-KP-RCP-001

---

### DD-003: Agent-Populated Fields Use Track-Changes Model

**Date:** 2025-02-11
**Application:** Kitchen Partner Portal
**Module:** Recipe Management

**Context:** The agent will populate or calculate some nutrition fields. Nutrition data directly affects care plan matching, so we need the user to be accountable for the final values.

**Decision:** Agent-populated fields are visually distinct (icon + subtle highlight) and require per-field confirmation via a single click. This is lightweight enough to not feel burdensome but explicit enough to create accountability.

**Rationale:** Nutrition values are numbers, not prose. A quick visual scan + click to confirm is fast. With only 4 required fields per recipe, worst case is 4 clicks per card. It's less friction than "review the whole thing" because the user knows exactly what to look at. Creates a clear audit trail: every nutrition value is either user-provided or user-confirmed.

**Implications:**
- Need to track provenance of each field value (user-provided, agent-populated, agent-populated-and-confirmed)
- The confirmation UX must be fast (single click) or it becomes a bottleneck for 20-recipe batches
- Could extend this pattern to other agent-assisted workflows in the platform
- v1.1 enhancement: "Confirm all agent values" batch button for experienced users

**Related:** FP-005 (Agent-Assisted Input), UC-KP-RCP-001

---

## Index by Application

### Kitchen Partner Portal
- DD-001: Guided Flexibility over Strict Wizard
- DD-002: Encourage but Don't Block on Data Quality
- DD-003: Agent-Populated Fields Use Track-Changes Model

### Patient Portal
(none yet)

### Clinical Portal
(none yet)

### Admin Portal
(none yet)

### Cross-platform
(none yet)
