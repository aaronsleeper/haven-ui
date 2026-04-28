// App-local section-status-bar for cc-05.
//
// Single-use component (cc-05 only) — narrow inline carve-out per
// CLAUDE.md "Slice authoring — wireframe-driven, PL-first." Promote to PL
// when a second consumer (likely cc-06 diff) needs the same per-section
// checklist + scroll-to-section pattern.
//
// Sticky under the record header per Aaron's call 2026-04-27 — keeps the
// approval checklist visible as the coordinator scrolls through sections.

import type { SectionStatus, SectionType } from '../../data/care-plans';
import { SECTION_LABELS } from '../../data/care-plans';

interface SectionStatusBarItem {
  type: SectionType;
  status: SectionStatus;
}

interface SectionStatusBarProps {
  sections: SectionStatusBarItem[];
  /** Returns the in-page anchor id for a section. App composes the anchor
   *  on the matching accordion-item; the bar links to it. */
  anchorIdFor: (type: SectionType) => string;
}

interface StatusGlyph {
  icon: string;
  textClass: string;
  ariaLabel: (label: string) => string;
}

const STATUS_GLYPH: Record<SectionStatus, StatusGlyph> = {
  'clinician-approved': {
    icon: 'fa-solid fa-circle-check',
    textClass: 'text-green-600',
    ariaLabel: (label) => `${label}, approved by clinician`,
  },
  'coordinator-pending': {
    icon: 'fa-solid fa-clock',
    textClass: 'text-amber-500',
    ariaLabel: (label) => `${label}, pending coordinator review`,
  },
  'auto-populated': {
    icon: 'fa-solid fa-circle-check',
    textClass: 'text-sand-400',
    ariaLabel: (label) => `${label}, auto-populated`,
  },
  'system-error': {
    icon: 'fa-solid fa-circle-exclamation',
    textClass: 'text-red-600',
    ariaLabel: (label) => `${label}, awaiting required review`,
  },
};

const ITEM_TEXT_CLASS: Record<SectionStatus, string> = {
  'clinician-approved': 'text-sand-700',
  'coordinator-pending': 'text-amber-700 font-medium',
  'auto-populated': 'text-sand-500',
  'system-error': 'text-red-700 font-medium',
};

export function SectionStatusBar({ sections, anchorIdFor }: SectionStatusBarProps) {
  return (
    <nav
      aria-label="Care plan sections"
      className="sticky top-0 z-10 flex flex-wrap gap-x-5 gap-y-2 px-6 py-3 bg-sand-50 border-b border-sand-150"
    >
      {sections.map((section) => {
        const label = SECTION_LABELS[section.type];
        const glyph = STATUS_GLYPH[section.status];
        const textClass = ITEM_TEXT_CLASS[section.status];
        return (
          <a
            key={section.type}
            href={`#${anchorIdFor(section.type)}`}
            aria-label={glyph.ariaLabel(label)}
            className={`inline-flex items-center gap-1.5 text-body-04 ${textClass} hover:text-sand-900 transition-colors`}
          >
            <i className={`${glyph.icon} ${glyph.textClass}`} aria-hidden="true" />
            <span>{label}</span>
          </a>
        );
      })}
    </nav>
  );
}
