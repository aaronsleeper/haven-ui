# New Component: Mobile Bottom Nav

## Purpose
Fixed bottom tab bar for the four main sections of the patient app. Present on all post-onboarding screens. Supports an unread message badge on the Care Team tab.

## Used In
- MEALS-01 (Meals tab active)
- MEALS-02 (Delivery tab active)
- CARE-01 (Care Team tab active)
- CARE-02 (Care Team tab active)
- PROFILE-01 (Profile tab active)
- As a shared partial: `src/partials/patient-bottom-nav.html`

## Preline Base
None — pure Tailwind implementation.

## Proposed Semantic Classes
- `.mobile-bottom-nav` — fixed bar wrapper
- `.mobile-bottom-nav-tab` — individual tab item
- `.mobile-bottom-nav-tab.active` — active tab state
- `.mobile-bottom-nav-badge` — unread count badge on Care Team tab

## Implementation Notes

### HTML Structure
```html
<nav class="mobile-bottom-nav" aria-label="Main navigation">
  <a href="/apps/patient/meals/" class="mobile-bottom-nav-tab active" aria-current="page" aria-label="Meals">
    <i class="fa-solid fa-bowl-food"></i>
    <span data-i18n-en="Meals" data-i18n-es="Comidas">Meals</span>
  </a>
  <a href="/apps/patient/deliveries/" class="mobile-bottom-nav-tab" aria-label="Delivery">
    <i class="fa-solid fa-truck"></i>
    <span data-i18n-en="Delivery" data-i18n-es="Entrega">Delivery</span>
  </a>
  <a href="/apps/patient/care-team/messages.html" class="mobile-bottom-nav-tab" aria-label="Care Team, 2 unread messages">
    <span class="relative">
      <i class="fa-solid fa-comments"></i>
      <span class="mobile-bottom-nav-badge">2</span>
    </span>
    <span data-i18n-en="Care Team" data-i18n-es="Mi Equipo">Care Team</span>
  </a>
  <a href="/apps/patient/profile/" class="mobile-bottom-nav-tab" aria-label="Profile">
    <i class="fa-solid fa-circle-user"></i>
    <span data-i18n-en="Profile" data-i18n-es="Perfil">Profile</span>
  </a>
</nav>
```

### @apply Definition
```css
.mobile-bottom-nav {
  @apply fixed bottom-0 left-0 right-0 z-40 grid grid-cols-4 bg-white border-t border-gray-200 shadow-lg;
  max-width: 430px;
  margin-inline: auto;
  padding-bottom: env(safe-area-inset-bottom);
  @apply dark:bg-neutral-900 dark:border-neutral-700;
}

.mobile-bottom-nav-tab {
  @apply flex flex-col items-center justify-center gap-1 py-2 text-gray-400 text-xs font-medium;
  min-height: 64px;
  text-decoration: none;
  @apply hover:text-primary-600;
  @apply dark:text-neutral-500 dark:hover:text-primary-400;
}

.mobile-bottom-nav-tab i {
  @apply text-xl;
}

.mobile-bottom-nav-tab.active {
  @apply text-primary-600;
  @apply dark:text-primary-400;
}

.mobile-bottom-nav-badge {
  @apply absolute -top-1.5 -right-2.5 flex items-center justify-center;
  @apply bg-error-500 text-white text-[10px] font-bold rounded-full;
  min-width: 18px;
  height: 18px;
  padding: 0 3px;
  @apply dark:bg-error-600;
}
```

### Active Tab Convention
The partial is included once per page. The agent sets the `.active` class and `aria-current="page"` on the correct tab for each screen by copying the partial and modifying it, or by using a JS approach that reads the current URL path. For the prototype: copy-and-modify per screen.

### Badge Visibility
Badge is hidden when count is 0 — use `display: none` via a utility or inline style in the prototype. In production, Angular binding drives this.

### States
- Default: gray icon + label
- Active: primary-600 color, no background fill
- Hover: primary-600
- Badge: visible only when unread count > 0; shows "9+" when count > 9

### Dark Mode
As specified in `@apply` definitions above.

### Responsive Behavior
Nav is constrained to 430px matching the shell. On wider screens it stays within the visual shell.

### Accessibility
- `<nav aria-label="Main navigation">` wrapper
- `aria-current="page"` on active tab
- `aria-label` on each tab includes badge count when present: `aria-label="Care Team, 2 unread messages"`
- Icon + text label on every tab — never icon alone
- Touch targets: 64px height exceeds 44px WCAG minimum

## Pattern Library
[ ] Component file needed: `pattern-library/components/layout-mobile-bottom-nav.html`
[ ] `COMPONENT-INDEX.md` row needed

## Priority
Required for launch
