import type { ProgressBarPaginationProps } from './ProgressBarPagination.props';

export type {
  ProgressBarPaginationProps,
  ProgressBarPaginationStep,
} from './ProgressBarPagination.props';

// Mirror of packages/design-system/pattern-library/components/progress-bar-pagination.html.
// Step-per-segment indicator for assessments. Not interactive; presentational landmark only.

export function ProgressBarPagination({
  steps,
  ariaLabel,
}: ProgressBarPaginationProps) {
  return (
    <nav className="progress-bar-pagination" aria-label={ariaLabel}>
      {steps.map((step, idx) => {
        const status = step.status ?? 'not-started';
        const classes = [
          'progress-bar-pagination-segment',
          status === 'complete' && 'is-filled',
        ]
          .filter(Boolean)
          .join(' ');
        return (
          <span
            key={idx}
            className={classes}
            aria-label={step.label}
            aria-current={status === 'in-progress' ? 'step' : undefined}
          />
        );
      })}
    </nav>
  );
}
