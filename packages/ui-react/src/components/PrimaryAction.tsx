import type { PrimaryActionProps } from './PrimaryAction.props';

export type { PrimaryActionProps } from './PrimaryAction.props';

// Mirror of packages/design-system/pattern-library/components/primary-action.html.
// Semantically "the primary action for this screen"; visually rendered with
// .btn-secondary per DESIGN.md §Brand-taste ("Next buttons are secondary").
//
// Render branches:
//   asComponent set → render <AsComponent {...linkProps} className="btn-secondary"> — for
//     router-Link injection (react-router, Next.js Link, etc.) without leaking the
//     router API into the design system.
//   href set → render <a href={href} className="btn-secondary"> (plain navigation).
//   neither → render <button type="button" className="btn-secondary">.
//
// The optional `block` prop composes .btn-block on top of the variant — replaces
// the `w-full justify-center` inline duo on sticky-footer / mobile CTAs.

export function PrimaryAction({
  label,
  href,
  block,
  asComponent: AsComponent,
  linkProps,
}: PrimaryActionProps) {
  const className = block ? 'btn-secondary btn-block' : 'btn-secondary';

  if (AsComponent) {
    return (
      <AsComponent {...linkProps} className={className}>
        {label}
      </AsComponent>
    );
  }
  if (href) {
    return (
      <a href={href} className={className}>
        {label}
      </a>
    );
  }
  return (
    <button type="button" className={className}>
      {label}
    </button>
  );
}
