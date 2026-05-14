// Demo patient data — connective tissue for the Dieckhaus demo (May 22, 2026).
//
// Single source of truth for:
//   - Maria Rivera persona + care team + dates anchored to demo day
//   - Bilingual copy (EN/ES) referenced across screens
//   - PENDING map: outstanding assets pending external confirmation
//
// Resolving a PENDING entry:
//   1. Edit `PENDING[key].value` with the confirmed value.
//   2. Run `pnpm --filter @haven/app-patient pending` to regenerate
//      `apps/patient/design/build/outstanding-assets.md`.
//   3. Once confirmed for ship, optionally remove the entry from PENDING and
//      inline the literal at consumer sites.

import type { Language } from './useLanguage';

// ----------------------------------------------------------------------------
// Outstanding assets
// ----------------------------------------------------------------------------

export type PendingCategory = 'staff' | 'clinical-copy' | 'data' | 'legal';

export interface PendingEntry {
  /** Current placeholder value used in the demo. */
  value: string;
  /** Who or what we're waiting on. */
  source: string;
  /** Short note on what needs confirming and why. */
  note: string;
  category: PendingCategory;
  /** Optional alternative value an expert flagged for consideration. */
  alt?: string;
}

export const PENDING = {
  coordinatorName: {
    value: 'Sarah Kim',
    source: 'Vanessa',
    note: 'staff name confirmation (also open in IRB sub-investigator prep)',
    category: 'staff',
  },
  clinicalLeadName: {
    value: 'Dr. Soto',
    source: 'Vanessa',
    note: 'staff name confirmation',
    category: 'staff',
  },
  movementGoalEn: {
    value: 'Walk 20 minutes most days',
    source: 'Vanessa or Dr. Soto',
    note: 'clinical-care expert recommends conservative version pending verification for sedentary 52F',
    category: 'clinical-copy',
    alt: 'Add 10 minutes of walking after dinner three times a week',
  },
  movementGoalEs: {
    value: 'Camine 20 minutos casi todos los días',
    source: 'Vanessa or Dr. Soto',
    note: 'clinical-care expert recommends conservative version pending verification for sedentary 52F',
    category: 'clinical-copy',
    alt: 'Agregue 10 minutos de caminata después de la cena tres veces a la semana',
  },
  hivVisibility: {
    value: '(not surfaced in patient copy)',
    source: 'Aaron / Vanessa',
    note: 'does Dieckhaus need HIV-explicit framing somewhere, or is the ART-metabolic-syndrome framing enough to signal his population?',
    category: 'clinical-copy',
  },
  careTeamPhone: {
    value: '(860) 555-1234',
    source: 'Vanessa',
    note: 'phone number for onboarding footer + care contact',
    category: 'data',
  },
  privacyUrl: {
    value: '/legal/privacy',
    source: 'legal',
    note: 'final URL pending legal review',
    category: 'legal',
  },
  termsUrl: {
    value: '/legal/terms',
    source: 'legal',
    note: 'final URL pending legal review',
    category: 'legal',
  },
} as const satisfies Record<string, PendingEntry>;

// ----------------------------------------------------------------------------
// Maria Rivera — patient
// ----------------------------------------------------------------------------

export const demoPatient = {
  firstName: { en: 'Maria', es: 'María' },
  lastName: 'Rivera',
  email: 'm.rivera@example.com',
  phone: '(555) 123-4567',
  preferredLang: 'es' as Language,
  city: 'Hartford, CT',
};

export function patientFullName(lang: Language): string {
  return `${demoPatient.firstName[lang]} ${demoPatient.lastName}`;
}

// ----------------------------------------------------------------------------
// Care team
// ----------------------------------------------------------------------------

export const demoCareTeam = {
  coordinator: {
    /** Full name used in formal contexts. Placeholder pending Vanessa. */
    name: PENDING.coordinatorName.value,
    /** Short name used in message-sender labels. */
    shortName: 'Sarah K.',
    role: {
      en: 'Care Coordinator (RN)',
      es: 'Coordinadora de cuidado (RN)',
    },
  },
  clinicalLead: {
    name: PENDING.clinicalLeadName.value,
    role: {
      en: 'Registered Dietitian Nutritionist',
      es: 'Nutricionista Dietista Registrada',
    },
  },
  phone: PENDING.careTeamPhone.value,
};

