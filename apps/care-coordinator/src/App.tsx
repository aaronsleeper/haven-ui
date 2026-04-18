import { useState } from 'react';
import { QueueSidebar } from './components/QueueSidebar';
import { urgent, attention, info } from './data/queue';

export function App() {
  const [activeId, setActiveId] = useState<string>();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-neutral-950">
      <QueueSidebar
        urgent={urgent}
        attention={attention}
        info={info}
        activeId={activeId}
        onSelect={setActiveId}
      />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold">care-coordinator — slice 1</h1>
        <p className="mt-2 text-neutral-600">
          Queue sidebar rendered from ported Haven components. Click an item to
          toggle the <code>active</code> state.
        </p>
        <p className="mt-4 text-sm text-neutral-500">
          Active queue id:{' '}
          <code>{activeId ?? '(none — click a queue item)'}</code>
        </p>
      </main>
    </div>
  );
}
