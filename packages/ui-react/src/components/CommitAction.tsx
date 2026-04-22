import type { CommitActionProps } from './CommitAction.props';

export type { CommitActionProps, CommitActionButtonType } from './CommitAction.props';

// Mirror of packages/design-system/pattern-library/components/commit-action.html.
// Terminal commit for a screen — Start / Submit / Save / Done. Renders with
// .btn-primary per DESIGN.md §Brand-taste ("Primary teal fill reserved for
// commits"). Sibling to PrimaryAction (forward-nav renders btn-secondary).
// Renders <a> when href is provided; <button> otherwise (type defaults to submit).

export function CommitAction({ label, href, type = 'submit' }: CommitActionProps) {
  if (href) {
    return (
      <a href={href} className="btn-primary">
        {label}
      </a>
    );
  }
  return (
    <button type={type} className="btn-primary">
      {label}
    </button>
  );
}
