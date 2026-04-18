import { useMemo, useState } from 'react';
import {
  QueueItem,
  QueueSectionHeader,
  QueueSidebar,
  QueueSidebarBrand,
  QueueSidebarBody,
  ThreePanelShell,
  ThreePanelShellCenter,
  ThreadPanel,
  ThreadPanelEmpty,
} from '@haven/ui-react';
import { urgent, attention, info } from './data/queue';
import type { QueueEntry } from './data/queue';
import type { QueueSectionTier } from '@haven/ui-react';

export function App() {
  const [activeId, setActiveId] = useState<string>();

  const activeEntry = useMemo(() => {
    const all = [...urgent, ...attention, ...info];
    return all.find((entry) => entry.id === activeId);
  }, [activeId]);

  const renderSection = (
    tier: QueueSectionTier,
    label: string,
    entries: QueueEntry[],
  ) => {
    if (entries.length === 0) return null;
    const headerId = `tier-${tier}`;
    return (
      <section aria-labelledby={headerId}>
        <QueueSectionHeader id={headerId} tier={tier}>
          {label} · {entries.length}
        </QueueSectionHeader>
        <ul className="queue-list">
          {entries.map((entry) => (
            <li key={entry.id}>
              <QueueItem
                {...entry}
                active={entry.id === activeId}
                onClick={() => setActiveId(entry.id)}
              />
            </li>
          ))}
        </ul>
      </section>
    );
  };

  return (
    <ThreePanelShell>
      <QueueSidebar>
        <QueueSidebarBrand>Ava</QueueSidebarBrand>
        <QueueSidebarBody>
          {renderSection('urgent', 'Urgent', urgent)}
          {renderSection('attention', 'Needs Attention', attention)}
          {renderSection('info', 'Informational', info)}
        </QueueSidebarBody>
      </QueueSidebar>

      <ThreePanelShellCenter>
        {activeEntry ? (
          <section className="p-6">
            <h1 className="section-title">{activeEntry.name}</h1>
            <p className="prose-section mt-2">
              {activeEntry.category} — {activeEntry.summary}
            </p>
            <p className="prose-section mt-4">
              Record content lands in a future slice.
            </p>
          </section>
        ) : (
          <section className="p-6">
            <h1 className="section-title">Select a queue item</h1>
            <p className="prose-section mt-2">
              Click or Tab + Enter to a queue item in the sidebar to load
              its record here.
            </p>
          </section>
        )}
      </ThreePanelShellCenter>

      <ThreadPanel>
        <ThreadPanelEmpty>
          {activeEntry
            ? 'Thread view lands in slice 3.'
            : 'Select a queue item to see its activity.'}
        </ThreadPanelEmpty>
      </ThreadPanel>
    </ThreePanelShell>
  );
}
