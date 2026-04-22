// Standard GAD-7 instrument question bank.
// Source: Spitzer, Kroenke, Williams, Löwe 2006. Public-domain instrument.
// Lead-in: "Over the last 2 weeks, how often have you been bothered by the
// following problems?" — presented once in the Start screen; each question
// is rendered standalone in the Question screen with the assumed prefix.
// Response scale: 0 Not at all / 1 Several days / 2 More than half the days /
// 3 Nearly every day. Summed 0–21.

export interface Gad7Question {
  id: string;
  text: string;
}

export const GAD7_LEAD_IN = 'Over the last 2 weeks, how often have you been bothered by the following problems?';

export const GAD7_QUESTIONS: readonly Gad7Question[] = [
  { id: 'q1', text: 'Feeling nervous, anxious, or on edge' },
  { id: 'q2', text: 'Not being able to stop or control worrying' },
  { id: 'q3', text: 'Worrying too much about different things' },
  { id: 'q4', text: 'Trouble relaxing' },
  { id: 'q5', text: "Being so restless that it's hard to sit still" },
  { id: 'q6', text: 'Becoming easily annoyed or irritable' },
  { id: 'q7', text: 'Feeling afraid, as if something awful might happen' },
];

export const GAD7_OPTIONS = [
  { index: 0, label: 'Not at all' },
  { index: 1, label: 'Several days' },
  { index: 2, label: 'More than half the days' },
  { index: 3, label: 'Nearly every day' },
] as const;

export type Gad7Score = {
  total: number;
  band: 'minimal' | 'mild' | 'moderate' | 'severe';
};

export function scoreGad7(responses: Record<string, number>): Gad7Score {
  const total = GAD7_QUESTIONS.reduce((sum, q) => sum + (responses[q.id] ?? 0), 0);
  const band: Gad7Score['band'] =
    total <= 4 ? 'minimal'
    : total <= 9 ? 'mild'
    : total <= 14 ? 'moderate'
    : 'severe';
  return { total, band };
}
