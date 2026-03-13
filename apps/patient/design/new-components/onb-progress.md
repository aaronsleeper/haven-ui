# New Component: Onboarding Progress Indicator

## Purpose
Simple step indicator displayed on all three onboarding screens. Shows current step number and total. No interactive behavior.

## Used In
- ONB-01: "Step 1 of 3"
- ONB-02: "Step 2 of 3"
- ONB-03: "Step 3 of 3"

## Preline Base
None.

## Proposed Semantic Class
`.onb-progress`

## Implementation Notes

### HTML Structure
```html
<p class="onb-progress" aria-label="Step 1 of 3">
  <span data-i18n-en="Step" data-i18n-es="Paso">Step</span>
  <span class="onb-progress-current">1</span>
  <span data-i18n-en="of" data-i18n-es="de">of</span>
  <span class="onb-progress-total">3</span>
</p>
```

### @apply Definition
```css
.onb-progress {
  @apply block text-sm text-gray-500 text-center mt-4 mb-2;
}
```

### Dark Mode
- `.onb-progress`: `dark:text-neutral-400`

### Accessibility
`aria-label="Step N of 3"` on the element for screen readers (the inner text rendering varies by language).

## Pattern Library
[ ] Component file needed: `pattern-library/components/layout-onb-progress.html`
[ ] `COMPONENT-INDEX.md` row needed

## Priority
Required for launch
