# Task 04: Three-Panel Shell Layout

## Scope
App only (composing existing patterns + new components from tasks 01-03)

## Context
Creates the Admin App three-panel layout: queue sidebar (left 240px), center content (flex-grow), thread panel (right 380px). This is a utility layout — no new semantic classes needed. The shell is the container that all other care coordinator screens render inside.

## Prerequisites
- Tasks 01, 02, 03 must be complete (pattern library components exist)

## Files to Read First
- `apps/care-coordinator/design/wireframes/cc-shell-layout.md` — layout spec
- `apps/care-coordinator/index.html` — current state (minimal placeholder)
- `src/partials/head.html` — standard head partial
- `src/partials/scripts.html` — standard scripts partial
- `pattern-library/components/layout-app-shell.html` — reference for sidebar patterns

## Instructions

### Step 1: Build the shell HTML

Replace `apps/care-coordinator/index.html` with a three-panel layout. Use the standard Haven head/scripts partials.

**Layout structure (utility classes — these are one-off layout, not reusable components):**

```html
<body class="bg-gray-50 dark:bg-neutral-900">
  <div class="flex h-screen overflow-hidden">

    <!-- LEFT PANEL: Queue Sidebar -->
    <aside class="w-60 shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden dark:bg-neutral-900 dark:border-neutral-800"
           role="complementary" aria-label="Queue sidebar">
      <!-- Sidebar header -->
      <div class="px-4 py-3 border-b border-gray-100 dark:border-neutral-800">
        <div class="flex items-center gap-2">
          <img src="/src/assets/images/logo-cenahealth-teal.svg" class="size-6" alt="Cena Health">
          <span class="text-sm font-semibold text-gray-900 dark:text-white">Ava</span>
        </div>
      </div>

      <!-- Queue content (scrollable) -->
      <div class="flex-1 overflow-y-auto">
        <!-- Queue summary bar, filter pills, urgency sections go here (Task 05) -->
        <div class="p-4 text-center">
          <p class="text-xs text-gray-400">Queue loads here</p>
        </div>
      </div>

      <!-- Sidebar navigation (bottom) -->
      <nav class="border-t border-gray-100 dark:border-neutral-800">
        <ul class="sidebar-nav-list py-2 px-3">
          <li><a class="sidebar-nav-item active" href="#"><i class="fa-solid fa-inbox fa-fw"></i> Queue</a></li>
          <li><a class="sidebar-nav-item" href="#"><i class="fa-solid fa-users fa-fw"></i> Patients</a></li>
          <li><a class="sidebar-nav-item" href="#"><i class="fa-solid fa-chart-line fa-fw"></i> Reports</a></li>
          <li><a class="sidebar-nav-item" href="#"><i class="fa-solid fa-gear fa-fw"></i> Settings</a></li>
        </ul>
      </nav>
    </aside>

    <!-- CENTER PANEL: Content -->
    <main class="flex-1 min-w-0 overflow-y-auto bg-gray-50 dark:bg-neutral-950"
          role="main" aria-label="Main content">
      <!-- Morning summary or record viewer goes here (Task 07) -->
      <div class="p-6">
        <p class="text-sm text-gray-400">Center panel loads here</p>
      </div>
    </main>

    <!-- RIGHT PANEL: Thread -->
    <aside class="w-[380px] shrink-0 bg-white border-l border-gray-200 flex flex-col overflow-hidden dark:bg-neutral-900 dark:border-neutral-800"
           role="complementary" aria-label="Activity thread">
      <!-- Thread header -->
      <div class="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 dark:border-neutral-700">
        <span class="text-sm font-semibold text-gray-900 dark:text-white">Thread</span>
      </div>

      <!-- Thread messages (scrollable) -->
      <div class="flex-1 overflow-y-auto">
        <!-- Thread messages go here (Task 06) -->
        <div class="empty-state py-12">
          <div class="empty-state-icon">
            <i class="fa-solid fa-messages"></i>
          </div>
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Select an item to see its thread</p>
          <p class="text-xs text-gray-500 dark:text-gray-500">Click a queue item or patient to view their activity.</p>
        </div>
      </div>

      <!-- Thread input (fixed at bottom) -->
      <div class="border-t border-gray-200 p-3 dark:border-neutral-700">
        <div class="prompt-input-container">
          <textarea class="prompt-textarea" rows="1" placeholder="Message care team or ask the agent..."></textarea>
          <div class="prompt-toolbar">
            <button class="btn-icon btn-icon-primary"><i class="fa-solid fa-paper-plane"></i></button>
          </div>
        </div>
      </div>
    </aside>

  </div>
</body>
```

**Notes:**
- `w-60` = 240px (Tailwind's spacing scale: 60 = 15rem = 240px)
- The left panel uses `flex flex-col` so the nav stays at the bottom
- The right panel uses `flex flex-col` so the input stays at the bottom
- Empty state and prompt input use existing Haven components

### Step 2: Include standard partials

Use the standard Haven partials for `<head>` and scripts:
- `<!--# include file="/src/partials/head.html" -->` (or however Haven includes partials — check existing app pages for the include syntax)
- Scripts partial at bottom of body

**Check `apps/patient/index.html`** for the exact include syntax Haven uses (likely `load="/src/partials/head.html"` with vite-plugin-html-inject).

## Expected Result
- `apps/care-coordinator/index.html` renders a three-panel layout
- Left sidebar: logo, placeholder content area, bottom navigation
- Center: placeholder content
- Right: thread header, empty state, input field
- All three panels scroll independently

## Verification
- [ ] Page renders at http://localhost:5173/apps/care-coordinator/index.html
- [ ] Three panels visible side by side
- [ ] Left panel is ~240px, right panel is ~380px, center fills remaining space
- [ ] Each panel scrolls independently
- [ ] Sidebar nav items use `.sidebar-nav-item` semantic class
- [ ] Thread empty state uses `.empty-state` semantic class
- [ ] Thread input uses `.prompt-input-container` semantic class
- [ ] Dark mode: panels have appropriate dark backgrounds
- [ ] HTML classes are semantic for styled elements; utility classes only for layout
- [ ] ANDREY-README.md updated: not applicable (shell is layout, not a component)
- [ ] `src/data/_schema-notes.md`: not applicable

## If Something Goes Wrong
- If `w-60` doesn't produce 240px, check Tailwind v4's spacing scale. May need `w-[240px]` as arbitrary value.
- If partials don't include correctly, check `vite.config.js` for the plugin syntax. The include may use `<load src="...">` tags per vite-plugin-html-inject.
- If panels don't stay side by side, ensure the outer container has `overflow-hidden` to prevent body scroll.
