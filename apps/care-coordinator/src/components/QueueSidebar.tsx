import { QueueItem, QueueSectionHeader } from '@haven/ui-react';
import type { QueueItemProps } from '@haven/ui-react';

type QueueEntry = Omit<QueueItemProps, 'className'> & { id: string };

export interface QueueSidebarProps {
  urgent: QueueEntry[];
  attention: QueueEntry[];
  info: QueueEntry[];
  activeId?: string;
  onSelect?: (id: string) => void;
}

export function QueueSidebar({
  urgent,
  attention,
  info,
  activeId,
  onSelect,
}: QueueSidebarProps) {
  const renderSection = (
    tier: 'urgent' | 'attention' | 'info',
    label: string,
    entries: QueueEntry[],
  ) =>
    entries.length > 0 && (
      <section className="space-y-0.5">
        <QueueSectionHeader tier={tier}>
          {label} · {entries.length}
        </QueueSectionHeader>
        {entries.map((entry) => (
          <div
            key={entry.id}
            onClick={() => onSelect?.(entry.id)}
            role={onSelect ? 'button' : undefined}
            tabIndex={onSelect ? 0 : undefined}
          >
            <QueueItem {...entry} active={entry.id === activeId} />
          </div>
        ))}
      </section>
    );

  return (
    <aside className="w-60 h-screen overflow-y-auto bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800">
      <header className="p-3 border-b border-gray-200 dark:border-neutral-800">
        <h1 className="text-sm font-semibold">Ava · Care Coordinator</h1>
      </header>
      <div className="p-2 space-y-3">
        {renderSection('urgent', 'Urgent', urgent)}
        {renderSection('attention', 'Needs Attention', attention)}
        {renderSection('info', 'Informational', info)}
      </div>
    </aside>
  );
}
