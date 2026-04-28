// App-local care plan viewer for cc-05.
//
// Composition (Tier 2 — narrow inline carve-out per CLAUDE.md "Slice
// authoring"). Uses ported RecordHeader from @haven/ui-react plus PL
// semantic classes (accordion, kv-table, list-group, data-table, badge,
// medication-row, severity-badge, alert) applied via className.
//
// Per-section default-state convention from the wireframe:
//   clinician-approved  → collapsed (body hidden by default)
//   auto-populated      → collapsed
//   coordinator-pending → expanded (coordinator-owned, needs review)
//   system-error        → expanded (visible to surface the problem)
//
// Preline HSAccordion handles toggle at runtime; this component renders
// the initial state.

import type { ReactNode } from 'react';
import { RecordHeader } from '@haven/ui-react';
import type {
  CarePlan,
  CarePlanSection,
  GoalsSection,
  NutritionSection,
  BehavioralHealthSection,
  VisitScheduleSection,
  MonitoringSection,
  MealDeliverySection,
  MedicationsSection,
  RiskFlagsSection,
  SectionStatus,
  SectionType,
  Patient,
} from '../../data/care-plans';
import {
  SECTION_LABELS,
  STATUS_BADGE_VARIANT,
  isEditable,
} from '../../data/care-plans';
import { SectionStatusBar } from './SectionStatusBar';

interface CarePlanViewerProps {
  plan: CarePlan;
  patient: Patient;
}

const STATUS_GLYPH: Record<SectionStatus, { icon: string; textClass: string }> = {
  'clinician-approved': { icon: 'fa-solid fa-circle-check', textClass: 'text-green-600' },
  'coordinator-pending': { icon: 'fa-solid fa-clock', textClass: 'text-amber-500' },
  'auto-populated': { icon: 'fa-solid fa-circle-check', textClass: 'text-sand-400' },
  'system-error': { icon: 'fa-solid fa-circle-exclamation', textClass: 'text-red-600' },
};

function isExpandedByDefault(status: SectionStatus): boolean {
  return status === 'coordinator-pending' || status === 'system-error';
}

function anchorIdFor(type: SectionType): string {
  return `cp-section-${type}`;
}

function bodyIdFor(type: SectionType): string {
  return `cp-section-${type}-body`;
}

export function CarePlanViewer({ plan, patient }: CarePlanViewerProps) {
  const sectionStatuses = plan.sections.map((s) => ({ type: s.type, status: s.status }));

  return (
    <article className="flex flex-col h-full overflow-y-auto" aria-label={`Care plan ${plan.version} for ${patient.name}`}>
      <RecordHeader
        title={`Care Plan ${plan.version}`}
        subtitle={patient.name}
        trailing={
          <span className={`badge badge-${plan.recordStatusVariant}`}>
            {plan.recordStatusLabel}
          </span>
        }
        meta={plan.meta}
      />

      <SectionStatusBar sections={sectionStatuses} anchorIdFor={anchorIdFor} />

      <div className="px-6 py-6">
        <div className="accordion" data-hs-accordion-always-open>
          {plan.sections.map((section) => (
            <SectionAccordionItem key={section.type} section={section} />
          ))}
        </div>
      </div>
    </article>
  );
}

// ---------- Accordion item ----------

function SectionAccordionItem({ section }: { section: CarePlanSection }) {
  const expanded = isExpandedByDefault(section.status);
  const itemId = anchorIdFor(section.type);
  const bodyId = bodyIdFor(section.type);
  const glyph = STATUS_GLYPH[section.status];
  const badgeVariant = STATUS_BADGE_VARIANT[section.status];
  const label = SECTION_LABELS[section.type];

  return (
    <div
      className={`hs-accordion accordion-item${expanded ? ' active' : ''}`}
      id={itemId}
    >
      <button
        type="button"
        className="hs-accordion-toggle accordion-header"
        aria-expanded={expanded}
        aria-controls={bodyId}
      >
        <span className="flex items-center gap-2 flex-wrap">
          <i className={`${glyph.icon} ${glyph.textClass}`} aria-hidden="true" />
          <span>{label}</span>
          {section.approvalLabel ? (
            <span className={`badge badge-sm badge-${badgeVariant}`}>
              {section.approvalLabel}
            </span>
          ) : null}
          {isEditable(section.status) ? (
            <span className="editable-indicator">
              <i className="fa-solid fa-pen-to-square" aria-hidden="true" />
              Editable
            </span>
          ) : null}
        </span>
        <span className="accordion-chevron-wrap">
          <i className="fa-solid fa-chevron-up accordion-chevron-up" aria-hidden="true" />
          <i className="fa-solid fa-chevron-down accordion-chevron-down" aria-hidden="true" />
        </span>
      </button>
      <div
        id={bodyId}
        className="accordion-body"
        style={expanded ? undefined : { display: 'none' }}
        role="region"
        aria-labelledby={itemId}
      >
        <SectionBody section={section} />
      </div>
    </div>
  );
}

