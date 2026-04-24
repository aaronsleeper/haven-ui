// Standard PHQ-9 instrument question bank.
// Source: Kroenke, Spitzer, Williams 2001. Public-domain instrument.
// Lead-in: "Over the last 2 weeks, how often have you been bothered by any
// of the following problems?" — presented once in the Start screen; each
// question is rendered standalone in the Question screen with the assumed
// prefix. Response scale matches GAD-7: 0 Not at all / 1 Several days /
// 2 More than half the days / 3 Nearly every day. Summed 0–27.
//
// Clinical note on Q9: the self-harm ideation item is rendered verbatim.
// Softening wording breaks screener validity. A production-ready flow would
// surface a safety / hotline branch for non-zero Q9 responses; slice 2 does
// not implement the safety branch (out of scope; Patient Ops expert input
// required before it ships).

export interface Phq9Question {
  id: string;
  text: string;
}

export const PHQ9_LEAD_IN = 'Over the last 2 weeks, how often have you been bothered by any of the following problems?';

export const PHQ9_QUESTIONS: readonly Phq9Question[] = [
  { id: 'q1', text: 'Little interest or pleasure in doing things' },
  { id: 'q2', text: 'Feeling down, depressed, or hopeless' },
  { id: 'q3', text: 'Trouble falling or staying asleep, or sleeping too much' },
  { id: 'q4', text: 'Feeling tired or having little energy' },
  { id: 'q5', text: 'Poor appetite or overeating' },
  { id: 'q6', text: 'Feeling bad about yourself — or that you are a failure or have let yourself or your family down' },
  { id: 'q7', text: 'Trouble concentrating on things, such as reading the newspaper or watching television' },
  { id: 'q8', text: 'Moving or speaking so slowly that other people could have noticed — or the opposite, being so fidgety or restless that you have been moving around a lot more than usual' },
  { id: 'q9', text: 'Thoughts that you would be better off dead, or of hurting yourself in some way' },
];

export const PHQ9_OPTIONS = [
  { index: 0, label: 'Not at all' },
  { index: 1, label: 'Several days' },
  { index: 2, label: 'More than half the days' },
  { index: 3, label: 'Nearly every day' },
] as const;

export type Phq9Score = {
  total: number;
  band: 'minimal' | 'mild' | 'moderate' | 'moderately severe' | 'severe';
};

export function scorePhq9(responses: Record<string, number>): Phq9Score {
  const total = PHQ9_QUESTIONS.reduce((sum, q) => sum + (responses[q.id] ?? 0), 0);
  const band: Phq9Score['band'] =
    total <= 4 ? 'minimal'
    : total <= 9 ? 'mild'
    : total <= 14 ? 'moderate'
    : total <= 19 ? 'moderately severe'
    : 'severe';
  return { total, band };
}
