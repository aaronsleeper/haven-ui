import { Avatar, CommitAction, IconButton } from '@haven/ui-react';
import { Link } from 'react-router-dom';
import { PHQ9_LEAD_IN, PHQ9_QUESTIONS } from './questions';
import { useAssessmentResponses } from '../../lib/useAssessmentResponses';

// Mirror of assess-02 wireframe pattern for PHQ-9: category icon, warm title
// ("Mood check-in" per patient-facing voice — same rename convention as GAD-7
// → "Anxiety check-in"), description, estimated time, Start commit-action.
// Back chevron top-left exits to a hypothetical /health hub.
//
// Clearing responses lives here on the Start-button onClick, not on Complete
// unmount — see useAssessmentResponses hook doc for the StrictMode rationale.

export function Phq9Start() {
  const { clear } = useAssessmentResponses('phq-9');
  return (
    <div className="flex flex-col min-h-dvh">
      {/* Header — back chevron only */}
      <div className="flex items-center px-4 pt-4 pb-2">
        <IconButton
          icon="fa-solid fa-chevron-left"
          ariaLabel="Back to home"
          asComponent={Link}
          linkProps={{ to: '/' }}
        />
      </div>

      {/* Content — vertically centered */}
      <div className="flex-1 px-6 flex flex-col items-center justify-center text-center">
        <Avatar size="xl" color="primary" alt="Mood check-in">
          <i className="fa-solid fa-cloud-sun avatar-icon" aria-hidden="true"></i>
        </Avatar>

        <h1 className="text-xl font-serif font-semibold mt-4">Mood check-in</h1>

        <p className="text-sm text-sand-500 mt-2 max-w-xs">
          {PHQ9_LEAD_IN} Your answers help your care team support you.
        </p>

        <p className="text-xs text-sand-400 mt-3 flex items-center gap-1.5">
          <i className="fa-regular fa-clock text-sand-400" aria-hidden="true"></i>
          About 3 minutes — {PHQ9_QUESTIONS.length} questions
        </p>
      </div>

      {/* Footer — Start commit */}
      <div className="px-6 pb-safe-8">
        <CommitAction
          label="Start"
          asComponent={Link}
          block
          linkProps={{
            to: `/assessment/phq-9/question/${PHQ9_QUESTIONS[0]!.id}`,
            onClick: () => clear(),
          }}
        />
        <p className="text-xs text-sand-400 text-center mt-3">
          Your answers are private and shared only with your care team.
        </p>
      </div>
    </div>
  );
}
