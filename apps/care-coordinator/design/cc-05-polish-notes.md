# cc-05 Polish Notes

Running list of small visual nits and design-decision questions surfaced
during cc-05 build + browser verification. Captured here so they don't
block slice progress, then resolved as a batch via `/design-review` after
Patch C ships and Maria flows end-to-end.

## How to use

- One line per nit. Date-stamp each entry.
- Tag scope: `[layout]`, `[type]`, `[color]`, `[spacing]`, `[copy]`, `[a11y]`, `[interaction]`.
- Note whether the call should route to a specific expert if obvious (e.g., `→ brand-fidelity`).
- Don't try to fix in-line — the point is to capture, not solve.

## Entry shape

```
- 2026-MM-DD [scope] short description of what's off → optional expert routing
```

Example:
```
- 2026-04-28 [spacing] section-status-bar gap between items feels tight at narrow widths → brand-fidelity
```

## Superseded by Patch E (Agentic Shell rebase, 2026-04-28)

Aaron identified that cc-05 is structurally on the wrong shell (`three-panel-shell`) and should sit on `agentic-shell` instead. Patch E in `~/.claude/plans/haven-ui-cc-care-plan-viewer-slice.md` rebases the page: chat → middle pane, care plan → right pane (`panel-content` + `content-header` + `content-body`), queue stays left as `panel-nav`. Most entries below will resolve, move, or become irrelevant after the rebase lands. Re-evaluate this list and run `/design-review` after Patch E ships.

## Open

- 2026-04-28 [layout] meal-delivery edit-mode inputs are too narrow for their values; widen toward the available viewport space, but respect the design's max-line-length rules so the inputs don't run edge-to-edge → brand-fidelity / design-system-steward
- 2026-04-28 [copy] edit-mode `alert-info` banner copy is too concise + too broad — it doesn't tell the coordinator which specific section is editable in this iteration (meal delivery only) or that the response thread will log the diff. Rewrite needed → ux-design-lead (copy)
- 2026-04-28 [a11y] section-header focus ring on the accordion is visually clipped by the parent overflow-y-auto container. Likely needs `outline-offset: -2px` or inset focus ring on `.accordion-header` → accessibility / design-system-steward
- 2026-04-28 [a11y] focus ring on list-group / kv-table rows in non-coordinator-pending sections sits only on the header band; clicking just "selects" the row without revealing what's actionable. Investigate whether non-coordinator section bodies should be `aria-readonly` and not focusable, and whether the visual focus treatment matches what a clickable row implies → accessibility
- 2026-04-28 [interaction] Undo bar appears even when Approve-with-edits had zero diff; debatable UX. Currently treated as "you can still undo the approval itself" which is technically correct — but coordinators may read it as "undo your edits" and find it confusing → ux-design-lead
- 2026-04-28 [layout] Undo bar visibility — Aaron didn't see it at first; sits between thread-message-list and thread-input. Consider whether it needs more prominence (toast-style at viewport edge) or current inline treatment is fine for the action-density of this surface → brand-fidelity
- 2026-04-28 [interaction] Accordion expand/collapse is instant — no animation. React-controlled state currently mounts/unmounts the body. Consider CSS height-transition or framer-motion for smoother feel; tradeoff is that animating mount/unmount needs a presence helper → brand-fidelity / design-system-steward
- 2026-04-28 [a11y] Focus ring on accordion items currently surrounds only the header (the click target). Aaron wants the ring to surround the entire accordion item to communicate "this whole row is the actionable unit." Likely needs a `:focus-within` rule on `.accordion-item` plus suppressing the inner button's default outline → accessibility / design-system-steward
- 2026-04-28 [spacing] Care plan accordions feel "tight" — internal header padding could grow, plus more vertical breathing room between items. Pattern-library default may be too compact for this content density → brand-fidelity / design-system-steward (PL-level fix would benefit other accordion consumers)

## Resolved

<!-- Move entries here when a polish-pass commit closes them.
     Format: original entry line + " → fixed in <commit-sha>" -->
