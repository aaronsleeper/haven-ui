import {
  AssessmentHeader,
  IconButton,
  ResponseOptionGroup,
  type ResponseOptionData,
} from '@haven/ui-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { PHQ9_QUESTIONS, PHQ9_OPTIONS } from './questions';
import { useAssessmentResponses } from '../../lib/useAssessmentResponses';

// Question screen — one PHQ-9 question at a time. URL = question id so browser
// back + refresh work. Progress derived from question index; responses tracked
// per useAssessmentResponses hook (persists to localStorage). "Submit" on last
// Q routes to /complete.

type ProgressStep = {
  status: 'complete' | 'in-progress' | 'not-started';
  label: string;
};

export function Phq9Question() {
  const { qid } = useParams<{ qid: string }>();
  const navigate = useNavigate();
  const { responses, setAnswer } = useAssessmentResponses('phq-9');

  const currentIdx = PHQ9_QUESTIONS.findIndex((q) => q.id === qid);
  const current = currentIdx >= 0 ? PHQ9_QUESTIONS[currentIdx] : undefined;
  const isLast = currentIdx === PHQ9_QUESTIONS.length - 1;

  const progressSteps = useMemo<ProgressStep[]>(
    () =>
      PHQ9_QUESTIONS.map((_, i) => ({
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
    () => PHQ9_OPTIONS.map((o) => ({ index: o.index, label: o.label })),
    [],
  );

  // If qid is invalid, bounce to Start.
  if (!current) {
    navigate('/assessment/phq-9/start', { replace: true });
    return null;
  }

  const selected = responses[current.id];
  const answered = selected !== undefined;

  function handleSelect(index: number) {
    if (!current) return;
    setAnswer(current.id, index);
  }

  function handleContinue() {
    if (!answered || !current) return;
    if (isLast) {
      navigate('/assessment/phq-9/complete');
      return;
    }
    const next = PHQ9_QUESTIONS[currentIdx + 1]!;
    navigate(`/assessment/phq-9/question/${next.id}`);
  }

  const backTo =
    currentIdx === 0
      ? '/assessment/phq-9/start'
      : `/assessment/phq-9/question/${PHQ9_QUESTIONS[currentIdx - 1]!.id}`;

  return (
    // Mobile (<sm): viewport-tall column with sticky footer pinned to the
    // bottom of dvh. Desktop (≥sm): column collapses to content height; the
    // footer drops out of sticky mode and sits naturally below the response
    // options so Continue is right under the choices instead of 800px below.
    <div className="flex flex-col min-h-dvh sm:min-h-fit">
      {/* Header — back + close */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <IconButton
          icon="fa-solid fa-chevron-left"
          ariaLabel="Previous question"
          asComponent={Link}
          linkProps={{ to: backTo }}
        />
        <IconButton
          icon="fa-solid fa-xmark"
          ariaLabel="Save and exit"
          asComponent={Link}
          linkProps={{ to: '/' }}
        />
      </div>

      {/* Progress + title */}
      <div className="px-6 pt-2">
        <AssessmentHeader
          title="Mood check-in"
          meta={`Question ${currentIdx + 1} of ${PHQ9_QUESTIONS.length}`}
          progress={{
            ariaLabel: `Assessment progress: question ${currentIdx + 1} of ${PHQ9_QUESTIONS.length}`,
            steps: progressSteps,
          }}
        />
      </div>

      {/* Response area */}
      <div className="flex-1 sm:flex-initial px-6 pt-6 pb-4">
        <ResponseOptionGroup
          promptId={`phq9-${current.id}-prompt`}
          prompt={current.text}
          options={options}
          selectedIndex={selected}
          onChange={handleSelect}
        />
      </div>

      {/* Footer — sticky on mobile, natural-flow on desktop */}
      <div className="sticky bottom-0 bg-white border-t border-sand-200 px-6 pt-4 pb-safe-4 sm:static sm:bg-transparent sm:border-t-0 sm:pb-4">
        <button
          type="button"
          className="btn-primary btn-block"
          onClick={handleContinue}
          disabled={!answered}
        >
          {isLast ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
}
