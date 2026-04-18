# Judgment Framework

## Decision: React Aria vs plain HTML

```
Is the element interactive (clickable, focusable, state-changing)?
├── Yes → Use React Aria primitive
│   └── Provides keyboard handling, ARIA roles, focus management out of the box
└── No (static text, decorative images, layout containers)
    └── Use semantic HTML (`<p>`, `<h2>`, `<section>`, `<img alt="">`)
```

Rule: every `onClick` handler on a non-button element is a bug. Replace with React Aria `Button` or `Link`.

## Priority order for accessibility remediation

Fix in this order — each level unblocks the next:

1. **Keyboard navigation** — Without this, keyboard-only users are completely locked out. Highest impact, affects every interactive element.
2. **Focus-visible styling** — Without visible focus, keyboard users can navigate but can't see where they are. Useless keyboard nav.
3. **ARIA roles and states** — Screen readers can now announce what elements are and what state they're in. Unlocks AT users.
4. **Screen reader labels** (`aria-label`, `aria-labelledby`) — Provides context that sighted users get visually. Completes the screen reader experience.
5. **Color contrast** — Affects the broadest user base (low vision, variable lighting) but is less binary than keyboard access — partial compliance still provides partial value.
6. **Touch targets** — Mobile/tablet users. Lower priority for admin app (primarily desktop).

## Tradeoff: information density vs accessibility

Healthcare users need dense interfaces (many patients, many data points visible). Accessibility requires adequate spacing, target sizes, and labeling.

Resolution — these are not opposed:
- Use `aria-describedby` to provide context that would otherwise require visual labels — keeps the UI dense while remaining screen-reader-complete
- Use `visually-hidden` text for additional context (e.g., "Approve care plan for Patient #1234") without consuming visual space
- Ensure 44px click targets via padding, not by increasing visual element size — a compact-looking button can still have a generous hit area
- For data tables: use `aria-label` on the table itself and `aria-sort` on headers instead of adding visible sort indicators that consume column width

## When to escalate vs decide autonomously

| Situation | Action |
|---|---|
| Standard WCAG pattern exists (WAI APG) | Apply it — no escalation needed |
| Two valid ARIA patterns for same component | Choose the simpler one, document in retro log |
| Accessibility fix changes visual design | Escalate to UX Design Lead — they own visual decisions |
| Accessibility fix requires new component in @ava/ui | Notify Platform/Infrastructure — they own the component library |
| Compliance requirement is ambiguous | Consult WCAG spec, then propose interpretation to Aaron |
| Fix degrades performance measurably | Escalate — tradeoff decision belongs to Aaron |
