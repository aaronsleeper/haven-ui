import type { AvatarProps, AvatarSize, AvatarColor } from './Avatar.props';

export type { AvatarProps, AvatarSize, AvatarColor } from './Avatar.props';

// Mirror of packages/design-system/pattern-library/components/avatar.html.
// Base .avatar is 40px (md) with primary color. Size + color are optional
// modifier classes composed onto the base class, matching the PL authoring.

const SIZE_CLASS: Record<AvatarSize, string> = {
  xs: 'avatar-xs',
  sm: 'avatar-sm',
  md: '',
  lg: 'avatar-lg',
  xl: 'avatar-xl',
};

const COLOR_CLASS: Record<AvatarColor, string> = {
  primary: '',
  secondary: 'avatar-secondary',
  neutral: 'avatar-neutral',
};

export function Avatar({ size = 'md', color = 'primary', alt, children }: AvatarProps) {
  const cls = ['avatar', SIZE_CLASS[size], COLOR_CLASS[color]].filter(Boolean).join(' ');
  return (
    <span className={cls} aria-label={alt}>
      {children}
    </span>
  );
}
