import type { IconButtonProps } from './IconButton.props';

export type {
  IconButtonProps,
  IconButtonVariant,
  IconButtonType,
} from './IconButton.props';

// Mirror of packages/design-system/pattern-library/components/btn-icon.html.
// Icon-only action — back chevrons, close (×), more-options (⋮), toolbar utilities.
// aria-label is required (icon-only buttons must announce their action). Default
// variant is .btn-icon (44px neutral, meets 2.5.5 / iOS 44pt tap-target floor);
// .btn-icon-primary is reserved for dense toolbars with an obvious primary intent.
//
// Render branches mirror PrimaryAction / CommitAction:
//   asComponent set → render <AsComponent {...linkProps} className aria-label> — for
//     router-Link injection (react-router, Next.js Link, etc.).
//   href set → render <a href> (plain navigation).
//   neither → render <button type={type}> (in-page action; default 'button').
//
// The icon child is rendered with aria-hidden so the label-on-the-button is the
// only voiced text for screen readers.

export function IconButton({
  icon,
  ariaLabel,
  variant = 'neutral',
  href,
  type = 'button',
  asComponent: AsComponent,
  linkProps,
}: IconButtonProps) {
  const className = variant === 'primary' ? 'btn-icon-primary' : 'btn-icon';
  const iconNode = <i className={icon} aria-hidden="true" />;

  if (AsComponent) {
    return (
      <AsComponent {...linkProps} className={className} aria-label={ariaLabel}>
        {iconNode}
      </AsComponent>
    );
  }
  if (href) {
    return (
      <a href={href} className={className} aria-label={ariaLabel}>
        {iconNode}
      </a>
    );
  }
  return (
    <button type={type} className={className} aria-label={ariaLabel}>
      {iconNode}
    </button>
  );
}
