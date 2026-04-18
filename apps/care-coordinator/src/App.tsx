import { useState } from 'react';
import {
  QueueItem,
  QueueSectionHeader,
  QueueSidebar,
  QueueSidebarBrand,
  QueueSidebarBody,
} from '@haven/ui-react';
import { urgent, attention, info } from './data/queue';
import type { QueueEntry } from './data/queue';
import type { QueueSectionTier } from '@haven/ui-react';

export function App() {
  const [activeId, setActiveId] = useState<string>();

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
    <div className="flex min-h-screen">
      <QueueSidebar>
        <QueueSidebarBrand>Ava</QueueSidebarBrand>
        <QueueSidebarBody>
          {renderSection('urgent', 'Urgent', urgent)}
          {renderSection('attention', 'Needs Attention', attention)}
          {renderSection('info', 'Informational', info)}
        </QueueSidebarBody>
      </QueueSidebar>

      <main className="flex-1 p-8">
        <h1 className="section-title">care-coordinator — slice 1</h1>
        <p className="prose-section mt-2">
          Queue sidebar ported from Haven pattern-library components. Tab
          reaches each queue item; Enter or Space activates. Focus ring is
          distinct from the <code>active</code> background.
        </p>
        <p className="prose-section mt-4">
          Active queue id: <code>{activeId ?? '(none — try Tab + Enter)'}</code>
        </p>
      </main>
    </div>
  );
}
