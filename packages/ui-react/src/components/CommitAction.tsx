import type { CommitActionProps } from './CommitAction.props';

export type { CommitActionProps, CommitActionButtonType } from './CommitAction.props';

// Mirror of packages/design-system/pattern-library/components/commit-action.html.
// Terminal commit for a screen — Start / Submit / Save / Done. Renders with
// .btn-primary per DESIGN.md §Brand-taste ("Primary teal fill reserved for
// commits"). Sibling to PrimaryAction (forward-nav renders btn-secondary).
//
// Render branches:
//   asComponent set → render <AsComponent {...linkProps} className="btn-primary"> — for
//     router-Link injection (react-router, Next.js Link, etc.) without leaking the
//     router API into the design system.
//   href set → render <a href={href} className="btn-primary"> (plain navigation that commits).
//   neither → render <button type={type} className="btn-primary"> (default 'submit').
//
// The optional `block` prop composes .btn-block on top of .btn-primary — replaces
// the `w-full justify-center` inline duo on sticky-footer / mobile CTAs.

export function CommitAction({
  label,
  href,
  type = 'submit',
  block,
  asComponent: AsComponent,
  linkProps,
}: CommitActionProps) {
  const className = block ? 'btn-primary btn-block' : 'btn-primary';

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
    <button type={type} className={className}>
      {label}
    </button>
  );
}
