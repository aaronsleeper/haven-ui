import type { ReactNode } from 'react';

// Prop schema for Avatar. Mirror of
// packages/design-system/pattern-library/components/avatar.html.

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarColor = 'primary' | 'secondary' | 'neutral';

export interface AvatarProps {
  /** Size modifier — md is the base .avatar (no modifier class). Default 'md'. */
  size?: AvatarSize;
  /** Color variant — default primary per the base .avatar rule. */
  color?: AvatarColor;
  /** Accessible label for screen readers when the avatar contains only an image or icon. */
  alt?: string;
  /**
   * Avatar contents: initials (string), an <img class="avatar-img">, or an
   * <i class="fa-* avatar-icon">. Authored by the caller because the PL HTML
   * uses any of three shapes.
   */
  children: ReactNode;
}
