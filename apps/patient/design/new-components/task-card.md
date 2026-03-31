# New Component: Task Card

## Purpose
Tappable card representing a single outstanding task. Used in the dashboard Tasks section (top 3) and the full task list page. Designed to accommodate any task type — assessments in v1, future: measurements, appointments, documentation, meal orders.

## Used In
- Dashboard tasks section: top 3 outstanding tasks
- tasks-01 (full task list): all outstanding + completed tasks

## Preline Base
Pure Tailwind implementation. No Preline JS needed.

## Proposed Semantic Classes

### `.task-card`
Full-width tappable card. Horizontal layout: icon → content → chevron.

### `.task-card-icon`
Left-side container for the type avatar.

### `.task-card-content`
Center column: task name + metadata line.

### `.task-card-name`
Task title text.

### `.task-card-meta`
Metadata line: time estimate, due date, status.

### `.task-card-overdue`
Modifier on `.task-card`: adds left accent border in warning color + overdue badge.

### `.task-card-in-progress`
Modifier on `.task-card`: adds left accent border in teal.

### `.task-card-completed`
Modifier on `.task-card`: muted opacity + check icon replaces chevron.

## Implementation Notes

### HTML Structure
```html
<a href="/apps/patient/health/assessment.html?id=phq-2" class="task-card">
  <div class="task-card-icon">
    <span class="avatar avatar-sm avatar-primary">
      <i class="fa-solid fa-brain"></i>
    </span>
  </div>
  <div class="task-card-content">
    <p class="task-card-name" data-i18n-en="How have you been feeling?" data-i18n-es="¿Cómo se ha sentido?">How have you been feeling?</p>
    <p class="task-card-meta" data-i18n-en="About 2 min" data-i18n-es="Aprox. 2 min">About 2 min</p>
  </div>
  <i class="fa-solid fa-chevron-right text-sand-300"></i>
</a>
```

**Overdue variant:**
```html
<a href="..." class="task-card task-card-overdue">
  <div class="task-card-icon">...</div>
  <div class="task-card-content">
    <p class="task-card-name">...</p>
    <p class="task-card-meta">
      <span class="badge badge-warning badge-sm" data-i18n-en="Overdue" data-i18n-es="Atrasado">Overdue</span>
      · About 2 min
    </p>
  </div>
  <i class="fa-solid fa-chevron-right text-sand-300"></i>
</a>
```

**Completed variant:**
```html
<div class="task-card task-card-completed">
  <div class="task-card-icon">...</div>
  <div class="task-card-content">
    <p class="task-card-name">...</p>
    <p class="task-card-meta">Completed Mar 28</p>
  </div>
  <i class="fa-solid fa-circle-check text-success-500"></i>
</div>
```

### @apply Definition
```css
.task-card {
  @apply flex items-center gap-3 p-3 bg-white border border-sand-200 rounded-xl;
  @apply hover:border-sand-300 hover:shadow-2xs;
  @apply dark:bg-neutral-800 dark:border-neutral-700 dark:hover:border-neutral-600;
  text-decoration: none;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.task-card-icon {
  @apply flex-shrink-0;
}

.task-card-content {
  @apply flex-1 min-w-0;
}

.task-card-name {
  @apply text-sm font-medium text-gray-900 truncate;
  @apply dark:text-neutral-100;
}

.task-card-meta {
  @apply text-xs text-sand-400 mt-0.5;
  @apply dark:text-neutral-500;
}

.task-card-overdue {
  @apply border-l-4 border-l-warning-500;
}

.task-card-in-progress {
  @apply border-l-4 border-l-teal-500;
}

.task-card-completed {
  @apply opacity-60;
  cursor: default;
}

.task-card-completed:hover {
  @apply border-sand-200 shadow-none;
}
```

### States
- Default: white bg, sand border, pointer cursor
- Hover: slightly darker border, subtle shadow
- Overdue: warning-colored left accent border
- In-progress: teal left accent border
- Completed: reduced opacity, no hover effect, no link behavior

### Dark Mode
- Background: `dark:bg-neutral-800`
- Border: `dark:border-neutral-700`
- Text: `dark:text-neutral-100` (name), `dark:text-neutral-500` (meta)
- Hover: `dark:hover:border-neutral-600`
- Overdue accent preserved (warning color has dark mode built in)

### Responsive Behavior
Full-width card on all breakpoints. No responsive changes needed.

### Accessibility
- Use `<a>` for active tasks (navigable), `<div>` for completed (non-interactive)
- `aria-label` on the `<a>` with full task description: "Complete assessment: How have you been feeling?, about 2 minutes"
- Overdue status communicated via badge text, not color alone
- Minimum height from padding ensures 44px+ touch target

## Pattern Library
- [ ] Component file needed: `pattern-library/components/patient-task-card.html`
- [ ] `COMPONENT-INDEX.md` row needed

## Priority
Required for launch.
