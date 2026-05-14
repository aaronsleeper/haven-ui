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

// ----------------------------------------------------------------------------
// Meal ordering — this week's menu + pre-selected cart
//
// Canonical source for the /meals screen per the meal-ordering wireframes
// (`Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/wireframes/meal-ordering.*.mdoc`).
//
// Shape: 14 meal options published for the week (per cap-17 May 6 decision —
// "show all 14 meals"). Pre-selected cart simulates Maria's state-read in
// Step 2 of the flow: "I started a list based on what worked for you last
// time." Patient can edit (qty up/down, add/remove) until submit.
//
// Budget cap is $200/week per UConn contract Ex B.B.a.ii (cap-18 / cap-40).
// ----------------------------------------------------------------------------

export const BUDGET_CAP = 200;

export type MealTagVariant = 'info' | 'secondary' | 'neutral';

export interface MealTag {
  variant: MealTagVariant;
  label: { en: string; es: string };
}

export interface MealOption {
  id: string;
  name: { en: string; es: string };
  description: { en: string; es: string };
  /** Patient-facing price per portion (Cena markup already applied — kitchen cost is invisible). */
  price: number;
  tags: MealTag[];
  /** Picked-for-you per care-plan + history. Renders the leading `badge-primary` recommended badge. */
  recommended: boolean;
}

const T = (en: string, es: string, variant: MealTagVariant = 'info'): MealTag => ({
  variant,
  label: { en, es },
});

