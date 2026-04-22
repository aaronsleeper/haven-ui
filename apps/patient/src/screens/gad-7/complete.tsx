import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { scoreGad7 } from './questions';
import { useGad7Responses } from './state';

// Complete screen — warm thank-you per assess-04 wireframe. Score band computed
// but NOT shown to patient (clinical-only per wireframe; patient sees warm
// affirmation). Left in-memory via the scoreGad7 call so downstream consumers
// (care-team view, eventual API persistence) can pick it up without re-scoring.
//
// Clears responses after mount so retaking the assessment starts fresh.

export function Gad7Complete() {
  const { responses, clear } = useGad7Responses();
  const navigate = useNavigate();

  // Guard: if the user lands here without any responses, bounce to Start.
  useEffect(() => {
    if (Object.keys(responses).length === 0) {
      navigate('/assessment/gad-7/start', { replace: true });
    }
  }, [responses, navigate]);

  const score = scoreGad7(responses);

  // Clear responses on unmount so navigating back to Start is a fresh start.
  // (A production version would persist to API before clearing; slice 1 is
  // in-memory + localStorage only, so clearing here is the right behavior.)
  useEffect(() => {
    return () => {
      clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

        {/* Debug/demo only — score band visible while slice 1 is prototype.
            Production wireframe (assess-04) hides raw score from patient. */}
        <p className="text-xs text-sand-400 mt-6 font-mono">
          [prototype] score: {score.total} / 21 — {score.band}
        </p>
      </div>

      {/* Footer — Done */}
      <div className="px-6 pb-8">
        <Link to="/" className="btn-primary w-full justify-center">
          Done
        </Link>
      </div>
    </div>
  );
}
