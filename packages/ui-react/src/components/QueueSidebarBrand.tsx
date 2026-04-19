import logoSrc from '../assets/logo-cenahealth-teal.svg';

// Mirror of the <header class="queue-sidebar-brand"> block in
// packages/design-system/pattern-library/components/queue-sidebar.html

export interface QueueSidebarBrandProps {
  className?: string;
  /** Override the image alt text. Defaults to "Cena Health". */
  alt?: string;
}

export function QueueSidebarBrand({
  className = '',
  alt = 'Cena Health',
}: QueueSidebarBrandProps = {}) {
  const classes = ['queue-sidebar-brand', className].filter(Boolean).join(' ');
  return (
    <header className={classes}>
      <img src={logoSrc} alt={alt} className="queue-sidebar-brand-logo" />
    </header>
  );
}