// ----------------------------------------------------------------------------
// Dates anchored to demo day Friday May 22, 2026
// ----------------------------------------------------------------------------

export const demoDates = {
  mealConfirmBy: {
    en: 'Wednesday, May 21 at 5pm',
    es: 'miércoles, 21 de mayo a las 5pm',
  },
  mealDeliveryDate: {
    en: 'Monday, May 25',
    es: 'lunes, 25 de mayo',
  },
  mealDeliveryShort: {
    en: 'Monday',
    es: 'lunes',
  },
  nextAppointmentDateTime: {
    en: 'Tuesday, May 27 · 10:00 AM',
    es: 'martes, 27 de mayo · 10:00 AM',
  },
  // ISO 8601 — used by message timestamps
  messageFromCoordinator: '2026-05-21T18:30:00Z',
  messageFromPatient: '2026-05-20T09:15:00Z',
  // Recent deliveries (last two weeks)
  recentDelivery1: {
    en: 'Monday, May 18',
    es: 'lunes, 18 de mayo',
  },
  recentDelivery2: {
    en: 'Monday, May 11',
    es: 'lunes, 11 de mayo',
  },
};

// ----------------------------------------------------------------------------
// Care plan — MNT-aligned (per nutrition + clinical-care synthesis 2026-05-13)
// Section title: "Your nutrition & wellness plan" — avoids implying parallel
// clinical care (clinical-care expert).
// ----------------------------------------------------------------------------

export const carePlanSectionTitle: Record<Language, string> = {
  en: 'Your nutrition & wellness plan',
  es: 'Su plan de nutrición y bienestar',
};

export const carePlanGoals: Record<Language, string[]> = {
  en: [
    'Eat your weekly Cena meals on schedule — this supports steady blood sugar and lipid management.',
    PENDING.movementGoalEn.value,
    "Send your weekly check-in so your team knows how you're feeling.",
  ],
  es: [
    'Coma sus comidas semanales de Cena según el horario — esto ayuda a mantener estables el azúcar en la sangre y los lípidos.',
    PENDING.movementGoalEs.value,
    'Envíe su revisión semanal para que su equipo sepa cómo se siente.',
  ],
};

// ----------------------------------------------------------------------------
// Demo message thread — Sarah ↔ Maria
//
// Brand-fidelity §Voice (observational warmth, specific not generic):
// Sarah's message connects to the Wednesday meal swap shown elsewhere in the
// demo, demonstrating attention to specifics without surfacing HIV.
// Patient-ops: "the app supports behavior, not re-disclosure."
// ----------------------------------------------------------------------------

export const demoMessageThread = {
  /** May 20, morning — Maria's earlier message. */
  patientEarlier: {
    en: 'Hi Sarah, I had to swap the Wednesday meal last week because the noodles were hard to digest. Would something with rice or potatoes work better?',
    es: 'Hola Sarah, tuve que cambiar la comida del miércoles la semana pasada porque los fideos fueron difíciles de digerir. ¿Algo con arroz o papas funcionaría mejor?',
  },
  /** May 21, evening — Sarah's reply Maria sees on dashboard cold-start. */
  coordinatorLatest: {
    en: "Thanks for telling me, Maria. I shifted Wednesday to Sopa de Lentejas with vegetables — easier on digestion and still on plan. Take a look this week and confirm by Wednesday at 5pm, or it'll auto-confirm.",
    es: 'Gracias por avisarme, María. Cambié el miércoles por Sopa de Lentejas con verduras — más fácil de digerir y dentro del plan. Échele un vistazo esta semana y confirme antes del miércoles a las 5pm, o se confirmará automáticamente.',
  },
};

// Localstorage key tracking whether the patient has replied to Sarah in this
// demo session. Used by Dashboard (to clear "New" pill) and Messages (to show
// the reply bubble in the thread).
export const MESSAGE_REPLY_KEY = 'cena-demo-message-replied';
