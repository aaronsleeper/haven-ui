import type { Meta, StoryObj } from '@storybook/react';
import { AppShell } from './AppShell';

// Canonical visual baselines for `app-shell` in registry.json. Mirrors the
// responsive shell from layout-app-shell-responsive.html: sidebar at ≥lg,
// bottom-nav at <lg, persistent topbar across both, optional banner.
//
// Storybook viewports drive the breakpoint exercise — the shell switches via
// CSS lg: variants without runtime branching.

const meta: Meta<typeof AppShell> = {
  title: 'Layout/AppShell',
  component: AppShell,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof AppShell>;

const sidebar = (
  <>
    <div className="nav-header">
      <div className="nav-logo">
        <span className="font-serif text-lg text-sand-900">Cena Health</span>
      </div>
    </div>
    <div className="nav-section">
      <a href="#" className="nav-item active">
        <i className="fa-solid fa-house" aria-hidden="true" />
        <span>Dashboard</span>
      </a>
      <a href="#" className="nav-item">
        <i className="fa-solid fa-heart-pulse" aria-hidden="true" />
        <span>My Health</span>
      </a>
      <a href="#" className="nav-item">
        <i className="fa-solid fa-message" aria-hidden="true" />
        <span>Messages</span>
        <span className="nav-badge" aria-label="1 unread">1</span>
      </a>
      <a href="#" className="nav-item">
        <i className="fa-solid fa-stethoscope" aria-hidden="true" />
        <span>Care</span>
      </a>
      <a href="#" className="nav-item">
        <i className="fa-solid fa-gear" aria-hidden="true" />
        <span>Settings</span>
      </a>
    </div>
  </>
);

const topBar = (
  <>
    <span className="font-serif text-base text-sand-900 lg:hidden">Cena Health</span>
    <span className="hidden lg:inline-block" aria-hidden="true" />
    <div role="radiogroup" aria-label="Language" className="flex gap-1">
      <button type="button" role="radio" aria-checked="true" className="mobile-i18n-toggle">EN</button>
      <button type="button" role="radio" aria-checked="false" className="mobile-i18n-toggle">ES</button>
    </div>
  </>
);

const bottomNav = (
  <nav className="mobile-bottom-nav" aria-label="Primary">
    <a href="#" className="mobile-bottom-nav-tab active">
      <i className="fa-solid fa-house" aria-hidden="true" />
      <span>Dashboard</span>
    </a>
    <a href="#" className="mobile-bottom-nav-tab">
      <i className="fa-solid fa-heart-pulse" aria-hidden="true" />
      <span>My Health</span>
    </a>
    <a href="#" className="mobile-bottom-nav-tab">
      <span className="relative">
        <i className="fa-solid fa-message" aria-hidden="true" />
        <span className="nav-badge" aria-label="1 unread">1</span>
      </span>
      <span>Messages</span>
    </a>
    <a href="#" className="mobile-bottom-nav-tab">
      <i className="fa-solid fa-stethoscope" aria-hidden="true" />
      <span>Care</span>
    </a>
    <a href="#" className="mobile-bottom-nav-tab">
      <i className="fa-solid fa-gear" aria-hidden="true" />
      <span>Settings</span>
    </a>
  </nav>
);

const screenContent = (
  <div className="p-4">
    <h1 className="page-title">Welcome back, Maria</h1>
    <p className="text-sm text-sand-500 mt-1">
      Route content renders here. Constrained to --app-shell-content-max-w (48rem default).
    </p>
  </div>
);

export const Default: Story = {
  render: () => (
    <AppShell topBar={topBar} sidebar={sidebar} bottomNav={bottomNav}>
      {screenContent}
    </AppShell>
  ),
};

export const WithBanner: Story = {
  render: () => (
    <AppShell
      topBar={topBar}
      sidebar={sidebar}
      bottomNav={bottomNav}
      banner={
        <div className="bg-warning-100 text-warning-900 px-4 py-2 text-sm">
          You are offline. Showing last-known data.
        </div>
      }
    >
      {screenContent}
    </AppShell>
  ),
};

export const NoNav: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Full-screen experiences (onboarding stepper, assessment) suppress sidebar + bottom-nav. Topbar may stay for language toggle.',
      },
    },
  },
  render: () => (
    <AppShell topBar={topBar}>
      <div className="p-4">
        <h1 className="page-title">Welcome to Cena Health</h1>
        <p className="text-sm text-sand-500 mt-1">
          Onboarding step 1 of 3. Sidebar + bottom-nav suppressed.
        </p>
      </div>
    </AppShell>
  ),
};
