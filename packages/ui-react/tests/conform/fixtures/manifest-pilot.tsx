// Manifest gate fixture — represents the shape of step-9 generated JSX.
// Every component tag below must resolve to a name in registry.json.
// Real gate input becomes `apps/patient/src/screens/gad-7.tsx` once step 9
// emits it; fixture proves the walker before the emitter exists.

import {
  AssessmentHeader,
  ProgressBarPagination,
  QueueItem,
  QueueSectionHeader,
  QueueSidebar,
  ResponseOption,
  ResponseOptionGroup,
} from '@haven/ui-react';

export function PilotFixture() {
  return (
    <div>
      <QueueSidebar
        brand={{ logoSrc: '', logoAlt: '' }}
        sections={[]}
      />
      <QueueSectionHeader tier="urgent">Urgent · 0</QueueSectionHeader>
      <QueueItem urgency="urgent" name="" category="" summary="" time="" />
      <AssessmentHeader
        title=""
        progress={{ ariaLabel: '', steps: [] }}
      />
      <ProgressBarPagination ariaLabel="" steps={[]} />
      <ResponseOptionGroup promptId="" prompt="" options={[]} />
      <ResponseOption index={0} label="" />
    </div>
  );
}
