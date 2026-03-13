# New Component: Delivery Status Card

## Purpose
Large-format card showing delivery status with a centered icon, status label, timing text, and a meal summary. Supports three status states: Preparing, Out for delivery, Delivered.

## Used In
- MEALS-02: primary status display

## Preline Base
None.

## Proposed Semantic Classes
- `.delivery-status-card` — outer card
- `.delivery-status-icon` — large centered icon
- `.delivery-status-label` — status text below icon
- `.delivery-status-timing` — timing detail below label
- `.delivery-summary` — divider + meal summary section

## Implementation Notes

### HTML Structure
```html
<div class="delivery-status-card">
  <div class="delivery-status-top">
    <i class="fa-solid fa-kitchen-set delivery-status-icon text-warning-500"></i>
    <p class="delivery-status-label" data-i18n-en="Getting your meals ready" data-i18n-es="Preparando tus comidas">Getting your meals ready</p>
    <p class="delivery-status-timing" data-i18n-en="Arriving between 10am – 2pm" data-i18n-es="Llega entre 10am – 2pm">Arriving between 10am – 2pm</p>
  </div>
  <hr class="delivery-status-divider">
  <div class="delivery-summary">
    <p class="delivery-summary-label" data-i18n-en="What's coming" data-i18n-es="Qué viene">What's coming</p>
    <p class="delivery-summary-count" data-i18n-en="5 meals" data-i18n-es="5 comidas">5 meals</p>
    <ul class="delivery-summary-list">
      <li>Chicken Verde</li>
      <li>Black Bean Tacos</li>
      <li>Lemon Herb Salmon</li>
    </ul>
    <a href="/apps/patient/meals/" class="text-link text-sm" data-i18n-en="See all meals" data-i18n-es="Ver todas las comidas">See all meals</a>
  </div>
</div>
```

### State Variants (applied by JS reading URLSearchParams)
| State | Icon class | Icon color | Label (EN) |
|-------|-----------|------------|------------|
| Preparing (default) | `fa-kitchen-set` | `text-warning-500` | "Getting your meals ready" |
| Delivering | `fa-truck` | `text-primary-500` | "On the way" |
| Delivered | `fa-circle-check` | `text-success-500` | "Delivered" |

Delivered state: timing text shows "Delivered at 11:43am" instead of arrival window.

### @apply Definition
```css
.delivery-status-card {
  @apply card mx-4;
}

.delivery-status-top {
  @apply flex flex-col items-center text-center p-6 gap-2;
}

.delivery-status-icon {
  @apply text-5xl mb-1;
}

.delivery-status-label {
  @apply text-xl font-semibold text-gray-900;
  font-family: var(--font-serif);
  @apply dark:text-neutral-100;
}

.delivery-status-timing {
  @apply text-sm text-gray-500;
  @apply dark:text-neutral-400;
}

.delivery-status-divider {
  @apply border-t border-gray-200 mx-4;
  @apply dark:border-neutral-700;
}

.delivery-summary {
  @apply p-4 flex flex-col gap-1;
}

.delivery-summary-label {
  @apply text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1;
  @apply dark:text-neutral-400;
}

.delivery-summary-count {
  @apply text-sm font-medium text-gray-900;
  @apply dark:text-neutral-100;
}

.delivery-summary-list {
  @apply text-sm text-gray-600 space-y-0.5 list-none pl-0;
  @apply dark:text-neutral-400;
}
```

### Dark Mode
As specified above.

### Accessibility
- Status communicated via icon + label + color (not color alone)
- Icon has no meaningful alt — label provides the status text

## Pattern Library
[ ] Component file needed: `pattern-library/components/patient-delivery-status-card.html`
[ ] `COMPONENT-INDEX.md` row needed

## Priority
Required for launch
