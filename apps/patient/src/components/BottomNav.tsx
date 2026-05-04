// apps/patient/src/components/BottomNav.tsx
// Persistent fixed-bottom 5-tab nav for the patient app.
// Uses `mobile-bottom-nav`, `mobile-bottom-nav-tab`, `mobile-bottom-nav-badge` classes.
// Active tab determined by current route path. Language-aware tab labels.

import { NavLink } from 'react-router-dom';
import type { Language } from '../lib/useLanguage';

interface BottomNavProps {
  lang: Language;
  unreadCount?: number;
}

const tabs = [
  { to: '/',         icon: 'fa-house',        labelEn: 'Dashboard', labelEs: 'Inicio',    end: true },
  { to: '/health',   icon: 'fa-heart-pulse',  labelEn: 'My Health', labelEs: 'Mi Salud',  end: false },
  { to: '/messages', icon: 'fa-message',      labelEn: 'Messages',  labelEs: 'Mensajes',  end: false },
  { to: '/care',     icon: 'fa-stethoscope',  labelEn: 'Care',      labelEs: 'Cuidado',   end: false },
  { to: '/settings', icon: 'fa-gear',         labelEn: 'Settings',  labelEs: 'Ajustes',   end: false },
] as const;

export function BottomNav({ lang, unreadCount = 0 }: BottomNavProps) {
  return (
    <nav className="mobile-bottom-nav" aria-label="Main navigation">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            isActive ? 'mobile-bottom-nav-tab active' : 'mobile-bottom-nav-tab'
          }
        >
          <span className="relative">
            <i className={`fa-solid ${tab.icon}`} aria-hidden="true" />
            {tab.to === '/messages' && unreadCount > 0 && (
              <span className="mobile-bottom-nav-badge" aria-label={`${unreadCount} unread messages`}>
                {unreadCount}
              </span>
            )}
          </span>
          <span>{lang === 'es' ? tab.labelEs : tab.labelEn}</span>
        </NavLink>
      ))}
    </nav>
  );
}
