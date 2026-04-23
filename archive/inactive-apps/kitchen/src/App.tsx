import {
  QueueSidebarBrand,
  ThreadPanel,
  ThreadPanelEmpty,
  ThreePanelShell,
  ThreePanelShellCenter,
} from '@haven/ui-react';

export function App() {
  return (
    <ThreePanelShell>
      <aside className="queue-sidebar" aria-label="Kitchen navigation">
        <QueueSidebarBrand />
      </aside>

      <ThreePanelShellCenter>
        <section className="p-8">
          <h1 className="text-2xl font-semibold">kitchen</h1>
          <p className="mt-2 text-neutral-600">
            React shell ready. Features land via the agent workflow —
            see <code>apps/kitchen/design/</code>.
          </p>
        </section>
      </ThreePanelShellCenter>

      <ThreadPanel>
        <ThreadPanelEmpty>
          <p>Assistant panel placeholder.</p>
        </ThreadPanelEmpty>
      </ThreadPanel>
    </ThreePanelShell>
  );
}
