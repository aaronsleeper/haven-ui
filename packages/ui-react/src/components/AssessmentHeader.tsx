import type { AssessmentHeaderProps } from './AssessmentHeader.props';
import { ProgressBarPagination } from './ProgressBarPagination';

export type { AssessmentHeaderProps } from './AssessmentHeader.props';

// Mirror of packages/design-system/pattern-library/components/assessment-header.html.
// Thin composition: Heading/02 title + progress-bar-pagination + optional Body/04 meta.

export function AssessmentHeader({ title, progress, meta }: AssessmentHeaderProps) {
  return (
    <header className="assessment-header">
      <h1 className="assessment-header-title">{title}</h1>
      <ProgressBarPagination {...progress} />
      {meta !== undefined && <p className="assessment-header-meta">{meta}</p>}
    </header>
  );
}
