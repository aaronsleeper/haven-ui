// apps/patient/src/components/Sidebar.tsx
// Desktop vertical nav for the patient app. 1:1 mirror of the canonical PL
// sidebar fragment from layout-app-shell-responsive.html: .nav-header +
// .nav-logo + .nav-section + .nav-item (the same canonical nav family used
// by .panel-nav in the agentic shell). Active state = font-bold + teal-700
// per DESIGN.md §Voice.
//
// Renders into the AppShell's .app-shell-sidebar region (a <nav> landmark
// with aria-label="Primary"). Brand mark belongs WITH the nav at ≥lg; on
// mobile, the topbar shows the brand instead (I18nBar `lg:hidden` logo).

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
            <span className="material-symbols-outlined" aria-hidden="true">{item.icon}</span>
            <span>{lang === 'es' ? item.labelEs : item.labelEn}</span>
            {item.to === '/messages' && unreadCount > 0 && (
              <span
                className="nav-badge"
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
