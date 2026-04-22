// Prop schema for CommitAction. Mirror of
// packages/design-system/pattern-library/components/commit-action.html.
// Sibling to PrimaryAction — differs only in visual weight per DESIGN.md
// §Brand-taste: btn-primary (teal) for commits (Start / Submit / Save / Done).

import type { ComponentType, ElementType } from 'react';

export type CommitActionButtonType = 'submit' | 'button';

export interface CommitActionProps {
  label: string;
  /** Destination URL. If provided, renders as <a>; otherwise renders as <button>. */
  href?: string;
  /** Button type when href is absent. Default 'submit' (matches its typical role inside a form). */
  type?: CommitActionButtonType;
  /** Render full-width — composes the .btn-block modifier on top of .btn-primary. */
  block?: boolean;
  /**
   * Render as a custom component (e.g. react-router <Link>) instead of <a> / <button>.
   * When set, the component is rendered with `linkProps` spread + `className="btn-primary"`
   * so the caller controls navigation (router-Link, Next.js Link, etc.) without leaking
   * router APIs into the design system.
   */
  asComponent?: ElementType | ComponentType<Record<string, unknown>>;
  /** Props forwarded to `asComponent`. Use this for router-specific props like `to`. */
  linkProps?: Record<string, unknown>;
}
