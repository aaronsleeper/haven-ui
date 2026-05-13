// Shared nav-item set for the patient app. Authored once; consumed by
// BottomNav (mobile) and Sidebar (desktop). Order is the source of truth
// for tab order across both renderings.

export interface NavItem {
  to: string;
  icon: string;
  labelEn: string;
  labelEs: string;
  end: boolean;
}

export const PATIENT_NAV_ITEMS: readonly NavItem[] = [
  { to: '/',         icon: 'fa-house',        labelEn: 'Dashboard', labelEs: 'Inicio',    end: true  },
  { to: '/health',   icon: 'fa-heart-pulse',  labelEn: 'My Health', labelEs: 'Mi Salud',  end: false },
  { to: '/messages', icon: 'fa-message',      labelEn: 'Messages',  labelEs: 'Mensajes',  end: false },
  { to: '/care',     icon: 'fa-stethoscope',  labelEn: 'Care',      labelEs: 'Cuidado',   end: false },
  { to: '/settings', icon: 'fa-gear',         labelEn: 'Settings',  labelEs: 'Ajustes',   end: false },
] as const;
