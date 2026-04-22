// Prop schema for CommitAction. Mirror of
// packages/design-system/pattern-library/components/commit-action.html.
// Sibling to PrimaryAction — differs only in visual weight per DESIGN.md
// §Brand-taste: btn-primary (teal) for commits (Start / Submit / Save / Done).

export type CommitActionButtonType = 'submit' | 'button';

export interface CommitActionProps {
  label: string;
  /** Destination URL. If provided, renders as <a>; otherwise renders as <button>. */
  href?: string;
  /** Button type when href is absent. Default 'submit' (matches its typical role inside a form). */
  type?: CommitActionButtonType;
}
