// apps/patient/src/components/BottomNav.tsx
// 5-tab horizontal nav for the patient app, rendered inside the AppShell's
// app-shell-bottom-nav region (<lg breakpoint).
// Active tab determined by current route path. Language-aware tab labels.
// Nav items sourced from nav-items.ts so BottomNav (mobile) and Sidebar
// (desktop) share one source of truth.

import { NavLink } from 'react-router-dom';
import { PATIENT_NAV_ITEMS } from './nav-items';
import type { Language } from '../lib/useLanguage';

interface BottomNavProps {
  lang: Language;
  unreadCount?: number;
}

export function BottomNav({ lang, unreadCount = 0 }: BottomNavProps) {
  return (
    <nav className="mobile-bottom-nav" aria-label="Primary">
      {PATIENT_NAV_ITEMS.map((tab) => (
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
              <span className="nav-badge" aria-label={`${unreadCount} unread messages`}>
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
