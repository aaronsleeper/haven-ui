# Task 05: Add Secondary Nav + User Dropdown to Queue Panel

## Scope
App only

## Task class
deterministic

## Model tier
sonnet

## Context
Per `shell-cc-coordinator.md`, below the queue sections, the queue panel has:
1. A `divider` separator
2. A `sidebar-nav-list` with three `sidebar-nav-item` links: Patients / Reports / Settings
3. A user menu pinned at the bottom: `avatar-sm` + name + `hs-dropdown` for "Sign out", "Profile", "Help"

These are static at v1 (no real routing or auth). The secondary nav uses existing `sidebar-nav-list` + `sidebar-nav-item` classes (confirmed in COMPONENT-INDEX under Layout > App Shell). The user dropdown uses `hs-dropdown` (Preline) per the exact pattern in CLAUDE.md + decisions-log.md.

## Prerequisites
- Task 02 must be complete (queue-sidebar shell in place)

## Files to Read First
- `apps/care-coordinator/src/App.tsx` — current queue panel markup after Task 02
- `packages/design-system/src/styles/tokens/components.css` — `.divider`, `.sidebar-nav-list`, `.sidebar-nav-item`, `.avatar-sm` class definitions
- `CLAUDE.md` — Dropdown markup section (exact Preline v4 dropdown pattern — mandatory reading before writing any dropdown)

## Instructions

### Step 1 — Add divider + secondary nav below queue sections

Inside `<div className="queue-sidebar-body">`, after the sections `filteredSections.map(...)` block, add:

```tsx
{/* Secondary nav */}
<div className="divider my-1" aria-hidden="true" />
<nav aria-label="Secondary navigation">
  <ul className="sidebar-nav-list">
    <li>
      <a href="/patients" className="sidebar-nav-item">
        <i className="fa-regular fa-users" aria-hidden="true" />
        <span>Patients</span>
      </a>
    </li>
    <li>
      <a href="/reports" className="sidebar-nav-item">
        <i className="fa-regular fa-chart-bar" aria-hidden="true" />
        <span>Reports</span>
      </a>
    </li>
    <li>
      <a href="/settings" className="sidebar-nav-item">
        <i className="fa-regular fa-gear" aria-hidden="true" />
        <span>Settings</span>
      </a>
    </li>
  </ul>
</nav>
```

### Step 2 — Add pinned user menu at the bottom of queue-sidebar

After the `queue-sidebar-body` closing tag, but still inside `<div className="queue-sidebar">`, add:

```tsx
{/* User menu — pinned bottom */}
<div className="mt-auto px-3 py-3 border-t border-sand-200 dark:border-sand-700">
  <div className="hs-dropdown relative flex items-center gap-2 w-full">
    <button
      type="button"
      className="hs-dropdown-toggle flex items-center gap-2 w-full text-left"
      aria-label="User menu"
    >
      <div className="avatar avatar-sm avatar-primary flex-shrink-0">
        <span>SK</span>
      </div>
      <span className="text-sm font-medium text-sand-900 dark:text-sand-100 truncate">Sarah K.</span>
      <i className="fa-solid fa-chevron-up text-xs text-sand-400 ms-auto" aria-hidden="true" />
    </button>
    <div className="hs-dropdown-menu" role="menu" aria-label="User options">
      <a className="hs-dropdown-item" href="/profile">
        <i className="fa-regular fa-user me-2" aria-hidden="true" />Profile
      </a>
      <a className="hs-dropdown-item" href="/help">
        <i className="fa-regular fa-circle-question me-2" aria-hidden="true" />Help
      </a>
      <div className="hs-dropdown-divider" role="separator" />
      <button type="button" className="hs-dropdown-item w-full text-left text-error-600 dark:text-error-400">
        <i className="fa-regular fa-arrow-right-from-bracket me-2" aria-hidden="true" />Sign out
      </button>
    </div>
  </div>
</div>
```

### Known Constraints (MANDATORY — from CLAUDE.md and decisions-log.md)

**Dropdown pattern (Preline v4):** Use exactly this structure — no extras:
- Wrapper: `hs-dropdown`
- Toggle: `hs-dropdown-toggle`
- Menu: `hs-dropdown-menu` (no `transition-[opacity,margin]`, no `hidden`, no `hs-dropdown-open:*`)
- Items: `hs-dropdown-item`

DO NOT add `transition-[opacity,margin] hs-dropdown-open:opacity-100 opacity-0 hidden` to the menu div. These are inert in Preline v4 and will break visibility.

**Avatar:** Use `avatar avatar-sm avatar-primary` with initials inside `<span>` — confirmed PL pattern.

**Sidebar mobile visibility rule:** The queue sidebar uses `queue-sidebar` classes, not `app-sidebar`. The sidebar-mobile-visibility rule (translate pattern) does not apply here — queue sidebar is always visible at desktop. No `@apply hidden` or `display: none` on the sidebar.

**Do NOT `@apply` a semantic class inside another semantic class** (decisions-log.md) — no CSS changes in this task.

**Do NOT add `style={{...}}`**.

**`sidebar-nav-item`** expects `<a>` or `<button>` with icon + text span pattern — per PL.

## Expected Result
The queue panel renders:
- A `divider` separator below the queue sections
- Three `sidebar-nav-item` links: Patients, Reports, Settings
- A pinned user menu at the bottom: avatar + "Sarah K." + dropdown with Profile, Help, Sign out

## Verification
- [ ] `divider` renders between queue sections and secondary nav
- [ ] Three `sidebar-nav-item` anchors present with correct FA Pro icons
- [ ] User menu renders at bottom of queue sidebar
- [ ] `hs-dropdown` / `hs-dropdown-toggle` / `hs-dropdown-menu` / `hs-dropdown-item` class pattern used exactly (per CLAUDE.md)
- [ ] No `hs-dropdown-open:*` variants on menu div
- [ ] No `hidden` class on menu div
- [ ] No `style={{...}}` added
- [ ] Preline dropdown opens/closes in browser when toggle is clicked
- [ ] FA Pro icons render (not emoji or Material icons)
- [ ] `pnpm typecheck` passes
- [ ] HTML classes are semantic — no utility chains on styled elements
- [ ] Dark mode variants — N/A (no new CSS classes)
- [ ] `_schema-notes.md` — not applicable

## Completion Report

```
## Completion Report — Task 05: Add Secondary Nav + User Dropdown to Queue Panel

- New semantic classes added to components.css: none
- Existing classes modified: none
- Pattern library files created or updated: none
- Judgment calls: none
- Dark mode added: not applicable
- Schema delta logged: not applicable
- Items deferred or incomplete: [list any, or "none"]
```

## If Something Goes Wrong
- If `hs-dropdown-menu` appears registered but invisible: check that `components.css` has `.hs-dropdown-menu { display: none; opacity: 0; }` and `.hs-dropdown-menu.block { display: block; opacity: 1; }`. These rules are already in the PL; if missing, read `components.css` for the dropdown section.
- If `sidebar-nav-item` hover state conflicts with the queue-sidebar background: read the `.sidebar-nav-item` definition and verify it's self-contained.
- If `avatar-primary` initials are not rendering: check that `avatar avatar-sm avatar-primary` are all three classes present — `avatar-primary` provides the background color, `avatar-sm` provides sizing.
