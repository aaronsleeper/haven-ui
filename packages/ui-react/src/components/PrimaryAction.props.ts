// Prop schema for PrimaryAction. Mirror of
// packages/design-system/pattern-library/components/primary-action.html.

export interface PrimaryActionProps {
  label: string;
  /** Destination URL. If provided, renders as <a>; otherwise renders as <button type="button">. */
  href?: string;
}
