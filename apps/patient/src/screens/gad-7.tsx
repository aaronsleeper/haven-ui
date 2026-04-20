// Generated from ../../apps/patient/design/wireframes/gad-7.mdoc by /compose — do not edit by hand.
// Regenerate: pnpm --filter @haven/ui-react compose ../../apps/patient/design/wireframes/gad-7.mdoc ../../apps/patient/src/screens/gad-7.tsx

import { AssessmentHeader, ResponseOptionGroup } from '@haven/ui-react';

export default function Gad7() {
  return (
    <>
      <AssessmentHeader
        title="GAD-7"
        progress={{
          "ariaLabel": "Assessment progress: question 3 of 7",
          "steps": [
            {
              "status": "complete",
              "label": "Question 1 — complete"
            },
            {
              "status": "complete",
              "label": "Question 2 — complete"
            },
            {
              "status": "in-progress",
              "label": "Question 3 — in progress"
            },
            {
              "status": "not-started",
              "label": "Question 4 — not started"
            },
            {
              "status": "not-started",
              "label": "Question 5 — not started"
            },
            {
              "status": "not-started",
              "label": "Question 6 — not started"
            },
            {
              "status": "not-started",
              "label": "Question 7 — not started"
            }
          ]
        }}
        meta="Question 3 of 7"
      />
      <ResponseOptionGroup
        promptId="gad7-q3-prompt"
        prompt="Over the last 2 weeks, how often have you been bothered by worrying too much about different things?"
        options={[
          {
            "index": 0,
            "label": "Not at all"
          },
          {
            "index": 1,
            "label": "Several days"
          },
          {
            "index": 2,
            "label": "More than half the days"
          },
          {
            "index": 3,
            "label": "Nearly every day"
          }
        ]}
      />
    </>
  );
}
