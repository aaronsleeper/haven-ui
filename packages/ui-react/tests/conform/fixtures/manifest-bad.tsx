// Negative-test fixture — contains an unregistered component tag.
// Manifest gate should fail against this file (exit 1). Used during gate
// development to confirm the walker actually rejects hallucinations; not
// part of the default `pnpm conform:manifest` run.

import { QueueItem } from '@haven/ui-react';

export function BadFixture() {
  return (
    <div>
      <QueueItem urgency="urgent" name="" category="" summary="" time="" />
      {/* @ts-expect-error — intentionally unregistered tag for negative test */}
      <HallucinatedCard title="fake" />
    </div>
  );
}
