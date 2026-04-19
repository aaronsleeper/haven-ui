import { useMemo, useState } from 'react';
import {
  QueueSidebar,
  ThreePanelShell,
  ThreePanelShellCenter,
  ThreadPanel,
  ThreadPanelEmpty,
} from '@haven/ui-react';
import type {
  QueueItemProps,
  QueueItemUrgency,
  QueueSidebarSection,
} from '@haven/ui-react';
import logoSrc from '@haven/ui-react/assets/logo-cenahealth-teal.svg';
import { urgent, attention, info } from './data/queue';
import type { QueueEntry } from './data/queue';

export function App() {
  const [activeId, setActiveId] = useState<string>();

  const activeEntry = useMemo(() => {
    const all = [...urgent, ...attention, ...info];
    return all.find((entry) => entry.id === activeId);
  }, [activeId]);

  const toItems = (entries: QueueEntry[]): QueueItemProps[] =>
    entries.map((entry) => ({
      urgency: entry.urgency,
      name: entry.name,
      category: entry.category,
      summary: entry.summary,
      time: entry.time,
      sla: entry.sla,
      active: entry.id === activeId,
      onClick: () => setActiveId(entry.id),
    }));

  const section = (
    urgency: QueueItemUrgency,
    label: string,
    entries: QueueEntry[],
  ): QueueSidebarSection => ({
    header: { urgency, label },
    items: toItems(entries),
  });

  const sections: QueueSidebarSection[] = [
    section('urgent', 'Urgent', urgent),
    section('attention', 'Needs Attention', attention),
    section('info', 'Informational', info),
  ].filter((s) => s.items.length > 0);

  return (
    <ThreePanelShell>
      <QueueSidebar
        brand={{ logoSrc, logoAlt: 'Cena Health' }}
        sections={sections}
      />

      <ThreePanelShellCenter>
        {activeEntry ? (
          <section className="p-6">
            <h1 className="section-title">{activeEntry.name}</h1>
            <p className="prose-section mt-2">
              {activeEntry.category} — {activeEntry.summary}
            </p>
          </section>
        ) : (
          <section className="p-6">
            <h1 className="section-title">Select a queue item</h1>
            <p className="prose-section mt-2">
              Choose an item from the queue to load a record.
            </p>
          </section>
        )}
      </ThreePanelShellCenter>

      <ThreadPanel>
        {!activeEntry && (
          <ThreadPanelEmpty>
            Select a queue item to see its activity.
          </ThreadPanelEmpty>
        )}
      </ThreadPanel>
    </ThreePanelShell>
  );
}
