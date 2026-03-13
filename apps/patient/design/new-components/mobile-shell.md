# New Component: Mobile Shell

## Purpose
Base layout wrapper for all patient app screens. Constrains width to mobile viewport, disables desktop ambient blobs, sets a clean white background. Applied via a `mobile-app` class on `<body>` and a `mobile-shell` wrapper div.

## Used In
- All 10 patient app screens

## Preline Base
None — pure Tailwind implementation.

## Proposed Semantic Classes
- `.mobile-app` — on `<body>`, disables blobs, sets white bg
- `.mobile-shell` — inner centering wrapper, max-width 430px

## Implementation Notes

### HTML Structure
```html
<body class="mobile-app">
  <div class="mobile-shell">
    <!-- i18n bar, screen content -->
  </div>
</body>
```

### @apply Definition
```css
.mobile-app {
  @apply bg-white;
  /* Override desktop body blobs */
}

.mobile-app::before,
.mobile-app::after {
  display: none !important;
}

.mobile-shell {
  @apply block w-full max-w-[430px] mx-auto min-h-dvh bg-white relative;
}
```

### States
- Default: white background, full viewport height, centered at max 430px

### Dark Mode
- `.mobile-app`: `dark:bg-neutral-900`
- `.mobile-shell`: `dark:bg-neutral-900`

### Responsive Behavior
On screens wider than 430px, the shell centers with white background. Body background uses `bg-gray-100` via utility on the prototype to show the centered shell clearly.

### Accessibility
No specific ARIA requirements — structural only.

## Pattern Library
[ ] Component file needed: `pattern-library/components/layout-mobile-shell.html`
[ ] `COMPONENT-INDEX.md` row needed

## Priority
Required for launch
