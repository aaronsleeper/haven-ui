import type { RecordHeaderProps } from './RecordHeader.props';

export type { RecordHeaderProps } from './RecordHeader.props';

// Mirror of packages/design-system/pattern-library/components/layout-record-header.html.
// Identity bar at the top of a center-pane record (referral, care plan, care
// plan diff, patient record). Title carries Haven brand via Lora display per
// DESIGN.md §Typography. Classes track components.css; do not edit class
// attributes here without also editing the pattern-library HTML.

function cx(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export function RecordHeader({
  title,
  subtitle,
  trailing,
  meta,
  className,
}: RecordHeaderProps) {
  return (
    <header className={cx('record-header', className)}>
      <div className="record-header-main">
        <h2 className="record-header-title">{title}</h2>
        {subtitle ? <p className="record-header-subtitle">{subtitle}</p> : null}
      </div>
      {trailing || meta ? (
        <div className="record-header-trailing">
          {trailing}
          {meta ? <span className="record-header-meta">{meta}</span> : null}
        </div>
      ) : null}
    </header>
  );
}
