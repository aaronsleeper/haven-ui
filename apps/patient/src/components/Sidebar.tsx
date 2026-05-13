// apps/patient/src/components/Sidebar.tsx
// Desktop vertical nav for the patient app. Mirror of BottomNav, same nav-item
// set (sourced from nav-items.ts), rendered as a vertical list inside the
// AppShell's app-shell-sidebar region.
//
// Uses pattern-library `sidebar-nav-list` + `sidebar-nav-item` semantic classes
// from layout-app-shell.html. Brand mark at top; nav items below; sign-off /
// footer reserved for future use.

import { NavLink } from 'react-router-dom';
import logoSrc from '../assets/logo-cenahealth-teal.svg';
import { PATIENT_NAV_ITEMS } from './nav-items';
import type { Language } from '../lib/useLanguage';

interface SidebarProps {
  lang: Language;
  unreadCount?: number;
}

export function Sidebar({ lang, unreadCount = 0 }: SidebarProps) {
  return (
    <>
      <div className="px-4 pt-6 pb-4 border-b border-sand-200">
        <img src={logoSrc} alt="Cena Health" className="h-7 w-auto" />
      </div>
      <nav className="px-2 py-4 flex-1" aria-label="Primary">
        <ul className="sidebar-nav-list">
          {PATIENT_NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'
                }
              >
                <span className="relative inline-flex items-center justify-center">
                  <i className={`fa-solid ${item.icon} fa-fw`} aria-hidden="true" />
                  {item.to === '/messages' && unreadCount > 0 && (
                    <span
                      className="mobile-bottom-nav-badge"
                      aria-label={`${unreadCount} unread messages`}
                    >
                      {unreadCount}
                    </span>
                  )}
                </span>
                <span>{lang === 'es' ? item.labelEs : item.labelEn}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
