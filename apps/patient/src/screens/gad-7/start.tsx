import { Avatar, CommitAction, IconButton } from '@haven/ui-react';
import { Link } from 'react-router-dom';
import { GAD7_LEAD_IN, GAD7_QUESTIONS } from './questions';
import { useGad7Responses } from './state';

// Mirror of assess-02 wireframe pattern for GAD-7 specifically: category icon,
// warm title ("Anxiety check-in" per plain-language Patch 9), description,
// estimated time, Start commit-action. Back chevron top-left exits to a
// hypothetical /health hub (slice 1 has no hub yet; link rendered inert).
//
// Clearing responses lives here (Start), not on Complete unmount, so React 18
// StrictMode's synthetic mount/unmount cycle on Complete cannot empty
// responses mid-render and bounce the user back to Start.

export function Gad7Start() {
  const { clear } = useGad7Responses();
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
        <Avatar size="xl" color="primary" alt="Anxiety check-in">
          <i className="fa-solid fa-brain avatar-icon" aria-hidden="true"></i>
        </Avatar>

        <h1 className="text-xl font-serif font-semibold mt-4">Anxiety check-in</h1>

        <p className="text-sm text-sand-500 mt-2 max-w-xs">
          {GAD7_LEAD_IN} Your answers help your care team support you.
        </p>

        <p className="text-xs text-sand-400 mt-3 flex items-center gap-1.5">
          <i className="fa-regular fa-clock text-sand-400" aria-hidden="true"></i>
          About 2 minutes — {GAD7_QUESTIONS.length} questions
        </p>
      </div>

      {/* Footer — Start commit */}
      <div className="px-6 pb-safe-8">
        <CommitAction
          label="Start"
          asComponent={Link}
          block
          linkProps={{
            to: `/assessment/gad-7/question/${GAD7_QUESTIONS[0]!.id}`,
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