export const THIS_WEEK_MENU: MealOption[] = [
  {
    id: 'pollo-verde',
    name: { en: 'Chicken Verde', es: 'Pollo Verde' },
    description: { en: 'Tomatillo-braised chicken with cilantro rice and pinto beans.', es: 'Pollo en salsa de tomatillo con arroz al cilantro y frijoles pintos.' },
    price: 12.5,
    tags: [T('Low sodium', 'Bajo en sodio'), T('Diabetic-friendly', 'Para diabetes', 'secondary')],
    recommended: true,
  },
  {
    id: 'sopa-lentejas',
    name: { en: 'Sopa de Lentejas con Verduras', es: 'Sopa de Lentejas con Verduras' },
    description: { en: 'Lentil soup with carrots, celery, and warm spices.', es: 'Sopa de lentejas con zanahoria, apio y especias suaves.' },
    price: 11.0,
    tags: [T('Low sodium', 'Bajo en sodio'), T('Vegetarian', 'Vegetariano', 'neutral'), T('Diabetic-friendly', 'Para diabetes', 'secondary')],
    recommended: true,
  },
  {
    id: 'salmon-limon',
    name: { en: 'Lemon Salmon', es: 'Salmón al limón' },
    description: { en: 'Roasted salmon with quinoa and lemon-herb broccoli.', es: 'Salmón al horno con quinoa y brócoli al limón y hierbas.' },
    price: 14.5,
    tags: [T('Heart-healthy', 'Saludable para el corazón'), T('Diabetic-friendly', 'Para diabetes', 'secondary')],
    recommended: true,
  },
  {
    id: 'pollo-horno',
    name: { en: 'Pollo al Horno con Calabaza', es: 'Pollo al Horno con Calabaza' },
    description: { en: 'Roasted chicken thighs with butternut squash and brown rice.', es: 'Muslos de pollo al horno con calabaza y arroz integral.' },
    price: 12.5,
    tags: [T('Low sodium', 'Bajo en sodio'), T('Diabetic-friendly', 'Para diabetes', 'secondary')],
    recommended: true,
  },
  {
    id: 'turkey-chili',
    name: { en: 'Turkey Chili', es: 'Chili de pavo' },
    description: { en: 'Slow-cooked ground turkey, black beans, and tomatoes over rice.', es: 'Pavo molido cocinado lentamente con frijoles negros y tomate sobre arroz.' },
    price: 11.5,
    tags: [T('High protein', 'Alto en proteína'), T('Low sodium', 'Bajo en sodio'), T('Diabetic-friendly', 'Para diabetes', 'secondary')],
    recommended: true,
  },
  {
    id: 'tofu-noodle',
    name: { en: 'Tofu Noodle Bowl', es: 'Tazón de Fideos con Tofu' },
    description: { en: 'Soba noodles with ginger-soy tofu, edamame, and scallions.', es: 'Fideos soba con tofu al jengibre y soya, edamame y cebolla verde.' },
    price: 12.0,
    tags: [T('Vegetarian', 'Vegetariano', 'neutral'), T('High protein', 'Alto en proteína')],
    recommended: false,
  },
  {
    id: 'arroz-pollo',
    name: { en: 'Arroz con Pollo', es: 'Arroz con Pollo' },
    description: { en: 'Saffron-tinted rice with chicken, peas, and bell peppers.', es: 'Arroz con azafrán, pollo, guisantes y pimientos.' },
    price: 12.0,
    tags: [T('Low sodium', 'Bajo en sodio'), T('Diabetic-friendly', 'Para diabetes', 'secondary')],
    recommended: true,
  },
  {
    id: 'pescado-veracruz',
    name: { en: 'Pescado a la Veracruzana', es: 'Pescado a la Veracruzana' },
    description: { en: 'White fish in tomato-olive sauce with rice and plantains.', es: 'Pescado blanco en salsa de tomate y aceitunas con arroz y plátanos.' },
    price: 13.5,
    tags: [T('Heart-healthy', 'Saludable para el corazón'), T('Low sodium', 'Bajo en sodio')],
    recommended: false,
  },
  {
    id: 'frijoles-arroz',
    name: { en: 'Frijoles Negros con Arroz', es: 'Frijoles Negros con Arroz' },
    description: { en: 'Black beans with brown rice, sofrito, and avocado.', es: 'Frijoles negros con arroz integral, sofrito y aguacate.' },
    price: 10.5,
    tags: [T('Vegetarian', 'Vegetariano', 'neutral'), T('High protein', 'Alto en proteína'), T('Diabetic-friendly', 'Para diabetes', 'secondary')],
    recommended: false,
  },
  {
    id: 'ensalada-pollo',
    name: { en: 'Grilled Chicken Salad', es: 'Ensalada de Pollo a la Parrilla' },
    description: { en: 'Mixed greens with grilled chicken, tomato, cucumber, and a lime vinaigrette.', es: 'Mezcla de verdes con pollo a la parrilla, tomate, pepino y vinagreta de limón.' },
    price: 11.0,
    tags: [T('Low sodium', 'Bajo en sodio'), T('Diabetic-friendly', 'Para diabetes', 'secondary')],
    recommended: false,
  },
  {
    id: 'sopa-pollo',
    name: { en: 'Sopa de Pollo', es: 'Sopa de Pollo' },
    description: { en: 'Chicken soup with carrots, celery, and rice — gentle on digestion.', es: 'Sopa de pollo con zanahoria, apio y arroz — suave para la digestión.' },
    price: 10.5,
    tags: [T('Low sodium', 'Bajo en sodio')],
    recommended: false,
  },
  {
    id: 'pavo-arroz',
    name: { en: 'Ground Turkey & Rice Bowl', es: 'Tazón de Pavo Molido con Arroz' },
    description: { en: 'Seasoned ground turkey over brown rice with sautéed peppers.', es: 'Pavo molido sazonado sobre arroz integral con pimientos salteados.' },
    price: 11.5,
    tags: [T('High protein', 'Alto en proteína'), T('Diabetic-friendly', 'Para diabetes', 'secondary')],
    recommended: false,
  },
  {
    id: 'salmon-yuca',
    name: { en: 'Salmon with Yuca', es: 'Salmón con Yuca' },
    description: { en: 'Pan-seared salmon, boiled yuca with mojo sauce, and side greens.', es: 'Salmón a la sartén con yuca hervida y mojo, y verduras.' },
    price: 14.0,
    tags: [T('Heart-healthy', 'Saludable para el corazón')],
    recommended: false,
  },
  {
    id: 'pollo-curry',
    name: { en: 'Coconut Curry Chicken', es: 'Pollo al Curry de Coco' },
    description: { en: 'Mildly spiced chicken in coconut milk with jasmine rice.', es: 'Pollo en leche de coco con un toque de curry y arroz jazmín.' },
    price: 12.5,
    tags: [T('Low sodium', 'Bajo en sodio')],
    recommended: false,
  },
];

/**
 * Pre-selected items the agent prepared for Maria this week, simulating the
 * Step-2 state-read: "I started a list based on what worked for you last time."
 * Patient enters /meals with this cart populated; can edit before submit.
 */
export const PRE_SELECTED_CART: Array<{ mealId: string; qty: number }> = [
  { mealId: 'pollo-verde', qty: 1 },
  { mealId: 'sopa-lentejas', qty: 2 },
  { mealId: 'salmon-limon', qty: 1 },
  { mealId: 'pollo-horno', qty: 1 },
  { mealId: 'turkey-chili', qty: 1 },
  { mealId: 'arroz-pollo', qty: 1 },
];

/** Localstorage key for the demo's persisted cart state — survives reloads
 *  so Dieckhaus can navigate away and back without losing the simulated state. */
export const MEAL_ORDER_STATE_KEY = 'cena-demo-meal-order';
