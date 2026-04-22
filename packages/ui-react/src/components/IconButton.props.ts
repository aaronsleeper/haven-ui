// Prop schema for IconButton. Mirror of
// packages/design-system/pattern-library/components/btn-icon.html.

import type { ComponentType, ElementType } from 'react';

export type IconButtonVariant = 'neutral' | 'primary';
export type IconButtonType = 'submit' | 'button';

export interface IconButtonProps {
  /** FontAwesome class fragment without the `fa-` prefix on the family — pass e.g. `fa-solid fa-chevron-left`. */
  icon: string;
  /** Required. Icon-only buttons must announce their action; this becomes the aria-label. */
  ariaLabel: string;
  /** Visual variant. neutral = .btn-icon (44px gray), primary = .btn-icon-primary (32px teal fill). Default 'neutral'. */
  variant?: IconButtonVariant;
  /** Destination URL. If provided, renders as <a>; otherwise renders as <button>. */
  href?: string;
  /** Button type when href is absent and asComponent is unset. Default 'button'. */
  type?: IconButtonType;
  /**
   * Render as a custom component (e.g. react-router <Link>) instead of <a> / <button>.
   * When set, the component is rendered with `linkProps` spread + the variant className
   * + aria-label, so the caller controls navigation without leaking the router API into
   * the design system.
   */
  asComponent?: ElementType | ComponentType<Record<string, unknown>>;
  /** Props forwarded to `asComponent`. Use this for router-specific props like `to`. */
  linkProps?: Record<string, unknown>;
}
