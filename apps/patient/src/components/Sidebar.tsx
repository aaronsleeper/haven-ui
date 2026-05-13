// apps/patient/src/components/Sidebar.tsx
// Desktop vertical nav for the patient app. 1:1 mirror of the canonical PL
// sidebar fragment from layout-app-shell-responsive.html: .nav-header +
// .nav-logo + .nav-section + .nav-item (shared with .panel-nav agentic shell
// per DESIGN.md §Voice — active state is font-bold + teal-700, no background).
//
// Renders into the AppShell's .app-shell-sidebar region. NavLink replaces the
// PL's <a> element for client-side routing; class names and structure are
// otherwise identical so future PL updates flow through cleanly.

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
      <div className="nav-header">
        <div className="nav-logo">
          <img src={logoSrc} alt="Cena Health" />
        </div>
      </div>
      <div className="nav-section">
        {PATIENT_NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              isActive ? 'nav-item active' : 'nav-item'
            }
          >
            <i className={`fa-solid ${item.icon}`} aria-hidden="true" />
            <span>{lang === 'es' ? item.labelEs : item.labelEn}</span>
            {item.to === '/messages' && unreadCount > 0 && (
              <span
                className="mobile-bottom-nav-badge"
                aria-label={`${unreadCount} unread messages`}
              >
                {unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </>
  );
}
