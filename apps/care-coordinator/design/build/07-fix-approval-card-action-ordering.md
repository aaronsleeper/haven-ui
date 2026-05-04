# Task 07: Fix Approval Card Action Ordering (NN/G Dangerous-UX)

## Scope
App only

## Task class
deterministic

## Model tier
haiku

## Context
The approval card action buttons must render in the order `[Approve][Edit first][Reassign][Reject]` with Reject rightmost and separated by a 16px gap — per the locked decision from Gate 2-review. This is the NN/G "Dangerous UX" fix: Reject (consequential) must be physically separated from Approve (happy path) so accidental tap-buddying is blocked.

Additionally, `thread-msg-tool` rows must default-collapsed via `data-hs-collapse` — verify this is implemented and add it if missing.

## Prerequisites
- Task 01 must be complete

## Files to Read First
- `apps/care-coordinator/src/components/thread/ThreadMessageList.tsx` — find where approval card action buttons render; read the full approval card section
- `apps/care-coordinator/design/wireframes/cc-01-queue-with-care-plan-approval.md` — "Actions row" spec in the approval card section
- `packages/design-system/pattern-library/COMPONENT-INDEX.md` — Thread Approval Card row; `thread-approval-actions` class

## Instructions

### Step 1 — Read ThreadMessageList.tsx

Open `apps/care-coordinator/src/components/thread/ThreadMessageList.tsx`. Find the section that renders the `thread-approval-actions` row — the four action buttons.

Identify the current button order. Per the wireframe, the locked order is:
1. "Approve" — `btn-primary btn-sm`
2. "Edit first" — `btn-outline btn-sm`
3. "Reassign" — `btn-ghost btn-sm`
4. "Reject" — `btn-outline btn-sm` (rightmost, 16px gap before it)

### Step 2 — Reorder buttons if not already correct

If the buttons are not in `[Approve][Edit first][Reassign][Reject]` order, reorder them.

The 16px gap before Reject is implemented by adding `ms-4` (Tailwind utility for `margin-inline-start: 1rem = 16px`) to the Reject button element:

```tsx
<button
  type="button"
  className="btn-outline btn-sm ms-4"
  onClick={() => onAction(msg.id, 'reject')}
>
  Reject
</button>
```

`ms-4` is a layout-only utility — acceptable per CLAUDE.md.

### Step 3 — Verify thread-msg-tool default-collapsed

In `ThreadMessageList.tsx`, find where `thread-msg-tool` messages render. Check whether the expandable content uses `data-hs-collapse` properly.

Per the wireframe (`cc-01`): tool-call thread events default-collapsed — coordinator sees the collapsed toggle label; must click to expand.

The pattern per PL (`thread-msg-tool.html`):
```html
<button class="thread-msg-tool-toggle" data-hs-collapse="#tool-detail-1" aria-expanded="false">
  ... tool name
</button>
<div id="tool-detail-1" class="collapse-content hidden">
  ... detail
</div>
```

Key: the detail div must have `hidden` as an HTML attribute (not a CSS class) to be collapsed by default, per Preline's `HSCollapse` API.

If the toggle uses `data-hs-collapse` but the content is not `hidden` by default: add the `hidden` attribute to the detail div.

If `data-hs-collapse` is not being used at all and the component uses React state instead: leave the React state approach but verify it renders collapsed by default (`isExpanded` defaults to `false`).

### Step 4 — Verify reject note renders correctly

When Reject is clicked, `thread-approval-note` expands (per existing `rejectIntentId` logic in `App.tsx`). Verify:
- The note `<textarea>` has `aria-required="true"`
- There is a `<label className="sr-only">` with text "Reason for rejection (required)"
- The note placeholder text: "Tell the team what needs to change…"
- "Send reject" button is `btn-danger btn-sm`
- "Cancel" button is `btn-ghost btn-sm`

If any of these are wrong, patch them. Copy is locked from `review-notes.md`.

### Known Constraints
- Locked action ordering (Gate 2 decision): `[Approve][Edit first][Reassign][Reject]` — do NOT deviate.
- 16px gap before Reject: use `ms-4` utility (layout-only, acceptable).
- Reject is `btn-outline btn-sm` NOT `btn-danger` — Reject button itself is neutral; the confirmation step uses `btn-danger`.
- `aria-required="true"` on reject textarea per wireframe accessibility notes.
- Do NOT add `style={{...}}`.

## Expected Result
- Approval card renders buttons in order: Approve → Edit first → Reassign → Reject
- Reject button has 16px left margin gap
- `thread-msg-tool` rows are collapsed by default
- Reject note renders correctly with sr-only label, correct placeholder, correct button classes

## Verification
- [ ] Button order: Approve first, Reject last
- [ ] Reject button has `ms-4` class (or equivalent 16px margin)
- [ ] `thread-msg-tool` collapse content has `hidden` attribute (or React state defaults to collapsed)
- [ ] Reject note `<textarea>` has `aria-required="true"`
- [ ] Reject note has `<label className="sr-only">` with "Reason for rejection (required)"
- [ ] Reject note placeholder: "Tell the team what needs to change…"
- [ ] "Send reject" uses `btn-danger btn-sm`
- [ ] "Cancel" uses `btn-ghost btn-sm`
- [ ] No `style={{...}}` added
- [ ] `pnpm typecheck` passes
- [ ] HTML classes are semantic — no utility chains on styled elements (ms-4 on Reject is layout-only OK)
- [ ] Dark mode — N/A (no CSS changes)
- [ ] `_schema-notes.md` — not applicable

## Completion Report

```
## Completion Report — Task 07: Fix Approval Card Action Ordering

- New semantic classes added to components.css: none
- Existing classes modified: none
- Pattern library files created or updated: none
- Judgment calls: none
- Dark mode added: not applicable
- Schema delta logged: not applicable
- Items deferred or incomplete: [list any, or "none"]
- Button order before: [list old order]
- Button order after: [Approve][Edit first][Reassign][Reject]
- tool-call collapse mechanism: [data-hs-collapse / React state]
```

## If Something Goes Wrong
- If `ThreadMessageList.tsx` renders approval card actions via a sub-component: read that sub-component file and patch there. Do not re-render both.
- If the `btn-ghost` class is not rendering the Reassign button correctly: read `components.css` for `.btn-ghost` definition — it's a confirmed PL class.
- If Preline's `HSCollapse` is not finding the collapse targets (IDs don't match): ensure the `data-hs-collapse` value on the toggle exactly matches the `id` attribute on the content div.
