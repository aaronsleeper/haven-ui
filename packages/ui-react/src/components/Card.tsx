import type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardSubtitleProps,
  CardBodyProps,
  CardFooterProps,
} from './Card.props';

export type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardSubtitleProps,
  CardBodyProps,
  CardFooterProps,
} from './Card.props';

// Mirror of packages/design-system/pattern-library/components/layout-card.html.
// Default container primitive. card-title is semantic + visual — pair it with
// card-header (standard) or place it directly inside card-body (title-in-body
// variant where the divider pulls to card edges per layout-card.html notes).
// Radius is rounded-md per DESIGN.md §Card canon (Patch 19).

function cx(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export function Card({ children, className }: CardProps) {
  return <div className={cx('card', className)}>{children}</div>;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return <div className={cx('card-header', className)}>{children}</div>;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return <h3 className={cx('card-title', className)}>{children}</h3>;
}

export function CardSubtitle({ children, className }: CardSubtitleProps) {
  return <p className={cx('card-subtitle', className)}>{children}</p>;
}

export function CardBody({ children, className }: CardBodyProps) {
  return <div className={cx('card-body', className)}>{children}</div>;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return <div className={cx('card-footer', className)}>{children}</div>;
}