// ---------- Per-section bodies ----------

function SectionBody({ section }: { section: CarePlanSection }) {
  switch (section.type) {
    case 'goals':
      return <GoalsBody section={section} />;
    case 'nutrition':
      return <NutritionBody section={section} />;
    case 'behavioral-health':
      return <BehavioralHealthBody section={section} />;
    case 'visit-schedule':
      return <VisitScheduleBody section={section} />;
    case 'monitoring':
      return <MonitoringBody section={section} />;
    case 'meal-delivery':
      return <MealDeliveryBody section={section} />;
    case 'medications':
      return <MedicationsBody section={section} />;
    case 'risk-flags':
      return <RiskFlagsBody section={section} />;
  }
}

function GoalsBody({ section }: { section: GoalsSection }) {
  return (
    <ul className="list-group list-group-flush">
      {section.goals.map((goal, i) => (
        <li key={i} className="list-group-item">
          <span className="list-group-item-content">
            <span className="list-group-item-title">{goal}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function NutritionBody({ section }: { section: NutritionSection }) {
  return (
    <>
      <KvTable rows={section.rows} />
      {section.editNote ? (
        <p className="text-body-04 text-sand-500 italic mt-2">{section.editNote}</p>
      ) : null}
    </>
  );
}

function BehavioralHealthBody({ section }: { section: BehavioralHealthSection }) {
  return (
    <>
      <KvTable rows={section.rows} />
      {section.note ? (
        <p className="text-body-04 text-sand-500 mt-2">{section.note}</p>
      ) : null}
    </>
  );
}

function VisitScheduleBody({ section }: { section: VisitScheduleSection }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th scope="col">Visit Type</th>
          <th scope="col">Cadence</th>
          <th scope="col">First Visit</th>
        </tr>
      </thead>
      <tbody>
        {section.visits.map((visit, i) => (
          <tr key={i}>
            <td className="cell-primary">{visit.visitType}</td>
            <td>{visit.cadence}</td>
            <td>{visit.firstVisit}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MonitoringBody({ section }: { section: MonitoringSection }) {
  return (
    <ul className="list-group list-group-flush">
      {section.items.map((item, i) => (
        <li key={i} className="list-group-item">
          <span className="list-group-item-content">
            <span className="list-group-item-title">{item.label}</span>
          </span>
          <span className="list-group-item-trailing">
            <span className="badge badge-sm badge-neutral">{item.method}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function MealDeliveryBody({ section }: { section: MealDeliverySection }) {
  return (
    <>
      <KvTable rows={section.rows} />
      {section.warnings && section.warnings.length > 0 ? (
        <div className="flex flex-col gap-2 mt-3">
          {section.warnings.map((warning, i) => (
            <div key={i} className="alert alert-warning">
              <i className="fa-solid fa-triangle-exclamation alert-icon" aria-hidden="true" />
              <span>{warning}</span>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}

function MedicationsBody({ section }: { section: MedicationsSection }) {
  return (
    <div className="flex flex-col gap-2">
      {section.medications.map((med, i) => (
        <div key={i} className="medication-row">
          <span className="medication-row-icon" aria-hidden="true">
            <i className="fa-solid fa-pills" />
          </span>
          <div className="medication-row-details">
            <span className="medication-row-name">{med.name}</span>
            <span className="medication-row-dose">
              {med.dose} · {med.frequency}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function RiskFlagsBody({ section }: { section: RiskFlagsSection }) {
  return (
    <ul className="list-group list-group-flush">
      {section.flags.map((flag, i) => (
        <li key={i} className="list-group-item">
          <span className="list-group-item-content flex items-center gap-2 flex-wrap">
            <span className={`severity-badge severity-${flag.severity}`}>
              {flag.severity.charAt(0).toUpperCase() + flag.severity.slice(1)}
            </span>
            <span className="list-group-item-title">{flag.description}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

// ---------- Shared kv-table ----------

function KvTable({ rows }: { rows: Array<{ label: string; value: ReactNode }> }) {
  return (
    <table className="kv-table">
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            <td>{row.label}</td>
            <td>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
