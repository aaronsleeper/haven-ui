// Prop schema for PrimaryAction. Mirror of
// packages/design-system/pattern-library/components/primary-action.html.

import type { ComponentType, ElementType } from 'react';

export interface PrimaryActionProps {
  label: string;
  /** Destination URL. If provided, renders as <a>; otherwise renders as <button type="button">. */
  href?: string;
  /** Render full-width — composes the .btn-block modifier on top of the variant class. */
  block?: boolean;
  /**
   * Render as a custom component (e.g. react-router <Link>) instead of <a> / <button>.
   * When set, the component is rendered with `linkProps` spread + `className="btn-secondary"`
   * so the caller controls navigation (router-Link, Next.js Link, etc.) without leaking
   * router APIs into the design system.
   */
  asComponent?: ElementType | ComponentType<Record<string, unknown>>;
  /** Props forwarded to `asComponent`. Use this for router-specific props like `to`. */
  linkProps?: Record<string, unknown>;
}
