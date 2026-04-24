import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CommitAction } from '@haven/ui-react';
import { scorePhq9 } from './questions';
import { useAssessmentResponses } from '../../lib/useAssessmentResponses';

// Complete screen — warm thank-you per assess-04 wireframe. Score band computed
// but NOT shown to patient in production (clinical-only per wireframe; patient
// sees warm affirmation). Left in-memory for downstream consumers (care-team
// view, eventual API persistence).
//
// Cleanup of stale responses happens at the *start* of a new attempt
// (start.tsx Start-button onClick), not on unmount here. See
// useAssessmentResponses hook doc for the StrictMode rationale.

export function Phq9Complete() {
  const { responses } = useAssessmentResponses('phq-9');
  const navigate = useNavigate();

  // Guard: if the user lands here without any responses, bounce to Start.
  useEffect(() => {
    if (Object.keys(responses).length === 0) {
      navigate('/assessment/phq-9/start', { replace: true });
    }
  }, [responses, navigate]);

  const score = scorePhq9(responses);

  return (
    <div className="flex flex-col min-h-dvh">
      {/* Header — no back, no progress (submission is final) */}
      <div className="px-4 pt-4 pb-2 h-11" />

      {/* Content — centered confirmation */}
      <div className="flex-1 px-6 flex flex-col items-center justify-center text-center">
        <i className="fa-solid fa-circle-check text-success-500 text-4xl" aria-hidden="true"></i>
        <h1 className="text-xl font-serif font-semibold mt-4">Thank you</h1>
        <p className="text-sm text-sand-500 mt-2 max-w-xs">
          Your care team will review your answers.
        </p>

        {/* Debug/demo only — score band visible while slice is prototype.
            Production wireframe (assess-04) hides raw score from patient. */}
        <p className="text-xs text-sand-400 mt-6">
          [prototype] score {score.total} of 27 — {score.band}
        </p>
      </div>

      {/* Footer — Done */}
      <div className="px-6 pb-safe-8">
        <CommitAction label="Done" asComponent={Link} block linkProps={{ to: '/' }} />
      </div>
    </div>
  );
}
