import { useId } from 'react';
import type { QueueSidebarProps } from './QueueSidebar.props';
import { QueueItem } from './QueueItem';
import { QueueSectionHeader } from './QueueSectionHeader';

export type {
  QueueSidebarProps,
  QueueSidebarBrand,
  QueueSidebarSection,
  QueueSidebarSectionHeader,
} from './QueueSidebar.props';

// Mirror of packages/design-system/pattern-library/components/queue-sidebar.html.
// Renders the left-panel queue: brand header, then one <section> per urgency tier.
// Section header icon and styling derive from the `urgency` tier via QueueSectionHeader.

export function QueueSidebar({
  brand,
  sections,
  label = 'Queue sidebar',
}: QueueSidebarProps) {
  const baseId = useId();

  return (
    <aside className="queue-sidebar" aria-label={label}>
      <header className="queue-sidebar-brand">
        <img
          src={brand.logoSrc}
          alt={brand.logoAlt}
          className="queue-sidebar-brand-logo"
        />
      </header>

      <div className="queue-sidebar-body">
        {sections.map((section, sectionIndex) => {
          const headerId = `${baseId}-section-${sectionIndex}`;
          return (
            <section key={headerId} aria-labelledby={headerId}>
              <QueueSectionHeader id={headerId} tier={section.header.urgency}>
                {section.header.label} · {section.items.length}
              </QueueSectionHeader>
              <ul className="queue-list">
                {section.items.map((item, itemIndex) => (
                  <li key={`${headerId}-item-${itemIndex}`}>
                    <QueueItem {...item} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </aside>
  );
}
