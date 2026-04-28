// Care plan fixtures for the cc-05 viewer slice.
//
// Shape decisions (Frontend Architecture verdict 2026-04-27):
// - Keyed by patientId (queue entries are transient; patients outlive queue
//   trips). Adapter resolves entryId → patientId so call sites stay
//   mechanical when the eventual data layer lands.
// - Single CarePlan interface + CarePlanSection discriminated union for the
//   eight section bodies. cc-04 (referrals) and cc-07 (patient records) are
//   sibling record types — they get their own files when they ship, not
//   variants of CarePlan.
// - Edit mutations live as a `carePlanOverrides` slice in App.tsx, parallel
//   to threadOverrides (cross-pane state).
//
// Const maps (Design System Steward verdict 2026-04-27):
// - SectionStatus enumerates the four approval states; STATUS_BADGE_VARIANT
//   maps to badge tokens so app code never picks a variant ad-hoc.
// - SectionType enumerates the eight section keys so the section-status-bar
//   lookup is type-safe (prevents typo-driven silent breaks).

import type { ReactNode } from 'react';

// ---------- Patient stub ----------
// Minimum-surface shape that the eventual data layer hangs on. When the
// real patient record lands, this widens to include demographics, insurance,
// etc. — for now the queue entry resolves to {id, name}.
export interface Patient {
  id: string;
  name: string;
}

// ---------- Section type + status enums ----------
export type SectionType =
  | 'goals'
  | 'nutrition'
  | 'behavioral-health'
  | 'visit-schedule'
  | 'monitoring'
  | 'meal-delivery'
  | 'medications'
  | 'risk-flags';

export const SECTION_LABELS: Record<SectionType, string> = {
  'goals': 'Goals',
  'nutrition': 'Nutrition Plan',
  'behavioral-health': 'Behavioral Health',
  'visit-schedule': 'Visit Schedule',
  'monitoring': 'Monitoring',
  'meal-delivery': 'Meal Delivery',
  'medications': 'Medications',
  'risk-flags': 'Risk Flags',
};

/** Approval state for a single section. */
export type SectionStatus =
  | 'clinician-approved'   // RDN/BHN signed off — read-only, default collapsed
  | 'coordinator-pending'  // coordinator-owned — editable, default expanded
  | 'auto-populated'       // imported / auto-derived — read-only, default collapsed
  | 'system-error';        // gate failed (e.g. missing clinician approval)

/** Badge variant per status. App code maps via this — never picks ad-hoc. */
export const STATUS_BADGE_VARIANT: Record<SectionStatus, 'success' | 'warning' | 'neutral' | 'error'> = {
  'clinician-approved': 'success',
  'coordinator-pending': 'warning',
  'auto-populated': 'neutral',
  'system-error': 'error',
};

/** Whether a section is editable by the coordinator. */
export function isEditable(status: SectionStatus): boolean {
  return status === 'coordinator-pending';
}

// ---------- Section discriminated union ----------
interface BaseSection {
  type: SectionType;
  status: SectionStatus;
  /** Optional approval byline rendered next to the status badge. */
  approvalLabel?: string;
}

export interface GoalsSection extends BaseSection {
  type: 'goals';
  goals: string[];
}

export interface NutritionSection extends BaseSection {
  type: 'nutrition';
  rows: Array<{ label: string; value: ReactNode }>;
  /** Optional editor's note rendered as italic gray below the kv-table. */
  editNote?: string;
}

export interface BehavioralHealthSection extends BaseSection {
  type: 'behavioral-health';
  rows: Array<{ label: string; value: ReactNode }>;
  note?: string;
}

export interface VisitScheduleSection extends BaseSection {
  type: 'visit-schedule';
  visits: Array<{
    visitType: string;
    cadence: string;
    firstVisit: string;
    warning?: string;
  }>;
}

export interface MonitoringSection extends BaseSection {
  type: 'monitoring';
  items: Array<{ label: string; method: string }>;
}

export interface MealDeliverySection extends BaseSection {
  type: 'meal-delivery';
  rows: Array<{ label: string; value: ReactNode }>;
  warnings?: string[];
}

export interface MedicationsSection extends BaseSection {
  type: 'medications';
  medications: Array<{ name: string; dose: string; frequency: string }>;
}

export interface RiskFlagsSection extends BaseSection {
  type: 'risk-flags';
  flags: Array<{ severity: 'high' | 'medium' | 'low'; description: string }>;
}

export type CarePlanSection =
  | GoalsSection
  | NutritionSection
  | BehavioralHealthSection
  | VisitScheduleSection
  | MonitoringSection
  | MealDeliverySection
  | MedicationsSection
  | RiskFlagsSection;

// ---------- Care plan envelope ----------
export interface CarePlan {
  patientId: string;
  version: string;
  /** Free-text status label rendered in the record header. */
  recordStatusLabel: string;
  recordStatusVariant: 'success' | 'warning' | 'neutral' | 'error';
  /** Free-text meta rendered below the status badge. */
  meta: string;
  sections: CarePlanSection[];
}

// ---------- Patient + plan fixtures ----------
const mariaRivera: Patient = {
  id: 'p-maria-rivera',
  name: 'Maria Rivera',
};

