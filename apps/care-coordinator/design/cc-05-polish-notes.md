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

## Open

<!-- Add nits here as they're spotted. -->

## Resolved

<!-- Move entries here when a polish-pass commit closes them.
     Format: original entry line + " → fixed in <commit-sha>" -->
