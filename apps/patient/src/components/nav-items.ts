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

// `icon` is a Material Symbols Outlined glyph name.
export const PATIENT_NAV_ITEMS: readonly NavItem[] = [
  { to: '/',         icon: 'home',           labelEn: 'Dashboard', labelEs: 'Inicio',    end: true  },
  { to: '/health',   icon: 'monitor_heart',  labelEn: 'My Health', labelEs: 'Mi Salud',  end: false },
  { to: '/meals',    icon: 'lunch_dining',   labelEn: 'Meals',     labelEs: 'Comidas',   end: false },
  { to: '/messages', icon: 'chat',           labelEn: 'Messages',  labelEs: 'Mensajes',  end: false },
  { to: '/care',     icon: 'stethoscope',    labelEn: 'Care',      labelEs: 'Cuidado',   end: false },
  { to: '/settings', icon: 'settings',       labelEn: 'Settings',  labelEs: 'Ajustes',   end: false },
] as const;
