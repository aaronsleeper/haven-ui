import {
  QueueSidebarBrand,
  ThreadPanel,
  ThreadPanelEmpty,
  ThreePanelShell,
  ThreePanelShellCenter,
} from '@haven/ui-react';
import Gad7 from './screens/gad-7';

export function App() {
  return (
    <ThreePanelShell>
      <aside className="queue-sidebar" aria-label="Patient navigation">
        <QueueSidebarBrand />
      </aside>

      <ThreePanelShellCenter>
        <div className="mx-auto max-w-[640px] space-y-6 p-8">
          <Gad7 />
        </div>
      </ThreePanelShellCenter>

      <ThreadPanel>
        <ThreadPanelEmpty>
          <p>Assistant panel placeholder.</p>
        </ThreadPanelEmpty>
      </ThreadPanel>
    </ThreePanelShell>
  );
}
