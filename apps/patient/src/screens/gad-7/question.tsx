import { AssessmentHeader, ResponseOptionGroup, type ResponseOptionData } from '@haven/ui-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { GAD7_QUESTIONS, GAD7_OPTIONS } from './questions';
import { useGad7Responses } from './state';

// Question screen — one GAD-7 question at a time. URL = question id so browser
// back + refresh work. Progress derived from question index; responses tracked
// per useGad7Responses hook (persists to localStorage). "Continue" on last Q
// routes to /complete.
//
// GAP: ResponseOptionGroup doesn't expose a controlled-state prop — it owns
// aria-checked internally on click. For slice 1 we rely on the component's
// internal state and capture the final answer via a change handler on the
// underlying <button role="radio"> elements. Flagged for props-surface follow-
// up: registered components need controlled-state for real flow state.
//
// GAP: the wireframe's "Continue disabled until answered" requires the parent
// to know if a selection has been made. Without a controlled API on
// ResponseOptionGroup, slice 1 relies on a native-DOM listener inside this
// component rather than a proper prop flow.

type ProgressStep = {
  status: 'complete' | 'in-progress' | 'not-started';
  label: string;
};

export function Gad7Question() {
  const { qid } = useParams<{ qid: string }>();
  const navigate = useNavigate();
  const { responses, setAnswer } = useGad7Responses();

  const currentIdx = GAD7_QUESTIONS.findIndex((q) => q.id === qid);
  const current = currentIdx >= 0 ? GAD7_QUESTIONS[currentIdx] : undefined;
  const isLast = currentIdx === GAD7_QUESTIONS.length - 1;

  const progressSteps = useMemo<ProgressStep[]>(
    () =>
      GAD7_QUESTIONS.map((_, i) => ({
        status:
          i < currentIdx ? 'complete'
          : i === currentIdx ? 'in-progress'
          : 'not-started',
        label: `Question ${i + 1} — ${
          i < currentIdx ? 'complete' : i === currentIdx ? 'in progress' : 'not started'
        }`,
      })),
    [currentIdx],
  );

  const options = useMemo<ResponseOptionData[]>(
    () => GAD7_OPTIONS.map((o) => ({ index: o.index, label: o.label })),
    [],
  );

  // If qid is invalid, bounce to Start.
  if (!current) {
    navigate('/assessment/gad-7/start', { replace: true });
    return null;
  }

  const answered = responses[current.id] !== undefined;

  // Capture the selection via a DOM listener — ResponseOptionGroup doesn't
  // expose a controlled API in slice-1. See GAP note above.
  function handleAnswer(event: React.MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    const btn = target.closest<HTMLButtonElement>('button[role="radio"]');
    if (!btn || !current) return;
    const label = btn.querySelector<HTMLElement>('.response-option-label')?.textContent?.trim();
    if (!label) return;
    const option = GAD7_OPTIONS.find((o) => o.label === label);
    if (!option) return;
    setAnswer(current.id, option.index);
  }

  function handleContinue() {
    if (!answered || !current) return;
    if (isLast) {
      navigate('/assessment/gad-7/complete');
      return;
    }
    const next = GAD7_QUESTIONS[currentIdx + 1]!;
    navigate(`/assessment/gad-7/question/${next.id}`);
  }

  const backTo =
    currentIdx === 0
      ? '/assessment/gad-7/start'
      : `/assessment/gad-7/question/${GAD7_QUESTIONS[currentIdx - 1]!.id}`;

  return (
    <div className="flex flex-col min-h-dvh">
      {/* Header — back + close */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <Link to={backTo} className="btn-icon" aria-label="Previous question">
          <i className="fa-solid fa-chevron-left" aria-hidden="true"></i>
        </Link>
        <Link to="/" className="btn-icon" aria-label="Save and exit">
          <i className="fa-solid fa-xmark" aria-hidden="true"></i>
        </Link>
      </div>

      {/* Progress + title */}
      <div className="px-6 pt-2">
        <AssessmentHeader
          title="Anxiety check-in"
          meta={`Question ${currentIdx + 1} of ${GAD7_QUESTIONS.length}`}
          progress={{
            ariaLabel: `Assessment progress: question ${currentIdx + 1} of ${GAD7_QUESTIONS.length}`,
            steps: progressSteps,
          }}
        />
      </div>

      {/* Response area */}
      <div className="flex-1 px-6 pt-6 pb-4" onClick={handleAnswer}>
        <ResponseOptionGroup
          promptId={`gad7-${current.id}-prompt`}
          prompt={current.text}
          options={options}
        />
      </div>

      {/* Sticky footer — Continue / Submit */}
      <div className="sticky bottom-0 bg-white border-t border-sand-200 px-6 py-4">
        <button
          type="button"
          className="btn-primary w-full justify-center"
          onClick={handleContinue}
          disabled={!answered}
        >
          {isLast ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
}