const mariaCarePlan: CarePlan = {
  patientId: mariaRivera.id,
  version: 'v1.0',
  recordStatusLabel: 'Coordinator Review',
  recordStatusVariant: 'warning',
  meta: 'Created Mar 26, 2026',
  sections: [
    {
      type: 'goals',
      status: 'clinician-approved',
      approvalLabel: 'RDN approved · Mar 26',
      goals: [
        'HbA1c < 8.0% within 6 months',
        'Weight loss 5–8% within 6 months',
        'PHQ-9 score < 10 within 3 months',
      ],
    },
    {
      type: 'nutrition',
      status: 'clinician-approved',
      approvalLabel: 'RDN approved · Mar 26',
      rows: [
        { label: 'Calories', value: '1600–1800 cal/day' },
        { label: 'Sodium', value: '< 1800mg' },
        { label: 'Diet type', value: 'Diabetic-appropriate' },
        { label: 'Allergens', value: 'Nut-free' },
        { label: 'Special instructions', value: 'Latin-inspired preferences' },
      ],
      editNote: 'RDN adjusted sodium from 2300mg to 1800mg.',
    },
    {
      type: 'behavioral-health',
      status: 'auto-populated',
      approvalLabel: 'Auto-populated (PHQ-9: 7)',
      rows: [
        { label: 'PHQ-9 score', value: '7' },
        { label: 'GAD-7 score', value: '4' },
        { label: 'BHN session cadence', value: 'None scheduled' },
        { label: 'Crisis protocol', value: 'Standard' },
      ],
      note: 'BHN notified for awareness. Formal review not required.',
    },
    {
      type: 'visit-schedule',
      status: 'coordinator-pending',
      approvalLabel: 'Coordinator review',
      visits: [
        { visitType: 'RDN initial', cadence: 'One-time', firstVisit: 'Within 7 days' },
        { visitType: 'RDN follow-up', cadence: 'Monthly', firstVisit: 'Apr 30' },
        { visitType: 'BHN initial', cadence: 'One-time', firstVisit: 'Within 14 days' },
        { visitType: 'BHN follow-up', cadence: 'Monthly', firstVisit: 'May 15' },
        { visitType: 'AVA wellness call', cadence: 'Weekly', firstVisit: 'After RDN initial' },
      ],
    },
    {
      type: 'monitoring',
      status: 'coordinator-pending',
      approvalLabel: 'Coordinator review',
      items: [
        { label: 'AVA weekly wellness calls', method: 'Voice' },
        { label: 'PHQ-9 monthly', method: 'AVA' },
        { label: 'Weight self-report weekly', method: 'Patient app' },
        { label: 'HbA1c every 3 months', method: 'Lab' },
        { label: 'Lipid panel every 6 months', method: 'Lab' },
      ],
    },
    {
      type: 'meal-delivery',
      status: 'coordinator-pending',
      approvalLabel: 'Coordinator review',
      rows: [
        { label: 'Meals per week', value: '14 (2/day)' },
        { label: 'Delivery days', value: 'Monday, Thursday' },
        { label: 'Delivery address', value: '123 Main St, Hartford, CT 06103' },
        { label: 'Format', value: 'Frozen (patient preference)' },
        { label: 'Dietary tags', value: 'Low-sodium, diabetic-appropriate, nut-free' },
      ],
    },
    {
      type: 'medications',
      status: 'auto-populated',
      approvalLabel: 'Imported from EHR',
      medications: [
        { name: 'Metformin', dose: '1000mg', frequency: 'Twice daily' },
        { name: 'Lisinopril', dose: '10mg', frequency: 'Once daily' },
        { name: 'Atorvastatin', dose: '20mg', frequency: 'Once daily at bedtime' },
      ],
    },
    {
      type: 'risk-flags',
      status: 'auto-populated',
      approvalLabel: 'Auto-populated',
      flags: [
        { severity: 'high', description: 'SDOH risk: 3 — food insecurity, transportation barriers' },
        { severity: 'medium', description: 'Medication adherence — first time on Metformin' },
      ],
    },
  ],
};

// ---------- Lookup tables ----------
const PATIENTS_BY_ID: Record<string, Patient> = {
  [mariaRivera.id]: mariaRivera,
};

const CARE_PLANS_BY_PATIENT_ID: Record<string, CarePlan> = {
  [mariaRivera.id]: mariaCarePlan,
};

/** Queue-entry → patient resolver. The eventual data layer replaces this
 *  with a real lookup; for now, only Maria's queue entry has a care plan. */
const ENTRY_TO_PATIENT_ID: Record<string, string> = {
  'q-maria-rivera': mariaRivera.id,
};

// ---------- Public API ----------
export function getCarePlanForPatient(patientId: string): CarePlan | undefined {
  return CARE_PLANS_BY_PATIENT_ID[patientId];
}

export function getPatient(patientId: string): Patient | undefined {
  return PATIENTS_BY_ID[patientId];
}

/** Adapter: resolve a queue entry to its patient's current care plan.
 *  App.tsx calls this with `activeEntry.id` so the call site doesn't need
 *  to know about the patient seam yet. */
export function getCarePlanForEntry(entryId: string): CarePlan | undefined {
  const patientId = ENTRY_TO_PATIENT_ID[entryId];
  if (!patientId) return undefined;
  return CARE_PLANS_BY_PATIENT_ID[patientId];
}

export function getPatientForEntry(entryId: string): Patient | undefined {
  const patientId = ENTRY_TO_PATIENT_ID[entryId];
  if (!patientId) return undefined;
  return PATIENTS_BY_ID[patientId];
}
