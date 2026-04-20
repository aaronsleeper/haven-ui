import type { PrimaryActionProps } from './PrimaryAction.props';

export type { PrimaryActionProps } from './PrimaryAction.props';

// Mirror of packages/design-system/pattern-library/components/primary-action.html.
// Semantically "the primary action for this screen"; visually rendered with
// .btn-secondary per DESIGN.md §Brand-taste ("Next buttons are secondary").
// Renders <a> when href is provided; <button type="button"> otherwise.

export function PrimaryAction({ label, href }: PrimaryActionProps) {
  if (href) {
    return (
      <a href={href} className="btn-secondary">
        {label}
      </a>
    );
  }
  return (
    <button type="button" className="btn-secondary">
      {label}
    </button>
  );
}
